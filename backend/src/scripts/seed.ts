import fs from 'fs';
import path from 'path';
import { connectDB, getClient } from '../db.js';

// Fungsi untuk membaca JSON dan mem-parsingnya
function readJsonFile(filePath: string) {
  try {
    const rawData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error(`Error reading or parsing file: ${filePath}`);
    console.error(error);
    return null;
  }
}

async function runSeed() {
  try {
    console.log('Connecting to MongoDB...');
    const db = await connectDB();
    console.log('Connected!');

    // Tentukan path ke folder data (relatif terhadap direktori root backend)
    // Karena kita menjalankan dari backend (menggunakan npm run seed), process.cwd() adalah D:\Coding\P4G Walkthrough\backend
    const dataDir = path.resolve(process.cwd(), '../data');

    // Daftar collections dan file JSON yang bersesuaian
    const collectionsToSeed = [
      { name: 'activities', file: 'activities.json' },
      { name: 'dungeons', file: 'dungeons.json' },
      { name: 'exams', file: 'exams.json' },
      { name: 'social_links', file: 'social_links.json' },
      { name: 'walkthrough', file: 'walkthrough.json' },
      { name: 'tips', file: 'tips.json' },
      { name: 'introduction', file: 'introduction.json' }
    ];

    for (const item of collectionsToSeed) {
      const filePath = path.join(dataDir, item.file);
      
      // Cek apakah file ada
      if (fs.existsSync(filePath)) {
        console.log(`\nProcessing ${item.file}...`);
        const data = readJsonFile(filePath);

        if (data) {
          const collection = db.collection(item.name);
          
          // Hapus data lama agar tidak duplikat (optional, tapi disarankan untuk seeding)
          await collection.deleteMany({});
          console.log(`- Cleared old data in collection: ${item.name}`);

          // Jika data adalah array (seperti activities, dungeons, social_links)
          if (Array.isArray(data) && data.length > 0) {
            const result = await collection.insertMany(data);
            console.log(`- Successfully inserted ${result.insertedCount} documents into ${item.name}`);
          } 
          // Jika data berupa Object tunggal (misal walkthrough.json atau tips.json yang strukturnya Object)
          else if (typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length > 0) {
            const result = await collection.insertOne(data);
            console.log(`- Successfully inserted 1 document into ${item.name}`);
          } else {
             console.log(`- Data in ${item.file} is empty or unsupported format.`);
          }
        }
      } else {
        console.warn(`[WARNING] File not found: ${filePath}`);
      }
    }

    console.log('\n✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Failed to seed database:', error);
  } finally {
    const client = getClient();
    if (client) {
      await client.close();
      console.log('MongoDB connection closed.');
    }
  }
}

// Jalankan fungsi
runSeed();
