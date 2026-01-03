export interface CalendarDay {
  /** YYYY-MM-DD */
  key: string;

  /** Número visible del día (1–31) */
  day: number;

  /** Pertenece al mes actual */
  inMonth: boolean;

  /** Total de hábitos ese día */
  total: number;

  /** Hábitos completados ese día */
  completed: number;
}
