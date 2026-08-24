import React from 'react';

interface SubjectsViewProps {
  onSelectSubject: (subject: string) => void;
  onStartPractice: (topic: string) => void;
}

const SUBJECT_DATA = [
  {
    id: 'Mathematics',
    name: 'Mathematics',
    icon: 'functions',
    color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    barColor: 'bg-indigo-600',
    mastery: 72,
    topicsCount: 18,
    keyTopics: ['Integration by Parts', 'Calculus', 'Limits', 'Vectors'],
  },
  {
    id: 'Physics',
    name: 'Physics',
    icon: 'bolt',
    color: 'text-amber-600 bg-amber-50 border-amber-100',
    barColor: 'bg-amber-600',
    mastery: 82,
    topicsCount: 14,
    keyTopics: ['Thermodynamics', 'Mechanics', 'Waves', 'Optics'],
  },
  {
    id: 'Chemistry',
    name: 'Chemistry',
    icon: 'science',
    color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    barColor: 'bg-emerald-600',
    mastery: 64,
    topicsCount: 16,
    keyTopics: ['Organic Reactions', 'Kinetics', 'Electrochemistry', 'Periodic Trends'],
  },
  {
    id: 'Biology',
    name: 'Biology',
    icon: 'genetics',
    color: 'text-rose-600 bg-rose-50 border-rose-100',
    barColor: 'bg-rose-600',
    mastery: 78,
    topicsCount: 12,
    keyTopics: ['Genetics', 'Cell Biology', 'Human Physiology', 'Ecology'],
  },
  {
    id: 'English',
    name: 'English',
    icon: 'menu_book',
    color: 'text-sky-600 bg-sky-50 border-sky-100',
    barColor: 'bg-sky-600',
    mastery: 71,
    topicsCount: 10,
    keyTopics: ['Reading Comprehension', 'Advanced Grammar', 'Vocabulary'],
  },
  {
    id: 'Computer Science',
    name: 'Computer Science',
    icon: 'code',
    color: 'text-purple-600 bg-purple-50 border-purple-100',
    barColor: 'bg-purple-600',
    mastery: 85,
    topicsCount: 15,
    keyTopics: ['Data Structures', 'Algorithms', 'SQL & Databases', 'OOP'],
  },
];

export const SubjectsView: React.FC<SubjectsViewProps> = ({
  onSelectSubject,
  onStartPractice,
}) => {
  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto pb-8 font-body">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
          Subjects & Curriculum
        </h1>
        <p className="text-sm text-[#64748B] mt-0.5">
          Select a subject to practice adaptive drills or review specific conceptual chapters.
        </p>
      </div>

      {/* Grid of Subjects matching Mockup */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SUBJECT_DATA.map((sub) => (
          <div
            key={sub.id}
            className="bg-[#FFFFFF] rounded-3xl p-6 border border-[#E2E8F0] shadow-sm hover:border-[#CBD5E1] transition-all flex flex-col justify-between space-y-5 group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${sub.color}`}>
                  <span className="material-symbols-outlined text-[24px]">{sub.icon}</span>
                </div>
                <span className="text-xs font-extrabold text-[#0F172A] bg-[#F8FAFC] px-3 py-1 rounded-full border border-[#E2E8F0]">
                  {sub.mastery}% Mastery
                </span>
              </div>

              <div>
                <h3 className="font-display text-xl font-bold text-[#0F172A] group-hover:text-[#4F46E5] transition-colors">
                  {sub.name}
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">{sub.topicsCount} Chapters & Modules</p>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                <div
                  className={`h-full ${sub.barColor} rounded-full transition-all duration-500`}
                  style={{ width: `${sub.mastery}%` }}
                />
              </div>

              {/* Key topic tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {sub.keyTopics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => onStartPractice(topic)}
                    className="text-[11px] font-semibold text-[#475569] hover:text-[#4F46E5] bg-[#F8FAFC] hover:bg-[#EEF2FF] px-2.5 py-1 rounded-lg border border-[#E2E8F0] transition-colors cursor-pointer"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => onSelectSubject(sub.name)}
              className="w-full py-2.5 text-xs font-bold text-[#4F46E5] bg-[#EEF2FF] hover:bg-[#E0E7FF] rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Explore Curriculum</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
