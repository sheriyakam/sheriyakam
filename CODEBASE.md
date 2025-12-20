# Sheriyakam Codebase

Generated on: 2025-12-16T11:29:03.717Z


### app.json
```json
{
  "expo": {
    "name": "Sheriyakam",
    "slug": "sheriyakam-mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "newArchEnabled": true,
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "edgeToEdgeEnabled": true
    },
    "web": {
      "favicon": "./assets/favicon.png",
      "output": "single"
    },
    "plugins": [
      "expo-router",
      [
        "expo-image-picker",
        {
          "photosPermission": "The app accesses your photos to let you attach images to bookings.",
          "cameraPermission": "The app accesses your camera to let you take photos for bookings."
        }
      ],
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Allow Sheriyakam to access your location to find nearby electricians."
        }
      ]
    ]
  }
}
```

### package.json
```json
{
  "name": "sheriyakam",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "@react-native-async-storage/async-storage": "^2.2.0",
    "@react-native-community/datetimepicker": "8.4.4",
    "clsx": "^2.1.1",
    "expo": "~54.0.27",
    "expo-av": "~16.0.8",
    "expo-constants": "~18.0.11",
    "expo-image-picker": "^17.0.9",
    "expo-linking": "~8.0.10",
    "expo-location": "~19.0.8",
    "expo-router": "~6.0.17",
    "expo-status-bar": "~3.0.9",
    "lucide-react-native": "^0.556.0",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "react-native": "0.81.5",
    "react-native-maps": "1.20.1",
    "react-native-safe-area-context": "~5.6.0",
    "react-native-screens": "~4.16.0",
    "react-native-svg": "15.12.1",
    "react-native-web": "^0.21.0",
    "tailwind-merge": "^3.4.0"
  },
  "private": true,
  "devDependencies": {
    "babel-preset-expo": "^54.0.8"
  }
}

```

### babel.config.js
```javascript
module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [],
    };
};

```

### app/about.js
```javascript
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Globe, Mail, Phone, ExternalLink } from 'lucide-react-native';
import { COLORS, SPACING } from '../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../context/ThemeContext';

export default function AboutScreen() {
    const router = useRouter();
    const { theme } = useTheme();

    const handleLink = (url) => {
        // Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
        alert(`Opening ${url}`);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>About App</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Brand Hero */}
                <View style={styles.heroSection}>
                    <Image source={require('../assets/icon.png')} style={styles.logo} />
                    <View style={[
                        styles.nameWrapper,
                        theme === 'dark' && styles.nameWrapperDark
                    ]}>
                        <Text style={styles.appName}>
                            <Text style={{ color: '#001F3F' }}>Sheri</Text>
                            <Text style={{ color: '#2563EB' }}>yakam</Text>
                        </Text>
                    </View>
                    <Text style={styles.version}>Version 1.0.0 (Build 124)</Text>

                    <View style={styles.badgeContainer}>
                        <Text style={styles.badgeText}>Verified Service</Text>
                    </View>
                </View>

                {/* Description */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Our Mission</Text>
                    <Text style={styles.cardText}>
                        Sheriyakam is dedicated to providing the fastest and most reliable diverse electrical services in Kerala. From emergency repairs to complex wiring, we connect you with certified professionals instantly.
                    </Text>
                </View>

                {/* Operated By */}
                <View style={[styles.card, styles.highlightCard]}>
                    <Text style={styles.highlightTitle}>POWERED BY</Text>
                    <Text style={styles.empireText}>Empire Electricals</Text>
                    <Text style={styles.highlightSubText}>Since 1998</Text>
                </View>

                {/* Contact */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contact Us</Text>

                    <TouchableOpacity style={styles.contactRow} onPress={() => handleLink('tel:+919876543210')}>
                        <View style={styles.iconBox}>
                            <Phone size={20} color={COLORS.accent} />
                        </View>
                        <View>
                            <Text style={styles.contactLabel}>Customer Support</Text>
                            <Text style={styles.contactValue}>+91 98765 43210</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.contactRow} onPress={() => handleLink('mailto:support@sheriyakam.com')}>
                        <View style={styles.iconBox}>
                            <Mail size={20} color={COLORS.accent} />
                        </View>
                        <View>
                            <Text style={styles.contactLabel}>Email Us</Text>
                            <Text style={styles.contactValue}>support@sheriyakam.com</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.contactRow} onPress={() => handleLink('https://sheriyakam.com')}>
                        <View style={styles.iconBox}>
                            <Globe size={20} color={COLORS.accent} />
                        </View>
                        <View>
                            <Text style={styles.contactLabel}>Website</Text>
                            <Text style={styles.contactValue}>www.sheriyakam.com</Text>
                        </View>
                        <ExternalLink size={16} color={COLORS.textTertiary} style={{ marginLeft: 'auto' }} />
                    </TouchableOpacity>
                </View>

            </ScrollView>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    content: {
        padding: SPACING.lg,
        paddingTop: 0,
    },
    heroSection: {
        alignItems: 'center',
        marginVertical: SPACING.xl,
    },
    logo: {
        width: 80,
        height: 80,
        borderRadius: 20,
        marginBottom: SPACING.md,
    },
    appName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    version: {
        color: COLORS.textTertiary,
        fontSize: 14,
        marginBottom: 16,
    },
    badgeContainer: {
        backgroundColor: 'rgba(41, 182, 246, 0.1)', // blue tint
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(41, 182, 246, 0.3)',
    },
    badgeText: {
        color: COLORS.accent,
        fontSize: 12,
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 16,
        padding: 20,
        marginBottom: SPACING.lg,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 8,
    },
    cardText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        lineHeight: 22,
    },
    highlightCard: {
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.accent,
        backgroundColor: 'rgba(255, 215, 0, 0.05)', // Gold tint
    },
    highlightTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.textTertiary,
        letterSpacing: 2,
        marginBottom: 8,
    },
    empireText: {
        fontSize: 24,
        fontWeight: '900',
        color: COLORS.accent,
        textTransform: 'uppercase',
        marginBottom: 4,
        textAlign: 'center',
    },
    highlightSubText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        fontStyle: 'italic',
    },
    section: {
        marginTop: SPACING.md,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: SPACING.md,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 12,
        marginBottom: 12,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    contactLabel: {
        fontSize: 12,
        color: COLORS.textTertiary,
        marginBottom: 2,
    },
    contactValue: {
        fontSize: 16,
        color: COLORS.textPrimary,
        fontWeight: '500',
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
});

```

### app/auth/login.js
```javascript
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

```

### app/bookings.js
```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Clock, MapPin, Search, CreditCard } from 'lucide-react-native';
import { COLORS, SPACING } from '../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

import RescheduleModal from '../components/RescheduleModal';
import ReviewModal from '../components/ReviewModal';
import CancelModal from '../components/CancelModal';
import PaymentModal from '../components/PaymentModal';

import { getBookings, bookingEvents, payBooking } from '../constants/bookingStore';

export default function BookingsScreen() {
    const router = useRouter();
    const [bookings, setBookings] = useState(getBookings());
    const [activeTab, setActiveTab] = useState('Upcoming');

    // Modals
    const [rescheduleBooking, setRescheduleBooking] = useState(null);
    const [cancelBooking, setCancelBooking] = useState(null);
    const [reviewBooking, setReviewBooking] = useState(null);
    const [paymentBooking, setPaymentBooking] = useState(null);

    // Sync with store
    useEffect(() => {
        const updateBookings = () => setBookings([...getBookings()]);
        bookingEvents.on('change', updateBookings);
        return () => bookingEvents.off('change', updateBookings);
    }, []);

    // Live Time Check Logic
    const getFilteredBookings = () => {
        const now = new Date();
        const currentHour = now.getHours();

        return bookings.filter(b => {
            // Status mapping for tabs
            // 'Upcoming' includes 'open', 'accepted'
            // 'Completed' includes 'completed'
            // 'Cancelled' includes 'Cancelled'

            let tabMatch = false;
            if (activeTab === 'Upcoming') tabMatch = (b.status === 'open' || b.status === 'accepted');
            else if (activeTab === 'Completed') tabMatch = (b.status === 'completed');
            else if (activeTab === 'Cancelled') tabMatch = (b.status === 'Cancelled');

            if (!tabMatch) return false;

            // Time filtering for 'Today' bookings
            if (activeTab === 'Upcoming' && b.date === 'Today') {
                if (b.time === 'Morning' && currentHour >= 12) return false;
                if (b.time === 'Afternoon' && currentHour >= 17) return false;
            }

            return true;
        });
    };

    const filteredBookings = getFilteredBookings();

    const handleCancelBooking = (reason) => {
        if (!cancelBooking) return;
        // In real app, call cancelBooking(id) from store
        // For now, local update logic is handled by store events if we implemented cancel in store
        // Let's assume store handles it, or just log it
        console.log(`Cancelling booking ${cancelBooking.id}`);
        setCancelBooking(null);
    };

    const handlePayment = (method) => {
        if (paymentBooking) {
            payBooking(paymentBooking.id, method);
            setPaymentBooking(null);
            Alert.alert("Success", "Payment Successful!");
        }
    };

    const BookingCard = ({ booking }) => {
        const getStatusColor = (status) => {
            switch (status) {
                case 'open':
                case 'accepted': return COLORS.accent;
                case 'completed': return COLORS.success;
                case 'Cancelled': return COLORS.danger;
                default: return COLORS.textSecondary;
            }
        };

        const displayStatus = booking.status === 'open' ? 'Requested' :
            booking.status === 'accepted' ? 'Accepted' :
                booking.status.charAt(0).toUpperCase() + booking.status.slice(1);

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.serviceName}>{booking.service}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) + '20' }]}>
                        <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
                            {displayStatus}
                        </Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.cardDetailRow}>
                    <View style={styles.detailItem}>
                        <Calendar size={14} color={COLORS.textTertiary} />
                        <Text style={styles.detailText}>{booking.date}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Clock size={14} color={COLORS.textTertiary} />
                        <Text style={styles.detailText}>{booking.time}</Text>
                    </View>
                </View>

                <View style={styles.locationRow}>
                    <MapPin size={14} color={COLORS.textTertiary} />
                    <Text style={styles.detailText}>{booking.address}</Text>
                </View>

                {/* OTP Display for Active Jobs */}
                {(booking.status === 'open' || booking.status === 'accepted') && booking.otp && (
                    <View style={styles.otpContainer}>
                        <Text style={styles.otpLabel}>Share OTP with Partner:</Text>
                        <Text style={styles.otpValue}>{booking.otp}</Text>
                    </View>
                )}

                <View style={styles.cardFooter}>
                    <View>
                        <Text style={styles.priceLabel}>Total Amount</Text>
                        <Text style={styles.priceValue}>₹{booking.finalPrice || booking.price}</Text>
                        {booking.paymentStatus === 'paid' && <Text style={{ color: COLORS.success, fontSize: 10, fontWeight: 'bold' }}>PAID</Text>}
                    </View>

                    {/* Actions */}
                    {(booking.status === 'open' || booking.status === 'accepted') && (
                        <View style={styles.actionButtons}>
                            <TouchableOpacity
                                style={styles.cancelBtn}
                                onPress={() => setCancelBooking(booking)}
                            >
                                <Text style={styles.cancelBtnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.rescheduleBtn}
                                onPress={() => setRescheduleBooking(booking)}
                            >
                                <Text style={styles.rescheduleBtnText}>Reschedule</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Pay Button for Completed Jobs */}
                    {booking.status === 'completed' && booking.paymentStatus !== 'paid' && (
                        <TouchableOpacity
                            style={styles.payBtn}
                            onPress={() => setPaymentBooking(booking)}
                        >
                            <CreditCard size={14} color="#000" />
                            <Text style={styles.payBtnText}>Pay Now</Text>
                        </TouchableOpacity>
                    )}

                    {booking.status === 'completed' && booking.paymentStatus === 'paid' && (
                        <TouchableOpacity
                            style={styles.reviewBtn}
                            onPress={() => setReviewBooking(booking)}
                        >
                            <Text style={styles.reviewBtnText}>Write Review</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };

    const TabButton = ({ title }) => (
        <TouchableOpacity
            style={[styles.tabBtn, activeTab === title && styles.activeTabBtn]}
            onPress={() => setActiveTab(title)}
        >
            <Text style={[styles.tabText, activeTab === title && styles.activeTabText]}>{title}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Bookings</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.tabsContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
                    <TabButton title="Upcoming" />
                    <TabButton title="Completed" />
                    <TabButton title="Cancelled" />
                </ScrollView>
            </View>

            <FlatList
                data={filteredBookings}
                renderItem={({ item }) => <BookingCard booking={item} />}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Search size={48} color={COLORS.textTertiary} />
                        <Text style={styles.emptyText}>No {activeTab.toLowerCase()} bookings found</Text>
                    </View>
                }
            />

            <RescheduleModal
                booking={rescheduleBooking}
                visible={!!rescheduleBooking}
                onClose={() => setRescheduleBooking(null)}
                onConfirm={() => setRescheduleBooking(null)}
            />

            <ReviewModal
                booking={reviewBooking}
                visible={!!reviewBooking}
                onClose={() => setReviewBooking(null)}
                onSubmit={(reviewData) => console.log("Review Submitted:", reviewData)}
            />

            <CancelModal
                visible={!!cancelBooking}
                onClose={() => setCancelBooking(null)}
                onSubmit={handleCancelBooking}
            />

            <PaymentModal
                visible={!!paymentBooking}
                amount={paymentBooking?.finalPrice || 0}
                onClose={() => setPaymentBooking(null)}
                onPaymentComplete={handlePayment}
            />
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
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    tabsContainer: {
        marginBottom: SPACING.md,
    },
    tabsScroll: {
        paddingHorizontal: SPACING.md,
        gap: 12,
    },
    tabBtn: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    activeTabBtn: {
        backgroundColor: COLORS.accent,
        borderColor: COLORS.accent,
    },
    tabText: {
        color: COLORS.textSecondary,
        fontWeight: '500',
    },
    activeTabText: {
        color: '#000',
        fontWeight: 'bold',
    },
    listContent: {
        padding: SPACING.md,
        paddingTop: 0,
        gap: 16,
    },
    card: {
        backgroundColor: '#18181b', // Slightly lighter than bg
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 16,
        padding: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    serviceName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        flex: 1,
        marginRight: 8,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginBottom: 12,
    },
    cardDetailRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 8,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    detailText: {
        color: COLORS.textSecondary,
        fontSize: 14,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 16,
    },
    otpContainer: {
        marginBottom: 16,
        backgroundColor: 'rgba(234, 179, 8, 0.1)',
        padding: 8,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: COLORS.gold
    },
    otpLabel: {
        color: COLORS.gold,
        fontWeight: 'bold',
        fontSize: 12
    },
    otpValue: {
        color: COLORS.gold,
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 2
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.03)',
        marginHorizontal: -16,
        marginBottom: -16,
        padding: 16,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
    },
    priceLabel: {
        color: COLORS.textSecondary,
        fontSize: 14,
    },
    priceValue: {
        color: COLORS.accent,
        fontSize: 18,
        fontWeight: 'bold',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 48,
    },
    emptyText: {
        color: COLORS.textTertiary,
        marginTop: 16,
        fontSize: 16,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    rescheduleBtn: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: 'rgba(59, 130, 246, 0.15)', // Blue tint
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#3b82f6',
    },
    rescheduleBtnText: {
        color: '#3b82f6',
        fontWeight: 'bold',
        fontSize: 14,
    },
    cancelBtn: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: 'rgba(239, 68, 68, 0.15)', // Red tint
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.danger,
    },
    cancelBtnText: {
        color: COLORS.danger,
        fontWeight: 'bold',
        fontSize: 14,
    },
    reviewBtn: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: 'rgba(234, 179, 8, 0.15)', // Gold/Yellow tint
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.gold,
    },
    reviewBtnText: {
        color: COLORS.gold,
        fontWeight: 'bold',
        fontSize: 14,
    },
    payBtn: {
        backgroundColor: COLORS.accent,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    payBtnText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 14
    }
});

```

