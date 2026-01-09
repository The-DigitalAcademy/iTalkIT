import { createAction, props } from '@ngrx/store';
import { User, LoginRequest, LoginResponse } from '../../models';
import { RegisterRequest, RegisterResponse } from '../../models/register.model';

// Registration
export const register = createAction(
  '[Auth] Register',
  props<{ request: RegisterRequest }>()
);


export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{ response: RegisterResponse }>()
);

export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: string }>()
);

// Login
export const login = createAction(
  '[Auth] Login',
  props<{ credentials: LoginRequest }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ response: LoginResponse }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

// Logout
export const logout = createAction('[Auth] Logout');
export const logoutSuccess = createAction('[Auth] Logout Success');
export const logoutFailure = createAction(
  '[Auth] Logout Failure',
  props<{ error: string }>()
);

// Token Management
export const refreshToken = createAction('[Auth] Refresh Token');
export const refreshTokenSuccess = createAction(
  '[Auth] Refresh Token Success',
  props<{ accessToken: string }>()
);
export const refreshTokenFailure = createAction(
  '[Auth] Refresh Token Failure',
  props<{ error: string }>()
);

// Storage
export const loadAuthFromStorage = createAction(
  '[Auth] Load From Storage',
  props<{ user: User | null; accessToken: string | null }>()  
);export const saveAuthToStorage = createAction('[Auth] Save To Storage');

// User Management
export const updateUser = createAction(
  '[Auth] Update User',
  props<{ user: Partial<User> }>()
);

// Forgot Password
export const forgotPassword = createAction(
  '[Auth] Forgot Password',
  props<{ email: string }>()
);
export const forgotPasswordSuccess = createAction(
  '[Auth] Forgot Password Success',
  props<{ message: string }>()
);
export const forgotPasswordFailure = createAction(
  '[Auth] Forgot Password Failure',
  props<{ error: string }>()
);