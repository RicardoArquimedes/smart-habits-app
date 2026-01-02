import { Component, inject } from '@angular/core';
import { HabitsStore } from '../features/habits/store/habits.store'
import { HabitListComponent } from './features/habits/components/habit-list/habit-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HabitListComponent],
  template: `
    <h1>Smart Habits</h1>

    <button (click)="add()">Add habit</button>

    <app-habit-list
      [habits]="store.habits()"
      (toggleHabit)="store.toggleHabit($event)">
    </app-habit-list>
  `,
})
export class AppComponent {
  store = inject(HabitsStore);

  add() {
    this.store.addHabit('Drink water');
  }
}
