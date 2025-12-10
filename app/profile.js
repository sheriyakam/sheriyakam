import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, Modal, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, User, Mail, Phone, MapPin, Settings, LogOut, ChevronRight, Save, X } from 'lucide-react-native';
import { COLORS, SPACING } from '../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
    const router = useRouter();
    const { user, logout } = useAuth(); // Assuming useAuth provides current user data, but we'll use local state for this mock

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

    const InfoRow = ({ icon: Icon, label, fieldKey, value, isEditable }) => (
        <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
                <Icon size={20} color={COLORS.textTertiary} />
            </View>
            <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{label}</Text>
                {isEditable && isEditing ? (
                    <TextInput
                        style={styles.infoInput}
                        value={userInfo[fieldKey]}
                        onChangeText={(text) => setUserInfo({ ...userInfo, [fieldKey]: text })}
                        placeholder={`Enter ${label}`}
                        placeholderTextColor={COLORS.textTertiary}
                    />
                ) : (
                    <Text style={styles.infoValue}>{value}</Text>
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
            // In a real app, you would initiate the OTP send API here
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

    const MenuOption = ({ icon: Icon, label, onPress, isDestructive }) => (
        <TouchableOpacity style={styles.menuOption} onPress={onPress}>
            <View style={styles.menuOptionLeft}>
                <Icon size={20} color={isDestructive ? COLORS.danger : COLORS.textPrimary} />
                <Text style={[styles.menuOptionText, isDestructive && { color: COLORS.danger }]}>{label}</Text>
            </View>
            <ChevronRight size={20} color={COLORS.textTertiary} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                            <ArrowLeft size={24} color={COLORS.textPrimary} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Profile</Text>

                        {isEditing ? (
                            <View style={{ flexDirection: 'row', gap: 16 }}>
                                <TouchableOpacity onPress={handleCancelEdit}>
                                    <Text style={{ color: COLORS.textSecondary, fontWeight: '600' }}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleSave}>
                                    <Text style={styles.editBtnText}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity style={styles.editBtn} onPress={() => setIsEditing(true)}>
                                <Text style={styles.editBtnText}>Edit</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Profile Card */}
                    <View style={styles.profileCard}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={{ uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&auto=format&fit=crop&q=60' }}
                                style={styles.avatar}
                            />
                            {/* Camera Button REMOVED as per request */}
                        </View>
                        <Text style={styles.userName}>{originalInfo.name}</Text>
                        <Text style={styles.userRole}>Premium Member</Text>
                    </View>

                    {/* Info Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Personal Information</Text>
                        <InfoRow
                            icon={User}
                            label="Full Name"
                            fieldKey="name"
                            value={userInfo.name}
                            isEditable={true}
                        />
                        <InfoRow
                            icon={Mail}
                            label="Email"
                            fieldKey="email"
                            value={userInfo.email}
                            isEditable={true}
                        />
                        <InfoRow
                            icon={Phone}
                            label="Phone"
                            fieldKey="phone"
                            value={userInfo.phone}
                            isEditable={true}
                        />
                        <InfoRow
                            icon={MapPin}
                            label="Location"
                            fieldKey="location"
                            value={userInfo.location}
                            isEditable={true}
                        />
                    </View>

                    {/* Settings Section */}
                    {!isEditing && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Account Settings</Text>
                            <MenuOption icon={Settings} label="App Settings" onPress={() => { }} />
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
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Verify Changes</Text>
                            <TouchableOpacity onPress={() => setShowOtpModal(false)}>
                                <X size={24} color={COLORS.textPrimary} />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.modalText}>
                            For security, please enter the OTP sent to your new contact details to confirm this change.
                        </Text>

                        <TextInput
                            style={styles.otpInput}
                            placeholder="Enter OTP (1234)"
                            placeholderTextColor={COLORS.textTertiary}
                            value={otp}
                            onChangeText={setOtp}
                            keyboardType="numeric"
                            maxLength={4}
                        />

                        {otpError ? <Text style={styles.errorText}>{otpError}</Text> : null}

                        <TouchableOpacity style={styles.verifyBtn} onPress={handleVerifyOtp}>
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
        backgroundColor: COLORS.bgPrimary,
    },
    scrollContent: {
        padding: SPACING.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    editBtnText: {
        color: COLORS.accent,
        fontWeight: 'bold',
        fontSize: 16,
    },
    profileCard: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: SPACING.md,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: COLORS.accent,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    userRole: {
        fontSize: 14,
        color: COLORS.textTertiary,
    },
    section: {
        marginBottom: SPACING.xl,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textSecondary,
        marginBottom: SPACING.md,
        marginLeft: 4,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.03)',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    infoIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: COLORS.textTertiary,
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 16,
        color: COLORS.textPrimary,
        fontWeight: '500',
    },
    infoInput: {
        fontSize: 16,
        color: COLORS.textPrimary,
        fontWeight: '500',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.accent,
        paddingVertical: 2,
    },
    menuOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255,255,255,0.03)',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    menuOptionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    menuOptionText: {
        fontSize: 16,
        color: COLORS.textPrimary,
        fontWeight: '500',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: COLORS.bgSecondary,
        width: '100%',
        maxWidth: 400,
        padding: 24,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    modalText: {
        color: COLORS.textSecondary,
        marginBottom: 20,
        lineHeight: 20,
    },
    otpInput: {
        backgroundColor: COLORS.bgPrimary,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        padding: 16,
        fontSize: 18,
        color: COLORS.textPrimary,
        textAlign: 'center',
        marginBottom: 16,
        letterSpacing: 4,
    },
    verifyBtn: {
        backgroundColor: COLORS.accent,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    verifyBtnText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
    },
    errorText: {
        color: COLORS.danger,
        marginBottom: 16,
        textAlign: 'center',
    },
});
