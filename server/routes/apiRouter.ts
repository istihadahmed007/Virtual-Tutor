import { Router, Request, Response, NextFunction } from 'express';
import { db } from '../db/store.js';
import {
  QuestionCreateSchema,
  ExamSubmissionSchema,
  TutorBookingSchema,
  StudentRegisterSchema,
  TeacherRegisterSchema,
  LiveClassCreateSchema,
  Role,
  TeacherStatus,
  ContentStatus,
  Question,
  SafeQuestion,
  ExamAttempt,
  LearnerAnswer,
  MistakeItem,
  TopicMastery,
  SubjectMastery,
  LiveClass,
  User,
  Tutor,
  TutorBooking,
  TutorSOSRequest,
  TutorMessage,
} from '../types/index.js';
import { AiCoachEngine } from '../services/aiCoachEngine.js';

export const apiRouter = Router();

// ==========================================
// AUTHENTICATION & ROLE MIDDLEWARE
// ==========================================
interface AuthenticatedRequest extends Request {
  user?: (typeof db.users)[0];
}

// Global Auth Middleware
apiRouter.use((req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Check Authorization header or x-user-id or fallback to db.currentUserId
  const authHeader = req.headers.authorization;
  const userIdHeader = req.headers['x-user-id'] as string;

  let user = db.users.find((u) => u.id === userIdHeader);

  if (!user && authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    user = db.users.find((u) => u.id === token || u.email === token);
  }

  if (!user) {
    user = db.users.find((u) => u.id === db.currentUserId) || db.users[0];
  }

  req.user = user;
  next();
});

// Role Guard Middleware
const requireRole = (allowedRoles: Role[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `Access denied. Requires one of roles: [${allowedRoles.join(', ')}]. Current role: ${req.user?.role}`,
      });
    }
    next();
  };
};

// Teacher Approval Guard Middleware
const requireApprovedTeacher = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'TEACHER') {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Access restricted to Teachers only.',
    });
  }
  if (req.user.teacherStatus !== 'APPROVED') {
    return res.status(403).json({
      error: 'VerificationRequired',
      status: req.user.teacherStatus || 'PENDING',
      message: 'Your teacher account is pending verification by the academic director. Live classes and protected teaching tools are disabled until approved.',
    });
  }
  next();
};

// ==========================================
// 1. AUTH & REGISTRATION PATHWAYS
// ==========================================

// Get list of configurable education boards
apiRouter.get('/auth/education-boards', (req: AuthenticatedRequest, res: Response) => {
  res.json({ boards: db.educationBoards });
});

// Student Registration Endpoint (Strict server-enforced role assignment: STUDENT)
apiRouter.post('/auth/register/student', (req: AuthenticatedRequest, res: Response) => {
  const parseResult = StudentRegisterSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: 'ValidationFailed',
      details: parseResult.error.issues.map((e) => e.message),
    });
  }

  const { fullName, email, phone, profile } = parseResult.data;

  // Check if email already exists
  const existingUser = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(409).json({
      error: 'UserExists',
      message: 'An account with this email address already exists. Please log in instead.',
    });
  }

  // Create immutable Student User on Server
  const newStudent: User = {
    id: `usr_student_${Date.now()}`,
    email: email.toLowerCase(),
    name: fullName.trim(),
    phone,
    role: 'STUDENT', // SERVER ENFORCED
    subscription: 'FREE',
    avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(fullName)}`,
    studentProfile: {
      academicLevel: profile.academicLevel,
      educationBoard: profile.educationBoard,
      subjects: profile.subjects,
      targetExam: profile.targetExam,
      preferredLanguage: profile.preferredLanguage,
      studyGoal: profile.studyGoal,
      dailyStudyHours: profile.dailyStudyHours,
    },
    targetExam: profile.targetExam || `${profile.academicLevel} Preparation`,
    targetBatch: 'HSC 2025 Batch',
    examCountdownDays: 14,
    targetScore: 90,
    preferredLanguage: profile.preferredLanguage,
    dailyGoalHours: profile.dailyStudyHours,
    currentStreakDays: 1,
    highestStreakDays: 1,
    institution: profile.educationBoard,
    createdAt: new Date().toISOString(),
  };

  db.users.unshift(newStudent);
  db.currentUserId = newStudent.id;
  req.user = newStudent;

  db.recordAudit(
    newStudent.id,
    newStudent.email,
    'STUDENT',
    'ROLE_CHANGED',
    'User',
    newStudent.id,
    `Registered new Student account (${newStudent.name}) with ${profile.subjects.length} subjects`
  );

  res.status(201).json({
    success: true,
    user: newStudent,
    token: newStudent.id,
    message: 'Student account and learning profile created successfully!',
  });
});

// Teacher Registration Endpoint (Strict server-enforced role assignment: TEACHER, status: PENDING)
apiRouter.post('/auth/register/teacher', (req: AuthenticatedRequest, res: Response) => {
  const parseResult = TeacherRegisterSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: 'ValidationFailed',
      details: parseResult.error.issues.map((e) => e.message),
    });
  }

  const { fullName, email, phone, avatarUrl, profile } = parseResult.data;

  // Check if email already exists
  const existingUser = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(409).json({
      error: 'UserExists',
      message: 'An account with this email address already exists. Please log in instead.',
    });
  }

  // Create Teacher User with strict PENDING verification status
  const newTeacher: User = {
    id: `usr_teacher_${Date.now()}`,
    email: email.toLowerCase(),
    name: fullName.trim(),
    phone,
    role: 'TEACHER', // SERVER ENFORCED
    teacherStatus: 'PENDING', // SERVER ENFORCED - Requires Admin Approval
    subscription: 'FREE',
    avatarUrl:
      avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`,
    teacherProfile: {
      qualifications: profile.qualifications,
      experience: profile.experience,
      subjects: profile.subjects,
      academicLevels: profile.academicLevels,
      bio: profile.bio,
      preferredLanguage: profile.preferredLanguage,
      hourlyRateBDT: profile.hourlyRateBDT || 1000,
      submittedAt: new Date().toISOString(),
    },
    targetExam: 'Academic Tutoring & Live Classes',
    examCountdownDays: 0,
    targetScore: 100,
    preferredLanguage: profile.preferredLanguage,
    dailyGoalHours: 4.0,
    currentStreakDays: 1,
    highestStreakDays: 1,
    institution: profile.qualifications.split(',')[0] || 'Virtual Tutor Faculty',
    createdAt: new Date().toISOString(),
  };

  db.users.unshift(newTeacher);
  db.currentUserId = newTeacher.id;
  req.user = newTeacher;

  db.recordAudit(
    newTeacher.id,
    newTeacher.email,
    'TEACHER',
    'ROLE_CHANGED',
    'User',
    newTeacher.id,
    `Registered new Teacher application (${newTeacher.name}) - Status: PENDING`
  );

  res.status(201).json({
    success: true,
    user: newTeacher,
    token: newTeacher.id,
    teacherStatus: 'PENDING',
    message:
      'Your teacher application has been submitted. Our team will review your profile before you can start teaching students.',
  });
});

