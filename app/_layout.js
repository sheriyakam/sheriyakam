import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { Stack } from 'expo-router';
import ErrorBoundary from '../components/ErrorBoundary';
import BottomNav from '../components/BottomNav';
import { View } from 'react-native';

import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Layout() {
    return (
        <ErrorBoundary>
            <ThemeProvider>
                <AuthProvider>
                    <SafeAreaProvider>
                        <StatusBar style="auto" />
                        <View style={{ flex: 1 }}>
                            <Stack screenOptions={{ headerShown: false }} />
                            <BottomNav />
                        </View>
                    </SafeAreaProvider>
                </AuthProvider>
            </ThemeProvider>
        </ErrorBoundary>
    );
}
