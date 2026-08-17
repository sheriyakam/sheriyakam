import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, UserCheck, UserX, ShieldCheck, Mail, Phone, Plus, Filter } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';
import { useToast } from '../../context/ToastContext';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Tabs';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';

const USERS_DATA = [
    { id: 'usr_1', name: 'Dr. Radhakrishnan K', email: 'radha@gmail.com', role: 'Customer', taluk: 'Kozhikode', status: 'Active', orders: 12, joined: '2026-01-15' },
    { id: 'usr_2', name: 'Sanoop K (Electrician)', email: 'sanoop.el@gmail.com', role: 'Partner', taluk: 'Kozhikode', status: 'Verified', orders: 342, joined: '2026-02-01' },
    { id: 'usr_3', name: 'Vinod M (Contractor)', email: 'vinod.m@gmail.com', role: 'Partner', taluk: 'Vadakara', status: 'Pending', orders: 0, joined: '2026-08-10' },
    { id: 'usr_4', name: 'Fathima Noor', email: 'fathima.noor@yahoo.com', role: 'Customer', taluk: 'Vadakara', status: 'Active', orders: 3, joined: '2026-03-22' },
    { id: 'usr_5', name: 'Rahim P (Electrician)', email: 'rahim.p@gmail.com', role: 'Partner', taluk: 'Thamarassery', status: 'Verified', orders: 189, joined: '2026-02-14' },
    { id: 'usr_6', name: 'Anoop Chandran', email: 'anoop.c@gmail.com', role: 'Customer', taluk: 'Koyilandy', status: 'Suspended', orders: 1, joined: '2026-04-05' },
];

export default function AdminUsersScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { success, warning } = useToast();
    const isDark = theme === 'dark';

    const [activeTab, setActiveTab] = useState('all');
    const [selectedUser, setSelectedUser] = useState(null);

    const tabs = [
        { id: 'all', label: 'All (6)' },
        { id: 'Customer', label: 'Customers' },
        { id: 'Partner', label: 'Partners' },
        { id: 'Pending', label: 'Pending KYC' },
    ];

    const filteredUsers = USERS_DATA.filter((u) => {
        if (activeTab === 'all') return true;
        if (activeTab === 'Pending') return u.status === 'Pending';
        return u.role === activeTab;
    });

    const columns = [
        { key: 'name', title: 'User / Business', sortable: true, width: 170 },
        {
            key: 'role',
            title: 'Role',
            sortable: true,
            width: 110,
            render: (val) => (
                <Badge variant={val === 'Partner' ? 'purple' : 'neutral'} size="sm">
                    {val}
                </Badge>
            )
        },
        { key: 'taluk', title: 'Taluk', sortable: true, width: 120 },
        {
            key: 'status',
            title: 'Status',
            sortable: true,
            width: 110,
            render: (val) => (
                <Badge variant={val === 'Verified' || val === 'Active' ? 'success' : val === 'Pending' ? 'warning' : 'danger'} size="sm" dot>
                    {val}
                </Badge>
            )
        },
        { key: 'orders', title: 'Orders / Jobs', sortable: true, width: 110 },
        { key: 'joined', title: 'Joined Date', sortable: true, width: 120 },
    ];

    const handleApproveKYC = (user) => {
        success(`Contractor license for ${user.name} approved! SMS dispatched.`);
        setSelectedUser(null);
    };

    const handleSuspendUser = (user) => {
        warning(`User ${user.name} suspended from platform.`);
        setSelectedUser(null);
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
                        User & Partner Directory
                    </Text>
                    <Text style={[styles.headerSubtitle, { color: colors.textTertiary }]}>
                        Manage KYC, roles, and contractor licenses
                    </Text>
                </View>
                <Button 
                    variant="primary" 
                    size="sm" 
                    iconLeft={Plus}
                    onPress={() => success('Invite modal opened')}
                >
                    Add User
                </Button>
            </View>

            {/* Filter Tabs */}
            <View style={styles.tabsContainer}>
                <Tabs
                    tabs={tabs}
                    activeTab={activeTab}
                    onChange={setActiveTab}
                    variant="pills"
                />
            </View>

            {/* DataTable */}
            <View style={styles.tableContainer}>
                <DataTable
                    columns={columns}
                    data={filteredUsers}
                    searchable={true}
                    selectable={true}
                    onRowPress={(row) => setSelectedUser(row)}
                />
            </View>

            {/* User Details Modal */}
            <Modal
                visible={!!selectedUser}
                onClose={() => setSelectedUser(null)}
                title={selectedUser ? selectedUser.name : ''}
                subtitle={selectedUser ? `${selectedUser.role} • ${selectedUser.email}` : ''}
            >
                {selectedUser ? (
                    <View style={styles.modalContent}>
                        <View style={styles.detailItem}>
                            <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>Taluk & Zone:</Text>
                            <Text style={[styles.detailVal, { color: colors.textPrimary }]}>{selectedUser.taluk}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>Account Status:</Text>
                            <Badge variant={selectedUser.status === 'Verified' || selectedUser.status === 'Active' ? 'success' : 'warning'}>
                                {selectedUser.status}
                            </Badge>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>Total Orders/Jobs:</Text>
                            <Text style={[styles.detailVal, { color: colors.textPrimary }]}>{selectedUser.orders}</Text>
                        </View>

                        <View style={styles.modalActions}>
                            {selectedUser.status === 'Pending' ? (
                                <Button
                                    variant="primary"
                                    size="md"
                                    fullWidth
                                    iconLeft={ShieldCheck}
                                    onPress={() => handleApproveKYC(selectedUser)}
                                >
                                    Approve Electrician License
                                </Button>
                            ) : null}

                            <Button
                                variant="danger"
                                size="md"
                                fullWidth
                                iconLeft={UserX}
                                onPress={() => handleSuspendUser(selectedUser)}
                                style={{ marginTop: 8 }}
                            >
                                Suspend Account
                            </Button>
                        </View>
                    </View>
                ) : null}
            </Modal>
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
    tabsContainer: {
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    tableContainer: {
        flex: 1,
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    modalContent: {
        gap: 12,
        paddingVertical: 8,
    },
    detailItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    detailLabel: {
        fontSize: 13,
    },
    detailVal: {
        fontSize: 13,
        fontWeight: '600',
    },
    modalActions: {
        marginTop: 16,
    },
});
