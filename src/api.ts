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

export const fetchBooks = async (): Promise<Book[]> => {
  const res = await fetch(`${API_BASE_URL}/books`);
  const data = await res.json();
  return data;
};

export const addBook = async (book: Omit<Book, 'id'>): Promise<Book> => {
  const res = await fetch(`${API_BASE_URL}/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
  });
  return res.json();
};

export const updateBook = async (id: string, book: Partial<Book>): Promise<Book> => {
  const res = await fetch(`${API_BASE_URL}/books/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
  });
  return res.json();
};

export const deleteBook = async (id: string): Promise<void> => {
  await fetch(`${API_BASE_URL}/books/${id}`, {
    method: 'DELETE',
  });
};

export const fetchStats = async (): Promise<Stats> => {
  const res = await fetch(`${API_BASE_URL}/stats`);
  return res.json();
};

export const fetchLogs = async (): Promise<AuditLog[]> => {
  const res = await fetch(`${API_BASE_URL}/logs`);
  return res.json();
};

export const fetchSales = async (): Promise<SalesRecord[]> => {
  const res = await fetch(`${API_BASE_URL}/sales`);
  return res.json();
};

export const registerAdmin = async (userData: any): Promise<any> => {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return res.json();
};

export const loginAdmin = async (userData: any): Promise<any> => {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return res.json();
};
