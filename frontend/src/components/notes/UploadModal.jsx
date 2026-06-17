import { useState, useRef } from 'react';
import { Upload, X, FileText, AlertCircle } from 'lucide-react';
import { uploadNote } from '../../api/notes';
import Spinner from '../ui/Spinner';

const Screw = () => (
  <div className="w-2.5 h-2.5 rounded-full bg-background border border-borderDark flex items-center justify-center shadow-[inset_1px_1px_2.5px_rgba(0,0,0,0.2)] flex-shrink-0">
    <div className="w-1 h-[1px] bg-borderDark/70 rotate-[35deg]" />
  </div>
);

export default function UploadModal({ isOpen, onClose, onUploaded }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef();

  if (!isOpen) return null;

  const handleFile = (f) => {
    setError('');
    const allowed = ['application/pdf', 'text/plain'];
    if (!allowed.includes(f.type)) {
      setError('FORMAT NOT SUPPORTED. USE PDF/TXT.');
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError('PAYLOAD TOO LARGE. MAX SIZE: 10MB.');
      return;
    }
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      await uploadNote(formData);
      onUploaded();
      onClose();
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.error || 'UPLOAD FAILED. RETRY OPERATION.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-background w-full max-w-md animate-slide-up shadow-[0_12px_40px_rgba(0,0,0,0.15)] rounded-2xl p-6 relative border border-white/50" onClick={(e) => e.stopPropagation()}>
        
        {/* Floating card corner screws */}
        <div className="absolute top-2.5 left-2.5"><Screw /></div>
        <div className="absolute top-2.5 right-2.5"><Screw /></div>
        <div className="absolute bottom-2.5 left-2.5"><Screw /></div>
        <div className="absolute bottom-2.5 right-2.5"><Screw /></div>

        <div className="flex items-center justify-between mb-6 pt-1">
          <h2 className="text-base font-bold font-mono tracking-widest text-foreground uppercase">UPLOAD_DATA</h2>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-background flex items-center justify-center shadow-[var(--shadow-card)] border border-white/50 text-mutedForeground hover:text-accent active:translate-y-[1px] active:shadow-[var(--shadow-pressed)] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Recessed well dropzone */}
        <div
          className={`border border-dashed p-8 text-center cursor-pointer rounded-2xl transition-all duration-200 bg-background shadow-[var(--shadow-recessed)] ${
            dragOver ? 'border-accent' : 'border-border/80 hover:border-accent/60'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.txt"
            className="hidden"
            onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
          />
          
          <div className={`w-12 h-12 flex items-center justify-center mx-auto mb-4 border border-white/40 rounded-full transition-all duration-200 bg-background ${
            dragOver ? 'shadow-[var(--shadow-pressed)]' : 'shadow-[var(--shadow-card)]'
          }`}>
            <Upload className="w-5 h-5 text-accent" />
          </div>
          
          <p className="text-xs font-mono font-bold text-foreground mb-1 tracking-wider">
            {file ? file.name.toUpperCase() : 'AWAITING DATA INJECTION'}
          </p>
          <p className="text-[10px] font-mono text-mutedForeground tracking-widest uppercase">PDF_OR_TXT // LIMIT 10MB</p>
        </div>

        {file && (
          <div className="mt-4 flex items-center gap-3 p-3.5 bg-background shadow-[var(--shadow-card)] rounded-xl border border-white/40 font-mono">
            <FileText className="w-4 h-4 text-accent" />
            <span className="text-xs font-bold text-foreground truncate flex-1 uppercase tracking-wide">{file.name}</span>
            <span className="text-[10px] font-bold text-accent bg-background px-2 py-0.5 rounded shadow-[var(--shadow-sharp)] border border-white/30">
              {(file.size / 1024).toFixed(0)} KB
            </span>
            <button 
              onClick={() => setFile(null)} 
              className="text-mutedForeground hover:text-accent p-1 rounded-full bg-background shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-floating)] active:translate-y-[1px] active:shadow-[var(--shadow-pressed)] border border-white/30 transition-all"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 flex items-center gap-2.5 p-3.5 bg-background shadow-[var(--shadow-recessed)] border border-accent/20 rounded-xl text-xs font-mono font-bold text-accent">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-accent" />
            {error}
          </div>
        )}

        <div className="flex gap-4 mt-8">
          <button onClick={onClose} className="btn-secondary flex-1 text-xs" disabled={uploading}>ABORT</button>
          <button onClick={handleUpload} className="btn-primary flex-1 text-xs flex items-center justify-center gap-2" disabled={!file || uploading}>
            {uploading ? <><Spinner size="sm" className="text-white animate-spin" /> INJECTING...</> : 'EXECUTE UPLOAD'}
          </button>
        </div>
      </div>
    </div>
  );
}
