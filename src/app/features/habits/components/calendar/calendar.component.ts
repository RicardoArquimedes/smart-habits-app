import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HabitsStore } from '../../../../../features/habits/store/habits.store';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent {
  readonly store = inject(HabitsStore);
}
