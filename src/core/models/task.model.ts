export type TaskStatus = 'pending' | 'done';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;

  // programación
  date: string; // 'YYYY-MM-DD' (día)
  time?: string; // 'HH:mm' (opcional)
  durationMin?: number; // estimado (opcional)

  createdAt: number;
}
