import React, { useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button, Chip, ConfirmDialog, Field, Screen, AppText } from '@/components/ui';
import { useApp } from '@/features/store';
import { useUnsavedGuard } from '@/hooks/useUnsavedGuard';
import { isValidDate, todayISO } from '@/utils/date';
import type { Priority, Task } from '@/types';

export default function TaskForm() {
  const { id } = useLocalSearchParams<{ id: string }>(); const { t, colors, tasks, upsertTask, removeTask } = useApp(); const router = useRouter();
  const existing = tasks.find((x) => x.id === id);
  const [f, setF] = useState<Omit<Task, 'id'> & { id?: string }>(existing ?? { title: '', description: '', subject: '', dueDate: todayISO(), priority: 'medium', status: 'pending' });
  const [dirty, setDirty] = useState(false); const [saved, setSaved] = useState(false); const [errs, setErrs] = useState<Record<string, string>>({}); const [del, setDel] = useState(false);
  useUnsavedGuard(dirty && !saved, t('unsaved'), t('discard'), t('cancel'));
  const set = (k: keyof Task) => (v: string) => { setF((p) => ({ ...p, [k]: v })); setDirty(true); };
  const submit = () => {
    const e: Record<string, string> = {};
    if (!f.title.trim()) e.title = t('required'); if (!isValidDate(f.dueDate)) e.dueDate = t('badDate');
    setErrs(e); if (Object.keys(e).length) return;
    setSaved(true); upsertTask({ ...f, title: f.title.trim() }); setTimeout(() => router.back(), 0);
  };
  return <Screen title={existing ? t('edit') : t('add')}>
    <Field label={t('title')} value={f.title} onChangeText={set('title')} error={errs.title} />
    <Field label={t('description')} value={f.description} onChangeText={set('description')} multiline />
    <Field label={t('subject')} value={f.subject} onChangeText={set('subject')} />
    <Field label={t('due')} value={f.dueDate} onChangeText={set('dueDate')} error={errs.dueDate} keyboardType="numbers-and-punctuation" />
    <AppText size={13} weight="medium" color={colors.muted}>{t('priority')}</AppText>
    <View style={{ flexDirection: 'row', gap: 8 }}>{(['low', 'medium', 'high'] as Priority[]).map((p) => <Chip key={p} label={t(p)} active={f.priority === p} onPress={() => { setF({ ...f, priority: p }); setDirty(true); }} />)}</View>
    <Button title={t('save')} onPress={submit} />
    {existing && <Button title={t('delete')} variant="ghost" onPress={() => setDel(true)} />}
    <ConfirmDialog visible={del} danger message={t('confirmDelete')} confirmLabel={t('delete')} cancelLabel={t('cancel')} onCancel={() => setDel(false)}
      onConfirm={() => { setSaved(true); removeTask(f.id!); setDel(false); setTimeout(() => router.back(), 0); }} />
  </Screen>;
}
