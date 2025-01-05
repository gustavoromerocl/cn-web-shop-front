import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { sessionReducer } from './store/session/session.reducer';
import { productsReducer } from './store/products/product.reducer';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ProductEffects } from './store/products/product.effects';

console.log('Registering ProductEffects:', ProductEffects);
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore({
      session: sessionReducer,
      products: productsReducer,
    }),
    provideEffects([ProductEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
],
};
