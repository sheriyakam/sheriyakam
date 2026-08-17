import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sparkles, ArrowLeft, Bell } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants/theme';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export default function ComingSoonScreen() {
    const router = useRouter();
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const { success } = useToast();
    const isDark = theme === 'dark';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#09090B' : '#F9FAFB' }]}>
            <View style={styles.centerBox}>
                <View style={[styles.iconCircle, { backgroundColor: colors.accent + '20' }]}>
                    <Sparkles size={44} color={colors.accent} />
                </View>

                <Badge variant="purple" size="md">Coming Soon</Badge>

                <Text style={[styles.title, { color: colors.textPrimary }]}>
                    Expanding Across Kerala
                </Text>

                <Text style={[styles.desc, { color: colors.textSecondary }]}>
                    This feature and expansion zone is currently in active beta testing with certified wiremen. Stay tuned for official rollout!
                </Text>

                <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    iconLeft={Bell}
                    onPress={() => router.push('/waitlist')}
                    style={{ marginTop: 12 }}
                >
                    Join Priority Waitlist
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
        alignItems: 'center',
        maxWidth: 380,
        width: '100%',
        gap: 12,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 6,
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
