import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { KEYS, load, save, resetAll, newId } from '@/services/storage';
import { darkColors, lightColors, type Colors } from '@/theme';
import { dictionaries } from '@/i18n';
import type { ScheduleEntry, Settings, StudyGoal, StudySession, Task } from '@/types';

const defaults: Settings = { language: 'th', theme: 'system', onboarded: false };
const isArr = <T,>(v: unknown): v is T[] => Array.isArray(v);
const isSettings = (v: unknown): v is Settings => typeof v === 'object' && v !== null && 'language' in v && 'theme' in v;

interface Ctx {
  ready: boolean; colors: Colors; isDark: boolean; t: (k: string) => string;
  settings: Settings; updateSettings: (p: Partial<Settings>) => void;
  schedule: ScheduleEntry[]; upsertSchedule: (e: Omit<ScheduleEntry, 'id'> & { id?: string }) => void; removeSchedule: (id: string) => void;
  tasks: Task[]; upsertTask: (e: Omit<Task, 'id'> & { id?: string }) => void; removeTask: (id: string) => void; toggleTask: (id: string) => void;
  sessions: StudySession[]; addSession: (minutes: number, subject?: string) => void;
  goals: StudyGoal[]; setWeeklyGoal: (minutes: number) => void;
  resetData: () => Promise<boolean>;
}
const C = createContext<Ctx | null>(null);
export const useApp = () => { const c = useContext(C); if (!c) throw new Error('AppProvider missing'); return c; };

function upsert<T extends { id: string }>(list: T[], item: Omit<T, 'id'> & { id?: string }): T[] {
  const id = item.id ?? newId(); const full = { ...item, id } as T;
  return list.some((x) => x.id === id) ? list.map((x) => (x.id === id ? full : x)) : [...list, full];
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [settings, setSettings] = useState<Settings>(defaults);
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const system = useColorScheme();

  useEffect(() => { (async () => {
    const [s, sc, tk, se, g] = await Promise.all([
      load(KEYS.settings, defaults, isSettings), load<ScheduleEntry[]>(KEYS.schedule, [], isArr), load<Task[]>(KEYS.tasks, [], isArr),
      load<StudySession[]>(KEYS.sessions, [], isArr), load<StudyGoal[]>(KEYS.goals, [], isArr)]);
    setSettings({ ...defaults, ...s }); setSchedule(sc); setTasks(tk); setSessions(se); setGoals(g); setReady(true);
  })(); }, []);

  const persist = <T,>(key: string, setter: (v: T) => void) => (v: T) => { setter(v); void save(key, v); };
  const updateSettings = useCallback((p: Partial<Settings>) => setSettings((cur) => { const n = { ...cur, ...p }; void save(KEYS.settings, n); return n; }), []);
  const mut = <T,>(key: string, set: React.Dispatch<React.SetStateAction<T>>, fn: (cur: T) => T) => set((cur) => { const n = fn(cur); void save(key, n); return n; });

  const isDark = settings.theme === 'dark' || (settings.theme === 'system' && system === 'dark');
  const dict = dictionaries[settings.language];
  const value = useMemo<Ctx>(() => ({
    ready, isDark, colors: isDark ? darkColors : lightColors, t: (k) => dict[k] ?? dictionaries.en[k] ?? k,
    settings, updateSettings, schedule, tasks, sessions, goals,
    upsertSchedule: (e) => mut(KEYS.schedule, setSchedule, (c) => upsert(c, e)),
    removeSchedule: (id) => mut(KEYS.schedule, setSchedule, (c) => c.filter((x) => x.id !== id)),
    upsertTask: (e) => mut(KEYS.tasks, setTasks, (c) => upsert(c, e)),
    removeTask: (id) => mut(KEYS.tasks, setTasks, (c) => c.filter((x) => x.id !== id)),
    toggleTask: (id) => mut(KEYS.tasks, setTasks, (c) => c.map((x) => x.id === id ? { ...x, status: x.status === 'completed' ? 'pending' : 'completed', completedAt: x.status === 'completed' ? undefined : new Date().toISOString() } : x)),
    addSession: (minutes, subject) => mut(KEYS.sessions, setSessions, (c) => [...c, { id: newId(), date: new Date().toISOString().slice(0, 10), minutes, subject }]),
    setWeeklyGoal: (m) => mut(KEYS.goals, setGoals, () => [{ id: 'weekly', title: 'weekly', targetMinutesPerWeek: m }]),
    resetData: async () => { const ok = await resetAll(); if (ok) { setSchedule([]); setTasks([]); setSessions([]); setGoals([]); setSettings(defaults); } return ok; },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [ready, isDark, dict, settings, schedule, tasks, sessions, goals, updateSettings]);
  void persist;
  return <C.Provider value={value}>{children}</C.Provider>;
}
