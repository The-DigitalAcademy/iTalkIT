import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  addPost(newPost: { id: number; userId: any; caption: string; image: string | ArrayBuffer | null; likes: number; timestamp: string; comments: never[]; }) {
    throw new Error('Method not implemented.');
  }
  private url = 'http://localhost:3000/posts';

  constructor(private http: HttpClient) {}

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.url);
  }
}
