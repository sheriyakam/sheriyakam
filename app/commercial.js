import React, { useState } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput,
    useWindowDimensions, Platform, Linking
} from 'react-native';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    ArrowLeft, Building2, ShieldCheck, CheckCircle2, FileText,
    Zap, Phone, MessageCircle, Briefcase, Award, ArrowRight
} from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS, SPACING } from '../constants/theme';
import { KERALA_DISTRICTS } from '../constants/locations';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useToast } from '../context/ToastContext';

const COMMERCIAL_SEGMENTS = [
    {
        id: 'offices',
        title: 'IT Offices & Corporate Spaces',
        tagline: 'Infopark Kakkanad, Cyberpark Kozhikode & Technopark',
        description: 'Complete fit-out electrical wiring, UPS clean-power isolation, server rack cabling & workstation DB management.',
        features: ['Dedicated UPS Distribution', 'Cat6 Structured Cabling', 'APFC Panel Load Balancing']
    },
    {
        id: 'retail',
        title: 'Retail Showrooms & Supermarkets',
        tagline: 'High-draw LED display lighting & HVAC switchgear',
        description: '3-phase commercial switchgear, display track lighting, POS terminal wiring, and chiller circuit distribution.',
        features: ['Track Light & Facade Wiring', '3-Phase Busbar Trunking', 'Surge Protection Devices (SPD)']
    },
    {
        id: 'restaurants',
        title: 'Restaurants & Commercial Kitchens',
        tagline: 'High-amperage induction, exhaust & refrigeration circuits',
        description: 'Fire-retardant electrical conduits, commercial exhaust fan wiring, deep-fryer heavy load isolation and earth fault protection.',
        features: ['FRLS Fire Retardant Cabling', 'Exhaust & Hood Motor Interlocks', 'IP65 Waterproof Switchboards']
    },
    {
        id: 'apartments',
        title: 'Apartment Associations & Gated Communities',
        tagline: 'Common area switchgear, DG changeover & water pumps',
        description: 'Automatic Mains Failure (AMF) panel maintenance, 3-phase pump starters, EV charger infrastructure, and common lighting automation.',
        features: ['AMF / DG Changeover Switchgear', 'Submersible Pump Starters', 'EV Fleet Charger Points']
    },
    {
        id: 'clinics',
        title: 'Clinics & Diagnostic Centres',
        tagline: 'Zero-downtime medical equipment earthing (<1 Ohm)',
        description: 'Chemical earthing pits, dedicated neutral isolation for X-Ray/Scan equipment, and silent generator changeover panels.',
        features: ['Chemical Earth Pits (<1 Ohm)', 'Isolated Ground Outlets', 'KSEB Safety Inspection Sign-off']
    }
];

