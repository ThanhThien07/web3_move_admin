import { Request, Response } from 'express';
import { getDB } from '../config/db';

export const getSales = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDB();
    res.json(db.purchases || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sales history' });
  }
};

export const getStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDB();
    const totalSales = (db.purchases || []).reduce((acc, p) => acc + BigInt(p.price_mist || 0), BigInt(0));
    
    res.json({
      totalBooks: db.books.length,
      totalPurchases: (db.purchases || []).length,
      totalRevenueMist: totalSales.toString(),
      recentActivity: (db.audit_logs || []).slice(0, 5)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};
