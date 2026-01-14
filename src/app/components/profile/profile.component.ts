import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import * as AuthSelectors from 'src/app/store/auth/auth.selectors';
import { PostsService } from 'src/app/services/post.service';
import { Post } from 'src/app/models/post.model';
import { User } from 'src/app/models';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, OnDestroy {

  currentUser: User | null = null;
  currentUserId: string | null = null;

  userPosts: Post[] = [];
  loading = true;

  postsCount = 0;
  followersCount = 0;
  followingCount = 0;

  private userSubscription?: Subscription;

  readonly FALLBACK_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23e0e0e0" width="400" height="400"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="24"%3ENo Image%3C/text%3E%3C/svg%3E';

  constructor(
    private store: Store<AppState>,
    private postService: PostsService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  loadUserData(): void {
    this.userSubscription = this.store.select(AuthSelectors.selectUser).pipe(
      filter((user): user is User => user !== null && user !== undefined),
      distinctUntilChanged()
    ).subscribe(user => {
      console.log('Profile - User from store:', user);
      
      this.currentUser = user;
      this.currentUserId = user.id ? String(user.id) : null;

      this.followersCount = user.followers?.length ?? 0;
      this.followingCount = user.following?.length ?? 0;

      // Only load posts if we have a valid userId
      if (this.currentUserId) {
        this.loadUserPosts(this.currentUserId);
      } else {
        console.warn('Profile - No valid userId found');
        this.loading = false;
      }
    });
  }

  loadUserPosts(userId: string): void {
    // Double-check userId is valid
    if (!userId || userId === 'null' || userId === 'undefined') {
      console.error('Invalid userId provided to loadUserPosts');
      this.loading = false;
      return;
    }

    console.log('Profile - Loading posts for userId:', userId);

    this.postService.getPostsByUserId(userId).subscribe({
      next: (posts) => {
        console.log('Profile - Loaded posts:', posts);
        
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
        console.log('Post deleted successfully:', postId);
        this.userPosts = this.userPosts.filter(p => p.id !== postId);
        this.postsCount = this.userPosts.length;
      },
      error: (error) => {
        console.error('Error deleting post:', error);
        alert('Failed to delete post');
      },
    });
  }

  onImageError(event: any): void {
    event.target.src = this.FALLBACK_IMAGE;
  }
}