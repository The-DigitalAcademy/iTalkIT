import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PostsService } from 'src/app/services/post.service'; 

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
})
export class CreatePostComponent {
  caption: string = '';
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  constructor(private postsService: PostsService, private router: Router) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (!this.caption || !this.selectedFile) return;

    const newPost = {
      id: Date.now(),
      userId: JSON.parse(localStorage.getItem('currentUser') || '{}').id,
      caption: this.caption,
      image: this.imagePreview,  
      likes: 0,
      timestamp: new Date(),
    };

    this.postsService.addPost(newPost).subscribe(() => {
      alert('Post shared successfully!');
      this.router.navigate(['/profile']); 
    });
  }

}