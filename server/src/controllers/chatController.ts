import { Request, Response } from 'express';
import { getDB, saveDB } from '../config/db';

export const getChats = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDB();
    // Chuyển đổi cấu hình chat từ DB sang định dạng Frontend mong đợi
    const sessions = (db.chat_sessions || []).map((s: any) => ({
      id: s.id,
      customerName: s.customerName || 'Khách hàng',
      lastMessage: s.messages?.[s.messages.length - 1]?.content || '',
      timestamp: s.timestamp || new Date().toISOString()
    }));
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
};

export const getChatByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.params;
    const db = getDB();
    const session = (db.chat_sessions || []).find((s: any) => s.id === sessionId);
    res.json(session ? session.messages : []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sessionId, content, isAdmin } = req.body;
    const db = getDB();
    if (!db.chat_sessions) db.chat_sessions = [];

    let session = db.chat_sessions.find((s: any) => s.id === sessionId);
    
    const newMessage = {
      id: `msg-${Date.now()}`,
      content,
      isAdmin: isAdmin || false,
      timestamp: new Date().toISOString()
    };

    if (session) {
      session.messages.push(newMessage);
    } else {
      session = {
        id: sessionId || `session-${Date.now()}`,
        customerName: 'Khách hàng mới',
        messages: [newMessage],
        timestamp: new Date().toISOString()
      };
      db.chat_sessions.push(session);
    }

    await saveDB();
    res.json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};
