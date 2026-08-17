import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Plus, Clock, User, MapPin, CheckCircle2, AlertCircle, ArrowRight, Zap, Filter } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

const INITIAL_KANBAN = {
    new: [
        { id: 'b_101', title: 'Main MCB Tripping Diagnostic', customer: 'Dr. Radhakrishnan', taluk: 'Kozhikode', time: '5m ago', price: 499, emergency: true },
        { id: 'b_102', title: 'Exhaust Fan Installation', customer: 'Fathima Noor', taluk: 'Vadakara', time: '12m ago', price: 299, emergency: false },
    ],
    assigned: [
        { id: 'b_103', title: 'Inverter Battery DC Cabling', customer: 'Manoj Kumar', partner: 'Sanoop K.', taluk: 'Kozhikode', time: '20m ago', price: 599, emergency: false },
    ],
    in_progress: [
        { id: 'b_104', title: '3-Phase Switchboard Rewiring', customer: 'Grand Sweets', partner: 'Vinod M.', taluk: 'Thamarassery', time: '45m ago', price: 850, emergency: true },
    ],
    completed: [
        { id: 'b_105', title: 'Ceiling Fan Capacitor Fix', customer: 'Kavitha R.', partner: 'Sanoop K.', taluk: 'Kozhikode', time: '2h ago', price: 249, emergency: false },
        { id: 'b_106', title: 'AC 25A Isolator Mounting', customer: 'Dr. Anoop', partner: 'Rahim P.', taluk: 'Koyilandy', time: '3h ago', price: 449, emergency: false },
    ],
};

