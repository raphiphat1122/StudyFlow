import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { IconLock, IconMail, IconUser } from '@tabler/icons-react-native';
import { AppText, PressableScale } from '@/components/ui';
import { AuthButton, AuthInput, AuthLayout, useAuthColors } from '@/components/AuthKit';
import { useApp } from '@/features/store';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const { t } = useApp();
  const c = useAuthColors();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errs, setErrs] = useState<Record<string, string>>({});

  const submit = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = t('required');
    if (!EMAIL.test(email.trim())) e.email = t('badEmail');
    if (pass.length < 6) e.pass = t('passShort');
    if (confirm !== pass) e.confirm = t('passMismatch');
    setErrs(e);
    if (Object.keys(e).length) return;
    // TODO: เรียก authService.signUp(...) เมื่อมีระบบหลังบ้าน
    router.push({ pathname: '/otp', params: { purpose: 'register', email: email.trim() } } as never);
  };

  const ic = (I: typeof IconUser) => <I size={20} color={c.icon} />;
  return (
    <AuthLayout
      title={t('signUp')}
      subtitle={t('signUpSub')}
      footer={
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <AppText size={14} color={c.link}>{t('haveAccount')}</AppText>
          <PressableScale label={t('login')} onPress={() => router.replace('/onboarding')} style={{ justifyContent: 'center' }}>
            <AppText size={14} weight="bold" color={c.link}>{t('login')}</AppText>
          </PressableScale>
        </View>
      }
    >
      <AuthInput icon={ic(IconUser)} placeholder={t('fullName')} value={name} onChangeText={setName} error={errs.name} />
      <AuthInput icon={ic(IconMail)} placeholder={t('email')} value={email} onChangeText={setEmail} email error={errs.email} />
      <AuthInput icon={ic(IconLock)} placeholder={t('password')} value={pass} onChangeText={setPass} secure error={errs.pass} />
      <AuthInput icon={ic(IconLock)} placeholder={t('confirmPassword')} value={confirm} onChangeText={setConfirm} secure error={errs.confirm} />
      <AuthButton title={t('signUp')} onPress={submit} />
    </AuthLayout>
  );
}
