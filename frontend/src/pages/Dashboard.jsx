import { useState, useEffect, useCallback } from 'react';
import { Plus, FileText, RefreshCw } from 'lucide-react';
import { getNotes, deleteNote } from '../api/notes';
import { useAuth } from '../contexts/AuthContext';
import NoteCard from '../components/notes/NoteCard';
import UploadModal from '../components/notes/UploadModal';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';

const Screw = () => (
  <div className="w-3 h-3 rounded-full bg-background border border-borderDark flex items-center justify-center shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2),-1px_-1px_1px_rgba(255,255,255,0.7)] flex-shrink-0">
    <div className="w-1.5 h-[1.2px] bg-borderDark/80 rotate-[45deg]" />
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  const fetchNotes = useCallback(async () => {
    try {
      const res = await getNotes();
      setNotes(res.data);
    } catch (err) {
      console.error('Failed to fetch notes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleDelete = async (id) => {
    if (!confirm('CONFIRM PERMANENT DELETE? THIS DOCUMENT WILL BE REMOVED FROM INTERNAL MEMORY.')) return;
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error('Failed to delete document:', err);
    }
  };

  const handleUploaded = () => {
    fetchNotes();
  };

  // Auto-refresh for processing notes
  useEffect(() => {
    const hasProcessing = notes.some((n) => n.status === 'PROCESSING');
    if (!hasProcessing) return;
    const interval = setInterval(fetchNotes, 5000);
    return () => clearInterval(interval);
  }, [notes, fetchNotes]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in relative z-10">
      
      {/* Console Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-background shadow-[var(--shadow-card)] rounded-2xl border border-white/50 p-6 relative">
        <div className="absolute top-3 left-3"><Screw /></div>
        <div className="absolute top-3 right-3"><Screw /></div>
        
        <div className="pl-0 sm:pl-4">
          <h1 className="text-xl font-bold tracking-tight text-foreground font-mono">
            ACTIVE_USER: <span className="text-accent">{user?.name?.split(' ')[0]?.toUpperCase()}</span>
          </h1>
          <p className="stamped-label mt-1.5 flex items-center gap-1.5 select-none">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[var(--shadow-glow-green)] animate-pulse-fast" />
            {notes.length} INDEXED RECORD{notes.length !== 1 ? 'S' : ''} AWAITING QUERY
          </p>
        </div>
        <div className="flex items-center gap-3 pr-0 sm:pr-4">
          <button 
            onClick={fetchNotes} 
            className="btn-secondary p-3 rounded-xl shadow-[var(--shadow-card)] border border-white/50" 
            title="REFRESH LIST"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={() => setShowUpload(true)} className="btn-primary text-xs font-mono font-bold px-4 py-2.5">
            <Plus className="w-4 h-4" />
            INJECT NEW DATA
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : notes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="NO DOCUMENT RECORDS FOUND"
          description="UPLOAD A PDF OR TXT DOCUMENT TO BEGIN SEARCH PROTOCOLS."
          action={
            <button onClick={() => setShowUpload(true)} className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" />
              INJECT FIRST NODE
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <UploadModal isOpen={showUpload} onClose={() => setShowUpload(false)} onUploaded={handleUploaded} />
    </div>
  );
}
