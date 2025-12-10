import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView, Modal, Switch } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, User, Phone, X, ArrowRight } from 'lucide-react-native';
import { COLORS, SPACING } from '../../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

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

    const handleAuth = () => {
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

    const handleSocialLogin = (provider) => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            // Simulate getting user data from provider
            const mockUser = {
                name: `${provider} User`,
                email: `user@${provider.toLowerCase()}.com`,
                mobile: '+91 98765 43210'
            };
            login(mockUser);
            alert(`Successfully connected with ${provider}!`);
            router.replace('/');
        }, 1000);
    };

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
                            <TouchableOpacity style={[styles.socialBtn]} onPress={() => handleSocialLogin('Google')}>
                                <Svg width={24} height={24} viewBox="0 0 24 24">
                                    <Path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
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
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.socialBtn]} onPress={() => handleSocialLogin('Facebook')}>
                                <Svg width={24} height={24} viewBox="0 0 24 24">
                                    <Path
                                        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                                        fill="#1877F2"
                                    />
                                </Svg>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.socialBtn]} onPress={() => handleSocialLogin('Instagram')}>
                                <Svg width={24} height={24} viewBox="0 0 24 24">
                                    <Defs>
                                        <LinearGradient id="ig_grad" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
                                            <Stop offset="0" stopColor="#f09433" />
                                            <Stop offset="0.25" stopColor="#e6683c" />
                                            <Stop offset="0.5" stopColor="#dc2743" />
                                            <Stop offset="0.75" stopColor="#cc2366" />
                                            <Stop offset="1" stopColor="#bc1888" />
                                        </LinearGradient>
                                    </Defs>
                                    <Path
                                        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98.1.005.6.015 1.25.02.05.002.39.012 1.15.015 1.05.006 1.34.009 2.54.009 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0z"
                                        fill="url(#ig_grad)"
                                    />
                                    <Path
                                        d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
                                        fill="url(#ig_grad)"
                                    />
                                </Svg>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.socialBtn]} onPress={() => handleSocialLogin('Discord')}>
                                <Svg width={24} height={24} viewBox="0 0 24 24">
                                    <Path
                                        d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.7728-.6083 1.1588a18.3371 18.3371 0 00-5.4857.0099.0716.0716 0 00-.0638-.0358 19.8213 19.8213 0 00-4.8893 1.5126.0494.0494 0 00-.0226.0645c-2.6508 3.9622-3.3713 7.8286-3.007 11.6664.0041.0427.0424.081.084.1039a19.852 19.852 0 005.9926 3.0232.0742.0742 0 00.0792-.0273c.4593-.629.8664-1.2941 1.2139-1.9961a.0722.0722 0 00-.0403-.1026 12.8715 12.8715 0 01-1.8596-.8899.0709.0709 0 01-.0079-.1172c.1627-.121.3213-.2479.4735-.3795a.0664.0664 0 01.0711-.0067c3.922 1.7933 8.18 1.7933 12.0614 0a.0666.0666 0 01.0724.0067c.1534.133.3121.2612.476.3815a.0709.0709 0 01-.0071.1171 12.7538 12.7538 0 01-1.8647.8938.0722.0722 0 00-.041.1026c.3512.7057.7618 1.3735 1.223 2.0028a.0744.0744 0 00.0789.027 19.8375 19.8375 0 006.0025-3.0289.0746.0746 0 00.0827-.1022c.4276-4.545-1.127-8.312-3.02-11.6974a.0505.0505 0 00-.0221-.0645zm-11.166 9.6139c-1.3323 0-2.428-1.2255-2.428-2.7303 0-1.5048 1.0772-2.7303 2.428-2.7303 1.338 0 2.4419 1.2255 2.4279 2.7303-.014 1.5048-1.0898 2.7303-2.428 2.7303zm7.7126 0c-1.3324 0-2.428-1.2255-2.428-2.7303 0-1.5048 1.0772-2.7303 2.428-2.7303 1.338 0 2.442 1.2255 2.428 2.7303 0 1.5048-1.09 2.7303-2.428 2.7303z"
                                        fill="#5865F2"
                                    />
                                </Svg>
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
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
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
