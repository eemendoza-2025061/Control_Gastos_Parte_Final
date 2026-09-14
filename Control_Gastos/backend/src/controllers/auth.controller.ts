import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export class AuthController {
  private authService = new AuthService();

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        res.status(400).json({ success: false, message: 'Email y contraseña son obligatorios' });
        return;
      }

      const result = await this.authService.login(email, password);
      res.status(200).json({
        success: true,
        message: 'Login exitoso',
        ...result
      });
    } catch (error: any) {
      res.status(401).json({ success: false, message: error.message });
    }
  };

  googleLogin = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.body.credential) {
        res.status(400).json({ success: false, message: 'Credencial de Google obligatoria' });
        return;
      }
      const result = await this.authService.loginWithGoogle(req.body.credential);
      res.status(200).json({ success: true, message: 'Login con Google exitoso', ...result });
    } catch (error: any) {
      res.status(401).json({ success: false, message: error.message || 'No se pudo iniciar sesión con Google' });
    }
  };

  getMe = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'No autenticado' });
        return;
      }
      const user = await this.authService.getMe(req.user.id);
      res.status(200).json({ success: true, user });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  };

  updateSavingsGoal = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const user = await this.authService.updateSavingsGoal(req.user!.id, Number(req.body.amount));
      res.status(200).json({ success: true, user });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  logout = (req: Request, res: Response): void => {
    // Al usar JWT sin estado, el logout real se maneja en el frontend borrando el token.
    // Este endpoint es útil si implementamos una lista negra de tokens en el futuro.
    res.status(200).json({ success: true, message: 'Logout exitoso' });
  };
}