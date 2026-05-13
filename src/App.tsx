import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  DollarSign,
  Search,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { SuiClientProvider, WalletProvider, createNetworkConfig, ConnectButton } from '@mysten/dapp-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@mysten/dapp-kit/dist/index.css';
import { AuthProvider, useAuth } from './AuthContext';
import { I18nProvider, useI18n } from './i18n';
import { fetchBooks, deleteBook, type Book } from './api';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Sales from './pages/Sales';
import Messages from './pages/Messages';
import Inventory from './pages/Inventory';
import BookModal from './pages/BookModal';
import Register from './pages/Register';

const { networkConfig } = createNetworkConfig({
  devnet: { url: 'https://fullnode.devnet.sui.io:443' } as any,
  testnet: { url: 'https://fullnode.testnet.sui.io:443' } as any,
  mainnet: { url: 'https://fullnode.mainnet.sui.io:443' } as any,
});

const queryClient = new QueryClient();

function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  return (
    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1 rounded-xl shadow-sm scale-90">
      <Settings className="w-3.5 h-3.5 text-slate-400 ml-1" />
      <button
        type="button"
        onClick={() => setLang('en')}
        className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all ${lang === 'en' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang('vi')}
        className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all ${lang === 'vi' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}
      >
        VI
      </button>
    </div>
  );
}

function AdminApp() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'sales' | 'messages'>('dashboard');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [search, setSearch] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { t } = useI18n();

  useEffect(() => {
    if (user) {
      loadBooks();
    }
  }, [user]);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const data = await fetchBooks();
      setBooks(data || []);
    } catch (err) {
      toast.error('Không thể kết nối đến Backend Admin.');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa cuốn sách này?')) return;
    try {
      await deleteBook(id);
      toast.success('Xóa sách thành công');
      loadBooks();
    } catch (err) {
      toast.error('Xóa sách thất bại');
    }
  };

  const filteredBooks = books.filter(b =>
    b.title?.toLowerCase().includes(search.toLowerCase()) ||
    b.author?.toLowerCase().includes(search.toLowerCase())
  );

  // 🚀 QUAN TRỌNG: Kiểm tra user trước khi render nội dung Admin
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  const renderContent = () => {
    try {
      switch (activeTab) {
        case 'dashboard':
          return <Dashboard />;
        case 'sales':
          return <Sales />;
        case 'messages':
          return <Messages />;
        case 'inventory':
          return (
            <Inventory
              books={filteredBooks}
              loading={loading}
              onAdd={() => { setEditingBook(null); setIsModalOpen(true); }}
              onEdit={book => { setEditingBook(book); setIsModalOpen(true); }}
              onDelete={handleDelete}
            />
          );
        default:
          return <Dashboard />;
      }
    } catch (err) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
          <h3 className="text-xl font-black text-slate-800">Lỗi hiển thị</h3>
          <p className="text-slate-500">Vui lòng thử tải lại trang.</p>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-brand-primary/10 selection:text-brand-primary">
      <Toaster position="top-right" richColors />

      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden fixed top-6 left-6 z-50 p-3 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 text-slate-600"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-60 lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-slate-100 z-70 flex flex-col transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-8 flex items-center gap-4 border-b border-slate-50">
          <div className="w-12 h-12 rounded-2xl bg-brand-primary flex items-center justify-center text-white shadow-xl shadow-brand-primary/20 rotate-3">
            <Settings className="w-7 h-7" />
          </div>
          <div>
            <h1 className="font-black text-2xl tracking-tight leading-none text-slate-900">Library</h1>
            <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] mt-1 block">Admin Panel</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden ml-auto p-2 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-6 grow space-y-2">
          <NavButton
            active={activeTab === 'dashboard'}
            onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }}
            icon={<LayoutDashboard className="w-5 h-5" />}
            label={t('overview') || 'Tổng quan'}
          />
          <NavButton
            active={activeTab === 'inventory'}
            onClick={() => { setActiveTab('inventory'); setIsSidebarOpen(false); }}
            icon={<BookOpen className="w-5 h-5" />}
            label={t('manageBooks') || 'Kho sách'}
          />
          <NavButton
            active={activeTab === 'sales'}
            onClick={() => { setActiveTab('sales'); setIsSidebarOpen(false); }}
            icon={<DollarSign className="w-5 h-5" />}
            label={t('salesRecords') || 'Doanh thu'}
          />
          <NavButton
            active={activeTab === 'messages'}
            onClick={() => { setActiveTab('messages'); setIsSidebarOpen(false); }}
            icon={<MessageSquare className="w-5 h-5" />}
            label={t('messages') || 'Tin nhắn'}
          />
        </nav>

        <div className="p-6 mt-auto space-y-4">
          <div className="rounded-3xl bg-slate-900 p-6 text-white relative overflow-hidden group border border-slate-800">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Main Sync Active</span>
              </div>
              <p className="text-sm font-bold leading-relaxed mb-4">Kết nối cơ sở dữ liệu chính.</p>
              <button
                onClick={logout}
                className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                {t('signOut') || 'Đăng xuất'}
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-brand-primary/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-72 min-h-screen pb-20">
        <header className="sticky top-0 z-40 bg-[#f8fafc]/80 backdrop-blur-md px-8 py-6 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-4 grow max-w-xl">
            <div className="relative w-full text-slate-900">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={t('search') || 'Tìm kiếm...'}
                className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-6 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all shadow-sm"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 ml-6">
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
            <div className="scale-90 origin-right">
              <ConnectButton />
            </div>
            <button className="p-3 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-brand-primary transition-all">
              <Bell className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center font-black">
                {user?.username?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="text-left min-w-[80px]">
                <p className="text-sm font-black text-slate-900 leading-none truncate">{user?.username}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        <div className="px-8 pb-8 mt-8">
          {renderContent()}
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <BookModal
          book={editingBook}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => { setIsModalOpen(false); loadBooks(); }}
        />
      )}
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-sm transition-all duration-300
        ${active
          ? 'bg-brand-primary text-white shadow-xl shadow-brand-primary/30 translate-x-2'
          : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}
      `}
    >
      <div className="shrink-0">{icon}</div>
      <span>{label}</span>
    </button>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider autoConnect>
          <I18nProvider>
            <AuthProvider>
              <BrowserRouter>
                <AdminApp />
              </BrowserRouter>
            </AuthProvider>
          </I18nProvider>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
