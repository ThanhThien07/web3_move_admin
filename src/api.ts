const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

export interface Book {
  id: string;
  title: string;
  author: string;
  cover_url: string;
  price_mist: string;
  owner_wallet: string;
}

export interface SalesRecord {
  id: string;
  book_id: string;
  username: string;
  wallet_address: string;
  timestamp: string;
  price_mist: string;
  digest: string;
}

export interface AuditLog {
  id: string;
  action: 'PUBLISH' | 'UNPUBLISH' | 'UPDATE';
  book_title: string;
  timestamp: string;
}

export interface Stats {
  totalBooks: number;
  totalPurchases: number;
  totalRevenueMist: string;
  recentActivity: AuditLog[];
}

export interface ChatSession {
  id: string;
  customerName: string;
  lastMessage: string;
  timestamp: string;
}

export interface Message {
  id: string;
  sessionId: string;
  content: string;
  isAdmin: boolean;
  timestamp: string;
}

export const fetchBooks = async (): Promise<Book[]> => {
  const res = await fetch(`${API_BASE_URL}/books`);
  const data = await res.json();
  return Array.isArray(data) ? data : (data.items || []);
};

export const addBook = async (bookData: any): Promise<any> => {
  const res = await fetch(`${API_BASE_URL}/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookData)
  });
  return res.json();
};

export const updateBook = async (id: string, bookData: any): Promise<any> => {
  const res = await fetch(`${API_BASE_URL}/books/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookData)
  });
  return res.json();
};

export const deleteBook = async (id: string): Promise<any> => {
  const res = await fetch(`${API_BASE_URL}/books/${id}`, {
    method: 'DELETE'
  });
  return res.json();
};

export const fetchStats = async (): Promise<Stats> => {
  const res = await fetch(`${API_BASE_URL}/stats`);
  return res.json();
};

export const fetchSales = async (): Promise<SalesRecord[]> => {
  const res = await fetch(`${API_BASE_URL}/sales`);
  return res.json();
};

export const loginAdmin = async (userData: any): Promise<any> => {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return res.json();
};

export const registerAdmin = async (userData: any): Promise<any> => {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return res.json();
};

export const fetchChatSessions = async (): Promise<ChatSession[]> => {
  const res = await fetch(`${API_BASE_URL}/chat/sessions`);
  return res.json();
};

export const fetchMessages = async (sessionId: string): Promise<Message[]> => {
  const res = await fetch(`${API_BASE_URL}/chat/messages/${sessionId}`);
  return res.json();
};

export const sendMessage = async (messageData: any): Promise<any> => {
  const res = await fetch(`${API_BASE_URL}/chat/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(messageData)
  });
  return res.json();
};
