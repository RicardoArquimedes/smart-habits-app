import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { Habit } from '../../../core/models/habit.model';
import { HabitFilter } from '../../../core/models/habit-filter.model';
import { HabitsApi } from '../../../app/features/habits/api/habits.api';
import { HabitApiResponse } from '../../../core/models/habit-api-response.model';

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
  private readonly _habits = signal<Habit[]>([]);

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

  // =========================
  // Estado de sincronización (API)
  // =========================
  readonly isSyncing = signal(false);
  readonly lastSyncAt = signal<Date | null>(null);
  private api = inject(HabitsApi);

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
    // 🔌 Auto-sync cuando haya usuario autenticado
    effect(() => {
      if (this.userId() && this.authToken()) {
        this.syncToApi();
      }
    });
  }

  // =========================
  // Acciones
  // =========================
  addHabit(dto: any) {
    const title = dto.title.trim();
    if (!title) return;

    this.api
      .createHabit({
        title,
        date: dto.date,
      })
      .subscribe({
        next: (created) => {
          this._habits.update((h) => [
            ...h,
            {
              id: created.habitId, // 👈 CLAVE
              title: created.title,
              completed: created.completed,
              date: created.date,
              createdAt: new Date(created.createdAt),
            },
          ]);
        },
        error: (err) => {
          console.error('Error creating habit', err);
        },
      });
  }

  toggleHabit(id: string) {
    const habit = this._habits().find((h) => h.id === id);
    if (!habit) return;

    const completed = !habit.completed;

    this.api.updateHabit(id, { completed }).subscribe({
      next: () => {
        this._habits.update((habits) =>
          habits.map((h) => (h.id === id ? { ...h, completed } : h)),
        );
      },
      error: (err) => {
        console.error('Error toggling habit', err);
      },
    });
  }

  editHabit(id: string, newTitle: string) {
    const title = newTitle.trim();
    if (!title) return;

    this.api.updateHabit(id, { title }).subscribe({
      next: () => {
        this._habits.update((habits) =>
          habits.map((h) => (h.id === id ? { ...h, title } : h)),
        );
      },
      error: (err) => {
        console.error('Error updating habit', err);
      },
    });
  }

  deleteHabit(id: string) {
    console.log('el id', id);
    this.api.deleteHabit(id).subscribe({
      next: () => {
        this._habits.update((habits) => habits.filter((h) => h.id !== id));
      },
      error: (err) => {
        console.error('Error deleting habit', err);
      },
    });
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

      let habits = this.habits().filter((h) => h.date === key);

      if (filter === 'completed') {
        habits = habits.filter((h) => h.completed);
      }

      if (filter === 'pending') {
        habits = habits.filter((h) => !h.completed);
      }

      return {
        key,
        day: date.getDate(),
        inMonth: date.getMonth() === monthIndex,
        total: habits.length,
        completed: habits.filter((h) => h.completed).length,
        titles: habits.map((h) => h.title),
      };
    });

    // 🔥 SOLO ocultar días vacíos cuando NO es "all"
    return filter === 'all' ? days : days.filter((day) => day.total > 0);
  });

 monthLabel = computed(() => {
  return this.currentMonth()
    .toLocaleDateString('es-ES', {
      month: 'long',
      year: 'numeric',
    })
    .replace(' de ', ' ')
    .replace(/^\w/, c => c.toUpperCase());
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
  this._habits().filter(
    h => h.date === this.selectedDate()
  )
);


  // =========================
  // Auth (Google / JWT)
  // =========================
  readonly userId = signal<string | null>(null);
  readonly authToken = signal<string | null>(null);

  setAuth(userId: string, token: string) {
    this.userId.set(userId);
    this.authToken.set(token);
  }

  clearAuth() {
    this.userId.set(null);
    this.authToken.set(null);
  }

  // =========================
  // API Sync (placeholder)
  // =========================
  syncFromApi() {
    // FUTURO:
    // 1. Llamar API Gateway
    // 2. Obtener hábitos del usuario
    // 3. this._habits.set(response)
    this.lastSyncAt.set(new Date());
  }

  syncToApi() {
    // FUTURO:
    // 1. Enviar this._habits()
    // 2. Guardar en DynamoDB
  }

  loadFromBackend() {
    this.api.getHabits().subscribe({
      next: (habits: HabitApiResponse[]) => {
        this._habits.set(
          habits.map((h) => ({
            id: h.habitId, // ✅ MAPEO CLAVE
            title: h.title,
            completed: h.completed,
            date: h.date,
            createdAt: new Date(h.createdAt),
          })),
        );
      },
      error: (err) => console.error(err),
    });
  }
}
