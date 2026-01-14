import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { PostsService } from 'src/app/services/post.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import * as AuthSelectors from 'src/app/store/auth/auth.selectors';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit, OnDestroy {
  caption: string = '';
  imagePreview: string | null = null;
  currentUserId: string | number | null = null;
  loading: boolean = false;

  private userSubscription?: Subscription;

  constructor(
    private router: Router,
    private postService: PostsService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.store.select(AuthSelectors.selectUser).pipe(
      filter((user): user is User => user !== null && user !== undefined)
    ).subscribe(user => {
      this.currentUserId = user.id ?? null;
      console.log('Current user ID in create post:', this.currentUserId);
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.imagePreview = null;
    const fileInput = document.getElementById('imageUpload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  closeModal(): void {
    this.router.navigate(['/profile']);
  }

  onSubmit(): void {
    console.log('Submit clicked. Current user ID:', this.currentUserId);
    
    if (!this.currentUserId) {
      alert('Please log in to create a post');
      return;
    }

    if (!this.imagePreview || !this.caption) {
      alert('Please add both an image and caption');
      return;
    }

    this.loading = true;

    const newPost = {
      userId: this.currentUserId,
      caption: this.caption,
      imageUrl: this.imagePreview,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: []
    };

    console.log('Creating post:', newPost);

    this.postService.createPost(newPost).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/profile']);
      },
      error: (error) => {
        console.error('Error creating post:', error);
        this.loading = false;
        alert('Failed to create post. Please try again.');
      }
    });
  }
}