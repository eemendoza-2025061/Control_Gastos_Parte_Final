import { Request, Response } from 'express';
import { IngresoService } from '../services/ingreso.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export class AhorroController {
  private ingresoService = new IngresoService();

  list = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const data = await this.ingresoService.listAhorros(req.user!.id);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Error interno del servidor' });
    }
  };

  create = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const ahorro = await this.ingresoService.createAhorro(req.user!.id, req.body);
      res.status(201).json({ success: true, data: ahorro });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  update = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const ahorro = await this.ingresoService.updateAhorro(req.user!.id, String(req.params.id), req.body);
      res.status(200).json({ success: true, data: ahorro });
    } catch (error: any) {
      const status = error.message.includes('no encontrado') ? 404 : 400;
      res.status(status).json({ success: false, message: error.message });
    }
  };

  remove = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      await this.ingresoService.removeAhorro(req.user!.id, String(req.params.id));
      res.status(200).json({ success: true, message: 'Ahorro eliminado' });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  };
}