import { createReducer, on } from '@ngrx/store';
import { createAction, props } from '@ngrx/store';

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: string;
}

export interface ProductsState {
  items: Product[];
  loading: boolean;
  error: any;
}

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
};

// Cargar productos desde la API
export const loadProducts = createAction('[Products] Load Products');

// Cargar productos exitosamente
export const loadProductsSuccess = createAction(
  '[Products] Load Products Success',
  props<{ products: Product[] }>()
);

// Manejo de errores al cargar productos
export const loadProductsFailure = createAction(
  '[Products] Load Products Failure',
  props<{ error: any }>()
);

export const addProduct = createAction(
  '[Products] Add Product',
  props<{ product: Product }>()
);

export const removeProduct = createAction(
  '[Products] Remove Product',
  props<{ productId: string }>()
);

export const productsReducer = createReducer(
  initialState,
  on(loadProducts, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(loadProductsSuccess, (state, { products }) => ({
    ...state,
    items: products,
    loading: false,
  })),
  on(loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(addProduct, (state, { product }) => ({
    ...state,
    items: [...state.items, product],
  })),
  on(removeProduct, (state, { productId }) => ({
    ...state,
    items: state.items.filter((p) => p.id !== productId),
  }))
);

