export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  id?: number;
  fullName: string;
  email: string;
  message?: string;
}
