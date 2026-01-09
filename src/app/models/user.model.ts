export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  profilePicture?: string;
  bio?: string;
  createdAt?: Date;
  updatedAt?: Date;
  roles?: string[];
  following: string[];   
  followers: string[];   
  name?: string;
  password?: string;
}
