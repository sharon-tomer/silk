import { connectToDatabase } from "../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { db } = await connectToDatabase();

    const raw = await db
      .collection("raw")
      .find({})
      .toArray()
  
    res.status(200).json(raw);
  } catch(e) {
    res.status(500)
  }
}