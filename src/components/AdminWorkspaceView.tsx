import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/api';
import { Question, AdminContentStats, AuditLogItem, SubjectItem, ContentStatus, Role } from '../types';

interface AdminWorkspaceViewProps {
  currentRole: Role;
  onSwitchRole: (role: Role) => void;
  preferredLanguage?: 'en' | 'bn';
}

export const AdminWorkspaceView: React.FC<AdminWorkspaceViewProps> = ({
  currentRole,
  onSwitchRole,
  preferredLanguage = 'en',
}) => {
  const [stats, setStats] = useState<AdminContentStats | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [teachersList, setTeachersList] = useState<any[]>([]);
  const [teacherCounts, setTeacherCounts] = useState<{ pending: number; approved: number; rejected: number; suspended: number }>({
    pending: 0,
    approved: 0,
    rejected: 0,
    suspended: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<'bank' | 'create' | 'review' | 'audit' | 'teachers'>('bank');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('ALL');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New Question Form state
  const [formSubjectId, setFormSubjectId] = useState('sub_physics');
  const [formChapterName, setFormChapterName] = useState('Dynamics & Kinematics');
  const [formTopicName, setFormTopicName] = useState('Kinematics & Projectile Dynamics');
  const [formDifficulty, setFormDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | 'Exam-Level'>('Medium');
  const [formTitleEn, setFormTitleEn] = useState('');
  const [formTitleBn, setFormTitleBn] = useState('');
  const [formTextEn, setFormTextEn] = useState('');
  const [formTextBn, setFormTextBn] = useState('');
  const [formFormula, setFormFormula] = useState('');
  const [formCorrectOption, setFormCorrectOption] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [formOptAEn, setFormOptAEn] = useState('');
  const [formOptABn, setFormOptABn] = useState('');
  const [formOptBEn, setFormOptBEn] = useState('');
  const [formOptBBn, setFormOptBBn] = useState('');
  const [formOptCEn, setFormOptCEn] = useState('');
  const [formOptCBn, setFormOptCBn] = useState('');
  const [formOptDEn, setFormOptDEn] = useState('');
  const [formOptDBn, setFormOptDBn] = useState('');
  const [formOverviewEn, setFormOverviewEn] = useState('');
  const [formOverviewBn, setFormOverviewBn] = useState('');
  const [formCurriculum, setFormCurriculum] = useState('HSC');
  const [formAdmissionCategory, setFormAdmissionCategory] = useState('BUET / Engineering');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [statsData, questionsData, subjectsData, logsData, teachersData] = await Promise.all([
        apiClient.getAdminStats().catch(() => null),
        apiClient.getAdminQuestions().catch(() => []),
        apiClient.getSubjects().catch(() => []),
        apiClient.getAuditLogs().catch(() => []),
        apiClient.getAdminTeachers().catch(() => ({ teachers: [], counts: { pending: 0, approved: 0, rejected: 0, suspended: 0 } })),
      ]);

      if (statsData) setStats(statsData);
      if (questionsData) setQuestions(questionsData);
      if (subjectsData) setSubjects(subjectsData);
      if (logsData) setAuditLogs(logsData);
      if (teachersData) {
        setTeachersList(teachersData.teachers);
        setTeacherCounts(teachersData.counts);
      }
    } catch (err: any) {
      console.warn('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveTeacher = async (teacherId: string) => {
    try {
      await apiClient.approveTeacher(teacherId, 'Approved by Academic Director');
      showToast('Teacher application verified and approved successfully!');
      loadAdminData();
    } catch (err: any) {
      showToast(err.message || 'Failed to approve teacher');
    }
  };

  const handleRejectTeacher = async (teacherId: string) => {
    try {
      await apiClient.rejectTeacher(teacherId, 'Incomplete credentials');
      showToast('Teacher application rejected');
      loadAdminData();
    } catch (err: any) {
      showToast(err.message || 'Failed to reject teacher');
    }
  };

  const handleSuspendTeacher = async (teacherId: string) => {
    try {
      await apiClient.suspendTeacher(teacherId);
      showToast('Teacher account suspended');
      loadAdminData();
    } catch (err: any) {
      showToast(err.message || 'Failed to suspend teacher');
    }
  };

  useEffect(() => {
    if (currentRole === 'ADMIN') {
      loadAdminData();
    }
  }, [currentRole]);

  // Security barrier check
  if (currentRole !== 'ADMIN') {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-[#FFFFFF] border-2 border-[#EF4444]/30 rounded-2xl p-8 shadow-sm text-center space-y-5">
          <div className="w-16 h-16 bg-[#FEF2F2] text-[#DC2626] rounded-2xl flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-[32px]">gpp_bad</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-[#0F172A]">Access Restricted: Admin Privileges Required</h2>
            <p className="text-sm text-[#64748B] max-w-md mx-auto">
              You are currently authenticated as a <strong className="text-[#0F172A]">{currentRole}</strong>. The
              Curriculum Content Workspace, review queues, and publishing pipelines are protected by strict server-side
              role validation.
            </p>
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => onSwitchRole('ADMIN')}
              className="px-5 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <span>Switch to Admin Session (Nusrat Jahan)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const subjectObj = subjects.find((s) => s.id === formSubjectId);
      const newQuestionPayload = {
        subjectId: formSubjectId,
        subjectName: subjectObj?.nameEn || 'Physics',
        chapterId: 'ch_auto',
        chapterName: formChapterName,
        topicId: 'top_auto',
        topicName: formTopicName,
        difficulty: formDifficulty,
        titleEn: formTitleEn || `${formTopicName} Concept`,
        titleBn: formTitleBn || `${formTopicName} সম্পর্কিত প্রশ্ন`,
        questionTextEn: formTextEn,
        questionTextBn: formTextBn || formTextEn,
        formula: formFormula || undefined,
        options: [
          { id: 'A', textEn: formOptAEn || 'Option A', textBn: formOptABn || formOptAEn || 'অপশন A' },
          { id: 'B', textEn: formOptBEn || 'Option B', textBn: formOptBBn || formOptBEn || 'অপশন B' },
          { id: 'C', textEn: formOptCEn || 'Option C', textBn: formOptCBn || formOptCEn || 'অপশন C' },
          { id: 'D', textEn: formOptDEn || 'Option D', textBn: formOptDBn || formOptDEn || 'অপশন D' },
        ],
        correctOptionId: formCorrectOption,
        explanation: {
          overviewEn: formOverviewEn || 'Standard conceptual solution.',
          overviewBn: formOverviewBn || 'আদর্শ সমাধান ব্যাখ্যা।',
          stepByStepEn: ['1. Analyze given parameters', '2. Apply governing formula', '3. Deduce correct option'],
          stepByStepBn: ['১. প্রদত্ত মান পর্যালোচনা', '২. মূল সূত্র প্রয়োগ', '৩. সঠিক উত্তর নির্ধারণ'],
          simpleExplanationEn: 'Direct application of the fundamental principle.',
          simpleExplanationBn: 'মৌলিক সূত্রের সরাসরি প্রয়োগ।',
          keyTakeawayEn: 'Always check dimensional consistency.',
          keyTakeawayBn: 'সর্বদা মাত্রা ও এককের সামঞ্জস্য পরীক্ষা করুন।',
        },
        defaultMistakeCategory: 'Conceptual Error' as const,
        curriculum: formCurriculum,
        admissionCategory: formAdmissionCategory,
      };

      await apiClient.createAdminQuestion(newQuestionPayload);
      showToast('Question created successfully in DRAFT status!');
      setActiveSubTab('bank');
      loadAdminData();
    } catch (err: any) {
      showToast(`Creation failed: ${err.message}`);
    }
  };

  const handleReviewQuestion = async (id: number) => {
    try {
      await apiClient.reviewAdminQuestion(id);
      showToast(`Question #${id} marked as REVIEWED`);
      loadAdminData();
    } catch (err: any) {
      showToast(`Review failed: ${err.message}`);
    }
  };

  const handlePublishQuestion = async (id: number) => {
    try {
      await apiClient.publishAdminQuestion(id);
      showToast(`Question #${id} PUBLISHED to student pool!`);
      loadAdminData();
    } catch (err: any) {
      showToast(`Publishing failed: ${err.message}`);
    }
  };

  const handleArchiveQuestion = async (id: number) => {
    try {
      await apiClient.archiveAdminQuestion(id);
      showToast(`Question #${id} ARCHIVED`);
      loadAdminData();
    } catch (err: any) {
      showToast(`Archive failed: ${err.message}`);
    }
  };

  const filteredQuestions = questions.filter((q) => {
    if (statusFilter !== 'ALL' && q.status !== statusFilter) return false;
    if (selectedSubjectFilter !== 'ALL' && q.subjectId !== selectedSubjectFilter) return false;
    return true;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-5 py-3 rounded-xl shadow-lg border border-[#334155] flex items-center gap-2.5 text-sm font-semibold animate-fade-in">
          <span className="material-symbols-outlined text-[#10B981] text-[20px]">check_circle</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E1B4B] to-[#312E81] rounded-2xl p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm border border-[#312E81]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-[#4F46E5] text-white text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full tracking-wider">
              Admin Content Studio
            </span>
            <span className="text-xs text-[#CBD5E1]">Academic Integrity & Curriculum Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Bangladesh Curriculum Workspace</h1>
          <p className="text-xs text-[#94A3B8]">
            Manage bilingual questions, review draft submissions, and publish verified sets for HSC & University Admission.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveSubTab('create')}
            className="px-4 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Create New Question</span>
          </button>
          <button
            onClick={loadAdminData}
            className="p-2.5 bg-[#1E293B] hover:bg-[#334155] text-white rounded-xl transition-all cursor-pointer"
            title="Refresh Data"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] p-4 rounded-xl shadow-2xs">
            <p className="text-xs font-semibold text-[#64748B]">Total Question Bank</p>
            <p className="text-2xl font-black text-[#0F172A] mt-1">{stats.totalQuestions}</p>
            <p className="text-[10px] text-[#64748B] mt-0.5">Across 8 National Subjects</p>
          </div>
          <div className="bg-[#FFFBEB] border border-[#FDE68A] p-4 rounded-xl shadow-2xs">
            <p className="text-xs font-semibold text-[#D97706]">Drafts Under Creation</p>
            <p className="text-2xl font-black text-[#B45309] mt-1">{stats.draftCount}</p>
            <p className="text-[10px] text-[#D97706] mt-0.5">Requires pedagogical review</p>
          </div>
          <div className="bg-[#EFF6FF] border border-[#BFDBFE] p-4 rounded-xl shadow-2xs">
            <p className="text-xs font-semibold text-[#2563EB]">Reviewed & Ready</p>
            <p className="text-2xl font-black text-[#1D4ED8] mt-1">{stats.reviewedCount}</p>
            <p className="text-[10px] text-[#2563EB] mt-0.5">Ready for live release</p>
          </div>
          <div className="bg-[#ECFDF5] border border-[#A7F3D0] p-4 rounded-xl shadow-2xs">
            <p className="text-xs font-semibold text-[#059669]">Published Live</p>
            <p className="text-2xl font-black text-[#047857] mt-1">{stats.publishedCount}</p>
            <p className="text-[10px] text-[#059669] mt-0.5">Active in student exam pool</p>
          </div>
        </div>
      )}

      {/* Sub Navigation */}
      <div className="flex border-b border-[#E2E8F0] gap-6">
        <button
          onClick={() => setActiveSubTab('bank')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 cursor-pointer transition-all border-b-2 ${
            activeSubTab === 'bank'
              ? 'border-[#4F46E5] text-[#4F46E5]'
              : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">database</span>
          <span>Question Bank ({questions.length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('create')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 cursor-pointer transition-all border-b-2 ${
            activeSubTab === 'create'
              ? 'border-[#4F46E5] text-[#4F46E5]'
              : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">edit_document</span>
          <span>Bilingual Content Editor</span>
        </button>
        <button
          onClick={() => setActiveSubTab('review')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 cursor-pointer transition-all border-b-2 ${
            activeSubTab === 'review'
              ? 'border-[#4F46E5] text-[#4F46E5]'
              : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">verified</span>
          <span>Review & Publishing Pipeline</span>
        </button>
        <button
          onClick={() => setActiveSubTab('audit')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 cursor-pointer transition-all border-b-2 ${
            activeSubTab === 'audit'
              ? 'border-[#4F46E5] text-[#4F46E5]'
              : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">history</span>
          <span>Security Audit Trail</span>
        </button>
        <button
          onClick={() => setActiveSubTab('teachers')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 cursor-pointer transition-all border-b-2 ${
            activeSubTab === 'teachers'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">person_check</span>
          <span>Teacher Approvals</span>
          {teacherCounts.pending > 0 && (
            <span className="px-2 py-0.5 bg-amber-500 text-white rounded-full text-[10px] font-black animate-pulse">
              {teacherCounts.pending} Pending
            </span>
          )}
        </button>
      </div>

      {/* Subtab 1: Question Bank */}
      {activeSubTab === 'bank' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FFFFFF] p-4 rounded-xl border border-[#E2E8F0]">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold text-[#64748B]">Filter Status:</span>
              {['ALL', 'PUBLISHED', 'REVIEWED', 'DRAFT', 'ARCHIVED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    statusFilter === st
                      ? 'bg-[#0F172A] text-white'
                      : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#64748B]">Subject:</span>
              <select
                value={selectedSubjectFilter}
                onChange={(e) => setSelectedSubjectFilter(e.target.value)}
                className="bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-semibold rounded-lg px-2.5 py-1 text-[#0F172A]"
              >
                <option value="ALL">All Subjects</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nameEn} ({s.nameBn})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Question List Table */}
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#0F172A]">
                <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-bold">
                  <tr>
                    <th className="p-3.5">ID</th>
                    <th className="p-3.5">Subject & Topic</th>
                    <th className="p-3.5">Question Title (En/Bn)</th>
                    <th className="p-3.5">Difficulty</th>
                    <th className="p-3.5">Target Exam</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {filteredQuestions.map((q) => {
                    const statusColor =
                      q.status === 'PUBLISHED'
                        ? 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]'
                        : q.status === 'REVIEWED'
                        ? 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]'
                        : q.status === 'DRAFT'
                        ? 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]'
                        : 'bg-[#F1F5F9] text-[#64748B] border-[#CBD5E1]';

                    return (
                      <tr key={q.id} className="hover:bg-[#F8FAFC] transition-colors">
                        <td className="p-3.5 font-bold text-[#4F46E5]">#{q.id}</td>
                        <td className="p-3.5">
                          <p className="font-bold text-[#0F172A]">{q.subjectName}</p>
                          <p className="text-[11px] text-[#64748B]">{q.topicName}</p>
                        </td>
                        <td className="p-3.5 max-w-xs">
                          <p className="font-semibold text-[#0F172A] truncate">{q.titleEn}</p>
                          <p className="text-[11px] text-[#64748B] truncate">{q.titleBn}</p>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              q.difficulty === 'Hard'
                                ? 'bg-red-50 text-red-600'
                                : q.difficulty === 'Medium'
                                ? 'bg-amber-50 text-amber-600'
                                : 'bg-emerald-50 text-emerald-600'
                            }`}
                          >
                            {q.difficulty}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="text-[11px] text-[#475569] font-medium">
                            {q.admissionCategory || q.curriculum}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusColor}`}>
                            {q.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                          {q.status === 'DRAFT' && (
                            <button
                              onClick={() => handleReviewQuestion(q.id)}
                              className="px-2 py-1 bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#2563EB] rounded text-[11px] font-bold cursor-pointer"
                              title="Mark Reviewed"
                            >
                              Review
                            </button>
                          )}
                          {q.status === 'REVIEWED' && (
                            <button
                              onClick={() => handlePublishQuestion(q.id)}
                              className="px-2.5 py-1 bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#059669] rounded text-[11px] font-bold cursor-pointer"
                              title="Publish Live"
                            >
                              Publish
                            </button>
                          )}
                          {q.status === 'PUBLISHED' && (
                            <button
                              onClick={() => handleArchiveQuestion(q.id)}
                              className="px-2 py-1 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#64748B] rounded text-[11px] font-bold cursor-pointer"
                              title="Archive"
                            >
                              Archive
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedQuestion(q)}
                            className="px-2 py-1 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#0F172A] rounded text-[11px] font-bold cursor-pointer"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: Bilingual Content Editor */}
      {activeSubTab === 'create' && (
        <form onSubmit={handleCreateQuestion} className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-6 space-y-6 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">Create Bilingual Academic Question</h3>
              <p className="text-xs text-[#64748B]">
                Enter both English and Bengali content. New items start in DRAFT status and undergo validation before publishing.
              </p>
            </div>
            <span className="px-3 py-1 bg-[#FFFBEB] text-[#B45309] text-xs font-bold rounded-lg border border-[#FDE68A]">
              Lifecycle: DRAFT
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Subject</label>
              <select
                value={formSubjectId}
                onChange={(e) => setFormSubjectId(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2 text-xs font-medium"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nameEn} ({s.nameBn})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Chapter Name</label>
              <input
                type="text"
                value={formChapterName}
                onChange={(e) => setFormChapterName(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2 text-xs font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Topic Name</label>
              <input
                type="text"
                value={formTopicName}
                onChange={(e) => setFormTopicName(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2 text-xs font-medium"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Difficulty</label>
              <select
                value={formDifficulty}
                onChange={(e) => setFormDifficulty(e.target.value as any)}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2 text-xs font-medium"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="Exam-Level">Exam-Level</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Curriculum</label>
              <select
                value={formCurriculum}
                onChange={(e) => setFormCurriculum(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2 text-xs font-medium"
              >
                <option value="HSC">HSC (National Curriculum)</option>
                <option value="SSC">SSC</option>
                <option value="Admission">University Admission</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Admission Target</label>
              <select
                value={formAdmissionCategory}
                onChange={(e) => setFormAdmissionCategory(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2 text-xs font-medium"
              >
                <option value="BUET / Engineering">BUET / Engineering</option>
                <option value="Medical / DMC">Medical / DMC</option>
                <option value="Dhaka University (KA/KHA)">Dhaka University (KA/KHA)</option>
                <option value="BCS">BCS & Govt. Job Prep</option>
              </select>
            </div>
          </div>

          {/* Bilingual Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Title (English)</label>
              <input
                type="text"
                placeholder="e.g. Isothermal Expansion of Ideal Gas"
                value={formTitleEn}
                onChange={(e) => setFormTitleEn(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2 text-xs font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Title (বাংলা)</label>
              <input
                type="text"
                placeholder="যেমন: আদর্শ গ্যাসের সমোষ্ণ প্রসারণ"
                value={formTitleBn}
                onChange={(e) => setFormTitleBn(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2 text-xs font-medium"
                required
              />
            </div>
          </div>

          {/* Bilingual Question Text */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Question Body (English)</label>
              <textarea
                rows={3}
                placeholder="Type the full English question stem..."
                value={formTextEn}
                onChange={(e) => setFormTextEn(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2 text-xs font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Question Body (বাংলায়)</label>
              <textarea
                rows={3}
                placeholder="বাংলা ভাষায় প্রশ্নের বিবরণ লিখুন..."
                value={formTextBn}
                onChange={(e) => setFormTextBn(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2 text-xs font-medium"
                required
              />
            </div>
          </div>

          {/* Options & Protected Answer Key */}
          <div className="border border-[#E2E8F0] rounded-xl p-4 bg-[#F8FAFC] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0F172A]">Multiple Choice Options & Answer Key</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#4F46E5]">Correct Option:</span>
                {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                  <label key={opt} className="flex items-center gap-1 text-xs font-bold cursor-pointer">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={formCorrectOption === opt}
                      onChange={() => setFormCorrectOption(opt)}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#475569]">Option A (En / Bn)</span>
                <input
                  type="text"
                  placeholder="Option A in English"
                  value={formOptAEn}
                  onChange={(e) => setFormOptAEn(e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] rounded p-1.5 text-xs mb-1"
                  required
                />
                <input
                  type="text"
                  placeholder="অপশন A বাংলায়"
                  value={formOptABn}
                  onChange={(e) => setFormOptABn(e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] rounded p-1.5 text-xs"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#475569]">Option B (En / Bn)</span>
                <input
                  type="text"
                  placeholder="Option B in English"
                  value={formOptBEn}
                  onChange={(e) => setFormOptBEn(e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] rounded p-1.5 text-xs mb-1"
                  required
                />
                <input
                  type="text"
                  placeholder="অপশন B বাংলায়"
                  value={formOptBBn}
                  onChange={(e) => setFormOptBBn(e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] rounded p-1.5 text-xs"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#475569]">Option C (En / Bn)</span>
                <input
                  type="text"
                  placeholder="Option C in English"
                  value={formOptCEn}
                  onChange={(e) => setFormOptCEn(e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] rounded p-1.5 text-xs mb-1"
                  required
                />
                <input
                  type="text"
                  placeholder="অপশন C বাংলায়"
                  value={formOptCBn}
                  onChange={(e) => setFormOptCBn(e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] rounded p-1.5 text-xs"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#475569]">Option D (En / Bn)</span>
                <input
                  type="text"
                  placeholder="Option D in English"
                  value={formOptDEn}
                  onChange={(e) => setFormOptDEn(e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] rounded p-1.5 text-xs mb-1"
                  required
                />
                <input
                  type="text"
                  placeholder="অপশন D বাংলায়"
                  value={formOptDBn}
                  onChange={(e) => setFormOptDBn(e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] rounded p-1.5 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Explanations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Explanation Overview (English)</label>
              <textarea
                rows={2}
                placeholder="Full pedagogical breakdown..."
                value={formOverviewEn}
                onChange={(e) => setFormOverviewEn(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2 text-xs font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1">Explanation Overview (বাংলায়)</label>
              <textarea
                rows={2}
                placeholder="বাংলায় বিস্তারিত সমাধান ব্যাখ্যা..."
                value={formOverviewBn}
                onChange={(e) => setFormOverviewBn(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2 text-xs font-medium"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setActiveSubTab('bank')}
              className="px-4 py-2 border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] rounded-xl text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer"
            >
              Save Question as Draft
            </button>
          </div>
        </form>
      )}

      {/* Subtab 3: Review & Publishing Pipeline */}
      {activeSubTab === 'review' && (
        <div className="space-y-4">
          <div className="bg-[#EFF6FF] border border-[#BFDBFE] p-4 rounded-xl text-xs text-[#1E40AF]">
            <p className="font-bold">Content Governance Protocol</p>
            <p className="mt-0.5">
              Items transition strictly from <strong>DRAFT</strong> → <strong>REVIEWED</strong> (verified by SME) → <strong>PUBLISHED</strong> (deployed live). Only Admins possess release authorization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Draft Queue */}
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-4 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
                <span className="text-xs font-bold text-[#D97706] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#D97706]" />
                  Draft Queue ({questions.filter((q) => q.status === 'DRAFT').length})
                </span>
                <span className="text-[10px] text-[#64748B]">Requires Review</span>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {questions
                  .filter((q) => q.status === 'DRAFT')
                  .map((q) => (
                    <div key={q.id} className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-bold text-[#0F172A]">#{q.id} {q.titleEn}</p>
                          <p className="text-[11px] text-[#64748B]">{q.subjectName} • {q.topicName}</p>
                        </div>
                        <span className="text-[10px] font-bold bg-[#FFFBEB] text-[#B45309] px-2 py-0.5 rounded">
                          DRAFT
                        </span>
                      </div>
                      <p className="text-xs text-[#334155] italic bg-white p-2 rounded border border-[#E2E8F0]">
                        "{q.questionTextEn}"
                      </p>
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          onClick={() => handleReviewQuestion(q.id)}
                          className="px-3 py-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded text-[11px] font-bold cursor-pointer"
                        >
                          Approve as Reviewed
                        </button>
                      </div>
                    </div>
                  ))}
                {questions.filter((q) => q.status === 'DRAFT').length === 0 && (
                  <p className="text-xs text-[#94A3B8] text-center py-6">No items awaiting draft review.</p>
                )}
              </div>
            </div>

            {/* Reviewed Queue */}
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-4 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
                <span className="text-xs font-bold text-[#2563EB] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
                  Reviewed & Pending Release ({questions.filter((q) => q.status === 'REVIEWED').length})
                </span>
                <span className="text-[10px] text-[#64748B]">Publish Ready</span>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {questions
                  .filter((q) => q.status === 'REVIEWED')
                  .map((q) => (
                    <div key={q.id} className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-bold text-[#0F172A]">#{q.id} {q.titleEn}</p>
                          <p className="text-[11px] text-[#64748B]">{q.subjectName} • {q.topicName}</p>
                        </div>
                        <span className="text-[10px] font-bold bg-[#EFF6FF] text-[#1D4ED8] px-2 py-0.5 rounded">
                          REVIEWED
                        </span>
                      </div>
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          onClick={() => handlePublishQuestion(q.id)}
                          className="px-3.5 py-1.5 bg-[#059669] hover:bg-[#047857] text-white rounded text-xs font-bold cursor-pointer shadow-sm"
                        >
                          Publish to Live Pool
                        </button>
                      </div>
                    </div>
                  ))}
                {questions.filter((q) => q.status === 'REVIEWED').length === 0 && (
                  <p className="text-xs text-[#94A3B8] text-center py-6">No items awaiting publishing.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 5: Teacher Applications & Verification */}
      {activeSubTab === 'teachers' && (
        <div className="space-y-4">
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">Teacher & Faculty Verification Queue</h3>
                <p className="text-xs text-[#64748B]">
                  Review pedagogical credentials, university affiliations, and subject qualifications before granting classroom permissions.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                  {teacherCounts.pending} Pending Review
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
                  {teacherCounts.approved} Active Faculty
                </span>
              </div>
            </div>

            {teachersList.length === 0 ? (
              <div className="text-center py-12 text-[#64748B] text-xs">
                No teacher applications found.
              </div>
            ) : (
              <div className="space-y-4">
                {teachersList.map((t) => (
                  <div
                    key={t.id}
                    className="p-5 bg-[#F8FAFC] border border-[#E2E8F0] hover:border-indigo-400 rounded-xl transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 font-bold text-sm flex items-center justify-center">
                          {t.name.substring(0, 2)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-[#0F172A]">{t.name}</h4>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                t.teacherStatus === 'PENDING'
                                  ? 'bg-amber-200 text-amber-900'
                                  : t.teacherStatus === 'APPROVED'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : t.teacherStatus === 'REJECTED'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-slate-200 text-slate-800'
                              }`}
                            >
                              {t.teacherStatus || 'PENDING'}
                            </span>
                          </div>
                          <div className="text-xs text-[#64748B]">
                            {t.email} • {t.phone || '+880 1700-000000'}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-2 sm:pt-0">
                        {t.teacherStatus === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleApproveTeacher(t.id)}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[16px]">check</span>
                              <span>Approve Faculty</span>
                            </button>
                            <button
                              onClick={() => handleRejectTeacher(t.id)}
                              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[16px]">close</span>
                              <span>Reject</span>
                            </button>
                          </>
                        )}

                        {t.teacherStatus === 'APPROVED' && (
                          <button
                            onClick={() => handleSuspendTeacher(t.id)}
                            className="px-3 py-1.5 border border-red-300 text-red-700 hover:bg-red-50 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                          >
                            Suspend Access
                          </button>
                        )}

                        {t.teacherStatus === 'SUSPENDED' && (
                          <button
                            onClick={() => handleApproveTeacher(t.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                          >
                            Re-Approve
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Qualifications & Profile */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs border-t border-[#E2E8F0]">
                      <div>
                        <span className="text-[11px] text-[#64748B] block font-semibold">Qualifications</span>
                        <span className="text-[#0F172A] font-medium">
                          {t.teacherProfile?.qualifications || t.institution || 'M.Sc. / Ph.D.'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[11px] text-[#64748B] block font-semibold">Teaching Experience</span>
                        <span className="text-[#0F172A] font-medium">
                          {t.teacherProfile?.experience || 'Advanced Faculty'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[11px] text-[#64748B] block font-semibold">Hourly Rate (BDT)</span>
                        <span className="text-[#0F172A] font-bold">
                          ৳ {t.teacherProfile?.hourlyRateBDT || 1200} / hr
                        </span>
                      </div>
                    </div>

                    {/* Subjects */}
                    {t.teacherProfile?.subjects && t.teacherProfile.subjects.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[11px] text-[#64748B] font-semibold mr-1">Specialties:</span>
                        {t.teacherProfile.subjects.map((s: string) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-800 text-[10px] font-semibold"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {activeSubTab === 'audit' && (
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A]">Immutable Security Audit Logs</h3>
              <p className="text-xs text-[#64748B]">All publishing events, content modifications, and authorization checks are recorded.</p>
            </div>
            <span className="text-xs font-mono text-[#64748B]">{auditLogs.length} events</span>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#4F46E5]">{log.action}</span>
                    <span className="text-[#94A3B8]">•</span>
                    <span className="text-[#475569] font-medium">{log.entity} #{log.entityId}</span>
                    <span className="text-[10px] bg-[#E2E8F0] text-[#475569] px-1.5 py-0.5 rounded font-mono">
                      {log.actorRole}
                    </span>
                  </div>
                  <p className="text-[#334155]">{log.details}</p>
                </div>
                <div className="text-right text-[11px] text-[#94A3B8] whitespace-nowrap">
                  <p>{new Date(log.timestamp).toLocaleDateString()}</p>
                  <p>{new Date(log.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Question Inspector Modal */}
      {selectedQuestion && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-4 shadow-xl border border-[#E2E8F0]">
            <div className="flex justify-between items-start border-b border-[#E2E8F0] pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-[#4F46E5]">Question #{selectedQuestion.id}</span>
                <h3 className="text-base font-bold text-[#0F172A]">{selectedQuestion.titleEn}</h3>
                <p className="text-xs text-[#64748B]">{selectedQuestion.titleBn}</p>
              </div>
              <button
                onClick={() => setSelectedQuestion(null)}
                className="p-1 rounded-lg text-[#64748B] hover:bg-[#F1F5F9]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
                <p className="font-bold text-[#0F172A] mb-1">Question Body:</p>
                <p className="text-[#334155] mb-2">{selectedQuestion.questionTextEn}</p>
                <p className="text-[#475569] italic">{selectedQuestion.questionTextBn}</p>
              </div>

              <div className="space-y-1.5">
                <p className="font-bold text-[#0F172A]">Options & Protected Answer Key:</p>
                {selectedQuestion.options.map((opt) => (
                  <div
                    key={opt.id}
                    className={`p-2 rounded-lg border text-xs flex justify-between items-center ${
                      opt.id === selectedQuestion.correctOptionId
                        ? 'bg-[#ECFDF5] border-[#10B981] font-bold text-[#065F46]'
                        : 'bg-white border-[#E2E8F0] text-[#475569]'
                    }`}
                  >
                    <span>{opt.id}. {opt.textEn || opt.text} ({opt.textBn || ''})</span>
                    {opt.id === selectedQuestion.correctOptionId && (
                      <span className="text-[10px] bg-[#10B981] text-white px-2 py-0.5 rounded">
                        Correct Answer
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-[#EFF6FF] p-3 rounded-lg border border-[#BFDBFE]">
                <p className="font-bold text-[#1E40AF] mb-1">Explanation (Pedagogy):</p>
                <p className="text-[#1E3A8A]">{selectedQuestion.explanation?.overviewEn || selectedQuestion.explanation?.overview}</p>
                <p className="text-[#1E3A8A] mt-1 italic">{selectedQuestion.explanation?.overviewBn || selectedQuestion.explanation?.banglaExplanation}</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedQuestion(null)}
                className="px-4 py-2 bg-[#0F172A] text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
