import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SvgXml } from 'react-native-svg';
import { IconChevronLeft } from '@tabler/icons-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText, Mascot, PressableScale } from '@/components/ui';
import { QuickSettings } from '@/components/QuickSettings';
import { useApp } from '@/features/store';
import { bgXmlDark, bgXmlLight } from '@/assets/onboarding/bgXml';
import type { MascotName } from '@/constants/assets';
import { font } from '@/theme';

const webReset = Platform.OS === 'web' ? ({ outlineWidth: 0, outlineStyle: 'none' } as object) : null;

export function useAuthColors() {
  const { isDark, colors } = useApp();
  return {
    head: isDark ? colors.text : '#33237F',
    link: isDark ? colors.primary : '#5B3FB5',
    btn: isDark ? colors.primary : '#8B5CF6',
    soft: isDark ? colors.muted : '#6F5F94',
    border: isDark ? colors.border : '#DCCFFA',
    icon: isDark ? colors.primary : '#4B3AA8',
    onBtn: isDark ? colors.onPrimary : '#FFFFFF',
  };
}

export function AuthButton({ title, onPress }: { title: string; onPress: () => void }) {
  const c = useAuthColors();
  return (
    <PressableScale label={title} onPress={onPress} style={{ backgroundColor: c.btn, borderRadius: 999, minHeight: 48, alignItems: 'center', justifyContent: 'center', shadowColor: '#8B5CF6', shadowOpacity: 0.3, shadowRadius: 12, shadowOffset: { width: 0, height: 5 }, elevation: 4 }}>
      <AppText size={17} weight="bold" color={c.onBtn}>{title}</AppText>
    </PressableScale>
  );
}

type InputProps = { icon: React.ReactNode; placeholder: string; value: string; onChangeText: (v: string) => void; secure?: boolean; email?: boolean; error?: string };

export function AuthInput({ icon, placeholder, value, onChangeText, secure, email, error }: InputProps) {
  const { colors } = useApp();
  const c = useAuthColors();
  const [focused, setFocused] = useState(false);
  const border = error ? colors.danger : focused ? c.btn : c.border;
  return (
    <View style={{ gap: 4 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 48, paddingHorizontal: 16, borderRadius: 999, borderWidth: 1.5, borderColor: border, backgroundColor: colors.card }}>
        {icon}
        <TextInput
          value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.muted}
          secureTextEntry={secure} keyboardType={email ? 'email-address' : 'default'} autoCapitalize="none" autoCorrect={false}
          accessibilityLabel={placeholder} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={[{ flex: 1, fontFamily: font.medium, fontSize: 16, color: colors.text, paddingVertical: 8 }, webReset]}
        />
      </View>
      {!!error && <AppText size={12} color={colors.danger} style={{ paddingLeft: 16 }}>{error}</AppText>}
    </View>
  );
}

type LayoutProps = { title: string; subtitle?: string; children: React.ReactNode; footer?: React.ReactNode; mascot?: MascotName };

export function AuthLayout({ title, subtitle, children, footer, mascot }: LayoutProps) {
  const { isDark } = useApp();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const c = useAuthColors();
  const back = () => (router.canGoBack() ? router.back() : router.replace('/onboarding'));
  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#1a162b' : '#F5EFFB' }}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <SvgXml xml={isDark ? bgXmlDark : bgXmlLight} width="100%" height="100%" />
      </View>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24, paddingTop: insets.top + 60, paddingBottom: insets.bottom + 20 }}>
          <View style={{ width: '100%', maxWidth: 380, gap: 12 }}>
            <View style={{ gap: 2, marginBottom: 4 }}>
              <AppText size={27} weight="bold" color={c.head}>{title}</AppText>
              {!!subtitle && <AppText size={15} weight="semibold" color={c.head}>{subtitle}</AppText>}
            </View>
            {children}
            {footer}
            {mascot && <View style={{ alignItems: 'center', marginTop: 4 }}><Mascot name={mascot} size={110} /></View>}
          </View>
        </ScrollView>
        <View style={{ position: 'absolute', top: insets.top + 8, left: 16 }}>
          <PressableScale label="back" onPress={back} style={{ width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' }}>
            <IconChevronLeft size={26} color={c.head} />
          </PressableScale>
        </View>
        <View style={{ position: 'absolute', top: insets.top + 8, right: 16 }}>
          <QuickSettings />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
