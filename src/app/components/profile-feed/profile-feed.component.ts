import { Component } from '@angular/core';

@Component({
  selector: 'app-profile-feed',
  templateUrl: './profile-feed.component.html',
  styleUrls: ['./profile-feed.component.css']
})
export class ProfileFeedComponent {

  user = {
    username: '211Grace',
    name: 'musa',
    followers: 0,
    following: 4,
    profileImage: 'https://via.placeholder.com/120'
  };

  posts = [
    {
      id: 1,
      text: 'My first post!',
      image: 'https://via.placeholder.com/400',
      createdAt: new Date(),
      editing: false
    },
    {
      id: 2,
      text: 'Building my social media app 🚀',
      image: null,
      createdAt: new Date(),
      editing: false
    }
  ];

  get postCount() {
    return this.posts.length;
  }

  editPost(post: any) {
    post.editing = true;
  }

  savePost(post: any) {
    post.editing = false;
  }

  deletePost(postId: number) {
    this.posts = this.posts.filter(p => p.id !== postId);
  }

  editProfile() {
    alert('Edit profile clicked (modal comes next)');
  }
}
