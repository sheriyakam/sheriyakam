/**
 * googleMapsService.js
 * Service integration for Google Maps & Places Platform
 */

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '';

export const googleMapsService = {
  isConfigured: () => {
    return GOOGLE_API_KEY.length > 0 && !GOOGLE_API_KEY.includes('YOUR_');
  },

  // 1. Google Places Autocomplete API
  autocompletePlaces: async (input) => {
    if (!googleMapsService.isConfigured()) {
      console.log('[Google Maps Service] Not configured. Falling back to search suggestions...');
      return null;
    }

    try {
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&components=country:in&key=${GOOGLE_API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.status === 'OK') {
        return data.predictions.map(p => ({
          placeId: p.place_id,
          description: p.description,
          mainText: p.structured_formatting.main_text,
          secondaryText: p.structured_formatting.secondary_text
        }));
      }
      console.warn(`[Google Places] Autocomplete failed with status: ${data.status}`);
      return [];
    } catch (err) {
      console.error('[Google Places] Autocomplete error:', err);
      return [];
    }
  },

  // 2. Google Places Detail API (Get lat/lng from Place ID)
  getPlaceDetails: async (placeId) => {
    if (!googleMapsService.isConfigured()) return null;

    try {
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry,formatted_address&key=${GOOGLE_API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.status === 'OK' && data.result.geometry) {
        const { lat, lng } = data.result.geometry.location;
        return {
          latitude: lat,
          longitude: lng,
          address: data.result.formatted_address
        };
      }
      return null;
    } catch (err) {
      console.error('[Google Places] Details fetch error:', err);
      return null;
    }
  },

  // 3. Google Geocoding/Reverse Geocoding API
  reverseGeocode: async (latitude, longitude) => {
    if (!googleMapsService.isConfigured()) return null;

    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.status === 'OK' && data.results.length > 0) {
        return data.results[0].formatted_address;
      }
      return null;
    } catch (err) {
      console.error('[Google Geocoding] Reverse geocode error:', err);
      return null;
    }
  },

  // 4. Google Directions API (Technician tracking route simulation)
  getDirections: async (origin, destination) => {
    if (!googleMapsService.isConfigured()) {
      return {
        points: [
          origin,
          { latitude: (origin.latitude + destination.latitude) / 2, longitude: (origin.longitude + destination.longitude) / 2 },
          destination
        ],
        duration: "12 mins",
        distance: "4.2 km"
      };
    }

    try {
      const originStr = `${origin.latitude},${origin.longitude}`;
      const destStr = `${destination.latitude},${destination.longitude}`;
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originStr}&destination=${destStr}&key=${GOOGLE_API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.status === 'OK' && data.routes.length > 0) {
        const route = data.routes[0];
        const points = decodePolyline(route.overview_polyline.points);
        return {
          points,
          duration: route.legs[0].duration.text,
          distance: route.legs[0].distance.text
        };
      }
      return null;
    } catch (err) {
      console.error('[Google Directions] Fetch error:', err);
      return null;
    }
  }
};

// Polyline decoder utility
function decodePolyline(encoded) {
  let len = encoded.length;
  let index = 0;
  let array = [];
  let lat = 0;
  let lng = 0;

  while (index < len) {
    let b;
    let shift = 0;
    let result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    array.push({
      latitude: lat / 1e5,
      longitude: lng / 1e5
    });
  }
  return array;
}
