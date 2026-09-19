import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, HelpCircle, MessageSquare, Shield, Clock, Award, CheckCircle, UserCheck } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { Accordion, AccordionItem } from '../components/ui/Accordion';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import FloatingCartBar from '../components/FloatingCartBar';

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
                        Everything you need to know about booking, electrician verification, tariffs, 90-minute arrival, and our 30-day warranty.
                    </Text>
                </View>

                {/* E-E-A-T Reviewer & Author Byline */}
                <View style={{
                    backgroundColor: isDark ? 'rgba(37, 99, 235, 0.08)' : 'rgba(37, 99, 235, 0.05)',
                    borderColor: isDark ? 'rgba(37, 99, 235, 0.25)' : 'rgba(37, 99, 235, 0.15)',
                    borderWidth: 1,
                    borderRadius: 14,
                    padding: 14,
                    marginBottom: 18,
                    gap: 6
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <UserCheck size={14} color={colors.accent} />
                        <Text style={{ fontSize: 13, fontWeight: '700', color: colors.accent }}>
                            Reviewed & Verified by Master Electricians
                        </Text>
                    </View>
                    <Text style={{ fontSize: 12, color: colors.textSecondary, lineHeight: 18 }}>
                        All work procedures and pricing adhere to Central Electricity Authority (CEA) safety standards and Kerala State Electricity Board (KSEB) domestic wiring regulations.
                    </Text>
                </View>

                {/* FAQ Accordions: EMERGENCY & ARRIVAL */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                    SERVICE BOOKING & ARRIVAL
                </Text>
                <Accordion>
                    <AccordionItem title="What is the arrival time for electrical visits?" defaultOpen={true}>
                        <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
                            Our master electrician typically arrives at your doorstep within 45 to 90 minutes across Thalassery, Kannur, and Kozhikode areas. We call you immediately after booking to confirm the exact arrival time.
                        </Text>
                    </AccordionItem>

                    <AccordionItem title="How does emergency electrical triage work?">
                        <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
                            For critical hazards like sparking switchboards, burning smell, or total blackout tripping, our master wireman prioritizes your request. We provide immediate breaker isolation advice over the phone while on the way.
                        </Text>
                    </AccordionItem>
                </Accordion>

                {/* FAQ Accordions: CONTRACTOR VETTING & SAFETY */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 18 }]}>
                    SAFETY & QUALITY GUARANTEE
                </Text>
                <Accordion>
                    <AccordionItem title="Are Sheriyakam technicians licensed?" defaultOpen={true}>
                        <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
                            Yes. Every job is executed or inspected by an experienced, certified wireman holding recognized electrical credentials. All repairs come backed with our 30-day rework warranty.
                        </Text>
                    </AccordionItem>

                    <AccordionItem title="What if an issue recurs after the fix?">
                        <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
                            If the same problem returns within 30 days of completion, simply call us or message on WhatsApp. We will revisit and resolve it at zero additional charge.
                        </Text>
                    </AccordionItem>
                </Accordion>

                {/* FAQ Accordions: PRICING & DIAGNOSTIC VISITS */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 18 }]}>
                    PRICING & PAYMENT
                </Text>
                <Accordion>
                    <AccordionItem title="Do I have to pay anything in advance?">
                        <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
                            No advance payment is needed. You pay safely via UPI or cash only after the work is fully completed, tested, and verified to your satisfaction.
                        </Text>
                    </AccordionItem>

                    <AccordionItem title="How are prices determined?">
                        <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
                            All standard repairs follow our transparent upfront rate card (e.g., switches from ₹149, fan repairs from ₹249). For custom wiring or DB overhaul, an itemized quote is provided before starting any work.
                        </Text>
                    </AccordionItem>
                </Accordion>

                {/* FAQ Accordions: WARRANTY & REWORKS */}
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

            <FloatingCartBar />
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
        paddingBottom: 80,
        maxWidth: 880,
        width: '100%',
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
        maxWidth: 420,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
        marginBottom: 8,
        paddingLeft: 2,
    },
    faqAnswer: {
        fontSize: 14,
        lineHeight: 22,
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
