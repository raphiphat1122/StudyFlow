import AsyncStorage from '@react-native-async-storage/async-storage';
export const KEYS = { schedule: 'sf:schedule', tasks: 'sf:tasks', sessions: 'sf:sessions', goals: 'sf:goals', settings: 'sf:settings' } as const;
export async function load<T>(key: string, fallback: T, validate?: (v: unknown) => v is T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw == null) return fallback;
    const parsed: unknown = JSON.parse(raw);
    if (validate && !validate(parsed)) return fallback;
    return parsed as T;
  } catch { return fallback; }
}
export async function save<T>(key: string, value: T): Promise<boolean> {
  try { await AsyncStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
}
export async function resetAll(): Promise<boolean> {
  try { await AsyncStorage.multiRemove(Object.values(KEYS)); return true; } catch { return false; }
}
export const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