// Login Endpoint
apiRouter.post('/auth/login', (req: AuthenticatedRequest, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(401).json({ error: 'InvalidCredentials', message: 'No account found with this email.' });
  }

  db.currentUserId = user.id;
  req.user = user;

  res.json({
    success: true,
    user,
    token: user.id,
    role: user.role,
    teacherStatus: user.teacherStatus,
  });
});

apiRouter.get('/auth/me', (req: AuthenticatedRequest, res: Response) => {
  res.json({
    user: req.user,
    availableUsers: db.users.map((u) => ({
      id: u.id,
      name: u.name,
      role: u.role,
      email: u.email,
      teacherStatus: u.teacherStatus,
    })),
  });
});

apiRouter.post('/auth/switch-user', (req: AuthenticatedRequest, res: Response) => {
  const { userId, role } = req.body;
  let targetUser = db.users.find((u) => u.id === userId);
  if (!targetUser && role) {
    targetUser = db.users.find((u) => u.role === role);
  }
  if (!targetUser) {
    return res.status(404).json({ error: 'User not found' });
  }
  db.currentUserId = targetUser.id;
  req.user = targetUser;
  res.json({ success: true, user: targetUser });
});

// ==========================================
// 2. USER PROFILE
// ==========================================
apiRouter.get('/user/profile', (req: AuthenticatedRequest, res: Response) => {
  res.json({ user: req.user });
});

apiRouter.put('/user/profile', (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const user = req.user;
  const { targetExam, targetBatch, examCountdownDays, dailyGoalHours, targetScore, preferredLanguage, name, institution } = req.body;

  if (targetExam !== undefined) user.targetExam = targetExam;
  if (targetBatch !== undefined) user.targetBatch = targetBatch;
  if (examCountdownDays !== undefined) user.examCountdownDays = examCountdownDays;
  if (dailyGoalHours !== undefined) user.dailyGoalHours = dailyGoalHours;
  if (targetScore !== undefined) user.targetScore = targetScore;
  if (preferredLanguage !== undefined) user.preferredLanguage = preferredLanguage;
  if (name !== undefined) user.name = name;
  if (institution !== undefined) user.institution = institution;

  res.json({ success: true, user });
});

// ==========================================
// 3. CURRICULUM & BANGLADESH SUBJECTS
// ==========================================
apiRouter.get('/curriculum/subjects', (req: AuthenticatedRequest, res: Response) => {
  const publishedSubjects = db.subjects.filter((s) => s.status === 'PUBLISHED');
  res.json({ subjects: publishedSubjects });
});

apiRouter.get('/curriculum/subjects/:subjectId/structure', (req: AuthenticatedRequest, res: Response) => {
  const { subjectId } = req.params;
  const subject = db.subjects.find((s) => s.id === subjectId);
  if (!subject) return res.status(404).json({ error: 'Subject not found' });

  const chapters = db.chapters.filter((c) => c.subjectId === subjectId && c.status === 'PUBLISHED');
  const topics = db.topics.filter((t) => t.subjectId === subjectId && t.status === 'PUBLISHED');

  res.json({
    subject,
    chapters: chapters.map((c) => ({
      ...c,
      topics: topics.filter((t) => t.chapterId === c.id),
    })),
  });
});

// ==========================================
// 4. MASTERY OVERVIEW & ADAPTIVE METRICS
// ==========================================
apiRouter.get('/mastery/overview', (req: AuthenticatedRequest, res: Response) => {
  const masteries = db.masteries;
  const overallScore = Math.round(
    masteries.reduce((sum, m) => sum + m.masteryScore, 0) / (masteries.length || 1)
  );

  const weakestTopics = [...masteries].sort((a, b) => a.masteryScore - b.masteryScore).slice(0, 3);
  const strongestTopics = [...masteries].sort((a, b) => b.masteryScore - a.masteryScore).slice(0, 3);

  // Group by subjects
  const subjectGroups = new Map<string, TopicMastery[]>();
  masteries.forEach((m) => {
    const list = subjectGroups.get(m.subject) || [];
    list.push(m);
    subjectGroups.set(m.subject, list);
  });

  const subjectMasteries: SubjectMastery[] = Array.from(subjectGroups.entries()).map(
    ([subject, topics]) => {
      const avg = Math.round(topics.reduce((a, b) => a + b.masteryScore, 0) / topics.length);
      const sorted = [...topics].sort((a, b) => a.masteryScore - b.masteryScore);
      return {
        subject,
        masteryScore: avg,
        topics,
        weakestTopic: sorted[0]?.topic || '',
        strongestTopic: sorted[sorted.length - 1]?.topic || '',
      };
    }
  );

  res.json({
    overallScore,
    weakestTopics,
    strongestTopics,
    subjectMasteries,
    criticalAlert: weakestTopics[0] || null,
  });
});

// ==========================================
// 5. ADAPTIVE PRACTICE ENGINE (SAFE QUESTION SERVING)
// ==========================================
apiRouter.get('/practice/adaptive-question', (req: AuthenticatedRequest, res: Response) => {
  const { subject, topic } = req.query;
  const publishedQuestions = db.questions.filter((q) => q.status === 'PUBLISHED');

  let pool = publishedQuestions;
  if (subject && subject !== 'All') {
    pool = pool.filter((q) => q.subjectName.toLowerCase() === String(subject).toLowerCase());
  }
  if (topic) {
    const matched = pool.filter((q) => q.topicName.toLowerCase().includes(String(topic).toLowerCase()));
    if (matched.length > 0) pool = matched;
  }
  if (pool.length === 0) pool = publishedQuestions;

  const chosen = pool[Math.floor(Math.random() * pool.length)] || publishedQuestions[0];
  const safeQuestions = db.getSafeQuestions([chosen]);

  res.json({ question: safeQuestions[0] });
});

apiRouter.get('/practice/session', (req: AuthenticatedRequest, res: Response) => {
  const { count = 10, subject } = req.query;
  const num = Math.min(Number(count) || 10, 50);
  const published = db.questions.filter((q) => q.status === 'PUBLISHED');

  let pool = published;
  if (subject && subject !== 'All') {
    pool = pool.filter((q) => q.subjectName.toLowerCase() === String(subject).toLowerCase());
  }
  if (pool.length === 0) pool = published;

  const questions: Question[] = [];
  for (let i = 0; i < num; i++) {
    const original = pool[i % pool.length];
    questions.push(original);
  }

  const safeQuestions = db.getSafeQuestions(questions);
  res.json({ questions: safeQuestions });
});

