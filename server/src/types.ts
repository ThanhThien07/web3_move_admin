export interface BookItem {
  id: string;
  title: string;
  author: string;
  cover_url: string;
  price_mist: string;
  owner_wallet: string;
}

export interface Purchase {
  id: string;
  bookId: string;
  buyer: string;
  timestamp: string;
  amount: string;
}

export interface Message {
  id: string;
  sender: string; // username or wallet
  content: string;
  timestamp: string;
  isAdmin: boolean;
}

export interface ChatSession {
  id: string; // user ID
  userId: string;
  userName: string;
  lastMessage: string;
  timestamp: string;
  messages: Message[];
}

export interface DatabaseSchema {
  books: BookItem[];
  purchases: Purchase[];
  users: any[];
  admins: any[];
  chats: ChatSession[];
}
