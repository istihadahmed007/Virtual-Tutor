import React, { useState } from 'react';
import { useMistakes } from '../hooks/useMistakes';
import { MistakeItem } from '../types';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface MistakeBookViewProps {
  onPracticeMistake: (mistake: MistakeItem) => void;
  onOpenSocraticTutor: (mistake: MistakeItem) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Calculation Error': '#EF4444',
  'Conceptual Error': '#8B5CF6',
  'Careless Mistake': '#F59E0B',
  'Formula Error': '#3B82F6',
  'Misread Question': '#EC4899',
  'Time Pressure': '#6366F1',
  'Guess': '#10B981',
};

export const MistakeBookView: React.FC<MistakeBookViewProps> = ({
  onPracticeMistake,
  onOpenSocraticTutor,
}) => {
  const { mistakes, analytics } = useMistakes();
  const [activeFilter, setActiveFilter] = useState<'all' | 'recent' | 'categories'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Compute category breakdown
  const categoryCountMap: Record<string, number> = {
    'Calculation Error': 8,
    'Conceptual Error': 5,
    'Careless Mistake': 3,
    'Formula Error': 2,
  };

  mistakes.forEach((m) => {
    const cat = m.category || 'Conceptual Error';
    categoryCountMap[cat] = (categoryCountMap[cat] || 0) + 1;
  });

  const pieData = Object.entries(categoryCountMap).map(([name, value]) => ({
    name,
    value,
    color: CATEGORY_COLORS[name] || '#64748B',
  }));

  const totalMistakesCount = Object.values(categoryCountMap).reduce((a, b) => a + b, 0);

  const filteredMistakes = mistakes.filter((m) => {
    if (selectedCategory) return m.category === selectedCategory;
    return true;
  });

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto pb-8 font-body">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Mistake Book
          </h1>
          <p className="text-sm text-[#64748B] mt-0.5">
            Analyze recurring conceptual errors and practice targeted remediation.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-[#FFFFFF] p-1 rounded-xl border border-[#E2E8F0] shadow-2xs">
          <button
            onClick={() => {
              setActiveFilter('all');
              setSelectedCategory(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'all' && !selectedCategory
                ? 'bg-[#4F46E5] text-white shadow-2xs'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            All Mistakes
          </button>
          <button
            onClick={() => setActiveFilter('recent')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'recent'
                ? 'bg-[#4F46E5] text-white shadow-2xs'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Recent
          </button>
        </div>
      </div>

      {/* 2. Most Common Mistakes Donut Chart & Legend matching Mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-12 bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Chart Graphic */}
          <div className="flex flex-col sm:flex-row items-center gap-8 w-full md:w-auto">
            <div className="relative w-40 h-40 shrink-0 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center">
                <span className="font-display text-2xl font-extrabold text-[#0F172A]">
                  {totalMistakesCount}
                </span>
                <span className="block text-[10px] font-bold text-[#64748B] uppercase">Total</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-display text-lg font-bold text-[#0F172A]">
                Most Common Mistakes
              </h3>
              <p className="text-xs text-[#64748B] max-w-sm">
                Calculation errors and partial fraction factorization represent over 60% of lost exam marks.
              </p>
            </div>
          </div>

          {/* Interactive Category Legend Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 w-full md:w-auto">
            {pieData.map((item) => (
              <button
                key={item.name}
                onClick={() => setSelectedCategory(selectedCategory === item.name ? null : item.name)}
                className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between gap-4 cursor-pointer ${
                  selectedCategory === item.name
                    ? 'border-[#4F46E5] bg-[#EEF2FF]'
                    : 'border-[#E2E8F0] hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-bold text-[#334155]">{item.name}</span>
                </div>
                <span className="text-xs font-extrabold text-[#0F172A]">{item.value}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Mistake Cards List matching Mockup */}
      <div className="space-y-4">
        {filteredMistakes.map((mistake) => (
          <div
            key={mistake.id}
            className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-7 border border-[#E2E8F0] shadow-sm space-y-4 hover:border-[#CBD5E1] transition-all"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#4F46E5] bg-[#EEF2FF] px-3 py-1 rounded-full">
                  {mistake.question.subject}
                </span>
                <span className="text-xs font-bold text-[#64748B]">
                  {mistake.question.topic}
                </span>
              </div>

              <span
                className="text-xs font-bold px-3 py-1 rounded-full text-white"
                style={{ backgroundColor: CATEGORY_COLORS[mistake.category || 'Conceptual Error'] || '#EF4444' }}
              >
                {mistake.category || 'Conceptual Error'}
              </span>
            </div>

            {/* Question Text */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-[#0F172A]">
                {mistake.question.title || mistake.question.questionText}
              </h4>
              {mistake.question.formula && (
                <div className="p-3 bg-[#F8FAFC] rounded-xl font-mono text-sm font-bold text-[#0F172A] inline-block">
                  {mistake.question.formula}
                </div>
              )}
            </div>

            {/* Answer Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 bg-[#FEF2F2] rounded-2xl border border-[#FEE2E2] flex items-center justify-between">
                <span className="text-xs font-bold text-[#991B1B]">
                  Your Answer: <span className="font-mono">Option B</span> (Incorrect)
                </span>
                <span className="material-symbols-outlined text-red-500 text-[18px]">close</span>
              </div>
              <div className="p-3.5 bg-[#F0FDF4] rounded-2xl border border-[#DCFCE7] flex items-center justify-between">
                <span className="text-xs font-bold text-[#166534]">
                  Correct Answer: <span className="font-mono">{mistake.question.correctAnswer}</span>
                </span>
                <span className="material-symbols-outlined text-emerald-500 text-[18px]">check</span>
              </div>
            </div>

            {/* Why you missed it */}
            <p className="text-xs text-[#475569] bg-[#F8FAFC] p-3.5 rounded-2xl border border-[#E2E8F0] leading-relaxed">
              <strong className="text-[#0F172A]">Why you missed it:</strong> {mistake.question.explanation.whyWrongDetails || 'Factored the denominator incorrectly; missed grouping linear terms.'}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-end gap-3">
              <button
                onClick={() => onOpenSocraticTutor(mistake)}
                className="px-4 py-2 text-xs font-bold text-[#4F46E5] bg-[#EEF2FF] hover:bg-[#E0E7FF] rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">psychology</span>
                <span>Socratic AI Remediation</span>
              </button>
              <button
                onClick={() => onPracticeMistake(mistake)}
                className="px-5 py-2 text-xs font-bold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-xl transition-all shadow-sm shadow-indigo-500/20 active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">replay</span>
                <span>Practice Again</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
