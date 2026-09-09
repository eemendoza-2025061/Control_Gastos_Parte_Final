export interface Deuda {
  id: string;
  user_id: string;
  acreedor: string;
  monto_total: number;
  cuota_mensual: number;
  tasa_interes: number;
  estado: 'Activa' | 'Pagada';
  fecha_inicio: string;
  vencimiento: string;
}

export interface PagoDeuda {
  id: string;
  user_id: string;
  deuda_id: string;
  monto: number;
  fecha: string;
  nota: string | null;
}