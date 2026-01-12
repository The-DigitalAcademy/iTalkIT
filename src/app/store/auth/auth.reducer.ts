import { createReducer, on } from '@ngrx/store';
import { AuthState, initialAuthState } from './auth.state';
import * as AuthActions from './auth.actions';

// Helper to normalize errors to a string
function normalizeError(error: unknown): string {
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) {
    return (error as { message: string }).message;
  }
  return 'An unexpected error occurred';
}

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
  user: response
    ? {
        ...response
      }
    : null,
  accessToken: response.accessToken,
  refreshToken: response.refreshToken || null,
  isLoggedIn: true,
  isLoading: false,
  error: null
})),



  on(AuthActions.loginFailure, (state, { error }): AuthState => ({
    ...state,
    isLoading: false,
    error: normalizeError(error)
  })),

  // Logout
  on(AuthActions.logout, (state): AuthState => ({
    ...state,
    isLoading: true
  })),

  on(AuthActions.logoutSuccess, (): AuthState => ({
    ...initialAuthState
  })),

  on(AuthActions.logoutFailure, (state, { error }): AuthState => ({
    ...state,
    isLoading: false,
    error: normalizeError(error)
  })),

  // Registration
  on(AuthActions.register, (state): AuthState => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(AuthActions.registerSuccess, (state): AuthState => ({
    ...state,
    isLoading: false,
    error: null
  })),

  on(AuthActions.registerFailure, (state, { error }): AuthState => ({
    ...state,
    isLoading: false,
    error: normalizeError(error)
  })),

  // Update User
  on(AuthActions.updateUser, (state, { user }): AuthState => ({
    ...state,
    user: state.user ? { ...state.user, ...user } : null
  })),

  // Load auth from storage
on(AuthActions.loadAuthFromStorage, (state, { user, accessToken }): AuthState => {
  console.log('Reducer - Loading auth from storage:', { user, accessToken });
  return {
    ...state,
    user: user
      ? { ...user, following: user.following || [], followers: user.followers || [] }
      : null,
    accessToken,
    refreshToken: null,
    isLoggedIn: !!accessToken && !!user,  // Make sure both exist
    isLoading: false,
    error: null
  };
}),


  // Forgot Password
  on(AuthActions.forgotPassword, (state): AuthState => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(AuthActions.forgotPasswordSuccess, (state): AuthState => ({
    ...state,
    isLoading: false,
    error: null
  })),

  on(AuthActions.forgotPasswordFailure, (state, { error }): AuthState => ({
    ...state,
    isLoading: false,
    error: normalizeError(error)
  })),

  // Refresh Token
  on(AuthActions.refreshToken, (state): AuthState => ({
    ...state,
    isLoading: true
  })),

  on(AuthActions.refreshTokenSuccess, (state, { accessToken }): AuthState => ({
    ...state,
    accessToken,
    isLoading: false,
    error: null
  })),

  on(AuthActions.refreshTokenFailure, (state, { error }): AuthState => ({
    ...state,
    isLoading: false,
    error: normalizeError(error)
  }))
);
