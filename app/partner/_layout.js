import { Stack } from 'expo-router';
import { COLORS } from '../../constants/theme';

export { ErrorBoundary } from '../../components/ErrorBoundary';

export default function PartnerLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: COLORS.bgPrimary },
            }}
        />
    );
}
