import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS, SPACING } from '../../constants/theme';
import { ArrowLeft, User, Users, ChevronRight, MessageCircle } from 'lucide-react-native';
import { getCurrentPartner, getSupervisorForPartner } from '../../constants/partnerStore';

export default function PartnerMessages() {
    const router = useRouter();
    const currentPartner = getCurrentPartner();
    const supervisor = getSupervisorForPartner(currentPartner);

    const conversations = [
        {
            id: 'supervisor',
            name: supervisor.name,
            role: `Area Supervisor — ${supervisor.taluk}`,
            type: 'supervisor',
            lastMessage: 'I have received your message.',
            time: '10:05 AM',
            unread: 1,
            icon: <User size={22} color="#fff" />,
            color: COLORS.accent,
        },
        {
            id: 'community',
            name: 'Partner Community',
            role: 'Group Chat',
            type: 'community',
            lastMessage: 'Anyone available for a job near Beach Road?',
            time: '09:30 AM',
            unread: 3,
            icon: <Users size={22} color="#fff" />,
            color: COLORS.success,
        }
    ];

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.chatItem}
            onPress={() => router.push({
                pathname: '/partner/chat',
                params: { type: item.type, name: item.name, subtitle: item.role }
            })}
            activeOpacity={0.7}
        >
            <View style={[styles.avatar, { backgroundColor: item.color }]}>
                {item.icon}
            </View>
            <View style={styles.chatInfo}>
                <View style={styles.chatTop}>
                    <Text style={styles.chatName}>{item.name}</Text>
                    <Text style={styles.chatTime}>{item.time}</Text>
                </View>
                <Text style={styles.chatRole}>{item.role}</Text>
                <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
            </View>
            {item.unread > 0 && (
                <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{item.unread}</Text>
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>Messages</Text>
                    <Text style={styles.headerSub}>{conversations.length} conversations</Text>
                </View>
            </View>

            <FlatList
                data={conversations}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <MessageCircle size={48} color={COLORS.border} />
                        <Text style={styles.emptyTitle}>No Messages</Text>
                        <Text style={styles.emptyText}>Your conversations will appear here.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bgPrimary },
    header: {
        flexDirection: 'row', alignItems: 'center', gap: 14,
        paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
        borderBottomWidth: 1, borderColor: COLORS.border,
    },
    backBtn: { padding: 4 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.textPrimary },
    headerSub: { fontSize: 12, color: COLORS.textTertiary, marginTop: 1 },
    listContent: { padding: SPACING.md },

    chatItem: {
        flexDirection: 'row', alignItems: 'center',
        padding: SPACING.md, backgroundColor: COLORS.bgSecondary,
        borderRadius: 14, marginBottom: SPACING.sm,
        borderWidth: 1, borderColor: COLORS.border,
    },
    avatar: {
        width: 48, height: 48, borderRadius: 14,
        justifyContent: 'center', alignItems: 'center', marginRight: 12,
    },
    chatInfo: { flex: 1, marginRight: 8 },
    chatTop: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2,
    },
    chatName: { fontSize: 15, fontWeight: 'bold', color: COLORS.textPrimary },
    chatTime: { fontSize: 11, color: COLORS.textTertiary },
    chatRole: { fontSize: 11, color: COLORS.accent, fontWeight: '600', marginBottom: 3 },
    lastMessage: { fontSize: 13, color: COLORS.textSecondary },
    unreadBadge: {
        backgroundColor: COLORS.accent, width: 22, height: 22, borderRadius: 11,
        alignItems: 'center', justifyContent: 'center',
    },
    unreadText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

    emptyState: { alignItems: 'center', paddingVertical: 60 },
    emptyTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textPrimary, marginTop: 16, marginBottom: 6 },
    emptyText: { color: COLORS.textTertiary, fontSize: 14 },
});
