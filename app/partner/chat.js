import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS, SPACING } from '../../constants/theme';
import { Send, ArrowLeft, Phone, User as UserIcon, Users, Bell, BellOff } from 'lucide-react-native';
import { getCurrentPartner, getSupervisorForPartner, toggleCommunityMute, getCommunityMuteStatus } from '../../constants/partnerStore';

export default function PartnerChat() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { type, name, subtitle } = params;

    const currentPartner = getCurrentPartner();

    useEffect(() => {
        if (!currentPartner) {
            router.replace('/partner/auth');
        }
    }, [currentPartner]);

    if (!currentPartner) return null;

    const supervisor = getSupervisorForPartner(currentPartner);

    const chatTitle = name || supervisor.name;
    const chatSubtitle = subtitle || `Supervisor - ${supervisor.taluk}`;
    const chatType = type || 'supervisor';

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isMuted, setIsMuted] = useState(getCommunityMuteStatus());
    const flatListRef = useRef(null);

    useEffect(() => {
        if (chatType === 'community') {
            setMessages([
                { id: '1', text: 'Has anyone seen the new pricing update?', sender: 'other', senderName: 'Rahul (Electrician)', time: '09:00 AM' },
                { id: '2', text: 'Yes, it looks good. Better rates for AC work.', sender: 'other', senderName: 'Arun (AC)', time: '09:15 AM' },
                { id: '3', text: 'Anyone available for a quick job near Beach Road?', sender: 'other', senderName: 'Kiran (Plumber)', time: '09:30 AM' },
            ]);
        } else {
            setMessages([
                { id: '1', text: `Hello ${currentPartner?.name || 'Partner'}! I am your assigned supervisor for ${supervisor.taluk}. How can I assist you?`, sender: 'supervisor', time: '10:00 AM' },
            ]);
        }
    }, [chatType]);

    const handleSend = () => {
        if (message.trim()) {
            const newMessage = {
                id: Date.now().toString(),
                text: message,
                sender: 'me',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, newMessage]);
            setMessage('');

            setTimeout(() => {
                const reply = chatType === 'community'
                    ? {
                        id: Date.now().toString(),
                        text: 'Thanks for the info!',
                        sender: 'other',
                        senderName: 'Vishnu (Tech)',
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }
                    : {
                        id: Date.now().toString(),
                        text: 'I have received your message. I will check the details and get back to you shortly.',
                        sender: 'supervisor',
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    };

                setMessages(prev => [...prev, reply]);
            }, 1000);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <View style={styles.avatarContainer}>
                    <View style={[styles.avatar, { backgroundColor: chatType === 'community' ? COLORS.accent : COLORS.primary }]}>
                        {chatType === 'community' ? <Users size={24} color="#fff" /> : <UserIcon size={24} color="#fff" />}
                    </View>
                </View>
                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle}>{chatTitle}</Text>
                    <Text style={styles.headerSubtitle}>{chatSubtitle}</Text>
                </View>
                {chatType === 'supervisor' ? (
                    <TouchableOpacity style={styles.phoneBtn}>
                        <Phone size={24} color={COLORS.primary} />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={styles.phoneBtn}
                        onPress={() => {
                            const newStatus = toggleCommunityMute();
                            setIsMuted(newStatus);
                        }}
                    >
                        {isMuted ? (
                            <BellOff size={24} color={COLORS.textSecondary} />
                        ) : (
                            <Bell size={24} color={COLORS.primary} />
                        )}
                    </TouchableOpacity>
                )}
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={[
                        styles.messageWrapper,
                        item.sender === 'me' ? styles.myMessageWrapper : styles.theirMessageWrapper
                    ]}>
                        {chatType === 'community' && item.sender !== 'me' && (
                            <Text style={styles.senderName}>{item.senderName}</Text>
                        )}
                        <View style={[
                            styles.messageContainer,
                            item.sender === 'me' ? styles.myMessage : styles.theirMessage
                        ]}>
                            <Text style={[
                                styles.messageText,
                                item.sender === 'me' ? styles.myMessageText : styles.theirMessageText
                            ]}>{item.text}</Text>
                            <Text style={[
                                styles.timeText,
                                item.sender === 'me' ? styles.myTimeText : styles.theirTimeText
                            ]}>{item.time}</Text>
                        </View>
                    </View>
                )}
                contentContainerStyle={styles.chatContent}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={message}
                        onChangeText={setMessage}
                        placeholder={chatType === 'community' ? "Message community..." : "Message supervisor..."}
                        placeholderTextColor={COLORS.textTertiary}
                        multiline
                        returnKeyType="send"
                        onSubmitEditing={handleSend}
                    />
                    <TouchableOpacity onPress={handleSend} style={styles.sendBtn} disabled={!message.trim()}>
                        <Send size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgPrimary,
    },
    header: {
        padding: SPACING.md,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.bgSecondary,
    },
    backBtn: {
        padding: 8,
        marginRight: 8,
    },
    avatarContainer: {
        marginRight: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerInfo: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    headerSubtitle: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    phoneBtn: {
        padding: 8,
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderRadius: 20,
    },
    chatContent: {
        padding: SPACING.md,
        paddingBottom: 20,
    },
    messageWrapper: {
        marginBottom: 12,
        maxWidth: '80%',
    },
    myMessageWrapper: {
        alignSelf: 'flex-end',
    },
    theirMessageWrapper: {
        alignSelf: 'flex-start',
    },
    senderName: {
        fontSize: 11,
        color: COLORS.textSecondary,
        marginBottom: 2,
        marginLeft: 4,
    },
    messageContainer: {
        padding: 12,
        borderRadius: 16,
    },
    myMessage: {
        backgroundColor: COLORS.primary,
        borderBottomRightRadius: 2,
    },
    theirMessage: {
        backgroundColor: COLORS.bgSecondary,
        borderBottomLeftRadius: 2,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 20,
    },
    myMessageText: {
        color: '#fff',
    },
    theirMessageText: {
        color: COLORS.textPrimary,
    },
    timeText: {
        fontSize: 10,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    myTimeText: {
        color: 'rgba(255, 255, 255, 0.7)',
    },
    theirTimeText: {
        color: COLORS.textTertiary,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: SPACING.md,
        backgroundColor: COLORS.bgSecondary,
        borderTopWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'center',
        gap: 8,
    },
    input: {
        flex: 1,
        backgroundColor: COLORS.bgPrimary,
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 10,
        maxHeight: 100,
        color: COLORS.textPrimary,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    sendBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
