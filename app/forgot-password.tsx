import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { IconMail } from '@tabler/icons-react-native';
import { AppText, PressableScale } from '@/components/ui';
import { AuthButton, AuthInput, AuthLayout, useAuthColors } from '@/components/AuthKit';
import { useApp } from '@/features/store';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPassword() {
  const { t } = useApp();
  const c = useAuthColors();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [err, setErr] = useState('');

  const submit = () => {
    if (!EMAIL.test(email.trim())) { setErr(t('badEmail')); return; }
    setErr('');
    // TODO: เรียก authService.requestPasswordReset(...) เมื่อมีระบบหลังบ้าน
    router.push({ pathname: '/otp', params: { purpose: 'reset', email: email.trim() } } as never);
  };

  return (
    <AuthLayout
      title={t('forgot')}
      subtitle={t('forgotSub')}
      mascot="doubt"
      footer={
        <PressableScale label={t('backToLogin')} onPress={() => router.replace('/onboarding')} style={{ alignItems: 'center', justifyContent: 'center' }}>
          <AppText size={14} weight="semibold" color={c.link}>{t('backToLogin')}</AppText>
        </PressableScale>
      }
    >
      <AuthInput icon={<IconMail size={20} color={c.icon} />} placeholder={t('email')} value={email} onChangeText={(v) => { setEmail(v); setErr(''); }} email error={err} />
      <AuthButton title={t('sendReset')} onPress={submit} />
    </AuthLayout>
  );
}
