import { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useI18n } from '../i18n';
import { Settings, Loader2, ShieldCheck, Lock, UserPlus, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { loginAdmin } from '../api';
import Register from './Register';

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

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const { login } = useAuth();
  const { t } = useI18n();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginAdmin({ username, password });
      if (data.success) {
        login(data.user, data.token);
        toast.success(t('welcomeAdmin'));
      } else {
        toast.error(data.error || 'Invalid credentials');
      }
    } catch (err) {
      toast.error('Connection failed. Please check backend.');
    } finally {
      setLoading(false);
    }
  };

  if (isRegistering) return <Register onBack={() => setIsRegistering(false)} />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6 relative overflow-hidden">
      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>

      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl -ml-48 -mb-48"></div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 p-8 md:p-12 border border-slate-100">
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-20 h-20 rounded-3xl bg-brand-primary flex items-center justify-center text-white shadow-xl shadow-brand-primary/30 mb-6 rotate-3">
              <Settings className="w-10 h-10 animate-spin-slow" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t('dashboard')} Portal</h1>
            <p className="text-slate-500 font-medium mt-2">Sign in to manage your Web3 Library</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">{t('username')}</label>
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  required
                  placeholder="admin"
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

            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-primary mt-4 flex items-center justify-center gap-3 py-4 text-lg"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : t('login')}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-50 text-center space-y-4">
            <button 
              type="button"
              onClick={() => setIsRegistering(true)}
              className="text-xs font-black text-slate-400 hover:text-brand-primary uppercase tracking-widest flex items-center justify-center gap-2 mx-auto transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              {t('register')} new account
            </button>
            <p className="text-xs text-slate-400 font-medium italic">
              "Power is nothing without control."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
