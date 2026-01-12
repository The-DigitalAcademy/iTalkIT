import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import * as AuthSelectors from 'src/app/store/auth/auth.selectors';
import { PostsService } from 'src/app/services/post.service';
import { Post } from 'src/app/models/post.model';
import { User } from 'src/app/models';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {

  currentUser: User | null = null;
  currentUserId: string | null = null;

  userPosts: Post[] = [];
  loading = true;

  postsCount = 0;
  followersCount = 0;
  followingCount = 0;

  constructor(
    private store: Store<AppState>,
    private postService: PostsService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.store.select(AuthSelectors.selectUser).subscribe(user => {
      if (!user) {
        this.loading = false;
        return;
      }

      this.currentUser = user;
      this.currentUserId = user.id ?? null;

      this.followersCount = user.followers?.length ?? 0;
      this.followingCount = user.following?.length ?? 0;

      this.loadUserPosts(this.currentUserId!);
    });
  }

  loadUserPosts(userId: string): void {
    this.postService.getPostsByUserId(userId).subscribe({
      next: (posts) => {
        this.userPosts = [...posts].sort(
          (a, b) =>
            new Date(b.timestamp).getTime() -
            new Date(a.timestamp).getTime()
        );

        this.postsCount = this.userPosts.length;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading posts:', error);
        this.loading = false;
      },
    });
  }

  deletePost(postId: string | number): void {
    if (!confirm('Are you sure you want to delete this post?')) return;

    this.postService.deletePost(postId).subscribe({
      next: () => {
        this.userPosts = this.userPosts.filter(p => p.id === postId ? false : true);
        this.postsCount = this.userPosts.length;
      },
      error: (error) => {
        console.error('Error deleting post:', error);
        alert('Failed to delete post');
      },
    });
  }
}
