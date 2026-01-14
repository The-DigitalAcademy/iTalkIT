import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { AuthState } from './auth.state';

export const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoggedIn: false,
  isLoading: false,
  error: null
};

export const authReducer = createReducer(
  initialState,
  
  // Register
  on(AuthActions.register, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  
  on(AuthActions.registerSuccess, (state) => ({
    ...state,
    isLoading: false,
    error: null
  })),
  
  on(AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  
  // Login
  on(AuthActions.login, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  
  on(AuthActions.loginSuccess, (state, { response }) => ({
    ...state,
    user: response.user,
    accessToken: response.accessToken,
    refreshToken: response.refreshToken || null,
    isLoggedIn: true,
    isLoading: false,
    error: null
  })),
  
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
    isLoggedIn: false
  })),
  
  // Load from Storage (IMPORTANT - this is what's missing!)
  on(AuthActions.loadAuthFromStorage, (state, { user, accessToken }) => {
    if (user && accessToken) {
      return {
        ...state,
        user,
        accessToken,
        isLoggedIn: true,
        isLoading: false,
        error: null
      };
    }
    return state;
  }),
  
  // Logout
  on(AuthActions.logout, (state) => ({
    ...state,
    isLoading: true
  })),
  
  on(AuthActions.logoutSuccess, () => initialState),
  
  on(AuthActions.logoutFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  
  // Update User
  on(AuthActions.updateUser, (state, { user }) => ({
    ...state,
    user: { ...state.user, ...user } as any
  })),
  
  // Refresh Token
  on(AuthActions.refreshToken, (state) => ({
    ...state,
    isLoading: true
  })),
  
  on(AuthActions.refreshTokenSuccess, (state, { accessToken }) => ({
    ...state,
    accessToken,
    isLoading: false
  })),
  
  on(AuthActions.refreshTokenFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  
  // Forgot Password
  on(AuthActions.forgotPassword, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  
  on(AuthActions.forgotPasswordSuccess, (state) => ({
    ...state,
    isLoading: false
  })),
  
  on(AuthActions.forgotPasswordFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  }))
);