import { Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly _theme = signal<Theme>('light');

  readonly theme = this._theme.asReadonly();

  init() {
    const stored = localStorage.getItem('theme') as Theme | null;
    const theme = stored ?? 'light';

    this.setTheme(theme);
  }

  toggle() {
    const next = this._theme() === 'light' ? 'dark' : 'light';
    this.setTheme(next);
  }

  setTheme(theme: Theme) {
    this._theme.set(theme);
    localStorage.setItem('theme', theme);

    document.documentElement.classList.toggle('dark', theme === 'dark');
  }
}
