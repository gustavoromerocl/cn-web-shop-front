import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductsState } from './product.reducer';

export const selectProductsState = createFeatureSelector<ProductsState>('products');

export const selectAllProducts = createSelector(
  selectProductsState,
  (state) => state.items
);
