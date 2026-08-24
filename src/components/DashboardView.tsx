import React from 'react';
import { Tutor } from '../types';
import { DailyStudyGoal } from './DailyStudyGoal';

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
  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      {/* Top Banner / Exam Countdown Hero */}
      <div className="bg-[#ffffff] rounded-2xl p-6 sm:p-8 border border-[#c5c6cd]/60 ambient-shadow flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffdbd0]/60 text-[#aa3000] text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[14px]">schedule</span>
            High-Stakes Countdown: {targetDays} Days Remaining
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#000000]">
            Targeting Top 5% Engineering & Board Rank
          </h2>
          <p className="text-sm text-[#44474d] leading-relaxed">
            Your readiness score is at <strong>78%</strong>. Completing today’s targeted Calculus
            drill and reviewing 2 thermodynamics mistakes will lift your projected percentile to <strong>84%</strong>.
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 z-10">
          <button
            id="dashboard-continue-practice-btn"
            onClick={() => onStartPractice('Calculus')}
            className="w-full sm:w-auto px-6 py-3 bg-[#aa3000] hover:bg-[#8e2800] text-white font-bold text-sm rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">play_arrow</span>
            Continue Practice
          </button>
          <button
            id="dashboard-start-mock-btn"
            onClick={() => onStartExam('Physics')}
            className="w-full sm:w-auto px-6 py-3 bg-[#f5f3f1] hover:bg-[#eae8e6] text-[#000000] font-bold text-sm rounded-xl transition-all border border-[#c5c6cd]/80 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">assignment</span>
            Full Mock Exam
          </button>
        </div>
      </div>

      {/* Recommended Next Best Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Urgent Weakness Alert */}
        <div className="bg-[#ffffff] rounded-2xl p-6 border border-[#ffdbd0] shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#ffdbd0]/30 rounded-bl-full pointer-events-none" />
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#aa3000] bg-[#ffdbd0]/50 px-2.5 py-0.5 rounded">
                Urgent Recommendation
              </span>
              <span className="material-symbols-outlined text-[#aa3000] text-[20px]">warning</span>
            </div>
            <h3 className="font-display text-lg font-bold text-[#000000]">
              Calculus Accuracy Alert
            </h3>
            <p className="text-xs text-[#44474d] mt-1.5 leading-relaxed">
              Accuracy dropped to 43% in Integration by Parts. Take a 15-minute targeted drill to
              shore up algebraic factoring.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#f5f3f1] flex items-center justify-between">
            <span className="text-xs font-semibold text-[#75777e] flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">timer</span> 15 Mins
            </span>
            <button
              id="dashboard-fix-calculus-btn"
              onClick={() => onStartPractice('Calculus')}
              className="text-xs font-bold text-[#aa3000] hover:text-[#8e2800] flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
            >
              Practice Calculus
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Card 2: Adaptive Quick Practice */}
        <div className="bg-[#ffffff] rounded-2xl p-6 border border-[#c5c6cd]/60 ambient-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#000000] bg-[#f5f3f1] px-2.5 py-0.5 rounded">
                Adaptive Engine
              </span>
              <span className="material-symbols-outlined text-[#75777e] text-[20px]">tune</span>
            </div>
            <h3 className="font-display text-lg font-bold text-[#000000]">
              10-Question Quick Drill
            </h3>
            <p className="text-xs text-[#44474d] mt-1.5 leading-relaxed">
              Questions calibrated in real time based on your historical speed and mistake patterns.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#f5f3f1] flex items-center justify-between">
            <span className="text-xs font-semibold text-[#75777e]">Mixed Topics</span>
            <button
              id="dashboard-start-adaptive-btn"
              onClick={() => onStartPractice('Adaptive')}
              className="text-xs font-bold text-[#000000] hover:text-[#aa3000] flex items-center gap-1 cursor-pointer"
            >
              Start Session
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Card 3: Mistake Book Review */}
        <div className="bg-[#ffffff] rounded-2xl p-6 border border-[#c5c6cd]/60 ambient-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#000000] bg-[#f5f3f1] px-2.5 py-0.5 rounded">
                Review Queue
              </span>
              <span className="material-symbols-outlined text-[#75777e] text-[20px]">
                menu_book
              </span>
            </div>
            <h3 className="font-display text-lg font-bold text-[#000000]">
              5 Unresolved Mistakes
            </h3>
            <p className="text-xs text-[#44474d] mt-1.5 leading-relaxed">
              Review missed questions in Thermodynamics and Quadratic Discriminants with step-by-step AI insights.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#f5f3f1] flex items-center justify-between">
            <span className="text-xs font-semibold text-[#75777e]">Review Queue</span>
            <button
              id="dashboard-open-mistakes-btn"
              onClick={() => onNavigateTab('mistakes')}
              className="text-xs font-bold text-[#000000] hover:text-[#aa3000] flex items-center gap-1 cursor-pointer"
            >
              Open Mistake Book
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Subject Mastery + Featured Tutors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Subject Mastery & Performance breakdown */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#ffffff] rounded-2xl p-6 sm:p-7 border border-[#c5c6cd]/60 ambient-shadow">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display text-xl font-bold text-[#000000]">
                  Subject Mastery & Trajectory
                </h3>
                <p className="text-xs text-[#44474d] mt-0.5">
                  Calculated from 1,245 solved questions across 14 mock sessions
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('progress')}
                className="text-xs font-bold text-[#aa3000] hover:underline"
              >
                View Analytics
              </button>
            </div>

            {/* Mastery Bars */}
            <div className="space-y-5">
              {/* Physics */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#000000]">Physics</span>
                    <span className="text-[10px] text-green-700 bg-green-50 px-1.5 py-0.5 rounded font-semibold">
                      Strong
                    </span>
                  </div>
                  <span className="font-bold text-[#000000]">82%</span>
                </div>
                <div className="w-full bg-[#f5f3f1] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#000000] h-full rounded-full transition-all duration-500"
                    style={{ width: '82%' }}
                  />
                </div>
              </div>

              {/* Chemistry */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#000000]">Chemistry</span>
                    <span className="text-[10px] text-[#44474d] bg-[#f5f3f1] px-1.5 py-0.5 rounded font-semibold">
                      On Track
                    </span>
                  </div>
                  <span className="font-bold text-[#000000]">68%</span>
                </div>
                <div className="w-full bg-[#f5f3f1] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#44474d] h-full rounded-full transition-all duration-500"
                    style={{ width: '68%' }}
                  />
                </div>
              </div>

              {/* Mathematics / Calculus */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#000000]">Mathematics (Calculus)</span>
                    <span className="text-[10px] text-[#aa3000] bg-[#ffdbd0]/50 px-1.5 py-0.5 rounded font-semibold">
                      Action Required
                    </span>
                  </div>
                  <span className="font-bold text-[#aa3000]">43%</span>
                </div>
                <div className="w-full bg-[#f5f3f1] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#aa3000] h-full rounded-full transition-all duration-500"
                    style={{ width: '43%' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* AI Coach Daily Insight Banner */}
          <div className="bg-[#000000] text-white rounded-2xl p-6 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#ffffff]/10 text-[#ffb59e] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">psychology</span>
              </div>
              <div>
                <h4 className="font-display text-base font-bold text-white">
                  AI Coach Daily Briefing
                </h4>
                <p className="text-xs text-[#c5c6cd] mt-1 max-w-lg leading-relaxed">
                  "Your physics scores remain in the 90th percentile. Shifting 30 minutes from Mechanics to Calculus integration methods today will optimize your composite exam score."
                </p>
              </div>
            </div>

            <button
              id="dashboard-consult-coach-btn"
              onClick={() => onNavigateTab('coach')}
              className="px-4 py-2 bg-white text-[#000000] hover:bg-[#eae8e6] text-xs font-bold rounded-lg transition-colors shrink-0 cursor-pointer"
            >
              Consult Coach
            </button>
          </div>
        </div>

        {/* Right Col: Daily Study Goal Tracker & Top Verified Tutors */}
        <div className="space-y-6">
          {/* Daily Study Goal Tracker Component */}
          <DailyStudyGoal onStartSession={() => onStartPractice('Calculus')} />

          {/* Top Verified Tutors Snippet */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-[#000000]">
                Verified Tutors
              </h3>
              <button
                onClick={() => onNavigateTab('tutors')}
                className="text-xs font-bold text-[#aa3000] hover:underline"
              >
                See All
              </button>
            </div>

          <div className="space-y-3">
            {tutors.slice(0, 2).map((tutor) => (
              <div
                key={tutor.id}
                className="bg-[#ffffff] rounded-2xl p-4 border border-[#c5c6cd]/60 ambient-shadow flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={tutor.avatarUrl}
                    alt={tutor.name}
                    className="w-12 h-12 rounded-full object-cover border border-[#c5c6cd]"
                  />
                  <div>
                    <h4 className="font-display text-sm font-bold text-[#000000]">
                      {tutor.name}
                    </h4>
                    <p className="text-[11px] text-[#aa3000] font-semibold">{tutor.specialty}</p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-[#75777e]">
                      <span className="flex items-center text-amber-600 font-bold">
                        ★ {tutor.rating.toFixed(1)}
                      </span>
                      <span>•</span>
                      <span>{tutor.yearsExperience} yrs exp</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#f5f3f1]">
                  <span className="text-xs font-bold text-[#000000]">
                    ৳{tutor.hourlyRateBDT} <span className="text-[10px] font-normal text-[#75777e]">/ hr</span>
                  </span>
                  <button
                    onClick={() => onOpenBooking(tutor)}
                    className="px-3 py-1.5 bg-[#f5f3f1] hover:bg-[#000000] hover:text-white text-[#000000] text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Book Slot
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

