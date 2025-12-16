import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../../constants/theme';
import { addPartner, findPartner, findPartnerByPhone, approvePartner, getPartners, loginPartner, initializePartnerSession } from '../../constants/partnerStore';
import { User, Mail, Phone, Lock, MapPin } from 'lucide-react-native';
import PartnerLocationSelect from '../../components/PartnerLocationSelect';

import { useTheme } from '../../context/ThemeContext';

export default function PartnerAuth() {
    const router = useRouter();
    const { theme } = useTheme();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [checkingSession, setCheckingSession] = useState(true);

    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        const session = await initializePartnerSession();
        if (session) {
            router.replace('/partner');
        } else {
            setCheckingSession(false);
        }
    };



    // Form State
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [serviceTypes, setServiceTypes] = useState([]);
    const [password, setPassword] = useState('');

    // Location State
    const [location, setLocation] = useState(null);
    const [showLocationModal, setShowLocationModal] = useState(false);

    // OTP State
    // OTP State
    const [showOtp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState('');

    const phoneRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const otpRef = useRef(null);

    const toggleService = (type) => {
        if (serviceTypes.includes(type)) {
            setServiceTypes(serviceTypes.filter(t => t !== type));
        } else {
            if (serviceTypes.length < 3) {
                setServiceTypes([...serviceTypes, type]);
            } else {
                Alert.alert('Limit Reached', 'You can select up to 3 services only');
            }
        }
    };

    const handleLogin = async () => {
        if (!phone) {
            Alert.alert('Error', 'Please enter mobile number');
            return;
        }

        if (!showOtp) {
            setLoading(true);
            setTimeout(() => {
                const partner = findPartnerByPhone(phone);
                setLoading(false);

                if (partner) {
                    setShowOtp(true);
                    Alert.alert('OTP Sent', 'Use 1234 to login');
                } else {
                    Alert.alert('Error', 'Mobile number not registered');
                }
            }, 1000);
        } else {
            if (!otp) {
                Alert.alert('Error', 'Please enter OTP');
                return;
            }

            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                if (otp === '1234') {
                    const partner = findPartnerByPhone(phone);
                    if (partner) {
                        if (partner.status === 'approved') {
                            loginPartner(partner); // Store session
                            router.replace('/partner');
                        } else if (partner.status === 'pending') {
                            Alert.alert('Account Pending', 'Your account is waiting for Admin approval.');
                        } else {
                            Alert.alert('Access Denied', 'Your account has been rejected.');
                        }
                    }
                } else {
                    Alert.alert('Error', 'Invalid OTP');
                }
            }, 1000);
        }
    };

    const handleSignup = async () => {
        if (!fullName || !email || !phone || !password || serviceTypes.length === 0 || !location) {
            Alert.alert('Error', 'Please fill all fields, select services, and set location');
            return;
        }

        setLoading(true);
        setTimeout(() => {
            try {
                const newPartner = addPartner({
                    name: fullName,
                    email,
                    phone,
                    password,
                    serviceTypes, // Pass array
                    location, // Save location
                });
                setLoading(false);
                Alert.alert(
                    'Registration Successful',
                    'Your account has been created and is PENDING APPROVAL. You cannot login until an Admin approves your account.',
                    [{ text: 'OK', onPress: () => setIsLogin(true) }]
                );
            } catch (error) {
                setLoading(false);
                Alert.alert('Error', 'Registration failed');
            }
        }, 1000);
    };

    const devApproveLast = () => {
        const partners = getPartners();
        if (partners.length > 0) {
            const last = partners[partners.length - 1];
            if (last.status === 'pending') {
                approvePartner(last.id);
                Alert.alert('Dev Tool', `Approved ${last.email}`);
            } else {
                Alert.alert('Dev Tool', 'Last user is already approved');
            }
        }
    };

    if (checkingSession) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <View style={[
                        styles.nameWrapper,
                        theme === 'dark' && styles.nameWrapperDark
                    ]}>
                        <Text style={styles.appName}>
                            <Text style={{ color: '#001F3F' }}>Sheri</Text>
                            <Text style={{ color: '#2563EB' }}>yakam</Text>
                        </Text>
                    </View>
                    <Text style={styles.partnerBadge}>Partner</Text>
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.title}>{isLogin ? 'Partner Login' : 'Partner Registration'}</Text>
                    <Text style={styles.subtitle}>
                        {isLogin ? 'Welcome back! Login to manage bookings.' : 'Join us to get more work nearby.'}
                    </Text>

                    {!isLogin && (
                        <View style={styles.inputGroup}>
                            <User size={20} color={COLORS.textTertiary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Full Name"
                                placeholderTextColor={COLORS.textTertiary}
                                value={fullName}
                                onChangeText={setFullName}
                                returnKeyType="next"
                                onSubmitEditing={() => phoneRef.current?.focus()}
                                blurOnSubmit={false}
                            />
                        </View>
                    )}

                    <View style={styles.inputGroup}>
                        <Phone size={20} color={COLORS.textTertiary} style={styles.inputIcon} />
                        <TextInput
                            ref={phoneRef}
                            style={styles.input}
                            placeholder="Mobile Number"
                            placeholderTextColor={COLORS.textTertiary}
                            keyboardType="phone-pad"
                            value={phone}
                            onChangeText={setPhone}
                            returnKeyType={isLogin ? "go" : "next"}
                            onSubmitEditing={() => isLogin ? handleLogin() : emailRef.current?.focus()}
                            blurOnSubmit={false}
                        />
                    </View>

                    {!isLogin && (
                        <>
                            <View style={styles.serviceSelectionContainer}>
                                <Text style={styles.label}>Select Service Type</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsContainer}>
                                    {['Electrician', 'AC', 'CCTV', 'Inverter', 'Home Automation'].map((type) => (
                                        <TouchableOpacity
                                            key={type}
                                            style={[
                                                styles.chip,
                                                serviceTypes.includes(type) && styles.chipSelected
                                            ]}
                                            onPress={() => toggleService(type)}
                                        >
                                            <Text style={[
                                                styles.chipText,
                                                serviceTypes.includes(type) && styles.chipTextSelected
                                            ]}>
                                                {type}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                                <Text style={{ marginLeft: SPACING.xs, marginTop: 4, color: COLORS.textTertiary, fontSize: 12 }}>
                                    Selected: {serviceTypes.length}/3
                                </Text>
                            </View>

                            <View style={styles.inputGroup}>
                                <Mail size={20} color={COLORS.textTertiary} style={styles.inputIcon} />
                                <TextInput
                                    ref={emailRef}
                                    style={styles.input}
                                    placeholder="Email Address"
                                    placeholderTextColor={COLORS.textTertiary}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={setEmail}
                                    returnKeyType="next"
                                    onSubmitEditing={() => passwordRef.current?.focus()}
                                    blurOnSubmit={false}
                                />
                            </View>

                            {/* Location Selection */}
                            <View style={{ marginBottom: SPACING.md }}>
                                <Text style={styles.label}>Service Base Location (10km Range)</Text>
                                <TouchableOpacity
                                    style={styles.inputGroup}
                                    onPress={() => setShowLocationModal(true)}
                                >
                                    <MapPin size={20} color={location ? COLORS.success : COLORS.textTertiary} style={styles.inputIcon} />
                                    <View style={{ flex: 1, padding: SPACING.md, justifyContent: 'center' }}>
                                        <Text style={{
                                            color: location ? COLORS.textPrimary : COLORS.textTertiary,
                                            fontSize: 16
                                        }}>
                                            {location ? location.address : "Tap to set location on map"}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}

                    {isLogin && showOtp && (
                        <View style={styles.inputGroup}>
                            <Lock size={20} color={COLORS.textTertiary} style={styles.inputIcon} />
                            <TextInput
                                ref={otpRef}
                                style={styles.input}
                                placeholder="Enter OTP (1234)"
                                placeholderTextColor={COLORS.textTertiary}
                                keyboardType="number-pad"
                                value={otp}
                                onChangeText={setOtp}
                                maxLength={4}
                                returnKeyType="go"
                                onSubmitEditing={handleLogin}
                            />
                        </View>
                    )}

                    {!isLogin && (
                        <View style={styles.inputGroup}>
                            <Lock size={20} color={COLORS.textTertiary} style={styles.inputIcon} />
                            <TextInput
                                ref={passwordRef}
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor={COLORS.textTertiary}
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                                returnKeyType="go"
                                onSubmitEditing={handleSignup}
                            />
                        </View>
                    )}

                    <TouchableOpacity
                        style={styles.button}
                        onPress={isLogin ? handleLogin : handleSignup}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{isLogin ? (showOtp ? 'Verify & Login' : 'Get OTP') : 'Apply Now'}</Text>}
                    </TouchableOpacity>

                    {/* Social Login UI */}
                    <View style={styles.socialContainer}>
                        <View style={styles.dividerContainer}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>or continue with</Text>
                            <View style={styles.dividerLine} />
                        </View>
                        <View style={styles.socialButtonsRow}>
                            {/* Google */}
                            <TouchableOpacity style={[styles.socialBtn, { backgroundColor: '#DB4437', width: '80%', flexDirection: 'row', gap: 10 }]} onPress={() => Alert.alert('Coming Soon', 'Google login is under development.')}>
                                <Mail size={20} color="#fff" />
                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Continue with Google</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.switchContainer}>
                        {isLogin ? (
                            <TouchableOpacity
                                style={{
                                    backgroundColor: COLORS.gold,
                                    paddingVertical: 14,
                                    paddingHorizontal: 24,
                                    borderRadius: 12,
                                    width: '100%',
                                    alignItems: 'center',
                                    marginTop: SPACING.md
                                }}
                                onPress={() => setIsLogin(!isLogin)}
                            >
                                <Text style={{ color: '#000', fontSize: 16, fontWeight: 'bold' }}>BECOME A PARTNER</Text>
                            </TouchableOpacity>
                        ) : (
                            <>
                                <Text style={styles.switchText}>Already have an account? </Text>
                                <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                                    <Text style={styles.switchLink}>Login</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>

                    {/* DEV TOOL */}
                    <TouchableOpacity onPress={devApproveLast} style={{ marginTop: 40, alignItems: 'center' }}>
                        <Text style={{ color: COLORS.textTertiary, fontSize: 12 }}>[Dev: Approve Last Signup]</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView >

            <PartnerLocationSelect
                visible={showLocationModal}
                onClose={() => setShowLocationModal(false)}
                onSelect={(loc) => setLocation(loc)}
            />
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgPrimary,
    },
    scrollContent: {
        flexGrow: 1,
        padding: SPACING.xl,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACING.xxl,
    },
    appName: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: SPACING.xs,
    },
    partnerBadge: {
        color: COLORS.gold,
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    formContainer: {
        width: '100%',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.textTertiary,
        marginBottom: SPACING.xl,
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 12,
        marginBottom: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    inputIcon: {
        marginLeft: SPACING.md,
    },
    input: {
        flex: 1,
        padding: SPACING.md,
        color: COLORS.textPrimary,
        fontSize: 16,
    },
    button: {
        backgroundColor: COLORS.primary,
        padding: SPACING.md,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: SPACING.sm,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: SPACING.xl,
    },
    switchText: {
        color: COLORS.textTertiary,
    },
    switchLink: {
        color: COLORS.accent,
        fontWeight: 'bold',
    },
    serviceSelectionContainer: {
        marginBottom: SPACING.md,
    },
    label: {
        color: COLORS.textSecondary,
        marginBottom: SPACING.sm,
        marginLeft: SPACING.xs,
        fontSize: 14,
    },
    chipsContainer: {
        gap: SPACING.sm,
        paddingBottom: SPACING.xs,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: COLORS.bgSecondary,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    chipSelected: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    chipText: {
        color: COLORS.textSecondary,
        fontSize: 14,
        fontWeight: '500',
    },
    chipTextSelected: {
        color: '#fff',
        fontWeight: 'bold',
    },
    nameWrapper: {
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 4,
    },
    nameWrapperDark: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 8,
    },
    socialContainer: {
        marginTop: SPACING.lg,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.border,
    },
    dividerText: {
        marginHorizontal: SPACING.md,
        color: COLORS.textTertiary,
        fontSize: 12,
    },
    socialButtonsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: SPACING.md,
    },
    socialBtn: {
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    }
});
