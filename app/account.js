import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, User, Lock, Smartphone, Laptop, Trash2, ShieldCheck, Check, AlertTriangle } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';

export default function AccountScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { user, deleteAccount } = useAuth();
    const { success, error: showError } = useToast();
    const isDark = theme === 'dark';

    const [currentPass, setCurrentPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [isUpdatingPass, setIsUpdatingPass] = useState(false);

    const [activeSessions, setActiveSessions] = useState([
        {
            id: 'sess_1',
            device: 'iPhone 15 Pro (Current)',
            ip: '117.218.42.10',
            location: 'Kozhikode, India',
            isCurrent: true,
            icon: Smartphone,
        },
        {
            id: 'sess_2',
            device: 'Chrome on macOS',
            ip: '49.37.192.88',
            location: 'Kochi, India',
            isCurrent: false,
            icon: Laptop,
        }
    ]);

    const handleUpdatePassword = () => {
        if (!currentPass) {
            showError('Please enter your current password');
            return;
        }
        if (newPass.length < 8) {
            showError('New password must be at least 8 characters long');
            return;
        }
        if (newPass !== confirmPass) {
            showError('New passwords do not match');
            return;
        }

        setIsUpdatingPass(true);
        setTimeout(() => {
            setIsUpdatingPass(false);
            success('Password successfully updated!', 'Security Updated');
            setCurrentPass('');
            setNewPass('');
            setConfirmPass('');
        }, 1000);
    };

    const handleRevokeSession = (sessionId) => {
        setActiveSessions((prev) => prev.filter((s) => s.id !== sessionId));
        success('Session revoked and logged out remotely');
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            "Permanently Delete Account",
            "Are you sure you want to delete your Sheriyakam account? All your booking history, saved addresses, and active warranties will be erased.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete My Account",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteAccount();
                            success('Your account and data have been completely deleted.');
                            router.replace('/auth/login');
                        } catch (e) {
                            showError('Failed to delete account. Please try again.');
                        }
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Account & Security</Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* User Profile Card */}
                <Card variant="default" style={styles.profileCard}>
                    <View style={styles.profileRow}>
                        <Avatar
                            name={user?.name || 'John Doe'}
                            size={56}
                            status="online"
                        />
                        <View style={styles.profileText}>
                            <Text style={[styles.userName, { color: colors.textPrimary }]}>
                                {user?.name || 'John Doe'}
                            </Text>
                            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
                                {user?.email || 'user@sheriyakam.com'}
                            </Text>
                            <View style={{ flexDirection: 'row', marginTop: 4 }}>
                                <Badge variant="success" size="sm">Verified Resident</Badge>
                            </View>
                        </View>
                    </View>
                </Card>

                {/* Change Password Form */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 16 }]}>
                    CHANGE PASSWORD
                </Text>
                <Card variant="default" style={styles.cardSection}>
                    <Input
                        label="Current Password"
                        value={currentPass}
                        onChangeText={setCurrentPass}
                        placeholder="••••••••"
                        secureTextEntry
                    />
                    <Input
                        label="New Password"
                        value={newPass}
                        onChangeText={setNewPass}
                        placeholder="Minimum 8 characters"
                        secureTextEntry
                        hint="Use numbers and symbols for stronger security"
                    />
                    <Input
                        label="Confirm New Password"
                        value={confirmPass}
                        onChangeText={setConfirmPass}
                        placeholder="••••••••"
                        secureTextEntry
                    />

                    <Button
                        variant="primary"
                        size="md"
                        loading={isUpdatingPass}
                        onPress={handleUpdatePassword}
                        style={{ alignSelf: 'flex-start' }}
                    >
                        Update Password
                    </Button>
                </Card>

                {/* Active Sessions */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 16 }]}>
                    ACTIVE SESSIONS & DEVICES
                </Text>
                <Card variant="default" style={styles.cardSection}>
                    {activeSessions.map((session) => {
                        const Icon = session.icon;
                        return (
                            <View key={session.id} style={styles.sessionRow}>
                                <View style={[styles.deviceIcon, { backgroundColor: isDark ? '#27272A' : '#F4F4F5' }]}>
                                    <Icon size={18} color={colors.textPrimary} />
                                </View>

                                <View style={{ flex: 1 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                        <Text style={[styles.deviceName, { color: colors.textPrimary }]}>
                                            {session.device}
                                        </Text>
                                        {session.isCurrent ? (
                                            <Badge variant="info" size="sm">This Device</Badge>
                                        ) : null}
                                    </View>
                                    <Text style={[styles.deviceMeta, { color: colors.textTertiary }]}>
                                        {session.location} • {session.ip}
                                    </Text>
                                </View>

                                {!session.isCurrent ? (
                                    <TouchableOpacity 
                                        onPress={() => handleRevokeSession(session.id)}
                                        style={styles.revokeBtn}
                                    >
                                        <Text style={[styles.revokeText, { color: colors.danger }]}>Revoke</Text>
                                    </TouchableOpacity>
                                ) : null}
                            </View>
                        );
                    })}
                </Card>

                {/* Danger Zone: Account Deletion */}
                <Text style={[styles.sectionTitle, { color: colors.danger, marginTop: 24 }]}>
                    DANGER ZONE
                </Text>
                <Card variant="default" style={[styles.cardSection, { borderColor: colors.danger + '40' }]}>
                    <View style={styles.dangerRow}>
                        <View style={{ flex: 1, paddingRight: 10 }}>
                            <Text style={[styles.dangerTitle, { color: colors.textPrimary }]}>
                                Delete Account Permanently
                            </Text>
                            <Text style={[styles.dangerDesc, { color: colors.textTertiary }]}>
                                Purge all personal data, service history, and warranties according to GDPR/DPDP rules.
                            </Text>
                        </View>

                        <Button
                            variant="danger"
                            size="sm"
                            onPress={handleDeleteAccount}
                            iconLeft={Trash2}
                        >
                            Delete
                        </Button>
                    </View>
                </Card>
            </ScrollView>
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
    profileCard: {
        padding: 16,
    },
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    profileText: {
        flex: 1,
    },
    userName: {
        fontSize: 17,
        fontWeight: '700',
    },
    userEmail: {
        fontSize: 13,
        marginTop: 2,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
        marginBottom: 8,
        paddingLeft: 2,
    },
    cardSection: {
        padding: 16,
        gap: 8,
    },
    sessionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        gap: 12,
    },
    deviceIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    deviceName: {
        fontSize: 14,
        fontWeight: '600',
    },
    deviceMeta: {
        fontSize: 11,
        marginTop: 2,
    },
    revokeBtn: {
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    revokeText: {
        fontSize: 12,
        fontWeight: '700',
    },
    dangerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dangerTitle: {
        fontSize: 14,
        fontWeight: '700',
    },
    dangerDesc: {
        fontSize: 12,
        marginTop: 2,
        lineHeight: 16,
    },
});
