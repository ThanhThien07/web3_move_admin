import React, { useState } from 'react';
import { useI18n } from '../i18n';
import { Loader2, UserPlus, Lock, ArrowLeft, Globe, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { registerAdmin } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const { lang, setLang, t } = useI18n();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error(lang === 'vi' ? 'Mật khẩu không khớp' : 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const data = await registerAdmin({ username, password });
      if (data.success) {
        toast.success(lang === 'vi' ? 'Đăng ký thành công! Hãy đăng nhập.' : 'Registration successful! Please sign in.');
        navigate('/login');
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
            <button 
              type="button"
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 text-slate-500 hover:text-emerald-400 font-black text-[10px] uppercase tracking-[0.2em] mb-8 transition-colors group/back"
            >
              <ArrowLeft className="w-4 h-4 group-hover/back:-translate-x-1 transition-transform" />
              {t('cancel')}
            </button>

            <div className="flex flex-col items-center mb-10 text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 animate-pulse"></div>
                <div className="w-20 h-20 rounded-3xl bg-emerald-500 flex items-center justify-center text-white shadow-2xl shadow-emerald-500/40 -rotate-6 group-hover:rotate-0 transition-all duration-700 relative">
                  <UserPlus className="w-10 h-10" />
                </div>
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight italic uppercase">{t('register')} Admin</h1>
              <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-2">Create your administrator account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">{t('username')}</label>
                <div className="relative group/input">
                  <UserPlus className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within/input:text-emerald-500 transition-colors z-10" />
                  <input 
                    type="text" 
                    required
                    placeholder="New admin name"
                    className="w-full bg-slate-800/30 border border-slate-700/50 rounded-3xl py-5 pl-16 pr-6 text-white placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all text-sm font-bold shadow-inner"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">{t('password')}</label>
                <div className="relative group/input">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within/input:text-emerald-500 transition-colors z-10" />
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    className="w-full bg-slate-800/30 border border-slate-700/50 rounded-3xl py-5 pl-16 pr-6 text-white placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all text-sm font-bold shadow-inner"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">{lang === 'vi' ? 'Xác nhận mật khẩu' : 'Confirm Password'}</label>
                <div className="relative group/input">
                  <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within/input:text-emerald-500 transition-colors z-10" />
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    className="w-full bg-slate-800/30 border border-slate-700/50 rounded-3xl py-5 pl-16 pr-6 text-white placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all text-sm font-bold shadow-inner"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black py-5 rounded-3xl shadow-2xl shadow-emerald-500/20 active:scale-[0.97] transition-all flex items-center justify-center gap-3 mt-8 relative overflow-hidden group/btn"
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                <span className="relative z-10">
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : t('register')}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
