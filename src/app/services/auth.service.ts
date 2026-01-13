// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environments'; 
import { LoginRequest, LoginResponse } from '../models/login.model';
import { RegisterRequest, RegisterResponse } from '../models/register.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getCurrentUserId(): string | number | null {
    const userJson = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      return user.id;
    }
    return null;
  }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.get<any>(`${this.apiUrl}?email=${loginRequest.username}`).pipe(
      map(users => {
        console.log('Users found:', users);
        
        if (users.length === 0) {
          throw new Error('User not found');
        }
        
        const user = users[0];
        
        if (user.password !== loginRequest.password) {
          throw new Error('Invalid password');
        }
        
        const accessToken = `mock-token-${user.id}-${Date.now()}`;
        const refreshToken = `mock-refresh-${user.id}-${Date.now()}`;
        
        const response: LoginResponse = {
          accessToken: accessToken,
          refreshToken: refreshToken,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName || user.username,
            lastName: user.lastName || '',
            name: user.username,
            profilePicture: user.profilePicture || 'https://via.placeholder.com/150',
            bio: user.bio || '',
            following: user.following || [],
            followers: user.followers || []
          }
        };
        
        console.log('Transformed login response:', response);
        return response;
      }),
      catchError(error => {
        console.error('Login error in service:', error);
        return throwError(() => error);
      })
    );
  }

  register(userData: RegisterRequest): Observable<RegisterResponse> {
    const newUser = {
      email: userData.email,
      password: userData.password,
      username: userData.email.split('@')[0],
      bio: '',
      profilePicture: 'https://via.placeholder.com/150'
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

  logout(): Observable<any> {
    return new Observable(observer => {
      observer.next({ message: 'Logged out successfully' });
      observer.complete();
    });
  }

  validateToken(): Observable<boolean> {
    return new Observable(observer => {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      observer.next(!!token);
      observer.complete();
    });
  }

  // Forgot Password - Check if email exists and return success message
  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.get<any[]>(`${this.apiUrl}?email=${email}`).pipe(
      map(users => {
        if (users.length === 0) {
          throw new Error('No account found with this email address');
        }
        
        // In a real app, backend would send a password reset email
        // For now, we'll just return a success message
        return { 
          message: 'Password reset instructions have been sent to your email address.' 
        };
      }),
      catchError(error => {
        const errorMessage = error.message || 'Failed to process password reset request';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  resetPassword(token: string, newPassword: string): Observable<{ message: string }> {
    
    return of({ 
      message: 'Password has been reset successfully. You can now login with your new password.' 
    });
  }
}