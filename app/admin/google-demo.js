import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    TextInput, ActivityIndicator, Image, Modal, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    ArrowLeft, Cpu, Terminal, CreditCard, Map, AlertTriangle,
    CheckCircle, RefreshCw, Layers, ShieldCheck, MapPin, Eye, Trash2
} from 'lucide-react-native';
import { geminiService } from '../../services/geminiService';
import { googleMapsService } from '../../services/googleMapsService';
import { snitch } from '../../utils/snitch';

// Color Palette for Dark Glassmorphism Theme
const C = {
    bg: '#0a0f1e',
    surface: '#111827',
    card: '#1a2235',
    border: '#1f2d45',
    accent: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    text: '#f8fafc',
    sub: '#94a3b8',
    muted: '#475569',
};

// Preset locations in Kerala for Map tracer
const LOCATION_PRESETS = [
    {
        name: "Kozhikode to Kannur Route",
        origin: { latitude: 11.2588, longitude: 75.7804 },
        destination: { latitude: 11.8745, longitude: 75.3704 }
    },
    {
        name: "Thalassery to Mahe Short Route",
        origin: { latitude: 11.7490, longitude: 75.4890 },
        destination: { latitude: 11.7002, longitude: 75.5350 }
    },
    {
        name: "Ernakulam to Thrissur Route",
        origin: { latitude: 9.9816, longitude: 76.2999 },
        destination: { latitude: 10.5276, longitude: 76.2144 }
    }
];

