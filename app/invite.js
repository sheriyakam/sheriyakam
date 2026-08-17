import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Share, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Gift, Copy, Share2, Check, Sparkles, Users, Coins } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { useToast } from '../context/ToastContext';
import { Card, StatCard } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function InviteScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { success } = useToast();
    const isDark = theme === 'dark';

    const [copied, setCopied] = useState(false);
    const referralCode = 'KERALA-FIX100';

    const handleCopy = () => {
        setCopied(true);
        success('Referral code copied to clipboard!', 'Code Copied');
        setTimeout(() => setCopied(false), 3000);
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Book verified, certified home electricians in Kerala with Sheriyakam! Use my referral code ${referralCode} to get ₹100 off your first service: https://sheriyakam.com`,
            });
        } catch (e) {}
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Invite & Earn Credits</Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Hero Banner */}
                <View style={styles.heroSection}>
                    <View style={[styles.giftCircle, { backgroundColor: colors.accent + '20' }]}>
                        <Gift size={40} color={colors.accent} />
                    </View>
                    <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
                        Give ₹100, Get ₹100
                    </Text>
                    <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
                        Invite friends, family, and neighbors to Sheriyakam. When they complete their first booking, you both get ₹100 service credit!
                    </Text>
                </View>

                {/* Referral Code Box */}
                <Card variant="elevated" style={styles.codeCard}>
                    <Text style={[styles.codeCardTitle, { color: colors.textSecondary }]}>
                        YOUR UNIQUE REFERRAL CODE
                    </Text>

                    <TouchableOpacity 
                        onPress={handleCopy}
                        style={[
                            styles.codeBox,
                            {
                                backgroundColor: isDark ? '#27272A' : '#F4F4F5',
                                borderColor: isDark ? '#3F3F46' : '#E4E4E7',
                            }
                        ]}
                    >
                        <Text style={[styles.codeText, { color: colors.accent }]}>
                            {referralCode}
                        </Text>
                        {copied ? (
                            <Check size={18} color="#10B981" />
                        ) : (
                            <Copy size={18} color={colors.textTertiary} />
                        )}
                    </TouchableOpacity>

                    <Button
                        variant="primary"
                        size="lg"
                        fullWidth
                        onPress={handleShare}
                        iconLeft={Share2}
                        style={{ marginTop: 14 }}
                    >
                        Share Referral Link
                    </Button>
                </Card>

                {/* Referral Stats */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 20 }]}>
                    YOUR REFERRAL REWARDS
                </Text>
                <View style={styles.statsRow}>
                    <StatCard
                        title="Friends Joined"
                        value="3"
                        icon={Users}
                        iconColor={colors.accent}
                    />
                    <StatCard
                        title="Credits Earned"
                        value="₹300"
                        icon={Coins}
                        iconColor="#F59E0B"
                    />
                </View>

                {/* How it Works steps */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 20 }]}>
                    HOW IT WORKS
                </Text>
                <Card variant="default" style={styles.stepsCard}>
                    <View style={styles.stepItem}>
                        <View style={[styles.stepNum, { backgroundColor: colors.accent }]}>
                            <Text style={styles.stepNumText}>1</Text>
                        </View>
                        <View style={styles.stepTextWrap}>
                            <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>
                                Share your code
                            </Text>
                            <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
                                Send your link or code on WhatsApp, Telegram, or SMS.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.stepItem}>
                        <View style={[styles.stepNum, { backgroundColor: colors.accent }]}>
                            <Text style={styles.stepNumText}>2</Text>
                        </View>
                        <View style={styles.stepTextWrap}>
                            <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>
                                Friend books a service
                            </Text>
                            <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
                                They get ₹100 instant discount on their checkout.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.stepItem}>
                        <View style={[styles.stepNum, { backgroundColor: '#10B981' }]}>
                            <Text style={styles.stepNumText}>3</Text>
                        </View>
                        <View style={styles.stepTextWrap}>
                            <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>
                                You get ₹100 reward
                            </Text>
                            <Text style={[styles.stepDesc, { color: colors.textSecondary }]}>
                                Credits are auto-added to your wallet for future fixes.
                            </Text>
                        </View>
                    </View>
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
    heroSection: {
        alignItems: 'center',
        marginVertical: 14,
    },
    giftCircle: {
        width: 76,
        height: 76,
        borderRadius: 38,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: '800',
        letterSpacing: -0.5,
        marginBottom: 6,
    },
    heroSubtitle: {
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 20,
        maxWidth: 320,
    },
    codeCard: {
        padding: 18,
        borderRadius: 18,
    },
    codeCardTitle: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.5,
        marginBottom: 8,
    },
    codeBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1.5,
    },
    codeText: {
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: 1.5,
        fontFamily: 'monospace',
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
        marginBottom: 8,
        paddingLeft: 2,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 10,
    },
    stepsCard: {
        padding: 16,
        gap: 16,
    },
    stepItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    stepNum: {
        width: 26,
        height: 26,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepNumText: {
        color: '#FFFFFF',
        fontWeight: '800',
        fontSize: 12,
    },
    stepTextWrap: {
        flex: 1,
    },
    stepTitle: {
        fontSize: 14,
        fontWeight: '700',
    },
    stepDesc: {
        fontSize: 12,
        marginTop: 2,
        lineHeight: 16,
    },
});
