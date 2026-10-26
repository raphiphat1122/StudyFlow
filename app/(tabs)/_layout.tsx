import React from 'react';
import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';
import { IconHome, IconCalendar, IconChecklist, IconChartBar, IconSettings } from '@tabler/icons-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/features/store';
import { font } from '@/theme';

export default function TabsLayout() {
  const { colors, t } = useApp(); const insets = useSafeAreaInsets();
  const icon = (I: typeof IconHome) => ({ color, focused }: { color: ColorValue; focused: boolean }) => <I size={24} color={String(color)} strokeWidth={focused ? 2.4 : 1.8} />;
  return <Tabs screenOptions={{ headerShown: false, animation: 'fade', tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.muted,
    tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border, height: 60 + insets.bottom, paddingBottom: insets.bottom + 4, paddingTop: 6 },
    tabBarLabelStyle: { fontFamily: font.medium, fontSize: 11 } }}>
    <Tabs.Screen name="index" options={{ title: t('home'), tabBarIcon: icon(IconHome) }} />
    <Tabs.Screen name="schedule" options={{ title: t('schedule'), tabBarIcon: icon(IconCalendar) }} />
    <Tabs.Screen name="tasks" options={{ title: t('tasks'), tabBarIcon: icon(IconChecklist) }} />
    <Tabs.Screen name="progress" options={{ title: t('progress'), tabBarIcon: icon(IconChartBar) }} />
    <Tabs.Screen name="settings" options={{ title: t('settings'), tabBarIcon: icon(IconSettings) }} />
  </Tabs>;
}
