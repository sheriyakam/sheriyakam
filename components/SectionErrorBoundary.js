import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { AlertTriangle, RefreshCw, Phone } from 'lucide-react-native';
import { captureException } from '../services/sentry';

export default class SectionErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        captureException(error, {
            section: this.props.name || 'AnonymousSection',
            componentStack: errorInfo?.componentStack,
        });
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            const sectionName = this.props.name || 'this section';
            return (
                <View style={styles.container}>
                    <View style={styles.card}>
                        <View style={styles.iconWrap}>
                            <AlertTriangle size={20} color="#EF4444" />
                        </View>
                        <View style={styles.textWrap}>
                            <Text style={styles.title}>Unable to load {sectionName}</Text>
                            <Text style={styles.subtitle}>
                                A temporary issue occurred while rendering this section.
                            </Text>
                        </View>
                        <View style={styles.actionsRow}>
                            <TouchableOpacity 
                                style={styles.retryBtn} 
                                onPress={this.handleRetry}
                                activeOpacity={0.8}
                            >
                                <RefreshCw size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
                                <Text style={styles.retryBtnText}>Retry</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.phoneBtn}
                                onPress={() => Linking.openURL('tel:04902996789')}
                                activeOpacity={0.8}
                            >
                                <Phone size={13} color="#2563EB" style={{ marginRight: 5 }} />
                                <Text style={styles.phoneBtnText}>Helpline</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    card: {
        backgroundColor: 'rgba(239, 68, 68, 0.05)',
        borderColor: 'rgba(239, 68, 68, 0.25)',
        borderWidth: 1,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        flexDirection: 'column',
    },
    iconWrap: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    textWrap: {
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 15,
        fontWeight: '700',
        color: '#EF4444',
        marginBottom: 4,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 12,
        color: '#71717A',
        textAlign: 'center',
        maxWidth: 380,
    },
    actionsRow: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
    },
    retryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2563EB',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 10,
    },
    retryBtnText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '600',
    },
    phoneBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(37, 99, 235, 0.08)',
        borderColor: 'rgba(37, 99, 235, 0.25)',
        borderWidth: 1,
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 10,
    },
    phoneBtnText: {
        color: '#2563EB',
        fontSize: 13,
        fontWeight: '600',
    },
});
