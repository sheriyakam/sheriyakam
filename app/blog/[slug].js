import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Share, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Share2, Clock, Calendar, ShieldCheck, Check, Sparkles, Wrench } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';

const POST_DETAILS = {
    'monsoon-electrical-safety-kerala': {
        title: '5 Essential Monsoon Electrical Safety Checks for Kerala Homes',
        category: 'Monsoon Prep',
        readTime: '4 min read',
        date: 'Aug 12, 2026',
        author: 'Sanoop K. (Master Electrician)',
        image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=900&auto=format&fit=crop&q=80',
        content: `Heavy monsoon showers across Kerala often lead to dangerous electrical faults such as wall dampness leakage, MCB nuisance tripping, and sudden lightning surges.

1. Test Your Earth Leakage Circuit Breaker (ELCB / RCCB)
Press the 'Test' (T) push button on your main distribution box once every month. If the breaker does not instantly trip down, your RCCB mechanism is jammed and will not protect against electric shock.

2. Check the Earthing Pit Resistance
Monsoon moisture improves soil conductivity, but salt and charcoal in old earthing pits can wash away. Ensure your earth-to-neutral voltage reading stays strictly below 2.0 Volts AC.

3. Isolate Outdoor Lights and Garden Sockets
Ensure all boundary wall gate lights and water pump connections use IP65 weatherproof junction boxes with silicon rubber gaskets.

4. Install Type 2 Surge Protective Devices (SPD)
With Kerala experiencing high lightning frequency during Thulaavarsham, a certified SPD protects LED TVs, inverters, and refrigerators from destructive voltage spikes.

5. Keep Inverter Batteries off Concrete Floors
Store inverter batteries on elevated plastic or wooden stands to prevent moisture condensation and parasitic ground discharge.`,
    },
    'default': {
        title: 'Complete Domestic Electrical Maintenance Guide',
        category: 'Electrical Safety',
        readTime: '5 min read',
        date: 'Aug 2026',
        author: 'Sheriyakam Technical Desk',
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=900&auto=format&fit=crop&q=80',
        content: `Regular inspection of modular switches, circuit breaker sensitivity, and earthing continuity is the foundation of a safe, fire-free home.

Always consult verified, government-licensed wiremen for concealed wiring alterations or heavy appliance installations.`,
    }
};

export default function SingleBlogPostScreen() {
    const { slug } = useLocalSearchParams();
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { success } = useToast();
    const isDark = theme === 'dark';

    const post = POST_DETAILS[slug] || POST_DETAILS['default'];

    const handleShare = async () => {
        try {
            await Share.share({
                title: post.title,
                message: `${post.title} — Read this electrical safety guide on Sheriyakam: https://sheriyakam.com/blog/${slug}`,
            });
        } catch (e) {}
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text numberOfLines={1} style={[styles.headerTitle, { color: colors.textPrimary }]}>
                    {post.title}
                </Text>
                <TouchableOpacity onPress={handleShare} style={styles.shareBtn}>
                    <Share2 size={20} color={colors.textPrimary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Hero Image */}
                <Image source={{ uri: post.image }} style={styles.heroImage} />

                {/* Meta Header */}
                <View style={styles.metaSection}>
                    <Badge variant="info">{post.category}</Badge>
                    <Text style={[styles.postTitle, { color: colors.textPrimary }]}>
                        {post.title}
                    </Text>

                    <View style={styles.authorRow}>
                        <Avatar name={post.author} size={36} />
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.authorName, { color: colors.textPrimary }]}>
                                {post.author}
                            </Text>
                            <Text style={[styles.authorDate, { color: colors.textTertiary }]}>
                                {post.date} • {post.readTime}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Article Body */}
                <Card variant="default" style={styles.bodyCard}>
                    <Text style={[styles.bodyText, { color: colors.textPrimary }]}>
                        {post.content}
                    </Text>
                </Card>

                {/* In-Article Booking Banner */}
                <Card variant="elevated" style={styles.ctaCard}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <Wrench size={22} color={colors.accent} />
                        <Text style={[styles.ctaTitle, { color: colors.textPrimary }]}>
                            Need a Home Earthing Inspection?
                        </Text>
                    </View>
                    <Text style={[styles.ctaDesc, { color: colors.textSecondary }]}>
                        Book a certified master electrician in Kozhikode for a complete 18-point safety and voltage diagnostic for just ₹149.
                    </Text>
                    <Button
                        variant="primary"
                        size="md"
                        fullWidth
                        onPress={() => router.push('/search')}
                        style={{ marginTop: 12 }}
                    >
                        Schedule Safety Diagnostic (₹149)
                    </Button>
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    backBtn: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
        flex: 1,
        marginHorizontal: 10,
    },
    shareBtn: {
        padding: 4,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 50,
    },
    heroImage: {
        width: '100%',
        height: 220,
        borderRadius: 18,
        resizeMode: 'cover',
        marginBottom: 16,
    },
    metaSection: {
        gap: 10,
        marginBottom: 16,
    },
    postTitle: {
        fontSize: 22,
        fontWeight: '800',
        letterSpacing: -0.3,
        lineHeight: 30,
    },
    authorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 6,
    },
    authorName: {
        fontSize: 13,
        fontWeight: '700',
    },
    authorDate: {
        fontSize: 11,
        marginTop: 1,
    },
    bodyCard: {
        padding: 18,
        marginBottom: 16,
    },
    bodyText: {
        fontSize: 15,
        lineHeight: 24,
        letterSpacing: 0.2,
    },
    ctaCard: {
        padding: 18,
    },
    ctaTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    ctaDesc: {
        fontSize: 13,
        lineHeight: 18,
    },
});