### app/index.js
```javascript
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, StatusBar, Dimensions, Image, TouchableOpacity, Alert, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Zap, MapPin, Menu as MenuIcon, ChevronDown } from 'lucide-react-native';
import * as Location from 'expo-location';
import { SPACING } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import ServiceCard from '../components/ServiceCard';
import BookingModal from '../components/BookingModal';
import MenuModal from '../components/MenuModal';
import LocationModal from '../components/LocationModal';

const MOCK_SERVICES = [
  {
    id: 1,
    name: "Emergency Repair Specialist",
    rating: 4.8,
    specialty: "Emergency Repairs",
    distance: "1.2 km",
    time: "1 hr",
    price: 500,
    image: require('../assets/images/emergency.png')
  },
  {
    id: 2,
    name: "Professional Wiring Expert",
    rating: 4.5,
    specialty: "Wiring & Installation",
    distance: "3.0 km",
    time: "1 hr",
    price: 450,
    image: require('../assets/images/wiring.png')
  },
  {
    id: 3,
    name: "Inverter Technician",
    rating: 5.0,
    specialty: "Inverter & UPS",
    distance: "0.8 km",
    time: "1 hr",
    price: 500,
    image: require('../assets/images/inverter.png')
  },
  {
    id: 4,
    name: "AC Service Expert",
    rating: 4.2,
    specialty: "Air Conditioning",
    distance: "5.0 km",
    time: "1 hr",
    price: 550,
    image: require('../assets/images/ac.png')
  },
  {
    id: 5,
    name: "Switch / Fuse Replacement",
    rating: 4.7,
    specialty: "Electrical Maintenance",
    distance: "2.1 km",
    time: "1 hr",
    price: 350,
    image: require('../assets/images/switch.png')
  },
  {
    id: 6,
    name: "Light / Fan Installation",
    rating: 4.6,
    specialty: "Installation Services",
    distance: "4.2 km",
    time: "1 hr",
    price: 400,
    image: require('../assets/images/light_fan.png')
  },
  {
    id: 7,
    name: "CCTV Technician",
    rating: 4.9,
    specialty: "Security Systems",
    distance: "2.5 km",
    time: "1 hr",
    price: 550,
    image: require('../assets/images/cctv.png')
  },
  {
    id: 8,
    name: "Home Automation",
    rating: 4.8,
    specialty: "Smart Home Setup",
    distance: "1.5 km",
    time: "1 hr",
    price: 1500,
    image: require('../assets/images/automation.png')
  },
];

export default function HomeScreen() {
  const [selectedService, setSelectedService] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [locationVisible, setLocationVisible] = useState(false);
  const [locationName, setLocationName] = useState('Calicut, Kerala');
  const [locationCoords, setLocationCoords] = useState(null);

  const { colors, theme } = useTheme();

  // Animation Refs
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(-20)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start Header and Content Animations
    Animated.stagger(200, [
      Animated.parallel([
        Animated.timing(headerOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(headerTranslateY, {
          toValue: 0,
          friction: 6,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(contentTranslateY, {
          toValue: 0,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Loop Pulse Animation for Emergency
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        // Permission denied, stick to default
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setLocationCoords(location.coords); // Store coordinates
        let address = await Location.reverseGeocodeAsync(location.coords);

        if (address && address.length > 0) {
          const { city, district, region, name, street } = address[0];
          // Construct a readable string: e.g., "Calicut, Kerala" or "Street, City"
          // city is often null on Android, district or region might be better
          const mainLoc = city || district || name;
          const subLoc = region || '';

          if (mainLoc) {
            setLocationName(subLoc ? `${mainLoc}, ${subLoc}` : mainLoc);
          }
        }
      } catch (error) {
        console.log("Error fetching location:", error);
      }
    })();
  }, []);

  const emergencyService = MOCK_SERVICES.find(s => s.name.includes('Emergency'));
  const otherServices = MOCK_SERVICES.filter(s => !s.name.includes('Emergency'));

  // Inline styles that depend on theme
  const dynamicStyles = {
    container: {
      backgroundColor: colors.bgPrimary,
    },
    appName: {
      color: colors.textPrimary,
    },
    headerTitle: {
      color: colors.textPrimary,
    },
    headerSubtitle: {
      color: colors.textPrimary,
    },
    headerLocationBtn: {
      backgroundColor: colors.bgSecondary,
      borderColor: colors.border,
    },
    headerLocationText: {
      color: colors.textPrimary,
    },
    sectionTitle: {
      color: colors.textPrimary,
    },
  };

  return (
    <SafeAreaView style={[styles.container, dynamicStyles.container]}>
      <StatusBar barStyle={theme === 'dark' ? "light-content" : "dark-content"} backgroundColor={colors.bgPrimary} />

      {/* Sticky Top Bar */}
      <Animated.View style={[
        {
          paddingHorizontal: SPACING.md,
          paddingTop: SPACING.md,
          paddingBottom: SPACING.sm, // reduced bottom padding to keep it tight
          backgroundColor: colors.bgPrimary,
          zIndex: 100
        },
        { opacity: headerOpacity, transform: [{ translateY: headerTranslateY }] }
      ]}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.logoContainer} onPress={() => setMenuVisible(true)}>
            <Image
              source={require('../assets/icon.png')}
              style={styles.logo}
            />
            <View style={[
              styles.nameWrapper,
              theme === 'dark' && styles.nameWrapperDark
            ]}>
              <Text style={[styles.appName, dynamicStyles.appName]}>
                <Text style={{ color: '#001F3F', fontSize: 28, fontWeight: 'bold' }}>Sheri</Text>
                <Text style={{ color: '#2563EB', fontSize: 28, fontWeight: 'bold' }}>yakam</Text>
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.headerLocationBtn, dynamicStyles.headerLocationBtn]}
            onPress={() => setLocationVisible(true)}
          >
            <MapPin size={20} color={colors.accent} />
            <Text style={[styles.headerLocationText, dynamicStyles.headerLocationText]} numberOfLines={1}>{locationName}</Text>
            <ChevronDown size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Page Title (Scrollable) */}
        <Animated.View style={[
          { marginBottom: SPACING.lg },
          { opacity: headerOpacity, transform: [{ translateY: headerTranslateY }] }
        ]}>
          <View style={styles.titleContainer}>
            <Text style={[styles.headerTitle, dynamicStyles.headerTitle]}>Find expert</Text>
            <Text style={[styles.headerSubtitle, dynamicStyles.headerSubtitle]}>
              <Text style={{ color: colors.accent }}>electricians</Text> in Kerala
            </Text>
          </View>
        </Animated.View>

        {/* Animated Content Wrapper */}
        <Animated.View style={{
          opacity: contentOpacity,
          transform: [{ translateY: contentTranslateY }]
        }}>

          {/* Emergency Section */}
          {emergencyService && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Animated.View style={[
                  styles.iconBox,
                  { transform: [{ scale: pulseAnim }] }
                ]}>
                  <Zap size={16} color={colors.danger} fill={colors.danger} />
                </Animated.View>
                <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Emergency Booking</Text>
              </View>
              <ServiceCard
                {...emergencyService}
                fullWidth
                isEmergency
                onPress={() => setSelectedService(emergencyService)}
              />
            </View>
          )}

          {/* Services Heading */}
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle, { marginTop: SPACING.lg, marginBottom: SPACING.md }]}>Services</Text>

          {/* Service Grid */}
          <View style={styles.grid}>
            {otherServices.map(service => (
              <ServiceCard
                key={service.id}
                {...service}
                onPress={() => setSelectedService(service)}
              />
            ))}
          </View>

        </Animated.View>

      </ScrollView>

      {/* Booking Modal */}
      <BookingModal
        service={selectedService}
        visible={!!selectedService}
        onClose={() => setSelectedService(null)}
      />

      {/* Location Selection Modal */}
      <LocationModal
        visible={locationVisible}
        onClose={() => setLocationVisible(false)}
        onLocationSelect={(loc) => setLocationName(loc)}
        currentLocation={locationCoords}
      />

      {/* Side Menu */}
      <MenuModal
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: REMOVED dynamic
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    // paddingTop is handled by content spacing now
  },
  header: {
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginBottom: SPACING.lg, // Removed as it is now in sticky header
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    // color: dynamic
  },
  titleContainer: {
    marginBottom: SPACING.sm,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    // color: dynamic
  },
  headerSubtitle: {
    fontSize: 28,
    fontWeight: 'bold',
    // color: dynamic
  },
  headerLocationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: dynamic
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    borderWidth: 1,
    // borderColor: dynamic
    maxWidth: '50%',
  },
  headerLocationText: {
    // color: dynamic
    fontSize: 14,
    fontWeight: '500',
    flexShrink: 1,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.md,
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    // color: dynamic
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  nameWrapper: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 8,
  },
  nameWrapperDark: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});

```

### app/partner/auth.js
```javascript
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

```

### app/partner/chat.js
```javascript
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS, SPACING } from '../../constants/theme';
import { Send, ArrowLeft, Phone, User as UserIcon, Users } from 'lucide-react-native';
import { getCurrentPartner, getSupervisorForPartner } from '../../constants/partnerStore';

export default function PartnerChat() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { type, name, subtitle } = params;

    const currentPartner = getCurrentPartner();
    const supervisor = getSupervisorForPartner(currentPartner);

    const chatTitle = name || supervisor.name;
    const chatSubtitle = subtitle || `Supervisor - ${supervisor.taluk}`;
    const chatType = type || 'supervisor';

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const flatListRef = useRef(null);

    useEffect(() => {
        if (chatType === 'community') {
            setMessages([
                { id: '1', text: 'Has anyone seen the new pricing update?', sender: 'other', senderName: 'Rahul (Electrician)', time: '09:00 AM' },
                { id: '2', text: 'Yes, it looks good. Better rates for AC work.', sender: 'other', senderName: 'Arun (AC)', time: '09:15 AM' },
                { id: '3', text: 'Anyone available for a quick job near Beach Road?', sender: 'other', senderName: 'Kiran (Plumber)', time: '09:30 AM' },
            ]);
        } else {
            setMessages([
                { id: '1', text: `Hello ${currentPartner?.name || 'Partner'}! I am your assigned supervisor for ${supervisor.taluk}. How can I assist you?`, sender: 'supervisor', time: '10:00 AM' },
            ]);
        }
    }, [chatType]);

    const handleSend = () => {
        if (message.trim()) {
            const newMessage = {
                id: Date.now().toString(),
                text: message,
                sender: 'me',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, newMessage]);
            setMessage('');

            setTimeout(() => {
                const reply = chatType === 'community'
                    ? {
                        id: Date.now().toString(),
                        text: 'Thanks for the info!',
                        sender: 'other',
                        senderName: 'Vishnu (Tech)',
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }
                    : {
                        id: Date.now().toString(),
                        text: 'I have received your message. I will check the details and get back to you shortly.',
                        sender: 'supervisor',
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    };

                setMessages(prev => [...prev, reply]);
            }, 1000);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <View style={styles.avatarContainer}>
                    <View style={[styles.avatar, { backgroundColor: chatType === 'community' ? COLORS.accent : COLORS.primary }]}>
                        {chatType === 'community' ? <Users size={24} color="#fff" /> : <UserIcon size={24} color="#fff" />}
                    </View>
                </View>
                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle}>{chatTitle}</Text>
                    <Text style={styles.headerSubtitle}>{chatSubtitle}</Text>
                </View>
                {chatType === 'supervisor' && (
                    <TouchableOpacity style={styles.phoneBtn}>
                        <Phone size={24} color={COLORS.primary} />
                    </TouchableOpacity>
                )}
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={[
                        styles.messageWrapper,
                        item.sender === 'me' ? styles.myMessageWrapper : styles.theirMessageWrapper
                    ]}>
                        {chatType === 'community' && item.sender !== 'me' && (
                            <Text style={styles.senderName}>{item.senderName}</Text>
                        )}
                        <View style={[
                            styles.messageContainer,
                            item.sender === 'me' ? styles.myMessage : styles.theirMessage
                        ]}>
                            <Text style={[
                                styles.messageText,
                                item.sender === 'me' ? styles.myMessageText : styles.theirMessageText
                            ]}>{item.text}</Text>
                            <Text style={[
                                styles.timeText,
                                item.sender === 'me' ? styles.myTimeText : styles.theirTimeText
                            ]}>{item.time}</Text>
                        </View>
                    </View>
                )}
                contentContainerStyle={styles.chatContent}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={message}
                        onChangeText={setMessage}
                        placeholder={chatType === 'community' ? "Message community..." : "Message supervisor..."}
                        placeholderTextColor={COLORS.textTertiary}
                        multiline
                    />
                    <TouchableOpacity onPress={handleSend} style={styles.sendBtn} disabled={!message.trim()}>
                        <Send size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgPrimary,
    },
    header: {
        padding: SPACING.md,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.bgSecondary,
    },
    backBtn: {
        padding: 8,
        marginRight: 8,
    },
    avatarContainer: {
        marginRight: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerInfo: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    headerSubtitle: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    phoneBtn: {
        padding: 8,
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderRadius: 20,
    },
    chatContent: {
        padding: SPACING.md,
        paddingBottom: 20,
    },
    messageWrapper: {
        marginBottom: 12,
        maxWidth: '80%',
    },
    myMessageWrapper: {
        alignSelf: 'flex-end',
    },
    theirMessageWrapper: {
        alignSelf: 'flex-start',
    },
    senderName: {
        fontSize: 11,
        color: COLORS.textSecondary,
        marginBottom: 2,
        marginLeft: 4,
    },
    messageContainer: {
        padding: 12,
        borderRadius: 16,
    },
    myMessage: {
        backgroundColor: COLORS.primary,
        borderBottomRightRadius: 2,
    },
    theirMessage: {
        backgroundColor: COLORS.bgSecondary,
        borderBottomLeftRadius: 2,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 20,
    },
    myMessageText: {
        color: '#fff',
    },
    theirMessageText: {
        color: COLORS.textPrimary,
    },
    timeText: {
        fontSize: 10,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    myTimeText: {
        color: 'rgba(255, 255, 255, 0.7)',
    },
    theirTimeText: {
        color: COLORS.textTertiary,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: SPACING.md,
        backgroundColor: COLORS.bgSecondary,
        borderTopWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'center',
        gap: 8,
    },
    input: {
        flex: 1,
        backgroundColor: COLORS.bgPrimary,
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 10,
        maxHeight: 100,
        color: COLORS.textPrimary,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    sendBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

```

