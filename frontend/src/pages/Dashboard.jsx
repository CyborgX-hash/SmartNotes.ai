import { useState, useEffect, useCallback } from 'react';
import { Plus, FileText, RefreshCw } from 'lucide-react';
import { getNotes, deleteNote } from '../api/notes';
import { useAuth } from '../contexts/AuthContext';
import NoteCard from '../components/notes/NoteCard';
import UploadModal from '../components/notes/UploadModal';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';

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
    if (!confirm('Are you sure you want to delete this note?')) return;
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error('Failed to delete note:', err);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-heading text-white tracking-wide">Welcome back, {user?.name?.split(' ')[0]}</h1>
          <p className="text-slate-400 mt-2">{notes.length} note{notes.length !== 1 ? 's' : ''} uploaded</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchNotes} className="btn-ghost p-2" title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={() => setShowUpload(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Upload Notes
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
          title="No notes uploaded yet"
          description="Upload your study notes to start asking questions and generating quizzes."
          action={
            <button onClick={() => setShowUpload(true)} className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Upload Your First Note
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <UploadModal isOpen={showUpload} onClose={() => setShowUpload(false)} onUploaded={handleUploaded} />
    </div>
  );
}
