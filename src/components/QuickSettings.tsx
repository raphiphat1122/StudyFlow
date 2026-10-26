import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, ReduceMotion, SlideInDown } from 'react-native-reanimated';
import { IconSettings, IconX } from '@tabler/icons-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText, Chip, PressableScale } from '@/components/ui';
import { useApp } from '@/features/store';
import { languageNames } from '@/i18n';
import type { Language } from '@/types';

export function QuickSettings() {
  const { t, colors, settings, updateSettings } = useApp();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);

  return (
    <>
      <PressableScale
        label={t('settings')}
        onPress={() => setOpen(true)}
        style={{ width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }}
      >
        <IconSettings size={24} color={colors.primary} />
      </PressableScale>

      <Modal transparent visible={open} animationType="none" onRequestClose={() => setOpen(false)}>
        <Pressable style={{ flex: 1, justifyContent: 'flex-end' }} onPress={() => setOpen(false)}>
          <Animated.View entering={FadeIn.duration(200).reduceMotion(ReduceMotion.System)} style={StyleSheet.absoluteFill} pointerEvents="none">
            <View style={{ flex: 1, backgroundColor: '#0006' }} />
          </Animated.View>
          <Animated.View entering={SlideInDown.duration(260).reduceMotion(ReduceMotion.System)}>
          <Pressable
            onPress={() => {}}
            style={{ backgroundColor: colors.card, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: insets.bottom + 24, gap: 20 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <AppText size={20} weight="bold" color={colors.primary}>{t('settings')}</AppText>
              <PressableScale label={t('cancel')} onPress={() => setOpen(false)} style={{ width: 44, alignItems: 'center', justifyContent: 'center' }}>
                <IconX color={colors.text} />
              </PressableScale>
            </View>

            <View style={{ gap: 10 }}>
              <AppText weight="semibold">{t('language')}</AppText>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {(Object.keys(languageNames) as Language[]).map((l) => (
                  <Chip key={l} label={languageNames[l]} active={settings.language === l} onPress={() => updateSettings({ language: l })} />
                ))}
              </View>
            </View>

            <View style={{ gap: 10 }}>
              <AppText weight="semibold">{t('theme')}</AppText>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {(['light', 'dark', 'system'] as const).map((m) => (
                  <Chip key={m} label={t(m)} active={settings.theme === m} onPress={() => updateSettings({ theme: m })} />
                ))}
              </View>
            </View>
          </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    </>
  );
}
