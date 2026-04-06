/**
 * JobMap.web.js — Web version (no react-native-maps on web)
 * Uses OpenStreetMap embed (free, no API key, works in India perfectly)
 * Shows customer location + "Open in Maps" button
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { COLORS } from '../constants/theme';
import { MapPin, Navigation } from 'lucide-react-native';

export default function JobMap({ latitude, longitude, customer, service, address }) {
    const custLat = latitude || 11.2588;
    const custLng = longitude || 75.7804;

    const query = address
        ? encodeURIComponent(`${address}, Kerala, India`)
        : `${custLat},${custLng}`;

    // OpenStreetMap embed — free, accurate India maps, no API key
    const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${custLng - 0.01},${custLat - 0.01},${custLng + 0.01},${custLat + 0.01}&layer=mapnik&marker=${custLat},${custLng}`;

    const openGoogleMaps = () => {
        const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
        Linking.openURL(url);
    };

    const openInMaps = () => {
        // Opens native Google Maps / Apple Maps app
        const url = `geo:${custLat},${custLng}?q=${query}`;
        Linking.openURL(url).catch(() => openGoogleMaps());
    };

    return (
        <View style={styles.container}>
            {/* Map Embed */}
            <View style={styles.mapWrap}>
                <iframe
                    src={embedUrl}
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        borderRadius: 14,
                    }}
                    allowFullScreen
                    loading="lazy"
                    title="Customer Location"
                />
                {/* Customer label overlay */}
                <View style={styles.labelOverlay}>
                    <MapPin size={13} color="#ef4444" />
                    <Text style={styles.labelText}>{customer || 'Customer Location'}</Text>
                </View>
            </View>

            {/* Address */}
            {address && (
                <View style={styles.addressRow}>
                    <MapPin size={14} color={COLORS.accent} />
                    <Text style={styles.addressText} numberOfLines={2}>{address}</Text>
                </View>
            )}

            {/* Open in Google Maps */}
            <TouchableOpacity style={styles.mapsBtn} onPress={openGoogleMaps}>
                <Navigation size={16} color={COLORS.accent} />
                <Text style={styles.mapsBtnText}>Open in Google Maps for Directions</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        gap: 10,
    },
    mapWrap: {
        height: 220,
        borderRadius: 14,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.border,
        position: 'relative',
    },
    labelOverlay: {
        position: 'absolute',
        top: 10,
        left: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 20,
    },
    labelText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        paddingHorizontal: 4,
    },
    addressText: {
        flex: 1,
        fontSize: 13,
        color: COLORS.textSecondary,
        lineHeight: 18,
    },
    mapsBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: COLORS.accent,
        borderRadius: 10,
        padding: 12,
    },
    mapsBtnText: {
        color: COLORS.accent,
        fontWeight: '700',
        fontSize: 14,
    },
});
