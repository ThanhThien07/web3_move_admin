import { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  LayoutDashboard, 
  BookOpen, 
  DollarSign, 
  Loader2,
  Search,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  Wallet,
  Globe
} from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { AuthProvider, useAuth } from './AuthContext';
import { I18nProvider, useI18n } from './i18n';
import { fetchBooks, addBook, updateBook, deleteBook, type Book } from './api';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Sales from './pages/Sales';

function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  return (
    <div className="flex items-center gap-2 bg-white border border-slate-100 p-1.5 rounded-xl shadow-sm">
      <Globe className="w-4 h-4 text-slate-400 ml-1" />
      <button 
        onClick={() => setLang('en')}
        className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all ${lang === 'en' ? 'bg-brand-primary text-white' : 'text-slate-400 hover:bg-slate-50'}`}
      >
        EN
      </button>
      <button 
        onClick={() => setLang('vi')}
        className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all ${lang === 'vi' ? 'bg-brand-primary text-white' : 'text-slate-400 hover:bg-slate-50'}`}
      >
        VI
      </button>
    </div>
  );
}

function AdminApp() {
  const { user, logout, loading: authLoading } = useAuth();
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'sales'>('dashboard');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (user) loadBooks();
  }, [user]);

  async function loadBooks() {
    setLoading(true);
    try {
      const data = await fetchBooks();
      setBooks(data);
    } catch (err) {
      toast.error('Failed to load books');
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) return null;
  if (!user) return <Login />;

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this book?')) return;
    try {
      await deleteBook(id);
      toast.success('Book removed from library');
      loadBooks();
    } catch (err) {
      toast.error('Failed to delete book');
    }
  };

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(search.toLowerCase()) || 
    b.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans selection:bg-brand-primary/20">
      <Toaster position="top-right" richColors />
      
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center text-white shadow-lg shadow-brand-primary/20">
            <Settings className="w-5 h-5" />
          </div>
          <h1 className="font-black text-lg tracking-tight">Admin</h1>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-500">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-slate-100 z-[70] flex flex-col transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-8 flex items-center gap-4 border-b border-slate-50">
          <div className="w-12 h-12 rounded-2xl bg-brand-primary flex items-center justify-center text-white shadow-xl shadow-brand-primary/20 rotate-3">
            <Settings className="w-7 h-7" />
          </div>
          <div>
            <h1 className="font-black text-2xl tracking-tight leading-none text-slate-900">Portal</h1>
            <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] mt-1 block">Library Master</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden ml-auto p-2 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="p-6 flex-grow space-y-2">
          <NavButton 
            active={activeTab === 'dashboard'} 
            onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }}
            icon={<LayoutDashboard className="w-5 h-5" />}
            label={t('overview')}
          />
          <NavButton 
            active={activeTab === 'inventory'} 
            onClick={() => { setActiveTab('inventory'); setIsSidebarOpen(false); }}
            icon={<BookOpen className="w-5 h-5" />}
            label={t('manageBooks')}
          />
          <NavButton 
            active={activeTab === 'sales'} 
            onClick={() => { setActiveTab('sales'); setIsSidebarOpen(false); }}
            icon={<DollarSign className="w-5 h-5" />}
            label={t('salesRecords')}
          />
        </nav>
        
        <div className="p-6 mt-auto space-y-4">
          <LanguageSwitcher />
          <div className="rounded-3xl bg-slate-900 p-6 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Main Sync Active</span>
              </div>
              <p className="text-sm font-bold leading-relaxed mb-4">Linked to production DB.</p>
              <button 
                onClick={logout}
                className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                {t('signOut')}
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-brand-primary/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-72 min-h-screen pb-20">
        <header className="sticky top-0 z-40 bg-[#f8fafc]/80 backdrop-blur-md px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-grow max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder={t('search')} 
                className="input-field pl-12"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4 ml-6">
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
            <button className="p-3 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-brand-primary hover:shadow-lg hover:shadow-brand-primary/5 transition-all">
              <Bell className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-black">
                {user.username[0].toUpperCase()}
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-slate-900 leading-none">{user.username}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        <div className="px-8 pb-8">
          {activeTab === 'dashboard' && <Dashboard />}
          
          {activeTab === 'sales' && <Sales />}

          {activeTab === 'inventory' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t('manageBooks')}</h2>
                  <p className="text-slate-500 font-medium">Add, update or remove digital products.</p>
                </div>
                <button 
                  onClick={() => { setEditingBook(null); setIsModalOpen(true); }}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  {t('addBook')}
                </button>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
                  <p className="font-bold text-slate-400 text-sm">Syncing with main library...</p>
                </div>
              ) : filteredBooks.length === 0 ? (
                <div className="bg-white rounded-[2.5rem] border border-dashed border-slate-200 py-20 flex flex-col items-center justify-center text-center">
                  <BookOpen className="w-16 h-16 text-slate-200 mb-4" />
                  <h3 className="font-bold text-slate-800 text-lg">Inventory is empty</h3>
                  <p className="text-slate-500 text-sm">Start building your library collection.</p>
                </div>
              ) : (
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-50">
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Product Details</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hidden md:table-cell">Author</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pricing</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Control</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filteredBooks.map(book => (
                          <tr key={book.id} className="group hover:bg-slate-50/40 transition-colors">
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-5">
                                <div className="h-16 w-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 shadow-sm ring-1 ring-slate-200/50 group-hover:scale-110 transition-transform duration-300">
                                  {book.cover_url ? (
                                    <img src={book.cover_url} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center"><BookOpen className="w-5 h-5 text-slate-300" /></div>
                                  )}
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <span className="font-bold text-slate-900 group-hover:text-brand-primary transition-colors truncate">{book.title}</span>
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">ID: {book.id.slice(0, 8)}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-5 hidden md:table-cell">
                              <span className="text-sm font-bold text-slate-600">{book.author}</span>
                            </td>
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 w-fit border border-emerald-100/50">
                                <DollarSign className="w-3 h-3" />
                                <span className="text-sm font-black tracking-tight">{(parseInt(book.price_mist) / 10**9).toFixed(2)} SUI</span>
                              </div>
                            </td>
                            <td className="px-8 py-5 text-right">
                              <div className="flex items-center justify-end gap-3">
                                <button 
                                  onClick={() => { setEditingBook(book); setIsModalOpen(true); }}
                                  className="p-3 text-slate-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-2xl transition-all"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDelete(book.id)}
                                  className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
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

