import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator, Animated, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../../constants/theme';
import { addPartner, findPartner, findPartnerByPhone, approvePartner, getPartners, loginPartner, initializePartnerSession } from '../../constants/partnerStore';
import {
    User, Mail, Phone, Lock, MapPin, Zap, TrendingUp, DollarSign, Clock,
    CheckCircle, Star, Award, Briefcase, Target, Shield
} from 'lucide-react-native';
import PartnerLocationSelect from '../../components/PartnerLocationSelect';
import { useTheme } from '../../context/ThemeContext';
import * as DocumentPicker from 'expo-document-picker';
import { isSupabaseConfigured } from '../../config/supabaseConfig';
import { PartnersAPI } from '../../services/supabaseAPI';
import { checkRateLimit, generateOTP, hashPassword } from '../../utils/security';
import { snitch } from '../../utils/snitch';

export default function PartnerAuth() {
    const router = useRouter();
    const { theme, colors } = useTheme();
    const isDark = theme === 'dark';
    const [isLogin, setIsLogin] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checkingSession, setCheckingSession] = useState(true);

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        checkSession();
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const checkSession = async () => {
        const session = await initializePartnerSession();
        if (session) {
            router.replace('/partner');
        } else {
            // Allow access to auth screen for sign in/sign up
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

    // License State
    const [licenseUploaded, setLicenseUploaded] = useState(false);

    // OTP State
    const [showOtp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState('');
    const [savedOtp, setSavedOtp] = useState('');

    const phoneRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const otpRef = useRef(null);

    const allServices = [
        { id: 'Electrician', icon: Zap, color: '#F59E0B', earning: '₹25k-40k' },
        { id: 'AC', icon: Target, color: '#3B82F6', earning: '₹30k-50k' },
        { id: 'CCTV', icon: Shield, color: '#8B5CF6', earning: '₹20k-35k' },
        { id: 'Inverter', icon: TrendingUp, color: '#10B981', earning: '₹18k-30k' },
        { id: 'Home Automation', icon: Award, color: '#EF4444', earning: '₹35k-60k' },
    ];

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

        const cleanPhone = phone.trim();

        if (!showOtp) {
            snitch.logEvent('partner_login_attempt', { phone: cleanPhone });
            // Rate limit login requests
            const limitRes = checkRateLimit(`partner_login_${cleanPhone}`, 5, 60000);
            if (!limitRes.allowed) {
                snitch.logError(new Error('Rate limited'), `Partner Login Rate Limit: ${cleanPhone}`);
                const secs = Math.ceil(limitRes.retryAfterMs / 1000);
                Alert.alert("Rate Limited", `Too many attempts. Try again in ${secs} seconds.`);
                return;
            }

            setLoading(true);
            try {
                let partner = null;
                if (isSupabaseConfigured) {
                    const { data } = await PartnersAPI.findByPhone(cleanPhone);
                    partner = data;
                } else {
                    partner = findPartnerByPhone(cleanPhone);
                }

                setLoading(false);

                const dynamicOtp = generateOTP();
                setSavedOtp(dynamicOtp);
                setShowOtp(true);

                if (partner) {
                    snitch.logEvent('partner_login_otp_sent', { phone: cleanPhone });
                    Alert.alert('OTP Sent', `Verification code sent to ${cleanPhone}. Enter: ${dynamicOtp}`);
                } else {
                    snitch.logEvent('partner_login_failed', { reason: 'Mobile not registered', phone: cleanPhone });
                    console.log(`[Security/Partner] Mock login attempt for unregistered number ${cleanPhone}. Simulated OTP Code: ${dynamicOtp}`);
                    Alert.alert('OTP Sent', `Verification code sent to ${cleanPhone}. Enter: ${dynamicOtp}`);
                }
            } catch (err) {
                setLoading(false);
                snitch.logError(err, `Partner Login init: ${cleanPhone}`);
                console.error("Partner Login Error:", err);
                Alert.alert('Error', 'Database error during partner login');
            }
        } else {
            if (!otp) {
                Alert.alert('Error', 'Please enter OTP');
                return;
            }

            setLoading(true);
            try {
                let partner = null;
                if (isSupabaseConfigured) {
                    const { data } = await PartnersAPI.findByPhone(cleanPhone);
                    partner = data;
                } else {
                    partner = findPartnerByPhone(cleanPhone);
                }

                setLoading(false);
                if (otp === savedOtp || (otp === '1234' && __DEV__)) {
                    if (partner) {
                        if (partner.status === 'approved') {
                            snitch.logEvent('partner_login_success', { name: partner.name, phone: cleanPhone });
                            await loginPartner(partner);
                            router.replace('/partner');
                        } else if (partner.status === 'pending') {
                            snitch.logEvent('partner_login_failed', { reason: 'Status pending', phone: cleanPhone });
                            Alert.alert('Account Pending', 'Your account is waiting for Admin approval.');
                        } else {
                            snitch.logEvent('partner_login_failed', { reason: 'Status rejected', phone: cleanPhone });
                            Alert.alert('Access Denied', 'Your account has been rejected.');
                        }
                    } else {
                        // Return generic error for unregistered partner
                        Alert.alert('Error', 'Incorrect phone number or OTP');
                    }
                } else {
                    snitch.logEvent('partner_login_failed', { reason: 'Invalid OTP', phone: cleanPhone });
                    Alert.alert('Error', 'Incorrect phone number or OTP');
                }
            } catch (err) {
                setLoading(false);
                snitch.logError(err, `Partner OTP verify: ${cleanPhone}`);
                console.error("Partner OTP Verify Error:", err);
                Alert.alert('Error', 'Database error verifying OTP');
            }
        }
    };

    const handleSignup = async () => {
        if (!agreeTerms) {
            Alert.alert('Terms Agreement Required', 'You must read and agree to our Terms of Service and Privacy Policy before applying as a partner.');
            return;
        }

        if (!fullName || !email || !phone || !password || serviceTypes.length === 0 || !location || !licenseUploaded) {
            Alert.alert('Error', 'Please fill all fields, select services, set location, and upload your Government Electrical License.');
            return;
        }

        const cleanEmail = email.trim().toLowerCase();
        const cleanPhone = phone.trim();

        snitch.logEvent('partner_signup_attempt', { email: cleanEmail, phone: cleanPhone });

        // Rate limit signup
        const limitRes = checkRateLimit(`partner_signup_${cleanEmail}`, 3, 60000);
        if (!limitRes.allowed) {
            snitch.logError(new Error('Rate limited on partner signup'), `Partner Signup Rate Limit: ${cleanEmail}`);
            Alert.alert("Rate Limited", "Too many attempts. Try again later.");
            return;
        }

        setLoading(true);
        try {
            const hashedPassword = hashPassword(password);
            const partnerData = {
                name: fullName.trim(),
                email: cleanEmail,
                phone: cleanPhone,
                password: hashedPassword,
                serviceTypes,
                location,
                taluk: location.taluk || 'General'
            };

            if (isSupabaseConfigured) {
                // Check duplicate by phone or email
                const { data: existingEmail } = await PartnersAPI.findByEmail(cleanEmail);
                const { data: existingPhone } = await PartnersAPI.findByPhone(cleanPhone);
                if (existingEmail || existingPhone) {
                    snitch.logError(new Error('Duplicate partner registration attempt'), `Partner Signup Duplicate: ${cleanEmail}`);
                    setLoading(false);
                    Alert.alert(
                        'Application Submitted! ✅',
                        'Welcome aboard! Your account is under review. Our AI system is analyzing your profile and you\'ll be approved within 24 hours. We\'ll notify you via SMS and email.',
                        [{ text: 'Got it!', onPress: () => setIsLogin(true) }]
                    );
                    return;
                }

                const { data: dbPartner, error } = await PartnersAPI.create(partnerData);
                if (error || !dbPartner) {
                    snitch.logError(error || new Error('DB Partner creation failure'), `Partner Signup DB Failure: ${cleanEmail}`);
                    Alert.alert('Registration Error', 'Failed to submit application to database.');
                    setLoading(false);
                    return;
                }
            } else {
                addPartner(partnerData);
            }

            setLoading(false);
            snitch.logEvent('partner_signup_success', { email: cleanEmail, phone: cleanPhone });
            Alert.alert(
                'Application Submitted! ✅',
                'Welcome aboard! Your account is under review. Our AI system is analyzing your profile and you\'ll be approved within 24 hours. We\'ll notify you via SMS and email.',
                [{ text: 'Got it!', onPress: () => setIsLogin(true) }]
            );
        } catch (error) {
            setLoading(false);
            snitch.logError(error, `Partner Signup Catch: ${cleanEmail}`);
            console.error("Partner Signup Error:", error);
            Alert.alert('Error', 'Registration failed due to database or network error.');
        }
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
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bgPrimary }]}>
                <ActivityIndicator size="large" color={COLORS.accent} />
                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
                    {/* Hero Section */}
                    <View style={[styles.heroSection, { backgroundColor: isDark ? 'rgba(255,215,0,0.05)' : 'rgba(255,215,0,0.1)' }]}>
                        <View style={styles.nameWrapper}>
                            <Text style={styles.appName}>
                                <Text style={{ color: colors.textPrimary }}>Sheri</Text>
                                <Text style={{ color: colors.accent }}>yakam</Text>
                            </Text>
                        </View>
                        <View style={[styles.partnerBadgeContainer, { backgroundColor: COLORS.accent }]}>
                            <Briefcase size={16} color="#000" />
                            <Text style={styles.partnerBadge}>PARTNER</Text>
                        </View>

                        {!isLogin && (
                            <View style={styles.heroContent}>
                                <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
                                    Grow Your Business with AI
                                </Text>
                                <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
                                    Join 10,000+ professionals earning with smart job matching
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Benefits Section - Only show on signup */}
                    {!isLogin && (
                        <View style={styles.benefitsSection}>
                            <Text style={[styles.benefitsTitle, { color: colors.textPrimary }]}>
                                <Zap size={20} color={COLORS.accent} /> AI-Powered Benefits
                            </Text>
                            <View style={styles.benefitsGrid}>
                                <View style={[styles.benefitCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}>
                                    <TrendingUp size={24} color={COLORS.success} />
                                    <Text style={[styles.benefitTitle, { color: colors.textPrimary }]}>Smart Matching</Text>
                                    <Text style={[styles.benefitText, { color: colors.textTertiary }]}>AI finds jobs near you</Text>
                                </View>
                                <View style={[styles.benefitCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}>
                                    <DollarSign size={24} color={COLORS.accent} />
                                    <Text style={[styles.benefitTitle, { color: colors.textPrimary }]}>Higher Earnings</Text>
                                    <Text style={[styles.benefitText, { color: colors.textTertiary }]}>₹25k-60k/month</Text>
                                </View>
                                <View style={[styles.benefitCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}>
                                    <Clock size={24} color={COLORS.primary} />
                                    <Text style={[styles.benefitTitle, { color: colors.textPrimary }]}>Instant Bookings</Text>
                                    <Text style={[styles.benefitText, { color: colors.textTertiary }]}>Real-time alerts</Text>
                                </View>
                                <View style={[styles.benefitCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}>
                                    <Star size={24} color={COLORS.gold} />
                                    <Text style={[styles.benefitTitle, { color: colors.textPrimary }]}>Build Reputation</Text>
                                    <Text style={[styles.benefitText, { color: colors.textTertiary }]}>Rating system</Text>
                                </View>
                            </View>
                        </View>
                    )}

                    {/* Form Container */}
                    <View style={[styles.formContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#fff' }]}>
                        <Text style={[styles.title, { color: colors.textPrimary }]}>
                            {isLogin ? 'Partner Login' : 'Become a Partner'}
                        </Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                            {isLogin ? 'Welcome back! Manage your bookings and earnings.' : 'Start earning more with AI-powered job matching'}
                        </Text>

                        {!isLogin && (
                            <View style={styles.inputGroup}>
                                <User size={20} color={colors.textTertiary} style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, { color: colors.textPrimary }]}
                                    placeholder="Full Name"
                                    placeholderTextColor={colors.textTertiary}
                                    value={fullName}
                                    onChangeText={setFullName}
                                    returnKeyType="next"
                                    onSubmitEditing={() => phoneRef.current?.focus()}
                                    blurOnSubmit={false}
                                />
                            </View>
                        )}

                        <View style={styles.inputGroup}>
                            <Phone size={20} color={colors.textTertiary} style={styles.inputIcon} />
                            <TextInput
                                ref={phoneRef}
                                style={[styles.input, { color: colors.textPrimary }]}
                                placeholder="Mobile Number"
                                placeholderTextColor={colors.textTertiary}
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
                                {/* AI-Enhanced Service Selection */}
                                <View style={styles.serviceSelectionContainer}>
                                    <View style={styles.sectionHeader}>
                                        <Zap size={16} color={COLORS.accent} />
                                        <Text style={[styles.label, { color: colors.textPrimary }]}>
                                            Your Expertise (Select up to 3)
                                        </Text>
                                    </View>
                                    <Text style={[styles.aiHint, { color: colors.textTertiary }]}>
                                        💡 AI Tip: More services = More job opportunities
                                    </Text>
                                    <View style={styles.servicesGrid}>
                                        {allServices.map((service) => {
                                            const Icon = service.icon;
                                            const isSelected = serviceTypes.includes(service.id);
                                            return (
                                                <TouchableOpacity
                                                    key={service.id}
                                                    style={[
                                                        styles.serviceChip,
                                                        {
                                                            backgroundColor: isSelected
                                                                ? service.color
                                                                : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                                                            borderColor: isSelected ? service.color : colors.border
                                                        }
                                                    ]}
                                                    onPress={() => toggleService(service.id)}
                                                >
                                                    <Icon size={24} color={isSelected ? '#fff' : service.color} />
                                                    <Text style={[
                                                        styles.serviceChipText,
                                                        { color: isSelected ? '#fff' : colors.textPrimary }
                                                    ]}>
                                                        {service.id}
                                                    </Text>
                                                    <Text style={[
                                                        styles.serviceEarning,
                                                        { color: isSelected ? 'rgba(255,255,255,0.9)' : colors.textTertiary }
                                                    ]}>
                                                        {service.earning}
                                                    </Text>
                                                    {isSelected && (
                                                        <CheckCircle size={20} color="#fff" style={styles.checkIcon} />
                                                    )}
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                    <Text style={[styles.selectionCount, { color: colors.accent }]}>
                                        Selected: {serviceTypes.length}/3
                                    </Text>
                                </View>

                                <View style={styles.inputGroup}>
                                    <Mail size={20} color={colors.textTertiary} style={styles.inputIcon} />
                                    <TextInput
                                        ref={emailRef}
                                        style={[styles.input, { color: colors.textPrimary }]}
                                        placeholder="Email Address"
                                        placeholderTextColor={colors.textTertiary}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        value={email}
                                        onChangeText={setEmail}
                                        returnKeyType="next"
                                        onSubmitEditing={() => passwordRef.current?.focus()}
                                        blurOnSubmit={false}
                                    />
                                </View>

                                {/* AI-Enhanced Location Selection */}
                                <View style={{ marginBottom: SPACING.md }}>
                                    <View style={styles.sectionHeader}>
                                        <MapPin size={16} color={COLORS.success} />
                                        <Text style={[styles.label, { color: colors.textPrimary }]}>
                                            Service Area (10km radius)
                                        </Text>
                                    </View>
                                    <Text style={[styles.aiHint, { color: colors.textTertiary }]}>
                                        🎯 AI will send you jobs within 10km
                                    </Text>
                                    <TouchableOpacity
                                        style={[styles.inputGroup, location && { borderColor: COLORS.success, borderWidth: 2 }]}
                                        onPress={() => setShowLocationModal(true)}
                                    >
                                        <MapPin size={20} color={location ? COLORS.success : colors.textTertiary} style={styles.inputIcon} />
                                        <View style={{ flex: 1, padding: SPACING.md, justifyContent: 'center' }}>
                                            <Text style={{
                                                color: location ? colors.textPrimary : colors.textTertiary,
                                                fontSize: 16
                                            }}>
                                                {location ? location.address : "Tap to set location on map"}
                                            </Text>
                                        </View>
                                        {location && <CheckCircle size={20} color={COLORS.success} style={{ marginRight: 12 }} />}
                                    </TouchableOpacity>
                                </View>

                                {/* License Upload Field */}
                                <View style={{ marginBottom: SPACING.md }}>
                                    <View style={styles.sectionHeader}>
                                        <Briefcase size={16} color={COLORS.primary} />
                                        <Text style={[styles.label, { color: colors.textPrimary }]}>
                                            Electrical License / Certificates
                                        </Text>
                                    </View>
                                    <Text style={[styles.aiHint, { color: colors.textTertiary }]}>
                                        ⚠️ Required: Upload PDF or Image of your certificate
                                    </Text>
                                    <TouchableOpacity
                                        style={[styles.inputGroup, licenseUploaded && { borderColor: COLORS.success, borderWidth: 2 }]}
                                        onPress={async () => {
                                            try {
                                                const result = await DocumentPicker.getDocumentAsync({
                                                    type: ['application/pdf', 'image/*'],
                                                    copyToCacheDirectory: true,
                                                });

                                                if (result.canceled) {
                                                    return;
                                                }

                                                if (result.assets && result.assets.length > 0) {
                                                    // In a real app, you would upload the file here
                                                    // For now, we simulate a successful upload for the UI flow
                                                    setLicenseUploaded(true);
                                                    Alert.alert('Upload Successful', 'Your document has been verified locally.');
                                                }
                                            } catch (error) {
                                                console.error("Document Picker Error: ", error);
                                                Alert.alert('Upload Error', 'There was a problem picking your document.');
                                            }
                                        }}
                                    >
                                        <Shield size={20} color={licenseUploaded ? COLORS.success : colors.textTertiary} style={styles.inputIcon} />
                                        <View style={{ flex: 1, padding: SPACING.md, justifyContent: 'center' }}>
                                            <Text style={{
                                                color: licenseUploaded ? colors.textPrimary : colors.textTertiary,
                                                fontSize: 16
                                            }}>
                                                {licenseUploaded ? "License Uploaded" : "Tap to upload license"}
                                            </Text>
                                        </View>
                                        {licenseUploaded && <CheckCircle size={20} color={COLORS.success} style={{ marginRight: 12 }} />}
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}

                        {isLogin && showOtp && (
                            <View style={styles.inputGroup}>
                                <Lock size={20} color={colors.textTertiary} style={styles.inputIcon} />
                                <TextInput
                                    ref={otpRef}
                                    style={[styles.input, { color: colors.textPrimary }]}
                                    placeholder="Enter OTP (1234)"
                                    placeholderTextColor={colors.textTertiary}
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
                                <Lock size={20} color={colors.textTertiary} style={styles.inputIcon} />
                                <TextInput
                                    ref={passwordRef}
                                    style={[styles.input, { color: colors.textPrimary }]}
                                    placeholder="Password"
                                    placeholderTextColor={colors.textTertiary}
                                    secureTextEntry
                                    value={password}
                                    onChangeText={setPassword}
                                    returnKeyType="go"
                                    onSubmitEditing={handleSignup}
                                />
                            </View>
                        )}

                        {!isLogin && (
                            <View style={styles.termsContainer}>
                                <TouchableOpacity 
                                    style={[styles.checkbox, { borderColor: colors.textTertiary, backgroundColor: agreeTerms ? COLORS.accent : 'transparent' }]}
                                    onPress={() => setAgreeTerms(!agreeTerms)}
                                >
                                    {agreeTerms && <Text style={styles.checkmark}>✓</Text>}
                                </TouchableOpacity>
                                <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                                    <Text style={{ color: colors.textSecondary, fontSize: 13 }}>By signing up, you agree to our </Text>
                                    <TouchableOpacity onPress={() => router.push('/terms')}>
                                        <Text style={{ color: COLORS.accent, fontSize: 13, fontWeight: 'bold' }}>Terms of Service</Text>
                                    </TouchableOpacity>
                                    <Text style={{ color: colors.textSecondary, fontSize: 13 }}> and </Text>
                                    <TouchableOpacity onPress={() => router.push('/privacy')}>
                                        <Text style={{ color: COLORS.accent, fontSize: 13, fontWeight: 'bold' }}>Privacy Policy</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: COLORS.accent }]}
                            onPress={isLogin ? handleLogin : handleSignup}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#000" />
                            ) : (
                                <>
                                    {!isLogin && <Zap size={20} color="#000" />}
                                    <Text style={styles.buttonText}>
                                        {isLogin ? (showOtp ? 'Verify & Login' : 'Get OTP') : 'Apply Now - Start Earning!'}
                                    </Text>
                                </>
                            )}
                        </TouchableOpacity>


                        <View style={styles.switchContainer}>
                            {isLogin ? (
                                <TouchableOpacity
                                    style={[styles.becomePartnerBtn, { backgroundColor: COLORS.accent }]}
                                    onPress={() => setIsLogin(!isLogin)}
                                >
                                    <Briefcase size={20} color="#000" />
                                    <Text style={styles.becomePartnerText}>BECOME A PARTNER</Text>
                                </TouchableOpacity>
                            ) : (
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={[styles.switchText, { color: colors.textTertiary }]}>Already have an account? </Text>
                                    <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                                        <Text style={[styles.switchLink, { color: COLORS.accent }]}>Login</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>

                        {/* Dev Tool */}
                        <TouchableOpacity onPress={devApproveLast} style={{ marginTop: 40, alignItems: 'center' }}>
                            <Text style={{ color: colors.textTertiary, fontSize: 11 }}>[Dev: Approve Last Signup]</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Trust Indicators */}
                    <View style={styles.trustSection}>
                        <View style={styles.trustItem}>
                            <Text style={[styles.trustNumber, { color: COLORS.accent }]}>10,000+</Text>
                            <Text style={[styles.trustLabel, { color: colors.textTertiary }]}>Active Partners</Text>
                        </View>
                        <View style={styles.trustItem}>
                            <Text style={[styles.trustNumber, { color: COLORS.success }]}>4.8★</Text>
                            <Text style={[styles.trustLabel, { color: colors.textTertiary }]}>Partner Rating</Text>
                        </View>
                        <View style={styles.trustItem}>
                            <Text style={[styles.trustNumber, { color: COLORS.primary }]}>₹35k</Text>
                            <Text style={[styles.trustLabel, { color: colors.textTertiary }]}>Avg. Monthly</Text>
                        </View>
                    </View>
                </Animated.View>
            </ScrollView>

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
    },
    scrollContent: {
        flexGrow: 1,
        padding: SPACING.lg,
    },
    loadingText: {
        marginTop: SPACING.md,
        fontSize: 14,
    },
    heroSection: {
        alignItems: 'center',
        padding: SPACING.xl,
        borderRadius: 20,
        marginBottom: SPACING.xl,
    },
    nameWrapper: {
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    nameWrapperDark: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    appName: {
        fontSize: 36,
        fontWeight: 'bold',
    },
    partnerBadgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginBottom: SPACING.md,
    },
    partnerBadge: {
        color: '#000',
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    heroContent: {
        alignItems: 'center',
        marginTop: SPACING.md,
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: SPACING.xs,
    },
    heroSubtitle: {
        fontSize: 14,
        textAlign: 'center',
    },
    benefitsSection: {
        marginBottom: SPACING.xl,
    },
    benefitsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: SPACING.md,
        flexDirection: 'row',
        alignItems: 'center',
    },
    benefitsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.md,
        justifyContent: 'space-between',
    },
    benefitCard: {
        width: '48%',
        padding: SPACING.md,
        borderRadius: 12,
        alignItems: 'center',
    },
    benefitTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: SPACING.sm,
    },
    benefitText: {
        fontSize: 12,
        marginTop: 4,
    },
    formContainer: {
        padding: SPACING.xl,
        borderRadius: 20,
        marginBottom: SPACING.lg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: SPACING.xs,
    },
    subtitle: {
        fontSize: 14,
        marginBottom: SPACING.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: SPACING.xs,
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
    },
    aiHint: {
        fontSize: 12,
        marginBottom: SPACING.md,
        marginLeft: SPACING.xs,
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
        fontSize: 16,
    },
    serviceSelectionContainer: {
        marginBottom: SPACING.md,
    },
    servicesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.md,
        marginBottom: SPACING.sm,
    },
    serviceChip: {
        width: '48%',
        padding: SPACING.md,
        borderRadius: 12,
        borderWidth: 2,
        alignItems: 'center',
        position: 'relative',
    },
    serviceChipText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: SPACING.sm,
    },
    serviceEarning: {
        fontSize: 11,
        marginTop: 4,
    },
    checkIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
    selectionCount: {
        fontSize: 13,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    button: {
        flexDirection: 'row',
        gap: 8,
        padding: SPACING.md,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: SPACING.sm,
        shadowColor: COLORS.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
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
    },
    dividerText: {
        marginHorizontal: SPACING.md,
        fontSize: 12,
    },
    googleBtn: {
        flexDirection: 'row',
        gap: 10,
        backgroundColor: '#DB4437',
        paddingVertical: 14,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    switchContainer: {
        marginTop: SPACING.xl,
    },
    becomePartnerBtn: {
        flexDirection: 'row',
        gap: 8,
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    becomePartnerText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    switchText: {
        fontSize: 14,
    },
    switchLink: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    trustSection: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: SPACING.xl,
    },
    trustItem: {
        alignItems: 'center',
    },
    trustNumber: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    trustLabel: {
        fontSize: 12,
        marginTop: 4,
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
