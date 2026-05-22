/**
 * MapPickerModal.js
 * Full-screen map for selecting service location by tapping
 * Native: react-native-maps with draggable marker
 * Web: handled by MapPickerModal.web.js
 */
import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, Modal,
    ActivityIndicator, Platform, Dimensions, Alert
} from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, UrlTile } from 'react-native-maps';
import { CheckCircle, X, Navigation, MapPin } from 'lucide-react-native';
import { COLORS, SPACING } from '../constants/theme';
import * as Location from 'expo-location';
import { mapplsService } from '../services/mapplsService';

const { width, height } = Dimensions.get('window');

export default function MapPickerModal({ visible, onClose, onSelect, initialLat, initialLng }) {
    // Default to Kerala center
    const [pin, setPin] = useState({
        latitude: initialLat || 11.8745,
        longitude: initialLng || 75.3704,
    });
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const mapRef = useRef(null);

    const reverseGeocode = async (lat, lng) => {
        try {
            if (mapplsService.isConfigured()) {
                const addr = await mapplsService.reverseGeocode(lat, lng);
                if (addr) {
                    setAddress(addr);
                    return;
                }
            }

            const geocoded = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
            const place = geocoded[0];
            const addr = [
                place?.name,
                place?.street,
                place?.district || place?.subregion,
                place?.city || place?.region
            ].filter(Boolean).join(', ');
            setAddress(addr || `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        } catch {
            setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        }
    };

    const handleMapPress = async (e) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        setPin({ latitude, longitude });
        setLoading(true);
        await reverseGeocode(latitude, longitude);
        setLoading(false);
    };

    const handleGPS = async () => {
        setLoading(true);
        try {
            // Check if GPS is physically turned on
            let servicesEnabled = await Location.hasServicesEnabledAsync();
            if (!servicesEnabled) {
                Alert.alert(
                    'Location Disabled', 
                    'Please pull down your notification shade and turn on Location (GPS) to use this feature.',
                    [{ text: 'OK' }]
                );
                setLoading(false);
                return;
            }

            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Permission to access location was denied. Please enable it in your app settings.');
                setLoading(false);
                return;
            }
            const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            const { latitude, longitude } = pos.coords;
            setPin({ latitude, longitude });
            mapRef.current?.animateToRegion({
                latitude, longitude, latitudeDelta: 0.008, longitudeDelta: 0.008
            }, 600);
            await reverseGeocode(latitude, longitude);
        } catch (e) {
            Alert.alert('Error', 'Could not fetch location. Please ensure your GPS is turned on.');
        } finally {
            setLoading(false);
        }
    };

    // Auto-fetch location on open
    useEffect(() => {
        if (visible) {
            handleGPS();
        }
    }, [visible]);

    const handleConfirm = () => {
        onSelect({ latitude: pin.latitude, longitude: pin.longitude, address });
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                        <X size={20} color="#1e293b" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Select Location</Text>
                    <TouchableOpacity style={styles.gpsBtn} onPress={handleGPS}>
                        <Navigation size={18} color={COLORS.accent} />
                    </TouchableOpacity>
                </View>

                {/* Map */}
                <View style={styles.mapContainer}>
                    <MapView
                        ref={mapRef}
                        style={styles.map}
                        provider={PROVIDER_DEFAULT}
                        initialRegion={{
                            latitude: pin.latitude,
                            longitude: pin.longitude,
                            latitudeDelta: 0.05,
                            longitudeDelta: 0.05,
                        }}
                        onPress={handleMapPress}
                        mapType="none" // Turn base layer off, load OSM instead
                    >
                        <UrlTile
                            urlTemplate="https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
                            maximumZ={19}
                            flipY={false}
                        />
                        <Marker
                            coordinate={pin}
                            draggable
                            onDragEnd={async (e) => {
                                const { latitude, longitude } = e.nativeEvent.coordinate;
                                setPin({ latitude, longitude });
                                setLoading(true);
                                await reverseGeocode(latitude, longitude);
                                setLoading(false);
                            }}
                        >
                            <View style={styles.premiumPinContainer}>
                                <View style={styles.premiumPinPulse} />
                                <View style={styles.premiumPinIconBg}>
                                    <MapPin size={22} color="#6366f1" fill="rgba(99,102,241,0.15)" />
                                </View>
                            </View>
                        </Marker>
                    </MapView>

                    <Text style={styles.hint}>Tap on the map or drag the pin to adjust</Text>
                </View>

                {/* Bottom Sheet */}
                <View style={styles.sheet}>
                    <View style={styles.addressBox}>
                        <Text style={styles.addressLabel}>Selected Location</Text>
                        {loading ? (
                            <ActivityIndicator color={COLORS.accent} size="small" style={styles.loader} />
                        ) : (
                            <Text style={styles.addressText} numberOfLines={2}>
                                {address || 'Tap on the map to pick your location'}
                            </Text>
                        )}
                    </View>
                    <TouchableOpacity
                        style={[styles.confirmBtn, !address && styles.confirmDisabled]}
                        onPress={handleConfirm}
                        disabled={!address || loading}
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
    container: { flex: 1, backgroundColor: '#f8fafc' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 14,
        paddingTop: Platform.OS === 'ios' ? 54 : 14,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.06)',
    },
    closeBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f1f5f9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    gpsBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(99, 102, 241, 0.08)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
    hint: {
        position: 'absolute',
        top: 16,
        alignSelf: 'center',
        backgroundColor: 'rgba(30, 41, 59, 0.85)',
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        zIndex: 10,
        overflow: 'hidden',
    },
    mapContainer: {
        flex: 1,
        position: 'relative',
    },
    map: { flex: 1 },
    premiumPinContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: 60,
    },
    premiumPinPulse: {
        position: 'absolute',
        width: 24,
        height: 8,
        borderRadius: 4,
        bottom: 8,
        backgroundColor: 'rgba(99, 102, 241, 0.25)',
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 4,
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
        marginBottom: 8,
    },
    sheet: {
        backgroundColor: '#fff',
        padding: 24,
        gap: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.06)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 10,
    },
    addressBox: {
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
    addressText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1e293b',
        lineHeight: 20,
    },
    loader: {
        alignSelf: 'flex-start',
        marginTop: 4,
    },
    confirmBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: COLORS.accent,
        padding: 16,
        borderRadius: 14,
        shadowColor: COLORS.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    confirmDisabled: { backgroundColor: '#cbd5e1', shadowOpacity: 0 },
    confirmText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
