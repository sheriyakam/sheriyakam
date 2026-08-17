import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Calendar, Clock, MapPin, User, Plus, Filter } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';
import { useToast } from '../../context/ToastContext';
import { TimelineView } from '../../components/TimelineView';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

const SCHEDULE_EVENTS = [
    {
        partnerId: 'p1',
        partnerName: 'Sanoop K.',
        zone: 'Kozhikode Central',
        jobs: [
            { id: 'j1', title: 'Fan Repair', timeSlot: '09:00 - 10:30', startOffset: 70, durationWidth: 105, status: 'completed' },
            { id: 'j2', title: 'Short Circuit Diagnostic', timeSlot: '11:00 - 13:00', startOffset: 210, durationWidth: 140, status: 'in_progress' },
            { id: 'j3', title: 'Inverter Cabling', timeSlot: '15:00 - 16:30', startOffset: 490, durationWidth: 105, status: 'pending' },
        ]
    },
    {
        partnerId: 'p2',
        partnerName: 'Vinod M.',
        zone: 'Vadakara',
        jobs: [
            { id: 'j4', title: 'AC Isolator Mounting', timeSlot: '10:00 - 11:30', startOffset: 140, durationWidth: 105, status: 'completed' },
            { id: 'j5', title: 'Switchboard Overhaul', timeSlot: '14:00 - 16:00', startOffset: 420, durationWidth: 140, status: 'pending' },
        ]
    },
    {
        partnerId: 'p3',
        partnerName: 'Rahim P.',
        zone: 'Thamarassery',
        jobs: [
            { id: 'j6', title: 'Emergency Blackout Call', timeSlot: '08:30 - 10:00', startOffset: 35, durationWidth: 105, status: 'completed' },
            { id: 'j7', title: '3-Phase DB Balance', timeSlot: '12:30 - 14:30', startOffset: 315, durationWidth: 140, status: 'in_progress' },
        ]
    },
];

export default function AdminScheduleScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { success } = useToast();
    const isDark = theme === 'dark';

    const [selectedJob, setSelectedJob] = useState(null);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <View>
                    <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
                        Contractor Schedule (Gantt)
                    </Text>
                    <Text style={[styles.headerSubtitle, { color: colors.textTertiary }]}>
                        Visual timeline across Kerala zones
                    </Text>
                </View>
                <Button variant="primary" size="sm" iconLeft={Plus} onPress={() => success('Slot reservation trigger')}>
                    Add Slot
                </Button>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Visual Gantt Chart */}
                <TimelineView
                    events={SCHEDULE_EVENTS}
                    onEventPress={(job) => setSelectedJob(job)}
                />
            </ScrollView>

            {/* Job Details Modal */}
            <Modal
                visible={!!selectedJob}
                onClose={() => setSelectedJob(null)}
                title={selectedJob ? selectedJob.title : ''}
                subtitle={selectedJob ? `Slot: ${selectedJob.timeSlot}` : ''}
            >
                {selectedJob ? (
                    <View style={{ gap: 10, paddingVertical: 6 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: colors.textSecondary }}>Status:</Text>
                            <Badge variant={selectedJob.status === 'completed' ? 'success' : selectedJob.status === 'in_progress' ? 'info' : 'warning'}>
                                {selectedJob.status.toUpperCase()}
                            </Badge>
                        </View>
                        <Button
                            variant="primary"
                            size="md"
                            fullWidth
                            onPress={() => {
                                success(`Job #${selectedJob.id} re-dispatching triggered!`);
                                setSelectedJob(null);
                            }}
                        >
                            Reassign to Alternate Contractor
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
    headerSubtitle: {
        fontSize: 12,
    },
    scrollContent: {
        padding: 16,
    },
});
