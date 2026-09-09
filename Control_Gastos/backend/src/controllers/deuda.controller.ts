import { Request, Response } from 'express';
import { DeudaService } from '../services/deuda.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export class DeudaController {
  private deudaService = new DeudaService();

  list = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const data = await this.deudaService.list(req.user!.id);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Error interno del servidor' });
    }
  };

  create = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const deuda = await this.deudaService.create(req.user!.id, req.body);
      res.status(201).json({ success: true, data: deuda });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  update = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const deuda = await this.deudaService.update(req.user!.id, String(req.params.id), req.body);
      res.status(200).json({ success: true, data: deuda });
    } catch (error: any) {
      const status = error.message.includes('no encontrada') ? 404 : 400;
      res.status(status).json({ success: false, message: error.message });
    }
  };

  remove = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      await this.deudaService.remove(req.user!.id, String(req.params.id));
      res.status(200).json({ success: true, message: 'Deuda eliminada' });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  };

  createPago = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const pago = await this.deudaService.createPago(req.user!.id, req.body);
      res.status(201).json({ success: true, data: pago });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  updatePago = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const pago = await this.deudaService.updatePago(req.user!.id, String(req.params.id), req.body);
      res.status(200).json({ success: true, data: pago });
    } catch (error: any) {
      const status = error.message.includes('no encontrado') ? 404 : 400;
      res.status(status).json({ success: false, message: error.message });
    }
  };

  removePago = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      await this.deudaService.removePago(req.user!.id, String(req.params.id));
      res.status(200).json({ success: true, message: 'Pago eliminado' });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  };
}