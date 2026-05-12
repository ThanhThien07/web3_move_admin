import { Request, Response } from 'express';
import { getDB, saveDB } from '../db.js';
import { ChatSession, Message } from '../types.js';

export const getChats = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDB();
    res.json(db.chats || []);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
};

export const getChatByUser = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  try {
    const db = getDB();
    const chat = (db.chats || []).find(c => c.userId === userId);
    res.json(chat || { messages: [] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch chat' });
  }
};

export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  const { userId, userName, content, isAdmin } = req.body;
  try {
    const db = getDB();
    if (!db.chats) db.chats = [];

    let session = db.chats.find(c => c.userId === userId);

    if (!session) {
      session = {
        id: `chat-${userId}`,
        userId,
        userName: userName || userId,
        lastMessage: content,
        timestamp: new Date().toISOString(),
        messages: []
      };
      db.chats.push(session);
    }

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: isAdmin ? 'Admin' : userName || userId,
      content,
      timestamp: new Date().toISOString(),
      isAdmin: !!isAdmin
    };

    session.messages.push(newMessage);
    session.lastMessage = content;
    session.timestamp = new Date().toISOString();

    saveDB(db);
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};
