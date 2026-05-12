import { Request, Response } from 'express';

// Simple hardcoded admin for demonstration
// In production, this should use hashed passwords and a database
const ADMIN_USER = {
  username: 'admin',
  password: 'password123' 
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
    res.json({
      success: true,
      user: {
        username: ADMIN_USER.username,
        role: 'ADMIN'
      },
      token: 'mock-jwt-token-for-admin'
    });
  } else {
    res.status(401).json({ success: false, error: 'Invalid credentials' });
  }
};
