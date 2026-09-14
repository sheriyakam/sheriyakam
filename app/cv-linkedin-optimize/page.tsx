import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Head from 'expo-router/head';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';

// Import all 9 modular components
import { NavBar } from './components/NavBar';
import { HeroSection } from './components/HeroSection';
import { DemoWidget } from './components/DemoWidget';
import { WhyItWorksSection } from './components/WhyItWorksSection';
import { FeatureBlocks } from './components/FeatureBlocks';
import { PricingSection } from './components/PricingSection';
import { FAQSection } from './components/FAQSection';
import { FinalCTASection } from './components/FinalCTASection';
import { Footer } from './components/Footer';

interface CvLinkedinOptimizePageProps {
    onNavigateBuilder?: () => void;
    onNavigateLinkedIn?: () => void;
    onNavigateTemplates?: () => void;
    activeTab?: string;
}

export default function CvLinkedinOptimizePage({
    onNavigateBuilder,
    onNavigateLinkedIn,
    onNavigateTemplates,
    activeTab = 'home'
}: CvLinkedinOptimizePageProps) {
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';

    const handleTailorResume = () => {
        if (onNavigateBuilder) {
            onNavigateBuilder();
        }
    };

    return (
        <SafeAreaView style={[styles.screen, { backgroundColor: isDark ? '#080B11' : '#F8FAFC' }]} edges={['top']}>
            <Head>
                {/* Point 51: Distinct title per page & distinct meta description */}
                <title>Tailor Your Best Resume for Every Single Job | Sheriyakam AI</title>
                <meta name="description" content="Increase interview calls with AI resume scoring and job description tailoring. It only ever rewrites experience you already have. Never invents any. 5 free ATS checks every 5 hours." />
                <meta name="keywords" content="resume builder, ATS score checker, job description tailor, Ruvalo AI clone, AI resume optimizer, LinkedIn profile optimizer, resume keywords, anti-fabrication resume" />
                
                {/* Point 55: Canonical URL set correctly per route */}
                <link rel="canonical" href="https://sheriyakam.vercel.app/cv-linkedin-optimize" />
                
                {/* Point 54: robots: index, follow */}
                <meta name="robots" content="index, follow" />
                
                {/* Point 53: theme-color meta tag matching brand color (#10B981) */}
                <meta name="theme-color" content="#10B981" />
                <meta name="msapplication-TileColor" content="#10B981" />

                {/* Point 52: Open Graph + Twitter Card (1200x630) auto-generated per page */}
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="Sheriyakam.ai" />
                <meta property="og:title" content="Tailor your best resume for every single job — Sheriyakam" />
                <meta property="og:description" content="More interview calls through honest AI scoring & tailoring per job description. It only ever rewrites experience you already have. Never invents any." />
                <meta property="og:url" content="https://sheriyakam.vercel.app/cv-linkedin-optimize" />
                <meta property="og:image" content="https://sheriyakam.vercel.app/og-resume-1200x630.png" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@sheriyakam" />
                <meta name="twitter:title" content="Tailor your best resume for every single job — Sheriyakam" />
                <meta name="twitter:description" content="More interview calls through honest AI scoring & tailoring per job description. No credit card required." />
                <meta name="twitter:image" content="https://sheriyakam.vercel.app/og-resume-1200x630.png" />
            </Head>

            {/* 1. Navigation Shell */}
            <NavBar
                onOpenBuilder={handleTailorResume}
                onOpenLinkedIn={onNavigateLinkedIn}
                onOpenTemplates={onNavigateTemplates}
                activeTab={activeTab}
            />

            {/* Main Content Body */}
            <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
                {/* 2. Hero Section */}
                <HeroSection onTailorResume={handleTailorResume} />

                {/* 3. Demo Widget (Centerpiece) */}
                <DemoWidget onOpenBuilder={handleTailorResume} />

                {/* 4. Why It Works Section */}
                <WhyItWorksSection />

                {/* 5. Numbered 01/02/03 Feature Blocks */}
                <FeatureBlocks />

                {/* 6. Pricing Section with FIFO Explainer */}
                <PricingSection onSelectPlan={handleTailorResume} />

                {/* 7. FAQ Section with Verified Accordion Expansion */}
                <FAQSection />

                {/* 8. Final Conversion CTA Section */}
                <FinalCTASection onTailorResume={handleTailorResume} />

                {/* 9. Footer with Job-Category Grid */}
                <Footer />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    scrollContent: {
        padding: 16,
        gap: 24,
        maxWidth: 960,
        width: '100%',
        alignSelf: 'center'
    }
});
