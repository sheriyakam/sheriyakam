import React, { useState, useEffect, useRef } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    ActivityIndicator,
    Alert,
    Platform,
    Dimensions
} from 'react-native';
import { X, MapPin, Navigation, Search, Check } from 'lucide-react-native';
import * as Location from 'expo-location';
import { COLORS, SPACING } from '../constants/theme';
import LocationMap from './LocationMap';

const MOCK_CITIES = [
    "Calicut, Kerala",
    "Kochi, Kerala",
    "Trivandrum, Kerala",
    "Kannur, Kerala",
    "Thrissur, Kerala",
    "Malappuram, Kerala"
];

const { width, height } = Dimensions.get('window');

const LocationModal = ({ visible, onClose, onLocationSelect, currentLocation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isLocating, setIsLocating] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [mapRegion, setMapRegion] = useState(null);
    const [selectedCoord, setSelectedCoord] = useState(null);
    const [addressText, setAddressText] = useState('');
    const mapRef = useRef(null);

    // Initial region: Calicut
    const DEFAULT_REGION = {
        latitude: 11.2588,
        longitude: 75.7804,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };

    useEffect(() => {
        if (visible && currentLocation) {
            const region = {
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            };
            setMapRegion(region);
            setSelectedCoord(currentLocation);
        } else if (visible && !mapRegion) {
            setMapRegion(DEFAULT_REGION);
        }
    }, [visible, currentLocation]);

    const filteredCities = MOCK_CITIES.filter(city =>
        city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCurrentLocation = async () => {
        setIsLocating(true);
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Permission to access location was denied');
                setIsLocating(false);
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            const coords = location.coords;

            // If map is shown, move to location
            if (showMap && mapRef.current) {
                const newRegion = {
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                };
                mapRef.current.animateToRegion(newRegion, 1000);
                setMapRegion(newRegion);
                setSelectedCoord(coords);
                await fetchAddressForCoords(coords);
            } else {
                // If list view, just select and close
                let address = await Location.reverseGeocodeAsync({
                    latitude: coords.latitude,
                    longitude: coords.longitude
                });

                if (address && address.length > 0) {
                    const addr = address[0];
                    const city = addr.city || addr.subregion || addr.district;
                    const region = addr.region || addr.country;
                    const locationString = city ? `${city}, ${region}` : "Current Location";
                    onLocationSelect(locationString);
                    onClose();
                }
            }

        } catch (error) {
            Alert.alert('Error', 'Could not fetch location');
        } finally {
            setIsLocating(false);
        }
    };

    const fetchAddressForCoords = async (coords) => {
        try {
            let address = await Location.reverseGeocodeAsync({
                latitude: coords.latitude,
                longitude: coords.longitude
            });
            if (address && address.length > 0) {
                const addr = address[0];
                const street = addr.street || addr.name;
                const city = addr.city || addr.subregion;
                setAddressText(street ? `${street}, ${city}` : city);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const handleConfirmMapLocation = () => {
        if (addressText) {
            onLocationSelect(addressText);
        } else {
            onLocationSelect("Selected Location");
        }
        setShowMap(false);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                {showMap ? (
                    <LocationMap
                        region={mapRegion}
                        onRegionChangeComplete={(region) => {
                            setMapRegion(region);
                            setSelectedCoord({ latitude: region.latitude, longitude: region.longitude });
                            fetchAddressForCoords({ latitude: region.latitude, longitude: region.longitude });
                        }}
                        onClose={() => setShowMap(false)}
                        addressText={addressText}
                        onConfirm={handleConfirmMapLocation}
                        onRequestCurrentLocation={handleCurrentLocation}
                    />


                ) : (
                    <View style={styles.container}>
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.title}>Select Location</Text>
                            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                                <X size={24} color={COLORS.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        {/* Search Bar */}
                        <View style={styles.searchContainer}>
                            <Search size={20} color={COLORS.textTertiary} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search for your city..."
                                placeholderTextColor={COLORS.textTertiary}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>

                        {/* Current Location Option */}
                        <TouchableOpacity
                            style={styles.optionItem}
                            onPress={handleCurrentLocation}
                            disabled={isLocating}
                        >
                            <View style={[styles.iconBox, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                                {isLocating ? (
                                    <ActivityIndicator size="small" color={COLORS.accent} />
                                ) : (
                                    <Navigation size={20} color={COLORS.accent} fill={COLORS.accent} />
                                )}
                            </View>
                            <View>
                                <Text style={[styles.optionTitle, { color: COLORS.accent }]}>
                                    {isLocating ? 'Locating...' : 'Use Current Location'}
                                </Text>
                                <Text style={styles.optionSubtitle}>Using GPS</Text>
                            </View>
                        </TouchableOpacity>

                        {/* Map Selection Option */}
                        <TouchableOpacity
                            style={styles.optionItem}
                            onPress={() => {
                                if (Platform.OS === 'web') {
                                    Alert.alert('Not Supported', 'Map selection is currently available only on the mobile app.');
                                    return;
                                }
                                setShowMap(true);
                            }}
                        >
                            <View style={[styles.iconBox, { backgroundColor: 'rgba(255, 255, 255, 0.05)' }]}>
                                <MapPin size={20} color={COLORS.textPrimary} />
                            </View>
                            <View>
                                <Text style={styles.optionTitle}>Select on Map</Text>
                                <Text style={styles.optionSubtitle}>Pin your exact location</Text>
                            </View>
                        </TouchableOpacity>

                        <Text style={styles.sectionTitle}>SUGGESTED CITIES</Text>

                        {/* City List */}
                        {filteredCities.map((city, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.cityItem}
                                onPress={() => {
                                    onLocationSelect(city);
                                    onClose();
                                }}
                            >
                                <MapPin size={16} color={COLORS.textTertiary} />
                                <Text style={styles.cityText}>{city}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>
        </Modal >
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: '#18181b',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: SPACING.lg,
        maxHeight: '80%',
    },
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
        color: '#000', // Map header usually clean/light
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    closeBtn: {
        padding: 4,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
        marginBottom: SPACING.lg,
        gap: 12,
    },
    searchInput: {
        flex: 1,
        color: COLORS.textPrimary,
        fontSize: 16,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        paddingVertical: 12,
        marginBottom: 8,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: 2,
    },
    optionSubtitle: {
        fontSize: 12,
        color: COLORS.textTertiary,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.textTertiary,
        marginTop: SPACING.lg,
        marginBottom: SPACING.md,
        letterSpacing: 1,
    },
    cityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    cityText: {
        color: COLORS.textSecondary,
        fontSize: 16,
    },
});

export default LocationModal;
