import fs from 'fs/promises';
import path from 'path';
import { DatabaseSchema } from '../types';
import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_DB_PATH = path.resolve('./database.json');
const DB_FILE = path.resolve(process.env.DB_FILE || DEFAULT_DB_PATH);

let dbData: DatabaseSchema = {
  books: [
    {
      id: 'book-1',
      title: 'Sui Move Guide (Admin)',
      author: 'Admin',
      cover_url: 'https://images.unsplash.com/photo-1555661530-68c8e98db4e6?auto=format&fit=crop&w=400&q=80',
      price_mist: '100000000',
      access_url: 'https://docs.sui.io/'
    }
  ],
  purchases: [],
  users: [],
  favorites: [],
  audit_logs: []
};

export const connectDB = async (): Promise<void> => {
  try {
    const fileContent = await fs.readFile(DB_FILE, 'utf-8');
    dbData = JSON.parse(fileContent);
    
    // Initialize audit_logs if missing
    if (!dbData.audit_logs) {
      dbData.audit_logs = [];
    }
    
    console.log(`✅ Connected to shared database at: ${DB_FILE}`);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      console.warn(`⚠️ Database file not found at ${DB_FILE}. Creating a local fallback.`);
      await saveDB();
    } else {
      console.error('❌ Failed to read JSON database:', error);
      process.exit(1);
    }
  }
};

export const getDB = (): DatabaseSchema => dbData;

export const saveDB = async (): Promise<void> => {
  await fs.writeFile(DB_FILE, JSON.stringify(dbData, null, 2), 'utf-8');
};
