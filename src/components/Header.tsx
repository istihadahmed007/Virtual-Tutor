import React from 'react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenSettings: () => void;
  streakCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch, onOpenSettings, streakCount }) => {
  return (
    <header
      id="desktop-header"
      className="hidden lg:flex sticky top-0 z-30 bg-[#fbf9f7]/90 backdrop-blur-md border-b border-[#c5c6cd]/50 px-8 py-3.5 items-center justify-between"
    >
      {/* Global Search Bar */}
      <div className="flex-1 max-w-xl">
        <button
          id="global-search-trigger"
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between bg-[#f5f3f1] hover:bg-[#eae8e6] border border-[#c5c6cd]/60 rounded-full px-4 py-2 text-sm text-[#44474d] transition-all focus:ring-2 focus:ring-[#aa3000]"
        >
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[18px] text-[#75777e]">search</span>
            <span className="text-[#44474d]">Search topics, questions, mock exams, tutors...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 bg-[#e4e2e0] text-[#44474d] px-2 py-0.5 rounded text-[11px] font-mono border border-[#c5c6cd]">
            ⌘ K
          </kbd>
        </button>
      </div>

      {/* Trailing Actions */}
      <div className="flex items-center gap-4 pl-6">
        {/* Streak Pill */}
        <div className="flex items-center gap-1.5 bg-[#f5f3f1] px-3 py-1.5 rounded-full border border-[#c5c6cd]/60 text-xs font-semibold text-[#000000]">
          <span className="material-symbols-outlined text-[#aa3000] text-[16px] symbol-filled">
            local_fire_department
          </span>
          <span>{streakCount} day streak</span>
        </div>

        {/* Notifications */}
        <button
          id="notifications-btn"
          aria-label="Notifications"
          className="w-9 h-9 rounded-full flex items-center justify-center text-[#44474d] hover:text-[#000000] hover:bg-[#f5f3f1] transition-colors relative"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#aa3000] rounded-full ring-2 ring-[#fbf9f7]"></span>
        </button>

        {/* User Profile */}
        <button
          id="header-profile-avatar"
          onClick={onOpenSettings}
          className="w-9 h-9 rounded-full overflow-hidden border border-[#c5c6cd] hover:ring-2 ring-[#000000] transition-all cursor-pointer"
        >
          <img
            alt="Alex Chen"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMEEkQjuPV5PwvqjKA1Pav5Fka_hchH2obMoviqEVLWzsVTqBegUt4-qQ6Us6bfKQD68U3_e-9t-7GnLkc4salUJJVzDdtBe-wWXafoNiXU9gSek7aVrrNjISUvMOcgyOdYUzShERPaYqvn1lJQC9zeob7icK_mPtFb75Mw3Zu_qzwHxk9MXtzNL7FIq2_baRoAA3Sd2ZHt6aagAQHHQWbcGSgmr2eUSAyirlmhgeG-HhuKIkxvfVaLw"
          />
        </button>
      </div>
    </header>
  );
};
