import React, { useState, useEffect } from 'react';
import { useMastery } from '../hooks/useMastery';

interface PracticeViewProps {
  onStartSession: (subject: string, topic?: string, count?: number) => void;
}

interface PracticeQuestion {
  id: number;
  prompt: string;
  formula?: string;
  options: { id: 'A' | 'B' | 'C' | 'D'; text: string }[];
  correct: 'A' | 'B' | 'C' | 'D';
}

const SAMPLE_PRACTICE_QUESTIONS: PracticeQuestion[] = [
  {
    id: 7,
    prompt: 'Solve the indefinite integral:',
    formula: '∫ (2x + 3) dx',
    options: [
      { id: 'A', text: 'x² + 3x + C' },
      { id: 'B', text: 'x² + 3x + C' },
      { id: 'C', text: '2x² + 3x + C' },
      { id: 'D', text: '2x² + 3x + C' },
    ],
    correct: 'B',
  },
  {
    id: 8,
    prompt: 'Evaluate the derivative with respect to x:',
    formula: 'd/dx [sin(3x) · e^(2x)]',
    options: [
      { id: 'A', text: '3cos(3x)e^(2x) + 2sin(3x)e^(2x)' },
      { id: 'B', text: '6cos(3x)e^(2x)' },
      { id: 'C', text: '3sin(3x)e^(2x) + 2cos(3x)e^(2x)' },
      { id: 'D', text: 'cos(3x)e^(2x)' },
    ],
    correct: 'A',
  },
  {
    id: 9,
    prompt: 'Find the limit as x approaches 0:',
    formula: 'lim(x→0) [sin(5x) / x]',
    options: [
      { id: 'A', text: '0' },
      { id: 'B', text: '1' },
      { id: 'C', text: '5' },
      { id: 'D', text: 'Undefined' },
    ],
    correct: 'C',
  },
];

