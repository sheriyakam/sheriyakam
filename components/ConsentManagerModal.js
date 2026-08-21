import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ShieldCheck, Lock, MapPin, MessageSquare, Activity, Check, ArrowRight, Globe, AlertCircle } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { useToast } from '../context/ToastContext';
import { Button } from './ui/Button';
import { Toggle } from './ui/Toggle';
import { Checkbox } from './ui/Checkbox';
import { Badge } from './ui/Badge';
import { Card } from './ui/Card';

const CONSENT_STORAGE_KEY = '@sheriyakam_dpdp_consent_v1';

export const ConsentManagerModal = ({ visible, onClose, onSave }) => {
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { success, warning } = useToast();
    const isDark = theme === 'dark';

    const [language, setLanguage] = useState('en'); // 'en' | 'ml'
    const [isAdult, setIsAdult] = useState(true);
    const [consents, setConsents] = useState({
        essential: true,      // Account & secure booking storage (Mandatory)
        geolocation: true,    // Real-time technician dispatch & routing
        communications: true, // WhatsApp digital GST invoice & SMS ETA alerts
        telemetry: false,     // Anonymous performance crash monitoring
    });

    useEffect(() => {
        loadSavedConsents();
    }, []);

    const loadSavedConsents = async () => {
        try {
            const raw = await AsyncStorage.getItem(CONSENT_STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                setConsents(parsed.consents || consents);
                setIsAdult(parsed.isAdult ?? true);
            }
        } catch (e) {}
    };

    const handleSave = async () => {
        if (!isAdult) {
            warning(
                language === 'ml' 
                    ? 'DPDP നിയമപ്രകാരം 18 വയസ്സ് തികഞ്ഞവർക്ക് മാത്രമേ സേവനങ്ങൾ ബുക്ക് ചെയ്യാൻ അനുമതിയുള്ളൂ.' 
                    : 'Under DPDP Act Section 9, users must be 18+ to independently contract home electrical repairs.'
            );
            return;
        }

        const payload = {
            consents,
            isAdult,
            timestamp: new Date().toISOString(),
            statute: 'DPDP_ACT_2023_SEC_6',
            version: '2026.08',
        };

        try {
            await AsyncStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(payload));
            success(
                language === 'ml' 
                    ? 'സമ്മത മുൻഗണനകൾ സുരക്ഷിതമായി സൂക്ഷിച്ചു.' 
                    : 'Data consent preferences securely saved under DPDP Act, 2023.',
                'Consent Saved'
            );
            if (onSave) onSave(payload);
            if (onClose) onClose();
        } catch (e) {}
    };

    const isMl = language === 'ml';

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.backdrop}>
                <View style={[
                    styles.modalContainer,
                    {
                        backgroundColor: isDark ? '#18181B' : '#FFFFFF',
                        borderColor: isDark ? '#27272A' : '#E4E4E7',
                    }
                ]}>
                    {/* Header */}
                    <View style={[styles.header, { borderBottomColor: isDark ? '#27272A' : '#E4E4E7' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                            <View style={[styles.iconWrap, { backgroundColor: '#10B98120' }]}>
                                <ShieldCheck size={24} color="#10B981" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                    <Text style={[styles.title, { color: colors.textPrimary }]}>
                                        {isMl ? 'ഡാറ്റാ സംരക്ഷണ സമ്മതം' : 'Data Privacy & Consent Notice'}
                                    </Text>
                                    <Badge variant="success" size="sm">DPDP 2023</Badge>
                                </View>
                                <Text style={[styles.subtitle, { color: colors.textTertiary }]}>
                                    {isMl ? 'സെക്ഷൻ 5 & 6 പ്രകാരമുള്ള അറിയിപ്പ്' : 'Statutory Notice under Section 5 & 6'}
                                </Text>
                            </View>
                        </View>

                        {/* Language Switcher */}
                        <TouchableOpacity
                            onPress={() => setLanguage(isMl ? 'en' : 'ml')}
                            style={[styles.langBtn, { backgroundColor: isDark ? '#27272A' : '#F4F4F5' }]}
                            accessibilityRole="button"
                            accessibilityLabel="Switch language between English and Malayalam"
                        >
                            <Globe size={14} color={colors.textSecondary} />
                            <Text style={[styles.langBtnText, { color: colors.textPrimary }]}>
                                {isMl ? 'English' : 'മലയാളം'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        {/* Legal Preamble */}
                        <Text style={[styles.preamble, { color: colors.textSecondary }]}>
                            {isMl
                                ? 'ഷെരിയാക്കാം പ്ലാറ്റ്‌ഫോം നിങ്ങളുടെ സ്വകാര്യതയെ മാനിക്കുന്നു. ഡിജിറ്റൽ വ്യക്തിഗത ഡാറ്റാ സംരക്ഷണ നിയമം (DPDP Act, 2023) പ്രകാരം നിങ്ങളുടെ അനുമതിയോടെ മാത്രമേ വിവരങ്ങൾ ശേഖരിക്കുകയുള്ളൂ.'
                                : 'Sheriyakam Technologies Pvt Ltd collects specific personal data strictly for fulfilling domestic electrical repairs, contractor routing, and tax compliance as mandated under Indian Data Protection Laws.'}
                        </Text>

                        {/* Itemized Consent Switches */}
                        <View style={styles.switchesGroup}>
                            {/* 1. Essential */}
                            <Card variant="default" style={styles.consentCard}>
                                <View style={styles.cardHeader}>
                                    <Lock size={18} color="#3B82F6" />
                                    <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>
                                        {isMl ? '1. അത്യാവശ്യ അക്കൗണ്ട് വിവരങ്ങൾ' : '1. Core Authentication & Booking Data'}
                                    </Text>
                                    <Badge variant="neutral" size="sm">Mandatory</Badge>
                                </View>
                                <Text style={[styles.itemDesc, { color: colors.textSecondary }]}>
                                    {isMl 
                                        ? 'പേര്, ഫോൺ നമ്പർ, ബുക്കിംഗ് ചരിത്രം എന്നിവ അക്കൗണ്ട് കൈകാര്യം ചെയ്യുന്നതിനായി സൂക്ഷിക്കുന്നു.' 
                                        : 'Name, encrypted credentials, and booking references to maintain your active account & 30-day warranty.'}
                                </Text>
                                <View style={styles.fixedNotice}>
                                    <Check size={14} color="#10B981" />
                                    <Text style={[styles.fixedText, { color: colors.textTertiary }]}>
                                        {isMl ? 'സേവനം നൽകാൻ അത്യന്താപേക്ഷിതം' : 'Required for Service Provision'}
                                    </Text>
                                </View>
                            </Card>

                            {/* 2. Geolocation */}
                            <Card variant="default" style={styles.consentCard}>
                                <View style={styles.cardHeader}>
                                    <MapPin size={18} color="#10B981" />
                                    <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>
                                        {isMl ? '2. ലൊക്കേഷൻ & നാവിഗേഷൻ' : '2. Doorstep GPS & Live ETA Dispatch'}
                                    </Text>
                                    <Toggle
                                        value={consents.geolocation}
                                        onChange={(v) => setConsents((prev) => ({ ...prev, geolocation: v }))}
                                    />
                                </View>
                                <Text style={[styles.itemDesc, { color: colors.textSecondary }]}>
                                    {isMl 
                                        ? 'ഏറ്റവും അടുത്തുള്ള സർട്ടിഫൈഡ് ഇലക്ട്രീഷ്യനെ നിങ്ങളുടെ വീട്ടിലേക്ക് അയക്കുന്നതിനായി ലൊക്കേഷൻ ഉപയോഗിക്കുന്നു.' 
                                        : 'Precise delivery address and coordinates shared with assigned Kerala licensed wireman during transit only.'}
                                </Text>
                            </Card>

                            {/* 3. Communication */}
                            <Card variant="default" style={styles.consentCard}>
                                <View style={styles.cardHeader}>
                                    <MessageSquare size={18} color="#F59E0B" />
                                    <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>
                                        {isMl ? '3. വാട്സാപ്പ് / എസ്.എം.എസ് രസീതുകൾ' : '3. WhatsApp GST Invoices & SMS Alerts'}
                                    </Text>
                                    <Toggle
                                        value={consents.communications}
                                        onChange={(v) => setConsents((prev) => ({ ...prev, communications: v }))}
                                    />
                                </View>
                                <Text style={[styles.itemDesc, { color: colors.textSecondary }]}>
                                    {isMl 
                                        ? 'ജി.എസ്.ടി ഇൻവോയ്സ്, ഇലക്ട്രീഷ്യന്റെ വരവ് സമയം എന്നിവ വാട്സാപ്പിൽ അയക്കുന്നു.' 
                                        : 'Digital tax invoices, technician arrival countdowns, and warranty certificate updates via WhatsApp/SMS.'}
                                </Text>
                            </Card>

                            {/* 4. Telemetry */}
                            <Card variant="default" style={styles.consentCard}>
                                <View style={styles.cardHeader}>
                                    <Activity size={18} color="#8B5CF6" />
                                    <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>
                                        {isMl ? '4. ആപ്പ് പ്രകടന നിരീക്ഷണം' : '4. Anonymous Telemetry & Error Logs'}
                                    </Text>
                                    <Toggle
                                        value={consents.telemetry}
                                        onChange={(v) => setConsents((prev) => ({ ...prev, telemetry: v }))}
                                    />
                                </View>
                                <Text style={[styles.itemDesc, { color: colors.textSecondary }]}>
                                    {isMl 
                                        ? 'ആപ്പിന്റെ വേഗതയും സുരക്ഷയും മെച്ചപ്പെടുത്താൻ അജ്ഞാത സാങ്കേതിക വിവരങ്ങൾ നൽകുക.' 
                                        : 'Anonymized crash metrics to improve app stability and latency. Zero cross-site tracking or third-party ads.'}
                                </Text>
                            </Card>
                        </View>

                        {/* Section 9 Minor Verification */}
                        <View style={[styles.ageCheckWrap, { backgroundColor: isDark ? '#27272A50' : '#EFF6FF80' }]}>
                            <Checkbox
                                checked={isAdult}
                                onChange={setIsAdult}
                                label={
                                    isMl
                                        ? 'എനിക്ക് 18 വയസ്സോ അതിൽ കൂടുതലോ പ്രായമുണ്ടെന്ന് സാക്ഷ്യപ്പെടുത്തുന്നു (DPDP സെക്ഷൻ 9)'
                                        : 'I confirm that I am 18 years of age or older (DPDP Act Section 9 Minor Safeguard)'
                                }
                            />
                        </View>

                        {/* DPO Contact Info */}
                        <Text style={[styles.dpoNotice, { color: colors.textTertiary }]}>
                            Data Fiduciary: Sheriyakam Technologies Pvt Ltd, Kozhikode. Data Protection Officer: <Text style={{ color: colors.accent }}>dpo@sheriyakam.com</Text>
                        </Text>
                    </ScrollView>

                    {/* Action Buttons */}
                    <View style={[styles.footer, { borderTopColor: isDark ? '#27272A' : '#E4E4E7' }]}>
                        <Button
                            variant="primary"
                            size="lg"
                            fullWidth
                            onPress={handleSave}
                            iconRight={ArrowRight}
                        >
                            {isMl ? 'സമ്മതം സ്ഥിരീകരിക്കുക' : 'Save Consent Preferences'}
                        </Button>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    modalContainer: {
        width: '100%',
        maxWidth: 500,
        maxHeight: '90%',
        borderRadius: 24,
        borderWidth: 1.5,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    iconWrap: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: '800',
    },
    subtitle: {
        fontSize: 11,
        marginTop: 1,
    },
    langBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
    },
    langBtnText: {
        fontSize: 12,
        fontWeight: '700',
    },
    scrollContent: {
        padding: 20,
        gap: 14,
    },
    preamble: {
        fontSize: 13,
        lineHeight: 19,
    },
    switchesGroup: {
        gap: 10,
    },
    consentCard: {
        padding: 14,
        gap: 6,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    itemTitle: {
        flex: 1,
        fontSize: 13,
        fontWeight: '700',
        marginLeft: 8,
        marginRight: 6,
    },
    itemDesc: {
        fontSize: 12,
        lineHeight: 17,
        marginTop: 2,
    },
    fixedNotice: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    fixedText: {
        fontSize: 11,
        fontWeight: '600',
    },
    ageCheckWrap: {
        padding: 12,
        borderRadius: 12,
        marginTop: 4,
    },
    dpoNotice: {
        fontSize: 11,
        textAlign: 'center',
        lineHeight: 16,
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
    },
});
