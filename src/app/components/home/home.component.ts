import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { UserInterface } from '../../models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { Post } from 'src/app/models/post.model';
import { PostsService } from 'src/app/services/post.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import * as AuthSelectors from '../../store/auth/auth.selectors';
import * as AuthActions from '../../store/auth/auth.actions';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models';


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
    
    // Subscribe to the store instead of localStorage
    this.userSubscription = this.store.select(AuthSelectors.selectUser).subscribe(user => {
      console.log('User from store:', user);
      this.currentUser = user;
      
      if (this.currentUser && this.currentUser.following) {
        this.followingIds = this.currentUser.following.map(id => String(id));
        console.log('Following IDs:', this.followingIds);
        this.filterPostsByFollowing();
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
    this.postService.getPosts().subscribe({
      next: (posts) => {
        console.log('Fetched posts:', posts);
        this.posts = posts;
        this.filterPostsByFollowing();
      },
      error: (err) => console.error('Error fetching posts', err),
    });
  }

  filterPostsByFollowing(): void {
    console.log('Filtering posts. Following IDs:', this.followingIds);
    if (this.currentUser && this.followingIds.length > 0) {
      this.filteredPosts = this.posts.filter((post) =>
        this.followingIds.includes(String(post.userId))
      );
      console.log('Filtered posts:', this.filteredPosts);
    } else {
      this.filteredPosts = [];
      console.log('No posts to show - not following anyone');
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
    let newFollowingList = [...this.followingIds];

    if (this.isFollowing(targetIdString)) {
      newFollowingList = newFollowingList.filter(id => id !== targetIdString);
      console.log('Unfollowing user:', targetIdString);
    } else {
      newFollowingList.push(targetIdString);
      console.log('Following user:', targetIdString);
    }

    console.log('New following list:', newFollowingList);

    this.userService.updateUserFollowing(currentUserId, newFollowingList).subscribe({
      next: (updatedUser: User) => {
        console.log('Updated user from API:', updatedUser);
        
        // Update both storage and store
        const storage = localStorage.getItem('rememberMe') === 'true' 
          ? localStorage 
          : sessionStorage;
        
        storage.setItem('user', JSON.stringify(updatedUser));
        console.log('Saved to storage:', storage === localStorage ? 'localStorage' : 'sessionStorage');
        
        // Update the store
        this.store.dispatch(AuthActions.updateUser({ user: updatedUser }));
        
        this.followingIds = newFollowingList;
        this.filterPostsByFollowing();

        console.log(`Successfully updated following status for user ${currentUserId}`);
      },
      error: (err) => console.error('Error updating following status', err),
    });
  }

  getUserById(id: string | number): User | undefined {
    return this.users.find((user) => String(user.id) === String(id));
  }
}
