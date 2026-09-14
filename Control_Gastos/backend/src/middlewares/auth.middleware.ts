import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';

export interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string };
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, config.jwt.secret, (err, decoded) => {
      if (err || !decoded || typeof decoded === 'string') {
        res.status(401).json({ success: false, message: 'Token inválido o expirado' });
        return;
      }
      const payload = decoded as { id?: string; userId?: string; sub?: string; email?: string; role?: string };
      const id = payload.id || payload.userId || payload.sub;
      if (!id) {
        res.status(401).json({ success: false, message: 'Token inválido o expirado' });
        return;
      }
      req.user = { id: String(id), email: payload.email || '', role: payload.role || 'user' };
      next();
    });
  } else {
    res.status(401).json({ success: false, message: 'Autenticación requerida' });
  }
};