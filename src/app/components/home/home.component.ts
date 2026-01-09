import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from '../../models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { Post } from 'src/app/models/post.model';
import { PostsService } from 'src/app/services/post.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  users: User[] = [];
  posts: Post[] = [];
  filteredPosts: Post[] = [];
  currentUser: User | null = null;
  followingIds: (string | number)[] = []; 

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private postService: PostsService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.getUsers();
    this.getPosts();
  }

  loadCurrentUser(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
      if (this.currentUser && this.currentUser.following) {
        this.followingIds = this.currentUser.following.map(id => String(id));
      } else {
        this.followingIds = [];
      }
    }
  }

  getUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        if (this.currentUser) {
          const currentUserId = this.currentUser.id;

          this.users = users.filter((user) => user.id !== currentUserId);
        }else{
          this.users = users;
        }
      },
      error: (err) => console.error('Error fetching users', err),
    });
  }

  getPosts(): void {
  this.postService.getPosts().subscribe({
    next: (posts) => {
      this.posts = posts;
      this.filterPostsByFollowing();
    },
    error: (err) => console.error('Error fetching posts', err),
  });
}

  filterPostsByFollowing(): void {
    if (this.currentUser && this.followingIds.length > 0) {
        this.filteredPosts = this.posts.filter((post) =>
          this.followingIds.includes(String(post.userId))
        );
    } else {
        this.filteredPosts = [];
    }
  }

  isFollowing(targetUserId: string | number): boolean {
    return this.followingIds.includes(String(targetUserId));
  }

  toggleFollow(targetUserId: string | number): void {
    if (!this.currentUser) return; 

    const targetIdString = String(targetUserId);
    const currentUserId = this.currentUser.id;
    let newFollowingList = [...this.followingIds];

    if (this.isFollowing(targetIdString)) {
      newFollowingList = newFollowingList.filter(id => id !== targetIdString);
    } else {
      newFollowingList.push(targetIdString);
    }

    this.userService.updateUserFollowing(currentUserId, newFollowingList).subscribe({
      next: (updatedUser: User) => {
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        this.currentUser = updatedUser;
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