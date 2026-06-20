import express from 'express';
import type { Request, Response } from 'express';
import { connectDB } from '../db.js';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';

const router = express.Router();

function generateRandomCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `P4G-${result}`;
}

// Middleware Helper
const checkAdmin = (req: Request, res: Response, next: express.NextFunction): any => {
  const user = (req as any).user;
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Akses Ditolak: Hanya Admin.' });
  }
  next();
};

// ==========================================
// TICKET MANAGEMENT (Fase 1 & 3)
// ==========================================
router.post('/invite/generate', checkAdmin, async (req: Request, res: Response): Promise<any> => {
  try {
    const user = (req as any).user;
    const db = await connectDB();
    const newCode = {
      code: generateRandomCode(),
      isUsed: false,
      usedBy: null,
      createdBy: user.username,
      createdAt: new Date(),
    };
    await db.collection('invite_codes').insertOne(newCode);
    res.status(201).json({ message: 'Tiket berhasil dicetak', code: newCode.code });
  } catch (err) {
    res.status(500).json({ error: 'Gagal membuat tiket.' });
  }
});

router.get('/invite/list', checkAdmin, async (req: Request, res: Response): Promise<any> => {
  try {
    const db = await connectDB();
    const tickets = await db.collection('invite_codes').find({}).sort({ createdAt: -1 }).toArray();
    res.json({ tickets });
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil tiket.' });
  }
});

router.post('/invite/revoke', checkAdmin, async (req: Request, res: Response): Promise<any> => {
  try {
    const { ticketId } = req.body;
    const db = await connectDB();
    await db.collection('invite_codes').updateOne(
      { _id: new ObjectId(ticketId) },
      { $set: { isUsed: true, usedBy: 'REVOKED_BY_ADMIN' } }
    );
    res.json({ message: 'Tiket dihanguskan.' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghanguskan tiket.' });
  }
});

router.delete('/invite/purge', checkAdmin, async (req: Request, res: Response): Promise<any> => {
  try {
    const db = await connectDB();
    const result = await db.collection('invite_codes').deleteMany({ isUsed: true });
    res.json({ message: `${result.deletedCount} tiket usang dibersihkan.` });
  } catch (err) {
    res.status(500).json({ error: 'Gagal membersihkan tiket.' });
  }
});

// ==========================================
// ANALYTICS DASHBOARD (Fase 2)
// ==========================================
router.get('/metrics', checkAdmin, async (req: Request, res: Response): Promise<any> => {
  try {
    const db = await connectDB();
    const totalUsers = await db.collection('users').countDocuments();
    const totalTickets = await db.collection('invite_codes').countDocuments();
    const activeTickets = await db.collection('invite_codes').countDocuments({ isUsed: false });
    const usedTickets = await db.collection('invite_codes').countDocuments({ isUsed: true });
    
    // Rata-rata progress
    const allProgress = await db.collection('user_progress').find({}).toArray();
    let avgDays = 0;
    if (allProgress.length > 0) {
      const sum = allProgress.reduce((acc, curr) => acc + (curr.checkedDays?.length || 0), 0);
      avgDays = Math.round(sum / allProgress.length);
    }

    res.json({
      totalUsers, totalTickets, activeTickets, usedTickets, avgDays
    });
  } catch (err) {
    res.status(500).json({ error: 'Gagal memuat metrik.' });
  }
});

// ==========================================
// USER MANAGEMENT (Fase 1)
// ==========================================
router.get('/users', checkAdmin, async (req: Request, res: Response): Promise<any> => {
  try {
    const db = await connectDB();
    // Exclude password field
    const users = await db.collection('users').find({}, { projection: { password: 0 } }).sort({ createdAt: -1 }).toArray();
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: 'Gagal memuat pengguna.' });
  }
});

router.post('/users/suspend', checkAdmin, async (req: Request, res: Response): Promise<any> => {
  try {
    const { targetUserId, newStatus } = req.body;
    const db = await connectDB();
    
    // Pencegahan Master Admin suspend dirinya sendiri
    const user = await db.collection('users').findOne({ _id: new ObjectId(targetUserId) });
    if (user?.role === 'admin' && user?.username === 'Yuu') {
      return res.status(403).json({ error: 'Akses Ditolak: Tidak bisa memodifikasi Master Admin.' });
    }

    await db.collection('users').updateOne(
      { _id: new ObjectId(targetUserId) },
      { $set: { status: newStatus } }
    );
    res.json({ message: `Status pengguna diubah menjadi ${newStatus}.` });
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengubah status.' });
  }
});

router.post('/users/reset-password', checkAdmin, async (req: Request, res: Response): Promise<any> => {
  try {
    const { targetUserId, newPassword } = req.body;
    const db = await connectDB();
    
    const user = await db.collection('users').findOne({ _id: new ObjectId(targetUserId) });
    if (user?.role === 'admin' && user?.username === 'Yuu') {
      return res.status(403).json({ error: 'Akses Ditolak: Tidak bisa mereset sandi Master Admin dari panel.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await db.collection('users').updateOne(
      { _id: new ObjectId(targetUserId) },
      { $set: { password: hashedPassword } }
    );
    res.json({ message: 'Kata sandi berhasil direset.' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal mereset kata sandi.' });
  }
});

export default router;
