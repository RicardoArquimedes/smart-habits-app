import { Injectable, computed, signal } from '@angular/core';
import { Task } from '../../../core/models/task.model';
import {
  addDays,
  endOfMonth,
  startOfMonth,
  startOfWeek,
  toDateKey,
} from '../../../core/utils/date.utils';

@Injectable({ providedIn: 'root' })
export class TasksStore {
  private readonly _tasks = signal<Task[]>([]);
  readonly tasks = this._tasks.asReadonly();

  // Calendario
  private readonly _monthCursor = signal(new Date()); // mes visible
  readonly monthCursor = this._monthCursor.asReadonly();

  private readonly _selectedDate = signal(toDateKey(new Date()));
  readonly selectedDate = this._selectedDate.asReadonly();

  // --- Computeds útiles
  readonly tasksByDate = computed(() => {
    const map = new Map<string, Task[]>();
    for (const t of this._tasks()) {
      const arr = map.get(t.date) ?? [];
      arr.push(t);
      map.set(t.date, arr);
    }
    // ordenar por hora (si hay)
    for (const [k, arr] of map.entries()) {
      arr.sort((a, b) => (a.time ?? '99:99').localeCompare(b.time ?? '99:99'));
      map.set(k, arr);
    }
    return map;
  });

  readonly selectedDayTasks = computed(() => {
    return this.tasksByDate().get(this._selectedDate()) ?? [];
  });

  readonly monthGridDays = computed(() => {
    const cursor = this._monthCursor();
    const start = startOfWeek(startOfMonth(cursor));
    const end = endOfMonth(cursor);

    // construir 6 semanas (42 celdas) para grid estable
    const days: {
      key: string;
      inMonth: boolean;
      date: Date;
      count: number;
      done: number;
    }[] = [];
    let d = start;
    for (let i = 0; i < 42; i++) {
      const key = toDateKey(d);
      const list = this.tasksByDate().get(key) ?? [];
      const done = list.filter((x) => x.status === 'done').length;

      days.push({
        key,
        date: new Date(d),
        inMonth: d.getMonth() === cursor.getMonth(),
        count: list.length,
        done,
      });

      d = addDays(d, 1);
    }
    return days;
  });

  // --- Acciones
  setSelectedDate(key: string) {
    this._selectedDate.set(key);
  }

  prevMonth() {
    const c = this._monthCursor();
    this._monthCursor.set(new Date(c.getFullYear(), c.getMonth() - 1, 1));
  }

  nextMonth() {
    const c = this._monthCursor();
    this._monthCursor.set(new Date(c.getFullYear(), c.getMonth() + 1, 1));
  }

  addTask(payload: {
    title: string;
    date: string;
    time?: string;
    durationMin?: number;
  }) {
    const title = payload.title.trim();
    if (!title) return;

    const task: Task = {
      id: crypto.randomUUID(),
      title,
      status: 'pending',
      date: payload.date,
      time: payload.time || undefined,
      durationMin: payload.durationMin || undefined,
      createdAt: Date.now(),
    };

    this._tasks.update((list) => [task, ...list]);
  }

  toggleTask(id: string) {
    this._tasks.update((list) =>
      list.map((t) =>
        t.id === id
          ? { ...t, status: t.status === 'done' ? 'pending' : 'done' }
          : t,
      ),
    );
  }

  editTask(id: string, title: string) {
    const next = title.trim();
    if (!next) return;
    this._tasks.update((list) =>
      list.map((t) => (t.id === id ? { ...t, title: next } : t)),
    );
  }

  deleteTask(id: string) {
    this._tasks.update((list) => list.filter((t) => t.id !== id));
  }
}
