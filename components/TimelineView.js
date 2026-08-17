import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { Badge } from './ui/Badge';
import { Clock, User, MapPin } from 'lucide-react-native';

export const TimelineView = ({
    events = [],
    onEventPress,
    style,
}) => {
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';

    const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

    return (
        <View style={[
            styles.container,
            {
                backgroundColor: isDark ? '#18181B' : '#FFFFFF',
                borderColor: isDark ? '#27272A' : '#E4E4E7',
            },
            style
        ]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.textPrimary }]}>
                    Today's Dispatch Schedule (Gantt View)
                </Text>
                <Badge variant="info">Live Dispatch</Badge>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.timelineBody}>
                    {/* Time Grid Header */}
                    <View style={styles.hoursRow}>
                        <View style={styles.sidebarHeader}>
                            <Text style={[styles.colTitle, { color: colors.textTertiary }]}>Contractor</Text>
                        </View>
                        {hours.map((hr) => (
                            <View key={hr} style={styles.hourCell}>
                                <Text style={[styles.hourText, { color: colors.textTertiary }]}>{hr}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Timeline Rows */}
                    {events.map((partnerGroup) => (
                        <View 
                            key={partnerGroup.partnerId} 
                            style={[
                                styles.partnerRow,
                                { borderBottomColor: isDark ? '#27272A' : '#F4F4F5' }
                            ]}
                        >
                            <View style={styles.partnerNameCell}>
                                <Text numberOfLines={1} style={[styles.partnerName, { color: colors.textPrimary }]}>
                                    {partnerGroup.partnerName}
                                </Text>
                                <Text style={[styles.partnerZone, { color: colors.textTertiary }]}>
                                    {partnerGroup.zone}
                                </Text>
                            </View>

                            <View style={styles.slotsRow}>
                                {partnerGroup.jobs.map((job) => {
                                    const getStatusColor = () => {
                                        switch (job.status) {
                                            case 'in_progress': return '#3B82F6';
                                            case 'completed': return '#10B981';
                                            case 'pending': return '#F59E0B';
                                            default: return colors.accent;
                                        }
                                    };
                                    const barColor = getStatusColor();

                                    return (
                                        <TouchableOpacity
                                            key={job.id}
                                            onPress={() => onEventPress && onEventPress(job)}
                                            style={[
                                                styles.jobBar,
                                                {
                                                    left: job.startOffset || 20,
                                                    width: job.durationWidth || 120,
                                                    backgroundColor: barColor + '20',
                                                    borderColor: barColor,
                                                }
                                            ]}
                                        >
                                            <Text numberOfLines={1} style={[styles.jobTitle, { color: barColor }]}>
                                                {job.title}
                                            </Text>
                                            <Text numberOfLines={1} style={[styles.jobTime, { color: colors.textSecondary }]}>
                                                {job.timeSlot}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 18,
        borderWidth: 1,
        overflow: 'hidden',
        marginVertical: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(150,150,150,0.1)',
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
    },
    timelineBody: {
        padding: 12,
    },
    hoursRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(150,150,150,0.1)',
    },
    sidebarHeader: {
        width: 140,
    },
    colTitle: {
        fontSize: 12,
        fontWeight: '700',
    },
    hourCell: {
        width: 70,
        alignItems: 'center',
    },
    hourText: {
        fontSize: 11,
        fontWeight: '600',
    },
    partnerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        minHeight: 56,
    },
    partnerNameCell: {
        width: 140,
        paddingRight: 10,
    },
    partnerName: {
        fontSize: 13,
        fontWeight: '700',
    },
    partnerZone: {
        fontSize: 11,
        marginTop: 2,
    },
    slotsRow: {
        width: 840,
        height: 40,
        position: 'relative',
    },
    jobBar: {
        position: 'absolute',
        top: 2,
        height: 36,
        borderRadius: 8,
        borderWidth: 1.5,
        paddingHorizontal: 8,
        paddingVertical: 2,
        justifyContent: 'center',
    },
    jobTitle: {
        fontSize: 11,
        fontWeight: '700',
    },
    jobTime: {
        fontSize: 9,
    },
});
