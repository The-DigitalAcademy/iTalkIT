
export interface Comment {
  id: string | number;
  userId: string | number;
  text: string;
  timestamp: string;
}

export interface Post {
  id: string | number;
  userId: string | number;
  caption: string;
  imageUrl: string;
  timestamp: string;
  likes: number;
  comments: Comment[]; 
}
