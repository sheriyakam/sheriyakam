/**
 * Location ETA Calculator Test Suite
 * Verifies Haversine distance, bearing calculations, and Kerala road transit ETA estimation.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

// JavaScript mirror of DistanceCalculator for Node test suite verification
class DistanceCalculator {
  static EARTH_RADIUS_KM = 6371.0;
  static KERALA_URBAN_SPEED_KMH = 28.0; // 28 km/h typical Kerala urban arterial speed

  static degreesToRadians(degrees) {
    return (degrees * Math.PI) / 180.0;
  }

  static radiansToDegrees(radians) {
    return (radians * 180.0) / Math.PI;
  }

  static calculateDistanceKm(lat1, lon1, lat2, lon2) {
    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLon = this.degreesToRadians(lon2 - lon1);

    const rLat1 = this.degreesToRadians(lat1);
    const rLat2 = this.degreesToRadians(lat2);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(rLat1) * Math.cos(rLat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(this.EARTH_RADIUS_KM * c * 100) / 100;
  }

  static calculateBearingDegrees(lat1, lon1, lat2, lon2) {
    const rLat1 = this.degreesToRadians(lat1);
    const rLat2 = this.degreesToRadians(lat2);
    const dLon = this.degreesToRadians(lon2 - lon1);

    const y = Math.sin(dLon) * Math.cos(rLat2);
    const x =
      Math.cos(rLat1) * Math.sin(rLat2) -
      Math.sin(rLat1) * Math.cos(rLat2) * Math.cos(dLon);

    let bearing = this.radiansToDegrees(Math.atan2(y, x));
    return Math.round((bearing + 360) % 360);
  }

  static estimateKeralaEtaMinutes(distanceKm, trafficMultiplier = 1.0) {
    if (distanceKm <= 0.05) return 0; // arrived
    // Road winding factor: Kerala coastal/highland roads have an average 1.35x detour factor vs direct line
    const roadDistanceKm = distanceKm * 1.35;
    const effectiveSpeedKmh = Math.max(10.0, this.KERALA_URBAN_SPEED_KMH / trafficMultiplier);
    const durationHours = roadDistanceKm / effectiveSpeedKmh;
    return Math.max(1, Math.ceil(durationHours * 60));
  }
}

describe('Technician Live Location & Kerala Road ETA Engine', () => {
  const KOCHI_METRO_LAT = 9.9816;
  const KOCHI_METRO_LON = 76.2999;

  const EDAPPALLY_TOLL_LAT = 10.0236;
  const EDAPPALLY_TOLL_LON = 76.3116;

  it('calculates accurate Haversine distance between two Kerala coordinates', () => {
    const dist = DistanceCalculator.calculateDistanceKm(
      KOCHI_METRO_LAT,
      KOCHI_METRO_LON,
      EDAPPALLY_TOLL_LAT,
      EDAPPALLY_TOLL_LON
    );
    // Kochi to Edappally direct distance is ~4.8 km - 5.0 km
    assert.ok(dist >= 4.5 && dist <= 5.2, `Expected ~4.8km, got ${dist}`);
  });

  it('calculates zero distance for identical coordinates', () => {
    const dist = DistanceCalculator.calculateDistanceKm(
      KOCHI_METRO_LAT,
      KOCHI_METRO_LON,
      KOCHI_METRO_LAT,
      KOCHI_METRO_LON
    );
    assert.strictEqual(dist, 0);
  });

  it('calculates compass bearing correctly (North-East direction from Kochi to Edappally)', () => {
    const bearing = DistanceCalculator.calculateBearingDegrees(
      KOCHI_METRO_LAT,
      KOCHI_METRO_LON,
      EDAPPALLY_TOLL_LAT,
      EDAPPALLY_TOLL_LON
    );
    // Bearing from (9.98, 76.29) to (10.02, 76.31) is ~15° (North-Northeast)
    assert.ok(bearing >= 10 && bearing <= 25, `Expected ~15°, got ${bearing}`);
  });

  it('estimates realistic Kerala road transit ETA with road curvature factor', () => {
    const directKm = 4.85;
    const standardEtaMinutes = DistanceCalculator.estimateKeralaEtaMinutes(directKm, 1.0);
    // Direct 4.85 km * 1.35 road factor = ~6.55 km at 28 km/h = ~14 mins
    assert.ok(
      standardEtaMinutes >= 12 && standardEtaMinutes <= 16,
      `Expected 12-16 mins, got ${standardEtaMinutes}`
    );

    // Peak monsoon / heavy traffic (1.4x traffic multiplier)
    const monsoonEtaMinutes = DistanceCalculator.estimateKeralaEtaMinutes(directKm, 1.4);
    assert.ok(
      monsoonEtaMinutes >= 18 && monsoonEtaMinutes <= 24,
      `Expected 18-24 mins, got ${monsoonEtaMinutes}`
    );
  });

  it('returns 0 ETA when technician has arrived at customer premise (distance <= 50 meters)', () => {
    const arrivedEta = DistanceCalculator.estimateKeralaEtaMinutes(0.03, 1.0);
    assert.strictEqual(arrivedEta, 0);
  });
});
