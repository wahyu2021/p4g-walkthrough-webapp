import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import authRouter from './routes/auth.js';
import adminRouter from './routes/admin.js';
import { connectDB } from './db.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Konfigurasi CORS - hanya izinkan origin dari env variable
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173'];

// Security Middlewares
app.use(helmet());
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// ==========================================
// Middleware untuk mengecek koneksi DB
// ==========================================
const checkDB = async (req: Request, res: Response, next: express.NextFunction) => {
  try {
    req.db = await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Database connection failed' });
  }
};

// ==========================================
// Middleware Keamanan (Write Protection - JWT)
// ==========================================
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-persona-4-golden';

const checkAuth = (req: Request, res: Response, next: express.NextFunction): any => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Akses Ditolak: Token keamanan tidak ditemukan' });
  }

  const token = authHeader.split(' ')[1] as string;
  try {
    const decoded = jwt.verify(token, JWT_SECRET as string);
    (req as any).user = decoded; // Menyimpan info user di request
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Akses Ditolak: Tiket sesi tidak valid atau sudah kadaluarsa' });
  }
};

// ==========================================
// Security Rate Limiter (Brute Force Protection)
// ==========================================
const progressLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 menit
  max: 20, // Maksimal 20 request per IP dalam 5 menit
  message: { status: 'error', error: 'Terlalu banyak permintaan simpan progress, coba lagi dalam 5 menit.' },
  standardHeaders: true, 
  legacyHeaders: false,
});

// Deklarasi custom type untuk menambahkan 'db' ke dalam Request object Express
declare global {
  namespace Express {
    interface Request {
      db?: any;
    }
  }
}

// ==========================================
// Endpoints Routing
// ==========================================

// Rute Autentikasi (Pendaftaran & Tiket Masuk)
app.use('/api/auth', authRouter);

// Rute Rahasia Panel Admin (Hanya untuk Admin, Dilindungi JWT)
app.use('/api/admin', checkAuth, adminRouter);

// Endpoint API Data
app.get('/api/health', checkDB, (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running and connected to MongoDB' });
});

// ==========================================
// DATA ROUTES (GET Only - Read Only Data)
// ==========================================

app.get('/api/dungeons', checkDB, async (req, res) => {
  try {
    const data = await req.db.collection('dungeons').find({}).toArray();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dungeons' });
  }
});

app.get('/api/social_links', checkDB, async (req, res) => {
  try {
    const data = await req.db.collection('social_links').find({}).toArray();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch social links' });
  }
});

app.get('/api/activities', checkDB, async (req, res) => {
  try {
    // Karena saat ini bentuknya satu dokumen object besar, kita ambil dokumen pertamanya
    const data = await req.db.collection('activities').findOne({});
    // Hilangkan '_id' bawaan mongo sebelum dikirim jika diperlukan, tapi tidak masalah dikirim
    res.json(data || {});
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

app.get('/api/walkthrough', checkDB, async (req, res) => {
  try {
    // Ambil semua data
    const data = await req.db.collection('walkthrough').find({}).toArray();
    
    // Urutkan secara manual: April (4) sampai Maret (3 tahun depannya)
    // Urutan bulan P4G: 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3
    const sortedData = data.sort((a: any, b: any) => {
      const getOrder = (num: number | undefined) => {
        if (num === undefined) return 99; // Untuk data non-bulan seperti ng_plus
        return num >= 4 ? num : num + 12; // April(4) tetap 4, Januari(1) jadi 13
      };
      return getOrder(a.month_num) - getOrder(b.month_num);
    });

    res.json(sortedData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch walkthrough' });
  }
});

// ==========================================
// SYSTEM PUBLIC CONFIG
// ==========================================
app.get('/api/announcement', checkDB, async (req, res) => {
  try {
    const data = await req.db.collection('system_config').findOne({ configId: 'global_announcement' });
    res.json(data || { isActive: false });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch announcement' });
  }
});

// ==========================================
// USER PROGRESS ROUTES
// ==========================================

// Get Progress User
app.get('/api/progress/:userId', checkDB, async (req, res) => {
  try {
    const { userId } = req.params;
    const progress = await req.db.collection('user_progress').findOne({ userId });
    
    if (!progress) {
      // Jika user belum punya progress, kembalikan object kosong atau struktur default
      return res.json({ userId, checkedDays: [], completedQuests: [], readBooks: [] });
    }
    
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// Update/Save Progress User (Terlindungi Password & Rate Limiter)
app.post('/api/progress/:userId', progressLimiter, checkDB, checkAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body; // Data progress (checkedDays, dll)

    // Gunakan upsert: true (jika data belum ada, buat baru. Jika ada, update/timpa).
    const result = await req.db.collection('user_progress').updateOne(
      { userId },
      { $set: { ...updateData, updatedAt: new Date() } },
      { upsert: true }
    );

    res.json({ success: true, message: 'Progress saved successfully', result });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save progress' });
  }
});

// Jalankan server di semua environment (VPS deployment)
app.listen(port, () => {
  console.log(`[${process.env.NODE_ENV ?? 'development'}] Server is running on port ${port}`);
});
