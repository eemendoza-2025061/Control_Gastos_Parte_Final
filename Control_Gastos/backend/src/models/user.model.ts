export interface User {
  id: string;
  name: string;
  email: string;
  picture?: string | null;
  ahorro_meta?: number;
  password?: string; // Opcional porque no siempre lo devolvemos
  role: string;
  last_login_at?: Date | null;
  created_at?: Date;
  updated_at?: Date;
}