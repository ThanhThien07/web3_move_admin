import { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Send, 
  User, 
  MessageSquare, 
  Loader2, 
  CheckCheck,
  Circle
} from 'lucide-react';
import { fetchChatSessions, fetchMessages, sendMessage, type ChatSession, type Message } from '../api';
import { useI18n } from '../i18n';
import { toast } from 'sonner';

export default function Messages() {
  const { t } = useI18n();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadSessions();
    const interval = setInterval(loadSessions, 10000); // Tự động cập nhật mỗi 10s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedSession) {
      loadMessages(selectedSession.id);
      const interval = setInterval(() => loadMessages(selectedSession.id), 3000);
      return () => clearInterval(interval);
    }
  }, [selectedSession]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadSessions = async () => {
    try {
      const data = await fetchChatSessions();
      setSessions(data);
    } catch (err) {
      console.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (sessionId: string) => {
    try {
      const data = await fetchMessages(sessionId);
      setMessages(data);
    } catch (err) {
      console.error('Failed to load messages');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSession || !newMessage.trim() || sending) return;

    setSending(true);
    try {
      await sendMessage({
        sessionId: selectedSession.id,
        content: newMessage.trim(),
        isAdmin: true
      });
      setNewMessage('');
      loadMessages(selectedSession.id);
    } catch (err) {
      toast.error('Không thể gửi tin nhắn');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm animate-in fade-in duration-500">
      {/* Sidebar - Danh sách khách hàng */}
      <div className="w-80 border-r border-slate-50 flex flex-col bg-slate-50/30">
        <div className="p-6 border-b border-slate-50">
          <h2 className="text-xl font-black text-slate-900 mb-4">{t('messages')}</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder={t('search')}
              className="w-full bg-white border border-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
            />
          </div>
        </div>

        <div className="flex-grow overflow-y-auto">
          {loading ? (
            <div className="flex justify-center p-8"><Loader2 className="animate-spin w-6 h-6 text-brand-primary" /></div>
          ) : sessions.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs font-bold italic">{t('noMessages')}</div>
          ) : (
            sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => setSelectedSession(session)}
                className={`w-full p-6 flex items-center gap-4 transition-all hover:bg-white border-b border-slate-50/50 ${
                  selectedSession?.id === session.id ? 'bg-white shadow-inner border-l-4 border-l-brand-primary' : ''
                }`}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex-grow text-left">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-black text-slate-900 text-sm">{session.customerName || t('customer')}</span>
                    <span className="text-[10px] text-slate-400 font-bold">12:45</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate font-medium">
                    {session.lastMessage || 'Bắt đầu cuộc trò chuyện...'}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Window */}
      <div className="flex-grow flex flex-col bg-white">
        {selectedSession ? (
          <>
            {/* Chat Header */}
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 leading-none mb-1">{selectedSession.customerName || t('customer')}</h3>
                  <div className="flex items-center gap-1.5">
                    <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('activeNow')}</span>
                  </div>
                </div>
              </div>
              <CheckCheck className="w-5 h-5 text-emerald-500" />
            </div>

            {/* Messages Area */}
            <div className="flex-grow overflow-y-auto p-8 space-y-6 bg-slate-50/20">
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex ${msg.isAdmin ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
                >
                  <div className={`max-w-[70%] ${msg.isAdmin ? 'order-1' : 'order-2'}`}>
                    <div className={`
                      p-4 rounded-3xl text-sm font-medium shadow-sm leading-relaxed
                      ${msg.isAdmin 
                        ? 'bg-brand-primary text-white rounded-tr-none shadow-brand-primary/20' 
                        : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'}
                    `}>
                      {msg.content}
                    </div>
                    <span className={`text-[10px] font-bold text-slate-400 mt-2 block ${msg.isAdmin ? 'text-right mr-2' : 'ml-2'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-6 bg-white border-t border-slate-50">
              <form onSubmit={handleSendMessage} className="flex gap-4">
                <input 
                  type="text"
                  placeholder={t('typeMessage')}
                  className="flex-grow bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary/30 transition-all shadow-inner"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                />
                <button 
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="bg-brand-primary hover:bg-brand-primary/90 disabled:bg-slate-200 text-white w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-brand-primary/20 active:scale-95 shrink-0"
                >
                  {sending ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-12">
            <div className="w-24 h-24 rounded-[2.5rem] bg-brand-primary/5 text-brand-primary flex items-center justify-center mb-8 rotate-3">
              <MessageSquare className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">{t('selectConversation')}</h3>
            <p className="text-slate-400 font-bold text-sm max-w-xs">{t('selectDesc')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
