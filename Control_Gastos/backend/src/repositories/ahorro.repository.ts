import { pool } from '../config/database';
import { Ahorro } from '../models/ingreso.model';

interface AhorroData {
  descripcion: string;
  monto: number;
  categoria: string;
  fecha: string;
}

export class AhorroRepository {
  async findAllByUser(userId: string): Promise<Ahorro[]> {
    const query = `
      SELECT id, user_id, descripcion, monto::float8 AS monto, categoria, fecha, created_at
      FROM ahorros
      WHERE user_id = $1
      ORDER BY fecha DESC, id DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  async create(userId: string, data: AhorroData): Promise<Ahorro> {
    const query = `
      INSERT INTO ahorros (user_id, descripcion, monto, categoria, fecha)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, user_id, descripcion, monto::float8 AS monto, categoria, fecha, created_at
    `;
    const result = await pool.query(query, [userId, data.descripcion, data.monto, data.categoria, data.fecha]);
    return result.rows[0];
  }

  async updateById(id: string, userId: string, data: AhorroData): Promise<Ahorro | null> {
    const query = `
      UPDATE ahorros
      SET descripcion = $3, monto = $4, categoria = $5, fecha = $6
      WHERE id = $1 AND user_id = $2
      RETURNING id, user_id, descripcion, monto::float8 AS monto, categoria, fecha, created_at
    `;
    const result = await pool.query(query, [id, userId, data.descripcion, data.monto, data.categoria, data.fecha]);
    return result.rows[0] || null;
  }

  async deleteById(id: string, userId: string): Promise<boolean> {
    const query = 'DELETE FROM ahorros WHERE id = $1 AND user_id = $2';
    const result = await pool.query(query, [id, userId]);
    return (result.rowCount ?? 0) > 0;
  }

  async getTotalByUser(userId: string): Promise<number> {
    const result = await pool.query(
      'SELECT COALESCE(SUM(monto::float8), 0) AS total FROM ahorros WHERE user_id = $1',
      [userId]
    );
    return Number(result.rows[0].total);
  }

  async getTotalByUserExcluding(userId: string, excludeId: string): Promise<number> {
    const result = await pool.query(
      'SELECT COALESCE(SUM(monto::float8), 0) AS total FROM ahorros WHERE user_id = $1 AND id != $2',
      [userId, excludeId]
    );
    return Number(result.rows[0].total);
  }
}