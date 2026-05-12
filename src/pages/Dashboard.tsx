import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Users, 
  DollarSign, 
  Activity, 
  TrendingUp, 
  ShieldCheck 
} from 'lucide-react';
import { fetchStats, type Stats } from '../api';
import { useI18n } from '../i18n';

export default function Dashboard() {
  const { t } = useI18n();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetchStats().then(setStats).catch(() => {});
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t('overview')}</h2>
        <p className="text-slate-500 font-medium">{t('metricsDesc')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<BookOpen className="w-6 h-6" />}
          label={t('totalBooks')}
          value={stats?.totalBooks || 0}
          trend="+2 THIS WEEK"
          color="bg-blue-500"
        />
        <StatCard 
          icon={<Users className="w-6 h-6" />}
          label={t('totalPurchases')}
          value={stats?.totalPurchases || 0}
          trend="+12% VS LAST MONTH"
          color="bg-purple-500"
        />
        <StatCard 
          icon={<DollarSign className="w-6 h-6" />}
          label={t('totalRevenue')}
          value={`${((parseInt(stats?.totalRevenueMist || '0')) / 10**9).toFixed(2)} SUI`}
          trend={t('realTimeSync') || 'LIVE SYNC'}
          color="bg-emerald-500"
        />
        <StatCard 
          icon={<TrendingUp className="w-6 h-6" />}
          label={t('activeWatchers')}
          value="1"
          trend={t('systemHealthy')}
          color="bg-amber-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
              <Activity className="w-6 h-6 text-brand-primary" />
              {t('recentActivity')}
            </h3>
          </div>
          
          <div className="space-y-4">
            {(stats?.recentActivity || []).map((log, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${log.action === 'PUBLISH' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{log.action}: {log.book_title}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{log.timestamp ? new Date(log.timestamp).toLocaleString() : '---'}</p>
                  </div>
                </div>
              </div>
            ))}
            {(!stats?.recentActivity || stats.recentActivity.length === 0) && (
              <div className="py-20 text-center text-slate-400 font-bold text-sm italic">
                No recent activity recorded.
              </div>
            )}
          </div>
        </div>

        <div className="bg-brand-primary rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col justify-between shadow-2xl shadow-brand-primary/20">
          <div className="relative z-10">
            <ShieldCheck className="w-12 h-12 mb-6 text-white/40" />
            <h3 className="text-2xl font-black mb-4">{t('networkStatus')}</h3>
            <p className="text-emerald-50 font-medium text-sm leading-relaxed mb-8">
              {t('networkDesc')}
            </p>
          </div>
          
          <div className="relative z-10 bg-black/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest">{t('suiNodeActive')}</span>
            </div>
            <div className="w-full bg-black/20 h-1.5 rounded-full overflow-hidden">
              <div className="bg-white h-full w-[65%] rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
            </div>
          </div>
          
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, trend, color }: { icon: React.ReactNode, label: string, value: string | number, trend: string, color: string }) {
  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
      <div className="flex items-start justify-between mb-6">
        <div className={`p-4 rounded-2xl ${color} text-white shadow-lg group-hover:scale-110 transition-transform duration-500`}>
          {icon}
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{trend}</span>
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{label}</p>
        <h4 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h4>
      </div>
    </div>
  );
}
