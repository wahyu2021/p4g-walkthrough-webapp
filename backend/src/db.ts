import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is missing in the environment variables.");
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let isConnected = false;

export async function connectDB() {
  if (!isConnected) {
    try {
      await client.connect();
      await client.db().command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
      isConnected = true;
    } catch (error) {
      console.error("Failed to connect to MongoDB", error);
      throw error;
    }
  }
  return client.db("p4g_walkthrough"); // You can rename the database name here if needed
}

export function getClient() {
  return client;
}
