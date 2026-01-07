import { createReducer, on } from '@ngrx/store';
import { AuthState, initialAuthState } from './auth.state';
import * as AuthActions from './auth.actions';

export const authReducer = createReducer(
  initialAuthState,
  
  // Login
  on(AuthActions.login, (state): AuthState => ({
    ...state,
    isLoading: true,
    error: null
  })),
  
  on(AuthActions.loginSuccess, (state, { response }): AuthState => ({
    ...state,
    user: response.user,
    accessToken: response.accessToken,
    refreshToken: response.refreshToken || null,
    isLoggedIn: true,
    isLoading: false,
    error: null
  })),
  
  on(AuthActions.loginFailure, (state, { error }): AuthState => ({
    ...state,
    isLoading: false,
    error
  })),
  
  // Logout
  on(AuthActions.logout, (state): AuthState => ({
    ...state,
    isLoading: true
  })),
  
  on(AuthActions.logoutSuccess, (state): AuthState => ({
    ...initialAuthState
  })),
  
  // Update User
  on(AuthActions.updateUser, (state, { user }): AuthState => ({
    ...state,
    user: state.user ? { ...state.user, ...user } : null
  })),
  
  // Load from Storage
  on(AuthActions.loadAuthFromStorage, (state, { user, accessToken }): AuthState => ({
    ...state,
    user,
    accessToken,
    isLoggedIn: !!accessToken
  }))
);