import { Link } from 'react-router-dom';
import { Brain, MessageSquare, Sparkles, Upload, ArrowRight, Shield, Zap, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-purple-50" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-100 text-brand-700 text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              AI-Powered Study Assistant
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
              Study smarter with{' '}
              <span className="gradient-text">AI-powered</span>{' '}
              notes
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              Upload your study notes, ask questions instantly with RAG-powered retrieval, and generate practice quizzes — all from your own content.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to={user ? '/dashboard' : '/signup'}
                className="btn-primary text-base px-8 py-3 flex items-center gap-2 shadow-lg shadow-brand-500/25"
              >
                {user ? 'Go to Dashboard' : 'Get Started Free'}
                <ArrowRight className="w-5 h-5" />
              </Link>
              {!user && (
                <Link to="/login" className="btn-secondary text-base px-8 py-3">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need to ace your studies</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">Powered by advanced AI to help you understand, retain, and test your knowledge.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Upload,
                title: 'Upload Notes',
                desc: 'Upload PDF or TXT files. Your notes are instantly processed, chunked, and embedded for intelligent retrieval.',
                color: 'from-blue-500 to-cyan-500',
              },
              {
                icon: MessageSquare,
                title: 'AI Q&A',
                desc: 'Ask questions and get accurate answers sourced directly from your notes. See exactly which sections were used.',
                color: 'from-brand-500 to-purple-500',
              },
              {
                icon: Sparkles,
                title: 'Practice Quizzes',
                desc: 'Generate tailored multiple-choice quizzes at your preferred difficulty. Test yourself and track progress.',
                color: 'from-purple-500 to-pink-500',
              },
            ].map((feature, i) => (
              <div key={i} className="card p-8 text-center group hover:-translate-y-1">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / Details */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'Secure & Private', desc: 'Your notes are encrypted and only accessible to you.' },
              { icon: Zap, title: 'Lightning Fast', desc: 'Powered by Groq LPU for instant AI responses.' },
              { icon: BookOpen, title: 'Source Citations', desc: 'Every answer shows exactly which notes were referenced.' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-6">
                <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-1">{item.title}</h4>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Brain className="w-4 h-4 text-brand-500" />
            AI Notes Assistant
          </div>
          <p className="text-xs text-slate-400">Built with React, Express, Prisma & Groq</p>
        </div>
      </footer>
    </div>
  );
}
