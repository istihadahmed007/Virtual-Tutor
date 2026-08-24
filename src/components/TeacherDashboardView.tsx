import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/api';
import { UserProfile, LiveClass, Role } from '../types';
import { TeacherVerificationDashboard } from './TeacherVerificationDashboard';
import {
  Video,
  Users,
  Calendar,
  Sparkles,
  Plus,
  Play,
  Clock,
  Award,
  BookOpen,
  TrendingUp,
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  UserCheck,
  GraduationCap,
  DollarSign,
  HelpCircle,
  X,
  Lock,
  Unlock,
  ShieldCheck,
  ShieldAlert,
  Sliders,
  Shield,
} from 'lucide-react';

interface TeacherDashboardViewProps {
  currentUser: UserProfile;
  onLaunchClass: (liveClass: LiveClass) => void;
  onUpdateUser?: (updatedUser: UserProfile) => void;
  preferredLanguage?: 'en' | 'bn';
}

export const TeacherDashboardView: React.FC<TeacherDashboardViewProps> = ({
  currentUser,
  onLaunchClass,
  onUpdateUser,
  preferredLanguage = 'en',
}) => {
  const isApproved = currentUser.teacherStatus === 'APPROVED';
  const currentStatus = currentUser.teacherStatus || 'PENDING';

  const [activeTab, setActiveTab] = useState<'classes' | 'students' | 'schedule' | 'verification'>(
    isApproved ? 'classes' : 'verification'
  );
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Programmatic Security Guard Modal state
  const [isBlockedModalOpen, setIsBlockedModalOpen] = useState(false);
  const [blockedActionTitle, setBlockedActionTitle] = useState('');
  const [blockedActionReason, setBlockedActionReason] = useState('');

  // New Class Form State
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Physics');
  const [newTopic, setNewTopic] = useState('Projectile Motion & Rotational Dynamics');
  const [newScheduledAt, setNewScheduledAt] = useState('Today at 8:00 PM');
  const [newDuration, setNewDuration] = useState(60);
  const [newMaxStudents, setNewMaxStudents] = useState(50);
  const [newDescription, setNewDescription] = useState('Live problem-solving workshop targeting BUET & Medical admission questions.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleRestrictedAction = (actionName: string, proceed: () => void) => {
    if (!isApproved) {
      setBlockedActionTitle(actionName);
      setBlockedActionReason(
        currentStatus === 'PENDING'
          ? 'Your teacher profile is currently pending verification. Live class broadcasting and cohort scheduling are blocked until approved.'
          : currentStatus === 'REJECTED'
          ? 'Your application was not approved by the Academic Board. Please check reviewer feedback in the Verification tab.'
          : 'Your faculty account is currently suspended. Please contact institutional administration.'
      );
      setIsBlockedModalOpen(true);
      return;
    }
    proceed();
  };

  const loadTeacherClasses = async () => {
    setIsLoading(true);
    try {
      const classes = await apiClient.getLiveClasses();
      setLiveClasses(classes);
    } catch (err: any) {
      console.warn('Failed to load teacher classes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTeacherClasses();
  }, []);

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    if (!isApproved) {
      showToast('Action Blocked: Teacher verification required to create live classes.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiClient.createTeacherClass({
        title: newTitle,
        subject: newSubject,
        topic: newTopic,
        scheduledAt: newScheduledAt,
        durationMinutes: Number(newDuration),
        maxStudents: Number(newMaxStudents),
        description: newDescription,
      });

      showToast('Live tuition class created and scheduled successfully!');
      setIsCreateModalOpen(false);
      setNewTitle('');
      loadTeacherClasses();
    } catch (err: any) {
      showToast(err.message || 'Failed to create live class');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartClass = async (cls: LiveClass) => {
    handleRestrictedAction('Launch Live Classroom Studio', async () => {
      try {
        await apiClient.startTeacherClass(cls.id);
        onLaunchClass({ ...cls, status: 'LIVE' });
      } catch (err: any) {
        showToast(err.message || 'Error starting broadcast');
        onLaunchClass(cls);
      }
    });
  };


  // Mock enrolled student cohort data
  const studentsCohort = [
    {
      id: 'st_1',
      name: 'Tanvir Ahmed',
      email: 'student@virtualtutor.bd',
      targetExam: 'BUET Engineering Admission',
      masteryScore: 84,
      weakestTopic: 'Electromagnetic Induction',
      classesAttended: 12,
      status: 'On Track',
    },
    {
      id: 'st_2',
      name: 'Sakib Hossain',
      email: 'sakib@virtualtutor.bd',
      targetExam: 'Medical Admission (MBBS)',
      masteryScore: 78,
      weakestTopic: 'Organic Chemistry Reactions',
      classesAttended: 10,
      status: 'Improving',
    },
    {
      id: 'st_3',
      name: 'Anika Tabassum',
      email: 'anika@college.edu.bd',
      targetExam: 'HSC Science 2024 (GPA 5.00)',
      masteryScore: 91,
      weakestTopic: 'Integration by Parts',
      classesAttended: 14,
      status: 'Excellent',
    },
    {
      id: 'st_4',
      name: 'Mehedi Hasan',
      email: 'mehedi@notredame.edu.bd',
      targetExam: 'Dhaka University (KA-Unit)',
      masteryScore: 72,
      weakestTopic: 'Thermodynamics Carnot Cycle',
      classesAttended: 8,
      status: 'Needs Focus',
    },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-4 py-3 rounded-2xl shadow-xl border border-[#334155] text-xs font-semibold flex items-center gap-2 animate-slide-up">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Programmatic Block Modal (Security Guard) */}
      {isBlockedModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-red-200 space-y-5 animate-scale-in">
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0F172A]">Access Denied: Verification Required</h3>
                  <p className="text-[11px] text-[#64748B]">Programmatic Security Guard</p>
                </div>
              </div>
              <button
                onClick={() => setIsBlockedModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-950 space-y-2 text-xs">
              <div className="font-bold flex items-center gap-1.5 text-red-800">
                <Lock className="w-4 h-4 text-red-600" />
                <span>Action Blocked: "{blockedActionTitle}"</span>
              </div>
              <p className="text-red-900 leading-relaxed">{blockedActionReason}</p>
            </div>

            <div className="space-y-2 text-xs text-[#475569]">
              <div className="font-bold text-[#0F172A]">Verification Checklist Required:</div>
              <ul className="list-disc pl-5 space-y-1 text-[#64748B]">
                <li>Academic Degree Verification (BUET / DU / Medical / University)</li>
                <li>Curriculum Rubric & National Education Board Alignment</li>
                <li>Digital Classroom & Socratic Conduct Certification</li>
              </ul>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={() => {
                  setIsBlockedModalOpen(false);
                  setActiveTab('verification');
                }}
                className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Go to Verification Dashboard</span>
              </button>
              <button
                onClick={() => setIsBlockedModalOpen(false)}
                className="py-2.5 px-4 border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#64748B] font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Non-Approved Verification Alert Banner */}
      {!isApproved && (
        <div
          className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm ${
            currentStatus === 'PENDING'
              ? 'bg-amber-500/10 border-amber-400 text-amber-950'
              : currentStatus === 'REJECTED'
              ? 'bg-rose-500/10 border-rose-400 text-rose-950'
              : 'bg-slate-800 text-white border-slate-700'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                currentStatus === 'PENDING'
                  ? 'bg-amber-500 text-white'
                  : currentStatus === 'REJECTED'
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-700 text-white'
              }`}
            >
              {currentStatus === 'PENDING' ? (
                <Clock className="w-5 h-5 animate-pulse" />
              ) : currentStatus === 'REJECTED' ? (
                <X className="w-5 h-5" />
              ) : (
                <ShieldAlert className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm flex items-center gap-2">
                <span>
                  {currentStatus === 'PENDING'
                    ? 'Faculty Verification Under Review (Restricted Mode)'
                    : currentStatus === 'REJECTED'
                    ? 'Application Requires Revision'
                    : 'Account Suspended'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-white/60 border border-current">
                  {currentStatus}
                </span>
              </div>
              <p className="text-xs opacity-80 mt-0.5">
                Live streaming & cohort scheduling are disabled until verified by the curriculum board.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('verification')}
            className="px-4 py-2 bg-white text-[#0F172A] font-bold text-xs rounded-xl shadow-xs hover:bg-slate-50 transition-all flex items-center gap-1.5 shrink-0 border border-slate-200 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>Open Verification Dashboard</span>
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              {isApproved ? (
                <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Faculty Workspace</span>
                </span>
              ) : (
                <span className="bg-amber-500/20 border border-amber-500/30 text-amber-300 px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Verification Pending (Restricted Mode)</span>
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome, {currentUser.name}
            </h1>
            <p className="text-sm text-indigo-200">
              Manage your live online classes, track student cohort progress, conduct tuition, and author practice drills.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() =>
                handleRestrictedAction('Schedule Live Tuition Class', () => setIsCreateModalOpen(true))
              }
              className={`px-5 py-3 font-bold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
                isApproved
                  ? 'bg-amber-500 hover:bg-amber-600 text-[#0F172A] shadow-md'
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/40'
              }`}
            >
              {isApproved ? <Plus className="w-4 h-4" /> : <Lock className="w-4 h-4 text-amber-400" />}
              <span>{isApproved ? 'Schedule Live Tuition Class' : 'Schedule Class (Locked)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B]">Total Students Enrolled</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#0F172A]">108</div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+14 this week across 4 cohorts</span>
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B]">Live Classes Hosted</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#0F172A]">{liveClasses.length + 12}</div>
          <div className="text-[11px] text-[#64748B]">2 classes scheduled today</div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B]">Faculty Rating</span>
            <div className="w-8 h-8 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#0F172A]">4.95 ⭐</div>
          <div className="text-[11px] text-emerald-600 font-semibold">98% positive student feedback</div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B]">Tuition Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#0F172A]">৳ 128,400</div>
          <div className="text-[11px] text-emerald-600 font-semibold">Paid directly via bKash/Nagad</div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('verification')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'verification'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Verification & Authorization Status</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              isApproved
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-900 border border-amber-300'
            }`}
          >
            {currentStatus}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('classes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'classes'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>My Live Classes & Whiteboard Studio</span>
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'students'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Student Cohort Performance ({studentsCohort.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('schedule')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'schedule'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Weekly Timetable & Availability</span>
        </button>
      </div>

      {/* Tab 0: Verification Dashboard */}
      {activeTab === 'verification' && (
        <TeacherVerificationDashboard
          currentUser={currentUser}
          onUpdateUser={onUpdateUser || (() => {})}
          onLaunchClass={onLaunchClass}
          onNavigateToTab={(tab) => setActiveTab(tab as any)}
          preferredLanguage={preferredLanguage}
        />
      )}

      {/* Tab 1: Live Online Classes Management */}
      {activeTab === 'classes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#0F172A]">Upcoming & Active Live Tuition Classes</h2>
            <span className="text-xs text-[#64748B]">{liveClasses.length} Scheduled Classes</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liveClasses.map((cls) => (
              <div
                key={cls.id}
                className="bg-white border border-[#E2E8F0] hover:border-indigo-500 rounded-2xl p-5 shadow-sm space-y-4 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-bold uppercase">
                          {cls.subject}
                        </span>
                        {cls.status === 'LIVE' ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-black uppercase flex items-center gap-1 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                            Live Now
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                            {cls.scheduledAt}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-[#0F172A] leading-snug">{cls.title}</h3>
                    </div>
                  </div>

                  <p className="text-xs text-[#64748B] line-clamp-2">{cls.description}</p>

                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#F1F5F9] text-xs">
                    <div>
                      <span className="text-[10px] text-[#94A3B8] block">Topic</span>
                      <span className="font-semibold text-[#334155] truncate block">{cls.topic}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#94A3B8] block">Enrolled</span>
                      <span className="font-semibold text-[#334155]">
                        {cls.enrolledCount} / {cls.maxStudents} Students
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#94A3B8] block">Duration</span>
                      <span className="font-semibold text-[#334155]">{cls.durationMinutes} mins</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => handleStartClass(cls)}
                    className={`flex-1 py-2.5 px-4 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                      isApproved
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300 border border-slate-300'
                    }`}
                  >
                    {isApproved ? <Play className="w-4 h-4 fill-white" /> : <Lock className="w-4 h-4 text-slate-500" />}
                    <span>{isApproved ? 'Launch Live Classroom Studio' : 'Launch Studio (Restricted)'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Students Cohort */}
      {activeTab === 'students' && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden space-y-4 p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">Enrolled Student Mastery & Diagnostics</h2>
              <p className="text-xs text-[#64748B]">
                Monitor real-time student drill accuracy, syllabus coverage, and weak topics.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#475569] uppercase font-bold text-[10px]">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Target Exam</th>
                  <th className="py-3 px-4">Mastery Score</th>
                  <th className="py-3 px-4">Weakest Topic</th>
                  <th className="py-3 px-4">Classes Attended</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {studentsCohort.map((st) => (
                  <tr key={st.id} className="hover:bg-[#F8FAFC]">
                    <td className="py-3 px-4 font-semibold text-[#0F172A]">
                      <div>{st.name}</div>
                      <div className="text-[10px] text-[#94A3B8] font-normal">{st.email}</div>
                    </td>
                    <td className="py-3 px-4 text-[#475569]">{st.targetExam}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-[#E2E8F0] rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              st.masteryScore > 80 ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${st.masteryScore}%` }}
                          />
                        </div>
                        <span className="font-bold text-[#0F172A]">{st.masteryScore}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-red-600 font-medium">{st.weakestTopic}</td>
                    <td className="py-3 px-4 text-[#475569] font-medium">{st.classesAttended} Sessions</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {st.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Schedule */}
      {activeTab === 'schedule' && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-[#0F172A]">Weekly Teaching Schedule</h2>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
              <div key={day} className="border border-[#E2E8F0] rounded-xl p-3 bg-[#F8FAFC] space-y-2">
                <div className="font-bold text-xs text-[#0F172A]">{day}</div>
                <div className="space-y-1.5">
                  <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-lg text-[11px] text-indigo-900 font-semibold">
                    <div>8:00 PM - 9:30 PM</div>
                    <div className="text-[10px] text-indigo-700">Physics HSC Drill</div>
                  </div>
                  {day === 'Friday' && (
                    <div className="p-2 bg-amber-50 border border-amber-100 rounded-lg text-[11px] text-amber-900 font-semibold">
                      <div>3:00 PM - 5:00 PM</div>
                      <div className="text-[10px] text-amber-700">BUET Mock Exam Live Solution</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Schedule New Live Class */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-sm">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] px-6 py-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-[#0F172A]">Schedule Live Tuition Class</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="w-7 h-7 rounded-lg text-[#64748B] hover:text-[#0F172A] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">Class Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Masterclass: Newton's Laws & Friction Drills"
                  className="w-full px-3 py-2 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">Subject</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Higher Mathematics">Higher Mathematics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="ICT">ICT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">Topic</label>
                  <input
                    type="text"
                    required
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    placeholder="e.g. Kinematics"
                    className="w-full px-3 py-2 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">Scheduled Time</label>
                  <input
                    type="text"
                    required
                    value={newScheduledAt}
                    onChange={(e) => setNewScheduledAt(e.target.value)}
                    placeholder="Today 8:00 PM"
                    className="w-full px-3 py-2 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    min="15"
                    step="15"
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">Max Students</label>
                  <input
                    type="number"
                    min="5"
                    value={newMaxStudents}
                    onChange={(e) => setNewMaxStudents(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-[#CBD5E1] text-[#64748B] text-xs font-bold rounded-xl hover:bg-[#F1F5F9]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm"
                >
                  {isSubmitting ? 'Scheduling...' : 'Confirm & Schedule Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
