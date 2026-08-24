export type Role = 'STUDENT' | 'TEACHER' | 'TUTOR' | 'ADMIN';
export type TeacherStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
export type SubscriptionTier = 'FREE' | 'PRO' | 'TEACHER_INSTITUTION';
export type ContentStatus = 'DRAFT' | 'REVIEWED' | 'PUBLISHED' | 'ARCHIVED';

export type MistakeCategory =
  | 'Conceptual Error'
  | 'Calculation Error'
  | 'Careless Mistake'
  | 'Misread Question'
  | 'Formula Error'
  | 'Time Pressure'
  | 'Guess';

export type SocraticMode =
  | 'Socratic Tutor'
  | 'Explain'
  | 'Quick Hint'
  | 'Exam Coach'
  | 'Deep Tutor'
  | 'Revision'
  | 'Quiz Me';

export interface StudentProfile {
  academicLevel: string;
  educationBoard: string;
  subjects: string[];
  targetExam: string;
  preferredLanguage: 'en' | 'bn';
  studyGoal: string;
  dailyStudyHours: number;
}

export interface TeacherProfile {
  qualifications: string;
  experience: string;
  subjects: string[];
  academicLevels: string[];
  bio: string;
  preferredLanguage: 'en' | 'bn';
  hourlyRateBDT?: number;
  verificationNotes?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface LiveClass {
  id: string;
  title: string;
  subject: string;
  topic: string;
  teacherId: string;
  teacherName: string;
  teacherAvatar?: string;
  scheduledAt: string;
  durationMinutes: number;
  maxStudents: number;
  enrolledCount: number;
  status: 'SCHEDULED' | 'LIVE' | 'ENDED';
  meetingCode: string;
  description: string;
  enrolledStudentIds: string[];
  recordingUrl?: string;
  isEnrolled?: boolean;
  isTeacher?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  teacherStatus?: TeacherStatus;
  subscription: SubscriptionTier;
  avatarUrl?: string;
  studentProfile?: StudentProfile;
  teacherProfile?: TeacherProfile;
  targetExam: string;
  targetBatch?: string;
  examCountdownDays: number;
  targetScore: number;
  preferredLanguage: 'en' | 'bn';
  dailyGoalHours: number;
  currentStreakDays: number;
  highestStreakDays?: number;
  institution?: string;
}

export interface AvailableUser {
  id: string;
  name: string;
  role: Role;
  email: string;
  teacherStatus?: TeacherStatus;
}

export interface QuestionOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
  textEn?: string;
  textBn?: string;
}

export interface QuestionExplanation {
  overview: string;
  whyWrongDetails?: string;
  stepByStep: string[];
  simpleExplanation: string;
  banglaExplanation: string;
  keyTakeaway: string;
  overviewEn?: string;
  overviewBn?: string;
  stepByStepEn?: string[];
  stepByStepBn?: string[];
}

