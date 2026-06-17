import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Terminal, LogOut, LayoutDashboard } from 'lucide-react';

const Screw = () => (
  <div className="w-3.5 h-3.5 rounded-full bg-background border border-borderDark flex items-center justify-center shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2),-1px_-1px_1px_rgba(255,255,255,0.7)] flex-shrink-0">
    <div className="w-1.5 h-[1.5px] bg-borderDark/80 rotate-[30deg]" />
  </div>
);

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border shadow-[0_4px_12px_-4px_rgba(186,190,204,0.8)] px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 relative">
        {/* Left Screw decoration */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 hidden lg:block">
          <Screw />
        </div>

        <div className="flex items-center gap-3 pl-0 lg:pl-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full bg-background flex items-center justify-center shadow-[var(--shadow-card)] border border-white/50 transition-all duration-200 group-hover:shadow-[var(--shadow-floating)]">
              <Terminal className="w-4 h-4 text-accent" />
            </div>
            <span className="text-lg font-bold tracking-wider text-foreground font-mono flex select-none">
              ANALYSE<span className="text-accent ml-1.5">//</span><span className="text-mutedForeground ml-1.5 font-sans font-bold">NOTES</span>
            </span>
          </Link>

          {/* LED Status Indicator */}
          <div className="hidden md:flex items-center gap-2 ml-6 px-3 py-1 bg-background shadow-[var(--shadow-recessed)] rounded-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[var(--shadow-glow-green)] animate-pulse-fast" />
            <span className="text-[10px] font-bold tracking-widest font-mono text-mutedForeground">SYS_ACTIVE</span>
          </div>
        </div>

        <div className="flex items-center gap-3 pr-0 lg:pr-6 relative z-10">
          {user ? (
            <>
              <Link to="/dashboard" className="btn-ghost flex items-center gap-1.5 text-xs font-mono font-bold">
                <LayoutDashboard className="w-4 h-4" />
                DASHBOARD
              </Link>
              <div className="h-5 w-[1.5px] bg-border/60 mx-1" />
              <span className="text-xs text-mutedForeground hidden sm:inline-block font-mono font-bold tracking-wide">
                SYS_USR: {user.name.split(' ')[0].toUpperCase()}
              </span>
              <button onClick={handleLogout} className="btn-ghost flex items-center gap-1.5 text-xs font-mono font-bold !text-accent hover:!bg-accent/10">
                <LogOut className="w-4 h-4" />
                DISCONNECT
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost text-xs font-mono font-bold">AUTHENTICATE</Link>
              <Link to="/signup" className="btn-primary text-xs font-bold px-4 py-2.5 rounded-lg">INITIALIZE</Link>
            </>
          )}
        </div>

        {/* Right Screw decoration */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:block">
          <Screw />
        </div>
      </div>
    </nav>
  );
}
