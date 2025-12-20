import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView, Modal, Switch } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, User, Phone, X, ArrowRight } from 'lucide-react-native';
import { COLORS, SPACING } from '../../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { auth, isConfigured } from '../../config/firebaseConfig';
import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';

export default function AuthScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { login, register, recoverCredentials } = useAuth();

    // State to toggle between Login (true) and SignUp (false)
    const [isLogin, setIsLogin] = useState(true);

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

    const handleAuth = () => {
        // 1. Validation Logic
        if (!isLogin) {
            // SignUp Validation
            if (!name.trim()) {
                alert("Please enter your full name");
                return;
            }
            if (!validateEmail(email)) {
                alert("Please enter a valid email address");
                return;
            }
            if (!validatePhone(mobile)) {
                alert("Please enter a valid 10-digit mobile number");
                return;
            }
            if (password.length < 6) {
                alert("Password must be at least 6 characters long");
                return;
            }
        } else {
            // Login Validation
            if (!identifier.trim()) {
                alert("Please enter your email or mobile number");
                return;
            }
            // Basic check if it's potentially an email or phone (optional loose check)
            /* 
            if (!validateEmail(identifier) && !validatePhone(identifier)) {
                 // In login we might want to be more permissive or auto-detect
            } 
            */
            if (!password) {
                alert("Please enter your password");
                return;
            }
        }

        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            if (isLogin) {
                // Login Success
                login({ name: 'Demo User', email: identifier, mobile: '+919876543210' });
                router.replace('/');
            } else {
                // SignUp Success -> Switch to Login or Auto Login
                alert('Account created! Logging in...');
                login({ name: name, email: email, mobile: mobile });
                router.replace('/');
            }
        }, 1500);
    };

    const handleSocialLogin = async (provider) => {
        if (provider !== 'Google') {
            alert(`${provider} login coming soon!`);
            return;
        }

        // Check if Firebase is configured
        if (!isConfigured || !auth) {
            alert('Google Sign-In is not configured yet. Please check FIREBASE_SETUP.md for instructions.');
            return;
        }

        setIsLoading(true);
        try {
            const googleProvider = new GoogleAuthProvider();

            // For web, use popup. For native, you'd use redirect or native SDK
            let result;
            if (Platform.OS === 'web') {
                result = await signInWithPopup(auth, googleProvider);
            } else {
                // For mobile, redirect is better
                await signInWithRedirect(auth, googleProvider);
                return; // The page will reload after redirect
            }

            // Get user info from Google
            const user = result.user;
            const userData = {
                name: user.displayName || 'Google User',
                email: user.email,
                mobile: user.phoneNumber || '+91 98765 43210',
                photoURL: user.photoURL
            };

            login(userData);
            alert(`Welcome, ${userData.name}!`);
            router.replace('/');
        } catch (error) {
            console.error('Google Sign-In Error:', error);
            let errorMessage = 'Failed to sign in with Google';

            if (error.code === 'auth/popup-closed-by-user') {
                errorMessage = 'Sign-in cancelled';
            } else if (error.code === 'auth/popup-blocked') {
                errorMessage = 'Pop-up blocked. Please allow pop-ups for this site.';
            } else if (error.code === 'auth/network-request-failed') {
                errorMessage = 'Network error. Please check your connection.';
            }

            alert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Check for redirect result on component mount (for mobile)
    useEffect(() => {
        if (Platform.OS !== 'web') {
            getRedirectResult(auth)
                .then((result) => {
                    if (result) {
                        const user = result.user;
                        const userData = {
                            name: user.displayName || 'Google User',
                            email: user.email,
                            mobile: user.phoneNumber || '+91 98765 43210',
                            photoURL: user.photoURL
                        };
                        login(userData);
                        router.replace('/');
                    }
                })
                .catch((error) => {
                    console.error('Redirect result error:', error);
                });
        }
    }, []);

    const handleForgotSubmit = () => {
        if (!recoveryIdentifier) {
            alert("Please enter your Email or Mobile Number");
            return;
        }
        // Simulate OTP send
        setRecoveryStep(2);
        alert("OTP Sent! (Use 1234)");
    };

    const handleVerifyRecoveryOtp = (otpInput) => {
        const otpToCheck = otpInput || recoveryOtp;

        if (otpToCheck === '1234') {
            // Verify Logic
            const userParams = recoverCredentials(recoveryIdentifier);

            // Auto Login Feature
            setIsLoading(true);
            setTimeout(() => {
                setIsLoading(false);
                setShowForgotModal(false);

                // If user found, use their data, else use mock
                const userToLogin = userParams || {
                    name: 'Recovered User',
                    email: recoveryIdentifier,
                    mobile: '+919876543210'
                };

                login(userToLogin);
                alert("Verified! Logging you in...");
                router.replace('/');
            }, 800); // Small delay for effect

        } else if (otpToCheck.length === 4) {
            alert("Invalid OTP. Use '1234'");
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

                        <TouchableOpacity
                            style={styles.loginBtn}
                            onPress={handleAuth}
                            disabled={isLoading}
                        >
                            <Text style={styles.loginBtnText}>
                                {isLoading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.socialDivider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>Or continue with</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        <View style={styles.socialButtonsContainer}>
                            <TouchableOpacity style={[styles.socialBtn, { backgroundColor: '#4285F4', width: '80%', flexDirection: 'row', gap: 10, borderColor: '#4285F4' }]} onPress={() => handleSocialLogin('Google')}>
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
});
