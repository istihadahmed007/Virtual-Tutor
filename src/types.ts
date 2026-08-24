export interface QuestionOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface Question {
  id: number;
  subject: 'Physics' | 'Mathematics' | 'Chemistry' | 'Biology';
  chapter: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  title?: string;
  questionText: string;
  formula?: string;
  options: QuestionOption[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: {
    overview: string;
    whyWrongDetails?: string;
    stepByStep: string[];
    simpleExplanation: string;
    banglaExplanation: string;
    keyTakeaway: string;
  };
  graphType?: 'integral' | 'velocity-time' | 'thermodynamics' | 'wave';
}

export interface ExamSession {
  id: string;
  title: string;
  subject: string;
  totalQuestions: number;
  durationMinutes: number;
  questions: Question[];
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
  weakestTopic: {
    name: string;
    percentage: number;
    actionPlan: string[];
  };
  userAnswers: UserAnswerRecord[];
}

export interface MistakeItem {
  id: string;
  subject: 'Physics' | 'Mathematics' | 'Chemistry';
  topic: string;
  subtopic: string;
  title: string;
  attemptCount: number;
  correctCount: number;
  lastAttempted: string;
  question: Question;
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
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  isTyping?: boolean;
  suggestions?: string[];
  actionLink?: {
    text: string;
    view: string;
  };
}
