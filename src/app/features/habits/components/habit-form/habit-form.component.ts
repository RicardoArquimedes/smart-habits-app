import { Component, Output, EventEmitter, signal, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Habit } from '../../../../../core/models/habit.model';

@Component({
  selector: 'app-habit-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './habit-form.component.html',
  styleUrl: './habit-form.component.scss',
})
export class HabitFormComponent {
  title = signal('');
  date = signal(this.today());

  // OUTPUT: aviso que se quiere crear un hábito
  createHabit = output<any>();
submit() {
  const title = this.title().trim();
  if (!title) return;

  this.createHabit.emit({
    title,
    date: this.date(),
  });

  this.title.set('');
}


  onDate(e: Event) {
    this.date.set((e.target as HTMLInputElement).value);
  }

  private today() {
    return new Date().toISOString().slice(0, 10);
  }
}
