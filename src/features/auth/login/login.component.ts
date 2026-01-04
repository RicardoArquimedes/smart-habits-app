import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { ThemeService } from '../../../core/services/theme/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section
    class="auth-hero"
  >

  <div class="page">

    <!-- Toggle tema -->
    <button
      class="theme-floating"
      type="button"
      (click)="toggleTheme()"
      aria-label="Toggle theme"
    >
      {{ theme() === 'dark' ? '☀️' : '🌙' }}
    </button>

    <img class="hero-logo" src="./assets/icons/smart-logo.png" />

    <h2>Smart Habits</h2>
    <p class="tagline">Construye hábitos, un día a la vez</p>
     <div class="google-btn-wrapper">
  <div #googleBtn></div>
</div>

    <!-- Google SIEMPRE aquí -->
</div>
  </section>
  `,
    styleUrl: './login.component.scss',
})
export class LoginComponent implements AfterViewInit {
  @ViewChild('googleBtn', { static: true })
  googleBtn!: ElementRef<HTMLDivElement>;
    private readonly themeService = inject(ThemeService);
  readonly theme = this.themeService.theme;
  constructor(
    private readonly auth: AuthService,
    private readonly router: Router
  ) {}

  ngAfterViewInit(): void {
    this.waitForGoogle().then(() => {
      this.auth.initGoogle(() => {
        this.router.navigateByUrl('/');
      });

      this.auth.renderButton(this.googleBtn.nativeElement);
    });
  }

  private waitForGoogle(): Promise<void> {
    return new Promise(resolve => {
      const check = () => {
        if ((window as any).google?.accounts?.id) resolve();
        else requestAnimationFrame(check);
      };
      check();
    });
  }

    toggleTheme() {
    this.themeService.toggle();
  }
}
