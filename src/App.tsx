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
  MoreVertical
} from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { fetchBooks, addBook, updateBook, deleteBook, type Book } from './api';

export default function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  useEffect(() => {
    loadBooks();
  }, []);

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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this book?')) return;
    try {
      await deleteBook(id);
      toast.success('Book deleted successfully');
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
      
      {/* Sidebar (Desktop) */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 z-40 hidden lg:flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center text-white shadow-lg shadow-brand-primary/20">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-black text-xl tracking-tight leading-none">Admin</h1>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Library Manager</span>
          </div>
        </div>
        
        <nav className="p-4 flex-grow space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-primary/10 text-brand-primary font-bold transition-all">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 font-bold transition-all">
            <BookOpen className="w-5 h-5" />
            Collection
          </button>
        </nav>
        
        <div className="p-6 mt-auto">
          <div className="rounded-2xl bg-slate-900 p-5 text-white relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-xs font-bold text-slate-400 mb-1">Web3 Integration</p>
              <h4 className="font-bold text-sm leading-tight">Your library is synced with SUI Network.</h4>
            </div>
            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-brand-primary/20 rounded-full blur-xl"></div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64 min-h-screen pb-20">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-grow max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by title or author..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all text-sm"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
          
          <button 
            onClick={() => { setEditingBook(null); setIsModalOpen(true); }}
            className="btn-primary flex items-center gap-2 ml-4 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add New Book</span>
          </button>
        </header>

        <div className="p-6">
          <div className="grid gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-800">Inventory Management</h2>
                <p className="text-sm text-slate-500 font-medium">Control your book collection and prices in real-time.</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 bg-brand-primary/10 text-brand-primary rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-primary animate-pulse"></span>
                LIVE SYNC ACTIVE
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
                <p className="font-bold text-slate-400 text-sm">Synchronizing data...</p>
              </div>
            ) : filteredBooks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                  <BookOpen className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg">No books found</h3>
                <p className="text-slate-500 text-sm">Start by adding your first digital product.</p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Book Info</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:table-cell">Author</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Price (MIST)</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredBooks.map(book => (
                      <tr key={book.id} className="group hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-9 rounded-lg bg-slate-100 overflow-hidden shrink-0 shadow-sm">
                              {book.cover_url ? (
                                <img src={book.cover_url} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center"><BookOpen className="w-4 h-4 text-slate-300" /></div>
                              )}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-bold text-slate-800 truncate">{book.title}</span>
                              <span className="text-[10px] font-medium text-slate-400 md:hidden">{book.author}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <span className="text-sm font-semibold text-slate-600">{book.author}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 w-fit">
                            <DollarSign className="w-3 h-3" />
                            <span className="text-sm font-bold">{(parseInt(book.price_mist) / 10**9).toFixed(2)} SUI</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => { setEditingBook(book); setIsModalOpen(true); }}
                              className="p-2 text-slate-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-xl transition-all"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(book.id)}
                              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-slate-800 md:hidden">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
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

function BookModal({ 
  book, 
  onClose, 
  onSuccess 
}: { 
  book: Book | null; 
  onClose: () => void; 
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    title: book?.title || '',
    author: book?.author || '',
    cover_url: book?.cover_url || '',
    price_mist: book?.price_mist || '100000000',
    access_url: book?.access_url || ''
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (book) {
        await updateBook(book.id, formData);
        toast.success('Book updated successfully');
      } else {
        await addBook(formData);
        toast.success('Book added successfully');
      }
      onSuccess();
    } catch (err) {
      toast.error('Failed to save book');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-800">{book ? 'Edit Book' : 'Add New Book'}</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-800 transition-colors">
            <Plus className="w-6 h-6 rotate-45" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Book Title</label>
              <input 
                required
                className="input-field" 
                placeholder="e.g. Mastering Sui Move" 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Author</label>
              <input 
                required
                className="input-field" 
                placeholder="Name" 
                value={formData.author}
                onChange={e => setFormData({...formData, author: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Price (MIST)</label>
              <input 
                required
                type="number"
                className="input-field" 
                placeholder="100000000" 
                value={formData.price_mist}
                onChange={e => setFormData({...formData, price_mist: e.target.value})}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Cover Image URL</label>
            <input 
              required
              className="input-field" 
              placeholder="https://..." 
              value={formData.cover_url}
              onChange={e => setFormData({...formData, cover_url: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Access URL (Gated Content)</label>
            <input 
              required
              className="input-field" 
              placeholder="https://docs.sui.io" 
              value={formData.access_url}
              onChange={e => setFormData({...formData, access_url: e.target.value})}
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-grow py-3 px-4 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-all">Cancel</button>
            <button 
              type="submit" 
              disabled={saving}
              className="flex-grow btn-primary flex items-center justify-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {book ? 'Save Changes' : 'Publish Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