export const PracticeView: React.FC<PracticeViewProps> = ({ onStartSession }) => {
  const { weakestTopics } = useMastery();

  const [selectedSubject, setSelectedSubject] = useState<'Mathematics' | 'Physics' | 'Chemistry'>('Mathematics');
  const [selectedTopic, setSelectedTopic] = useState<string>('Integration');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | null>('B');
  const [isMarkedForReview, setIsMarkedForReview] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(272); // 04:32
  const [score, setScore] = useState(120);
  const [accuracy, setAccuracy] = useState(85);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const currentQ = SAMPLE_PRACTICE_QUESTIONS[currentQIndex] || SAMPLE_PRACTICE_QUESTIONS[0];

  const handleNextQuestion = () => {
    if (selectedOption === currentQ.correct) {
      setScore((prev) => prev + 15);
    }
    if (currentQIndex < SAMPLE_PRACTICE_QUESTIONS.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      onStartSession(selectedSubject, selectedTopic);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto font-body pb-8">
      {/* 1. Top Selector Bar matching Mockup */}
      <div className="bg-[#FFFFFF] rounded-2xl p-4 sm:p-5 border border-[#E2E8F0] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onStartSession(selectedSubject)}
            className="p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-xl transition-colors cursor-pointer"
            aria-label="Back"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div>
            <h2 className="font-display text-lg font-bold text-[#0F172A]">Practice</h2>
            <p className="text-xs text-[#64748B]">Adaptive Question Pacing</p>
          </div>
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Subject Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#F8FAFC] px-3 py-1.5 rounded-xl border border-[#E2E8F0]">
            <span className="text-xs font-semibold text-[#64748B]">Subject:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value as any)}
              className="text-xs font-bold text-[#0F172A] bg-transparent outline-none cursor-pointer"
            >
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
            </select>
          </div>

          {/* Topic Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#F8FAFC] px-3 py-1.5 rounded-xl border border-[#E2E8F0]">
            <span className="text-xs font-semibold text-[#64748B]">Topic:</span>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="text-xs font-bold text-[#0F172A] bg-transparent outline-none cursor-pointer"
            >
              <option value="Integration">Integration</option>
              <option value="Calculus">Calculus</option>
              <option value="Vectors">Vectors</option>
            </select>
          </div>

          {/* Difficulty Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#F8FAFC] px-3 py-1.5 rounded-xl border border-[#E2E8F0]">
            <span className="text-xs font-semibold text-[#64748B]">Difficulty:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as any)}
              className="text-xs font-bold text-[#4F46E5] bg-transparent outline-none cursor-pointer"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Main Practice Layout (Question Area on Left, HUD on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Question & Options Area */}
        <div className="lg:col-span-8 bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] bg-[#F1F5F9] px-3 py-1 rounded-full">
                Question {currentQ.id} of 15
              </span>
              <span className="text-xs font-bold text-[#4F46E5] bg-[#EEF2FF] px-2.5 py-0.5 rounded-full">
                Calculus
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-semibold text-[#475569]">{currentQ.prompt}</h3>
              {currentQ.formula && (
                <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] text-center font-mono text-xl sm:text-2xl font-extrabold text-[#0F172A]">
                  {currentQ.formula}
                </div>
              )}
            </div>

            {/* 4 Interactive Options matching Mockup */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((opt) => {
                const isSelected = selectedOption === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedOption(opt.id)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-2 border-[#4F46E5] bg-[#EEF2FF]/40 text-[#0F172A] shadow-sm'
                        : 'border-[#E2E8F0] hover:border-[#CBD5E1] bg-[#FFFFFF] text-[#334155]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                          isSelected
                            ? 'bg-[#4F46E5] text-white'
                            : 'bg-[#F1F5F9] text-[#64748B]'
                        }`}
                      >
                        {opt.id}
                      </span>
                      <span className="font-mono text-sm sm:text-base font-semibold">
                        {opt.text}
                      </span>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-[#4F46E5] bg-[#4F46E5]' : 'border-[#CBD5E1]'
                      }`}
                    >
                      {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Action Controls */}
          <div className="pt-4 border-t border-[#F1F5F9] flex items-center justify-between gap-4">
            <button
              onClick={() => setIsMarkedForReview(!isMarkedForReview)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isMarkedForReview
                  ? 'bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]'
                  : 'bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#64748B]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {isMarkedForReview ? 'bookmark_added' : 'bookmark_border'}
              </span>
              <span>{isMarkedForReview ? 'Marked' : 'Mark for Review'}</span>
            </button>

            <button
              id="practice-next-question-btn"
              onClick={handleNextQuestion}
              className="px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-xl transition-all shadow-md shadow-indigo-500/20 active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span>Next Question</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Right HUD Progress Panel */}
        <div className="lg:col-span-4 space-y-5">
          {/* Circular Countdown Timer */}
          <div className="bg-[#FFFFFF] rounded-3xl p-6 border border-[#E2E8F0] shadow-sm text-center flex flex-col items-center justify-center space-y-3">
            <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
              Time Remaining
            </span>

            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#E2E8F0]"
                  strokeWidth="3"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#10B981]"
                  strokeDasharray="65, 100"
                  strokeWidth="3"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="font-display text-lg font-extrabold text-[#0F172A]">
                  {formatTimer(secondsRemaining)}
                </span>
                <span className="block text-[9px] font-bold text-[#64748B]">min</span>
              </div>
            </div>
          </div>

          {/* Accuracy & Score Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#FFFFFF] rounded-2xl p-4 border border-[#E2E8F0] shadow-sm text-center">
              <span className="text-[10px] font-bold text-[#64748B] uppercase">Accuracy</span>
              <p className="font-display text-2xl font-extrabold text-[#10B981] mt-1">{accuracy}%</p>
            </div>
            <div className="bg-[#FFFFFF] rounded-2xl p-4 border border-[#E2E8F0] shadow-sm text-center">
              <span className="text-[10px] font-bold text-[#64748B] uppercase">Score</span>
              <p className="font-display text-2xl font-extrabold text-[#4F46E5] mt-1">{score} <span className="text-xs font-normal text-[#64748B]">pts</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
