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

                {/* FAQ Accordions: HONEST PILOT FAQS */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                    PILOT SERVICE AREA & DISPATCH
                </Text>
                <Accordion>
                    <AccordionItem title="What exact areas do you serve in Kerala?" defaultOpen={true}>
                        <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
                            We are actively running our local pilot across the Thalassery–Mahe corridor within a 12km radius. This includes Thalassery Municipality, Mahe, Dharmadam, Kadirur, Chokli, New Mahe, and Azhiyur. Before any technician is dispatched, you receive a direct phone confirmation from your electrician to verify your location and timing.
                        </Text>
                    </AccordionItem>

                    <AccordionItem title="How fast does the electrician arrive?">
                        <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
                            For urgent electrical issues (sparking switchboards, burning smells, tripping MCB blackouts), our local technician arrives within 45 to 90 minutes. For scheduled visits, you select your preferred 2-hour morning or afternoon window.
                        </Text>
                    </AccordionItem>
                </Accordion>

                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 18 }]}>
                    PRICING & PAYMENT
                </Text>
                <Accordion>
                    <AccordionItem title="Do I have to pay anything in advance?" defaultOpen={true}>
                        <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
                            Zero advance payment. You pay via UPI (Google Pay, PhonePe, Paytm) or cash only after the work is completed, tested, and demonstrated safe.
                        </Text>
                    </AccordionItem>
                </Accordion>

                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 18 }]}>
                    SPARE PARTS & BILLING
                </Text>
                <Accordion>
                    <AccordionItem title="How are replacement spare parts billed?" defaultOpen={true}>
                        <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
                            You have complete control: you can provide your own ISI-marked spare parts (switches, MCBs, fan capacitors, wires), or your electrician can purchase them from a local hardware store on your behalf. In all cases, replacement parts are billed strictly at MRP / actual store receipt cost with zero markup, and the hardware shop bill is photographed for your records.
                        </Text>
                    </AccordionItem>
                </Accordion>

                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 18 }]}>
                    WARRANTY & SAFETY
                </Text>
                <Accordion>
                    <AccordionItem title="What warranty is provided on electrical repairs?" defaultOpen={true}>
                        <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
                            Every completed repair includes our direct 30-day workmanship warranty on the exact point repaired. If the same issue recurs within 30 days, simply contact us via WhatsApp or phone, and a senior electrician will revisit to resolve it at ₹0 visit fee.
                        </Text>
                    </AccordionItem>

                    <AccordionItem title="Are your electricians licensed wiremen?">
                        <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
                            Yes. All Sheriyakam technicians are experienced, trade-tested local wiremen certified by the Kerala State Electricity Licensing Board (KSELB) standards.
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
