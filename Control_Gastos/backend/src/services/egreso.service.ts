import { EgresoRepository } from '../repositories/egreso.repository';
import { IngresoRepository } from '../repositories/ingreso.repository';
import { toIsoDate } from '../utils/date.util';

export class EgresoService {
  private repository = new EgresoRepository();
  private ingresoRepository = new IngresoRepository();

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

    await this.validateAvailableBalance(userId, Number(monto));

    return this.repository.create(userId, { descripcion, monto, tipo, fecha: toIsoDate(fecha) });
  }

  async update(userId: string, id: string, body: any) {
    const { descripcion, monto, tipo, fecha } = body;
    if (!descripcion || monto === undefined || !tipo || !fecha) {
      throw new Error('Descripción, monto, tipo y fecha son obligatorios');
    }

    await this.validateAvailableBalance(userId, Number(monto), id);

    const updated = await this.repository.updateById(id, userId, { descripcion, monto, tipo, fecha: toIsoDate(fecha) });
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

    await this.validateAvailableBalance(userId, Number(monto));

    return this.repository.createCategoria(userId, { descripcion, monto, categoria, fecha: toIsoDate(fecha) });
  }

  async updateCategoria(userId: string, id: string, body: any) {
    const { descripcion, monto, categoria, fecha } = body;
    if (!descripcion || monto === undefined || !categoria || !fecha) {
      throw new Error('Descripción, monto, categoría y fecha son obligatorios');
    }

    await this.validateAvailableBalance(userId, Number(monto), undefined, id);

    const updated = await this.repository.updateCategoriaById(id, userId, { descripcion, monto, categoria, fecha: toIsoDate(fecha) });
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

  private async validateAvailableBalance(
    userId: string,
    amount: number,
    excludedEgresoId?: string,
    excludedCategoriaId?: string
  ): Promise<void> {
    if (!Number.isFinite(amount) || amount < 0) {
      throw new Error('El monto del egreso no es válido');
    }

    const [totalIngresos, totalEgresos, totalCategorias] = await Promise.all([
      this.ingresoRepository.getTotalByUser(userId),
      excludedEgresoId
        ? this.repository.getTotalEgresosByUserExcluding(userId, excludedEgresoId)
        : this.repository.getTotalEgresosByUser(userId),
      excludedCategoriaId
        ? this.repository.getTotalCategoriasByUserExcluding(userId, excludedCategoriaId)
        : this.repository.getTotalCategoriasByUser(userId)
    ]);

    const disponible = totalIngresos - totalEgresos - totalCategorias;
    if (amount > disponible) {
      throw new Error(`Fondos insuficientes. Disponible: Q${Math.max(disponible, 0).toFixed(2)}`);
    }
  }
}