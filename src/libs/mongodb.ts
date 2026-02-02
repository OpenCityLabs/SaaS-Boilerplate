import type { Db } from 'mongodb';
import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MONGODB_URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DATABASE || 'opencitylabs';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

type MongoConnection = {
  client: MongoClient;
  db: Db;
};

/**
 * MongoDB connection singleton
 * Reuses connection across hot reloads in development
 * Creates new connection in production
 */
export async function connectToDatabase(): Promise<MongoConnection> {
  // Return cached connection if available
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // Create new connection
  const client = await MongoClient.connect(uri, {
    maxPoolSize: 10,
    minPoolSize: 5,
    serverSelectionTimeoutMS: 5000,
  });

  const db = client.db(dbName);

  // Cache the connection
  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

/**
 * Get MongoDB database instance
 * Automatically handles connection
 */
export async function getDatabase(): Promise<Db> {
  const { db } = await connectToDatabase();
  return db;
}

/**
 * Close MongoDB connection
 * Useful for cleanup in serverless environments
 */
export async function closeConnection(): Promise<void> {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
  }
}
