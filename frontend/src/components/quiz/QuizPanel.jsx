import { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';
import { generateQuiz } from '../../api/chat';
import Spinner from '../ui/Spinner';
import EmptyState from '../ui/EmptyState';

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
      setError(err.response?.data?.error || 'Failed to generate quiz. Please try again.');
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
    <div className="p-4 sm:p-6 space-y-8 bg-[#0a0a0f]/50 h-full overflow-y-auto">
      {/* Settings */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-[80px] pointer-events-none" />
        
        <h3 className="text-xl font-bold font-heading text-white mb-5 flex items-center gap-2 relative z-10">
          <Sparkles className="w-5 h-5 text-brand-400" />
          Generate Practice Quiz
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6 relative z-10">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="input-field"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Number of Questions</label>
            <select
              value={numQuestions}
              onChange={(e) => setNumQuestions(parseInt(e.target.value))}
              className="input-field"
            >
              {[3, 5, 7, 10, 15, 20].map((n) => (
                <option key={n} value={n}>{n} questions</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 relative z-10 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
        >
          {loading ? <><Spinner size="sm" className="text-white" /> Generating...</> : <><Sparkles className="w-5 h-5" /> Generate Quiz</>}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400 font-medium">
          {error}
        </div>
      )}

      {/* Quiz Results */}
      {quiz && quiz.questions && (
        <div className="space-y-6">
          <div className="flex items-center justify-between glass-panel p-4 rounded-xl border border-white/5">
            <h3 className="font-semibold text-white font-heading">
              {quiz.questions.length} Questions <span className="text-slate-500 mx-2">·</span> 
              <span className="capitalize text-brand-400">{quiz.difficulty}</span>
            </h3>
            <button
              onClick={() => setShowAllAnswers(!showAllAnswers)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-brand-400 hover:text-brand-300 hover:bg-white/5 font-medium transition-colors"
            >
              {showAllAnswers ? <><EyeOff className="w-4 h-4" /> Hide Answers</> : <><Eye className="w-4 h-4" /> Show All Answers</>}
            </button>
          </div>

          <div className="space-y-6">
            {quiz.questions.map((q, i) => {
              const revealed = showAllAnswers || revealedAnswers[i];
              const selected = selectedAnswers[i];
              const isCorrect = selected && selected === q.answer;

              return (
                <div key={i} className="glass-panel p-6 rounded-2xl animate-slide-up border border-white/5 hover:border-brand-500/20 transition-colors" style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="flex items-start gap-4 mb-5">
                    <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-brand-500/20 text-brand-300 font-bold font-heading flex items-center justify-center border border-brand-500/30 shadow-[0_0_10px_rgba(139,92,246,0.15)]">
                      {i + 1}
                    </span>
                    <p className="font-medium text-slate-200 leading-relaxed text-lg pt-0.5">{q.question}</p>
                  </div>

                  {q.options && (
                    <div className="ml-12 space-y-3 mb-4">
                      {q.options.map((opt, j) => {
                        let optionClass = 'border-white/10 hover:border-brand-500/50 hover:bg-white/5 cursor-pointer text-slate-300';
                        if (revealed && opt === q.answer) {
                          optionClass = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.1)]';
                        } else if (selected === opt && revealed && opt !== q.answer) {
                          optionClass = 'border-red-500/50 bg-red-500/10 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.1)]';
                        } else if (selected === opt) {
                          optionClass = 'border-brand-500 bg-brand-500/20 text-brand-100 shadow-[0_0_15px_rgba(139,92,246,0.2)]';
                        }

                        return (
                          <button
                            key={j}
                            onClick={() => selectOption(i, opt)}
                            className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3 font-medium ${optionClass}`}
                          >
                            <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs flex-shrink-0 font-bold">
                              {String.fromCharCode(65 + j)}
                            </span>
                            {opt}
                            {revealed && opt === q.answer && <CheckCircle2 className="w-5 h-5 text-emerald-400 ml-auto" />}
                            {selected === opt && revealed && opt !== q.answer && <XCircle className="w-5 h-5 text-red-400 ml-auto" />}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {!revealed && (
                    <button onClick={() => revealAnswer(i)} className="ml-12 mt-2 px-3 py-1.5 rounded-lg text-sm text-brand-400 hover:bg-white/5 font-medium flex items-center gap-1.5 transition-colors">
                      <Eye className="w-4 h-4" /> Reveal answer
                    </button>
                  )}

                  {revealed && (
                    <div className="ml-12 mt-4 p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                      <p className="text-emerald-300"><span className="font-bold text-emerald-400 font-heading tracking-wide">ANSWER:</span> {q.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!quiz && !loading && (
        <div className="pt-8">
          <EmptyState
            icon={Sparkles}
            title="No quiz yet"
            description="Configure your preferences above and generate a practice quiz from your notes."
          />
        </div>
      )}
    </div>
  );
}
