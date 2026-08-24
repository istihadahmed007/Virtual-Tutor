import React from 'react';
import { UserProfile, Role } from '../types';
import {
  Clock,
  ShieldAlert,
  CheckCircle2,
  FileText,
  Building,
  GraduationCap,
  Sparkles,
  Phone,
  Mail,
  ArrowRight,
  RefreshCw,
  LogOut,
  UserCheck,
} from 'lucide-react';

interface TeacherPendingVerificationViewProps {
  user: UserProfile;
  onRefreshStatus: () => void;
  onSwitchToAdminDemo: () => void;
  onLogout: () => void;
  preferredLanguage?: 'en' | 'bn';
}

export const TeacherPendingVerificationView: React.FC<TeacherPendingVerificationViewProps> = ({
  user,
  onRefreshStatus,
  onSwitchToAdminDemo,
  onLogout,
  preferredLanguage = 'en',
}) => {
  const profile = user.teacherProfile;

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-2xl w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-3xl shadow-xl overflow-hidden">
        {/* Top Status Header */}
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-6 text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center mx-auto shadow-md">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping" />
            <span>Pending Teacher Verification</span>
          </div>
          <h1 className="text-2xl font-black text-[#0F172A]">
            Your Faculty Application is Under Review
          </h1>
          <p className="text-sm text-[#64748B] max-w-lg mx-auto">
            Thank you for registering as an educator on Virtual Tutor. To maintain high academic standards, our curriculum
            governance team verifies all teacher credentials before granting live classroom and tuition hosting access.
          </p>
        </div>

        {/* Verification Timeline */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-[#475569] uppercase tracking-wider">
              Verification Progress Tracker
            </h3>
            <div className="space-y-3">
              {/* Step 1 */}
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0F172A]">1. Application & Profile Submitted</div>
                  <div className="text-[11px] text-[#64748B]">
                    Teacher profile received on {profile?.submittedAt ? new Date(profile.submittedAt).toLocaleDateString() : 'Today'}
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-900">2. Academic Credential & Pedigree Verification</div>
                  <div className="text-[11px] text-[#64748B]">
                    Reviewing university degree, subject specializations, and coaching history.
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3 opacity-60">
                <div className="w-6 h-6 rounded-full bg-[#CBD5E1] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold">3</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-[#475569]">3. Live Tuition Studio & Cohort Authorization</div>
                  <div className="text-[11px] text-[#64748B]">
                    Unlocks whiteboard studio, video broadcasting, and student enrollment tools.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submitted Profile Details Card */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#475569] uppercase tracking-wider">
              Submitted Application Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-[#E2E8F0] bg-white">
                <span className="text-[#64748B] block text-[11px]">Educator Name</span>
                <span className="font-bold text-[#0F172A] text-sm">{user.name}</span>
              </div>
              <div className="p-3 rounded-xl border border-[#E2E8F0] bg-white">
                <span className="text-[#64748B] block text-[11px]">Email Address</span>
                <span className="font-medium text-[#0F172A]">{user.email}</span>
              </div>
              <div className="p-3 rounded-xl border border-[#E2E8F0] bg-white">
                <span className="text-[#64748B] block text-[11px]">Academic Qualifications</span>
                <span className="font-semibold text-[#0F172A]">
                  {profile?.qualifications || user.institution || 'University Faculty'}
                </span>
              </div>
              <div className="p-3 rounded-xl border border-[#E2E8F0] bg-white">
                <span className="text-[#64748B] block text-[11px]">Teaching Experience</span>
                <span className="font-semibold text-[#0F172A]">
                  {profile?.experience || 'Advanced Admission Coaching'}
                </span>
              </div>
              <div className="p-3 rounded-xl border border-[#E2E8F0] bg-white sm:col-span-2">
                <span className="text-[#64748B] block text-[11px]">Teaching Subjects</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {profile?.subjects?.map((sub) => (
                    <span
                      key={sub}
                      className="px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-800 text-[11px] font-semibold"
                    >
                      {sub}
                    </span>
                  )) || <span className="text-[#64748B]">Physics, Mathematics</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onRefreshStatus}
              className="flex-1 py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Check Approval Status</span>
            </button>

            {/* Admin Demo Fast-Track button */}
            <button
              onClick={onSwitchToAdminDemo}
              className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <UserCheck className="w-4 h-4" />
              <span>Admin Demo: Approve This Application</span>
            </button>

            <button
              onClick={onLogout}
              className="py-3 px-4 border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
