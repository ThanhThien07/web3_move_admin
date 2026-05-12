const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

export interface Book {
  id: string;
  title: string;
  author: string;
  cover_url: string;
  price_mist: string;
  access_url: string;
}

export const fetchBooks = async (): Promise<Book[]> => {
  const res = await fetch(`${API_BASE_URL}/books`);
  const data = await res.json();
  return data.items;
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
