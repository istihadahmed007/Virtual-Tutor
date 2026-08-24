import { db } from '../db/store.js';
import { Question } from '../types/index.js';

export class AdaptiveQuestionEngine {
  /**
   * Recommends the next optimal question based on topic mastery, mistake history, and difficulty ladder
   */
  static getNextAdaptiveQuestion(subject?: string, topic?: string): Question {
    const allQuestions = db.questions.filter((q) => q.status === 'PUBLISHED');

    // Filter by subject/topic if provided
    let candidatePool = allQuestions;
    if (subject && subject !== 'All') {
      candidatePool = candidatePool.filter(
        (q) => q.subjectName.toLowerCase() === subject.toLowerCase() || q.subjectId === subject
      );
    }
    if (topic) {
      const topicMatches = candidatePool.filter(
        (q) =>
          q.topicName.toLowerCase().includes(topic.toLowerCase()) ||
          topic.toLowerCase().includes(q.topicName.toLowerCase())
      );
      if (topicMatches.length > 0) {
        candidatePool = topicMatches;
      }
    }

    if (candidatePool.length === 0) {
      candidatePool = allQuestions;
    }

    // Determine student mastery level for the candidate topics
    const targetTopic = candidatePool[0]?.topicName || 'General';
    const mastery = db.masteries.find((m) => m.topic === targetTopic);
    const masteryScore = mastery ? mastery.masteryScore : 50;

    // Priority 1: Check if there's an unresolved mistake in this topic
    const unresolvedMistake = db.mistakes.find(
      (m) =>
        !m.isResolved &&
        (m.question?.topicName.toLowerCase() === targetTopic.toLowerCase() ||
          candidatePool.some((q) => q.id === m.questionId))
    );

    if (unresolvedMistake) {
      const mistakeQ = allQuestions.find((q) => q.id === unresolvedMistake.questionId);
      if (mistakeQ) return mistakeQ;
    }

    // Priority 2: Target appropriate difficulty based on mastery tier
    let targetDifficulty: 'Easy' | 'Medium' | 'Hard' | 'Exam-Level' = 'Medium';
    if (masteryScore < 45) {
      targetDifficulty = 'Easy';
    } else if (masteryScore >= 75) {
      targetDifficulty = 'Hard';
    } else {
      targetDifficulty = 'Medium';
    }

    const matchedByDifficulty = candidatePool.filter((q) => q.difficulty === targetDifficulty);
    if (matchedByDifficulty.length > 0) {
      return matchedByDifficulty[Math.floor(Math.random() * matchedByDifficulty.length)];
    }

    return candidatePool[Math.floor(Math.random() * candidatePool.length)] || allQuestions[0];
  }

  /**
   * Generates an adaptive session of questions
   */
  static generateAdaptiveSession(count: number = 10, subject?: string, topic?: string): Question[] {
    const questions: Question[] = [];
    const published = db.questions.filter((q) => q.status === 'PUBLISHED');
    const pool =
      subject && subject !== 'All'
        ? published.filter(
            (q) => q.subjectName.toLowerCase() === subject.toLowerCase() || q.subjectId === subject
          )
        : published;

    const sourcePool = pool.length > 0 ? pool : published;

    for (let i = 0; i < count; i++) {
      const index = i % sourcePool.length;
      questions.push({
        ...sourcePool[index],
        id: sourcePool[index].id,
      });
    }

    return questions;
  }
}