export default function KanbanBoardScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { success } = useToast();
    const isDark = theme === 'dark';

    const [columns, setColumns] = useState(INITIAL_KANBAN);

    const moveTask = (task, fromCol, toCol) => {
        setColumns((prev) => {
            const next = { ...prev };
            next[fromCol] = next[fromCol].filter((t) => t.id !== task.id);
            next[toCol] = [task, ...next[toCol]];
            return next;
        });
        success(`Moved ${task.id} to ${toCol.replace('_', ' ').toUpperCase()}`, 'Dispatch Updated');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <View>
                    <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
                        Live Dispatch Kanban Board
                    </Text>
                    <Text style={[styles.headerSubtitle, { color: colors.textTertiary }]}>
                        Real-time booking workflow management
                    </Text>
                </View>
                <Button 
                    variant="primary" 
                    size="sm" 
                    iconLeft={Plus}
                    onPress={() => success('Manual job creation dispatch modal opened')}
                >
                    New Job
                </Button>
            </View>

            {/* Kanban Columns Horizontal Scroll */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.boardScroll}>
                {/* Column 1: New Requests */}
                <View style={[styles.column, { backgroundColor: isDark ? '#18181B' : '#F4F4F5', borderColor: isDark ? '#27272A' : '#E4E4E7' }]}>
                    <View style={styles.colHeader}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <Text style={[styles.colTitle, { color: colors.textPrimary }]}>New Requests</Text>
                            <Badge variant="danger" size="sm">{columns.new.length}</Badge>
                        </View>
                    </View>

                    <ScrollView style={styles.cardsScroll}>
                        {columns.new.map((task) => (
                            <Card key={task.id} variant="default" style={styles.taskCard}>
                                <View style={styles.taskTop}>
                                    <Badge variant={task.emergency ? 'danger' : 'neutral'} size="sm">
                                        {task.emergency ? '30-Min Emergency' : task.id}
                                    </Badge>
                                    <Text style={[styles.taskPrice, { color: colors.accent }]}>₹{task.price}</Text>
                                </View>

                                <Text style={[styles.taskTitle, { color: colors.textPrimary }]}>{task.title}</Text>

                                <View style={styles.taskMeta}>
                                    <Text style={[styles.taskMetaText, { color: colors.textTertiary }]}>
                                        👤 {task.customer} • 📍 {task.taluk}
                                    </Text>
                                    <Text style={[styles.taskTime, { color: colors.textTertiary }]}>⏱ {task.time}</Text>
                                </View>

                                <TouchableOpacity 
                                    onPress={() => moveTask(task, 'new', 'assigned')}
                                    style={[styles.moveBtn, { backgroundColor: colors.accent }]}
                                >
                                    <Text style={styles.moveBtnText}>Assign Contractor</Text>
                                    <ArrowRight size={14} color="#FFFFFF" />
                                </TouchableOpacity>
                            </Card>
                        ))}
                    </ScrollView>
                </View>

                {/* Column 2: Assigned */}
                <View style={[styles.column, { backgroundColor: isDark ? '#18181B' : '#F4F4F5', borderColor: isDark ? '#27272A' : '#E4E4E7' }]}>
                    <View style={styles.colHeader}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <Text style={[styles.colTitle, { color: colors.textPrimary }]}>Assigned</Text>
                            <Badge variant="info" size="sm">{columns.assigned.length}</Badge>
                        </View>
                    </View>

                    <ScrollView style={styles.cardsScroll}>
                        {columns.assigned.map((task) => (
                            <Card key={task.id} variant="default" style={styles.taskCard}>
                                <View style={styles.taskTop}>
                                    <Badge variant="info" size="sm">{task.id}</Badge>
                                    <Text style={[styles.taskPrice, { color: colors.accent }]}>₹{task.price}</Text>
                                </View>

                                <Text style={[styles.taskTitle, { color: colors.textPrimary }]}>{task.title}</Text>

                                <View style={styles.taskMeta}>
                                    <Text style={[styles.taskMetaText, { color: colors.textSecondary }]}>
                                        ⚡ Assigned: {task.partner}
                                    </Text>
                                    <Text style={[styles.taskMetaText, { color: colors.textTertiary }]}>
                                        📍 {task.taluk} • 👤 {task.customer}
                                    </Text>
                                </View>

                                <TouchableOpacity 
                                    onPress={() => moveTask(task, 'assigned', 'in_progress')}
                                    style={[styles.moveBtn, { backgroundColor: '#3B82F6' }]}
                                >
                                    <Text style={styles.moveBtnText}>Start Transit / Work</Text>
                                    <ArrowRight size={14} color="#FFFFFF" />
                                </TouchableOpacity>
                            </Card>
                        ))}
                    </ScrollView>
                </View>

                {/* Column 3: In Progress */}
                <View style={[styles.column, { backgroundColor: isDark ? '#18181B' : '#F4F4F5', borderColor: isDark ? '#27272A' : '#E4E4E7' }]}>
                    <View style={styles.colHeader}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <Text style={[styles.colTitle, { color: colors.textPrimary }]}>In Progress</Text>
                            <Badge variant="gold" size="sm">{columns.in_progress.length}</Badge>
                        </View>
                    </View>

                    <ScrollView style={styles.cardsScroll}>
                        {columns.in_progress.map((task) => (
                            <Card key={task.id} variant="default" style={styles.taskCard}>
                                <View style={styles.taskTop}>
                                    <Badge variant="gold" size="sm">Working Now</Badge>
                                    <Text style={[styles.taskPrice, { color: colors.accent }]}>₹{task.price}</Text>
                                </View>

                                <Text style={[styles.taskTitle, { color: colors.textPrimary }]}>{task.title}</Text>

                                <View style={styles.taskMeta}>
                                    <Text style={[styles.taskMetaText, { color: colors.textSecondary }]}>
                                        ⚡ Contractor: {task.partner}
                                    </Text>
                                    <Text style={[styles.taskMetaText, { color: colors.textTertiary }]}>
                                        📍 {task.taluk} • {task.customer}
                                    </Text>
                                </View>

                                <TouchableOpacity 
                                    onPress={() => moveTask(task, 'in_progress', 'completed')}
                                    style={[styles.moveBtn, { backgroundColor: '#10B981' }]}
                                >
                                    <Text style={styles.moveBtnText}>Mark Completed</Text>
                                    <CheckCircle2 size={14} color="#FFFFFF" />
                                </TouchableOpacity>
                            </Card>
                        ))}
                    </ScrollView>
                </View>

                {/* Column 4: Completed */}
                <View style={[styles.column, { backgroundColor: isDark ? '#18181B' : '#F4F4F5', borderColor: isDark ? '#27272A' : '#E4E4E7' }]}>
                    <View style={styles.colHeader}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <Text style={[styles.colTitle, { color: colors.textPrimary }]}>Completed</Text>
                            <Badge variant="success" size="sm">{columns.completed.length}</Badge>
                        </View>
                    </View>

                    <ScrollView style={styles.cardsScroll}>
                        {columns.completed.map((task) => (
                            <Card key={task.id} variant="default" style={[styles.taskCard, { opacity: 0.85 }]}>
                                <View style={styles.taskTop}>
                                    <Badge variant="success" size="sm">Invoice Paid</Badge>
                                    <Text style={[styles.taskPrice, { color: colors.accent }]}>₹{task.price}</Text>
                                </View>

                                <Text style={[styles.taskTitle, { color: colors.textPrimary }]}>{task.title}</Text>

                                <View style={styles.taskMeta}>
                                    <Text style={[styles.taskMetaText, { color: colors.textTertiary }]}>
                                        Completed by {task.partner} • {task.time}
                                    </Text>
                                </View>
                            </Card>
                        ))}
                    </ScrollView>
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
    boardScroll: {
        padding: 16,
        gap: 16,
    },
    column: {
        width: 300,
        borderRadius: 18,
        borderWidth: 1,
        padding: 14,
        maxHeight: '100%',
    },
    colHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(150,150,150,0.1)',
    },
    colTitle: {
        fontSize: 15,
        fontWeight: '700',
    },
    cardsScroll: {
        gap: 10,
    },
    taskCard: {
        padding: 14,
        marginBottom: 10,
        gap: 8,
    },
    taskTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    taskPrice: {
        fontSize: 14,
        fontWeight: '800',
    },
    taskTitle: {
        fontSize: 14,
        fontWeight: '700',
        lineHeight: 18,
    },
    taskMeta: {
        gap: 2,
    },
    taskMetaText: {
        fontSize: 12,
    },
    taskTime: {
        fontSize: 11,
        marginTop: 2,
    },
    moveBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
        marginTop: 4,
    },
    moveBtnText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
    },
});
