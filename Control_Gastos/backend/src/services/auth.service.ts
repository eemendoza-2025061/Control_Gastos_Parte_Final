import bcrypt from 'bcryptjs';
import { randomBytes } from 'node:crypto';
import { OAuth2Client } from 'google-auth-library';
import { UserRepository } from '../repositories/user.repository';
import { generateToken } from '../utils/jwt.util';
import { config } from '../config/env';

export class AuthService {
  private userRepository = new UserRepository();
  private googleClient = new OAuth2Client();

  async login(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Credenciales inválidas'); // Mensaje genérico por seguridad
    }

    const isPasswordValid = await bcrypt.compare(password, user.password!);
    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas');
    }

    await this.userRepository.markLogin(user.id);

    const token = generateToken(user);
    
    // Remover el password antes de devolver el usuario
    const { password: _, ...userWithoutPassword } = user;

    return {
      token,
      user: userWithoutPassword
    };
  }

  async getMe(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('Usuario no encontrado');
    return user;
  }

  async updateSavingsGoal(userId: string, amount: number) {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error('La meta de ahorro debe ser mayor que cero');
    }
    const user = await this.userRepository.updateSavingsGoal(userId, amount);
    if (!user) throw new Error('Usuario no encontrado');
    return user;
  }

  async loginWithGoogle(credential: string) {
    if (!config.google.clientId) {
      throw new Error('La autenticación con Google no está configurada');
    }

    const ticket = await this.googleClient.verifyIdToken({
      idToken: credential,
      audience: config.google.clientId
    });
    const payload = ticket.getPayload();
    if (!payload?.email || !payload.email_verified) {
      throw new Error('La cuenta de Google no está verificada');
    }

    let user = await this.userRepository.findByEmail(payload.email);
    if (!user) {
      const password = await bcrypt.hash(randomBytes(32).toString('hex'), 10);
      user = await this.userRepository.create(payload.name || payload.email, payload.email, password);
    }

    await this.userRepository.markLogin(user.id);

    if (payload.picture && user.picture !== payload.picture) {
      await this.userRepository.updatePicture(user.id, payload.picture);
      user = { ...user, picture: payload.picture };
    }

    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  }
}