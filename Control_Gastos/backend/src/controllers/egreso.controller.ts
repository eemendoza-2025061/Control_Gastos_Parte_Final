import { Request, Response } from 'express';
import { EgresoService } from '../services/egreso.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export class EgresoController {
  private egresoService = new EgresoService();

  list = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const data = await this.egresoService.list(req.user!.id);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Error interno del servidor' });
    }
  };

  create = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const egreso = await this.egresoService.create(req.user!.id, req.body);
      res.status(201).json({ success: true, data: egreso });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  update = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const egreso = await this.egresoService.update(req.user!.id, String(req.params.id), req.body);
      res.status(200).json({ success: true, data: egreso });
    } catch (error: any) {
      const status = error.message.includes('no encontrado') ? 404 : 400;
      res.status(status).json({ success: false, message: error.message });
    }
  };

  remove = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      await this.egresoService.remove(req.user!.id, String(req.params.id));
      res.status(200).json({ success: true, message: 'Egreso eliminado' });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  };

  createCategoria = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const categoria = await this.egresoService.createCategoria(req.user!.id, req.body);
      res.status(201).json({ success: true, data: categoria });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  updateCategoria = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const categoria = await this.egresoService.updateCategoria(req.user!.id, String(req.params.id), req.body);
      res.status(200).json({ success: true, data: categoria });
    } catch (error: any) {
      const status = error.message.includes('no encontrado') ? 404 : 400;
      res.status(status).json({ success: false, message: error.message });
    }
  };

  removeCategoria = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      await this.egresoService.removeCategoria(req.user!.id, String(req.params.id));
      res.status(200).json({ success: true, message: 'Gasto eliminado' });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  };
}