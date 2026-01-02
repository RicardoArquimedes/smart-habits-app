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
  addHabit(title: string) {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      title,
      createdAt: new Date(),
      completed: false,
    };

    this._habits.update((habits) => [...habits, newHabit]);
  }

  toggleHabit(id: string) {
    this._habits.update((habits) =>
      habits.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h)),
    );
  }

  // =========================
  // Helpers privados
  // =========================
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
}
