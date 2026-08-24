import React, { useState } from 'react';
import { UserProfile, LiveClass, TeacherStatus } from '../types';
import { apiClient } from '../services/api';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Video,
  Lock,
  Unlock,
  Play,
  Plus,
  Calendar,
  Award,
  BookOpen,
  UserCheck,
  RefreshCw,
  Edit3,
  FileText,
  Building,
  GraduationCap,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Info,
  HelpCircle,
  X,
  Send,
  Sliders,
} from 'lucide-react';

interface TeacherVerificationDashboardProps {
  currentUser: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onLaunchClass?: (liveClass: LiveClass) => void;
  onNavigateToTab?: (tab: string) => void;
  preferredLanguage?: 'en' | 'bn';
}

export const TeacherVerificationDashboard: React.FC<TeacherVerificationDashboardProps> = ({
  currentUser,
  onUpdateUser,
  onLaunchClass,
  onNavigateToTab,
  preferredLanguage = 'en',
}) => {
  const currentStatus: TeacherStatus = currentUser.teacherStatus || 'PENDING';
  const profile = currentUser.teacherProfile;

  const [isBlockedModalOpen, setIsBlockedModalOpen] = useState(false);
  const [blockedActionTitle, setBlockedActionTitle] = useState('');
  const [blockedActionReason, setBlockedActionReason] = useState('');
  const [isAppealModalOpen, setIsAppealModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Appeal form state
  const [appealQualifications, setAppealQualifications] = useState(
    profile?.qualifications || currentUser.institution || 'B.Sc. in Physics, BUET'
  );
  const [appealExperience, setAppealExperience] = useState(
    profile?.experience || '5+ years admission coaching experience'
  );
  const [appealBio, setAppealBio] = useState(
    profile?.bio || 'Passionate about problem-solving and conceptual derivations for engineering admission.'
  );
  const [appealNotes, setAppealNotes] = useState('');
  const [isSubmittingAppeal, setIsSubmittingAppeal] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Programmatic route & action guard
  const handleRestrictedAction = (actionName: string, executeIfApproved: () => void) => {
    if (currentStatus !== 'APPROVED') {
      // Programmatic Block
      setBlockedActionTitle(actionName);
      setBlockedActionReason(
        currentStatus === 'PENDING'
          ? 'Your teacher application is currently pending verification. Live video broadcasting and cohort management are locked until an Academic Director approves your credentials.'
          : currentStatus === 'REJECTED'
          ? 'Your application was rejected by the Academic Board. Please review the feedback and submit an appeal with updated credentials to unlock live teaching features.'
          : 'Your faculty account is currently suspended. Please contact institutional compliance to restore live teaching privileges.'
      );
      setIsBlockedModalOpen(true);
      return;
    }

    // Approved - execute action
    executeIfApproved();
  };

  // Status simulation for interactive testing
  const handleSimulateStatus = async (status: TeacherStatus) => {
    try {
      const res = await apiClient.simulateTeacherStatus(status);
      onUpdateUser(res.user);
      showToast(`Status changed to ${status}`);
    } catch (err: any) {
      showToast(err.message || 'Failed to update status');
    }
  };

  // Refresh status from server
  const handleRefreshStatus = async () => {
    setIsRefreshing(true);
    try {
      const auth = await apiClient.getAuthMe();
      if (auth.user) {
        onUpdateUser(auth.user);
        showToast(`Refreshed: Current status is ${auth.user.teacherStatus || 'PENDING'}`);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to refresh status');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Submit appeal / updated application
  const handleSubmitAppeal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingAppeal(true);
    try {
      const res = await apiClient.appealTeacherApplication({
        qualifications: appealQualifications,
        experience: appealExperience,
        bio: appealBio,
        appealNotes,
      });
      onUpdateUser(res.user);
      setIsAppealModalOpen(false);
      showToast('Application updated and resubmitted for academic review!');
    } catch (err: any) {
      showToast(err.message || 'Failed to resubmit appeal');
    } finally {
      setIsSubmittingAppeal(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-4 py-3 rounded-2xl shadow-2xl border border-[#334155] text-xs font-semibold flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Developer & Demo Status Switcher Bar */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#0F172A]">Teacher Verification Simulator</div>
            <div className="text-[11px] text-[#64748B]">
              Switch application status to test visual locks and programmatic blocking
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => handleSimulateStatus('PENDING')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              currentStatus === 'PENDING'
                ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-300'
                : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending</span>
          </button>
          <button
            onClick={() => handleSimulateStatus('APPROVED')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              currentStatus === 'APPROVED'
                ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approved</span>
          </button>
          <button
            onClick={() => handleSimulateStatus('REJECTED')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              currentStatus === 'REJECTED'
                ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-300'
                : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Rejected</span>
          </button>
          <button
            onClick={() => handleSimulateStatus('SUSPENDED')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              currentStatus === 'SUSPENDED'
                ? 'bg-slate-700 text-white shadow-sm ring-2 ring-slate-400'
                : 'bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Suspended</span>
          </button>
        </div>
      </div>

      {/* Main Status Hero Card */}
      <div
        className={`rounded-3xl border p-6 sm:p-8 transition-all shadow-md relative overflow-hidden ${
          currentStatus === 'APPROVED'
            ? 'bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-900 border-emerald-500/50 text-white'
            : currentStatus === 'PENDING'
            ? 'bg-gradient-to-br from-amber-950 via-slate-900 to-slate-900 border-amber-500/60 text-white'
            : currentStatus === 'REJECTED'
            ? 'bg-gradient-to-br from-rose-950 via-slate-900 to-slate-900 border-rose-500/60 text-white'
            : 'bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-slate-700 text-white'
        }`}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-md">
              {currentStatus === 'APPROVED' ? (
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Verified Faculty & Live Host</span>
                </span>
              ) : currentStatus === 'PENDING' ? (
                <span className="bg-amber-500/20 text-amber-300 border border-amber-400/40 px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Application Under Academic Review (Restricted Mode)</span>
                </span>
              ) : currentStatus === 'REJECTED' ? (
                <span className="bg-rose-500/20 text-rose-300 border border-rose-400/40 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span>Application Needs Revision</span>
                </span>
              ) : (
                <span className="bg-slate-500/20 text-slate-300 border border-slate-400/40 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-slate-400" />
                  <span>Account Suspended</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {currentStatus === 'APPROVED'
                ? `Welcome, Prof. ${currentUser.name}`
                : currentStatus === 'PENDING'
                ? `Application In Review: ${currentUser.name}`
                : currentStatus === 'REJECTED'
                ? `Application Revision Required: ${currentUser.name}`
                : `Account Suspended: ${currentUser.name}`}
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              {currentStatus === 'APPROVED'
                ? 'Your pedagogical qualifications and academic credentials have been verified by the Curriculum Governance Board. You have full access to schedule tuition cohorts, broadcast live classrooms, and utilize digital whiteboards.'
                : currentStatus === 'PENDING'
                ? 'Thank you for registering as an educator on Virtual Tutor. While your credentials are being authenticated by our academic team, live video broadcasting and tuition tools remain visually disabled and programmatically blocked.'
                : currentStatus === 'REJECTED'
                ? 'Our review team was unable to verify some of your credentials. Review the reviewer feedback below and update your academic details to resubmit for approval.'
                : 'Your faculty permissions are currently suspended. Please resolve any pending compliance or code-of-conduct inquiries.'}
            </p>

            {/* Notes / Reason Banner */}
            {profile?.verificationNotes && (
              <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 text-xs text-slate-200 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Academic Board Note:</span>
                  <span>{profile.verificationNotes}</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions in Hero */}
          <div className="flex flex-col gap-2.5 shrink-0 min-w-[200px]">
            <button
              onClick={handleRefreshStatus}
              disabled={isRefreshing}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 border border-white/20 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Checking Server...' : 'Check Approval Status'}</span>
            </button>

            {currentStatus === 'PENDING' && (
              <button
                onClick={() => handleSimulateStatus('APPROVED')}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Fast-Track Admin Approval</span>
              </button>
            )}

            {(currentStatus === 'REJECTED' || currentStatus === 'PENDING') && (
              <button
                onClick={() => setIsAppealModalOpen(true)}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
                <span>Update Credentials & Appeal</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4-Step Verification Stage Tracker */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F1F5F9] pb-4">
          <div>
            <h2 className="text-base font-bold text-[#0F172A]">Faculty Verification Pipeline</h2>
            <p className="text-xs text-[#64748B]">
              Rigorous 4-stage accreditation ensuring world-class pedagogy and exam mastery
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
            {currentStatus === 'APPROVED' ? '4 / 4 Completed' : currentStatus === 'PENDING' ? '2 / 4 In Review' : 'Action Required'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Stage 1 */}
          <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">Stage 1</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <h3 className="text-xs font-bold text-[#0F172A]">Identity & Contact</h3>
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              Email ({currentUser.email}) and phone authentication verified.
            </p>
          </div>

          {/* Stage 2 */}
          <div
            className={`p-4 rounded-2xl border space-y-2 ${
              currentStatus === 'APPROVED'
                ? 'border-emerald-200 bg-emerald-50/50'
                : currentStatus === 'REJECTED'
                ? 'border-rose-200 bg-rose-50/50'
                : 'border-amber-200 bg-amber-50/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-[10px] font-black uppercase tracking-wider ${
                  currentStatus === 'APPROVED'
                    ? 'text-emerald-800'
                    : currentStatus === 'REJECTED'
                    ? 'text-rose-800'
                    : 'text-amber-800'
                }`}
              >
                Stage 2
              </span>
              {currentStatus === 'APPROVED' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : currentStatus === 'REJECTED' ? (
                <XCircle className="w-4 h-4 text-rose-600" />
              ) : (
                <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
              )}
            </div>
            <h3 className="text-xs font-bold text-[#0F172A]">Academic Credentials</h3>
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              {profile?.qualifications || currentUser.institution || 'University degree & faculty affiliation review.'}
            </p>
          </div>

          {/* Stage 3 */}
          <div
            className={`p-4 rounded-2xl border space-y-2 ${
              currentStatus === 'APPROVED'
                ? 'border-emerald-200 bg-emerald-50/50'
                : currentStatus === 'PENDING'
                ? 'border-amber-200 bg-amber-50/30'
                : 'border-slate-200 bg-slate-50 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#64748B]">Stage 3</span>
              {currentStatus === 'APPROVED' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <Clock className="w-4 h-4 text-amber-600" />
              )}
            </div>
            <h3 className="text-xs font-bold text-[#0F172A]">Subject Mastery</h3>
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              Curriculum rubric verification for {profile?.subjects?.join(', ') || 'Physics & Mathematics'}.
            </p>
          </div>

          {/* Stage 4 */}
          <div
            className={`p-4 rounded-2xl border space-y-2 ${
              currentStatus === 'APPROVED'
                ? 'border-emerald-200 bg-emerald-50/50'
                : 'border-slate-200 bg-slate-50 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#64748B]">Stage 4</span>
              {currentStatus === 'APPROVED' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <Lock className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <h3 className="text-xs font-bold text-[#0F172A]">Live Studio License</h3>
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              Authorization to launch interactive video broadcasting and whiteboard sessions.
            </p>
          </div>
        </div>
      </div>

      {/* Restricted Routes & Capability Matrix */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#0F172A]">Feature Access & Route Permissions</h2>
            <p className="text-xs text-[#64748B]">
              Restricted teaching routes are visually locked and programmatically guarded for non-approved educators
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              currentStatus === 'APPROVED'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'bg-amber-100 text-amber-900 border border-amber-300'
            }`}
          >
            {currentStatus === 'APPROVED' ? 'All Teaching Routes Unlocked' : 'Restricted Routes Active'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Live Class Broadcasting (Restricted) */}
          <div
            className={`p-5 rounded-2xl border transition-all relative ${
              currentStatus === 'APPROVED'
                ? 'bg-white border-[#E2E8F0] hover:border-emerald-500 shadow-sm'
                : 'bg-slate-50 border-amber-300/80 shadow-xs'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                    currentStatus === 'APPROVED'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#0F172A]">Live Video & Whiteboard Studio</h3>
                    {currentStatus === 'APPROVED' ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                        <Unlock className="w-3 h-3" /> Unlocked
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold flex items-center gap-1 border border-amber-300">
                        <Lock className="w-3 h-3 text-amber-700" /> Locked (Pending)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Host interactive online masterclasses, draw mathematical derivations, and broadcast live audio/video.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
              <span className="text-[11px] text-[#64748B]">
                {currentStatus === 'APPROVED' ? 'Permission: Full Broadcast' : 'Blocked: Requires verification'}
              </span>
              <button
                onClick={() =>
                  handleRestrictedAction('Live Class Broadcasting', () => {
                    if (onLaunchClass) {
                      onLaunchClass({
                        id: 'class_demo_live',
                        title: 'Interactive Physics Derivation Workshop',
                        subject: 'Physics',
                        topic: 'Rotational Dynamics & Torque',
                        teacherId: currentUser.id,
                        teacherName: currentUser.name,
                        scheduledAt: 'Now (Live)',
                        durationMinutes: 60,
                        maxStudents: 50,
                        enrolledCount: 18,
                        status: 'LIVE',
                        meetingCode: 'VT-PHY-LIVE',
                        description: 'Live studio session with active whiteboard derivations.',
                        enrolledStudentIds: [],
                      });
                    }
                  })
                }
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  currentStatus === 'APPROVED'
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-sm'
                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300 border border-slate-300'
                }`}
              >
                {currentStatus === 'APPROVED' ? <Play className="w-3.5 h-3.5 fill-white" /> : <Lock className="w-3.5 h-3.5" />}
                <span>{currentStatus === 'APPROVED' ? 'Launch Broadcast Studio' : 'Try Launching (Guarded)'}</span>
              </button>
            </div>
          </div>

          {/* Card 2: Schedule Masterclasses (Restricted) */}
          <div
            className={`p-5 rounded-2xl border transition-all relative ${
              currentStatus === 'APPROVED'
                ? 'bg-white border-[#E2E8F0] hover:border-emerald-500 shadow-sm'
                : 'bg-slate-50 border-amber-300/80 shadow-xs'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                    currentStatus === 'APPROVED'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#0F172A]">Schedule Tuition Cohorts</h3>
                    {currentStatus === 'APPROVED' ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                        <Unlock className="w-3 h-3" /> Unlocked
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold flex items-center gap-1 border border-amber-300">
                        <Lock className="w-3 h-3 text-amber-700" /> Locked (Pending)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Create upcoming tuition slots, set student seat capacity, and collect tuition enrollment fees.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
              <span className="text-[11px] text-[#64748B]">
                {currentStatus === 'APPROVED' ? 'Permission: Cohort Manager' : 'Blocked: Requires verification'}
              </span>
              <button
                onClick={() =>
                  handleRestrictedAction('Schedule Masterclass Cohort', () => {
                    if (onNavigateToTab) onNavigateToTab('teacher_dashboard');
                  })
                }
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  currentStatus === 'APPROVED'
                    ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm'
                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300 border border-slate-300'
                }`}
              >
                {currentStatus === 'APPROVED' ? <Plus className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                <span>{currentStatus === 'APPROVED' ? 'Schedule New Class' : 'Try Scheduling (Guarded)'}</span>
              </button>
            </div>
          </div>

          {/* Card 3: Publish Question Banks (Restricted) */}
          <div
            className={`p-5 rounded-2xl border transition-all relative ${
              currentStatus === 'APPROVED'
                ? 'bg-white border-[#E2E8F0] hover:border-emerald-500 shadow-sm'
                : 'bg-slate-50 border-amber-300/80 shadow-xs'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                    currentStatus === 'APPROVED'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#0F172A]">Publish Cohort Question Banks</h3>
                    {currentStatus === 'APPROVED' ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                        <Unlock className="w-3 h-3" /> Unlocked
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold flex items-center gap-1 border border-amber-300">
                        <Lock className="w-3 h-3 text-amber-700" /> Locked (Pending)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Author high-yield MCQs and mock exam papers for distribution to student cohorts.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
              <span className="text-[11px] text-[#64748B]">
                {currentStatus === 'APPROVED' ? 'Permission: Item Authoring' : 'Blocked: Requires verification'}
              </span>
              <button
                onClick={() =>
                  handleRestrictedAction('Publish Question Banks', () => {
                    if (onNavigateToTab) onNavigateToTab('practice');
                  })
                }
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  currentStatus === 'APPROVED'
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300 border border-slate-300'
                }`}
              >
                {currentStatus === 'APPROVED' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                <span>{currentStatus === 'APPROVED' ? 'Open Question Studio' : 'Try Publishing (Guarded)'}</span>
              </button>
            </div>
          </div>

          {/* Card 4: Curriculum Guidelines (Always Accessible) */}
          <div className="p-5 rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#0F172A]">Curriculum & Syllabus Rubrics</h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                      <Unlock className="w-3 h-3" /> Unlocked
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Access NCTB syllabus mappings, BUET exam blueprints, and Medical admission weightage tables.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
              <span className="text-[11px] text-emerald-700 font-semibold">Available in all modes</span>
              <button
                onClick={() => {
                  if (onNavigateToTab) onNavigateToTab('subjects');
                  else showToast('Browsing Curriculum Syllabi');
                }}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <span>View Guidelines</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Submitted Profile & Credentials Summary */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F1F5F9] pb-3">
          <div>
            <h2 className="text-base font-bold text-[#0F172A]">Submitted Academic Dossier</h2>
            <p className="text-xs text-[#64748B]">Profile information currently filed with the Academic Evaluation Committee</p>
          </div>
          <button
            onClick={() => setIsAppealModalOpen(true)}
            className="px-3.5 py-1.5 border border-indigo-200 text-indigo-700 hover:bg-indigo-50 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer w-fit"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Application Details</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-1">
            <span className="text-[11px] font-semibold text-[#64748B] block">Faculty Name</span>
            <span className="font-bold text-[#0F172A] text-sm block">{currentUser.name}</span>
            <span className="text-[10px] text-[#94A3B8]">{currentUser.email}</span>
          </div>

          <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-1">
            <span className="text-[11px] font-semibold text-[#64748B] block">Degrees & Affiliation</span>
            <span className="font-semibold text-[#0F172A] block">
              {profile?.qualifications || currentUser.institution || 'BUET / Dhaka University'}
            </span>
          </div>

          <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-1">
            <span className="text-[11px] font-semibold text-[#64748B] block">Teaching Experience</span>
            <span className="font-semibold text-[#0F172A] block">
              {profile?.experience || 'Advanced Admission Coaching'}
            </span>
          </div>

          <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-1">
            <span className="text-[11px] font-semibold text-[#64748B] block">Tuition Rate</span>
            <span className="font-black text-[#0F172A] text-sm block">
              ৳ {profile?.hourlyRateBDT || 1200} / hr
            </span>
          </div>
        </div>

        {/* Subjects */}
        <div className="pt-2">
          <span className="text-[11px] font-semibold text-[#64748B] block mb-1.5">Authorized / Applied Subject Domains:</span>
          <div className="flex flex-wrap gap-2">
            {profile?.subjects?.map((sub) => (
              <span
                key={sub}
                className="px-3 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold"
              >
                {sub}
              </span>
            )) || <span className="text-xs text-[#64748B]">Physics, Mathematics, Chemistry</span>}
          </div>
        </div>
      </div>

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
              <div className="font-bold text-[#0F172A]">Why is this feature locked?</div>
              <ul className="list-disc pl-5 space-y-1 text-[#64748B]">
                <li>To prevent unverified broadcasting of inaccurate syllabus solutions.</li>
                <li>To maintain Bangladesh NCTB and Admission Board curriculum standards.</li>
                <li>To protect enrolled students and guarantee faculty authenticity.</li>
              </ul>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={() => {
                  setIsBlockedModalOpen(false);
                  handleSimulateStatus('APPROVED');
                }}
                className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Fast-Track Demo: Approve Now</span>
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

      {/* Appeal / Resubmit Modal */}
      {isAppealModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-[#E2E8F0] space-y-5 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0F172A]">Update Academic Credentials & Appeal</h3>
                  <p className="text-[11px] text-[#64748B]">Provide supplementary documents for review</p>
                </div>
              </div>
              <button
                onClick={() => setIsAppealModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitAppeal} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#0F172A] block">Degrees, University & Institutions</label>
                <input
                  type="text"
                  value={appealQualifications}
                  onChange={(e) => setAppealQualifications(e.target.value)}
                  placeholder="e.g. B.Sc. in Civil Engineering, BUET; M.Sc. in Physics, DU"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#0F172A] block">Teaching / Coaching Experience</label>
                <input
                  type="text"
                  value={appealExperience}
                  onChange={(e) => setAppealExperience(e.target.value)}
                  placeholder="e.g. 6 years faculty at UCC / Udvash Admission Coaching"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#0F172A] block">Educator Bio & Teaching Philosophy</label>
                <textarea
                  value={appealBio}
                  onChange={(e) => setAppealBio(e.target.value)}
                  rows={3}
                  placeholder="Describe your teaching approach and syllabus expertise..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#0F172A] block">Appeal Statement / Note to Reviewers</label>
                <textarea
                  value={appealNotes}
                  onChange={(e) => setAppealNotes(e.target.value)}
                  rows={2}
                  placeholder="Clarify any missing credentials or certificate references..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAppealModalOpen(false)}
                  className="px-4 py-2.5 border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#64748B] font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAppeal}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingAppeal ? 'Submitting...' : 'Resubmit for Review'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
