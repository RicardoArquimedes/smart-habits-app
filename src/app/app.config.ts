import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { GoogleLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '../core/http/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

  provideHttpClient(withInterceptors([authInterceptor])),

    {
    provide: 'SocialAuthServiceConfig',
    useValue: {
      autoLogin: false,
      providers: [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider('GOOGLE_CLIENT_ID'),
        },
      ],
    } as SocialAuthServiceConfig,
  },
  ],
};
