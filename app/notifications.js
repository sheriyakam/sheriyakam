import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Bell, CheckCheck, Trash2, Zap, Shield, Tag, Calendar, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { useToast } from '../context/ToastContext';
import { Tabs } from '../components/ui/Tabs';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';

const INITIAL_NOTIFICATIONS = [
    {
        id: 'n1',
        type: 'booking',
        title: 'Electrician Dispatched',
        message: 'Contractor Sanoop K. is en route to Civil Station, Kozhikode. ETA: 18 mins.',
        time: '10 mins ago',
        read: false,
        icon: Zap,
        variant: 'info',
        actionRoute: '/bookings',
    },
    {
        id: 'n2',
        type: 'offers',
        title: 'Festival Offer: 20% Off Wiring',
        message: 'Use promo code KERALA20 on your next inverter or switchboard service.',
        time: '2 hours ago',
        read: false,
        icon: Tag,
        variant: 'gold',
        actionRoute: '/search',
    },
    {
        id: 'n3',
        type: 'security',
        title: 'New Login Detected',
        message: 'Account accessed via Chrome on Windows (IP: 117.218.42.10 - Kozhikode).',
        time: 'Yesterday',
        read: true,
        icon: Shield,
        variant: 'success',
        actionRoute: '/account',
    },
    {
        id: 'n4',
        type: 'booking',
        title: 'Service Completed & Warranty Active',
        message: 'Your ceiling fan repair (SHK-829104) is verified. 30-day warranty started.',
        time: '3 days ago',
        read: true,
        icon: Calendar,
        variant: 'success',
        actionRoute: '/bookings',
    },
];

export default function NotificationsScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { success } = useToast();
    const isDark = theme === 'dark';

    const [activeTab, setActiveTab] = useState('all');
    const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

    const tabs = [
        { id: 'all', label: 'All', count: notifications.filter((n) => !n.read).length },
        { id: 'booking', label: 'Bookings' },
        { id: 'offers', label: 'Offers' },
        { id: 'security', label: 'Security' },
    ];

    const filtered = notifications.filter((n) => {
        if (activeTab === 'all') return true;
        return n.type === activeTab;
    });

    const handleMarkAllRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        success('All notifications marked as read', 'Updated');
    };

    const handleClearAll = () => {
        setNotifications([]);
        success('Notification history cleared');
    };

    const handleItemPress = (notif) => {
        setNotifications((prev) => 
            prev.map((n) => n.id === notif.id ? { ...n, read: true } : n)
        );
        if (notif.actionRoute) {
            router.push(notif.actionRoute);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Notifications</Text>
                
                <View style={styles.headerActions}>
                    <TouchableOpacity onPress={handleMarkAllRead} style={styles.headerIconBtn}>
                        <CheckCheck size={18} color={colors.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleClearAll} style={styles.headerIconBtn}>
                        <Trash2 size={18} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Filter Tabs */}
            <View style={styles.tabsWrap}>
                <Tabs
                    tabs={tabs}
                    activeTab={activeTab}
                    onChange={setActiveTab}
                    variant="pills"
                />
            </View>

            {/* Notifications List */}
            <ScrollView contentContainerStyle={styles.listContent}>
                {filtered.length === 0 ? (
                    <EmptyState
                        icon={Bell}
                        title="No notifications"
                        description="You're all caught up! Booking updates and special offers will appear here."
                    />
                ) : (
                    filtered.map((item) => {
                        const Icon = item.icon;
                        return (
                            <TouchableOpacity
                                key={item.id}
                                onPress={() => handleItemPress(item)}
                                activeOpacity={0.7}
                            >
                                <Card
                                    variant="default"
                                    style={[
                                        styles.notifCard,
                                        !item.read && {
                                            borderColor: isDark ? colors.accent + '40' : colors.accent + '30',
                                            backgroundColor: isDark ? '#18181B' : '#FFFFFF',
                                        }
                                    ]}
                                >
                                    <View style={styles.cardRow}>
                                        <View style={[
                                            styles.iconBox,
                                            {
                                                backgroundColor: item.variant === 'gold' ? '#F59E0B18' : item.variant === 'success' ? '#10B98118' : colors.accent + '18',
                                            }
                                        ]}>
                                            <Icon
                                                size={20}
                                                color={item.variant === 'gold' ? '#F59E0B' : item.variant === 'success' ? '#10B981' : colors.accent}
                                            />
                                        </View>

                                        <View style={styles.cardDetails}>
                                            <View style={styles.cardTop}>
                                                <Text style={[styles.notifTitle, { color: colors.textPrimary }]}>
                                                    {item.title}
                                                </Text>
                                                {!item.read ? (
                                                    <View style={[styles.unreadDot, { backgroundColor: colors.accent }]} />
                                                ) : null}
                                            </View>

                                            <Text style={[styles.notifMsg, { color: colors.textSecondary }]}>
                                                {item.message}
                                            </Text>

                                            <Text style={[styles.notifTime, { color: colors.textTertiary }]}>
                                                {item.time}
                                            </Text>
                                        </View>
                                    </View>
                                </Card>
                            </TouchableOpacity>
                        );
                    })
                )}
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
    headerActions: {
        flexDirection: 'row',
        gap: 12,
    },
    headerIconBtn: {
        padding: 4,
    },
    tabsWrap: {
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    listContent: {
        padding: 16,
        paddingBottom: 40,
        gap: 10,
    },
    notifCard: {
        padding: 14,
    },
    cardRow: {
        flexDirection: 'row',
        gap: 12,
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardDetails: {
        flex: 1,
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 3,
    },
    notifTitle: {
        fontSize: 14,
        fontWeight: '700',
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    notifMsg: {
        fontSize: 13,
        lineHeight: 18,
        marginBottom: 6,
    },
    notifTime: {
        fontSize: 11,
    },
});
