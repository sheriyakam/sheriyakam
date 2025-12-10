import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Switch, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MapPin, Clock, DollarSign } from 'lucide-react-native';
import { COLORS, SPACING } from '../../constants/theme';

const MOCK_REQUESTS = [
    {
        id: 'req1',
        customerName: 'Alice Johnson',
        service: 'Emergency Repair',
        distance: '0.5 km',
        location: 'Kozhikode Beach Rd',
        price: '₹500',
        time: 'Now',
        urgent: true,
    },
    {
        id: 'req2',
        customerName: 'Mohammed Fasil',
        service: 'AC Service',
        distance: '1.2 km',
        location: 'Mavoor Road',
        price: '₹550',
        time: '2:00 PM',
        urgent: false,
    },
    {
        id: 'req3',
        customerName: 'Sneha Gupta',
        service: 'Fan Installation',
        distance: '2.5 km',
        location: 'Medical College',
        price: '₹400',
        time: '4:30 PM',
        urgent: false,
    },
];

export default function PartnerDashboard() {
    const router = useRouter();
    const [isOnline, setIsOnline] = useState(true);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => router.push({ pathname: '/partner/request-details', params: { ...item } })}
        >
            <View style={styles.cardHeader}>
                <Text style={styles.serviceName}>{item.service}</Text>
                {item.urgent && (
                    <View style={styles.urgentBadge}>
                        <Text style={styles.urgentText}>URGENT</Text>
                    </View>
                )}
            </View>

            <View style={styles.row}>
                <MapPin size={16} color={COLORS.textSecondary} />
                <Text style={styles.locationText}>{item.location} ({item.distance})</Text>
            </View>

            <View style={styles.row}>
                <Clock size={16} color={COLORS.textSecondary} />
                <Text style={styles.infoText}>{item.time}</Text>
                <View style={styles.spacer} />
                <DollarSign size={16} color={COLORS.success} />
                <Text style={styles.priceText}>{item.price}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.bgPrimary} />

            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hello, Partner</Text>
                    <Text style={styles.subtext}>Ready to work?</Text>
                </View>
                <View style={styles.statusContainer}>
                    <Text style={[styles.statusText, { color: isOnline ? COLORS.success : COLORS.textSecondary }]}>
                        {isOnline ? 'Online' : 'Offline'}
                    </Text>
                    <Switch
                        value={isOnline}
                        onValueChange={setIsOnline}
                        trackColor={{ false: COLORS.bgTertiary, true: COLORS.success }}
                        thumbColor={'#fff'}
                    />
                </View>
            </View>

            <Text style={styles.sectionTitle}>Nearby Requests</Text>

            {isOnline ? (
                <FlatList
                    data={MOCK_REQUESTS}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No requests nearby. Stay tuned!</Text>
                    }
                />
            ) : (
                <View style={styles.offlineContainer}>
                    <Text style={styles.offlineText}>You are offline. Go online to see requests.</Text>
                </View>
            )}

            <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/')}>
                <Text style={styles.backButtonText}>Back to Customer App</Text>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.lg,
        backgroundColor: COLORS.bgSecondary,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    greeting: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    subtext: {
        color: COLORS.textSecondary,
        marginTop: 4,
    },
    statusContainer: {
        alignItems: 'center',
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginHorizontal: SPACING.lg,
        marginTop: SPACING.lg,
        marginBottom: SPACING.sm,
    },
    listContent: {
        padding: SPACING.lg,
        gap: SPACING.md,
    },
    card: {
        backgroundColor: COLORS.bgSecondary,
        padding: SPACING.md,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    serviceName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    urgentBadge: {
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    urgentText: {
        color: COLORS.danger,
        fontSize: 10,
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 6,
    },
    locationText: {
        color: COLORS.textSecondary,
        fontSize: 14,
    },
    infoText: {
        color: COLORS.textPrimary,
        fontSize: 14,
    },
    priceText: {
        color: COLORS.success,
        fontSize: 16,
        fontWeight: 'bold',
    },
    spacer: {
        width: 12,
    },
    offlineContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
    },
    offlineText: {
        color: COLORS.textSecondary,
        fontSize: 16,
    },
    backButton: {
        padding: SPACING.md,
        alignItems: 'center',
    },
    backButtonText: {
        color: COLORS.accent,
    }
});
