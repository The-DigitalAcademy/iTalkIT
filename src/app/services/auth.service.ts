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
  getCurrentUserId(): string | number | null {
    const userJson = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      return user.id;
    }
    return null;
  }
  
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  // Login Method - Modified to work with json-server
  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    // For json-server, we need to find the user by email
    return this.http.get<any[]>(`${this.apiUrl}?email=${loginRequest.username}`).pipe(
      map(users => {
        console.log('Users found:', users);
        
        if (users.length === 0) {
          throw new Error('User not found');
        }
        
        const user = users[0];
        
        // In a real app, you'd verify the password on the backend
        // For now, we'll just check if the user exists
        if (user.password !== loginRequest.password) {
          throw new Error('Invalid password');
        }
        
        // Create a mock token (in production, this comes from backend)
        const accessToken = `mock-token-${user.id}-${Date.now()}`;
        const refreshToken = `mock-refresh-${user.id}-${Date.now()}`;
        
        // Return in the expected format
        const response: LoginResponse = {
          accessToken: accessToken,
          refreshToken: refreshToken,
          user: {
            id: user.id,
            username: user.username || user.email,
            email: user.email,
            firstName: user.firstName || '',
            lastName: user.lastName || '',
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