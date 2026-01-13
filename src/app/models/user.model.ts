export interface User {
  id: string | number;
  username: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  name?: string;
  profilePicture?: string;
  bio?: string;
  following: (string | number)[];
  followers: (string | number)[];
}