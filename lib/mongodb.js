import { MongoClient, GridFSBucket } from 'mongodb';

const client = new MongoClient("mongodb+srv://maksimkryglyk:Prometey888!@meseges.v08jrmf.mongodb.net/?retryWrites=true&w=majority&appName=meseges");

let cachedDb = null;

export async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  await client.connect();
  const db = client.db();
  cachedDb = db;

  return db;
}

export async function getGridFSBucket() {
  const db = await connectToDatabase();
  return new GridFSBucket(db);
}
