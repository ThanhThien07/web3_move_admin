import { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Search, 
  ExternalLink, 
  User, 
  Wallet, 
  Clock,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { fetchSales, type SalesRecord } from '../api';

export default function Sales() {
  const [sales, setSales] = useState<SalesRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadSales();
  }, []);

  async function loadSales() {
    setLoading(true);
    try {
      const data = await fetchSales();
      setSales(data.reverse()); // Newest first
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filteredSales = sales.filter(s => 
    s.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.book_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.wallet_address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Sales History</h2>
          <p className="text-slate-500 font-medium">Monitor user purchases and blockchain verification.</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search buyer or book..." 
            className="input-field pl-12"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
          <p className="font-bold text-slate-400 text-sm">Fetching on-chain data...</p>
        </div>
      ) : filteredSales.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-200 py-20 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
            <ShoppingCart className="w-8 h-8 text-slate-200" />
          </div>
          <h3 className="font-bold text-slate-800 text-lg">No sales found</h3>
          <p className="text-slate-500 text-sm max-w-xs">When users purchase books on the platform, their transaction history will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredSales.map(sale => (
            <div key={sale.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex items-center gap-4 flex-grow min-w-0">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShoppingCart className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-black text-slate-900 truncate">Purchase #{sale.id.slice(-6).toUpperCase()}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] font-black text-emerald-600 uppercase tracking-widest border border-emerald-100">Verified</span>
                  </div>
                  <p className="text-sm font-bold text-slate-400 truncate">Book ID: {sale.book_id}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12 flex-grow">
                <div>
                  <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                    <User className="w-3 h-3" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Buyer</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800">{sale.username}</p>
                </div>

                <div className="hidden lg:block">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                    <Wallet className="w-3 h-3" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Wallet</span>
                  </div>
                  <p className="text-sm font-bold text-slate-500 truncate max-w-[120px]">{sale.wallet_address}</p>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                    <Clock className="w-3 h-3" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Date</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800">{new Date(sale.timestamp).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-slate-50">
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Price</p>
                  <p className="text-lg font-black text-brand-primary">{(Number(sale.price_mist) / 10**9).toFixed(2)} SUI</p>
                </div>
                <a 
                  href={`https://suiscan.xyz/testnet/tx/${sale.digest}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:text-brand-primary hover:bg-brand-primary/10 transition-all"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
