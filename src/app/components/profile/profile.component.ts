import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { PostsService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service'; 


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  imports: [CommonModule],
  standalone: true,
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  posts: any[] = [];
  currentUserProfile: any = null; 
  currentUserId: string | number | null = null;

  constructor(
    private postsService: PostsService, 
    private authService: AuthService,
    private userService: UserService 
  ) {}

  ngOnInit() {
    this.currentUserId = this.authService.getCurrentUserId(); 
    
    
    if (this.currentUserId) {
      this.getUserProfile(); 
      this.getUserPosts();   
    }
  }

  
  getUserProfile() {
    if (this.currentUserId) {
        this.userService.getUserById(this.currentUserId).subscribe({
            next: (user) => {
                this.currentUserProfile = user;
            },
            error: (error) => {
                console.error('Error fetching user profile:', error);
                this.currentUserProfile = { name: 'Guest', username: 'guest' }; 
            }
        });
    }
  }

  
  getUserPosts() {
    console.log('Current User ID:', this.currentUserId);
    if (this.currentUserId) {
      this.postsService.getPostsByUserId(this.currentUserId).subscribe({
        next: (userPosts) => {
          console.log('Fetched User Posts:', userPosts);
          this.posts = userPosts; 
        },
        error: (error) => {
          console.error('Error fetching user posts:', error);
        }
      });
    }
  }

  get isLoggedIn(): boolean{
    return this.authService.isLoggedIn();
  }
}