### app/partner/index.js
```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Switch, ActivityIndicator, Linking, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS, SPACING } from '../../constants/theme';
import { MapPin, Clock, DollarSign, Calendar, ChevronRight, CheckCircle, MessageSquare, Phone, Navigation, User } from 'lucide-react-native';

import { getCurrentPartner, logoutPartner, togglePartnerAvailability } from '../../constants/partnerStore';

import { getBookings, bookingEvents, acceptBookingByPartner } from '../../constants/bookingStore';

const MOCK_REQUESTS = getBookings();

export default function PartnerDashboard() {
    const router = useRouter();
    const currentPartner = getCurrentPartner();
    const [activeTab, setActiveTab] = useState('new'); // 'new' | 'my'
    const [myJobs, setMyJobs] = useState([]);
    const [isAvailable, setIsAvailable] = useState(currentPartner?.isAvailable ?? true);

    const handleToggle = () => {
        const newState = togglePartnerAvailability();
        setIsAvailable(newState);
    };

    const refreshData = () => {
        const allBookings = getBookings();

        // Filter Open Jobs logic
        const openJobs = allBookings.filter(job =>
            job.status === 'open' &&
            currentPartner?.serviceTypes?.includes(job.serviceType) &&
            parseFloat(job.distance) <= (currentPartner?.location?.radius || 10)
        );
        setAvailableJobs(openJobs);

        // Filter My Jobs logic
        const myJobsList = allBookings.filter(job =>
            (job.status === 'accepted' || job.status === 'completed') &&
            (job.partnerName === currentPartner?.name) // Ensure we claim the job in store
        );
        setMyJobs(myJobsList);
    };

    const [availableJobs, setAvailableJobs] = useState([]);

    useEffect(() => {
        refreshData();
        bookingEvents.on('change', refreshData);
        return () => bookingEvents.off('change', refreshData);
    }, [currentPartner]);

    if (!currentPartner) {
        // Redirect to login if accessed directly without session (simple protection)
        // In a real app we'd use a layout/context guard
        setTimeout(() => router.replace('/partner/auth'), 0);
        return <View style={styles.container}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
    }

    const handleLogout = () => {
        logoutPartner();
        router.replace('/partner/auth');
    };

    const acceptJob = (job) => {
        Alert.alert(
            'Accept Job',
            `Are you sure you want to accept the service for ${job.customerName}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Accept',
                    onPress: () => {
                        console.log('Accepting job:', job.id);
                        const success = acceptBookingByPartner(job.id, currentPartner.name);
                        if (success) {
                            Alert.alert('Success', 'Job accepted! You can now contact the customer.');
                            // Store event will trigger refreshData
                        } else {
                            Alert.alert('Error', 'Could not accept job. It may have been taken.');
                        }
                    }
                }
            ]
        );
    };

    const openMap = (address) => {
        const query = encodeURIComponent(address);
        const url = Platform.select({
            ios: `maps:0,0?q=${query}`,
            android: `geo:0,0?q=${query}`,
            web: `https://www.google.com/maps/search/?api=1&query=${query}`
        });

        Linking.openURL(url).catch(err => {
            console.error("Error opening map:", err);
            Alert.alert("Error", "Could not open map.");
        });
    };

    const renderJobItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View>
                    <Text style={styles.serviceTitle}>{item.service}</Text>
                    <Text style={styles.customerName}>{item.customerName}</Text>
                </View>
                <View style={styles.priceTag}>
                    <Text style={styles.priceText}>₹{item.price}</Text>
                </View>
            </View>

            <View style={styles.cardBody}>
                <View style={styles.infoRow}>
                    <MapPin size={16} color={COLORS.textSecondary} />
                    <Text style={styles.infoText}>{item.address}</Text>
                </View>
                <View style={styles.infoRow}>
                    <MapPin size={16} color={COLORS.accent} />
                    <Text style={[styles.infoText, { color: COLORS.accent }]}>{item.distance} away</Text>
                </View>
                <View style={styles.infoRow}>
                    <Calendar size={16} color={COLORS.textSecondary} />
                    <Text style={styles.infoText}>{item.date}</Text>
                </View>

                {/* Contact & Navigation for Accepted Jobs */}
                {activeTab !== 'new' && (
                    <View style={styles.contactSection}>
                        <View style={styles.divider} />
                        <View style={styles.contactRow}>
                            <Phone size={18} color={COLORS.primary} />
                            <Text style={styles.contactText}>{item.customerPhone || 'No number'}</Text>
                            <TouchableOpacity style={styles.callBtn} onPress={() => Linking.openURL(`tel:${item.customerPhone}`)}>
                                <Text style={styles.callBtnText}>Call</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.navBtn} onPress={() => openMap(item.address)}>
                            <Navigation size={16} color="#fff" />
                            <Text style={styles.navBtnText}>Navigate to Location</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {activeTab === 'new' ? (
                <TouchableOpacity style={styles.acceptButton} onPress={() => acceptJob(item)}>
                    <Text style={styles.acceptButtonText}>Accept Job</Text>
                </TouchableOpacity>
            ) : (
                item.status === 'completed' ? (
                    <View style={[styles.statusButton, { backgroundColor: COLORS.success, opacity: 0.8 }]}>
                        <CheckCircle size={16} color="#fff" />
                        <Text style={styles.statusButtonText}>Completed</Text>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={styles.statusButton}
                        onPress={() => router.push({ pathname: `/partner/job/${item.id}`, params: item })}
                    >
                        <CheckCircle size={16} color="#fff" />
                        <Text style={styles.statusButtonText}>Mark Job Completed</Text>
                    </TouchableOpacity>
                )
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Welcome, {currentPartner?.name || 'Partner'}</Text>
                    <Text style={styles.subGreeting}>
                        {(currentPartner?.serviceTypes || []).join(', ')}
                    </Text>
                </View>
                <View style={styles.headerActions}>
                    <TouchableOpacity
                        onPress={() => router.push('/partner/profile')}
                        style={styles.actionBtn}
                    >
                        <User size={24} color={COLORS.textPrimary} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Availability Toggle Button */}
            <TouchableOpacity
                style={[
                    styles.availabilityBtn,
                    { backgroundColor: isAvailable ? COLORS.success : COLORS.danger }
                ]}
                onPress={handleToggle}
            >
                <Text style={styles.availabilityBtnText}>
                    {isAvailable ? 'I AM AVAILABLE' : 'I AM NOT AVAILABLE'}
                </Text>
            </TouchableOpacity>



            {/* Tabs */}
            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'new' && styles.activeTab]}
                    onPress={() => setActiveTab('new')}
                >
                    <Text style={[styles.tabText, activeTab === 'new' && styles.activeTabText]}>New Requests</Text>
                    {availableJobs.length > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{availableJobs.length}</Text></View>}
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'my' && styles.activeTab]}
                    onPress={() => setActiveTab('my')}
                >
                    <Text style={[styles.tabText, activeTab === 'my' && styles.activeTabText]}>My Jobs</Text>
                    {myJobs.length > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{myJobs.length}</Text></View>}
                </TouchableOpacity>
            </View>

            {/* List */}
            <FlatList
                data={activeTab === 'new' ? (isAvailable ? availableJobs : []) : myJobs}
                keyExtractor={item => item.id}
                renderItem={renderJobItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>
                            {!isAvailable && activeTab === 'new'
                                ? "You are currently offline. Go online to see requests."
                                : `No ${activeTab === 'new' ? 'new requests' : 'active jobs'} found.`}
                        </Text>
                    </View>
                }
            />
            {/* Floating Chat Button */}
            <TouchableOpacity
                style={styles.fabChat}
                onPress={() => router.push('/partner/messages')}
            >
                <MessageSquare size={24} color="#fff" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgPrimary,
    },
    header: {
        padding: SPACING.lg,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    subGreeting: {
        color: COLORS.textSecondary,
        fontSize: 14,
        fontWeight: '500',
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        gap: 6,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    logoutBtn: {
        padding: 8,
    },
    tabs: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.lg,
        borderBottomWidth: 1,
        borderColor: COLORS.border,
    },
    tab: {
        paddingVertical: SPACING.md,
        marginRight: SPACING.xl,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderColor: COLORS.primary,
    },
    tabText: {
        fontSize: 16,
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
    activeTabText: {
        color: COLORS.primary,
    },
    badge: {
        backgroundColor: COLORS.danger,
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    listContent: {
        padding: SPACING.lg,
    },
    card: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 12,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.sm,
    },
    serviceTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    customerName: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    priceTag: {
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    priceText: {
        color: COLORS.success,
        fontWeight: 'bold',
    },
    cardBody: {
        marginBottom: SPACING.md,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6,
    },
    infoText: {
        color: COLORS.textSecondary,
        fontSize: 14,
    },
    acceptButton: {
        backgroundColor: COLORS.primary,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    acceptButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    statusButton: {
        backgroundColor: COLORS.success,
        padding: 12,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    statusButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: COLORS.textTertiary,
    },
    availabilityBtn: {
        marginHorizontal: SPACING.lg,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    availabilityBtnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    actionBtn: {
        padding: 8,
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 8,
    },
    contactSection: {
        marginTop: SPACING.sm,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: SPACING.sm,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.sm,
        gap: 8,
    },
    contactText: {
        fontSize: 16,
        color: COLORS.textPrimary,
        fontWeight: 'bold',
        flex: 1,
    },
    callBtn: {
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    callBtnText: {
        color: COLORS.primary,
        fontWeight: 'bold',
        fontSize: 14,
    },
    navBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.accent,
        padding: 10,
        borderRadius: 8,
        gap: 8,
    },
    navBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    fabChat: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        backgroundColor: COLORS.primary,
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
});

```

### app/partner/job/[id].js
```javascript
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Platform, Dimensions, TextInput, Alert, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Phone, Navigation, ArrowLeft, Clock, Calendar, CheckCircle, Smartphone } from 'lucide-react-native';
import { COLORS, SPACING } from '../../../constants/theme';
import { completeBookingByPartner } from '../../../constants/bookingStore';
import JobMap from '../../../components/JobMap';

const { width } = Dimensions.get('window');

export default function JobDetails() {
    const params = useLocalSearchParams();
    const router = useRouter();

    const [otpModalVisible, setOtpModalVisible] = useState(false);
    const [otp, setOtp] = useState('');
    const [hours, setHours] = useState('1');
    const [loading, setLoading] = useState(false);

    const job = {
        id: params.id,
        customerName: params.customerName || params.customer,
        phone: params.customerPhone,
        service: params.service,
        address: params.address,
        price: params.price,
        date: params.date,
        distance: params.distance,
        // Mock coordinates for map
        latitude: params.latitude ? parseFloat(params.latitude) : 11.2588,
        longitude: params.longitude ? parseFloat(params.longitude) : 75.7804,
        status: params.status || 'accepted'
    };

    const handleCall = () => {
        if (job.phone) {
            Linking.openURL(`tel:${job.phone}`);
        } else {
            Alert.alert("Info", "Phone number not available");
        }
    };

    const handleDirections = () => {
        const query = encodeURIComponent(job.address);
        const url = Platform.select({
            ios: `maps:0,0?q=${query}`,
            android: `geo:0,0?q=${query}`,
            web: `https://www.google.com/maps/search/?api=1&query=${query}`
        });
        Linking.openURL(url);
    };

    const handleVerifyOtp = () => {
        if (otp.length < 4) {
            alert("Please enter a valid 4-digit OTP");
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setLoading(false);

            const result = completeBookingByPartner(job.id, otp, parseInt(hours) || 1);

            if (result.success) {
                setOtpModalVisible(false);
                Alert.alert("Success", "Job Marked as Completed! Customer has been notified for payment.", [
                    { text: "OK", onPress: () => router.replace('/partner') }
                ]);
            } else {
                alert(result.message || "Invalid OTP! Ask customer for the code.");
                setOtp('');
            }
        }, 1000);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Job Details</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Customer Card */}
                <View style={styles.card}>
                    <View style={styles.customerHeader}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {job.customerName ? job.customerName.charAt(0).toUpperCase() : 'C'}
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.customerName}>{job.customerName}</Text>
                            <Text style={styles.serviceName}>{job.service}</Text>
                        </View>
                        <View style={styles.statusBadge}>
                            <Text style={styles.statusText}>{job.status.toUpperCase()}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.detailRow}>
                        <Calendar size={16} color={COLORS.textSecondary} />
                        <Text style={styles.detailText}>{job.date || 'Today'}</Text>
                    </View>

                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
                            <Phone size={20} color={COLORS.primary} />
                            <Text style={styles.callBtnText}>Call Customer</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.directionBtn} onPress={handleDirections}>
                            <Navigation size={20} color="#fff" />
                            <Text style={styles.directionBtnText}>Get Directions</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Location & Map */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Location</Text>
                    <View style={styles.addressCard}>
                        <MapPin size={24} color={COLORS.accent} />
                        <Text style={styles.addressText}>{job.address}</Text>
                    </View>
                </View>

                <View style={styles.mapContainer}>
                    {Platform.OS === 'web' ? (
                        <TouchableOpacity style={styles.webMapPlaceholder} onPress={handleDirections}>
                            <MapPin size={40} color={COLORS.primary} />
                            <Text style={{ marginTop: 8, color: COLORS.textSecondary }}>Open in Google Maps</Text>
                        </TouchableOpacity>
                    ) : (
                        <JobMap latitude={job.latitude} longitude={job.longitude} />
                    )}
                </View>

                {/* Footer Buttons */}
                <View style={styles.footerActions}>
                    <TouchableOpacity
                        style={styles.completeBtn}
                        onPress={() => setOtpModalVisible(true)}
                    >
                        <CheckCircle size={20} color="#fff" />
                        <Text style={styles.completeBtnText}>Mark Job Completed</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* OTP Modal */}
            {otpModalVisible && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Complete Job</Text>
                        <Text style={styles.modalText}>
                            Enter working hours and OTP from customer to confirm completion.
                        </Text>

                        <View style={styles.otpInputContainer}>
                            <Text style={styles.otpLabel}>Hours Worked</Text>
                            <TextInput
                                style={[styles.otpInput, { fontSize: 18, marginBottom: 16 }]}
                                value={hours}
                                onChangeText={setHours}
                                keyboardType="numeric"
                                placeholder="1"
                                placeholderTextColor={COLORS.textTertiary}
                            />

                            <Text style={styles.otpLabel}>Customer OTP (4-Digit)</Text>
                            <TextInput
                                style={styles.otpInput}
                                value={otp}
                                onChangeText={(t) => setOtp(t.replace(/[^0-9]/g, '').slice(0, 4))}
                                keyboardType="numeric"
                                placeholder="0000"
                                maxLength={4}
                                placeholderTextColor={COLORS.textTertiary}
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.verifyBtn, loading && { opacity: 0.7 }]}
                            onPress={handleVerifyOtp}
                            disabled={loading}
                        >
                            <Text style={styles.verifyBtnText}>
                                {loading ? 'Verifying...' : 'Verify & Complete'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.cancelModalBtn}
                            onPress={() => setOtpModalVisible(false)}
                            disabled={loading}
                        >
                            <Text style={styles.cancelModalText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
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
        justifyContent: 'space-between',
        padding: SPACING.lg,
        borderBottomWidth: 1,
        borderColor: COLORS.border,
    },
    backBtn: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    content: {
        padding: SPACING.lg,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 16,
        padding: SPACING.lg,
        marginBottom: SPACING.xl,
        borderWidth: 1,
        borderColor: COLORS.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    customerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: SPACING.md,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    customerName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    serviceName: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    statusBadge: {
        marginLeft: 'auto',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        color: COLORS.success,
        fontSize: 12,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: SPACING.md,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    detailText: {
        color: COLORS.textSecondary,
        fontSize: 14,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: SPACING.md,
    },
    callBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.primary,
        backgroundColor: 'transparent',
    },
    callBtnText: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    directionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        borderRadius: 10,
        backgroundColor: COLORS.primary,
    },
    directionBtnText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    section: {
        marginBottom: SPACING.xl,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: SPACING.md,
    },
    addressCard: {
        flexDirection: 'row',
        gap: 12,
        backgroundColor: COLORS.bgSecondary,
        padding: SPACING.lg,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    addressText: {
        flex: 1,
        fontSize: 16,
        color: COLORS.textPrimary,
        lineHeight: 24,
    },
    mapContainer: {
        height: 200,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: SPACING.xl,
    },
    webMapPlaceholder: {
        height: 150,
        backgroundColor: '#eee',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        marginBottom: SPACING.xl,
    },
    footerActions: {
        marginTop: SPACING.md,
    },
    completeBtn: {
        backgroundColor: COLORS.success,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16,
        borderRadius: 12,
        shadowColor: COLORS.success,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    completeBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContent: {
        backgroundColor: COLORS.bgSecondary,
        width: '100%',
        maxWidth: 400,
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 8,
        textAlign: 'center',
    },
    modalText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: 24,
    },
    otpInputContainer: {
        marginBottom: 24,
    },
    otpLabel: {
        color: COLORS.textSecondary,
        fontSize: 12,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
        textAlign: 'center',
    },
    otpInput: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        padding: 16,
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
        textAlign: 'center',
        letterSpacing: 2,
    },
    verifyBtn: {
        backgroundColor: COLORS.success,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
    },
    verifyBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    cancelModalBtn: {
        paddingVertical: 12,
        alignItems: 'center',
    },
    cancelModalText: {
        color: COLORS.textSecondary,
        fontSize: 14,
        fontWeight: '500',
    },
});

