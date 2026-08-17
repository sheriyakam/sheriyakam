import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Star, Clock, ShieldCheck, Plus, ShoppingCart, SlidersHorizontal } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { Searchbar } from '../components/ui/Searchbar';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { RangeSlider } from '../components/ui/Slider';
import { Modal } from '../components/ui/Modal';
import { Dropdown } from '../components/ui/Dropdown';
import { EmptyState } from '../components/ui/EmptyState';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const SERVICES_DATA = [
    {
        id: 'fan-repair',
        title: 'Ceiling & Exhaust Fan Repair',
        category: 'Fan & Light',
        price: 249,
        originalPrice: 349,
        rating: 4.9,
        reviewsCount: 342,
        duration: '30-45 mins',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80',
        taluks: ['Kozhikode', 'Vadakara', 'Thamarassery', 'Koyilandy'],
        description: 'Complete inspection, capacitor replacement, regulator testing, and blade balancing.',
    },
    {
        id: 'switchboard-install',
        title: 'Modular Switchboard & Socket Fix',
        category: 'Wiring & MCB',
        price: 299,
        originalPrice: 399,
        rating: 4.8,
        reviewsCount: 289,
        duration: '45 mins',
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&auto=format&fit=crop&q=80',
        taluks: ['Kozhikode', 'Vadakara', 'Thamarassery'],
        description: 'Replacement of burnt switches, 16A power socket installation, and grounding checks.',
    },
    {
        id: 'mcb-tripping',
        title: 'MCB Tripping & Short Circuit Diagnostic',
        category: 'Wiring & MCB',
        price: 499,
        originalPrice: 699,
        rating: 5.0,
        reviewsCount: 512,
        duration: '60 mins',
        image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=500&auto=format&fit=crop&q=80',
        taluks: ['Kozhikode', 'Vadakara', 'Thamarassery', 'Koyilandy'],
        description: 'Tracing line shorts, earth leakage testing with digital insulation tester, and DB overhaul.',
    },
    {
        id: 'inverter-battery',
        title: 'Inverter & Battery Wiring Setup',
        category: 'Inverter',
        price: 599,
        originalPrice: 799,
        rating: 4.9,
        reviewsCount: 198,
        duration: '60-90 mins',
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=80',
        taluks: ['Kozhikode', 'Vadakara'],
        description: 'Heavy duty DC cabling, battery water check, bypass switch installation, and load balancing.',
    },
    {
        id: 'ac-wiring',
        title: 'AC Power Point & Isolator Installation',
        category: 'AC & Cooling',
        price: 449,
        originalPrice: 599,
        rating: 4.7,
        reviewsCount: 145,
        duration: '45 mins',
        image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=500&auto=format&fit=crop&q=80',
        taluks: ['Kozhikode', 'Thamarassery', 'Koyilandy'],
        description: 'Dedicated 4.0 sq.mm copper line wiring, 25A MCB isolator box mounting, and earthing.',
    },
    {
        id: 'emergency-night',
        title: 'Emergency Night Breakdown Callout',
        category: 'Emergency',
        price: 799,
        originalPrice: 999,
        rating: 5.0,
        reviewsCount: 680,
        duration: '30 mins response',
        image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=500&auto=format&fit=crop&q=80',
        taluks: ['Kozhikode', 'Vadakara', 'Thamarassery', 'Koyilandy'],
        description: 'Immediate dispatch after 7 PM for blackout, sparking, generator failure, and safety hazards.',
    },
];

const CATEGORIES = ['All', 'Fan & Light', 'Wiring & MCB', 'Inverter', 'AC & Cooling', 'Emergency'];
const TALUKS = [
    { label: 'All Kerala Taluks', value: 'all' },
    { label: 'Kozhikode Taluk', value: 'Kozhikode' },
    { label: 'Vadakara Taluk', value: 'Vadakara' },
    { label: 'Thamarassery Taluk', value: 'Thamarassery' },
    { label: 'Koyilandy Taluk', value: 'Koyilandy' },
];

