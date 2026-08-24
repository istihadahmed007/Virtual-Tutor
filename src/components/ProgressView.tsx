import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface ProgressViewProps {
  onStartPractice: () => void;
  onStartExam: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({ onStartPractice, onStartExam }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('30d');

  const trendData = [
    { date: 'Aug 01', score: 62, physics: 70, math: 50 },
    { date: 'Aug 06', score: 66, physics: 74, math: 48 },
    { date: 'Aug 11', score: 71, physics: 78, math: 42 },
    { date: 'Aug 16', score: 75, physics: 80, math: 46 },
    { date: 'Aug 20', score: 74, physics: 81, math: 40 },
    { date: 'Aug 24', score: 78, physics: 82, math: 43 },
  ];

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f5f3f1] text-[#000000] text-xs font-bold uppercase tracking-wider mb-2 border border-[#c5c6cd]/60">
            <span className="material-symbols-outlined text-[14px]">insights</span>
            Performance Analytics
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#000000]">
            Diagnostic Progress & Trajectory
          </h2>
          <p className="text-sm text-[#44474d] mt-1">
            Data-backed examination readiness model tracking accuracy, pacing, and retention curve.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTimeRange('7d')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              timeRange === '7d' ? 'bg-[#000000] text-white' : 'bg-[#ffffff] text-[#44474d] border border-[#c5c6cd]'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              timeRange === '30d' ? 'bg-[#000000] text-white' : 'bg-[#ffffff] text-[#44474d] border border-[#c5c6cd]'
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setTimeRange('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              timeRange === 'all' ? 'bg-[#000000] text-white' : 'bg-[#ffffff] text-[#44474d] border border-[#c5c6cd]'
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {/* 4 KPIs Bento */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-[#ffffff] rounded-2xl p-5 sm:p-6 border border-[#c5c6cd]/60 ambient-shadow space-y-1">
          <span className="text-[11px] font-bold text-[#75777e] uppercase tracking-wider">
            Overall Readiness
          </span>
          <p className="font-display text-3xl font-bold text-[#000000]">78%</p>
          <p className="text-xs text-green-700 font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
            +4% vs last week
          </p>
        </div>

        <div className="bg-[#ffffff] rounded-2xl p-5 sm:p-6 border border-[#c5c6cd]/60 ambient-shadow space-y-1">
          <span className="text-[11px] font-bold text-[#75777e] uppercase tracking-wider">
            Questions Solved
          </span>
          <p className="font-display text-3xl font-bold text-[#000000]">1,245</p>
          <p className="text-xs text-[#75777e]">Target: 2,000 before exam</p>
        </div>

        <div className="bg-[#ffffff] rounded-2xl p-5 sm:p-6 border border-[#c5c6cd]/60 ambient-shadow space-y-1">
          <span className="text-[11px] font-bold text-[#75777e] uppercase tracking-wider">
            Average Speed
          </span>
          <p className="font-display text-3xl font-bold text-[#000000]">1m 12s</p>
          <p className="text-xs text-green-700 font-semibold">Optimal for engineering</p>
        </div>

        <div className="bg-[#ffffff] rounded-2xl p-5 sm:p-6 border border-[#c5c6cd]/60 ambient-shadow space-y-1">
          <span className="text-[11px] font-bold text-[#75777e] uppercase tracking-wider">
            Current Streak
          </span>
          <p className="font-display text-3xl font-bold text-[#aa3000]">12 Days</p>
          <p className="text-xs text-[#aa3000] font-semibold">Active habit streak</p>
        </div>
      </div>

      {/* Accuracy Trend Chart */}
      <div className="bg-[#ffffff] rounded-3xl p-6 sm:p-8 border border-[#c5c6cd]/60 ambient-shadow space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-display text-xl font-bold text-[#000000]">
              Score Accuracy & Subject Trajectory
            </h3>
            <p className="text-xs text-[#75777e]">Composite score vs individual subject retention</p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#000000]" />
              <span>Overall</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#aa3000]" />
              <span>Calculus</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#efedec" vertical={false} />
              <XAxis dataKey="date" stroke="#75777e" fontSize={11} />
              <YAxis domain={[30, 100]} stroke="#75777e" fontSize={11} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#000000',
                  borderRadius: '12px',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                name="Overall Score"
                stroke="#000000"
                strokeWidth={3}
                dot={{ fill: '#000000', r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="math"
                name="Calculus"
                stroke="#aa3000"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ fill: '#aa3000', r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tactical Call to Action */}
      <div className="bg-[#f5f3f1] rounded-2xl p-6 border border-[#c5c6cd]/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-display text-base font-bold text-[#000000]">
            Ready to calibrate your trajectory?
          </h4>
          <p className="text-xs text-[#44474d] mt-0.5">
            Take a 15-minute quick practice or launch a full timed mock test.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onStartPractice}
            className="px-4 py-2.5 bg-[#ffffff] hover:bg-[#eae8e6] text-[#000000] text-xs font-bold rounded-xl border border-[#c5c6cd] transition-all"
          >
            Quick Practice
          </button>
          <button
            onClick={onStartExam}
            className="px-4 py-2.5 bg-[#aa3000] hover:bg-[#8e2800] text-white text-xs font-bold rounded-xl transition-all shadow-sm"
          >
            Full Mock Exam
          </button>
        </div>
      </div>
    </div>
  );
};
