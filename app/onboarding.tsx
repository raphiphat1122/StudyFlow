import React, { useEffect, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SvgXml } from 'react-native-svg';
import Animated, { Easing, FadeInDown, ReduceMotion, useAnimatedStyle, useReducedMotion, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { IconBrandAppleFilled, IconBrandGoogleFilled, IconCheck, IconHeartFilled, IconLock, IconUser } from '@tabler/icons-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText, PressableScale } from '@/components/ui';
import { QuickSettings } from '@/components/QuickSettings';
import { useApp } from '@/features/store';
import { useLayout } from '@/hooks/useLayout';
import { authService } from '@/services/auth';
import { bgXmlDark, bgXmlLight } from '@/assets/onboarding/bgXml';
import { font } from '@/theme';

const owl = require('../src/assets/onboarding/owl.png');
const webReset = Platform.OS === 'web' ? ({ outlineWidth: 0, outlineStyle: 'none' } as object) : null;

type RowProps = { icon: React.ReactNode; placeholder: string; value: string; onChangeText: (v: string) => void; secure?: boolean; email?: boolean; h: number; fs: number };

function InputRow({ icon, placeholder, value, onChangeText, secure, email, h, fs }: RowProps) {
  const { colors, isDark } = useApp();
  const [focused, setFocused] = useState(false);
  const border = focused ? (isDark ? colors.primary : '#8B5CF6') : (isDark ? colors.border : '#DCCFFA');
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: h, paddingHorizontal: 16, borderRadius: 999, borderWidth: 1.5, borderColor: border, backgroundColor: colors.card }}>
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
        style={[{ flex: 1, fontFamily: font.medium, fontSize: fs, color: colors.text, paddingVertical: 8 }, webReset]}
      />
    </View>
  );
}

export default function Onboarding() {
  const { t, updateSettings, isDark, colors } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const L = useLayout();
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

  const compact = L.height < 760;
  const inlineHero = !L.twoCol && L.height < 640;
  const gap = compact ? 8 : 12;
  const inputH = compact ? 44 : 48;
  const btnH = compact ? 46 : 50;
  const socialH = compact ? 42 : 44;
  const bodySize = compact ? 13 : 14;
  const titleSize = L.twoCol ? 30 : compact ? 24 : 27;
  const subSize = compact ? 14 : 16;
  const owlW = L.twoCol
    ? Math.min(L.height * 0.4, L.width * 0.25, 240)
    : inlineHero ? 80 : Math.min(L.width * 0.32, L.height * (compact ? 0.14 : 0.17), 140);

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

  const mascot = (
    <Animated.View style={floatStyle}>
      <Image source={owl} accessibilityIgnoresInvertColors style={{ width: owlW, height: owlW * 1.1 }} resizeMode="contain" />
    </Animated.View>
  );
  const heading = (
    <View style={{ gap: 2, alignItems: L.twoCol ? 'center' : 'flex-start' }}>
      <AppText size={titleSize} weight="bold" color={HEAD}>{t('login')}</AppText>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <AppText size={subSize} weight="semibold" color={HEAD}>{t('welcomeBack')}</AppText>
        <IconHeartFilled size={subSize + 2} color="#8B5CF6" />
      </View>
    </View>
  );
  const formBody = (
    <>
      <InputRow h={inputH} fs={bodySize + 2} icon={<IconUser size={20} color={iconColor} />} placeholder={t('userOrEmail')} value={user} onChangeText={(v) => { setUser(v); setMsg(''); }} email />
      <InputRow h={inputH} fs={bodySize + 2} icon={<IconLock size={20} color={iconColor} />} placeholder={t('password')} value={pass} onChangeText={(v) => { setPass(v); setMsg(''); }} secure />
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <PressableScale label={t('remember')} onPress={() => setRemember((r) => !r)} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ width: 22, height: 22, borderRadius: 7, borderWidth: 1.5, borderColor: BORDER, backgroundColor: remember ? (isDark ? colors.soft : '#E3D6FB') : colors.card, alignItems: 'center', justifyContent: 'center' }}>
            {remember && <IconCheck size={15} color={iconColor} />}
          </View>
          <AppText size={bodySize} weight="semibold" color={HEAD}>{t('remember')}</AppText>
        </PressableScale>
        <PressableScale label={t('forgot')} onPress={() => router.push('/forgot-password' as never)} style={{ justifyContent: 'center' }}>
          <AppText size={bodySize} weight="semibold" color={LINK}>{t('forgot')}</AppText>
        </PressableScale>
      </View>
      {!!msg && <Animated.View key={msg} entering={FadeInDown.duration(200).reduceMotion(ReduceMotion.System)}><AppText size={13} color={SOFT} style={{ textAlign: 'center' }}>{msg}</AppText></Animated.View>}
      <PressableScale label={t('login')} onPress={submit} style={{ backgroundColor: BTN, borderRadius: 999, minHeight: btnH, alignItems: 'center', justifyContent: 'center', shadowColor: '#8B5CF6', shadowOpacity: 0.3, shadowRadius: 12, shadowOffset: { width: 0, height: 5 }, elevation: 4 }}>
        <AppText size={compact ? 16 : 18} weight="bold" color={isDark ? colors.onPrimary : '#FFFFFF'}>{t('login')}</AppText>
      </PressableScale>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {[{ k: 'Google', I: IconBrandGoogleFilled, c: '#4285F4' }, { k: 'Apple', I: IconBrandAppleFilled, c: isDark ? colors.text : '#000000' }].map(({ k, I, c }) => (
          <PressableScale key={k} label={k} onPress={soon} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: socialH, borderRadius: 999, borderWidth: 1.5, borderColor: BORDER, backgroundColor: colors.card }}>
            <I size={19} color={c} />
            <AppText size={bodySize + 1} weight="bold" color={HEAD}>{k}</AppText>
          </PressableScale>
        ))}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <AppText size={bodySize} color={LINK}>{t('noAccount')}</AppText>
        <PressableScale label={t('signUp')} onPress={() => router.push('/register' as never)} style={{ justifyContent: 'center' }}>
          <AppText size={bodySize} weight="bold" color={LINK}>{t('signUp')}</AppText>
        </PressableScale>
      </View>
      <PressableScale label={t('guest')} onPress={enter} style={{ alignItems: 'center', justifyContent: 'center', minHeight: 36 }}>
        <AppText size={13} color={SOFT} style={{ textDecorationLine: 'underline' }}>{t('guest')}</AppText>
      </PressableScale>
    </>
  );

  const content = L.twoCol ? (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 48, width: '100%', maxWidth: 980 }}>
      <View style={{ flex: 1, alignItems: 'center', gap: 12 }}>{mascot}{heading}</View>
      <View style={{ flex: 1, maxWidth: 380, gap }}>{formBody}</View>
    </View>
  ) : (
    <View style={{ width: '100%', maxWidth: 380, gap }}>
      {inlineHero ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, paddingRight: 56 }}>
          {mascot}
          <View style={{ flex: 1 }}>{heading}</View>
        </View>
      ) : (
        <>
          <View style={{ alignItems: 'center' }}>{mascot}</View>
          {heading}
        </>
      )}
      {formBody}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#1a162b' : '#F5EFFB' }}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <SvgXml xml={isDark ? bgXmlDark : bgXmlLight} width="100%" height="100%" />
      </View>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24, paddingTop: insets.top + 12, paddingBottom: insets.bottom + 16 }}>
          {content}
        </ScrollView>
        <View style={{ position: 'absolute', top: insets.top + 8, right: 16 }}>
          <QuickSettings />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
