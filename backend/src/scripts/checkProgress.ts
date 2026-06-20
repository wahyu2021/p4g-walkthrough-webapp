import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

async function check() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('No URI');
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('p4g_walkthrough');
  const progressList = await db.collection('user_progress').find({}).toArray();
  console.log("Total user progress documents:", progressList.length);
  if (progressList.length > 0) {
    console.log("Sample user progress:");
    console.dir(progressList[0], { depth: null });
  }
  
  const users = await db.collection('users').find({}).toArray();
  console.log("Users in DB:", users.map(u => u.username));
  
  await client.close();
}

check().catch(console.error);
