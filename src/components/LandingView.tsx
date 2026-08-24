import React, { useState } from 'react';
import { Tutor } from '../types';

interface LandingViewProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onExploreSubject: (subject: string) => void;
  onOpenPricing: () => void;
  onOpenRegistration?: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onGetStarted,
  onLogin,
  onExploreSubject,
  onOpenPricing,
  onOpenRegistration,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-body selection:bg-[#E0E7FF] selection:text-[#4338CA]">
      {/* Sticky Top Navigation */}
      <header className="sticky top-0 z-50 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#E2E8F0] px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#4F46E5] to-[#7C3AED] flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <span className="material-symbols-outlined text-[24px]">auto_stories</span>
            </div>
            <div>
              <span className="font-display text-xl font-bold tracking-tight text-[#0F172A]">
                Virtual Tutor
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#475569]">
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-[#4F46E5] transition-colors cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-[#4F46E5] transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('subjects')}
              className="hover:text-[#4F46E5] transition-colors cursor-pointer"
            >
              Subjects
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="hover:text-[#4F46E5] transition-colors cursor-pointer"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="hover:text-[#4F46E5] transition-colors cursor-pointer"
            >
              About
            </button>
          </nav>

          {/* CTA Actions */}
          <div className="hidden sm:flex items-center gap-3">
            {onOpenRegistration && (
              <button
                onClick={onOpenRegistration}
                className="px-4 py-2 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
                <span>Register (Student/Teacher)</span>
              </button>
            )}
            <button
              id="landing-login-btn"
              onClick={onLogin}
              className="px-4 py-2 text-sm font-bold text-[#334155] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-xl transition-all cursor-pointer"
            >
              Log in
            </button>
            <button
              id="landing-get-started-btn"
              onClick={onGetStarted}
              className="px-5 py-2.5 text-sm font-bold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-xl transition-all shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-95 cursor-pointer"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#475569] hover:text-[#0F172A] rounded-lg hover:bg-[#F1F5F9]"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-3 border-t border-[#E2E8F0] mt-3 space-y-2 animate-fadeIn">
            <button
              onClick={() => scrollToSection('features')}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-[#475569] hover:bg-[#F1F5F9] rounded-lg"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-[#475569] hover:bg-[#F1F5F9] rounded-lg"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('subjects')}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-[#475569] hover:bg-[#F1F5F9] rounded-lg"
            >
              Subjects
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-[#475569] hover:bg-[#F1F5F9] rounded-lg"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-[#475569] hover:bg-[#F1F5F9] rounded-lg"
            >
              About
            </button>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={onLogin}
                className="w-full py-2.5 text-center text-sm font-bold text-[#334155] bg-[#F1F5F9] rounded-xl"
              >
                Log in
              </button>
              <button
                onClick={onGetStarted}
                className="w-full py-2.5 text-center text-sm font-bold text-white bg-[#4F46E5] rounded-xl"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-200/40 via-purple-100/30 to-pink-100/20 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headline & CTAs */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF2FF] border border-[#C7D2FE] text-[#4338CA] text-xs font-bold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-[#4F46E5] animate-ping" />
                <span>Next-Gen Adaptive Learning</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F172A] tracking-tight leading-[1.12]">
                Your Personal{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#9333EA]">
                  AI Tutor
                </span>{' '}
                That Understands You.
              </h1>

              <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-xl">
                Adaptive learning that identifies your weak areas, explains every concept clearly, and helps you master any subject with real-time Socratic feedback.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 pt-2">
                <button
                  id="hero-start-learning-free-btn"
                  onClick={onOpenRegistration || onGetStarted}
                  className="w-full sm:w-auto px-7 py-3.5 text-base font-bold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-xl transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Choose Your Pathway</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
                <button
                  id="hero-see-how-it-works-btn"
                  onClick={() => scrollToSection('how-it-works')}
                  className="w-full sm:w-auto px-6 py-3.5 text-base font-bold text-[#334155] hover:text-[#0F172A] bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>See How It Works</span>
                </button>
              </div>

              {/* Pathway Highlights */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div
                  onClick={onOpenRegistration || onGetStarted}
                  className="p-3 bg-white/80 backdrop-blur-sm border border-indigo-100 rounded-xl hover:border-indigo-400 transition-all cursor-pointer shadow-xs"
                >
                  <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block">🎓 For Students</span>
                  <span className="text-xs text-[#475569]">Practice, exams, AI coach & live classes</span>
                </div>
                <div
                  onClick={onOpenRegistration || onGetStarted}
                  className="p-3 bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-xl hover:border-emerald-400 transition-all cursor-pointer shadow-xs"
                >
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">👨‍🏫 For Teachers</span>
                  <span className="text-xs text-[#475569]">Conduct live tuition & manage cohorts</span>
                </div>
              </div>

              {/* Social Proof */}
              <div className="pt-6 border-t border-[#E2E8F0]/80 flex flex-wrap items-center gap-4">
                <div className="flex -space-x-2">
                  <img
                    alt="Student"
                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  />
                  <img
                    alt="Student"
                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  />
                  <img
                    alt="Student"
                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                  />
                  <img
                    alt="Student"
                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
                  />
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-[#4F46E5] text-white text-xs font-bold flex items-center justify-center">
                    +25k
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="material-symbols-outlined text-[18px] symbol-filled">
                        star
                      </span>
                    ))}
                    <span className="text-xs font-bold text-[#0F172A] ml-1">4.9 / 5</span>
                  </div>
                  <p className="text-xs font-medium text-[#64748B]">
                    Trusted by students worldwide
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Floating Interactive Dashboard Preview Card matching Mockup */}
            <div className="lg:col-span-6 relative">
              {/* Main Dashboard Card */}
              <div className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-7 border border-[#E2E8F0] shadow-2xl shadow-slate-900/10 relative transition-transform hover:scale-[1.01] duration-300">
                {/* Window Controls / Title */}
                <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9] mb-5">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#EF4444]/80" />
                    <span className="w-3 h-3 rounded-full bg-[#F59E0B]/80" />
                    <span className="w-3 h-3 rounded-full bg-[#10B981]/80" />
                    <span className="text-xs font-bold text-[#475569] ml-2">Dashboard Preview</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#EEF2FF] text-[#4F46E5] text-[11px] font-bold">
                    Live Telemetry
                  </span>
                </div>

                {/* 4 Mini Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                  <div className="bg-[#F8FAFC] rounded-2xl p-3.5 border border-[#E2E8F0]/80">
                    <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                      Overall Mastery
                    </span>
                    <p className="font-display text-xl font-bold text-[#0F172A] mt-0.5">72%</p>
                    <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                      <span className="material-symbols-outlined text-[12px]">trending_up</span>
                      +6% this week
                    </span>
                  </div>

                  <div className="bg-[#F8FAFC] rounded-2xl p-3.5 border border-[#E2E8F0]/80">
                    <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                      Study Streak
                    </span>
                    <p className="font-display text-xl font-bold text-[#0F172A] mt-0.5">14 <span className="text-xs font-normal text-[#64748B]">days</span></p>
                    <span className="text-[10px] font-semibold text-amber-600 flex items-center gap-0.5 mt-0.5">
                      <span className="material-symbols-outlined text-[12px] symbol-filled">local_fire_department</span>
                      Keep it up!
                    </span>
                  </div>

                  <div className="bg-[#F8FAFC] rounded-2xl p-3.5 border border-[#E2E8F0]/80">
                    <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                      Study Time
                    </span>
                    <p className="font-display text-xl font-bold text-[#0F172A] mt-0.5">18.5 <span className="text-xs font-normal text-[#64748B]">hours</span></p>
                    <span className="text-[10px] font-semibold text-blue-600 flex items-center gap-0.5 mt-0.5">
                      <span className="material-symbols-outlined text-[12px]">schedule</span>
                      This week
                    </span>
                  </div>

                  <div className="bg-[#F8FAFC] rounded-2xl p-3.5 border border-[#E2E8F0]/80">
                    <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                      Today's Goal
                    </span>
                    <p className="font-display text-xl font-bold text-[#0F172A] mt-0.5">3 / 5</p>
                    <span className="text-[10px] font-semibold text-indigo-600 flex items-center gap-0.5 mt-0.5">
                      <span className="material-symbols-outlined text-[12px]">check_circle</span>
                      60% completed
                    </span>
                  </div>
                </div>

                {/* Big Circular Ring & Weak Topic Alert */}
                <div className="bg-gradient-to-br from-[#F8FAFC] to-[#EEF2FF]/40 rounded-2xl p-4 sm:p-5 border border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                  {/* Circular Mastery Ring */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-[#E2E8F0]"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-[#4F46E5]"
                          strokeDasharray="72, 100"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <span className="absolute font-display text-sm font-bold text-[#0F172A]">72%</span>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-[#EF4444] bg-[#FEE2E2] px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Weak Topic Identified
                      </span>
                      <h4 className="font-display text-base font-bold text-[#0F172A] mt-1">
                        Integration by Parts
                      </h4>
                      <p className="text-xs text-[#64748B]">Mastery: 43% • AI drill recommended</p>
                    </div>
                  </div>

                  <button
                    onClick={onGetStarted}
                    className="px-4 py-2 text-xs font-bold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-xl transition-all shadow-sm cursor-pointer whitespace-nowrap"
                  >
                    Start Drill
                  </button>
                </div>

                {/* Progress bars preview */}
                <div className="space-y-2.5">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-[#334155]">Mathematics</span>
                      <span className="text-[#4F46E5]">72%</span>
                    </div>
                    <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                      <div className="h-full bg-[#4F46E5] rounded-full" style={{ width: '72%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-[#334155]">Physics</span>
                      <span className="text-[#10B981]">82%</span>
                    </div>
                    <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                      <div className="h-full bg-[#10B981] rounded-full" style={{ width: '82%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating AI Tutor Dialog / Bubble */}
              <div className="hidden sm:flex absolute -bottom-6 -right-6 bg-[#FFFFFF] rounded-2xl p-4 border border-[#E2E8F0] shadow-xl shadow-indigo-900/10 max-w-xs items-start gap-3 z-20 animate-bounce">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#4F46E5] to-[#7C3AED] flex items-center justify-center text-white shrink-0 shadow-md">
                  <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-[#0F172A]">AI Tutor</p>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-[11px] text-[#475569] leading-snug">
                    "Good evening, Ahmed! 👋 Ready to continue your learning journey?"
                  </p>
                  <button
                    onClick={onGetStarted}
                    className="mt-1 text-[11px] font-bold text-[#4F46E5] hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    Let's continue
                    <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section: Why Students Love Virtual Tutor */}
      <section id="features" className="py-20 bg-[#FFFFFF] border-y border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              Why Students Love Virtual Tutor
            </h2>
            <p className="text-base text-[#475569]">
              Designed to turn exam anxiety into confidence through personalized coaching, targeted practice, and deep diagnostics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-[#E2E8F0] card-shadow-hover flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[26px]">psychology</span>
                </div>
                <h3 className="font-display text-lg font-bold text-[#0F172A]">
                  AI-Powered Learning
                </h3>
                <p className="text-sm text-[#475569] leading-relaxed">
                  Personalized explanations that adapt to your unique learning style, pace, and conceptual background.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-[#E2E8F0] card-shadow-hover flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FEE2E2] text-[#EF4444] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[26px]">tune</span>
                </div>
                <h3 className="font-display text-lg font-bold text-[#0F172A]">
                  Adaptive Practice
                </h3>
                <p className="text-sm text-[#475569] leading-relaxed">
                  Questions adapt dynamically to your mastery level, targeting weak areas and eliminating knowledge gaps.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-[#E2E8F0] card-shadow-hover flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[26px]">insights</span>
                </div>
                <h3 className="font-display text-lg font-bold text-[#0F172A]">
                  Smart Analytics
                </h3>
                <p className="text-sm text-[#475569] leading-relaxed">
                  Detailed insights into your strengths, recurring mistake categories, study pace, and projected exam score.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-[#E2E8F0] card-shadow-hover flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[26px]">support_agent</span>
                </div>
                <h3 className="font-display text-lg font-bold text-[#0F172A]">
                  24/7 AI Support
                </h3>
                <p className="text-sm text-[#475569] leading-relaxed">
                  Get instant help anytime with multiple specialized tutor modes including Socratic, Quick Hint, and Deep Tutor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section: 4 Connected Steps in Dark Container matching Mockup */}
      <section id="how-it-works" className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="bg-[#0F172A] rounded-3xl p-8 sm:p-12 lg:p-16 text-white shadow-2xl relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#4F46E5]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3 relative z-10">
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                See How It Works
              </h2>
              <p className="text-base text-[#94A3B8]">
                A personalized learning journey designed just for you to build unstoppable mastery.
              </p>
            </div>

            {/* 4 Connected Step Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center space-y-4 p-4 rounded-2xl bg-[#1E293B]/60 border border-[#334155]/60 hover:border-[#4F46E5] transition-all">
                <div className="w-14 h-14 rounded-2xl bg-[#4F46E5]/20 text-[#818CF8] flex items-center justify-center border border-[#4F46E5]/40 shadow-inner">
                  <span className="material-symbols-outlined text-[28px]">radar</span>
                </div>
                <div>
                  <span className="text-xs font-bold tracking-widest text-[#818CF8] uppercase">01 Step</span>
                  <h3 className="font-display text-lg font-bold text-white mt-1">Assess</h3>
                </div>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  AI analyzes your current knowledge and identifies exact conceptual bottlenecks.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center space-y-4 p-4 rounded-2xl bg-[#1E293B]/60 border border-[#334155]/60 hover:border-[#4F46E5] transition-all">
                <div className="w-14 h-14 rounded-2xl bg-[#3B82F6]/20 text-[#60A5FA] flex items-center justify-center border border-[#3B82F6]/40 shadow-inner">
                  <span className="material-symbols-outlined text-[28px]">school</span>
                </div>
                <div>
                  <span className="text-xs font-bold tracking-widest text-[#60A5FA] uppercase">02 Step</span>
                  <h3 className="font-display text-lg font-bold text-white mt-1">Learn</h3>
                </div>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Get personalized explanations, Socratic dialogues, and intuitive analogies.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center space-y-4 p-4 rounded-2xl bg-[#1E293B]/60 border border-[#334155]/60 hover:border-[#4F46E5] transition-all">
                <div className="w-14 h-14 rounded-2xl bg-[#EC4899]/20 text-[#F472B6] flex items-center justify-center border border-[#EC4899]/40 shadow-inner">
                  <span className="material-symbols-outlined text-[28px]">edit_note</span>
                </div>
                <div>
                  <span className="text-xs font-bold tracking-widest text-[#F472B6] uppercase">03 Step</span>
                  <h3 className="font-display text-lg font-bold text-white mt-1">Practice</h3>
                </div>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Solve adaptive questions and targeted drills focused directly on weak areas.
                </p>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center text-center space-y-4 p-4 rounded-2xl bg-[#1E293B]/60 border border-[#334155]/60 hover:border-[#4F46E5] transition-all">
                <div className="w-14 h-14 rounded-2xl bg-[#10B981]/20 text-[#34D399] flex items-center justify-center border border-[#10B981]/40 shadow-inner">
                  <span className="material-symbols-outlined text-[28px]">emoji_events</span>
                </div>
                <div>
                  <span className="text-xs font-bold tracking-widest text-[#34D399] uppercase">04 Step</span>
                  <h3 className="font-display text-lg font-bold text-white mt-1">Master</h3>
                </div>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Track retention curves and build true mastery across every subject and exam.
                </p>
              </div>
            </div>

            {/* Bottom Action in How It Works */}
            <div className="mt-12 text-center relative z-10">
              <button
                onClick={onGetStarted}
                className="px-8 py-3.5 text-sm font-bold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-xl transition-all shadow-lg shadow-indigo-500/25 active:scale-95 inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Experience the Learning Loop</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section id="subjects" className="py-20 bg-[#FFFFFF] border-y border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              Master Every Subject
            </h2>
            <p className="text-base text-[#475569]">
              Curated syllabus structures with high-yield questions, real exam simulations, and instant Socratic remediation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { id: 'Mathematics', name: 'Mathematics', icon: 'functions', topics: 'Calculus, Vectors, Algebra', color: 'text-indigo-600 bg-indigo-50 border-indigo-100', mastery: '72%' },
              { id: 'Physics', name: 'Physics', icon: 'bolt', topics: 'Thermodynamics, Waves, Optics', color: 'text-amber-600 bg-amber-50 border-amber-100', mastery: '82%' },
              { id: 'Chemistry', name: 'Chemistry', icon: 'science', topics: 'Organic, Periodic, Kinetics', color: 'text-emerald-600 bg-emerald-50 border-emerald-100', mastery: '64%' },
              { id: 'Biology', name: 'Biology', icon: 'genetics', topics: 'Genetics, Physiology, Ecology', color: 'text-rose-600 bg-rose-50 border-rose-100', mastery: '78%' },
              { id: 'English', name: 'English', icon: 'menu_book', topics: 'Grammar, Reading, Vocabulary', color: 'text-sky-600 bg-sky-50 border-sky-100', mastery: '71%' },
              { id: 'Computer Science', name: 'Computer Science', icon: 'code', topics: 'Algorithms, Data Structures, DB', color: 'text-purple-600 bg-purple-50 border-purple-100', mastery: '85%' },
            ].map((sub) => (
              <div
                key={sub.id}
                onClick={() => onExploreSubject(sub.id)}
                className="bg-[#F8FAFC] rounded-2xl p-6 border border-[#E2E8F0] card-shadow-hover cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${sub.color}`}>
                      <span className="material-symbols-outlined text-[24px]">{sub.icon}</span>
                    </div>
                    <span className="text-xs font-bold text-[#475569] bg-[#FFFFFF] px-2.5 py-1 rounded-full border border-[#E2E8F0]">
                      {sub.mastery} Avg
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#0F172A] group-hover:text-[#4F46E5] transition-colors">
                    {sub.name}
                  </h3>
                  <p className="text-xs text-[#64748B] mt-1">{sub.topics}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs font-bold text-[#4F46E5]">
                  <span>Explore Curriculum</span>
                  <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section: Choose Your Plan matching Mockup */}
      <section id="pricing" className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              Choose Your Plan
            </h2>
            <p className="text-base text-[#475569]">
              Start free and upgrade when you're ready for full exam mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Free Plan */}
            <div className="bg-[#FFFFFF] rounded-3xl p-8 border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
              <div>
                <div className="mb-4">
                  <h3 className="font-display text-2xl font-bold text-[#0F172A]">Free</h3>
                  <p className="text-xs text-[#64748B] mt-1">Perfect for getting started</p>
                </div>

                <div className="mb-6">
                  <span className="font-display text-4xl font-extrabold text-[#0F172A]">$0</span>
                  <span className="text-sm font-medium text-[#64748B]"> / month</span>
                </div>

                <ul className="space-y-3 text-sm text-[#334155] mb-8">
                  <li className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-emerald-500">check</span>
                    <span>Limited AI tutor messages</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-emerald-500">check</span>
                    <span>Basic practice mode</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-emerald-500">check</span>
                    <span>Up to 5 practice tests</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-emerald-500">check</span>
                    <span>Basic progress tracking</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onGetStarted}
                className="w-full py-3 text-sm font-bold text-[#334155] bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-xl transition-all cursor-pointer"
              >
                Get Started
              </button>
            </div>

            {/* Pro Plan (Highlighted) */}
            <div className="bg-[#FFFFFF] rounded-3xl p-8 border-2 border-[#4F46E5] shadow-xl shadow-indigo-500/10 flex flex-col justify-between relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#4F46E5] text-white text-xs font-bold py-1 px-4 rounded-full shadow-sm">
                Most popular for students
              </div>

              <div>
                <div className="mb-4 pt-2">
                  <h3 className="font-display text-2xl font-bold text-[#4F46E5]">Pro</h3>
                  <p className="text-xs text-[#64748B] mt-1">Accelerated mastery for serious candidates</p>
                </div>

                <div className="mb-6">
                  <span className="font-display text-4xl font-extrabold text-[#0F172A]">$9.99</span>
                  <span className="text-sm font-medium text-[#64748B]"> / month</span>
                </div>

                <ul className="space-y-3 text-sm text-[#334155] mb-8">
                  <li className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-[#4F46E5]">check</span>
                    <span className="font-semibold text-[#0F172A]">Unlimited AI tutor messages</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-[#4F46E5]">check</span>
                    <span>Adaptive practice engine</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-[#4F46E5]">check</span>
                    <span>Unlimited practice & mock exams</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-[#4F46E5]">check</span>
                    <span>Detailed mistake analytics</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-[#4F46E5]">check</span>
                    <span>Personalized daily study plan</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-[#4F46E5]">check</span>
                    <span>Priority 24/7 support</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onOpenPricing}
                className="w-full py-3.5 text-sm font-bold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-xl transition-all shadow-md shadow-indigo-500/20 active:scale-95 cursor-pointer"
              >
                Start Pro Trial
              </button>
            </div>

            {/* Teacher Plan */}
            <div className="bg-[#FFFFFF] rounded-3xl p-8 border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
              <div>
                <div className="mb-4">
                  <h3 className="font-display text-2xl font-bold text-[#0F172A]">Teacher</h3>
                  <p className="text-xs text-[#64748B] mt-1">For educators & institutions</p>
                </div>

                <div className="mb-6">
                  <span className="font-display text-4xl font-extrabold text-[#0F172A]">$19.99</span>
                  <span className="text-sm font-medium text-[#64748B]"> / month</span>
                </div>

                <ul className="space-y-3 text-sm text-[#334155] mb-8">
                  <li className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-emerald-500">check</span>
                    <span>All Pro features included</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-emerald-500">check</span>
                    <span>Student progress tracking</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-emerald-500">check</span>
                    <span>Create & assign custom tests</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-emerald-500">check</span>
                    <span>Cohort & class analytics</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-emerald-500">check</span>
                    <span>Teacher tools & exports</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onOpenPricing}
                className="w-full py-3 text-sm font-bold text-[#334155] bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-xl transition-all cursor-pointer"
              >
                Start Teacher Plan
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-[#FFFFFF] border-t border-[#E2E8F0]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-[24px]">auto_stories</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
            The Mission Behind Virtual Tutor
          </h2>
          <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
            We believe high-stakes exam preparation shouldn't rely on rote memorization or anxiety. Virtual Tutor combines cutting-edge cognitive retention models with responsive Socratic AI to make mastery attainable for every student.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F172A] text-white py-12 border-t border-[#1E293B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#4F46E5] to-[#7C3AED] flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[18px]">auto_stories</span>
            </div>
            <span className="font-display font-bold text-lg">Virtual Tutor</span>
          </div>
          <p className="text-xs text-[#94A3B8]">
            © {new Date().getFullYear()} Virtual Tutor. All rights reserved. Adaptive Learning & AI EdTech.
          </p>
          <div className="flex items-center gap-6 text-xs text-[#94A3B8]">
            <button onClick={onGetStarted} className="hover:text-white transition-colors cursor-pointer">
              Launch App
            </button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-white transition-colors cursor-pointer">
              Pricing
            </button>
            <button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors cursor-pointer">
              Features
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
