import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { signup as signupApi } from '../api/auth';
import { Terminal, AlertCircle } from 'lucide-react';
import Spinner from '../components/ui/Spinner';

const Screw = () => (
  <div className="w-2.5 h-2.5 rounded-full bg-background border border-borderDark flex items-center justify-center shadow-[inset_1px_1px_2.5px_rgba(0,0,0,0.2)] flex-shrink-0">
    <div className="w-1 h-[1px] bg-borderDark/70 rotate-[35deg]" />
  </div>
);

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('ACCESS_CODE must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await signupApi(form);
      loginUser(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Resource allocation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden bg-background">
      <div className="w-full max-w-md animate-slide-up relative z-10">
        
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-background flex items-center justify-center mx-auto mb-5 rounded-full shadow-[var(--shadow-card)] border border-white/50">
            <Terminal className="w-5 h-5 text-accent" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground font-mono select-none uppercase">CREATE ACCOUNT</h1>
          <p className="stamped-label mt-1.5 select-none">REGISTER NEW USER IDENTIFIER</p>
        </div>

        <div className="bg-background rounded-2xl shadow-[var(--shadow-card)] border border-white/50 p-8 relative">
          
          {/* Deck panel screws */}
          <div className="absolute top-2.5 left-2.5"><Screw /></div>
          <div className="absolute top-2.5 right-2.5"><Screw /></div>
          <div className="absolute bottom-2.5 left-2.5"><Screw /></div>
          <div className="absolute bottom-2.5 right-2.5"><Screw /></div>

          {error && (
            <div className="flex items-center gap-2.5 p-3.5 mb-6 bg-background shadow-[var(--shadow-recessed)] border border-accent/20 rounded-xl text-xs font-mono font-bold text-accent">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="stamped-label mb-2 block">USER_NAME</label>
              <input
                type="text"
                className="input-field text-xs pl-5"
                placeholder="Mute"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="stamped-label mb-2 block">USER_EMAIL</label>
              <input
                type="email"
                className="input-field text-xs pl-5"
                placeholder="usr@system.local"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="stamped-label mb-2 block">ACCESS_CODE</label>
              <input
                type="password"
                className="input-field text-xs pl-5"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 mt-6 text-xs font-mono font-bold">
              {loading ? <><Spinner size="sm" className="text-white animate-spin" /> REGISTERING...</> : 'CREATE ACCOUNT'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs font-mono text-mutedForeground mt-8 tracking-widest uppercase">
          ALREADY SIGNED UP?{' '}
          <Link to="/login" className="text-accent font-bold hover:underline">AUTHENTICATE</Link>
        </p>
      </div>
    </div>
  );
}