function BookModal({ 
  book, 
  onClose, 
  onSuccess 
}: { 
  book: Book | null; 
  onClose: () => void; 
  onSuccess: () => void;
}) {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    title: book?.title || '',
    author: book?.author || '',
    cover_url: book?.cover_url || '',
    price_mist: book?.price_mist || '100000000',
    access_url: book?.access_url || '',
    owner_wallet: book?.owner_wallet || ''
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (book) {
        await updateBook(book.id, formData);
        toast.success('Inventory updated');
      } else {
        await addBook(formData);
        toast.success('Book published to library');
      }
      onSuccess();
    } catch (err) {
      toast.error('Operation failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-400">
        <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <div>
            <h3 className="text-2xl font-black text-slate-900">{book ? t('editBook') : t('addBook')}</h3>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">SUI Blockchain Integration</p>
          </div>
          <button onClick={onClose} className="p-3 rounded-2xl hover:bg-white hover:shadow-lg transition-all text-slate-400 hover:text-slate-900">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-10 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1">{t('title')}</label>
              <input 
                required
                className="input-field" 
                placeholder="e.g. Mastering Sui Move" 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1">{t('author')}</label>
              <input 
                required
                className="input-field" 
                placeholder="Name" 
                value={formData.author}
                onChange={e => setFormData({...formData, author: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1">{t('price')}</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 flex items-center justify-center">
                  <DollarSign className="w-full h-full" />
                </div>
                <input 
                  required
                  type="number"
                  className="input-field pl-12" 
                  placeholder="100000000" 
                  value={formData.price_mist}
                  onChange={e => setFormData({...formData, price_mist: e.target.value})}
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1">{t('ownerWallet')}</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 flex items-center justify-center">
                <Wallet className="w-full h-full" />
              </div>
              <input 
                required
                className="input-field pl-12" 
                placeholder="0x..." 
                value={formData.owner_wallet}
                onChange={e => setFormData({...formData, owner_wallet: e.target.value})}
              />
            </div>
            <p className="mt-2 text-[10px] font-bold text-slate-400 italic">This wallet will receive payments from buyers.</p>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1">{t('coverUrl')}</label>
            <input 
              required
              className="input-field" 
              placeholder="https://images.unsplash.com/..." 
              value={formData.cover_url}
              onChange={e => setFormData({...formData, cover_url: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1">{t('accessUrl')}</label>
            <input 
              required
              className="input-field" 
              placeholder="https://docs.sui.io" 
              value={formData.access_url}
              onChange={e => setFormData({...formData, access_url: e.target.value})}
            />
          </div>

          <div className="pt-6 flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 px-6 rounded-2xl font-black text-slate-500 hover:bg-slate-50 transition-all">{t('cancel')}</button>
            <button 
              type="submit" 
              disabled={saving}
              className="flex-[2] btn-primary flex items-center justify-center gap-3 shadow-xl shadow-brand-primary/20"
            >
              {saving && <Loader2 className="w-5 h-5 animate-spin" />}
              {book ? t('save') : t('publish')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <AdminApp />
      </AuthProvider>
    </I18nProvider>
  );
}
