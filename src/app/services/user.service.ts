import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User } from '../models/user.model';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getUserById(id: string | number): Observable<User> {
    return this.http.get<User>(`${this.url}/${id}`);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.url);
  }

  // UPDATED: Match Spring Boot backend expectations
  updateUserFollowing(userId: string | number, followingIds: (string | number)[]): Observable<User> {
    console.log('Updating following for user:', userId, 'New following:', followingIds);
    
    // Spring Boot expects: PUT /api/users/{id}/following with body { "following": [ids] }
    return this.http.put<User>(`${this.url}/${userId}/following`, { 
      following: followingIds.map(id => Number(id)) // Convert to numbers
    }).pipe(
      map(updatedUser => {
        console.log('User updated successfully:', updatedUser);
        return updatedUser;
      }),
      catchError(error => {
        console.error('Error updating user following:', error);
        throw error;
      })
    );
  }

  // NEW: Use Spring Boot's follow/unfollow endpoints
  followUser(followerId: string | number, followingId: string | number): Observable<User> {
    return this.http.post<User>(`${this.url}/${followerId}/follow/${followingId}`, {});
  }

  unfollowUser(followerId: string | number, followingId: string | number): Observable<User> {
    return this.http.delete<User>(`${this.url}/${followerId}/unfollow/${followingId}`);
  }
}