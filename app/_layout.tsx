import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from 'styled-components/native';

import { theme } from '../src/theme/theme';

export default function RootLayout() {
    return (
        <ThemeProvider theme={theme}>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
            </Stack>
            <StatusBar style="auto" />
        </ThemeProvider>
    );
}
