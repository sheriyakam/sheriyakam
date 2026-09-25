import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { ShieldAlert, ShieldCheck } from 'lucide-react-native';
import { AdminAuthProvider, useAdminAuth } from '../../context/AdminAuthContext';

export { ErrorBoundary } from '../../components/ErrorBoundary';

const C = {
    bg: '#0a0f1e',
    surface: '#111827',
    card: '#1a2235',
    border: '#1f2d45',
    accent: '#3b82f6',
    danger: '#ef4444',
    text: '#f8fafc',
    sub: '#94a3b8',
    muted: '#475569',
};

function AdminAuthGuard() {
    const { isAdminAuthenticated, isLoading, loginAdmin } = useAdminAuth();
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (isLoading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={C.accent} />
                <Text style={styles.loadingText}>Verifying administrator credentials...</Text>
            </SafeAreaView>
        );
    }

    if (!isAdminAuthenticated) {
        const handleSignIn = async () => {
            if (!username.trim() || !password) {
                setLoginError('Please provide both administrator username and password.');
                return;
            }
            setIsSubmitting(true);
            setLoginError('');
            try {
                await loginAdmin(username, password);
            } catch (err) {
                setLoginError(err.message || 'Authentication failed');
            } finally {
                setIsSubmitting(false);
            }
        };

        return (
            <SafeAreaView style={styles.loginBg}>
                <View style={styles.loginCard}>
                    <View style={styles.loginIconWrap}>
                        <ShieldAlert size={36} color={C.danger} />
                    </View>
                    <Text style={styles.loginTitle}>Operations Portal</Text>
                    <Text style={styles.loginSub}>SHERIYAKAM · SECURE OPERATIONS CONSOLE</Text>

                    {loginError ? <Text style={styles.loginError}>{loginError}</Text> : null}

                    <TextInput
                        style={styles.loginInput}
                        placeholder="Admin Username"
                        placeholderTextColor={C.muted}
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    <TextInput
                        style={styles.loginInput}
                        placeholder="Admin Password"
                        placeholderTextColor={C.muted}
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        autoCapitalize="none"
                    />
                    <TouchableOpacity
                        style={[styles.loginBtn, isSubmitting && { opacity: 0.7 }]}
                        onPress={handleSignIn}
                        disabled={isSubmitting}
                    >
                        <Text style={styles.loginBtnText}>
                            {isSubmitting ? 'Authenticating...' : 'Sign In to Command Center'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ marginTop: 24, alignSelf: 'center' }}
                        onPress={() => router.replace('/')}
                    >
                        <Text style={{ color: C.muted, fontSize: 13 }}>← Back to Public Marketplace</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: C.bg },
            }}
        />
    );
}

export default function AdminLayout() {
    return (
        <AdminAuthProvider>
            <AdminAuthGuard />
        </AdminAuthProvider>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        backgroundColor: C.bg,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    loadingText: {
        color: C.sub,
        fontSize: 14,
    },
    loginBg: {
        flex: 1,
        backgroundColor: C.bg,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    loginCard: {
        width: '100%',
        maxWidth: 420,
        backgroundColor: C.card,
        borderRadius: 16,
        padding: 28,
        borderWidth: 1,
        borderColor: C.border,
    },
    loginIconWrap: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 16,
    },
    loginTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: C.text,
        textAlign: 'center',
    },
    loginSub: {
        fontSize: 11,
        fontWeight: '600',
        color: C.sub,
        textAlign: 'center',
        letterSpacing: 1,
        marginTop: 4,
        marginBottom: 24,
    },
    loginError: {
        color: C.danger,
        fontSize: 13,
        textAlign: 'center',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        padding: 10,
        borderRadius: 8,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.2)',
    },
    loginInput: {
        backgroundColor: C.surface,
        borderWidth: 1,
        borderColor: C.border,
        borderRadius: 10,
        padding: 14,
        color: C.text,
        fontSize: 14,
        marginBottom: 14,
    },
    loginBtn: {
        backgroundColor: C.accent,
        borderRadius: 10,
        padding: 14,
        alignItems: 'center',
        marginTop: 6,
    },
    loginBtnText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
});
