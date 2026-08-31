import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView, Modal, Switch, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, User, Phone, X, ArrowRight } from 'lucide-react-native';
import { COLORS, SPACING } from '../../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { isSupabaseConfigured } from '../../config/supabaseConfig';
import { UsersAPI } from '../../services/supabaseAPI';
import { checkRateLimit, generateOTP, hashPassword } from '../../utils/security';
import { snitch } from '../../utils/snitch';

export default function AuthScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { login, register, signInWithOAuth } = useAuth();

    // State to toggle between Login (true) and SignUp (false)
    const [isLogin, setIsLogin] = useState(true);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [agreeMarketing, setAgreeMarketing] = useState(false);

    // Form States
    const [name, setName] = useState('');
    const [identifier, setIdentifier] = useState(''); // Email or Mobile for Login
    const [email, setEmail] = useState(''); // Specific for SignUp
    const [mobile, setMobile] = useState(''); // Specific for SignUp
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Forgot Password State
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [recoveryIdentifier, setRecoveryIdentifier] = useState('');
    const [recoveryStep, setRecoveryStep] = useState(1); // 1: Input, 2: OTP, 3: Result
    const [recoveryOtp, setRecoveryOtp] = useState('');
    const [recoveredCreds, setRecoveredCreds] = useState(null);
    const [generatedRecoveryOtp, setGeneratedRecoveryOtp] = useState('');

    // Security: Rate limiting
    const [loginAttempts, setLoginAttempts] = useState(0);
    const [lockoutUntil, setLockoutUntil] = useState(null);

    // Refs for input navigation
    const emailRef = useRef(null);
    const mobileRef = useRef(null);
    const passwordRef = useRef(null);
    const identifierRef = useRef(null);

    useEffect(() => {
        if (params.mode === 'signup') {
            setIsLogin(false);
        }
    }, [params.mode]);

    // Validation Helpers
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validatePhone = (phone) => {
        // Validates 10 digit numbers starting with 6-9
        const re = /^[6-9]\d{9}$/;
        return re.test(phone);
    };

    const handleAuth = async () => {
        // 1. Validation Logic
        if (!isLogin) {
            if (!agreeTerms) {
                Alert.alert("Terms Agreement Required", "You must read and agree to our Terms of Service and Privacy Policy before creating an account.");
                return;
            }
            // SignUp Validation
            if (!name.trim()) {
                Alert.alert("Validation Error", "Please enter your full name");
                return;
            }
            if (!validateEmail(email)) {
                Alert.alert("Validation Error", "Please enter a valid email address");
                return;
            }
            if (!validatePhone(mobile)) {
                Alert.alert("Validation Error", "Please enter a valid 10-digit mobile number");
                return;
            }
            if (password.length < 6) {
                Alert.alert("Validation Error", "Password must be at least 6 characters long");
                return;
            }
        } else {
            // Login Validation
            if (!identifier.trim()) {
                Alert.alert("Validation Error", "Please enter your email or mobile number");
                return;
            }
            if (password.length < 4) {
                Alert.alert("Validation Error", "Please enter a valid password");
                return;
            }
        }

        setIsLoading(true);
        const cleanIdentifier = identifier.trim().toLowerCase();

        try {
            if (isLogin) {
                snitch.logEvent('auth_login_attempt', { identifier: cleanIdentifier });
                // Rate limit check
                const limitRes = checkRateLimit(`login_${cleanIdentifier}`, 5, 60000);
                if (!limitRes.allowed) {
                    const secs = Math.ceil(limitRes.retryAfterMs / 1000);
                    snitch.logError(new Error('Rate limited on login'), `Login Rate Limit: ${cleanIdentifier}`);
                    Alert.alert("Rate Limited", `Too many attempts. Try again in ${secs} seconds.`);
                    setIsLoading(false);
                    return;
                }

                // If user typed phone number or name, format it for Supabase Email Auth
                const loginEmail = cleanIdentifier.includes('@') ? cleanIdentifier : `${cleanIdentifier}@example.com`;

                await login(loginEmail, password);
                snitch.logEvent('auth_login_success', { email: loginEmail });
                router.replace('/');
            } else {
                // Sign Up Flow
                const cleanEmail = email.trim().toLowerCase();
                snitch.logEvent('auth_signup_attempt', { email: cleanEmail });
                const limitRes = checkRateLimit(`signup_${cleanEmail}`, 3, 60000);
                if (!limitRes.allowed) {
                    snitch.logError(new Error('Rate limited on signup'), `Signup Rate Limit: ${cleanEmail}`);
                    Alert.alert("Rate Limited", "Too many signup attempts. Try again later.");
                    setIsLoading(false);
                    return;
                }

                await register(cleanEmail, password, name.trim(), mobile.trim());
                snitch.logEvent('auth_signup_success', { email: cleanEmail });

                setIsLoading(false);
                setIsLogin(true);
                Alert.alert("Registration", "Registration request processed. If confirmation is enabled, check your email.");
            }
        } catch (err) {
            snitch.logError(err, 'Auth Screen handleAuth Catch');
            console.error("Auth Error:", err);
            Alert.alert("Error", err.message || "Incorrect email or password");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = async (provider) => {
        snitch.logEvent(`auth_${provider.toLowerCase()}_login_attempt`);
        setIsLoading(true);
        try {
            const res = await signInWithOAuth(provider.toLowerCase());
            if (res) {
                router.replace('/');
            }
        } catch (error) {
            snitch.logError(error, `${provider} Sign-In popup catch`);
            console.error(`${provider} Sign-In Error:`, error);
            Alert.alert("Sign-In Error", `Failed to sign in with ${provider}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotSubmit = () => {
        if (!recoveryIdentifier) {
            Alert.alert("Validation Error", "Please enter your Email or Mobile Number");
            return;
        }
        // Rate limit check
        const limitRes = checkRateLimit(`forgot_password_${recoveryIdentifier}`, 3, 60000);
        if (!limitRes.allowed) {
            Alert.alert("Rate Limited", "Too many recovery attempts. Try again later.");
            return;
        }
        // Simulate background processing
        const newOtp = generateOTP();
        setGeneratedRecoveryOtp(newOtp);
        console.log(`[Security/Recovery] Simulated recovery for ${recoveryIdentifier}. OTP Code: ${newOtp}`);
        
        setShowForgotModal(false);
        Alert.alert("Password Reset", "If that email is registered, you'll receive a reset link");
    };

    const handleVerifyRecoveryOtp = (otpInput) => {
        const otpToCheck = otpInput || recoveryOtp;

        if (otpToCheck === generatedRecoveryOtp || (otpToCheck === '1234' && __DEV__)) {
            setIsLoading(true);
            setTimeout(async () => {
                setIsLoading(false);
                setShowForgotModal(false);

                const cleanEmail = recoveryIdentifier.includes('@') ? recoveryIdentifier : `${recoveryIdentifier}@sheriyakam.com`;
                try {
                    await login(cleanEmail, 'recovered_session');
                } catch (e) {}

                Alert.alert("Success", "Verified! Logging you in...");
                router.replace('/');
            }, 800);

        } else if (otpToCheck.length === 4) {
            Alert.alert("Error", "Invalid OTP. Enter the code sent to you.");
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        // Reset specific fields if needed
        setPassword('');
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <ArrowLeft size={24} color={COLORS.textPrimary} />
                    </TouchableOpacity>

                    <View style={styles.header}>
                        <Image source={require('../../assets/icon.png')} style={styles.logo} />
                        <Text style={styles.title}>{isLogin ? 'Welcome Back!' : 'Create Account'}</Text>
                        <Text style={styles.subtitle}>{isLogin ? 'Sign in to continue' : 'Join Sheriyakam today'}</Text>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>

                        {!isLogin && (
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Full Name</Text>
                                <View style={styles.inputContainer}>
                                    <User size={20} color={COLORS.textTertiary} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter your full name"
                                        placeholderTextColor={COLORS.textTertiary}
                                        value={name}
                                        onChangeText={setName}
                                        returnKeyType="next"
                                        onSubmitEditing={() => emailRef.current?.focus()}
                                        blurOnSubmit={false}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Login: Identifier (Email/Mobile) | SignUp: Email & Mobile separate */}
                        {isLogin ? (
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Email or Mobile Number</Text>
                                <View style={styles.inputContainer}>
                                    <Mail size={20} color={COLORS.textTertiary} />
                                    <TextInput
                                        ref={identifierRef}
                                        style={styles.input}
                                        placeholder="Enter email or mobile"
                                        placeholderTextColor={COLORS.textTertiary}
                                        value={identifier}
                                        onChangeText={(text) => {
                                            // Check if it looks like a number being typed
                                            const isNumeric = /^\d+$/.test(text);
                                            if (isNumeric) {
                                                if (text.length <= 10) {
                                                    setIdentifier(text);
                                                }
                                            } else {
                                                setIdentifier(text);
                                            }
                                        }}
                                        autoCapitalize="none"
                                        returnKeyType="next"
                                        onSubmitEditing={() => passwordRef.current?.focus()}
                                        blurOnSubmit={false}
                                    />
                                </View>
                            </View>
                        ) : (
                            <>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Email Address</Text>
                                    <View style={styles.inputContainer}>
                                        <Mail size={20} color={COLORS.textTertiary} />
                                        <TextInput
                                            ref={emailRef}
                                            style={styles.input}
                                            placeholder="Enter your email"
                                            placeholderTextColor={COLORS.textTertiary}
                                            value={email}
                                            onChangeText={setEmail}
                                            autoCapitalize="none"
                                            keyboardType="email-address"
                                            returnKeyType="next"
                                            onSubmitEditing={() => mobileRef.current?.focus()}
                                            blurOnSubmit={false}
                                        />
                                    </View>
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Mobile Number</Text>
                                    <View style={styles.inputContainer}>
                                        <Phone size={20} color={COLORS.textTertiary} />
                                        <TextInput
                                            ref={mobileRef}
                                            style={styles.input}
                                            placeholder="Enter mobile number"
                                            placeholderTextColor={COLORS.textTertiary}
                                            value={mobile}
                                            onChangeText={(text) => {
                                                const numericText = text.replace(/[^0-9]/g, '');
                                                if (numericText.length <= 10) {
                                                    setMobile(numericText);
                                                }
                                            }}
                                            maxLength={10}
                                            keyboardType="phone-pad"
                                            returnKeyType="next"
                                            onSubmitEditing={() => passwordRef.current?.focus()}
                                            blurOnSubmit={false}
                                        />
                                    </View>
                                </View>
                            </>
                        )}

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputContainer}>
                                <Lock size={20} color={COLORS.textTertiary} />
                                <TextInput
                                    ref={passwordRef}
                                    style={styles.input}
                                    placeholder={isLogin ? "Enter your password" : "Create a password"}
                                    placeholderTextColor={COLORS.textTertiary}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    returnKeyType="go"
                                    onSubmitEditing={handleAuth}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    {showPassword ? (
                                        <EyeOff size={20} color={COLORS.textTertiary} />
                                    ) : (
                                        <Eye size={20} color={COLORS.textTertiary} />
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>

                        {isLogin && (
                            <TouchableOpacity style={styles.forgotPass} onPress={() => {
                                setRecoveryStep(1);
                                setRecoveryIdentifier('');
                                setRecoveryOtp('');
                                setRecoveredCreds(null);
                                setShowForgotModal(true);
                            }}>
                                <Text style={styles.forgotPassText}>Forgot Password?</Text>
                            </TouchableOpacity>
                        )}

                        {!isLogin && (
                            <View style={{ gap: 10, marginVertical: 8 }}>
                                {/* Mandatory Consent */}
                                <View style={styles.termsContainer}>
                                    <TouchableOpacity 
                                        style={[styles.checkbox, { borderColor: agreeTerms ? COLORS.accent : COLORS.textTertiary, backgroundColor: agreeTerms ? COLORS.accent : 'transparent', marginTop: 2 }]}
                                        onPress={() => setAgreeTerms(!agreeTerms)}
                                        accessibilityRole="checkbox"
                                        accessibilityState={{ checked: agreeTerms }}
                                        accessibilityLabel="Mandatory Privacy and Terms Consent"
                                    >
                                        {agreeTerms && <Text style={styles.checkmark}>✓</Text>}
                                    </TouchableOpacity>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ color: COLORS.textPrimary, fontSize: 12.5, fontWeight: '700' }}>
                                            * Mandatory Privacy & Terms Consent
                                        </Text>
                                        <Text style={{ color: COLORS.textSecondary, fontSize: 12, lineHeight: 17, marginTop: 2 }}>
                                            By checking this box, I explicitly consent to Sheriyakam collecting my phone number, name, and live GPS location solely to match and route electrical technicians to my address.
                                        </Text>
                                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginTop: 2 }}>
                                            <Text style={{ color: COLORS.textTertiary, fontSize: 12 }}>Read our </Text>
                                            <TouchableOpacity onPress={() => router.push('/terms')}>
                                                <Text style={{ color: COLORS.accent, fontSize: 12, fontWeight: '700' }}>Terms of Service</Text>
                                            </TouchableOpacity>
                                            <Text style={{ color: COLORS.textTertiary, fontSize: 12 }}> and </Text>
                                            <TouchableOpacity onPress={() => router.push('/privacy')}>
                                                <Text style={{ color: COLORS.accent, fontSize: 12, fontWeight: '700' }}>Privacy Policy</Text>
                                            </TouchableOpacity>
                                            <Text style={{ color: COLORS.textTertiary, fontSize: 12 }}>.</Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Optional Communication Consent */}
                                <View style={styles.termsContainer}>
                                    <TouchableOpacity 
                                        style={[styles.checkbox, { borderColor: agreeMarketing ? COLORS.accent : COLORS.textTertiary, backgroundColor: agreeMarketing ? COLORS.accent : 'transparent', marginTop: 2 }]}
                                        onPress={() => setAgreeMarketing(!agreeMarketing)}
                                        accessibilityRole="checkbox"
                                        accessibilityState={{ checked: agreeMarketing }}
                                        accessibilityLabel="Optional Communication Updates Consent"
                                    >
                                        {agreeMarketing && <Text style={styles.checkmark}>✓</Text>}
                                    </TouchableOpacity>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ color: COLORS.textPrimary, fontSize: 12.5, fontWeight: '700' }}>
                                            (Optional) Update Communication
                                        </Text>
                                        <Text style={{ color: COLORS.textSecondary, fontSize: 12, lineHeight: 17, marginTop: 2 }}>
                                            I agree to receive booking updates, service invoices, and technician details via WhatsApp and SMS messages.
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        )}

                        <TouchableOpacity
                            style={[
                                styles.loginBtn,
                                !isLogin && !agreeTerms && { opacity: 0.5 }
                            ]}
                            onPress={handleAuth}
                            disabled={isLoading || (!isLogin && !agreeTerms)}
                        >
                            <Text style={styles.loginBtnText}>
                                {isLoading ? 'Processing...' : (isLogin ? 'Log In' : 'Create Account')}
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.socialDivider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>Or continue with</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        <View style={styles.socialButtonsContainer}>
                            <TouchableOpacity style={[styles.socialBtn, { backgroundColor: '#4285F4', width: '80%', flexDirection: 'row', gap: 10, borderColor: '#4285F4', marginBottom: 12 }]} onPress={() => handleSocialLogin('Google')}>
                                <Svg width={24} height={24} viewBox="0 0 24 24">
                                    <Path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#fff"
                                    />
                                    <Path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <Path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <Path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </Svg>
                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Continue with Google</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.socialBtn, { backgroundColor: '#000000', width: '80%', flexDirection: 'row', gap: 10, borderColor: '#000000' }]} onPress={() => handleSocialLogin('Apple')}>
                                <Svg width={22} height={22} viewBox="0 0 24 24" fill="#fff">
                                    <Path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.63 1.35-.57.65-.97 1.7-0.85 2.72.99.08 2.01-.52 2.56-1.22z" />
                                </Svg>
                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Continue with Apple</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>
                                {isLogin ? "Don't have an account? " : "Already have an account? "}
                            </Text>
                            <TouchableOpacity onPress={toggleMode}>
                                <Text style={styles.linkText}>
                                    {isLogin ? 'Sign Up' : 'Log In'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            {/* Forgot Password Modal */}
            <Modal
                visible={showForgotModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowForgotModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Forgot Password</Text>
                            <TouchableOpacity onPress={() => setShowForgotModal(false)}>
                                <X size={24} color={COLORS.textPrimary} />
                            </TouchableOpacity>
                        </View>

                        {recoveryStep === 1 && (
                            <>
                                <Text style={styles.modalText}>
                                    Enter your registered email ID or mobile number to receive account credentials.
                                </Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email or Mobile"
                                    value={recoveryIdentifier}
                                    onChangeText={setRecoveryIdentifier}
                                    placeholderTextColor={COLORS.textTertiary}
                                    autoCapitalize="none"
                                />
                                <TouchableOpacity style={styles.actionBtn} onPress={handleForgotSubmit}>
                                    <Text style={styles.actionBtnText}>Send Recovery OTP</Text>
                                    <ArrowRight size={20} color="#000" />
                                </TouchableOpacity>
                            </>
                        )}

                        {recoveryStep === 2 && (
                            <>
                                <Text style={styles.modalText}>
                                    Enter the 4-digit OTP sent to {recoveryIdentifier}.
                                    {'\n'}It will auto-verify on the 4th digit.
                                </Text>
                                <TextInput
                                    style={[styles.input, { textAlign: 'center', letterSpacing: 4, fontWeight: 'bold', fontSize: 24 }]}
                                    placeholder="----"
                                    value={recoveryOtp}
                                    onChangeText={(text) => {
                                        const numeric = text.replace(/[^0-9]/g, '');
                                        if (numeric.length <= 4) {
                                            setRecoveryOtp(numeric);
                                            if (numeric.length === 4) {
                                                handleVerifyRecoveryOtp(numeric);
                                            }
                                        }
                                    }}
                                    keyboardType="numeric"
                                    placeholderTextColor={COLORS.textTertiary}
                                    maxLength={4}
                                />
                                {/* Optional button if user wants to click */}
                                <TouchableOpacity style={[styles.actionBtn, { opacity: 0.7 }]} onPress={() => handleVerifyRecoveryOtp()}>
                                    <Text style={styles.actionBtnText}>Verify OTP</Text>
                                </TouchableOpacity>
                            </>
                        )}
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
        flexGrow: 1,
        padding: SPACING.lg,
    },
    backBtn: {
        marginBottom: SPACING.lg,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logo: {
        width: 64,
        height: 64,
        borderRadius: 16,
        marginBottom: SPACING.md,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textSecondary,
    },
    form: {
        gap: 20,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        color: COLORS.textSecondary,
        fontSize: 14,
        marginLeft: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 56,
        gap: 12,
    },
    input: {
        flex: 1,
        color: COLORS.textPrimary,
        fontSize: 16,
        height: '100%',
    },
    forgotPass: {
        alignSelf: 'flex-end',
    },
    forgotPassText: {
        color: COLORS.accent,
        fontSize: 14,
    },
    loginBtn: {
        backgroundColor: COLORS.accent,
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    loginBtnText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    socialDivider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
        gap: 12,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.border,
    },
    dividerText: {
        color: COLORS.textTertiary,
        fontSize: 14,
    },
    socialButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginBottom: 8,
    },
    socialBtn: {
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        paddingHorizontal: 20,
    },
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
    actionBtn: {
        backgroundColor: COLORS.accent,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginTop: 8,
    },
    actionBtnText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
    },
    footerText: {
        color: COLORS.textSecondary,
        fontSize: 14,
    },
    linkText: {
        color: COLORS.accent,
        fontSize: 14,
        fontWeight: 'bold',
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginVertical: 12,
        paddingHorizontal: 4,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkmark: {
        color: '#000',
        fontSize: 12,
        fontWeight: 'bold',
    },
});
