import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from '../../models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { Post } from 'src/app/models/post.model';
import { PostsService } from 'src/app/services/post.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import * as AuthSelectors from '../../store/auth/auth.selectors';
import * as AuthActions from '../../store/auth/auth.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  users: User[] = [];
  posts: Post[] = [];
  filteredPosts: Post[] = [];
  currentUser: User | null = null;
  followingIds: (string | number)[] = [];
  private userSubscription?: Subscription;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private postService: PostsService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    console.log('HomeComponent initialized');
    this.loadCurrentUser();
    this.getUsers();
    this.getPosts();
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  loadCurrentUser(): void {
    console.log('Loading current user from store...');
    
    this.userSubscription = this.store.select(AuthSelectors.selectUser).subscribe(user => {
      console.log('User from store:', user);
      this.currentUser = user;
      
      if (this.currentUser && this.currentUser.following) {
        this.followingIds = this.currentUser.following.map(id => String(id));
        console.log('Following IDs:', this.followingIds);
        // Reload posts when user changes
        this.getPosts();
      } else {
        this.followingIds = [];
        console.log('No following data available');
      }
    });
  }

  getUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        console.log('Fetched users:', users);
        if (this.currentUser) {
          const currentUserId = this.currentUser.id;
          this.users = users.filter((user) => user.id !== currentUserId);
        } else {
          this.users = users;
        }
        console.log('Filtered users:', this.users);
      },
      error: (err) => console.error('Error fetching users', err),
    });
  }

  getPosts(): void {
    if (this.currentUser && this.currentUser.id) {
      // Use the backend's feed endpoint to get posts from followed users
      console.log('Fetching feed posts for user:', this.currentUser.id);
      this.postService.getFeedPosts(this.currentUser.id).subscribe({
        next: (posts) => {
          console.log('Fetched feed posts from backend:', posts);
          this.filteredPosts = posts;
          this.posts = posts;
        },
        error: (err) => {
          console.error('Error fetching feed posts', err);
          // Fallback to empty array on error
          this.filteredPosts = [];
          this.posts = [];
        },
      });
    } else {
      // If no user, fetch all posts (or show empty)
      console.log('No current user - fetching all posts');
      this.postService.getPosts().subscribe({
        next: (posts) => {
          console.log('Fetched all posts:', posts);
          this.posts = posts;
          this.filteredPosts = [];
        },
        error: (err) => {
          console.error('Error fetching posts', err);
          this.posts = [];
          this.filteredPosts = [];
        },
      });
    }
  }

  isFollowing(targetUserId: string | number): boolean {
    return this.followingIds.includes(String(targetUserId));
  }

  toggleFollow(targetUserId: string | number): void {
    if (!this.currentUser) {
      console.error('No current user - cannot follow');
      return;
    }

    const targetIdString = String(targetUserId);
    const currentUserId = this.currentUser.id;
    const isCurrentlyFollowing = this.isFollowing(targetIdString);

    if (isCurrentlyFollowing) {
      // Unfollow
      console.log('Unfollowing user:', targetIdString);
      this.userService.unfollowUser(currentUserId, targetUserId).subscribe({
        next: (updatedUser: User) => {
          console.log('Successfully unfollowed. Updated user:', updatedUser);
          this.updateUserState(updatedUser);
        },
        error: (err) => {
          console.error('Error unfollowing user', err);
          alert('Failed to unfollow user. Please try again.');
        }
      });
    } else {
      // Follow
      console.log('Following user:', targetIdString);
      this.userService.followUser(currentUserId, targetUserId).subscribe({
        next: (updatedUser: User) => {
          console.log('Successfully followed. Updated user:', updatedUser);
          this.updateUserState(updatedUser);
        },
        error: (err) => {
          console.error('Error following user', err);
          alert('Failed to follow user. Please try again.');
        }
      });
    }
  }

  private updateUserState(updatedUser: User): void {
    // Update storage
    const storage = localStorage.getItem('rememberMe') === 'true' 
      ? localStorage 
      : sessionStorage;
    
    storage.setItem('user', JSON.stringify(updatedUser));
    console.log('Saved updated user to storage:', storage === localStorage ? 'localStorage' : 'sessionStorage');
    
    // Update store
    this.store.dispatch(AuthActions.updateUser({ user: updatedUser }));
    
    // Update local state
    this.followingIds = updatedUser.following ? updatedUser.following.map(id => String(id)) : [];
    
    // Refresh posts to show new feed
    this.getPosts();
  }

  getUserById(id: string | number): User | undefined {
    return this.users.find((user) => String(user.id) === String(id));
  }
}