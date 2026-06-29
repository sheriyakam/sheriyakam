/**
 * MapPickerModal.web.js — Interactive Web Map Picker
 * Customer can:
 *   1. Use GPS to auto-detect location
 *   2. Search by area name (Mappls Autosuggest / Nominatim)
 *   3. Click directly on the interactive map (Mappls / Leaflet) to set/move pin
 *   4. Drag the marker to correct coordinates
 * Supports Mappls (MapmyIndia) Map SDK + APIs when credentials are configured.
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, Modal,
    ActivityIndicator, TextInput, Platform
} from 'react-native';
import { X, Navigation, Search, CheckCircle, MapPin, Crosshair } from 'lucide-react-native';
import { COLORS, SPACING } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { mapplsService } from '../services/mapplsService';

const CUSTOM_PIN_HTML = `
    <div class="premium-pin-wrapper">
        <div class="premium-pin-pulse"></div>
        <div class="premium-pin-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="#4f46e5" fill-opacity="0.25" stroke="#4f46e5" stroke-width="2.5" stroke-linejoin="round"/>
                <circle cx="12" cy="10" r="3" fill="#4f46e5"/>
            </svg>
        </div>
    </div>
`;

export default function MapPickerModal({ visible, onClose, onSelect, initialLat, initialLng }) {
    const { theme, colors } = useTheme();
    const isDark = theme === 'dark';
    // Default center: Kerala (Thalassery)
    const [pin, setPin] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [error, setError] = useState('');
    const [mapReady, setMapReady] = useState(false);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);
    const leafletLoaded = useRef(false);
    const mapplsLoaded = useRef(false);

    // Dynamic style injection for premium glassmorphism and pulsing markers
    useEffect(() => {
        if (Platform.OS === 'web' && !document.getElementById('premium-map-styles')) {
            const style = document.createElement('style');
            style.id = 'premium-map-styles';
            style.innerHTML = `
                .premium-pin-wrapper {
                    position: relative;
                    width: 36px;
                    height: 42px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-end;
                }
                .premium-pin-icon {
                    position: relative;
                    z-index: 2;
                    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.25));
                    transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .premium-pin-icon:hover {
                    transform: translateY(-4px);
                }
                .premium-pin-pulse {
                    position: absolute;
                    bottom: 0px;
                    left: 18px;
                    transform: translateX(-50%);
                    width: 24px;
                    height: 8px;
                    border-radius: 50%;
                    background: rgba(99, 102, 241, 0.2);
                    box-shadow: 0 0 8px 3px rgba(99, 102, 241, 0.4);
                    animation: premium-marker-pulse 1.8s infinite ease-out;
                    z-index: 1;
                    pointer-events: none;
                }
                @keyframes premium-marker-pulse {
                    0% {
                        transform: translateX(-50%) scale(0.2);
                        opacity: 1;
                    }
                    80% {
                        transform: translateX(-50%) scale(1.6);
                        opacity: 0;
                    }
                    100% {
                        opacity: 0;
                    }
                }
                .premium-glass-header {
                    background-color: rgba(255, 255, 255, 0.85) !important;
                    backdrop-filter: blur(20px) saturate(190%) !important;
                    -webkit-backdrop-filter: blur(20px) saturate(190%) !important;
                    border-bottom: 1px solid rgba(0, 0, 0, 0.08) !important;
                }
                .premium-glass-footer {
                    background-color: rgba(255, 255, 255, 0.85) !important;
                    backdrop-filter: blur(20px) saturate(190%) !important;
                    -webkit-backdrop-filter: blur(20px) saturate(190%) !important;
                    border-top: 1px solid rgba(0, 0, 0, 0.08) !important;
                    box-shadow: 0 -8px 32px 0 rgba(0, 0, 0, 0.06) !important;
                }
                .custom-mappicker-pin {
                    background: none !important;
                    border: none !important;
                    box-shadow: none !important;
                }
            `;
            document.head.appendChild(style);
        }
    }, []);

    // Determine if Mappls Map JS SDK is available/configured
    const mapSdkKey = process.env.EXPO_PUBLIC_MAPMYINDIA_MAP_SDK_KEY || process.env.EXPO_PUBLIC_MAPMYINDIA_ACCESS_TOKEN;
    const useMappls = !!mapSdkKey;

    // Set initial pin coordinates if provided
    useEffect(() => {
        if (visible) {
            if (initialLat && initialLng) {
                setPin({
                    latitude: initialLat,
                    longitude: initialLng,
                    address: ''
                });
            } else {
                setPin(null);
            }
        }
    }, [visible, initialLat, initialLng]);

    // ── Load Mappls Web Map SDK ──────────────────────────────────────────────
    const loadMappls = useCallback(() => {
        return new Promise((resolve) => {
            if (mapplsLoaded.current && window.mappls) {
                resolve();
                return;
            }

            if (!document.getElementById('mappls-js-sdk')) {
                const script = document.createElement('script');
                script.id = 'mappls-js-sdk';
                script.src = `https://apis.mappls.com/advancedmaps/api/${mapSdkKey}/map_sdk?v=3.0&layer=vector`;
                script.crossOrigin = '';
                script.onload = () => {
                    mapplsLoaded.current = true;
                    resolve();
                };
                document.head.appendChild(script);
            } else if (window.mappls) {
                mapplsLoaded.current = true;
                resolve();
            } else {
                const existing = document.getElementById('mappls-js-sdk');
                existing.addEventListener('load', () => {
                    mapplsLoaded.current = true;
                    resolve();
                });
            }
        });
    }, [mapSdkKey]);

    // ── Load Leaflet CSS + JS dynamically ────────────────────────────────────
    const loadLeaflet = useCallback(() => {
        return new Promise((resolve) => {
            if (leafletLoaded.current && window.L) {
                resolve();
                return;
            }

            // Load CSS
            if (!document.getElementById('leaflet-css-sdk')) {
                const css = document.createElement('link');
                css.id = 'leaflet-css-sdk';
                css.rel = 'stylesheet';
                css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                css.crossOrigin = '';
                document.head.appendChild(css);
            }

            // Load JS
            if (!document.getElementById('leaflet-js-sdk')) {
                const script = document.createElement('script');
                script.id = 'leaflet-js-sdk';
                script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                script.crossOrigin = '';
                script.onload = () => {
                    leafletLoaded.current = true;
                    resolve();
                };
                document.head.appendChild(script);
            } else if (window.L) {
                leafletLoaded.current = true;
                resolve();
            } else {
                const existing = document.getElementById('leaflet-js-sdk');
                existing.addEventListener('load', () => {
                    leafletLoaded.current = true;
                    resolve();
                });
            }
        });
    }, []);

    // ── Initialize map when modal becomes visible ────────────────────────────
    useEffect(() => {
        if (!visible) {
            // Cleanup map on close
            if (mapInstanceRef.current) {
                try {
                    mapInstanceRef.current.remove();
                } catch (e) {
                    console.log('Error removing map instance:', e);
                }
                mapInstanceRef.current = null;
                markerRef.current = null;
            }
            setMapReady(false);
            return;
        }

        const initMap = async () => {
            const defaultLat = pin?.latitude || 11.7481;
            const defaultLng = pin?.longitude || 75.4894;

            if (useMappls) {
                // Initialize MapmyIndia / Mappls
                await loadMappls();
                await new Promise(r => setTimeout(r, 200));

                const container = document.getElementById('leaflet-map-container');
                if (!container || mapInstanceRef.current) return;

                const mapplsClass = window.mappls;
                if (!mapplsClass) return;

                const map = new mapplsClass.Map(container, {
                    center: { lat: defaultLat, lng: defaultLng },
                    zoom: 13,
                    zoomControl: true
                });

                // Set up marker if we have a coordinate
                let marker = null;
                if (pin) {
                    marker = new mapplsClass.Marker({
                        map: map,
                        position: { lat: pin.latitude, lng: pin.longitude },
                        draggable: true,
                        html: CUSTOM_PIN_HTML,
                        width: 36,
                        height: 42,
                        offset: [0, -21]
                    });

                    marker.addListener('dragend', async () => {
                        const pos = marker.getPosition();
                        setLoading(true);
                        const addr = await reverseGeocode(pos.lat, pos.lng);
                        setPin({ latitude: pos.lat, longitude: pos.lng, address: addr });
                        setLoading(false);
                    });
                    markerRef.current = marker;
                }

                // Add map click listener
                map.addListener('click', async (e) => {
                    const lat = e.lngLat?.lat || e.latLng?.lat || e.latlng?.lat;
                    const lng = e.lngLat?.lng || e.latLng?.lng || e.latlng?.lng;
                    if (!lat || !lng) return;

                    if (markerRef.current) {
                        markerRef.current.setPosition({ lat, lng });
                    } else {
                        const newMarker = new mapplsClass.Marker({
                            map: map,
                            position: { lat, lng },
                            draggable: true,
                            html: CUSTOM_PIN_HTML,
                            width: 36,
                            height: 42,
                            offset: [0, -21]
                        });
                        newMarker.addListener('dragend', async () => {
                            const pos = newMarker.getPosition();
                            setLoading(true);
                            const addr = await reverseGeocode(pos.lat, pos.lng);
                            setPin({ latitude: pos.lat, longitude: pos.lng, address: addr });
                            setLoading(false);
                        });
                        markerRef.current = newMarker;
                    }

                    setLoading(true);
                    const addr = await reverseGeocode(lat, lng);
                    setPin({ latitude: lat, longitude: lng, address: addr });
                    setLoading(false);
                });

                mapInstanceRef.current = map;
                setMapReady(true);
            } else {
                // Initialize OpenStreetMap (Leaflet)
                await loadLeaflet();
                await new Promise(r => setTimeout(r, 200));

                const container = document.getElementById('leaflet-map-container');
                if (!container || mapInstanceRef.current) return;

                const L = window.L;

                const map = L.map(container, {
                    center: [defaultLat, defaultLng],
                    zoom: 13,
                    zoomControl: true,
                    attributionControl: false,
                });

                L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                    maxZoom: 19,
                    attribution: '© CartoDB'
                }).addTo(map);

                const markerIcon = L.divIcon({
                    className: 'custom-mappicker-pin',
                    html: CUSTOM_PIN_HTML,
                    iconSize: [36, 42],
                    iconAnchor: [18, 42]
                });

                if (pin) {
                    const marker = L.marker([pin.latitude, pin.longitude], { icon: markerIcon, draggable: true }).addTo(map);
                    marker.bindPopup('📍 Service Location').openPopup();
                    marker.on('dragend', async (e) => {
                        const { lat, lng } = e.target.getLatLng();
                        setLoading(true);
                        const addr = await reverseGeocode(lat, lng);
                        setPin({ latitude: lat, longitude: lng, address: addr });
                        setLoading(false);
                    });
                    markerRef.current = marker;
                }

                map.on('click', async (e) => {
                    const { lat, lng } = e.latlng;

                    if (markerRef.current) {
                        markerRef.current.setLatLng([lat, lng]);
                    } else {
                        const marker = L.marker([lat, lng], { icon: markerIcon, draggable: true }).addTo(map);
                        marker.bindPopup('📍 Service Location').openPopup();
                        marker.on('dragend', async (ev) => {
                            const pos = ev.target.getLatLng();
                            setLoading(true);
                            const addr = await reverseGeocode(pos.lat, pos.lng);
                            setPin({ latitude: pos.lat, longitude: pos.lng, address: addr });
                            setLoading(false);
                        });
                        markerRef.current = marker;
                    }

                    setLoading(true);
                    const addr = await reverseGeocode(lat, lng);
                    setPin({ latitude: lat, longitude: lng, address: addr });
                    setLoading(false);
                });

                mapInstanceRef.current = map;
                setMapReady(true);
                setTimeout(() => map.invalidateSize(), 300);
            }
        };

        initMap();
    }, [visible, useMappls]);

    // ── Sync map marker position when coordinate changes from search or GPS ──
    useEffect(() => {
        if (!mapInstanceRef.current || !pin) return;

        if (useMappls) {
            const map = mapInstanceRef.current;
            const mapplsClass = window.mappls;
            if (!mapplsClass) return;

            map.setCenter({ lat: pin.latitude, lng: pin.longitude });
            map.setZoom(16);

            if (markerRef.current) {
                markerRef.current.setPosition({ lat: pin.latitude, lng: pin.longitude });
            } else {
                const marker = new mapplsClass.Marker({
                    map: map,
                    position: { lat: pin.latitude, lng: pin.longitude },
                    draggable: true,
                    html: CUSTOM_PIN_HTML,
                    width: 36,
                    height: 42,
                    offset: [0, -21]
                });
                marker.addListener('dragend', async () => {
                    const pos = marker.getPosition();
                    setLoading(true);
                    const addr = await reverseGeocode(pos.lat, pos.lng);
                    setPin({ latitude: pos.lat, longitude: pos.lng, address: addr });
                    setLoading(false);
                });
                markerRef.current = marker;
            }
        } else {
            if (!window.L) return;
            const map = mapInstanceRef.current;
            const L = window.L;

            map.setView([pin.latitude, pin.longitude], 16, { animate: true });

            const markerIcon = L.divIcon({
                className: 'custom-mappicker-pin',
                html: CUSTOM_PIN_HTML,
                iconSize: [36, 42],
                iconAnchor: [18, 42]
            });

            if (markerRef.current) {
                markerRef.current.setLatLng([pin.latitude, pin.longitude]);
            } else {
                const marker = L.marker([pin.latitude, pin.longitude], { icon: markerIcon, draggable: true }).addTo(map);
                marker.bindPopup('📍 Service Location').openPopup();
                marker.on('dragend', async (ev) => {
                    const pos = ev.target.getLatLng();
                    setLoading(true);
                    const addr = await reverseGeocode(pos.lat, pos.lng);
                    setPin({ latitude: pos.lat, longitude: pos.lng, address: addr });
                    setLoading(false);
                });
                markerRef.current = marker;
            }
        }
    }, [pin?.latitude, pin?.longitude]);

    // ── GPS Web Auto-detect ──────────────────────────────────────────────────
    const handleGPS = async () => {
        setLoading(true);
        setError('');

        if (!navigator?.geolocation) {
            setError('GPS not available in this browser. Please search for your area name below.');
            setLoading(false);
            return;
        }

        let permState = 'prompt';
        try {
            const perm = await navigator.permissions.query({ name: 'geolocation' });
            permState = perm.state;
        } catch { /* proceed */ }

        if (permState === 'denied') {
            setError('Location is blocked. Click the 🔒 lock icon in the browser address bar → set Location to "Allow" → refresh.');
            setLoading(false);
            return;
        }

        const tryGetPosition = (options) =>
            new Promise((resolve, reject) =>
                navigator.geolocation.getCurrentPosition(resolve, reject, options)
            );

        try {
            let pos;
            try {
                pos = await tryGetPosition({ enableHighAccuracy: true, timeout: 8000 });
            } catch {
                pos = await tryGetPosition({ enableHighAccuracy: false, timeout: 10000 });
            }

            const { latitude, longitude } = pos.coords;
            const addr = await reverseGeocode(latitude, longitude);
            setPin({ latitude, longitude, address: addr });
        } catch (err) {
            if (err.code === 1) {
                setError('Location is blocked. Click the 🔒 lock icon in the browser address bar → set Location to "Allow" → refresh.');
            } else {
                setError('Could not detect location. Your device GPS may be off. Try searching your area name below.');
            }
        } finally {
            setLoading(false);
        }
    };

    // ── Reverse Geocode (Mappls / Nominatim) ─────────────────────────────────
    const reverseGeocode = async (lat, lng) => {
        if (mapplsService.isConfigured()) {
            const addr = await mapplsService.reverseGeocode(lat, lng);
            if (addr) return addr;
        }
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

    // ── Forward Search (Mappls / Nominatim) ──────────────────────────────────
    const handleSearch = async () => {
        if (!searchText.trim()) return;
        setLoading(true);
        setError('');
        try {
            if (mapplsService.isConfigured()) {
                const results = await mapplsService.searchPlaces(searchText);
                if (results && results.length > 0) {
                    setPin(results[0]);
                    setLoading(false);
                    return;
                }
            }

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

    const handleConfirm = () => {
        if (pin) {
            onSelect(pin);
            onClose();
        }
    };

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
            <View style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
                {/* Header */}
                <View style={[styles.header, { backgroundColor: colors.bgSecondary, borderBottomColor: colors.border }]} className="premium-glass-header">
                    <TouchableOpacity style={styles.iconBtn} className="premium-glass-button" onPress={onClose}>
                        <X size={20} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: colors.textPrimary }]}>Select Location ({useMappls ? 'Mappls' : 'OpenStreetMap'})</Text>
                    <TouchableOpacity style={styles.iconBtn} className="premium-glass-button" onPress={handleGPS}>
                        <Crosshair size={18} color={colors.accent} />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={[styles.searchBar, { backgroundColor: colors.bgPrimary, borderBottomColor: colors.border }]}>
                    <View style={styles.searchRow}>
                        <TextInput
                            style={[styles.input, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.bgSecondary }]}
                            placeholder="Search area: Thalassery, Kannur, Mahe..."
                            placeholderTextColor={colors.textTertiary}
                            value={searchText}
                            onChangeText={setSearchText}
                            onSubmitEditing={handleSearch}
                            returnKeyType="search"
                        />
                        <TouchableOpacity style={[styles.searchBtn, { backgroundColor: colors.accent }]} onPress={handleSearch} disabled={loading}>
                            <Search size={18} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={[styles.gpsBtn, { backgroundColor: colors.accent }]} onPress={handleGPS} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <>
                                <Navigation size={14} color="#fff" />
                                <Text style={styles.gpsBtnText}>Use My Current Location</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                {error ? <Text style={styles.error}>{error}</Text> : null}

                {/* Interactive Map Container */}
                <View style={styles.mapWrap}>
                    <div
                        id="leaflet-map-container"
                        style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: 0,
                        }}
                    />
                    {!mapReady && (
                        <View style={[styles.mapLoading, { backgroundColor: colors.bgPrimary }]}>
                            <ActivityIndicator size="large" color={colors.accent} />
                            <Text style={[styles.mapLoadingText, { color: colors.textSecondary }]}>Loading {useMappls ? 'MapmyIndia' : 'OpenStreetMap'} Map...</Text>
                        </View>
                    )}
                    {mapReady && !pin && (
                        <View style={styles.mapHint}>
                            <MapPin size={14} color="#fff" />
                            <Text style={styles.mapHintText}>Tap on the map to set your location</Text>
                        </View>
                    )}
                </View>

                {/* Bottom Sheet */}
                <View style={[styles.footer, { backgroundColor: colors.bgSecondary, borderTopColor: colors.border }]} className="premium-glass-footer">
                    {loading ? (
                        <View style={styles.addressRow}>
                            <ActivityIndicator color={colors.accent} size="small" />
                            <Text style={[styles.addressLoading, { color: colors.textSecondary }]}>Resolving address...</Text>
                        </View>
                    ) : pin ? (
                        <View style={styles.addressBox}>
                            <CheckCircle size={16} color={colors.success} />
                            <Text style={[styles.addressText, { color: colors.textPrimary }]} numberOfLines={2}>{pin.address || 'Location coordinates pinned'}</Text>
                        </View>
                    ) : (
                        <Text style={[styles.placeholderText, { color: colors.textTertiary }]}>Tap on the map or use GPS to pick your location</Text>
                    )}
                    <TouchableOpacity
                        style={[styles.confirmBtn, { backgroundColor: colors.accent }, (!pin || loading) && { backgroundColor: colors.bgTertiary, opacity: 0.5 }]}
                        onPress={handleConfirm}
                        disabled={!pin || loading}
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
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        backgroundColor: COLORS.bgPrimary,
    },
    iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    title: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
    searchBar: {
        padding: 12,
        gap: 8,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        backgroundColor: COLORS.bgPrimary,
    },
    searchRow: { flexDirection: 'row', gap: 8 },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 10,
        padding: 10,
        color: COLORS.textPrimary,
        fontSize: 14,
        backgroundColor: COLORS.bgSecondary,
    },
    searchBtn: {
        width: 44,
        backgroundColor: COLORS.accent,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    gpsBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: COLORS.accent,
        padding: 10,
        borderRadius: 10,
    },
    gpsBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
    error: { color: COLORS.danger, fontSize: 13, textAlign: 'center', paddingHorizontal: 16, paddingVertical: 6 },
    mapWrap: {
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
    },
    mapLoading: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.bgPrimary,
    },
    mapLoadingText: {
        marginTop: 12,
        color: COLORS.textTertiary,
        fontSize: 13,
    },
    mapHint: {
        position: 'absolute',
        top: 16,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 24,
        zIndex: 1000,
    },
    mapHintText: { color: '#fff', fontSize: 13, fontWeight: '600' },
    footer: {
        padding: 16,
        gap: 10,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        backgroundColor: COLORS.bgPrimary,
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    addressLoading: {
        fontSize: 13,
        color: COLORS.textTertiary,
    },
    addressBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        backgroundColor: 'rgba(16,185,129,0.08)',
        borderWidth: 1,
        borderColor: 'rgba(16,185,129,0.3)',
        borderRadius: 10,
        padding: 10,
    },
    addressText: { flex: 1, fontSize: 13, color: COLORS.textSecondary, lineHeight: 18 },
    placeholderText: {
        fontSize: 13,
        color: COLORS.textTertiary,
        textAlign: 'center',
        paddingVertical: 4,
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
