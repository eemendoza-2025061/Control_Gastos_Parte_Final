import { pool } from '../config/database';
import { Ingreso } from '../models/ingreso.model';

interface IngresoData {
  descripcion: string;
  monto: number;
  tipo: string;
  fecha: string;
}

export class IngresoRepository {
  async findAllByUser(userId: string): Promise<Ingreso[]> {
    const query = `
      SELECT id, user_id, descripcion, monto::float8 AS monto, tipo, fecha, created_at
      FROM ingresos
      WHERE user_id = $1
      ORDER BY fecha DESC, id DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  async create(userId: string, data: IngresoData): Promise<Ingreso> {
    const query = `
      INSERT INTO ingresos (user_id, descripcion, monto, tipo, fecha)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, user_id, descripcion, monto::float8 AS monto, tipo, fecha, created_at
    `;
    const result = await pool.query(query, [userId, data.descripcion, data.monto, data.tipo, data.fecha]);
    return result.rows[0];
  }

  async updateById(id: string, userId: string, data: IngresoData): Promise<Ingreso | null> {
    const query = `
      UPDATE ingresos
      SET descripcion = $3, monto = $4, tipo = $5, fecha = $6
      WHERE id = $1 AND user_id = $2
      RETURNING id, user_id, descripcion, monto::float8 AS monto, tipo, fecha, created_at
    `;
    const result = await pool.query(query, [id, userId, data.descripcion, data.monto, data.tipo, data.fecha]);
    return result.rows[0] || null;
  }

  async deleteById(id: string, userId: string): Promise<boolean> {
    const query = 'DELETE FROM ingresos WHERE id = $1 AND user_id = $2';
    const result = await pool.query(query, [id, userId]);
    return (result.rowCount ?? 0) > 0;
  }

  async getTotalByUser(userId: string): Promise<number> {
    const query = 'SELECT COALESCE(SUM(monto), 0)::float8 AS total FROM ingresos WHERE user_id = $1';
    const result = await pool.query(query, [userId]);
    return result.rows[0]?.total || 0;
  }

  async getTotalIngresosByUser(userId: string): Promise<number> {
    return this.getTotalByUser(userId);
  }
}