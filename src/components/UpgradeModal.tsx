import React from 'react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeSuccess: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  onUpgradeSuccess,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000000]/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#ffffff] w-full max-w-lg rounded-2xl shadow-2xl border border-[#c5c6cd] overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-b from-[#fbf9f7] to-[#ffffff] border-b border-[#c5c6cd]/50 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-[#75777e] hover:text-[#000000] rounded-full hover:bg-[#f5f3f1]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdbd0]/60 text-[#aa3000] text-xs font-bold uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-[14px]">bolt</span>
            Accelerate Exam Readiness
          </div>
          <h2 className="font-display text-2xl font-bold text-[#000000]">
            Upgrade to Pro Mastery
          </h2>
          <p className="text-sm text-[#44474d] mt-1">
            Unlimited AI Coach queries, full question bank access, and personalized weakness targeting.
          </p>
        </div>

        {/* Features Checklist */}
        <div className="p-6 space-y-3.5">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-[#aa3000]/10 text-[#aa3000] flex items-center justify-center mt-0.5 shrink-0">
              <span className="material-symbols-outlined text-[14px]">check</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#000000]">Unlimited AI Step-by-Step Explanations</p>
              <p className="text-xs text-[#75777e]">Deep visual calculus & physics breakdown in English & বাংলা.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-[#aa3000]/10 text-[#aa3000] flex items-center justify-center mt-0.5 shrink-0">
              <span className="material-symbols-outlined text-[14px]">check</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#000000]">50+ Full-Length Timed Mock Tests</p>
              <p className="text-xs text-[#75777e]">Accurate percentile rankings and speed diagnostic telemetry.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-[#aa3000]/10 text-[#aa3000] flex items-center justify-center mt-0.5 shrink-0">
              <span className="material-symbols-outlined text-[14px]">check</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#000000]">Automated Mistake Journal & Smart Spaced Repetition</p>
              <p className="text-xs text-[#75777e]">Zero in on repeatedly failed concepts until mastered.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-[#aa3000]/10 text-[#aa3000] flex items-center justify-center mt-0.5 shrink-0">
              <span className="material-symbols-outlined text-[14px]">check</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#000000]">Priority 1-on-1 Tutor Scheduling</p>
              <p className="text-xs text-[#75777e]">Book top tutors at discounted member rates in ৳ BDT.</p>
            </div>
          </div>
        </div>

        {/* Pricing card & Action */}
        <div className="p-6 bg-[#f5f3f1] border-t border-[#c5c6cd]/50 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold font-display text-[#000000]">৳990</span>
              <span className="text-xs text-[#75777e]">/ month</span>
            </div>
            <p className="text-[11px] text-[#44474d]">Cancel anytime. 7-day money back guarantee.</p>
          </div>

          <button
            onClick={() => {
              onUpgradeSuccess();
              onClose();
            }}
            className="px-6 py-2.5 bg-[#aa3000] hover:bg-[#8e2800] text-white font-bold text-sm rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
          >
            Activate Pro
          </button>
        </div>
      </div>
    </div>
  );
};
