import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import Head from 'expo-router/head';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Building2, ArrowLeft, ArrowRight } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export default function CommercialServicesScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            {Platform.OS === 'web' && (
                <Head>
                    <title>Commercial Electrical Contracting | Sheriyakam</title>
                    <meta name="robots" content="noindex, follow" />
                </Head>
            )}

            <View style={styles.centerBox}>
                <View style={[styles.iconCircle, { backgroundColor: colors.accent + '20' }]}>
                    <Building2 size={44} color={colors.accent} />
                </View>

                <Badge variant="purple" size="md">Future Feature · Launching Soon</Badge>

                <Text style={[styles.title, { color: colors.textPrimary }]}>
                    Commercial Contracting
                </Text>

                <Text style={[styles.desc, { color: colors.textSecondary }]}>
                    Specialized 3-phase commercial electrical contracting, corporate facility maintenance, and industrial power solutions across Kerala will be available in an upcoming update.
                </Text>

                <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    iconRight={ArrowRight}
                    onPress={() => router.push('/')}
                    style={{ marginTop: 14 }}
                >
                    Return to Home
                </Button>

                <Button
                    variant="ghost"
                    size="md"
                    fullWidth
                    iconLeft={ArrowLeft}
                    onPress={() => router.back()}
                    style={{ marginTop: 6 }}
                >
                    Go Back
                </Button>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    centerBox: {
        maxWidth: 440,
        width: '100%',
        alignItems: 'center',
        textAlign: 'center',
    },
    iconCircle: {
        width: 88,
        height: 88,
        borderRadius: 44,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        marginTop: 14,
        marginBottom: 8,
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    desc: {
        fontSize: 14,
        lineHeight: 22,
        textAlign: 'center',
        marginBottom: 20,
    },
});
