import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MobileTopBar, MobileBottomBar } from './components/MobileNav';
import { SearchModal } from './components/SearchModal';
import { UpgradeModal } from './components/UpgradeModal';
import { SettingsModal } from './components/SettingsModal';
import { BookingModal } from './components/BookingModal';
import { DashboardView } from './components/DashboardView';
import { PracticeView } from './components/PracticeView';
import { ExamSimulator } from './components/ExamSimulator';
import { ExamResultsView } from './components/ExamResultsView';
import { QuestionReviewView } from './components/QuestionReviewView';
import { ProgressView } from './components/ProgressView';
import { MistakeBookView } from './components/MistakeBookView';
import { AiCoachView } from './components/AiCoachView';
import { TutorsView } from './components/TutorsView';
import { LandingView } from './components/LandingView';
import { StudyPlanView } from './components/StudyPlanView';
import { SubjectsView } from './components/SubjectsView';
import { PricingView } from './components/PricingView';
import { ProfileView } from './components/ProfileView';
import { AdminWorkspaceView } from './components/AdminWorkspaceView';
import { RegistrationPathwayModal } from './components/RegistrationPathwayModal';
import { TeacherPendingVerificationView } from './components/TeacherPendingVerificationView';
import { TeacherVerificationDashboard } from './components/TeacherVerificationDashboard';
import { TeacherDashboardView } from './components/TeacherDashboardView';
import { LiveClassroomView } from './components/LiveClassroomView';
import { LiveClassesView } from './components/LiveClassesView';

import {
  mockQuestions,
  mockTutors,
  generateFullExam,
} from './data/mockData';
import { Tutor, Question, SafeQuestion, ExamResult, MistakeItem, Role, AvailableUser, UserProfile, LiveClass } from './types';
import { apiClient } from './services/api';

