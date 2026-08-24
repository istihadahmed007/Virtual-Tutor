import React, { useState, useEffect } from 'react';
import { Tutor } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string, extra?: any) => void;
  tutors: Tutor[];
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  tutors,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle or open search
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sampleSearchItems = [
    { type: 'exam', title: 'Physics Mock Exam #4', tab: 'exams', badge: 'Mock Exam', icon: 'assignment' },
    { type: 'topic', title: 'Calculus - Integration by Parts', tab: 'practice', badge: 'Weak Topic', icon: 'functions' },
    { type: 'topic', title: 'Physics - Thermodynamics & Isothermal Gas', tab: 'practice', badge: 'Practice Drill', icon: 'science' },
    { type: 'topic', title: 'Chemistry - Benzene Nitration & Electrophiles', tab: 'mistakes', badge: 'Mistake Review', icon: 'menu_book' },
    { type: 'coach', title: 'Ask AI Coach: Why am I weak in Calculus?', tab: 'coach', badge: 'AI Assistant', icon: 'psychology' },
    ...tutors.map((t) => ({
      type: 'tutor',
      title: `${t.name} - ${t.specialty}`,
      tab: 'tutors',
      badge: `Tutor (৳${t.hourlyRateBDT})`,
      icon: 'school',
    })),
  ];

  const filteredItems = sampleSearchItems.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.badge.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-[#000000]/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#ffffff] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#c5c6cd] overflow-hidden flex flex-col">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#c5c6cd]/60 gap-3">
          <span className="material-symbols-outlined text-[#75777e] text-[22px]">search</span>
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search subjects, questions, mistake topics, tutors..."
            className="w-full bg-transparent border-none text-[#1b1c1b] text-base placeholder-[#75777e] focus:outline-none focus:ring-0"
          />
          <kbd
            onClick={onClose}
            className="cursor-pointer bg-[#f5f3f1] hover:bg-[#eae8e6] text-[#44474d] text-xs font-mono px-2 py-1 rounded border border-[#c5c6cd]"
          >
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-3 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-[#75777e]">
              <p className="text-sm">No matching topics or tutors found.</p>
            </div>
          ) : (
            filteredItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onNavigate(item.tab);
                  onClose();
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#f5f3f1] transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#f5f3f1] group-hover:bg-[#ffffff] flex items-center justify-center text-[#000000] border border-[#c5c6cd]/50">
                    <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1b1c1b] group-hover:text-[#000000]">
                      {item.title}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-[#aa3000] bg-[#ffdbd0]/40 border border-[#ffdbd0] px-2.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              </button>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-[#f5f3f1] border-t border-[#c5c6cd]/40 flex justify-between items-center text-xs text-[#75777e]">
          <span>Navigate with click or arrows</span>
          <span>Exam Mastery OS Quick Jump</span>
        </div>
      </div>
    </div>
  );
};
