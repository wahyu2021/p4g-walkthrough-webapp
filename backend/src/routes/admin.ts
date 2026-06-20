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
    
    // Rata-rata progress & Distribusi Chart
    const allProgress = await db.collection('user_progress').find({}).toArray();
    let avgDays = 0;
    
    const distribution = {
      '0-10 Hari': 0,
      '11-50 Hari': 0,
      '51-150 Hari': 0,
      '151-300 Hari': 0,
      'Tamat (>300)': 0
    };

    if (allProgress.length > 0) {
      const sum = allProgress.reduce((acc, curr) => {
        const days = curr.checkedDays?.length || 0;
        
        if (days <= 10) distribution['0-10 Hari']++;
        else if (days <= 50) distribution['11-50 Hari']++;
        else if (days <= 150) distribution['51-150 Hari']++;
        else if (days <= 300) distribution['151-300 Hari']++;
        else distribution['Tamat (>300)']++;

        return acc + days;
      }, 0);
      avgDays = Math.round(sum / allProgress.length);
    }

    const chartData = Object.keys(distribution).map(key => ({
      name: key,
      Pemain: distribution[key as keyof typeof distribution]
    }));

    // Tambahan metrik baru
    const suspendedUsers = await db.collection('users').countDocuments({ status: 'suspended' });
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const activeToday = await db.collection('users').countDocuments({ lastLoginAt: { $gte: oneDayAgo } });

    res.json({
      totalUsers, totalTickets, activeTickets, usedTickets, avgDays, suspendedUsers, activeToday, chartData
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
    // Menggunakan agregasi untuk menggabungkan data progres
    const users = await db.collection('users').aggregate([
      {
        $lookup: {
          from: 'user_progress',
          localField: '_id',
          foreignField: 'userId',
          as: 'progressData'
        }
      },
      {
        $addFields: {
          progressDays: {
            $cond: {
              if: { $gt: [{ $size: "$progressData" }, 0] },
              then: { $size: { $ifNull: [{ $arrayElemAt: ["$progressData.checkedDays", 0] }, []] } },
              else: 0
            }
          }
        }
      },
      {
        $project: {
          password: 0,
          progressData: 0
        }
      },
      { $sort: { createdAt: -1 } }
    ]).toArray();
    
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

// ==========================================
// GLOBAL ANNOUNCEMENTS (Fase 5)
// ==========================================
router.post('/announcement', checkAdmin, async (req: Request, res: Response): Promise<any> => {
  try {
    const { message, isActive, type } = req.body;
    const db = await connectDB();
    await db.collection('system_config').updateOne(
      { configId: 'global_announcement' },
      { $set: { message, isActive, type, updatedAt: new Date() } },
      { upsert: true }
    );
    res.json({ message: 'Pengumuman berhasil disiarkan.' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menyiarkan pengumuman.' });
  }
});

// ==========================================
// LEADERBOARD (Fase 6)
// ==========================================
router.get('/leaderboard', checkAdmin, async (req: Request, res: Response): Promise<any> => {
  try {
    const db = await connectDB();
    const progressList = await db.collection('user_progress').find({}).toArray();
    
    // Urutkan berdasarkan jumlah hari tercentang
    progressList.sort((a, b) => (b.checkedDays?.length || 0) - (a.checkedDays?.length || 0));

    // Format data peringkat
    const leaderboard = await Promise.all(progressList.map(async (p, idx) => {
      // Hanya tampilkan top 100 agar query tidak berat
      if (idx > 100) return null;
      let user = null;
      try { user = await db.collection('users').findOne({ _id: new ObjectId(p.userId) }); } catch(e){}
      return {
        rank: idx + 1,
        username: user?.username || 'Unknown (Deleted)',
        daysCompleted: p.checkedDays?.length || 0
      };
    }));

    res.json({ leaderboard: leaderboard.filter(Boolean) });
  } catch (err) {
    res.status(500).json({ error: 'Gagal memuat papan peringkat.' });
  }
});

export default router;
