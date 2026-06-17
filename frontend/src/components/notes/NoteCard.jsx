import { useNavigate } from 'react-router-dom';
import { FileText, Trash2, Clock, Layers, Loader2, AlertCircle } from 'lucide-react';

const Screw = () => (
  <div className="w-2.5 h-2.5 rounded-full bg-background border border-borderDark flex items-center justify-center shadow-[inset_1px_1px_2.5px_rgba(0,0,0,0.2)] flex-shrink-0">
    <div className="w-1 h-[1px] bg-borderDark/70 rotate-[35deg]" />
  </div>
);

const statusConfig = {
  PROCESSING: { label: 'RUNNING', ledColor: 'bg-amber-500 shadow-[0_0_8px_1px_rgba(245,158,11,0.6)] animate-pulse-fast', icon: Loader2 },
  READY: { label: 'READY', ledColor: 'bg-emerald-500 shadow-[var(--shadow-glow-green)]', icon: null },
  FAILED: { label: 'FAIL', ledColor: 'bg-red-500 shadow-[var(--shadow-glow)]', icon: AlertCircle },
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
      className="card cursor-pointer group hover:bg-card/50 hover:shadow-[var(--shadow-floating)] active:translate-y-[1px] transition-all relative pt-8 pb-5 px-6 border border-white/40"
      onClick={() => note.status === 'READY' && navigate(`/notes/${note.id}`)}
    >
      {/* Mini Screws in corners */}
      <div className="absolute top-2.5 left-2.5"><Screw /></div>
      <div className="absolute top-2.5 right-2.5"><Screw /></div>

      <div className="flex items-start justify-between mb-4">
        {/* Recessed Icon Housing */}
        <div className="w-11 h-11 bg-background shadow-[var(--shadow-recessed)] rounded-full flex items-center justify-center border border-white/20">
          <FileText className="w-5 h-5 text-accent transition-transform duration-200 group-hover:scale-105" />
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
          className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-full bg-background flex items-center justify-center shadow-[var(--shadow-card)] border border-white/50 text-mutedForeground hover:text-accent active:translate-y-[1px] active:shadow-[var(--shadow-pressed)] transition-all z-10"
          title="DELETE RECORD"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <h3 className="font-bold tracking-tight text-foreground text-base mb-1.5 truncate pr-4 group-hover:text-accent transition-colors font-mono">
        {note.title.toUpperCase()}
      </h3>
      <p className="font-mono text-[11px] text-mutedForeground mb-5 truncate leading-none">
        FILE: {note.fileName}
      </p>

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/20 select-none">
        <div className="flex items-center gap-3.5 text-[10px] font-mono text-mutedForeground">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{date}</span>
          {note._count?.chunks > 0 && (
            <span className="flex items-center gap-1"><Layers className="w-3 h-3" />{note._count.chunks} BLK</span>
          )}
        </div>
        
        {/* LED Stamped Label */}
        <span className="text-[9px] px-2.5 py-1 rounded bg-background shadow-[var(--shadow-sharp)] border border-white/30 font-mono font-bold text-mutedForeground tracking-widest flex items-center gap-1.5">
          {StatusIcon ? (
            <StatusIcon className="w-2.5 h-2.5 animate-spin text-amber-500" />
          ) : (
            <span className={`w-1.5 h-1.5 rounded-full ${status.ledColor} flex-shrink-0`} />
          )}
          {status.label}
        </span>
      </div>
    </div>
  );
}
