import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, Modal, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, User, Mail, Phone, MapPin, Settings, LogOut, ChevronRight, Save, X, Shield, Award } from 'lucide-react-native';
import { COLORS, SPACING } from '../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function ProfileScreen() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const { theme, colors } = useTheme();
    const isDark = theme === 'dark';

    // Initial Mock Data
    const initialData = {
        name: user?.name || "John Doe",
        email: user?.email || "john.doe@example.com",
        phone: user?.mobile || user?.phone || "+91 98765 43210",
        location: user?.location || "Kochi, Kerala"
    };

    const [isEditing, setIsEditing] = useState(false);
    const [userInfo, setUserInfo] = useState(initialData);
    const [originalInfo, setOriginalInfo] = useState(initialData); // To track changes

    // OTP State
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpError, setOtpError] = useState('');

    const InfoRow = ({ icon: Icon, label, fieldKey, value, isEditable, iconColor }) => (
        <View style={[styles.infoRow, { 
            backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#f8f9fa',
            borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
        }]}>
            <View style={[styles.infoIcon, { backgroundColor: (iconColor || colors.accent) + '18' }]}>
                <Icon size={18} color={iconColor || colors.accent} />
            </View>
            <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>{label}</Text>
                {isEditable && isEditing ? (
                    <TextInput
                        style={[styles.infoInput, { color: colors.textPrimary, borderBottomColor: colors.accent }]}
                        value={userInfo[fieldKey]}
                        onChangeText={(text) => setUserInfo({ ...userInfo, [fieldKey]: text })}
                        placeholder={`Enter ${label}`}
                        placeholderTextColor={colors.textTertiary}
                    />
                ) : (
                    <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{value}</Text>
                )}
            </View>
        </View>
    );

    const handleSave = () => {
        // Validation
        if (!userInfo.name || !userInfo.email || !userInfo.phone) {
            Alert.alert("Error", "Please fill in all required fields.");
            return;
        }

        // Check for sensitive changes
        const emailChanged = userInfo.email !== originalInfo.email;
        const phoneChanged = userInfo.phone !== originalInfo.phone;

        if (emailChanged || phoneChanged) {
            // Trigger OTP Flow
            setShowOtpModal(true);
            Alert.alert("OTP Sent", `An OTP has been sent to your ${emailChanged ? 'new email' : ''} ${emailChanged && phoneChanged ? 'and' : ''} ${phoneChanged ? 'new mobile number' : ''} to verify the change.`);
        } else {
            // No sensitive changes, just save
            setOriginalInfo(userInfo);
            setIsEditing(false);
            Alert.alert("Success", "Profile updated successfully!");
        }
    };

    const handleVerifyOtp = () => {
        if (otp === '1234') { // Mock OTP
            setShowOtpModal(false);
            setOriginalInfo(userInfo);
            setIsEditing(false);
            setOtp('');
            setOtpError('');
            Alert.alert("Success", "Identity verified. Profile updated successfully!");
        } else {
            setOtpError("Invalid OTP. Try '1234'");
        }
    };

    const handleCancelEdit = () => {
        setUserInfo(originalInfo);
        setIsEditing(false);
    };

    const MenuOption = ({ icon: Icon, label, onPress, isDestructive, iconColor }) => (
        <TouchableOpacity style={[styles.menuOption, { 
            backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#f8f9fa',
            borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
        }]} onPress={onPress}>
            <View style={styles.menuOptionLeft}>
                <View style={[styles.menuIconWrap, { backgroundColor: (isDestructive ? COLORS.danger : (iconColor || colors.textPrimary)) + '14' }]}>
                    <Icon size={18} color={isDestructive ? COLORS.danger : (iconColor || colors.textPrimary)} />
                </View>
                <Text style={[styles.menuOptionText, { color: isDestructive ? COLORS.danger : colors.textPrimary }]}>{label}</Text>
            </View>
            <ChevronRight size={18} color={colors.textTertiary} />
        </TouchableOpacity>
    );

    // Get initials for avatar
    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <View style={[styles.header, { borderBottomColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }]}>
                        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}>
                            <ArrowLeft size={22} color={colors.textPrimary} />
                        </TouchableOpacity>
                        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Profile</Text>

                        {isEditing ? (
                            <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
                                <TouchableOpacity onPress={handleCancelEdit}>
                                    <Text style={{ color: colors.textSecondary, fontWeight: '600', fontSize: 14 }}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.accent }]} onPress={handleSave}>
                                    <Text style={styles.saveBtnText}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity style={[styles.editBtn, { backgroundColor: colors.accent + '15', borderColor: colors.accent + '30' }]} onPress={() => setIsEditing(true)}>
                                <Text style={[styles.editBtnText, { color: colors.accent }]}>Edit</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Profile Card */}
                    <View style={styles.profileCard}>
                        <View style={[styles.avatarContainer, { borderColor: colors.accent + '40' }]}>
                            <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
                                <Text style={styles.avatarText}>{getInitials(originalInfo.name)}</Text>
                            </View>
                        </View>
                        <Text style={[styles.userName, { color: colors.textPrimary }]}>{originalInfo.name}</Text>
                        <View style={[styles.memberBadge, { backgroundColor: colors.accent + '15' }]}>
                            <Award size={12} color={colors.accent} />
                            <Text style={[styles.memberBadgeText, { color: colors.accent }]}>Premium Member</Text>
                        </View>
                    </View>

                    {/* Info Section */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>PERSONAL INFORMATION</Text>
                        <InfoRow
                            icon={User}
                            label="Full Name"
                            fieldKey="name"
                            value={userInfo.name}
                            isEditable={true}
                            iconColor="#2563EB"
                        />
                        <InfoRow
                            icon={Mail}
                            label="Email"
                            fieldKey="email"
                            value={userInfo.email}
                            isEditable={true}
                            iconColor="#10B981"
                        />
                        <InfoRow
                            icon={Phone}
                            label="Phone"
                            fieldKey="phone"
                            value={userInfo.phone}
                            isEditable={true}
                            iconColor="#F59E0B"
                        />
                        <InfoRow
                            icon={MapPin}
                            label="Location"
                            fieldKey="location"
                            value={userInfo.location}
                            isEditable={true}
                            iconColor="#EF4444"
                        />
                    </View>

                    {/* Settings Section */}
                    {!isEditing && (
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>ACCOUNT SETTINGS</Text>
                            <MenuOption icon={Settings} label="App Settings" onPress={() => { }} iconColor="#6366F1" />
                            <MenuOption icon={Shield} label="Privacy & Security" onPress={() => { }} iconColor="#10B981" />
                            <MenuOption icon={LogOut} label="Log Out" isDestructive onPress={() => {
                                logout();
                                router.replace('/auth/login');
                            }} />
                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>

            {/* OTP Modal */}
            <Modal
                visible={showOtpModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowOtpModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { 
                        backgroundColor: isDark ? colors.bgSecondary : '#ffffff',
                        borderColor: isDark ? colors.border : 'rgba(0,0,0,0.08)',
                    }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Verify Changes</Text>
                            <TouchableOpacity onPress={() => setShowOtpModal(false)} style={[styles.modalCloseBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}>
                                <X size={20} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>
                        <Text style={[styles.modalText, { color: colors.textSecondary }]}>
                            For security, please enter the OTP sent to your new contact details to confirm this change.
                        </Text>

                        <TextInput
                            style={[styles.otpInput, { 
                                backgroundColor: isDark ? colors.bgPrimary : '#f8f9fa',
                                borderColor: isDark ? colors.border : 'rgba(0,0,0,0.08)',
                                color: colors.textPrimary,
                            }]}
                            placeholder="Enter OTP (1234)"
                            placeholderTextColor={colors.textTertiary}
                            value={otp}
                            onChangeText={setOtp}
                            keyboardType="numeric"
                            maxLength={4}
                        />

                        {otpError ? <Text style={styles.errorText}>{otpError}</Text> : null}

                        <TouchableOpacity style={[styles.verifyBtn, { backgroundColor: colors.accent }]} onPress={handleVerifyOtp}>
                            <Text style={styles.verifyBtnText}>Verify & Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: SPACING.md,
        paddingTop: 0,
        paddingBottom: 100, // Space for BottomNav
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
        borderBottomWidth: 1,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: -0.3,
    },
    editBtn: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 10,
        borderWidth: 1,
    },
    editBtnText: {
        fontWeight: '700',
        fontSize: 14,
    },
    saveBtn: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 10,
    },
    saveBtnText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
    },
    profileCard: {
        alignItems: 'center',
        marginVertical: SPACING.xl,
    },
    avatarContainer: {
        marginBottom: SPACING.md,
        borderWidth: 3,
        borderRadius: 56,
        padding: 3,
    },
    avatar: {
        width: 96,
        height: 96,
        borderRadius: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: '#ffffff',
        fontSize: 32,
        fontWeight: '800',
    },
    userName: {
        fontSize: 24,
        fontWeight: '800',
        marginBottom: 8,
        letterSpacing: -0.3,
    },
    memberBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
    },
    memberBadgeText: {
        fontSize: 12,
        fontWeight: '700',
    },
    section: {
        marginBottom: SPACING.xl,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: '800',
        marginBottom: SPACING.md,
        marginLeft: 4,
        letterSpacing: 1.5,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 14,
        marginBottom: 8,
        borderWidth: 1,
        gap: 14,
    },
    infoIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 11,
        fontWeight: '500',
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 15,
        fontWeight: '600',
    },
    infoInput: {
        fontSize: 15,
        fontWeight: '600',
        borderBottomWidth: 1.5,
        paddingVertical: 4,
    },
    menuOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 14,
        borderRadius: 14,
        marginBottom: 8,
        borderWidth: 1,
    },
    menuOptionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    menuIconWrap: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuOptionText: {
        fontSize: 15,
        fontWeight: '600',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        width: '100%',
        maxWidth: 400,
        padding: 24,
        borderRadius: 20,
        borderWidth: 1,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalCloseBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        letterSpacing: -0.3,
    },
    modalText: {
        marginBottom: 20,
        lineHeight: 22,
        fontSize: 14,
    },
    otpInput: {
        borderWidth: 1,
        borderRadius: 14,
        padding: 16,
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 16,
        letterSpacing: 6,
        fontWeight: '700',
    },
    verifyBtn: {
        padding: 16,
        borderRadius: 14,
        alignItems: 'center',
    },
    verifyBtnText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
    errorText: {
        color: COLORS.danger,
        marginBottom: 16,
        textAlign: 'center',
        fontSize: 13,
    },
});
