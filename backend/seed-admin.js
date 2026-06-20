import bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("MONGODB_URI is missing");
  process.exit(1);
}

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db('p4g_walkthrough');
    
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('W256256ahyu', salt);
    
    await db.collection('users').updateOne(
      { username: 'Yuu' },
      { $set: { username: 'Yuu', passwordHash: hash, role: 'admin', createdAt: new Date() } },
      { upsert: true }
    );
    
    console.log('Master Admin Account (Yuu) has been successfully seeded!');
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
