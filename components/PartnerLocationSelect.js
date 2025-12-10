import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    TextInput,
    ScrollView
} from 'react-native';
import { X, MapPin, Check, Navigation, Plus, Minus, Edit2 } from 'lucide-react-native';
import { COLORS, SPACING } from '../constants/theme';

const { width } = Dimensions.get('window');

const PartnerLocationSelect = ({ visible, onClose, onSelect }) => {
    const [loading, setLoading] = useState(false);
    const [radius, setRadius] = useState(10); // 1-10 km
    const [zoom, setZoom] = useState(1); // 0.5 - 2
    const [address, setAddress] = useState('Calicut, Kerala');
    const [isEditing, setIsEditing] = useState(false);

    // Calculate visual size based on validation and zoom
    // Base size for 10km is 60% of width.
    // If radius is 5km, it should look smaller relative to the "map" context
    const circleSize = (width * 0.6) * (radius / 10) * zoom;

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 2));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));

    const handleConfirm = () => {
        setLoading(true);
        // Simulate getting location details
        setTimeout(() => {
            setLoading(false);
            onSelect({
                address: address, // Dynamic address
                coordinates: { lat: 11.2588, lng: 75.7804 }, // Mock coords
                radius: radius
            });
            onClose();
        }, 1000);
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Set Service Location</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <X size={24} color={COLORS.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.subtitle}>
                        Select service radius (Max 10km) and center location.
                    </Text>

                    {/* Mock Map View */}
                    <View style={styles.mapContainer}>
                        {/* Grid lines to look like map */}
                        <View style={styles.gridLineVertical} />
                        <View style={styles.gridLineHorizontal} />

                        {/* Dynamic Radius Circle */}
                        <View style={[
                            styles.radiusCircle,
                            {
                                width: circleSize,
                                height: circleSize,
                                borderRadius: circleSize / 2
                            }
                        ]}>
                            <View style={styles.radiusLabelContainer}>
                                <Text style={styles.radiusLabel}>{radius} km</Text>
                            </View>
                        </View>

                        {/* Center Pin */}
                        <View style={styles.centerPin}>
                            <MapPin size={40} color={COLORS.danger} fill={COLORS.danger} />
                            <View style={styles.pinShadow} />
                        </View>

                        {/* Zoom Controls */}
                        <View style={styles.zoomControls}>
                            <TouchableOpacity onPress={handleZoomIn} style={styles.zoomBtn}>
                                <Plus size={20} color={COLORS.textPrimary} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleZoomOut} style={styles.zoomBtn}>
                                <Minus size={20} color={COLORS.textPrimary} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Radius Selection */}
                    <Text style={styles.sectionTitle}>SERVICE RADIUS (MAX 10 KM)</Text>
                    <View style={styles.radiusSelector}>
                        {[1, 3, 5, 8, 10].map((r) => (
                            <TouchableOpacity
                                key={r}
                                style={[styles.radiusBtn, radius === r && styles.radiusBtnActive]}
                                onPress={() => setRadius(r)}
                            >
                                <Text style={[styles.radiusBtnText, radius === r && styles.radiusBtnTextActive]}>{r} km</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.sectionTitle}>LOCATION CENTER</Text>
                    <View style={styles.addressBox}>
                        <MapPin size={20} color={COLORS.accent} />
                        {isEditing ? (
                            <TextInput
                                style={styles.addressInput}
                                value={address}
                                onChangeText={setAddress}
                                placeholder="Enter city name..."
                                placeholderTextColor={COLORS.textTertiary}
                                autoFocus
                                onBlur={() => setIsEditing(false)}
                            />
                        ) : (
                            <Text style={styles.addressText}>{address}</Text>
                        )}
                        <TouchableOpacity onPress={() => setIsEditing(!isEditing)} style={{ marginLeft: 'auto' }}>
                            {isEditing ? <Check size={20} color={COLORS.success} /> : <Edit2 size={20} color={COLORS.textSecondary} />}
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.confirmBtn}
                        onPress={handleConfirm}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <Check size={20} color="#fff" />
                                <Text style={styles.confirmBtnText}>Confirm Location</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: COLORS.bgSecondary,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: SPACING.lg,
        height: '85%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    subtitle: {
        color: COLORS.textSecondary,
        marginBottom: SPACING.lg,
    },
    closeBtn: {
        padding: 4,
    },
    mapContainer: {
        flex: 1,
        backgroundColor: '#1e293b', // darker map bg
        borderRadius: 16,
        marginBottom: SPACING.lg,
        overflow: 'hidden',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    gridLineVertical: {
        position: 'absolute',
        width: 1,
        height: '100%',
        backgroundColor: 'rgba(255,255,255,0.05)',
        left: '50%',
    },
    gridLineHorizontal: {
        position: 'absolute',
        width: '100%',
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        top: '50%',
    },
    radiusCircle: {
        width: width * 0.6,
        height: width * 0.6,
        borderRadius: (width * 0.6) / 2,
        backgroundColor: 'rgba(37, 99, 235, 0.15)', // Primary blue low opacity
        borderWidth: 2,
        borderColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderStyle: 'dashed',
    },
    radiusLabelContainer: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginTop: -12,
    },
    radiusLabel: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    centerPin: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -20, // offset for pin height
    },
    pinShadow: {
        width: 10,
        height: 4,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 2,
        marginTop: 2,
    },
    gpsButton: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        backgroundColor: COLORS.bgTertiary,
        padding: 12,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    addressBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: COLORS.bgTertiary,
        padding: 16,
        borderRadius: 12,
        marginBottom: SPACING.lg,
    },
    addressText: {
        color: COLORS.textPrimary,
        fontSize: 16,
        fontWeight: '500',
        flex: 1,
    },
    addressInput: {
        color: COLORS.textPrimary,
        fontSize: 16,
        fontWeight: '500',
        flex: 1,
        padding: 0,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.textTertiary,
        marginBottom: SPACING.sm,
        letterSpacing: 1,
    },
    radiusSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.lg,
    },
    radiusBtn: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: COLORS.bgTertiary,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    radiusBtnActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    radiusBtnText: {
        color: COLORS.textSecondary,
        fontSize: 14,
        fontWeight: '600',
    },
    radiusBtnTextActive: {
        color: '#fff',
    },
    zoomControls: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        gap: 8,
    },
    zoomBtn: {
        backgroundColor: COLORS.bgTertiary,
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    confirmBtn: {
        backgroundColor: COLORS.success,
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    confirmBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default PartnerLocationSelect;
