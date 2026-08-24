import React from 'react';

interface MobileNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenSearch: () => void;
  onOpenSettings: () => void;
}

export const MobileTopBar: React.FC<{
  title?: string;
  onOpenSearch: () => void;
  onOpenSettings: () => void;
}> = ({ title = 'Exam Mastery OS', onOpenSearch, onOpenSettings }) => {
  return (
    <header
      id="mobile-top-bar"
      className="lg:hidden sticky top-0 z-40 flex justify-between items-center w-full px-4 h-16 bg-[#fbf9f7]/90 backdrop-blur-md border-b border-[#c5c6cd]/60"
    >
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[#000000] text-white flex items-center justify-center font-display text-base font-bold shadow-sm">
          E
        </div>
        <div>
          <h1 className="font-display text-lg font-bold text-[#000000] leading-none">{title}</h1>
          <p className="text-[10px] font-semibold text-[#aa3000] tracking-wider uppercase mt-0.5">
            Exam: 12d 04h
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          id="mobile-search-btn"
          onClick={onOpenSearch}
          className="p-2 text-[#44474d] hover:text-[#000000] rounded-full hover:bg-[#f5f3f1] transition-colors"
          aria-label="Search"
        >
          <span className="material-symbols-outlined text-[20px]">search</span>
        </button>
        <button
          id="mobile-profile-btn"
          onClick={onOpenSettings}
          className="w-8 h-8 rounded-full overflow-hidden border border-[#c5c6cd]"
        >
          <img
            alt="User"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMEEkQjuPV5PwvqjKA1Pav5Fka_hchH2obMoviqEVLWzsVTqBegUt4-qQ6Us6bfKQD68U3_e-9t-7GnLkc4salUJJVzDdtBe-wWXafoNiXU9gSek7aVrrNjISUvMOcgyOdYUzShERPaYqvn1lJQC9zeob7icK_mPtFb75Mw3Zu_qzwHxk9MXtzNL7FIq2_baRoAA3Sd2ZHt6aagAQHHQWbcGSgmr2eUSAyirlmhgeG-HhuKIkxvfVaLw"
          />
        </button>
      </div>
    </header>
  );
};

export const MobileBottomBar: React.FC<MobileNavProps> = ({ currentTab, onSelectTab }) => {
  const items = [
    { id: 'dashboard', label: 'Home', icon: 'home' },
    { id: 'exams', label: 'Exams', icon: 'assignment' },
    { id: 'coach', label: 'AI Coach', icon: 'psychology' },
    { id: 'mistakes', label: 'Mistakes', icon: 'history_edu' },
    { id: 'tutors', label: 'Tutors', icon: 'school' },
  ];

  return (
    <nav
      id="mobile-bottom-nav"
      className="lg:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 pb-safe bg-[#fbf9f7] border-t border-[#c5c6cd]/60 shadow-[0px_-4px_20px_rgba(10,25,47,0.04)]"
    >
      {items.map((item) => {
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            id={`mobile-tab-${item.id}`}
            onClick={() => onSelectTab(item.id)}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-transform duration-150 ${
              isActive ? 'text-[#aa3000] font-bold scale-100' : 'text-[#44474d] hover:text-[#000000]'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[22px] ${
                isActive ? 'symbol-filled text-[#aa3000]' : ''
              }`}
            >
              {item.icon}
            </span>
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
