import { Injectable, signal, computed } from '@angular/core';
import { Habit } from '../../../core/models/habit.model';

@Injectable({
  providedIn: 'root',
})
export class HabitsStore {
  // Estado principal
  private readonly _habits = signal<Habit[]>([]);

  // Estado público (solo lectura)
  readonly habits = computed(() => this._habits());

  // Estadísticas derivadas
  readonly totalHabits = computed(() => this._habits().length);

  readonly completedHabits = computed(
    () => this._habits().filter(h => h.completed).length
  );

  // Acciones (por ahora vacías o mínimas)
  addHabit(title: string) {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      title,
      createdAt: new Date(),
      completed: false,
    };

    this._habits.update(habits => [...habits, newHabit]);
  }

  toggleHabit(id: string) {
    this._habits.update(habits =>
      habits.map(h =>
        h.id === id ? { ...h, completed: !h.completed } : h
      )
    );
  }
}
