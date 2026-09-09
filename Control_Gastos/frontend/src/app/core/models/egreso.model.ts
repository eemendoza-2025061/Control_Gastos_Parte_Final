export interface Egreso {
  id: string;
  user_id: string;
  descripcion: string;
  monto: number;
  tipo: 'Fijo' | 'Variable';
  fecha: string;
}

export interface EgresoCategoria {
  id: string;
  user_id: string;
  descripcion: string;
  monto: number;
  categoria: 'Servicios' | 'Transporte' | 'Alimentación';
  fecha: string;
}