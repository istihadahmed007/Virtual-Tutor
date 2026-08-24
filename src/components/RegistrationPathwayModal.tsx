import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/api';
import { UserProfile, Role } from '../types';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  ArrowLeft,
  Lock,
  User,
  Mail,
  Phone,
  BookMarked,
  Award,
  Globe,
  Clock,
  Target,
  FileCheck,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

interface RegistrationPathwayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile, token: string, teacherStatus?: string) => void;
  preferredLanguage?: 'en' | 'bn';
}

type Pathway = 'CHOOSE' | 'STUDENT' | 'TEACHER' | 'LOGIN';

const BANGLADESH_SUBJECTS = [
  { id: 'Physics', nameEn: 'Physics', nameBn: 'পদার্থবিজ্ঞান', code: 'PHY' },
  { id: 'Higher Mathematics', nameEn: 'Higher Mathematics', nameBn: 'উচ্চতর গণিত', code: 'MATH' },
  { id: 'Chemistry', nameEn: 'Chemistry', nameBn: 'রসায়ন', code: 'CHEM' },
  { id: 'Biology', nameEn: 'Biology', nameBn: 'জীববিজ্ঞান', code: 'BIO' },
  { id: 'Bangla', nameEn: 'Bangla', nameBn: 'বাংলা', code: 'BNG' },
  { id: 'English', nameEn: 'English', nameBn: 'ইংরেজি', code: 'ENG' },
  { id: 'ICT', nameEn: 'ICT', nameBn: 'তথ্য ও যোগাযোগ প্রযুক্তি', code: 'ICT' },
  { id: 'General Knowledge', nameEn: 'General Knowledge', nameBn: 'সাধারণ জ্ঞান', code: 'GK' },
];

const ACADEMIC_LEVELS = [
  'HSC (Science)',
  'BUET & Engineering Admission',
  'Medical & Dental Admission (MBBS)',
  'Dhaka University (A / KA-Unit)',
  'SSC (Secondary Science)',
  'University Admission (General)',
  'BCS & Competitive Exams',
];

