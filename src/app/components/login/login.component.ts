import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import * as AuthActions from '../../store/auth/auth.actions';
import { AuthService } from '../../services/auth.service';
import { LoginRequest, LoginResponse } from '../../models/login.model';

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
    private authService: AuthService,
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

      this.authService.login(loginRequest).subscribe({
        next: (response: LoginResponse) => {
          console.log('Full login response:', response);
          console.log('Response accessToken:', response.accessToken);
          console.log('Response user:', response.user);
          
          if (!response.accessToken || !response.user) {
            console.error('Invalid response structure:', response);
            this.error = 'Login failed - invalid response from server';
            this.loading = false;
            return;
          }
          
          this.store.dispatch(AuthActions.loginSuccess({ 
            response: response
          }));
          
          const storage = loginRequest.rememberMe ? localStorage : sessionStorage;
          storage.setItem('accessToken', response.accessToken);
          storage.setItem('refreshToken', response.refreshToken);
          storage.setItem('user', JSON.stringify(response.user));
          
          console.log('Login success - stored data:', {
            accessToken: response.accessToken,
            user: response.user,
            storage: loginRequest.rememberMe ? 'localStorage' : 'sessionStorage'
          });
          
          if (loginRequest.rememberMe) {
            localStorage.setItem('rememberMe', 'true');
          }
          
          this.loading = false;
          this.router.navigateByUrl(this.returnUrl);
        },
        error: (error) => {
          console.error('Login error:', error);
          this.error = error.error?.message || 'Login failed. Please check your credentials.';
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