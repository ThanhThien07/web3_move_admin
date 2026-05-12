import { Request, Response } from 'express';
import { getDB, saveDB } from '../config/db';
import { BookItem, AuditLog } from '../types';

const logAction = (action: AuditLog['action'], bookTitle: string) => {
  const db = getDB();
  const newLog: AuditLog = {
    id: `log-${Date.now()}`,
    action,
    book_title: bookTitle,
    timestamp: new Date().toISOString()
  };
  if (!db.audit_logs) db.audit_logs = [];
  db.audit_logs.unshift(newLog); // Newest first
};

export const getBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDB();
    res.json({ items: db.books });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
};

export const addBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, author, cover_url, price_mist, owner_wallet } = req.body;
    const db = getDB();
    
    const newBook: BookItem = {
      id: `book-${Date.now()}`,
      title,
      author,
      cover_url,
      price_mist,
      owner_wallet: owner_wallet || ''
    };

    db.books.push(newBook);
    logAction('PUBLISH', title);
    await saveDB();

    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add book' });
  }
};

export const updateBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const db = getDB();
    
    const index = db.books.findIndex(b => b.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Book not found' });
      return;
    }

    db.books[index] = { ...db.books[index], ...req.body };
    logAction('UPDATE', db.books[index].title);
    await saveDB();

    res.json(db.books[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update book' });
  }
};

export const deleteBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const db = getDB();
    
    const index = db.books.findIndex(b => b.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Book not found' });
      return;
    }

    const bookTitle = db.books[index].title;
    db.books.splice(index, 1);
    logAction('UNPUBLISH', bookTitle);
    await saveDB();
    
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete book' });
  }
};

export const getAuditLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDB();
    res.json(db.audit_logs || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
};
