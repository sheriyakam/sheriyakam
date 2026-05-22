import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform, ActivityIndicator } from 'react-native';
import { MapPin, X, Navigation } from 'lucide-react-native';
import { COLORS } from '../constants/theme';
import { mapplsService } from '../services/mapplsService';

const LocationMap = ({
    region,
    onRegionChangeComplete,
    onClose,
    addressText,
    onConfirm,
    onRequestCurrentLocation
}) => {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const [mapReady, setMapReady] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const leafletLoaded = useRef(false);
    const mapplsLoaded = useRef(false);

    // Determine MapmyIndia configurations
    const mapSdkKey = process.env.EXPO_PUBLIC_MAPMYINDIA_MAP_SDK_KEY || process.env.EXPO_PUBLIC_MAPMYINDIA_ACCESS_TOKEN;
    const useMappls = !!mapSdkKey;

    // Dynamic style injection for premium glassmorphism and pulsing markers
    useEffect(() => {
        if (Platform.OS === 'web' && !document.getElementById('premium-location-styles')) {
            const style = document.createElement('style');
            style.id = 'premium-location-styles';
            style.innerHTML = `
                .premium-center-pin {
                    position: relative;
                    width: 36px;
                    height: 42px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-end;
                    transform-origin: bottom center;
                    transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .premium-center-pin.lifted {
                    transform: translateY(-16px) scale(1.05);
                }
                .premium-center-pin.dropped {
                    transform: translateY(0) scale(1);
                    animation: premium-drop-bounce 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }
                @keyframes premium-drop-bounce {
                    0% { transform: translateY(-16px) scale(1.05); }
                    50% { transform: translateY(2px) scale(0.95); }
                    75% { transform: translateY(-3px) scale(1.02); }
                    100% { transform: translateY(0) scale(1); }
                }
                .premium-pin-icon {
                    position: relative;
                    z-index: 2;
                    filter: drop-shadow(0 4px 8px rgba(99, 102, 241, 0.4));
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
                    transition: all 0.25s ease;
                    z-index: 1;
                    pointer-events: none;
                }
                .premium-center-pin.lifted .premium-pin-pulse {
                    transform: translateX(-50%) scale(0.5);
                    opacity: 0.3;
                    box-shadow: 0 0 4px 1px rgba(99, 102, 241, 0.2);
                }
                .premium-glass-header {
                    background-color: rgba(255, 255, 255, 0.85) !important;
                    backdrop-filter: blur(20px) saturate(190%) !important;
                    -webkit-backdrop-filter: blur(20px) saturate(190%) !important;
                    border-bottom: 1px solid rgba(0, 0, 0, 0.08) !important;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04) !important;
                }
                .premium-glass-footer {
                    background-color: rgba(255, 255, 255, 0.85) !important;
                    backdrop-filter: blur(20px) saturate(190%) !important;
                    -webkit-backdrop-filter: blur(20px) saturate(190%) !important;
                    border-top: 1px solid rgba(0, 0, 0, 0.08) !important;
                    box-shadow: 0 -8px 32px 0 rgba(0, 0, 0, 0.06) !important;
                }
                .premium-glass-button {
                    background-color: rgba(255, 255, 255, 0.85) !important;
                    backdrop-filter: blur(10px) !important;
                    -webkit-backdrop-filter: blur(10px) !important;
                    border: 1px solid rgba(0, 0, 0, 0.05) !important;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
                    transition: all 0.2s ease-in-out !important;
                }
                .premium-glass-button:hover {
                    transform: translateY(-2px) !important;
                    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12) !important;
                    background-color: rgba(255, 255, 255, 0.95) !important;
                }
                .premium-glass-button:active {
                    transform: translateY(0) !important;
                }
            `;
            document.head.appendChild(style);
        }
    }, []);

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

            if (!document.getElementById('leaflet-css-sdk')) {
                const css = document.createElement('link');
                css.id = 'leaflet-css-sdk';
                css.rel = 'stylesheet';
                css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                css.crossOrigin = '';
                document.head.appendChild(css);
            }

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

    // ── Initialize Map ───────────────────────────────────────────────────────
    useEffect(() => {
        const initMap = async () => {
            const startLat = region?.latitude || 11.7481;
            const startLng = region?.longitude || 75.4894;

            if (useMappls) {
                await loadMappls();
                await new Promise(r => setTimeout(r, 200));

                const container = document.getElementById('location-map-container');
                if (!container || mapInstanceRef.current) return;

                const mapplsClass = window.mappls;
                if (!mapplsClass) return;

                const map = new mapplsClass.Map(container, {
                    center: { lat: startLat, lng: startLng },
                    zoom: 15,
                    zoomControl: false // Disable zoom control for cleaner UI
                });

                // Listen to move/drag end events to update coordinates and animation
                map.addListener('movestart', () => {
                    setIsDragging(true);
                });

                map.addListener('moveend', () => {
                    setIsDragging(false);
                    const center = map.getCenter();
                    if (onRegionChangeComplete && center) {
                        onRegionChangeComplete({
                            latitude: center.lat,
                            longitude: center.lng,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01
                        });
                    }
                });

                mapInstanceRef.current = map;
                setMapReady(true);
            } else {
                await loadLeaflet();
                await new Promise(r => setTimeout(r, 200));

                const container = document.getElementById('location-map-container');
                if (!container || mapInstanceRef.current) return;

                const L = window.L;

                const map = L.map(container, {
                    center: [startLat, startLng],
                    zoom: 15,
                    zoomControl: false,
                    attributionControl: false
                });

                L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                    maxZoom: 19,
                    attribution: '© CartoDB'
                }).addTo(map);

                // Listen to map dragging / zoom finishes
                map.on('movestart', () => {
                    setIsDragging(true);
                });

                map.on('moveend', () => {
                    setIsDragging(false);
                    const center = map.getLatLng ? map.getLatLng() : map.getCenter();
                    if (onRegionChangeComplete && center) {
                        onRegionChangeComplete({
                            latitude: center.lat,
                            longitude: center.lng,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01
                        });
                    }
                });

                mapInstanceRef.current = map;
                setMapReady(true);
                setTimeout(() => map.invalidateSize(), 300);
            }
        };

        initMap();

        return () => {
            if (mapInstanceRef.current) {
                try {
                    mapInstanceRef.current.remove();
                } catch (e) {
                    console.log('Error cleaning up location map:', e);
                }
                mapInstanceRef.current = null;
            }
            setMapReady(false);
        };
    }, [useMappls]);

    // ── Sync External Region Updates (like GPS buttons) ─────────────────────
    useEffect(() => {
        if (!mapInstanceRef.current || !region || !mapReady) return;

        const map = mapInstanceRef.current;
        if (useMappls) {
            const currentCenter = map.getCenter();
            // Avoid infinite loops by checking threshold
            if (Math.abs(currentCenter.lat - region.latitude) > 0.0001 || 
                Math.abs(currentCenter.lng - region.longitude) > 0.0001) {
                map.setCenter({ lat: region.latitude, lng: region.longitude });
            }
        } else {
            const currentCenter = map.getCenter();
            if (Math.abs(currentCenter.lat - region.latitude) > 0.0001 || 
                Math.abs(currentCenter.lng - region.longitude) > 0.0001) {
                map.setView([region.latitude, region.longitude], 15, { animate: true });
            }
        }
    }, [region?.latitude, region?.longitude, mapReady]);

    return (
        <View style={styles.mapContainer}>
            {/* Web Map Element */}
            <View style={styles.mapWrap}>
                <div
                    id="location-map-container"
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                />

                {!mapReady && (
                    <View style={styles.mapLoading}>
                        <ActivityIndicator size="large" color={COLORS.accent} />
                        <Text style={styles.mapLoadingText}>Loading map...</Text>
                    </View>
                )}

                {/* Fixed Center Marker */}
                {mapReady && (
                    <View style={styles.centerMarker} pointerEvents="none">
                        <div className={`premium-center-pin ${isDragging ? 'lifted' : 'dropped'}`}>
                            <div className="premium-pin-pulse"></div>
                            <div className="premium-pin-icon">
                                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="#6366f1" fill-opacity="0.25" stroke="#6366f1" stroke-width="2.5" stroke-linejoin="round"/>
                                    <circle cx="12" cy="10" r="3" fill="#6366f1"/>
                                </svg>
                            </div>
                        </div>
                    </View>
                )}
            </View>

            {/* Map Header */}
            <View style={styles.mapHeader} className="premium-glass-header">
                <TouchableOpacity onPress={onClose} style={styles.backBtn} className="premium-glass-button">
                    <X size={20} color="#1e293b" />
                </TouchableOpacity>
                <Text style={styles.mapTitle}>Pin Location ({useMappls ? 'Mappls' : 'OpenStreetMap'})</Text>
            </View>

            {/* Map Footer */}
            <View style={styles.mapFooter} className="premium-glass-footer">
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
                    className="premium-glass-button"
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
        backgroundColor: '#fff',
    },
    mapWrap: {
        flex: 1,
        position: 'relative',
    },
    mapLoading: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    mapLoadingText: {
        marginTop: 12,
        color: '#666',
        fontSize: 14,
    },
    centerMarker: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -18,
        marginTop: -42,
        zIndex: 1000,
        pointerEvents: 'none',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    mapHeader: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 16,
        zIndex: 1001,
    },
    backBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
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
        padding: 24,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        zIndex: 1001,
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
        shadowRadius: 10,
        elevation: 6,
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
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default LocationMap;
