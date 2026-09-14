import { IngresoRepository } from '../repositories/ingreso.repository';
import { AhorroRepository } from '../repositories/ahorro.repository';
import { EgresoRepository } from '../repositories/egreso.repository';
import { toIsoDate } from '../utils/date.util';

export class IngresoService {
  private repository = new IngresoRepository();
  private ahorroRepository = new AhorroRepository();
  private egresoRepository = new EgresoRepository();

  async list(userId: string) {
    const [ingresos, ahorros] = await Promise.all([
      this.repository.findAllByUser(userId),
      this.ahorroRepository.findAllByUser(userId)
    ]);
    return { ingresos, ahorros };
  }

  async create(userId: string, body: any) {
    const { descripcion, monto, tipo, fecha } = body;
    if (!descripcion || monto === undefined || !tipo || !fecha) {
      throw new Error('Descripción, monto, tipo y fecha son obligatorios');
    }
    return this.repository.create(userId, { descripcion, monto, tipo, fecha: toIsoDate(fecha) });
  }

  async update(userId: string, id: string, body: any) {
    const { descripcion, monto, tipo, fecha } = body;
    if (!descripcion || monto === undefined || !tipo || !fecha) {
      throw new Error('Descripción, monto, tipo y fecha son obligatorios');
    }
    const updated = await this.repository.updateById(id, userId, { descripcion, monto, tipo, fecha: toIsoDate(fecha) });
    if (!updated) {
      throw new Error('Ingreso no encontrado');
    }
    return updated;
  }

  async remove(userId: string, id: string) {
    const deleted = await this.repository.deleteById(id, userId);
    if (!deleted) {
      throw new Error('Ingreso no encontrado');
    }
  }

  async getTotalIngresos(userId: string): Promise<number> {
    return this.repository.getTotalByUser(userId);
  }

  async createAhorro(userId: string, body: any) {
    const { descripcion, monto, categoria, fecha } = body;
    if (!descripcion || monto === undefined || !categoria || !fecha) {
      throw new Error('Descripción, monto, categoría y fecha son obligatorios');
    }
    await this.validateSavingsBalance(userId, Number(monto));
    return this.ahorroRepository.create(userId, { descripcion, monto, categoria, fecha: toIsoDate(fecha) });
  }

  async updateAhorro(userId: string, id: string, body: any) {
    const { descripcion, monto, categoria, fecha } = body;
    if (!descripcion || monto === undefined || !categoria || !fecha) {
      throw new Error('Descripción, monto, categoría y fecha son obligatorios');
    }
    await this.validateSavingsBalance(userId, Number(monto), id);
    const updated = await this.ahorroRepository.updateById(id, userId, { descripcion, monto, categoria, fecha: toIsoDate(fecha) });
    if (!updated) {
      throw new Error('Ahorro no encontrado');
    }
    return updated;
  }

  async removeAhorro(userId: string, id: string) {
    const deleted = await this.ahorroRepository.deleteById(id, userId);
    if (!deleted) {
      throw new Error('Ahorro no encontrado');
    }
  }

  async listAhorros(userId: string) {
    const ahorros = await this.ahorroRepository.findAllByUser(userId);
    return { ahorros };
  }

  private async validateSavingsBalance(userId: string, amount: number, excludedId?: string): Promise<void> {
    if (!Number.isFinite(amount) || amount < 0) {
      throw new Error('El monto del ahorro no es válido');
    }

    const [totalIngresos, totalEgresos, totalCategorias, totalAhorros] = await Promise.all([
      this.repository.getTotalByUser(userId),
      this.egresoRepository.getTotalEgresosByUser(userId),
      this.egresoRepository.getTotalCategoriasByUser(userId),
      excludedId
        ? this.ahorroRepository.getTotalByUserExcluding(userId, excludedId)
        : this.ahorroRepository.getTotalByUser(userId)
    ]);

    const disponible = totalIngresos - totalEgresos - totalCategorias - totalAhorros;
    if (amount > disponible) {
      throw new Error(`Fondos insuficientes. Disponible: Q${Math.max(disponible, 0).toFixed(2)}`);
    }
  }
}