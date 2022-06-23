import * as mongoDB from "mongodb";

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB

const options = {}

let cachedClient: mongoDB.MongoClient | null = null
let cachedDb: mongoDB.Db | null = null

export async function connectToDatabase(): Promise<{ client: mongoDB.MongoClient, db: mongoDB.Db }> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  if (!uri) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    )
  }
  
  if (!dbName) {
    throw new Error(
      'Please define the MONGODB_DB environment variable inside .env.local'
    )
  }

  const client = new mongoDB.MongoClient(uri, options);
  await client.connect();
  const db = await client.db(dbName)

  cachedClient = client
  cachedDb = db

  return { client, db }
}