```

### app/partner/messages.js
```javascript
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS, SPACING } from '../../constants/theme';
import { ArrowLeft, User, Users, ChevronRight } from 'lucide-react-native';
import { getCurrentPartner, getSupervisorForPartner } from '../../constants/partnerStore';

export default function PartnerMessages() {
    const router = useRouter();
    const currentPartner = getCurrentPartner();
    const supervisor = getSupervisorForPartner(currentPartner);

    const conversations = [
        {
            id: 'supervisor',
            name: supervisor.name,
            role: `Supervisor - ${supervisor.taluk}`,
            type: 'supervisor',
            lastMessage: 'I have received your message.',
            time: '10:05 AM',
            icon: <User size={24} color="#fff" />,
            color: COLORS.primary
        },
        {
            id: 'community',
            name: 'Community',
            role: 'Community Group',
            type: 'community',
            lastMessage: 'Anyone available for a quick job near Beach Road?',
            time: '09:30 AM',
            icon: <Users size={24} color="#fff" />,
            color: COLORS.accent
        }
    ];

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.chatItem}
            onPress={() => router.push({
                pathname: '/partner/chat',
                params: { type: item.type, name: item.name, subtitle: item.role }
            })}
        >
            <View style={[styles.avatar, { backgroundColor: item.color }]}>
                {item.icon}
            </View>
            <View style={styles.chatInfo}>
                <View style={styles.chatHeader}>
                    <Text style={styles.chatName}>{item.name}</Text>
                    <Text style={styles.chatTime}>{item.time}</Text>
                </View>
                <Text style={styles.chatRole}>{item.role}</Text>
                <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
            </View>
            <ChevronRight size={20} color={COLORS.textTertiary} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Messages</Text>
            </View>

            <FlatList
                data={conversations}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgPrimary,
    },
    header: {
        padding: SPACING.lg,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.bgSecondary,
        gap: 12,
    },
    backBtn: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    listContent: {
        padding: SPACING.md,
    },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 12,
        marginBottom: SPACING.sm,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    chatInfo: {
        flex: 1,
        marginRight: 8,
    },
    chatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2,
    },
    chatName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF', // Force White
    },
    chatTime: {
        fontSize: 12,
        color: '#A1A1AA', // Force Light Grey
    },
    chatRole: {
        fontSize: 12,
        color: '#3B82F6', // Force Blue
        fontWeight: '500',
        marginBottom: 2,
    },
    lastMessage: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
});

```

### app/partner/profile.js
```javascript
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, User, Phone, Mail, MapPin, Briefcase, Award, Calendar, ExternalLink, Power } from 'lucide-react-native';
import { COLORS, SPACING } from '../../constants/theme';
import { getCurrentPartner, logoutPartner } from '../../constants/partnerStore';

export default function PartnerProfile() {
    const router = useRouter();
    const partner = getCurrentPartner();

    if (!partner) {
        router.replace('/partner/auth');
        return null;
    }

    const handleLogout = () => {
        logoutPartner();
        router.replace('/partner/auth');
    };

    const InfoRow = ({ icon, label, value }) => (
        <View style={styles.infoRow}>
            <View style={styles.iconBox}>
                {icon}
            </View>
            <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={styles.infoValue}>{value}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Profile</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Profile Header */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <User size={48} color="#fff" />
                    </View>
                    <Text style={styles.name}>{partner.name}</Text>
                    <Text style={styles.roles}>{(partner.serviceTypes || []).join(' • ')}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: partner.isAvailable ? COLORS.success : COLORS.danger }]}>
                        <Text style={styles.statusText}>{partner.isAvailable ? 'Available' : 'Unavailable'}</Text>
                    </View>
                </View>

                {/* Info Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contact Info</Text>
                    <InfoRow
                        icon={<Phone size={20} color={COLORS.primary} />}
                        label="Phone Number"
                        value={partner.phone}
                    />
                    <InfoRow
                        icon={<Mail size={20} color={COLORS.primary} />}
                        label="Email Address"
                        value={partner.email}
                    />
                    <InfoRow
                        icon={<MapPin size={20} color={COLORS.primary} />}
                        label="Location"
                        value={partner.taluk || 'Not Set'}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Performance</Text>
                    <InfoRow
                        icon={<Award size={20} color={COLORS.gold} />}
                        label="Performance Score"
                        value={`${partner.performanceScore || 0}/100`}
                    />
                    <InfoRow
                        icon={<Calendar size={20} color={COLORS.primary} />}
                        label="Joined On"
                        value={partner.joinDate || 'N/A'}
                    />
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                    <Power size={20} color={COLORS.danger} />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>Version 1.0.0</Text>
            </ScrollView>
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
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        borderColor: COLORS.border,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    scrollContent: {
        padding: SPACING.lg,
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.md,
        borderWidth: 4,
        borderColor: COLORS.bgSecondary,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    roles: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 12,
    },
    statusBadge: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    section: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 12,
        padding: SPACING.md,
        marginBottom: SPACING.lg,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: SPACING.md,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
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
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        padding: 16,
        borderRadius: 12,
        marginTop: SPACING.sm,
    },
    logoutText: {
        color: COLORS.danger,
        fontSize: 16,
        fontWeight: 'bold',
    },
    versionText: {
        textAlign: 'center',
        color: COLORS.textTertiary,
        fontSize: 12,
        marginTop: SPACING.xl,
    }
});

```

### app/partner/_layout.js
```javascript
import { Stack } from 'expo-router';
import { COLORS } from '../../constants/theme';

export default function PartnerLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: COLORS.bgPrimary,
                },
                headerTintColor: COLORS.textPrimary,
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                headerShadowVisible: false,
                contentStyle: { backgroundColor: COLORS.bgPrimary },
            }}
        >
            <Stack.Screen name="auth" options={{ title: 'Partner Portal', headerShown: false }} />
            <Stack.Screen name="index" options={{ title: 'Partner Dashboard', headerShown: false }} />
        </Stack>
    );
}

```

### app/profile.js
```javascript
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

```

### app/_layout.js
```javascript
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { Stack } from 'expo-router';

import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Layout() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <SafeAreaProvider>
                    <StatusBar style="auto" />
                    <Stack screenOptions={{ headerShown: false }} />
                </SafeAreaProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

```

### components/BookingModal.js
```javascript
import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Image,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { X, CheckCircle, Calendar, Clock, Camera, Image as ImageIcon } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS, SPACING } from '../constants/theme';

const BookingModal = ({ service, visible, onClose }) => {
    const [step, setStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState('Today');
    const [customDate, setCustomDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState('Morning');
    const [selectedImage, setSelectedImage] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [date, setDate] = useState(new Date());

    // Helper to get slots
    const getAvailableSlots = (dateStr) => {
        const slotDefinitions = [
            { id: 'Morning', label: 'Morning', sub: '8 AM - 11 AM', endHour: 11 },
            { id: 'Afternoon', label: 'Afternoon', sub: '12 PM - 3 PM', endHour: 15 },
            { id: 'Evening', label: 'Evening', sub: '4 PM - 7 PM', endHour: 19 }
        ];

        if (dateStr !== 'Today') return slotDefinitions;

        const currentHour = new Date().getHours();
        return slotDefinitions.filter(slot => currentHour < slot.endHour);
    };

    // Reset state when modal opens
    React.useEffect(() => {
        if (visible) {
            setStep(1);

            const currentHour = new Date().getHours();
            // If after 7 PM (19), default to Tomorrow
            const initialDate = currentHour >= 19 ? 'Tomorrow' : 'Today';
            setSelectedDate(initialDate);

            // Auto-select first available slot
            const slots = getAvailableSlots(initialDate);
            if (slots.length > 0) {
                setSelectedSlot(slots[0].id);
            }

            setCustomDate('');
            setSelectedImage(null);
            setDate(new Date());
            setShowDatePicker(false);
        }
    }, [visible]);

    if (!service) return null;

    const isEmergency = service.name.toLowerCase().includes('emergency');

    // Determine available days
    const currentHour = new Date().getHours();
    const isTodayOver = currentHour >= 19; // 7 PM

    let availableDays = [];
    if (isEmergency) {
        availableDays = isTodayOver ? ['Tomorrow'] : ['Today'];
    } else {
        availableDays = isTodayOver ? ['Tomorrow', 'Pick Date'] : ['Today', 'Tomorrow', 'Pick Date'];
    }

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
            const formattedDate = selectedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
            setSelectedDate('Custom');
            setCustomDate(formattedDate);

            // Auto Select for Custom Date (All slots available)
            setSelectedSlot('Morning');
        }
    };

    const handleDaySelect = (day) => {
        setSelectedDate(day);
        setCustomDate('');

        // Auto select first slot
        const slots = getAvailableSlots(day);
        if (slots.length > 0) {
            setSelectedSlot(slots[0].id);
        }
    };

    const handleSubmit = () => {
        setStep(2); // Show success
    };

    const selectImage = async (useCamera) => {
        try {
            let result;
            if (useCamera) {
                const { status } = await ImagePicker.requestCameraPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission needed', 'Camera permission is required to take photos.');
                    return;
                }
                result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [4, 3],
                    quality: 0.8,
                });
            } else {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission needed', 'Gallery permission is required to select photos.');
                    return;
                }
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [4, 3],
                    quality: 0.8,
                });
            }

            if (!result.canceled) {
                setSelectedImage(result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    const handleImageMock = () => {
        if (Platform.OS === 'web') {
            selectImage(false);
            return;
        }

        Alert.alert(
            "Add Photo",
            "Choose an option",
            [
                {
                    text: "Camera",
                    onPress: () => selectImage(true)
                },
                {
                    text: "Gallery",
                    onPress: () => selectImage(false)
                },
                {
                    text: "Cancel",
                    style: "cancel"
                }
            ]
        );
    };

    const SelectionChip = ({ label, subLabel, selected, onClick, isDate = false }) => (
        <TouchableOpacity
            onPress={onClick}
            style={[
                styles.chip,
                selected ? styles.chipSelected : styles.chipUnselected,
                isDate && styles.chipDate
            ]}
        >
            <Text style={[styles.chipText, selected ? styles.chipTextSelected : styles.chipTextUnselected]}>
                {label}
            </Text>
            {subLabel && (
                <Text style={styles.chipSubLabel}>{subLabel}</Text>
            )}
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <View style={styles.container}>
                        {/* Close Button */}
                        <TouchableOpacity
                            onPress={onClose}
                            style={styles.closeBtn}
                        >
                            <X size={24} color={COLORS.textSecondary} />
                        </TouchableOpacity>

                        {step === 1 ? (
                            <View style={{ flexShrink: 1 }}>
                                <ScrollView
                                    contentContainerStyle={styles.content}
                                    showsVerticalScrollIndicator={false}
                                >
                                    <Text style={styles.title}>Book Service</Text>
                                    <Text style={styles.subtitle}>
                                        Requesting: <Text style={{ color: COLORS.accent }}>{service.name}</Text>
                                    </Text>

                                    {/* Date Selection */}
                                    <View style={styles.section}>
                                        <View style={styles.labelRow}>
                                            <Calendar size={16} color={COLORS.textTertiary} />
                                            <Text style={styles.label}>Schedule Day</Text>
                                        </View>
                                        <View style={styles.chipGroup}>
                                            {availableDays.map(day => {
                                                const isCustom = day === 'Pick Date';
                                                const isSelected = isCustom ? selectedDate === 'Custom' : selectedDate === day;
                                                const label = (isCustom && selectedDate === 'Custom') ? customDate : day;

                                                return (
                                                    <SelectionChip
                                                        key={day}
                                                        label={label}
                                                        selected={isSelected}
                                                        onClick={() => {
                                                            if (isCustom) {
                                                                setShowDatePicker(true);
                                                            } else {
                                                                handleDaySelect(day);
                                                            }
                                                        }}
                                                        isDate
                                                    />
                                                );
                                            })}
                                            {showDatePicker && (
                                                <DateTimePicker
                                                    value={date}
                                                    mode="date"
                                                    display="default"
                                                    onChange={onDateChange}
                                                    minimumDate={new Date()}
                                                />
                                            )}
                                        </View>
                                    </View>

                                    {/* Time Selection */}
                                    <View style={styles.section}>
                                        <View style={styles.labelRow}>
                                            <Clock size={16} color={COLORS.textTertiary} />
                                            <Text style={styles.label}>Preferred Time</Text>
                                        </View>
                                        <View style={styles.chipGroup}>
                                            {(() => {
                                                const slots = getAvailableSlots(selectedDate);

                                                if (slots.length === 0) {
                                                    return <Text style={{ color: COLORS.textTertiary, fontStyle: 'italic' }}>No slots available for Today. Please choose Tomorrow.</Text>;
                                                }

                                                return slots.map(slot => (
                                                    <SelectionChip
                                                        key={slot.id}
                                                        label={slot.label}
                                                        // subLabel removed as per request
                                                        selected={selectedSlot === slot.id}
                                                        onClick={() => setSelectedSlot(slot.id)}
                                                    />
                                                ));
                                            })()}
                                        </View>
                                    </View>

                                    {/* Issue Details */}
                                    <View style={styles.section}>
                                        <Text style={styles.label}>Issue Details</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Describe your issue..."
                                            placeholderTextColor={COLORS.textTertiary}
                                            multiline
                                            numberOfLines={3}
                                        />

                                        {!selectedImage ? (
                                            <TouchableOpacity
                                                onPress={handleImageMock}
                                                style={styles.uploadArea}
                                            >
                                                <Camera size={24} color={COLORS.textTertiary} />
                                                <Text style={styles.uploadText}>Add Photo</Text>
                                            </TouchableOpacity>
                                        ) : (
                                            <View style={styles.imagePreviewContainer}>
                                                <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
                                                <TouchableOpacity
                                                    onPress={() => setSelectedImage(null)}
                                                    style={styles.removeImageBtn}
                                                >
                                                    <X size={16} color="#fff" />
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    </View>

                                </ScrollView>
                                <View style={styles.footer}>
                                    <TouchableOpacity
                                        onPress={handleSubmit}
                                        style={styles.confirmBtn}
                                    >
                                        <Text style={styles.confirmBtnText}>Confirm Booking</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            // Success Screen
                            <View style={[styles.content, styles.successContent]}>
                                <CheckCircle size={64} color={COLORS.success} />
                                <Text style={styles.successTitle}>Booking Confirmed!</Text>
                                <Text style={styles.successText}>
                                    Technician arriving <Text style={{ color: COLORS.textPrimary, fontWeight: 'bold' }}>{selectedDate === 'Custom' ? customDate : selectedDate}</Text> in the <Text style={{ color: COLORS.textPrimary, fontWeight: 'bold' }}>{selectedSlot}</Text>.
                                </Text>

                                {selectedImage && (
                                    <View style={styles.imageTag}>
                                        <ImageIcon size={14} color={COLORS.accent} />
                                        <Text style={styles.imageTagText}>Image Attached</Text>
                                    </View>
                                )}

                                <Text style={styles.successSubText}>You will receive a call shortly.</Text>

                                <TouchableOpacity
                                    onPress={onClose}
                                    style={[styles.confirmBtn, styles.outlineBtn]}
                                >
                                    <Text style={[styles.confirmBtnText, { color: COLORS.textPrimary }]}>Done</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        padding: SPACING.md,
    },
    keyboardView: {
        width: '100%',
        alignItems: 'center',
    },
    container: {
        width: '100%',
        maxWidth: 500,
        alignSelf: 'center',
        backgroundColor: '#18181b',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: COLORS.border,
        overflow: 'hidden',
    },
    footer: {
        padding: SPACING.lg,
        paddingTop: 0,
        backgroundColor: '#18181b', // Ensure background consistency
    },
    closeBtn: {
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 10,
        padding: 4,
    },
    content: {
        padding: SPACING.lg,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 24,
    },
    section: {
        marginBottom: 24,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 8,
    },
    chipGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    chipSelected: {
        backgroundColor: COLORS.accent,
        borderColor: COLORS.accent,
    },
    chipUnselected: {
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    chipDate: {
        minWidth: 80,
        alignItems: 'center',
    },
    chipText: {
        fontWeight: '500',
        fontSize: 14,
    },
    chipTextSelected: {
        color: '#000',
        fontWeight: 'bold',
    },
    chipTextUnselected: {
        color: COLORS.textTertiary,
    },
    chipSubLabel: {
        fontSize: 10,
        color: COLORS.textTertiary, // Should ideally be handled if subLabel exists, but we removed it from usage
        marginTop: 2
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: 8,
        padding: 12,
        color: COLORS.textPrimary,
        textAlignVertical: 'top',
        marginBottom: 8,
    },
    uploadArea: {
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        borderStyle: 'dashed',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    uploadText: {
        color: COLORS.textTertiary,
        fontSize: 12,
    },
    imagePreviewContainer: {
        position: 'relative',
        height: 128,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    imagePreview: {
        width: '100%',
        height: '100%',
    },
    removeImageBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 12,
        padding: 4,
    },
    confirmBtn: {
        backgroundColor: COLORS.accent,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    confirmBtnText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
    },
    successContent: {
        alignItems: 'center',
        paddingVertical: 48,
    },
    successTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginTop: 16,
        marginBottom: 8,
    },
    successText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: 16,
    },
    successSubText: {
        fontSize: 14,
        color: COLORS.textTertiary,
        marginBottom: 24,
    },
    imageTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 4,
        backgroundColor: 'rgba(41, 182, 246, 0.1)',
        borderRadius: 16,
        marginBottom: 16,
    },
    imageTagText: {
        color: COLORS.accent,
        fontSize: 12,
    },
    outlineBtn: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: COLORS.border,
        width: '100%',
    },
});

