import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { IconCalendar, IconChartBar, IconPlus } from '@tabler/icons-react-native';
import { AppText, Card, EmptyState, Mascot, PressableScale, Screen } from '@/components/ui';
import { useApp } from '@/features/store';
import { todayISO } from '@/utils/date';

export default function Home() {
  const { t, colors, schedule, tasks } = useApp(); const router = useRouter(); const today = todayISO();
  const todays = schedule.filter((s) => s.date === today).sort((a, b) => a.startTime.localeCompare(b.startTime));
  const pending = tasks.filter((x) => x.status === 'pending'); const overdue = pending.filter((x) => x.dueDate < today);
  const upcoming = pending.filter((x) => x.dueDate >= today).sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 3);
  const quick = [{ k: 'add', I: IconPlus, go: () => router.push({ pathname: '/tasks/[id]', params: { id: 'new' } }) }, { k: 'schedule', I: IconCalendar, go: () => router.navigate('/schedule') }, { k: 'progress', I: IconChartBar, go: () => router.navigate('/progress') }];
  return <Screen title="StudyFlow">
    <Card style={{ flexDirection: 'row', alignItems: 'center' }}><View style={{ flex: 1 }}><AppText size={20} weight="bold">{t('hello')}</AppText><AppText color={colors.muted}>{t('tagline')}</AppText></View><Mascot name="greeting" size={90} /></Card>
    <View style={{ flexDirection: 'row', gap: 12 }}>{quick.map(({ k, I, go }) => <PressableScale key={k} label={t(k)} onPress={go} style={{ flex: 1, alignItems: 'center', padding: 12, borderRadius: 16, backgroundColor: colors.soft }}><I color={colors.primary} /><AppText size={12}>{t(k)}</AppText></PressableScale>)}</View>
    <View style={{ flexDirection: 'row', gap: 12 }}>
      <Card style={{ flex: 1 }}><AppText size={26} weight="bold" color={colors.primary}>{pending.length}</AppText><AppText size={12} color={colors.muted}>{t('pending')}</AppText></Card>
      <Card style={{ flex: 1 }}><AppText size={26} weight="bold" color={colors.danger}>{overdue.length}</AppText><AppText size={12} color={colors.muted}>{t('overdue')}</AppText></Card></View>
    <AppText weight="semibold">{t('today')}</AppText>
    {todays.length === 0 ? <EmptyState mascotName="sleeping" title={t('emptySchedule')} /> : todays.map((s) => <Card key={s.id} onPress={() => router.push({ pathname: '/schedule/[id]', params: { id: s.id } })}><AppText size={12} color={colors.primary}>{s.startTime} – {s.endTime}</AppText><AppText weight="medium">{s.title}</AppText></Card>)}
    <AppText weight="semibold">{t('due')}</AppText>
    {upcoming.length === 0 ? <EmptyState mascotName="idea" title={t('emptyTasks')} /> : upcoming.map((x) => <Card key={x.id} onPress={() => router.push({ pathname: '/tasks/[id]', params: { id: x.id } })}><AppText weight="medium">{x.title}</AppText><AppText size={12} color={colors.muted}>{x.dueDate}</AppText></Card>)}
  </Screen>;
}
