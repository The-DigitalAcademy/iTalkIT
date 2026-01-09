// src/app/store/auth/auth.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}

// Register Effect
register$ = createEffect(() =>
  this.actions$.pipe(
    ofType(AuthActions.register),
    mergeMap(action =>
      this.authService.register(action).pipe(
        map(response =>
          AuthActions.registerSuccess({ response })
        ),
        catchError(error =>
          of(AuthActions.registerFailure({
            error: error.error?.message || 'Registration failed'
          }))
        )
      )
    )
  )
);


  // Register Success Effect – Redirect to login
  registerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerSuccess),
        tap(({ response }) => {
          console.log('Registration successful:', response);
          // Optional: show success toast
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );

  // Register Failure Effect – Log / show error
  registerFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerFailure),
        tap(({ error }) => {
          console.error('Registration failed:', error);
          // Optional: show toast/snackbar
        })
      ),
    { dispatch: false }
  );
  // Login Effect
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({ credentials }) =>
        this.authService.login(credentials).pipe(
          map(response => AuthActions.loginSuccess({ response })),
          catchError(error => {
            const errorMessage = error.error?.message || 'Login failed. Please try again.';
            return of(AuthActions.loginFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  // Login Success Effect - Save to storage & redirect
  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(({ response }) => {
        // Save to storage
        const storage = localStorage.getItem('rememberMe') === 'true' 
          ? localStorage 
          : sessionStorage;
        
        storage.setItem('accessToken', response.accessToken);
        if (response.refreshToken) {
          storage.setItem('refreshToken', response.refreshToken);
        }
        storage.setItem('user', JSON.stringify(response.user));
        
        // Redirect to home or return URL
        const returnUrl = this.router.routerState.snapshot.root.queryParams['returnUrl'] || '/';
        this.router.navigate([returnUrl]);
      })
    ),
    { dispatch: false }
  );

  // Login Failure Effect - Show error
  loginFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginFailure),
      tap(({ error }) => {
        console.error('Login failed:', error);
        // You could show a toast notification here
      })
    ),
    { dispatch: false }
  );

  // Logout Effect
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      mergeMap(() =>
        this.authService.logout().pipe(
          map(() => AuthActions.logoutSuccess()),
          catchError(error => 
            of(AuthActions.logoutFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // Logout Success Effect - Clear storage & redirect to login
  logoutSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logoutSuccess),
      tap(() => {
        // Clear storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('rememberMe');
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        sessionStorage.removeItem('user');
        
        // Redirect to login
        this.router.navigate(['/login']);
      })
    ),
    { dispatch: false }
  );

  // Forgot Password Effect
  forgotPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.forgotPassword),
      mergeMap(({ email }) =>
        this.authService.forgotPassword(email).pipe(
          map(response => AuthActions.forgotPasswordSuccess({ message: response.message })),
          catchError(error => {
            const errorMessage = error.error?.message || 'Failed to send reset email';
            return of(AuthActions.forgotPasswordFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  // Forgot Password Success Effect - Show success message
  forgotPasswordSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.forgotPasswordSuccess),
      tap(({ message }) => {
        alert(message); // Or show a toast notification
      })
    ),
    { dispatch: false }
  );
}