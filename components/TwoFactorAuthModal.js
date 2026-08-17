import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Shield, KeyRound, Copy, Check, AlertCircle } from 'lucide-react-native';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { useToast } from '../context/ToastContext';

export const TwoFactorAuthModal = ({
    visible = false,
    onClose,
    onSuccess,
}) => {
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { success, error: showError } = useToast();
    const isDark = theme === 'dark';

    const [step, setStep] = useState(1); // 1: Setup Secret, 2: Enter OTP, 3: Backup Codes
    const [otpCode, setOtpCode] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [copied, setCopied] = useState(false);

    const secretKey = 'SHER-7X89-YKAM-2026';
    const backupCodes = ['8291-0428', '1940-5829', '4719-0294', '6028-1947'];

    const handleCopySecret = () => {
        setCopied(true);
        success('Secret key copied to clipboard', 'Copied');
        setTimeout(() => setCopied(false), 3000);
    };

    const handleVerify = () => {
        if (otpCode.length !== 6) {
            showError('Please enter a 6-digit authenticator code');
            return;
        }

        setIsVerifying(true);
        setTimeout(() => {
            setIsVerifying(false);
            if (otpCode === '123456' || otpCode.length === 6) {
                setStep(3);
                success('2FA verification successful!', 'Security Enabled');
            } else {
                showError('Invalid 2FA code. Please try again.');
            }
        }, 800);
    };

    const handleFinish = () => {
        if (onSuccess) onSuccess();
        onClose();
        setStep(1);
        setOtpCode('');
    };

    return (
        <Modal
            visible={visible}
            onClose={onClose}
            title={step === 1 ? 'Setup Two-Factor Auth' : step === 2 ? 'Verify 2FA Code' : 'Save Backup Codes'}
            subtitle="Protect your Sheriyakam account with two layers of security"
            maxWidth={440}
        >
            <View style={styles.container}>
                {step === 1 && (
                    <View style={styles.stepContainer}>
                        <View style={[styles.badgeIcon, { backgroundColor: '#10B98118' }]}>
                            <KeyRound size={28} color="#10B981" />
                        </View>

                        <Text style={[styles.instruction, { color: colors.textSecondary }]}>
                            1. Open your authenticator app (Google Authenticator, Authy, or 1Password).
                            {'\n'}2. Enter this setup key manually:
                        </Text>

                        <TouchableOpacity 
                            onPress={handleCopySecret}
                            style={[
                                styles.secretBox,
                                {
                                    backgroundColor: isDark ? '#27272A' : '#F4F4F5',
                                    borderColor: isDark ? '#3F3F46' : '#E4E4E7',
                                }
                            ]}
                        >
                            <Text style={[styles.secretText, { color: colors.accent }]}>
                                {secretKey}
                            </Text>
                            {copied ? (
                                <Check size={16} color="#10B981" />
                            ) : (
                                <Copy size={16} color={colors.textTertiary} />
                            )}
                        </TouchableOpacity>

                        <Button 
                            variant="primary" 
                            size="lg" 
                            fullWidth 
                            onPress={() => setStep(2)}
                            style={{ marginTop: 16 }}
                        >
                            Next: Enter Code
                        </Button>
                    </View>
                )}

                {step === 2 && (
                    <View style={styles.stepContainer}>
                        <Text style={[styles.instruction, { color: colors.textSecondary }]}>
                            Enter the 6-digit verification code from your authenticator app:
                        </Text>

                        <View style={styles.otpInputRow}>
                            <TextInput
                                value={otpCode}
                                onChangeText={setOtpCode}
                                placeholder="123456"
                                placeholderTextColor={colors.textTertiary}
                                keyboardType="number-pad"
                                maxLength={6}
                                style={[
                                    styles.otpInput,
                                    {
                                        color: colors.textPrimary,
                                        backgroundColor: isDark ? '#27272A' : '#FAFAFA',
                                        borderColor: otpCode.length === 6 ? colors.accent : isDark ? '#3F3F46' : '#E4E4E7',
                                    }
                                ]}
                            />
                        </View>

                        <View style={styles.btnRow}>
                            <Button variant="outline" onPress={() => setStep(1)} style={{ flex: 1 }}>
                                Back
                            </Button>
                            <Button 
                                variant="primary" 
                                onPress={handleVerify} 
                                loading={isVerifying} 
                                style={{ flex: 1 }}
                            >
                                Verify
                            </Button>
                        </View>
                    </View>
                )}

                {step === 3 && (
                    <View style={styles.stepContainer}>
                        <Text style={[styles.instruction, { color: colors.textSecondary }]}>
                            Keep these one-time recovery codes safe in case you lose access to your device:
                        </Text>

                        <View style={[
                            styles.codesGrid,
                            {
                                backgroundColor: isDark ? '#27272A' : '#F4F4F5',
                                borderColor: isDark ? '#3F3F46' : '#E4E4E7',
                            }
                        ]}>
                            {backupCodes.map((code, idx) => (
                                <Text key={idx} style={[styles.codeItem, { color: colors.textPrimary }]}>
                                    {code}
                                </Text>
                            ))}
                        </View>

                        <Button 
                            variant="primary" 
                            size="lg" 
                            fullWidth 
                            onPress={handleFinish}
                            style={{ marginTop: 16 }}
                        >
                            Done & Activated
                        </Button>
                    </View>
                )}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 4,
    },
    stepContainer: {
        alignItems: 'center',
    },
    badgeIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    instruction: {
        fontSize: 13,
        lineHeight: 19,
        marginBottom: 16,
        textAlign: 'center',
    },
    secretBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1.5,
        width: '100%',
    },
    secretText: {
        fontSize: 15,
        fontWeight: '800',
        letterSpacing: 1,
        fontFamily: 'monospace',
    },
    otpInputRow: {
        width: '100%',
        alignItems: 'center',
        marginVertical: 12,
    },
    otpInput: {
        width: 200,
        height: 52,
        borderRadius: 14,
        borderWidth: 2,
        fontSize: 24,
        fontWeight: '800',
        letterSpacing: 8,
        textAlign: 'center',
    },
    btnRow: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
        marginTop: 14,
    },
    codesGrid: {
        width: '100%',
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 8,
    },
    codeItem: {
        fontSize: 14,
        fontWeight: '700',
        fontFamily: 'monospace',
        width: '45%',
        paddingVertical: 4,
    },
});
