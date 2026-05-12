import { useState } from 'react';
import { X, Wallet, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useI18n } from '../i18n';
import { addBook, updateBook, type Book } from '../api';

interface BookModalProps {
  book: Book | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BookModal({ book, onClose, onSuccess }: BookModalProps) {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    title: book?.title || '',
    author: book?.author || '',
    cover_url: book?.cover_url || '',
    price_mist: book?.price_mist || '',
    owner_wallet: book?.owner_wallet || ''
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{book ? t('editBook') : t('addBook')}</h2>
            <button onClick={onClose} className="p-3 hover:bg-slate-50 rounded-2xl transition-colors"><X className="w-6 h-6 text-slate-400" /></button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1">{t('title')}</label>
                <input 
                  required
                  className="input-field" 
                  placeholder="The Web3 Revolution" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1">{t('author')}</label>
                <input 
                  required
                  className="input-field" 
                  placeholder="Satoshi Nakamoto" 
                  value={formData.author}
                  onChange={e => setFormData({...formData, author: e.target.value})}
                />
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
                  className="input-field pl-12 font-mono text-xs" 
                  placeholder="0x..." 
                  value={formData.owner_wallet}
                  onChange={e => setFormData({...formData, owner_wallet: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1">{t('price')}</label>
                <input 
                  required
                  type="number"
                  className="input-field" 
                  placeholder="100000000" 
                  value={formData.price_mist}
                  onChange={e => setFormData({...formData, price_mist: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1">{t('coverUrl')}</label>
                <input 
                  required
                  className="input-field" 
                  placeholder="https://example.com/cover.jpg" 
                  value={formData.cover_url}
                  onChange={e => setFormData({...formData, cover_url: e.target.value})}
                />
              </div>
            </div>

            <div className="pt-6 flex gap-4">
              <button type="button" onClick={onClose} className="flex-1 py-4 px-6 rounded-2xl font-black text-slate-500 hover:bg-slate-50 transition-all">{t('cancel')}</button>
              <button 
                type="submit" 
                disabled={saving}
                className="flex-[2] btn-primary py-4 px-6 rounded-2xl font-black flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : (book ? t('save') : t('publish'))}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
