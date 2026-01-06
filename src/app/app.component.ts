import { Component, effect, OnInit } from '@angular/core';
import { ThemeService } from '../core/services/theme/theme.service';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/services/auth/auth.service';
import { LoginComponent } from '../features/auth/login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `<router-outlet />`,
})
export class AppComponent implements OnInit {
  constructor(
    private readonly themeService: ThemeService,
    private readonly auth: AuthService,
    private router: Router,
  ) {
    effect(() => {
      if (!this.auth.isLoggedIn()) {
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnInit(): void {
    this.themeService.init();
  }
}
