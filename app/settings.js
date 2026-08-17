import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Moon, Sun, Bell, Shield, KeyRound, Globe, HelpCircle, FileText, ChevronRight, Check } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/ui/Card';
import { Toggle } from '../components/ui/Toggle';
import { TwoFactorAuthModal } from '../components/TwoFactorAuthModal';
import { InAppBrowser } from '../components/InAppBrowser';
import { Badge } from '../components/ui/Badge';

export default function SettingsScreen() {
    const router = useRouter();
    const { colors, theme, toggleTheme } = useTheme() || { colors: COLORS, theme: 'dark', toggleTheme: () => {} };
    const { success } = useToast();
    const isDark = theme === 'dark';

    const [pushEnabled, setPushEnabled] = useState(true);
    const [smsEnabled, setSmsEnabled] = useState(true);
    const [whatsappEnabled, setWhatsappEnabled] = useState(true);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [show2FAModal, setShow2FAModal] = useState(false);
    const [showBrowser, setShowBrowser] = useState(false);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Settings & Preferences</Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Appearance */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                    APPEARANCE
                </Text>
                <Card variant="default" style={styles.cardGroup}>
                    <Toggle
                        label="Dark Theme"
                        description="Switch between light and dark visual mode"
                        value={isDark}
                        onChange={toggleTheme}
                    />
                </Card>

                {/* Notifications */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 16 }]}>
                    NOTIFICATIONS & ALERTS
                </Text>
                <Card variant="default" style={styles.cardGroup}>
                    <Toggle
                        label="Push Notifications"
                        description="Live technician ETA and job status updates"
                        value={pushEnabled}
                        onChange={(v) => {
                            setPushEnabled(v);
                            success(v ? 'Push alerts enabled' : 'Push alerts silenced');
                        }}
                    />
                    <View style={[styles.divider, { backgroundColor: isDark ? '#27272A' : '#E4E4E7' }]} />
                    <Toggle
                        label="SMS Dispatch Updates"
                        description="Emergency booking notifications via SMS"
                        value={smsEnabled}
                        onChange={setSmsEnabled}
                    />
                    <View style={[styles.divider, { backgroundColor: isDark ? '#27272A' : '#E4E4E7' }]} />
                    <Toggle
                        label="WhatsApp Receipts"
                        description="Receive digital tax invoice on WhatsApp"
                        value={whatsappEnabled}
                        onChange={setWhatsappEnabled}
                    />
                </Card>

                {/* Security & Auth */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 16 }]}>
                    ACCOUNT SECURITY
                </Text>
                <Card variant="default" style={styles.cardGroup}>
                    <TouchableOpacity
                        onPress={() => setShow2FAModal(true)}
                        style={styles.settingRow}
                    >
                        <View style={styles.rowLeft}>
                            <View style={[styles.iconWrap, { backgroundColor: colors.accent + '15' }]}>
                                <KeyRound size={18} color={colors.accent} />
                            </View>
                            <View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                    <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>
                                        Two-Factor Authentication
                                    </Text>
                                    <Badge variant={twoFactorEnabled ? 'success' : 'neutral'} size="sm">
                                        {twoFactorEnabled ? 'Active' : 'Off'}
                                    </Badge>
                                </View>
                                <Text style={[styles.rowSubtitle, { color: colors.textTertiary }]}>
                                    Protect logins with an authenticator app
                                </Text>
                            </View>
                        </View>
                        <ChevronRight size={18} color={colors.textTertiary} />
                    </TouchableOpacity>

                    <View style={[styles.divider, { backgroundColor: isDark ? '#27272A' : '#E4E4E7' }]} />

                    <TouchableOpacity
                        onPress={() => router.push('/account')}
                        style={styles.settingRow}
                    >
                        <View style={styles.rowLeft}>
                            <View style={[styles.iconWrap, { backgroundColor: '#10B98115' }]}>
                                <Shield size={18} color="#10B981" />
                            </View>
                            <View>
                                <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>
                                    Account & Data Privacy
                                </Text>
                                <Text style={[styles.rowSubtitle, { color: colors.textTertiary }]}>
                                    Manage password, active sessions, and data deletion
                                </Text>
                            </View>
                        </View>
                        <ChevronRight size={18} color={colors.textTertiary} />
                    </TouchableOpacity>
                </Card>

                {/* Legal & About */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 16 }]}>
                    MORE INFORMATION
                </Text>
                <Card variant="default" style={styles.cardGroup}>
                    <TouchableOpacity
                        onPress={() => router.push('/terms')}
                        style={styles.settingRow}
                    >
                        <View style={styles.rowLeft}>
                            <FileText size={18} color={colors.textSecondary} style={{ marginRight: 12 }} />
                            <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>Terms of Service</Text>
                        </View>
                        <ChevronRight size={18} color={colors.textTertiary} />
                    </TouchableOpacity>

                    <View style={[styles.divider, { backgroundColor: isDark ? '#27272A' : '#E4E4E7' }]} />

                    <TouchableOpacity
                        onPress={() => router.push('/privacy')}
                        style={styles.settingRow}
                    >
                        <View style={styles.rowLeft}>
                            <Shield size={18} color={colors.textSecondary} style={{ marginRight: 12 }} />
                            <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>Privacy Policy</Text>
                        </View>
                        <ChevronRight size={18} color={colors.textTertiary} />
                    </TouchableOpacity>

                    <View style={[styles.divider, { backgroundColor: isDark ? '#27272A' : '#E4E4E7' }]} />

                    <TouchableOpacity
                        onPress={() => router.push('/about')}
                        style={styles.settingRow}
                    >
                        <View style={styles.rowLeft}>
                            <Globe size={18} color={colors.textSecondary} style={{ marginRight: 12 }} />
                            <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>About Sheriyakam</Text>
                        </View>
                        <ChevronRight size={18} color={colors.textTertiary} />
                    </TouchableOpacity>

                    <View style={[styles.divider, { backgroundColor: isDark ? '#27272A' : '#E4E4E7' }]} />

                    <TouchableOpacity
                        onPress={() => setShowBrowser(true)}
                        style={styles.settingRow}
                    >
                        <View style={styles.rowLeft}>
                            <HelpCircle size={18} color={colors.textSecondary} style={{ marginRight: 12 }} />
                            <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>Open Web Portal</Text>
                        </View>
                        <ChevronRight size={18} color={colors.textTertiary} />
                    </TouchableOpacity>
                </Card>

                <Text style={[styles.appVersion, { color: colors.textTertiary }]}>
                    Sheriyakam v1.0.0 (Build 2026.08) • Made for Kerala
                </Text>
            </ScrollView>

            {/* 2FA Modal */}
            <TwoFactorAuthModal
                visible={show2FAModal}
                onClose={() => setShow2FAModal(false)}
                onSuccess={() => setTwoFactorEnabled(true)}
            />

            {/* In App Browser */}
            <InAppBrowser
                visible={showBrowser}
                url="https://sheriyakam.com"
                title="Sheriyakam Home Services"
                onClose={() => setShowBrowser(false)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    backBtn: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '700',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
        marginBottom: 8,
        paddingLeft: 2,
    },
    cardGroup: {
        padding: 14,
        gap: 6,
    },
    divider: {
        height: 1,
        marginVertical: 6,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        paddingRight: 10,
    },
    iconWrap: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    rowTitle: {
        fontSize: 14,
        fontWeight: '600',
    },
    rowSubtitle: {
        fontSize: 12,
        marginTop: 1,
    },
    appVersion: {
        fontSize: 12,
        textAlign: 'center',
        marginTop: 24,
    },
});
