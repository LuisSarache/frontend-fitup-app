import { WorkoutEntry } from '../types';

export function groupByDate(entries: WorkoutEntry[]): Record<string, WorkoutEntry[]> {
  return entries.reduce(
    (acc, entry) => {
      const date = new Date(entry.completedAt).toLocaleDateString('pt-BR');
      if (!acc[date]) acc[date] = [];
      acc[date].push(entry);
      return acc;
    },
    {} as Record<string, WorkoutEntry[]>,
  );
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}min ${s}s` : `${m}min`;
}

export function getRelativeDate(isoDate: string): string {
  const date = new Date(isoDate);
  const today = new Date();
  const diffDays = Math.floor((today.getTime() - date.getTime()) / 86400000);
  if (diffDays === 0) return 'Hoje';
  if (diffDays === 1) return 'Ontem';
  return `${diffDays} dias atrás`;
}

export function getWeekActivity(entries: WorkoutEntry[]): boolean[] {
  const today = new Date();
  const currentDayOfWeek = today.getDay(); // 0=domingo, 6=sábado
  
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(today);
    const daysToSubtract = currentDayOfWeek - i;
    day.setDate(today.getDate() - daysToSubtract);
    day.setHours(0, 0, 0, 0);
    
    const dayStr = day.toDateString();
    return entries.some((e) => {
      const entryDate = new Date(e.completedAt);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.toDateString() === dayStr;
    });
  });
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
