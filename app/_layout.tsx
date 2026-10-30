import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider, useApp } from '@/features/store';

void SplashScreen.preventAutoHideAsync();

function Gate() {
  const { ready, settings, isDark, colors } = useApp(); const segs = useSegments(); const router = useRouter();
  const [fontsLoaded, fontError] = useFonts({ 'Mali-Regular': require('../assets/fonts/Mali-Regular.ttf'), 'Mali-Medium': require('../assets/fonts/Mali-Medium.ttf'), 'Mali-SemiBold': require('../assets/fonts/Mali-SemiBold.ttf'), 'Mali-Bold': require('../assets/fonts/Mali-Bold.ttf') });
  const ok = ready && (fontsLoaded || !!fontError);
  useEffect(() => { if (ok) void SplashScreen.hideAsync(); }, [ok]);
  useEffect(() => { if (!ok) return; const onOnb = ['onboarding', 'register', 'forgot-password', 'otp'].includes(segs[0] as string);
    if (!settings.onboarded && !onOnb) router.replace('/onboarding'); else if (settings.onboarded && onOnb) router.replace('/'); }, [ok, settings.onboarded, segs, router]);
  if (!ok) return null;
  return <><StatusBar style={isDark ? 'light' : 'dark'} /><Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background }, animation: 'fade' }}>
      <Stack.Screen name="schedule/[id]" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="tasks/[id]" options={{ animation: 'slide_from_bottom' }} />
    </Stack></>;
}
export default function Root() {
  return <GestureHandlerRootView style={{ flex: 1 }}><SafeAreaProvider><AppProvider><Gate /></AppProvider></SafeAreaProvider></GestureHandlerRootView>;
}
