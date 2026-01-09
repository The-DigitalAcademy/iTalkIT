import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = "http://localhost:3000/users";

  constructor(private http: HttpClient) { }

  getUserById(id: string | number): Observable<User> {
    return this.http.get<User>(`${this.url}/${id}`);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.url);
  }

  updateUserFollowing(userId: string | number, following: (string | number)[]): Observable<User> {
    return this.http.patch<User>(`${this.url}/${userId}`, { following: following });
  }
}