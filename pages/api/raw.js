import { connectToDatabase } from "../../lib/mongodb.js";

export default async (req, res) => {
  const { db } = await connectToDatabase();

  const raw = await db
    .collection("raw")
    .find({})
    // .sort({ metacritic: -1 })
    // .limit(20)
    .toArray();

  res.json(raw);
};