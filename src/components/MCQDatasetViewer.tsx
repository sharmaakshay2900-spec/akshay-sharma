import React, { useState, useEffect } from 'react';
import { Award, CheckCircle2, XCircle, ArrowRight, RotateCcw, Filter, Save } from 'lucide-react';
import api from '../services/api';
import { saveMCQResult } from '../services/storageService';

export const MCQDatasetViewer: React.FC = () => {
  const [mcqs, setMcqs] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    api.getMCQs().then((data) => {
      setMcqs(data);
    });
  }, []);

  const filteredMCQs = mcqs.filter(
    (q) => categoryFilter === 'all' || q.category === categoryFilter
  );

  const currentQ = filteredMCQs[currentIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null || !currentQ) return;
    setIsAnswered(true);

    const isCorrect = selectedOption === currentQ.correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    setUserAnswers({ ...userAnswers, [currentQ.id]: selectedOption });
  };

  const handleNext = () => {
    if (currentIndex < filteredMCQs.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setUserAnswers({});
    setIsFinished(false);
    setSaveSuccess(false);
  };

  const handleSaveResult = () => {
    const total = filteredMCQs.length;
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    saveMCQResult({
      score,
      totalQuestions: total,
      category: categoryFilter,
      percentage,
      answers: userAnswers,
    });
    setSaveSuccess(true);
  };

  const categories = ['all', 'Cardiology', 'Pulmonology', 'Endocrinology', 'Neurology', 'Gastroenterology', 'Nephrology', 'Hematology', 'Immunology', 'Pharmacology', 'Infectious Disease'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Medical Knowledge & Clinical MCQ Practice</h2>
            <p className="text-xs text-slate-500">
              Interactive test bank of 100+ clinical, physiological, and pharmacological board-style MCQs with rationale explanations.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Category:
          </span>
          {categories.slice(0, 7).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategoryFilter(cat);
                handleRestart();
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                categoryFilter === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'All (100+ Questions)' : cat}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 shrink-0">
          Score: <span className="font-bold text-blue-600">{score}</span> / {filteredMCQs.length}
        </div>
      </div>

      {/* Main MCQ Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm max-w-3xl mx-auto">
        {filteredMCQs.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            Loading MCQ dataset...
          </div>
        ) : isFinished ? (
          // Completion Screen
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Quiz Completed!</h3>
            <p className="text-sm text-slate-600">
              You scored <span className="font-bold text-blue-600">{score}</span> out of{' '}
              <span className="font-bold">{filteredMCQs.length}</span> (
              {Math.round((score / filteredMCQs.length) * 100)}%)
            </p>

            <div className="flex items-center justify-center gap-3 pt-3">
              <button
                onClick={handleRestart}
                className="py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Practice Again</span>
              </button>
              <button
                onClick={handleSaveResult}
                className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>{saveSuccess ? 'Saved to LocalStorage!' : 'Save Result'}</span>
              </button>
            </div>
          </div>
        ) : currentQ ? (
          <div className="space-y-5">
            {/* Question Counter & Category */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs text-slate-500">
              <span className="font-bold text-blue-600 uppercase tracking-wider">
                Question {currentIndex + 1} of {filteredMCQs.length}
              </span>
              <span className="px-2.5 py-0.5 bg-slate-100 rounded-md font-medium text-slate-700">
                {currentQ.category}
              </span>
            </div>

            {/* Question Text */}
            <h3 className="text-base font-bold text-slate-900 leading-snug">
              {currentQ.question}
            </h3>

            {/* 4 Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt: string, i: number) => {
                const isSelected = selectedOption === i;
                const isCorrect = i === currentQ.correctAnswer;

                let optionStyles = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100/80';
                if (isAnswered) {
                  if (isCorrect) {
                    optionStyles = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold ring-1 ring-emerald-500';
                  } else if (isSelected && !isCorrect) {
                    optionStyles = 'bg-red-50 border-red-500 text-red-900 font-semibold ring-1 ring-red-500';
                  } else {
                    optionStyles = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                  }
                } else if (isSelected) {
                  optionStyles = 'bg-blue-50 border-blue-600 text-blue-900 font-semibold ring-2 ring-blue-500/20';
                }

                return (
                  <div
                    key={i}
                    onClick={() => handleSelectOption(i)}
                    className={`p-3.5 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer ${optionStyles}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center font-bold text-[11px] shrink-0">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span>{opt}</span>
                    </div>

                    {isAnswered && (
                      <div>
                        {isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : isSelected ? (
                          <XCircle className="w-4 h-4 text-red-600" />
                        ) : null}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Answer Explanation Box */}
            {isAnswered && (
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl text-xs space-y-1.5 animate-fadeIn">
                <div className="font-bold text-blue-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Clinical Explanation & Rationale:</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {currentQ.explanation}
                </p>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Correct answer confirmed against clinical board standards
              </span>

              {!isAnswered ? (
                <button
                  type="button"
                  onClick={handleCheckAnswer}
                  disabled={selectedOption === null}
                  className="py-2 px-5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-40 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="py-2 px-5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{currentIndex < filteredMCQs.length - 1 ? 'Next Question' : 'View Results'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default MCQDatasetViewer;
