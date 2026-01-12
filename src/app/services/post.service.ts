// src/app/services/post.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Post } from '../models/post.model';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private postsUrl = environment.apiUrl+"posts";

  constructor(private http: HttpClient) {}

  // Get all posts
  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  // Get posts by user ID
  getPostsByUserId(userId: string | number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}?userId=${userId}`);
  }

  // Create a new post
  createPost(post: Omit<Post, 'id'>): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, post);
  }

  // Delete a post
  deletePost(postId: string | number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${postId}`);
  }
}
