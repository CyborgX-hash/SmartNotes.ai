import { Link } from 'react-router-dom';
import { Brain, MessageSquare, Sparkles, Upload, ArrowRight, Shield, Zap, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="animate-fade-in relative">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[30%] h-[40%] bg-accent-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-32">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-sm font-medium mb-8 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
              <Zap className="w-4 h-4 text-accent-400" />
              Next-Gen AI Notes Assistant
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-8">
              Analyze your notes with{' '}
              <span className="gradient-text">pure intelligence</span>
            </h1>

            <p className="text-xl sm:text-2xl text-slate-400 mb-12 leading-relaxed max-w-3xl mx-auto font-light">
              Upload your study material, ask questions instantly with advanced RAG models, and generate dynamic practice quizzes tailored to your needs.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                to={user ? '/dashboard' : '/signup'}
                className="btn-primary text-lg px-8 py-4 flex items-center gap-2"
              >
                {user ? 'Go to Dashboard' : 'Get Started Free'}
                <ArrowRight className="w-5 h-5" />
              </Link>
              {!user && (
                <Link to="/login" className="btn-secondary text-lg px-8 py-4">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Unleash the power of AI</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">Advanced intelligence to help you understand complex topics in seconds.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Upload,
                title: 'Instant Processing',
                desc: 'Upload PDF or TXT. Your material is securely chunked and embedded in milliseconds.',
                color: 'from-accent-500 to-blue-600',
              },
              {
                icon: MessageSquare,
                title: 'Intelligent Q&A',
                desc: 'Ask complex questions. Get precise answers directly sourced from your documents.',
                color: 'from-brand-400 to-brand-600',
              },
              {
                icon: Sparkles,
                title: 'Dynamic Quizzes',
                desc: 'Auto-generate multiple-choice tests to evaluate your knowledge and track progress.',
                color: 'from-purple-500 to-pink-500',
              },
            ].map((feature, i) => (
              <div key={i} className="card p-10 group text-center border-white/5 hover:border-brand-500/40">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(139,92,246,0.3)] group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 font-heading">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed text-lg">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / Details */}
      <section className="py-24 relative border-t border-white/5 bg-[#0a0a0a]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: 'Secure & Private', desc: 'Military-grade encryption protects your private study materials.' },
              { icon: Zap, title: 'Lightning Fast', desc: 'Powered by ultra-fast LPU inference for instantaneous responses.' },
              { icon: BookOpen, title: 'Exact Citations', desc: 'Every answer highlights exactly which page was referenced.' },
            ].map((item, i) => (
              <div key={i} className="glass-panel p-8 rounded-2xl flex items-start gap-5 hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-brand-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-lg mb-2 font-heading">{item.title}</h4>
                  <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-white/10 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-slate-500 font-medium">
            <Brain className="w-5 h-5 text-brand-500" />
            AnalyseNotes<span className="text-brand-500">.ai</span>
          </div>
          <p className="text-sm text-slate-600">Built for the future of learning.</p>
        </div>
      </footer>
    </div>
  );
}
