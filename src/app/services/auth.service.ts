import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environments'; 
import { LoginRequest, LoginResponse } from '../models';
import { RegisterRequest, RegisterResponse } from '../models/register.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn(): boolean {
    throw new Error('Method not implemented.');
  }
  private apiUrl = `${environment.apiUrl}users`;

  constructor(private http: HttpClient) {}

  // Login Method - Modified to work with json-server
  login(loginRequest: LoginRequest): Observable<LoginResponse> {
     console.log("Log in resquest to Backend",loginRequest)
    return this.http.post<LoginResponse>(`${this.apiUrl}`, loginRequest);
  }

  // Register Method
  register(userData: RegisterRequest): Observable<RegisterResponse> {
    // Create new user object with defaults
    const newUser = {
      email: userData.email,
      password: userData.password,
      username: userData.email.split('@')[0],
      firstName: userData.fullName.split(' ')[0] || '',
      lastName: userData.fullName.split(' ').slice(1).join(' ') || '',
      profilePicture: 'https://via.placeholder.com/150',
      bio: '',
      following: [],
      followers: []
    };
    
    return this.http.post<any>(`${this.apiUrl}`, newUser).pipe(
      map(user => {
        const response: RegisterResponse = {
          message: 'Registration successful',
          user: user
        };
        return response;
      })
    );
  }

  // Logout Method
  logout(): Observable<any> {
    return new Observable(observer => {
      observer.next({ message: 'Logged out successfully' });
      observer.complete();
    });
  }

  // Forgot Password
  forgotPassword(email: string): Observable<{ message: string }> {
    return new Observable(observer => {
      observer.next({ message: 'Password reset email sent' });
      observer.complete();
    });
  }

  // Validate Token
  validateToken(): Observable<boolean> {
    return new Observable(observer => {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      observer.next(!!token);
      observer.complete();
    });
  }

  // Refresh Token
  refreshToken(refreshToken: string): Observable<{ accessToken: string }> {
    return new Observable(observer => {
      const newToken = `refreshed-token-${Date.now()}`;
      observer.next({ accessToken: newToken });
      observer.complete();
    });
  }
}