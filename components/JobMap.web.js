/**
 * JobMap.web.js — Web version (no react-native-maps on web)
 * Uses premium Leaflet (CartoDB Voyager) or Mappls Map JS SDK
 * Shows customer location with custom pulsing pin + "Open in Maps" button
 */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Platform, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants/theme';
import { MapPin, Navigation } from 'lucide-react-native';

const CUSTOM_PIN_HTML = `
    <div class="premium-pin-wrapper-job">
        <div class="premium-pin-pulse-job"></div>
        <div class="premium-pin-icon-job">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="#6366f1" fill-opacity="0.25" stroke="#6366f1" stroke-width="2.5" stroke-linejoin="round"/>
                <circle cx="12" cy="10" r="3" fill="#6366f1"/>
            </svg>
        </div>
    </div>
`;

export default function JobMap({ latitude, longitude, customer, service, address }) {
    const custLat = latitude || 11.2588;
    const custLng = longitude || 75.7804;

    const mapInstanceRef = useRef(null);
    const [mapReady, setMapReady] = useState(false);
    const leafletLoaded = useRef(false);
    const mapplsLoaded = useRef(false);

    // Determine MapmyIndia configurations
    const mapSdkKey = process.env.EXPO_PUBLIC_MAPMYINDIA_MAP_SDK_KEY || process.env.EXPO_PUBLIC_MAPMYINDIA_ACCESS_TOKEN;
    const useMappls = !!mapSdkKey;

    const query = address
        ? encodeURIComponent(`${address}, Kerala, India`)
        : `${custLat},${custLng}`;

    // Dynamic style injection for premium glassmorphism and pulsing markers
    useEffect(() => {
        if (Platform.OS === 'web' && !document.getElementById('premium-jobmap-styles')) {
            const style = document.createElement('style');
            style.id = 'premium-jobmap-styles';
            style.innerHTML = `
                .premium-pin-wrapper-job {
                    position: relative;
                    width: 32px;
                    height: 38px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-end;
                }
                .premium-pin-icon-job {
                    position: relative;
                    z-index: 2;
                    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2));
                }
                .premium-pin-pulse-job {
                    position: absolute;
                    bottom: 0px;
                    left: 16px;
                    transform: translateX(-50%);
                    width: 20px;
                    height: 6px;
                    border-radius: 50%;
                    background: rgba(99, 102, 241, 0.2);
                    box-shadow: 0 0 6px 2px rgba(99, 102, 241, 0.4);
                    animation: premium-marker-pulse-job 1.8s infinite ease-out;
                    z-index: 1;
                    pointer-events: none;
                }
                @keyframes premium-marker-pulse-job {
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
                .custom-mappicker-pin-job {
                    background: none !important;
                    border: none !important;
                    box-shadow: none !important;
                }
                .premium-job-overlay {
                    background-color: rgba(255, 255, 255, 0.85) !important;
                    backdrop-filter: blur(10px) !important;
                    -webkit-backdrop-filter: blur(10px) !important;
                    border: 1px solid rgba(0, 0, 0, 0.08) !important;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.06) !important;
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
            if (useMappls) {
                await loadMappls();
                await new Promise(r => setTimeout(r, 200));

                const container = document.getElementById('job-map-container');
                if (!container || mapInstanceRef.current) return;

                const mapplsClass = window.mappls;
                if (!mapplsClass) return;

                const map = new mapplsClass.Map(container, {
                    center: { lat: custLat, lng: custLng },
                    zoom: 15,
                    zoomControl: false,
                    draggable: false // Read-only static feel
                });

                new mapplsClass.Marker({
                    map: map,
                    position: { lat: custLat, lng: custLng },
                    html: CUSTOM_PIN_HTML,
                    width: 32,
                    height: 38,
                    offset: [0, -19]
                });

                mapInstanceRef.current = map;
                setMapReady(true);
            } else {
                await loadLeaflet();
                await new Promise(r => setTimeout(r, 200));

                const container = document.getElementById('job-map-container');
                if (!container || mapInstanceRef.current) return;

                const L = window.L;

                const map = L.map(container, {
                    center: [custLat, custLng],
                    zoom: 15,
                    zoomControl: false,
                    attributionControl: false,
                    dragging: false,
                    touchZoom: false,
                    scrollWheelZoom: false,
                    doubleClickZoom: false
                });

                L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                    maxZoom: 19,
                    attribution: '© CartoDB'
                }).addTo(map);

                const markerIcon = L.divIcon({
                    className: 'custom-mappicker-pin-job',
                    html: CUSTOM_PIN_HTML,
                    iconSize: [32, 38],
                    iconAnchor: [16, 38]
                });

                L.marker([custLat, custLng], { icon: markerIcon }).addTo(map);

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
                    console.log('Error cleaning up job map:', e);
                }
                mapInstanceRef.current = null;
            }
            setMapReady(false);
        };
    }, [custLat, custLng, useMappls]);

    const openGoogleMaps = () => {
        const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
        Linking.openURL(url);
    };

    return (
        <View style={styles.container}>
            {/* Map Embed */}
            <View style={styles.mapWrap}>
                <div
                    id="job-map-container"
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                />

                {!mapReady && (
                    <View style={styles.mapLoading}>
                        <ActivityIndicator size="small" color={COLORS.accent} />
                    </View>
                )}

                {/* Customer label overlay */}
                {mapReady && (
                    <View style={styles.labelOverlay} className="premium-job-overlay">
                        <MapPin size={12} color="#6366f1" fill="rgba(99,102,241,0.1)" />
                        <Text style={styles.labelText}>{customer || 'Service Location'}</Text>
                    </View>
                )}
            </View>

            {/* Address */}
            {address && (
                <View style={styles.addressRow}>
                    <MapPin size={14} color="#6366f1" />
                    <Text style={styles.addressText} numberOfLines={2}>{address}</Text>
                </View>
            )}

            {/* Open in Google Maps */}
            <TouchableOpacity style={styles.mapsBtn} onPress={openGoogleMaps}>
                <Navigation size={15} color={COLORS.accent} />
                <Text style={styles.mapsBtnText}>Open in Google Maps for Directions</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        gap: 10,
    },
    mapWrap: {
        height: 220,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.06)',
        position: 'relative',
    },
    mapLoading: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
    },
    labelOverlay: {
        position: 'absolute',
        top: 12,
        left: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        zIndex: 1000,
    },
    labelText: {
        color: '#1e293b',
        fontSize: 12,
        fontWeight: '700',
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        paddingHorizontal: 4,
    },
    addressText: {
        flex: 1,
        fontSize: 13,
        color: '#475569',
        lineHeight: 18,
    },
    mapsBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 1.5,
        borderColor: COLORS.accent,
        borderRadius: 12,
        padding: 14,
        backgroundColor: '#fff',
    },
    mapsBtnText: {
        color: COLORS.accent,
        fontWeight: '700',
        fontSize: 14,
    },
});
