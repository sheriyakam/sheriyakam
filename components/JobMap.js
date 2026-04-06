/**
 * JobMap.js — Native Android/iOS Map (react-native-maps)
 * Shows:
 *   - Customer location (red pin)
 *   - Partner current location (blue tools marker)
 *   - Route line between them
 * Uses Google Maps on Android (which already uses India maps)
 */
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';
import { COLORS } from '../constants/theme';

export default function JobMap({ latitude, longitude, partnerLat, partnerLng, customer, service }) {
    const mapRef = useRef(null);

    // Customer coords (required)
    const custLat = latitude || 11.2588;
    const custLng = longitude || 75.7804;

    // Partner coords (optional — defaults near customer to avoid crash)
    const partLat = partnerLat || (custLat + 0.008);
    const partLng = partnerLng || (custLng + 0.008);

    // Center between both for best initial view
    const centerLat = (custLat + partLat) / 2;
    const centerLng = (custLng + partLng) / 2;

    // Zoom to fit both markers after map loads
    useEffect(() => {
        if (mapRef.current && partnerLat && partnerLng) {
            setTimeout(() => {
                mapRef.current?.fitToCoordinates(
                    [
                        { latitude: custLat, longitude: custLng },
                        { latitude: partLat, longitude: partLng }
                    ],
                    { edgePadding: { top: 60, right: 60, bottom: 80, left: 60 }, animated: true }
                );
            }, 500);
        }
    }, []);

    const routeCoords = [
        { latitude: partLat, longitude: partLng },
        { latitude: custLat, longitude: custLng },
    ];

    return (
        <View style={styles.mapContainer}>
            <MapView
                ref={mapRef}
                style={styles.map}
                provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
                initialRegion={{
                    latitude: centerLat,
                    longitude: centerLng,
                    latitudeDelta: 0.035,
                    longitudeDelta: 0.035,
                }}
                showsUserLocation={false}
                showsMyLocationButton={false}
                mapType="standard"
            >
                {/* Customer Location — Red */}
                <Marker
                    coordinate={{ latitude: custLat, longitude: custLng }}
                    title={`Customer: ${customer || 'Customer'}`}
                    description={service || 'Service Location'}
                    pinColor="#ef4444"
                />

                {/* Partner Location — Blue */}
                {partnerLat && partnerLng && (
                    <Marker
                        coordinate={{ latitude: partLat, longitude: partLng }}
                        title="You (Partner)"
                        description="Your current location"
                        pinColor="#3b82f6"
                    />
                )}

                {/* Route Line */}
                <Polyline
                    coordinates={routeCoords}
                    strokeColor="#3b82f6"
                    strokeWidth={3}
                    lineDashPattern={[8, 4]}
                />
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    mapContainer: {
        height: 220,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 16,
    },
    map: {
        width: '100%',
        height: '100%',
    },
});
