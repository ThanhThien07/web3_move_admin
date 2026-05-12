import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  BookOpen, 
  Users, 
  DollarSign, 
  History,
  TrendingUp,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { fetchStats, type Stats } from '../api';

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    setLoading(true);
    try {
      const data = await fetchStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">System Overview</h2>
        <p className="text-slate-500 font-medium">Real-time metrics from your Web3 Library platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<BookOpen className="w-6 h-6" />} 
          label="Total Books" 
          value={stats?.totalBooks || 0} 
          color="bg-blue-500" 
          trend="+2 this week"
        />
        <StatCard 
          icon={<Users className="w-6 h-6" />} 
          label="Total Purchases" 
          value={stats?.totalPurchases || 0} 
          color="bg-purple-500" 
          trend="+12% vs last month"
        />
        <StatCard 
          icon={<DollarSign className="w-6 h-6" />} 
          label="Total Revenue" 
          value={`${(Number(stats?.totalRevenueMist || 0) / 10**9).toFixed(2)} SUI`} 
          color="bg-emerald-500" 
          trend="Real-time sync"
        />
        <StatCard 
          icon={<TrendingUp className="w-6 h-6" />} 
          label="Active Watchers" 
          value="1" 
          color="bg-amber-500" 
          trend="System healthy"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <History className="w-5 h-5 text-brand-primary" />
              Recent Publishing Activity
            </h3>
          </div>
          <div className="divide-y divide-slate-50">
            {stats?.recentActivity.length === 0 ? (
              <div className="p-10 text-center text-slate-400 font-medium italic">No recent activity found.</div>
            ) : stats?.recentActivity.map(log => (
              <div key={log.id} className="p-5 flex items-center gap-4 hover:bg-slate-50/50 transition-colors">
                <div className={`p-2.5 rounded-xl ${
                  log.action === 'PUBLISH' ? 'bg-emerald-50 text-emerald-600' : 
                  log.action === 'UNPUBLISH' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  {log.action === 'PUBLISH' ? <CheckCircle2 className="w-5 h-5" /> : 
                   log.action === 'UNPUBLISH' ? <XCircle className="w-5 h-5" /> : <RefreshCw className="w-5 h-5" />}
                </div>
                <div className="flex-grow">
                  <p className="font-bold text-slate-800 text-sm">
                    {log.action === 'PUBLISH' ? 'Book Published' : 
                     log.action === 'UNPUBLISH' ? 'Book Removed' : 'Book Updated'}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">"{log.book_title}"</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                    {new Date(log.timestamp).toLocaleDateString()}
                  </p>
                  <p className="text-[10px] text-slate-300 font-black">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-brand-primary rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col justify-between shadow-2xl shadow-brand-primary/20">
          <div className="relative z-10">
            <BarChart3 className="w-12 h-12 mb-6 opacity-20" />
            <h3 className="text-2xl font-black mb-2">Network Status</h3>
            <p className="text-brand-primary-foreground/80 font-medium text-sm">
              Your platform is currently connected to SUI Testnet. All transactions are being monitored in real-time.
            </p>
          </div>
          <div className="mt-10 relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              <span className="text-xs font-black uppercase tracking-widest">SUI Node Active</span>
            </div>
            <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
              <div className="h-full w-4/5 bg-white rounded-full"></div>
            </div>
          </div>
          {/* Decoration */}
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color, trend }: { icon: React.ReactNode, label: string, value: string | number, color: string, trend: string }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-2xl text-white shadow-lg ${color} transition-transform group-hover:scale-110 duration-300`}>
          {icon}
        </div>
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{trend}</span>
      </div>
      <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">{label}</p>
      <h4 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h4>
    </div>
  );
}
