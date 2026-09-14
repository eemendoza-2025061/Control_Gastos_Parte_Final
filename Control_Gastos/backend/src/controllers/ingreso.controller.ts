import { Request, Response } from 'express';
import { IngresoService } from '../services/ingreso.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export class IngresoController {
  private ingresoService = new IngresoService();

  list = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const data = await this.ingresoService.list(req.user!.id);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Error interno del servidor' });
    }
  };

  create = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const ingreso = await this.ingresoService.create(req.user!.id, req.body);
      res.status(201).json({ success: true, data: ingreso });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  update = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const ingreso = await this.ingresoService.update(req.user!.id, String(req.params.id), req.body);
      res.status(200).json({ success: true, data: ingreso });
    } catch (error: any) {
      const status = error.message.includes('no encontrado') ? 404 : 400;
      res.status(status).json({ success: false, message: error.message });
    }
  };

  remove = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      await this.ingresoService.remove(req.user!.id, String(req.params.id));
      res.status(200).json({ success: true, message: 'Ingreso eliminado' });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  };

  getTotal = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const total = await this.ingresoService.getTotalIngresos(req.user!.id);
      res.status(200).json({ success: true, data: { total } });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Error interno del servidor' });
    }
  };
}