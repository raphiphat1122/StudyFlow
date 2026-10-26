import React, { useState } from 'react';
import { View } from 'react-native';
import Constants from 'expo-constants';
import { AppText, Card, Chip, ConfirmDialog, Button, Screen } from '@/components/ui';
import { useApp } from '@/features/store';
import { languageNames } from '@/i18n';
import type { Language } from '@/types';

export default function Settings() {
  const { t, colors, settings, updateSettings, resetData } = useApp(); const [confirm, setConfirm] = useState(false);
  return <Screen title={t('settings')}>
    <Card style={{ gap: 12 }}><AppText weight="semibold">{t('language')}</AppText>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{(Object.keys(languageNames) as Language[]).map((l) => <Chip key={l} label={languageNames[l]} active={settings.language === l} onPress={() => updateSettings({ language: l })} />)}</View></Card>
    <Card style={{ gap: 12 }}><AppText weight="semibold">{t('theme')}</AppText>
      <View style={{ flexDirection: 'row', gap: 8 }}>{(['light', 'dark', 'system'] as const).map((m) => <Chip key={m} label={t(m)} active={settings.theme === m} onPress={() => updateSettings({ theme: m })} />)}</View></Card>
    <Button title={t('reset')} variant="danger" onPress={() => setConfirm(true)} />
    <AppText size={12} color={colors.muted} style={{ textAlign: 'center' }}>StudyFlow · {t('version')} {Constants.expoConfig?.version ?? '1.0.0'}</AppText>
    <ConfirmDialog visible={confirm} danger message={t('resetMsg')} confirmLabel={t('reset')} cancelLabel={t('cancel')} onCancel={() => setConfirm(false)} onConfirm={async () => { await resetData(); setConfirm(false); }} />
  </Screen>;
}
