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
  private readonly _user = signal<GoogleUser | null>(null);
  readonly user = computed(() => this._user());

  private readonly _token = signal<string | null>(null);

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

 initGoogle(callback: (credential: string) => void) {
    if (!google?.accounts?.id) return;

    google.accounts.id.initialize({
      client_id: environment.GOOGLE_CLIENT_ID,
      callback: (response: any) => {
        this.login(response.credential);
        callback(response.credential);
      },
    });
  }

  renderButton(container: HTMLElement) {
    google.accounts.id.renderButton(container, {
      theme: 'outline',
      size: 'large',
      shape: 'pill',
      text: 'signin_with',
    });
  }

  login(token: string) {
    sessionStorage.setItem('auth_token', token);
    this._token.set(token);
    this._user.set(this.decodeJwt(token));
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
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );

    return JSON.parse(jsonPayload);
  }
}
