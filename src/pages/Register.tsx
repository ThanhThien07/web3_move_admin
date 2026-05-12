import { useState } from 'react';
import { useI18n } from '../i18n';
import { Loader2, UserPlus, Lock, ArrowLeft, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { registerAdmin } from '../api';

function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  return (
    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1 rounded-xl shadow-sm scale-90">
      <Globe className="w-3.5 h-3.5 text-slate-400 ml-1" />
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

interface RegisterProps {
  onBack: () => void;
}

export default function Register({ onBack }: RegisterProps) {
  const { t } = useI18n();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const data = await registerAdmin({ username, password });
      if (data.success) {
        toast.success('Registration successful! Please sign in.');
        onBack();
      } else {
        toast.error(data.error || 'Registration failed');
      }
    } catch (err) {
      toast.error('Connection failed. Please check backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6 relative overflow-hidden">
      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>

      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl -ml-48 -mb-48"></div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 p-8 md:p-12 border border-slate-100">
          <button 
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-brand-primary font-bold text-xs uppercase tracking-widest mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {t('cancel')}
          </button>

          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-xl shadow-amber-500/30 mb-6 rotate-3">
              <UserPlus className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t('register')} Admin</h1>
            <p className="text-slate-500 font-medium mt-2">Set up your administrative credentials</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">{t('username')}</label>
              <div className="relative">
                <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  required
                  placeholder="New admin name"
                  className="input-field pl-12"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">{t('password')}</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="input-field pl-12"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="input-field pl-12"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-primary mt-4 flex items-center justify-center gap-3 py-4 text-lg bg-slate-900 hover:bg-slate-800"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : t('register')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
