import React from 'react';
import { Role } from '../types';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenUpgrade: () => void;
  onOpenSettings: () => void;
  onOpenSupport: () => void;
  onOpenLanding?: () => void;
  currentRole: Role;
  currentUser?: { name: string; email: string; institution?: string };
  preferredLanguage?: 'en' | 'bn';
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onOpenUpgrade,
  onOpenSettings,
  onOpenLanding,
  currentRole,
  currentUser,
  preferredLanguage = 'en',
}) => {
  const isBn = preferredLanguage === 'bn';

  const studentNavItems = [
    { id: 'dashboard', label: isBn ? 'ড্যাশবোর্ড' : 'Dashboard', icon: 'dashboard' },
    { id: 'live_classes', label: isBn ? 'লাইভ ক্লাস' : 'Live Classes', icon: 'videocam' },
    { id: 'practice', label: isBn ? 'অনুশীলন' : 'Practice', icon: 'edit_note' },
    { id: 'coach', label: isBn ? 'এআই টিউটর' : 'AI Tutor', icon: 'smart_toy' },
    { id: 'exams', label: isBn ? 'মক পরীক্ষা' : 'Exams', icon: 'assignment' },
    { id: 'progress', label: isBn ? 'অগ্রগতি' : 'Progress', icon: 'insights' },
    { id: 'mistakes', label: isBn ? 'ভুল খাতা' : 'Mistakes', icon: 'menu_book' },
    { id: 'plan', label: isBn ? 'পড়ার রুটিন' : 'Study Plan', icon: 'event_note' },
    { id: 'subjects', label: isBn ? 'বিষয়সমূহ' : 'Subjects', icon: 'grid_view' },
    { id: 'tutors', label: isBn ? 'ব্যক্তিগত টিউটর' : 'Tutors', icon: 'school' },
  ];

  const teacherNavItems = [
    { id: 'teacher_dashboard', label: isBn ? 'শিক্ষক ড্যাশবোর্ড' : 'Faculty Dashboard', icon: 'school' },
    { id: 'teacher_verification', label: isBn ? 'যাচাইকরণ স্থিতি' : 'Verification Status', icon: 'verified_user' },
    { id: 'live_classes', label: isBn ? 'লাইভ ক্লাসরুম' : 'Live Classroom', icon: 'videocam' },
    { id: 'practice', label: isBn ? 'প্রশ্ন ব্যাংক' : 'Question Bank', icon: 'edit_note' },
    { id: 'progress', label: isBn ? 'শিক্ষার্থী অগ্রগতি' : 'Cohort Mastery', icon: 'insights' },
  ];

  const adminNavItem = {
    id: 'admin',
    label: isBn ? 'কারিকুলাম স্টুডিও' : 'Admin Studio',
    icon: 'admin_panel_settings',
  };

  const navItems =
    currentRole === 'TEACHER'
      ? teacherNavItems
      : currentRole === 'ADMIN'
      ? [adminNavItem, ...studentNavItems]
      : studentNavItems;

  return (
    <aside
      id="desktop-sidebar"
      className="hidden lg:flex flex-col h-screen py-5 px-3.5 bg-[#0F172A] text-white w-64 shrink-0 fixed left-0 top-0 z-40 select-none justify-between border-r border-[#1E293B]"
    >
      {/* Brand Header */}
      <div className="space-y-6">
        <div className="px-2 pt-1">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={onOpenLanding}
              title="Return to Public Landing Page"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#4F46E5] to-[#7C3AED] text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                <span className="material-symbols-outlined text-[20px]">auto_stories</span>
              </div>
              <div>
                <h1 className="font-display text-lg leading-tight font-bold text-white tracking-tight">
                  Virtual Tutor
                </h1>
                <span className="text-[10px] text-[#818CF8] font-medium tracking-wide uppercase">
                  {isBn ? 'জাতীয় শিক্ষাক্রম ও ভর্তি' : 'Bangladesh STEM Engine'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            const isAdminTab = item.id === 'admin';

            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 text-left cursor-pointer ${
                  isActive
                    ? 'text-white font-bold bg-[#4F46E5] shadow-md shadow-indigo-500/25'
                    : isAdminTab
                    ? 'text-[#C084FC] hover:bg-[#1E1B4B] hover:text-white font-semibold'
                    : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-white font-medium'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      isActive
                        ? 'symbol-filled text-white'
                        : isAdminTab
                        ? 'text-[#C084FC]'
                        : 'text-[#94A3B8]'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {isAdminTab && (
                  <span className="text-[9px] bg-[#581C87] text-[#E9D5FF] px-1.5 py-0.5 rounded font-extrabold">
                    ADMIN
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Area: Profile, Settings & Upgrade */}
      <div className="space-y-3 pt-3 border-t border-[#1E293B]">
        {/* Settings & Profile Nav */}
        <div className="space-y-0.5">
          <button
            id="sidebar-profile-btn"
            onClick={() => onSelectTab('profile')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors text-left cursor-pointer ${
              currentTab === 'profile'
                ? 'text-white bg-[#4F46E5] font-bold'
                : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">account_circle</span>
            <span>{isBn ? 'প্রোফাইল' : 'Profile'}</span>
          </button>

          <button
            id="sidebar-settings-btn"
            onClick={onOpenSettings}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[#94A3B8] hover:bg-[#1E293B] hover:text-white text-sm transition-colors text-left cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">settings</span>
            <span>{isBn ? 'সেটিংস' : 'Settings'}</span>
          </button>
        </div>

        {/* Upgrade to Pro Card */}
        <button
          id="upgrade-to-pro-sidebar-btn"
          onClick={onOpenUpgrade}
          className="w-full py-2.5 px-3.5 bg-gradient-to-r from-[#312E81] via-[#3730A3] to-[#4338CA] hover:from-[#3730A3] hover:to-[#4F46E5] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-between group cursor-pointer border border-[#6366F1]/30"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-amber-400 group-hover:scale-110 transition-transform">
              workspace_premium
            </span>
            <span>{isBn ? 'প্রো প্ল্যানে আপগ্রেড' : 'Upgrade to Pro'}</span>
          </div>
          <span className="material-symbols-outlined text-[16px] text-indigo-200">
            arrow_forward
          </span>
        </button>

        {/* User Card */}
        <div className="flex items-center gap-3 px-2 pt-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-700 flex items-center justify-center font-bold text-xs text-white border border-[#334155] shrink-0">
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
          <div className="overflow-hidden flex-1">
            <p className="text-xs font-bold text-white truncate">{currentUser?.name || 'Istihad Ahmed'}</p>
            <p className="text-[10px] text-[#94A3B8] truncate">{currentUser?.email || 'istihadahmed1163@gmail.com'}</p>
          </div>
          <button
            onClick={onOpenSettings}
            className="text-[#64748B] hover:text-white transition-colors cursor-pointer"
            title="Settings"
          >
            <span className="material-symbols-outlined text-[16px]">more_vert</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
