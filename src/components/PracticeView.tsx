import React, { useState } from 'react';

interface PracticeViewProps {
  onStartSession: (subject: string, topic?: string, count?: number) => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({ onStartSession }) => {
  const [selectedSubject, setSelectedSubject] = useState<'All' | 'Physics' | 'Mathematics' | 'Chemistry'>('All');

  const topics = [
    {
      id: 'p1',
      subject: 'Physics',
      name: 'Thermodynamics & Heat Cycles',
      questionsCount: 45,
      accuracy: '64%',
      difficulty: 'Medium',
      icon: 'local_fire_department',
    },
    {
      id: 'm1',
      subject: 'Mathematics',
      name: 'Calculus: Integration by Parts & Partial Fractions',
      questionsCount: 60,
      accuracy: '43%',
      difficulty: 'Hard',
      isWeak: true,
      icon: 'functions',
    },
    {
      id: 'p2',
      subject: 'Physics',
      name: 'Kinematics & Projectile Dynamics',
      questionsCount: 50,
      accuracy: '88%',
      difficulty: 'Medium',
      icon: 'trending_up',
    },
    {
      id: 'c1',
      subject: 'Chemistry',
      name: 'Organic Chemistry: Electrophilic Substitution',
      questionsCount: 35,
      accuracy: '72%',
      difficulty: 'Medium',
      icon: 'science',
    },
    {
      id: 'p3',
      subject: 'Physics',
      name: 'Wave Optics & Doppler Effect',
      questionsCount: 40,
      accuracy: '80%',
      difficulty: 'Hard',
      icon: 'graphic_eq',
    },
    {
      id: 'm2',
      subject: 'Mathematics',
      name: 'Quadratic Discriminants & Complex Roots',
      questionsCount: 30,
      accuracy: '75%',
      difficulty: 'Easy',
      icon: 'calculate',
    },
  ];

  const filteredTopics = selectedSubject === 'All' ? topics : topics.filter((t) => t.subject === selectedSubject);

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#000000]">
          Practice Library
        </h2>
        <p className="text-sm text-[#44474d] mt-1">
          Adaptive problem sets and micro-drills engineered for rapid knowledge retention.
        </p>
      </div>

      {/* Featured Practice Modes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Adaptive Engine */}
        <div className="bg-[#ffffff] rounded-2xl p-6 border border-[#c5c6cd]/60 ambient-shadow flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#000000] text-white flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[22px]">auto_mode</span>
            </div>
            <h3 className="font-display text-lg font-bold text-[#000000]">Adaptive AI Engine</h3>
            <p className="text-xs text-[#44474d] mt-1.5 leading-relaxed">
              Dynamically scales difficulty in real-time based on your response latency and error probability.
            </p>
          </div>
          <button
            onClick={() => onStartSession('Adaptive', 'All Subjects', 15)}
            className="mt-6 w-full py-2.5 bg-[#000000] hover:bg-[#1b1c1b] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">play_arrow</span>
            Start Adaptive Session (15 Qs)
          </button>
        </div>

        {/* Targeted Weakness Drill */}
        <div className="bg-[#ffffff] rounded-2xl p-6 border border-[#ffdbd0] shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-20 h-20 bg-[#ffdbd0]/40 rounded-full" />
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#aa3000] text-white flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[22px]">target</span>
            </div>
            <h3 className="font-display text-lg font-bold text-[#000000]">Weakness Blitz</h3>
            <p className="text-xs text-[#44474d] mt-1.5 leading-relaxed">
              Exclusively presents questions from topics where your accuracy is currently below 60%.
            </p>
          </div>
          <button
            onClick={() => onStartSession('Mathematics', 'Calculus', 10)}
            className="mt-6 w-full py-2.5 bg-[#aa3000] hover:bg-[#8e2800] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">flash_on</span>
            Target Calculus (10 Qs)
          </button>
        </div>

        {/* Speed Sprint */}
        <div className="bg-[#ffffff] rounded-2xl p-6 border border-[#c5c6cd]/60 ambient-shadow flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#f5f3f1] text-[#000000] flex items-center justify-center mb-4 border border-[#c5c6cd]/60">
              <span className="material-symbols-outlined text-[22px]">speed</span>
            </div>
            <h3 className="font-display text-lg font-bold text-[#000000]">Timed Speed Drill</h3>
            <p className="text-xs text-[#44474d] mt-1.5 leading-relaxed">
              30 seconds per question to build exam pacing and eliminate hesitations on standard formulas.
            </p>
          </div>
          <button
            onClick={() => onStartSession('Physics', 'Speed Sprint', 10)}
            className="mt-6 w-full py-2.5 bg-[#f5f3f1] hover:bg-[#eae8e6] text-[#000000] text-xs font-bold rounded-xl border border-[#c5c6cd] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">timer</span>
            Start Sprint (5 Mins)
          </button>
        </div>
      </div>

      {/* Subject Filter Pills */}
      <div className="flex items-center justify-between pt-4 border-t border-[#c5c6cd]/40">
        <h3 className="font-display text-xl font-bold text-[#000000]">Topic-Wise Catalog</h3>
        <div className="flex items-center gap-2">
          {(['All', 'Physics', 'Mathematics', 'Chemistry'] as const).map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                selectedSubject === sub
                  ? 'bg-[#000000] text-white shadow-sm'
                  : 'bg-[#f5f3f1] text-[#44474d] hover:text-[#000000]'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTopics.map((topic) => (
          <div
            key={topic.id}
            className={`bg-[#ffffff] rounded-2xl p-5 border transition-all ${
              topic.isWeak
                ? 'border-[#ffdbd0] hover:border-[#aa3000]'
                : 'border-[#c5c6cd]/60 hover:border-[#000000]'
            } ambient-shadow flex items-center justify-between gap-4`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  topic.isWeak ? 'bg-[#ffdbd0]/50 text-[#aa3000]' : 'bg-[#f5f3f1] text-[#000000]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{topic.icon}</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-[#75777e] uppercase tracking-wider">
                    {topic.subject}
                  </span>
                  {topic.isWeak && (
                    <span className="text-[10px] font-bold text-[#aa3000] bg-[#ffdbd0]/60 px-1.5 py-0.2 rounded">
                      Low Accuracy
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-[#000000] mt-0.5">{topic.name}</h4>
                <p className="text-xs text-[#75777e] mt-1">
                  {topic.questionsCount} questions • Historical Accuracy: <strong>{topic.accuracy}</strong>
                </p>
              </div>
            </div>

            <button
              onClick={() => onStartSession(topic.subject, topic.name, 10)}
              className="px-4 py-2 bg-[#f5f3f1] hover:bg-[#000000] hover:text-white text-[#000000] text-xs font-bold rounded-xl transition-all shrink-0 cursor-pointer"
            >
              Practice
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
