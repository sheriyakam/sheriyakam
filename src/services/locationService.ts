/**
 * locationService.ts
 * Zero-Cost Geocoding, PIN Auto-Fill & Road ETA Routing
 * Designed for Kerala & Mahe on-demand dispatch to minimize Google Maps SDK billing.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchWithTimeout } from './fetchWithTimeout';

export interface PinLocalityResult {
  pincode: string;
  district: string;
  taluk: string;
  state: string;
  postOffices: string[];
}

export interface ReverseGeocodeResult {
  formattedAddress: string;
  locality?: string;
  suburb?: string;
  city?: string;
  district?: string;
  state?: string;
  pincode?: string;
}

export interface RouteEtaResult {
  distanceKm: number;
  durationMinutes: number;
  isFallback: boolean;
}

// In-memory caches for zero latency repeat lookups during user sessions
const pinMemoryCache = new Map<string, PinLocalityResult>();
const reverseGeocodeMemoryCache = new Map<string, ReverseGeocodeResult>();
const routeEtaMemoryCache = new Map<string, RouteEtaResult>();

const STORAGE_KEY_PIN_PREFIX = '@sheriyakam_pin_cache_';
const STORAGE_KEY_GEO_PREFIX = '@sheriyakam_geo_cache_';
const NOMINATIM_USER_AGENT = 'SheriyakamApp/1.0 (contact@sheriyakam.com)';

/**
 * Validates 6-digit Indian PIN code.
 * Optionally flags whether it belongs to the Kerala/Mahe postal zone (67xxxx - 69xxxx).
 */
export function isValidPincodeFormat(pincode: string): boolean {
  return /^[1-9][0-9]{5}$/.test(pincode.trim());
}

export function isKeralaOrMahePincode(pincode: string): boolean {
  const clean = pincode.trim();
  if (!isValidPincodeFormat(clean)) return false;
  const prefix = parseInt(clean.substring(0, 2), 10);
  return (prefix >= 67 && prefix <= 69) || clean === '673310'; // Mahe is 673310
}

/**
 * Calculates straight-line Haversine distance between two coordinates in kilometers.
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const EARTH_RADIUS_KM = 6371.0;
  const toRadians = (deg: number) => (deg * Math.PI) / 180.0;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const phi1 = toRadians(lat1);
  const phi2 = toRadians(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(EARTH_RADIUS_KM * c * 100) / 100;
}

/**
 * Fallback ETA calculation for Kerala & Malabar towns:
 * Multiplies Haversine distance by 1.35x road-winding curvature factor
 * and assumes an average two-wheeler transit speed of 28 km/h.
 */
export function calculateFallbackKeralaEta(
  originLat: number,
  originLon: number,
  destLat: number,
  destLon: number
): RouteEtaResult {
  const straightLineKm = calculateHaversineDistanceKm(originLat, originLon, destLat, destLon);
  const roadDistanceKm = Math.round(straightLineKm * 1.35 * 100) / 100;

  // 28 km/h average speed in urban/semi-urban Kerala roads
  const durationHours = roadDistanceKm / 28.0;
  const durationMinutes = Math.max(1, Math.round(durationHours * 60));

  return {
    distanceKm: roadDistanceKm,
    durationMinutes,
    isFallback: true,
  };
}

