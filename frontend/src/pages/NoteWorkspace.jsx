import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNote } from '../api/notes';
import { MessageSquare, Sparkles, FileText, ArrowLeft, Clock, Layers, Hash } from 'lucide-react';
import ChatPanel from '../components/chat/ChatPanel';
import QuizPanel from '../components/quiz/QuizPanel';
import Spinner from '../components/ui/Spinner';

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
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={() => navigate('/dashboard')} className="btn-secondary">Back to Dashboard</button>
      </div>
    );
  }

  const tabs = [
    { id: 'chat', label: 'Q&A', icon: MessageSquare },
    { id: 'quiz', label: 'Quiz', icon: Sparkles },
    { id: 'info', label: 'Info', icon: FileText },
  ];

  const date = new Date(note.createdAt).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/dashboard')} className="btn-ghost p-2">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold font-heading text-white truncate drop-shadow-sm">{note.title}</h1>
          <div className="flex items-center gap-4 text-sm text-slate-400 mt-1 font-medium">
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{date}</span>
            <span className="flex items-center gap-1.5"><Layers className="w-4 h-4" />{note._count?.chunks || 0} chunks</span>
            <span className="uppercase text-xs font-bold px-2 py-0.5 rounded bg-brand-500/10 text-brand-300 border border-brand-500/20">{note.fileType}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 glass-panel rounded-xl mb-6 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-brand-500/20 text-brand-300 shadow-[0_0_10px_rgba(139,92,246,0.2)] border border-brand-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="card overflow-hidden" style={{ minHeight: '60vh' }}>
        {activeTab === 'chat' && <ChatPanel noteId={note.id} />}
        {activeTab === 'quiz' && <QuizPanel noteId={note.id} />}
        {activeTab === 'info' && (
          <div className="p-8 space-y-6">
            <h3 className="text-xl font-semibold font-heading text-white">Note Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { label: 'File Name', value: note.fileName, icon: FileText },
                { label: 'File Type', value: note.fileType.toUpperCase(), icon: Hash },
                { label: 'File Size', value: `${(note.fileSize / 1024).toFixed(1)} KB`, icon: Layers },
                { label: 'Uploaded', value: date, icon: Clock },
                { label: 'Total Chunks', value: note._count?.chunks || 0, icon: Layers },
                { label: 'Chat Messages', value: note._count?.chatMessages || 0, icon: MessageSquare },
                { label: 'Quizzes Generated', value: note._count?.quizzes || 0, icon: Sparkles },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-5 glass-panel rounded-xl hover:border-brand-500/30 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center shadow-[0_0_10px_rgba(139,92,246,0.1)]">
                    <item.icon className="w-5 h-5 text-brand-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-0.5 uppercase tracking-wider font-semibold">{item.label}</p>
                    <p className="text-base font-semibold text-white">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
