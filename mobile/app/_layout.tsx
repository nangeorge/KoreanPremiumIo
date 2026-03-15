import 'react-native-gesture-handler';
import React, { useEffect, useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { suppressLogsInProduction, isDeviceCompromised, getCompromisedDeviceMessage } from '../src/services/security';
import { initializePurchases, checkPremiumStatus } from '../src/services/purchases';
import { configureForegroundNotificationHandler } from '../src/services/notifications';
import { hydrateStore, useAppStore } from '../src/store';

// Suppress production logs immediately — before any other code runs
suppressLogsInProduction();

// Configure foreground notification handling before the navigator mounts
configureForegroundNotificationHandler();

// Keep the splash screen visible until we finish async setup
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const setIsPremium = useAppStore((s) => s.setIsPremium);
  const language = useAppStore((s) => s.language);

  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const initialize = useCallback(async () => {
    try {
      // 1. Hydrate Zustand store from SecureStore
      await hydrateStore();

      // 2. Initialize RevenueCat
      await initializePurchases();

      // 3. Check premium status (reads from RevenueCat + updates SecureStore)
      const isPremium = await checkPremiumStatus();
      setIsPremium(isPremium);

      // 4. Check device security (non-blocking — warn only)
      const secCheck = await isDeviceCompromised();
      if (secCheck.isCompromised) {
        const msg = getCompromisedDeviceMessage(language);
        Alert.alert(msg.title, msg.body, [{ text: 'OK', style: 'default' }]);
      }
    } catch (err) {
      if (__DEV__) console.error('[App] Initialization error:', err);
    } finally {
      await SplashScreen.hideAsync();
    }
  }, [setIsPremium, language]);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      initialize();
    }
  }, [fontsLoaded, fontError, initialize]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <>
      <StatusBar style="light" backgroundColor="#0a0a0f" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0a0a0f' },
          animation: Platform.OS === 'ios' ? 'default' : 'fade',
        }}
      />
    </>
  );
}
