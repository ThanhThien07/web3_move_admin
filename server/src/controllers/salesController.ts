import { Request, Response } from 'express';
import { getDB } from '../config/db.js';

export const getSales = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDB();
    res.json(db.purchases || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sales' });
  }
};

export const getStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDB();
    const totalBooks = db.books?.length || 0;
    const totalPurchases = db.purchases?.length || 0;
    
    const totalRevenueMist = (db.purchases || []).reduce(
      (sum: bigint, sale: any) => sum + BigInt(sale.price_mist || 0), 
      BigInt(0)
    ).toString();

    res.json({
      totalBooks,
      totalPurchases,
      totalRevenueMist,
      recentActivity: (db.audit_logs || []).slice(0, 5)
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};
