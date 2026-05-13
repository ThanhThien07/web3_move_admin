import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { Settings, User as UserIcon, Lock, Loader2, Globe, ShieldCheck } from 'lucide-react';
import { useI18n } from '../i18n';
import { toast } from 'sonner';
import { loginAdmin } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login: saveAuth } = useAuth();
  const { lang, setLang, t } = useI18n();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      // Đảm bảo truyền Object đúng cấu trúc
      const response = await loginAdmin({ username, password });

      if (response.success && response.user) {
        saveAuth(response.user, response.token);
        toast.success(t('loginSuccess'));
      } else {
        toast.error(response.error || t('loginFailed'));
      }
    } catch (err: any) {
      toast.error('Lỗi kết nối server Backend Admin.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">

        {/* Bộ chuyển đổi ngôn ngữ */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-800/40 p-1 rounded-2xl border border-slate-700/50 backdrop-blur-xl flex gap-1 shadow-2xl">
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black transition-all ${lang === 'en' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
            >
              <Globe className="w-3.5 h-3.5" /> ENGLISH
            </button>
            <button
              type="button"
              onClick={() => setLang('vi')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black transition-all ${lang === 'vi' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
            >
              <Globe className="w-3.5 h-3.5" /> TIẾNG VIỆT
            </button>
          </div>
        </div>

        <div className="bg-slate-900/90 backdrop-blur-3xl rounded-[3rem] border border-slate-800 p-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-linear-to-br from-emerald-500/10 to-transparent pointer-events-none opacity-50"></div>

          <div className="relative z-10">
            <div className="flex justify-center mb-10">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 animate-pulse"></div>
                <div className="w-24 h-24 rounded-4xl bg-emerald-500 flex items-center justify-center text-white shadow-2xl shadow-emerald-500/40 rotate-6 group-hover:rotate-12 transition-all duration-700 relative">
                  <Settings className="w-12 h-12 animate-spin-slow" />
                </div>
              </div>
            </div>

            <div className="text-center mb-10">
              <h1 className="text-4xl font-black text-white tracking-tight mb-2 uppercase italic">Library Admin</h1>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">{t('signInDesc')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">{t('username')}</label>
                <div className="relative group/input">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-emerald-500 transition-colors z-10">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <input
                    required
                    type="text"
                    autoComplete="username"
                    className="w-full bg-slate-800/30 border border-slate-700/50 rounded-3xl py-5 pl-16 pr-6 text-white placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all text-sm font-bold shadow-inner"
                    placeholder="admin"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">{t('password')}</label>
                <div className="relative group/input">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-emerald-500 transition-colors z-10">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    required
                    type="password"
                    autoComplete="current-password"
                    className="w-full bg-slate-800/30 border border-slate-700/50 rounded-3xl py-5 pl-16 pr-6 text-white placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all text-sm font-bold shadow-inner"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black py-5 rounded-3xl shadow-2xl shadow-emerald-500/20 active:scale-[0.97] transition-all flex items-center justify-center gap-3 mt-10 relative overflow-hidden group/btn"
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                <span className="relative z-10">
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : t('login')}
                </span>
              </button>
            </form>

            <div className="mt-12 pt-8 border-t border-slate-800/50 text-center space-y-5">
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="text-[10px] font-black text-slate-500 hover:text-emerald-400 transition-all flex items-center justify-center gap-3 mx-auto uppercase tracking-[0.2em]"
              >
                <ShieldCheck className="w-4 h-4" />
                {t('register')}
              </button>
              <p className="text-[10px] font-bold italic text-slate-700 tracking-wider">"Power is nothing without control."</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
