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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-800">Upload Notes</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            dragOver ? 'border-brand-400 bg-brand-50' : 'border-slate-200 hover:border-brand-300 hover:bg-slate-50'
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
          <Upload className="w-8 h-8 text-brand-400 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-700 mb-1">
            {file ? file.name : 'Drop your file here or click to browse'}
          </p>
          <p className="text-xs text-slate-400">PDF or TXT, up to 10MB</p>
        </div>

        {file && (
          <div className="mt-3 flex items-center gap-2 p-3 bg-brand-50 rounded-lg">
            <FileText className="w-4 h-4 text-brand-500" />
            <span className="text-sm text-slate-700 truncate flex-1">{file.name}</span>
            <span className="text-xs text-slate-400">{(file.size / 1024).toFixed(0)} KB</span>
            <button onClick={() => setFile(null)} className="text-slate-400 hover:text-red-500">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {error && (
          <div className="mt-3 flex items-center gap-2 p-3 bg-red-50 rounded-lg text-sm text-red-600">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="btn-secondary flex-1" disabled={uploading}>Cancel</button>
          <button onClick={handleUpload} className="btn-primary flex-1 flex items-center justify-center gap-2" disabled={!file || uploading}>
            {uploading ? <><Spinner size="sm" className="text-white" /> Processing...</> : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
}
