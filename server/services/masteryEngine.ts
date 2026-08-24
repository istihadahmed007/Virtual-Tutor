import { db } from '../db/store.js';
import { TopicMastery, SubjectMastery } from '../types/index.js';

export class MasteryEngine {
  /**
   * Calculates dynamic mastery score (0-100)
   */
  static calculateTopicMastery(
    topicName: string,
    history: { isCorrect: boolean; difficulty: 'Easy' | 'Medium' | 'Hard' | 'Exam-Level'; timestamp: number }[]
  ): number {
    if (history.length === 0) return 50.0;

    const total = history.length;
    const correctCount = history.filter((h) => h.isCorrect).length;
    const rawAccuracy = (correctCount / total) * 100;

    // Recent attempts weighting (last 5 attempts)
    const recent = history.slice(-5);
    const recentCorrect = recent.filter((r) => r.isCorrect).length;
    const recentAccuracy = (recentCorrect / recent.length) * 100;

    // Difficulty scaling
    const difficultyWeights = { Easy: 0.8, Medium: 1.0, Hard: 1.25, 'Exam-Level': 1.4 };
    const avgDifficultyWeight =
      history.reduce((acc, h) => acc + (difficultyWeights[h.difficulty] || 1.0), 0) / total;

    // Time decay
    const lastAttempt = history[history.length - 1];
    const daysSinceLastPractice = Math.max(
      0,
      (Date.now() - lastAttempt.timestamp) / (1000 * 60 * 60 * 24)
    );
    const retentionDecay = Math.max(0.7, 1 - daysSinceLastPractice * 0.015);

    let compositeScore =
      (rawAccuracy * 0.4 + recentAccuracy * 0.45 + (avgDifficultyWeight * 20)) * retentionDecay;

    const topicMistakes = db.mistakes.filter(
      (m) => m.question?.topicName.toLowerCase() === topicName.toLowerCase() && !m.isResolved
    );
    if (topicMistakes.length > 0) {
      compositeScore -= topicMistakes.length * 4;
    }

    return Math.min(100, Math.max(5, Math.round(compositeScore)));
  }

  /**
   * Update mastery for a topic when a new question attempt is recorded
   */
  static recordAttempt(
    topicName: string,
    subject: string,
    isCorrect: boolean,
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Exam-Level' = 'Medium'
  ): TopicMastery {
    let mastery = db.masteries.find((m) => m.topic === topicName);

    if (!mastery) {
      mastery = {
        topic: topicName,
        subject,
        masteryScore: isCorrect ? 60 : 40,
        accuracyPercentage: isCorrect ? 100 : 0,
        totalAttempts: 1,
        correctAttempts: isCorrect ? 1 : 0,
        recentAttempts: [isCorrect],
        lastPracticedDate: new Date().toISOString(),
        decayedScore: isCorrect ? 60 : 40,
        status: isCorrect ? 'improving' : 'critical',
      };
      db.masteries.push(mastery);
    } else {
      mastery.totalAttempts += 1;
      if (isCorrect) mastery.correctAttempts += 1;
      mastery.recentAttempts = [...mastery.recentAttempts.slice(-4), isCorrect];
      mastery.accuracyPercentage = Math.round((mastery.correctAttempts / mastery.totalAttempts) * 100);
      mastery.lastPracticedDate = new Date().toISOString();

      const recentWeight = mastery.recentAttempts.filter(Boolean).length / mastery.recentAttempts.length;
      const baseScore = mastery.accuracyPercentage * 0.4 + recentWeight * 100 * 0.6;
      mastery.masteryScore = Math.min(100, Math.max(5, Math.round(baseScore)));
      mastery.decayedScore = mastery.masteryScore;
      mastery.status =
        mastery.masteryScore >= 80 ? 'mastered' : mastery.masteryScore >= 50 ? 'improving' : 'critical';
    }

    return mastery;
  }

  /**
   * Returns full aggregated mastery overview
   */
  static getMasteryOverview() {
    const allTopics = db.masteries;
    if (allTopics.length === 0) {
      return {
        overallScore: 50,
        weakestTopics: [],
        strongestTopics: [],
        subjectMasteries: [],
      };
    }

    const overallScore = Math.round(
      allTopics.reduce((acc, t) => acc + t.masteryScore, 0) / allTopics.length
    );

    const subjectsMap = new Map<string, TopicMastery[]>();
    for (const t of allTopics) {
      const list = subjectsMap.get(t.subject) || [];
      list.push(t);
      subjectsMap.set(t.subject, list);
    }

    const subjectMasteries: SubjectMastery[] = Array.from(subjectsMap.entries()).map(
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

    const sortedGlobal = [...allTopics].sort((a, b) => a.masteryScore - b.masteryScore);

    return {
      overallScore,
      weakestTopics: sortedGlobal.filter((t) => t.masteryScore < 60),
      strongestTopics: sortedGlobal.filter((t) => t.masteryScore >= 75),
      subjectMasteries,
      criticalAlert: sortedGlobal[0] || null,
    };
  }
}
