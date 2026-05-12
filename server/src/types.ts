export interface BookItem {
  id: string;
  title: string;
  author: string;
  cover_url: string;
  price_mist: string;
  access_url: string;
}

export interface Purchase {
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

export interface DatabaseSchema {
  books: BookItem[];
  purchases: Purchase[];
  users: any[];
  admins?: any[];
  favorites: any[];
  audit_logs?: AuditLog[];
}
