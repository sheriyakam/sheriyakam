import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform, Animated } from 'react-native';
import MapView, { PROVIDER_DEFAULT, UrlTile } from 'react-native-maps';
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
    const liftAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (mapRef.current && region) {
            mapRef.current.animateToRegion(region, 800);
        }
    }, [region]);

    const handleRegionChange = () => {
        Animated.spring(liftAnim, {
            toValue: -16,
            useNativeDriver: true,
            friction: 8,
            tension: 50,
        }).start();
    };

    const handleRegionChangeComplete = (newRegion) => {
        Animated.spring(liftAnim, {
            toValue: 0,
            useNativeDriver: true,
            friction: 5, // creates a tiny drop bounce
            tension: 40,
        }).start();

        if (onRegionChangeComplete) {
            onRegionChangeComplete(newRegion);
        }
    };

    return (
        <View style={styles.mapContainer}>
            <MapView
                ref={mapRef}
                style={styles.map}
                provider={PROVIDER_DEFAULT}
                initialRegion={region}
                onRegionChange={handleRegionChange}
                onRegionChangeComplete={handleRegionChangeComplete}
                mapType="none"
            >
                <UrlTile
                    urlTemplate="https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
                    maximumZ={19}
                    flipY={false}
                />
            </MapView>

            {/* Ground Shadow Pulse (Stays fixed on the map center) */}
            <View style={styles.groundShadowContainer} pointerEvents="none">
                <View style={styles.premiumPinPulse} />
            </View>

            {/* Lifting Center Pin Icon */}
            <Animated.View 
                style={[
                    styles.centerMarker, 
                    { transform: [{ translateY: liftAnim }] }
                ]} 
                pointerEvents="none"
            >
                <View style={styles.premiumPinIconBg}>
                    <MapPin size={22} color="#6366f1" fill="rgba(99,102,241,0.15)" />
                </View>
            </Animated.View>

            {/* Map Header */}
            <View style={styles.mapHeader}>
                <TouchableOpacity onPress={onClose} style={styles.backBtn}>
                    <X size={20} color="#1e293b" />
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
                    <Navigation size={20} color={COLORS.accent} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mapContainer: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    groundShadowContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -12,
        marginTop: -4,
        zIndex: 9,
    },
    premiumPinPulse: {
        width: 24,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(99, 102, 241, 0.25)',
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 4,
    },
    centerMarker: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -18,
        marginTop: -38, // tip of the marker sits at the center
        zIndex: 10,
    },
    premiumPinIconBg: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 5,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    mapHeader: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 20,
        left: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.06)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 4,
        zIndex: 11,
    },
    backBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f1f5f9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapTitle: {
        fontSize: 15,
        fontWeight: '700',
        marginLeft: 12,
        color: '#1e293b',
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 10,
        zIndex: 11,
    },
    addressBox: {
        marginBottom: 16,
        padding: 14,
        backgroundColor: 'rgba(99, 102, 241, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(99, 102, 241, 0.15)',
        borderRadius: 14,
    },
    addressLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: '#6366f1',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    addressValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1e293b',
        lineHeight: 20,
    },
    confirmBtn: {
        backgroundColor: COLORS.accent,
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
        shadowColor: COLORS.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    confirmBtnText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    gpsBtn: {
        position: 'absolute',
        top: -66,
        right: 20,
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
});

export default LocationMap;
