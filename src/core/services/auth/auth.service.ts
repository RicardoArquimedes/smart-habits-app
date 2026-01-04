import { Injectable, signal, computed } from '@angular/core';
import { environment } from '../../../environments/environment';

declare const google: any;

export interface GoogleUser {
  sub: string;
  name: string;
  email: string;
  picture: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _user = signal<any | null>(null);
  private readonly _token = signal<string | null>(null);

  readonly user = computed(() => this._user());
  readonly token = computed(() => this._token());
  readonly isLoggedIn = computed(() => !!this._token());

  constructor() {
    // 🔥 RESTAURAR SESIÓN AL CARGAR APP
    const storedToken = sessionStorage.getItem('auth_token');
    const storedUser = sessionStorage.getItem('auth_user');

    if (storedToken && storedUser) {
      this._token.set(storedToken);
      this._user.set(JSON.parse(storedUser));
    }
  }

  initGoogle(buttonId: string) {
    const g = (window as any).google;
    if (!g?.accounts?.id) return;

    g.accounts.id.initialize({
      client_id: environment.GOOGLE_CLIENT_ID,
      callback: (response: any) => {
        const token = response.credential;
        const user = this.decodeJwt(token);

        this._token.set(token);
        this._user.set(user);

        // 🔥 PERSISTIR SESIÓN
        sessionStorage.setItem('auth_token', token);
        sessionStorage.setItem('auth_user', JSON.stringify(user));
      },
    });

    const el = document.getElementById(buttonId);
    if (!el) return;

    g.accounts.id.renderButton(el, {
      theme: 'outline',
      size: 'large',
      shape: 'pill',
    });
  }

  logout() {
    this._token.set(null);
    this._user.set(null);

    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_user');

    const g = (window as any).google;
    g?.accounts?.id?.disableAutoSelect?.();
  }

  private decodeJwt(token: string) {
    const base64 = token.split('.')[1];
    return JSON.parse(atob(base64));
  }
}
