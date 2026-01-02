import { Component, inject } from '@angular/core';
import { HabitFormComponent } from '../../components/habit-form/habit-form.component';
import { HabitListComponent } from '../../components/habit-list/habit-list.component';
import { HabitsStore } from '../../../../../features/habits/store/habits.store';
import { HabitStatsComponent } from '../../components/habit-stats/habit-stats.component';
import { HabitFiltersComponent } from '../../components/habit-filters/habit-filters.component';


@Component({
  selector: 'app-habits-page',
  standalone: true,
  imports: [HabitFormComponent, HabitListComponent, HabitStatsComponent, HabitFiltersComponent],
  templateUrl: './habits-page.component.html',
  styleUrl: './habits-page.component.scss',
})
export class HabitsPageComponent {
  readonly store = inject(HabitsStore);


}
