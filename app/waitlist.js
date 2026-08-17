import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, MapPin, Sparkles, Check, Mail, Phone, Users } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const DISTRICTS = [
    { name: 'Ernakulam (Kochi)', votes: 842, status: 'Launching Q4 2026' },
    { name: 'Thrissur', votes: 512, status: 'Voting Active' },
    { name: 'Thiruvananthapuram', votes: 468, status: 'Voting Active' },
    { name: 'Kannur', votes: 390, status: 'Voting Active' },
    { name: 'Malappuram', votes: 340, status: 'Voting Active' },
];

export default function WaitlistScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { success, error: showError } = useToast();
    const isDark = theme === 'dark';

    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('Ernakulam (Kochi)');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasJoined, setHasJoined] = useState(false);

    const handleJoin = () => {
        if (!email.trim() || !phone.trim()) {
            showError('Please enter your email and phone number');
            return;
        }

        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setHasJoined(true);
            success(`You're on the priority waitlist for ${selectedDistrict}!`, 'Waitlist Confirmed');
        }, 1000);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>District Expansion Waitlist</Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Hero Banner */}
                <View style={styles.hero}>
                    <Badge variant="purple">Kerala Expansion 2026</Badge>
                    <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
                        Bringing Certified Home Electricians Across Kerala
                    </Text>
                    <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
                        Vote for your home district and receive ₹200 free launch credits when Sheriyakam arrives in your city.
                    </Text>
                </View>

                {/* District Vote Selector */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                    SELECT YOUR DISTRICT
                </Text>
                <View style={styles.districtsList}>
                    {DISTRICTS.map((d) => {
                        const isSelected = selectedDistrict === d.name;
                        return (
                            <TouchableOpacity
                                key={d.name}
                                onPress={() => setSelectedDistrict(d.name)}
                                activeOpacity={0.7}
                            >
                                <Card
                                    variant="default"
                                    style={[
                                        styles.districtCard,
                                        isSelected && {
                                            borderColor: colors.accent,
                                            backgroundColor: isDark ? '#27272A' : '#EFF6FF80',
                                            borderWidth: 2,
                                        }
                                    ]}
                                >
                                    <View style={styles.districtRow}>
                                        <View style={{ flex: 1 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                                <MapPin size={16} color={isSelected ? colors.accent : colors.textTertiary} />
                                                <Text style={[styles.districtName, { color: colors.textPrimary }]}>
                                                    {d.name}
                                                </Text>
                                            </View>
                                            <Text style={[styles.voteCount, { color: colors.textTertiary }]}>
                                                {d.votes} neighbors waiting • {d.status}
                                            </Text>
                                        </View>

                                        {isSelected ? (
                                            <View style={[styles.checkPill, { backgroundColor: colors.accent }]}>
                                                <Check size={14} color="#FFFFFF" strokeWidth={3} />
                                            </View>
                                        ) : null}
                                    </View>
                                </Card>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Join Form */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 20 }]}>
                    YOUR CONTACT DETAILS
                </Text>
                <Card variant="elevated" style={styles.formCard}>
                    {hasJoined ? (
                        <View style={styles.successBox}>
                            <View style={[styles.successCircle, { backgroundColor: '#10B98120' }]}>
                                <Check size={32} color="#10B981" />
                            </View>
                            <Text style={[styles.successTitle, { color: colors.textPrimary }]}>
                                You are #{DISTRICTS.find((d) => d.name === selectedDistrict)?.votes + 1} on the list!
                            </Text>
                            <Text style={[styles.successDesc, { color: colors.textSecondary }]}>
                                We will send you an exclusive VIP invite code via WhatsApp as soon as technician onboarding begins in {selectedDistrict}.
                            </Text>
                        </View>
                    ) : (
                        <>
                            <Input
                                label="Email Address"
                                value={email}
                                onChangeText={setEmail}
                                placeholder="name@example.com"
                                keyboardType="email-address"
                            />
                            <Input
                                label="WhatsApp Mobile Number"
                                value={phone}
                                onChangeText={setPhone}
                                placeholder="+91 98765 43210"
                                keyboardType="phone-pad"
                            />

                            <Button
                                variant="primary"
                                size="lg"
                                fullWidth
                                loading={isSubmitting}
                                onPress={handleJoin}
                                iconRight={Sparkles}
                                style={{ marginTop: 8 }}
                            >
                                Vote & Claim ₹200 Launch Credit
                            </Button>
                        </>
                    )}
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
    hero: {
        alignItems: 'center',
        marginVertical: 14,
        gap: 8,
    },
    heroTitle: {
        fontSize: 22,
        fontWeight: '800',
        textAlign: 'center',
        letterSpacing: -0.3,
        lineHeight: 30,
    },
    heroSubtitle: {
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 19,
        maxWidth: 340,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
        marginBottom: 8,
        paddingLeft: 2,
    },
    districtsList: {
        gap: 8,
    },
    districtCard: {
        padding: 14,
    },
    districtRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    districtName: {
        fontSize: 15,
        fontWeight: '700',
    },
    voteCount: {
        fontSize: 12,
        marginTop: 2,
    },
    checkPill: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    formCard: {
        padding: 18,
        gap: 10,
    },
    successBox: {
        alignItems: 'center',
        padding: 12,
    },
    successCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    successTitle: {
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 6,
    },
    successDesc: {
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 19,
    },
});
