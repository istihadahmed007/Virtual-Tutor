import React from 'react';
import { useStudyPlan } from '../hooks/useStudyPlan';

interface StudyPlanViewProps {
  onStartTask: (taskId: string, topic: string) => void;
}

export const StudyPlanView: React.FC<StudyPlanViewProps> = ({ onStartTask }) => {
  const { studyPlan, toggleTask } = useStudyPlan();

  const planTasks = [
    {
      id: 'task-1',
      index: '01',
      title: 'Integration Fundamentals',
      duration: '15 min',
      subject: 'Mathematics',
      topic: 'Integration',
      status: 'completed',
    },
    {
      id: 'task-2',
      index: '02',
      title: 'Integration by Parts Drill',
      duration: '20 min',
      subject: 'Mathematics',
      topic: 'Integration by Parts',
      status: 'in_progress',
    },
    {
      id: 'task-3',
      index: '03',
      title: 'Physics Thermodynamics Revision',
      duration: '15 min',
      subject: 'Physics',
      topic: 'Thermodynamics',
      status: 'pending',
    },
    {
      id: 'task-4',
      index: '04',
      title: 'Quick 10-Question Mini Test',
      duration: '10 min',
      subject: 'Mixed',
      topic: 'Mock Drill',
      status: 'pending',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto pb-8 font-body">
      {/* 1. Header & Daily Goal Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Daily Study Plan
          </h1>
          <p className="text-sm text-[#64748B] mt-0.5">
            AI-optimized learning roadmap tailored to your weakest exam topics.
          </p>
        </div>

        {/* Goal Progress Ring / Pill */}
        <div className="flex items-center gap-3 bg-[#FFFFFF] p-3 rounded-2xl border border-[#E2E8F0] shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center font-bold text-xs">
            35/60m
          </div>
          <div>
            <p className="text-xs font-bold text-[#0F172A]">Daily Study Goal</p>
            <p className="text-[10px] text-[#64748B]">60% Completed</p>
          </div>
        </div>
      </div>

      {/* 2. Today's Plan Step Cards matching Mockup */}
      <div className="space-y-4">
        {planTasks.map((task) => {
          const isCompleted = task.status === 'completed';
          const isInProgress = task.status === 'in_progress';

          return (
            <div
              key={task.id}
              className={`bg-[#FFFFFF] rounded-3xl p-6 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isInProgress
                  ? 'border-2 border-[#4F46E5] shadow-md shadow-indigo-500/5'
                  : 'border-[#E2E8F0] shadow-sm'
              }`}
            >
              <div className="flex items-center gap-4">
                <span
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-display text-base font-bold shrink-0 ${
                    isCompleted
                      ? 'bg-[#ECFDF5] text-[#10B981]'
                      : isInProgress
                      ? 'bg-[#4F46E5] text-white'
                      : 'bg-[#F1F5F9] text-[#64748B]'
                  }`}
                >
                  {isCompleted ? (
                    <span className="material-symbols-outlined text-[24px]">check</span>
                  ) : (
                    task.index
                  )}
                </span>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-base sm:text-lg font-bold text-[#0F172A]">
                      {task.title}
                    </h3>
                    <span className="text-[11px] font-semibold text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-md">
                      {task.duration}
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    {task.subject} • {task.topic}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                {isCompleted ? (
                  <span className="text-xs font-bold text-emerald-600 bg-[#ECFDF5] px-3 py-1.5 rounded-xl flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    Completed
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      toggleTask(task.id);
                      onStartTask(task.id, task.topic);
                    }}
                    className={`px-5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                      isInProgress
                        ? 'bg-[#4F46E5] hover:bg-[#4338CA] text-white shadow-sm shadow-indigo-500/20 active:scale-95'
                        : 'bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334155]'
                    }`}
                  >
                    <span>{isInProgress ? 'Start Next' : 'Start Task'}</span>
                    <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