export default BookingModal;

```

### components/CancelModal.js
```javascript
import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { X, Check } from 'lucide-react-native';
import { COLORS, SPACING } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

const { height } = Dimensions.get('window');

const CANCEL_REASONS = [
    "Changed my plans",
    "Found another professional",
    "Booked by mistake"
];

export default function CancelModal({ visible, onClose, onSubmit }) {
    const [selectedReason, setSelectedReason] = useState(null);
    const { colors } = useTheme();

    const handleSubmit = () => {
        if (selectedReason) {
            onSubmit(selectedReason);
            setSelectedReason(null); // Reset
        }
    };

    if (!visible) return null;

    const dynamicStyles = {
        popup: {
            backgroundColor: colors.bgSecondary,
            borderColor: colors.border,
        },
        title: {
            color: colors.textPrimary,
        },
        option: {
            backgroundColor: colors.bgPrimary,
            borderColor: colors.border,
        },
        selectedOption: {
            backgroundColor: colors.accent + '20', // transparent accent
            borderColor: colors.accent,
        },
        optionText: {
            color: colors.textPrimary,
        },
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={styles.backdrop} />
                </TouchableWithoutFeedback>

                <View style={[styles.popup, dynamicStyles.popup]}>
                    <View style={styles.header}>
                        <Text style={[styles.title, dynamicStyles.title]}>Cancel Booking</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <X size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        Please tell us why you are cancelling.
                    </Text>

                    <View style={styles.optionsContainer}>
                        {CANCEL_REASONS.map((reason, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.option,
                                    dynamicStyles.option,
                                    selectedReason === reason && dynamicStyles.selectedOption
                                ]}
                                onPress={() => setSelectedReason(reason)}
                            >
                                <Text style={[
                                    styles.optionText,
                                    dynamicStyles.optionText,
                                    selectedReason === reason && { color: colors.accent, fontWeight: 'bold' }
                                ]}>
                                    {reason}
                                </Text>
                                <View style={[
                                    styles.radioCircle,
                                    { borderColor: selectedReason === reason ? colors.accent : colors.textTertiary }
                                ]}>
                                    {selectedReason === reason && (
                                        <View style={[styles.radioInner, { backgroundColor: colors.accent }]} />
                                    )}
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.submitBtn,
                            !selectedReason && { backgroundColor: colors.bgTertiary, opacity: 0.5 }
                        ]}
                        onPress={handleSubmit}
                        disabled={!selectedReason}
                    >
                        <Text style={styles.submitBtnText}>Confirm Cancellation</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        padding: SPACING.lg,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    popup: {
        borderRadius: 20,
        padding: SPACING.lg,
        borderWidth: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 24,
    },
    closeBtn: {
        padding: 4,
    },
    optionsContainer: {
        gap: 12,
        marginBottom: 24,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
    },
    optionText: {
        fontSize: 16,
    },
    radioCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    submitBtn: {
        backgroundColor: COLORS.danger,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    submitBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

```

### components/JobMap.js
```javascript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { COLORS } from '../constants/theme';

export default function JobMap({ latitude, longitude, customer, service }) {
    return (
        <View style={styles.mapContainer}>
            <MapView
                style={styles.map}
                provider={PROVIDER_DEFAULT}
                initialRegion={{
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >
                <Marker
                    coordinate={{ latitude: latitude, longitude: longitude }}
                    title={customer}
                    description={service}
                />
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    mapContainer: {
        height: 200,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 24, // SPACING.xl
    },
    map: {
        width: '100%',
        height: '100%',
    },
});

```

### components/JobMap.web.js
```javascript
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Platform } from 'react-native';
import { COLORS } from '../constants/theme';

export default function JobMap({ latitude, longitude, customer, service, address }) {

    const handleDirections = () => {
        const query = encodeURIComponent(address || `${latitude},${longitude}`);
        const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
        Linking.openURL(url);
    };

    return (
        <TouchableOpacity style={styles.webMapPlaceholder} onPress={handleDirections}>
            <Text style={{ color: COLORS.accent }}>Open in Google Maps</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    webMapPlaceholder: {
        height: 150,
        backgroundColor: '#eee',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        marginBottom: 24, // SPACING.xl
    },
});

```

### components/LocationMap.js
```javascript
import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import MapView, { PROVIDER_DEFAULT } from 'react-native-maps';
import { MapPin, X, Navigation } from 'lucide-react-native';
import { COLORS } from '../constants/theme';

const LocationMap = ({
    region,
    onRegionChangeComplete,
    onClose,
    addressText,
    onConfirm,
    onRequestCurrentLocation
}) => {
    const mapRef = useRef(null);

    useEffect(() => {
        if (mapRef.current && region) {
            mapRef.current.animateToRegion(region, 1000);
        }
    }, [region]);

    return (
        <View style={styles.mapContainer}>
            <MapView
                ref={mapRef}
                style={styles.map}
                provider={PROVIDER_DEFAULT}
                initialRegion={region}
                onRegionChangeComplete={onRegionChangeComplete}
            >
                {/* Center Marker Fixed View instead of Map Marker usually better for selection */}
            </MapView>

            {/* Fixed Center Marker */}
            <View style={styles.centerMarker}>
                <MapPin size={40} color={COLORS.accent} fill={COLORS.accent} style={{ marginBottom: 40 }} />
            </View>

            {/* Map Header */}
            <View style={styles.mapHeader}>
                <TouchableOpacity onPress={onClose} style={styles.backBtn}>
                    <X size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.mapTitle}>Pin Location</Text>
            </View>

            {/* Map Footer */}
            <View style={styles.mapFooter}>
                <View style={styles.addressBox}>
                    <Text style={styles.addressLabel}>Selected Location</Text>
                    <Text style={styles.addressValue} numberOfLines={2}>
                        {addressText || "Locating..."}
                    </Text>
                </View>
                <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
                    <Text style={styles.confirmBtnText}>Confirm Location</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.gpsBtn}
                    onPress={onRequestCurrentLocation}
                >
                    <Navigation size={24} color={COLORS.accent} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mapContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    centerMarker: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -20,
        marginTop: -40,
        zIndex: 10,
    },
    mapHeader: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 30,
        left: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 10,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    mapTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 16,
        color: '#000',
        backgroundColor: 'rgba(255,255,255,0.8)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
        overflow: 'hidden',
    },
    mapFooter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 24,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    addressBox: {
        marginBottom: 16,
    },
    addressLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    addressValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    confirmBtn: {
        backgroundColor: COLORS.accent,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    confirmBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    gpsBtn: {
        position: 'absolute',
        top: -70,
        right: 20,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});

export default LocationMap;

```

### components/LocationMap.web.js
```javascript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LocationMap = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Map not supported on Web</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
    },
    text: {
        color: '#666',
        fontSize: 16,
    }
});

export default LocationMap;

```

### components/LocationModal.js
```javascript
import React, { useState, useEffect, useRef } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    ActivityIndicator,
    Alert,
    Platform,
    Dimensions
} from 'react-native';
import { X, MapPin, Navigation, Search, Check } from 'lucide-react-native';
import * as Location from 'expo-location';
import { COLORS, SPACING } from '../constants/theme';
import LocationMap from './LocationMap';

const MOCK_CITIES = [
    "Calicut, Kerala",
    "Kochi, Kerala",
    "Trivandrum, Kerala",
    "Kannur, Kerala",
    "Thrissur, Kerala",
    "Malappuram, Kerala"
];

const { width, height } = Dimensions.get('window');

