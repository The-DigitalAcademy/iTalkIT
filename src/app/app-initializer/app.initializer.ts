// src/app/app.initializer.ts
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.state';
import * as AuthActions from '../store/auth/auth.actions';

export function initializeApp(store: Store<AppState>) {
  return (): Promise<void> => {
    return new Promise((resolve) => {
      // Check both localStorage and sessionStorage
      const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      const userJson = localStorage.getItem('user') || sessionStorage.getItem('user');
      
      if (accessToken && userJson) {
        try {
          const user = JSON.parse(userJson);
          console.log('Loading auth from storage:', user);
          store.dispatch(AuthActions.loadAuthFromStorage({ user, accessToken }));
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          // Clear invalid data
          localStorage.clear();
          sessionStorage.clear();
        }
      } else {
        console.log('No stored auth data found');
      }
      
      resolve();
    });
  };
}