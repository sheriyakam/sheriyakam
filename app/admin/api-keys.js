import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Key, Plus, Copy, Trash2, ShieldCheck, Check, Globe, RefreshCw } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';

const INITIAL_KEYS = [
    { id: 'key_1', name: 'Mobile App Client Key', prefix: 'shk_live_948a...', scope: 'Production Client', created: '2026-03-10' },
    { id: 'key_2', name: 'ERP Billing Gateway Hook', prefix: 'shk_sec_71b9...', scope: 'Full Admin', created: '2026-05-18' },
];

const INITIAL_WEBHOOKS = [
    { id: 'wh_1', url: 'https://api.sheriyakam.com/hooks/dispatch', events: ['booking.created', 'partner.assigned'], status: 'Active' },
    { id: 'wh_2', url: 'https://erp.enterprise.in/webhooks/gst-invoice', events: ['job.completed'], status: 'Active' },
];

export default function AdminApiKeysScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { success, warning } = useToast();
    const isDark = theme === 'dark';

    const [keys, setKeys] = useState(INITIAL_KEYS);
    const [webhooks, setWebhooks] = useState(INITIAL_WEBHOOKS);
    const [showNewKeyModal, setShowNewKeyModal] = useState(false);
    const [newKeyName, setNewKeyName] = useState('');

    const handleCopyKey = (prefix) => {
        success(`Key ${prefix} copied to clipboard!`, 'Copied');
    };

    const handleRevokeKey = (id) => {
        setKeys((prev) => prev.filter((k) => k.id !== id));
        warning('API key revoked and blacklisted from server.');
    };

    const handleCreateKey = () => {
        if (!newKeyName.trim()) return;
        const newKey = {
            id: 'key_' + Date.now(),
            name: newKeyName.trim(),
            prefix: 'shk_live_' + Math.random().toString(36).substring(2, 8) + '...',
            scope: 'Standard API Access',
            created: new Date().toISOString().split('T')[0],
        };
        setKeys((prev) => [newKey, ...prev]);
        setShowNewKeyModal(false);
        setNewKeyName('');
        success('New API Key generated successfully!', 'API Key Ready');
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
                        API Keys & Webhooks
                    </Text>
                    <Text style={[styles.headerSubtitle, { color: colors.textTertiary }]}>
                        Manage programmatic integration tokens
                    </Text>
                </View>
                <Button variant="primary" size="sm" iconLeft={Plus} onPress={() => setShowNewKeyModal(true)}>
                    Create Key
                </Button>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Active Keys */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                    ACTIVE REST API KEYS
                </Text>
                <View style={styles.keysList}>
                    {keys.map((k) => (
                        <Card key={k.id} variant="default" style={styles.keyCard}>
                            <View style={styles.keyTop}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                    <Key size={16} color={colors.accent} />
                                    <Text style={[styles.keyName, { color: colors.textPrimary }]}>{k.name}</Text>
                                </View>
                                <Badge variant="info" size="sm">{k.scope}</Badge>
                            </View>

                            <View style={[styles.tokenBox, { backgroundColor: isDark ? '#27272A' : '#F4F4F5' }]}>
                                <Text style={[styles.tokenText, { color: colors.textPrimary }]}>{k.prefix}</Text>
                                <TouchableOpacity onPress={() => handleCopyKey(k.prefix)}>
                                    <Copy size={16} color={colors.textTertiary} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.keyFooter}>
                                <Text style={[styles.keyCreated, { color: colors.textTertiary }]}>Created: {k.created}</Text>
                                <TouchableOpacity onPress={() => handleRevokeKey(k.id)}>
                                    <Text style={[styles.revokeText, { color: colors.danger }]}>Revoke</Text>
                                </TouchableOpacity>
                            </View>
                        </Card>
                    ))}
                </View>

                {/* Webhooks Section */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 24 }]}>
                    OUTBOUND DISPATCH WEBHOOKS
                </Text>
                <View style={styles.webhooksList}>
                    {webhooks.map((wh) => (
                        <Card key={wh.id} variant="default" style={styles.webhookCard}>
                            <View style={styles.whTop}>
                                <Globe size={16} color="#10B981" />
                                <Text numberOfLines={1} style={[styles.whUrl, { color: colors.textPrimary }]}>{wh.url}</Text>
                                <Badge variant="success" size="sm">{wh.status}</Badge>
                            </View>

                            <View style={styles.eventsWrap}>
                                {wh.events.map((ev) => (
                                    <Badge key={ev} variant="neutral" size="sm">{ev}</Badge>
                                ))}
                            </View>
                        </Card>
                    ))}
                </View>
            </ScrollView>

            {/* Create API Key Modal */}
            <Modal
                visible={showNewKeyModal}
                onClose={() => setShowNewKeyModal(false)}
                title="Generate New API Key"
                subtitle="Specify application identifier and permissions"
            >
                <View style={{ gap: 12, paddingVertical: 6 }}>
                    <Input
                        label="Key Name"
                        value={newKeyName}
                        onChangeText={setNewKeyName}
                        placeholder="e.g. ERP Billing Service"
                    />

                    <Button
                        variant="primary"
                        size="md"
                        fullWidth
                        onPress={handleCreateKey}
                        disabled={!newKeyName.trim()}
                    >
                        Generate Secret Token
                    </Button>
                </View>
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
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
        marginBottom: 8,
        paddingLeft: 2,
    },
    keysList: {
        gap: 10,
    },
    keyCard: {
        padding: 14,
        gap: 10,
    },
    keyTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    keyName: {
        fontSize: 14,
        fontWeight: '700',
    },
    tokenBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    tokenText: {
        fontSize: 13,
        fontFamily: 'monospace',
        fontWeight: '600',
    },
    keyFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    keyCreated: {
        fontSize: 11,
    },
    revokeText: {
        fontSize: 12,
        fontWeight: '700',
    },
    webhooksList: {
        gap: 10,
    },
    webhookCard: {
        padding: 14,
        gap: 8,
    },
    whTop: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    whUrl: {
        flex: 1,
        fontSize: 13,
        fontWeight: '600',
    },
    eventsWrap: {
        flexDirection: 'row',
        gap: 6,
        flexWrap: 'wrap',
    },
});
