import React, { useState } from 'react';

interface ProfileViewProps {
  onUpgrade: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onUpgrade }) => {
  const [name, setName] = useState('Ahmed Khan');
  const [targetBatch, setTargetBatch] = useState('HSC 24 Batch');
  const [targetExam, setTargetExam] = useState('University Admission Test');
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(60);

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto pb-8 font-body">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
          Student Profile
        </h1>
        <p className="text-sm text-[#64748B] mt-0.5">
          Manage your exam targets, daily study goals, and account preferences.
        </p>
      </div>

      {/* User Hero Card matching Mockup */}
      <div className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            alt={name}
            className="w-20 h-20 rounded-3xl object-cover border-2 border-[#4F46E5]/20 shadow-md"
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0F172A]">
                {name}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-[#EEF2FF] text-[#4F46E5] text-xs font-bold">
                Student
              </span>
            </div>
            <p className="text-xs font-semibold text-[#64748B]">{targetBatch} • {targetExam}</p>
            <div className="flex items-center gap-3 pt-1 text-xs font-semibold">
              <span className="text-[#D97706] flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] symbol-filled">local_fire_department</span>
                14 Day Streak
              </span>
              <span className="text-[#4F46E5] flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">bolt</span>
                1,450 XP
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onUpgrade}
          className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:from-[#4338CA] hover:to-[#6D28D9] rounded-xl transition-all shadow-md shadow-indigo-500/20 active:scale-95 cursor-pointer whitespace-nowrap"
        >
          Upgrade to Pro
        </button>
      </div>

      {/* Target Exam & Settings Form */}
      <div className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm space-y-6">
        <h3 className="font-display text-lg font-bold text-[#0F172A] pb-3 border-b border-[#F1F5F9]">
          Exam Target Settings
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#334155]">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm text-[#0F172A] font-semibold outline-none focus:border-[#4F46E5]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#334155]">Target Batch / Year</label>
            <input
              type="text"
              value={targetBatch}
              onChange={(e) => setTargetBatch(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm text-[#0F172A] font-semibold outline-none focus:border-[#4F46E5]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#334155]">Target University / Exam</label>
            <input
              type="text"
              value={targetExam}
              onChange={(e) => setTargetExam(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm text-[#0F172A] font-semibold outline-none focus:border-[#4F46E5]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#334155]">Daily Study Goal (Minutes)</label>
            <input
              type="number"
              value={dailyGoalMinutes}
              onChange={(e) => setDailyGoalMinutes(Number(e.target.value))}
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm text-[#0F172A] font-semibold outline-none focus:border-[#4F46E5]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
