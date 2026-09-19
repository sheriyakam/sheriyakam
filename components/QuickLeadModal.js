import React, { useState } from 'react';
import {
    View, Text, StyleSheet, Modal, TouchableOpacity,
    TextInput, ScrollView, Platform, Linking
} from 'react-native';
import {
    X, Zap, Fan, Plug, ShieldCheck, BatteryCharging,
    HelpCircle, Phone, ArrowRight, CheckCircle2, MapPin,
    Clock, User, Check
} from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { openWhatsApp } from '../utils/whatsapp';
import { createBooking } from '../constants/bookingStore';

const PROBLEM_OPTIONS = [
    { id: 'fan', label: 'Fan Repair / Slow Speed / Noise', price: 'From ₹249', icon: Fan, desc: 'Capacitor fix, bearing noise, or regulator change' },
    { id: 'switch', label: 'Switch & Socket Sparking / Burned', price: 'From ₹149', icon: Plug, desc: 'Replace burned 6A/16A switchboards or AC points' },
    { id: 'mcb', label: 'Power Outage / MCB Fuse Box Tripping', price: 'From ₹349', icon: Zap, desc: 'Find short circuits & fix tripping distribution box' },
    { id: 'wiring', label: 'Wiring & Safety Earthing (Shock Fix)', price: 'From ₹550', icon: ShieldCheck, desc: 'Full home wiring, shock hazard check & ground rod' },
    { id: 'inverter', label: 'Inverter / Battery / UPS Wiring', price: 'From ₹500', icon: BatteryCharging, desc: 'Battery terminal connection & changeover switch' },
    { id: 'callback', label: 'Just call me — I have another question', price: 'Free', icon: Phone, desc: 'Direct phone callback from master electrician' },
];

const POPULAR_LOCATIONS = [
    'Thalassery Town', 'Temple Gate', 'Dharmadam', 'Koduvally',
    'Kadirur', 'Kannur City', 'Vadakara', 'Kozhikode', 'Wayanad'
];

