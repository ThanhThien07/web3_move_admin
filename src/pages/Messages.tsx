import { useState, useEffect, useRef } from 'react';
import { useI18n } from '../i18n';
import { MessageSquare, Send, Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isAdmin: boolean;
}

interface ChatSession {
  id: string;
  userId: string;
  userName: string;
  lastMessage: string;
  timestamp: string;
  messages: Message[];
}

export default function Messages() {
  const { t } = useI18n();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedSession) {
      const updated = sessions.find(s => s.userId === selectedSession.userId);
      if (updated && updated.messages.length !== selectedSession.messages.length) {
        setSelectedSession(updated);
      }
    }
    scrollToBottom();
  }, [sessions]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchSessions = async () => {
    try {
      const res = await fetch(`${API_URL}/api/chats`);
      const data = await res.json();
      setSessions(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch chats');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedSession || sending) return;

    setSending(true);
    try {
      const res = await fetch(`${API_URL}/api/chats/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedSession.userId,
          userName: selectedSession.userName,
          content: newMessage,
          isAdmin: true
        })
      });
      if (res.ok) {
        setNewMessage('');
        fetchSessions();
      }
    } catch (err) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const filteredSessions = sessions.filter(s => 
    s.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.userId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-160px)] flex gap-6 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r border-slate-100 flex flex-col">
        <div className="p-6 border-b border-slate-50">
          <h2 className="text-xl font-black text-slate-900 mb-4">{t('messages')}</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder={t('search')}
              className="w-full bg-slate-50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-brand-primary/20 transition-all"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-grow overflow-y-auto p-4 space-y-2">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-6 h-6 text-brand-primary animate-spin" />
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-slate-400 text-sm font-medium">{t('noChats')}</p>
            </div>
          ) : (
            filteredSessions.map(session => (
              <button
                key={session.id}
                onClick={() => setSelectedSession(session)}
                className={`w-full text-left p-4 rounded-2xl transition-all ${
                  selectedSession?.userId === session.userId 
                    ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${
                    selectedSession?.userId === session.userId ? 'bg-white/20' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {session.userName[0].toUpperCase()}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-sm truncate">{session.userName}</h4>
                      <span className={`text-[10px] font-bold ${
                        selectedSession?.userId === session.userId ? 'text-white/60' : 'text-slate-400'
                      }`}>
                        {new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className={`text-xs truncate ${
                      selectedSession?.userId === session.userId ? 'text-white/80' : 'text-slate-500'
                    }`}>
                      {session.lastMessage}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-grow flex flex-col bg-slate-50/30">
        {selectedSession ? (
          <>
            <div className="p-6 bg-white border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center font-black text-xl">
                  {selectedSession.userName[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="font-black text-slate-900 leading-none">{selectedSession.userName}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">ID: {selectedSession.userId}</p>
                </div>
              </div>
            </div>

            <div className="flex-grow overflow-y-auto p-8 space-y-6">
              {selectedSession.messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.isAdmin ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] group`}>
                    <div className={`
                      p-4 rounded-[2rem] text-sm font-medium shadow-sm
                      ${msg.isAdmin 
                        ? 'bg-brand-primary text-white rounded-tr-none' 
                        : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'}
                    `}>
                      {msg.content}
                    </div>
                    <span className={`text-[10px] font-bold text-slate-400 mt-2 block ${msg.isAdmin ? 'text-right mr-2' : 'ml-2'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-6 bg-white border-t border-slate-50">
              <form onSubmit={handleSendMessage} className="flex gap-4">
                <input 
                  type="text"
                  placeholder={t('typeMessage')}
                  className="flex-grow input-field py-4"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                />
                <button 
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="btn-primary w-14 h-14 flex items-center justify-center p-0"
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
            <h3 className="text-2xl font-black text-slate-900 mb-2">Select a Conversation</h3>
            <p className="text-slate-500 font-medium max-w-xs mx-auto">Choose a user from the sidebar to start consulting about books.</p>
          </div>
        )}
      </div>
    </div>
  );
}
