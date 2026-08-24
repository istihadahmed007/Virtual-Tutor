import React, { useState } from 'react';
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

import {
  mockQuestions,
  mockMistakes,
  mockTutors,
  generateFullExam,
} from './data/mockData';
import { Tutor, Question, ExamResult } from './types';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [targetDays, setTargetDays] = useState<number>(12);
  const [isPro, setIsPro] = useState<boolean>(false);
  const [activeCoachPrompt, setActiveCoachPrompt] = useState<string>('');

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedTutorForBooking, setSelectedTutorForBooking] = useState<Tutor | null>(null);

  // Active Exam Simulator state
  const [activeExamSession, setActiveExamSession] = useState<{
    isOpen: boolean;
    title: string;
    subject: string;
    questions: Question[];
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
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Launch a mock exam
  const handleStartExam = (subject: string = 'Physics') => {
    const examQuestions = generateFullExam(20, subject);
    setActiveExamSession({
      isOpen: true,
      title: `${subject} Mock Examination #4`,
      subject,
      questions: examQuestions,
      durationMinutes: 45,
    });
  };

  // Launch a practice session
  const handleStartPractice = (topic: string = 'Calculus') => {
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

  // Try again single question
  const handleTryAgainQuestion = (q: Question) => {
    setActiveExamSession({
      isOpen: true,
      title: `Review Drill: ${q.topic}`,
      subject: q.subject,
      questions: [q],
      durationMinutes: 5,
    });
  };

  return (
    <div className="min-h-screen bg-[#F9F7F5] flex flex-col antialiased text-[#1b1c1b]">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#000000] text-white px-4 py-2.5 rounded-xl shadow-xl border border-[#c5c6cd]/50 text-xs font-semibold flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-[16px] text-green-400">check_circle</span>
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
          onOpenSupport={() => triggerToast('Support desk is available 24/7 at support@exam-mastery.io')}
        />

        {/* Content Wrapper */}
        <div className="flex-1 flex flex-col lg:pl-64 min-w-0 pb-16 lg:pb-0">
          {/* Top Desktop Header */}
          <Header
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            streakCount={12}
          />

          {/* Top Mobile Bar */}
          <MobileTopBar
            title="Exam Mastery OS"
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />

          {/* Main App Content View Switcher */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {/* 1. If currently reviewing question solutions */}
            {reviewQuestions ? (
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
                    onStartSession={(subject, topic, count) =>
                      handleStartPractice(topic || subject)
                    }
                  />
                )}

                {currentTab === 'exams' && (
                  <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f5f3f1] text-[#000000] text-xs font-bold uppercase tracking-wider mb-2 border border-[#c5c6cd]/60">
                        <span className="material-symbols-outlined text-[14px]">assignment</span>
                        Full Simulation
                      </div>
                      <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#000000]">
                        High-Stakes Mock Exam Simulator
                      </h2>
                      <p className="text-sm text-[#44474d] mt-1">
                        Full-length timed examinations featuring strict negative marking, real-time pace analysis, and percentile projection.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-[#ffffff] rounded-3xl p-6 sm:p-7 border border-[#c5c6cd]/60 ambient-shadow flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#000000] bg-[#f5f3f1] px-2.5 py-0.5 rounded">
                              Physics • 50 Questions
                            </span>
                            <span className="text-xs font-semibold text-[#75777e]">60 Mins</span>
                          </div>
                          <h3 className="font-display text-xl font-bold text-[#000000]">
                            Comprehensive Physics Mock Test #4
                          </h3>
                          <p className="text-xs text-[#44474d] mt-2 leading-relaxed">
                            Full coverage: Thermodynamics, Kinematics, Wave Optics, and Electromagnetism.
                          </p>
                        </div>
                        <button
                          onClick={() => handleStartExam('Physics')}
                          className="w-full py-3 bg-[#000000] hover:bg-[#1b1c1b] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                          Start Timed Simulation
                        </button>
                      </div>

                      <div className="bg-[#ffffff] rounded-3xl p-6 sm:p-7 border border-[#ffdbd0] ambient-shadow flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#aa3000] bg-[#ffdbd0]/60 px-2.5 py-0.5 rounded">
                              Mathematics • 40 Questions
                            </span>
                            <span className="text-xs font-semibold text-[#75777e]">45 Mins</span>
                          </div>
                          <h3 className="font-display text-xl font-bold text-[#000000]">
                            Advanced Calculus & Higher Math
                          </h3>
                          <p className="text-xs text-[#44474d] mt-2 leading-relaxed">
                            Differential equations, integration methods, complex roots, and analytic geometry.
                          </p>
                        </div>
                        <button
                          onClick={() => handleStartExam('Mathematics')}
                          className="w-full py-3 bg-[#aa3000] hover:bg-[#8e2800] text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">bolt</span>
                          Start Calculus Mock
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {currentTab === 'progress' && (
                  <ProgressView
                    onStartPractice={() => handleStartPractice('Calculus')}
                    onStartExam={() => handleStartExam('Physics')}
                  />
                )}

                {currentTab === 'mistakes' && (
                  <MistakeBookView
                    mistakes={mockMistakes}
                    onReviewQuestion={(q) => setReviewQuestions([q])}
                    onTryAgain={handleTryAgainQuestion}
                    onOpenCoachWithQuestion={(qTitle) => {
                      setActiveCoachPrompt(`Please explain the concept behind: ${qTitle}`);
                      setCurrentTab('coach');
                    }}
                  />
                )}

                {currentTab === 'coach' && (
                  <AiCoachView
                    onStartTargetedPractice={handleStartPractice}
                    initialQuery={activeCoachPrompt}
                  />
                )}

                {currentTab === 'tutors' && (
                  <TutorsView
                    tutors={mockTutors}
                    onOpenBooking={(tutor) => setSelectedTutorForBooking(tutor)}
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
        tutors={mockTutors}
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
        onConfirmBooking={(details) => {
          triggerToast(`Session booked with ${details.tutor.name}!`);
        }}
      />

      {/* Full-Screen Exam Simulator Focus Mode */}
      {activeExamSession && activeExamSession.isOpen && (
        <ExamSimulator
          examTitle={activeExamSession.title}
          subject={activeExamSession.subject}
          questions={activeExamSession.questions}
          durationMinutes={activeExamSession.durationMinutes}
          onFinishExam={handleFinishExam}
          onExit={() => setActiveExamSession(null)}
        />
      )}
    </div>
  );
}

export default App;
