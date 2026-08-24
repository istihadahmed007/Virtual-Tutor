import { z } from 'zod';

export type Role = 'STUDENT' | 'TEACHER' | 'TUTOR' | 'ADMIN';
export type TeacherStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
export type SubscriptionTier = 'FREE' | 'PRO' | 'TEACHER_INSTITUTION';
export type ContentStatus = 'DRAFT' | 'REVIEWED' | 'PUBLISHED' | 'ARCHIVED';
export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Exam-Level';
export type MistakeCategory =
  | 'Conceptual Error'
  | 'Calculation Error'
  | 'Careless Mistake'
  | 'Misread Question'
  | 'Formula Error'
  | 'Time Pressure'
  | 'Guess';

export interface StudentProfile {
  academicLevel: string; // 'SSC' | 'HSC' | 'University Admission' | 'Medical Admission' | 'Engineering Admission' | 'BCS' | 'Other'
  educationBoard: string; // 'Dhaka' | 'Chittagong' | 'Rajshahi' | etc.
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
}

export interface User {
  id: string;
  email: string;
  name: string;
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
  createdAt: string;
}

export interface Subject {
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

export interface Chapter {
  id: string;
  subjectId: string;
  nameEn: string;
  nameBn: string;
  chapterNumber: number;
  status: ContentStatus;
}

export interface Topic {
  id: string;
  chapterId: string;
  subjectId: string;
  nameEn: string;
  nameBn: string;
  code: string;
  importance: number; // 1 - 5 scale
  status: ContentStatus;
}

export interface QuestionOption {
  id: 'A' | 'B' | 'C' | 'D';
  textEn: string;
  textBn: string;
}

export interface QuestionExplanation {
  overviewEn: string;
  overviewBn: string;
  whyWrongDetailsEn?: string;
  whyWrongDetailsBn?: string;
  stepByStepEn: string[];
  stepByStepBn: string[];
  simpleExplanationEn: string;
  simpleExplanationBn: string;
  keyTakeawayEn: string;
  keyTakeawayBn: string;
}

export interface Question {
  id: number;
  subjectId: string;
  subjectName: string;
  chapterId: string;
  chapterName: string;
  topicId: string;
  topicName: string;
  difficulty: Difficulty;
  titleEn: string;
  titleBn: string;
  questionTextEn: string;
  questionTextBn: string;
  formula?: string;
  graphType?: 'integral' | 'velocity-time' | 'thermodynamics' | 'wave' | 'circuit' | 'genetics';
  options: QuestionOption[];
  correctOptionId: 'A' | 'B' | 'C' | 'D'; // Protected on server!
  explanation: QuestionExplanation;
  defaultMistakeCategory: MistakeCategory;
  curriculum: string; // 'HSC', 'SSC', 'Admission'
  board?: string; // 'Dhaka', 'Chittagong', 'Rajshahi', 'All Board'
  admissionCategory?: string; // 'BUET / Engineering', 'Medical / DMC', 'Dhaka University (KA/KHA)', 'BCS'
  status: ContentStatus;
  version: number;
  createdBy: string;
  reviewedBy?: string;
  publishedBy?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

// Client-safe version of Question (Answer key and explanation completely stripped during active exam)
export interface SafeQuestion {
  id: number;
  subjectId: string;
  subjectName: string;
  chapterName: string;
  topicName: string;
  difficulty: Difficulty;
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

export interface ExamSet {
  id: string;
  titleEn: string;
  titleBn: string;
  subjectId: string;
  subjectName: string;
  totalQuestions: number;
  durationMinutes: number;
  isFullMock: boolean;
  targetCategory: string; // 'BUET', 'Medical', 'DU A-Unit', 'HSC Board'
  questionIds: number[];
  status: ContentStatus;
  publishedAt?: string;
}

export interface ExamAttempt {
  id: string;
  userId: string;
  examId: string;
  title: string;
  subject: string;
  status: 'IN_PROGRESS' | 'COMPLETED';
  startedAt: string;
  completedAt?: string;
  scorePercentage?: number;
  answeredCount: number;
  correctCount?: number;
  totalQuestions: number;
  grade?: string;
  percentile?: number;
  timeSpentSeconds: number;
  timeEfficiency?: number;
  weakestTopic?: {
    name: string;
    percentage: number;
    actionPlan: string[];
  };
  topicScores?: {
    topic: string;
    percentage: number;
    total: number;
    correct: number;
    status: 'weak' | 'improving' | 'mastered';
  }[];
}

export interface LearnerAnswer {
  id: string;
  attemptId: string;
  userId: string;
  questionId: number;
  selectedOption: 'A' | 'B' | 'C' | 'D' | null;
  isCorrect?: boolean;
  timeSpentSeconds: number;
  timestamp: string;
}

export interface MistakeItem {
  id: string;
  userId: string;
  questionId: number;
  attemptId?: string;
  category: MistakeCategory;
  studentAnswer: string;
  correctAnswer: string;
  attemptCount: number;
  correctCount: number;
  lastAttempted: string;
  isResolved: boolean;
  resolvedAt?: string;
  notes?: string;
  question: Question; // Provided to student with explanation for remediation
}

export interface TopicMastery {
  topic: string;
  subject: string;
  masteryScore: number;
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

export interface Tutor {
  id: string;
  name: string;
  title: string;
  subject: string;
  specialty: string;
  education: string;
  institution: string; // e.g. BUET, DMC, Dhaka University, IBA
  rating: number;
  reviewCount: number;
  yearsExperience: number;
  languages: string[];
  hourlyRateBDT: number;
  avatarUrl: string;
  isHighDemand: boolean;
  isAvailableToday: boolean;
  bio: string;
  availableTimeSlots: string[];
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

export interface ContentVersion {
  id: string;
  questionId: number;
  versionNumber: number;
  snapshot: any;
  changedBy: string;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorEmail: string;
  actorRole: Role;
  action: string; // 'CONTENT_CREATED' | 'CONTENT_EDITED' | 'CONTENT_REVIEWED' | 'CONTENT_PUBLISHED' | 'CONTENT_ARCHIVED' | 'ROLE_CHANGED'
  entity: string;
  entityId: string;
  details: string;
  timestamp: string;
}

export interface DailyStudyPlanTask {
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

export type StudyPlanTask = DailyStudyPlanTask;

export interface AIActionRequest {
  action?: string;
  mode?: string;
  message?: string;
  language?: 'en' | 'bn';
  questionContext?: any;
  studentAnswer?: string;
  activeTopic?: string;
}

export interface DailyStudyPlan {
  id: string;
  date: string;
  title: string;
  totalMinutes: number;
  completedMinutes: number;
  focusTopic: string;
  tasks: DailyStudyPlanTask[];
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
}

// Zod schemas for input validation
export const QuestionCreateSchema = z.object({
  subjectId: z.string().min(1),
  subjectName: z.string().min(1),
  chapterId: z.string().min(1),
  chapterName: z.string().min(1),
  topicId: z.string().min(1),
  topicName: z.string().min(1),
  difficulty: z.enum(['Easy', 'Medium', 'Hard', 'Exam-Level']),
  titleEn: z.string().min(2),
  titleBn: z.string().min(2),
  questionTextEn: z.string().min(5),
  questionTextBn: z.string().min(5),
  formula: z.string().optional(),
  graphType: z.enum(['integral', 'velocity-time', 'thermodynamics', 'wave', 'circuit', 'genetics']).optional(),
  options: z.array(
    z.object({
      id: z.enum(['A', 'B', 'C', 'D']),
      textEn: z.string().min(1),
      textBn: z.string().min(1),
    })
  ).length(4),
  correctOptionId: z.enum(['A', 'B', 'C', 'D']),
  explanation: z.object({
    overviewEn: z.string().min(5),
    overviewBn: z.string().min(5),
    whyWrongDetailsEn: z.string().optional(),
    whyWrongDetailsBn: z.string().optional(),
    stepByStepEn: z.array(z.string()),
    stepByStepBn: z.array(z.string()),
    simpleExplanationEn: z.string().min(5),
    simpleExplanationBn: z.string().min(5),
    keyTakeawayEn: z.string().min(5),
    keyTakeawayBn: z.string().min(5),
  }),
  defaultMistakeCategory: z.enum([
    'Conceptual Error',
    'Calculation Error',
    'Careless Mistake',
    'Misread Question',
    'Formula Error',
    'Time Pressure',
    'Guess',
  ]),
  curriculum: z.string().default('HSC'),
  board: z.string().optional(),
  admissionCategory: z.string().optional(),
});

export const ExamSubmissionSchema = z.object({
  attemptId: z.string().min(1),
  timeSpentSeconds: z.number().nonnegative(),
  answers: z.array(
    z.object({
      questionId: z.number(),
      selectedOption: z.enum(['A', 'B', 'C', 'D']).nullable(),
      timeSpentSeconds: z.number().nonnegative(),
    })
  ),
});

export const TutorBookingSchema = z.object({
  tutorId: z.string().min(1),
  date: z.string().min(1),
  timeSlot: z.string().min(1),
  subject: z.string().min(1),
  topic: z.string().min(1),
});

export const StudentRegisterSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(6, 'Valid phone number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  profile: z.object({
    academicLevel: z.string().min(1, 'Academic level is required'),
    educationBoard: z.string().min(1, 'Education board is required'),
    subjects: z.array(z.string()).min(1, 'Select at least one subject'),
    targetExam: z.string().min(1, 'Target exam is required'),
    preferredLanguage: z.enum(['en', 'bn']).default('bn'),
    studyGoal: z.string().min(2, 'Study goal is required'),
    dailyStudyHours: z.number().min(0.5).max(18).default(3.5),
  }),
});

export const TeacherRegisterSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(6, 'Valid phone number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  avatarUrl: z.string().optional(),
  profile: z.object({
    qualifications: z.string().min(2, 'Qualifications are required'),
    experience: z.string().min(2, 'Teaching experience is required'),
    subjects: z.array(z.string()).min(1, 'Select at least one subject'),
    academicLevels: z.array(z.string()).min(1, 'Select at least one academic level'),
    bio: z.string().min(10, 'Please write a brief bio'),
    preferredLanguage: z.enum(['en', 'bn']).default('bn'),
    hourlyRateBDT: z.number().optional(),
  }),
});

export const LiveClassCreateSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  subject: z.string().min(1, 'Subject is required'),
  topic: z.string().min(1, 'Topic is required'),
  scheduledAt: z.string().min(1, 'Date and time are required'),
  durationMinutes: z.number().min(15).max(240).default(60),
  maxStudents: z.number().min(1).max(500).default(50),
  description: z.string().min(5, 'Description is required'),
});
