import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Phone, Camera, Send, CheckCheck, ShieldCheck, Image as ImageIcon } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { useToast } from '../context/ToastContext';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';

const INITIAL_MESSAGES = [
    {
        id: 'm1',
        sender: 'technician',
        text: 'Namaskaram! I am Sanoop, your assigned electrician. I have started from Mavoor Road.',
        time: '10:15 AM',
    },
    {
        id: 'm2',
        sender: 'technician',
        text: 'I will reach your location in Civil Station in about 15 minutes. Is the main power switch accessible?',
        time: '10:16 AM',
    },
    {
        id: 'm3',
        sender: 'user',
        text: 'Yes, the main MCB box is right inside the front veranda.',
        time: '10:18 AM',
    },
];

const QUICK_REPLIES = [
    'I am waiting at the front gate',
    'Please call before ringing bell',
    'Do you have a replacement capacitor?',
    'Take your time, no rush',
];

export default function ChatScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { success } = useToast();
    const isDark = theme === 'dark';

    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [inputText, setInputText] = useState('');
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    const handleSend = (textToSend) => {
        const content = textToSend || inputText;
        if (!content.trim()) return;

        const newMsg = {
            id: 'm_' + Date.now(),
            sender: 'user',
            text: content.trim(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, newMsg]);
        setInputText('');

        // Simulate automatic technician reply
        setTimeout(() => {
            const replyMsg = {
                id: 'm_' + (Date.now() + 1),
                sender: 'technician',
                text: 'Got it! I am carrying all standard testing tools and spare parts.',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages((prev) => [...prev, replyMsg]);
        }, 1500);
    };

    const handleCall = () => {
        Linking.openURL('tel:+914952800000').catch(() => {
            success('Connecting via Masked VoIP PBX Bridge (+91 495 280 0000) to protect private numbers.', 'Masked Calling Active');
        });
    };

    const handleAttachPhoto = () => {
        success('Attached breaker board photo for technician review', 'Image Sent');
        setMessages((prev) => [
            ...prev,
            {
                id: 'm_' + Date.now(),
                sender: 'user',
                text: '📷 [Attached: Breaker Panel Photo]',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
        ]);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Header with Contractor info */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7', backgroundColor: isDark ? '#18181B' : '#FFFFFF' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Go back">
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>

                <View style={styles.contractorInfo}>
                    <Avatar
                        name="Sanoop K"
                        status="online"
                        size={38}
                    />
                    <View style={styles.contractorText}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Text style={[styles.contractorName, { color: colors.textPrimary }]}>
                                Sanoop K.
                            </Text>
                            <Badge variant="success" size="sm">KSELB Licensed</Badge>
                        </View>
                        <Text style={[styles.contractorStatus, { color: colors.textTertiary }]}>
                            En Route (Live GPS) • ETA: 12 mins
                        </Text>
                    </View>
                </View>

                <TouchableOpacity 
                    onPress={handleCall}
                    style={[styles.callBtn, { backgroundColor: '#10B98118' }]}
                    accessibilityRole="button"
                    accessibilityLabel="Call technician via masked PBX"
                >
                    <Phone size={18} color="#10B981" />
                </TouchableOpacity>
            </View>

            {/* Chat Body */}
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
                style={{ flex: 1 }}
            >
                <ScrollView 
                    ref={scrollRef} 
                    contentContainerStyle={styles.messagesList}
                >
                    <View style={[styles.securityNotice, { backgroundColor: isDark ? '#18181B' : '#EFF6FF', padding: 8, borderRadius: 10 }]}>
                        <ShieldCheck size={14} color="#10B981" />
                        <Text style={[styles.securityNoticeText, { color: colors.textSecondary }]}>
                            🔒 Masked VoIP Calling & End-to-End Encrypted Chat. Numbers remain private.
                        </Text>
                    </View>

                    {messages.map((msg) => {
                        const isUser = msg.sender === 'user';
                        return (
                            <View
                                key={msg.id}
                                style={[
                                    styles.msgBubbleWrap,
                                    isUser ? styles.userBubbleWrap : styles.technicianBubbleWrap,
                                ]}
                            >
                                <View
                                    style={[
                                        styles.msgBubble,
                                        isUser
                                            ? [styles.userBubble, { backgroundColor: colors.accent }]
                                            : [styles.technicianBubble, { backgroundColor: isDark ? '#18181B' : '#FFFFFF', borderColor: isDark ? '#27272A' : '#E4E4E7' }]
                                    ]}
                                >
                                    <Text style={[
                                        styles.msgText,
                                        { color: isUser ? '#FFFFFF' : colors.textPrimary }
                                    ]}>
                                        {msg.text}
                                    </Text>
                                    <View style={styles.bubbleFooter}>
                                        <Text style={[
                                            styles.timeText,
                                            { color: isUser ? '#FFFFFFB0' : colors.textTertiary }
                                        ]}>
                                            {msg.time}
                                        </Text>
                                        {isUser ? (
                                            <CheckCheck size={13} color="#FFFFFFB0" style={{ marginLeft: 4 }} />
                                        ) : null}
                                    </View>
                                </View>
                            </View>
                        );
                    })}
                </ScrollView>

                {/* Quick Reply Suggestion Chips */}
                <View style={styles.quickRepliesBar}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickScroll}>
                        {QUICK_REPLIES.map((reply, i) => (
                            <TouchableOpacity
                                key={i}
                                onPress={() => handleSend(reply)}
                                style={[
                                    styles.quickChip,
                                    {
                                        backgroundColor: isDark ? '#18181B' : '#FFFFFF',
                                        borderColor: isDark ? '#27272A' : '#E4E4E7',
                                    }
                                ]}
                            >
                                <Text style={[styles.quickChipText, { color: colors.textSecondary }]}>
                                    {reply}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Bottom Message Input Bar */}
                <View style={[
                    styles.inputBar,
                    {
                        backgroundColor: isDark ? '#18181B' : '#FFFFFF',
                        borderTopColor: isDark ? '#27272A' : '#E4E4E7',
                    }
                ]}>
                    <TouchableOpacity onPress={handleAttachPhoto} style={styles.attachBtn}>
                        <Camera size={20} color={colors.textTertiary} />
                    </TouchableOpacity>

                    <TextInput
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder="Type a message to Sanoop..."
                        placeholderTextColor={colors.textTertiary}
                        onSubmitEditing={() => handleSend()}
                        style={[
                            styles.textInput,
                            {
                                color: colors.textPrimary,
                                backgroundColor: isDark ? '#27272A' : '#F4F4F5',
                            }
                        ]}
                    />

                    <TouchableOpacity
                        onPress={() => handleSend()}
                        disabled={!inputText.trim()}
                        style={[
                            styles.sendBtn,
                            {
                                backgroundColor: colors.accent,
                                opacity: inputText.trim() ? 1 : 0.4,
                            }
                        ]}
                    >
                        <Send size={18} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
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
        paddingVertical: 10,
        borderBottomWidth: 1,
    },
    backBtn: {
        padding: 4,
    },
    contractorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
        marginLeft: 8,
    },
    contractorText: {
        flex: 1,
    },
    contractorName: {
        fontSize: 15,
        fontWeight: '700',
    },
    contractorStatus: {
        fontSize: 11,
        marginTop: 1,
    },
    callBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
    },
    messagesList: {
        padding: 16,
        paddingBottom: 20,
    },
    securityNotice: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginBottom: 16,
    },
    securityNoticeText: {
        fontSize: 11,
    },
    msgBubbleWrap: {
        marginVertical: 4,
        width: '100%',
        flexDirection: 'row',
    },
    userBubbleWrap: {
        justifyContent: 'flex-end',
    },
    technicianBubbleWrap: {
        justifyContent: 'flex-start',
    },
    msgBubble: {
        maxWidth: '80%',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 16,
    },
    userBubble: {
        borderBottomRightRadius: 4,
    },
    technicianBubble: {
        borderBottomLeftRadius: 4,
        borderWidth: 1,
    },
    msgText: {
        fontSize: 14,
        lineHeight: 20,
    },
    bubbleFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 4,
    },
    timeText: {
        fontSize: 10,
    },
    quickRepliesBar: {
        paddingVertical: 8,
    },
    quickScroll: {
        paddingHorizontal: 16,
        gap: 8,
    },
    quickChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 14,
        borderWidth: 1,
    },
    quickChipText: {
        fontSize: 12,
    },
    inputBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderTopWidth: 1,
        gap: 10,
    },
    attachBtn: {
        padding: 6,
    },
    textInput: {
        flex: 1,
        height: 40,
        borderRadius: 20,
        paddingHorizontal: 14,
        fontSize: 14,
        outlineStyle: 'none',
    },
    sendBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
