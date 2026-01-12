import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent {
  caption: string = '';
  imagePreview: string | null = null;

  constructor(private router: Router) {}

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
    // Reset file input
    const fileInput = document.getElementById('imageUpload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  closeModal(): void {
    // Navigate back to home or previous page
    this.router.navigate(['/home']);
  }

  onSubmit(): void {
    if (this.imagePreview && this.caption) {
      console.log('Submitting post:', {
        caption: this.caption,
        image: this.imagePreview
      });
      
      // TODO: Call your post service here
      // this.postService.createPost({ caption: this.caption, image: this.imagePreview }).subscribe(...)
      
      // After successful submission, close modal
      this.closeModal();
    }
  }
}