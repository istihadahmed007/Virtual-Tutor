import { db } from '../db/store.js';
import { DailyStudyPlan, StudyPlanTask } from '../types/index.js';
import { MasteryEngine } from './masteryEngine.js';

export class StudyPlanEngine {
  static getTodayPlan(): DailyStudyPlan {
    const overview = MasteryEngine.getMasteryOverview();
    const weakestTopic = overview.weakestTopics[0] || { topic: 'Calculus: Integration by Parts', subject: 'Higher Mathematics' };
    const unresolvedMistakes = db.mistakes.filter((m) => !m.isResolved);

    // Refresh plan based on latest student state
    const tasks: StudyPlanTask[] = [
      {
        id: 'task_1',
        title: `Targeted Drill: ${weakestTopic.topic}`,
        topic: weakestTopic.topic,
        subject: weakestTopic.subject,
        minutes: 20,
        completed: false,
        priority: 'high',
        type: 'drill',
        reason: `Mastery is at critical level (${weakestTopic.masteryScore}%) — essential for BUET target`,
      },
      {
        id: 'task_2',
        title: 'Socratic Concept Deep-Dive with AI Coach',
        topic: weakestTopic.topic,
        subject: weakestTopic.subject,
        minutes: 15,
        completed: true,
        priority: 'high',
        type: 'socratic',
        reason: 'Eliminate foundational misconceptions before full mock',
      },
      {
        id: 'task_3',
        title: `Mistake Book Clear (${unresolvedMistakes.length} Flagged Questions)`,
        topic: unresolvedMistakes[0]?.question?.topicName || 'Calculus & Algebra',
        subject: unresolvedMistakes[0]?.question?.subjectName || 'Higher Mathematics',
        minutes: 15,
        completed: false,
        priority: 'medium',
        type: 'review',
        reason: 'Spaced repetition re-attempt to solidify learning retention',
      },
      {
        id: 'task_4',
        title: 'Physics Mechanics & Waves Timed Mini-Mock',
        topic: 'Isothermal Expansion & Kinematics',
        subject: 'Physics',
        minutes: 25,
        completed: false,
        priority: 'medium',
        type: 'mock',
        reason: 'Maintain speed pacing under strict examination constraints',
      },
      {
        id: 'task_5',
        title: 'Formulas & Quick Reagents Review',
        topic: 'Organic Chemistry & Discriminants',
        subject: 'Chemistry',
        minutes: 15,
        completed: false,
        priority: 'low',
        type: 'drill',
        reason: 'Consolidate high-yield memory items',
      },
    ];

    db.studyPlan.tasks = tasks;
    db.studyPlan.focusTopic = weakestTopic.topic;
    return db.studyPlan;
  }

  static toggleTask(taskId: string): DailyStudyPlan {
    const task = db.studyPlan.tasks.find((t) => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      const completedTasks = db.studyPlan.tasks.filter((t) => t.completed);
      db.studyPlan.completedMinutes = completedTasks.reduce((acc, t) => acc + t.minutes, 0);
    }
    return db.studyPlan;
  }
}
