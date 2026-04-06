/**
 * MapPickerModal.web.js — Web fallback for MapPickerModal
 * Uses browser navigator.geolocation (works on HTTPS sites like Vercel)
 * + OpenStreetMap embed showing the selected location
 * + Nominatim search for manual location entry
 */
import React, { useState } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, Modal,
    ActivityIndicator, TextInput
} from 'react-native';
import { X, Navigation, Search, CheckCircle, MapPin } from 'lucide-react-native';
import { COLORS, SPACING } from '../constants/theme';

export default function MapPickerModal({ visible, onClose, onSelect }) {
    const [pin, setPin] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [error, setError] = useState('');

    // ── GPS via browser native geolocation (reliable on HTTPS) ──────────────
    const handleGPS = () => {
        setLoading(true);
        setError('');

        if (!navigator?.geolocation) {
            setError('GPS not available in this browser. Please search for your location.');
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                // Nominatim reverse geocode
                const addr = await reverseGeocode(latitude, longitude);
                const loc = { latitude, longitude, address: addr };
                setPin(loc);
                setLoading(false);
            },
            (err) => {
                setError('Could not get GPS. Please search for your area name below.');
                setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    // ── Nominatim reverse geocode ────────────────────────────────────────────
    const reverseGeocode = async (lat, lng) => {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
                { headers: { 'Accept-Language': 'en', 'User-Agent': 'Sheriyakam/1.0' } }
            );
            const data = await res.json();
            const parts = data.display_name?.split(',').slice(0, 4) || [];
            return parts.join(', ') || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        } catch {
            return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        }
    };

    // ── Nominatim forward search ─────────────────────────────────────────────
    const handleSearch = async () => {
        if (!searchText.trim()) return;
        setLoading(true);
        setError('');
        try {
            const q = encodeURIComponent(`${searchText.trim()}, Kerala, India`);
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1&countrycodes=in`,
                { headers: { 'User-Agent': 'Sheriyakam/1.0' } }
            );
            const data = await res.json();
            if (!data?.length) {
                setError('Place not found. Try a nearby landmark or city name.');
                setLoading(false);
                return;
            }
            const r = data[0];
            const loc = {
                latitude: parseFloat(r.lat),
                longitude: parseFloat(r.lon),
                address: r.display_name.split(',').slice(0, 4).join(', ')
            };
            setPin(loc);
        } catch {
            setError('Search failed. Check internet and try again.');
        } finally {
            setLoading(false);
        }
    };

    // ── Map embed for the selected pin ───────────────────────────────────────
    const getEmbedUrl = () => {
        if (!pin) return null;
        const { latitude: lat, longitude: lng } = pin;
        return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.015},${lat - 0.015},${lng + 0.015},${lat + 0.015}&layer=mapnik&marker=${lat},${lng}`;
    };

    const handleConfirm = () => {
        if (pin) {
            onSelect(pin);
            onClose();
        }
    };

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.iconBtn} onPress={onClose}>
                        <X size={22} color={COLORS.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Select Service Location</Text>
                    <View style={{ width: 40 }} />
                </View>

                <View style={styles.body}>
                    {/* GPS Button */}
                    <TouchableOpacity style={styles.gpsBtn} onPress={handleGPS} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <>
                                <Navigation size={16} color="#fff" />
                                <Text style={styles.gpsBtnText}>Use My Current Location</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    {/* Divider */}
                    <View style={styles.divider}>
                        <View style={styles.divLine} />
                        <Text style={styles.divText}>or search area</Text>
                        <View style={styles.divLine} />
                    </View>

                    {/* Search */}
                    <View style={styles.searchRow}>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Thalassery, Kannur, Mahe..."
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

                    {error ? <Text style={styles.error}>{error}</Text> : null}

                    {/* Map Preview */}
                    {pin && (
                        <>
                            <View style={styles.mapWrap}>
                                <iframe
                                    src={getEmbedUrl()}
                                    style={{ width: '100%', height: '100%', border: 'none', borderRadius: 12 }}
                                    title="Selected Location"
                                    loading="lazy"
                                />
                                {/* overlay label */}
                                <View style={styles.mapLabel}>
                                    <MapPin size={12} color="#ef4444" />
                                    <Text style={styles.mapLabelText}>Your Location</Text>
                                </View>
                            </View>

                            {/* Address */}
                            <View style={styles.addressBox}>
                                <CheckCircle size={16} color={COLORS.success} />
                                <Text style={styles.addressText} numberOfLines={3}>{pin.address}</Text>
                            </View>
                        </>
                    )}
                </View>

                {/* Confirm */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.confirmBtn, !pin && styles.confirmDisabled]}
                        onPress={handleConfirm}
                        disabled={!pin}
                    >
                        <CheckCircle size={18} color="#fff" />
                        <Text style={styles.confirmText}>Confirm This Location</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bgPrimary },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        paddingTop: 20,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    title: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
    body: { flex: 1, padding: 16, gap: 12 },
    gpsBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: COLORS.accent,
        padding: 14,
        borderRadius: 12,
    },
    gpsBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
    divider: { flexDirection: 'row', alignItems: 'center', gap: 8 },
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
    error: { color: COLORS.danger, fontSize: 13, textAlign: 'center' },
    mapWrap: {
        height: 200,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.border,
        position: 'relative',
    },
    mapLabel: {
        position: 'absolute',
        top: 8,
        left: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(0,0,0,0.65)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
    },
    mapLabelText: { color: '#fff', fontSize: 11, fontWeight: '600' },
    addressBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        backgroundColor: 'rgba(16,185,129,0.08)',
        borderWidth: 1,
        borderColor: 'rgba(16,185,129,0.3)',
        borderRadius: 10,
        padding: 12,
    },
    addressText: { flex: 1, fontSize: 13, color: COLORS.textSecondary, lineHeight: 18 },
    footer: { padding: 16, borderTopWidth: 1, borderTopColor: COLORS.border },
    confirmBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: COLORS.accent,
        padding: 16,
        borderRadius: 12,
    },
    confirmDisabled: { backgroundColor: COLORS.border },
    confirmText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
