import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Phone, Mail, MapPin, MessageSquare, Send, Clock, ShieldCheck } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input, TextArea } from '../components/ui/Input';

export default function ContactScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { success, error: showError } = useToast();
    const isDark = theme === 'dark';

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = () => {
        if (!name.trim() || !phone.trim() || !message.trim()) {
            showError('Please complete all required fields');
            return;
        }

        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            success('Your inquiry has been received! Our Kozhikode desk will call you shortly.', 'Message Sent');
            setName('');
            setEmail('');
            setPhone('');
            setMessage('');
        }, 1000);
    };

    const handleCallHelpline = () => {
        Linking.openURL('tel:+914952800000').catch(() => {
            success('Connecting to Kozhikode 24/7 Hotline (+91 495 280 0000)');
        });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Contact & Support Desk</Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* 24/7 Emergency Helpline Banner */}
                <Card variant="elevated" style={styles.emergencyCard}>
                    <View style={styles.emergencyHeader}>
                        <View style={[styles.phoneIconCircle, { backgroundColor: '#EF444418' }]}>
                            <Phone size={24} color="#EF4444" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.emergencyTitle, { color: colors.textPrimary }]}>
                                24/7 Emergency Dispatch Desk
                            </Text>
                            <Text style={[styles.emergencySub, { color: colors.textSecondary }]}>
                                For active burning smell, total blackout, or sparking
                            </Text>
                        </View>
                    </View>

                    <Button
                        variant="danger"
                        size="md"
                        fullWidth
                        iconLeft={Phone}
                        onPress={handleCallHelpline}
                        style={{ marginTop: 12 }}
                    >
                        Call Emergency Hotline (0495 280 0000)
                    </Button>
                </Card>

                {/* Office & Operating Details */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 18 }]}>
                    HEADQUARTERS & DESK
                </Text>

                <Card variant="default" style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <MapPin size={18} color={colors.accent} />
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text style={[styles.infoTitle, { color: colors.textPrimary }]}>
                                Sheriyakam Technologies Pvt Ltd
                            </Text>
                            <Text style={[styles.infoSub, { color: colors.textSecondary }]}>
                                3rd Floor, Malabar Trade Centre, Civil Station Road, Kozhikode, Kerala - 673020
                            </Text>
                        </View>
                    </View>

                    <View style={[styles.divider, { backgroundColor: isDark ? '#27272A' : '#E4E4E7' }]} />

                    <View style={styles.infoRow}>
                        <Clock size={18} color={colors.accent} />
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text style={[styles.infoTitle, { color: colors.textPrimary }]}>
                                Operating Hours
                            </Text>
                            <Text style={[styles.infoSub, { color: colors.textSecondary }]}>
                                Regular Bookings: 7:00 AM - 9:00 PM • Emergency Dispatch: 24/7
                            </Text>
                        </View>
                    </View>
                </Card>

                {/* Contact Form */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 18 }]}>
                    SEND US A MESSAGE
                </Text>

                <Card variant="default" style={styles.formCard}>
                    <Input
                        label="Your Name *"
                        value={name}
                        onChangeText={setName}
                        placeholder="e.g. Sreekumar"
                    />
                    <Input
                        label="Phone Number (WhatsApp) *"
                        value={phone}
                        onChangeText={setPhone}
                        placeholder="+91 98765 43210"
                        keyboardType="phone-pad"
                    />
                    <Input
                        label="Email Address"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="name@example.com"
                        keyboardType="email-address"
                    />
                    <TextArea
                        label="How can we help? *"
                        value={message}
                        onChangeText={setMessage}
                        placeholder="Describe your domestic or commercial electrical requirement..."
                    />

                    <Button
                        variant="primary"
                        size="lg"
                        fullWidth
                        loading={isSubmitting}
                        onPress={handleSubmit}
                        iconLeft={Send}
                        style={{ marginTop: 6 }}
                    >
                        Send Inquiry
                    </Button>
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
    emergencyCard: {
        padding: 18,
        marginVertical: 6,
    },
    emergencyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    phoneIconCircle: {
        width: 46,
        height: 46,
        borderRadius: 23,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emergencyTitle: {
        fontSize: 15,
        fontWeight: '700',
    },
    emergencySub: {
        fontSize: 12,
        marginTop: 2,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
        marginBottom: 8,
        paddingLeft: 2,
    },
    infoCard: {
        padding: 16,
        gap: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: '700',
    },
    infoSub: {
        fontSize: 12,
        marginTop: 2,
        lineHeight: 17,
    },
    divider: {
        height: 1,
    },
    formCard: {
        padding: 16,
        gap: 10,
    },
});
