import fs from 'fs/promises';
import path from 'path';
import { DatabaseSchema } from '../types.js';
import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_DB_PATH = path.resolve('./database.json');
const DB_FILE = path.resolve(process.env.DB_FILE || DEFAULT_DB_PATH);

let dbData: DatabaseSchema = {
  books: [],
  purchases: [],
  users: [],
  favorites: [],
  audit_logs: []
};

export const connectDB = async (): Promise<void> => {
  try {
    const fileContent = await fs.readFile(DB_FILE, 'utf-8');
    dbData = JSON.parse(fileContent);
    if (!dbData.audit_logs) dbData.audit_logs = [];
    console.log(`✅ Connected to shared database at: ${DB_FILE}`);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
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
