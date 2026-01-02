import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  // INPUT: lista de hábitos (NO es dueña)
  @Input({ required: true }) habits: Habit[] = [];

  // OUTPUT: aviso cuando un hábito se quiere toggle
  @Output() toggleHabit = new EventEmitter<string>();

  onToggle(id: string) {
    this.toggleHabit.emit(id);
  }
}