export const locationService = {
  /**
   * TASK 1.1: Fetch locality details by PIN code via India Post API.
   * Auto-populates district, taluk, and post office list for dropdown selection.
   * Fails silently (returns null) on timeout/error so manual inputs remain unlocked.
   */
  async fetchLocalityByPin(pincode: string): Promise<PinLocalityResult | null> {
    const cleanPin = pincode.trim();
    if (!isValidPincodeFormat(cleanPin)) {
      return null;
    }

    // 1. Check in-memory cache
    if (pinMemoryCache.has(cleanPin)) {
      return pinMemoryCache.get(cleanPin)!;
    }

    // 2. Check persistent AsyncStorage
    try {
      const persisted = await AsyncStorage.getItem(`${STORAGE_KEY_PIN_PREFIX}${cleanPin}`);
      if (persisted) {
        const parsed = JSON.parse(persisted) as PinLocalityResult;
        pinMemoryCache.set(cleanPin, parsed);
        return parsed;
      }
    } catch {
      // Fallback silently if storage read fails
    }

    // 3. Query zero-cost India Post postal API with 2500ms timeout
    try {
      const res = await fetchWithTimeout(
        `https://api.postalpincode.in/pincode/${cleanPin}`,
        { timeoutMs: 2500 }
      );

      if (!res.ok) {
        return null;
      }

      const json = await res.json();
      if (!Array.isArray(json) || json.length === 0 || json[0].Status !== 'Success') {
        return null;
      }

      const postOfficesData = json[0].PostOffice;
      if (!Array.isArray(postOfficesData) || postOfficesData.length === 0) {
        return null;
      }

      const firstPO = postOfficesData[0];
      const postOffices = Array.from(
        new Set(postOfficesData.map((po: any) => po.Name).filter(Boolean))
      ) as string[];

      const result: PinLocalityResult = {
        pincode: cleanPin,
        district: firstPO.District || '',
        taluk: firstPO.Block || firstPO.Taluk || firstPO.Division || '',
        state: firstPO.State || 'Kerala',
        postOffices,
      };

      // Save to memory and disk cache
      pinMemoryCache.set(cleanPin, result);
      AsyncStorage.setItem(`${STORAGE_KEY_PIN_PREFIX}${cleanPin}`, JSON.stringify(result)).catch(() => {});

      return result;
    } catch (err) {
      console.warn(`[LocationService] PIN lookup failed for ${cleanPin}:`, (err as Error).message);
      return null;
    }
  },

  /**
   * TASK 1.2: Reverse geocode latitude/longitude to address via OpenStreetMap Nominatim.
   * Includes required custom User-Agent to avoid blocking.
   */
  async reverseGeocode(lat: number, lon: number): Promise<ReverseGeocodeResult | null> {
    if (typeof lat !== 'number' || typeof lon !== 'number' || isNaN(lat) || isNaN(lon)) {
      return null;
    }

    // Round to 4 decimal places (~11m resolution) for effective caching
    const roundedLat = lat.toFixed(4);
    const roundedLon = lon.toFixed(4);
    const cacheKey = `${roundedLat},${roundedLon}`;

    if (reverseGeocodeMemoryCache.has(cacheKey)) {
      return reverseGeocodeMemoryCache.get(cacheKey)!;
    }

    try {
      const persisted = await AsyncStorage.getItem(`${STORAGE_KEY_GEO_PREFIX}${cacheKey}`);
      if (persisted) {
        const parsed = JSON.parse(persisted) as ReverseGeocodeResult;
        reverseGeocodeMemoryCache.set(cacheKey, parsed);
        return parsed;
      }
    } catch {
      // Continue to network fetch
    }

    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${encodeURIComponent(roundedLat)}&lon=${encodeURIComponent(roundedLon)}&addressdetails=1`;
      const res = await fetchWithTimeout(url, {
        timeoutMs: 2500,
        headers: {
          'User-Agent': NOMINATIM_USER_AGENT,
          Accept: 'application/json',
        },
      });

      if (!res.ok) {
        return null;
      }

      const data = await res.json();
      if (!data || !data.address) {
        return null;
      }

      const addr = data.address;
      const locality = addr.suburb || addr.neighbourhood || addr.village || addr.town || addr.city || '';
      const result: ReverseGeocodeResult = {
        formattedAddress: data.display_name || '',
        locality,
        suburb: addr.suburb,
        city: addr.city || addr.town || addr.village,
        district: addr.county || addr.state_district,
        state: addr.state,
        pincode: addr.postcode,
      };

      reverseGeocodeMemoryCache.set(cacheKey, result);
      AsyncStorage.setItem(`${STORAGE_KEY_GEO_PREFIX}${cacheKey}`, JSON.stringify(result)).catch(() => {});

      return result;
    } catch (err) {
      console.warn(`[LocationService] Reverse geocode failed for ${lat},${lon}:`, (err as Error).message);
      return null;
    }
  },

  /**
   * TASK 1.3: Calculate driving distance & duration using OSRM with automatic
   * fallback to straight-line Haversine * 1.35x winding factor at 28 km/h.
   */
  async calculateRouteETA(
    originLat: number,
    originLon: number,
    destLat: number,
    destLon: number
  ): Promise<RouteEtaResult> {
    const key = `${originLat.toFixed(3)},${originLon.toFixed(3)}->${destLat.toFixed(3)},${destLon.toFixed(3)}`;
    if (routeEtaMemoryCache.has(key)) {
      return routeEtaMemoryCache.get(key)!;
    }

    try {
      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${originLon},${originLat};${destLon},${destLat}?overview=false`;
      const res = await fetchWithTimeout(osrmUrl, { timeoutMs: 2500 });

      if (res.ok) {
        const json = await res.json();
        if (json.code === 'Ok' && Array.isArray(json.routes) && json.routes.length > 0) {
          const route = json.routes[0];
          const distanceKm = Math.round((route.distance / 1000.0) * 100) / 100;
          const durationMinutes = Math.max(1, Math.round(route.duration / 60.0));

          const result: RouteEtaResult = {
            distanceKm,
            durationMinutes,
            isFallback: false,
          };
          routeEtaMemoryCache.set(key, result);
          return result;
        }
      }
    } catch (err) {
      console.warn('[LocationService] OSRM routing timed out/failed. Engaging Kerala road curvature fallback:', (err as Error).message);
    }

    // Fallback if OSRM is unreachable or times out
    const fallback = calculateFallbackKeralaEta(originLat, originLon, destLat, destLon);
    routeEtaMemoryCache.set(key, fallback);
    return fallback;
  },
};
