import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { Post, Comment } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private apiUrl = `${environment.apiUrl}/posts`;

  constructor(private http: HttpClient) {}

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  getPostById(postId: string | number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${postId}`);
  }

  getPostsByUserId(userId: string | number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}?userId=${userId}`);
  }

  // UPDATED: Match Spring Boot expectations - includes userId in body
  createPost(post: Omit<Post, 'id'>): Observable<Post> {
    const postData = {
      userId: post.userId,
      caption: post.caption,
      imageUrl: post.imageUrl
    };
    return this.http.post<Post>(this.apiUrl, postData);
  }

  updatePost(postId: string | number, post: Partial<Post>): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/${postId}`, post);
  }

  deletePost(postId: string | number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${postId}`);
  }

  // UPDATED: Use Spring Boot's like/unlike endpoints
  likePost(postId: string | number): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/${postId}/like`, {});
  }

  unlikePost(postId: string | number): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/${postId}/unlike`, {});
  }

  // NEW: Get feed posts from backend
  getFeedPosts(userId: string | number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/feed/${userId}`);
  }

  // Comments - you'll need to implement these in backend later
  addComment(postId: string | number, comment: Omit<Comment, 'id'>): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/${postId}/comments`, comment);
  }

  deleteComment(postId: string | number, commentId: string | number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${postId}/comments/${commentId}`);
  }
}