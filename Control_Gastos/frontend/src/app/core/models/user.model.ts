export interface User {
  id: string;
  name: string;
  email: string;
  picture?: string | null;
  ahorro_meta?: number;
  role: 'admin' | 'user';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}