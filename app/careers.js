import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Briefcase, MapPin, DollarSign, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input, TextArea } from '../components/ui/Input';

const JOBS = [
    {
        id: 'job_1',
        title: 'Master Residential Electrician',
        dept: 'Field Operations',
        location: 'Kozhikode, Kerala',
        type: 'Full-time / Partner',
        salary: '₹35,000 - ₹55,000 / mo',
        desc: 'Perform residential diagnostics, fan repair, DB panel upgrades, and inverter setups with company-provided safety gear.',
    },
    {
        id: 'job_2',
        title: 'Emergency Dispatch Coordinator',
        dept: 'Customer Operations',
        location: 'Hybrid • Kozhikode',
        type: 'Full-time',
        salary: '₹22,000 - ₹30,000 / mo',
        desc: 'Manage live booking assignment, contractor route optimization, and Malayalam phone/chat escalation support.',
    },
    {
        id: 'job_3',
        title: 'React Native & Node.js Engineer',
        dept: 'Engineering',
        location: 'Remote (Kerala)',
        type: 'Full-time',
        salary: '₹6,00,000 - ₹12,00,000 / yr',
        desc: 'Scale our Expo mobile apps, real-time dispatch algorithms, Supabase Webhooks, and telemetry infrastructure.',
    },
];

export default function CareersScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { success, error: showError } = useToast();
    const isDark = theme === 'dark';

    const [selectedJob, setSelectedJob] = useState(null);
    const [applicantName, setApplicantName] = useState('');
    const [applicantPhone, setApplicantPhone] = useState('');
    const [applicantNotes, setApplicantNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleApply = () => {
        if (!applicantName.trim() || !applicantPhone.trim()) {
            showError('Please enter your name and phone number');
            return;
        }

        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            success(`Application for ${selectedJob.title} submitted! Our team will call you within 24 hours.`, 'Application Received');
            setSelectedJob(null);
            setApplicantName('');
            setApplicantPhone('');
            setApplicantNotes('');
        }, 1000);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Careers at Sheriyakam</Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Hero */}
                <View style={styles.hero}>
                    <Badge variant="gold">Join Our Crew</Badge>
                    <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
                        Build the Future of Trade Infrastructure
                    </Text>
                    <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
                        We offer guaranteed fair payouts, healthcare coverage, digital toolkits, and an empowering work environment.
                    </Text>
                </View>

                {/* Job Openings */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                    OPEN POSITIONS ({JOBS.length})
                </Text>

                <View style={styles.jobsList}>
                    {JOBS.map((job) => (
                        <Card key={job.id} variant="default" style={styles.jobCard}>
                            <View style={styles.jobHeader}>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.jobTitle, { color: colors.textPrimary }]}>
                                        {job.title}
                                    </Text>
                                    <Text style={[styles.jobDept, { color: colors.accent }]}>
                                        {job.dept} • {job.type}
                                    </Text>
                                </View>
                                <Badge variant="neutral" size="sm">📍 {job.location}</Badge>
                            </View>

                            <Text style={[styles.jobDesc, { color: colors.textSecondary }]}>
                                {job.desc}
                            </Text>

                            <View style={styles.jobFooter}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                    <DollarSign size={16} color="#10B981" />
                                    <Text style={[styles.salaryText, { color: '#10B981' }]}>
                                        {job.salary}
                                    </Text>
                                </View>

                                <Button
                                    variant="primary"
                                    size="sm"
                                    onPress={() => setSelectedJob(job)}
                                >
                                    Apply Now
                                </Button>
                            </View>
                        </Card>
                    ))}
                </View>
            </ScrollView>

            {/* Quick Application Modal */}
            <Modal
                visible={!!selectedJob}
                onClose={() => setSelectedJob(null)}
                title={selectedJob ? `Apply: ${selectedJob.title}` : ''}
                subtitle="Submit your details for a direct callback"
            >
                {selectedJob ? (
                    <View style={{ gap: 10, paddingVertical: 4 }}>
                        <Input
                            label="Full Name"
                            value={applicantName}
                            onChangeText={setApplicantName}
                            placeholder="e.g. Sreejith K."
                        />
                        <Input
                            label="Mobile Number (WhatsApp)"
                            value={applicantPhone}
                            onChangeText={setApplicantPhone}
                            placeholder="+91 98765 43210"
                            keyboardType="phone-pad"
                        />
                        <TextArea
                            label="Experience / Electrical License Number"
                            value={applicantNotes}
                            onChangeText={setApplicantNotes}
                            placeholder="Tell us about your experience or trade certifications..."
                        />

                        <Button
                            variant="primary"
                            size="md"
                            fullWidth
                            loading={isSubmitting}
                            onPress={handleApply}
                            style={{ marginTop: 8 }}
                        >
                            Submit Application
                        </Button>
                    </View>
                ) : null}
            </Modal>
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
    jobsList: {
        gap: 12,
    },
    jobCard: {
        padding: 16,
        gap: 10,
    },
    jobHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    jobTitle: {
        fontSize: 15,
        fontWeight: '700',
    },
    jobDept: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 2,
    },
    jobDesc: {
        fontSize: 13,
        lineHeight: 18,
    },
    jobFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 6,
    },
    salaryText: {
        fontSize: 13,
        fontWeight: '700',
    },
});