export default function CommercialServicesScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';
    const { width } = useWindowDimensions();
    const isDesktop = width >= 1024;
    const { success, error: toastError } = useToast();

    const [companyName, setCompanyName] = useState('');
    const [contactPerson, setContactPerson] = useState('');
    const [phone, setPhone] = useState('');
    const [facilityType, setFacilityType] = useState('IT Offices & Corporate Spaces');
    const [district, setDistrict] = useState('Ernakulam (Kochi)');
    const [projectScope, setProjectScope] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFormSubmit = () => {
        if (!contactPerson.trim() || !phone.trim() || phone.trim().length < 10) {
            toastError('Please enter your contact name and a valid 10-digit phone number.', 'Missing Information');
            return;
        }

        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            success('Commercial request received! Our Senior Electrical Engineer will contact you within 2 business hours with a formal proposal.', 'Request Submitted');
            setCompanyName('');
            setContactPerson('');
            setPhone('');
            setProjectScope('');
        }, 1000);
    };

    const handleWhatsAppConsult = () => {
        const text = `Hi Sheriyakam Commercial Team,\n\nI want to discuss an electrical project for our facility:\n*Company:* ${companyName || 'Not specified'}\n*Facility:* ${facilityType}\n*Location:* ${district}\n\nPlease share commercial contract details.`;
        const url = `https://wa.me/914952800000?text=${encodeURIComponent(text)}`;
        if (Platform.OS === 'web') {
            window.open(url, '_blank');
        } else {
            Linking.openURL(url);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            <Head>
                <title>Commercial Electrical Contracting Kerala | KSELB Class-A | Sheriyakam</title>
                <meta name="description" content="Commercial electrical contracting, 3-phase switchgear, KSEB load enhancement, AMC, and safety audits for IT parks, retail showrooms, clinics, and apartment complexes in Kerala." />
                <link rel="canonical" href="https://sheriyakam.vercel.app/commercial" />
            </Head>

            {/* Top Navigation */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <View style={{ flex: 1, paddingHorizontal: 12 }}>
                    <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Commercial Contracting</Text>
                    <Text style={[styles.headerSub, { color: colors.textSecondary }]}>KSELB Class-A Certified Corporate Projects</Text>
                </View>
                <TouchableOpacity onPress={handleWhatsAppConsult} style={styles.whatsAppHeaderBtn}>
                    <MessageCircle size={16} color="#FFFFFF" />
                    <Text style={styles.whatsAppHeaderText}>Consult</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Hero Header */}
                <View style={[styles.heroBanner, { backgroundColor: isDark ? '#18181B' : '#1E293B', borderColor: isDark ? '#27272A' : '#334155' }]}>
                    <Badge variant="info" size="md">KSELB Class-A Contractor Licence #KSELB/CA-7821/KL</Badge>
                    <Text style={styles.heroTitle}>
                        Commercial Electrical Solutions & Facility Maintenance in Kerala
                    </Text>
                    <Text style={styles.heroSub}>
                        From 3-phase HT/LT switchgear fitouts in Kochi IT parks to retail showroom wiring in Kozhikode & Thrissur. Licensed electrical supervisors, GST compliance, and KSEB safety approval sign-offs.
                    </Text>

                    <View style={styles.statGrid}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>180+</Text>
                            <Text style={styles.statLabel}>Commercial Fitouts</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>&lt;1 Ω</Text>
                            <Text style={styles.statLabel}>Chemical Earth Testing</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>₹10 Lakh</Text>
                            <Text style={styles.statLabel}>Public Liability Cover</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>14</Text>
                            <Text style={styles.statLabel}>Districts Covered</Text>
                        </View>
                    </View>
                </View>

                {/* Main Content Layout */}
                <View style={[styles.pageLayout, isDesktop && styles.desktopLayout]}>
                    {/* Left: Commercial Sectors Covered */}
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                            Specialized Commercial Sectors
                        </Text>

                        <View style={styles.segmentList}>
                            {COMMERCIAL_SEGMENTS.map((seg) => (
                                <Card key={seg.id} variant="default" style={styles.segmentCard}>
                                    <View style={styles.segmentHeader}>
                                        <Building2 size={20} color={colors.accent} />
                                        <View style={{ flex: 1 }}>
                                            <Text style={[styles.segmentTitle, { color: colors.textPrimary }]}>{seg.title}</Text>
                                            <Text style={[styles.segmentTagline, { color: colors.accent }]}>{seg.tagline}</Text>
                                        </View>
                                    </View>
                                    <Text style={[styles.segmentDesc, { color: colors.textSecondary }]}>
                                        {seg.description}
                                    </Text>
                                    <View style={styles.featureChips}>
                                        {seg.features.map((feat, idx) => (
                                            <View key={idx} style={[styles.featureChip, { backgroundColor: isDark ? '#27272A' : '#F4F4F5' }]}>
                                                <CheckCircle2 size={13} color="#10B981" />
                                                <Text style={[styles.featureChipText, { color: colors.textPrimary }]}>{feat}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </Card>
                            ))}
                        </View>

                        {/* Engineering Standards & Compliance Section */}
                        <Card variant="default" style={[styles.complianceCard, { borderColor: '#10B98144' }]}>
                            <View style={styles.complianceHeader}>
                                <Award size={22} color="#10B981" />
                                <Text style={[styles.complianceTitle, { color: colors.textPrimary }]}>
                                    Kerala Electrical Compliance & Safety Standards
                                </Text>
                            </View>
                            <View style={styles.complianceList}>
                                <View style={styles.complianceItem}>
                                    <CheckCircle2 size={16} color="#10B981" style={{ marginTop: 2 }} />
                                    <Text style={[styles.complianceText, { color: colors.textSecondary }]}>
                                        <Text style={{ fontWeight: '700', color: colors.textPrimary }}>KSEB Safety Inspectorate Compliance:</Text> Full assistance with load sanctioning, schematic drawing submission, and contractor completion certificates.
                                    </Text>
                                </View>
                                <View style={styles.complianceItem}>
                                    <CheckCircle2 size={16} color="#10B981" style={{ marginTop: 2 }} />
                                    <Text style={[styles.complianceText, { color: colors.textSecondary }]}>
                                        <Text style={{ fontWeight: '700', color: colors.textPrimary }}>BIS/IS 732 Wiring Regulations:</Text> Heavy gauge PVC conduits, FRLS copper cables (Havells, Polycab, Finolex), and Type-C/D industrial MCBs.
                                    </Text>
                                </View>
                                <View style={styles.complianceItem}>
                                    <CheckCircle2 size={16} color="#10B981" style={{ marginTop: 2 }} />
                                    <Text style={[styles.complianceText, { color: colors.textSecondary }]}>
                                        <Text style={{ fontWeight: '700', color: colors.textPrimary }}>Itemized GST Tax Invoicing (SAC 9987):</Text> Clean input tax credit (ITC) eligible billing for corporate and commercial entities.
                                    </Text>
                                </View>
                            </View>
                        </Card>
                    </View>

                    {/* Right: Commercial Quotation Form */}
                    <View style={[{ flex: 1 }, isDesktop && { maxWidth: 440 }]}>
                        <Card variant="default" style={styles.quoteFormCard}>
                            <View style={styles.quoteHeader}>
                                <Briefcase size={22} color={colors.accent} />
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.quoteTitle, { color: colors.textPrimary }]}>
                                        Request Commercial Proposal
                                    </Text>
                                    <Text style={[styles.quoteSub, { color: colors.textSecondary }]}>
                                        Free on-site engineering audit & quotation
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.formFields}>
                                <View style={styles.inputGroup}>
                                    <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Company / Facility Name</Text>
                                    <TextInput
                                        style={[styles.inputField, { color: colors.textPrimary, backgroundColor: isDark ? '#18181B' : '#FFFFFF', borderColor: isDark ? '#27272A' : '#E4E4E7' }]}
                                        placeholder="e.g. Infopark Tower B / Malabar Jewellers"
                                        placeholderTextColor={colors.textTertiary}
                                        value={companyName}
                                        onChangeText={setCompanyName}
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                                        Contact Person Name <Text style={{ color: '#EF4444' }}>*</Text>
                                    </Text>
                                    <TextInput
                                        style={[styles.inputField, { color: colors.textPrimary, backgroundColor: isDark ? '#18181B' : '#FFFFFF', borderColor: isDark ? '#27272A' : '#E4E4E7' }]}
                                        placeholder="Full name of facility manager / owner"
                                        placeholderTextColor={colors.textTertiary}
                                        value={contactPerson}
                                        onChangeText={setContactPerson}
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                                        Direct Mobile Number <Text style={{ color: '#EF4444' }}>*</Text>
                                    </Text>
                                    <TextInput
                                        style={[styles.inputField, { color: colors.textPrimary, backgroundColor: isDark ? '#18181B' : '#FFFFFF', borderColor: isDark ? '#27272A' : '#E4E4E7' }]}
                                        placeholder="10-digit mobile number"
                                        placeholderTextColor={colors.textTertiary}
                                        keyboardType="phone-pad"
                                        value={phone}
                                        onChangeText={setPhone}
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Facility Category</Text>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
                                        {COMMERCIAL_SEGMENTS.map((s) => (
                                            <TouchableOpacity
                                                key={s.id}
                                                onPress={() => setFacilityType(s.title)}
                                                style={[
                                                    styles.chip,
                                                    {
                                                        backgroundColor: facilityType === s.title ? colors.accent : (isDark ? '#27272A' : '#F4F4F5'),
                                                        borderColor: facilityType === s.title ? colors.accent : (isDark ? '#3F3F46' : '#E4E4E7')
                                                    }
                                                ]}
                                            >
                                                <Text style={[
                                                    styles.chipText,
                                                    { color: facilityType === s.title ? '#000000' : colors.textSecondary }
                                                ]}>
                                                    {s.title.split('&')[0]}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>District</Text>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
                                        {KERALA_DISTRICTS.slice(0, 7).map((d) => (
                                            <TouchableOpacity
                                                key={d.id}
                                                onPress={() => setDistrict(d.name)}
                                                style={[
                                                    styles.chip,
                                                    {
                                                        backgroundColor: district === d.name ? colors.accent : (isDark ? '#27272A' : '#F4F4F5'),
                                                        borderColor: district === d.name ? colors.accent : (isDark ? '#3F3F46' : '#E4E4E7')
                                                    }
                                                ]}
                                            >
                                                <Text style={[
                                                    styles.chipText,
                                                    { color: district === d.name ? '#000000' : colors.textSecondary }
                                                ]}>
                                                    {d.name.split(' ')[0]}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Project Scope / Requirement</Text>
                                    <TextInput
                                        style={[styles.inputField, { height: 80, color: colors.textPrimary, backgroundColor: isDark ? '#18181B' : '#FFFFFF', borderColor: isDark ? '#27272A' : '#E4E4E7' }]}
                                        placeholder="e.g. 3-phase DB installation, 50kVA generator AMF synchronization, chemical earth pit installation"
                                        placeholderTextColor={colors.textTertiary}
                                        multiline
                                        numberOfLines={3}
                                        value={projectScope}
                                        onChangeText={setProjectScope}
                                    />
                                </View>

                                <Button
                                    variant="primary"
                                    size="lg"
                                    onPress={handleFormSubmit}
                                    loading={isSubmitting}
                                    iconRight={ArrowRight}
                                    style={{ marginTop: 10 }}
                                >
                                    Submit Commercial Request
                                </Button>

                                <TouchableOpacity onPress={handleWhatsAppConsult} style={styles.quoteWhatsAppBtn}>
                                    <MessageCircle size={16} color="#25D366" />
                                    <Text style={styles.quoteWhatsAppText}>Direct WhatsApp with Project Engineer</Text>
                                </TouchableOpacity>

                                <View style={styles.guaranteeNote}>
                                    <ShieldCheck size={14} color="#10B981" />
                                    <Text style={[styles.guaranteeNoteText, { color: colors.textTertiary }]}>
                                        Non-Disclosure Agreement (NDA) & SLA Available for Enterprise Accounts
                                    </Text>
                                </View>
                            </View>
                        </Card>
                    </View>
                </View>
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
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    backBtn: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '800',
    },
    headerSub: {
        fontSize: 12,
    },
    whatsAppHeaderBtn: {
        backgroundColor: '#25D366',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    whatsAppHeaderText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 60,
    },
    heroBanner: {
        padding: 24,
        borderRadius: 18,
        borderWidth: 1,
        marginBottom: 20,
        gap: 12,
    },
    heroTitle: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: '900',
        letterSpacing: -0.3,
        lineHeight: 32,
    },
    heroSub: {
        color: '#CBD5E1',
        fontSize: 14,
        lineHeight: 22,
    },
    statGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        marginTop: 12,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#334155',
    },
    statItem: {
        flex: 1,
        minWidth: 110,
    },
    statNumber: {
        color: '#F59E0B',
        fontSize: 22,
        fontWeight: '900',
    },
    statLabel: {
        color: '#94A3B8',
        fontSize: 12,
        marginTop: 2,
    },
    pageLayout: {
        gap: 20,
    },
    desktopLayout: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 14,
    },
    segmentList: {
        gap: 12,
    },
    segmentCard: {
        padding: 16,
        borderRadius: 14,
    },
    segmentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 6,
    },
    segmentTitle: {
        fontSize: 15,
        fontWeight: '800',
    },
    segmentTagline: {
        fontSize: 12,
        fontWeight: '600',
    },
    segmentDesc: {
        fontSize: 13,
        lineHeight: 20,
        marginBottom: 12,
    },
    featureChips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    featureChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    featureChipText: {
        fontSize: 11,
        fontWeight: '600',
    },
    complianceCard: {
        padding: 18,
        borderRadius: 16,
        marginTop: 16,
        borderWidth: 1.5,
    },
    complianceHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 14,
    },
    complianceTitle: {
        fontSize: 15,
        fontWeight: '800',
        flex: 1,
    },
    complianceList: {
        gap: 10,
    },
    complianceItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
    },
    complianceText: {
        flex: 1,
        fontSize: 13,
        lineHeight: 20,
    },
    quoteFormCard: {
        padding: 20,
        borderRadius: 16,
    },
    quoteHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
        paddingBottom: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#27272A',
    },
    quoteTitle: {
        fontSize: 16,
        fontWeight: '800',
    },
    quoteSub: {
        fontSize: 12,
        marginTop: 2,
    },
    formFields: {
        gap: 14,
    },
    inputGroup: {
        gap: 6,
    },
    inputLabel: {
        fontSize: 12,
        fontWeight: '600',
    },
    inputField: {
        height: 44,
        borderRadius: 8,
        borderWidth: 1,
        paddingHorizontal: 12,
        fontSize: 14,
    },
    chipsScroll: {
        flexDirection: 'row',
        paddingVertical: 4,
    },
    chip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        marginRight: 6,
    },
    chipText: {
        fontSize: 12,
        fontWeight: '600',
    },
    quoteWhatsAppBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 8,
    },
    quoteWhatsAppText: {
        color: '#25D366',
        fontSize: 13,
        fontWeight: '700',
    },
    guaranteeNote: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginTop: 6,
    },
    guaranteeNoteText: {
        fontSize: 11,
        textAlign: 'center',
    },
});
