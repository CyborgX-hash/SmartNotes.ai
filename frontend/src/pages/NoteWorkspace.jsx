import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNote } from '../api/notes';
import { MessageSquare, Sparkles, FileText, ArrowLeft, Clock, Layers, Hash } from 'lucide-react';
import ChatPanel from '../components/chat/ChatPanel';
import QuizPanel from '../components/quiz/QuizPanel';
import Spinner from '../components/ui/Spinner';

const Screw = () => (
  <div className="w-3 h-3 rounded-full bg-background border border-borderDark flex items-center justify-center shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2),-1px_-1px_1px_rgba(255,255,255,0.7)] flex-shrink-0">
    <div className="w-1.5 h-[1.2px] bg-borderDark/80 rotate-[45deg]" />
  </div>
);

export default function NoteWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');
  const [error, setError] = useState('');

  useEffect(() => {
    getNote(id)
      .then((res) => setNote(res.data))
      .catch((err) => setError(err.response?.data?.error || 'Failed to load note'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-accent font-mono uppercase tracking-widest mb-4 font-bold">&gt; ERROR: {error}</p>
        <button onClick={() => navigate('/dashboard')} className="btn-secondary">SYSTEM REBOOT</button>
      </div>
    );
  }

  const tabs = [
    { id: 'chat', label: 'QUERY ENGINE', icon: MessageSquare },
    { id: 'quiz', label: 'VALIDATION', icon: Sparkles },
    { id: 'info', label: 'NODE DATA', icon: FileText },
  ];

  const date = new Date(note.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in relative z-10">
      
      {/* Header Deck */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="w-10 h-10 rounded-full bg-background flex items-center justify-center shadow-[var(--shadow-card)] border border-white/50 text-mutedForeground hover:text-accent active:translate-y-[2px] active:shadow-[var(--shadow-pressed)] transition-all"
          title="BACK TO DASHBOARD"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground uppercase truncate">{note.title}</h1>
          <div className="flex items-center gap-4 text-xs text-mutedForeground mt-1 font-mono uppercase tracking-widest select-none">
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{date}</span>
            <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" />{note._count?.chunks || 0} BLOCKS</span>
            <span className="px-2 py-0.5 rounded bg-background shadow-[var(--shadow-sharp)] text-accent font-mono text-[9px] font-bold border border-white/30">{note.fileType}</span>
          </div>
        </div>
      </div>

      {/* Tactile Control Switches */}
      <div className="flex gap-2.5 p-2 bg-background shadow-[var(--shadow-recessed)] rounded-2xl border border-white/10 mb-6 w-fit select-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 text-xs font-mono font-bold tracking-wider uppercase transition-all duration-150 rounded-xl ${
                isActive
                  ? 'bg-background text-accent shadow-[var(--shadow-pressed)]'
                  : 'bg-background text-mutedForeground hover:text-foreground shadow-[var(--shadow-card)] border border-white/40 active:translate-y-[1px] active:shadow-[var(--shadow-pressed)]'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Core Workspace Panel Block */}
      <div className="bg-background rounded-2xl shadow-[var(--shadow-card)] border border-white/50 overflow-hidden flex flex-col relative" style={{ minHeight: '60vh' }}>
        
        {/* Decorative corner screws for the plate frame */}
        <div className="absolute top-2.5 left-2.5"><Screw /></div>
        <div className="absolute top-2.5 right-2.5"><Screw /></div>
        
        <div className="flex-1 flex flex-col">
          {activeTab === 'chat' && <ChatPanel noteId={note.id} />}
          {activeTab === 'quiz' && <QuizPanel noteId={note.id} />}
          {activeTab === 'info' && (
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-border/40 pb-4">
                <h3 className="text-base font-bold font-mono tracking-widest uppercase text-accent">READOUT_TELEMETRY</h3>
                <span className="text-[10px] font-mono font-bold text-mutedForeground">DEVICE_ADDR: 0x44B</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                {[
                  { label: 'FILENAME', value: note.fileName, icon: FileText },
                  { label: 'FORMAT', value: note.fileType.toUpperCase(), icon: Hash },
                  { label: 'PAYLOAD', value: `${(note.fileSize / 1024).toFixed(1)} KB`, icon: Layers },
                  { label: 'TIMESTAMP', value: date, icon: Clock },
                  { label: 'BLOCKS', value: note._count?.chunks || 0, icon: Layers },
                  { label: 'QUERIES', value: note._count?.chatMessages || 0, icon: MessageSquare },
                  { label: 'TESTS', value: note._count?.quizzes || 0, icon: Sparkles },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-5 bg-background shadow-[var(--shadow-card)] rounded-xl border border-white/40 hover:shadow-[var(--shadow-floating)] transition-all group relative">
                    <div className="absolute top-2 left-2"><Screw /></div>
                    <div className="w-10 h-10 rounded-full bg-background shadow-[var(--shadow-recessed)] flex items-center justify-center flex-shrink-0 border border-white/10 group-hover:border-accent/40 transition-colors">
                      <item.icon className="w-5 h-5 text-accent" />
                    </div>
                    <div className="min-w-0">
                      <p className="stamped-label text-[9px] mb-0.5">{item.label}</p>
                      <p className="text-sm font-bold font-mono text-foreground truncate">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
