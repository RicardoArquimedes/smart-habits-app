import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-habit-stats',
  standalone: true,
  templateUrl: './habit-stats.component.html',
  styleUrl: './habit-stats.component.scss',
})
export class HabitStatsComponent {
  @Input({ required: true }) total = 0;
  @Input({ required: true }) completed = 0;
  @Input({ required: true }) pending = 0;
  @Input({ required: true }) progress = 0;
}
