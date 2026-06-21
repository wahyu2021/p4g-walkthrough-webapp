import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const validate = (schema: any) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const parsedData = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      req.body = parsedData.body;
      req.query = parsedData.query;
      req.params = parsedData.params;
      
      return next();
    } catch (error: any) {
      console.error('Validate Middleware Error:', error);
      const issues = error?.issues || error?.errors;
      if (issues && Array.isArray(issues)) {
        const errorMessage = issues.map((e: any) => e.message).join(', ');
        return res.status(400).json({ error: errorMessage || 'Validasi Gagal' });
      }
      return res.status(500).json({ error: 'Terjadi kesalahan sistem saat validasi.', detail: error?.message || 'Unknown error' });
    }
  };
};
