import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Brain, LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel border-x-0 border-t-0 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-heading font-bold text-white tracking-wide">
              AnalyseNotes<span className="text-brand-500">.ai</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link to="/dashboard" className="btn-ghost flex items-center gap-2 text-sm">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <div className="h-6 w-px bg-white/20" />
                <span className="text-sm text-slate-400 hidden sm:block font-medium">{user.name}</span>
                <button onClick={handleLogout} className="btn-ghost flex items-center gap-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm">Log in</Link>
                <Link to="/signup" className="btn-primary text-sm">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
