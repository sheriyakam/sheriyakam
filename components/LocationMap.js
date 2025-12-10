import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import MapView, { PROVIDER_DEFAULT } from 'react-native-maps';
import { MapPin, X, Navigation } from 'lucide-react-native';
import { COLORS } from '../constants/theme';

const LocationMap = ({
    region,
    onRegionChangeComplete,
    onClose,
    addressText,
    onConfirm,
    onRequestCurrentLocation
}) => {
    const mapRef = useRef(null);

    useEffect(() => {
        if (mapRef.current && region) {
            mapRef.current.animateToRegion(region, 1000);
        }
    }, [region]);

    return (
        <View style={styles.mapContainer}>
            <MapView
                ref={mapRef}
                style={styles.map}
                provider={PROVIDER_DEFAULT}
                initialRegion={region}
                onRegionChangeComplete={onRegionChangeComplete}
            >
                {/* Center Marker Fixed View instead of Map Marker usually better for selection */}
            </MapView>

            {/* Fixed Center Marker */}
            <View style={styles.centerMarker}>
                <MapPin size={40} color={COLORS.accent} fill={COLORS.accent} style={{ marginBottom: 40 }} />
            </View>

            {/* Map Header */}
            <View style={styles.mapHeader}>
                <TouchableOpacity onPress={onClose} style={styles.backBtn}>
                    <X size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.mapTitle}>Pin Location</Text>
            </View>

            {/* Map Footer */}
            <View style={styles.mapFooter}>
                <View style={styles.addressBox}>
                    <Text style={styles.addressLabel}>Selected Location</Text>
                    <Text style={styles.addressValue} numberOfLines={2}>
                        {addressText || "Locating..."}
                    </Text>
                </View>
                <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
                    <Text style={styles.confirmBtnText}>Confirm Location</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.gpsBtn}
                    onPress={onRequestCurrentLocation}
                >
                    <Navigation size={24} color={COLORS.accent} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mapContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    centerMarker: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -20,
        marginTop: -40,
        zIndex: 10,
    },
    mapHeader: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 30,
        left: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 10,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    mapTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 16,
        color: '#000',
        backgroundColor: 'rgba(255,255,255,0.8)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
        overflow: 'hidden',
    },
    mapFooter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 24,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    addressBox: {
        marginBottom: 16,
    },
    addressLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    addressValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    confirmBtn: {
        backgroundColor: COLORS.accent,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    confirmBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    gpsBtn: {
        position: 'absolute',
        top: -70,
        right: 20,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});

export default LocationMap;
