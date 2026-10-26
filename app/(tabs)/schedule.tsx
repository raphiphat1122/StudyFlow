import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { IconPlus, IconChevronLeft, IconChevronRight } from '@tabler/icons-react-native';
import { AppText, Card, Chip, EmptyState, PressableScale, Screen } from '@/components/ui';
import { useApp } from '@/features/store';
import { pad, toISODate, todayISO } from '@/utils/date';

export default function Schedule() {
  const { t, colors, schedule } = useApp(); const router = useRouter();
  const [sel, setSel] = useState(todayISO()); const [mode, setMode] = useState<'day' | 'month'>('month');
  const [ym, setYm] = useState(() => { const d = new Date(); return { y: d.getFullYear(), m: d.getMonth() }; });
  const open = (id: string) => router.push({ pathname: '/schedule/[id]', params: { id } });
  const days = useMemo(() => { const first = new Date(ym.y, ym.m, 1); const n = new Date(ym.y, ym.m + 1, 0).getDate(); const cells: (string | null)[] = Array((first.getDay() + 6) % 7).fill(null);
    for (let i = 1; i <= n; i++) cells.push(`${ym.y}-${pad(ym.m + 1)}-${pad(i)}`); return cells; }, [ym]);
  const items = schedule.filter((s) => s.date === sel).sort((a, b) => a.startTime.localeCompare(b.startTime));
  const shift = (d: number) => setYm(({ y, m }) => { const x = new Date(y, m + d, 1); return { y: x.getFullYear(), m: x.getMonth() }; });
  return <Screen title={t('schedule')} right={<PressableScale label={t('add')} onPress={() => open('new')} style={{ width: 44, alignItems: 'center', justifyContent: 'center' }}><IconPlus color={colors.primary} /></PressableScale>}>
    <View style={{ flexDirection: 'row', gap: 8 }}><Chip label={t('today')} active={mode === 'day'} onPress={() => { setMode('day'); setSel(todayISO()); }} /><Chip label="Month" active={mode === 'month'} onPress={() => setMode('month')} /></View>
    {mode === 'month' && <Card>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <PressableScale label="prev" onPress={() => shift(-1)}><IconChevronLeft color={colors.text} /></PressableScale>
        <AppText weight="semibold">{toISODate(new Date(ym.y, ym.m, 1)).slice(0, 7)}</AppText>
        <PressableScale label="next" onPress={() => shift(1)}><IconChevronRight color={colors.text} /></PressableScale></View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>{days.map((d, i) => <View key={i} style={{ width: `${100 / 7}%`, alignItems: 'center' }}>
        {d && <PressableScale label={d} onPress={() => setSel(d)} style={{ width: 40, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: d === sel ? colors.primary : 'transparent' }}>
          <AppText size={14} color={d === sel ? colors.onPrimary : colors.text}>{+d.slice(8)}</AppText>
          {schedule.some((s) => s.date === d) && <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: d === sel ? colors.onPrimary : colors.primary }} />}</PressableScale>}</View>)}</View></Card>}
    <AppText weight="semibold">{sel}</AppText>
    {items.length === 0 ? <EmptyState mascotName="sleeping" title={t('emptySchedule')} action={{ title: t('add'), onPress: () => open('new') }} /> :
      items.map((s) => <Card key={s.id} onPress={() => open(s.id)}><AppText size={12} color={colors.primary} weight="medium">{s.startTime} – {s.endTime}</AppText>
        <AppText weight="semibold">{s.title}</AppText><AppText size={12} color={colors.muted}>{[s.subject, s.location].filter(Boolean).join(' · ')}</AppText></Card>)}
  </Screen>;
}