export interface Question {
  id: number;
  subject: string;
  subjectId?: string;
  chapter: string;
  chapterId?: string;
  topic: string;
  topicId?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Exam-Level';
  title?: string;
  titleEn?: string;
  titleBn?: string;
  questionText: string;
  questionTextEn?: string;
  questionTextBn?: string;
  formula?: string;
  options: QuestionOption[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  correctOptionId?: 'A' | 'B' | 'C' | 'D';
  explanation: QuestionExplanation;
  graphType?: 'integral' | 'velocity-time' | 'thermodynamics' | 'wave' | 'circuit' | 'genetics';
  curriculum?: string;
  board?: string;
  admissionCategory?: string;
  status?: ContentStatus;
  version?: number;
}

// Client-safe question returned during active exam (no answer key or explanation)
export interface SafeQuestion {
  id: number;
  subjectId: string;
  subjectName: string;
  chapterName: string;
  topicName: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Exam-Level';
  titleEn: string;
  titleBn: string;
  questionTextEn: string;
  questionTextBn: string;
  formula?: string;
  graphType?: string;
  options: {
    id: 'A' | 'B' | 'C' | 'D';
    textEn: string;
    textBn: string;
  }[];
  curriculum: string;
  board?: string;
  admissionCategory?: string;
}

export interface SubjectItem {
  id: string;
  nameEn: string;
  nameBn: string;
  code: string;
  color: string;
  icon: string;
  description: string;
  topicsCount: number;
  status: ContentStatus;
}

export interface TopicMastery {
  topic: string;
  subject: string;
  masteryScore: number; // 0 - 100
  accuracyPercentage: number;
  totalAttempts: number;
  correctAttempts: number;
  recentAttempts: boolean[];
  lastPracticedDate: string;
  decayedScore: number;
  status: 'critical' | 'improving' | 'mastered';
}

export interface SubjectMastery {
  subject: string;
  masteryScore: number;
  topics: TopicMastery[];
  weakestTopic: string;
  strongestTopic: string;
}

export interface ExamSession {
  id: string;
  title: string;
  titleBn?: string;
  subject: string;
  totalQuestions: number;
  durationMinutes: number;
  questions: SafeQuestion[] | Question[];
}

export interface UserAnswerRecord {
  questionId: number;
  selectedOption: 'A' | 'B' | 'C' | 'D' | null;
  isCorrect: boolean;
  isFlagged: boolean;
  timeSpentSeconds: number;
}

export interface ExamResult {
  examId: string;
  title: string;
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
  scorePercentage: number;
  grade: string;
  percentile: number;
  timeSpentSeconds: number;
  timeEfficiency: number;
  topicScores: {
    topic: string;
    percentage: number;
    total: number;
    correct: number;
    status: 'mastered' | 'improving' | 'weak';
  }[];
  weakestTopic?: {
    name: string;
    percentage: number;
    actionPlan: string[];
  };
  userAnswers: UserAnswerRecord[];
  detailedResults?: any[];
}

export interface MistakeItem {
  id: string;
  subject: string;
  topic: string;
  subtopic?: string;
  title: string;
  attemptCount: number;
  correctCount: number;
  lastAttempted: string;
  question: Question;
  category?: MistakeCategory;
  isResolved?: boolean;
}

export interface StudyPlanTask {
  id: string;
  title: string;
  topic: string;
  subject: string;
  minutes: number;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  type: 'drill' | 'review' | 'mock' | 'socratic';
  reason: string;
}

export interface DailyStudyPlan {
  id: string;
  date: string;
  title: string;
  totalMinutes: number;
  completedMinutes: number;
  focusTopic: string;
  tasks: StudyPlanTask[];
}

export interface Tutor {
  id: string;
  name: string;
  title: string;
  subject: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  yearsExperience: number;
  languages: string[];
  hourlyRateBDT: number;
  avatarUrl: string;
  isHighDemand?: boolean;
  isAvailableToday?: boolean;
  bio: string;
  education: string;
  institution?: string;
  availableTimeSlots?: string[];
}

export interface TutorBooking {
  id: string;
  userId: string;
  tutorId: string;
  studentName: string;
  tutorName: string;
  date: string;
  timeSlot: string;
  subject: string;
  topic: string;
  status: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  rateBDT: number;
  sessionNotes?: string;
  createdAt: string;
}

export interface AuditLogItem {
  id: string;
  actorId: string;
  actorEmail: string;
  actorRole: Role;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  timestamp: string;
}

export interface AdminContentStats {
  totalQuestions: number;
  draftCount: number;
  reviewedCount: number;
  publishedCount: number;
  archivedCount: number;
  totalSubjects: number;
  totalExamSets: number;
  totalUsers: number;
}

export interface StructuredAIResponse {
  type: 'explanation' | 'hint' | 'socratic' | 'step-by-step' | 'quiz' | 'feedback' | 'study-plan';
  message: string;
  steps?: string[];
  hint?: string;
  followUpQuestion?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  banglaTranslation?: string;
  suggestions?: string[];
  reply?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  isTyping?: boolean;
  suggestions?: string[];
  responseType?: 'explanation' | 'hint' | 'socratic' | 'step-by-step' | 'quiz' | 'feedback' | 'study-plan';
  actionLink?: {
    text: string;
    view: string;
  };
}
