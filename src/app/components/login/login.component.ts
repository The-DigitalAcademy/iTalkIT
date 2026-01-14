import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import * as AuthActions from '../../store/auth/auth.actions';
import { LoginRequest } from '../../models/login.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  error = '';
  returnUrl: string = '/home';
  sessionExpired = false;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
    this.sessionExpired = this.route.snapshot.queryParams['sessionExpired'] === 'true';
    
    if (this.sessionExpired) {
      this.error = 'Your session has expired. Please login again.';
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.error = '';
      
      const loginRequest: LoginRequest = {
        username: this.loginForm.get('username')?.value || '',
        password: this.loginForm.get('password')?.value || '',
        rememberMe: this.loginForm.get('rememberMe')?.value || false
      };

      // Store rememberMe preference first so effects can access it
      if (loginRequest.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }

      console.log('Dispatching login action with credentials:', loginRequest);
      
      // Dispatch the login action - the effect will handle the rest
      this.store.dispatch(AuthActions.login({ credentials: loginRequest }));
      
      // Subscribe to auth state to handle success/failure
      this.store.select(state => state.auth).subscribe(authState => {
        if (authState.isLoggedIn && authState.user) {
          console.log('Login successful, user in store:', authState.user);
          this.loading = false;
          // Navigation is handled by the effect
        } else if (authState.error) {
          console.error('Login error from store:', authState.error);
          this.error = authState.error;
          this.loading = false;
        }
      });
    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  get username() { 
    return this.loginForm.get('username'); 
  }
  
  get password() { 
    return this.loginForm.get('password'); 
  }
}