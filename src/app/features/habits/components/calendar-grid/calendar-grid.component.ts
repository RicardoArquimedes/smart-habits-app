import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { CalendarDay } from '../../../../../core/models/calendar-day.model';

@Component({
  selector: 'app-calendar-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar-grid.component.html',
  styleUrl: './calendar-grid.component.scss',
})
export class CalendarGridComponent {
  days = input.required<CalendarDay[]>();
  selectDay = output<string>();
}
