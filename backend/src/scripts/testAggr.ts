import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

async function check() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('No URI');
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('p4g_walkthrough');

  const users = await db.collection('users').aggregate([
    {
      $lookup: {
        from: 'user_progress',
        localField: 'username',
        foreignField: 'userId',
        as: 'progressData'
      }
    },
    {
      $addFields: {
        progressDays: {
          $cond: {
            if: { $gt: [{ $size: "$progressData" }, 0] },
            then: { $size: { $objectToArray: { $ifNull: [{ $arrayElemAt: ["$progressData.completedDays", 0] }, {}] } } },
            else: 0
          }
        },
        lastMilestone: {
          $cond: {
            if: { $gt: [{ $size: "$progressData" }, 0] },
            then: {
              $let: {
                vars: {
                  daysArray: { $objectToArray: { $ifNull: [{ $arrayElemAt: ["$progressData.completedDays", 0] }, {}] } }
                },
                in: { $arrayElemAt: ["$$daysArray.k", -1] }
              }
            },
            else: null
          }
        }
      }
    },
    {
      $project: { username: 1, progressDays: 1, lastMilestone: 1 }
    }
  ]).toArray();

  console.log("Aggregated Users:");
  console.dir(users, { depth: null });
  
  await client.close();
}

check().catch(console.error);
