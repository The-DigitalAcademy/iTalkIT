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
import { Subscription, forkJoin } from 'rxjs';
import { filter } from 'rxjs/operators';

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
  
  // Store all users (both following and not following) for display
  allUsersMap: Map<string, User> = new Map();

  readonly FALLBACK_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23e0e0e0" width="400" height="400"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="24"%3ENo Image%3C/text%3E%3C/svg%3E';
  
  readonly DEFAULT_AVATAR = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="50" height="50"%3E%3Ccircle cx="25" cy="25" r="25" fill="%2399ccff"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="20" fill="%23fff" font-weight="bold"%3EU%3C/text%3E%3C/svg%3E';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private postService: PostsService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    console.log('HomeComponent initialized');
    this.loadCurrentUser();
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  loadCurrentUser(): void {
    console.log('Loading current user from store...');
    this.userSubscription = this.store.select(AuthSelectors.selectUser).pipe(
      filter(user => user !== null && user !== undefined)
    ).subscribe(user => {
      console.log('User from store:', user);
      this.currentUser = user;
      
      if (this.currentUser && this.currentUser.following && this.currentUser.following.length > 0) {
        this.followingIds = this.currentUser.following.map(id => String(id));
        console.log('Following IDs:', this.followingIds);
      } else {
        this.followingIds = [];
        console.log('No following data available');
      }
      
      // Load both users and posts when user changes
      this.getAllUsers();
      this.getPosts();
    });
  }

  getAllUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        console.log('Fetched all users:', users);
        
        // Store all users in a map for easy lookup
        users.forEach(user => {
          this.allUsersMap.set(String(user.id), user);
        });
        
        // Filter out current user for "who to follow" section
        if (this.currentUser) {
          const currentUserId = this.currentUser.id;
          this.users = users.filter((user) => user.id !== currentUserId);
        } else {
          this.users = users;
        }
        
        console.log('All users map:', this.allUsersMap);
        console.log('Filtered users for suggestions:', this.users);
      },
      error: (err) => console.error('Error fetching users', err),
    });
  }

  getPosts(): void {
    if (this.currentUser && this.currentUser.id) {
      console.log('Fetching feed posts for user:', this.currentUser.id);
      this.postService.getFeedPosts(this.currentUser.id).subscribe({
        next: (posts) => {
          console.log('Fetched feed posts from backend:', posts);
          console.log('First post:', posts[0]);
          console.log('First post userId:', posts[0]?.userId);
          
          this.filteredPosts = posts;
          this.posts = posts;
        },
        error: (err) => {
          console.error('Error fetching feed posts', err);
          this.filteredPosts = [];
          this.posts = [];
        },
      });
    } else {
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
    const storage = localStorage.getItem('rememberMe') === 'true' 
      ? localStorage 
      : sessionStorage;
    
    storage.setItem('user', JSON.stringify(updatedUser));
    console.log('Saved updated user to storage:', storage === localStorage ? 'localStorage' : 'sessionStorage');
    
    this.store.dispatch(AuthActions.updateUser({ user: updatedUser }));
    
    this.followingIds = updatedUser.following ? updatedUser.following.map(id => String(id)) : [];
    
    this.getPosts();
  }

  getUserById(id: string | number): User | undefined {
    const userId = String(id);
    return this.allUsersMap.get(userId);
  }

  getUserDisplayName(post: Post): string {
    const user = this.getUserById(post.userId);
    if (user) {
      if (user.firstName && user.lastName) {
        return `${user.firstName} ${user.lastName}`;
      }
      return user.username || 'Unknown User';
    }
    return 'Unknown User';
  }

  getUserAvatar(post: Post): string {
    const user = this.getUserById(post.userId);
    if (user?.profilePicture) {
      return user.profilePicture;
    }
    return this.DEFAULT_AVATAR;
  }

  onImageError(event: any): void {
    event.target.src = this.FALLBACK_IMAGE;
  }
}