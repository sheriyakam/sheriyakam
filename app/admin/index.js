import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShieldAlert, Users, Briefcase, TrendingUp, CheckCircle, Clock, LogOut, BarChart2, Activity } from 'lucide-react-native';
import { COLORS, SPACING } from '../../constants/theme';
import { useRouter } from 'expo-router';

export default function AdminDashboard() {
    const router = useRouter();

    // Auth State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const handleLogin = () => {
        if (username === 'admin' && password === 'sheri@25') {
            setIsAuthenticated(true);
            setLoginError('');
        } else {
            setLoginError('Invalid credentials');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUsername('');
        setPassword('');
    };

    // ─── LOGIN SCREEN ───
    if (!isAuthenticated) {
        return (
            <SafeAreaView style={styles.loginContainer}>
                <View style={styles.loginBox}>
                    <View style={styles.loginIconWrap}>
                        <ShieldAlert size={36} color="#ef4444" />
                    </View>
                    <Text style={styles.loginTitle}>Admin Portal</Text>
                    <Text style={styles.loginSubtitle}>Restricted Access · Sheriyakam</Text>

                    {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null}

                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        placeholderTextColor="#6b7280"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#6b7280"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        autoCapitalize="none"
                    />

                    <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
                        <Text style={styles.loginBtnText}>Secure Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ marginTop: 28, alignSelf: 'center' }} onPress={() => router.replace('/')}>
                        <Text style={{ color: '#6b7280', fontSize: 13 }}>← Back to Sheriyakam</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    // ─── DASHBOARD ───
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>

                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>Command Center</Text>
                        <Text style={styles.headerSubtitle}>Sheriyakam Administration</Text>
                    </View>
                    <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                        <LogOut size={18} color="#ef4444" />
                    </TouchableOpacity>
                </View>

                {/* Overview Cards */}
                <View style={styles.metricsRow}>
                    <View style={[styles.metricCard, { borderLeftColor: '#3b82f6' }]}>
                        <Users size={22} color="#3b82f6" />
                        <Text style={styles.metricValue}>0</Text>
                        <Text style={styles.metricLabel}>Total Partners</Text>
                    </View>
                    <View style={[styles.metricCard, { borderLeftColor: '#10b981' }]}>
                        <Briefcase size={22} color="#10b981" />
                        <Text style={styles.metricValue}>0</Text>
                        <Text style={styles.metricLabel}>Active Jobs</Text>
                    </View>
                    <View style={[styles.metricCard, { borderLeftColor: '#f59e0b' }]}>
                        <TrendingUp size={22} color="#f59e0b" />
                        <Text style={styles.metricValue}>₹0</Text>
                        <Text style={styles.metricLabel}>Revenue</Text>
                    </View>
                </View>

                {/* Status Banner */}
                <View style={styles.statusBanner}>
                    <Activity size={18} color="#10b981" />
                    <Text style={styles.statusText}>System Online · No pending actions</Text>
                </View>

                {/* Quick Actions */}
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionsGrid}>
                    <TouchableOpacity style={styles.actionCard}>
                        <View style={[styles.actionIcon, { backgroundColor: 'rgba(59,130,246,0.1)' }]}>
                            <Users size={22} color="#3b82f6" />
                        </View>
                        <Text style={styles.actionLabel}>Partner Verification</Text>
                        <Text style={styles.actionDesc}>Review and approve new partner applications</Text>
                        <View style={styles.actionBadge}>
                            <CheckCircle size={12} color="#10b981" />
                            <Text style={styles.actionBadgeText}>0 Pending</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionCard}>
                        <View style={[styles.actionIcon, { backgroundColor: 'rgba(239,68,68,0.1)' }]}>
                            <ShieldAlert size={22} color="#ef4444" />
                        </View>
                        <Text style={styles.actionLabel}>Complaints</Text>
                        <Text style={styles.actionDesc}>Monitor red flags and customer disputes</Text>
                        <View style={styles.actionBadge}>
                            <CheckCircle size={12} color="#10b981" />
                            <Text style={styles.actionBadgeText}>0 Open</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionCard}>
                        <View style={[styles.actionIcon, { backgroundColor: 'rgba(16,185,129,0.1)' }]}>
                            <BarChart2 size={22} color="#10b981" />
                        </View>
                        <Text style={styles.actionLabel}>Analytics</Text>
                        <Text style={styles.actionDesc}>View booking trends and performance data</Text>
                        <View style={styles.actionBadge}>
                            <Clock size={12} color="#f59e0b" />
                            <Text style={styles.actionBadgeText}>Coming Soon</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionCard}>
                        <View style={[styles.actionIcon, { backgroundColor: 'rgba(245,158,11,0.1)' }]}>
                            <TrendingUp size={22} color="#f59e0b" />
                        </View>
                        <Text style={styles.actionLabel}>Revenue</Text>
                        <Text style={styles.actionDesc}>Track earnings, commissions, and payouts</Text>
                        <View style={styles.actionBadge}>
                            <Clock size={12} color="#f59e0b" />
                            <Text style={styles.actionBadgeText}>Coming Soon</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Recent Activity */}
                <Text style={styles.sectionTitle}>Recent Activity</Text>
                <View style={styles.emptyActivity}>
                    <Clock size={40} color="#374151" />
                    <Text style={styles.emptyTitle}>No Activity Yet</Text>
                    <Text style={styles.emptyDesc}>Partner applications, bookings, and system events will appear here in real-time.</Text>
                </View>

                <View style={{ height: 60 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    // ─── LOGIN ───
    loginContainer: {
        flex: 1,
        backgroundColor: '#0f172a',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    loginBox: {
        width: '100%',
        maxWidth: 380,
        backgroundColor: '#1e293b',
        padding: 36,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.15)',
    },
    loginIconWrap: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(239, 68, 68, 0.08)',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 20,
    },
    loginTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#f8fafc',
        textAlign: 'center',
        marginBottom: 6,
    },
    loginSubtitle: {
        fontSize: 13,
        color: '#64748b',
        textAlign: 'center',
        marginBottom: 28,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    input: {
        backgroundColor: '#0f172a',
        borderRadius: 10,
        padding: 16,
        color: '#f8fafc',
        fontSize: 15,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#334155',
    },
    loginBtn: {
        backgroundColor: '#ef4444',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 6,
    },
    loginBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
    },
    errorText: {
        color: '#ef4444',
        textAlign: 'center',
        marginBottom: 16,
        fontWeight: '600',
        fontSize: 13,
    },

    // ─── DASHBOARD ───
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        paddingBottom: 16,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#f8fafc',
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#64748b',
        marginTop: 4,
    },
    logoutBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(239,68,68,0.08)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // ─── METRICS ───
    metricsRow: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        gap: 12,
        marginBottom: 20,
    },
    metricCard: {
        flex: 1,
        backgroundColor: '#1e293b',
        padding: 16,
        borderRadius: 14,
        borderLeftWidth: 3,
        alignItems: 'center',
        gap: 6,
    },
    metricValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#f8fafc',
    },
    metricLabel: {
        fontSize: 11,
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },

    // ─── STATUS ───
    statusBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(16,185,129,0.06)',
        marginHorizontal: 24,
        padding: 14,
        borderRadius: 10,
        gap: 10,
        borderWidth: 1,
        borderColor: 'rgba(16,185,129,0.15)',
        marginBottom: 28,
    },
    statusText: {
        color: '#10b981',
        fontSize: 13,
        fontWeight: '600',
    },

    // ─── SECTIONS ───
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#94a3b8',
        paddingHorizontal: 24,
        marginBottom: 14,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },

    // ─── ACTIONS GRID ───
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 24,
        gap: 12,
        marginBottom: 32,
    },
    actionCard: {
        width: '48%',
        backgroundColor: '#1e293b',
        padding: 18,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#334155',
    },
    actionIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },
    actionLabel: {
        fontSize: 15,
        fontWeight: '700',
        color: '#f8fafc',
        marginBottom: 6,
    },
    actionDesc: {
        fontSize: 12,
        color: '#64748b',
        lineHeight: 18,
        marginBottom: 14,
    },
    actionBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    actionBadgeText: {
        fontSize: 12,
        color: '#94a3b8',
        fontWeight: '600',
    },

    // ─── EMPTY ───
    emptyActivity: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1e293b',
        marginHorizontal: 24,
        padding: 40,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#334155',
        borderStyle: 'dashed',
    },
    emptyTitle: {
        color: '#94a3b8',
        fontSize: 16,
        fontWeight: '700',
        marginTop: 16,
    },
    emptyDesc: {
        color: '#475569',
        fontSize: 13,
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 20,
        maxWidth: 280,
    },
});
