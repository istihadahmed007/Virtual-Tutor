import {
  Question,
  SafeQuestion,
  MistakeItem,
  Tutor,
  TutorBooking,
  SubjectMastery,
  TopicMastery,
  DailyStudyPlan,
  StructuredAIResponse,
  UserProfile,
  AvailableUser,
  SubjectItem,
  ExamResult,
  AdminContentStats,
  AuditLogItem,
  LiveClass,
} from '../types';

export const apiClient = {
  // 1. Auth & Session Switcher
  async getAuthMe(): Promise<{ user: UserProfile; availableUsers: AvailableUser[] }> {
    try {
      const res = await fetch('/api/auth/me');
      if (!res.ok) throw new Error('Failed to fetch auth');
      return await res.json();
    } catch {
      return {
        user: {
          id: 'usr_student_1',
          name: 'Tanvir Ahmed',
          email: 'student@virtualtutor.bd',
          role: 'STUDENT',
          subscription: 'PRO',
          targetExam: 'BUET Engineering & Medical Admission',
          targetBatch: 'HSC 2024 Batch',
          examCountdownDays: 14,
          targetScore: 92,
          preferredLanguage: 'bn',
          dailyGoalHours: 4.5,
          currentStreakDays: 14,
          highestStreakDays: 21,
          institution: 'Notre Dame College, Dhaka',
        },
        availableUsers: [
          { id: 'usr_student_1', name: 'Tanvir Ahmed', role: 'STUDENT', email: 'student@virtualtutor.bd' },
          { id: 'usr_student_2', name: 'Sakib Hossain', role: 'STUDENT', email: 'sakib@virtualtutor.bd' },
          { id: 'usr_teacher_1', name: 'Dr. Tariq Rahman', role: 'TEACHER', email: 'dr.tariq@buet.ac.bd', teacherStatus: 'APPROVED' },
          { id: 'usr_teacher_pending', name: 'Prof. Rafiqul Islam', role: 'TEACHER', email: 'rafiqul@dhakacity.edu.bd', teacherStatus: 'PENDING' },
          { id: 'usr_admin_1', name: 'Nusrat Jahan (Admin)', role: 'ADMIN', email: 'admin@virtualtutor.bd' },
        ],
      };
    }
  },

  async getEducationBoards(): Promise<string[]> {
    try {
      const res = await fetch('/api/auth/education-boards');
      if (!res.ok) throw new Error('Failed to fetch boards');
      const data = await res.json();
      return data.boards;
    } catch {
      return [
        'Dhaka Board',
        'Chittagong Board',
        'Rajshahi Board',
        'Dinajpur Board',
        'Comilla Board',
        'Sylhet Board',
        'Barisal Board',
        'Jessore Board',
        'Mymensingh Board',
        'Madrasah Education Board',
        'Bangladesh Technical Education Board',
        'Cambridge / Edexcel International',
      ];
    }
  },

  async registerStudent(data: any): Promise<{ success: boolean; user: UserProfile; token: string; message?: string }> {
    const res = await fetch('/api/auth/register/student', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || (json.details ? json.details.join(', ') : 'Student registration failed'));
    }
    return json;
  },

  async registerTeacher(data: any): Promise<{ success: boolean; user: UserProfile; token: string; teacherStatus: string; message?: string }> {
    const res = await fetch('/api/auth/register/teacher', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || (json.details ? json.details.join(', ') : 'Teacher registration failed'));
    }
    return json;
  },

  async loginUser(email: string): Promise<{ success: boolean; user: UserProfile; token: string; role: string; teacherStatus?: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || 'Login failed');
    }
    return json;
  },

  async switchUser(userId: string, role?: string): Promise<{ success: boolean; user: UserProfile }> {
    try {
      const res = await fetch('/api/auth/switch-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role }),
      });
      if (!res.ok) throw new Error('Failed to switch user');
      return await res.json();
    } catch (err: any) {
      console.warn('Switch user fallback:', err);
      return { success: true, user: null as any };
    }
  },

  // 2. User & Profile
  async getUserProfile(): Promise<UserProfile> {
    try {
      const res = await fetch('/api/user/profile');
      if (!res.ok) throw new Error('Failed to fetch profile');
      const data = await res.json();
      return data.user;
    } catch {
      return {
        id: 'usr_student_1',
        name: 'Tanvir Ahmed',
        email: 'student@virtualtutor.bd',
        role: 'STUDENT',
        subscription: 'PRO',
        targetExam: 'BUET Engineering & Medical Admission',
        targetBatch: 'HSC 2024 Batch',
        examCountdownDays: 14,
        targetScore: 92,
        preferredLanguage: 'bn',
        dailyGoalHours: 4.5,
        currentStreakDays: 14,
        highestStreakDays: 21,
        institution: 'Notre Dame College, Dhaka',
      };
    }
  },

  async updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      return data.user;
    } catch {
      return updates as UserProfile;
    }
  },

  // 3. Bangladesh Curriculum & Subjects
  async getSubjects(): Promise<SubjectItem[]> {
    try {
      const res = await fetch('/api/curriculum/subjects');
      if (!res.ok) throw new Error('Failed to fetch subjects');
      const data = await res.json();
      return data.subjects;
    } catch {
      return [];
    }
  },

  async getSubjectStructure(subjectId: string) {
    try {
      const res = await fetch(`/api/curriculum/subjects/${subjectId}/structure`);
      if (!res.ok) throw new Error('Failed to fetch subject structure');
      return await res.json();
    } catch {
      return null;
    }
  },

  // 4. Mastery Engine Overview
  async getMasteryOverview(): Promise<{
    overallScore: number;
    weakestTopics: TopicMastery[];
    strongestTopics: TopicMastery[];
    subjectMasteries: SubjectMastery[];
    criticalAlert?: TopicMastery | null;
  }> {
    try {
      const res = await fetch('/api/mastery/overview');
      if (!res.ok) throw new Error('Failed to fetch mastery');
      return await res.json();
    } catch {
      return {
        overallScore: 74,
        weakestTopics: [],
        strongestTopics: [],
        subjectMasteries: [],
      };
    }
  },

  // 5. Adaptive Question Engine
  async getAdaptiveQuestion(subject?: string, topic?: string): Promise<SafeQuestion> {
    try {
      const params = new URLSearchParams();
      if (subject) params.append('subject', subject);
      if (topic) params.append('topic', topic);
      const res = await fetch(`/api/practice/adaptive-question?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to get adaptive question');
      const data = await res.json();
      return data.question;
    } catch {
      return {
        id: 14,
        subjectId: 'sub_math',
        subjectName: 'Higher Mathematics',
        chapterName: 'Calculus & Integration',
        topicName: 'Integration by Parts & Partial Fractions',
        difficulty: 'Hard',
        titleEn: 'Rational Polynomial Partial Fraction Integration',
        titleBn: 'আংশিক ভগ্নাংশে মূলদ বহুপদী সমাকলন',
        questionTextEn: 'Evaluate the indefinite integral:',
        questionTextBn: 'অনির্দিষ্ট যোগজটির মান নির্ণয় করো:',
        formula: '∫ (3x² + 2x + 1) / (x³ + x² + x + 1) dx',
        options: [
          { id: 'A', textEn: 'ln|x³ + x² + x + 1| + C', textBn: 'ln|x³ + x² + x + 1| + C' },
          { id: 'B', textEn: '(3x² + 2x + 1) ln|x| + C', textBn: '(3x² + 2x + 1) ln|x| + C' },
          { id: 'C', textEn: 'ln|x + 1| + ln(x² + 1) + C', textBn: 'ln|x + 1| + ln(x² + 1) + C' },
          { id: 'D', textEn: 'arctan(x) + ln|x + 1| + C', textBn: 'arctan(x) + ln|x + 1| + C' },
        ],
        curriculum: 'HSC',
        board: 'Dhaka Board',
        admissionCategory: 'BUET / Engineering',
      };
    }
  },

  async getAdaptiveSession(count: number = 5, subject?: string, topic?: string): Promise<SafeQuestion[]> {
    try {
      const params = new URLSearchParams();
      params.append('count', String(count));
      if (subject) params.append('subject', subject);
      if (topic) params.append('topic', topic);
      const res = await fetch(`/api/practice/session?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to get adaptive session');
      const data = await res.json();
      return data.questions;
    } catch {
      return [await this.getAdaptiveQuestion(subject, topic)];
    }
  },

  async getAdaptiveQuestions(count: number = 5, subject?: string, topic?: string): Promise<SafeQuestion[]> {
    return this.getAdaptiveSession(count, subject, topic);
  },

  async recordAttempt(
    questionId: number,
    selectedOption: 'A' | 'B' | 'C' | 'D' | null,
    timeSpentSeconds: number = 30
  ): Promise<{
    success: boolean;
    isCorrect: boolean;
    correctOptionId: 'A' | 'B' | 'C' | 'D';
    explanation: any;
    updatedMastery?: TopicMastery;
  }> {
    try {
      const res = await fetch('/api/practice/record-attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, selectedOption, timeSpentSeconds }),
      });
      return await res.json();
    } catch {
      return {
        success: true,
        isCorrect: selectedOption === 'C',
        correctOptionId: 'C',
        explanation: {
          overviewEn: 'Decomposition gives 1/(x+1) + 2x/(x²+1).',
          overviewBn: 'আংশিক ভগ্নাংশে ভাগ করলে 1/(x+1) + 2x/(x²+1) পাওয়া যায়।',
          stepByStepEn: ['1. Factor denominator', '2. Partial fractions', '3. Integrate terms'],
          stepByStepBn: ['১. হরকে উৎপাদকে বিশ্লেষণ করুন', '২. আংশিক ভগ্নাংশে রূপান্তর', '৩. সমাকলন সম্পাদন'],
          simpleExplanationEn: 'Integrate each part separately.',
          simpleExplanationBn: 'প্রতিটি পদ আলাদাভাবে সমাকলন করুন।',
          keyTakeawayEn: 'Factor first before integrating.',
          keyTakeawayBn: 'সমাকলনের পূর্বে উৎপাদকে বিশ্লেষণ করুন।',
        },
      };
    }
  },

  // 6. Exam Simulation Engine (Strict Zero-Leak API)
  async getExams() {
    try {
      const res = await fetch('/api/exams');
      if (!res.ok) throw new Error('Failed to fetch exams');
      return await res.json();
    } catch {
      return { exams: [] };
    }
  },

  async startExam(examId: string): Promise<{
    success: boolean;
    attemptId: string;
    exam: {
      id: string;
      titleEn: string;
      titleBn: string;
      subjectName: string;
      durationMinutes: number;
      totalQuestions: number;
      targetCategory: string;
    };
    questions: SafeQuestion[];
  }> {
    try {
      const res = await fetch(`/api/exams/${examId}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to start exam');
      return await res.json();
    } catch (err) {
      throw err;
    }
  },

  async submitExam(
    attemptId: string,
    timeSpentSeconds: number,
    answers: { questionId: number; selectedOption: 'A' | 'B' | 'C' | 'D' | null; timeSpentSeconds: number }[]
  ): Promise<{
    success: boolean;
    attempt: any;
    detailedResults: any[];
    message: string;
  }> {
    const res = await fetch(`/api/attempts/${attemptId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attemptId, timeSpentSeconds, answers }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to submit exam');
    }
    return await res.json();
  },

  async getAttempt(attemptId: string) {
    const res = await fetch(`/api/attempts/${attemptId}`);
    if (!res.ok) throw new Error('Failed to get attempt');
    return await res.json();
  },

  async getMyAttempts() {
    try {
      const res = await fetch('/api/me/attempts');
      if (!res.ok) throw new Error('Failed to fetch attempts');
      return await res.json();
    } catch {
      return { attempts: [] };
    }
  },

  // 7. Mistake Intelligence
  async getMistakes(): Promise<MistakeItem[]> {
    try {
      const res = await fetch('/api/mistakes');
      if (!res.ok) throw new Error('Failed to get mistakes');
      const data = await res.json();
      return data.mistakes.map((m: any) => ({
        ...m,
        subject: m.subject || m.question?.subjectName || 'STEM',
        topic: m.topic || m.question?.topicName || 'General',
        title: m.title || m.question?.titleEn || m.question?.titleBn || 'Question',
      }));
    } catch {
      return [];
    }
  },

  async getMistakeAnalytics(): Promise<{
    totalUnresolved: number;
    totalMistakes: number;
    categoryBreakdown: { category: string; count: number; percentage: number }[];
    topMistakeType: { category: string; count: number };
  }> {
    try {
      const res = await fetch('/api/mistakes/analytics');
      if (!res.ok) throw new Error('Failed to get mistake analytics');
      return await res.json();
    } catch {
      return {
        totalUnresolved: 3,
        totalMistakes: 3,
        categoryBreakdown: [
          { category: 'Conceptual Error', count: 14, percentage: 55 },
          { category: 'Calculation Error', count: 7, percentage: 30 },
          { category: 'Formula Error', count: 4, percentage: 15 },
        ],
        topMistakeType: { category: 'Conceptual Error', count: 14 },
      };
    }
  },

  async resolveMistake(questionId: number) {
    try {
      const res = await fetch('/api/mistakes/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId }),
      });
      return await res.json();
    } catch {
      return { success: true };
    }
  },

  // 8. Daily Study Plan Engine
  async getStudyPlan(): Promise<DailyStudyPlan> {
    try {
      const res = await fetch('/api/study-plan');
      if (!res.ok) throw new Error('Failed to get study plan');
      const data = await res.json();
      return data.plan;
    } catch {
      return {
        id: 'sp_fallback',
        date: new Date().toISOString().split('T')[0],
        title: "Today's Adaptive Priority Plan",
        totalMinutes: 90,
        completedMinutes: 35,
        focusTopic: 'Integration by Parts & Partial Fractions',
        tasks: [],
      };
    }
  },

  async toggleStudyPlanTask(taskId: string): Promise<DailyStudyPlan> {
    try {
      const res = await fetch('/api/study-plan/toggle-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId }),
      });
      const data = await res.json();
      return data.plan;
    } catch {
      return {
        id: 'sp_fallback',
        date: new Date().toISOString().split('T')[0],
        title: "Today's Adaptive Priority Plan",
        totalMinutes: 90,
        completedMinutes: 35,
        focusTopic: 'Integration by Parts',
        tasks: [],
      };
    }
  },

  // 9. AI Coach API
  async sendAiCoachMessage(payload: {
    message?: string;
    action?: string;
    mode?: string;
    language?: 'en' | 'bn';
    questionContext?: any;
    studentAnswer?: string;
    activeTopic?: string;
  }): Promise<StructuredAIResponse> {
    try {
      const res = await fetch('/api/ai-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('AI coach error');
      return await res.json();
    } catch {
      return {
        type: 'explanation',
        message: 'Let us focus on your priority calculus question. Remember to factor polynomials before integrating.',
      };
    }
  },

  // 10. Human-Led Tutor Studio
  async getTutors(): Promise<Tutor[]> {
    try {
      const res = await fetch('/api/tutors');
      if (!res.ok) throw new Error('Failed to get tutors');
      const data = await res.json();
      return data.tutors;
    } catch {
      return [];
    }
  },

  async bookTutor(booking: {
    tutorId: string;
    date: string;
    timeSlot: string;
    subject: string;
    topic: string;
  }) {
    try {
      const res = await fetch('/api/tutors/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
      });
      return await res.json();
    } catch {
      return { success: true };
    }
  },

  async getMyBookings(): Promise<TutorBooking[]> {
    try {
      const res = await fetch('/api/tutors/my-bookings');
      if (!res.ok) throw new Error('Failed to get bookings');
      const data = await res.json();
      return data.bookings;
    } catch {
      return [];
    }
  },

  async updateBookingNotes(bookingId: string, sessionNotes: string, status?: string) {
    const res = await fetch(`/api/tutors/bookings/${bookingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionNotes, status }),
    });
    return await res.json();
  },

  // 11. Admin Content Workspace
  async getAdminStats(): Promise<AdminContentStats> {
    const res = await fetch('/api/admin/stats');
    if (!res.ok) throw new Error('Failed to fetch admin stats');
    return await res.json();
  },

  async getAdminQuestions(filters?: { status?: string; subjectId?: string; difficulty?: string }): Promise<Question[]> {
    const params = new URLSearchParams(filters as any);
    const res = await fetch(`/api/admin/questions?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch admin questions');
    const data = await res.json();
    return data.questions;
  },

  async createAdminQuestion(question: any): Promise<Question> {
    const res = await fetch('/api/admin/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(question),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to create question');
    }
    const data = await res.json();
    return data.question;
  },

  async updateAdminQuestion(id: number, updates: any): Promise<Question> {
    const res = await fetch(`/api/admin/questions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update question');
    const data = await res.json();
    return data.question;
  },

  async reviewAdminQuestion(id: number): Promise<Question> {
    const res = await fetch(`/api/admin/questions/${id}/review`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to mark reviewed');
    const data = await res.json();
    return data.question;
  },

  async publishAdminQuestion(id: number): Promise<Question> {
    const res = await fetch(`/api/admin/questions/${id}/publish`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to publish question');
    const data = await res.json();
    return data.question;
  },

  async archiveAdminQuestion(id: number): Promise<Question> {
    const res = await fetch(`/api/admin/questions/${id}/archive`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to archive question');
    const data = await res.json();
    return data.question;
  },

  async getAuditLogs(): Promise<AuditLogItem[]> {
    const res = await fetch('/api/admin/audit-logs');
    if (!res.ok) throw new Error('Failed to fetch audit logs');
    const data = await res.json();
    return data.auditLogs;
  },

  // 12. Live Online Classes
  async getLiveClasses(): Promise<LiveClass[]> {
    try {
      const res = await fetch('/api/live-classes');
      if (!res.ok) throw new Error('Failed to fetch live classes');
      const data = await res.json();
      return data.classes;
    } catch {
      return [];
    }
  },

  async getLiveClass(id: string): Promise<{ class: LiveClass; isEnrolled: boolean; isTeacher: boolean }> {
    const res = await fetch(`/api/live-classes/${id}`);
    if (!res.ok) throw new Error('Failed to fetch class');
    return await res.json();
  },

  async enrollInLiveClass(id: string): Promise<{ success: boolean; class: LiveClass; message: string }> {
    const res = await fetch(`/api/live-classes/${id}/enroll`, {
      method: 'POST',
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to enroll');
    }
    return await res.json();
  },

  async joinLiveClass(id: string): Promise<{ success: boolean; class: LiveClass; meetingCode: string; roleInClass: string }> {
    const res = await fetch(`/api/live-classes/${id}/join`, {
      method: 'POST',
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to join class');
    }
    return await res.json();
  },

  // 13. Teacher Workspace & Management
  async getTeacherDashboardStats(): Promise<any> {
    const res = await fetch('/api/teacher/dashboard-stats');
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to fetch teacher stats');
    }
    return await res.json();
  },

  async createTeacherClass(data: any): Promise<{ success: boolean; class: LiveClass; message: string }> {
    const res = await fetch('/api/teacher/classes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || (json.details ? json.details.join(', ') : 'Failed to create class'));
    }
    return json;
  },

  async startTeacherClass(id: string): Promise<{ success: boolean; class: LiveClass }> {
    const res = await fetch(`/api/teacher/classes/${id}/start`, {
      method: 'POST',
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to start class');
    }
    return await res.json();
  },

  async endTeacherClass(id: string): Promise<{ success: boolean; class: LiveClass }> {
    const res = await fetch(`/api/teacher/classes/${id}/end`, {
      method: 'POST',
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to end class');
    }
    return await res.json();
  },

  // 14. Admin Teacher Verification
  async getAdminTeachers(): Promise<{ teachers: any[]; counts: { pending: number; approved: number; rejected: number; suspended: number } }> {
    const res = await fetch('/api/admin/teachers');
    if (!res.ok) throw new Error('Failed to fetch teachers for admin');
    return await res.json();
  },

  async approveTeacher(id: string, notes?: string): Promise<{ success: boolean; teacher: any; message: string }> {
    const res = await fetch(`/api/admin/teachers/${id}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to approve teacher');
    return json;
  },

  async rejectTeacher(id: string, reason?: string): Promise<{ success: boolean; teacher: any; message: string }> {
    const res = await fetch(`/api/admin/teachers/${id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to reject teacher');
    return json;
  },

  async suspendTeacher(id: string): Promise<{ success: boolean; teacher: any; message: string }> {
    const res = await fetch(`/api/admin/teachers/${id}/suspend`, {
      method: 'POST',
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to suspend teacher');
    return json;
  },

  async appealTeacherApplication(data: any): Promise<{ success: boolean; user: UserProfile; message: string }> {
    const res = await fetch('/api/teacher/application/appeal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to resubmit application');
    return json;
  },

  async simulateTeacherStatus(status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED', notes?: string): Promise<{ success: boolean; user: UserProfile; teacherStatus: string; message: string }> {
    const res = await fetch('/api/teacher/status/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to simulate status');
    return json;
  },
};
