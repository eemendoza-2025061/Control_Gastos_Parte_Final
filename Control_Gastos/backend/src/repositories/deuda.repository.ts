import { pool } from '../config/database';
import { Deuda, PagoDeuda } from '../models/deuda.model';

interface DeudaData {
  acreedor: string;
  monto_total: number;
  cuota_mensual: number;
  tasa_interes: number;
  estado: string;
  fecha_inicio: string;
  vencimiento: string;
}

interface PagoDeudaData {
  deuda_id: string;
  monto: number;
  fecha: string;
  nota: string | null;
}

export class DeudaRepository {
  async findAllByUser(userId: string): Promise<Deuda[]> {
    const query = `
      SELECT id, user_id, acreedor,
             monto_total::float8 AS monto_total,
             cuota_mensual::float8 AS cuota_mensual,
             tasa_interes::float8 AS tasa_interes,
             estado, fecha_inicio, vencimiento, created_at
      FROM deudas
      WHERE user_id = $1
      ORDER BY fecha_inicio DESC, id DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  async create(userId: string, data: DeudaData): Promise<Deuda> {
    const query = `
      INSERT INTO deudas (user_id, acreedor, monto_total, cuota_mensual, tasa_interes, estado, fecha_inicio, vencimiento)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, user_id, acreedor,
                monto_total::float8 AS monto_total,
                cuota_mensual::float8 AS cuota_mensual,
                tasa_interes::float8 AS tasa_interes,
                estado, fecha_inicio, vencimiento, created_at
    `;
    const result = await pool.query(query, [
      userId, data.acreedor, data.monto_total, data.cuota_mensual,
      data.tasa_interes, data.estado, data.fecha_inicio, data.vencimiento
    ]);
    return result.rows[0];
  }

  async updateById(id: string, userId: string, data: DeudaData): Promise<Deuda | null> {
    const query = `
      UPDATE deudas
      SET acreedor = $3, monto_total = $4, cuota_mensual = $5, tasa_interes = $6,
          estado = $7, fecha_inicio = $8, vencimiento = $9
      WHERE id = $1 AND user_id = $2
      RETURNING id, user_id, acreedor,
                monto_total::float8 AS monto_total,
                cuota_mensual::float8 AS cuota_mensual,
                tasa_interes::float8 AS tasa_interes,
                estado, fecha_inicio, vencimiento, created_at
    `;
    const result = await pool.query(query, [
      id, userId, data.acreedor, data.monto_total, data.cuota_mensual,
      data.tasa_interes, data.estado, data.fecha_inicio, data.vencimiento
    ]);
    return result.rows[0] || null;
  }

  async deleteById(id: string, userId: string): Promise<boolean> {
    const query = 'DELETE FROM deudas WHERE id = $1 AND user_id = $2';
    const result = await pool.query(query, [id, userId]);
    return (result.rowCount ?? 0) > 0;
  }

  async findPagosByUser(userId: string): Promise<PagoDeuda[]> {
    const query = `
      SELECT id, user_id, deuda_id, monto::float8 AS monto, fecha, nota, created_at
      FROM pagos_deuda
      WHERE user_id = $1
      ORDER BY fecha DESC, id DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  async createPago(userId: string, data: PagoDeudaData): Promise<PagoDeuda> {
    const query = `
      INSERT INTO pagos_deuda (user_id, deuda_id, monto, fecha, nota)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, user_id, deuda_id, monto::float8 AS monto, fecha, nota, created_at
    `;
    const result = await pool.query(query, [userId, data.deuda_id, data.monto, data.fecha, data.nota]);
    return result.rows[0];
  }

  async updatePagoById(id: string, userId: string, data: PagoDeudaData): Promise<PagoDeuda | null> {
    const query = `
      UPDATE pagos_deuda
      SET deuda_id = $3, monto = $4, fecha = $5, nota = $6
      WHERE id = $1 AND user_id = $2
      RETURNING id, user_id, deuda_id, monto::float8 AS monto, fecha, nota, created_at
    `;
    const result = await pool.query(query, [id, userId, data.deuda_id, data.monto, data.fecha, data.nota]);
    return result.rows[0] || null;
  }

  async deletePagoById(id: string, userId: string): Promise<boolean> {
    const query = 'DELETE FROM pagos_deuda WHERE id = $1 AND user_id = $2';
    const result = await pool.query(query, [id, userId]);
    return (result.rowCount ?? 0) > 0;
  }
}