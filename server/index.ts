import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🚀 SỬA LỖI ĐƯỜNG DẪN: Từ server/ đi lên 2 cấp để vào web3_move_backend
const DB_PATH = path.join(__dirname, '../../web3_move_backend/database.json');

const app = express();

// 🚀 CẤU HÌNH CORS LINH HOẠT: Cho phép cả localhost và tên miền sau này của bạn
app.use(cors({
  origin: '*', // Trong sản xuất, bạn nên thay '*' bằng tên miền Netlify của mình
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const getDB = () => {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const initial = { books: [], purchases: [], users: [], chat_sessions: [], admins: [{username:'hung12', password:'123456789'}] };
      // Đảm bảo thư mục tồn tại trước khi ghi
      fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
      fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2));
      return initial;
    }
    const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    // 🚀 TỰ ĐỘNG VÁ LỖI: Đảm bảo các trường quan trọng luôn tồn tại
    if (!data.admins) data.admins = [{username:'hung12', password:'123456789'}];
    if (!data.chat_sessions) data.chat_sessions = [];
    if (!data.books) data.books = [];
    if (!data.purchases) data.purchases = [];
    if (!data.audit_logs) data.audit_logs = [];
    return data;
  } catch (e) {
    console.error("Database Read Error:", e);
    return { books: [], admins: [{username:'hung12', password:'123456789'}], chat_sessions: [], audit_logs: [], purchases: [] };
  }
};

const saveDB = (data: any) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// --- API AUTH ---
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const db = getDB();
  const admin = db.admins?.find((a: any) => a.username === username && a.password === password);
  
  if (admin) {
    res.json({ success: true, user: { username: admin.username, role: 'ADMIN' }, token: 'tk-' + Date.now() });
  } else {
    res.status(401).json({ success: false, error: 'Sai tài khoản hoặc mật khẩu' });
  }
});

// --- API BOOKS ---
app.get('/api/books', (req, res) => {
  const db = getDB();
  res.json({ items: db.books || [] });
});

app.post('/api/books', (req, res) => {
  const db = getDB();
  const newBook = { id: `book-${Date.now()}`, ...req.body };
  if (!db.books) db.books = [];
  db.books.unshift(newBook);
  saveDB(db);
  res.json(newBook);
});

app.put('/api/books/:id', (req, res) => {
  const db = getDB();
  const index = db.books.findIndex((b: any) => b.id === req.params.id);
  if (index !== -1) {
    db.books[index] = { ...db.books[index], ...req.body };
    saveDB(db);
    res.json(db.books[index]);
  } else res.status(404).send();
});

app.delete('/api/books/:id', (req, res) => {
  const db = getDB();
  db.books = db.books.filter((b: any) => b.id !== req.params.id);
  saveDB(db);
  res.json({ success: true });
});

// --- API STATS ---
app.get('/api/stats', (req, res) => {
  const db = getDB();
  res.json({
    totalBooks: db.books?.length || 0,
    totalPurchases: db.purchases?.length || 0,
    totalRevenueMist: (db.purchases || []).reduce((s: any, p: any) => s + BigInt(p.price_mist || 0), BigInt(0)).toString(),
    recentActivity: (db.audit_logs || []).slice(0, 5)
  });
});

app.get('/api/sales', (req, res) => res.json(getDB().purchases || []));

// --- API CHAT ---
app.get('/api/chat/sessions', (req, res) => {
  const db = getDB();
  res.json((db.chat_sessions || []).map((s: any) => ({
    id: s.id,
    customerName: s.customerName || 'Khách hàng',
    lastMessage: s.messages?.[s.messages.length - 1]?.content || '',
    timestamp: s.timestamp || new Date().toISOString()
  })));
});

app.get('/api/chat/messages/:sessionId', (req, res) => {
  const session = getDB().chat_sessions?.find((s: any) => s.id === req.params.sessionId);
  res.json(session ? session.messages : []);
});

app.post('/api/chat/messages', (req, res) => {
  const { sessionId, content, isAdmin } = req.body;
  const db = getDB();
  if (!db.chat_sessions) db.chat_sessions = [];
  let session = db.chat_sessions.find((s: any) => s.id === sessionId);
  const msg = { id: `m-${Date.now()}`, content, isAdmin, timestamp: new Date().toISOString() };
  if (session) session.messages.push(msg);
  else db.chat_sessions.push({ id: sessionId, customerName: 'Khách hàng', messages: [msg], timestamp: new Date().toISOString() });
  saveDB(db);
  res.json(msg);
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🚀 Admin Server đang chạy cực mượt tại: http://localhost:${PORT}`);
  console.log(`📂 Database đang kết nối tại: ${DB_PATH}`);
});
