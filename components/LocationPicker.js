/**
 * LocationPicker.js
 * Three ways to pick location:
 *   1. Use Current GPS — works on both native and web (HTTPS)
 *   2. Select on Map — full-screen map tap picker
 *   3. Search by name — Nominatim API
 */
import React, { useState } from 'react';
import {
    View, Text, TouchableOpacity, TextInput, StyleSheet,
    ActivityIndicator, Alert, Platform, Linking
} from 'react-native';
import * as Location from 'expo-location';
import { MapPin, Navigation, Search, CheckCircle, Map } from 'lucide-react-native';
import { COLORS, SPACING } from '../constants/theme';
import MapPickerModal from './MapPickerModal';
import { mapplsService } from '../services/mapplsService';
import { googleMapsService } from '../services/googleMapsService';

export default function LocationPicker({ onLocationSelected, currentLocation }) {
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedLocation, setSelectedLocation] = useState(currentLocation || null);
    const [mapPickerVisible, setMapPickerVisible] = useState(false);
    const [suggestions, setSuggestions] = useState([]);

    const applyLocation = (loc) => {
        setSelectedLocation(loc);
        onLocationSelected(loc);
    };

    // ── GPS ─────────────────────────────────────────────────────────────────
    const handleUseCurrentLocation = async () => {
        setLoading(true);

        // ── Web ──────────────────────────────────────────────────────────────
        if (Platform.OS === 'web') {
            if (!navigator?.geolocation) {
                Alert.alert('Not Supported', 'Your browser does not support GPS. Please search your area name.');
                setLoading(false);
                return;
            }

            // Check current permission state
            let permState = 'prompt';
            try {
                const perm = await navigator.permissions.query({ name: 'geolocation' });
                permState = perm.state;
            } catch { /* proceed */ }

            if (permState === 'denied') {
                Alert.alert(
                    'Location Blocked',
                    'You have blocked location access for this site.\n\nTo fix:\n1. Click the 🔒 lock icon in your browser address bar\n2. Set Location to "Allow"\n3. Refresh the page and try again.\n\nOr search your area name in the box below.',
                    [{ text: 'OK' }]
                );
                setLoading(false);
                return;
            }

            // Try high accuracy first (GPS on mobile), fall back to low (Wi-Fi/IP on desktop)
            const tryPos = (opts) => new Promise((res, rej) =>
                navigator.geolocation.getCurrentPosition(res, rej, opts)
            );

            try {
                let pos;
                try {
                    pos = await tryPos({ enableHighAccuracy: true, timeout: 8000 });
                } catch {
                    pos = await tryPos({ enableHighAccuracy: false, timeout: 10000 });
                }
                const { latitude, longitude } = pos.coords;
                const address = await reverseGeocodeWeb(latitude, longitude);
                applyLocation({ latitude, longitude, address });
            } catch (err) {
                if (err.code === 1) {
                    Alert.alert('Location Access Required', 'Location was not allowed.\n\nYou can also search your area name in the box below, or use "Select on Map".');
                } else {
                    Alert.alert('GPS Error', 'Could not detect location. Your GPS may be off. Try searching your area name instead.');
                }
            } finally {
                setLoading(false);
            }
            return;
        }


        // ── Native (Android / iOS) ───────────────────────────────────────────
        try {
            // Step 1: Check if GPS/Location Services is physically turned ON
            let servicesEnabled = await Location.hasServicesEnabledAsync();
            if (!servicesEnabled) {
                if (Platform.OS === 'web') {
                    Alert.alert(
                        '📍 Location is Off',
                        'Please enable Location/GPS on your device to use this feature.\n\nYou can also search your area name below.',
                        [{ text: 'OK' }]
                    );
                } else {
                    Alert.alert(
                        '📍 Turn On Location',
                        'Your device location (GPS) is currently turned off.\n\nPlease turn it on to detect your current address automatically.',
                        [
                            { 
                                text: 'Search Manually', 
                                style: 'cancel' 
                            },
                            {
                                text: 'Open Settings',
                                onPress: () => {
                                    if (Platform.OS === 'android') {
                                        // Opens Android Location Settings directly
                                        Linking.openSettings();
                                    } else {
                                        // Opens iOS Settings app
                                        Linking.openURL('app-settings:');
                                    }
                                }
                            }
                        ]
                    );
                }
                setLoading(false);
                return;
            }

            // Step 2: Request Location Permission
            const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();

            if (status === 'granted') {
                // Step 3: Get current GPS position
                const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
                const { latitude, longitude } = pos.coords;
                
                let address = '';
                if (googleMapsService.isConfigured()) {
                    const addr = await googleMapsService.reverseGeocode(latitude, longitude);
                    if (addr) address = addr;
                }
                if (!address && mapplsService.isConfigured()) {
                    const addr = await mapplsService.reverseGeocode(latitude, longitude);
                    if (addr) address = addr;
                }
                
                if (!address) {
                    const geocoded = await Location.reverseGeocodeAsync({ latitude, longitude });
                    const place = geocoded[0];
                    address = [
                        place?.name, place?.street,
                        place?.district || place?.subregion,
                        place?.city || place?.region
                    ].filter(Boolean).join(', ');
                }
                
                applyLocation({ latitude, longitude, address });
            } else if (!canAskAgain) {
                // Permanently denied — guide user to App Settings
                Alert.alert(
                    '📍 Location Permission Blocked',
                    'You have permanently blocked location access for Sheriyakam.\n\nTo fix this:\n1. Open Settings\n2. Go to Apps → Sheriyakam\n3. Tap Permissions → Location\n4. Select "Allow"',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        {
                            text: 'Open Settings',
                            onPress: () => Linking.openSettings()
                        }
                    ]
                );
            } else {
                // Denied but can ask again
                Alert.alert(
                    '📍 Permission Needed',
                    'Location access is needed to detect your area. Please try again and tap "Allow" when prompted.',
                    [{ text: 'OK' }]
                );
            }
        } catch {
            Alert.alert(
                'Location Error', 
                'Could not detect your location. Please check if GPS is on, or search your area name manually.'
            );
        } finally {
            setLoading(false);
        }
    };

    // ── Reverse geocode for web ──────────────────────────────────────────────
    const reverseGeocodeWeb = async (lat, lng) => {
        if (googleMapsService.isConfigured()) {
            const addr = await googleMapsService.reverseGeocode(lat, lng);
            if (addr) return addr;
        }
        if (mapplsService.isConfigured()) {
            const addr = await mapplsService.reverseGeocode(lat, lng);
            if (addr) return addr;
        }
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
                { headers: { 'User-Agent': 'Sheriyakam/1.0', 'Accept-Language': 'en' } }
            );
            const data = await res.json();
            return data.display_name?.split(',').slice(0, 4).join(', ') || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        } catch {
            return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        }
    };

    // ── Name Search & Autocomplete ───────────────────────────────────────────
    const handleTextChange = async (text) => {
        setSearchText(text);
        if (text.length < 3) {
            setSuggestions([]);
            return;
        }

        // Try Google Maps autocomplete first
        if (googleMapsService.isConfigured()) {
            const predictions = await googleMapsService.autocompletePlaces(text);
            if (predictions) {
                setSuggestions(predictions);
                return;
            }
        }

        // Fallback: If Google Maps not configured, use Nominatim autocomplete suggestions
        try {
            const q = encodeURIComponent(`${text.trim()}, Kerala, India`);
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=5&countrycodes=in`,
                { headers: { 'User-Agent': 'Sheriyakam/1.0' } }
            );
            const data = await res.json();
            if (data && data.length > 0) {
                const list = data.map(item => ({
                    placeId: item.place_id,
                    description: item.display_name.split(',').slice(0, 4).join(', '),
                    mainText: item.display_name.split(',')[0],
                    secondaryText: item.display_name.split(',').slice(1, 3).join(', '),
                    latitude: parseFloat(item.lat),
                    longitude: parseFloat(item.lon)
                }));
                setSuggestions(list);
            } else {
                setSuggestions([]);
            }
        } catch (e) {
            console.log("Autocomplete fallback error:", e);
        }
    };

    const handleSelectSuggestion = async (item) => {
        setSuggestions([]);
        setSearchText(item.description);
        setLoading(true);

        if (item.latitude && item.longitude) {
            // Already has lat/lng (from Nominatim fallback)
            applyLocation({
                latitude: item.latitude,
                longitude: item.longitude,
                address: item.description
            });
            setLoading(false);
        } else {
            // Fetch lat/lng using Google Place Details API
            const details = await googleMapsService.getPlaceDetails(item.placeId);
            if (details) {
                applyLocation(details);
            } else {
                // Fallback search text
                await handleSearchText(item.description);
            }
            setLoading(false);
        }
    };

    const handleSearchText = async (textVal) => {
        const query = textVal || searchText;
        if (!query.trim()) return;
        setLoading(true);
        try {
            // Try Google Geocoding/Autocomplete first if configured
            if (googleMapsService.isConfigured()) {
                const predictions = await googleMapsService.autocompletePlaces(query);
                if (predictions && predictions.length > 0) {
                    const details = await googleMapsService.getPlaceDetails(predictions[0].placeId);
                    if (details) {
                        applyLocation(details);
                        setLoading(false);
                        return;
                    }
                }
            }

            if (mapplsService.isConfigured()) {
                const results = await mapplsService.searchPlaces(query);
                if (results && results.length > 0) {
                    applyLocation(results[0]);
                    setLoading(false);
                    return;
                }
            }

            const q = encodeURIComponent(`${query.trim()}, Kerala, India`);
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1&countrycodes=in`,
                { headers: { 'User-Agent': 'Sheriyakam/1.0' } }
            );
            const data = await res.json();
            if (!data?.length) {
                Alert.alert('Not Found', 'Try a different name or use GPS instead.');
                setLoading(false);
                return;
            }
            const r = data[0];
            applyLocation({
                latitude: parseFloat(r.lat),
                longitude: parseFloat(r.lon),
                address: r.display_name.split(',').slice(0, 4).join(', ')
            });
        } catch {
            Alert.alert('Error', 'Search failed. Check your internet connection.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => handleSearchText(searchText);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Service Location</Text>

            {/* 1. GPS Button */}
            <TouchableOpacity style={styles.gpsBtn} onPress={handleUseCurrentLocation} disabled={loading}>
                {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <>
                        <Navigation size={16} color="#fff" />
                        <Text style={styles.btnText}>Use Current Location</Text>
                    </>
                )}
            </TouchableOpacity>

            {/* 2. Select on Map Button */}
            <TouchableOpacity
                style={styles.mapBtn}
                onPress={() => setMapPickerVisible(true)}
                disabled={loading}
            >
                <Map size={16} color={COLORS.accent} />
                <Text style={styles.mapBtnText}>Select on Map</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
                <View style={styles.divLine} />
                <Text style={styles.divText}>or type area</Text>
                <View style={styles.divLine} />
            </View>

            {/* 3. Search */}
            <View style={styles.searchRow}>
                <TextInput
                    style={styles.input}
                    placeholder="Thalassery, Kannur, Kozhikode..."
                    placeholderTextColor={COLORS.textTertiary}
                    value={searchText}
                    onChangeText={handleTextChange}
                    onSubmitEditing={() => handleSearchText(searchText)}
                    returnKeyType="search"
                />
                <TouchableOpacity style={styles.searchBtn} onPress={() => handleSearchText(searchText)} disabled={loading}>
                    <Search size={18} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Suggestions list */}
            {suggestions.length > 0 && (
                <View style={styles.suggestionsContainer}>
                    {suggestions.map((item, idx) => (
                        <TouchableOpacity
                            key={idx}
                            style={styles.suggestionItem}
                            onPress={() => handleSelectSuggestion(item)}
                        >
                            <MapPin size={16} color={COLORS.accent} style={{ marginTop: 2 }} />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.suggestionMainText}>{item.mainText}</Text>
                                <Text style={styles.suggestionSubText} numberOfLines={1}>{item.secondaryText || item.description}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* Selected Location Preview */}
            {selectedLocation && (
                <View style={styles.selectedBox}>
                    <CheckCircle size={16} color={COLORS.success} />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.selectedLabel}>✅ Location Confirmed</Text>
                        <Text style={styles.selectedAddress} numberOfLines={2}>
                            {selectedLocation.address}
                        </Text>
                    </View>
                </View>
            )}

            {/* Map Picker Modal */}
            <MapPickerModal
                visible={mapPickerVisible}
                onClose={() => setMapPickerVisible(false)}
                onSelect={applyLocation}
                initialLat={selectedLocation?.latitude}
                initialLng={selectedLocation?.longitude}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { gap: SPACING.sm },
    label: {
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.textPrimary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    gpsBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: COLORS.accent,
        padding: 14,
        borderRadius: 12,
    },
    mapBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 1.5,
        borderColor: COLORS.accent,
        padding: 13,
        borderRadius: 12,
    },
    btnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
    mapBtnText: { color: COLORS.accent, fontWeight: '700', fontSize: 14 },
    divider: { flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 2 },
    divLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
    divText: { fontSize: 12, color: COLORS.textTertiary },
    searchRow: { flexDirection: 'row', gap: 8 },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 10,
        padding: 12,
        color: COLORS.textPrimary,
        fontSize: 14,
        backgroundColor: COLORS.bgSecondary,
    },
    searchBtn: {
        width: 46,
        backgroundColor: COLORS.accent,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        backgroundColor: 'rgba(16,185,129,0.08)',
        borderWidth: 1,
        borderColor: 'rgba(16,185,129,0.3)',
        borderRadius: 10,
        padding: 12,
        marginTop: 2,
    },
    selectedLabel: { fontSize: 12, fontWeight: '700', color: COLORS.success },
    selectedAddress: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2, lineHeight: 18 },
    suggestionsContainer: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 10,
        backgroundColor: COLORS.bgSecondary,
        maxHeight: 200,
        overflow: 'hidden',
        marginTop: 2,
    },
    suggestionItem: {
        flexDirection: 'row',
        gap: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    suggestionMainText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    suggestionSubText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 1,
    },
});
