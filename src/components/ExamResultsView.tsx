import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ExamResult } from '../types';

interface ExamResultsViewProps {
  result: ExamResult;
  onReviewSolutions: () => void;
  onStartTargetedPractice: (topic: string) => void;
  onBackToDashboard: () => void;
}

export const ExamResultsView: React.FC<ExamResultsViewProps> = ({
  result,
  onReviewSolutions,
  onStartTargetedPractice,
  onBackToDashboard,
}) => {
  useEffect(() => {
    if (result.scorePercentage >= 70) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#aa3000', '#000000', '#ffb59e'],
        });
      } catch (e) {
        // Safe fallback
      }
    }
  }, [result.scorePercentage]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Header Result Card */}
      <div className="bg-[#ffffff] rounded-3xl p-8 sm:p-10 border border-[#c5c6cd]/60 ambient-shadow text-center relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f5f3f1] text-[#000000] text-xs font-bold uppercase tracking-wider mb-4 border border-[#c5c6cd]/60">
          <span className="material-symbols-outlined text-[14px]">verified</span>
          Diagnostic Assessment Complete
        </div>

        <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#000000]">
          {result.title}
        </h2>
        <p className="text-sm text-[#44474d] mt-2 max-w-md mx-auto">
          Your composite score reflects strong mechanics and thermodynamics fluency, with tactical gains needed in polynomial calculus.
        </p>

        {/* Circular / Large Score Display */}
        <div className="my-8 flex flex-col sm:flex-row items-center justify-center gap-8">
          <div className="relative flex items-center justify-center w-36 h-36 rounded-full bg-[#fbf9f7] border-4 border-[#000000] shadow-inner">
            <div className="text-center">
              <span className="font-display text-4xl font-extrabold text-[#000000]">
                {result.scorePercentage}%
              </span>
              <span className="block text-[11px] font-bold text-[#aa3000] uppercase tracking-wider">
                Grade {result.grade}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="bg-[#f5f3f1] p-4 rounded-2xl border border-[#c5c6cd]/50">
              <span className="text-[11px] text-[#75777e] uppercase font-semibold">
                Accuracy Score
              </span>
              <p className="text-lg font-bold text-[#000000] mt-0.5">
                {result.correctCount} / {result.totalQuestions}
              </p>
              <span className="text-[10px] text-green-700 font-semibold">
                {result.scorePercentage}% accuracy
              </span>
            </div>

            <div className="bg-[#f5f3f1] p-4 rounded-2xl border border-[#c5c6cd]/50">
              <span className="text-[11px] text-[#75777e] uppercase font-semibold">
                Percentile Rank
              </span>
              <p className="text-lg font-bold text-[#000000] mt-0.5">
                Top {100 - result.percentile}%
              </p>
              <span className="text-[10px] text-[#aa3000] font-semibold">
                {result.percentile}th percentile
              </span>
            </div>
          </div>
        </div>

        {/* Top Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            id="review-solutions-btn"
            onClick={onReviewSolutions}
            className="px-6 py-3 bg-[#000000] hover:bg-[#1b1c1b] text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">find_in_page</span>
            Review Detailed Solutions
          </button>
          <button
            onClick={onBackToDashboard}
            className="px-6 py-3 bg-[#f5f3f1] hover:bg-[#eae8e6] text-[#000000] font-bold text-sm rounded-xl transition-all border border-[#c5c6cd] cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Target Weakness Action Card */}
      <div className="bg-[#ffffff] rounded-2xl p-6 sm:p-7 border border-[#ffdbd0] ambient-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#aa3000] bg-[#ffdbd0]/60 px-2.5 py-0.5 rounded">
              High-Impact Recommendation
            </span>
            <span className="text-xs font-semibold text-[#75777e]">Score Lever</span>
          </div>
          <h3 className="font-display text-xl font-bold text-[#000000]">
            Target Your Weakness: {result.weakestTopic.name}
          </h3>
          <p className="text-xs text-[#44474d] max-w-xl leading-relaxed">
            Your accuracy in this topic is <strong>{result.weakestTopic.percentage}%</strong>. Mastering partial fractions could add up to 8 percentage points on your upcoming exam.
          </p>
        </div>

        <button
          onClick={() => onStartTargetedPractice(result.weakestTopic.name)}
          className="px-6 py-3 bg-[#aa3000] hover:bg-[#8e2800] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 shrink-0 flex items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">bolt</span>
          Start Targeted Practice
        </button>
      </div>

      {/* Topic Performance Breakdown */}
      <div className="bg-[#ffffff] rounded-2xl p-6 sm:p-8 border border-[#c5c6cd]/60 ambient-shadow space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-bold text-[#000000]">
            Topic-by-Topic Performance Breakdown
          </h3>
          <span className="text-xs text-[#75777e]">3 Core Sub-domains</span>
        </div>

        <div className="space-y-5">
          {result.topicScores.map((ts, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#000000]">{ts.topic}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[#75777e]">
                    {ts.correct} / {ts.total} correct
                  </span>
                  <span
                    className={`font-bold ${
                      ts.status === 'mastered'
                        ? 'text-green-700'
                        : ts.status === 'weak'
                        ? 'text-[#aa3000]'
                        : 'text-[#000000]'
                    }`}
                  >
                    {ts.percentage}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-[#f5f3f1] h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    ts.status === 'mastered'
                      ? 'bg-[#000000]'
                      : ts.status === 'weak'
                      ? 'bg-[#aa3000]'
                      : 'bg-[#44474d]'
                  }`}
                  style={{ width: `${ts.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