const LocationModal = ({ visible, onClose, onLocationSelect, currentLocation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isLocating, setIsLocating] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [mapRegion, setMapRegion] = useState(null);
    const [selectedCoord, setSelectedCoord] = useState(null);
    const [addressText, setAddressText] = useState('');
    const mapRef = useRef(null);

    // Initial region: Calicut
    const DEFAULT_REGION = {
        latitude: 11.2588,
        longitude: 75.7804,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };

    useEffect(() => {
        if (visible && currentLocation) {
            const region = {
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            };
            setMapRegion(region);
            setSelectedCoord(currentLocation);
        } else if (visible && !mapRegion) {
            setMapRegion(DEFAULT_REGION);
        }
    }, [visible, currentLocation]);

    const filteredCities = MOCK_CITIES.filter(city =>
        city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCurrentLocation = async () => {
        setIsLocating(true);
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Permission to access location was denied');
                setIsLocating(false);
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            const coords = location.coords;

            // If map is shown, move to location
            if (showMap && mapRef.current) {
                const newRegion = {
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                };
                mapRef.current.animateToRegion(newRegion, 1000);
                setMapRegion(newRegion);
                setSelectedCoord(coords);
                await fetchAddressForCoords(coords);
            } else {
                // If list view, just select and close
                let address = await Location.reverseGeocodeAsync({
                    latitude: coords.latitude,
                    longitude: coords.longitude
                });

                if (address && address.length > 0) {
                    const addr = address[0];
                    const city = addr.city || addr.subregion || addr.district;
                    const region = addr.region || addr.country;
                    const locationString = city ? `${city}, ${region}` : "Current Location";
                    onLocationSelect(locationString);
                    onClose();
                }
            }

        } catch (error) {
            Alert.alert('Error', 'Could not fetch location');
        } finally {
            setIsLocating(false);
        }
    };

    const fetchAddressForCoords = async (coords) => {
        try {
            let address = await Location.reverseGeocodeAsync({
                latitude: coords.latitude,
                longitude: coords.longitude
            });
            if (address && address.length > 0) {
                const addr = address[0];
                const street = addr.street || addr.name;
                const city = addr.city || addr.subregion;
                setAddressText(street ? `${street}, ${city}` : city);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const handleConfirmMapLocation = () => {
        if (addressText) {
            onLocationSelect(addressText);
        } else {
            onLocationSelect("Selected Location");
        }
        setShowMap(false);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                {showMap ? (
                    <LocationMap
                        region={mapRegion}
                        onRegionChangeComplete={(region) => {
                            setMapRegion(region);
                            setSelectedCoord({ latitude: region.latitude, longitude: region.longitude });
                            fetchAddressForCoords({ latitude: region.latitude, longitude: region.longitude });
                        }}
                        onClose={() => setShowMap(false)}
                        addressText={addressText}
                        onConfirm={handleConfirmMapLocation}
                        onRequestCurrentLocation={handleCurrentLocation}
                    />


                ) : (
                    <View style={styles.container}>
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.title}>Select Location</Text>
                            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                                <X size={24} color={COLORS.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        {/* Search Bar */}
                        <View style={styles.searchContainer}>
                            <Search size={20} color={COLORS.textTertiary} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search for your city..."
                                placeholderTextColor={COLORS.textTertiary}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>

                        {/* Current Location Option */}
                        <TouchableOpacity
                            style={styles.optionItem}
                            onPress={handleCurrentLocation}
                            disabled={isLocating}
                        >
                            <View style={[styles.iconBox, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                                {isLocating ? (
                                    <ActivityIndicator size="small" color={COLORS.accent} />
                                ) : (
                                    <Navigation size={20} color={COLORS.accent} fill={COLORS.accent} />
                                )}
                            </View>
                            <View>
                                <Text style={[styles.optionTitle, { color: COLORS.accent }]}>
                                    {isLocating ? 'Locating...' : 'Use Current Location'}
                                </Text>
                                <Text style={styles.optionSubtitle}>Using GPS</Text>
                            </View>
                        </TouchableOpacity>

                        {/* Map Selection Option */}
                        <TouchableOpacity
                            style={styles.optionItem}
                            onPress={() => {
                                if (Platform.OS === 'web') {
                                    Alert.alert('Not Supported', 'Map selection is currently available only on the mobile app.');
                                    return;
                                }
                                setShowMap(true);
                            }}
                        >
                            <View style={[styles.iconBox, { backgroundColor: 'rgba(255, 255, 255, 0.05)' }]}>
                                <MapPin size={20} color={COLORS.textPrimary} />
                            </View>
                            <View>
                                <Text style={styles.optionTitle}>Select on Map</Text>
                                <Text style={styles.optionSubtitle}>Pin your exact location</Text>
                            </View>
                        </TouchableOpacity>

                        <Text style={styles.sectionTitle}>SUGGESTED CITIES</Text>

                        {/* City List */}
                        {filteredCities.map((city, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.cityItem}
                                onPress={() => {
                                    onLocationSelect(city);
                                    onClose();
                                }}
                            >
                                <MapPin size={16} color={COLORS.textTertiary} />
                                <Text style={styles.cityText}>{city}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>
        </Modal >
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: '#18181b',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: SPACING.lg,
        maxHeight: '80%',
    },
    mapContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    centerMarker: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -20,
        marginTop: -40,
        zIndex: 10,
    },
    mapHeader: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 30,
        left: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 10,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    mapTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 16,
        color: '#000', // Map header usually clean/light
        backgroundColor: 'rgba(255,255,255,0.8)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
        overflow: 'hidden',
    },
    mapFooter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 24,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    addressBox: {
        marginBottom: 16,
    },
    addressLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    addressValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    confirmBtn: {
        backgroundColor: COLORS.accent,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    confirmBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    gpsBtn: {
        position: 'absolute',
        top: -70,
        right: 20,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    closeBtn: {
        padding: 4,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
        marginBottom: SPACING.lg,
        gap: 12,
    },
    searchInput: {
        flex: 1,
        color: COLORS.textPrimary,
        fontSize: 16,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        paddingVertical: 12,
        marginBottom: 8,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: 2,
    },
    optionSubtitle: {
        fontSize: 12,
        color: COLORS.textTertiary,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.textTertiary,
        marginTop: SPACING.lg,
        marginBottom: SPACING.md,
        letterSpacing: 1,
    },
    cityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    cityText: {
        color: COLORS.textSecondary,
        fontSize: 16,
    },
});

export default LocationModal;

```

### components/MenuModal.js
```javascript
import React from 'react';
import { useRouter } from 'expo-router';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    TouchableWithoutFeedback,
    Switch
} from 'react-native';
import { X, User, LogIn, UserPlus, Info, FileText, ChevronRight, Moon, Sun, LogOut } from 'lucide-react-native';
import { COLORS, SPACING } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');
const MENU_WIDTH = Math.min(width * 0.8, 320);

const MenuModal = ({ visible, onClose }) => {
    const router = useRouter();
    const { theme, toggleTheme, colors } = useTheme(); // Get dynamic colors
    const { user, logout } = useAuth();
    const isDark = theme === 'dark';

    const handleLogout = () => {
        logout();
        onClose();
    };

    const MenuItem = ({ icon: Icon, label, onPress, color }) => {
        const iconColor = color || colors.textPrimary;
        return (
            <TouchableOpacity style={styles.menuItem} onPress={onPress}>
                <View style={styles.menuItemLeft}>
                    <Icon size={20} color={iconColor} />
                    <Text style={[styles.menuItemText, { color: iconColor }]}>{label}</Text>
                </View>
                <ChevronRight size={16} color={colors.textTertiary} />
            </TouchableOpacity>
        );
    };

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={styles.backdrop} />
                </TouchableWithoutFeedback>

                <View style={[styles.menuContainer, { backgroundColor: colors.bgPrimary, borderColor: isDark ? colors.border : 'transparent' }]}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View>
                            <Text style={[styles.title, { color: colors.textPrimary }]}>Menu</Text>
                            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{user ? `Welcome, ${user.name}` : 'Welcome Guest'}</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <X size={24} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    {/* Divider */}
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    {/* Menu Items */}
                    {!user && (
                        <View style={[styles.section, { borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
                            <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Account</Text>
                            <MenuItem icon={LogIn} label="Login or Sign Up" onPress={() => { router.push('/auth/login'); onClose(); }} />
                        </View>
                    )}

                    {user && (
                        <View style={[styles.section, { borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
                            <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Dashboard</Text>
                            <MenuItem icon={User} label="Profile" onPress={() => { router.push('/profile'); onClose(); }} />
                            <MenuItem icon={FileText} label="Booking Details" onPress={() => { router.push('/bookings'); onClose(); }} />
                        </View>
                    )}

                    <View style={[styles.section, { borderBottomWidth: 0 }]}>
                        <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>App</Text>
                        <MenuItem icon={Info} label="About" onPress={() => { router.push('/about'); onClose(); }} />
                    </View>

                    <View style={[styles.section, { borderBottomWidth: 0 }]}>
                        <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Partner</Text>
                        <MenuItem icon={LogIn} label="Partner Access" onPress={() => { router.push('/partner/auth'); onClose(); }} />
                    </View>

                    <View style={[styles.section, { borderBottomWidth: 0 }]}>
                        <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Appearance</Text>
                        <View style={styles.menuItem}>
                            <View style={styles.menuItemLeft}>
                                <View style={{ width: 24, alignItems: 'center' }}>
                                    {isDark ? (
                                        <Moon size={20} color={colors.textPrimary} />
                                    ) : (
                                        <Sun size={20} color={colors.textPrimary} />
                                    )}
                                </View>
                                <Text style={[styles.menuItemText, { color: colors.textPrimary }]}>{isDark ? "Dark Mode" : "Light Mode"}</Text>
                            </View>
                            <Switch
                                trackColor={{ false: "#767577", true: colors.accent }}
                                thumbColor={isDark ? "#fff" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={toggleTheme}
                                value={isDark}
                            />
                        </View>
                    </View>

                    {user && (
                        <View style={[styles.section, { borderBottomWidth: 0 }]}>
                            <MenuItem
                                icon={LogOut}
                                label="Logout"
                                onPress={handleLogout}
                                color={colors.danger}
                            />
                        </View>
                    )}

                    <View style={styles.footer}>
                        <Text style={[styles.version, { color: colors.textTertiary }]}>Version 1.0.0</Text>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        flexDirection: 'row',
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    menuContainer: {
        width: MENU_WIDTH,
        height: '100%',
        backgroundColor: COLORS.bgPrimary,
        padding: SPACING.lg,
        borderRightWidth: 1,
        borderColor: COLORS.border,
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.lg,
        marginTop: SPACING.md,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    closeBtn: {
        padding: 4,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginBottom: SPACING.lg,
    },
    section: {
        marginBottom: SPACING.lg,
        paddingBottom: SPACING.md,
        borderBottomWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.textTertiary,
        textTransform: 'uppercase',
        marginBottom: SPACING.md,
        letterSpacing: 1,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderRadius: 8,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    menuItemText: {
        fontSize: 16,
        fontWeight: '500',
    },
    footer: {
        marginTop: 'auto',
        alignItems: 'center',
    },
    version: {
        color: COLORS.textTertiary,
        fontSize: 12,
    },
});

export default MenuModal;

```

### components/PartnerLocationSelect.js
```javascript
import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    TextInput,
    ScrollView
} from 'react-native';
import { X, MapPin, Check, Navigation, Plus, Minus, Edit2 } from 'lucide-react-native';
import { COLORS, SPACING } from '../constants/theme';

const { width } = Dimensions.get('window');

const PartnerLocationSelect = ({ visible, onClose, onSelect }) => {
    const [loading, setLoading] = useState(false);
    const [radius, setRadius] = useState(10); // 1-10 km
    const [zoom, setZoom] = useState(1); // 0.5 - 2
    const [address, setAddress] = useState('Calicut, Kerala');
    const [isEditing, setIsEditing] = useState(false);

    // Calculate visual size based on validation and zoom
    // Base size for 10km is 60% of width.
    // If radius is 5km, it should look smaller relative to the "map" context
    const circleSize = (width * 0.6) * (radius / 10) * zoom;

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 2));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));

    const handleConfirm = () => {
        setLoading(true);
        // Simulate getting location details
        setTimeout(() => {
            setLoading(false);
            onSelect({
                address: address, // Dynamic address
                coordinates: { lat: 11.2588, lng: 75.7804 }, // Mock coords
                radius: radius
            });
            onClose();
        }, 1000);
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Set Service Location</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <X size={24} color={COLORS.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.subtitle}>
                        Select service radius (Max 10km) and center location.
                    </Text>

                    {/* Mock Map View */}
                    <View style={styles.mapContainer}>
                        {/* Grid lines to look like map */}
                        <View style={styles.gridLineVertical} />
                        <View style={styles.gridLineHorizontal} />

                        {/* Dynamic Radius Circle */}
                        <View style={[
                            styles.radiusCircle,
                            {
                                width: circleSize,
                                height: circleSize,
                                borderRadius: circleSize / 2
                            }
                        ]}>
                            <View style={styles.radiusLabelContainer}>
                                <Text style={styles.radiusLabel}>{radius} km</Text>
                            </View>
                        </View>

                        {/* Center Pin */}
                        <View style={styles.centerPin}>
                            <MapPin size={40} color={COLORS.danger} fill={COLORS.danger} />
                            <View style={styles.pinShadow} />
                        </View>

                        {/* Zoom Controls */}
                        <View style={styles.zoomControls}>
                            <TouchableOpacity onPress={handleZoomIn} style={styles.zoomBtn}>
                                <Plus size={20} color={COLORS.textPrimary} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleZoomOut} style={styles.zoomBtn}>
                                <Minus size={20} color={COLORS.textPrimary} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Radius Selection */}
                    <Text style={styles.sectionTitle}>SERVICE RADIUS (MAX 10 KM)</Text>
                    <View style={styles.radiusSelector}>
                        {[1, 3, 5, 8, 10].map((r) => (
                            <TouchableOpacity
                                key={r}
                                style={[styles.radiusBtn, radius === r && styles.radiusBtnActive]}
                                onPress={() => setRadius(r)}
                            >
                                <Text style={[styles.radiusBtnText, radius === r && styles.radiusBtnTextActive]}>{r} km</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.sectionTitle}>LOCATION CENTER</Text>
                    <View style={styles.addressBox}>
                        <MapPin size={20} color={COLORS.accent} />
                        {isEditing ? (
                            <TextInput
                                style={styles.addressInput}
                                value={address}
                                onChangeText={setAddress}
                                placeholder="Enter city name..."
                                placeholderTextColor={COLORS.textTertiary}
                                autoFocus
                                onBlur={() => setIsEditing(false)}
                            />
                        ) : (
                            <Text style={styles.addressText}>{address}</Text>
                        )}
                        <TouchableOpacity onPress={() => setIsEditing(!isEditing)} style={{ marginLeft: 'auto' }}>
                            {isEditing ? <Check size={20} color={COLORS.success} /> : <Edit2 size={20} color={COLORS.textSecondary} />}
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.confirmBtn}
                        onPress={handleConfirm}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <Check size={20} color="#fff" />
                                <Text style={styles.confirmBtnText}>Confirm Location</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: COLORS.bgSecondary,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: SPACING.lg,
        height: '85%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    subtitle: {
        color: COLORS.textSecondary,
        marginBottom: SPACING.lg,
    },
    closeBtn: {
        padding: 4,
    },
    mapContainer: {
        flex: 1,
        backgroundColor: '#1e293b', // darker map bg
        borderRadius: 16,
        marginBottom: SPACING.lg,
        overflow: 'hidden',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    gridLineVertical: {
        position: 'absolute',
        width: 1,
        height: '100%',
        backgroundColor: 'rgba(255,255,255,0.05)',
        left: '50%',
    },
    gridLineHorizontal: {
        position: 'absolute',
        width: '100%',
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        top: '50%',
    },
    radiusCircle: {
        width: width * 0.6,
        height: width * 0.6,
        borderRadius: (width * 0.6) / 2,
        backgroundColor: 'rgba(37, 99, 235, 0.15)', // Primary blue low opacity
        borderWidth: 2,
        borderColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderStyle: 'dashed',
    },
    radiusLabelContainer: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginTop: -12,
    },
    radiusLabel: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    centerPin: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -20, // offset for pin height
    },
    pinShadow: {
        width: 10,
        height: 4,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 2,
        marginTop: 2,
    },
    gpsButton: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        backgroundColor: COLORS.bgTertiary,
        padding: 12,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    addressBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: COLORS.bgTertiary,
        padding: 16,
        borderRadius: 12,
        marginBottom: SPACING.lg,
    },
    addressText: {
        color: COLORS.textPrimary,
        fontSize: 16,
        fontWeight: '500',
        flex: 1,
    },
    addressInput: {
        color: COLORS.textPrimary,
        fontSize: 16,
        fontWeight: '500',
        flex: 1,
        padding: 0,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.textTertiary,
        marginBottom: SPACING.sm,
        letterSpacing: 1,
    },
    radiusSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.lg,
    },
    radiusBtn: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: COLORS.bgTertiary,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    radiusBtnActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    radiusBtnText: {
        color: COLORS.textSecondary,
        fontSize: 14,
        fontWeight: '600',
    },
    radiusBtnTextActive: {
        color: '#fff',
    },
    zoomControls: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        gap: 8,
    },
    zoomBtn: {
        backgroundColor: COLORS.bgTertiary,
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    confirmBtn: {
        backgroundColor: COLORS.success,
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    confirmBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default PartnerLocationSelect;

```

### components/PaymentModal.js
```javascript
import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';
import { CheckCircle, DollarSign, CreditCard, Banknote } from 'lucide-react-native';

const PaymentModal = ({ visible, booking, onClose, onPay }) => {
    const [loading, setLoading] = useState(false);

    if (!booking) return null;

    const basePrice = booking.price;
    const hours = booking.hoursWorked || 1;
    const extraHours = Math.max(0, hours - 1);
    const extraCharge = extraHours * 100;
    const finalPrice = booking.finalPrice || basePrice;

    const handlePayment = (method) => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            onPay(booking.id, method);
            Alert.alert('Payment Successful', `Paid ₹${finalPrice} via ${method}`);
            onClose();
        }, 1500);
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Complete Payment</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.closeText}>Close</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.billContainer}>
                        <Text style={styles.billTitle}>Bill Details</Text>

                        <View style={styles.billRow}>
                            <Text style={styles.rowLabel}>Base Service Charge (1 hr)</Text>
                            <Text style={styles.rowValue}>₹{basePrice}</Text>
                        </View>

                        {extraHours > 0 && (
                            <View style={styles.billRow}>
                                <Text style={styles.rowLabel}>Extra Hours ({extraHours} hrs @ ₹100/hr)</Text>
                                <Text style={styles.rowValue}>₹{extraCharge}</Text>
                            </View>
                        )}

                        <View style={styles.divider} />

                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Total Payable</Text>
                            <Text style={styles.totalValue}>₹{finalPrice}</Text>
                        </View>
                    </View>

                    <Text style={styles.methodTitle}>Select Payment Method</Text>

                    <TouchableOpacity
                        style={styles.methodCard}
                        onPress={() => handlePayment('online')}
                        disabled={loading}
                    >
                        <View style={styles.iconBox}>
                            <CreditCard size={24} color={COLORS.primary} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.methodName}>Online Payment</Text>
                            <Text style={styles.methodSub}>UPI, Cards, Netbanking</Text>
                        </View>
                        <CheckCircle size={20} color={COLORS.border} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.methodCard}
                        onPress={() => handlePayment('cash')}
                        disabled={loading}
                    >
                        <View style={[styles.iconBox, { backgroundColor: 'rgba(34, 197, 94, 0.1)' }]}>
                            <Banknote size={24} color={COLORS.success} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.methodName}>Cash on Delivery</Text>
                            <Text style={styles.methodSub}>Pay directly to partner</Text>
                        </View>
                        <CheckCircle size={20} color={COLORS.border} />
                    </TouchableOpacity>

                    {loading && (
                        <View style={styles.loadingOverlay}>
                            <ActivityIndicator size="large" color={COLORS.primary} />
                            <Text style={{ marginTop: 12, color: COLORS.textSecondary }}>Processing Payment...</Text>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: COLORS.bgPrimary,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: SPACING.xl,
        minHeight: 500,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    closeText: {
        color: COLORS.textSecondary,
        fontSize: 14,
        fontWeight: '500',
    },
    billContainer: {
        backgroundColor: COLORS.bgSecondary,
        padding: SPACING.lg,
        borderRadius: 16,
        marginBottom: SPACING.xl,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    billTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: SPACING.lg,
    },
    billRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    rowLabel: {
        color: COLORS.textSecondary,
        fontSize: 14,
    },
    rowValue: {
        color: COLORS.textPrimary,
        fontWeight: '500',
        fontSize: 14,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 12,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        color: COLORS.textPrimary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    totalValue: {
        color: COLORS.success,
        fontSize: 24,
        fontWeight: 'bold',
    },
    methodTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: SPACING.md,
    },
    methodCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 12,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    methodName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    methodSub: {
        color: COLORS.textSecondary,
        fontSize: 12,
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
});

export default PaymentModal;

```

### components/RescheduleModal.js
```javascript
import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
    KeyboardAvoidingView,
    ScrollView
} from 'react-native';
import { X, Calendar, Clock, CheckCircle } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS, SPACING } from '../constants/theme';

const RescheduleModal = ({ booking, visible, onClose, onConfirm }) => {
    const [selectedDate, setSelectedDate] = useState('Tomorrow');
    const [customDate, setCustomDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState('Morning');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [date, setDate] = useState(new Date());
    const [step, setStep] = useState(1);

    useEffect(() => {
        if (visible) {
            setStep(1);
            setSelectedDate('Tomorrow');
            setCustomDate('');
            setSelectedSlot('Morning');
            setDate(new Date());
        }
    }, [visible]);

    if (!booking) return null;

    const availableDays = ['Today', 'Tomorrow', 'Pick Date'];

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
            const formattedDate = selectedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
            setSelectedDate('Custom');
            setCustomDate(formattedDate);
        }
    };

    const handleConfirm = () => {
        // Here you would typically make an API call to update the booking
        setStep(2); // Show success message
    };

    const SelectionChip = ({ label, subLabel, selected, onClick, isDate = false }) => (
        <TouchableOpacity
            onPress={onClick}
            style={[
                styles.chip,
                selected ? styles.chipSelected : styles.chipUnselected,
                isDate && styles.chipDate
            ]}
        >
            <Text style={[styles.chipText, selected ? styles.chipTextSelected : styles.chipTextUnselected]}>
                {label}
            </Text>
            {subLabel && (
                <Text style={styles.chipSubLabel}>{subLabel}</Text>
            )}
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <View style={styles.container}>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <X size={24} color={COLORS.textSecondary} />
                        </TouchableOpacity>

                        {step === 1 ? (
                            <View style={{ flexShrink: 1 }}>
                                <ScrollView contentContainerStyle={styles.content}>
                                    <Text style={styles.title}>Reschedule Booking</Text>
                                    <Text style={styles.subtitle}>
                                        For: <Text style={{ color: COLORS.accent }}>{booking.service}</Text>
                                    </Text>

                                    {/* Date Selection */}
                                    <View style={styles.section}>
                                        <View style={styles.labelRow}>
                                            <Calendar size={16} color={COLORS.textTertiary} />
                                            <Text style={styles.label}>New Date</Text>
                                        </View>
                                        <View style={styles.chipGroup}>
                                            {availableDays.map(day => {
                                                const isCustom = day === 'Pick Date';
                                                const isSelected = isCustom ? selectedDate === 'Custom' : selectedDate === day;
                                                const label = (isCustom && selectedDate === 'Custom') ? customDate : day;

                                                return (
                                                    <SelectionChip
                                                        key={day}
                                                        label={label}
                                                        selected={isSelected}
                                                        onClick={() => {
                                                            if (isCustom) {
                                                                setShowDatePicker(true);
                                                            } else {
                                                                setSelectedDate(day);
                                                                setCustomDate('');
                                                            }
                                                        }}
                                                        isDate
                                                    />
                                                );
                                            })}
                                            {showDatePicker && (
                                                <DateTimePicker
                                                    value={date}
                                                    mode="date"
                                                    display="default"
                                                    onChange={onDateChange}
                                                    minimumDate={new Date()}
                                                />
                                            )}
                                        </View>
                                    </View>

                                    {/* Time Selection */}
                                    <View style={styles.section}>
                                        <View style={styles.labelRow}>
                                            <Clock size={16} color={COLORS.textTertiary} />
                                            <Text style={styles.label}>New Time</Text>
                                        </View>
                                        <View style={styles.chipGroup}>
                                            {['Morning', 'Afternoon', 'Evening'].map(slot => (
                                                <SelectionChip
                                                    key={slot}
                                                    label={slot}
                                                    selected={selectedSlot === slot}
                                                    onClick={() => setSelectedSlot(slot)}
                                                />
                                            ))}
                                        </View>
                                    </View>
                                </ScrollView>

                                <View style={styles.footer}>
                                    <TouchableOpacity onPress={handleConfirm} style={styles.confirmBtn}>
                                        <Text style={styles.confirmBtnText}>Confirm Reschedule</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <View style={[styles.content, styles.successContent]}>
                                <CheckCircle size={64} color={COLORS.success} />
                                <Text style={styles.successTitle}>Rescheduled!</Text>
                                <Text style={styles.successText}>
                                    Your booking has been moved to <Text style={{ color: COLORS.textPrimary, fontWeight: 'bold' }}>{selectedDate === 'Custom' ? customDate : selectedDate}</Text> in the <Text style={{ color: COLORS.textPrimary, fontWeight: 'bold' }}>{selectedSlot}</Text>.
                                </Text>
                                <TouchableOpacity onPress={onClose} style={[styles.confirmBtn, styles.outlineBtn]}>
                                    <Text style={[styles.confirmBtnText, { color: COLORS.textPrimary }]}>Done</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        padding: SPACING.md,
    },
    keyboardView: {
        width: '100%',
        alignItems: 'center',
    },
    container: {
        width: '100%',
        maxWidth: 500,
        backgroundColor: '#18181b',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: COLORS.border,
        overflow: 'hidden',
    },
    closeBtn: {
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 10,
        padding: 4,
    },
    content: {
        padding: SPACING.lg,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 24,
    },
    section: {
        marginBottom: 24,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 8,
    },
    chipGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    chipSelected: {
        backgroundColor: COLORS.accent,
        borderColor: COLORS.accent,
    },
    chipUnselected: {
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    chipDate: {
        minWidth: 80,
        alignItems: 'center',
    },
    chipText: {
        fontWeight: '500',
        fontSize: 14,
    },
    chipTextSelected: {
        color: '#000',
        fontWeight: 'bold',
    },
    chipTextUnselected: {
        color: COLORS.textTertiary,
    },
    footer: {
        padding: SPACING.lg,
        paddingTop: 0,
        backgroundColor: '#18181b',
    },
    confirmBtn: {
        backgroundColor: COLORS.accent,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    confirmBtnText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
    },
    successContent: {
        alignItems: 'center',
        paddingVertical: 48,
    },
    successTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginTop: 16,
        marginBottom: 8,
    },
    successText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: 16,
    },
    outlineBtn: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: COLORS.border,
        width: '100%',
    },
});