apiRouter.post('/practice/record-attempt', (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id || 'usr_student_1';
  const { questionId, selectedOption, timeSpentSeconds = 30 } = req.body;

  const question = db.questions.find((q) => q.id === Number(questionId));
  if (!question) return res.status(404).json({ error: 'Question not found' });

  // Server compares against protected correctOptionId!
  const isCorrect = selectedOption === question.correctOptionId;

  // Update Mastery
  let topicMastery = db.masteries.find((m) => m.topic === question.topicName);
  if (!topicMastery) {
    topicMastery = {
      topic: question.topicName,
      subject: question.subjectName,
      masteryScore: isCorrect ? 65 : 40,
      accuracyPercentage: isCorrect ? 100 : 0,
      totalAttempts: 1,
      correctAttempts: isCorrect ? 1 : 0,
      recentAttempts: [isCorrect],
      lastPracticedDate: new Date().toISOString(),
      decayedScore: isCorrect ? 65 : 40,
      status: isCorrect ? 'improving' : 'critical',
    };
    db.masteries.push(topicMastery);
  } else {
    topicMastery.totalAttempts += 1;
    if (isCorrect) topicMastery.correctAttempts += 1;
    topicMastery.recentAttempts = [...topicMastery.recentAttempts.slice(-4), isCorrect];
    topicMastery.accuracyPercentage = Math.round((topicMastery.correctAttempts / topicMastery.totalAttempts) * 100);
    const recentScore = (topicMastery.recentAttempts.filter(Boolean).length / topicMastery.recentAttempts.length) * 100;
    topicMastery.masteryScore = Math.round(topicMastery.accuracyPercentage * 0.4 + recentScore * 0.6);
    topicMastery.decayedScore = topicMastery.masteryScore;
    topicMastery.status = topicMastery.masteryScore >= 80 ? 'mastered' : topicMastery.masteryScore >= 50 ? 'improving' : 'critical';
    topicMastery.lastPracticedDate = new Date().toISOString();
  }

  // Handle Mistakes
  let mistakeRecord = db.mistakes.find((m) => m.questionId === question.id && m.userId === userId);
  if (!isCorrect) {
    if (mistakeRecord) {
      mistakeRecord.attemptCount += 1;
      mistakeRecord.studentAnswer = selectedOption || 'Unanswered';
      mistakeRecord.lastAttempted = new Date().toISOString();
      mistakeRecord.isResolved = false;
    } else {
      mistakeRecord = {
        id: `mstk_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        userId,
        questionId: question.id,
        category: question.defaultMistakeCategory,
        studentAnswer: selectedOption || 'Unanswered',
        correctAnswer: question.correctOptionId,
        attemptCount: 1,
        correctCount: 0,
        lastAttempted: new Date().toISOString(),
        isResolved: false,
        notes: `Failed during adaptive practice on ${question.topicName}`,
        question,
      };
      db.mistakes.unshift(mistakeRecord);
    }
  } else if (mistakeRecord) {
    mistakeRecord.isResolved = true;
    mistakeRecord.correctCount += 1;
    mistakeRecord.resolvedAt = new Date().toISOString();
  }

  // Now that answer is submitted and recorded, we return the explanation and correction safely
  res.json({
    success: true,
    isCorrect,
    correctOptionId: question.correctOptionId,
    explanation: question.explanation,
    updatedMastery: topicMastery,
  });
});

// ==========================================
// 6. EXAM SIMULATION ENGINE (SERVER-AUTHORITATIVE & ZERO-LEAK)
// ==========================================
apiRouter.get('/exams', (req: AuthenticatedRequest, res: Response) => {
  const publishedExams = db.examSets.filter((e) => e.status === 'PUBLISHED');
  res.json({ exams: publishedExams });
});

// Start Exam -> Server generates attempt and returns ONLY sanitized questions (NO answer keys or explanations!)
apiRouter.post('/exams/:examId/start', (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id || 'usr_student_1';
  const { examId } = req.params;

  const exam = db.examSets.find((e) => e.id === examId && e.status === 'PUBLISHED');
  if (!exam) return res.status(404).json({ error: 'Exam not found or not published' });

  // Get question objects
  const examQuestions = db.questions.filter(
    (q) => exam.questionIds.includes(q.id) && q.status === 'PUBLISHED'
  );

  // Strictly sanitized questions for client
  const safeQuestions = db.getSafeQuestions(examQuestions);

  const attemptId = `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const newAttempt: ExamAttempt = {
    id: attemptId,
    userId,
    examId: exam.id,
    title: exam.titleEn,
    subject: exam.subjectName,
    status: 'IN_PROGRESS',
    startedAt: new Date().toISOString(),
    answeredCount: 0,
    totalQuestions: safeQuestions.length,
    timeSpentSeconds: 0,
  };

  db.examAttempts.push(newAttempt);

  res.json({
    success: true,
    attemptId,
    exam: {
      id: exam.id,
      titleEn: exam.titleEn,
      titleBn: exam.titleBn,
      subjectName: exam.subjectName,
      durationMinutes: exam.durationMinutes,
      totalQuestions: safeQuestions.length,
      targetCategory: exam.targetCategory,
    },
    questions: safeQuestions,
  });
});

// Submit Exam -> Server performs grading against protected keys, records attempt, mastery, mistakes, and returns score + solutions
apiRouter.post('/attempts/:attemptId/submit', (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id || 'usr_student_1';
  const { attemptId } = req.params;

  const validation = ExamSubmissionSchema.safeParse({
    attemptId,
    timeSpentSeconds: req.body.timeSpentSeconds,
    answers: req.body.answers,
  });

  if (!validation.success) {
    return res.status(400).json({ error: 'Invalid submission data', details: validation.error.format() });
  }

  const attempt = db.examAttempts.find((a) => a.id === attemptId);
  if (!attempt) return res.status(404).json({ error: 'Exam attempt not found' });

  // Ownership validation!
  if (attempt.userId !== userId) {
    return res.status(403).json({ error: 'Forbidden: You cannot submit an attempt belonging to another user.' });
  }

  if (attempt.status === 'COMPLETED') {
    return res.status(400).json({ error: 'This exam attempt has already been submitted and completed.' });
  }

  const { answers, timeSpentSeconds } = validation.data;

  // Grade server-side
  let correctCount = 0;
  const detailedResults = answers.map((ans) => {
    const question = db.questions.find((q) => q.id === ans.questionId);
    if (!question) {
      return {
        questionId: ans.questionId,
        selectedOption: ans.selectedOption,
        correctOption: 'A',
        isCorrect: false,
        timeSpent: ans.timeSpentSeconds,
      };
    }

    const isCorrect = ans.selectedOption === question.correctOptionId;
    if (isCorrect) correctCount += 1;

    // Record Learner Answer
    db.learnerAnswers.push({
      id: `ans_${Date.now()}_${ans.questionId}`,
      attemptId,
      userId,
      questionId: question.id,
      selectedOption: ans.selectedOption,
      isCorrect,
      timeSpentSeconds: ans.timeSpentSeconds,
      timestamp: new Date().toISOString(),
    });

    // If incorrect, add to student's mistake ledger
    if (!isCorrect) {
      const existingMistake = db.mistakes.find((m) => m.questionId === question.id && m.userId === userId);
      if (existingMistake) {
        existingMistake.attemptCount += 1;
        existingMistake.studentAnswer = ans.selectedOption || 'Unanswered';
        existingMistake.lastAttempted = new Date().toISOString();
        existingMistake.isResolved = false;
      } else {
        db.mistakes.unshift({
          id: `mstk_${Date.now()}_${question.id}`,
          userId,
          questionId: question.id,
          attemptId,
          category: question.defaultMistakeCategory,
          studentAnswer: ans.selectedOption || 'Unanswered',
          correctAnswer: question.correctOptionId,
          attemptCount: 1,
          correctCount: 0,
          lastAttempted: new Date().toISOString(),
          isResolved: false,
          notes: `Incorrect answer during ${attempt.title}`,
          question,
        });
      }
    }

    return {
      questionId: question.id,
      titleEn: question.titleEn,
      titleBn: question.titleBn,
      subject: question.subjectName,
      topic: question.topicName,
      difficulty: question.difficulty,
      selectedOption: ans.selectedOption,
      correctOption: question.correctOptionId,
      isCorrect,
      timeSpent: ans.timeSpentSeconds,
      explanation: question.explanation,
      options: question.options,
    };
  });

  const totalQuestions = answers.length || 1;
  const scorePercentage = Math.round((correctCount / totalQuestions) * 100);

  // Determine grade & percentile simulation
  let grade = 'F';
  if (scorePercentage >= 90) grade = 'A+';
  else if (scorePercentage >= 80) grade = 'A';
  else if (scorePercentage >= 70) grade = 'A-';
  else if (scorePercentage >= 60) grade = 'B';
  else if (scorePercentage >= 50) grade = 'C';
  else if (scorePercentage >= 40) grade = 'D';

  const percentile = Math.min(99, Math.max(30, Math.round(scorePercentage * 0.95 + 8)));

  // Update Attempt Record
  attempt.status = 'COMPLETED';
  attempt.completedAt = new Date().toISOString();
  attempt.correctCount = correctCount;
  attempt.answeredCount = answers.filter((a) => a.selectedOption !== null).length;
  attempt.scorePercentage = scorePercentage;
  attempt.grade = grade;
  attempt.percentile = percentile;
  attempt.timeSpentSeconds = timeSpentSeconds;
  attempt.timeEfficiency = Math.round((timeSpentSeconds / (totalQuestions * 90)) * 100);

  // Group by topic for topicScores
  const topicMap = new Map<string, { total: number; correct: number }>();
  detailedResults.forEach((r) => {
    const entry = topicMap.get(r.topic) || { total: 0, correct: 0 };
    entry.total += 1;
    if (r.isCorrect) entry.correct += 1;
    topicMap.set(r.topic, entry);
  });

  attempt.topicScores = Array.from(topicMap.entries()).map(([topic, data]) => {
    const pct = Math.round((data.correct / data.total) * 100);
    return {
      topic,
      percentage: pct,
      total: data.total,
      correct: data.correct,
      status: pct >= 80 ? 'mastered' : pct >= 50 ? 'improving' : 'weak',
    };
  });

  const weakestTopicEntry = attempt.topicScores.sort((a, b) => a.percentage - b.percentage)[0];
  if (weakestTopicEntry && weakestTopicEntry.percentage < 70) {
    attempt.weakestTopic = {
      name: weakestTopicEntry.topic,
      percentage: weakestTopicEntry.percentage,
      actionPlan: [
        `Review fundamental formula derivations for ${weakestTopicEntry.topic}.`,
        'Practice 5 targeted partial fraction and algebraic integration drills.',
        'Engage Socratic AI Coach to clarify conceptual ambiguities.',
      ],
    };
  }

  res.json({
    success: true,
    attempt,
    detailedResults,
    message: 'Exam submitted, verified and graded successfully by server.',
  });
});

// Get specific attempt with ownership check
apiRouter.get('/attempts/:attemptId', (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id || 'usr_student_1';
  const { attemptId } = req.params;

  const attempt = db.examAttempts.find((a) => a.id === attemptId);
  if (!attempt) return res.status(404).json({ error: 'Attempt not found' });

  // Ownership check (Teachers and Admins can view any attempt, Students only their own)
  if (req.user?.role === 'STUDENT' && attempt.userId !== userId) {
    return res.status(403).json({ error: 'Forbidden: You cannot access another student’s exam attempt.' });
  }

  res.json({ attempt });
});

// Get user's own completed attempts
apiRouter.get('/me/attempts', (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id || 'usr_student_1';
  const myAttempts = db.examAttempts.filter((a) => a.userId === userId);
  res.json({ attempts: myAttempts });
});

// ==========================================
// 7. MISTAKE INTELLIGENCE & REMEDIATION
// ==========================================
apiRouter.get('/mistakes', (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id || 'usr_student_1';
  const userMistakes = db.mistakes
    .filter((m) => m.userId === userId)
    .map((m) => {
      const q = db.questions.find((quest) => quest.id === m.questionId);
      return {
        ...m,
        question: q || m.question,
      };
    });

  res.json({ mistakes: userMistakes });
});

apiRouter.get('/mistakes/analytics', (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id || 'usr_student_1';
  const userMistakes = db.mistakes.filter((m) => m.userId === userId);

  const categoryCounts: Record<string, number> = {};
  userMistakes.forEach((m) => {
    categoryCounts[m.category] = (categoryCounts[m.category] || 0) + m.attemptCount;
  });

  const categoryBreakdown = Object.entries(categoryCounts).map(([category, count]) => ({
    category,
    count,
    percentage: Math.round((count / (userMistakes.reduce((a, b) => a + b.attemptCount, 0) || 1)) * 100),
  }));

  const sortedCategories = [...categoryBreakdown].sort((a, b) => b.count - a.count);

  res.json({
    totalUnresolved: userMistakes.filter((m) => !m.isResolved).length,
    totalMistakes: userMistakes.length,
    categoryBreakdown,
    topMistakeType: sortedCategories[0] || { category: 'Conceptual Error', count: 0 },
  });
});

apiRouter.post('/mistakes/resolve', (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id || 'usr_student_1';
  const { questionId } = req.body;

  const mistake = db.mistakes.find((m) => m.questionId === Number(questionId) && m.userId === userId);
  if (!mistake) return res.status(404).json({ error: 'Mistake item not found or unauthorized' });

  mistake.isResolved = true;
  mistake.correctCount += 1;
  mistake.resolvedAt = new Date().toISOString();

  res.json({ success: true, mistake });
});

// ==========================================
// 8. DAILY STUDY PLAN ENGINE
// ==========================================
apiRouter.get('/study-plan', (req: AuthenticatedRequest, res: Response) => {
  res.json({ plan: db.studyPlan });
});

apiRouter.post('/study-plan/toggle-task', (req: AuthenticatedRequest, res: Response) => {
  const { taskId } = req.body;
  const task = db.studyPlan.tasks.find((t) => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
    const completedTasks = db.studyPlan.tasks.filter((t) => t.completed);
    db.studyPlan.completedMinutes = completedTasks.reduce((acc, t) => acc + t.minutes, 0);
  }
  res.json({ plan: db.studyPlan });
});

// ==========================================
// 9. AI SOCRATIC COACH
// ==========================================
apiRouter.post('/ai-coach', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const response = await AiCoachEngine.handleCoachRequest(req.body);
    res.json(response);
  } catch (err: any) {
    res.status(500).json({ error: 'AI Coach Error', message: err.message });
  }
});

// ==========================================
// 10. HUMAN-LED TUTOR STUDIO
// ==========================================
apiRouter.get('/tutors', (req: AuthenticatedRequest, res: Response) => {
  // Combine db.tutors and any approved teacher accounts from db.users
  const userTutors: Tutor[] = db.users
    .filter((u) => u.role === 'TEACHER' && u.teacherStatus === 'APPROVED')
    .map((u) => {
      const expNumber = parseInt(u.teacherProfile?.experience || '10') || 10;
      return {
        id: `tut_${u.id}`,
        name: u.name,
        title: u.name,
        subject: u.teacherProfile?.subjects?.join(' & ') || 'Higher Mathematics & Physics',
        subjectsList: u.teacherProfile?.subjects || ['Higher Mathematics', 'Physics'],
        specialty: u.teacherProfile?.qualifications || 'Advanced Concept & Board Problem Solving',
        education: u.teacherProfile?.qualifications || u.institution || 'Verified Faculty Member',
        institution: u.institution || 'Verified National University Faculty',
        rating: 5.0,
        reviewCount: 42,
        yearsExperience: expNumber,
        totalStudentsTaught: 600,
        totalHoursTaught: 800,
        languages: ['Bangla', 'English'],
        hourlyRateBDT: u.teacherProfile?.hourlyRateBDT || 1200,
        avatarUrl: u.avatarUrl || 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&auto=format&fit=crop&q=80',
        isHighDemand: true,
        isAvailableToday: true,
        isAvailableNow: true,
        bio: u.teacherProfile?.bio || `${u.name} is a verified academic mentor at ${u.institution || 'Virtual Tutor'}.`,
        availableTimeSlots: ['04:00 PM - 05:00 PM', '06:30 PM - 07:30 PM', '08:00 PM - 09:00 PM'],
        badge: 'FACULTY',
      };
    });

  // Filter out duplicates by ID
  const allTutors = [...db.tutors];
  userTutors.forEach((ut) => {
    if (!allTutors.some((t) => t.id === ut.id)) {
      allTutors.push(ut);
    }
  });

  res.json({ tutors: allTutors });
});

apiRouter.get('/tutors/:id', (req: AuthenticatedRequest, res: Response) => {
  const tutorId = req.params.id;
  const tutor = db.tutors.find((t) => t.id === tutorId || t.id === `tut_${tutorId}`);
  if (tutor) return res.json({ tutor });

  const teacherUsers = db.users.filter((u) => u.role === 'TEACHER' && u.teacherStatus === 'APPROVED');
  const user = teacherUsers.find((u) => `tut_${u.id}` === tutorId || u.id === tutorId);
  if (!user) return res.status(404).json({ error: 'Tutor not found' });

  const fallbackTutor: Tutor = {
    id: `tut_${user.id}`,
    name: user.name,
    title: user.name,
    subject: user.teacherProfile?.subjects?.join(' & ') || 'Higher Mathematics & Physics',
    subjectsList: user.teacherProfile?.subjects || ['Higher Mathematics'],
    specialty: user.teacherProfile?.qualifications || 'Advanced Concept & Board Problem Solving',
    education: user.teacherProfile?.qualifications || user.institution || 'Verified Faculty Member',
    institution: user.institution || 'Verified National University Faculty',
    rating: 5.0,
    reviewCount: 42,
    yearsExperience: parseInt(user.teacherProfile?.experience || '10') || 10,
    totalStudentsTaught: 600,
    totalHoursTaught: 800,
    languages: ['Bangla', 'English'],
    hourlyRateBDT: user.teacherProfile?.hourlyRateBDT || 1200,
    avatarUrl: user.avatarUrl || 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&auto=format&fit=crop&q=80',
    isHighDemand: true,
    isAvailableToday: true,
    isAvailableNow: true,
    bio: user.teacherProfile?.bio || `${user.name} is a verified academic mentor at ${user.institution || 'Virtual Tutor'}.`,
    availableTimeSlots: ['04:00 PM - 05:00 PM', '06:30 PM - 07:30 PM', '08:00 PM - 09:00 PM'],
    badge: 'FACULTY',
  };
  res.json({ tutor: fallbackTutor });
});

apiRouter.post('/tutors/book', (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id || 'usr_istihad';
  const validation = TutorBookingSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({ error: 'Invalid booking data', details: validation.error.format() });
  }

  const { tutorId, date, timeSlot, subject, topic } = validation.data;
  const doubtDescription = req.body.doubtDescription || req.body.notes || '';
  
  // Lookup teacher from db.tutors or db.users
  const matchedTutor = db.tutors.find((t) => t.id === tutorId || t.id === `tut_${tutorId}`);
  const matchedUser = db.users.find((u) => u.role === 'TEACHER' && (`tut_${u.id}` === tutorId || u.id === tutorId));
  
  const tutorName = matchedTutor?.name || matchedUser?.name || 'Verified Faculty Member';
  const tutorAvatar = matchedTutor?.avatarUrl || matchedUser?.avatarUrl || 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&auto=format&fit=crop&q=80';
  const tutorSpecialty = matchedTutor?.specialty || matchedUser?.teacherProfile?.qualifications || 'Academic Mentor';
  const tutorRate = matchedTutor?.hourlyRateBDT || matchedUser?.teacherProfile?.hourlyRateBDT || 1200;

  const meetingCode = `VT-${subject.slice(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newBooking: TutorBooking = {
    id: `bk_${Date.now()}`,
    userId,
    tutorId,
    studentName: req.user?.name || 'Istihad Ahmed',
    tutorName,
    tutorAvatar,
    tutorSpecialty,
    date,
    timeSlot,
    subject,
    topic,
    status: 'CONFIRMED',
    rateBDT: tutorRate,
    meetingCode,
    sessionNotes: `Target topic: ${topic}. Diagnostic problem solving and concept remediation.`,
    doubtDescription,
    createdAt: new Date().toISOString(),
  };

  db.bookings.unshift(newBooking);
  res.json({ success: true, booking: newBooking });
});

apiRouter.post('/tutors/bookings/:bookingId/cancel', (req: AuthenticatedRequest, res: Response) => {
  const { bookingId } = req.params;
  const booking = db.bookings.find((b) => b.id === bookingId);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  booking.status = 'CANCELLED';
  res.json({ success: true, booking, message: 'Session cancelled successfully.' });
});

apiRouter.get('/tutors/my-bookings', (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id || 'usr_istihad';
  if (req.user?.role === 'TEACHER') {
    // Return sessions assigned to this tutor/teacher
    const tutorBookings = db.bookings.filter(
      (b) => b.tutorId === `tut_${req.user?.id}` || b.tutorId === req.user?.id || b.tutorName === req.user?.name
    );
    return res.json({ bookings: tutorBookings });
  }

  // Student bookings
  const studentBookings = db.bookings.filter((b) => b.userId === userId || !b.userId);
  res.json({ bookings: studentBookings });
});

apiRouter.put('/tutors/bookings/:bookingId', requireRole(['TEACHER', 'ADMIN', 'STUDENT']), (req: AuthenticatedRequest, res: Response) => {
  const { bookingId } = req.params;
  const { sessionNotes, status, prescription } = req.body;

  const booking = db.bookings.find((b) => b.id === bookingId);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  if (sessionNotes !== undefined) booking.sessionNotes = sessionNotes;
  if (status !== undefined) booking.status = status;
  if (prescription !== undefined) booking.prescription = prescription;

  res.json({ success: true, booking });
});

// Rapid 15-Minute SOS Doubt Matching
apiRouter.post('/tutors/sos/request', (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id || 'usr_istihad';
  const userName = req.user?.name || 'Istihad Ahmed';
  const { subject, topic, urgency, doubtDescription } = req.body;

  // Find an available online tutor
  const onlineTutor = db.tutors.find((t) => t.isAvailableNow && (t.subject.toLowerCase().includes((subject || '').toLowerCase()) || t.subjectsList?.some(s => s.toLowerCase().includes((subject || '').toLowerCase())))) || db.tutors[0];

  const sosReq: TutorSOSRequest = {
    id: `sos_${Date.now()}`,
    studentId: userId,
    studentName: userName,
    subject: subject || 'Higher Mathematics',
    topic: topic || 'High-Yield Doubt Solving',
    urgency: urgency || 'HIGH',
    doubtDescription: doubtDescription || 'Immediate 15-min problem solving consultation requested.',
    assignedTutorId: onlineTutor?.id || 'tut_1',
    assignedTutorName: onlineTutor?.name || 'Dr. Tariq Rahman',
    status: 'MATCHED',
    meetingCode: `VT-SOS-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
  };

  db.tutorSOSQueue.unshift(sosReq);

  // Also auto-create a confirmed instant booking so it appears in live session dashboard
  const instantBooking: TutorBooking = {
    id: `bk_sos_${Date.now()}`,
    userId,
    tutorId: sosReq.assignedTutorId!,
    studentName: userName,
    tutorName: sosReq.assignedTutorName!,
    tutorAvatar: onlineTutor?.avatarUrl,
    tutorSpecialty: onlineTutor?.specialty,
    date: 'Right Now (15-Min SOS)',
    timeSlot: 'Instant Live Room',
    subject: sosReq.subject,
    topic: sosReq.topic,
    status: 'CONFIRMED',
    rateBDT: 350,
    meetingCode: sosReq.meetingCode,
    doubtDescription: sosReq.doubtDescription,
    sessionNotes: 'Rapid 15-minute emergency doubt solving room. Focused on immediate blocker resolution.',
    createdAt: new Date().toISOString(),
  };
  db.bookings.unshift(instantBooking);

  res.json({ success: true, sosRequest: sosReq, booking: instantBooking });
});

