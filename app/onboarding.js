import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShieldCheck, Zap, Clock, MapPin, ChevronRight, Check, Sparkles } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { Button } from '../components/ui/Button';
import { PushNotificationModal } from '../components/PushNotificationModal';

const { width } = Dimensions.get('window');

const SLIDES = [
    {
        id: '1',
        title: 'Certified Electricians\nat Your Doorstep',
        subtitle: 'Verified government-licensed electricians across Kerala ready for fast home dispatch.',
        icon: Zap,
        badge: 'Kerala License Certified',
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
    },
    {
        id: '2',
        title: '30-Minute Emergency\nRapid Dispatch',
        subtitle: 'Power outages, short circuits, or sparking boards? Get priority response within 30 minutes in Kozhikode.',
        icon: Clock,
        badge: 'Emergency Response',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    },
    {
        id: '3',
        title: 'Transparent Pricing &\n30-Day Guarantee',
        subtitle: 'No hidden charges. Standard rate cards, digital invoices, and free rework warranty.',
        icon: ShieldCheck,
        badge: '100% Satisfaction Warranty',
        image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80',
    },
];

export default function OnboardingScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';

    const [currentIndex, setCurrentIndex] = useState(0);
    const [showPushModal, setShowPushModal] = useState(false);

    const handleNext = () => {
        if (currentIndex < SLIDES.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        } else {
            setShowPushModal(true);
        }
    };

    const handleFinish = () => {
        router.replace('/');
    };

    const currentSlide = SLIDES[currentIndex];
    const SlideIcon = currentSlide.icon;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#FFFFFF' }]}>
            {/* Top Bar */}
            <View style={styles.topBar}>
                <View style={styles.brandRow}>
                    <Zap size={22} color={colors.accent} />
                    <Text style={[styles.brandText, { color: colors.textPrimary }]}>Sheriyakam</Text>
                </View>

                {currentIndex < SLIDES.length - 1 ? (
                    <TouchableOpacity onPress={handleFinish} style={styles.skipBtn}>
                        <Text style={[styles.skipText, { color: colors.textTertiary }]}>Skip</Text>
                    </TouchableOpacity>
                ) : null}
            </View>

            {/* Slide Content */}
            <View style={styles.slideBody}>
                <View style={[styles.imageContainer, { borderColor: isDark ? '#27272A' : '#E4E4E7' }]}>
                    <Image source={{ uri: currentSlide.image }} style={styles.slideImage} />
                    <View style={[styles.badgePill, { backgroundColor: isDark ? '#18181BE0' : '#FFFFFFE0' }]}>
                        <SlideIcon size={14} color={colors.accent} />
                        <Text style={[styles.badgeText, { color: colors.textPrimary }]}>{currentSlide.badge}</Text>
                    </View>
                </View>

                <View style={styles.textWrap}>
                    <Text style={[styles.slideTitle, { color: colors.textPrimary }]}>
                        {currentSlide.title}
                    </Text>
                    <Text style={[styles.slideSubtitle, { color: colors.textSecondary }]}>
                        {currentSlide.subtitle}
                    </Text>
                </View>
            </View>

            {/* Bottom Controls */}
            <View style={styles.bottomControls}>
                {/* Pagination Dots */}
                <View style={styles.dotsRow}>
                    {SLIDES.map((_, idx) => {
                        const isActive = currentIndex === idx;
                        return (
                            <View
                                key={idx}
                                style={[
                                    styles.dot,
                                    {
                                        width: isActive ? 24 : 8,
                                        backgroundColor: isActive ? colors.accent : isDark ? '#27272A' : '#D4D4D8',
                                    }
                                ]}
                            />
                        );
                    })}
                </View>

                <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onPress={handleNext}
                    iconRight={currentIndex === SLIDES.length - 1 ? Check : ChevronRight}
                >
                    {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Continue'}
                </Button>
            </View>

            {/* Push Notification Primer on Onboarding Completion */}
            <PushNotificationModal
                visible={showPushModal}
                onClose={handleFinish}
                onEnable={handleFinish}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 12,
    },
    brandRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    brandText: {
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    skipBtn: {
        padding: 8,
    },
    skipText: {
        fontSize: 14,
        fontWeight: '600',
    },
    slideBody: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    imageContainer: {
        width: '100%',
        height: 280,
        borderRadius: 24,
        borderWidth: 1.5,
        overflow: 'hidden',
        position: 'relative',
        marginBottom: 28,
    },
    slideImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    badgePill: {
        position: 'absolute',
        bottom: 14,
        left: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '700',
    },
    textWrap: {
        alignItems: 'center',
        maxWidth: 340,
    },
    slideTitle: {
        fontSize: 24,
        fontWeight: '800',
        textAlign: 'center',
        letterSpacing: -0.5,
        lineHeight: 32,
        marginBottom: 10,
    },
    slideSubtitle: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 21,
    },
    bottomControls: {
        paddingHorizontal: 24,
        paddingBottom: Platform.OS === 'ios' ? 24 : 32,
        gap: 20,
    },
    dotsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    dot: {
        height: 8,
        borderRadius: 4,
    },
});
