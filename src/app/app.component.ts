import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../core/services/theme/theme.service';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `<router-outlet />`,
})
export class AppComponent implements OnInit {
  constructor(private readonly themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.init();
  }
}
