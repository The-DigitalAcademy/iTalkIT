import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './store/app.state';
import * as AuthActions from './store/auth/auth.actions';
import * as AuthSelectors from './store/auth/auth.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'italkit';

  constructor(private store: Store<AppState>) {
    console.log('AppComponent constructor');
  }

  ngOnInit(): void {
    console.log('AppComponent ngOnInit - Loading auth from storage');
    
    // Check what's in storage
    const localAccessToken = localStorage.getItem('accessToken');
    const localUser = localStorage.getItem('user');
    const sessionAccessToken = sessionStorage.getItem('accessToken');
    const sessionUser = sessionStorage.getItem('user');
    
    console.log('Storage check:', {
      localStorage: { accessToken: localAccessToken, user: localUser },
      sessionStorage: { accessToken: sessionAccessToken, user: sessionUser }
    });
    
    // Load auth state from storage on app init
    const accessToken = localAccessToken || sessionAccessToken;
    const userJson = localUser || sessionUser;
    
    if (accessToken && userJson) {
      try {
        const user = JSON.parse(userJson);
        console.log('Dispatching loadAuthFromStorage with:', { user, accessToken });
        this.store.dispatch(AuthActions.loadAuthFromStorage({ user, accessToken }));
        
        // Verify the store was updated
        this.store.select(AuthSelectors.selectIsLoggedIn).subscribe(isLoggedIn => {
          console.log('After dispatch - isLoggedIn:', isLoggedIn);
        });
        
        this.store.select(AuthSelectors.selectUser).subscribe(storeUser => {
          console.log('After dispatch - user in store:', storeUser);
        });
      } catch (error) {
        console.error('Error loading auth state:', error);
      }
    } else {
      console.log('No auth data found in storage');
    }
  }
}