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
    <div className="p-4 space-y-6">
      {/* Settings */}
      <div className="card p-5">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-brand-500" />
          Generate Practice Quiz
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Difficulty</label>
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
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Number of Questions</label>
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
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {loading ? <><Spinner size="sm" className="text-white" /> Generating...</> : <><Sparkles className="w-4 h-4" /> Generate Quiz</>}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">{error}</div>
      )}

      {/* Quiz Results */}
      {quiz && quiz.questions && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">
              {quiz.questions.length} Questions · <span className="capitalize text-brand-600">{quiz.difficulty}</span>
            </h3>
            <button
              onClick={() => setShowAllAnswers(!showAllAnswers)}
              className="btn-ghost text-sm flex items-center gap-1"
            >
              {showAllAnswers ? <><EyeOff className="w-4 h-4" /> Hide Answers</> : <><Eye className="w-4 h-4" /> Show All Answers</>}
            </button>
          </div>

          {quiz.questions.map((q, i) => {
            const revealed = showAllAnswers || revealedAnswers[i];
            const selected = selectedAnswers[i];
            const isCorrect = selected && selected === q.answer;

            return (
              <div key={i} className="card p-5 animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="flex items-start gap-3 mb-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-brand-100 text-brand-700 text-sm font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <p className="font-medium text-slate-800 leading-relaxed">{q.question}</p>
                </div>

                {q.options && (
                  <div className="ml-10 space-y-2 mb-3">
                    {q.options.map((opt, j) => {
                      let optionClass = 'border-slate-200 hover:border-brand-300 hover:bg-brand-50 cursor-pointer';
                      if (revealed && opt === q.answer) {
                        optionClass = 'border-emerald-300 bg-emerald-50';
                      } else if (selected === opt && revealed && opt !== q.answer) {
                        optionClass = 'border-red-300 bg-red-50';
                      } else if (selected === opt) {
                        optionClass = 'border-brand-400 bg-brand-50';
                      }

                      return (
                        <button
                          key={j}
                          onClick={() => selectOption(i, opt)}
                          className={`w-full text-left p-3 rounded-lg border text-sm transition-all flex items-center gap-2 ${optionClass}`}
                        >
                          <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-xs flex-shrink-0">
                            {String.fromCharCode(65 + j)}
                          </span>
                          {opt}
                          {revealed && opt === q.answer && <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />}
                          {selected === opt && revealed && opt !== q.answer && <XCircle className="w-4 h-4 text-red-500 ml-auto" />}
                        </button>
                      );
                    })}
                  </div>
                )}

                {!revealed && (
                  <button onClick={() => revealAnswer(i)} className="ml-10 text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Reveal answer
                  </button>
                )}

                {revealed && (
                  <div className="ml-10 mt-2 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                    <p className="text-sm text-emerald-800"><span className="font-semibold">Answer:</span> {q.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!quiz && !loading && (
        <EmptyState
          icon={Sparkles}
          title="No quiz yet"
          description="Configure your preferences above and generate a practice quiz from your notes."
        />
      )}
    </div>
  );
}
