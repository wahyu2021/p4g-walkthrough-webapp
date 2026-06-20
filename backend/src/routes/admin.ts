import express, { Request, Response } from 'express';
import { connectDB } from '../db.js';

const router = express.Router();

// Fungsi pembuat huruf & angka acak
function generateRandomCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `P4G-${result}`;
}

// ==========================================
// PENCETAK TIKET (HANYA ADMIN)
// ==========================================
router.post('/invite/generate', async (req: Request, res: Response): Promise<any> => {
  try {
    const user = (req as any).user; // Di-set oleh checkAuth middleware
    
    // Keamanan super ketat: Hanya 'admin' yang bisa lewat
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Akses Ditolak: Hanya Admin yang bisa mencetak tiket undangan.' });
    }

    const db = await connectDB();
    const invitesCollection = db.collection('invite_codes');

    const newCode = {
      code: generateRandomCode(),
      isUsed: false,
      usedBy: null,
      createdBy: user.username,
      createdAt: new Date(),
    };

    await invitesCollection.insertOne(newCode);
    res.status(201).json({ message: 'Tiket berhasil dicetak', code: newCode.code });
  } catch (err) {
    res.status(500).json({ error: 'Gagal membuat tiket di peladen.' });
  }
});

// ==========================================
// MELIHAT SEMUA TIKET (HANYA ADMIN)
// ==========================================
router.get('/invite/list', async (req: Request, res: Response): Promise<any> => {
  try {
    const user = (req as any).user;
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Akses Ditolak.' });
    }

    const db = await connectDB();
    const invitesCollection = db.collection('invite_codes');
    
    // Ambil daftar tiket terbaru
    const tickets = await invitesCollection.find({}).sort({ createdAt: -1 }).toArray();
    res.json({ tickets });
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil daftar tiket.' });
  }
});

export default router;
