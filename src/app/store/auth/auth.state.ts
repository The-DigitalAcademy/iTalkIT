export interface AuthState {
  user: any | null;                    
  accessToken: string | null;
  refreshToken: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  user: null,                          
  accessToken: null,
  refreshToken: null,
  isLoggedIn: false,
  isLoading: false,
  error: null
};