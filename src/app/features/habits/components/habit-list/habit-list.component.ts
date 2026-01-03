import { Component, input, output } from '@angular/core';
import { HabitItemComponent } from '../habit-item/habit-item.component';
import { Habit } from '../../../../../core/models/habit.model';

@Component({
  selector: 'app-habit-list',
  standalone: true,
  imports: [HabitItemComponent],
  templateUrl: './habit-list.component.html',
  styleUrl: './habit-list.component.scss',
})
export class HabitListComponent {
  // INPUT como signal (lista que viene de afuera)
  habits = input.required<Habit[]>();

  // OUTPUTS como signal-outputs
  toggleHabit = output<string>();
  editHabit = output<{ id: string; title: string }>();
  deleteHabit = output<string>();
}
