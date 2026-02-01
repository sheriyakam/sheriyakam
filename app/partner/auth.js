import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator, Animated } from 'react-native';
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

export default function PartnerAuth() {
    const router = useRouter();
    const { theme, colors } = useTheme();
    const isDark = theme === 'dark';
    const [isLogin, setIsLogin] = useState(true);
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
    const [showOtp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState('');

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
                            loginPartner(partner);
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
                    serviceTypes,
                    location,
                });
                setLoading(false);
                Alert.alert(
                    'Application Submitted! ✅',
                    'Welcome aboard! Your account is under review. Our AI system is analyzing your profile and you\'ll be approved within 24 hours. We\'ll notify you via SMS and email.',
                    [{ text: 'Got it!', onPress: () => setIsLogin(true) }]
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
                        <View style={[styles.nameWrapper, isDark && styles.nameWrapperDark]}>
                            <Text style={styles.appName}>
                                <Text style={{ color: '#001F3F' }}>Sheri</Text>
                                <Text style={{ color: COLORS.accent }}>yakam</Text>
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
                                    Join{!isLogin && (
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

                            {/* Social Login */}
                            <View style={styles.socialContainer}>
                                <View style={styles.dividerContainer}>
                                    <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                                    <Text style={[styles.dividerText, { color: colors.textTertiary }]}>or continue with</Text>
                                    <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                                </View>
                                <TouchableOpacity
                                    style={styles.googleBtn}
                                    onPress={() => Alert.alert('Coming Soon', 'Google login is under development.')}
                                >
                                    <Mail size={20} color="#fff" />
                                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Continue with Google</Text>
                                </TouchableOpacity>
                            </View>

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
        </SafeAreaView>
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
});
