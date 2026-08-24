import React, { useState } from 'react';
import { useMastery } from '../hooks/useMastery';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from 'recharts';

interface ProgressViewProps {
  onStartPractice: (topic?: string) => void;
}

const WEEKLY_TREND = [
  { day: 'Mon', score: 58 },
  { day: 'Tue', score: 62 },
  { day: 'Wed', score: 65 },
  { day: 'Thu', score: 68 },
  { day: 'Fri', score: 72 },
  { day: 'Sat', score: 72 },
  { day: 'Sun', score: 74 },
];

const STUDY_TIME_DATA = [
  { day: 'Mon', hours: 2.5 },
  { day: 'Tue', hours: 3.0 },
  { day: 'Wed', hours: 1.8 },
  { day: 'Thu', hours: 3.2 },
  { day: 'Fri', hours: 4.0 },
  { day: 'Sat', hours: 2.0 },
  { day: 'Sun', hours: 2.0 },
];

export const ProgressView: React.FC<ProgressViewProps> = ({ onStartPractice }) => {
  const { overallScore, weakestTopics } = useMastery();
  const [activeRange, setActiveRange] = useState<'7d' | '30d' | 'all'>('7d');

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto pb-8 font-body">
      {/* 1. Header with Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Progress Analytics
          </h1>
          <p className="text-sm text-[#64748B] mt-0.5">
            Track your learning journey, mastery curves, and study distribution.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-[#FFFFFF] p-1 rounded-xl border border-[#E2E8F0] shadow-2xs">
          {(['7d', '30d', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setActiveRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeRange === range
                  ? 'bg-[#4F46E5] text-white shadow-2xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Top Row: Overall Mastery Gauge + Mastery Trend Line Chart matching Mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Overall Mastery Ring Card */}
        <div className="lg:col-span-4 bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm flex flex-col items-center justify-center text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
            Overall Mastery
          </span>

          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[#F1F5F9]"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#4F46E5]"
                strokeDasharray={`${overallScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute text-center">
              <span className="font-display text-3xl font-extrabold text-[#0F172A]">
                {overallScore}%
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold text-emerald-600 bg-[#ECFDF5] px-3 py-1 rounded-full border border-[#A7F3D0] inline-flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              ▲ 6% from last week
            </span>
            <p className="text-xs text-[#64748B] pt-1">Target exam readiness: On track</p>
          </div>
        </div>

        {/* Right: Mastery Trend Line Chart */}
        <div className="lg:col-span-8 bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-[#0F172A]">Mastery Trend</h3>
              <p className="text-xs text-[#64748B]">Score progression over daily practice</p>
            </div>
            <div className="flex items-center gap-2 bg-[#EEF2FF] px-3 py-1 rounded-xl text-xs font-bold text-[#4F46E5]">
              <span>72% Nov 15</span>
            </div>
          </div>

          <div className="h-60 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={WEEKLY_TREND}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} domain={[40, 100]} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#4F46E5"
                  strokeWidth={3.5}
                  dot={{ fill: '#4F46E5', r: 5 }}
                  activeDot={{ r: 7, fill: '#4338CA' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. Bottom Row: Topic Mastery & Study Time matching Mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Topic Mastery Progress Bars */}
        <div className="lg:col-span-6 bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-[#0F172A]">Topic Mastery</h3>
            <button
              onClick={() => onStartPractice()}
              className="text-xs font-bold text-[#4F46E5] hover:underline cursor-pointer"
            >
              Practice Weakest
            </button>
          </div>

          <div className="space-y-4">
            {[
              { topic: 'Limits & Continuity', score: 84, color: 'bg-emerald-500' },
              { topic: 'Derivatives & Chain Rule', score: 71, color: 'bg-blue-500' },
              { topic: 'Integration by Parts', score: 43, color: 'bg-red-500' },
              { topic: 'Trigonometric Integration', score: 31, color: 'bg-amber-500' },
            ].map((t) => (
              <div key={t.topic} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#334155]">{t.topic}</span>
                  <span className="text-[#0F172A]">{t.score}%</span>
                </div>
                <div className="w-full h-2.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                  <div
                    className={`h-full ${t.color} rounded-full transition-all duration-500`}
                    style={{ width: `${t.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Study Time Bar Chart */}
        <div className="lg:col-span-6 bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-[#0F172A]">Study Time</h3>
              <p className="text-xs font-semibold text-[#64748B] mt-0.5">
                <span className="font-extrabold text-[#0F172A]">18.5 hours</span> • +12% from last week
              </p>
            </div>
            <span className="material-symbols-outlined text-[#4F46E5] text-[22px]">timer</span>
          </div>

          <div className="h-52 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={STUDY_TIME_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                  formatter={(val: any) => [`${val} hrs`, 'Study Time']}
                />
                <Bar dataKey="hours" fill="#4F46E5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
