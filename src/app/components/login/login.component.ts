import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import * as AuthActions from '../../store/auth/auth.actions';
import { AuthService } from '../../services/auth.service';
import { LoginRequest, LoginResponse } from '../../models';

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
          // CORRECT: Pass the entire response
          this.store.dispatch(AuthActions.loginSuccess({ 
            response: response  // ← Fixed!
          }));
          
          // Store token based on rememberMe
          const storage = loginRequest.rememberMe ? localStorage : sessionStorage;
          storage.setItem('accessToken', response.accessToken);
          storage.setItem('refreshToken', response.refreshToken);
          storage.setItem('user', JSON.stringify(response.user));
          
          // Navigate to return URL
          this.router.navigateByUrl(this.returnUrl);
        },
        error: (error) => {
          this.error = error.error?.message || 'Login failed. Please check your credentials.';
          this.loading = false;
        }
      });
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  // Helper methods for template
  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }
}