import { Store } from '@ngrx/store';
import { AppState } from '../store/app.state';
import * as AuthActions from '../store/auth/auth.actions';

export function initializeApp(store: Store<AppState>) {
  return (): Promise<void> => {
    return new Promise((resolve) => {
      console.log('App Initializer - Starting');
      
      // Check both localStorage and sessionStorage
      const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      const userJson = localStorage.getItem('user') || sessionStorage.getItem('user');
      
      if (accessToken && userJson) {
        try {
          const user = JSON.parse(userJson);
          console.log('App Initializer - Loading auth from storage:', user);
          store.dispatch(AuthActions.loadAuthFromStorage({ user, accessToken }));
        } catch (error) {
          console.error('App Initializer - Error parsing stored user data:', error);
          // Clear invalid data
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          sessionStorage.removeItem('accessToken');
          sessionStorage.removeItem('refreshToken');
          sessionStorage.removeItem('user');
        }
      } else {
        console.log('App Initializer - No stored auth data found');
      }
      
      resolve();
    });
  };
}