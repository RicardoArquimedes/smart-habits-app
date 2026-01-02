import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-habit-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './habit-form.component.html',
  styleUrl: './habit-form.component.scss',
})
export class HabitFormComponent {
  title = '';

  // OUTPUT: aviso que se quiere crear un hábito
  @Output() createHabit = new EventEmitter<string>();

  submit() {
    const value = this.title.trim();
    if (!value) return;

    this.createHabit.emit(value);
    this.title = '';
  }
}
