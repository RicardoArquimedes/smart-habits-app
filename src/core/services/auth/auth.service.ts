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

  initGoogle(buttonId: string) {
    // @ts-ignore
    google.accounts.id.initialize({
      client_id: environment.GOOGLE_CLIENT_ID,
      callback: (response: any) => {
        this._token.set(response.credential);
        this._user.set(this.decodeJwt(response.credential));
      },
    });

    // @ts-ignore
    google.accounts.id.renderButton(
      document.getElementById(buttonId),
      {
        theme: 'outline',
        size: 'large',
        shape: 'pill',
        text: 'signin_with',
      }
    );
  }

  private decodeJwt(token: string) {
    const base64 = token.split('.')[1];
    return JSON.parse(atob(base64));
  }

  logout() {
  this._token.set(null);
  this._user.set(null);

  // (opcional pero recomendado)
  // Limpia cualquier sesión local que tengas
  google?.accounts?.id?.disableAutoSelect?.();
}

}
