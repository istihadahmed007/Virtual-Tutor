import React from 'react';

interface PricingViewProps {
  onSelectPlan: (plan: string) => void;
  onBackToApp: () => void;
}

export const PricingView: React.FC<PricingViewProps> = ({ onSelectPlan, onBackToApp }) => {
  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto pb-12 font-body">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 pt-4">
        <button
          onClick={onBackToApp}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#64748B] hover:text-[#0F172A] bg-[#FFFFFF] px-3 py-1.5 rounded-xl border border-[#E2E8F0] shadow-2xs mb-2 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Back to Dashboard</span>
        </button>

        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
          Choose Your Plan
        </h1>
        <p className="text-sm sm:text-base text-[#64748B]">
          Unlock unlimited Socratic AI tutoring, advanced mistake diagnostics, and adaptive mock tests.
        </p>
      </div>

      {/* 3 Pricing Cards matching Mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-4">
        {/* Free Plan */}
        <div className="bg-[#FFFFFF] rounded-3xl p-8 border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <h3 className="font-display text-2xl font-bold text-[#0F172A]">Free</h3>
              <p className="text-xs text-[#64748B] mt-1">For exploratory learning</p>
            </div>

            <div className="mb-6">
              <span className="font-display text-4xl font-extrabold text-[#0F172A]">$0</span>
              <span className="text-sm font-medium text-[#64748B]"> / month</span>
            </div>

            <ul className="space-y-3 text-sm text-[#334155] mb-8">
              <li className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-emerald-500">check</span>
                <span>Limited AI tutor messages</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-emerald-500">check</span>
                <span>Basic practice mode</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-emerald-500">check</span>
                <span>Up to 5 practice tests</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-emerald-500">check</span>
                <span>Basic progress tracking</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onSelectPlan('Free')}
            className="w-full py-3 text-sm font-bold text-[#334155] bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-xl transition-all cursor-pointer"
          >
            Current Plan
          </button>
        </div>

        {/* Pro Plan (Highlighted) */}
        <div className="bg-[#FFFFFF] rounded-3xl p-8 border-2 border-[#4F46E5] shadow-xl shadow-indigo-500/10 flex flex-col justify-between relative">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#4F46E5] text-white text-xs font-bold py-1 px-4 rounded-full shadow-sm">
            Most popular for students
          </div>

          <div>
            <div className="mb-4 pt-2">
              <h3 className="font-display text-2xl font-bold text-[#4F46E5]">Pro</h3>
              <p className="text-xs text-[#64748B] mt-1">Accelerated mastery for serious candidates</p>
            </div>

            <div className="mb-6">
              <span className="font-display text-4xl font-extrabold text-[#0F172A]">$9.99</span>
              <span className="text-sm font-medium text-[#64748B]"> / month</span>
            </div>

            <ul className="space-y-3 text-sm text-[#334155] mb-8">
              <li className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-[#4F46E5]">check</span>
                <span className="font-semibold text-[#0F172A]">Unlimited AI tutor messages</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-[#4F46E5]">check</span>
                <span>Adaptive practice engine</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-[#4F46E5]">check</span>
                <span>Unlimited practice & mock exams</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-[#4F46E5]">check</span>
                <span>Detailed mistake analytics</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-[#4F46E5]">check</span>
                <span>Personalized daily study plan</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-[#4F46E5]">check</span>
                <span>Priority 24/7 support</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onSelectPlan('Pro')}
            className="w-full py-3.5 text-sm font-bold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-xl transition-all shadow-md shadow-indigo-500/20 active:scale-95 cursor-pointer"
          >
            Upgrade to Pro
          </button>
        </div>

        {/* Teacher Plan */}
        <div className="bg-[#FFFFFF] rounded-3xl p-8 border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <h3 className="font-display text-2xl font-bold text-[#0F172A]">Teacher</h3>
              <p className="text-xs text-[#64748B] mt-1">For educators & institutions</p>
            </div>

            <div className="mb-6">
              <span className="font-display text-4xl font-extrabold text-[#0F172A]">$19.99</span>
              <span className="text-sm font-medium text-[#64748B]"> / month</span>
            </div>

            <ul className="space-y-3 text-sm text-[#334155] mb-8">
              <li className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-emerald-500">check</span>
                <span>All Pro features included</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-emerald-500">check</span>
                <span>Student progress tracking</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-emerald-500">check</span>
                <span>Create & assign custom tests</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-emerald-500">check</span>
                <span>Cohort & class analytics</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-emerald-500">check</span>
                <span>Teacher tools & exports</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onSelectPlan('Teacher')}
            className="w-full py-3 text-sm font-bold text-[#334155] bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-xl transition-all cursor-pointer"
          >
            Select Teacher Plan
          </button>
        </div>
      </div>
    </div>
  );
};
