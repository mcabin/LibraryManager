import { ApplicationConfig, inject, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { APP_INITIALIZER  } from '@angular/core';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { JwtInterceptor } from './interceptor/jwt.interceptor';
import { AuthentificationService } from './services/api/authentification.service';

function initializeAuth(authService: AuthentificationService):Promise<void>{
  return authService.checkToken();
}
export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }, 
    provideRouter(routes), 
    provideClientHydration(),
    provideHttpClient(withInterceptorsFromDi()),
    provideHttpClient(withFetch()),
  ]
};
