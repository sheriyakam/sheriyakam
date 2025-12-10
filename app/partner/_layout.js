import { Stack } from 'expo-router';
import { COLORS } from '../../constants/theme';

export default function PartnerLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: COLORS.bgPrimary,
                },
                headerTintColor: COLORS.textPrimary,
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                headerShadowVisible: false,
                contentStyle: { backgroundColor: COLORS.bgPrimary },
            }}
        >
            <Stack.Screen name="auth" options={{ title: 'Partner Portal', headerShown: false }} />
            <Stack.Screen name="index" options={{ title: 'Partner Dashboard', headerShown: false }} />
        </Stack>
    );
}
