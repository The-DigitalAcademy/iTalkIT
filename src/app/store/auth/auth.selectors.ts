// src/app/store/auth/auth.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

// Feature selector
export const selectAuthState = createFeatureSelector<AuthState>('auth');

// Individual selectors
export const selectUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.user
);

export const selectAccessToken = createSelector(
  selectAuthState,
  (state: AuthState) => state.accessToken
);

export const selectIsLoggedIn = createSelector(
  selectAuthState,
  (state: AuthState) => state.isLoggedIn
);

export const selectIsLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state.isLoading
);

export const selectError = createSelector(
  selectAuthState,
  (state: AuthState) => state.error
);

export const selectUserEmail = createSelector(
  selectUser,
  (user) => user?.email
);

export const selectUserName = createSelector(
  selectUser,
  (user) => user ? `${user.firstName} ${user.lastName}` : ''
);

export const selectUserId = createSelector(
  selectUser,
  (user) => user?.id
);

// Compound selectors
export const selectAuthStatus = createSelector(
  selectIsLoading,
  selectIsLoggedIn,
  selectError,
  (isLoading, isLoggedIn, error) => ({
    isLoading,
    isLoggedIn,
    error
  })
);