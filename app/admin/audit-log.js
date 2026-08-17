import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Shield, Filter, Download, User, Lock, CheckCircle2, AlertTriangle, Key } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';
import { useToast } from '../../context/ToastContext';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

const AUDIT_LOGS = [
    { id: 'aud_1', timestamp: '2026-08-17 14:12:05', actor: 'admin@sheriyakam.com', event: 'USER_KYC_APPROVED', target: 'Vinod M (Contractor)', ip: '117.218.42.10', status: 'SUCCESS' },
    { id: 'aud_2', timestamp: '2026-08-17 13:45:18', actor: 'dispatcher@sheriyakam.com', event: 'EMERGENCY_DISPATCH', target: 'Booking #SHK-829104', ip: '117.218.42.10', status: 'SUCCESS' },
    { id: 'aud_3', timestamp: '2026-08-17 12:30:40', actor: 'system@supabase', event: 'AUTH_2FA_ENABLED', target: 'radha@gmail.com', ip: '49.37.192.88', status: 'SUCCESS' },
    { id: 'aud_4', timestamp: '2026-08-17 11:15:22', actor: 'api_client_erp', event: 'API_KEY_ROTATED', target: 'Key #shk_sec_71b9', ip: '103.21.244.0', status: 'WARNING' },
    { id: 'aud_5', timestamp: '2026-08-17 09:20:11', actor: 'admin@sheriyakam.com', event: 'USER_SUSPENDED', target: 'Anoop Chandran', ip: '117.218.42.10', status: 'SUCCESS' },
];

export default function AdminAuditLogScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { success } = useToast();
    const isDark = theme === 'dark';

    const columns = [
        { key: 'timestamp', title: 'Timestamp', sortable: true, width: 160 },
        {
            key: 'event',
            title: 'Action Event',
            sortable: true,
            width: 170,
            render: (val) => (
                <Badge variant={val.includes('APPROVED') || val.includes('SUCCESS') ? 'success' : val.includes('EMERGENCY') ? 'danger' : 'info'} size="sm">
                    {val}
                </Badge>
            )
        },
        { key: 'actor', title: 'Actor', sortable: true, width: 170 },
        { key: 'target', title: 'Target Entity', sortable: true, width: 170 },
        { key: 'ip', title: 'IP Address', sortable: true, width: 130 },
    ];

    const handleExportAudit = () => {
        success('Security Audit Log exported as encrypted CSV.', 'Audit Export');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <View>
                    <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
                        Security & Audit Trail
                    </Text>
                    <Text style={[styles.headerSubtitle, { color: colors.textTertiary }]}>
                        Immutable logging of administrative actions
                    </Text>
                </View>
                <Button variant="secondary" size="sm" iconLeft={Download} onPress={handleExportAudit}>
                    Export Log
                </Button>
            </View>

            {/* Audit DataTable */}
            <View style={styles.tableWrap}>
                <DataTable
                    columns={columns}
                    data={AUDIT_LOGS}
                    searchable={true}
                    pageSize={10}
                />
            </View>
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
    headerSubtitle: {
        fontSize: 12,
    },
    tableWrap: {
        flex: 1,
        padding: 16,
    },
});
