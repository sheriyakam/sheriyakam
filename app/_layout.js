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
            <AuthProvider>
                <ToastProvider>
                    <CartProvider>
                        <SafeAreaProvider>
                            <ErrorBoundary>
                                <StatusBar style="auto" />
                                <View style={{ flex: 1 }}>
                                    <Stack screenOptions={{ headerShown: false }} />
                                    <BottomNav />
                                </View>
                            </ErrorBoundary>
                        </SafeAreaProvider>
                    </CartProvider>
                </ToastProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}
