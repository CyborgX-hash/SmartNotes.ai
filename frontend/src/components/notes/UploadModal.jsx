import { useState, useRef } from 'react';
import { Upload, X, FileText, AlertCircle } from 'lucide-react';
import { uploadNote } from '../../api/notes';
import Spinner from '../ui/Spinner';

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
      setError('Only PDF and TXT files are supported.');
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError('File size must be under 10MB.');
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
      setError(err.response?.data?.error || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div className="glass-panel rounded-2xl w-full max-w-md p-6 border border-white/10 animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold font-heading text-white">Upload Notes</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
            dragOver ? 'border-brand-500 bg-brand-500/10' : 'border-white/10 hover:border-brand-500/30 hover:bg-white/5'
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
          <div className="w-14 h-14 rounded-full bg-brand-500/10 flex items-center justify-center mx-auto mb-4 border border-brand-500/20 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
            <Upload className="w-6 h-6 text-brand-400" />
          </div>
          <p className="text-sm font-medium text-slate-200 mb-1.5 font-heading">
            {file ? file.name : 'Drop your file here or click to browse'}
          </p>
          <p className="text-xs text-slate-500">PDF or TXT, up to 10MB</p>
        </div>

        {file && (
          <div className="mt-4 flex items-center gap-3 p-3 bg-brand-500/10 border border-brand-500/20 rounded-lg">
            <FileText className="w-5 h-5 text-brand-400" />
            <span className="text-sm text-slate-200 truncate flex-1 font-medium">{file.name}</span>
            <span className="text-xs text-brand-300 bg-brand-500/20 px-2 py-1 rounded-md">{(file.size / 1024).toFixed(0)} KB</span>
            <button onClick={() => setFile(null)} className="text-slate-400 hover:text-red-400 p-1 rounded-md hover:bg-white/10 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="flex gap-4 mt-6">
          <button onClick={onClose} className="btn-secondary flex-1" disabled={uploading}>Cancel</button>
          <button onClick={handleUpload} className="btn-primary flex-1 flex items-center justify-center gap-2" disabled={!file || uploading}>
            {uploading ? <><Spinner size="sm" className="text-white" /> Processing...</> : 'Upload Note'}
          </button>
        </div>
      </div>
    </div>
  );
}
