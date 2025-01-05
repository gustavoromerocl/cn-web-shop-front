import { createReducer, on } from '@ngrx/store';
import { createAction, props } from '@ngrx/store';

export const login = createAction(
  '[Session] Login',
  props<{ user: { id: string; name?: string; role: string; email: string } }>()
);

export const logout = createAction('[Session] Logout');

export const updateUser = createAction(
  '[Session] Update User',
  props<{ user: { name?: string; email?: string; role?: string } }>()
);

export interface SessionState {
  isLoggedIn: boolean;
  user: { id: string; name?: string; role: string; email: string } | null;
}

export const initialState: SessionState = {
  isLoggedIn: false,
  user: null,
};

export const sessionReducer = createReducer(
  initialState,
  on(login, (state, { user }) => ({ ...state, isLoggedIn: true, user })),
  on(logout, (state) => ({ ...state, isLoggedIn: false, user: null })),
  on(updateUser, (state, { user }) => ({
    ...state,
    user: state.user ? { ...state.user, ...user } : null,
  }))
);
