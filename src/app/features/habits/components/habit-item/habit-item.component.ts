import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Habit } from '../../../../../core/models/habit.model';


@Component({
  selector: 'app-habit-item',
  standalone: true,
  templateUrl: './habit-item.component.html',
  styleUrl: './habit-item.component.scss',
})
export class HabitItemComponent {
  // INPUT: dato que NO me pertenece
  @Input({ required: true }) habit!: Habit;

  // OUTPUT: aviso de algo que pasó
  @Output() toggle = new EventEmitter<string>();

  onToggle() {
    this.toggle.emit(this.habit.id);
  }
}
