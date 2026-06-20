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
      if (err.message && err.message.includes(':')) {
        const [statusCode, errorMsg] = err.message.split(':');
        return res.status(Number(statusCode)).json({ error: errorMsg });
      }
      return res.status(500).json({ error: 'Terjadi kesalahan sistem.' });
    }
  }

  static async login(req: Request, res: Response): Promise<any> {
    try {
      const data = req.body as LoginInput;
      const result = await AuthService.loginUser(data);
      
      return res.status(200).json({ message: 'Login sukses', token: result.token, user: result.user });
    } catch (err: any) {
      if (err.message && err.message.includes(':')) {
        const [statusCode, errorMsg] = err.message.split(':');
        return res.status(Number(statusCode)).json({ error: errorMsg });
      }
      return res.status(500).json({ error: 'Terjadi kesalahan sistem.' });
    }
  }
}
