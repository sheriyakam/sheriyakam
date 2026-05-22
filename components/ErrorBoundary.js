import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform, Clipboard } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useRouter } from 'expo-router';
import { AlertTriangle, RefreshCw, ChevronDown, ChevronUp, Copy, Check, Home } from 'lucide-react-native';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log to error reporting service in production
        console.error('ErrorBoundary caught:', error, errorInfo);
        this.setState({ errorInfo });
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <ErrorFallbackUI
                    error={this.state.error}
                    errorInfo={this.state.errorInfo}
                    onRetry={this.handleRetry}
                    fallbackMessage={this.props.fallbackMessage}
                />
            );
        }

        return this.props.children;
    }
}

// Separate functional component to access useTheme() and useRouter() hook safely
const ErrorFallbackUI = ({ error, errorInfo, onRetry, fallbackMessage }) => {
    const { colors, theme } = useTheme();
    const isDark = theme === 'dark';
    const [showDetails, setShowDetails] = useState(false);
    const [copied, setCopied] = useState(false);

    let router = null;
    try {
        router = useRouter();
    } catch (e) {
        // Safe to ignore if router is not initialized
    }

    const errorDetails = `Error: ${error?.message || error || 'Unknown'}\n\nStack Trace:\n${error?.stack || 'No stack trace available'}\n\nComponent Stack:\n${errorInfo?.componentStack || 'No component stack available'}`;

    const handleCopy = () => {
        try {
            if (Platform.OS === 'web') {
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(errorDetails);
                }
            } else if (Clipboard && typeof Clipboard.setString === 'function') {
                Clipboard.setString(errorDetails);
            }
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy error details:', err);
        }
    };

    const handleReload = () => {
        if (Platform.OS === 'web') {
            window.location.reload();
        } else {
            onRetry();
        }
    };

    const handleGoHome = () => {
        if (router) {
            onRetry();
            router.replace('/');
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
            <View style={[
                styles.card,
                { 
                    backgroundColor: isDark ? 'rgba(24, 24, 27, 0.85)' : 'rgba(255, 255, 255, 0.9)', 
                    borderColor: colors.border 
                }
            ]}>
                {/* Glowing Concentric Radar Rings for Icon */}
                <View style={styles.iconContainer}>
                    <View style={[styles.iconRingOuter, { borderColor: isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.08)', backgroundColor: isDark ? 'rgba(239, 68, 68, 0.04)' : 'rgba(239, 68, 68, 0.02)' }]}>
                        <View style={[styles.iconRingInner, { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.08)' }]}>
                            <AlertTriangle size={36} color={colors.danger || '#ef4444'} />
                        </View>
                    </View>
                </View>

                <Text style={[styles.title, { color: colors.textPrimary }]}>
                    Something went wrong
                </Text>

                <Text style={[styles.message, { color: colors.textSecondary }]}>
                    {fallbackMessage || 'An unexpected application exception occurred. Our engineers have been alerted of this crash.'}
                </Text>

                {/* Collapsible Diagnostics Accordion */}
                <TouchableOpacity 
                    style={[styles.accordionHeader, { borderBottomColor: showDetails ? colors.border : 'transparent' }]} 
                    onPress={() => setShowDetails(!showDetails)}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.accordionTitle, { color: colors.accent }]}>
                        {showDetails ? 'Hide Diagnostics Log' : 'Show Diagnostics Log'}
                    </Text>
                    {showDetails ? (
                        <ChevronUp size={16} color={colors.accent} />
                    ) : (
                        <ChevronDown size={16} color={colors.accent} />
                    )}
                </TouchableOpacity>

                {showDetails && (
                    <View style={[styles.diagnosticsContainer, { backgroundColor: isDark ? '#121214' : '#f4f4f5', borderColor: colors.border }]}>
                        <View style={styles.diagnosticsHeader}>
                            <Text style={[styles.diagnosticsTitleText, { color: colors.textSecondary }]}>System Logs</Text>
                            <TouchableOpacity style={styles.copyBtn} onPress={handleCopy} activeOpacity={0.7}>
                                {copied ? (
                                    <>
                                        <Check size={14} color={colors.success} />
                                        <Text style={[styles.copyBtnText, { color: colors.success }]}>Copied</Text>
                                    </>
                                ) : (
                                    <>
                                        <Copy size={14} color={colors.textSecondary} />
                                        <Text style={[styles.copyBtnText, { color: colors.textSecondary }]}>Copy</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.scrollArea} nestedScrollEnabled={true}>
                            <Text style={[styles.logText, { color: isDark ? '#f43f5e' : '#be123c', fontWeight: '600' }]}>
                                {error?.name}: {error?.message}
                            </Text>
                            <Text style={[styles.stackText, { color: colors.textSecondary }]}>
                                {errorDetails}
                            </Text>
                        </ScrollView>
                    </View>
                )}

                {/* Action Buttons */}
                <View style={styles.btnRow}>
                    <TouchableOpacity 
                        style={[styles.btn, styles.btnPrimary, { backgroundColor: colors.accent }]} 
                        onPress={handleReload}
                        activeOpacity={0.8}
                    >
                        <RefreshCw size={16} color="#ffffff" style={styles.btnIcon} />
                        <Text style={styles.btnPrimaryText}>
                            {Platform.OS === 'web' ? 'Reload Page' : 'Try Again'}
                        </Text>
                    </TouchableOpacity>

                    {router && (
                        <TouchableOpacity 
                            style={[styles.btn, styles.btnSecondary, { borderColor: colors.border, backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }]} 
                            onPress={handleGoHome}
                            activeOpacity={0.8}
                        >
                            <Home size={16} color={colors.textPrimary} style={styles.btnIcon} />
                            <Text style={[styles.btnSecondaryText, { color: colors.textPrimary }]}>
                                Home
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
        width: '100%',
        maxWidth: 500,
        borderRadius: 24,
        borderWidth: 1,
        padding: 32,
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.12,
                shadowRadius: 20,
            },
            android: {
                elevation: 6,
            },
            web: {
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                backdropFilter: 'blur(20px)',
            }
        }),
    },
    iconContainer: {
        marginBottom: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconRingOuter: {
        width: 96,
        height: 96,
        borderRadius: 48,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconRingInner: {
        width: 68,
        height: 68,
        borderRadius: 34,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 10,
        textAlign: 'center',
    },
    message: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    accordionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        gap: 6,
        marginBottom: 8,
    },
    accordionTitle: {
        fontSize: 14,
        fontWeight: '600',
    },
    diagnosticsContainer: {
        width: '100%',
        borderRadius: 16,
        borderWidth: 1,
        padding: 14,
        marginBottom: 24,
    },
    diagnosticsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(128,128,128,0.1)',
        paddingBottom: 8,
        marginBottom: 8,
    },
    diagnosticsTitleText: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    copyBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingVertical: 2,
        paddingHorizontal: 8,
    },
    copyBtnText: {
        fontSize: 11,
        fontWeight: '600',
    },
    scrollArea: {
        maxHeight: 180,
    },
    logText: {
        fontSize: 12,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        marginBottom: 8,
    },
    stackText: {
        fontSize: 11,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        lineHeight: 16,
    },
    btnRow: {
        flexDirection: 'row',
        width: '100%',
        gap: 12,
        justifyContent: 'center',
        marginTop: 10,
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 22,
        borderRadius: 14,
        flex: 1,
        minWidth: 120,
    },
    btnPrimary: {
        shadowColor: '#2563eb',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
    },
    btnPrimaryText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '700',
    },
    btnSecondary: {
        borderWidth: 1,
    },
    btnSecondaryText: {
        fontSize: 15,
        fontWeight: '600',
    },
    btnIcon: {
        marginRight: 8,
    },
});

export default ErrorBoundary;
