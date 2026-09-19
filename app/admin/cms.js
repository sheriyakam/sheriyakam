import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Alert, TextInput, Modal, Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    ArrowLeft, HelpCircle, DollarSign, MapPin, Plus, Edit2,
    Trash2, CheckCircle, Shield, X, Save, AlertCircle, RefreshCw
} from 'lucide-react-native';
import { COLORS, SPACING } from '../../constants/theme';
import {
    getFaqs, updateFaq, addFaq, deleteFaq,
    getTariffs, updateTariff,
    getDistrictCoverage, toggleDistrictActive, cmsEvents
} from '../../constants/cmsStore';

export default function AdminCmsScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('faqs'); // 'faqs', 'tariffs', 'districts'

    const [faqs, setFaqs] = useState([]);
    const [tariffs, setTariffs] = useState([]);
    const [districts, setDistricts] = useState([]);

    // FAQ Edit/Create Modal
    const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
    const [editingFaqId, setEditingFaqId] = useState(null);
    const [faqQuestion, setFaqQuestion] = useState('');
    const [faqAnswer, setFaqAnswer] = useState('');
    const [faqCategory, setFaqCategory] = useState('Pricing');

    // Tariff Edit Modal
    const [isTariffModalOpen, setIsTariffModalOpen] = useState(false);
    const [editingTariff, setEditingTariff] = useState(null);
    const [tariffPrice, setTariffPrice] = useState('');
    const [tariffDesc, setTariffDesc] = useState('');

    const reloadData = () => {
        setFaqs([...getFaqs()]);
        setTariffs([...getTariffs()]);
        setDistricts([...getDistrictCoverage()]);
    };

    useEffect(() => {
        reloadData();
        cmsEvents.on('change', reloadData);
        return () => cmsEvents.off('change', reloadData);
    }, []);

    // FAQ Handlers
    const handleOpenAddFaq = () => {
        setEditingFaqId(null);
        setFaqQuestion('');
        setFaqAnswer('');
        setFaqCategory('Pricing');
        setIsFaqModalOpen(true);
    };

    const handleOpenEditFaq = (f) => {
        setEditingFaqId(f.id);
        setFaqQuestion(f.q);
        setFaqAnswer(f.a);
        setFaqCategory(f.category);
        setIsFaqModalOpen(true);
    };

    const handleSaveFaq = () => {
        if (!faqQuestion.trim()) {
            Alert.alert('Question Required', 'Please provide a clear FAQ question.');
            return;
        }
        if (!faqAnswer.trim()) {
            Alert.alert('Answer Required', 'Empty answers are blocked. Please provide a helpful answer.');
            return;
        }

        if (editingFaqId) {
            updateFaq(editingFaqId, faqQuestion, faqAnswer, faqCategory);
            Alert.alert('✅ FAQ Updated', 'Changes saved and published live.');
        } else {
            addFaq(faqQuestion, faqAnswer, faqCategory);
            Alert.alert('✅ FAQ Created', 'New FAQ added and published live.');
        }
        setIsFaqModalOpen(false);
        reloadData();
    };

    const handleDeleteFaq = (id, q) => {
        Alert.alert(
            'Delete FAQ',
            `Are you sure you want to remove "${q}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        deleteFaq(id);
                        reloadData();
                    }
                }
            ]
        );
    };

    // Tariff Handlers
    const handleOpenEditTariff = (t) => {
        setEditingTariff(t);
        setTariffPrice(String(t.price));
        setTariffDesc(t.desc);
        setIsTariffModalOpen(true);
    };

    const handleSaveTariff = () => {
        if (!tariffPrice.trim() || isNaN(Number(tariffPrice))) {
            Alert.alert('Invalid Price', 'Please enter a valid numeric price.');
            return;
        }

        updateTariff(editingTariff.id, Number(tariffPrice), tariffDesc);
        setIsTariffModalOpen(false);
        reloadData();
        Alert.alert('✅ Tariff Updated', `${editingTariff.name} price updated to ₹${tariffPrice}.`);
    };

    // District Toggle
    const handleToggleDistrict = (id) => {
        toggleDistrictActive(id);
        reloadData();
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={20} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={styles.headerTitle}>Dynamic Content CMS</Text>
                    <Text style={styles.headerSub}>Manage FAQs, rate-card tariffs, and district service coverage</Text>
                </View>
                {activeTab === 'faqs' && (
                    <TouchableOpacity style={styles.addBtn} onPress={handleOpenAddFaq}>
                        <Plus size={16} color="#fff" />
                        <Text style={styles.addBtnText}>New FAQ</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Nav Tabs */}
            <View style={styles.tabsRow}>
                {[
                    { id: 'faqs', label: `FAQs (${faqs.length})`, icon: HelpCircle },
                    { id: 'tariffs', label: `Tariff Rates (${tariffs.length})`, icon: DollarSign },
                    { id: 'districts', label: `14 Districts (${districts.length})`, icon: MapPin }
                ].map(t => {
                    const Icon = t.icon;
                    const isActive = activeTab === t.id;
                    return (
                        <TouchableOpacity
                            key={t.id}
                            style={[styles.tabChip, isActive && styles.tabChipActive]}
                            onPress={() => setActiveTab(t.id)}
                        >
                            <Icon size={14} color={isActive ? COLORS.accent : COLORS.textSecondary} />
                            <Text style={[styles.tabChipText, isActive && styles.tabChipTextActive]}>
                                {t.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* ── FAQS TAB ── */}
                {activeTab === 'faqs' && (
                    <View style={styles.itemsList}>
                        <View style={styles.cmsNoticeBox}>
                            <CheckCircle size={14} color={COLORS.success} />
                            <Text style={styles.cmsNoticeText}>
                                Empty-Answer Guardrail Active: All rendered FAQs are verified with non-empty answers to preserve AEO/SEO schema scores.
                            </Text>
                        </View>

                        {faqs.map(faq => (
                            <View key={faq.id} style={styles.faqCard}>
                                <View style={styles.faqCardTop}>
                                    <View style={styles.categoryBadge}>
                                        <Text style={styles.categoryBadgeText}>{faq.category}</Text>
                                    </View>
                                    <View style={styles.cardActionIcons}>
                                        <TouchableOpacity
                                            style={styles.iconBtn}
                                            onPress={() => handleOpenEditFaq(faq)}
                                        >
                                            <Edit2 size={13} color={COLORS.accent} />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.iconBtn}
                                            onPress={() => handleDeleteFaq(faq.id, faq.q)}
                                        >
                                            <Trash2 size={13} color={COLORS.danger} />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <Text style={styles.faqQuestionText}>{faq.q}</Text>
                                <Text style={styles.faqAnswerText}>{faq.a}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* ── TARIFFS TAB ── */}
                {activeTab === 'tariffs' && (
                    <View style={styles.itemsList}>
                        <View style={styles.cmsNoticeBox}>
                            <DollarSign size={14} color={COLORS.gold} />
                            <Text style={styles.cmsNoticeText}>
                                Instant Tariff Updating: Price changes reflect dynamically on the customer booking modal and partner payouts without redeploying code.
                            </Text>
                        </View>

                        {tariffs.map(t => (
                            <View key={t.id} style={styles.tariffCard}>
                                <View style={{ flex: 1 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                        <Text style={styles.tariffName}>{t.name}</Text>
                                        <View style={styles.categoryBadge}>
                                            <Text style={styles.categoryBadgeText}>{t.category}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.tariffDesc}>{t.desc}</Text>
                                    <Text style={styles.tariffTime}>Estimated Duration: {t.time}</Text>
                                </View>

                                <View style={styles.tariffRight}>
                                    <Text style={styles.tariffPrice}>₹{t.price}</Text>
                                    <TouchableOpacity
                                        style={styles.editPriceBtn}
                                        onPress={() => handleOpenEditTariff(t)}
                                    >
                                        <Edit2 size={11} color={COLORS.accent} />
                                        <Text style={styles.editPriceBtnText}>Edit</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {/* ── DISTRICTS TAB ── */}
                {activeTab === 'districts' && (
                    <View style={styles.itemsList}>
                        <View style={styles.cmsNoticeBox}>
                            <MapPin size={14} color={COLORS.accent} />
                            <Text style={styles.cmsNoticeText}>
                                14 Kerala Districts Marketplace Coverage: Activate or pause incoming dispatches per district zone.
                            </Text>
                        </View>

                        {districts.map(d => (
                            <View key={d.id} style={styles.districtCard}>
                                <View style={{ flex: 1 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                        <Text style={styles.districtName}>{d.name} District</Text>
                                        <View style={[styles.activeStatusPill, d.active ? styles.pillActive : styles.pillInactive]}>
                                            <Text style={[styles.activeStatusText, d.active ? { color: COLORS.success } : { color: COLORS.textTertiary }]}>
                                                {d.active ? 'ACTIVE HUB' : 'PAUSED'}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text style={styles.districtHq}>Regional Hub: {d.hq}</Text>
                                    <Text style={styles.districtStats}>
                                        {d.partnersCount} KSELB Wiremen • Avg Arrival: {d.avgArrivalMins} mins
                                    </Text>
                                </View>

                                <Switch
                                    value={d.active}
                                    onValueChange={() => handleToggleDistrict(d.id)}
                                    trackColor={{ false: COLORS.border, true: COLORS.accent }}
                                    thumbColor="#fff"
                                />
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>

            {/* Edit / Create FAQ Modal */}
            <Modal
                visible={isFaqModalOpen}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsFaqModalOpen(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <View style={styles.modalHeader}>
                            <View>
                                <Text style={styles.modalBadge}>FAQ CONTENT EDITOR</Text>
                                <Text style={styles.modalTitle}>{editingFaqId ? 'Edit FAQ Item' : 'Create FAQ'}</Text>
                            </View>
                            <TouchableOpacity onPress={() => setIsFaqModalOpen(false)}>
                                <X size={20} color={COLORS.textPrimary} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                            <Text style={styles.modalLabel}>Category:</Text>
                            <View style={styles.faqCategoriesRow}>
                                {['Pricing', 'Emergency', 'Safety', 'Payment', 'Warranty'].map(cat => (
                                    <TouchableOpacity
                                        key={cat}
                                        style={[styles.catSelectChip, faqCategory === cat && styles.catSelectChipActive]}
                                        onPress={() => setFaqCategory(cat)}
                                    >
                                        <Text style={[styles.catSelectText, faqCategory === cat && styles.catSelectTextActive]}>
                                            {cat}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={[styles.modalLabel, { marginTop: 12 }]}>Question (FAQ):</Text>
                            <TextInput
                                style={styles.inputField}
                                placeholder="e.g. How much does ceiling fan rewinding cost?"
                                placeholderTextColor={COLORS.textTertiary}
                                value={faqQuestion}
                                onChangeText={setFaqQuestion}
                            />

                            <Text style={[styles.modalLabel, { marginTop: 12 }]}>Comprehensive Answer (Never Empty):</Text>
                            <TextInput
                                style={styles.textArea}
                                placeholder="Enter quotation, arrival time, licensing, and warranty details..."
                                placeholderTextColor={COLORS.textTertiary}
                                multiline
                                numberOfLines={4}
                                value={faqAnswer}
                                onChangeText={setFaqAnswer}
                            />
                        </ScrollView>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={styles.saveBtn}
                                onPress={handleSaveFaq}
                            >
                                <Save size={16} color="#fff" />
                                <Text style={styles.saveBtnText}>Save & Publish Live</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Edit Tariff Modal */}
            <Modal
                visible={isTariffModalOpen}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsTariffModalOpen(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <View style={styles.modalHeader}>
                            <View>
                                <Text style={styles.modalBadge}>RATE CARD MANAGER</Text>
                                <Text style={styles.modalTitle}>Update {editingTariff?.name}</Text>
                            </View>
                            <TouchableOpacity onPress={() => setIsTariffModalOpen(false)}>
                                <X size={20} color={COLORS.textPrimary} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalBody}>
                            <Text style={styles.modalLabel}>Standard Base Price (₹):</Text>
                            <TextInput
                                style={styles.inputField}
                                keyboardType="numeric"
                                value={tariffPrice}
                                onChangeText={setTariffPrice}
                            />

                            <Text style={[styles.modalLabel, { marginTop: 12 }]}>Service Description / Scope:</Text>
                            <TextInput
                                style={styles.inputField}
                                value={tariffDesc}
                                onChangeText={setTariffDesc}
                            />
                        </View>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={styles.saveBtn}
                                onPress={handleSaveTariff}
                            >
                                <Save size={16} color="#fff" />
                                <Text style={styles.saveBtnText}>Update Tariff Rate</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgPrimary,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        backgroundColor: COLORS.bgSecondary,
        gap: 12,
    },
    backBtn: {
        padding: 6,
        borderRadius: 8,
        backgroundColor: COLORS.bgTertiary,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: COLORS.textPrimary,
    },
    headerSub: {
        fontSize: 11,
        color: COLORS.textSecondary,
    },
    addBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: COLORS.accent,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    addBtnText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#fff',
    },
    tabsRow: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.md,
        paddingVertical: 10,
        gap: 8,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        backgroundColor: COLORS.bgSecondary,
    },
    tabChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: COLORS.bgTertiary,
    },
    tabChipActive: {
        backgroundColor: 'rgba(79, 70, 229, 0.15)',
        borderWidth: 1,
        borderColor: COLORS.accent,
    },
    tabChipText: {
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
    tabChipTextActive: {
        color: COLORS.accent,
        fontWeight: '700',
    },
    content: {
        padding: SPACING.md,
        paddingBottom: 40,
    },
    itemsList: {
        gap: 12,
    },
    cmsNoticeBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        padding: 10,
        borderRadius: 10,
        marginBottom: 4,
    },
    cmsNoticeText: {
        fontSize: 11,
        color: COLORS.textPrimary,
        flex: 1,
        lineHeight: 16,
    },
    faqCard: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 12,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    faqCardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    categoryBadge: {
        backgroundColor: 'rgba(79, 70, 229, 0.12)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    categoryBadgeText: {
        fontSize: 10,
        color: COLORS.accent,
        fontWeight: '700',
    },
    cardActionIcons: {
        flexDirection: 'row',
        gap: 6,
    },
    iconBtn: {
        padding: 6,
        borderRadius: 6,
        backgroundColor: COLORS.bgTertiary,
    },
    faqQuestionText: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 6,
    },
    faqAnswerText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        lineHeight: 18,
    },
    tariffCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 12,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    tariffName: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    tariffDesc: {
        fontSize: 11,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    tariffTime: {
        fontSize: 10,
        color: COLORS.textTertiary,
        marginTop: 4,
    },
    tariffRight: {
        alignItems: 'flex-end',
        marginLeft: 12,
    },
    tariffPrice: {
        fontSize: 18,
        fontWeight: '900',
        color: COLORS.textPrimary,
    },
    editPriceBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(79, 70, 229, 0.12)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginTop: 4,
    },
    editPriceBtnText: {
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.accent,
    },
    districtCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 12,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    districtName: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    activeStatusPill: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    pillActive: {
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
    },
    pillInactive: {
        backgroundColor: COLORS.bgTertiary,
    },
    activeStatusText: {
        fontSize: 9,
        fontWeight: '800',
    },
    districtHq: {
        fontSize: 11,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    districtStats: {
        fontSize: 10,
        color: COLORS.textTertiary,
        marginTop: 2,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.75)',
        justifyContent: 'flex-end',
    },
    modalCard: {
        backgroundColor: COLORS.bgSecondary,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        paddingBottom: 10,
    },
    modalBadge: {
        fontSize: 10,
        fontWeight: '800',
        color: COLORS.accent,
        letterSpacing: 0.5,
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: COLORS.textPrimary,
        marginTop: 2,
    },
    modalBody: {
        marginTop: 12,
    },
    modalLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: 6,
    },
    faqCategoriesRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    catSelectChip: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6,
        backgroundColor: COLORS.bgTertiary,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    catSelectChipActive: {
        borderColor: COLORS.accent,
        backgroundColor: 'rgba(79, 70, 229, 0.15)',
    },
    catSelectText: {
        fontSize: 11,
        color: COLORS.textSecondary,
    },
    catSelectTextActive: {
        color: COLORS.accent,
        fontWeight: '700',
    },
    inputField: {
        backgroundColor: COLORS.bgTertiary,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        padding: 10,
        color: COLORS.textPrimary,
        fontSize: 13,
    },
    textArea: {
        backgroundColor: COLORS.bgTertiary,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        padding: 10,
        color: COLORS.textPrimary,
        fontSize: 12,
        textAlignVertical: 'top',
        height: 90,
    },
    modalFooter: {
        marginTop: 12,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingTop: 10,
    },
    saveBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: COLORS.accent,
        paddingVertical: 12,
        borderRadius: 10,
    },
    saveBtnText: {
        fontSize: 13,
        fontWeight: '800',
        color: '#fff',
    }
});
