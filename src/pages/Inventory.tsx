import { BookOpen, DollarSign, Edit3, Trash2, Plus, Loader2 } from 'lucide-react';
import { useI18n } from '../i18n';
import { type Book } from '../api';

interface InventoryProps {
  books: Book[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
}

export default function Inventory({ books, loading, onAdd, onEdit, onDelete }: InventoryProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t('manageBooks')}</h2>
          <p className="text-slate-500 font-medium">Add, update or remove digital products.</p>
        </div>
        <button 
          onClick={onAdd}
          className="btn-primary flex items-center gap-2 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          {t('addBook')}
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-brand-primary/20 blur-xl rounded-full animate-pulse"></div>
            <Loader2 className="w-12 h-12 text-brand-primary animate-spin relative z-10" />
          </div>
          <p className="font-black text-slate-400 text-xs uppercase tracking-[0.2em]">{t('loading') || 'Syncing Library...'}</p>
        </div>
      ) : books.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] border border-dashed border-slate-200 py-24 flex flex-col items-center justify-center text-center px-6">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 text-slate-200">
            <BookOpen className="w-10 h-10" />
          </div>
          <h3 className="font-black text-slate-800 text-xl mb-2">Inventory is empty</h3>
          <p className="text-slate-500 text-sm font-medium max-w-xs">Your library collection is currently empty. Start by adding your first digital book.</p>
        </div>
      ) : (
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-50">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-1/2">Product Details</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hidden md:table-cell">Author</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pricing</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {books.map(book => (
                  <tr key={book.id} className="group hover:bg-slate-50/40 transition-all duration-300">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-6">
                        <div className="h-20 w-14 rounded-xl bg-slate-100 overflow-hidden shrink-0 shadow-md ring-1 ring-slate-200/50 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                          {book.cover_url ? (
                            <img src={book.cover_url} className="w-full h-full object-cover" alt={book.title} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center"><BookOpen className="w-6 h-6 text-slate-300" /></div>
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-black text-slate-900 group-hover:text-brand-primary transition-colors truncate text-base mb-1">{book.title}</span>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 w-fit px-2 py-0.5 rounded-md">ID: {book.id.slice(0, 8)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 hidden md:table-cell">
                      <span className="text-sm font-bold text-slate-600">{book.author}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 text-emerald-700 w-fit border border-emerald-100/50 shadow-sm shadow-emerald-100/20">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span className="text-sm font-black tracking-tight">
                          {(parseInt(book.price_mist) / 10**9).toFixed(2)} SUI
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button 
                          onClick={() => onEdit(book)}
                          className="p-3.5 text-slate-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-2xl transition-all active:scale-90"
                          title="Edit"
                        >
                          <Edit3 className="w-4.5 h-4.5" />
                        </button>
                        <button 
                          onClick={() => onDelete(book.id)}
                          className="p-3.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all active:scale-90"
                          title="Delete"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
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
  );
}
