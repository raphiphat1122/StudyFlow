import React, { useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppText, Button, ConfirmDialog, Field, Screen } from '@/components/ui';
import { useApp } from '@/features/store';
import { useUnsavedGuard } from '@/hooks/useUnsavedGuard';
import { isValidDate, isValidTime, toMinutes, todayISO } from '@/utils/date';

export default function ScheduleForm() {
  const { id } = useLocalSearchParams<{ id: string }>(); const { t, schedule, upsertSchedule, removeSchedule } = useApp(); const router = useRouter();
  const existing = schedule.find((s) => s.id === id);
  const [f, setF] = useState(existing ?? { id: undefined as string | undefined, title: '', subject: '', date: todayISO(), startTime: '09:00', endTime: '10:00', location: '', notes: '' });
  const [dirty, setDirty] = useState(false); const [saved, setSaved] = useState(false); const [errs, setErrs] = useState<Record<string, string>>({}); const [del, setDel] = useState(false);
  useUnsavedGuard(dirty && !saved, t('unsaved'), t('discard'), t('cancel'));
  const set = (k: string) => (v: string) => { setF((p) => ({ ...p, [k]: v })); setDirty(true); };
  const submit = () => {
    const e: Record<string, string> = {};
    if (!f.title.trim()) e.title = t('required');
    if (!isValidDate(f.date)) e.date = t('badDate');
    if (!isValidTime(f.startTime)) e.startTime = t('badTimeFmt');
    if (!isValidTime(f.endTime)) e.endTime = t('badTimeFmt');
    if (!e.startTime && !e.endTime && toMinutes(f.endTime) <= toMinutes(f.startTime)) e.endTime = t('badTime');
    setErrs(e); if (Object.keys(e).length) return;
    setSaved(true); upsertSchedule({ ...f, title: f.title.trim() }); setTimeout(() => router.back(), 0);
  };
  return <Screen title={existing ? t('edit') : t('add')}>
    <Field label={t('title')} value={f.title} onChangeText={set('title')} error={errs.title} />
    <Field label={t('subject')} value={f.subject} onChangeText={set('subject')} />
    <Field label={t('date')} value={f.date} onChangeText={set('date')} error={errs.date} keyboardType="numbers-and-punctuation" />
    <View style={{ flexDirection: 'row', gap: 12 }}>
      <View style={{ flex: 1 }}><Field label={t('start')} value={f.startTime} onChangeText={set('startTime')} error={errs.startTime} keyboardType="numbers-and-punctuation" /></View>
      <View style={{ flex: 1 }}><Field label={t('end')} value={f.endTime} onChangeText={set('endTime')} error={errs.endTime} keyboardType="numbers-and-punctuation" /></View></View>
    <Field label={t('location')} value={f.location} onChangeText={set('location')} />
    <Field label={t('notes')} value={f.notes} onChangeText={set('notes')} multiline />
    <Button title={t('save')} onPress={submit} />
    {existing && <Button title={t('delete')} variant="ghost" onPress={() => setDel(true)} />}
    <ConfirmDialog visible={del} danger message={t('confirmDelete')} confirmLabel={t('delete')} cancelLabel={t('cancel')} onCancel={() => setDel(false)}
      onConfirm={() => { setSaved(true); removeSchedule(f.id!); setDel(false); setTimeout(() => router.back(), 0); }} />
    <AppText size={1}>{''}</AppText>
  </Screen>;
}
