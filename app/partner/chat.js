import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, KeyboardAvoidingView, Platform, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS, SPACING } from '../../constants/theme';
import { Send, ArrowLeft, Phone, User as UserIcon, Users, MapPin, Zap } from 'lucide-react-native';
import { getCurrentPartner, getSupervisorForPartner } from '../../constants/partnerStore';

export default function PartnerChat() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { type, name, subtitle, bookingId, phone } = params;

    const currentPartner = getCurrentPartner();
    const supervisor = getSupervisorForPartner(currentPartner);

    const chatType = type || 'supervisor';
    const chatTitle = name || (chatType === 'customer' ? 'Customer' : supervisor.name);
    const chatSubtitle = subtitle || (
        chatType === 'customer'
            ? `Job #${bookingId || 'Active'} • Pre-Arrival Logistics`
            : `Supervisor - ${supervisor.taluk}`
    );

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const flatListRef = useRef(null);

    const customerPresets = [
        "I have reached outside the gate",
        "Please share flat / floor number",
        "Two-wheeler parking available?",
        "Where is the main MCB / DB box?"
    ];

    useEffect(() => {
        if (chatType === 'customer') {
            setMessages([
                {
                    id: '1',
                    text: `Hello! I am on my way to your address for ${params.service || 'your electrical service'}. Please let me know any gate codes or landmark.`,
                    sender: 'me',
                    time: '10:02 AM'
                },
                {
                    id: '2',
                    text: 'Hello, landmark is opposite Malabar Gold showroom. Gate code is #4821, 2nd floor.',
                    sender: 'other',
                    senderName: name || 'Customer',
                    time: '10:04 AM'
                }
            ]);
        } else if (chatType === 'community') {
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

    const handleSendText = (textToSend) => {
        const text = textToSend || message;
        if (text && text.trim()) {
            const newMessage = {
                id: Date.now().toString(),
                text: text.trim(),
                sender: 'me',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, newMessage]);
            if (!textToSend) setMessage('');

            setTimeout(() => {
                let reply;
                if (chatType === 'customer') {
                    reply = {
                        id: Date.now().toString(),
                        text: 'Understood! I will be waiting at the door.',
                        sender: 'other',
                        senderName: name || 'Customer',
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    };
                } else if (chatType === 'community') {
                    reply = {
                        id: Date.now().toString(),
                        text: 'Thanks for the info!',
                        sender: 'other',
                        senderName: 'Vishnu (Tech)',
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    };
                } else {
                    reply = {
                        id: Date.now().toString(),
                        text: 'I have received your message. I will check the details and get back to you shortly.',
                        sender: 'supervisor',
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    };
                }
                setMessages(prev => [...prev, reply]);
            }, 1000);
        }
    };

    const handleCall = () => {
        const targetPhone = phone || (chatType === 'supervisor' ? supervisor.phone : null);
        if (targetPhone) {
            Linking.openURL(`tel:${targetPhone}`);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <View style={styles.avatarContainer}>
                    <View style={[
                        styles.avatar,
                        {
                            backgroundColor: chatType === 'community'
                                ? COLORS.accent
                                : chatType === 'customer'
                                    ? '#10B981'
                                    : COLORS.primary
                        }
                    ]}>
                        {chatType === 'community' ? (
                            <Users size={22} color="#fff" />
                        ) : chatType === 'customer' ? (
                            <UserIcon size={22} color="#fff" />
                        ) : (
                            <Zap size={22} color="#fff" />
                        )}
                    </View>
                </View>
                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle}>{chatTitle}</Text>
                    <Text style={styles.headerSubtitle}>{chatSubtitle}</Text>
                </View>
                {(chatType === 'supervisor' || phone) && (
                    <TouchableOpacity style={styles.phoneBtn} onPress={handleCall}>
                        <Phone size={20} color={COLORS.accent} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Quick Logistics Presets for Customer Chat */}
            {chatType === 'customer' && (
                <View style={styles.presetsContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presetsScroll}>
                        {customerPresets.map((preset, idx) => (
                            <TouchableOpacity
                                key={idx}
                                style={styles.presetPill}
                                onPress={() => handleSendText(preset)}
                            >
                                <Text style={styles.presetPillText}>{preset}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={[
                        styles.messageWrapper,
                        item.sender === 'me' ? styles.myMessageWrapper : styles.theirMessageWrapper
                    ]}>
                        {(chatType === 'community' || chatType === 'customer') && item.sender !== 'me' && (
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
                        placeholder={
                            chatType === 'customer'
                                ? "Ask gate code, landmark..."
                                : chatType === 'community'
                                    ? "Message community..."
                                    : "Message supervisor..."
                        }
                        placeholderTextColor={COLORS.textTertiary}
                        multiline
                    />
                    <TouchableOpacity
                        onPress={() => handleSendText()}
                        style={[styles.sendBtn, !message.trim() && { opacity: 0.5 }]}
                        disabled={!message.trim()}
                    >
                        <Send size={18} color="#fff" />
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
        paddingHorizontal: SPACING.md,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
        backgroundColor: COLORS.bgSecondary,
        gap: 8,
    },
    backBtn: {
        padding: 6,
    },
    avatarContainer: {
        marginRight: 4,
    },
    avatar: {
        width: 38,
        height: 38,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerInfo: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    headerSubtitle: {
        fontSize: 11,
        color: COLORS.textSecondary,
    },
    phoneBtn: {
        padding: 8,
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(37, 99, 235, 0.3)',
    },

    /* Presets */
    presetsContainer: {
        backgroundColor: COLORS.bgSecondary,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    presetsScroll: {
        paddingHorizontal: SPACING.md,
        gap: 8,
    },
    presetPill: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    presetPillText: {
        color: COLORS.textSecondary,
        fontSize: 11,
        fontWeight: '600',
    },

    chatContent: {
        padding: SPACING.md,
        paddingBottom: 20,
    },
    messageWrapper: {
        marginBottom: 12,
        maxWidth: '82%',
    },
    myMessageWrapper: {
        alignSelf: 'flex-end',
    },
    theirMessageWrapper: {
        alignSelf: 'flex-start',
    },
    senderName: {
        fontSize: 10,
        color: COLORS.textTertiary,
        marginBottom: 3,
        marginLeft: 4,
    },
    messageContainer: {
        padding: 12,
        borderRadius: 14,
    },
    myMessage: {
        backgroundColor: '#2563EB',
        borderBottomRightRadius: 2,
    },
    theirMessage: {
        backgroundColor: COLORS.bgSecondary,
        borderBottomLeftRadius: 2,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    messageText: {
        fontSize: 14,
        lineHeight: 20,
    },
    myMessageText: {
        color: '#fff',
    },
    theirMessageText: {
        color: COLORS.textPrimary,
    },
    timeText: {
        fontSize: 9,
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
        padding: 12,
        backgroundColor: COLORS.bgSecondary,
        borderTopWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'center',
        gap: 8,
    },
    input: {
        flex: 1,
        backgroundColor: COLORS.bgPrimary,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        maxHeight: 100,
        color: COLORS.textPrimary,
        borderWidth: 1,
        borderColor: COLORS.border,
        fontSize: 13,
    },
    sendBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.accent,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
