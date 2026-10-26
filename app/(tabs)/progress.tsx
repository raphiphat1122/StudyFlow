import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { AppText, Button, Card, EmptyState, Field, Screen } from '@/components/ui';
import { useApp } from '@/features/store';
import { toISODate, weekStartISO } from '@/utils/date';

function Bar({ value, max, label, color }: { value: number; max: number; label: string; color: string }) {
  const h = useSharedValue(0);
  useEffect(() => { h.value = withTiming(max ? value / max : 0, { duration: 500 }); }, [value, max, h]);
  const a = useAnimatedStyle(() => ({ height: `${Math.max(h.value * 100, value > 0 ? 4 : 0)}%` }));
  return <View style={{ flex: 1, alignItems: 'center', gap: 4 }}><View style={{ height: 100, justifyContent: 'flex-end', width: 20 }}><Animated.View style={[{ backgroundColor: color, borderRadius: 8, width: 20 }, a]} /></View><AppText size={11}>{label}</AppText></View>;
}
export default function Progress() {
  const { t, colors, sessions, goals, setWeeklyGoal, addSession, settings, updateSettings } = useApp();
  const [goal, setGoal] = useState(String(goals[0]?.targetMinutesPerWeek ?? '')); const [mins, setMins] = useState(''); const [gpa, setGpa] = useState(settings.gpa?.toString() ?? '');
  const total = sessions.reduce((s, x) => s + x.minutes, 0); const ws = weekStartISO();
  const week = sessions.filter((x) => x.date >= ws).reduce((s, x) => s + x.minutes, 0); const target = goals[0]?.targetMinutesPerWeek ?? 0;
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); const iso = toISODate(d); return { label: iso.slice(8), v: sessions.filter((x) => x.date === iso).reduce((s, x) => s + x.minutes, 0) }; });
  const max = Math.max(...days.map((d) => d.v), 1); const num = (s: string) => { const n = Number(s); return Number.isFinite(n) && n > 0 ? n : null; };
  return <Screen title={t('progress')}>
    <Card><AppText color={colors.muted} size={12}>{t('totalTime')}</AppText><AppText size={28} weight="bold" color={colors.primary}>{total} {t('minutes')}</AppText>
      <AppText size={12} color={colors.muted}>{t('week')}: {week}{target ? ` / ${target}` : ''} {t('minutes')}</AppText></Card>
    {sessions.length === 0 ? <EmptyState mascotName="goal" title={t('emptyProgress')} /> :
      <Card><View style={{ flexDirection: 'row' }}>{days.map((d, i) => <Bar key={i} value={d.v} max={max} label={d.label} color={colors.primary} />)}</View></Card>}
    <Card style={{ gap: 12 }}><Field label={t('logSession')} value={mins} onChangeText={setMins} keyboardType="number-pad" placeholder={t('minutes')} />
      <Button title={t('add')} onPress={() => { const n = num(mins); if (n) { addSession(Math.round(n)); setMins(''); } }} /></Card>
    <Card style={{ gap: 12 }}><Field label={t('goal')} value={goal} onChangeText={setGoal} keyboardType="number-pad" />
      <Button title={t('save')} onPress={() => { const n = num(goal); if (n) setWeeklyGoal(Math.round(n)); }} /></Card>
    <Card style={{ gap: 12 }}><Field label={t('gpa')} value={gpa} onChangeText={setGpa} keyboardType="decimal-pad" />
      <AppText size={12} color={colors.muted}>{t('gpaNote')}</AppText>
      <Button title={t('save')} onPress={() => { const n = Number(gpa); if (gpa === '') updateSettings({ gpa: undefined }); else if (Number.isFinite(n) && n >= 0 && n <= 4) updateSettings({ gpa: n }); }} /></Card>
  </Screen>;
}
