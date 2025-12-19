import { Component, inject } from '@angular/core';
import { HabitsStore } from '../features/habits/store/habits.store';


@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <h1>Smart Habits</h1>
    <button (click)="add()">Add habit</button>
    <p>Total: {{ store.totalHabits() }}</p>
    <p>Completed: {{ store.completedHabits() }}</p>
  `,
})
export class AppComponent {
  store = inject(HabitsStore);

  add() {
    this.store.addHabit('Drink water');
  }
}
