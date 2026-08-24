import React, { useState } from 'react';
import { Role, AvailableUser } from '../types';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenSettings: () => void;
  onOpenLanding?: () => void;
  onOpenRegistration?: () => void;
  streakCount: number;
  currentRole: Role;
  currentUser?: { name: string; email: string; institution?: string; teacherStatus?: string };
  availableUsers: AvailableUser[];
  onSwitchUser: (userId: string, role?: Role) => void;
  preferredLanguage: 'en' | 'bn';
  onToggleLanguage: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenSettings,
  onOpenLanding,
  onOpenRegistration,
  streakCount,
  currentRole,
  currentUser,
  availableUsers,
  onSwitchUser,
  preferredLanguage,
  onToggleLanguage,
}) => {
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  const roleBadges: Record<Role, { label: string; color: string; bg: string }> = {
    STUDENT: { label: 'Student', color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200' },
    TEACHER: {
      label: currentUser?.teacherStatus === 'PENDING' ? 'Teacher (Pending)' : 'Verified Faculty',
      color: currentUser?.teacherStatus === 'PENDING' ? 'text-amber-800' : 'text-emerald-700',
      bg: currentUser?.teacherStatus === 'PENDING' ? 'bg-amber-100 border-amber-300' : 'bg-emerald-50 border-emerald-200',
    },
    TUTOR: { label: 'Verified Tutor', color: 'text-teal-700', bg: 'bg-teal-50 border-teal-200' },
    ADMIN: { label: 'Admin SME', color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200' },
  };

  const badge = roleBadges[currentRole] || roleBadges.STUDENT;

  return (
    <header
      id="desktop-header"
      className="hidden lg:flex sticky top-0 z-30 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#E2E8F0] px-8 py-3.5 items-center justify-between transition-all"
    >
      {/* Global Search Bar */}
      <div className="flex-1 max-w-xl">
        <button
          id="global-search-trigger"
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl px-4 py-2 text-sm text-[#64748B] transition-all focus:ring-2 focus:ring-[#4F46E5] cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[18px] text-[#94A3B8]">search</span>
            <span className="text-xs sm:text-sm font-medium">
              {preferredLanguage === 'bn'
                ? 'বিষয়, প্রশ্ন, মক পরীক্ষা, টিউটর খুঁজুন...'
                : 'Search topics, questions, mock exams, tutors...'}
            </span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 bg-[#FFFFFF] text-[#64748B] px-2 py-0.5 rounded text-[11px] font-mono border border-[#E2E8F0] shadow-2xs">
            ⌘ K
          </kbd>
        </button>
      </div>

      {/* Trailing Actions */}
      <div className="flex items-center gap-3 pl-6">
        {/* Pathway Registration Button */}
        {onOpenRegistration && (
          <button
            onClick={onOpenRegistration}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            title="Register as Student or Teacher"
          >
            <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
            <span>{preferredLanguage === 'bn' ? 'নিবন্ধন / ভূমিকা' : 'Register / Pathway'}</span>
          </button>
        )}
        {/* Language Switcher Button */}
        <button
          onClick={onToggleLanguage}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-xs font-bold text-[#0F172A] transition-all cursor-pointer"
          title="Toggle Language (English / বাংলা)"
        >
          <span className="material-symbols-outlined text-[16px] text-[#4F46E5]">translate</span>
          <span>{preferredLanguage === 'bn' ? 'বাংলা (BN)' : 'English (EN)'}</span>
        </button>

        {/* Public Website Preview Switcher */}
        {onOpenLanding && (
          <button
            onClick={onOpenLanding}
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] text-xs font-semibold text-[#475569] transition-all cursor-pointer"
            title="View Public Website / Landing Page"
          >
            <span className="material-symbols-outlined text-[16px]">public</span>
            <span>Public Site</span>
          </button>
        )}

        {/* Streak Pill */}
        <div className="flex items-center gap-1.5 bg-[#FFFBEB] px-3 py-1.5 rounded-xl border border-[#FDE68A] text-xs font-bold text-[#D97706]">
          <span className="material-symbols-outlined text-[#D97706] text-[16px] symbol-filled">
            local_fire_department
          </span>
          <span>{streakCount} {preferredLanguage === 'bn' ? 'দিন' : 'days'}</span>
        </div>

        {/* Notifications */}
        <button
          id="notifications-btn"
          aria-label="Notifications"
          onClick={() => {}}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors relative cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#4F46E5] rounded-full ring-2 ring-white" />
        </button>

        {/* Role & User Profile */}
        <div className="relative">
          <button
            onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
            className="flex items-center gap-2.5 pl-2 py-1 pr-2 rounded-xl hover:bg-[#F1F5F9] transition-all cursor-pointer border border-transparent hover:border-[#E2E8F0]"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#4F46E5] to-[#7C3AED] flex items-center justify-center font-bold text-xs text-white border border-[#E2E8F0] shrink-0 shadow-2xs">
              {currentUser?.name
                ? currentUser.name
                    .split(' ')
                    .filter(Boolean)
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()
                : 'IA'}
            </div>
            <div className="text-left hidden sm:block">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-[#0F172A] truncate max-w-[120px]">
                  {currentUser?.name || 'Istihad Ahmed'}
                </p>
                <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded border ${badge.bg} ${badge.color}`}>
                  {badge.label}
                </span>
              </div>
              <p className="text-[10px] font-semibold text-[#64748B] truncate max-w-[130px]">
                {currentUser?.email || 'istihadahmed1163@gmail.com'}
              </p>
            </div>
            <span className="material-symbols-outlined text-[16px] text-[#94A3B8]">expand_more</span>
          </button>

          {/* User Account Menu */}
          {isRoleMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] p-3 z-50 animate-fade-in"
              onMouseLeave={() => setIsRoleMenuOpen(false)}
            >
              <div className="p-2 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#4F46E5] to-[#7C3AED] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {currentUser?.name
                      ? currentUser.name
                          .split(' ')
                          .filter(Boolean)
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()
                      : 'IA'}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-xs text-[#0F172A] truncate">{currentUser?.name || 'Istihad Ahmed'}</p>
                    <p className="text-[10px] text-[#64748B] truncate">{currentUser?.email || 'istihadahmed1163@gmail.com'}</p>
                    <span className={`inline-block mt-0.5 text-[9px] font-extrabold px-1.5 py-0.2 rounded border ${badge.bg} ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>
                </div>
              </div>

              {availableUsers.length > 1 && (
                <div className="py-1 space-y-1 border-t border-[#F1F5F9] my-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] px-1 pt-1">Linked Accounts</p>
                  {availableUsers.map((u) => {
                    const isCurrent = u.id === currentUser?.name || u.email === currentUser?.email;
                    return (
                      <button
                        key={u.id}
                        onClick={() => {
                          onSwitchUser(u.id, u.role);
                          setIsRoleMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-[#EEF2FF] text-[#4F46E5] font-bold'
                            : 'hover:bg-[#F8FAFC] text-[#334155] font-medium'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <p className="font-bold truncate">{u.name}</p>
                          <p className="text-[10px] text-[#64748B] truncate">{u.email}</p>
                        </div>
                        <span className="text-[9px] px-1.5 py-0.5 rounded font-extrabold border bg-indigo-50 text-indigo-700 border-indigo-200 shrink-0">
                          {u.role}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="pt-1 space-y-1">
                <button
                  onClick={() => {
                    setIsRoleMenuOpen(false);
                    onOpenSettings();
                  }}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-[#334155] hover:bg-[#F1F5F9] hover:text-[#0F172A] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#4F46E5]">tune</span>
                  <span>{preferredLanguage === 'bn' ? 'প্রোফাইল ও পরীক্ষার লক্ষ্য সেটিংস' : 'Profile & Target Goals'}</span>
                </button>

                {onOpenRegistration && (
                  <button
                    onClick={() => {
                      setIsRoleMenuOpen(false);
                      onOpenRegistration();
                    }}
                    className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-[#334155] hover:bg-[#F1F5F9] hover:text-[#0F172A] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px] text-amber-500">school</span>
                    <span>{preferredLanguage === 'bn' ? 'শিক্ষক বা শিক্ষার্থী হিসাবে যুক্ত হোন' : 'Join as Faculty / Teacher'}</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
