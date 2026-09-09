import { DeudaRepository } from '../repositories/deuda.repository';

export class DeudaService {
  private repository = new DeudaRepository();

  async list(userId: string) {
    const [deudas, pagos] = await Promise.all([
      this.repository.findAllByUser(userId),
      this.repository.findPagosByUser(userId)
    ]);
    return { deudas, pagos };
  }

  async create(userId: string, body: any) {
    const { acreedor, monto_total, cuota_mensual, tasa_interes, estado, fecha_inicio, vencimiento } = body;
    if (!acreedor || monto_total === undefined || cuota_mensual === undefined || !fecha_inicio || !vencimiento) {
      throw new Error('Acreedor, monto total, cuota mensual, fecha de inicio y vencimiento son obligatorios');
    }
    return this.repository.create(userId, {
      acreedor,
      monto_total,
      cuota_mensual,
      tasa_interes: tasa_interes ?? 0,
      estado: estado || 'Activa',
      fecha_inicio,
      vencimiento
    });
  }

  async update(userId: string, id: string, body: any) {
    const { acreedor, monto_total, cuota_mensual, tasa_interes, estado, fecha_inicio, vencimiento } = body;
    if (!acreedor || monto_total === undefined || cuota_mensual === undefined || !fecha_inicio || !vencimiento) {
      throw new Error('Acreedor, monto total, cuota mensual, fecha de inicio y vencimiento son obligatorios');
    }
    const updated = await this.repository.updateById(id, userId, {
      acreedor,
      monto_total,
      cuota_mensual,
      tasa_interes: tasa_interes ?? 0,
      estado: estado || 'Activa',
      fecha_inicio,
      vencimiento
    });
    if (!updated) {
      throw new Error('Deuda no encontrada');
    }
    return updated;
  }

  async remove(userId: string, id: string) {
    const deleted = await this.repository.deleteById(id, userId);
    if (!deleted) {
      throw new Error('Deuda no encontrada');
    }
  }

  async createPago(userId: string, body: any) {
    const { deuda_id, monto, fecha, nota } = body;
    if (!deuda_id || monto === undefined || !fecha) {
      throw new Error('Deuda, monto y fecha son obligatorios');
    }
    return this.repository.createPago(userId, { deuda_id, monto, fecha, nota: nota || null });
  }

  async updatePago(userId: string, id: string, body: any) {
    const { deuda_id, monto, fecha, nota } = body;
    if (!deuda_id || monto === undefined || !fecha) {
      throw new Error('Deuda, monto y fecha son obligatorios');
    }
    const updated = await this.repository.updatePagoById(id, userId, { deuda_id, monto, fecha, nota: nota || null });
    if (!updated) {
      throw new Error('Pago no encontrado');
    }
    return updated;
  }

  async removePago(userId: string, id: string) {
    const deleted = await this.repository.deletePagoById(id, userId);
    if (!deleted) {
      throw new Error('Pago no encontrado');
    }
  }
}