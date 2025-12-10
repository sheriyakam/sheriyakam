import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS, SPACING } from '../../constants/theme';
import { ArrowLeft, User, Users, ChevronRight } from 'lucide-react-native';
import { getCurrentPartner, getSupervisorForPartner } from '../../constants/partnerStore';

export default function PartnerMessages() {
    const router = useRouter();
    const currentPartner = getCurrentPartner();
    const supervisor = getSupervisorForPartner(currentPartner);

    const conversations = [
        {
            id: 'supervisor',
            name: supervisor.name,
            role: `Supervisor - ${supervisor.taluk}`,
            type: 'supervisor',
            lastMessage: 'I have received your message.',
            time: '10:05 AM',
            icon: <User size={24} color="#fff" />,
            color: COLORS.primary
        },
        {
            id: 'community',
            name: 'Community',
            role: 'Community Group',
            type: 'community',
            lastMessage: 'Anyone available for a quick job near Beach Road?',
            time: '09:30 AM',
            icon: <Users size={24} color="#fff" />,
            color: COLORS.accent
        }
    ];

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.chatItem}
            onPress={() => router.push({
                pathname: '/partner/chat',
                params: { type: item.type, name: item.name, subtitle: item.role }
            })}
        >
            <View style={[styles.avatar, { backgroundColor: item.color }]}>
                {item.icon}
            </View>
            <View style={styles.chatInfo}>
                <View style={styles.chatHeader}>
                    <Text style={styles.chatName}>{item.name}</Text>
                    <Text style={styles.chatTime}>{item.time}</Text>
                </View>
                <Text style={styles.chatRole}>{item.role}</Text>
                <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
            </View>
            <ChevronRight size={20} color={COLORS.textTertiary} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Messages</Text>
            </View>

            <FlatList
                data={conversations}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
            />
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
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.bgSecondary,
        gap: 12,
    },
    backBtn: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    listContent: {
        padding: SPACING.md,
    },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 12,
        marginBottom: SPACING.sm,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    chatInfo: {
        flex: 1,
        marginRight: 8,
    },
    chatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2,
    },
    chatName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    chatTime: {
        fontSize: 12,
        color: COLORS.textTertiary,
    },
    chatRole: {
        fontSize: 12,
        color: COLORS.primary,
        fontWeight: '500',
        marginBottom: 2,
    },
    lastMessage: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
});
