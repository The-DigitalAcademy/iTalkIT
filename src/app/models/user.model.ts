export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  profilePicture?: string;
  bio?: string;
  following: string[];
  followers: string[];
  createdAt?: Date;
  updatedAt?: Date;
}