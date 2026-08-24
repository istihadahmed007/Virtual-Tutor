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
}> = ({ title = 'Virtual Tutor', onOpenSearch, onOpenSettings }) => {
  return (
    <header
      id="mobile-top-bar"
      className="lg:hidden sticky top-0 z-40 flex justify-between items-center w-full px-4 h-16 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#E2E8F0]"
    >
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#4F46E5] to-[#7C3AED] text-white flex items-center justify-center font-display text-base font-bold shadow-sm">
          <span className="material-symbols-outlined text-[18px]">auto_stories</span>
        </div>
        <div>
          <h1 className="font-display text-base font-bold text-[#0F172A] leading-none">{title}</h1>
          <p className="text-[10px] font-semibold text-[#4F46E5] tracking-wide mt-0.5">
            12 Days Left
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          id="mobile-search-btn"
          onClick={onOpenSearch}
          className="p-2 text-[#64748B] hover:text-[#0F172A] rounded-xl hover:bg-[#F1F5F9] transition-colors"
          aria-label="Search"
        >
          <span className="material-symbols-outlined text-[20px]">search</span>
        </button>
        <button
          id="mobile-profile-btn"
          onClick={onOpenSettings}
          className="w-8 h-8 rounded-xl overflow-hidden border border-[#E2E8F0]"
          aria-label="Profile"
        >
          <img
            alt="Ahmed Khan"
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
          />
        </button>
      </div>
    </header>
  );
};

export const MobileBottomBar: React.FC<MobileNavProps> = ({ currentTab, onSelectTab }) => {
  const items = [
    { id: 'dashboard', label: 'Home', icon: 'home' },
    { id: 'practice', label: 'Practice', icon: 'edit_note' },
    { id: 'coach', label: 'AI Tutor', icon: 'smart_toy' },
    { id: 'progress', label: 'Progress', icon: 'insights' },
    { id: 'profile', label: 'Profile', icon: 'account_circle' },
  ];

  return (
    <nav
      id="mobile-bottom-nav"
      className="lg:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 bg-[#FFFFFF] border-t border-[#E2E8F0] shadow-lg shadow-slate-900/5 px-2"
    >
      {items.map((item) => {
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            id={`mobile-tab-${item.id}`}
            onClick={() => onSelectTab(item.id)}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-transform duration-150 cursor-pointer ${
              isActive ? 'text-[#4F46E5] font-bold' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[22px] ${
                isActive ? 'symbol-filled text-[#4F46E5]' : ''
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
