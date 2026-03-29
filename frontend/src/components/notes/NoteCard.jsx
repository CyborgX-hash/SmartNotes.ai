import { useNavigate } from 'react-router-dom';
import { FileText, Trash2, Clock, Layers, Loader2, AlertCircle } from 'lucide-react';

const statusConfig = {
  PROCESSING: { label: 'Processing', color: 'bg-amber-100 text-amber-700', icon: Loader2 },
  READY: { label: 'Ready', color: 'bg-emerald-100 text-emerald-700', icon: null },
  FAILED: { label: 'Failed', color: 'bg-red-100 text-red-700', icon: AlertCircle },
};

export default function NoteCard({ note, onDelete }) {
  const navigate = useNavigate();
  const status = statusConfig[note.status] || statusConfig.PROCESSING;
  const StatusIcon = status.icon;
  const date = new Date(note.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <div
      className="card p-5 cursor-pointer group"
      onClick={() => note.status === 'READY' && navigate(`/notes/${note.id}`)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
          <FileText className="w-6 h-6 text-brand-400" />
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all"
          title="Delete note"
        >
          <Trash2 className="w-4 h-4 text-red-400" />
        </button>
      </div>

      <h3 className="font-semibold text-white mb-1.5 truncate font-heading text-lg">{note.title}</h3>
      <p className="text-sm text-slate-400 mb-4 truncate">{note.fileName}</p>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{date}</span>
          {note._count?.chunks > 0 && (
            <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" />{note._count.chunks} chunks</span>
          )}
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${status.color}`}>
          {StatusIcon && <StatusIcon className="w-3 h-3 animate-spin" />}
          {status.label}
        </span>
      </div>
    </div>
  );
}
