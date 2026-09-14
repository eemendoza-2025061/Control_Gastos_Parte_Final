import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

export class UserController {
  private service = new UserService();

  list = async (_req: Request, res: Response): Promise<void> => {
    try { res.json({ success: true, data: await this.service.list() }); }
    catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try { res.status(201).json({ success: true, data: await this.service.create(req.body) }); }
    catch (error: any) { res.status(400).json({ success: false, message: error.message }); }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try { res.json({ success: true, data: await this.service.update(String(req.params.id), req.body) }); }
    catch (error: any) { res.status(error.message.includes('no encontrado') ? 404 : 400).json({ success: false, message: error.message }); }
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    try { await this.service.remove(String(req.params.id)); res.json({ success: true }); }
    catch (error: any) { res.status(404).json({ success: false, message: error.message }); }
  };
}