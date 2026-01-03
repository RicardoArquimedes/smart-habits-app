import { Component, input, output } from '@angular/core';
import { Habit } from '../../../../../core/models/habit.model';

@Component({
  selector: 'app-habit-item',
  standalone: true,
  templateUrl: './habit-item.component.html',
  styleUrl: './habit-item.component.scss',
})
export class HabitItemComponent {
  // INPUT como signal (dato externo, solo lectura)
  habit = input.required<Habit>();

  // OUTPUT como signal-based output
  toggle = output<string>();

  onToggle() {
    this.toggle.emit(this.habit().id);
  }
}
