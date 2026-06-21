import type { Request, Response } from 'express';
import { AuthService } from '../services/AuthService.js';
import type { RegisterInput, LoginInput } from '../schemas/auth.schema.js';

export class AuthController {
  static async register(req: Request, res: Response): Promise<any> {
    try {
      const data = req.body as RegisterInput;
      const userId = await AuthService.registerUser(data);
      
      return res.status(201).json({ message: 'Registrasi sukses', userId });
    } catch (err: any) {
      console.error('Register Error:', err);
      if (err.message && err.message.includes(':')) {
        const parts = err.message.split(':');
        const statusCode = parseInt(parts[0], 10);
        if (!isNaN(statusCode)) {
          const errorMsg = parts.slice(1).join(':');
          return res.status(statusCode).json({ error: errorMsg });
        }
      }
      return res.status(500).json({ error: 'Terjadi kesalahan sistem.', detail: err.message });
    }
  }

  static async login(req: Request, res: Response): Promise<any> {
    try {
      const data = req.body as LoginInput;
      const result = await AuthService.loginUser(data);
      
      return res.status(200).json({ message: 'Login sukses', token: result.token, user: result.user });
    } catch (err: any) {
      console.error('Login Error:', err);
      if (err.message && err.message.includes(':')) {
        const parts = err.message.split(':');
        const statusCode = parseInt(parts[0], 10);
        if (!isNaN(statusCode)) {
          const errorMsg = parts.slice(1).join(':');
          return res.status(statusCode).json({ error: errorMsg });
        }
      }
      return res.status(500).json({ error: 'Terjadi kesalahan sistem.', detail: err.message });
    }
  }
}
