import React, { useState } from 'react';
import { MistakeItem } from '../types';

interface MistakeBookViewProps {
  mistakes: MistakeItem[];
  onReviewQuestion: (question: any) => void;
  onTryAgain: (question: any) => void;
  onOpenCoachWithQuestion: (questionTitle: string) => void;
}

export const MistakeBookView: React.FC<MistakeBookViewProps> = ({
  mistakes,
  onReviewQuestion,
  onTryAgain,
  onOpenCoachWithQuestion,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<'All' | 'Physics' | 'Mathematics' | 'Chemistry'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<MistakeItem[]>(mistakes);

  const filteredItems = items.filter((item) => {
    const matchesSubject = selectedSubject === 'All' || item.subject === selectedSubject;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtopic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const handleResolve = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const physicsCount = items.filter((i) => i.subject === 'Physics').length;
  const mathCount = items.filter((i) => i.subject === 'Mathematics').length;
  const chemCount = items.filter((i) => i.subject === 'Chemistry').length;

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#000000]">
            Mistake Book
          </h2>
          <p className="text-sm text-[#44474d] mt-1">
            Your personal review journal. Questions you miss in mocks and drills are queued here until mastered.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#75777e] text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mistakes..."
              className="bg-[#ffffff] border border-[#c5c6cd] rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#aa3000] w-48 sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setSelectedSubject('All')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
            selectedSubject === 'All'
              ? 'bg-[#000000] text-white border-[#000000] shadow-sm'
              : 'bg-[#ffffff] text-[#44474d] border-[#c5c6cd]/80 hover:text-[#000000]'
          }`}
        >
          All Mistakes ({items.length})
        </button>

        <button
          onClick={() => setSelectedSubject('Mathematics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
            selectedSubject === 'Mathematics'
              ? 'bg-[#aa3000] text-white border-[#aa3000] shadow-sm'
              : 'bg-[#ffffff] text-[#44474d] border-[#c5c6cd]/80 hover:text-[#000000]'
          }`}
        >
          Mathematics ({mathCount})
        </button>

        <button
          onClick={() => setSelectedSubject('Physics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
            selectedSubject === 'Physics'
              ? 'bg-[#000000] text-white border-[#000000] shadow-sm'
              : 'bg-[#ffffff] text-[#44474d] border-[#c5c6cd]/80 hover:text-[#000000]'
          }`}
        >
          Physics ({physicsCount})
        </button>

        <button
          onClick={() => setSelectedSubject('Chemistry')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
            selectedSubject === 'Chemistry'
              ? 'bg-[#000000] text-white border-[#000000] shadow-sm'
              : 'bg-[#ffffff] text-[#44474d] border-[#c5c6cd]/80 hover:text-[#000000]'
          }`}
        >
          Chemistry ({chemCount})
        </button>
      </div>

      {/* Mistake Items List */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="bg-[#ffffff] rounded-2xl p-12 text-center border border-[#c5c6cd]/60 space-y-3">
            <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[24px]">task_alt</span>
            </div>
            <h3 className="font-display text-lg font-bold text-[#000000]">No Unresolved Mistakes!</h3>
            <p className="text-xs text-[#75777e]">
              Great work! All mistakes in this category have been cleared and mastered.
            </p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#ffffff] rounded-2xl p-5 sm:p-6 border border-[#c5c6cd]/60 ambient-shadow card-shadow-hover flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded ${
                      item.subject === 'Mathematics'
                        ? 'bg-[#ffdbd0]/60 text-[#aa3000]'
                        : 'bg-[#f5f3f1] text-[#000000]'
                    }`}
                  >
                    {item.subject} • {item.topic}
                  </span>
                  <span className="text-xs text-[#75777e]">{item.lastAttempted}</span>
                </div>

                <h3 className="font-display text-base sm:text-lg font-bold text-[#000000]">
                  {item.title}
                </h3>
                <p className="text-xs text-[#44474d]">
                  Sub-concept: <strong>{item.subtopic}</strong> • Attempted {item.attemptCount} times
                  (Correct: {item.correctCount}/{item.attemptCount})
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={() => onReviewQuestion(item.question)}
                  className="px-3.5 py-2 bg-[#f5f3f1] hover:bg-[#eae8e6] text-[#000000] text-xs font-bold rounded-xl border border-[#c5c6cd] transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">visibility</span>
                  Review Concept
                </button>

                <button
                  onClick={() => onOpenCoachWithQuestion(item.title)}
                  className="px-3.5 py-2 bg-[#f5f3f1] hover:bg-[#eae8e6] text-[#aa3000] text-xs font-bold rounded-xl border border-[#ffdbd0] transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">psychology</span>
                  Explain with AI
                </button>

                <button
                  onClick={() => onTryAgain(item.question)}
                  className="px-4 py-2 bg-[#000000] hover:bg-[#1b1c1b] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">refresh</span>
                  Try Again
                </button>

                <button
                  onClick={() => handleResolve(item.id)}
                  title="Mark as Mastered / Resolved"
                  className="p-2 text-green-700 hover:bg-green-50 rounded-xl transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
