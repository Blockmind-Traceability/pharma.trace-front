import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay  } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors, withFetch} from '@angular/common/http';
import {tokenInterceptor} from './auth/token.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),

    provideHttpClient(
      withInterceptors([
        tokenInterceptor
      ]),
      withFetch()
    )

  ]
};
