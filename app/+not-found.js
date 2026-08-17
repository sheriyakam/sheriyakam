import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export default function NotFoundScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            <View style={styles.centerBox}>
                <View style={[styles.iconCircle, { backgroundColor: '#EF444418' }]}>
                    <AlertCircle size={48} color="#EF4444" />
                </View>

                <Badge variant="danger" size="md">404 Error</Badge>

                <Text style={[styles.title, { color: colors.textPrimary }]}>
                    Page Not Found
                </Text>

                <Text style={[styles.desc, { color: colors.textSecondary }]}>
                    The route or page you are looking for does not exist or may have been relocated.
                </Text>

                <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    iconLeft={Home}
                    onPress={() => router.replace('/')}
                    style={{ marginTop: 12 }}
                >
                    Return to Homepage
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
        alignItems: 'center',
        maxWidth: 380,
        width: '100%',
        gap: 12,
    },
    iconCircle: {
        width: 88,
        height: 88,
        borderRadius: 44,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        letterSpacing: -0.5,
        textAlign: 'center',
    },
    desc: {
        fontSize: 14,
        lineHeight: 21,
        textAlign: 'center',
    },
});
