import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, HelpCircle, MessageSquare } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { Accordion, AccordionItem } from '../components/ui/Accordion';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function FAQScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Frequently Asked Questions</Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Hero */}
                <View style={styles.hero}>
                    <Badge variant="info">Clear Answers</Badge>
                    <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
                        Got Questions? We Have Answers.
                    </Text>
                    <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
                        Everything you need to know about booking, electrician verification, tariffs, and our 30-day warranty.
                    </Text>
                </View>

                {/* FAQ Accordions */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                    CONTRACTOR VETTING & SAFETY
                </Text>
                <Accordion>
                    <AccordionItem title="Are your electricians government licensed?">
                        <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
                            Yes, 100%. Every contractor on Sheriyakam holds a verified wireman or supervisor license issued by the Kerala Electrical Inspectorate. We verify license credentials against state government databases and perform police background checks.
                        </Text>
                    </AccordionItem>

                    <AccordionItem title="What happens if electrical equipment is accidentally damaged?">
                        <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
                            Every booking is protected by Sheriyakam's domestic safety cover up to ₹5,00,000 for accidental equipment damage caused during repair.
                        </Text>
                    </AccordionItem>
                </Accordion>

                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 18 }]}>
                    PRICING & PAYMENTS
                </Text>
                <Accordion>
                    <AccordionItem title="How does the ₹149 inspection fee work?">
                        <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
                            The ₹149 inspection charge covers doorstep diagnosis and fault isolation. If you approve the repair and proceed with the service, the inspection fee is fully adjusted against your final bill.
                        </Text>
                    </AccordionItem>

                    <AccordionItem title="Can I pay after the service is completed?">
                        <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
                            Absolutely. You can choose 'Pay After Service' at checkout and pay the technician directly via UPI QR or cash once you test and verify the fix.
                        </Text>
                    </AccordionItem>
                </Accordion>

                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 18 }]}>
                    WARRANTY & REWORKS
                </Text>
                <Accordion>
                    <AccordionItem title="How does the 30-day rework warranty work?">
                        <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
                            If the exact issue recurs within 30 days of service completion, simply go to your Bookings tab or call support. We will dispatch a master technician to fix it for free with zero visit charges.
                        </Text>
                    </AccordionItem>
                </Accordion>

                {/* Bottom Contact card */}
                <Card variant="elevated" style={styles.contactCard}>
                    <Text style={[styles.contactTitle, { color: colors.textPrimary }]}>
                        Still need assistance?
                    </Text>
                    <Text style={[styles.contactSub, { color: colors.textSecondary }]}>
                        Our Malayalam support team is here to help 24/7.
                    </Text>
                    <Button
                        variant="primary"
                        size="md"
                        onPress={() => router.push('/contact')}
                        style={{ marginTop: 10 }}
                    >
                        Talk to Support
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
        paddingBottom: 60,
        maxWidth: 880,
        width: '100%',
        marginHorizontal: 'auto',
        alignSelf: 'center',
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
    faqAnswer: {
        fontSize: 13,
        lineHeight: 20,
    },
    contactCard: {
        padding: 18,
        alignItems: 'center',
        marginTop: 20,
        gap: 4,
    },
    contactTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    contactSub: {
        fontSize: 12,
    },
});
