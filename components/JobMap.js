/**
 * JobMap.js — Native Android/iOS Map (react-native-maps)
 * Shows:
 *   - Customer location (premium purple pin)
 *   - Partner current location (premium blue tracking dot)
 *   - Sleek route polyline between them
 * Uses CartoDB Voyager styled tiles.
 */
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT, UrlTile } from 'react-native-maps';
import { COLORS } from '../constants/theme';
import { MapPin } from 'lucide-react-native';

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
            }, 600);
        }
    }, [partnerLat, partnerLng]);

    const routeCoords = [
        { latitude: partLat, longitude: partLng },
        { latitude: custLat, longitude: custLng },
    ];

    return (
        <View style={styles.mapContainer}>
            <MapView
                ref={mapRef}
                style={styles.map}
                provider={PROVIDER_DEFAULT}
                initialRegion={{
                    latitude: centerLat,
                    longitude: centerLng,
                    latitudeDelta: 0.035,
                    longitudeDelta: 0.035,
                }}
                showsUserLocation={false}
                showsMyLocationButton={false}
                mapType="none" // Turn off base map to rely purely on Voyager tiles
            >
                <UrlTile
                    urlTemplate="https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
                    maximumZ={19}
                    flipY={false}
                />

                {/* Customer Location — Premium Purple Badge Pin */}
                <Marker
                    coordinate={{ latitude: custLat, longitude: custLng }}
                    title={`Customer: ${customer || 'Customer'}`}
                    description={service || 'Service Location'}
                >
                    <View style={styles.markerContainer}>
                        <View style={styles.customerPinPulse} />
                        <View style={styles.customerPinIconBg}>
                            <MapPin size={18} color="#6366f1" fill="rgba(99,102,241,0.15)" />
                        </View>
                    </View>
                </Marker>

                {/* Partner Location — Blue Pulse Tracking Dot */}
                {partnerLat && partnerLng && (
                    <Marker
                        coordinate={{ latitude: partLat, longitude: partLng }}
                        title="You (Partner)"
                        description="Your current tracking location"
                    >
                        <View style={styles.markerContainer}>
                            <View style={styles.partnerPinPulse} />
                            <View style={styles.partnerPinIconBg}>
                                <View style={styles.partnerDot} />
                            </View>
                        </View>
                    </Marker>
                )}

                {/* Route Line — Premium dashed indigo track */}
                {partnerLat && partnerLng && (
                    <Polyline
                        coordinates={routeCoords}
                        strokeColor="#6366f1"
                        strokeWidth={3.5}
                        lineDashPattern={[6, 6]}
                    />
                )}
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
        borderColor: 'rgba(0,0,0,0.06)',
        marginBottom: 16,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    markerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
    },
    customerPinPulse: {
        position: 'absolute',
        width: 20,
        height: 6,
        borderRadius: 3,
        bottom: 6,
        backgroundColor: 'rgba(99, 102, 241, 0.25)',
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 4,
    },
    customerPinIconBg: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
        marginBottom: 6,
    },
    partnerPinPulse: {
        position: 'absolute',
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 6,
    },
    partnerPinIconBg: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    partnerDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#3b82f6',
    },
});
