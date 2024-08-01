// pages/api/trains.js
import clientPromise from '../../lib/mongodb';

export default async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db('test'); // Replace with your database name

    const trains = await db.collection('trains').find({}).toArray(); // Replace with your collection name

    res.json(trains);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
