/**
 * SHERIYAKAM — Smart Assignment Engine
 * Auto-assigns the nearest available partner to a booking
 * using the Haversine distance formula (accurate GPS distance)
 */

import { getPartners } from './partnerStore';

const MAX_RANGE_KM = 20;

/**
 * Haversine formula — calculates real-world distance between two GPS coordinates
 * Returns distance in kilometers
 */
export const haversineDistanceKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

/**
 * Find the best available partner for a booking.
 * Rules:
 *  1. Partner must be approved
 *  2. Partner must be available (isAvailable = true)
 *  3. Partner must be within MAX_RANGE_KM (20km)
 *  4. Partner with LEAST distance is selected (closest first)
 *  5. If service type provided, match partner's specialties
 */
export const findBestPartner = (booking) => {
    const { latitude, longitude, serviceName } = booking;

    // Can't assign without location
    if (!latitude || !longitude) return null;

    const allPartners = getPartners();

    const eligible = allPartners
        .filter(p => {
            // Must be approved and available
            if (p.status !== 'approved') return false;
            if (!p.isAvailable) return false;

            // Must have location
            if (!p.latitude || !p.longitude) return false;

            // Must be within 20km
            const dist = haversineDistanceKm(latitude, longitude, p.latitude, p.longitude);
            p._distanceKm = parseFloat(dist.toFixed(2)); // Cache for sorting
            return dist <= MAX_RANGE_KM;
        })
        .sort((a, b) => a._distanceKm - b._distanceKm); // Sort closest first

    if (eligible.length === 0) return null;

    // Prefer partners whose service types match
    if (serviceName) {
        const serviceKeyword = serviceName.toLowerCase();
        const matched = eligible.find(p =>
            p.serviceTypes?.some(s => s.toLowerCase().includes(serviceKeyword) ||
                serviceKeyword.includes(s.toLowerCase()))
        );
        if (matched) return matched;
    }

    // Fallback: return the simply closest available partner
    return eligible[0];
};

/**
 * Auto-assign a partner to a booking.
 * Returns: { success, partner, distanceKm } or { success: false, reason }
 */
export const autoAssignPartner = (booking) => {
    const best = findBestPartner(booking);

    if (!best) {
        return {
            success: false,
            reason: 'No available partner found within 20km for this service'
        };
    }

    return {
        success: true,
        partner: best,
        distanceKm: best._distanceKm
    };
};
