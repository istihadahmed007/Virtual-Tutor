import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/api';
import { LiveClass, UserProfile } from '../types';
import {
  Video,
  Play,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  Sparkles,
  BookOpen,
  ArrowRight,
  Filter,
  Search,
  Award,
} from 'lucide-react';

interface LiveClassesViewProps {
  currentUser: UserProfile;
  onJoinClass: (liveClass: LiveClass) => void;
  preferredLanguage?: 'en' | 'bn';
}

export const LiveClassesView: React.FC<LiveClassesViewProps> = ({
  currentUser,
  onJoinClass,
  preferredLanguage = 'en',
}) => {
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const loadClasses = async () => {
    setIsLoading(true);
    try {
      const data = await apiClient.getLiveClasses();
      setClasses(data);
    } catch (err: any) {
      console.warn('Failed to load live classes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const handleEnroll = async (cls: LiveClass) => {
    try {
      await apiClient.enrollInLiveClass(cls.id);
      showToast(`Successfully enrolled in "${cls.title}"!`);
      loadClasses();
    } catch (err: any) {
      showToast(err.message || 'Enrolled in class');
      loadClasses();
    }
  };

  const filteredClasses = classes.filter((c) => {
    if (selectedSubject === 'ALL') return true;
    return c.subject.toLowerCase().includes(selectedSubject.toLowerCase());
  });

  const liveNowClass = classes.find((c) => c.status === 'LIVE');

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-4 py-3 rounded-2xl shadow-xl border border-[#334155] text-xs font-semibold flex items-center gap-2 animate-slide-up">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              <Video className="w-3.5 h-3.5" />
              <span>Live Online Tuition & Masterclasses</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Interactive Classes with Bangladesh's Top Faculty
            </h1>
            <p className="text-sm text-amber-100">
              Join real-time video classrooms featuring digital whiteboard derivations, live Q&A, and high-yield admission shortcuts.
            </p>
          </div>
        </div>
      </div>

      {/* Live Now Featured Card */}
      {liveNowClass && (
        <div className="bg-gradient-to-r from-red-950 via-slate-900 to-slate-900 border-2 border-red-500/60 rounded-3xl p-6 text-white shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-black uppercase flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-white" />
                <span>Broadcasting Live Right Now</span>
              </span>
              <span className="text-xs text-slate-400">• {liveNowClass.subject}</span>
            </div>
            <span className="text-xs text-amber-400 font-bold">
              {liveNowClass.enrolledCount} Students in Class
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-white">{liveNowClass.title}</h2>
            <p className="text-sm text-slate-300">{liveNowClass.description}</p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500 text-[#0F172A] font-bold flex items-center justify-center text-sm shadow-md">
                {liveNowClass.teacherName.substring(0, 2)}
              </div>
              <div>
                <div className="text-xs font-bold text-white">{liveNowClass.teacherName}</div>
                <div className="text-[11px] text-slate-400">Faculty • BUET / Top Admission Coach</div>
              </div>
            </div>

            <button
              onClick={() => onJoinClass(liveNowClass)}
              className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all hover:scale-[1.02]"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Enter Live Classroom Studio</span>
            </button>
          </div>
        </div>
      )}

      {/* Subject Filter Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap border-b border-[#E2E8F0] pb-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['ALL', 'Physics', 'Mathematics', 'Chemistry', 'Biology'].map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedSubject === sub
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]'
              }`}
            >
              {sub === 'ALL' ? 'All Subjects' : sub}
            </button>
          ))}
        </div>
        <span className="text-xs text-[#64748B] font-medium">
          {filteredClasses.length} Available Tuition Sessions
        </span>
      </div>

      {/* Grid of Live Classes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredClasses.map((cls) => {
          const isEnrolled = cls.isEnrolled || cls.enrolledStudentIds?.includes(currentUser.id);
          const isLive = cls.status === 'LIVE';

          return (
            <div
              key={cls.id}
              className="bg-white border border-[#E2E8F0] hover:border-amber-500 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-bold uppercase">
                    {cls.subject}
                  </span>
                  {isLive ? (
                    <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-black uppercase flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
                      Live Now
                    </span>
                  ) : (
                    <span className="text-xs text-[#64748B] font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {cls.scheduledAt}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#0F172A] leading-snug">{cls.title}</h3>
                  <p className="text-xs text-[#64748B] line-clamp-2">{cls.description}</p>
                </div>

                <div className="py-2.5 border-y border-[#F1F5F9] grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-[#94A3B8] block">Topic</span>
                    <span className="font-semibold text-[#334155] truncate block">{cls.topic}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#94A3B8] block">Seats & Enrolled</span>
                    <span className="font-semibold text-[#334155]">
                      {cls.enrolledCount} / {cls.maxStudents} Students
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                    {cls.teacherName.substring(0, 1)}
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold text-[#0F172A] block">{cls.teacherName}</span>
                    <span className="text-[10px] text-[#64748B]">Verified Faculty</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                {isLive ? (
                  <button
                    onClick={() => onJoinClass(cls)}
                    className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Join Live Session</span>
                  </button>
                ) : isEnrolled ? (
                  <button
                    disabled
                    className="w-full py-2.5 px-4 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Enrolled (Reminder Set)</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleEnroll(cls)}
                    className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <span>Enroll in Class (Free)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