export default function SearchScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { addItem, itemCount } = useCart();
    const { success } = useToast();
    const isDark = theme === 'dark';

    const [query, setQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedTaluk, setSelectedTaluk] = useState('all');
    const [maxPrice, setMaxPrice] = useState(1000);
    const [minRating, setMinRating] = useState(0);
    const [showFilterModal, setShowFilterModal] = useState(false);

    const filteredServices = useMemo(() => {
        return SERVICES_DATA.filter((s) => {
            // Text query match
            const matchesQuery = !query.trim() || 
                s.title.toLowerCase().includes(query.toLowerCase()) || 
                s.description.toLowerCase().includes(query.toLowerCase()) ||
                s.category.toLowerCase().includes(query.toLowerCase());

            // Category match
            const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;

            // Taluk match
            const matchesTaluk = selectedTaluk === 'all' || s.taluks.includes(selectedTaluk);

            // Price match
            const matchesPrice = s.price <= maxPrice;

            // Rating match
            const matchesRating = s.rating >= minRating;

            return matchesQuery && matchesCategory && matchesTaluk && matchesPrice && matchesRating;
        });
    }, [query, selectedCategory, selectedTaluk, maxPrice, minRating]);

    const handleAddToCart = (service) => {
        addItem(service, 1);
        success(`Added "${service.title}" to cart!`, 'Cart Updated');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#18181B' : '#E4E4E7' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={22} color={colors.textPrimary} />
                </TouchableOpacity>

                <View style={styles.searchBarWrap}>
                    <Searchbar
                        value={query}
                        onChangeText={setQuery}
                        placeholder="Search services, wiring, fan..."
                        showFilter={true}
                        filterActive={selectedCategory !== 'All' || selectedTaluk !== 'all' || maxPrice < 1000}
                        onFilterPress={() => setShowFilterModal(true)}
                    />
                </View>

                <TouchableOpacity 
                    onPress={() => router.push('/cart')} 
                    style={[styles.cartIconBtn, { backgroundColor: isDark ? '#18181B' : '#FFFFFF' }]}
                >
                    <ShoppingCart size={20} color={colors.textPrimary} />
                    {itemCount > 0 ? (
                        <View style={[styles.cartBadge, { backgroundColor: colors.accent }]}>
                            <Text style={styles.cartBadgeText}>{itemCount}</Text>
                        </View>
                    ) : null}
                </TouchableOpacity>
            </View>

            {/* Category Filter Pills */}
            <View style={styles.categoriesBar}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
                    {CATEGORIES.map((cat) => {
                        const isSelected = selectedCategory === cat;
                        return (
                            <TouchableOpacity
                                key={cat}
                                onPress={() => setSelectedCategory(cat)}
                                style={[
                                    styles.categoryChip,
                                    {
                                        backgroundColor: isSelected ? colors.accent : isDark ? '#18181B' : '#FFFFFF',
                                        borderColor: isSelected ? colors.accent : isDark ? '#27272A' : '#E4E4E7',
                                    }
                                ]}
                            >
                                <Text style={[
                                    styles.categoryText,
                                    {
                                        color: isSelected ? '#FFFFFF' : colors.textPrimary,
                                        fontWeight: isSelected ? '700' : '500',
                                    }
                                ]}>
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Services Results List */}
            <ScrollView contentContainerStyle={styles.resultsList}>
                <View style={styles.resultsHeader}>
                    <Text style={[styles.resultsCount, { color: colors.textSecondary }]}>
                        {filteredServices.length} services available
                    </Text>
                    {selectedCategory !== 'All' || query ? (
                        <TouchableOpacity onPress={() => { setSelectedCategory('All'); setQuery(''); setMaxPrice(1000); }}>
                            <Text style={[styles.resetText, { color: colors.accent }]}>Reset Filters</Text>
                        </TouchableOpacity>
                    ) : null}
                </View>

                {filteredServices.length === 0 ? (
                    <EmptyState
                        title="No services found"
                        description="Try searching for another keyword or relaxing your filters."
                        actionLabel="View All Services"
                        onAction={() => {
                            setQuery('');
                            setSelectedCategory('All');
                            setSelectedTaluk('all');
                            setMaxPrice(1000);
                        }}
                    />
                ) : (
                    filteredServices.map((service) => (
                        <Card
                            key={service.id}
                            variant="default"
                            style={styles.serviceCard}
                            onPress={() => router.push(`/service/${service.id}`)}
                        >
                            <View style={styles.cardContent}>
                                <Image source={{ uri: service.image }} style={styles.serviceThumb} />

                                <View style={styles.cardDetails}>
                                    <View style={styles.badgeRow}>
                                        <Badge variant={service.category === 'Emergency' ? 'danger' : 'info'} size="sm">
                                            {service.category}
                                        </Badge>
                                        <View style={styles.ratingRow}>
                                            <Star size={12} color="#F59E0B" fill="#F59E0B" />
                                            <Text style={[styles.ratingText, { color: colors.textPrimary }]}>
                                                {service.rating} ({service.reviewsCount})
                                            </Text>
                                        </View>
                                    </View>

                                    <Text style={[styles.serviceTitle, { color: colors.textPrimary }]}>
                                        {service.title}
                                    </Text>

                                    <Text numberOfLines={2} style={[styles.serviceDesc, { color: colors.textSecondary }]}>
                                        {service.description}
                                    </Text>

                                    <View style={styles.cardFooter}>
                                        <View style={styles.priceWrap}>
                                            <Text style={[styles.price, { color: colors.accent }]}>
                                                ₹{service.price}
                                            </Text>
                                            <Text style={[styles.originalPrice, { color: colors.textTertiary }]}>
                                                ₹{service.originalPrice}
                                            </Text>
                                        </View>

                                        <Button
                                            variant="primary"
                                            size="sm"
                                            iconLeft={Plus}
                                            onPress={() => handleAddToCart(service)}
                                        >
                                            Add
                                        </Button>
                                    </View>
                                </View>
                            </View>
                        </Card>
                    ))
                )}
            </ScrollView>

            {/* Filter Modal */}
            <Modal
                visible={showFilterModal}
                onClose={() => setShowFilterModal(false)}
                title="Filter Services"
                subtitle="Customize price range, zone, and minimum rating"
                maxWidth={420}
            >
                <View style={styles.filterModalBody}>
                    <Dropdown
                        label="Operating Taluk"
                        options={TALUKS}
                        value={selectedTaluk}
                        onSelect={setSelectedTaluk}
                    />

                    <RangeSlider
                        label="Maximum Service Price"
                        value={maxPrice}
                        onChange={setMaxPrice}
                        options={[300, 500, 800, 1000]}
                    />

                    <View style={styles.ratingFilterWrap}>
                        <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>
                            Minimum Rating
                        </Text>
                        <View style={styles.ratingChips}>
                            {[0, 4.5, 4.8].map((rate) => (
                                <TouchableOpacity
                                    key={rate}
                                    onPress={() => setMinRating(rate)}
                                    style={[
                                        styles.ratingChip,
                                        {
                                            backgroundColor: minRating === rate ? colors.accent : isDark ? '#27272A' : '#F4F4F5',
                                            borderColor: minRating === rate ? colors.accent : isDark ? '#3F3F46' : '#E4E4E7',
                                        }
                                    ]}
                                >
                                    <Text style={[
                                        styles.ratingChipText,
                                        { color: minRating === rate ? '#FFFFFF' : colors.textPrimary }
                                    ]}>
                                        {rate === 0 ? 'Any Rating' : `${rate}★ & Above`}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <Button
                        variant="primary"
                        size="lg"
                        fullWidth
                        onPress={() => setShowFilterModal(false)}
                        style={{ marginTop: 16 }}
                    >
                        Apply Filters ({filteredServices.length} Results)
                    </Button>
                </View>
            </Modal>
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
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        gap: 10,
    },
    backBtn: {
        padding: 6,
    },
    searchBarWrap: {
        flex: 1,
    },
    cartIconBtn: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(150,150,150,0.15)',
        position: 'relative',
    },
    cartBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
    cartBadgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '800',
    },
    categoriesBar: {
        paddingVertical: 10,
    },
    categoriesScroll: {
        paddingHorizontal: 16,
        gap: 8,
    },
    categoryChip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
    },
    categoryText: {
        fontSize: 13,
    },
    resultsList: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    resultsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingHorizontal: 4,
    },
    resultsCount: {
        fontSize: 13,
        fontWeight: '600',
    },
    resetText: {
        fontSize: 13,
        fontWeight: '700',
    },
    serviceCard: {
        marginBottom: 12,
        padding: 12,
    },
    cardContent: {
        flexDirection: 'row',
        gap: 12,
    },
    serviceThumb: {
        width: 90,
        height: 90,
        borderRadius: 12,
        resizeMode: 'cover',
    },
    cardDetails: {
        flex: 1,
        justifyContent: 'space-between',
    },
    badgeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        fontSize: 11,
        fontWeight: '700',
    },
    serviceTitle: {
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 2,
    },
    serviceDesc: {
        fontSize: 12,
        lineHeight: 16,
        marginBottom: 6,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceWrap: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 6,
    },
    price: {
        fontSize: 16,
        fontWeight: '800',
    },
    originalPrice: {
        fontSize: 12,
        textDecorationLine: 'line-through',
    },
    filterModalBody: {
        gap: 12,
    },
    ratingFilterWrap: {
        marginVertical: 4,
    },
    filterLabel: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 8,
    },
    ratingChips: {
        flexDirection: 'row',
        gap: 8,
    },
    ratingChip: {
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 8,
        borderWidth: 1,
    },
    ratingChipText: {
        fontSize: 12,
        fontWeight: '600',
    },
});
