import { pool } from '../config/database';
import { User } from '../models/user.model';

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  }

  async findById(id: string): Promise<User | null> {
    const query = 'SELECT id, name, email, role, picture, ahorro_meta::float8 AS ahorro_meta, last_login_at, created_at, updated_at FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  async create(name: string, email: string, password: string): Promise<User> {
    const query = `
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, 'user')
      RETURNING id, name, email, role, ahorro_meta::float8 AS ahorro_meta, created_at, updated_at
    `;
    const result = await pool.query(query, [name, email, password]);
    return result.rows[0];
  }

  async listAll(): Promise<User[]> {
    const result = await pool.query(`
      SELECT id, name, email, role, picture, last_login_at, created_at, updated_at
      FROM users ORDER BY created_at DESC, name ASC
    `);
    return result.rows;
  }

  async createManaged(name: string, email: string, password: string, role: string): Promise<User> {
    const result = await pool.query(`
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role, picture, last_login_at, created_at, updated_at
    `, [name, email, password, role]);
    return result.rows[0];
  }

  async updateManaged(id: string, name: string, email: string, role: string, password?: string): Promise<User | null> {
    const result = password
      ? await pool.query(`UPDATE users SET name = $2, email = $3, role = $4, password = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, name, email, role, picture, last_login_at, created_at, updated_at`, [id, name, email, role, password])
      : await pool.query(`UPDATE users SET name = $2, email = $3, role = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, name, email, role, picture, last_login_at, created_at, updated_at`, [id, name, email, role]);
    return result.rows[0] || null;
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }

  async markLogin(id: string): Promise<void> {
    await pool.query('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1', [id]);
  }

  async updatePicture(id: string, picture: string): Promise<void> {
    await pool.query('UPDATE users SET picture = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $1', [id, picture]);
  }

  async updateRole(id: string, role: string): Promise<void> {
    await pool.query('UPDATE users SET role = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $1', [id, role]);
  }

  async updateSavingsGoal(id: string, amount: number): Promise<User | null> {
    const result = await pool.query(
      'UPDATE users SET ahorro_meta = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, name, email, role, picture, ahorro_meta::float8 AS ahorro_meta, created_at, updated_at',
      [id, amount]
    );
    return result.rows[0] || null;
  }
}