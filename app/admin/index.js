import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShieldAlert, Users, TrendingUp, Settings, CheckCircle, XCircle, AlertTriangle, Play, Pause } from 'lucide-react-native';
import { COLORS, SPACING } from '../../constants/theme';
import { getPartners, approvePartner, rejectPartner } from '../../constants/partnerStore';
import { useRouter } from 'expo-router';

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('verification');
    const [pendingPartners, setPendingPartners] = useState([]);

    // Mock States for new logic
    const [isBetaMode, setIsBetaMode] = useState(false);
    const [redFlags, setRedFlags] = useState([
        { id: '1', partnerName: 'John Electric', issue: 'Technical', status: 'Pending Review', autoSuspended: true, revisitRequested: true },
    ]);

    useEffect(() => {
        refreshData();
    }, []);

    const refreshData = () => {
        const partners = getPartners().filter(p => p.status === 'pending');
        setPendingPartners(partners);
    };

    const handleApprove = (id) => {
        Alert.alert("Confirm", "Approve this partner?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Approve",
                onPress: () => {
                    approvePartner(id);
                    refreshData();
                }
            }
        ]);
    };

    const handleReject = (id) => {
        Alert.alert("Confirm", "Reject this partner?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Reject",
                style: "destructive",
                onPress: () => {
                    rejectPartner(id);
                    refreshData();
                }
            }
        ]);
    };

    const toggleBetaMode = () => {
        setIsBetaMode(!isBetaMode);
        if (!isBetaMode) {
            Alert.alert("Beta Mode Enabled", "Commission overridden to 0% for Mahe/Thalassery regions.");
        } else {
            Alert.alert("Beta Mode Disabled", "Commission restored to default 10%.");
        }
    };

    const renderVerificationQueue = () => (
        <FlatList
            data={pendingPartners}
            keyExtractor={item => item.id}
            ListEmptyComponent={
                <View style={styles.emptyState}>
                    <CheckCircle size={48} color={COLORS.success} />
                    <Text style={styles.emptyText}>All Caught Up! No pending verifications.</Text>
                </View>
            }
            renderItem={({ item }) => (
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View>
                            <Text style={styles.cardTitle}>{item.name}</Text>
                            <Text style={styles.cardSubtitle}>{item.phone} • {item.email}</Text>
                        </View>
                        <View style={styles.badgePending}>
                            <Text style={styles.badgePendingText}>PENDING</Text>
                        </View>
                    </View>
                    <View style={styles.cardBody}>
                        <Text style={styles.detailText}><Text style={{ fontWeight: 'bold' }}>Services:</Text> {item.serviceTypes?.join(', ') || 'N/A'}</Text>
                        <Text style={styles.detailText}><Text style={{ fontWeight: 'bold' }}>Location:</Text> {item.location?.address || 'N/A'}</Text>
                        <Text style={styles.detailText}><Text style={{ fontWeight: 'bold' }}>License:</Text> Uploaded PDF (Awaiting Review)</Text>
                    </View>
                    <View style={styles.actionRow}>
                        <TouchableOpacity style={[styles.btn, styles.btnReject]} onPress={() => handleReject(item.id)}>
                            <XCircle size={16} color="#fff" />
                            <Text style={styles.btnText}>Reject</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.btn, styles.btnApprove]} onPress={() => handleApprove(item.id)}>
                            <CheckCircle size={16} color="#fff" />
                            <Text style={styles.btnText}>Approve Partner</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        />
    );

    const renderRedFlags = () => (
        <FlatList
            data={redFlags}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
                <View style={[styles.card, { borderColor: 'rgba(239, 68, 68, 0.3)', borderWidth: 1 }]}>
                    <View style={styles.cardHeader}>
                        <View>
                            <Text style={styles.cardTitle}>{item.partnerName}</Text>
                            <Text style={[styles.cardSubtitle, { color: COLORS.danger }]}>{item.issue} Complaint</Text>
                        </View>
                        <View style={[styles.badgePending, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                            <AlertTriangle size={12} color={COLORS.danger} />
                            <Text style={[styles.badgePendingText, { color: COLORS.danger, marginLeft: 4 }]}>RED FLAG</Text>
                        </View>
                    </View>
                    <View style={styles.cardBody}>
                        {item.autoSuspended && (
                            <Text style={[styles.detailText, { color: COLORS.danger, fontWeight: 'bold' }]}>* Automatically Suspended pending review</Text>
                        )}
                        {item.revisitRequested && (
                            <Text style={[styles.detailText, { color: COLORS.accent, fontWeight: 'bold' }]}>* Customer Requested Re-visit (₹0 Cost)</Text>
                        )}
                    </View>
                    <View style={styles.actionRow}>
                        <TouchableOpacity style={[styles.btn, styles.btnApprove, { backgroundColor: COLORS.success }]} onPress={() => {
                            setRedFlags(redFlags.filter(f => f.id !== item.id));
                            Alert.alert("Resolved", "Ticket Resolved & Partner Restored");
                        }}>
                            <CheckCircle size={16} color="#fff" />
                            <Text style={styles.btnText}>Resolve & Restore</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        />
    );

    const renderSettings = () => (
        <View style={styles.settingsContainer}>
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View>
                        <Text style={styles.cardTitle}>Trial / Beta Mode</Text>
                        <Text style={styles.cardSubtitle}>Overrides defaults for Thalassery/Mahe mapping</Text>
                    </View>
                </View>
                <View style={styles.cardBody}>
                    <View style={styles.settingRow}>
                        <View style={{ flex: 1, paddingRight: 16 }}>
                            <Text style={styles.settingTitle}>0% Commission (Beta Mode)</Text>
                            <Text style={styles.settingDesc}>When enabled, all mapped partners in Thalassery and Mahe launch areas will have their matching commission automatically reduced to ₹0 for the first month to encourage signups.</Text>
                        </View>
                        <Switch
                            value={isBetaMode}
                            onValueChange={toggleBetaMode}
                            trackColor={{ false: '#3f3f46', true: COLORS.accent }}
                            thumbColor={isBetaMode ? '#fff' : '#a1a1aa'}
                        />
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Admin Command Center</Text>
                <Text style={styles.headerSubtitle}>System Overview & Workflows</Text>
            </View>

            {/* Top Metrics Map */}
            <View style={styles.metricsContainer}>
                <View style={styles.metricCard}>
                    <Users size={20} color={COLORS.accent} />
                    <Text style={styles.metricValue}>{getPartners().length}</Text>
                    <Text style={styles.metricLabel}>Partners</Text>
                </View>
                <View style={styles.metricCard}>
                    <ShieldAlert size={20} color={COLORS.danger} />
                    <Text style={styles.metricValue}>{redFlags.length}</Text>
                    <Text style={styles.metricLabel}>Red Flags</Text>
                </View>
                <View style={styles.metricCard}>
                    <TrendingUp size={20} color={COLORS.success} />
                    <Text style={styles.metricValue}>₹45k</Text>
                    <Text style={styles.metricLabel}>Revenue</Text>
                </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabs}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'verification' && styles.activeTab]}
                        onPress={() => setActiveTab('verification')}
                    >
                        <Text style={[styles.tabText, activeTab === 'verification' && styles.activeTabText]}>Verification Queue</Text>
                        {pendingPartners.length > 0 && (
                            <View style={styles.badge}><Text style={styles.badgeText}>{pendingPartners.length}</Text></View>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'disputes' && styles.activeTab]}
                        onPress={() => setActiveTab('disputes')}
                    >
                        <Text style={[styles.tabText, activeTab === 'disputes' && styles.activeTabText]}>Red Flags</Text>
                        {redFlags.length > 0 && (
                            <View style={[styles.badge, { backgroundColor: COLORS.danger }]}>
                                <Text style={styles.badgeText}>{redFlags.length}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'settings' && styles.activeTab]}
                        onPress={() => setActiveTab('settings')}
                    >
                        <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>Settings</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            {/* Content Body */}
            <View style={styles.content}>
                {activeTab === 'verification' && renderVerificationQueue()}
                {activeTab === 'disputes' && renderRedFlags()}
                {activeTab === 'settings' && renderSettings()}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgPrimary,
    },
    header: {
        padding: SPACING.lg,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    headerSubtitle: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
    metricsContainer: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.lg,
        gap: SPACING.md,
        marginBottom: SPACING.lg,
    },
    metricCard: {
        flex: 1,
        backgroundColor: COLORS.bgSecondary,
        padding: SPACING.md,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'center',
    },
    metricValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginVertical: 4,
    },
    metricLabel: {
        fontSize: 12,
        color: COLORS.textTertiary,
    },
    tabs: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.lg,
        borderBottomWidth: 1,
        borderColor: COLORS.border,
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.md,
        marginRight: SPACING.xl,
        gap: 8,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderColor: COLORS.accent,
    },
    tabText: {
        fontSize: 16,
        color: COLORS.textSecondary,
        fontWeight: '500',
    },
    activeTabText: {
        color: COLORS.accent,
        fontWeight: 'bold',
    },
    badge: {
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        padding: SPACING.lg,
    },
    card: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 16,
        padding: SPACING.lg,
        marginBottom: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.sm,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    badgePending: {
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    badgePendingText: {
        color: COLORS.gold,
        fontSize: 10,
        fontWeight: 'bold',
    },
    cardBody: {
        marginVertical: SPACING.sm,
        padding: SPACING.md,
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: 8,
    },
    detailText: {
        color: COLORS.textSecondary,
        fontSize: 14,
        marginBottom: 6,
    },
    actionRow: {
        flexDirection: 'row',
        gap: SPACING.md,
        marginTop: SPACING.sm,
    },
    btn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 8,
        gap: 8,
    },
    btnReject: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 1,
        borderColor: COLORS.danger,
    },
    btnApprove: {
        backgroundColor: COLORS.accent,
    },
    btnText: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#fff',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
    },
    emptyText: {
        color: COLORS.textSecondary,
        marginTop: SPACING.md,
        fontSize: 16,
    },
    settingsContainer: {
        flex: 1,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    settingDesc: {
        fontSize: 14,
        color: COLORS.textTertiary,
        lineHeight: 20,
    }
});
