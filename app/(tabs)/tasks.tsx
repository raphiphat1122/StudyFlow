import React, { useState } from 'react';
import { View } from 'react-native';
import Animated, { ReduceMotion, ZoomIn } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { IconCheck, IconPlus } from '@tabler/icons-react-native';
import { AppText, Card, Chip, EmptyState, PressableScale, Screen } from '@/components/ui';
import { useApp } from '@/features/store';
import { todayISO } from '@/utils/date';

export default function Tasks() {
  const { t, colors, tasks, toggleTask } = useApp(); const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const today = todayISO();
  const list = tasks.filter((x) => filter === 'all' || x.status === filter).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const open = (id: string) => router.push({ pathname: '/tasks/[id]', params: { id } });
  return <Screen title={t('tasks')} right={<PressableScale label={t('add')} onPress={() => open('new')} style={{ width: 44, alignItems: 'center', justifyContent: 'center' }}><IconPlus color={colors.primary} /></PressableScale>}>
    <View style={{ flexDirection: 'row', gap: 8 }}>{(['all', 'pending', 'completed'] as const).map((k) => <Chip key={k} label={t(k)} active={filter === k} onPress={() => setFilter(k)} />)}</View>
    {list.length === 0 ? <EmptyState mascotName="nodata" title={t('emptyTasks')} action={{ title: t('add'), onPress: () => open('new') }} /> :
      list.map((x) => { const late = x.status === 'pending' && x.dueDate < today; return (
        <Card key={x.id} onPress={() => open(x.id)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <PressableScale label={t('completed')} onPress={() => toggleTask(x.id)} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: colors.primary, backgroundColor: x.status === 'completed' ? colors.primary : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
              {x.status === 'completed' && <Animated.View entering={ZoomIn.duration(160).reduceMotion(ReduceMotion.System)}><IconCheck size={16} color={colors.onPrimary} /></Animated.View>}</View></PressableScale>
          <View style={{ flex: 1 }}>
            <AppText weight="medium" style={{ textDecorationLine: x.status === 'completed' ? 'line-through' : 'none' }}>{x.title}</AppText>
            <AppText size={12} color={late ? colors.danger : colors.muted}>{x.dueDate}{x.subject ? ` · ${x.subject}` : ''}{late ? ` · ${t('overdue')}` : ''}</AppText></View>
        </Card>); })}
  </Screen>;
}
