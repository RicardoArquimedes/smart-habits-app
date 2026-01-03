export interface CalendarDay {
  key: string; // YYYY-MM-DD
  day: number;
  inMonth: boolean;
  total: number;
  completed: number;
  titles: string[]; // 👈 NUEVO
}
