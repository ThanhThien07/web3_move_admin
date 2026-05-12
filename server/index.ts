import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;
const DB_FILE = path.resolve(process.env.DB_FILE || './db.json');

app.use(cors());
app.use(bodyParser.json());

interface Book {
  id: string;
  title: string;
  author: string;
  cover_url: string;
  price_mist: string;
  access_url: string;
}

async function getDB(): Promise<{ books: Book[] }> {
  try {
    const data = await fs.readFile(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { books: [] };
  }
}

async function saveDB(data: { books: Book[] }) {
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Initial DB check
async function initDB() {
  try {
    await fs.access(DB_FILE);
  } catch {
    await saveDB({
      books: [
        {
          id: "book-1",
          title: "Sui Move Guide (Admin)",
          author: "Admin",
          cover_url: "https://images.unsplash.com/photo-1555661530-68c8e98db4e6?auto=format&fit=crop&w=400&q=80",
          price_mist: "100000000",
          access_url: "https://docs.sui.io/"
        }
      ]
    });
  }
}

app.get('/api/books', async (req, res) => {
  const db = await getDB();
  res.json({ items: db.books });
});

app.post('/api/books', async (req, res) => {
  const db = await getDB();
  const newBook = { ...req.body, id: `book-${Date.now()}` };
  db.books.push(newBook);
  await saveDB(db);
  res.status(201).json(newBook);
});

app.put('/api/books/:id', async (req, res) => {
  const db = await getDB();
  const index = db.books.findIndex(b => b.id === req.params.id);
  if (index !== -1) {
    db.books[index] = { ...db.books[index], ...req.body };
    await saveDB(db);
    res.json(db.books[index]);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

app.delete('/api/books/:id', async (req, res) => {
  const db = await getDB();
  db.books = db.books.filter(b => b.id !== req.params.id);
  await saveDB(db);
  res.json({ success: true });
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Admin Backend running at http://localhost:${PORT}`);
  });
});
