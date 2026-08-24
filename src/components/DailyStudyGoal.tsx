import React, { useState, useEffect } from 'react';

interface DailyStudyGoalProps {
  onStartSession?: () => void;
}

interface ActivityBreakdown {
  id: string;
  name: string;
  minutes: number;
  icon: string;
  color: string;
}

export const DailyStudyGoal: React.FC<DailyStudyGoalProps> = ({ onStartSession }) => {
  // Read initial values from localStorage or sensible defaults
  const [targetHours, setTargetHours] = useState<number>(() => {
    const saved = localStorage.getItem('exam_mastery_target_hours');
    return saved ? parseFloat(saved) : 4.0;
  });

  const [completedMinutes, setCompletedMinutes] = useState<number>(() => {
    const saved = localStorage.getItem('exam_mastery_completed_minutes');
    return saved ? parseInt(saved, 10) : 155; // 2h 35m default demo progress
  });

  const [isEditingGoal, setIsEditingGoal] = useState<boolean>(false);
  const [tempGoalInput, setTempGoalInput] = useState<number>(targetHours);
  const [isLoggingTime, setIsLoggingTime] = useState<boolean>(false);
  const [logMinutesInput, setLogMinutesInput] = useState<number>(30);
  const [logActivityType, setLogActivityType] = useState<string>('drill');

  const [breakdown, setBreakdown] = useState<ActivityBreakdown[]>([
    { id: '1', name: 'Mock Exams', minutes: 60, icon: 'assignment', color: '#000000' },
    { id: '2', name: 'Calculus Drills', minutes: 55, icon: 'bolt', color: '#aa3000' },
    { id: '3', name: 'Mistake Review', minutes: 40, icon: 'menu_book', color: '#75777e' },
  ]);

  // Persist target hours
  useEffect(() => {
    localStorage.setItem('exam_mastery_target_hours', targetHours.toString());
  }, [targetHours]);

  // Persist completed minutes
  useEffect(() => {
    localStorage.setItem('exam_mastery_completed_minutes', completedMinutes.toString());
  }, [completedMinutes]);

  const targetMinutes = Math.round(targetHours * 60);
  const progressPercent = Math.min(100, Math.round((completedMinutes / targetMinutes) * 100));
  const remainingMinutes = Math.max(0, targetMinutes - completedMinutes);

  const completedHoursFormatted = (completedMinutes / 60).toFixed(1);
  const remainingHoursFormatted = (remainingMinutes / 60).toFixed(1);

  const handleSaveGoal = () => {
    if (tempGoalInput > 0 && tempGoalInput <= 16) {
      setTargetHours(tempGoalInput);
      setIsEditingGoal(false);
    }
  };

  const handleQuickAdd = (minutes: number, label: string = 'Quick Study') => {
    setCompletedMinutes((prev) => prev + minutes);
    setBreakdown((prev) => {
      const existing = prev.find((b) => b.name.toLowerCase().includes(label.toLowerCase()));
      if (existing) {
        return prev.map((b) => (b.id === existing.id ? { ...b, minutes: b.minutes + minutes } : b));
      }
      return [
        ...prev,
        {
          id: `act-${Date.now()}`,
          name: label,
          minutes,
          icon: 'timer',
          color: '#aa3000',
        },
      ];
    });
  };

  const handleLogCustomTime = (e: React.FormEvent) => {
    e.preventDefault();
    if (logMinutesInput > 0) {
      const labels: Record<string, { name: string; icon: string; color: string }> = {
        mock: { name: 'Full Mock Exam', icon: 'assignment', color: '#000000' },
        drill: { name: 'Targeted Drill', icon: 'bolt', color: '#aa3000' },
        review: { name: 'Mistake Review', icon: 'menu_book', color: '#75777e' },
        tutor: { name: '1-on-1 Session', icon: 'school', color: '#44474d' },
      };
      const act = labels[logActivityType] || { name: 'Study Session', icon: 'timer', color: '#000000' };
      handleQuickAdd(logMinutesInput, act.name);
      setIsLoggingTime(false);
    }
  };

  const handleResetDaily = () => {
    if (window.confirm('Reset today’s logged study time to 0 hours?')) {
      setCompletedMinutes(0);
      setBreakdown([]);
    }
  };

  // Status Badge Logic
  const getStatusBadge = () => {
    if (progressPercent >= 100) {
      return {
        text: 'Goal Completed! 🎉',
        bg: 'bg-green-100 text-green-800 border-green-200',
        icon: 'check_circle',
      };
    }
    if (progressPercent >= 75) {
      return {
        text: 'Final Stretch',
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: 'trending_up',
      };
    }
    if (progressPercent >= 40) {
      return {
        text: 'On Track',
        bg: 'bg-[#f5f3f1] text-[#000000] border-[#c5c6cd]/60',
        icon: 'timelapse',
      };
    }
    return {
      text: 'Starting Pace',
      bg: 'bg-[#ffdbd0]/60 text-[#aa3000] border-[#ffdbd0]',
      icon: 'schedule',
    };
  };

  const status = getStatusBadge();

  return (
    <div
      id="daily-study-goal-card"
      className="bg-[#ffffff] rounded-2xl p-6 sm:p-7 border border-[#c5c6cd]/60 ambient-shadow space-y-6 relative overflow-hidden"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#000000] text-white flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[20px]">flag</span>
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-[#000000]">
              Daily Study Goal
            </h3>
            <p className="text-xs text-[#75777e]">Target vs Actual Session Hours</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-[11px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 ${status.bg}`}
          >
            <span className="material-symbols-outlined text-[13px]">{status.icon}</span>
            {status.text}
          </span>
          <button
            id="edit-daily-goal-btn"
            onClick={() => {
              setTempGoalInput(targetHours);
              setIsEditingGoal(!isEditingGoal);
            }}
            title="Edit target goal"
            className="p-1.5 rounded-lg text-[#75777e] hover:text-[#000000] hover:bg-[#f5f3f1] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
          </button>
        </div>
      </div>

      {/* Goal Edit Panel (Inline Dropdown) */}
      {isEditingGoal && (
        <div className="bg-[#f5f3f1] p-4 rounded-xl border border-[#c5c6cd]/60 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#000000] uppercase tracking-wider">
              Set Daily Target Hours
            </span>
            <button
              onClick={() => setIsEditingGoal(false)}
              className="text-[#75777e] hover:text-[#000000] text-xs"
            >
              ✕ Close
            </button>
          </div>

          <div className="flex items-center gap-2">
            {[2, 3, 4, 5, 6].map((hours) => (
              <button
                key={hours}
                onClick={() => setTempGoalInput(hours)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  tempGoalInput === hours
                    ? 'bg-[#aa3000] text-white'
                    : 'bg-[#ffffff] text-[#44474d] border border-[#c5c6cd]'
                }`}
              >
                {hours}h
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-1">
            <div className="flex items-center gap-2 bg-[#ffffff] px-3 py-1.5 rounded-lg border border-[#c5c6cd] flex-1">
              <span className="text-xs text-[#75777e]">Custom:</span>
              <input
                type="number"
                min="0.5"
                max="16"
                step="0.5"
                value={tempGoalInput}
                onChange={(e) => setTempGoalInput(parseFloat(e.target.value) || 1)}
                className="w-16 text-xs font-bold text-[#000000] outline-none"
              />
              <span className="text-xs text-[#75777e]">hrs / day</span>
            </div>

            <button
              id="save-daily-goal-btn"
              onClick={handleSaveGoal}
              className="px-4 py-2 bg-[#000000] hover:bg-[#1b1c1b] text-white text-xs font-bold rounded-lg transition-all shadow-sm"
            >
              Save Goal
            </button>
          </div>
        </div>
      )}

      {/* Hero Numbers & Progress Bar */}
      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-3xl sm:text-4xl font-bold text-[#000000]">
              {completedHoursFormatted}
            </span>
            <span className="text-sm font-semibold text-[#75777e]">
              / {targetHours} hrs logged
            </span>
          </div>

          <div className="text-right">
            <span className="font-display text-2xl font-bold text-[#aa3000]">
              {progressPercent}%
            </span>
            <span className="block text-[11px] text-[#75777e]">
              {remainingMinutes > 0 ? `${remainingHoursFormatted}h remaining` : 'Target reached!'}
            </span>
          </div>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full bg-[#f5f3f1] h-3.5 rounded-full overflow-hidden p-0.5 border border-[#c5c6cd]/50">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              progressPercent >= 100
                ? 'bg-green-600'
                : progressPercent >= 60
                ? 'bg-[#000000]'
                : 'bg-[#aa3000]'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Quick Progress Markers */}
        <div className="flex justify-between text-[10px] text-[#75777e] font-semibold px-0.5">
          <span>0h</span>
          <span>{Math.round(targetHours * 0.25)}h</span>
          <span>{Math.round(targetHours * 0.5)}h (Halfway)</span>
          <span>{Math.round(targetHours * 0.75)}h</span>
          <span>{targetHours}h Target</span>
        </div>
      </div>

      {/* Quick Action Buttons: Fast +15m / +30m / +1h Logging */}
      <div className="pt-2 border-t border-[#f5f3f1] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#000000] uppercase tracking-wider">
            Quick Log Time
          </span>
          <button
            onClick={() => setIsLoggingTime(!isLoggingTime)}
            className="text-xs font-bold text-[#aa3000] hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">
              {isLoggingTime ? 'close' : 'add_circle'}
            </span>
            {isLoggingTime ? 'Cancel' : 'Detailed Log'}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            id="quick-add-15m-btn"
            onClick={() => handleQuickAdd(15, 'Quick Drill')}
            className="py-2 px-3 bg-[#f5f3f1] hover:bg-[#eae8e6] active:scale-95 text-[#000000] rounded-xl text-xs font-bold border border-[#c5c6cd]/60 transition-all flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[14px] text-[#aa3000]">add</span>
            +15 Mins
          </button>

          <button
            id="quick-add-30m-btn"
            onClick={() => handleQuickAdd(30, 'Targeted Drill')}
            className="py-2 px-3 bg-[#f5f3f1] hover:bg-[#eae8e6] active:scale-95 text-[#000000] rounded-xl text-xs font-bold border border-[#c5c6cd]/60 transition-all flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[14px] text-[#aa3000]">add</span>
            +30 Mins
          </button>

          <button
            id="quick-add-60m-btn"
            onClick={() => handleQuickAdd(60, 'Mock Simulation')}
            className="py-2 px-3 bg-[#000000] hover:bg-[#1b1c1b] active:scale-95 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-[14px] text-[#ffb59e]">bolt</span>
            +1 Hour
          </button>
        </div>
      </div>

      {/* Detailed Log Modal / Drawer Form */}
      {isLoggingTime && (
        <form
          onSubmit={handleLogCustomTime}
          className="bg-[#fbf9f7] p-4 rounded-xl border border-[#c5c6cd] space-y-3 animate-fadeIn"
        >
          <h4 className="text-xs font-bold text-[#000000] uppercase tracking-wider">
            Log Custom Study Session
          </h4>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-[#75777e] mb-1">
                Duration (Mins)
              </label>
              <input
                type="number"
                min="5"
                max="360"
                step="5"
                value={logMinutesInput}
                onChange={(e) => setLogMinutesInput(parseInt(e.target.value, 10) || 5)}
                className="w-full bg-[#ffffff] border border-[#c5c6cd] rounded-lg px-3 py-1.5 text-xs font-bold text-[#000000] outline-none focus:border-[#aa3000]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#75777e] mb-1">
                Activity Category
              </label>
              <select
                value={logActivityType}
                onChange={(e) => setLogActivityType(e.target.value)}
                className="w-full bg-[#ffffff] border border-[#c5c6cd] rounded-lg px-3 py-1.5 text-xs font-bold text-[#000000] outline-none focus:border-[#aa3000]"
              >
                <option value="drill">Targeted Drill</option>
                <option value="mock">Mock Exam</option>
                <option value="review">Mistake Review</option>
                <option value="tutor">Tutor Mentorship</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsLoggingTime(false)}
              className="px-3 py-1.5 bg-[#ffffff] text-[#44474d] text-xs font-bold rounded-lg border border-[#c5c6cd]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#aa3000] hover:bg-[#8e2800] text-white text-xs font-bold rounded-lg shadow-sm"
            >
              Log Time
            </button>
          </div>
        </form>
      )}

      {/* Activity Breakdown List */}
      {breakdown.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-[#f5f3f1]">
          <div className="flex items-center justify-between text-[11px] font-semibold text-[#75777e]">
            <span>Today's Time Allocation</span>
            <button
              onClick={handleResetDaily}
              className="text-[10px] text-[#75777e] hover:text-[#aa3000] underline"
            >
              Reset Today
            </button>
          </div>

          <div className="space-y-1.5">
            {breakdown.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-[#f5f3f1]/60"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="material-symbols-outlined text-[15px]"
                    style={{ color: item.color }}
                  >
                    {item.icon}
                  </span>
                  <span className="font-semibold text-[#1b1c1b]">{item.name}</span>
                </div>
                <span className="font-bold text-[#000000]">
                  {item.minutes >= 60
                    ? `${(item.minutes / 60).toFixed(1)} hrs`
                    : `${item.minutes} mins`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
