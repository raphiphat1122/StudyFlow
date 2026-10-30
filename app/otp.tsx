import React, { useEffect, useState } from 'react';
import { TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppText, PressableScale } from '@/components/ui';
import { AuthButton, AuthLayout, useAuthColors } from '@/components/AuthKit';
import { useApp } from '@/features/store';
import { font } from '@/theme';

const START = 59;

export default function Otp() {
  const { t, colors, updateSettings } = useApp();
  const c = useAuthColors();
  const router = useRouter();
  const { purpose } = useLocalSearchParams<{ purpose?: string; email?: string }>();
  const [code, setCode] = useState('');
  const [err, setErr] = useState('');
  const [left, setLeft] = useState(START);
  const [focused, setFocused] = useState(true);

  useEffect(() => {
    if (left <= 0) return;
    const id = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [left]);

  const submit = () => {
    if (code.length < 6) { setErr(t('otpIncomplete')); return; }
    // TODO: เรียก authService.verifyOtp(...) เมื่อมีระบบหลังบ้าน (ตอนนี้ยอมรับรหัสใดก็ได้)
    if (purpose === 'reset') { router.replace('/onboarding'); return; }
    updateSettings({ onboarded: true });
    router.replace('/');
  };
  const resend = () => { setLeft(START); setCode(''); setErr(''); /* TODO: authService.resendOtp() */ };
  const mm = '00:' + String(left).padStart(2, '0');
  const active = Math.min(code.length, 5);

  return (
    <AuthLayout title={t('otpTitle')} subtitle={t('otpSub')} mascot="sleeping">
      <View style={{ height: 56 }}>
        <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'space-between' }} pointerEvents="none">
          {Array.from({ length: 6 }).map((_, i) => (
            <View key={i} style={{ flex: 1, height: 56, borderRadius: 14, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.card, borderColor: err ? colors.danger : focused && i === active ? c.btn : c.border }}>
              <AppText size={22} weight="bold" color={c.head}>{code[i] ?? ''}</AppText>
            </View>
          ))}
        </View>
        <TextInput
          value={code} autoFocus maxLength={6} keyboardType="number-pad" textContentType="oneTimeCode" accessibilityLabel={t('otpTitle')}
          onChangeText={(v) => { setCode(v.replace(/\D/g, '')); setErr(''); }} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0, fontFamily: font.regular }}
        />
      </View>
      {!!err && <AppText size={12} color={colors.danger} style={{ textAlign: 'center' }}>{err}</AppText>}
      <AuthButton title={t('confirm')} onPress={submit} />
      {left > 0
        ? <AppText size={14} color={c.soft} style={{ textAlign: 'center' }}>{t('resendIn')} {mm}</AppText>
        : <PressableScale label={t('resend')} onPress={resend} style={{ alignItems: 'center', justifyContent: 'center' }}><AppText size={14} weight="bold" color={c.link}>{t('resend')}</AppText></PressableScale>}
      <AppText size={12} color={c.soft} style={{ textAlign: 'center' }}>{t('authDemo')}</AppText>
    </AuthLayout>
  );
}
