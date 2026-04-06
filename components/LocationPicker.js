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
    ActivityIndicator, Alert, Platform
} from 'react-native';
import * as Location from 'expo-location';
import { MapPin, Navigation, Search, CheckCircle, Map } from 'lucide-react-native';
import { COLORS, SPACING } from '../constants/theme';
import MapPickerModal from './MapPickerModal';

export default function LocationPicker({ onLocationSelected, currentLocation }) {
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedLocation, setSelectedLocation] = useState(currentLocation || null);
    const [mapPickerVisible, setMapPickerVisible] = useState(false);

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

            // Check current permission state before calling (avoids silent failure)
            let permState = 'prompt';
            try {
                const perm = await navigator.permissions.query({ name: 'geolocation' });
                permState = perm.state; // 'granted', 'denied', or 'prompt'
            } catch {
                // Some browsers don't support permissions API — proceed anyway
            }

            if (permState === 'denied') {
                // Can't re-ask once denied in browser. Guide user to fix it.
                Alert.alert(
                    'Location Blocked',
                    'You have blocked location access for this site.\n\nTo fix:\n1. Click the 🔒 lock icon in your browser address bar\n2. Set Location to "Allow"\n3. Refresh the page and try again.\n\nOr search your area name in the box below.',
                    [{ text: 'OK' }]
                );
                setLoading(false);
                return;
            }

            // Permission is 'prompt' or 'granted' — ask or use directly
            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    const { latitude, longitude } = pos.coords;
                    const address = await reverseGeocodeWeb(latitude, longitude);
                    applyLocation({ latitude, longitude, address });
                    setLoading(false);
                },
                (err) => {
                    if (err.code === 1) {
                        // User explicitly denied the popup
                        Alert.alert(
                            'Location Access Required',
                            'Location was not allowed.\n\nYou can also search your area name in the box below, or use "Select on Map".'
                        );
                    } else {
                        Alert.alert('GPS Error', 'Could not get your location. Check GPS and try again.');
                    }
                    setLoading(false);
                },
                { enableHighAccuracy: true, timeout: 12000 }
            );
            return;
        }

        // ── Native (Android / iOS) ───────────────────────────────────────────
        try {
            const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();

            if (status === 'granted') {
                const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
                const { latitude, longitude } = pos.coords;
                const geocoded = await Location.reverseGeocodeAsync({ latitude, longitude });
                const place = geocoded[0];
                const address = [
                    place?.name, place?.street,
                    place?.district || place?.subregion,
                    place?.city || place?.region
                ].filter(Boolean).join(', ');
                applyLocation({ latitude, longitude, address });
            } else if (!canAskAgain) {
                // Permanently denied — need to go to Settings
                Alert.alert(
                    'Location Permanently Blocked',
                    'Please go to your phone Settings → Apps → Sheriyakam → Permissions → Location → Allow.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        {
                            text: 'Open Settings',
                            onPress: () => Location.enableNetworkProviderAsync?.()
                        }
                    ]
                );
            } else {
                Alert.alert('Permission Denied', 'Location access is needed to detect your area. Please try again and tap Allow.');
            }
        } catch {
            Alert.alert('Error', 'Could not get location. Please search your area manually.');
        } finally {
            setLoading(false);
        }
    };

    // ── Reverse geocode for web ──────────────────────────────────────────────
    const reverseGeocodeWeb = async (lat, lng) => {
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

    // ── Name Search ─────────────────────────────────────────────────────────
    const handleSearch = async () => {
        if (!searchText.trim()) return;
        setLoading(true);
        try {
            const q = encodeURIComponent(`${searchText.trim()}, Kerala, India`);
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
                    onChangeText={setSearchText}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                />
                <TouchableOpacity style={styles.searchBtn} onPress={handleSearch} disabled={loading}>
                    <Search size={18} color="#fff" />
                </TouchableOpacity>
            </View>

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
});