export default function GoogleDemoScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('gemini'); // 'gemini' | 'snitch' | 'gpay' | 'maps'
    const [logs, setLogs] = useState([]);

    // Gemini states
    const [aiLoading, setAiLoading] = useState(false);
    const [aiResult, setAiResult] = useState(null);
    const [selectedPreset, setSelectedPreset] = useState(null);

    // GPay states
    const [gpayModalVisible, setGpayModalVisible] = useState(false);
    const [gpaySubState, setGpaySubState] = useState('');
    const [gpaySuccess, setGpaySuccess] = useState(false);

    // Maps states
    const [mapLoading, setMapLoading] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState(LOCATION_PRESETS[0]);
    const [routeDetails, setRouteDetails] = useState(null);

    // Fetch Snitch logs on load and keep updated
    useEffect(() => {
        setLogs(snitch.getLogs());
    }, []);

    const refreshSnitchLogs = () => {
        setLogs([...snitch.getLogs()]);
    };

    // ────────────────── Gemini AI Presets ──────────────────
    const AI_PRESETS = [
        {
            id: 'plug',
            title: 'Burnt Plug Outlet',
            category: 'Electrical',
            image: 'https://images.unsplash.com/photo-1558244661-d248897f7bc4?w=400&q=80',
            description: 'Burnt electrical socket socket shows brown discoloration, sparks fly when a heavy load is attached.',
            mockKey: 'light' // maps to default light/wiring diagnostics
        },
        {
            id: 'ac',
            title: 'Leaking AC Unit',
            category: 'Air Conditioning',
            image: 'https://images.unsplash.com/photo-1621905252507-b354bc25edac?w=400&q=80',
            description: 'Indoor AC unit drops cold water continuously from the bottom panel; cooling is compromised.',
            mockKey: 'ac'
        },
        {
            id: 'fan',
            title: 'Wobbling Ceiling Fan',
            category: 'Electrical',
            image: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?w=400&q=80',
            description: 'Ceiling fan makes a clicking metal friction sound at speed 3 and wobbles heavily.',
            mockKey: 'fan'
        }
    ];

    const runAiDiagnostics = async (preset) => {
        setSelectedPreset(preset);
        setAiLoading(true);
        setAiResult(null);
        snitch.logEvent('gemini_diagnostics_started', { presetId: preset.id, category: preset.category });

        try {
            // Invokes the real or mock Gemini service helper
            const result = await geminiService.analyzeIssueImage(preset.image, preset.category);
            setAiResult(result);
            snitch.logEvent('gemini_diagnostics_success', { possibleIssue: result.possibleIssue });
        } catch (err) {
            snitch.logError(err, 'Gemini Demo Panel');
            setAiResult({
                possibleIssue: "Analysis failed. Fallback default active.",
                recommendedCategory: preset.category,
                estimatedCost: "₹200 - ₹500",
                safetyAdvice: "Ensure main power breaker is switched off before examining faulty fixtures.",
                materialsNeeded: "Standard test lamp, screwdriver set",
                confidence: "70%"
            });
        } finally {
            setAiLoading(false);
            refreshSnitchLogs();
        }
    };

    // ────────────────── Snitch Actions ──────────────────
    const triggerJsCrash = () => {
        try {
            // Simulating a typic JS TypeError
            const nullObject = null;
            nullObject.processPayment();
        } catch (err) {
            snitch.logError(err, 'Diagnostics UI Test Button');
            refreshSnitchLogs();
        }
    };

    const logCustomEvent = () => {
        snitch.logEvent('user_viewed_diagnostics_hub', {
            appPlatform: 'Expo Dev-Client',
            screenName: 'GoogleDemoScreen',
            debugMode: true,
            timestamp: Date.now()
        });
        refreshSnitchLogs();
    };

    const clearTelemetryLogs = () => {
        snitch.clearLogs();
        refreshSnitchLogs();
    };

    // ────────────────── Pomili Google Pay Checkout ──────────────────
    const triggerGooglePaySimulator = () => {
        setGpaySuccess(false);
        setGpayModalVisible(true);
        setGpaySubState('Connecting to Google Pay (Pomili UPI)...');
        snitch.logEvent('googlepay_intent_created', { amount: 850 });

        setTimeout(() => {
            setGpaySubState('Authorizing transaction via secure biometrics...');
            setTimeout(() => {
                setGpaySubState('Processing secure UPI handshake with bank...');
                setTimeout(() => {
                    setGpaySubState('');
                    setGpaySuccess(true);
                    snitch.logEvent('googlepay_transaction_success', {
                        txnId: 'TXN-' + Math.floor(10000000 + Math.random() * 90000000),
                        amount: 850,
                        method: 'UPI-GPay'
                    });
                    refreshSnitchLogs();
                }, 1200);
            }, 1200);
        }, 1000);
    };

    // ────────────────── Maps directions route tracer ──────────────────
    const traceDirectionsRoute = async () => {
        setMapLoading(true);
        setRouteDetails(null);
        snitch.logEvent('maps_directions_trace_requested', {
            origin: selectedRoute.origin,
            destination: selectedRoute.destination
        });

        try {
            const data = await googleMapsService.getDirections(selectedRoute.origin, selectedRoute.destination);
            setRouteDetails(data);
            snitch.logEvent('maps_directions_trace_success', {
                distance: data.distance,
                duration: data.duration,
                pointsCount: data.points.length
            });
        } catch (err) {
            snitch.logError(err, 'Maps directions tracer');
        } finally {
            setMapLoading(false);
            refreshSnitchLogs();
        }
    };

    return (
        <SafeAreaView style={s.container}>
            {/* Header */}
            <View style={s.header}>
                <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
                    <ArrowLeft size={18} color={C.text} />
                </TouchableOpacity>
                <View>
                    <Text style={s.headerTitle}>Google Integrations Hub</Text>
                    <Text style={s.headerSub}>Active test bench for developer services</Text>
                </View>
                <View style={s.statusBadge}>
                    <View style={s.pulseDot} />
                    <Text style={s.statusText}>Dev Sandbox</Text>
                </View>
            </View>

            {/* TAB SELECTOR */}
            <View style={s.tabSelector}>
                {[
                    { id: 'gemini', label: 'Gemini AI', icon: Cpu },
                    { id: 'snitch', label: 'Snitch Logs', icon: Terminal },
                    { id: 'gpay', label: 'Google Pay', icon: CreditCard },
                    { id: 'maps', label: 'Maps/Directions', icon: Map }
                ].map(tab => {
                    const Icon = tab.icon;
                    return (
                        <TouchableOpacity
                            key={tab.id}
                            style={[s.tabItem, activeTab === tab.id && s.tabItemActive]}
                            onPress={() => setActiveTab(tab.id)}
                        >
                            <Icon size={14} color={activeTab === tab.id ? C.accent : C.sub} />
                            <Text style={[s.tabLabel, activeTab === tab.id && s.tabLabelActive]}>{tab.label}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* MAIN CONTENT AREA */}
            <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>

                {/* ─── TAB 1: GEMINI AI DIAGNOSTICS ─── */}
                {activeTab === 'gemini' && (
                    <View style={s.panel}>
                        <View style={s.card}>
                            <View style={s.cardHeader}>
                                <Cpu size={18} color={C.accent} />
                                <Text style={s.cardTitle}>Gemini 1.5 Flash Diagnostics</Text>
                            </View>
                            <Text style={s.cardDesc}>
                                Test the AI diagnostic camera models. Choose a simulated camera picture preset below to analyze the issue details.
                            </Text>

                            <View style={s.presetGrid}>
                                {AI_PRESETS.map(preset => (
                                    <TouchableOpacity
                                        key={preset.id}
                                        style={[s.presetCard, selectedPreset?.id === preset.id && s.presetCardActive]}
                                        onPress={() => runAiDiagnostics(preset)}
                                        disabled={aiLoading}
                                    >
                                        <Image source={{ uri: preset.image }} style={s.presetImg} />
                                        <Text style={s.presetTitle}>{preset.title}</Text>
                                        <Text style={s.presetCat}>{preset.category}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Loading State */}
                        {aiLoading && (
                            <View style={[s.card, s.centeredCard]}>
                                <ActivityIndicator size="large" color={C.accent} />
                                <Text style={[s.loadingText, { marginTop: 12 }]}>✨ Gemini AI analyzing photo issues...</Text>
                                <Text style={s.subText}>Extracting categories, estimated cost & safety caution rules</Text>
                            </View>
                        )}

                        {/* Result Display */}
                        {aiResult && selectedPreset && !aiLoading && (
                            <View style={[s.card, { borderColor: C.accent + '66' }]}>
                                <View style={s.aiResultHeader}>
                                    <Text style={s.aiResultTitle}>✨ AI Diagnostic Report</Text>
                                    <View style={s.confidenceBadge}>
                                        <Text style={s.confidenceText}>{aiResult.confidence || '90%'} Match</Text>
                                    </View>
                                </View>

                                <View style={s.resultImageRow}>
                                    <Image source={{ uri: selectedPreset.image }} style={s.resultPreviewImg} />
                                    <View style={{ flex: 1, marginLeft: 12, justifyContent: 'center' }}>
                                        <Text style={s.metaLabel}>PRESCRIPTIVE ANALYSIS</Text>
                                        <Text style={s.metaVal} numberOfLines={2}>{selectedPreset.description}</Text>
                                    </View>
                                </View>

                                <View style={s.reportItem}>
                                    <Text style={s.reportLabel}>Possible Cause</Text>
                                    <Text style={s.reportVal}>{aiResult.possibleIssue}</Text>
                                </View>

                                <View style={s.reportRowGrid}>
                                    <View style={[s.reportItem, { flex: 1 }]}>
                                        <Text style={s.reportLabel}>Recommended Service</Text>
                                        <Text style={s.reportVal}>{aiResult.recommendedCategory}</Text>
                                    </View>
                                    <View style={[s.reportItem, { flex: 1 }]}>
                                        <Text style={s.reportLabel}>Estimated Cost Range</Text>
                                        <Text style={[s.reportVal, { color: C.success }]}>{aiResult.estimatedCost}</Text>
                                    </View>
                                </View>

                                <View style={s.reportItem}>
                                    <Text style={s.reportLabel}>Required Materials</Text>
                                    <Text style={s.reportVal}>{aiResult.materialsNeeded || 'Standard replacement parts'}</Text>
                                </View>

                                <View style={[s.safetyBox, { backgroundColor: C.danger + '12', borderColor: C.danger + '33' }]}>
                                    <AlertTriangle size={16} color={C.danger} style={{ marginTop: 2 }} />
                                    <View style={{ flex: 1 }}>
                                        <Text style={s.safetyTitle}>Safety Precaution Rule</Text>
                                        <Text style={s.safetyText}>{aiResult.safetyAdvice}</Text>
                                    </View>
                                </View>
                            </View>
                        )}
                    </View>
                )}

                {/* ─── TAB 2: SNITCH TELEMETRY LOGS ─── */}
                {activeTab === 'snitch' && (
                    <View style={s.panel}>
                        <View style={s.card}>
                            <View style={s.cardHeader}>
                                <Terminal size={18} color={C.warning} />
                                <Text style={s.cardTitle}>Telemetry & Exception Logs</Text>
                            </View>
                            <Text style={s.cardDesc}>
                                Trigger developer exceptions or custom analytic events. View logs in real-time in the terminal frame below.
                            </Text>

                            <View style={s.actionRow}>
                                <TouchableOpacity style={[s.actionButton, { backgroundColor: C.danger + '20', borderColor: C.danger + '40' }]} onPress={triggerJsCrash}>
                                    <AlertTriangle size={14} color={C.danger} />
                                    <Text style={[s.actionButtonText, { color: C.danger }]}>Simulate Crash</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={[s.actionButton, { backgroundColor: C.accent + '20', borderColor: C.accent + '40' }]} onPress={logCustomEvent}>
                                    <Eye size={14} color={C.accent} />
                                    <Text style={[s.actionButtonText, { color: C.accent }]}>Log Telemetry</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={[s.actionButton, { backgroundColor: C.muted + '20', borderColor: C.muted + '40' }]} onPress={clearTelemetryLogs}>
                                    <Trash2 size={14} color={C.sub} />
                                    <Text style={[s.actionButtonText, { color: C.sub }]}>Clear Console</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Terminal Box */}
                        <View style={s.terminal}>
                            <View style={s.terminalHeader}>
                                <View style={s.terminalDots}>
                                    <View style={[s.terminalDot, { backgroundColor: C.danger }]} />
                                    <View style={[s.terminalDot, { backgroundColor: C.warning }]} />
                                    <View style={[s.terminalDot, { backgroundColor: C.success }]} />
                                </View>
                                <Text style={s.terminalTitle}>snitch-crash-reporter-v1.0.0</Text>
                                <TouchableOpacity onPress={refreshSnitchLogs}>
                                    <RefreshCw size={12} color={C.sub} />
                                </TouchableOpacity>
                            </View>
                            <ScrollView style={s.terminalBody} contentContainerStyle={s.terminalLogs} nestedScrollEnabled>
                                {logs.length === 0 ? (
                                    <Text style={s.terminalEmpty}>$ Listening for exception payloads, crashes, and event telemetry...</Text>
                                ) : (
                                    logs.map((log) => (
                                        <View key={log.id} style={s.logEntry}>
                                            <View style={s.logMeta}>
                                                <Text style={[s.logBadge, log.type === 'CRASH' ? s.logBadgeCrash : s.logBadgeEvent]}>
                                                    {log.type}
                                                </Text>
                                                <Text style={s.logTime}>{new Date(log.timestamp).toLocaleTimeString()}</Text>
                                                <Text style={s.logContext}>[{log.context}]</Text>
                                            </View>
                                            <Text style={[s.logMsg, log.type === 'CRASH' ? { color: C.danger } : { color: C.text }]}>
                                                {log.message}
                                            </Text>
                                            {log.type === 'CRASH' && log.stack && (
                                                <Text style={s.logStack} numberOfLines={3}>{log.stack}</Text>
                                            )}
                                            {log.type === 'EVENT' && log.params && (
                                                <Text style={s.logParams}>Params: {JSON.stringify(log.params)}</Text>
                                            )}
                                        </View>
                                    ))
                                )}
                            </ScrollView>
                        </View>
                    </View>
                )}

                {/* ─── TAB 3: GOOGLE PAY CHECKOUT ─── */}
                {activeTab === 'gpay' && (
                    <View style={s.panel}>
                        <View style={s.card}>
                            <View style={s.cardHeader}>
                                <CreditCard size={18} color={C.success} />
                                <Text style={s.cardTitle}>Google Pay / Pomili Gateway</Text>
                            </View>
                            <Text style={s.cardDesc}>
                                Test checkout flow simulation using Google Pay integration, including secure biometric checks and bank responses.
                            </Text>

                            <View style={s.checkoutFrame}>
                                <Text style={s.checkoutLabel}>Transaction Checkout Summary</Text>
                                <View style={s.checkoutRow}>
                                    <Text style={s.checkoutItem}>Emergency Fan Repair</Text>
                                    <Text style={s.checkoutPrice}>₹850.00</Text>
                                </View>
                                <View style={s.checkoutDivider} />
                                <View style={s.checkoutRow}>
                                    <Text style={[s.checkoutItem, { fontWeight: 'bold', color: C.text }]}>Total Payable</Text>
                                    <Text style={[s.checkoutPrice, { fontWeight: 'bold', color: C.text }]}>₹850.00</Text>
                                </View>

                                {/* Premium Google Pay Button */}
                                <TouchableOpacity style={s.gpayBtn} onPress={triggerGooglePaySimulator}>
                                    <View style={s.gpayContent}>
                                        <Text style={s.gpayText}>Pay with </Text>
                                        <View style={s.gpayLogo}>
                                            <Text style={{ color: '#4285F4', fontWeight: 'bold', fontSize: 16 }}>G</Text>
                                            <Text style={{ color: '#EA4335', fontWeight: 'bold', fontSize: 16 }}>o</Text>
                                            <Text style={{ color: '#FBBC05', fontWeight: 'bold', fontSize: 16 }}>o</Text>
                                            <Text style={{ color: '#4285F4', fontWeight: 'bold', fontSize: 16 }}>g</Text>
                                            <Text style={{ color: '#34A853', fontWeight: 'bold', fontSize: 16 }}>l</Text>
                                            <Text style={{ color: '#EA4335', fontWeight: 'bold', fontSize: 16 }}>e</Text>
                                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 3 }}>Pay</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}

                {/* ─── TAB 4: GOOGLE DIRECTIONS ROUTE ─── */}
                {activeTab === 'maps' && (
                    <View style={s.panel}>
                        <View style={s.card}>
                            <View style={s.cardHeader}>
                                <Map size={18} color={C.accent} />
                                <Text style={s.cardTitle}>Directions & Path Tracer</Text>
                            </View>
                            <Text style={s.cardDesc}>
                                Query the Google Directions API to trace technician routes between Kerala locations. Select a route preset:
                            </Text>

                            <View style={{ gap: 8, marginVertical: 12 }}>
                                {LOCATION_PRESETS.map((preset, idx) => (
                                    <TouchableOpacity
                                        key={idx}
                                        style={[s.routePresetCard, selectedRoute.name === preset.name && s.routePresetCardActive]}
                                        onPress={() => setSelectedRoute(preset)}
                                    >
                                        <MapPin size={14} color={selectedRoute.name === preset.name ? C.accent : C.sub} />
                                        <Text style={[s.routePresetName, selectedRoute.name === preset.name && { color: C.accent, fontWeight: '700' }]}>
                                            {preset.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <TouchableOpacity
                                style={[s.actionButton, { width: '100%', backgroundColor: C.accent, borderColor: C.accent, alignSelf: 'center', justifyContent: 'center' }]}
                                onPress={traceDirectionsRoute}
                                disabled={mapLoading}
                            >
                                {mapLoading ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <>
                                        <RefreshCw size={14} color="#fff" />
                                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Trace Directions Route</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Maps details result card */}
                        {routeDetails && (
                            <View style={[s.card, { borderColor: C.success + '44' }]}>
                                <Text style={s.reportLabel}>Route Details</Text>
                                <View style={s.reportRowGrid}>
                                    <View style={s.reportItem}>
                                        <Text style={s.reportLabel}>Distance</Text>
                                        <Text style={[s.reportVal, { fontSize: 16, color: C.text }]}>{routeDetails.distance}</Text>
                                    </View>
                                    <View style={s.reportItem}>
                                        <Text style={s.reportLabel}>Duration</Text>
                                        <Text style={[s.reportVal, { fontSize: 16, color: C.text }]}>{routeDetails.duration}</Text>
                                    </View>
                                </View>

                                <Text style={[s.reportLabel, { marginTop: 10 }]}>Polyline Coordinates (Points count: {routeDetails.points.length})</Text>
                                <ScrollView style={s.polyBox} nestedScrollEnabled>
                                    {routeDetails.points.slice(0, 20).map((pt, i) => (
                                        <Text key={i} style={s.polyText}>
                                            Point {i + 1}: Lat: {pt.latitude.toFixed(6)}, Lng: {pt.longitude.toFixed(6)}
                                        </Text>
                                    ))}
                                    {routeDetails.points.length > 20 && (
                                        <Text style={[s.polyText, { color: C.muted }]}>...and {routeDetails.points.length - 20} more coordinates</Text>
                                    )}
                                </ScrollView>
                            </View>
                        )}
                    </View>
                )}

                <View style={{ height: 40 }} />
            </ScrollView>

            {/* GOOGLE PAY OVERLAY SHEET MODAL */}
            <Modal visible={gpayModalVisible} animationType="slide" transparent>
                <View style={s.modalOverlay}>
                    <View style={s.gpaySheet}>
                        {!gpaySuccess ? (
                            <View style={{ alignItems: 'center', paddingVertical: 30 }}>
                                <ActivityIndicator size="large" color="#fff" />
                                <Text style={s.sheetStatus}>{gpaySubState}</Text>
                                <View style={s.sheetLogo}>
                                    <Text style={s.sheetLogoText}>Google Pay</Text>
                                    <Text style={s.sheetPomili}>secured with Pomili Pay</Text>
                                </View>
                            </View>
                        ) : (
                            <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                                <View style={s.successCircle}>
                                    <CheckCircle size={40} color={C.success} />
                                </View>
                                <Text style={s.sheetTitle}>Payment Complete</Text>
                                <Text style={s.sheetDesc}>Transaction logged in system telemetry successfully</Text>
                                <View style={s.receiptCard}>
                                    <Text style={s.receiptTitle}>UPI Receipt</Text>
                                    <Text style={s.receiptText}>Merchant: Sheriyakam</Text>
                                    <Text style={s.receiptText}>Amount: ₹850.00</Text>
                                    <Text style={s.receiptText}>Status: SUCCESSFUL</Text>
                                </View>
                                <TouchableOpacity style={s.sheetCloseBtn} onPress={() => setGpayModalVisible(false)}>
                                    <Text style={s.sheetCloseText}>Dismiss Checkout</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: C.bg },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border },
    backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center', marginRight: 12, borderWidth: 1, borderColor: C.border },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: C.text },
    headerSub: { fontSize: 11, color: C.sub, marginTop: 1 },
    statusBadge: { marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', backgroundColor: C.accent + '22', borderWidth: 1, borderColor: C.accent + '44', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 6 },
    pulseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.accent },
    statusText: { color: C.accent, fontSize: 11, fontWeight: 'bold' },

    // TAB BAR
    tabSelector: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: C.border, paddingHorizontal: 10 },
    tabItem: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, gap: 6, borderBottomWidth: 2, borderBottomColor: 'transparent' },
    tabItemActive: { borderBottomColor: C.accent },
    tabLabel: { fontSize: 12, color: C.sub, fontWeight: '600' },
    tabLabelActive: { color: C.text },

    // PANELS
    scroll: { flex: 1 },
    scrollContent: { padding: 16, gap: 14 },
    panel: { gap: 14 },

    // CARDS
    card: { backgroundColor: C.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: C.border },
    centeredCard: { alignItems: 'center', paddingVertical: 30 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
    cardTitle: { fontSize: 15, fontWeight: 'bold', color: C.text },
    cardDesc: { fontSize: 13, color: C.sub, lineHeight: 18, marginBottom: 12 },

    // GEMINI PRESETS
    presetGrid: { flexDirection: 'row', gap: 10, marginTop: 4 },
    presetCard: { flex: 1, backgroundColor: C.card, borderRadius: 10, padding: 10, borderWidth: 1, borderColor: C.border, alignItems: 'center' },
    presetCardActive: { borderColor: C.accent, backgroundColor: C.accent + '11' },
    presetImg: { width: '100%', height: 60, borderRadius: 6, marginBottom: 8 },
    presetTitle: { fontSize: 11, fontWeight: 'bold', color: C.text, textAlign: 'center' },
    presetCat: { fontSize: 10, color: C.sub, marginTop: 2 },

    // RESULT
    loadingText: { fontSize: 14, fontWeight: 'bold', color: C.text },
    subText: { fontSize: 12, color: C.sub, marginTop: 4, textAlign: 'center' },
    aiResultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    aiResultTitle: { fontSize: 15, fontWeight: 'bold', color: C.text },
    confidenceBadge: { backgroundColor: C.success + '22', borderWidth: 1, borderColor: C.success + '44', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
    confidenceText: { color: C.success, fontSize: 10, fontWeight: 'bold' },
    resultImageRow: { flexDirection: 'row', backgroundColor: C.card, borderRadius: 10, padding: 10, borderWidth: 1, borderColor: C.border, marginBottom: 12 },
    resultPreviewImg: { width: 50, height: 50, borderRadius: 6 },
    metaLabel: { fontSize: 9, fontWeight: 'bold', color: C.accent, letterSpacing: 0.5 },
    metaVal: { fontSize: 11, color: C.sub, marginTop: 2, lineHeight: 15 },

    reportRowGrid: { flexDirection: 'row', gap: 12 },
    reportItem: { backgroundColor: C.card, borderRadius: 10, padding: 10, borderWidth: 1, borderColor: C.border, marginBottom: 8 },
    reportLabel: { fontSize: 10, color: C.sub, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
    reportVal: { fontSize: 13, fontWeight: '600', color: C.text },

    safetyBox: { flexDirection: 'row', gap: 10, padding: 12, borderRadius: 10, borderWidth: 1, marginTop: 6 },
    safetyTitle: { fontSize: 12, fontWeight: 'bold', color: C.danger },
    safetyText: { fontSize: 11, color: C.sub, marginTop: 2, lineHeight: 16 },

    // ACTION ROW
    actionRow: { flexDirection: 'row', gap: 10 },
    actionButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1 },
    actionButtonText: { fontSize: 12, fontWeight: 'bold' },

    // TERMINAL
    terminal: { backgroundColor: '#070a13', borderRadius: 12, borderWidth: 1, borderColor: C.border, overflow: 'hidden' },
    terminalHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0d1324', paddingHorizontal: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: C.border },
    terminalDots: { flexDirection: 'row', gap: 5, flex: 1 },
    terminalDot: { width: 8, height: 8, borderRadius: 4 },
    terminalTitle: { color: C.muted, fontSize: 11, fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', marginRight: 'auto' },
    terminalBody: { height: 180 },
    terminalLogs: { padding: 12, gap: 10 },
    terminalEmpty: { color: C.muted, fontSize: 11, fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', fontStyle: 'italic' },

    logEntry: { borderBottomWidth: 1, borderBottomColor: '#161d3180', paddingBottom: 6 },
    logMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
    logBadge: { fontSize: 8, fontWeight: 'bold', color: '#fff', paddingHorizontal: 4, paddingVertical: 1, borderRadius: 3, textTransform: 'uppercase' },
    logBadgeCrash: { backgroundColor: C.danger },
    logBadgeEvent: { backgroundColor: C.accent },
    logTime: { fontSize: 10, color: C.muted },
    logContext: { fontSize: 10, color: C.warning },
    logMsg: { fontSize: 11, fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', fontWeight: 'bold' },
    logStack: { fontSize: 9, color: C.muted, fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', marginTop: 2, paddingLeft: 4, borderLeftWidth: 1, borderLeftColor: C.border },
    logParams: { fontSize: 9, color: C.sub, fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', marginTop: 2 },

    // GPAY
    checkoutFrame: { backgroundColor: C.card, borderStyle: 'dashed', borderRadius: 12, borderWidth: 1.5, borderColor: C.border, padding: 16, marginTop: 4 },
    checkoutLabel: { fontSize: 11, fontWeight: 'bold', color: C.sub, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 },
    checkoutRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
    checkoutItem: { fontSize: 13, color: C.sub },
    checkoutPrice: { fontSize: 13, color: C.sub, fontWeight: '600' },
    checkoutDivider: { height: 1, backgroundColor: C.border, marginVertical: 8 },
    gpayBtn: { backgroundColor: '#000', paddingVertical: 14, borderRadius: 10, borderWidth: 1, borderColor: '#333', alignItems: 'center', marginTop: 20 },
    gpayContent: { flexDirection: 'row', alignItems: 'center' },
    gpayText: { color: '#fff', fontSize: 15, fontWeight: '500' },
    gpayLogo: { flexDirection: 'row', alignItems: 'center' },

    // MODAL GPAY
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
    gpaySheet: { backgroundColor: '#131929', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, borderWidth: 1, borderColor: C.border },
    sheetStatus: { color: C.text, fontSize: 14, fontWeight: 'bold', marginTop: 16, textAlign: 'center' },
    sheetLogo: { marginTop: 24, alignItems: 'center' },
    sheetLogoText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    sheetPomili: { color: C.muted, fontSize: 11, marginTop: 2 },
    successCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: C.success + '15', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
    sheetTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
    sheetDesc: { color: C.sub, fontSize: 12, textAlign: 'center', marginTop: 4 },
    receiptCard: { width: '100%', backgroundColor: C.card, borderRadius: 10, padding: 14, borderWidth: 1, borderColor: C.border, marginTop: 16, gap: 4 },
    receiptTitle: { color: C.success, fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
    receiptText: { color: C.sub, fontSize: 12 },
    sheetCloseBtn: { width: '100%', backgroundColor: C.success, padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 20 },
    sheetCloseText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },

    // MAPS
    routePresetCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: 8, padding: 12, borderWidth: 1, borderColor: C.border, gap: 10 },
    routePresetCardActive: { borderColor: C.accent, backgroundColor: C.accent + '11' },
    routePresetName: { color: C.text, fontSize: 13 },
    polyBox: { height: 100, backgroundColor: '#070a13', borderRadius: 8, padding: 10, borderWidth: 1, borderColor: C.border, marginTop: 8 },
    polyText: { color: C.sub, fontSize: 10, fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', paddingVertical: 2 }
});
