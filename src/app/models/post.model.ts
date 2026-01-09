export interface Post {
  id: number;
  userId: number;
  caption: string;
  imageUrl?: string;
  timestamp: Date;
  likes?: number;
  comments?: Comment[];
}
