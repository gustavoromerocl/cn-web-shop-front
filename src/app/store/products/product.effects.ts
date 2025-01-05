import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { loadProducts, loadProductsSuccess, loadProductsFailure } from './product.reducer';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ProductService } from '../../services/product/product.service';

@Injectable()
export class ProductEffects {
  private actions$ = inject(Actions); // Inyecta Actions
  private productService = inject(ProductService); // Inyecta ProductService

  // Efecto para cargar productos
  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProducts),
      mergeMap(({ keyword }) =>
        this.productService.getAllProducts(keyword).pipe(
          map((products) => loadProductsSuccess({ products })),
          catchError((error) => of(loadProductsFailure({ error })))
        )
      )
    )
  );
  
}
