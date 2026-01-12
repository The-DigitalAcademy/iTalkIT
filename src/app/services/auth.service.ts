// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments'; 
import { LoginRequest, LoginResponse } from '../models';
import { RegisterRequest, RegisterResponse } from '../models/register.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  getCurrentUserId(): string | number | null {
    throw new Error('Method not implemented.');
  }
  private apiUrl = `${environment.apiUrl}users`;

  constructor(private http: HttpClient) {}

  // Login Method
  login(loginRequest: LoginRequest): Observable<LoginResponse> {
     console.log("Log in resquest to Backend",loginRequest)
    return this.http.post<LoginResponse>(`${this.apiUrl}`, loginRequest);
  }

  // Register Method
 register(userData: RegisterRequest): Observable<RegisterResponse> {
  return this.http.post<RegisterResponse>(
    `${this.apiUrl}`,
    userData
  );
}

  

  // Logout Method
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {});
  }

  // Forgot Password
  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/forgot-password`, { email });
  }

  // Validate Token
  validateToken(): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/validate-token`);
  }

  // Refresh Token
  refreshToken(refreshToken: string): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(`${this.apiUrl}/refresh-token`, { refreshToken });
  }
}