export default RescheduleModal;

```

### components/ReviewModal.js
```javascript
import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import { X, Star, CheckCircle } from 'lucide-react-native';
import { COLORS, SPACING } from '../constants/theme';

const ReviewModal = ({ booking, visible, onClose, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [step, setStep] = useState(1);

    useEffect(() => {
        if (visible) {
            setStep(1);
            setRating(0);
            setComment('');
        }
    }, [visible]);

    if (!booking) return null;

    const handleSubmit = () => {
        if (rating === 0) return;
        // Mock submission
        setStep(2);
        if (onSubmit) {
            onSubmit({ bookingId: booking.id, rating, comment });
        }
    };

    const StarRating = () => {
        return (
            <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity key={star} onPress={() => setRating(star)}>
                        <Star
                            size={32}
                            color={star <= rating ? COLORS.gold : COLORS.textTertiary}
                            fill={star <= rating ? COLORS.gold : 'transparent'}
                        />
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.overlay}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.keyboardView}
                    >
                        <View style={styles.container}>
                            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                                <X size={24} color={COLORS.textSecondary} />
                            </TouchableOpacity>

                            {step === 1 ? (
                                <View style={styles.content}>
                                    <Text style={styles.title}>Write a Review</Text>
                                    <Text style={styles.subtitle}>
                                        How was your experience with <Text style={{ color: COLORS.accent }}>{booking.service}</Text>?
                                    </Text>

                                    <Text style={styles.label}>Rate your experience</Text>
                                    <StarRating />

                                    <Text style={styles.label}>Share your feedback</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Tell us what you liked or didn't like..."
                                        placeholderTextColor={COLORS.textTertiary}
                                        multiline
                                        numberOfLines={4}
                                        value={comment}
                                        onChangeText={setComment}
                                        textAlignVertical="top"
                                    />

                                    <TouchableOpacity
                                        onPress={handleSubmit}
                                        style={[styles.submitBtn, rating === 0 && styles.disabledBtn]}
                                        disabled={rating === 0}
                                    >
                                        <Text style={styles.submitBtnText}>Submit Review</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View style={[styles.content, styles.successContent]}>
                                    <CheckCircle size={64} color={COLORS.success} />
                                    <Text style={styles.successTitle}>Thank You!</Text>
                                    <Text style={styles.successText}>
                                        Your review helps us improve our service.
                                    </Text>
                                    <TouchableOpacity onPress={onClose} style={[styles.submitBtn, styles.outlineBtn]}>
                                        <Text style={[styles.submitBtnText, { color: COLORS.textPrimary }]}>Close</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        padding: SPACING.md,
    },
    keyboardView: {
        width: '100%',
        alignItems: 'center',
    },
    container: {
        width: '100%',
        maxWidth: 500,
        backgroundColor: '#18181b',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: COLORS.border,
        overflow: 'hidden',
    },
    closeBtn: {
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 10,
        padding: 4,
    },
    content: {
        padding: SPACING.lg,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 24,
        textAlign: 'center',
    },
    label: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 12,
        fontWeight: '600',
    },
    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 32,
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 16,
        color: COLORS.textPrimary,
        fontSize: 16,
        minHeight: 120,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    submitBtn: {
        backgroundColor: COLORS.accent,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    disabledBtn: {
        backgroundColor: COLORS.textTertiary,
        opacity: 0.5,
    },
    submitBtnText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
    },
    successContent: {
        alignItems: 'center',
        paddingVertical: 48,
    },
    successTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginTop: 16,
        marginBottom: 8,
    },
    successText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: 24,
    },
    outlineBtn: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: COLORS.border,
        width: '100%',
    },
});

