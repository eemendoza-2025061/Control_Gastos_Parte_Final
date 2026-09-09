import { pool } from '../config/database';
import { Egreso, EgresoCategoria } from '../models/egreso.model';

interface EgresoData {
  descripcion: string;
  monto: number;
  tipo: string;
  fecha: string;
}

interface EgresoCategoriaData {
  descripcion: string;
  monto: number;
  categoria: string;
  fecha: string;
}

export class EgresoRepository {
  async findAllByUser(userId: string): Promise<Egreso[]> {
    const query = `
      SELECT id, user_id, descripcion, monto::float8 AS monto, tipo, fecha, created_at
      FROM egresos
      WHERE user_id = $1
      ORDER BY fecha DESC, id DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  async create(userId: string, data: EgresoData): Promise<Egreso> {
    const query = `
      INSERT INTO egresos (user_id, descripcion, monto, tipo, fecha)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, user_id, descripcion, monto::float8 AS monto, tipo, fecha, created_at
    `;
    const result = await pool.query(query, [userId, data.descripcion, data.monto, data.tipo, data.fecha]);
    return result.rows[0];
  }

  async updateById(id: string, userId: string, data: EgresoData): Promise<Egreso | null> {
    const query = `
      UPDATE egresos
      SET descripcion = $3, monto = $4, tipo = $5, fecha = $6
      WHERE id = $1 AND user_id = $2
      RETURNING id, user_id, descripcion, monto::float8 AS monto, tipo, fecha, created_at
    `;
    const result = await pool.query(query, [id, userId, data.descripcion, data.monto, data.tipo, data.fecha]);
    return result.rows[0] || null;
  }

  async deleteById(id: string, userId: string): Promise<boolean> {
    const query = 'DELETE FROM egresos WHERE id = $1 AND user_id = $2';
    const result = await pool.query(query, [id, userId]);
    return (result.rowCount ?? 0) > 0;
  }

  async findCategoriasByUser(userId: string): Promise<EgresoCategoria[]> {
    const query = `
      SELECT id, user_id, descripcion, monto::float8 AS monto, categoria, fecha, created_at
      FROM egresos_categorias
      WHERE user_id = $1
      ORDER BY fecha DESC, id DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  async createCategoria(userId: string, data: EgresoCategoriaData): Promise<EgresoCategoria> {
    const query = `
      INSERT INTO egresos_categorias (user_id, descripcion, monto, categoria, fecha)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, user_id, descripcion, monto::float8 AS monto, categoria, fecha, created_at
    `;
    const result = await pool.query(query, [userId, data.descripcion, data.monto, data.categoria, data.fecha]);
    return result.rows[0];
  }

  async updateCategoriaById(id: string, userId: string, data: EgresoCategoriaData): Promise<EgresoCategoria | null> {
    const query = `
      UPDATE egresos_categorias
      SET descripcion = $3, monto = $4, categoria = $5, fecha = $6
      WHERE id = $1 AND user_id = $2
      RETURNING id, user_id, descripcion, monto::float8 AS monto, categoria, fecha, created_at
    `;
    const result = await pool.query(query, [id, userId, data.descripcion, data.monto, data.categoria, data.fecha]);
    return result.rows[0] || null;
  }

  async deleteCategoriaById(id: string, userId: string): Promise<boolean> {
    const query = 'DELETE FROM egresos_categorias WHERE id = $1 AND user_id = $2';
    const result = await pool.query(query, [id, userId]);
    return (result.rowCount ?? 0) > 0;
  }
}