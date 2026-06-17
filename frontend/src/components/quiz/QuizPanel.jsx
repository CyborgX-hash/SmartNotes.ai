import { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';
import { generateQuiz } from '../../api/chat';
import Spinner from '../ui/Spinner';
import EmptyState from '../ui/EmptyState';

const Screw = () => (
  <div className="w-2.5 h-2.5 rounded-full bg-background border border-borderDark flex items-center justify-center shadow-[inset_1px_1px_2.5px_rgba(0,0,0,0.2)] flex-shrink-0">
    <div className="w-1 h-[1px] bg-borderDark/70 rotate-[35deg]" />
  </div>
);

export default function QuizPanel({ noteId }) {
  const [difficulty, setDifficulty] = useState('medium');
  const [numQuestions, setNumQuestions] = useState(5);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAllAnswers, setShowAllAnswers] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [revealedAnswers, setRevealedAnswers] = useState({});

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setQuiz(null);
    setSelectedAnswers({});
    setRevealedAnswers({});
    setShowAllAnswers(false);

    try {
      const res = await generateQuiz(noteId, { difficulty, numQuestions });
      setQuiz(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'SYSTEM ERROR: UNABLE TO COMPILE VALIDATION SEQUENCE.');
    } finally {
      setLoading(false);
    }
  };

  const selectOption = (qIndex, option) => {
    if (revealedAnswers[qIndex] || showAllAnswers) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIndex]: option }));
  };

  const revealAnswer = (qIndex) => {
    setRevealedAnswers((prev) => ({ ...prev, [qIndex]: true }));
  };

  return (
    <div className="p-4 sm:p-6 space-y-8 bg-background relative z-0 h-full overflow-y-auto max-h-[60vh] scrollbar-hide">
      
      {/* Settings Module */}
      <div className="bg-background rounded-2xl shadow-[var(--shadow-card)] border border-white/50 p-6 relative overflow-hidden z-10">
        <div className="absolute top-2.5 left-2.5"><Screw /></div>
        <div className="absolute top-2.5 right-2.5"><Screw /></div>
        
        <h3 className="text-base font-bold font-mono tracking-widest uppercase text-foreground mb-5 flex items-center gap-2 pt-1 select-none">
          <Sparkles className="w-4 h-4 text-accent" />
          COMPILE_SEQUENCE
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
          <div>
            <label className="stamped-label mb-2 block">DIFFICULTY</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="input-field py-3 text-xs bg-background shadow-[var(--shadow-recessed)] cursor-pointer rounded-xl border border-white/10"
            >
              <option value="easy">EASY</option>
              <option value="medium">MEDIUM</option>
              <option value="hard">HARD</option>
            </select>
          </div>
          <div>
            <label className="stamped-label mb-2 block">QUESTION_COUNT</label>
            <select
              value={numQuestions}
              onChange={(e) => setNumQuestions(parseInt(e.target.value))}
              className="input-field py-3 text-xs bg-background shadow-[var(--shadow-recessed)] cursor-pointer rounded-xl border border-white/10"
            >
              {[3, 5, 7, 10, 15, 20].map((n) => (
                <option key={n} value={n}>{n} CYCLES</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="btn-primary w-full py-3.5 text-xs font-mono font-bold"
        >
          {loading ? (
            <><Spinner size="sm" className="text-white animate-spin" /> COMPILING MATRIX...</>
          ) : (
            <><Sparkles className="w-4 h-4" /> INITIALIZE SEQUENCE</>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-background shadow-[var(--shadow-recessed)] border border-accent/25 text-xs font-mono font-bold text-accent rounded-xl z-10 relative">
          ERROR // {error}
        </div>
      )}

      {/* Quiz Results */}
      {quiz && quiz.questions && (
        <div className="space-y-6 relative z-10">
          <div className="flex items-center justify-between bg-background p-4 rounded-xl shadow-[var(--shadow-card)] border border-white/40">
            <h3 className="font-bold text-foreground font-mono uppercase tracking-widest text-xs">
              {quiz.questions.length}_CYCLES <span className="text-mutedForeground/60 mx-1.5">||</span> 
              <span className="text-accent">LVL_{quiz.difficulty.toUpperCase()}</span>
            </h3>
            <button
              onClick={() => setShowAllAnswers(!showAllAnswers)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono font-bold tracking-wider text-accent bg-background shadow-[var(--shadow-sharp)] border border-white/30 rounded-lg active:translate-y-[1px] active:shadow-[var(--shadow-recessed)] transition-all"
            >
              {showAllAnswers ? <><EyeOff className="w-3.5 h-3.5" /> MASK SOLUTION</> : <><Eye className="w-3.5 h-3.5" /> DECRYPT ALL</>}
            </button>
          </div>

          <div className="space-y-6">
            {quiz.questions.map((q, i) => {
              const revealed = showAllAnswers || revealedAnswers[i];
              const selected = selectedAnswers[i];
              const isCorrect = selected && selected === q.answer;

              return (
                <div key={i} className="bg-background p-6 rounded-2xl border border-white/40 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-floating)] transition-all relative animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="absolute top-2.5 left-2.5"><Screw /></div>
                  <div className="absolute top-2.5 right-2.5"><Screw /></div>
                  
                  <div className="flex items-start gap-4 mb-5 pt-1.5">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-background border border-white/50 text-accent font-bold font-mono flex items-center justify-center shadow-[var(--shadow-card)]">
                      {i + 1}
                    </span>
                    <p className="font-mono text-foreground leading-relaxed text-sm pt-1.5">{q.question}</p>
                  </div>

                  {q.options && (
                    <div className="ml-0 sm:ml-12 space-y-3 mb-4">
                      {q.options.map((opt, j) => {
                        let optionClass = 'border-white/40 bg-background shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-floating)] active:translate-y-[1px] active:shadow-[var(--shadow-pressed)] text-mutedForeground font-mono text-xs';
                        if (revealed && opt === q.answer) {
                          optionClass = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600 font-bold shadow-[0_0_8px_rgba(16,185,129,0.3)]';
                        } else if (selected === opt && revealed && opt !== q.answer) {
                          optionClass = 'border-red-500/50 bg-red-500/10 text-red-600 font-bold shadow-[0_0_8px_rgba(239,68,68,0.3)]';
                        } else if (selected === opt) {
                          optionClass = 'border-accent bg-background text-accent shadow-[var(--shadow-pressed)] font-bold';
                        }

                        return (
                          <button
                            key={j}
                            onClick={() => selectOption(i, opt)}
                            className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3 ${optionClass}`}
                          >
                            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[9px] font-mono flex-shrink-0 font-bold shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] bg-background">
                              {String.fromCharCode(65 + j)}
                            </span>
                            <span className="flex-1">{opt}</span>
                            {revealed && opt === q.answer && <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
                            {selected === opt && revealed && opt !== q.answer && <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {!revealed && (
                    <button 
                      onClick={() => revealAnswer(i)} 
                      className="ml-0 sm:ml-12 mt-2 px-3 py-1.5 text-[10px] font-mono font-bold tracking-wider text-accent bg-background shadow-[var(--shadow-sharp)] border border-white/30 rounded-lg active:translate-y-[1px] active:shadow-[var(--shadow-recessed)] transition-all flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> DECRYPT LOCAL SEQUENCE
                    </button>
                  )}

                  {revealed && (
                    <div className="ml-0 sm:ml-12 mt-4 p-4 bg-background shadow-[var(--shadow-recessed)] rounded-xl border border-white/10 text-xs font-mono">
                      <p className="text-accent font-bold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent shadow-[var(--shadow-glow)]" />
                        STAMP_SOLUTION: {q.answer.toUpperCase()}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!quiz && !loading && (
        <div className="pt-8 relative z-10">
          <EmptyState
            icon={Sparkles}
            title="NO VALIDATION SEQUENCE ACTIVE"
            description="CONFIGURE CALIBRATION DIFFICULTY PARAMETERS ABOVE TO BEGIN TEST SEQUENCE."
          />
        </div>
      )}
    </div>
  );
}
