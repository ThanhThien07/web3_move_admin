import { Request, Response } from 'express';
import { getDB, saveDB } from '../config/db.js';

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  
  try {
    const db = getDB();
    const admin = db.admins?.find((a: any) => a.username === username && a.password === password);

    if (admin) {
      res.json({
        success: true,
        user: { username: admin.username, role: 'ADMIN' },
        token: 'admin-session-' + Date.now()
      });
    } else {
      res.status(401).json({ 
        success: false, 
        error: 'Sai tên đăng nhập hoặc mật khẩu' 
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Lỗi server nội bộ' });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  try {
    const db = getDB();
    if (!db.admins) db.admins = [];
    
    if (db.admins.find((a: any) => a.username === username)) {
      res.status(400).json({ success: false, error: 'Tài khoản đã tồn tại' });
      return;
    }

    const newAdmin = { username, password };
    db.admins.push(newAdmin);
    await saveDB();

    res.json({ success: true, message: 'Đăng ký thành công' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Lỗi đăng ký' });
  }
};
