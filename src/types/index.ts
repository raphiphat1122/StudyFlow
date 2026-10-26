export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'completed';
export type Language = 'th' | 'en' | 'zh' | 'ja';
export interface ScheduleEntry { id: string; title: string; subject: string; date: string; startTime: string; endTime: string; location: string; notes: string; }
export interface Task { id: string; title: string; description: string; subject: string; dueDate: string; priority: Priority; status: TaskStatus; completedAt?: string; }
export interface StudySession { id: string; date: string; minutes: number; subject?: string; }
export interface StudyGoal { id: string; title: string; targetMinutesPerWeek: number; }
export interface Settings { language: Language; theme: ThemeModeSetting; onboarded: boolean; gpa?: number; }
export type ThemeModeSetting = 'light' | 'dark' | 'system';
