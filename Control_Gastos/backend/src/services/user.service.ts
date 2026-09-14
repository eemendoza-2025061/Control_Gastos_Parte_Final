import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/user.repository';

const allowedRoles = new Set(['admin', 'editor', 'viewer']);

export class UserService {
  private repository = new UserRepository();

  async list() {
    return this.repository.listAll();
  }

  async create(body: any) {
    const { name, email, password, role } = body;
    if (!name || !email || !password || !allowedRoles.has(role)) {
      throw new Error('Nombre, email, contraseña y rol válido son obligatorios');
    }
    const hash = await bcrypt.hash(password, 10);
    return this.repository.createManaged(name.trim(), email.trim().toLowerCase(), hash, role);
  }

  async update(id: string, body: any) {
    const { name, email, password, role } = body;
    if (!name || !email || !allowedRoles.has(role)) {
      throw new Error('Nombre, email y rol válido son obligatorios');
    }
    const hash = password ? await bcrypt.hash(password, 10) : undefined;
    const updated = await this.repository.updateManaged(id, name.trim(), email.trim().toLowerCase(), role, hash);
    if (!updated) throw new Error('Usuario no encontrado');
    return updated;
  }

  async remove(id: string) {
    if (!(await this.repository.deleteById(id))) throw new Error('Usuario no encontrado');
  }
}