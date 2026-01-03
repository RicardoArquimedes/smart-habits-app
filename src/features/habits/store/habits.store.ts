import { Injectable, signal, computed, effect } from '@angular/core';
import { Habit } from '../../../core/models/habit.model';
import { HabitFilter } from '../../../core/models/habit-filter.model';

const STORAGE_KEY = 'smart-habits';

@Injectable({
  providedIn: 'root',
})
export class HabitsStore {
  private readonly _filter = signal<HabitFilter>('all');

  readonly filter = computed(() => this._filter());
  readonly hasHabits = computed(() => this.totalHabits() > 0);
  date = signal(this.today());
  selectedDate = signal(this.today());
  currentMonth = signal(new Date());

  readonly hasFilteredResults = computed(
    () => this.filteredHabits().length > 0,
  );

  // =========================
  // Estado principal (privado)
  // =========================
  private readonly _habits = signal<Habit[]>(this.loadFromStorage());

  // =========================
  // Estado público (lectura)
  // =========================
  readonly habits = computed(() => this._habits());

  // =========================
  // Estado derivado
  // =========================
  readonly totalHabits = computed(() => this._habits().length);

  readonly completedHabits = computed(
    () => this._habits().filter((h) => h.completed).length,
  );

  readonly filteredHabits = computed(() => {
    const habits = this._habits();
    const filter = this._filter();

    switch (filter) {
      case 'completed':
        return habits.filter((h) => h.completed);

      case 'pending':
        return habits.filter((h) => !h.completed);

      default:
        return habits;
    }
  });

  constructor() {
    // Persistencia automática
    effect(() => {
      const habits = this._habits();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
    });
  }

  // =========================
  // Acciones
  // =========================
  addHabit(habitOrTitle: Habit | string) {
    const habit =
      typeof habitOrTitle === 'string'
        ? {
            id: crypto.randomUUID(),
            title: habitOrTitle,
            createdAt: new Date(),
            completed: false,
            date: this.selectedDate(),
          }
        : habitOrTitle;

    this._habits.update((h) => [...h, habit]);
  }

  toggleHabit(id: string) {
    this._habits.update((habits) =>
      habits.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h)),
    );
  }

  editHabit(id: string, newTitle: string) {
    const title = newTitle.trim();
    if (!title) return;

    this._habits.update((habits) =>
      habits.map((habit) => (habit.id === id ? { ...habit, title } : habit)),
    );
  }

  deleteHabit(id: string) {
    this._habits.update((habits) => habits.filter((habit) => habit.id !== id));
  }

  // =========================
  // Helpers privados
  // =========================

  private today() {
    return new Date().toISOString().slice(0, 10);
  }

  private format(date: Date) {
    return date.toISOString().slice(0, 10);
  }

  private loadFromStorage(): Habit[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    try {
      const parsed = JSON.parse(raw) as Habit[];

      // Opcional: normalizar fechas si las usas luego
      return parsed.map((h) => ({
        ...h,
        createdAt: new Date(h.createdAt),
      }));
    } catch {
      return [];
    }
  }

  readonly pendingHabits = computed(
    () => this.totalHabits() - this.completedHabits(),
  );

  readonly progress = computed(() => {
    const total = this.totalHabits();
    if (total === 0) return 0;

    return Math.round((this.completedHabits() / total) * 100);
  });

  setFilter(filter: HabitFilter) {
    this._filter.set(filter);
  }

calendarDays = computed(() => {
  const month = this.currentMonth();
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const filter = this.filter();

  const first = new Date(year, monthIndex, 1);
  const start = new Date(first);
  start.setDate(first.getDate() - ((first.getDay() + 6) % 7));

  const days = Array.from({ length: 42 }).map((_, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);

    const key = this.format(date);

    let habits = this.habits().filter(h => h.date === key);

    if (filter === 'completed') {
      habits = habits.filter(h => h.completed);
    }

    if (filter === 'pending') {
      habits = habits.filter(h => !h.completed);
    }

    return {
      key,
      day: date.getDate(),
      inMonth: date.getMonth() === monthIndex,
      total: habits.length,
      completed: habits.filter(h => h.completed).length,
      titles: habits.map(h => h.title),
    };
  });

  // 🔥 SOLO ocultar días vacíos cuando NO es "all"
  return filter === 'all'
    ? days
    : days.filter(day => day.total > 0);
});




  monthLabel = computed(() => {
    return this.currentMonth().toLocaleDateString(undefined, {
      month: 'long',
      year: 'numeric',
    });
  });

  nextMonth() {
    const d = new Date(this.currentMonth());
    d.setMonth(d.getMonth() + 1);
    this.currentMonth.set(d);
  }

  prevMonth() {
    const d = new Date(this.currentMonth());
    d.setMonth(d.getMonth() - 1);
    this.currentMonth.set(d);
  }

  selectDate(date: string) {
    this.selectedDate.set(date);
  }

  habitsForSelectedDay = computed(() =>
    this.habits().filter((h) => h.date === this.selectedDate()),
  );
}
