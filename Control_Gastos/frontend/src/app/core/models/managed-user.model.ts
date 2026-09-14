export type ManagedUserRole = 'admin' | 'editor' | 'viewer';

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: ManagedUserRole;
  picture?: string | null;
  last_login_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ManagedUserPayload {
  name: string;
  email: string;
  role: ManagedUserRole;
  password?: string;
}