export default ReviewModal;

```

### components/ServiceCard.js
```javascript
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { Star, Clock, MapPin, Zap } from 'lucide-react-native';
import { COLORS, SPACING } from '../constants/theme';

const ServiceCard = ({
    name,
    rating,
    specialty,
    distance,
    time,
    price,
    image,
    isEmergency = false,
    fullWidth = false,
    onPress
}) => {
    const { width } = useWindowDimensions();
    const isSmallScreen = width < 768;
    const cardWidth = isSmallScreen
        ? (width - SPACING.md * 3) / 2
        : (width - SPACING.md * 4) / 4;

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={onPress}
            style={[
                styles.card,
                fullWidth ? { width: '100%' } : { width: cardWidth },
                !fullWidth && !isSmallScreen && { maxWidth: 300 }, // Max width for desktop cards
                isEmergency && styles.emergencyCard
            ]}
        >
            {/* Image Section */}
            <View style={styles.imageContainer}>
                <Image
                    source={typeof image === 'string' ? { uri: image } : image}
                    style={styles.image}
                    resizeMode="cover"
                />
                <View style={[styles.badge, isEmergency ? styles.badgeEmergency : styles.badgeRegular]}>
                    <Star size={12} color={isEmergency ? "#fff" : "#000"} fill={isEmergency ? "#fff" : "#000"} />
                    <Text style={[styles.badgeText, isEmergency && { color: '#fff' }]}>{rating}</Text>
                </View>
            </View>

            {/* Content Section */}
            <View style={styles.content}>
                <View style={[styles.header, { alignItems: 'flex-start' }]}>
                    <Text style={styles.name}>{name}</Text>
                    {isEmergency && <Zap size={16} color={COLORS.danger} fill={COLORS.danger} style={{ marginTop: 4 }} />}
                </View>

                <Text style={styles.specialty}>{specialty}</Text>

                <View style={styles.metaContainer}>
                    <View style={styles.metaItem}>
                        <MapPin size={12} color={COLORS.textTertiary} />
                        <Text style={styles.metaText}>{distance}</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Clock size={12} color={COLORS.textTertiary} />
                        <Text style={styles.metaText}>{time}</Text>
                    </View>
                </View>

                {/* Price & Action */}
                <View style={styles.footer}>
                    <Text style={styles.price}>₹{price}</Text>
                    <TouchableOpacity style={styles.bookBtn} onPress={onPress}>
                        <Text style={styles.bookBtnText}>Book</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.bgSecondary,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: SPACING.md,
    },
    emergencyCard: {
        borderColor: 'rgba(239, 68, 68, 0.5)',
        backgroundColor: 'rgba(239, 68, 68, 0.05)',
    },
    imageContainer: {
        height: 120,
        width: '100%',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    badge: {
        position: 'absolute',
        top: 8,
        right: 8,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    badgeRegular: {
        backgroundColor: COLORS.gold,
    },
    badgeEmergency: {
        backgroundColor: COLORS.danger,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#000',
    },
    content: {
        padding: SPACING.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        flex: 1,
    },
    specialty: {
        fontSize: 12,
        color: COLORS.accent,
        marginBottom: 8,
    },
    metaContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        color: COLORS.textTertiary,
        fontSize: 12,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    bookBtn: {
        backgroundColor: COLORS.accent,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    bookBtnText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 12,
    },
});

export default ServiceCard;

```

### constants/bookingStore.js
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Simple Event Emitter for React Native compatibility
class SimpleEventEmitter {
    constructor() {
        this.listeners = {};
    }

    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    off(event, callback) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }

    emit(event, data) {
        if (!this.listeners[event]) return;
        this.listeners[event].forEach(callback => callback(data));
    }
}

// Event emitter for real-time updates between screens
export const bookingEvents = new SimpleEventEmitter();

// Initial Mock Data (Used if storage is empty)
const INITIAL_BOOKINGS = [
    {
        id: 'b1',
        customerName: 'Alice Smith',
        customerPhone: '+91 98765 43210',
        partnerName: null,
        service: 'Emergency Repair Specialist',
        serviceType: 'Electrician',
        date: 'Today',
        time: '2:00 PM',
        status: 'open',
        price: 500,
        address: 'Calicut Beach Road, Kozhikode',
        distance: '1.2 km',
        otp: '4582',
        paymentStatus: 'pending',
        finalPrice: 500
    },
    {
        id: 'b2',
        customerName: 'Mohammed Fasil',
        customerPhone: '+91 90876 54321',
        partnerName: null,
        service: 'AC Service Expert',
        serviceType: 'AC',
        date: 'Tomorrow',
        time: '10:00 AM',
        status: 'open',
        price: 1200,
        address: 'Mavoor Road, Kozhikode',
        distance: '3.5 km',
        otp: '1290',
        paymentStatus: 'pending',
        finalPrice: 1200
    },
    {
        id: 'b3',
        customerName: 'Sneha Gupta',
        customerPhone: '+91 87654 32109',
        partnerName: 'John Electrician',
        service: 'Wiring Check',
        serviceType: 'Electrician',
        date: 'Yesterday',
        time: '4:30 PM',
        status: 'completed',
        price: 800,
        address: 'Mananchira, Kozhikode',
        distance: '0.8 km',
        otp: '7777',
        paymentStatus: 'pending',
        finalPrice: 800
    }
];

let bookings = [...INITIAL_BOOKINGS];

// Persistence Helpers
const STORAGE_KEY = 'sheriyakam_bookings_v1';

const saveData = async () => {
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch (e) {
        console.error('Failed to save bookings', e);
    }
};

const loadData = async () => {
    try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) {
            bookings = JSON.parse(json);
            // Notify listeners that data has loaded/changed
            bookingEvents.emit('change');
        }
    } catch (e) {
        console.error('Failed to load bookings', e);
    }
};

// Start Loading Data immediately
loadData();

export const getBookings = () => bookings;

// For Partner: Get "New Requests" (Open jobs)
export const getOpenRequests = () => {
    return bookings.filter(b => b.status === 'open');
};

// For Partner: Get "My Jobs" (Accepted jobs)
export const getPartnerJobs = () => {
    return bookings.filter(b => b.status === 'accepted' || b.status === 'completed');
};

export const acceptBookingByPartner = (id, partnerName) => {
    const booking = bookings.find(b => b.id === id);
    if (booking) {
        booking.status = 'accepted';
        booking.partnerName = partnerName;
        bookingEvents.emit('change');
        saveData(); // Persist
        return true;
    }
    return false;
};

export const completeBookingByPartner = (id, enteredOtp, hoursWorked = 1) => {
    const booking = bookings.find(b => b.id === id);
    if (booking) {
        if (booking.otp === enteredOtp) {
            booking.status = 'completed';

            // Pricing Logic: Base price covers 1 hour. Extra hours = 100rs/hr
            const extraHours = Math.max(0, hoursWorked - 1);
            booking.finalPrice = booking.price + (extraHours * 100);
            booking.hoursWorked = hoursWorked;
            booking.paymentStatus = 'pending'; // Customer needs to pay

            bookingEvents.emit('change');
            saveData(); // Persist
            return { success: true };
        } else {
            return { success: false, message: 'Invalid OTP' };
        }
    }
    return { success: false, message: 'Booking not found' };
};

export const payBooking = (id, method) => {
    const booking = bookings.find(b => b.id === id);
    if (booking) {
        booking.paymentStatus = 'paid';
        booking.paymentMethod = method; // 'cash' or 'online'
        bookingEvents.emit('change');
        saveData(); // Persist
        return true;
    }
    return false;
};

export const cancelBooking = (id) => {
    const booking = bookings.find(b => b.id === id);
    if (booking) {
        booking.status = 'Cancelled';
        bookingEvents.emit('change');
        saveData(); // Persist
    }
};

export const createBooking = (newBooking) => {
    const id = 'b' + (Date.now());
    const booking = {
        ...newBooking,
        id,
        status: 'open',
        paymentStatus: 'pending',
        finalPrice: newBooking.price || 0,
        // Add minimal mocks if missing
        customerPhone: newBooking.customerPhone || '+91 00000 00000',
        distance: '2.0 km',
        otp: Math.floor(1000 + Math.random() * 9000).toString()
    };
    bookings.push(booking);
    bookingEvents.emit('change');
    saveData();
    return booking;
};

// Reset function for debug/testing
export const resetBookings = async () => {
    bookings = [...INITIAL_BOOKINGS];
    await AsyncStorage.removeItem(STORAGE_KEY);
    bookingEvents.emit('change');
};

```

### constants/partnerStore.js
```javascript
// Simple in-memory store for partner data
// In a real app, this would be a database
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initial mock data
const supervisors = {
    'Kozhikode': { id: 'sup1', name: 'Suresh Kumar', phone: '9876543210', taluk: 'Kozhikode' },
    'Thamarassery': { id: 'sup2', name: 'Ramesh Babu', phone: '8765432109', taluk: 'Thamarassery' },
    'Vadakara': { id: 'sup3', name: 'Abdul Kader', phone: '7654321098', taluk: 'Vadakara' },
    // Default fallback
    'default': { id: 'sup0', name: 'Main Supervisor', phone: '9999999999', taluk: 'General' }
};

let partners = [
    {
        id: 'p1',
        name: 'John Electrician',
        email: 'john@example.com',
        phone: '1234567890',
        password: 'password123',
        status: 'approved', // approved, pending, rejected
        serviceTypes: ['Electrician'],
        location: { lat: 11.2588, lng: 75.7804 }, // Calicut
        taluk: 'Kozhikode',
        joinDate: '2023-01-01', // > 1 year ago
        performanceScore: 92 // Excellent
    },
    {
        id: 'p2',
        name: 'New Partner',
        email: 'new@example.com',
        phone: '0987654321',
        password: 'password123',
        status: 'pending',
        serviceTypes: ['AC'],
        location: { lat: 11.2500, lng: 75.7800 },
        taluk: 'Thamarassery',
        joinDate: '2024-05-20', // < 1 year
        performanceScore: 75 // Good
    }
];

export const getSupervisorForPartner = (partner) => {
    if (!partner || !partner.taluk) return supervisors['default'];
    return supervisors[partner.taluk] || supervisors['default'];
};

let currentPartner = null;

export const getPartners = () => partners;

export const loginPartner = async (partner) => {
    currentPartner = partner;
    try {
        await AsyncStorage.setItem('partner_session', JSON.stringify(partner));
    } catch (e) {
        console.error('Failed to save partner session', e);
    }
};

export const logoutPartner = async () => {
    currentPartner = null;
    try {
        await AsyncStorage.removeItem('partner_session');
    } catch (e) {
        console.error('Failed to remove partner session', e);
    }
};

export const initializePartnerSession = async () => {
    try {
        const session = await AsyncStorage.getItem('partner_session');
        if (session) {
            currentPartner = JSON.parse(session);
            return currentPartner;
        }
    } catch (e) {
        console.error('Failed to load partner session', e);
    }
    return null;
};

export const getCurrentPartner = () => currentPartner;

export const togglePartnerAvailability = () => {
    if (currentPartner) {
        currentPartner.isAvailable = !currentPartner.isAvailable;
        return currentPartner.isAvailable; // Return new status
    }
    return false;
};

export const addPartner = (partner) => {
    const newPartner = {
        ...partner,
        id: `p${partners.length + 1}`,
        status: 'pending', // Default status is pending
    };
    partners.push(newPartner);
    return newPartner;
};

export const findPartner = (phone, password) => {
    return partners.find(p => p.phone === phone && p.password === password);
};

export const findPartnerByPhone = (phone) => {
    return partners.find(p => p.phone === phone);
};

// Admin function to approve
export const approvePartner = (id) => {
    const partner = partners.find(p => p.id === id);
    if (partner) {
        partner.status = 'approved';
        return true;
    }
    return false;
};

```

### constants/theme.js
```javascript
const SHADES = {
    primary: '#0056b3',
    accent: '#2563eb', // Vibrant Blue
    accentGlow: 'rgba(37, 99, 235, 0.4)',
    gold: '#D4AF37',
    danger: '#ef4444',
    success: '#22c55e',
};

export const darkTheme = {
    bgPrimary: '#09090b',
    bgSecondary: '#18181b',
    bgTertiary: '#27272a',
    primary: SHADES.primary,
    textPrimary: '#ffffff',
    textSecondary: '#a1a1aa',
    textTertiary: '#71717a',
    accent: SHADES.accent,
    accentGlow: SHADES.accentGlow,
    gold: SHADES.gold,
    border: '#27272a',
    danger: SHADES.danger,
    success: SHADES.success,
    mode: 'dark',
};

export const lightTheme = {
    bgPrimary: '#ffffff',
    bgSecondary: '#f8f9fa',
    bgTertiary: '#e9ecef',
    primary: SHADES.primary,
    textPrimary: '#1a1a1a',
    textSecondary: '#4a4a4a',
    textTertiary: '#6c757d',
    accent: SHADES.accent,
    accentGlow: 'rgba(37, 99, 235, 0.2)',
    gold: SHADES.gold,
    border: '#dee2e6',
    danger: SHADES.danger,
    success: SHADES.success,
    mode: 'light',
};

// Default export for backward compatibility
export const COLORS = darkTheme;

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    25: 100,
};

```

### context/AuthContext.js
```javascript
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Current user state (null = guest, object = logged in)
    const [user, setUser] = useState(null);

    // Mock Server Database
    const [registeredUsers, setRegisteredUsers] = useState([
        {
            email: 'user@example.com',
            mobile: '+919876543210',
            password: 'password123',
            name: 'Demo User'
        }
    ]);

    const login = (userData) => {
        setUser(userData);
    };

    const register = (userData) => {
        // Check if already registered
        const existing = registeredUsers.find(u =>
            u.email === userData.email || u.mobile === userData.mobile
        );

        if (!existing) {
            setRegisteredUsers([...registeredUsers, userData]);
            return true;
        }
        return false; // Already exists
    };

    const recoverCredentials = (identifier) => {
        // Find user by email or mobile
        const foundUser = registeredUsers.find(u =>
            u.email === identifier || u.mobile === identifier
        );
        return foundUser;
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, recoverCredentials }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

```

### context/ThemeContext.js
```javascript
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from '../constants/theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const systemScheme = useColorScheme();
    // Default to dark mode as per recent request, but support toggling
    const [theme, setTheme] = useState('dark');

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const colors = theme === 'dark' ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);

```
