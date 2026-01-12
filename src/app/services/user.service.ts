import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = environment.apiUrl+"users"; // this url is consuming the users from our sprintboot 

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