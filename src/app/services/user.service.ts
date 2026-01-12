import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserInterface } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = "http://localhost:3000/users";

  constructor(private http: HttpClient) { }

  getUserById(id: string | number): Observable<UserInterface> {
    return this.http.get<UserInterface>(`${this.url}/${id}`);
  }

  getUsers(): Observable<UserInterface[]> {
    return this.http.get<UserInterface[]>(this.url);
  }

  updateUserFollowing(userId: string | number, following: (string | number)[]): Observable<UserInterface> {
    return this.http.patch<UserInterface>(`${this.url}/${userId}`, { following: following });
  }
}