export default function QuickLeadModal({ visible, onClose, initialService = null }) {
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';

    const [step, setStep] = useState(1);
    const [selectedProblem, setSelectedProblem] = useState(initialService || PROBLEM_OPTIONS[0]);
    const [location, setLocation] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [preferredTime, setPreferredTime] = useState('As soon as possible (45–90 mins)');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSelectProblem = (prob) => {
        setSelectedProblem(prob);
        setStep(2);
    };

    const handleSelectLocation = (loc) => {
        setLocation(loc);
        setStep(3);
    };

    const cleanPhoneDigits = (phone || '').replace(/\D/g, '');

    const handleSubmit = () => {
        if (!cleanPhoneDigits || cleanPhoneDigits.length < 10) {
            alert('Please enter a valid 10-digit mobile number so our master electrician can call you.');
            return;
        }

        try {
            createBooking({
                customerName: name.trim() || 'Resident Customer',
                customerPhone: `+91 ${cleanPhoneDigits}`,
                service: selectedProblem.label,
                serviceType: 'Electrical',
                category: 'Electrical',
                district: 'Kannur',
                taluk: 'Thalassery',
                address: location || 'Thalassery / Kannur',
                price: parseInt((selectedProblem.price || '249').replace(/\D/g, ''), 10) || 249,
                status: 'open',
                preferredTime: preferredTime,
                source: 'QuickLeadModal Web',
            });
        } catch (e) {
            console.error('Failed to save booking to local store:', e);
        }

        const msg = `⚡ *SHERIYAKAM SERVICE REQUEST*\n\n` +
            `*Problem:* ${selectedProblem.label} (${selectedProblem.price})\n` +
            `*Location:* ${location || 'Thalassery / Kannur'}\n` +
            `*Customer Name:* ${name || 'Resident'}\n` +
            `*Phone:* ${phone}\n` +
            `*Preferred Time:* ${preferredTime}\n\n` +
            `_Requested via Sheriyakam Web App_`;

        openWhatsApp(msg);
        setIsSubmitted(true);
    };

    const handleCallHelpline = () => {
        const phoneUrl = 'tel:+914952800000';
        if (Platform.OS === 'web') window.location.href = phoneUrl;
        else Linking.openURL(phoneUrl);
    };

    const handleResendWhatsApp = () => {
        const msg = `⚡ *SHERIYAKAM SERVICE REQUEST*\n\n` +
            `*Problem:* ${selectedProblem.label} (${selectedProblem.price})\n` +
            `*Location:* ${location || 'Thalassery / Kannur'}\n` +
            `*Customer Name:* ${name || 'Resident'}\n` +
            `*Phone:* ${phone}\n` +
            `*Preferred Time:* ${preferredTime}\n\n` +
            `_Requested via Sheriyakam Web App_`;
        openWhatsApp(msg);
    };

    const handleResetAndClose = () => {
        setIsSubmitted(false);
        setStep(1);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={handleResetAndClose}
        >
            <View style={styles.overlay}>
                <View style={[
                    styles.modalContainer,
                    {
                        backgroundColor: isDark ? '#18181B' : '#FFFFFF',
                        borderColor: isDark ? '#27272A' : '#E4E4E7'
                    }
                ]}>
                    {/* Header */}
                    <View style={[styles.header, { borderBottomColor: isDark ? '#27272A' : '#E4E4E7' }]}>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
                                {isSubmitted ? 'Request Sent!' : 'Book an Electrician in 3 Simple Steps'}
                            </Text>
                            <Text style={[styles.headerSub, { color: colors.textSecondary }]}>
                                Verified Electrical Services Across Kerala • Upfront Pricing
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={handleResetAndClose}
                            style={styles.closeBtn}
                            accessibilityRole="button"
                            accessibilityLabel="Close"
                        >
                            <X size={20} color={colors.textPrimary} />
                        </TouchableOpacity>
                    </View>

                    {isSubmitted ? (
                        <View style={styles.successBox}>
                            <View style={styles.successIconWrap}>
                                <CheckCircle2 size={48} color="#10B981" />
                            </View>
                            <Text style={[styles.successTitle, { color: colors.textPrimary }]}>
                                Request Prepared!
                            </Text>
                            <Text style={[styles.successDesc, { color: colors.textSecondary }]}>
                                Your booking details were opened in WhatsApp. If you sent the message, our master electrician will call <Text style={{ fontWeight: '800', color: colors.textPrimary }}>{phone}</Text> within 15 minutes.
                            </Text>

                            <View style={[styles.summaryCard, { backgroundColor: isDark ? '#27272A' : '#F1F5F9' }]}>
                                <Text style={[styles.summaryText, { color: colors.textPrimary }]}>
                                    • <Text style={{ fontWeight: '700' }}>Service:</Text> {selectedProblem.label}
                                </Text>
                                <Text style={[styles.summaryText, { color: colors.textPrimary }]}>
                                    • <Text style={{ fontWeight: '700' }}>Rate:</Text> {selectedProblem.price} (Pay only after work is tested)
                                </Text>
                                <Text style={[styles.summaryText, { color: colors.textPrimary }]}>
                                    • <Text style={{ fontWeight: '700' }}>Location:</Text> {location || 'Thalassery / Kannur'}
                                </Text>
                            </View>

                            {/* Fallback actions if WhatsApp didn't open */}
                            <View style={{ width: '100%', gap: 8, marginTop: 4 }}>
                                <Text style={{ fontSize: 11.5, color: colors.textTertiary, textAlign: 'center' }}>
                                    Didn't open WhatsApp or popup blocked?
                                </Text>
                                <View style={{ flexDirection: 'row', gap: 8 }}>
                                    <TouchableOpacity
                                        onPress={handleResendWhatsApp}
                                        style={{
                                            flex: 1,
                                            minHeight: 42,
                                            backgroundColor: '#25D366',
                                            borderRadius: 10,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            paddingHorizontal: 8,
                                        }}
                                    >
                                        <Text style={{ color: '#FFFFFF', fontSize: 12.5, fontWeight: '700' }}>Resend on WhatsApp</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={handleCallHelpline}
                                        style={{
                                            flex: 1,
                                            minHeight: 42,
                                            backgroundColor: isDark ? '#27272A' : '#F1F5F9',
                                            borderColor: isDark ? '#3F3F46' : '#CBD5E1',
                                            borderWidth: 1,
                                            borderRadius: 10,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            paddingHorizontal: 8,
                                        }}
                                    >
                                        <Text style={{ color: colors.textPrimary, fontSize: 12.5, fontWeight: '700' }}>📞 Call Helpline</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <Button variant="primary" size="lg" fullWidth onPress={handleResetAndClose} style={{ marginTop: 8 }}>
                                Done
                            </Button>
                        </View>
                    ) : (
                        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                            {/* Step Indicator */}
                            <View style={styles.stepIndicator}>
                                <View style={[styles.stepDot, step >= 1 && styles.stepDotActive]}>
                                    <Text style={styles.stepDotText}>1</Text>
                                </View>
                                <View style={[styles.stepLine, step >= 2 && styles.stepLineActive]} />
                                <View style={[styles.stepDot, step >= 2 && styles.stepDotActive]}>
                                    <Text style={styles.stepDotText}>2</Text>
                                </View>
                                <View style={[styles.stepLine, step >= 3 && styles.stepLineActive]} />
                                <View style={[styles.stepDot, step >= 3 && styles.stepDotActive]}>
                                    <Text style={styles.stepDotText}>3</Text>
                                </View>
                            </View>

                            {/* STEP 1: SELECT PROBLEM */}
                            {step === 1 && (
                                <View style={styles.stepWrap}>
                                    <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>
                                        Step 1: What is the electrical problem?
                                    </Text>
                                    <Text style={[styles.stepSub, { color: colors.textSecondary }]}>
                                        Select the issue below or choose "Not sure" for a ₹49 on-site diagnostic visit:
                                    </Text>

                                    <View style={styles.problemsList}>
                                        {PROBLEM_OPTIONS.map((prob) => {
                                            const Icon = prob.icon;
                                            const isSelected = selectedProblem?.id === prob.id;
                                            return (
                                                <TouchableOpacity
                                                    key={prob.id}
                                                    onPress={() => handleSelectProblem(prob)}
                                                    style={[
                                                        styles.probCard,
                                                        {
                                                            backgroundColor: isSelected ? (isDark ? '#2563EB22' : '#EFF6FF') : (isDark ? '#27272A' : '#F8FAFC'),
                                                            borderColor: isSelected ? '#2563EB' : (isDark ? '#3F3F46' : '#E2E8F0')
                                                        }
                                                    ]}
                                                >
                                                    <View style={styles.probIconWrap}>
                                                        <Icon size={20} color="#2563EB" />
                                                    </View>
                                                    <View style={{ flex: 1 }}>
                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <Text style={[styles.probLabel, { color: colors.textPrimary }]}>
                                                                {prob.label}
                                                            </Text>
                                                            <Badge variant="info" size="sm">{prob.price}</Badge>
                                                        </View>
                                                        <Text style={[styles.probDesc, { color: colors.textSecondary }]}>
                                                            {prob.desc}
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                </View>
                            )}

                            {/* STEP 2: LOCATION */}
                            {step === 2 && (
                                <View style={styles.stepWrap}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>
                                            Step 2: Where are you located?
                                        </Text>
                                        <TouchableOpacity onPress={() => setStep(1)}>
                                            <Text style={{ color: colors.accent, fontWeight: '700', fontSize: 12 }}>‹ Back to Step 1</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={[styles.stepSub, { color: colors.textSecondary }]}>
                                        Select your town or type your area in Kannur, Kozhikode, Wayanad:
                                    </Text>

                                    <View style={styles.locPills}>
                                        {POPULAR_LOCATIONS.map((loc) => {
                                            const isSelected = location === loc;
                                            return (
                                                <TouchableOpacity
                                                    key={loc}
                                                    onPress={() => handleSelectLocation(loc)}
                                                    style={[
                                                        styles.locPill,
                                                        {
                                                            backgroundColor: isSelected ? '#2563EB' : (isDark ? '#27272A' : '#F1F5F9'),
                                                            borderColor: isSelected ? '#2563EB' : (isDark ? '#3F3F46' : '#E2E8F0')
                                                        }
                                                    ]}
                                                >
                                                    <MapPin size={13} color={isSelected ? '#FFFFFF' : colors.textSecondary} />
                                                    <Text style={[
                                                        styles.locPillText,
                                                        { color: isSelected ? '#FFFFFF' : colors.textPrimary, fontWeight: isSelected ? '700' : '500' }
                                                    ]}>
                                                        {loc}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>

                                    <Text style={[styles.inputLabel, { color: colors.textPrimary, marginTop: 10 }]}>
                                        Or enter specific street / house address:
                                    </Text>
                                    <TextInput
                                        style={[
                                            styles.textInput,
                                            {
                                                backgroundColor: isDark ? '#27272A' : '#F8FAFC',
                                                borderColor: isDark ? '#3F3F46' : '#E2E8F0',
                                                color: colors.textPrimary
                                            }
                                        ]}
                                        placeholder="e.g. Near Temple Gate, Thalassery"
                                        placeholderTextColor="#94A3B8"
                                        value={location}
                                        onChangeText={setLocation}
                                    />

                                    <Button
                                        variant="primary"
                                        size="md"
                                        onPress={() => setStep(3)}
                                        style={{ marginTop: 10 }}
                                    >
                                        Next: Contact Details ›
                                    </Button>
                                </View>
                            )}

                            {/* STEP 3: CONTACT & CONFIRM */}
                            {step === 3 && (
                                <View style={styles.stepWrap}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>
                                            Step 3: Contact & Arrival Time
                                        </Text>
                                        <TouchableOpacity onPress={() => setStep(2)}>
                                            <Text style={{ color: colors.accent, fontWeight: '700', fontSize: 12 }}>‹ Back</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={[styles.stepSub, { color: colors.textSecondary }]}>
                                        No signup, password, or advance payment required. We will call you to confirm:
                                    </Text>

                                    <View style={{ gap: 10, marginTop: 6 }}>
                                        <View>
                                            <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Your Mobile Phone Number *</Text>
                                            <TextInput
                                                style={[
                                                    styles.textInput,
                                                    {
                                                        backgroundColor: isDark ? '#27272A' : '#F8FAFC',
                                                        borderColor: isDark ? '#3F3F46' : '#E2E8F0',
                                                        color: colors.textPrimary
                                                    }
                                                ]}
                                                placeholder="+91 98765 43210"
                                                placeholderTextColor="#94A3B8"
                                                keyboardType="phone-pad"
                                                value={phone}
                                                onChangeText={setPhone}
                                            />
                                        </View>

                                        <View>
                                            <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Your Name (Optional)</Text>
                                            <TextInput
                                                style={[
                                                    styles.textInput,
                                                    {
                                                        backgroundColor: isDark ? '#27272A' : '#F8FAFC',
                                                        borderColor: isDark ? '#3F3F46' : '#E2E8F0',
                                                        color: colors.textPrimary
                                                    }
                                                ]}
                                                placeholder="e.g. Rahul / Anoop"
                                                placeholderTextColor="#94A3B8"
                                                value={name}
                                                onChangeText={setName}
                                            />
                                        </View>

                                        <View>
                                            <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>Preferred Arrival Window</Text>
                                            <View style={styles.timePills}>
                                                {['ASAP (45–90 mins)', 'Today Evening (4–7 PM)', 'Tomorrow Morning'].map((time) => {
                                                    const isSelected = preferredTime === time;
                                                    return (
                                                        <TouchableOpacity
                                                            key={time}
                                                            onPress={() => setPreferredTime(time)}
                                                            style={[
                                                                styles.timePill,
                                                                {
                                                                    backgroundColor: isSelected ? '#2563EB' : (isDark ? '#27272A' : '#F1F5F9'),
                                                                    borderColor: isSelected ? '#2563EB' : (isDark ? '#3F3F46' : '#E2E8F0')
                                                                }
                                                            ]}
                                                        >
                                                            <Text style={[
                                                                styles.timePillText,
                                                                { color: isSelected ? '#FFFFFF' : colors.textPrimary, fontWeight: isSelected ? '700' : '500' }
                                                            ]}>
                                                                {time}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    );
                                                })}
                                            </View>
                                        </View>

                                        <View style={[styles.trustCallout, { backgroundColor: isDark ? '#27272A' : '#EFF6FF' }]}>
                                            <ShieldCheck size={18} color="#10B981" />
                                            <Text style={[styles.trustCalloutText, { color: colors.textSecondary }]}>
                                                Pay Safely: Cash or UPI after work is tested. 30-Day rework warranty included.
                                            </Text>
                                        </View>

                                        <Button
                                            variant="primary"
                                            size="lg"
                                            fullWidth
                                            onPress={handleSubmit}
                                            iconRight={ArrowRight}
                                            style={{ marginTop: 4 }}
                                        >
                                            Confirm & Request Electrician
                                        </Button>
                                    </View>
                                </View>
                            )}
                        </ScrollView>
                    )}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.65)',
        justifyContent: 'flex-end',
        ...Platform.select({
            web: {
                justifyContent: 'center',
                alignItems: 'center',
                padding: 16,
            }
        })
    },
    modalContainer: {
        width: '100%',
        maxWidth: 560,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '90%',
        overflow: 'hidden',
        borderWidth: 1,
        ...Platform.select({
            web: {
                borderRadius: 24,
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            }
        })
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '800',
    },
    headerSub: {
        fontSize: 11,
        marginTop: 2,
    },
    closeBtn: {
        padding: 6,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 24,
    },
    stepIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        gap: 6,
    },
    stepDot: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: '#71717A',
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepDotActive: {
        backgroundColor: '#2563EB',
    },
    stepDotText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '800',
    },
    stepLine: {
        width: 36,
        height: 3,
        backgroundColor: '#3F3F46',
    },
    stepLineActive: {
        backgroundColor: '#2563EB',
    },
    stepWrap: {
        gap: 8,
    },
    stepTitle: {
        fontSize: 16,
        fontWeight: '800',
    },
    stepSub: {
        fontSize: 12.5,
        lineHeight: 18,
    },
    problemsList: {
        gap: 8,
        marginTop: 6,
    },
    probCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 14,
        borderWidth: 1,
        gap: 12,
    },
    probIconWrap: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(37, 99, 235, 0.12)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    probLabel: {
        fontSize: 13.5,
        fontWeight: '700',
        flex: 1,
        marginRight: 6,
    },
    probDesc: {
        fontSize: 11.5,
        marginTop: 2,
    },
    locPills: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginTop: 6,
    },
    locPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
    },
    locPillText: {
        fontSize: 12,
    },
    inputLabel: {
        fontSize: 12.5,
        fontWeight: '700',
        marginBottom: 4,
    },
    textInput: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        fontSize: 14,
    },
    timePills: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    timePill: {
        paddingHorizontal: 10,
        paddingVertical: 7,
        borderRadius: 8,
        borderWidth: 1,
    },
    timePillText: {
        fontSize: 12,
    },
    trustCallout: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 10,
        borderRadius: 10,
        marginTop: 4,
    },
    trustCalloutText: {
        fontSize: 11.5,
        flex: 1,
        lineHeight: 16,
    },
    successBox: {
        padding: 24,
        alignItems: 'center',
        gap: 12,
    },
    successIconWrap: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#10B98120',
        alignItems: 'center',
        justifyContent: 'center',
    },
    successTitle: {
        fontSize: 18,
        fontWeight: '800',
        textAlign: 'center',
    },
    successDesc: {
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 19,
    },
    summaryCard: {
        width: '100%',
        padding: 14,
        borderRadius: 12,
        gap: 6,
    },
    summaryText: {
        fontSize: 12.5,
    },
});
