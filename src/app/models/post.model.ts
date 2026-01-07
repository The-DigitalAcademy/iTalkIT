export interface Post {
  id: string;
  userId: number;
  caption: string;
  imageUrl?: string;
  timestamp: Date;
  likes: number;
  comments: Comment[];
}
