import React, { useState, useEffect } from 'react';
import { Question, UserAnswerRecord, ExamResult } from '../types';

interface ExamSimulatorProps {
  examTitle: string;
  subject: string;
  questions: Question[];
  durationMinutes?: number;
  onFinishExam: (result: ExamResult) => void;
  onExit: () => void;
}

export const ExamSimulator: React.FC<ExamSimulatorProps> = ({
  examTitle,
  subject,
  questions,
  durationMinutes = 60,
  onFinishExam,
  onExit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswerRecord[]>(() =>
    questions.map((q) => ({
      questionId: q.id,
      selectedOption: null,
      isCorrect: false,
      isFlagged: false,
      timeSpentSeconds: 0,
    }))
  );
  const [secondsRemaining, setSecondsRemaining] = useState(durationMinutes * 60);
  const [isPaused, setIsPaused] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Timer interval
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers[currentIndex];

  const handleSelectOption = (optionId: 'A' | 'B' | 'C' | 'D') => {
    setAnswers((prev) =>
      prev.map((ans, idx) =>
        idx === currentIndex
          ? {
              ...ans,
              selectedOption: optionId,
              isCorrect: optionId === currentQuestion.correctAnswer,
            }
          : ans
      )
    );
  };

  const handleToggleFlag = () => {
    setAnswers((prev) =>
      prev.map((ans, idx) =>
        idx === currentIndex ? { ...ans, isFlagged: !ans.isFlagged } : ans
      )
    );
  };

  const handleClearSelection = () => {
    setAnswers((prev) =>
      prev.map((ans, idx) =>
        idx === currentIndex
          ? { ...ans, selectedOption: null, isCorrect: false }
          : ans
      )
    );
  };

  const handleSubmit = () => {
    const answeredCount = answers.filter((a) => a.selectedOption !== null).length;
    const correctCount = answers.filter((a) => a.isCorrect).length;
    const scorePercentage = Math.round((correctCount / questions.length) * 100);

    let grade = 'B+';
    if (scorePercentage >= 90) grade = 'A+';
    else if (scorePercentage >= 80) grade = 'A-';
    else if (scorePercentage >= 70) grade = 'B';
    else if (scorePercentage >= 60) grade = 'C';
    else grade = 'D';

    const result: ExamResult = {
      examId: `exam-${Date.now()}`,
      title: examTitle,
      totalQuestions: questions.length,
      answeredCount,
      correctCount,
      scorePercentage,
      grade,
      percentile: Math.min(99, Math.max(40, Math.round(scorePercentage * 0.95 + 10))),
      timeSpentSeconds: durationMinutes * 60 - secondsRemaining,
      timeEfficiency: 74,
      topicScores: [
        { topic: 'Thermodynamics & Heat', percentage: 75, total: 6, correct: 5, status: 'improving' },
        { topic: 'Calculus & Integration', percentage: 43, total: 7, correct: 3, status: 'weak' },
        { topic: 'Mechanics & Waves', percentage: 90, total: 7, correct: 6, status: 'mastered' },
      ],
      weakestTopic: {
        name: 'Calculus: Integration by Parts & Partial Fractions',
        percentage: 43,
        actionPlan: [
          'Review polynomial grouping and algebraic decomposition',
          'Practice 12 targeted drill questions',
          'Ask AI Coach for step-by-step Bengali walkthrough',
        ],
      },
      userAnswers: answers,
    };

    onFinishExam(result);
  };

  const answeredCount = answers.filter((a) => a.selectedOption !== null).length;
  const flaggedCount = answers.filter((a) => a.isFlagged).length;
  const unansweredCount = questions.length - answeredCount;

  return (
    <div className="fixed inset-0 z-50 bg-[#F9F7F5] flex flex-col overflow-hidden select-none">
      {/* Top Test Header */}
      <header className="h-16 bg-[#ffffff] border-b border-[#c5c6cd]/60 px-4 sm:px-8 flex items-center justify-between shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowExitConfirm(true)}
            className="p-1.5 text-[#75777e] hover:text-[#000000] hover:bg-[#f5f3f1] rounded-lg transition-colors"
            title="Exit Exam"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div>
            <h2 className="font-display text-base sm:text-lg font-bold text-[#000000] leading-tight truncate max-w-[200px] sm:max-w-md">
              {examTitle}
            </h2>
            <span className="text-[11px] font-semibold text-[#aa3000] uppercase tracking-wider">
              {subject} • Question {currentIndex + 1} of {questions.length}
            </span>
          </div>
        </div>

        {/* Center Timer */}
        <div className="flex items-center gap-2 bg-[#f5f3f1] px-3.5 py-1.5 rounded-full border border-[#c5c6cd]">
          <span
            className={`material-symbols-outlined text-[18px] ${
              secondsRemaining < 300 ? 'text-red-600 animate-pulse' : 'text-[#75777e]'
            }`}
          >
            timer
          </span>
          <span className="font-mono text-sm font-bold text-[#000000]">
            {formatTimer(secondsRemaining)}
          </span>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="text-[10px] text-[#75777e] hover:text-[#000000] ml-1 font-semibold underline"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleFlag}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              currentAnswer.isFlagged
                ? 'bg-[#ffdbd0] text-[#aa3000] border border-[#aa3000]'
                : 'bg-[#f5f3f1] text-[#44474d] hover:text-[#000000] border border-[#c5c6cd]'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[16px] ${
                currentAnswer.isFlagged ? 'symbol-filled text-[#aa3000]' : ''
              }`}
            >
              flag
            </span>
            <span className="hidden sm:inline">
              {currentAnswer.isFlagged ? 'Flagged' : 'Flag'}
            </span>
          </button>

          <button
            id="submit-exam-top-btn"
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#aa3000] hover:bg-[#8e2800] text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
          >
            Submit Test
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left/Center: Question Surface */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col justify-between">
          <div className="max-w-3xl mx-auto w-full space-y-6">
            {/* Question Meta Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#75777e] bg-[#f5f3f1] px-2.5 py-1 rounded border border-[#c5c6cd]/50">
                  {currentQuestion.chapter} • {currentQuestion.topic}
                </span>
                <span className="text-xs font-semibold text-[#44474d] bg-[#f5f3f1] px-2 py-1 rounded">
                  {currentQuestion.difficulty}
                </span>
              </div>
              <span className="text-xs text-[#75777e]">
                +4 Marks / -1 Negative
              </span>
            </div>

            {/* Question Title & Text */}
            <div className="bg-[#ffffff] rounded-2xl p-6 sm:p-8 border border-[#c5c6cd]/60 ambient-shadow space-y-4">
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#000000] leading-snug">
                {currentQuestion.questionText}
              </h3>

              {currentQuestion.formula && (
                <div className="p-3.5 bg-[#f5f3f1] rounded-xl font-mono text-base text-[#000000] border border-[#c5c6cd]/70 text-center font-bold">
                  {currentQuestion.formula}
                </div>
              )}
            </div>

            {/* Options List */}
            <div className="space-y-3">
              {currentQuestion.options.map((option) => {
                const isSelected = currentAnswer.selectedOption === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectOption(option.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all flex items-start gap-4 border cursor-pointer ${
                      isSelected
                        ? 'bg-[#000000] text-white border-[#000000] shadow-md scale-[1.01]'
                        : 'bg-[#ffffff] text-[#1b1c1b] border-[#c5c6cd]/80 hover:border-[#000000] hover:bg-[#f5f3f1]'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSelected
                          ? 'bg-white text-[#000000]'
                          : 'bg-[#f5f3f1] text-[#000000] border border-[#c5c6cd]'
                      }`}
                    >
                      {option.id}
                    </div>
                    <span className="text-sm sm:text-base font-medium mt-0.5 leading-relaxed">
                      {option.text}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Navigation Toolbar */}
          <div className="max-w-3xl mx-auto w-full pt-6 pb-2 flex items-center justify-between border-t border-[#c5c6cd]/40 mt-6">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors ${
                currentIndex === 0
                  ? 'text-[#c5c6cd] cursor-not-allowed'
                  : 'bg-[#ffffff] text-[#000000] border border-[#c5c6cd] hover:bg-[#f5f3f1] cursor-pointer'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">chevron_left</span>
              Previous
            </button>

            <button
              onClick={handleClearSelection}
              className="text-xs text-[#75777e] hover:text-[#aa3000] underline"
            >
              Clear Selection
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="px-5 py-2 bg-[#000000] hover:bg-[#222222] text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-all shadow-sm cursor-pointer"
              >
                Next
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-5 py-2 bg-[#aa3000] hover:bg-[#8e2800] text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-all shadow-md cursor-pointer"
              >
                Submit Exam
                <span className="material-symbols-outlined text-[16px]">task_alt</span>
              </button>
            )}
          </div>
        </main>

        {/* Right Sidebar: Question Matrix */}
        <aside className="w-72 bg-[#ffffff] border-l border-[#c5c6cd]/60 p-5 hidden md:flex flex-col justify-between overflow-y-auto shrink-0">
          <div>
            <h4 className="font-display text-sm font-bold text-[#000000] uppercase tracking-wider mb-4">
              Question Navigator
            </h4>

            {/* Matrix Legend */}
            <div className="grid grid-cols-3 gap-2 mb-4 pb-4 border-b border-[#f5f3f1] text-[11px]">
              <div className="text-center p-2 rounded-lg bg-[#f5f3f1]">
                <p className="font-bold text-[#000000] text-sm">{answeredCount}</p>
                <span className="text-[#75777e]">Answered</span>
              </div>
              <div className="text-center p-2 rounded-lg bg-[#f5f3f1]">
                <p className="font-bold text-[#aa3000] text-sm">{flaggedCount}</p>
                <span className="text-[#75777e]">Flagged</span>
              </div>
              <div className="text-center p-2 rounded-lg bg-[#f5f3f1]">
                <p className="font-bold text-[#44474d] text-sm">{unansweredCount}</p>
                <span className="text-[#75777e]">Unanswered</span>
              </div>
            </div>

            {/* Matrix Grid */}
            <div className="grid grid-cols-5 gap-2 max-h-[380px] overflow-y-auto p-1">
              {questions.map((q, idx) => {
                const ans = answers[idx];
                const isCurrent = idx === currentIndex;
                const isAnswered = ans.selectedOption !== null;
                const isFlagged = ans.isFlagged;

                let btnStyle = 'bg-[#f5f3f1] text-[#44474d] border-[#c5c6cd]';
                if (isAnswered) {
                  btnStyle = 'bg-[#000000] text-white border-[#000000] font-bold';
                }
                if (isFlagged) {
                  btnStyle = 'bg-[#ffdbd0] text-[#aa3000] border-[#aa3000] font-bold';
                }
                if (isCurrent) {
                  btnStyle += ' ring-2 ring-[#aa3000] ring-offset-2';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 rounded-lg border text-xs flex items-center justify-center transition-all cursor-pointer ${btnStyle}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-[#aa3000] hover:bg-[#8e2800] text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 mt-4"
          >
            End Test & Grade
          </button>
        </aside>
      </div>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000000]/50 backdrop-blur-sm">
          <div className="bg-[#ffffff] rounded-2xl p-6 max-w-sm w-full border border-[#c5c6cd] shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[28px]">warning</span>
            </div>
            <h3 className="font-display text-lg font-bold text-[#000000]">Exit Exam Session?</h3>
            <p className="text-xs text-[#44474d]">
              Your answers will not be scored if you exit now. Are you sure you want to return to the dashboard?
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2 text-xs font-semibold bg-[#f5f3f1] hover:bg-[#eae8e6] rounded-xl"
              >
                Keep Testing
              </button>
              <button
                onClick={onExit}
                className="flex-1 py-2 text-xs font-bold bg-red-700 hover:bg-red-800 text-white rounded-xl"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
