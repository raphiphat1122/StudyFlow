import React, { useEffect, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SvgXml } from 'react-native-svg';
import Animated, { Easing, FadeInDown, ReduceMotion, useAnimatedStyle, useReducedMotion, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { IconBrandAppleFilled, IconBrandGoogleFilled, IconCheck, IconHeartFilled, IconLock, IconUser } from '@tabler/icons-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText, PressableScale } from '@/components/ui';
import { QuickSettings } from '@/components/QuickSettings';
import { useApp } from '@/features/store';
import { authService } from '@/services/auth';
import { bgXmlDark, bgXmlLight } from '@/assets/onboarding/bgXml';
import { font } from '@/theme';

const owl = require('../src/assets/onboarding/owl.png');
const webReset = Platform.OS === 'web' ? ({ outlineWidth: 0, outlineStyle: 'none' } as object) : null;

type RowProps = { icon: React.ReactNode; placeholder: string; value: string; onChangeText: (v: string) => void; secure?: boolean; email?: boolean };

function InputRow({ icon, placeholder, value, onChangeText, secure, email }: RowProps) {
  const { colors, isDark } = useApp();
  const [focused, setFocused] = useState(false);
  const border = focused ? (isDark ? colors.primary : '#8B5CF6') : (isDark ? colors.border : '#DCCFFA');
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 60, paddingHorizontal: 18, borderRadius: 999, borderWidth: 1.5, borderColor: border, backgroundColor: colors.card }}>
      {icon}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        secureTextEntry={secure}
        keyboardType={email ? 'email-address' : 'default'}
        autoCapitalize="none"
        autoCorrect={false}
        accessibilityLabel={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[{ flex: 1, fontFamily: font.medium, fontSize: 17, color: colors.text, paddingVertical: 12 }, webReset]}
      />
    </View>
  );
}

export default function Onboarding() {
  const { t, updateSettings, isDark, colors } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const reduce = useReducedMotion();
  const float = useSharedValue(0);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [remember, setRemember] = useState(true);
  const [msg, setMsg] = useState('');

  const HEAD = isDark ? colors.text : '#33237F';
  const LINK = isDark ? colors.primary : '#5B3FB5';
  const BTN = isDark ? colors.primary : '#8B5CF6';
  const SOFT = isDark ? colors.muted : '#6F5F94';
  const BORDER = isDark ? colors.border : '#DCCFFA';
  const iconColor = isDark ? colors.primary : '#4B3AA8';
  const owlW = Math.min(width * 0.5, height * 0.24, 210);
  const scrollStyle = { flexGrow: 1, justifyContent: 'center' as const, alignItems: 'center' as const, paddingHorizontal: 24, paddingBottom: insets.bottom + 24 };

  useEffect(() => {
    if (reduce) return;
    const ease = Easing.inOut(Easing.sin);
    float.value = withRepeat(withSequence(withTiming(-8, { duration: 1800, easing: ease }), withTiming(0, { duration: 1800, easing: ease })), -1);
  }, [reduce, float]);
  const floatStyle = useAnimatedStyle(() => ({ transform: [{ translateY: float.value }] }));

  const enter = () => { updateSettings({ onboarded: true }); router.replace('/'); };
  const soon = () => setMsg(t('loginSoon'));
  const submit = async () => {
    if (!user.trim() || !pass) { setMsg(t('required')); return; }
    try { await authService.signIn(user.trim(), pass); enter(); } catch { soon(); }
  };

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#1a162b' : '#F5EFFB' }}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <SvgXml xml={isDark ? bgXmlDark : bgXmlLight} width="100%" height="100%" />
      </View>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{ paddingTop: insets.top + 12, paddingHorizontal: 24, alignItems: 'flex-end' }}>
          <QuickSettings />
        </View>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={scrollStyle}>
          <View style={{ width: '100%', maxWidth: 460, gap: 16 }}>
            <View style={{ alignItems: 'center' }}>
              <Animated.View style={floatStyle}>
                <Image source={owl} accessibilityIgnoresInvertColors style={{ width: owlW, height: owlW * 1.1 }} resizeMode="contain" />
              </Animated.View>
            </View>
            <View style={{ gap: 4 }}>
              <AppText size={34} weight="bold" color={HEAD}>{t('login')}</AppText>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <AppText size={19} weight="semibold" color={HEAD}>{t('welcomeBack')}</AppText>
                <IconHeartFilled size={22} color="#8B5CF6" />
              </View>
            </View>
            <InputRow icon={<IconUser size={26} color={iconColor} />} placeholder={t('userOrEmail')} value={user} onChangeText={(v) => { setUser(v); setMsg(''); }} email />
            <InputRow icon={<IconLock size={26} color={iconColor} />} placeholder={t('password')} value={pass} onChangeText={(v) => { setPass(v); setMsg(''); }} secure />
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <PressableScale label={t('remember')} onPress={() => setRemember((r) => !r)} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={{ width: 28, height: 28, borderRadius: 8, borderWidth: 1.5, borderColor: BORDER, backgroundColor: remember ? (isDark ? colors.soft : '#E3D6FB') : colors.card, alignItems: 'center', justifyContent: 'center' }}>
                  {remember && <IconCheck size={20} color={iconColor} />}
                </View>
                <AppText size={16} weight="semibold" color={HEAD}>{t('remember')}</AppText>
              </PressableScale>
              <PressableScale label={t('forgot')} onPress={soon} style={{ justifyContent: 'center' }}>
                <AppText size={15} weight="semibold" color={LINK}>{t('forgot')}</AppText>
              </PressableScale>
            </View>
            {!!msg && <Animated.View key={msg} entering={FadeInDown.duration(200).reduceMotion(ReduceMotion.System)}><AppText size={14} color={SOFT} style={{ textAlign: 'center' }}>{msg}</AppText></Animated.View>}
            <PressableScale label={t('login')} onPress={submit} style={{ backgroundColor: BTN, borderRadius: 999, minHeight: 64, alignItems: 'center', justifyContent: 'center', shadowColor: '#8B5CF6', shadowOpacity: 0.3, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 4 }}>
              <AppText size={21} weight="bold" color={isDark ? colors.onPrimary : '#FFFFFF'}>{t('login')}</AppText>
            </PressableScale>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {[{ k: 'Google', I: IconBrandGoogleFilled, c: '#4285F4' }, { k: 'Apple', I: IconBrandAppleFilled, c: isDark ? colors.text : '#000000' }].map(({ k, I, c }) => (
                <PressableScale key={k} label={k} onPress={soon} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, minHeight: 58, borderRadius: 999, borderWidth: 1.5, borderColor: BORDER, backgroundColor: colors.card }}>
                  <I size={24} color={c} />
                  <AppText size={17} weight="bold" color={HEAD}>{k}</AppText>
                </PressableScale>
              ))}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <AppText size={15} color={LINK}>{t('noAccount')}</AppText>
              <PressableScale label={t('signUp')} onPress={soon} style={{ justifyContent: 'center' }}>
                <AppText size={15} weight="bold" color={LINK}>{t('signUp')}</AppText>
              </PressableScale>
            </View>
            <PressableScale label={t('guest')} onPress={enter} style={{ alignItems: 'center', justifyContent: 'center' }}>
              <AppText size={14} color={SOFT} style={{ textDecorationLine: 'underline' }}>{t('guest')}</AppText>
            </PressableScale>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
