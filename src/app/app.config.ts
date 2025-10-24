import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection ,importProvidersFrom} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {provideCharts,withDefaultRegisterables} from 'ng2-charts';
import { routes } from './app.routes';
import { jwtInterceptorFn } from './core/interceptor/jwt.interceptor';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideCharts(withDefaultRegisterables()),
    provideHttpClient(
    withInterceptors([jwtInterceptorFn])),
    provideAnimationsAsync(),
    importProvidersFrom(MatSnackBarModule)
  ]
};
