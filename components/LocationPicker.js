/**
 * LocationPicker.js
 * Lets customer pick their service location:
 *   1. Use Current GPS Location (auto)
 *   2. Search by area name / landmark
 * Passes back { latitude, longitude, address } to parent
 */
import React, { useState } from 'react';
import {
    View, Text, TouchableOpacity, TextInput, StyleSheet,
    ActivityIndicator, Alert, Platform
} from 'react-native';
import * as Location from 'expo-location';
import { MapPin, Navigation, Search, CheckCircle } from 'lucide-react-native';
import { COLORS, SPACING } from '../constants/theme';

export default function LocationPicker({ onLocationSelected, currentLocation }) {
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedLocation, setSelectedLocation] = useState(currentLocation || null);

    // ── GPS auto-detect ──────────────────────────────────────────────────────
    const handleUseCurrentLocation = async () => {
        setLoading(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Please allow location access to auto-detect your address.');
                setLoading(false);
                return;
            }

            const position = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High
            });
            const { latitude, longitude } = position.coords;

            // Reverse geocode to get a readable address
            const geocoded = await Location.reverseGeocodeAsync({ latitude, longitude });
            const place = geocoded[0];
            const address = [
                place?.name,
                place?.street,
                place?.district || place?.subregion,
                place?.city || place?.region
            ].filter(Boolean).join(', ');

            const loc = { latitude, longitude, address };
            setSelectedLocation(loc);
            onLocationSelected(loc);
        } catch (err) {
            Alert.alert('Error', 'Could not get your location. Please search manually.');
        } finally {
            setLoading(false);
        }
    };

    // ── Manual Search (Nominatim OpenStreetMap — free, no API key) ───────────
    const handleSearch = async () => {
        if (!searchText.trim()) return;
        setLoading(true);
        try {
            // Bias to India/Kerala for best results
            const query = encodeURIComponent(`${searchText.trim()}, Kerala, India`);
            const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&countrycodes=in`;
            const res = await fetch(url, {
                headers: { 'User-Agent': 'Sheriyakam/1.0' }
            });
            const data = await res.json();

            if (!data || data.length === 0) {
                Alert.alert('Not Found', 'No location found. Try a different name or use GPS.');
                setLoading(false);
                return;
            }

            const result = data[0];
            const loc = {
                latitude: parseFloat(result.lat),
                longitude: parseFloat(result.lon),
                address: result.display_name.split(',').slice(0, 3).join(', ')
            };
            setSelectedLocation(loc);
            onLocationSelected(loc);
        } catch (err) {
            Alert.alert('Search Error', 'Could not search location. Check your internet connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Service Location</Text>

            {/* GPS Button */}
            <TouchableOpacity style={styles.gpsBtn} onPress={handleUseCurrentLocation} disabled={loading}>
                {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <>
                        <Navigation size={16} color="#fff" />
                        <Text style={styles.gpsBtnText}>Use My Current Location</Text>
                    </>
                )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or search</Text>
                <View style={styles.dividerLine} />
            </View>

            {/* Search Box */}
            <View style={styles.searchRow}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="e.g. Thalassery, Kannur, Kozhikode..."
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
                        <Text style={styles.selectedLabel}>Location Selected</Text>
                        <Text style={styles.selectedAddress} numberOfLines={2}>{selectedLocation.address}</Text>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: SPACING.sm,
    },
    label: {
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.textPrimary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
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
    gpsBtnText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginVertical: 4,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.border,
    },
    dividerText: {
        fontSize: 12,
        color: COLORS.textTertiary,
    },
    searchRow: {
        flexDirection: 'row',
        gap: 8,
    },
    searchInput: {
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
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
        borderWidth: 1,
        borderColor: 'rgba(16, 185, 129, 0.3)',
        borderRadius: 10,
        padding: 12,
        marginTop: 4,
    },
    selectedLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.success,
    },
    selectedAddress: {
        fontSize: 13,
        color: COLORS.textSecondary,
        marginTop: 2,
        lineHeight: 18,
    },
});