apiRouter.get('/tutors/sos/my-requests', (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id || 'usr_istihad';
  const requests = db.tutorSOSQueue.filter((r) => r.studentId === userId);
  res.json({ requests });
});

// Tutor Direct Messaging
apiRouter.get('/tutors/messages/:tutorId', (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id || 'usr_istihad';
  const { tutorId } = req.params;
  const messages = db.tutorMessages.filter((m) => m.tutorId === tutorId && m.userId === userId);
  res.json({ messages });
});

apiRouter.post('/tutors/messages', (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id || 'usr_istihad';
  const userName = req.user?.name || 'Istihad Ahmed';
  const { tutorId, text, doubtTopic } = req.body;

  if (!tutorId || !text) {
    return res.status(400).json({ error: 'tutorId and text are required' });
  }

  const newMsg: TutorMessage = {
    id: `tmsg_${Date.now()}`,
    senderId: userId,
    senderName: userName,
    senderRole: 'STUDENT',
    tutorId,
    userId,
    text,
    timestamp: 'Just now',
    doubtTopic,
  };

  db.tutorMessages.push(newMsg);

  // Auto-respond from faculty after a brief acknowledgment if it's the first query
  const tutor = db.tutors.find((t) => t.id === tutorId);
  const tutorReply: TutorMessage = {
    id: `tmsg_reply_${Date.now()}`,
    senderId: tutorId,
    senderName: tutor?.name || 'Dr. Tariq Rahman',
    senderRole: 'TEACHER',
    tutorId,
    userId,
    text: `Thank you for reaching out, Istihad! I have received your question regarding "${doubtTopic || 'your study query'}". We can thoroughly dissect this step-by-step during our 1-on-1 live session, or feel free to attach an image snapshot of the specific equation.`,
    timestamp: 'Just now',
    doubtTopic,
  };
  db.tutorMessages.push(tutorReply);

  res.json({ success: true, message: newMsg, reply: tutorReply });
});

