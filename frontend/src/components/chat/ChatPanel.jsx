import { useState, useEffect, useRef } from 'react';
import { Send, Terminal, User, ChevronDown, ChevronRight, BookOpen } from 'lucide-react';
import { askQuestion, getChatHistory } from '../../api/chat';
import Spinner from '../ui/Spinner';
import EmptyState from '../ui/EmptyState';

const Screw = () => (
  <div className="w-2.5 h-2.5 rounded-full bg-background border border-borderDark flex items-center justify-center shadow-[inset_1px_1px_2.5px_rgba(0,0,0,0.2)] flex-shrink-0">
    <div className="w-1 h-[1px] bg-borderDark/70 rotate-[35deg]" />
  </div>
);

export default function ChatPanel({ noteId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const bottomRef = useRef();

  useEffect(() => {
    getChatHistory(noteId)
      .then((res) => setMessages(res.data))
      .catch(console.error)
      .finally(() => setHistoryLoading(false));
  }, [noteId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const question = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: question, id: Date.now() }]);
    setLoading(true);

    try {
      const res = await askQuestion(noteId, question);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: res.data.answer, sources: res.data.sources, id: Date.now() + 1 },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'SYSTEM ERROR: UNABLE TO FORMULATE RESPONSE.', id: Date.now() + 1 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (historyLoading) {
    return <div className="flex items-center justify-center py-16"><Spinner /></div>;
  }

  return (
    <div className="flex flex-col h-full bg-background relative z-0">
      
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 relative z-10 scrollbar-hide max-h-[50vh]">
        {messages.length === 0 ? (
          <EmptyState
            icon={Terminal}
            title="AWAITING QUERY"
            description="ENTER A PARAMETER BELOW TO INTERROGATE THE DOCUMENT MODULE."
          />
        ) : (
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)
        )}
        
        {loading && (
          <div className="flex items-center gap-4 p-2 animate-fade-in">
            <div className="w-9 h-9 rounded-full bg-background flex items-center justify-center border border-white/50 shadow-[var(--shadow-card)] flex-shrink-0">
              <Terminal className="w-4 h-4 text-accent" />
            </div>
            <div className="flex gap-1.5 p-3 bg-background shadow-[var(--shadow-recessed)] rounded-xl border border-white/10 select-none">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input controller deck */}
      <div className="border-t border-border/40 p-4 sm:p-6 bg-background shadow-[0_-4px_12px_-4px_rgba(186,190,204,0.4)] relative z-10">
        <div className="absolute top-2 left-2"><Screw /></div>
        <div className="absolute top-2 right-2"><Screw /></div>
        
        <div className="flex gap-3 max-w-4xl mx-auto relative pt-1">
          <input
            className="input-field flex-1 text-xs"
            placeholder="EXECUTE QUERY COMPILER..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            disabled={loading}
          />
          <button 
            onClick={handleSend} 
            disabled={!input.trim() || loading} 
            className="btn-primary px-5 py-3 shadow-[var(--shadow-card)]"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ChatMessage({ message }) {
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-4 animate-slide-up ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-9 h-9 rounded-full bg-background flex items-center justify-center border border-white/50 shadow-[var(--shadow-card)] flex-shrink-0 ${
        isUser ? 'text-accent' : 'text-mutedForeground'
      }`}>
        {isUser ? <User className="w-4 h-4" /> : <Terminal className="w-4 h-4" />}
      </div>
      
      <div className={`max-w-[78%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        
        {/* Skeuomorphic message bubble container */}
        <div className={`p-4 text-xs font-mono rounded-2xl text-left border ${
          isUser 
            ? 'bg-background text-accent shadow-[var(--shadow-pressed)] border-white/10 font-bold' 
            : 'bg-background text-foreground shadow-[var(--shadow-card)] border-white/40'
        }`}>
          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        </div>
        
        {message.sources?.length > 0 && (
          <div className="mt-2.5">
            <button
              onClick={() => setSourcesOpen(!sourcesOpen)}
              className="flex items-center gap-1.5 text-[9px] font-mono font-bold tracking-widest text-accent hover:text-accent/80 transition-colors bg-background shadow-[var(--shadow-sharp)] px-2.5 py-1 rounded-lg border border-white/30"
            >
              {sourcesOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              <BookOpen className="w-3 h-3" />
              {message.sources.length} TRACE{message.sources.length !== 1 ? 'S' : ''} DETECTED
            </button>
            {sourcesOpen && (
              <div className="mt-3 space-y-3 pl-1">
                {message.sources.map((src, i) => (
                  <div key={i} className="p-4 bg-background shadow-[var(--shadow-recessed)] text-[10px] text-mutedForeground font-mono rounded-xl border border-white/10 relative">
                    <span className="font-bold text-accent tracking-widest uppercase">SECTOR {(src.chunkIndex + 1).toString().padStart(2, '0')}</span>
                    <span className="text-[9px] ml-2 text-mutedForeground/80">[{(src.similarity * 100).toFixed(0)}% MATCH]</span>
                    <p className="mt-2 leading-relaxed italic border-l border-accent/40 pl-3">
                      {src.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
