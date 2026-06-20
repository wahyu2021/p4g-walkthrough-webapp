import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB } from '../db.js';
import type { RegisterInput, LoginInput } from '../schemas/auth.schema.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-persona-4-golden';

export class AuthService {
  static async registerUser(data: RegisterInput) {
    const { username, password, inviteCode } = data;
    const db = await connectDB();
    const usersCollection = db.collection('users');
    const invitesCollection = db.collection('invite_codes');

    // Cek Tiket
    const ticket = await invitesCollection.findOne({ code: inviteCode.toUpperCase() });
    if (!ticket) {
      throw new Error('403:Akses Ditolak: Tiket undangan palsu atau tidak dikenali.');
    }
    if (ticket.isUsed) {
      throw new Error('403:Akses Ditolak: Tiket ini sudah hangus (sudah dipakai orang lain).');
    }

    // Cek duplikasi username (Case-Insensitive)
    const existingUser = await usersCollection.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
    if (existingUser) {
      throw new Error('400:Karakter dengan nama ini sudah terbangun, silakan rancang nama/identitas yang berbeda.');
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = {
      username,
      passwordHash,
      role: 'user',
      createdAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);

    // Hanguskan tiket
    await invitesCollection.updateOne(
      { _id: ticket._id },
      { $set: { isUsed: true, usedBy: username } }
    );

    return result.insertedId;
  }

  static async loginUser(data: LoginInput) {
    const { username, password } = data;
    const db = await connectDB();
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
    if (!user) {
      throw new Error('401:Akses Ditolak: Nama atau sandi salah.');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new Error('401:Akses Ditolak: Nama atau sandi salah.');
    }

    const payload = {
      id: user._id.toString(),
      username: user.username,
      role: user.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
    return { token, user: { id: payload.id, username: payload.username, role: payload.role } };
  }
}