export function App() {
  const [viewMode, setViewMode] = useState<'landing' | 'app'>('app');
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [targetDays, setTargetDays] = useState<number>(14);
  const [isPro, setIsPro] = useState<boolean>(true);
  const [activeCoachPrompt, setActiveCoachPrompt] = useState<string>('');
  const [preferredLanguage, setPreferredLanguage] = useState<'en' | 'bn'>('bn');

  // Multi-Role & Auth Session State
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: 'usr_istihad',
    name: 'Istihad Ahmed',
    email: 'istihadahmed1163@gmail.com',
    role: 'STUDENT',
    subscription: 'PRO',
    targetExam: 'BUET & University Admission',
    targetBatch: 'HSC 2025 Batch',
    examCountdownDays: 14,
    targetScore: 95,
    preferredLanguage: 'bn',
    dailyGoalHours: 4.5,
    currentStreakDays: 14,
    highestStreakDays: 21,
    institution: 'Academic Student',
  });

  const [availableUsers, setAvailableUsers] = useState<AvailableUser[]>([
    { id: 'usr_istihad', name: 'Istihad Ahmed', role: 'STUDENT', email: 'istihadahmed1163@gmail.com' },
  ]);

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [selectedTutorForBooking, setSelectedTutorForBooking] = useState<Tutor | null>(null);
  const [tutorsList, setTutorsList] = useState<Tutor[]>([]);
  const [activeLiveClass, setActiveLiveClass] = useState<LiveClass | null>(null);

  // Active Exam Simulator state
  const [activeExamSession, setActiveExamSession] = useState<{
    isOpen: boolean;
    attemptId?: string;
    examId?: string;
    title: string;
    subject: string;
    questions: (Question | SafeQuestion)[];
    durationMinutes: number;
  } | null>(null);

  // Exam Result state
  const [currentExamResult, setCurrentExamResult] = useState<ExamResult | null>(null);

  // Deep Question Review state
  const [reviewQuestions, setReviewQuestions] = useState<Question[] | null>(null);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load initial authentication & profile info
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const authData = await apiClient.getAuthMe();
        if (authData.user) {
          setCurrentUser(authData.user);
          if (authData.user.preferredLanguage) {
            setPreferredLanguage(authData.user.preferredLanguage);
          }
        }
        if (authData.availableUsers && authData.availableUsers.length > 0) {
          setAvailableUsers(authData.availableUsers);
        }

        // Fetch verified academic tutors
        const tutors = await apiClient.getTutors();
        if (tutors && tutors.length > 0) {
          setTutorsList(tutors);
        }
      } catch (err) {
        console.warn('Using default session', err);
      }
    };
    fetchSession();
  }, []);

  const handleSwitchUser = async (userId: string, role?: Role) => {
    try {
      const res = await apiClient.switchUser(userId, role);
      if (res.user) {
        setCurrentUser(res.user);
        if (res.user.role === 'ADMIN' && currentTab === 'dashboard') {
          setCurrentTab('admin');
        }
        triggerToast(`Switched to ${res.user.name} (${res.user.role})`);
      } else {
        const found = availableUsers.find((u) => u.id === userId);
        if (found) {
          setCurrentUser((prev) => ({ ...prev, id: found.id, name: found.name, role: found.role, email: found.email }));
          triggerToast(`Switched to ${found.name} (${found.role})`);
        }
      }
    } catch {
      triggerToast('User persona updated');
    }
  };

  const handleToggleLanguage = () => {
    const nextLang = preferredLanguage === 'bn' ? 'en' : 'bn';
    setPreferredLanguage(nextLang);
    apiClient.updateUserProfile({ preferredLanguage: nextLang });
    triggerToast(nextLang === 'bn' ? 'ভাষা পরিবর্তন করা হয়েছে: বাংলা' : 'Language switched: English');
  };

  // Launch a mock exam
  const handleStartExam = async (subject: string = 'Higher Mathematics') => {
    try {
      // Attempt to load from real server exams
      const examsData = await apiClient.getExams();
      const matchedExam = (examsData.exams || []).find((e: any) =>
        e.subjectName.toLowerCase().includes(subject.toLowerCase()) ||
        e.titleEn.toLowerCase().includes(subject.toLowerCase())
      ) || examsData.exams?.[0];

      if (matchedExam) {
        const startResponse = await apiClient.startExam(matchedExam.id);
        setActiveExamSession({
          isOpen: true,
          attemptId: startResponse.attemptId,
          examId: matchedExam.id,
          title: preferredLanguage === 'bn' ? startResponse.exam.titleBn : startResponse.exam.titleEn,
          subject: startResponse.exam.subjectName,
          questions: startResponse.questions,
          durationMinutes: startResponse.exam.durationMinutes,
        });
        return;
      }
    } catch (err) {
      console.warn('Direct exam start fallback:', err);
    }

    // Fallback exam questions
    const examQuestions = generateFullExam(20, subject);
    setActiveExamSession({
      isOpen: true,
      title: `${subject} Comprehensive Examination`,
      subject,
      questions: examQuestions,
      durationMinutes: 45,
    });
  };

  // Launch a practice session
  const handleStartPractice = (topic: string = 'Integration by Parts') => {
    const practiceQuestions = generateFullExam(10, topic);
    setActiveExamSession({
      isOpen: true,
      title: `${topic} Targeted Drill`,
      subject: topic,
      questions: practiceQuestions,
      durationMinutes: 15,
    });
  };

  // When exam is finished
  const handleFinishExam = (result: ExamResult) => {
    setActiveExamSession(null);
    setCurrentExamResult(result);
    setReviewQuestions(mockQuestions);
  };

  // Switch to student app view
  const enterApp = (targetTab: string = 'dashboard') => {
    setViewMode('app');
    setCurrentTab(targetTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (viewMode === 'landing') {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <LandingView
          onGetStarted={() => enterApp('dashboard')}
          onLogin={() => enterApp('dashboard')}
          onExploreSubject={() => enterApp('subjects')}
          onOpenPricing={() => enterApp('pricing')}
          onOpenRegistration={() => {
            enterApp('dashboard');
            setIsRegistrationOpen(true);
          }}
        />
        <RegistrationPathwayModal
          isOpen={isRegistrationOpen}
          onClose={() => setIsRegistrationOpen(false)}
          onRegistrationSuccess={(user, role) => {
            setCurrentUser(user);
            setIsRegistrationOpen(false);
            enterApp(role === 'TEACHER' ? 'teacher_dashboard' : 'dashboard');
            triggerToast('Account created successfully!');
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-body antialiased text-[#0F172A] selection:bg-[#E0E7FF] selection:text-[#4338CA]">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#0F172A] text-white px-4 py-2.5 rounded-2xl shadow-xl border border-[#334155] text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <span className="material-symbols-outlined text-[16px] text-emerald-400">check_circle</span>
          {toastMessage}
        </div>
      )}

      {/* Main Layout */}
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            setReviewQuestions(null);
            setCurrentExamResult(null);
          }}
          onOpenUpgrade={() => setIsUpgradeOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenSupport={() => triggerToast('Academic Support Desk is active at support@virtualtutor.bd')}
          onOpenLanding={() => setViewMode('landing')}
          currentRole={currentUser.role}
          currentUser={currentUser}
          preferredLanguage={preferredLanguage}
        />

        {/* Content Wrapper */}
        <div className="flex-1 flex flex-col lg:pl-64 min-w-0 pb-16 lg:pb-0">
          {/* Top Desktop Header */}
          <Header
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenLanding={() => setViewMode('landing')}
            onOpenRegistration={() => setIsRegistrationOpen(true)}
            streakCount={currentUser.currentStreakDays || 14}
            currentRole={currentUser.role}
            currentUser={currentUser}
            availableUsers={availableUsers}
            onSwitchUser={handleSwitchUser}
            preferredLanguage={preferredLanguage}
            onToggleLanguage={handleToggleLanguage}
          />

          {/* Top Mobile Bar */}
          <MobileTopBar
            title="Virtual Tutor"
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />

          {/* Main App Content View Switcher */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {/* 0. If Teacher Account is PENDING verification and on default view */}
            {currentUser.role === 'TEACHER' && currentUser.teacherStatus === 'PENDING' && currentTab !== 'teacher_dashboard' && currentTab !== 'live_classes' && currentTab !== 'practice' && currentTab !== 'progress' ? (
              <TeacherVerificationDashboard
                currentUser={currentUser}
                onUpdateUser={(updatedUser) => {
                  setCurrentUser(updatedUser);
                  if (updatedUser.teacherStatus === 'APPROVED') {
                    triggerToast('🎉 Your teaching credentials have been verified and approved!');
                  }
                }}
                onLaunchClass={(cls) => setActiveLiveClass(cls)}
                onNavigateToTab={(tab) => setCurrentTab(tab)}
                preferredLanguage={preferredLanguage}
              />
            ) : reviewQuestions ? (
              /* 1. If currently reviewing question solutions */
              <QuestionReviewView
                questions={reviewQuestions}
                onBackToResults={() => setReviewQuestions(null)}
                onNavigateTab={(tab) => {
                  setReviewQuestions(null);
                  setCurrentTab(tab);
                }}
              />
            ) : currentExamResult ? (
              /* 2. If viewing exam diagnostic results */
              <ExamResultsView
                result={currentExamResult}
                onReviewSolutions={() => setReviewQuestions(mockQuestions)}
                onStartTargetedPractice={(topic) => handleStartPractice(topic)}
                onBackToDashboard={() => {
                  setCurrentExamResult(null);
                  setCurrentTab('dashboard');
                }}
              />
            ) : (
              /* 3. Standard Tab Views */
              <>
                {currentTab === 'admin' && (
                  <AdminWorkspaceView
                    currentRole={currentUser.role}
                    onSwitchRole={(role) => handleSwitchUser(availableUsers.find((u) => u.role === role)?.id || '', role)}
                    preferredLanguage={preferredLanguage}
                  />
                )}

                {currentTab === 'teacher_verification' && (
                  <TeacherVerificationDashboard
                    currentUser={currentUser}
                    onUpdateUser={(updatedUser) => setCurrentUser(updatedUser)}
                    onLaunchClass={(cls) => setActiveLiveClass(cls)}
                    onNavigateToTab={(tab) => setCurrentTab(tab)}
                    preferredLanguage={preferredLanguage}
                  />
                )}

                {currentTab === 'teacher_dashboard' && (
                  <TeacherDashboardView
                    currentUser={currentUser}
                    onLaunchClass={(cls) => setActiveLiveClass(cls)}
                    onUpdateUser={(updatedUser) => setCurrentUser(updatedUser)}
                    preferredLanguage={preferredLanguage}
                  />
                )}

                {currentTab === 'live_classes' && (
                  <LiveClassesView
                    currentUser={currentUser}
                    onJoinClass={(cls) => setActiveLiveClass(cls)}
                    preferredLanguage={preferredLanguage}
                  />
                )}

                {currentTab === 'dashboard' && (
                  <DashboardView
                    onStartExam={handleStartExam}
                    onStartPractice={handleStartPractice}
                    onNavigateTab={setCurrentTab}
                    onOpenBooking={(tutor) => setSelectedTutorForBooking(tutor)}
                    tutors={mockTutors}
                    targetDays={targetDays}
                  />
                )}

                {currentTab === 'practice' && (
                  <PracticeView
                    onStartSession={(subject, topic) =>
                      handleStartPractice(topic || subject)
                    }
                  />
                )}

                {currentTab === 'coach' && (
                  <AiCoachView
                    onStartTargetedPractice={handleStartPractice}
                    initialQuery={activeCoachPrompt}
                  />
                )}

                {currentTab === 'exams' && (
                  <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2FF] text-[#4F46E5] text-xs font-bold uppercase tracking-wider mb-2 border border-[#C7D2FE]">
                        <span className="material-symbols-outlined text-[14px]">assignment</span>
                        {preferredLanguage === 'bn' ? 'জাতীয় মান মক পরীক্ষা' : 'Full Exam Simulation'}
                      </div>
                      <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                        {preferredLanguage === 'bn'
                          ? 'উচ্চ-চাপ ভর্তি ও এইচএসসি মক পরীক্ষা সিমুলেটর'
                          : 'High-Stakes Mock Exam Simulator'}
                      </h2>
                      <p className="text-sm text-[#64748B] mt-1">
                        {preferredLanguage === 'bn'
                          ? 'নেগেটিভ মার্কিং, রিয়েল-টাইম গতি ট্র্যাকিং এবং বুয়েট/মেডিকেল পার্সেন্টাইল প্রজেকশন সম্বলিত পূর্ণাঙ্গ পরীক্ষা।'
                          : 'Full-length timed examinations featuring strict negative marking, real-time pace analysis, and percentile projection.'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-7 border border-[#E2E8F0] shadow-sm flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#4F46E5] bg-[#EEF2FF] px-2.5 py-0.5 rounded-full">
                              Higher Mathematics • 50 Questions
                            </span>
                            <span className="text-xs font-semibold text-[#64748B]">90 Mins</span>
                          </div>
                          <h3 className="font-display text-xl font-bold text-[#0F172A]">
                            {preferredLanguage === 'bn'
                              ? 'উচ্চতর গণিত ১ম ও ২য় পত্র পূর্ণাঙ্গ মক টেস্ট'
                              : 'Higher Mathematics Comprehensive Mock Test #4'}
                          </h3>
                          <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
                            Full coverage: Calculus, Integrals, Limits, Matrix Algebra, Analytical Geometry, and Conics.
                          </p>
                        </div>
                        <button
                          onClick={() => handleStartExam('Higher Mathematics')}
                          className="w-full py-3 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                        >
                          <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                          {preferredLanguage === 'bn' ? 'টাইমড সিমুলেশন শুরু করুন' : 'Start Timed Simulation'}
                        </button>
                      </div>

                      <div className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-7 border border-[#E2E8F0] shadow-sm flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#10B981] bg-[#ECFDF5] px-2.5 py-0.5 rounded-full">
                              Physics • 40 Questions
                            </span>
                            <span className="text-xs font-semibold text-[#64748B]">60 Mins</span>
                          </div>
                          <h3 className="font-display text-xl font-bold text-[#0F172A]">
                            {preferredLanguage === 'bn'
                              ? 'পদার্থবিজ্ঞান ১ম ও ২য় পত্র সমন্বিত মডেল টেস্ট'
                              : 'Physics Paper 1 & 2 Comprehensive'}
                          </h3>
                          <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
                            Thermodynamics, Ideal Gas Law, Wave Optics, Projectiles, Dynamics, and Electromagnetism.
                          </p>
                        </div>
                        <button
                          onClick={() => handleStartExam('Physics')}
                          className="w-full py-3 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                        >
                          <span className="material-symbols-outlined text-[16px]">bolt</span>
                          {preferredLanguage === 'bn' ? 'পদার্থবিজ্ঞান পরীক্ষা শুরু করুন' : 'Start Physics Mock'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {currentTab === 'progress' && (
                  <ProgressView
                    onStartPractice={(topic) => handleStartPractice(topic || 'Integration by Parts')}
                  />
                )}

                {currentTab === 'mistakes' && (
                  <MistakeBookView
                    onPracticeMistake={(m: MistakeItem) => handleStartPractice(m.question.topic)}
                    onOpenSocraticTutor={(m: MistakeItem) => {
                      setActiveCoachPrompt(`Please help me understand my mistake on: ${m.question.topic} - "${m.question.questionText}"`);
                      setCurrentTab('coach');
                    }}
                  />
                )}

                {currentTab === 'plan' && (
                  <StudyPlanView
                    onStartTask={(taskId, topic) => handleStartPractice(topic)}
                  />
                )}

                {currentTab === 'subjects' && (
                  <SubjectsView
                    onSelectSubject={(sub) => handleStartExam(sub)}
                    onStartPractice={(topic) => handleStartPractice(topic)}
                  />
                )}

                {currentTab === 'tutors' && (
                  <TutorsView
                    tutors={tutorsList}
                    onOpenBooking={(tutor) => setSelectedTutorForBooking(tutor)}
                    preferredLanguage={preferredLanguage}
                    onOpenTeacherRegistration={() => setIsRegistrationOpen(true)}
                  />
                )}

                {currentTab === 'pricing' && (
                  <PricingView
                    onSelectPlan={(plan) => {
                      if (plan === 'Pro') {
                        setIsUpgradeOpen(true);
                      } else {
                        triggerToast(`Switched to ${plan} plan!`);
                      }
                    }}
                    onBackToApp={() => setCurrentTab('dashboard')}
                  />
                )}

                {currentTab === 'profile' && (
                  <ProfileView
                    onUpgrade={() => setIsUpgradeOpen(true)}
                  />
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomBar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setReviewQuestions(null);
          setCurrentExamResult(null);
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Modals & Drawers */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(tab) => {
          setCurrentTab(tab);
          setReviewQuestions(null);
          setCurrentExamResult(null);
        }}
        tutors={tutorsList}
      />

      <UpgradeModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
        onUpgradeSuccess={() => {
          setIsPro(true);
          triggerToast('Pro features successfully unlocked! 🎉');
        }}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        targetExamDays={targetDays}
        onUpdateDays={(d) => {
          setTargetDays(d);
          triggerToast(`Countdown updated to ${d} days!`);
        }}
      />

      <BookingModal
        tutor={selectedTutorForBooking}
        isOpen={!!selectedTutorForBooking}
        onClose={() => setSelectedTutorForBooking(null)}
        preferredLanguage={preferredLanguage}
        onConfirmBooking={(details) => {
          triggerToast(`Session booked with ${details.tutor.name}!`);
        }}
      />

      {/* Full-Screen Exam Simulator Focus Mode */}
      {activeExamSession && activeExamSession.isOpen && (
        <ExamSimulator
          attemptId={activeExamSession.attemptId}
          examId={activeExamSession.examId}
          examTitle={activeExamSession.title}
          subject={activeExamSession.subject}
          questions={activeExamSession.questions}
          durationMinutes={activeExamSession.durationMinutes}
          onFinishExam={handleFinishExam}
          onExit={() => setActiveExamSession(null)}
          preferredLanguage={preferredLanguage}
        />
      )}

      {/* Interactive Live Classroom Studio */}
      {activeLiveClass && (
        <LiveClassroomView
          liveClass={activeLiveClass}
          currentUser={currentUser}
          onLeave={() => setActiveLiveClass(null)}
        />
      )}

      {/* Registration Pathway Modal */}
      <RegistrationPathwayModal
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
        onRegistrationSuccess={(user, role) => {
          setCurrentUser(user);
          setIsRegistrationOpen(false);
          if (role === 'TEACHER') {
            setCurrentTab('teacher_dashboard');
            triggerToast('Teacher application submitted for academic verification.');
          } else {
            setCurrentTab('dashboard');
            triggerToast('Welcome to Virtual Tutor! Your student profile is active.');
          }
        }}
      />
    </div>
  );
}

export default App;
