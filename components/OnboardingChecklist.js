import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CheckCircle2, Circle, ChevronRight, Sparkles, MapPin, CreditCard, Wrench, Share2 } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { useRouter } from 'expo-router';

export const OnboardingChecklist = ({ style }) => {
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const router = useRouter();
    const isDark = theme === 'dark';

    const [tasks, setTasks] = useState([
        {
            id: 't1',
            title: 'Confirm Home Location',
            desc: 'Ensure technicians in Kozhikode find your house quickly',
            completed: true,
            icon: MapPin,
            route: '/profile',
        },
        {
            id: 't2',
            title: 'Explore Services & Pricing',
            desc: 'Check fixed rates for fan, wiring, and AC repair',
            completed: true,
            icon: Wrench,
            route: '/search',
        },
        {
            id: 't3',
            title: 'Save Payment Method',
            desc: 'Enable seamless 1-tap checkout via UPI or Card',
            completed: false,
            icon: CreditCard,
            route: '/settings',
        },
        {
            id: 't4',
            title: 'Invite Neighbors & Earn ₹100',
            desc: 'Get ₹100 service credits for every friend who signs up',
            completed: false,
            icon: Share2,
            route: '/invite',
        },
    ]);

    const completedCount = tasks.filter((t) => t.completed).length;
    const progressPercent = Math.round((completedCount / tasks.length) * 100);

    const toggleTask = (id) => {
        setTasks((prev) => 
            prev.map((t) => t.id === id ? { ...t, completed: !t.completed } : t)
        );
    };

    return (
        <View style={[
            styles.container,
            {
                backgroundColor: isDark ? '#18181B' : '#FFFFFF',
                borderColor: isDark ? '#27272A' : '#E4E4E7',
            },
            style
        ]}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={[styles.sparkleWrap, { backgroundColor: colors.accent + '20' }]}>
                        <Sparkles size={16} color={colors.accent} />
                    </View>
                    <View>
                        <Text style={[styles.title, { color: colors.textPrimary }]}>
                            Getting Started with Sheriyakam
                        </Text>
                        <Text style={[styles.subtitle, { color: colors.textTertiary }]}>
                            {completedCount} of {tasks.length} steps completed ({progressPercent}%)
                        </Text>
                    </View>
                </View>
            </View>

            {/* Progress Bar */}
            <View style={[styles.progressTrack, { backgroundColor: isDark ? '#27272A' : '#E4E4E7' }]}>
                <View style={[
                    styles.progressBar,
                    {
                        width: `${progressPercent}%`,
                        backgroundColor: colors.accent,
                    }
                ]} />
            </View>

            {/* Tasks List */}
            <View style={styles.tasksList}>
                {tasks.map((task) => {
                    const Icon = task.icon;
                    return (
                        <TouchableOpacity
                            key={task.id}
                            onPress={() => router.push(task.route)}
                            activeOpacity={0.7}
                            style={[
                                styles.taskItem,
                                {
                                    borderBottomColor: isDark ? '#27272A50' : '#F4F4F5',
                                }
                            ]}
                        >
                            <TouchableOpacity 
                                onPress={() => toggleTask(task.id)}
                                style={styles.checkBtn}
                            >
                                {task.completed ? (
                                    <CheckCircle2 size={20} color="#10B981" />
                                ) : (
                                    <Circle size={20} color={colors.textTertiary} />
                                )}
                            </TouchableOpacity>

                            <View style={styles.taskTextWrap}>
                                <Text style={[
                                    styles.taskTitle,
                                    {
                                        color: task.completed ? colors.textTertiary : colors.textPrimary,
                                        textDecorationLine: task.completed ? 'line-through' : 'none',
                                    }
                                ]}>
                                    {task.title}
                                </Text>
                                <Text style={[styles.taskDesc, { color: colors.textTertiary }]}>
                                    {task.desc}
                                </Text>
                            </View>

                            <ChevronRight size={16} color={colors.textTertiary} />
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 18,
        borderWidth: 1.5,
        padding: 18,
        marginVertical: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    sparkleWrap: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 15,
        fontWeight: '700',
    },
    subtitle: {
        fontSize: 12,
        marginTop: 2,
    },
    progressTrack: {
        height: 6,
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 14,
    },
    progressBar: {
        height: '100%',
        borderRadius: 3,
    },
    tasksList: {
        gap: 2,
    },
    taskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        gap: 12,
    },
    checkBtn: {
        padding: 2,
    },
    taskTextWrap: {
        flex: 1,
    },
    taskTitle: {
        fontSize: 14,
        fontWeight: '600',
    },
    taskDesc: {
        fontSize: 12,
        marginTop: 2,
    },
});
