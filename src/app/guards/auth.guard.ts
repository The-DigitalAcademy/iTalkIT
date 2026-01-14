import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, take, switchMap, tap } from 'rxjs/operators';
import { AppState } from '../store/app.state';
import * as AuthSelectors from '../store/auth/auth.selectors';
import * as AuthActions from '../store/auth/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private store: Store<AppState>,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.store.select(AuthSelectors.selectIsLoggedIn).pipe(
      take(1),
      tap(isLoggedIn => console.log('AuthGuard - isLoggedIn from store:', isLoggedIn)),
      switchMap(isLoggedIn => {
        if (isLoggedIn) {
          return of(true);
        }
        
        // Check if we have auth data in storage
        const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
        const userJson = localStorage.getItem('user') || sessionStorage.getItem('user');
        
        console.log('AuthGuard - Checking storage:', { hasToken: !!accessToken, hasUser: !!userJson });
        
        if (accessToken && userJson) {
          try {
            const user = JSON.parse(userJson);
            console.log('AuthGuard - Loading auth from storage');
            // Dispatch action to load from storage
            this.store.dispatch(AuthActions.loadAuthFromStorage({ user, accessToken }));
            return of(true);
          } catch (error) {
            console.error('AuthGuard - Error parsing stored user:', error);
          }
        }
        
        // No valid auth found - redirect to login
        console.log('AuthGuard - No valid auth, redirecting to login');
        this.router.navigate(['/login'], {
          queryParams: { returnUrl: state.url }
        });
        return of(false);
      })
    );
  }
}