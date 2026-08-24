import { db } from '../db/store.js';
import { MistakeItem, MistakeCategory } from '../types/index.js';

export class MistakeService {
  static getMistakes(userId: string = 'usr_student_1'): MistakeItem[] {
    return db.mistakes.filter((m) => m.userId === userId);
  }

  static getMistakeAnalytics(userId: string = 'usr_student_1') {
    const mistakes = db.mistakes.filter((m) => m.userId === userId);
    const categoryCounts: Record<string, number> = {};

    mistakes.forEach((m) => {
      categoryCounts[m.category] = (categoryCounts[m.category] || 0) + m.attemptCount;
    });

    const categoryBreakdown = Object.entries(categoryCounts).map(([category, count]) => ({
      category,
      count,
      percentage: Math.round((count / (mistakes.reduce((a, b) => a + b.attemptCount, 0) || 1)) * 100),
    }));

    const sortedCategories = [...categoryBreakdown].sort((a, b) => b.count - a.count);

    return {
      totalUnresolved: mistakes.filter((m) => !m.isResolved).length,
      totalMistakes: mistakes.length,
      categoryBreakdown,
      topMistakeType: sortedCategories[0] || { category: 'Conceptual Error', count: 0 },
    };
  }

  static recordMistake(
    questionId: number,
    studentAnswer: string,
    category: MistakeCategory = 'Conceptual Error',
    userId: string = 'usr_student_1'
  ): MistakeItem {
    const question = db.questions.find((q) => q.id === questionId) || db.questions[0];
    const existing = db.mistakes.find((m) => m.questionId === questionId && m.userId === userId);

    if (existing) {
      existing.attemptCount += 1;
      existing.studentAnswer = studentAnswer;
      existing.category = category;
      existing.lastAttempted = new Date().toISOString();
      existing.isResolved = false;
      return existing;
    }

    const newMistake: MistakeItem = {
      id: `mst_${Date.now()}`,
      userId,
      questionId,
      category,
      studentAnswer,
      correctAnswer: question.correctOptionId,
      attemptCount: 1,
      correctCount: 0,
      lastAttempted: new Date().toISOString(),
      isResolved: false,
      notes: `Identified during drill on ${question.topicName}`,
      question,
    };

    db.mistakes.unshift(newMistake);
    return newMistake;
  }

  static resolveMistake(questionId: number, userId: string = 'usr_student_1'): boolean {
    const mistake = db.mistakes.find((m) => m.questionId === questionId && m.userId === userId);
    if (mistake) {
      mistake.isResolved = true;
      mistake.correctCount += 1;
      mistake.resolvedAt = new Date().toISOString();
      return true;
    }
    return false;
  }
}
