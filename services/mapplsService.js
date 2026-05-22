/**
 * services/mapplsService.js
 * CENTRALIZED MAPPLS (MAPMYINDIA) API INTEGRATION
 * Handles:
 *   1. Checking if Mappls API is configured via environment variables
 *   2. Reverse Geocoding: Coordinate (lat, lon) -> Address String
 *   3. Autosuggest: Search Text -> Location Results (lat, lng, address)
 */

const ACCESS_TOKEN = process.env.EXPO_PUBLIC_MAPMYINDIA_ACCESS_TOKEN;

export const mapplsService = {
    /**
     * Checks if the Mappls REST API token is available.
     * @returns {boolean}
     */
    isConfigured: () => {
        return typeof ACCESS_TOKEN === 'string' && ACCESS_TOKEN.trim().length > 0;
    },

    /**
     * Get configured access token
     * @returns {string|undefined}
     */
    getAccessToken: () => {
        return ACCESS_TOKEN;
    },

    /**
     * Reverse geocodes coordinates to a human-readable address.
     * Endpoint: GET https://search.mappls.com/search/address/rev-geocode
     * @param {number} latitude
     * @param {number} longitude
     * @returns {Promise<string|null>} Address string or null if failed
     */
    reverseGeocode: async (latitude, longitude) => {
        if (!mapplsService.isConfigured()) return null;

        try {
            const url = `https://search.mappls.com/search/address/rev-geocode?lat=${latitude}&lon=${longitude}&access_token=${ACCESS_TOKEN}`;
            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'Sheriyakam/1.0'
                }
            });

            if (!response.ok) {
                console.warn('Mappls Reverse Geocoding API returned non-200 status:', response.status);
                return null;
            }

            const data = await response.json();
            
            if (data?.results && data.results.length > 0) {
                return data.results[0].formatted_address || null;
            }

            return null;
        } catch (error) {
            console.error('Mappls reverseGeocode error:', error);
            return null;
        }
    },

    /**
     * Searches places by text query in India/Kerala.
     * Endpoint: GET https://search.mappls.com/search/places/autosuggest/json
     * @param {string} query
     * @returns {Promise<Array<{latitude: number, longitude: number, address: string, name: string}>|null>}
     */
    searchPlaces: async (query) => {
        if (!mapplsService.isConfigured() || !query?.trim()) return null;

        try {
            // Append Kerala/India search context if not present, to ensure local bias
            let searchStr = query.trim();
            if (!searchStr.toLowerCase().includes('kerala')) {
                searchStr += ', Kerala';
            }
            if (!searchStr.toLowerCase().includes('india')) {
                searchStr += ', India';
            }

            const url = `https://search.mappls.com/search/places/autosuggest/json?query=${encodeURIComponent(searchStr)}&access_token=${ACCESS_TOKEN}`;
            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'Sheriyakam/1.0'
                }
            });

            if (!response.ok) {
                console.warn('Mappls Autosuggest API returned non-200 status:', response.status);
                return null;
            }

            const data = await response.json();

            if (data?.suggestedLocations && data.suggestedLocations.length > 0) {
                return data.suggestedLocations.map(loc => ({
                    latitude: parseFloat(loc.latitude),
                    longitude: parseFloat(loc.longitude),
                    address: loc.placeAddress || loc.placeName || '',
                    name: loc.poi || loc.placeName || ''
                })).filter(loc => !isNaN(loc.latitude) && !isNaN(loc.longitude));
            }

            return [];
        } catch (error) {
            console.error('Mappls searchPlaces error:', error);
            return null;
        }
    }
};
