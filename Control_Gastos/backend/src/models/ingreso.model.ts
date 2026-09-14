export interface Ingreso {
  id: string;
  user_id: string;
  descripcion: string;
  monto: number;
  tipo: 'Fijo' | 'Variable';
  fecha: string;
  created_at?: Date;
}

export interface Ahorro {
  id: string;
  user_id: string;
  descripcion: string;
  monto: number;
  categoria: 'Emergencia' | 'Inversión' | 'Retiro';
  fecha: string;
  created_at?: Date;
}