import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, BookOpen, Clock, Calendar, ChevronRight, Sparkles } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Tabs';

export const BLOG_POSTS = [
    {
        slug: 'monsoon-electrical-safety-kerala',
        title: '5 Essential Monsoon Electrical Safety Checks for Kerala Homes',
        category: 'Monsoon Prep',
        readTime: '4 min read',
        date: 'Aug 12, 2026',
        image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&auto=format&fit=crop&q=80',
        excerpt: 'Heavy Malabar rains can cause wall dampness and earth leakage trips. Learn how to inspect your main MCB and earthing pit before the monsoon hits.',
    },
    {
        slug: 'inverter-battery-maintenance-guide',
        title: 'How to Extend Inverter Tubular Battery Life by 3+ Years',
        category: 'Inverters',
        readTime: '5 min read',
        date: 'Jul 28, 2026',
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
        excerpt: 'Distilled water top-up schedules, terminal corrosion prevention using petroleum jelly, and optimal charge settings for power cuts.',
    },
    {
        slug: 'reduce-kseb-electricity-bill-tips',
        title: '7 Practical Ways to Cut Your KSEB Electricity Bill by 25%',
        category: 'Electrical Safety',
        readTime: '6 min read',
        date: 'Jun 19, 2026',
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
        excerpt: 'From upgrading to 5-star BLDC ceiling fans to balancing your 3-phase domestic load to eliminate phantom standby power draw.',
    },
];

export default function BlogIndexScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';

    const [activeCategory, setActiveCategory] = useState('all');

    const tabs = [
        { id: 'all', label: 'All Guides' },
        { id: 'Monsoon Prep', label: 'Monsoon Prep' },
        { id: 'Inverters', label: 'Inverters' },
        { id: 'Electrical Safety', label: 'Safety Tips' },
    ];

    const filteredPosts = BLOG_POSTS.filter((post) => {
        if (activeCategory === 'all') return true;
        return post.category === activeCategory;
    });

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Electrical Safety Blog</Text>
                <View style={{ width: 32 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Hero */}
                <View style={styles.hero}>
                    <Badge variant="info">Homeowner Guides</Badge>
                    <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>
                        Expert Tips from Kerala Master Electricians
                    </Text>
                    <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
                        Practical safety guides, energy-saving insights, and maintenance tutorials for your domestic circuits.
                    </Text>
                </View>

                {/* Tabs */}
                <View style={styles.tabsWrap}>
                    <Tabs
                        tabs={tabs}
                        activeTab={activeCategory}
                        onChange={setActiveCategory}
                        variant="pills"
                    />
                </View>

                {/* Articles List */}
                <View style={styles.articlesList}>
                    {filteredPosts.map((post) => (
                        <TouchableOpacity
                            key={post.slug}
                            onPress={() => router.push(`/blog/${post.slug}`)}
                            activeOpacity={0.75}
                        >
                            <Card variant="default" style={styles.articleCard}>
                                <Image source={{ uri: post.image }} style={styles.postThumb} />

                                <View style={styles.postContent}>
                                    <View style={styles.badgeRow}>
                                        <Badge variant="info" size="sm">{post.category}</Badge>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                            <Clock size={12} color={colors.textTertiary} />
                                            <Text style={[styles.metaText, { color: colors.textTertiary }]}>{post.readTime}</Text>
                                        </View>
                                    </View>

                                    <Text style={[styles.postTitle, { color: colors.textPrimary }]}>
                                        {post.title}
                                    </Text>
                                    <Text numberOfLines={2} style={[styles.postExcerpt, { color: colors.textSecondary }]}>
                                        {post.excerpt}
                                    </Text>

                                    <View style={styles.readMoreRow}>
                                        <Text style={[styles.readMoreText, { color: colors.accent }]}>Read Complete Guide</Text>
                                        <ChevronRight size={14} color={colors.accent} />
                                    </View>
                                </View>
                            </Card>
                        </TouchableOpacity>
                    ))}
                </View>
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
        fontSize: 17,
        fontWeight: '700',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    hero: {
        alignItems: 'center',
        marginVertical: 14,
        gap: 8,
    },
    heroTitle: {
        fontSize: 22,
        fontWeight: '800',
        textAlign: 'center',
        letterSpacing: -0.3,
        lineHeight: 30,
    },
    heroSubtitle: {
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 19,
        maxWidth: 340,
    },
    tabsWrap: {
        marginVertical: 8,
    },
    articlesList: {
        gap: 14,
        marginVertical: 10,
    },
    articleCard: {
        overflow: 'hidden',
        padding: 0,
    },
    postThumb: {
        width: '100%',
        height: 160,
        resizeMode: 'cover',
    },
    postContent: {
        padding: 16,
        gap: 8,
    },
    badgeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    metaText: {
        fontSize: 12,
    },
    postTitle: {
        fontSize: 16,
        fontWeight: '700',
        lineHeight: 22,
    },
    postExcerpt: {
        fontSize: 13,
        lineHeight: 18,
    },
    readMoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    readMoreText: {
        fontSize: 13,
        fontWeight: '700',
    },
});
