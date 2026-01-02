import { Component, inject } from '@angular/core';
import { HabitsStore } from '../features/habits/store/habits.store';
import { HabitListComponent } from './features/habits/components/habit-list/habit-list.component';
import { HabitFormComponent } from './features/habits/components/habit-form/habit-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HabitFormComponent, HabitListComponent],
  template: `
    <h1>Smart Habits</h1>

    <app-habit-form
      (createHabit)="store.addHabit($event)">
    </app-habit-form>

    <app-habit-list
      [habits]="store.habits()"
      (toggleHabit)="store.toggleHabit($event)">
    </app-habit-list>
  `,
})
export class AppComponent {
  store = inject(HabitsStore);
}
