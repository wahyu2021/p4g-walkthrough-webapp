import express from 'express';
import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB } from '../db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-persona-4-golden';

// ==========================================
// REGISTER ENDPOINT
// ==========================================
router.post('/register', async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, password, inviteCode } = req.body;
    if (!username || !password || !inviteCode) {
      return res.status(400).json({ error: 'Nama, sandi, dan tiket undangan wajib diisi.' });
    }

    const db = await connectDB();
    const usersCollection = db.collection('users');
    const invitesCollection = db.collection('invite_codes');

    // Penjaga Gerbang (Gatekeeper): Cek Keaslian Tiket
    const ticket = await invitesCollection.findOne({ code: inviteCode.toUpperCase() });
    if (!ticket) {
      return res.status(403).json({ error: 'Akses Ditolak: Tiket undangan palsu atau tidak dikenali.' });
    }
    if (ticket.isUsed) {
      return res.status(403).json({ error: 'Akses Ditolak: Tiket ini sudah hangus (sudah dipakai orang lain).' });
    }

    // Sanitasi spasi ganda dan kapitalisasi berlebih pada pendaftaran awal
    const cleanUsername = username.trim();
    if (cleanUsername.length < 3 || cleanUsername.length > 20) {
      return res.status(400).json({ error: 'Nama karakter harus 3 hingga 20 huruf.' });
    }

    // Cek ketersediaan username secara kebal huruf besar/kecil (Case-Insensitive)
    const existingUser = await usersCollection.findOne({ username: { $regex: new RegExp(`^${cleanUsername}$`, 'i') } });
    if (existingUser) {
      return res.status(400).json({ error: 'Karakter dengan nama ini sudah terbangun, silakan rancang nama/identitas yang berbeda.' });
    }

    // Mengamankan password dengan Bcrypt
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Menyimpan data pengguna
    const newUser = {
      username: cleanUsername,
      passwordHash,
      role: 'user', // Default sebagai user biasa
      createdAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);
    
    // Hanguskan tiket agar tidak bisa didaur ulang
    await invitesCollection.updateOne(
      { _id: ticket._id },
      { $set: { isUsed: true, usedBy: cleanUsername } }
    );

    res.status(201).json({ message: 'Registrasi sukses', userId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: 'Terjadi kesalahan sistem.' });
  }
});

// ==========================================
// LOGIN ENDPOINT
// ==========================================
router.post('/login', async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, password } = req.body;
    
    const db = await connectDB();
    const usersCollection = db.collection('users');
    // Sanitasi spasi dan cari berdasarkan regex kebal huruf besar/kecil (Case-Insensitive)
    const cleanUsername = username.trim();
    const user = await usersCollection.findOne({ username: { $regex: new RegExp(`^${cleanUsername}$`, 'i') } });
    
    if (!user) {
      return res.status(401).json({ error: 'Akses Ditolak: Nama atau sandi salah.' });
    }

    // Pencocokan sandi
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Akses Ditolak: Nama atau sandi salah.' });
    }

    // Menciptakan Tiket Masuk (JWT) yang berlaku 30 hari
    const payload = {
      id: user._id.toString(),
      username: user.username,
      role: user.role,
    };

    const token = jwt.sign(payload, JWT_SECRET as string, { expiresIn: '30d' });

    // Rekam Jejak Pengunjung (Audit Keamanan)
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown';
    const userAgent = req.headers['user-agent'] || 'Unknown Browser';

    await usersCollection.updateOne(
      { _id: user._id },
      { 
        $set: { 
          lastLoginAt: new Date(),
          lastIp: clientIp,
          lastUserAgent: userAgent
        } 
      }
    );

    res.json({ message: 'Login sukses', token, user: payload });
  } catch (err) {
    res.status(500).json({ error: 'Terjadi kesalahan saat masuk.' });
  }
});

export default router;
