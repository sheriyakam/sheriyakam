import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { Stack } from 'expo-router';
import ErrorBoundary from '../components/ErrorBoundary';

import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Layout() {
    return (
        <ErrorBoundary>
            <ThemeProvider>
                <AuthProvider>
                    <SafeAreaProvider>
                        <StatusBar style="auto" />
                        <Stack screenOptions={{ headerShown: false }} />
                    </SafeAreaProvider>
                </AuthProvider>
            </ThemeProvider>
        </ErrorBoundary>
    );
}
