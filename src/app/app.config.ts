import { ApplicationConfig, provideZoneChangeDetection, isDevMode, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { sessionReducer } from './store/session/session.reducer';
import { productsReducer } from './store/products/product.reducer';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { ProductEffects } from './store/products/product.effects';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { authInterceptor } from './interceptors/auth.interceptor';

console.log('Registering ProductEffects:', ProductEffects);
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor]), // Interceptor funcional
    ),
    importProvidersFrom(
      BrowserAnimationsModule, // Requerido para animaciones
      ToastrModule.forRoot({
        timeOut: 3000,
        positionClass: 'toast-top-right',
        preventDuplicates: true,
        closeButton: false, // Desactiva la "X" para cerrar
        progressBar: true, // Barra de progreso
        progressAnimation: 'decreasing',
      })

    ),
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
