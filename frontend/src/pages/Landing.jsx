import { Link } from 'react-router-dom';
import { Terminal, MessageSquare, Sparkles, Upload, ArrowRight, Shield, Zap, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Screw = () => (
  <div className="w-3 h-3 rounded-full bg-background border border-borderDark flex items-center justify-center shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2),-1px_-1px_1px_rgba(255,255,255,0.7)] flex-shrink-0">
    <div className="w-1.5 h-[1.2px] bg-borderDark/80 rotate-[45deg]" />
  </div>
);

const CardVents = () => (
  <div className="flex gap-1">
    <div className="h-5 w-1 rounded-full bg-muted shadow-[inset_1px_1px_2px_rgba(0,0,0,0.15)]" />
    <div className="h-5 w-1 rounded-full bg-muted shadow-[inset_1px_1px_2px_rgba(0,0,0,0.15)]" />
    <div className="h-5 w-1 rounded-full bg-muted shadow-[inset_1px_1px_2px_rgba(0,0,0,0.15)]" />
  </div>
);

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="animate-fade-in relative min-h-[calc(100vh-4rem)] bg-background pb-20">
      {/* Blueprint grid background */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          backgroundImage: `
            linear-gradient(var(--border) 1px, transparent 1px),
            linear-gradient(90deg, var(--border) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          opacity: 0.15
        }}
      />

      {/* Hero section */}
      <section className="relative pt-12 md:pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Text & CTA */}
          <div className="lg:col-span-7 flex flex-col text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-background shadow-[var(--shadow-recessed)] rounded-lg self-start mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[var(--shadow-glow-green)] animate-pulse-fast" />
              <span className="text-[11px] font-bold tracking-widest font-mono text-mutedForeground">SYS_READY // CORE: 0x99A</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-6 leading-tight select-none">
              DECODE YOUR <br />
              <span className="text-accent drop-shadow-[0_1px_0_#ffffff]">STUDY DATA</span>
            </h1>

            <p className="text-base sm:text-lg text-mutedForeground mb-8 max-w-2xl leading-relaxed">
              Analyze documents in real-time, retrieve instant contextual responses, and automatically build validation practice tests. Grounded, modular, and built on high-fidelity skeuomorphic standards.
            </p>

            {/* Recessed manual summary screen */}
            <div className="bg-background shadow-[var(--shadow-recessed)] rounded-2xl p-6 mb-8 border border-white/20">
              <p className="text-sm font-mono leading-relaxed text-mutedForeground space-y-2">
                <span className="block"><span className="text-accent font-bold">// INGESTION:</span> PDF/TXT files are embedded instantly.</span>
                <span className="block"><span className="text-accent font-bold">// RETRIEVAL:</span> Queries execute directly against localized vectors.</span>
                <span className="block"><span className="text-accent font-bold">// SEQUENCE:</span> Automatic evaluation matrix generation.</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                to={user ? '/dashboard' : '/signup'}
                className="btn-primary text-base px-6 py-3.5 w-full sm:w-auto"
              >
                {user ? 'ACCESS TELEMETRY' : 'INITIALIZE CONNECTION'}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
              {!user && (
                <Link to="/login" className="btn-secondary text-base px-6 py-3.5 w-full sm:w-auto">
                  AUTHENTICATE
                </Link>
              )}
            </div>
          </div>

          {/* Right: Interactive CSS 3D CRT Device Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-[420px] bg-card border border-white/60 shadow-[var(--shadow-floating)] rounded-3xl p-6 relative flex flex-col gap-6">
              
              {/* Corner Screws on Device */}
              <div className="absolute top-3 left-3"><Screw /></div>
              <div className="absolute top-3 right-3"><Screw /></div>
              <div className="absolute bottom-3 left-3"><Screw /></div>
              <div className="absolute bottom-3 right-3"><Screw /></div>

              {/* Top status bar of device */}
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-mono font-bold tracking-widest text-mutedForeground">CONSOLE_UNIT_v1.02</span>
                <CardVents />
              </div>

              {/* Recessed Bezel & CRT Screen */}
              <div className="bg-background shadow-[var(--shadow-recessed)] rounded-2xl p-4 border border-white/30">
                <div className="crt-screen aspect-video p-3 flex flex-col justify-between font-mono text-[11px] text-emerald-400">
                  
                  {/* Top telemetry in CRT */}
                  <div className="flex justify-between border-b border-emerald-950 pb-1.5 opacity-80">
                    <span>SYS_LOAD: 14.2%</span>
                    <span>TEMP: 38°C</span>
                  </div>

                  {/* Mid dashboard graph/status */}
                  <div className="my-2 space-y-1">
                    <div className="text-emerald-300 font-bold opacity-90">// INGESTION PROTOCOLS ACTIVE</div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-emerald-500 font-bold">&gt;</span>
                      <span className="animate-pulse">Awaiting document payload...</span>
                    </div>
                    {/* Simulated terminal lines */}
                    <div className="text-emerald-500/80 text-[10px]">
                      [LOG 22:42:01] Vector index initialized.<br />
                      [LOG 22:42:02] Model listener socket: ONLINE.
                    </div>
                  </div>

                  {/* Bottom metrics */}
                  <div className="flex justify-between text-[10px] pt-1.5 border-t border-emerald-950/80 opacity-70">
                    <span>CHUNKS: 0/0</span>
                    <span>VEC_STORE: OK</span>
                  </div>
                </div>
              </div>

              {/* Physical control buttons deck */}
              <div className="flex items-center justify-between bg-background shadow-[var(--shadow-recessed)] p-4 rounded-2xl border border-white/20">
                
                {/* Red mechanical dial dial button */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent border border-accent/20 flex items-center justify-center shadow-[var(--shadow-card),inset_1px_1px_2px_rgba(255,255,255,0.4)] active:shadow-[var(--shadow-pressed)]">
                    <div className="w-1.5 h-4 bg-white/40 rounded-full" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-mutedForeground">GAIN</span>
                </div>

                {/* Stamped paper label tape */}
                <div className="skew-x-6 bg-yellow-200/80 border border-yellow-300 px-3 py-1 text-[10px] font-bold font-mono text-yellow-800 shadow-[var(--shadow-sharp)] select-none">
                  SECURE_NODE
                </div>

                {/* Toggle status LEDs */}
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[var(--shadow-glow-green)]" />
                    <span className="text-[8px] font-mono font-black text-mutedForeground">PWR</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="text-[8px] font-mono font-black text-mutedForeground">RAG</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Features section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-4">
            CORE TELEMETRY MODULES
          </h2>
          <p className="text-mutedForeground max-w-xl mx-auto">
            Engineered micro-utilities dedicated to cognitive expansion and study workflow validation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Upload,
              title: 'DATA INGESTION',
              desc: 'Inject PDF or TXT logs into vector slots. Data is partitioned and tokenized within milliseconds.',
            },
            {
              icon: MessageSquare,
              title: 'QUERY SYSTEM',
              desc: 'Interrogate RAG models using plain language queries. Returns precise text block extractions.',
            },
            {
              icon: Sparkles,
              title: 'EVAL SEQUENCE',
              desc: 'Compile memory evaluation matrices automatically to examine knowledge retention limits.',
            },
          ].map((feature, i) => (
            <div key={i} className="card flex flex-col h-full gap-5">
              {/* Card structural elements */}
              <div className="absolute top-3.5 left-3.5"><Screw /></div>
              <div className="absolute top-3.5 right-3.5"><Screw /></div>
              <div className="absolute top-3.5 right-10"><CardVents /></div>

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-[var(--shadow-recessed)] border border-white/20 mt-6 mb-2">
                <feature.icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-lg font-bold tracking-tight text-foreground font-mono">
                {feature.title}
              </h3>
              <p className="text-sm text-mutedForeground leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Conduit pipe visualization & Details */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="panel-card flex flex-col md:flex-row items-stretch gap-6 relative overflow-hidden">
          
          <div className="absolute top-3 left-3"><Screw /></div>
          <div className="absolute top-3 right-3"><Screw /></div>

          {[
            { icon: Shield, title: 'DATA SECURITY', desc: 'Secure local workspace file sandboxing.' },
            { icon: Zap, title: 'SPEED CORE', desc: 'High-speed model execution query pipeline.' },
            { icon: BookOpen, title: 'METRIC TRACE', desc: 'Verified reference links for all answers.' },
          ].map((item, i) => (
            <div key={i} className="flex-1 flex flex-col p-4 bg-background shadow-[var(--shadow-recessed)] rounded-xl border border-white/10 gap-3">
              <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center shadow-[var(--shadow-card)] border border-white/40">
                <item.icon className="w-4 h-4 text-accent" />
              </div>
              <h4 className="text-sm font-bold tracking-wider font-mono text-foreground">{item.title}</h4>
              <p className="text-xs text-mutedForeground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 pt-10 border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 pb-8">
          <div className="flex items-center gap-3 text-mutedForeground font-mono text-sm font-bold">
            <Terminal className="w-4 h-4 text-accent" />
            ANALYSE_NOTES // v1.02
          </div>
          <p className="text-xs font-mono tracking-widest text-mutedForeground uppercase">
            ESTABLISHED CONTEXT // END OF DATA
          </p>
        </div>
      </footer>
    </div>
  );
}