// ==========================================
// 11. ADMIN CONTENT WORKSPACE (STRICT ADMIN ACCESS)
// ==========================================
apiRouter.get('/admin/stats', requireRole(['ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const draftCount = db.questions.filter((q) => q.status === 'DRAFT').length;
  const reviewedCount = db.questions.filter((q) => q.status === 'REVIEWED').length;
  const publishedCount = db.questions.filter((q) => q.status === 'PUBLISHED').length;
  const archivedCount = db.questions.filter((q) => q.status === 'ARCHIVED').length;

  res.json({
    totalQuestions: db.questions.length,
    draftCount,
    reviewedCount,
    publishedCount,
    archivedCount,
    totalSubjects: db.subjects.length,
    totalExamSets: db.examSets.length,
    totalUsers: db.users.length,
  });
});

apiRouter.get('/admin/questions', requireRole(['ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const { status, subjectId, difficulty } = req.query;
  let questions = db.questions;

  if (status) {
    questions = questions.filter((q) => q.status === status);
  }
  if (subjectId) {
    questions = questions.filter((q) => q.subjectId === subjectId);
  }
  if (difficulty) {
    questions = questions.filter((q) => q.difficulty === difficulty);
  }

  res.json({ questions });
});

apiRouter.post('/admin/questions', requireRole(['ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const validation = QuestionCreateSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: 'Validation failed', details: validation.error.format() });
  }

  const newId = Math.max(...db.questions.map((q) => q.id), 0) + 1;
  const newQuestion: Question = {
    ...validation.data,
    id: newId,
    status: 'DRAFT', // New questions always start in DRAFT
    version: 1,
    createdBy: req.user?.id || 'usr_admin_1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.questions.unshift(newQuestion);
  db.recordAudit(
    req.user?.id || 'admin',
    req.user?.email || 'admin@virtualtutor.bd',
    req.user?.role || 'ADMIN',
    'CONTENT_CREATED',
    'Question',
    String(newId),
    `Created new question #${newId} in DRAFT status: ${newQuestion.titleEn}`
  );

  res.status(201).json({ success: true, question: newQuestion });
});

apiRouter.put('/admin/questions/:id', requireRole(['ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const id = Number(req.params.id);
  const question = db.questions.find((q) => q.id === id);
  if (!question) return res.status(404).json({ error: 'Question not found' });

  // Save version snapshot before mutation
  db.contentVersions.push({
    id: `ver_${Date.now()}`,
    questionId: question.id,
    versionNumber: question.version,
    snapshot: JSON.parse(JSON.stringify(question)),
    changedBy: req.user?.id || 'admin',
    timestamp: new Date().toISOString(),
  });

  // Apply updates
  Object.assign(question, req.body, {
    id,
    version: question.version + 1,
    updatedAt: new Date().toISOString(),
  });

  db.recordAudit(
    req.user?.id || 'admin',
    req.user?.email || 'admin@virtualtutor.bd',
    req.user?.role || 'ADMIN',
    'CONTENT_EDITED',
    'Question',
    String(id),
    `Updated question #${id} to version ${question.version}`
  );

  res.json({ success: true, question });
});

apiRouter.post('/admin/questions/:id/review', requireRole(['ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const id = Number(req.params.id);
  const question = db.questions.find((q) => q.id === id);
  if (!question) return res.status(404).json({ error: 'Question not found' });

  question.status = 'REVIEWED';
  question.reviewedBy = req.user?.id;
  question.updatedAt = new Date().toISOString();

  db.recordAudit(
    req.user?.id || 'admin',
    req.user?.email || 'admin@virtualtutor.bd',
    req.user?.role || 'ADMIN',
    'CONTENT_REVIEWED',
    'Question',
    String(id),
    `Marked question #${id} as REVIEWED`
  );

  res.json({ success: true, question });
});

apiRouter.post('/admin/questions/:id/publish', requireRole(['ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const id = Number(req.params.id);
  const question = db.questions.find((q) => q.id === id);
  if (!question) return res.status(404).json({ error: 'Question not found' });

  question.status = 'PUBLISHED';
  question.publishedBy = req.user?.id;
  question.publishedAt = new Date().toISOString();
  question.updatedAt = new Date().toISOString();

  db.recordAudit(
    req.user?.id || 'admin',
    req.user?.email || 'admin@virtualtutor.bd',
    req.user?.role || 'ADMIN',
    'CONTENT_PUBLISHED',
    'Question',
    String(id),
    `Published question #${id} to live student pool`
  );

  res.json({ success: true, question });
});

apiRouter.post('/admin/questions/:id/archive', requireRole(['ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const id = Number(req.params.id);
  const question = db.questions.find((q) => q.id === id);
  if (!question) return res.status(404).json({ error: 'Question not found' });

  question.status = 'ARCHIVED';
  question.updatedAt = new Date().toISOString();

  db.recordAudit(
    req.user?.id || 'admin',
    req.user?.email || 'admin@virtualtutor.bd',
    req.user?.role || 'ADMIN',
    'CONTENT_ARCHIVED',
    'Question',
    String(id),
    `Archived question #${id}`
  );

  res.json({ success: true, question });
});

apiRouter.get('/admin/audit-logs', requireRole(['ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  res.json({ auditLogs: db.auditLogs });
});

// ==========================================
// 12. LIVE ONLINE CLASSES & TUITION
// ==========================================

// Get all available live & scheduled classes
apiRouter.get('/live-classes', (req: AuthenticatedRequest, res: Response) => {
  const classes = db.liveClasses.map((c) => ({
    ...c,
    isEnrolled: req.user ? c.enrolledStudentIds.includes(req.user.id) : false,
    isTeacher: req.user ? c.teacherId === req.user.id : false,
  }));
  res.json({ classes });
});

// Get single live class details
apiRouter.get('/live-classes/:id', (req: AuthenticatedRequest, res: Response) => {
  const cls = db.liveClasses.find((c) => c.id === req.params.id);
  if (!cls) return res.status(404).json({ error: 'Live class not found' });

  res.json({
    class: cls,
    isEnrolled: req.user ? cls.enrolledStudentIds.includes(req.user.id) : false,
    isTeacher: req.user ? cls.teacherId === req.user.id : false,
  });
});

// Student enrolls in class
apiRouter.post('/live-classes/:id/enroll', (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const cls = db.liveClasses.find((c) => c.id === req.params.id);
  if (!cls) return res.status(404).json({ error: 'Live class not found' });

  if (!cls.enrolledStudentIds.includes(req.user.id)) {
    if (cls.enrolledCount >= cls.maxStudents) {
      return res.status(400).json({ error: 'Class is full' });
    }
    cls.enrolledStudentIds.push(req.user.id);
    cls.enrolledCount += 1;
  }

  res.json({ success: true, class: cls, message: 'Successfully enrolled in live class!' });
});

// Join class session
apiRouter.post('/live-classes/:id/join', (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const cls = db.liveClasses.find((c) => c.id === req.params.id);
  if (!cls) return res.status(404).json({ error: 'Live class not found' });

  if (!cls.enrolledStudentIds.includes(req.user.id)) {
    cls.enrolledStudentIds.push(req.user.id);
    cls.enrolledCount += 1;
  }

  res.json({
    success: true,
    class: cls,
    meetingCode: cls.meetingCode,
    roleInClass: req.user.id === cls.teacherId ? 'HOST' : 'STUDENT',
  });
});

// ==========================================
// 13. TEACHER DASHBOARD & WORKSPACE
// ==========================================

// Teacher Dashboard Metrics
apiRouter.get('/teacher/dashboard-stats', (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || req.user.role !== 'TEACHER') {
    return res.status(403).json({ error: 'Teacher access required' });
  }

  const teacherClasses = db.liveClasses.filter((c) => c.teacherId === req.user?.id);
  const totalEnrolled = teacherClasses.reduce((sum, c) => sum + c.enrolledCount, 0);
  const liveCount = teacherClasses.filter((c) => c.status === 'LIVE').length;
  const scheduledCount = teacherClasses.filter((c) => c.status === 'SCHEDULED').length;

  res.json({
    teacherStatus: req.user.teacherStatus || 'PENDING',
    profile: req.user.teacherProfile,
    stats: {
      totalClasses: teacherClasses.length,
      totalStudentsEnrolled: totalEnrolled,
      activeLiveClasses: liveCount,
      upcomingClasses: scheduledCount,
      rating: 4.95,
      totalHoursTaught: 48,
      earningsBDT: totalEnrolled * 650,
    },
    classes: teacherClasses,
    recentStudents: db.users
      .filter((u) => u.role === 'STUDENT')
      .slice(0, 5)
      .map((s) => ({
        id: s.id,
        name: s.name,
        targetExam: s.targetExam,
        masteryScore: s.targetScore,
        avatarUrl: s.avatarUrl,
      })),
  });
});

// Teacher creates new Live Class (Requires APPROVED status)
apiRouter.post('/teacher/classes', requireApprovedTeacher, (req: AuthenticatedRequest, res: Response) => {
  const parseResult = LiveClassCreateSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: 'ValidationFailed',
      details: parseResult.error.issues.map((e) => e.message),
    });
  }

  const { title, subject, topic, scheduledAt, durationMinutes, maxStudents, description } = parseResult.data;
  const user = req.user!;

  const newClass: LiveClass = {
    id: `class_live_${Date.now()}`,
    title,
    subject,
    topic,
    teacherId: user.id,
    teacherName: user.name,
    teacherAvatar: user.avatarUrl,
    scheduledAt,
    durationMinutes,
    maxStudents,
    enrolledCount: 1,
    status: 'SCHEDULED',
    meetingCode: `VT-${subject.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
    description,
    enrolledStudentIds: [],
  };

  db.liveClasses.unshift(newClass);

  db.recordAudit(
    user.id,
    user.email,
    'TEACHER',
    'CONTENT_CREATED',
    'LiveClass',
    newClass.id,
    `Created new scheduled live class: ${newClass.title}`
  );

  res.status(201).json({ success: true, class: newClass, message: 'Live class created successfully!' });
});

// Teacher starts a class (Go Live)
apiRouter.post('/teacher/classes/:id/start', requireApprovedTeacher, (req: AuthenticatedRequest, res: Response) => {
  const cls = db.liveClasses.find((c) => c.id === req.params.id && c.teacherId === req.user?.id);
  if (!cls) return res.status(404).json({ error: 'Class not found or unauthorized' });

  cls.status = 'LIVE';

  db.recordAudit(
    req.user!.id,
    req.user!.email,
    'TEACHER',
    'CONTENT_PUBLISHED',
    'LiveClass',
    cls.id,
    `Started Live Broadcast for class: ${cls.title}`
  );

  res.json({ success: true, class: cls, message: 'Class is now LIVE!' });
});

// Teacher ends a class
apiRouter.post('/teacher/classes/:id/end', requireApprovedTeacher, (req: AuthenticatedRequest, res: Response) => {
  const cls = db.liveClasses.find((c) => c.id === req.params.id && c.teacherId === req.user?.id);
  if (!cls) return res.status(404).json({ error: 'Class not found or unauthorized' });

  cls.status = 'ENDED';

  db.recordAudit(
    req.user!.id,
    req.user!.email,
    'TEACHER',
    'CONTENT_ARCHIVED',
    'LiveClass',
    cls.id,
    `Ended Live Broadcast for class: ${cls.title}`
  );

  res.json({ success: true, class: cls, message: 'Class session concluded.' });
});

// ==========================================
// 14. ADMIN TEACHER VERIFICATION WORKFLOW
// ==========================================

// Get all registered teachers with their verification status
apiRouter.get('/admin/teachers', requireRole(['ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const teachers = db.users
    .filter((u) => u.role === 'TEACHER')
    .map((t) => ({
      id: t.id,
      name: t.name,
      email: t.email,
      phone: t.phone,
      teacherStatus: t.teacherStatus || 'PENDING',
      teacherProfile: t.teacherProfile,
      institution: t.institution,
      createdAt: t.createdAt,
      avatarUrl: t.avatarUrl,
    }));

  res.json({
    teachers,
    counts: {
      pending: teachers.filter((t) => t.teacherStatus === 'PENDING').length,
      approved: teachers.filter((t) => t.teacherStatus === 'APPROVED').length,
      rejected: teachers.filter((t) => t.teacherStatus === 'REJECTED').length,
      suspended: teachers.filter((t) => t.teacherStatus === 'SUSPENDED').length,
    },
  });
});

// Admin approves teacher application
apiRouter.post('/admin/teachers/:id/approve', requireRole(['ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const teacher = db.users.find((u) => u.id === req.params.id && u.role === 'TEACHER');
  if (!teacher) return res.status(404).json({ error: 'Teacher not found' });

  teacher.teacherStatus = 'APPROVED';
  if (teacher.teacherProfile) {
    teacher.teacherProfile.reviewedAt = new Date().toISOString();
    teacher.teacherProfile.reviewedBy = req.user?.id;
    teacher.teacherProfile.verificationNotes = req.body.notes || 'Approved credentials and academic pedigree.';
  }

  db.recordAudit(
    req.user?.id || 'admin',
    req.user?.email || 'admin@virtualtutor.bd',
    'ADMIN',
    'ROLE_CHANGED',
    'User',
    teacher.id,
    `Approved teacher credentials for ${teacher.name} (${teacher.email})`
  );

  res.json({
    success: true,
    teacher,
    message: `${teacher.name} has been APPROVED. They now have full teacher dashboard access and live class permissions.`,
  });
});

// Admin rejects teacher application
apiRouter.post('/admin/teachers/:id/reject', requireRole(['ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const teacher = db.users.find((u) => u.id === req.params.id && u.role === 'TEACHER');
  if (!teacher) return res.status(404).json({ error: 'Teacher not found' });

  teacher.teacherStatus = 'REJECTED';
  if (teacher.teacherProfile) {
    teacher.teacherProfile.reviewedAt = new Date().toISOString();
    teacher.teacherProfile.reviewedBy = req.user?.id;
    teacher.teacherProfile.verificationNotes = req.body.reason || 'Credentials could not be verified.';
  }

  db.recordAudit(
    req.user?.id || 'admin',
    req.user?.email || 'admin@virtualtutor.bd',
    'ADMIN',
    'ROLE_CHANGED',
    'User',
    teacher.id,
    `Rejected teacher application for ${teacher.name}`
  );

  res.json({ success: true, teacher, message: `Teacher application for ${teacher.name} has been rejected.` });
});

// Admin suspends teacher account
apiRouter.post('/admin/teachers/:id/suspend', requireRole(['ADMIN']), (req: AuthenticatedRequest, res: Response) => {
  const teacher = db.users.find((u) => u.id === req.params.id && u.role === 'TEACHER');
  if (!teacher) return res.status(404).json({ error: 'Teacher not found' });

  teacher.teacherStatus = 'SUSPENDED';

  db.recordAudit(
    req.user?.id || 'admin',
    req.user?.email || 'admin@virtualtutor.bd',
    'ADMIN',
    'ROLE_CHANGED',
    'User',
    teacher.id,
    `Suspended teacher account for ${teacher.name}`
  );

  res.json({ success: true, teacher, message: `Teacher account for ${teacher.name} has been suspended.` });
});

// Teacher submits an appeal or updates application documentation
apiRouter.post('/teacher/application/appeal', (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || req.user.role !== 'TEACHER') {
    return res.status(403).json({ error: 'Teacher access required' });
  }

  const { qualifications, experience, subjects, bio, appealNotes } = req.body;
  const user = req.user;

  if (user.teacherProfile) {
    if (qualifications) user.teacherProfile.qualifications = qualifications;
    if (experience) user.teacherProfile.experience = experience;
    if (subjects) user.teacherProfile.subjects = subjects;
    if (bio) user.teacherProfile.bio = bio;
    user.teacherProfile.verificationNotes = appealNotes || 'Resubmitted credentials for academic review';
    user.teacherProfile.submittedAt = new Date().toISOString();
  }

  user.teacherStatus = 'PENDING';

  db.recordAudit(
    user.id,
    user.email,
    'TEACHER',
    'ROLE_CHANGED',
    'User',
    user.id,
    `Resubmitted teacher application for review (Appeal notes: ${appealNotes || 'None'})`
  );

  res.json({
    success: true,
    user,
    message: 'Your updated credentials and appeal have been resubmitted to the Academic Board for review.',
  });
});

// Demo/Testing status simulation endpoint
apiRouter.post('/teacher/status/simulate', (req: AuthenticatedRequest, res: Response) => {
  if (!req.user || (req.user.role !== 'TEACHER' && req.user.role !== 'ADMIN')) {
    return res.status(403).json({ error: 'Teacher or Admin access required' });
  }

  const { status, notes } = req.body;
  if (!['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Must be PENDING, APPROVED, REJECTED, or SUSPENDED.' });
  }

  req.user.teacherStatus = status;
  if (req.user.teacherProfile) {
    req.user.teacherProfile.verificationNotes = notes || `Status updated to ${status} via Teacher Verification Control Panel`;
    if (status === 'APPROVED') {
      req.user.teacherProfile.reviewedAt = new Date().toISOString();
      req.user.teacherProfile.reviewedBy = 'usr_admin_sme';
    }
  }

  db.recordAudit(
    req.user.id,
    req.user.email,
    req.user.role,
    'ROLE_CHANGED',
    'User',
    req.user.id,
    `Simulated teacher verification status: ${status}`
  );

  res.json({
    success: true,
    user: req.user,
    teacherStatus: status,
    message: `Teacher status set to ${status}.`,
  });
});

