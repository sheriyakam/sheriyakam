import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { Stack } from 'expo-router';

import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Layout() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <SafeAreaProvider>
                    <StatusBar style="auto" />
                    <Stack screenOptions={{ headerShown: false }} />
                </SafeAreaProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}
