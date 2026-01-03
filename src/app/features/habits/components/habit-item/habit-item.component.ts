import { Component, input, output, signal } from '@angular/core';
import { Habit } from '../../../../../core/models/habit.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-habit-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './habit-item.component.html',
  styleUrl: './habit-item.component.scss',
})
export class HabitItemComponent {
  // Input como signal
  habit = input.required<Habit>();

  // Outputs como signal-outputs
  toggle = output<string>();
  edit = output<{ id: string; title: string }>();
  remove = output<string>();

  // Estado local del componente (UI state)
  isEditing = signal(false);
  editedTitle = signal('');

  onToggle() {
    this.toggle.emit(this.habit().id);
  }

  startEdit() {
    this.editedTitle.set(this.habit().title);
    this.isEditing.set(true);
  }

  saveEdit() {
    const title = this.editedTitle().trim();
    if (!title) return;

    this.edit.emit({
      id: this.habit().id,
      title,
    });

    this.isEditing.set(false);
  }

  cancelEdit() {
    this.isEditing.set(false);
  }

  confirmDelete() {
    if (confirm('Delete this habit?')) {
      this.remove.emit(this.habit().id);
    }
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.editedTitle.set(input.value);
  }
}
