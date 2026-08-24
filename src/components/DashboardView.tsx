import React from 'react';
import { Tutor } from '../types';
import { useMastery } from '../hooks/useMastery';
import { useStudyPlan } from '../hooks/useStudyPlan';
import { useMistakes } from '../hooks/useMistakes';

interface DashboardViewProps {
  onStartExam: (subject?: string) => void;
  onStartPractice: (topic?: string) => void;
  onNavigateTab: (tab: string) => void;
  onOpenBooking: (tutor: Tutor) => void;
  tutors: Tutor[];
  targetDays: number;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onStartExam,
  onStartPractice,
  onNavigateTab,
  onOpenBooking,
  tutors,
  targetDays,
}) => {
  const { overallScore, weakestTopics, subjectMasteries } = useMastery();
  const { studyPlan } = useStudyPlan();
  const { mistakes } = useMistakes();

  const primaryWeakTopic = weakestTopics[0]?.topic || 'Integration by Parts';
  const primaryWeakScore = weakestTopics[0]?.masteryScore || 43;

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto pb-8 font-body">
      {/* 1. Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Good evening, Ahmed! 👋
          </h1>
          <p className="text-sm sm:text-base text-[#64748B] mt-1 font-medium">
            You're <span className="text-[#4F46E5] font-bold">{overallScore}%</span> ready for your target exam.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('coach')}
            className="px-4 py-2 text-xs sm:text-sm font-bold text-[#4F46E5] bg-[#EEF2FF] hover:bg-[#E0E7FF] rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">psychology</span>
            <span>Ask AI Coach</span>
          </button>
          <button
            onClick={() => onStartPractice(primaryWeakTopic)}
            className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-xl transition-all shadow-sm shadow-indigo-500/20 flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">bolt</span>
            <span>Quick Drill</span>
          </button>
        </div>
      </div>

      {/* 2. 4 Dashboard Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Overall Mastery */}
        <div className="bg-[#FFFFFF] rounded-2xl p-5 border border-[#E2E8F0] shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">
              Overall Mastery
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl font-extrabold text-[#0F172A]">{overallScore}%</span>
            </div>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
              6% from last week
            </span>
          </div>

          {/* Mini Progress Ring */}
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[#E2E8F0]"
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
            <span className="material-symbols-outlined text-[#4F46E5] text-[18px] absolute">
              verified
            </span>
          </div>
        </div>

        {/* Metric 2: Study Streak */}
        <div className="bg-[#FFFFFF] rounded-2xl p-5 border border-[#E2E8F0] shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">
              Study Streak
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-3xl font-extrabold text-[#0F172A]">14</span>
              <span className="text-xs font-bold text-[#64748B]">days</span>
            </div>
            <span className="text-xs font-semibold text-amber-600 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] symbol-filled">local_fire_department</span>
              Keep it up!
            </span>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-[#FFFBEB] text-[#D97706] flex items-center justify-center border border-[#FDE68A]">
            <span className="material-symbols-outlined text-[24px] symbol-filled">local_fire_department</span>
          </div>
        </div>

        {/* Metric 3: Study Time */}
        <div className="bg-[#FFFFFF] rounded-2xl p-5 border border-[#E2E8F0] shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">
              Study Time
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-3xl font-extrabold text-[#0F172A]">18.5</span>
              <span className="text-xs font-bold text-[#64748B]">hours</span>
            </div>
            <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              This week
            </span>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center border border-[#BFDBFE]">
            <span className="material-symbols-outlined text-[24px]">timer</span>
          </div>
        </div>

        {/* Metric 4: Exam Readiness */}
        <div className="bg-[#FFFFFF] rounded-2xl p-5 border border-[#E2E8F0] shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">
              Exam Readiness
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-3xl font-extrabold text-[#0F172A]">72%</span>
            </div>
            <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">insights</span>
              On track!
            </span>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center border border-[#C7D2FE]">
            <span className="material-symbols-outlined text-[24px]">trending_up</span>
          </div>
        </div>
      </div>

      {/* 3. Middle 2-Column Section: Today's Priority & Upcoming Exam */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Today's Priority Card (Highlighted) */}
        <div className="lg:col-span-8 bg-gradient-to-br from-[#FFFFFF] via-[#FFFFFF] to-[#EEF2FF]/40 rounded-3xl p-6 sm:p-8 border border-[#C7D2FE] shadow-sm relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-4 max-w-md z-10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4F46E5] bg-[#EEF2FF] px-3 py-1 rounded-full border border-[#C7D2FE]">
                Today's Priority
              </span>
              <span className="text-xs font-bold text-[#EF4444] bg-[#FEE2E2] px-2.5 py-0.5 rounded-full">
                Weak Topic
              </span>
            </div>

            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                {primaryWeakTopic}
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-[#64748B] mt-1">
                Mastery: <span className="text-[#EF4444] font-bold">{primaryWeakScore}%</span> • Calculus & Integration
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              AI recommends 20 minutes of focused adaptive practice to reinforce factorization and the LIATE integration rule.
            </p>

            <div className="pt-2">
              <button
                id="dashboard-start-practice-btn"
                onClick={() => onStartPractice(primaryWeakTopic)}
                className="px-6 py-3 text-sm font-bold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-xl transition-all shadow-md shadow-indigo-500/25 active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <span>Start Practice</span>
                <span className="material-symbols-outlined text-[18px]">play_arrow</span>
              </button>
            </div>
          </div>

          {/* 3D Dartboard / Target Vector Graphic */}
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 shrink-0 flex items-center justify-center">
            {/* Concentric circles target illustration */}
            <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-[#EEF2FF] to-[#E0E7FF] flex items-center justify-center p-4 border-4 border-[#C7D2FE]/60 shadow-inner">
              <div className="w-28 h-28 rounded-full bg-[#FFFFFF] flex items-center justify-center p-3 shadow-md">
                <div className="w-18 h-18 rounded-full bg-[#EF4444] flex items-center justify-center text-white shadow-lg shadow-red-500/30">
                  <span className="material-symbols-outlined text-[32px]">crisis_alert</span>
                </div>
              </div>
            </div>

            {/* Floating XP pill */}
            <div className="absolute -bottom-1 right-2 bg-[#FFFFFF] px-3 py-1 rounded-full border border-[#E2E8F0] shadow-md text-xs font-extrabold text-[#4F46E5] flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-amber-500">bolt</span>
              +50 XP
            </div>
          </div>
        </div>

        {/* Right Column: Upcoming Exam Card */}
        <div className="lg:col-span-4 bg-[#FFFFFF] rounded-3xl p-6 sm:p-7 border border-[#E2E8F0] shadow-sm flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] bg-[#F1F5F9] px-2.5 py-1 rounded-lg">
                Upcoming Exam
              </span>
              <span className="material-symbols-outlined text-[#4F46E5] text-[20px]">event</span>
            </div>

            <div>
              <h3 className="font-display text-xl font-bold text-[#0F172A]">
                University Admission Test
              </h3>
              <p className="text-xs font-semibold text-[#64748B] mt-0.5">
                Dec 15, 2024
              </p>
            </div>

            <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-[#E2E8F0] flex items-center justify-between">
              <div>
                <span className="font-display text-3xl font-extrabold text-[#4F46E5]">{targetDays}</span>
                <span className="text-xs font-bold text-[#64748B] ml-1.5">days left</span>
              </div>
              <span className="text-xs font-semibold text-[#10B981] bg-[#ECFDF5] px-2.5 py-1 rounded-full border border-[#A7F3D0]">
                Prepare consistently!
              </span>
            </div>
          </div>

          <button
            onClick={() => onStartExam('Mathematics')}
            className="w-full py-3 text-xs sm:text-sm font-bold text-[#0F172A] hover:text-white bg-[#F1F5F9] hover:bg-[#0F172A] border border-[#E2E8F0] rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>View Exam</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* 4. Bottom 3-Column Grid: Mastery by Subject, Weak Topics, Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1: Mastery by Subject */}
        <div className="bg-[#FFFFFF] rounded-3xl p-6 border border-[#E2E8F0] shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-[#0F172A]">
              Mastery by Subject
            </h3>
            <button
              onClick={() => onNavigateTab('subjects')}
              className="text-xs font-bold text-[#4F46E5] hover:underline cursor-pointer"
            >
              View all
            </button>
          </div>

          <div className="space-y-4">
            {[
              { name: 'Mathematics', score: 72, color: 'bg-[#4F46E5]' },
              { name: 'Physics', score: 82, color: 'bg-[#10B981]' },
              { name: 'Chemistry', score: 64, color: 'bg-[#F59E0B]' },
              { name: 'English', score: 71, color: 'bg-[#3B82F6]' },
              { name: 'Biology', score: 68, color: 'bg-[#EC4899]' },
            ].map((sub) => (
              <div key={sub.name} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#334155]">{sub.name}</span>
                  <span className="text-[#0F172A]">{sub.score}%</span>
                </div>
                <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                  <div
                    className={`h-full ${sub.color} rounded-full transition-all duration-500`}
                    style={{ width: `${sub.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Weak Topics */}
        <div className="bg-[#FFFFFF] rounded-3xl p-6 border border-[#E2E8F0] shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-[#0F172A]">
              Weak Topics
            </h3>
            <button
              onClick={() => onNavigateTab('mistakes')}
              className="text-xs font-bold text-[#4F46E5] hover:underline cursor-pointer"
            >
              View all
            </button>
          </div>

          <div className="space-y-3">
            {[
              { topic: 'Integration by Parts', score: 43, subject: 'Math' },
              { topic: 'Trigonometric Integration', score: 31, subject: 'Math' },
              { topic: 'Organic Reactions', score: 45, subject: 'Chem' },
              { topic: 'Limits & Continuity', score: 40, subject: 'Math' },
            ].map((item) => (
              <div
                key={item.topic}
                onClick={() => onStartPractice(item.topic)}
                className="p-3 bg-[#F8FAFC] hover:bg-[#EEF2FF] rounded-2xl border border-[#E2E8F0] flex items-center justify-between transition-colors cursor-pointer group"
              >
                <div>
                  <p className="text-xs font-bold text-[#0F172A] group-hover:text-[#4F46E5] transition-colors">
                    {item.topic}
                  </p>
                  <p className="text-[10px] text-[#64748B]">{item.subject} • Urgent</p>
                </div>
                <span className="text-xs font-extrabold text-[#EF4444] bg-[#FEE2E2] px-2.5 py-1 rounded-full">
                  {item.score}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Recent Activity */}
        <div className="bg-[#FFFFFF] rounded-3xl p-6 border border-[#E2E8F0] shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-[#0F172A]">
              Recent Activity
            </h3>
            <button
              onClick={() => onNavigateTab('progress')}
              className="text-xs font-bold text-[#4F46E5] hover:underline cursor-pointer"
            >
              View all
            </button>
          </div>

          <div className="space-y-3">
            {[
              {
                title: 'Solved 15 questions in Integration',
                time: '2 hours ago',
                xp: '+15 XP',
                icon: 'check_circle',
                iconColor: 'text-emerald-500 bg-emerald-50',
              },
              {
                title: 'Completed practice test',
                time: '5 hours ago',
                xp: '+50 XP',
                icon: 'assignment_turned_in',
                iconColor: 'text-blue-500 bg-blue-50',
              },
              {
                title: 'Study streak increased to 14 days',
                time: '1 day ago',
                xp: '+10 XP',
                icon: 'local_fire_department',
                iconColor: 'text-amber-500 bg-amber-50',
              },
            ].map((act, i) => (
              <div key={i} className="p-3 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${act.iconColor}`}>
                  <span className="material-symbols-outlined text-[18px]">{act.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#0F172A] truncate">{act.title}</p>
                  <p className="text-[10px] text-[#64748B]">{act.time}</p>
                </div>
                <span className="text-[11px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md shrink-0">
                  {act.xp}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
