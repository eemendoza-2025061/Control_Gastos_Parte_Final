import { EgresoRepository } from '../repositories/egreso.repository';

export class EgresoService {
  private repository = new EgresoRepository();

  async list(userId: string) {
    const [egresos, categorias] = await Promise.all([
      this.repository.findAllByUser(userId),
      this.repository.findCategoriasByUser(userId)
    ]);
    return { egresos, categorias };
  }

  async create(userId: string, body: any) {
    const { descripcion, monto, tipo, fecha } = body;
    if (!descripcion || monto === undefined || !tipo || !fecha) {
      throw new Error('Descripción, monto, tipo y fecha son obligatorios');
    }
    return this.repository.create(userId, { descripcion, monto, tipo, fecha });
  }

  async update(userId: string, id: string, body: any) {
    const { descripcion, monto, tipo, fecha } = body;
    if (!descripcion || monto === undefined || !tipo || !fecha) {
      throw new Error('Descripción, monto, tipo y fecha son obligatorios');
    }
    const updated = await this.repository.updateById(id, userId, { descripcion, monto, tipo, fecha });
    if (!updated) {
      throw new Error('Egreso no encontrado');
    }
    return updated;
  }

  async remove(userId: string, id: string) {
    const deleted = await this.repository.deleteById(id, userId);
    if (!deleted) {
      throw new Error('Egreso no encontrado');
    }
  }

  async createCategoria(userId: string, body: any) {
    const { descripcion, monto, categoria, fecha } = body;
    if (!descripcion || monto === undefined || !categoria || !fecha) {
      throw new Error('Descripción, monto, categoría y fecha son obligatorios');
    }
    return this.repository.createCategoria(userId, { descripcion, monto, categoria, fecha });
  }

  async updateCategoria(userId: string, id: string, body: any) {
    const { descripcion, monto, categoria, fecha } = body;
    if (!descripcion || monto === undefined || !categoria || !fecha) {
      throw new Error('Descripción, monto, categoría y fecha son obligatorios');
    }
    const updated = await this.repository.updateCategoriaById(id, userId, { descripcion, monto, categoria, fecha });
    if (!updated) {
      throw new Error('Gasto por categoría no encontrado');
    }
    return updated;
  }

  async removeCategoria(userId: string, id: string) {
    const deleted = await this.repository.deleteCategoriaById(id, userId);
    if (!deleted) {
      throw new Error('Gasto por categoría no encontrado');
    }
  }
}