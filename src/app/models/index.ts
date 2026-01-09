
export interface User {
  id: string;  // Changed from number to string
  email: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  profilePicture?: string;
  bio?: string;
  createdAt?: Date;
  updatedAt?: Date;
  roles?: string[];  
  name?: string;   
  following: string[];
  followers: string[];  
}

// Login Request interface
export interface LoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

// Login Response interface
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;  // Now matches user.model.ts
  message?: string;
  expiresIn?: number;
}

