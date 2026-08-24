import React from 'react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenUpgrade: () => void;
  onOpenSettings: () => void;
  onOpenSupport: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onOpenUpgrade,
  onOpenSettings,
  onOpenSupport,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'practice', label: 'Practice', icon: 'edit_note' },
    { id: 'exams', label: 'Exams', icon: 'assignment' },
    { id: 'progress', label: 'Progress', icon: 'trending_up' },
    { id: 'mistakes', label: 'Mistake Book', icon: 'menu_book' },
    { id: 'coach', label: 'AI Coach', icon: 'psychology' },
    { id: 'tutors', label: 'Tutors', icon: 'school' },
  ];

  return (
    <aside
      id="desktop-sidebar"
      className="hidden lg:flex flex-col h-screen py-6 px-4 bg-[#fbf9f7] border-r border-[#c5c6cd]/60 w-64 shrink-0 fixed left-0 top-0 z-40 select-none justify-between"
    >
      {/* Brand Header */}
      <div>
        <div className="mb-8 px-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#000000] text-white flex items-center justify-center font-display text-xl font-bold shadow-sm">
              E
            </div>
            <div>
              <h1 className="font-display text-[22px] leading-tight font-bold text-[#000000]">
                Exam Mastery OS
              </h1>
              <p className="text-[11px] font-semibold text-[#aa3000] uppercase tracking-wider mt-0.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">schedule</span>
                Next Exam: 12d 04h
              </p>
            </div>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-sm transition-all duration-150 text-left ${
                  isActive
                    ? 'text-[#000000] font-bold bg-[#f5f3f1] border-r-2 border-[#aa3000] shadow-sm'
                    : 'text-[#44474d] hover:bg-[#f5f3f1]/70 hover:text-[#000000] font-medium'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[20px] ${
                    isActive ? 'symbol-filled text-[#000000]' : 'text-[#75777e]'
                  }`}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions & User Profile */}
      <div className="space-y-4 pt-4 border-t border-[#c5c6cd]/50">
        <button
          id="upgrade-to-pro-sidebar-btn"
          onClick={onOpenUpgrade}
          className="w-full py-2.5 px-4 bg-[#000000] hover:bg-[#1b1c1b] text-white rounded-lg text-sm font-semibold transition-all duration-150 shadow-sm flex items-center justify-center gap-2 group cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px] text-[#ffb59e] group-hover:scale-110 transition-transform">
            workspace_premium
          </span>
          Upgrade to Pro
        </button>

        <div className="space-y-0.5">
          <button
            id="sidebar-settings-btn"
            onClick={onOpenSettings}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[#44474d] hover:bg-[#f5f3f1] hover:text-[#000000] text-sm transition-colors text-left"
          >
            <span className="material-symbols-outlined text-[18px] text-[#75777e]">settings</span>
            Settings
          </button>
          <button
            id="sidebar-support-btn"
            onClick={onOpenSupport}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[#44474d] hover:bg-[#f5f3f1] hover:text-[#000000] text-sm transition-colors text-left"
          >
            <span className="material-symbols-outlined text-[18px] text-[#75777e]">help_outline</span>
            Support
          </button>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3 px-2 pt-2">
          <img
            alt="Alex Chen"
            className="w-8 h-8 rounded-full object-cover border border-[#c5c6cd]"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMEEkQjuPV5PwvqjKA1Pav5Fka_hchH2obMoviqEVLWzsVTqBegUt4-qQ6Us6bfKQD68U3_e-9t-7GnLkc4salUJJVzDdtBe-wWXafoNiXU9gSek7aVrrNjISUvMOcgyOdYUzShERPaYqvn1lJQC9zeob7icK_mPtFb75Mw3Zu_qzwHxk9MXtzNL7FIq2_baRoAA3Sd2ZHt6aagAQHHQWbcGSgmr2eUSAyirlmhgeG-HhuKIkxvfVaLw"
          />
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-[#000000] truncate">Alex Chen</p>
            <p className="text-[10px] text-[#44474d] truncate">Free Plan • 12 Day Streak</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