export const RegistrationPathwayModal: React.FC<RegistrationPathwayModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  preferredLanguage = 'en',
}) => {
  const [pathway, setPathway] = useState<Pathway>('CHOOSE');
  const [step, setStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [educationBoards, setEducationBoards] = useState<string[]>([]);

  // Student Form State
  const [studentFullName, setStudentFullName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [studentConfirmPassword, setStudentConfirmPassword] = useState('');
  const [studentAcademicLevel, setStudentAcademicLevel] = useState('HSC (Science)');
  const [studentEducationBoard, setStudentEducationBoard] = useState('Dhaka Board');
  const [studentTargetExam, setStudentTargetExam] = useState('BUET Engineering & Medical Admission');
  const [studentSelectedSubjects, setStudentSelectedSubjects] = useState<string[]>([
    'Physics',
    'Higher Mathematics',
    'Chemistry',
  ]);
  const [studentLanguage, setStudentLanguage] = useState<'en' | 'bn'>('bn');
  const [studentStudyGoal, setStudentStudyGoal] = useState('Rank in Top 200 in Engineering Admission');
  const [studentDailyHours, setStudentDailyHours] = useState(4.0);

  // Teacher Form State
  const [teacherFullName, setTeacherFullName] = useState('');
  const [teacherEmail, setTeacherEmail] = useState('');
  const [teacherPhone, setTeacherPhone] = useState('');
  const [teacherPassword, setTeacherPassword] = useState('');
  const [teacherConfirmPassword, setTeacherConfirmPassword] = useState('');
  const [teacherQualifications, setTeacherQualifications] = useState('');
  const [teacherExperience, setTeacherExperience] = useState('');
  const [teacherSelectedSubjects, setTeacherSelectedSubjects] = useState<string[]>(['Higher Mathematics', 'Physics']);
  const [teacherSelectedLevels, setTeacherSelectedLevels] = useState<string[]>([
    'HSC (Science)',
    'BUET & Engineering Admission',
  ]);
  const [teacherBio, setTeacherBio] = useState('');
  const [teacherLanguage, setTeacherLanguage] = useState<'en' | 'bn'>('bn');
  const [teacherHourlyRate, setTeacherHourlyRate] = useState(1200);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');

  // Fetch education boards from database on mount
  useEffect(() => {
    if (isOpen) {
      apiClient.getEducationBoards().then((boards) => {
        setEducationBoards(boards);
        if (boards.length > 0 && !studentEducationBoard) {
          setStudentEducationBoard(boards[0]);
        }
      });
      setErrorMsg(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const resetForms = () => {
    setPathway('CHOOSE');
    setStep(1);
    setErrorMsg(null);
  };

  const handleToggleSubject = (subjectId: string, isTeacher: boolean) => {
    if (isTeacher) {
      setTeacherSelectedSubjects((prev) =>
        prev.includes(subjectId) ? prev.filter((s) => s !== subjectId) : [...prev, subjectId]
      );
    } else {
      setStudentSelectedSubjects((prev) =>
        prev.includes(subjectId) ? prev.filter((s) => s !== subjectId) : [...prev, subjectId]
      );
    }
  };

  const handleToggleAcademicLevel = (lvl: string) => {
    setTeacherSelectedLevels((prev) =>
      prev.includes(lvl) ? prev.filter((l) => l !== lvl) : [...prev, lvl]
    );
  };

  // Submit Student Registration
  const handleSubmitStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (studentPassword !== studentConfirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }
    if (studentSelectedSubjects.length === 0) {
      setErrorMsg('Please select at least one study subject.');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        fullName: studentFullName,
        email: studentEmail,
        phone: studentPhone || '+8801700000000',
        password: studentPassword,
        profile: {
          academicLevel: studentAcademicLevel,
          educationBoard: studentEducationBoard,
          subjects: studentSelectedSubjects,
          targetExam: studentTargetExam,
          preferredLanguage: studentLanguage,
          studyGoal: studentStudyGoal,
          dailyStudyHours: Number(studentDailyHours),
        },
      };

      const result = await apiClient.registerStudent(payload);
      onSuccess(result.user, result.token);
      onClose();
      resetForms();
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Teacher Registration
  const handleSubmitTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (teacherPassword !== teacherConfirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }
    if (teacherSelectedSubjects.length === 0) {
      setErrorMsg('Please select at least one subject you teach.');
      return;
    }
    if (teacherSelectedLevels.length === 0) {
      setErrorMsg('Please select at least one academic level.');
      return;
    }
    if (!teacherQualifications.trim()) {
      setErrorMsg('Please enter your academic qualifications.');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        fullName: teacherFullName,
        email: teacherEmail,
        phone: teacherPhone || '+8801700000000',
        password: teacherPassword,
        profile: {
          qualifications: teacherQualifications,
          experience: teacherExperience,
          subjects: teacherSelectedSubjects,
          academicLevels: teacherSelectedLevels,
          bio: teacherBio || 'Dedicated educator passionate about exam excellence.',
          preferredLanguage: teacherLanguage,
          hourlyRateBDT: Number(teacherHourlyRate) || 1000,
        },
      };

      const result = await apiClient.registerTeacher(payload);
      onSuccess(result.user, result.token, 'PENDING');
      onClose();
      resetForms();
    } catch (err: any) {
      setErrorMsg(err.message || 'Teacher registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Account Login
  const handleQuickLogin = async (email: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const result = await apiClient.loginUser(email);
      onSuccess(result.user, result.token, result.teacherStatus);
      onClose();
      resetForms();
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8 transition-all">
        {/* Header Bar */}
        <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              VT
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">
                {pathway === 'CHOOSE' && 'Get Started with Virtual Tutor'}
                {pathway === 'STUDENT' && 'Student Registration & Learning Profile'}
                {pathway === 'TEACHER' && 'Teacher & Faculty Registration'}
                {pathway === 'LOGIN' && 'Sign in to Virtual Tutor'}
              </h2>
              <p className="text-xs text-[#64748B]">
                {pathway === 'CHOOSE' && 'Choose your pathway to personalize your experience'}
                {pathway === 'STUDENT' && `Step ${step} of 2: Setup your exam goals & syllabus`}
                {pathway === 'TEACHER' && `Step ${step} of 2: Profile credentials for verification`}
                {pathway === 'LOGIN' && 'Access your personalized learning or teaching workspace'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              onClose();
              resetForms();
            }}
            className="w-8 h-8 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0]/60 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">{errorMsg}</div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6">
          {/* ======================================================== */}
          {/* 1. PATHWAY CHOICE SCREEN */}
          {/* ======================================================== */}
          {pathway === 'CHOOSE' && (
            <div className="space-y-6">
              <div className="text-center space-y-1">
                <h3 className="text-xl font-bold text-[#0F172A]">How do you want to use Virtual Tutor?</h3>
                <p className="text-sm text-[#64748B]">
                  Select your role to configure your curriculum, tools, and personalized dashboard.
                </p>
              </div>

              {/* Two Pathway Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                {/* Student Pathway Card */}
                <div className="group border-2 border-[#E2E8F0] hover:border-amber-500 rounded-2xl p-6 bg-[#FFFFFF] hover:bg-amber-50/20 transition-all flex flex-col justify-between shadow-sm hover:shadow-md">
                  <div className="space-y-4">
                    <div className="w-13 h-13 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                      <GraduationCap className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                        Student
                        <span className="text-[10px] font-semibold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                          Learner
                        </span>
                      </h4>
                      <p className="text-sm text-[#475569] mt-2 leading-relaxed">
                        Learn, practice, prepare for exams, and join live online classes.
                      </p>
                    </div>

                    <ul className="space-y-2 text-xs text-[#64748B] pt-1">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Adaptive question engine & simulations</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>AI Socratic tutor & mistake notebook</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Live interactive tuition sessions</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={() => {
                        setPathway('STUDENT');
                        setStep(1);
                        setErrorMsg(null);
                      }}
                      className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
                    >
                      <span>Register as Student</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Teacher Pathway Card */}
                <div className="group border-2 border-[#E2E8F0] hover:border-indigo-600 rounded-2xl p-6 bg-[#FFFFFF] hover:bg-indigo-50/20 transition-all flex flex-col justify-between shadow-sm hover:shadow-md">
                  <div className="space-y-4">
                    <div className="w-13 h-13 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                      <BookOpen className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                        Teacher
                        <span className="text-[10px] font-semibold uppercase tracking-wider bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                          Faculty
                        </span>
                      </h4>
                      <p className="text-sm text-[#475569] mt-2 leading-relaxed">
                        Teach students, create classes, and provide live online tuition.
                      </p>
                    </div>

                    <ul className="space-y-2 text-xs text-[#64748B] pt-1">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>Host interactive live tuition classrooms</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>Track student cohort progress & mastery</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>Author exam sets & practice problems</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={() => {
                        setPathway('TEACHER');
                        setStep(1);
                        setErrorMsg(null);
                      }}
                      className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
                    >
                      <span>Register as Teacher</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Login Alternative */}
              <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
                <span>Already have a Virtual Tutor account?</span>
                <button
                  onClick={() => setPathway('LOGIN')}
                  className="font-semibold text-amber-700 hover:text-amber-800 hover:underline flex items-center gap-1"
                >
                  <span>Log in to your account</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 2. STUDENT REGISTRATION FLOW */}
          {/* ======================================================== */}
          {pathway === 'STUDENT' && (
            <form onSubmit={handleSubmitStudent} className="space-y-5">
              {/* Step Navigation Breadcrumb */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => (step === 1 ? setPathway('CHOOSE') : setStep(1))}
                  className="text-xs text-[#64748B] hover:text-[#0F172A] flex items-center gap-1 font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{step === 1 ? 'Change Pathway' : 'Back to Account Details'}</span>
                </button>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center ${
                      step === 1 ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white'
                    }`}
                  >
                    1
                  </span>
                  <span className="w-4 h-[2px] bg-[#E2E8F0]" />
                  <span
                    className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center ${
                      step === 2 ? 'bg-amber-600 text-white' : 'bg-[#E2E8F0] text-[#64748B]'
                    }`}
                  >
                    2
                  </span>
                </div>
              </div>

              {/* Step 1: Account Credentials */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#334155] mb-1">Full Name</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                        <input
                          type="text"
                          required
                          value={studentFullName}
                          onChange={(e) => setStudentFullName(e.target.value)}
                          placeholder="e.g. Tanvir Ahmed"
                          className="w-full pl-9 pr-3 py-2 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#334155] mb-1">Email Address</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                        <input
                          type="email"
                          required
                          value={studentEmail}
                          onChange={(e) => setStudentEmail(e.target.value)}
                          placeholder="tanvir@example.com"
                          className="w-full pl-9 pr-3 py-2 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1">Phone Number (Bangladesh)</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        required
                        value={studentPhone}
                        onChange={(e) => setStudentPhone(e.target.value)}
                        placeholder="+880 1711-223344"
                        className="w-full pl-9 pr-3 py-2 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#334155] mb-1">Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                        <input
                          type="password"
                          required
                          value={studentPassword}
                          onChange={(e) => setStudentPassword(e.target.value)}
                          placeholder="At least 6 characters"
                          className="w-full pl-9 pr-3 py-2 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#334155] mb-1">Confirm Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                        <input
                          type="password"
                          required
                          value={studentConfirmPassword}
                          onChange={(e) => setStudentConfirmPassword(e.target.value)}
                          placeholder="Re-enter password"
                          className="w-full pl-9 pr-3 py-2 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (!studentFullName || !studentEmail || !studentPassword) {
                          setErrorMsg('Please fill in all required fields.');
                          return;
                        }
                        if (studentPassword !== studentConfirmPassword) {
                          setErrorMsg('Passwords do not match.');
                          return;
                        }
                        setErrorMsg(null);
                        setStep(2);
                      }}
                      className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
                    >
                      <span>Continue to Profile & Goals</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Learning Profile Setup */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#334155] mb-1">Academic Level</label>
                      <select
                        value={studentAcademicLevel}
                        onChange={(e) => setStudentAcademicLevel(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
                      >
                        {ACADEMIC_LEVELS.map((lvl) => (
                          <option key={lvl} value={lvl}>
                            {lvl}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#334155] mb-1">Education Board</label>
                      <select
                        value={studentEducationBoard}
                        onChange={(e) => setStudentEducationBoard(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
                      >
                        {educationBoards.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                      Select Study Subjects (Multi-select)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {BANGLADESH_SUBJECTS.map((sub) => {
                        const isSelected = studentSelectedSubjects.includes(sub.nameEn);
                        return (
                          <button
                            type="button"
                            key={sub.id}
                            onClick={() => handleToggleSubject(sub.nameEn, false)}
                            className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                              isSelected
                                ? 'bg-amber-50 border-amber-500 text-amber-900 font-semibold'
                                : 'bg-[#FFFFFF] border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC]'
                            }`}
                          >
                            <div className="font-semibold">{sub.nameEn}</div>
                            <div className="text-[10px] text-[#64748B]">{sub.nameBn}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#334155] mb-1">Target Exam & Ambition</label>
                      <input
                        type="text"
                        value={studentTargetExam}
                        onChange={(e) => setStudentTargetExam(e.target.value)}
                        placeholder="e.g. BUET Engineering Admission"
                        className="w-full px-3 py-2 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#334155] mb-1">Daily Study Target</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="1"
                          max="10"
                          step="0.5"
                          value={studentDailyHours}
                          onChange={(e) => setStudentDailyHours(Number(e.target.value))}
                          className="flex-1 accent-amber-600"
                        />
                        <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-lg">
                          {studentDailyHours} hrs/day
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1">Preferred Language</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-xs text-[#334155] cursor-pointer">
                        <input
                          type="radio"
                          name="studentLang"
                          checked={studentLanguage === 'bn'}
                          onChange={() => setStudentLanguage('bn')}
                          className="accent-amber-600"
                        />
                        <span>বাংলা (Bangla - Bilingual with formulas)</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs text-[#334155] cursor-pointer">
                        <input
                          type="radio"
                          name="studentLang"
                          checked={studentLanguage === 'en'}
                          onChange={() => setStudentLanguage('en')}
                          className="accent-amber-600"
                        />
                        <span>English</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Complete Student Registration & Launch Dashboard</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}

          {/* ======================================================== */}
          {/* 3. TEACHER REGISTRATION FLOW */}
          {/* ======================================================== */}
          {pathway === 'TEACHER' && (
            <form onSubmit={handleSubmitTeacher} className="space-y-5">
              {/* Step Navigation Breadcrumb */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => (step === 1 ? setPathway('CHOOSE') : setStep(1))}
                  className="text-xs text-[#64748B] hover:text-[#0F172A] flex items-center gap-1 font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{step === 1 ? 'Change Pathway' : 'Back to Account Details'}</span>
                </button>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center ${
                      step === 1 ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'
                    }`}
                  >
                    1
                  </span>
                  <span className="w-4 h-[2px] bg-[#E2E8F0]" />
                  <span
                    className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center ${
                      step === 2 ? 'bg-indigo-600 text-white' : 'bg-[#E2E8F0] text-[#64748B]'
                    }`}
                  >
                    2
                  </span>
                </div>
              </div>

              {/* Step 1: Account Credentials */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#334155] mb-1">Full Name & Title</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                        <input
                          type="text"
                          required
                          value={teacherFullName}
                          onChange={(e) => setTeacherFullName(e.target.value)}
                          placeholder="e.g. Dr. Tariq Rahman"
                          className="w-full pl-9 pr-3 py-2 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#334155] mb-1">Institutional Email</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                        <input
                          type="email"
                          required
                          value={teacherEmail}
                          onChange={(e) => setTeacherEmail(e.target.value)}
                          placeholder="tariq@buet.ac.bd"
                          className="w-full pl-9 pr-3 py-2 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1">Phone Number (For verification SMS)</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        required
                        value={teacherPhone}
                        onChange={(e) => setTeacherPhone(e.target.value)}
                        placeholder="+880 1911-223344"
                        className="w-full pl-9 pr-3 py-2 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#334155] mb-1">Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                        <input
                          type="password"
                          required
                          value={teacherPassword}
                          onChange={(e) => setTeacherPassword(e.target.value)}
                          placeholder="At least 6 characters"
                          className="w-full pl-9 pr-3 py-2 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#334155] mb-1">Confirm Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
                        <input
                          type="password"
                          required
                          value={teacherConfirmPassword}
                          onChange={(e) => setTeacherConfirmPassword(e.target.value)}
                          placeholder="Re-enter password"
                          className="w-full pl-9 pr-3 py-2 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (!teacherFullName || !teacherEmail || !teacherPassword) {
                          setErrorMsg('Please fill in all required fields.');
                          return;
                        }
                        if (teacherPassword !== teacherConfirmPassword) {
                          setErrorMsg('Passwords do not match.');
                          return;
                        }
                        setErrorMsg(null);
                        setStep(2);
                      }}
                      className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
                    >
                      <span>Continue to Teaching Credentials</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Teaching Profile Setup */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1">
                      Highest Qualifications & Institutional Background
                    </label>
                    <input
                      type="text"
                      required
                      value={teacherQualifications}
                      onChange={(e) => setTeacherQualifications(e.target.value)}
                      placeholder="e.g. M.Sc. in Physics (BUET), Ex-Faculty Notre Dame College"
                      className="w-full px-3 py-2 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1">
                      Teaching Experience & Track Record
                    </label>
                    <input
                      type="text"
                      required
                      value={teacherExperience}
                      onChange={(e) => setTeacherExperience(e.target.value)}
                      placeholder="e.g. 8+ Years Coaching BUET & Medical Aspirants"
                      className="w-full px-3 py-2 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                      Teaching Subjects (Multi-select)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {BANGLADESH_SUBJECTS.map((sub) => {
                        const isSelected = teacherSelectedSubjects.includes(sub.nameEn);
                        return (
                          <button
                            type="button"
                            key={sub.id}
                            onClick={() => handleToggleSubject(sub.nameEn, true)}
                            className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                              isSelected
                                ? 'bg-indigo-50 border-indigo-600 text-indigo-900 font-semibold'
                                : 'bg-[#FFFFFF] border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC]'
                            }`}
                          >
                            <div className="font-semibold">{sub.nameEn}</div>
                            <div className="text-[10px] text-[#64748B]">{sub.nameBn}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                      Academic Levels Taught
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {ACADEMIC_LEVELS.slice(0, 5).map((lvl) => {
                        const isSelected = teacherSelectedLevels.includes(lvl);
                        return (
                          <button
                            type="button"
                            key={lvl}
                            onClick={() => handleToggleAcademicLevel(lvl)}
                            className={`px-3 py-1.5 rounded-lg border text-xs transition-all ${
                              isSelected
                                ? 'bg-indigo-600 border-indigo-600 text-white font-medium'
                                : 'bg-[#FFFFFF] border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC]'
                            }`}
                          >
                            {lvl}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#334155] mb-1">
                        Hourly Tuition Rate (BDT)
                      </label>
                      <input
                        type="number"
                        min="200"
                        step="100"
                        value={teacherHourlyRate}
                        onChange={(e) => setTeacherHourlyRate(Number(e.target.value))}
                        className="w-full px-3 py-2 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#334155] mb-1">
                        Short Bio / Teaching Philosophy
                      </label>
                      <input
                        type="text"
                        value={teacherBio}
                        onChange={(e) => setTeacherBio(e.target.value)}
                        placeholder="e.g. Focus on first-principles derivation..."
                        className="w-full px-3 py-2 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Submit Teacher Application for Verification</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}

          {/* ======================================================== */}
          {/* 4. LOGIN / QUICK DEMO ACCOUNTS SCREEN */}
          {/* ======================================================== */}
          {pathway === 'LOGIN' && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-bold text-[#0F172A]">Sign in with Existing Account</h3>
                <p className="text-xs text-[#64748B]">
                  Enter your email or select a pre-configured demo account below:
                </p>
              </div>

              {/* Quick Preset Accounts */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#475569]">Demo Accounts (1-Click Instant Sign In):</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('student@virtualtutor.bd')}
                    className="p-3 border border-[#E2E8F0] hover:border-amber-500 hover:bg-amber-50/30 rounded-xl text-left transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-xs text-[#0F172A]">Tanvir Ahmed</div>
                      <div className="text-[11px] text-[#64748B]">Student • BUET Aspirant</div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                      Student
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('dr.tariq@buet.ac.bd')}
                    className="p-3 border border-[#E2E8F0] hover:border-indigo-500 hover:bg-indigo-50/30 rounded-xl text-left transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-xs text-[#0F172A]">Dr. Tariq Rahman</div>
                      <div className="text-[11px] text-[#64748B]">Approved Faculty • BUET</div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                      Teacher (Active)
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('rafiqul@dhakacity.edu.bd')}
                    className="p-3 border border-amber-200 bg-amber-50/40 hover:border-amber-500 rounded-xl text-left transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-xs text-[#0F172A]">Prof. Rafiqul Islam</div>
                      <div className="text-[11px] text-[#64748B]">Pending Verification</div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-200 text-amber-900 rounded-full">
                      Teacher (Pending)
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('admin@virtualtutor.bd')}
                    className="p-3 border border-[#E2E8F0] hover:border-purple-500 hover:bg-purple-50/30 rounded-xl text-left transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-xs text-[#0F172A]">Nusrat Jahan</div>
                      <div className="text-[11px] text-[#64748B]">Academic Director</div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full">
                      Admin
                    </span>
                  </button>
                </div>
              </div>

              {/* Email Form */}
              <div className="pt-2 border-t border-[#E2E8F0] space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">Or enter account email</label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="name@virtualtutor.bd"
                    className="w-full px-3 py-2 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <button
                  type="button"
                  disabled={isLoading || !loginEmail}
                  onClick={() => handleQuickLogin(loginEmail)}
                  className="w-full py-2.5 px-4 bg-[#0F172A] hover:bg-[#1E293B] disabled:opacity-50 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>
              </div>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setPathway('CHOOSE')}
                  className="text-xs text-amber-700 hover:text-amber-800 hover:underline font-semibold"
                >
                  Need an account? Choose a registration pathway
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
