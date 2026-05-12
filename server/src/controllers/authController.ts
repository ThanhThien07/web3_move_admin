import { Request, Response } from 'express';
import { getDB, saveDB } from '../config/db.js';

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  const db = getDB();
  
  if (!db.admins) db.admins = [];
  
  const admin = db.admins.find(a => a.username === username && a.password === password);

  if (admin) {
    res.json({
      success: true,
      user: {
        username: admin.username,
        role: 'ADMIN'
      },
      token: `mock-jwt-${admin.username}`
    });
  } else {
    // Fallback for default admin if no admins exist yet
    if (username === 'admin' && password === 'password123' && db.admins.length === 0) {
      res.json({
        success: true,
        user: { username: 'admin', role: 'ADMIN' },
        token: 'mock-jwt-admin'
      });
      return;
    }
    res.status(401).json({ success: false, error: 'Invalid credentials' });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    const db = getDB();
    
    if (!db.admins) db.admins = [];
    
    if (db.admins.find(a => a.username === username)) {
      res.status(400).json({ success: false, error: 'Admin already exists' });
      return;
    }

    const newAdmin = { username, password };
    db.admins.push(newAdmin);
    await saveDB();

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to register admin' });
  }
};
