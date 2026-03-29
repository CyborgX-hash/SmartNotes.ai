import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, ChevronDown, ChevronRight, BookOpen } from 'lucide-react';
import { askQuestion, getChatHistory } from '../../api/chat';
import Spinner from '../ui/Spinner';
import EmptyState from '../ui/EmptyState';

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
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.', id: Date.now() + 1 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (historyLoading) {
    return <div className="flex items-center justify-center py-16"><Spinner /></div>;
  }

  return (
    <div className="flex flex-col h-full bg-[#0a0a0f]/50">
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.length === 0 ? (
          <EmptyState
            icon={Bot}
            title="Ask anything about your notes"
            description="Your AI assistant will find answers from your uploaded content."
          />
        ) : (
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)
        )}
        {loading && (
          <div className="flex items-center gap-3 p-4">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.15)] flex-shrink-0">
              <Bot className="w-5 h-5 text-brand-400" />
            </div>
            <div className="flex gap-1.5 p-4 rounded-2xl bg-white/5 border border-white/5 rounded-tl-sm">
              <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-white/10 p-4 sm:p-6 bg-[#050505]">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <input
            className="input-field flex-1"
            placeholder="Ask a question about your notes..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            disabled={loading}
          />
          <button onClick={handleSend} disabled={!input.trim() || loading} className="btn-primary px-5 py-3 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
            <Send className="w-5 h-5" />
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
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${
        isUser ? 'bg-purple-500/10 border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]' : 'bg-brand-500/10 border-brand-500/20 shadow-[0_0_15px_rgba(139,92,246,0.15)]'
      }`}>
        {isUser ? <User className="w-5 h-5 text-purple-400" /> : <Bot className="w-5 h-5 text-brand-400" />}
      </div>
      <div className={`max-w-[80%] ${isUser ? 'text-right' : ''}`}>
        <div className={`rounded-2xl px-5 py-3.5 text-sm leading-relaxed ${
          isUser ? 'bg-purple-600 text-white rounded-tr-sm shadow-[0_4px_15px_rgba(147,51,234,0.2)]' : 'glass-panel border border-white/10 text-slate-200 rounded-tl-sm'
        }`}>
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        {message.sources?.length > 0 && (
          <div className="mt-3">
            <button
              onClick={() => setSourcesOpen(!sourcesOpen)}
              className="flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors"
            >
              {sourcesOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              <BookOpen className="w-3.5 h-3.5" />
              {message.sources.length} source{message.sources.length !== 1 ? 's' : ''} used
            </button>
            {sourcesOpen && (
              <div className="mt-3 space-y-3">
                {message.sources.map((src, i) => (
                  <div key={i} className="p-4 bg-black/40 rounded-xl text-xs text-slate-400 border border-brand-500/20 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
                    <span className="font-semibold text-brand-400 font-heading">Chunk {src.chunkIndex + 1}</span>
                    <span className="text-slate-500 ml-2">({(src.similarity * 100).toFixed(0)}% match)</span>
                    <p className="mt-2 line-clamp-4 leading-relaxed italic border-l-2 border-brand-500/30 pl-3">{src.content}</p>
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
