export interface BookItem {
  id: string;
  title: string;
  author: string;
  cover_url: string;
  price_mist: string;
  owner_wallet: string;
}

export interface PurchaseRecord {
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

export interface ChatMessage {
  id: string;
  content: string;
  isAdmin: boolean;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  customerName: string;
  messages: ChatMessage[];
  timestamp: string;
}

export interface AdminUser {
  username: string;
  password?: string;
}

export interface DatabaseSchema {
  books: BookItem[];
  purchases: PurchaseRecord[];
  users: any[];
  admins?: AdminUser[];
  audit_logs?: AuditLog[];
  chat_sessions?: ChatSession[];
  favorites?: string[];
}
