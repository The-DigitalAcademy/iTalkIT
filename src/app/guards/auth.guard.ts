import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map, take, tap } from 'rxjs';
import { AppState } from '../store/app.state';
import * as AuthSelectors from '../store/auth/auth.selectors';

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
      tap(isLoggedIn => console.log('AuthGuard - isLoggedIn:', isLoggedIn)),
      map(isLoggedIn => {
        if (isLoggedIn) {
          return true;
        }
        
        // Redirect to login with return URL
        console.log('AuthGuard - Redirecting to login');
        this.router.navigate(['/login'], {
          queryParams: { returnUrl: state.url }
        });
        return false;
      })
    );
  }
}