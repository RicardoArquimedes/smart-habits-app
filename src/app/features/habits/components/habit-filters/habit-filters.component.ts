import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HabitFilter } from '../../../../../core/models/habit-filter.model';

@Component({
  selector: 'app-habit-filters',
  standalone: true,
  templateUrl: './habit-filters.component.html',
  styleUrl: './habit-filters.component.scss',
})
export class HabitFiltersComponent {
  @Input({ required: true }) current!: HabitFilter;
  @Output() change = new EventEmitter<HabitFilter>();

  select(filter: HabitFilter) {
    this.change.emit(filter);
  }
}
