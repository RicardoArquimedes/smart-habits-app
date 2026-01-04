import { Component, effect, inject } from '@angular/core';
import { HabitFormComponent } from '../../components/habit-form/habit-form.component';
import { HabitListComponent } from '../../components/habit-list/habit-list.component';
import { HabitsStore } from '../../../../../features/habits/store/habits.store';
import { HabitStatsComponent } from '../../components/habit-stats/habit-stats.component';
import { HabitFiltersComponent } from '../../components/habit-filters/habit-filters.component';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../../../core/services/theme/theme.service';
import { CalendarGridComponent } from '../../components/calendar-grid/calendar-grid.component';
import { AuthService } from '../../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-habits-page',
  standalone: true,
  imports: [
    CommonModule,
    HabitFormComponent,
    HabitListComponent,
    HabitStatsComponent,
    HabitFiltersComponent,
    CalendarGridComponent,
  ],
  templateUrl: './habits-page.component.html',
  styleUrl: './habits-page.component.scss',
})
export class HabitsPageComponent {
  readonly store = inject(HabitsStore);
  readonly auth = inject(AuthService);
  private readonly themeService = inject(ThemeService);

  readonly theme = this.themeService.theme;

  constructor() {
    effect(() => {
      if (!this.auth.isLoggedIn()) {
        // Espera a que el DOM exista
        queueMicrotask(() => {
          this.auth.initGoogle('google-btn');
        });
      }

      if (this.auth.user() && this.auth.token()) {
        this.store.setAuth(this.auth.user()!.sub, this.auth.token()!);
        this.store.loadFromBackend();
      }
    });
  }

  toggleTheme() {
    this.themeService.toggle();
  }
}
