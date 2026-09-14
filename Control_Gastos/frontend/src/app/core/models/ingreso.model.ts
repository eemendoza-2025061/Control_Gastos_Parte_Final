export interface Ingreso {
  id: string;
  user_id: string;
  descripcion: string;
  monto: number;
  tipo: 'Fijo' | 'Variable';
  fecha: string;
}

export interface Ahorro {
  id: string;
  user_id: string;
  descripcion: string;
  monto: number;
  categoria: 'Emergencia' | 'Inversión' | 'Retiro';
  fecha: string;
}