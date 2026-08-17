import '../utils/ssr-polyfill';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';
import { CartProvider } from '../context/CartContext';
import { Stack } from 'expo-router';
import ErrorBoundary from '../components/ErrorBoundary';
import BottomNav from '../components/BottomNav';
import { View } from 'react-native';

import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Layout() {
    return (
        <ThemeProvider>
            <ErrorBoundary>
                <AuthProvider>
                    <ToastProvider>
                        <CartProvider>
                            <SafeAreaProvider>
                                <StatusBar style="auto" />
                                <View style={{ flex: 1 }}>
                                    <Stack screenOptions={{ headerShown: false }} />
                                    <BottomNav />
                                </View>
                            </SafeAreaProvider>
                        </CartProvider>
                    </ToastProvider>
                </AuthProvider>
            </ErrorBoundary>
        </ThemeProvider>
    );
}
