/**
 * MapPickerModal.js
 * Full-screen map for selecting service location by tapping
 * Native: react-native-maps with draggable marker
 * Web: handled by MapPickerModal.web.js
 */
import React, { useState, useRef } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, Modal,
    ActivityIndicator, Platform, Dimensions
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';
import { CheckCircle, X, Navigation } from 'lucide-react-native';
import { COLORS, SPACING } from '../constants/theme';
import * as Location from 'expo-location';

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
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
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
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

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
                        <X size={22} color={COLORS.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Select Service Location</Text>
                    <TouchableOpacity style={styles.gpsBtn} onPress={handleGPS}>
                        <Navigation size={18} color={COLORS.accent} />
                    </TouchableOpacity>
                </View>

                <Text style={styles.hint}>Tap on the map to pin your location</Text>

                {/* Map */}
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
                    initialRegion={{
                        latitude: pin.latitude,
                        longitude: pin.longitude,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    }}
                    onPress={handleMapPress}
                >
                    <Marker
                        coordinate={pin}
                        title="Service Location"
                        pinColor="#ef4444"
                        draggable
                        onDragEnd={async (e) => {
                            const { latitude, longitude } = e.nativeEvent.coordinate;
                            setPin({ latitude, longitude });
                            setLoading(true);
                            await reverseGeocode(latitude, longitude);
                            setLoading(false);
                        }}
                    />
                </MapView>

                {/* Bottom Sheet */}
                <View style={styles.sheet}>
                    {loading ? (
                        <ActivityIndicator color={COLORS.accent} style={{ marginBottom: 8 }} />
                    ) : (
                        <Text style={styles.addressText} numberOfLines={2}>
                            {address || 'Tap on the map to pick your location'}
                        </Text>
                    )}
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
    container: { flex: 1, backgroundColor: '#000' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.bgPrimary,
        paddingHorizontal: 16,
        paddingVertical: 14,
        paddingTop: Platform.OS === 'ios' ? 54 : 14,
    },
    closeBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    gpsBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
    hint: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 110 : 80,
        alignSelf: 'center',
        backgroundColor: 'rgba(0,0,0,0.65)',
        color: '#fff',
        fontSize: 12,
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        zIndex: 10,
        overflow: 'hidden',
    },
    map: { flex: 1 },
    sheet: {
        backgroundColor: COLORS.bgPrimary,
        padding: 20,
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    addressText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        lineHeight: 20,
        minHeight: 40,
    },
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
