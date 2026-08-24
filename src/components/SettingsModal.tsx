import React, { useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetExamDays: number;
  onUpdateDays: (days: number) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  targetExamDays,
  onUpdateDays,
}) => {
  const [days, setDays] = useState(targetExamDays);
  const [targetSubject, setTargetSubject] = useState('Engineering Admission / Board Exams');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [savedToast, setSavedToast] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateDays(days);
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000000]/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#ffffff] w-full max-w-md rounded-2xl shadow-2xl border border-[#c5c6cd] overflow-hidden">
        <div className="p-5 border-b border-[#c5c6cd]/50 flex justify-between items-center bg-[#fbf9f7]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#000000]">settings</span>
            <h3 className="font-display text-lg font-bold text-[#000000]">Settings & Target Goal</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#75777e] hover:text-[#000000] rounded-full"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#000000] uppercase tracking-wider mb-1.5">
              Days Remaining Until Exam
            </label>
            <input
              type="number"
              min="1"
              max="365"
              value={days}
              onChange={(e) => setDays(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full bg-[#f5f3f1] border border-[#c5c6cd] rounded-lg px-3 py-2 text-sm font-semibold text-[#000000] focus:outline-none focus:border-[#aa3000]"
            />
            <p className="text-[11px] text-[#75777e] mt-1">Updates the countdown across your dashboard and coach.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#000000] uppercase tracking-wider mb-1.5">
              Target Track
            </label>
            <select
              value={targetSubject}
              onChange={(e) => setTargetSubject(e.target.value)}
              className="w-full bg-[#f5f3f1] border border-[#c5c6cd] rounded-lg px-3 py-2 text-sm font-semibold text-[#000000] focus:outline-none focus:border-[#aa3000]"
            >
              <option>Engineering Admission / Board Exams</option>
              <option>Medical College Entrance</option>
              <option>University Honors Calculus & Physics</option>
            </select>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-sm font-semibold text-[#000000]">Daily Practice Reminders</p>
              <p className="text-xs text-[#75777e]">Keep your 12-day streak alive</p>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                notificationsEnabled ? 'bg-[#aa3000]' : 'bg-[#c5c6cd]'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="p-4 bg-[#f5f3f1] border-t border-[#c5c6cd]/50 flex justify-between items-center">
          {savedToast ? (
            <span className="text-xs font-bold text-green-700 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">check_circle</span> Saved!
            </span>
          ) : (
            <span className="text-xs text-[#75777e]">Preferences synced</span>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#44474d] hover:bg-[#eae8e6] rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-[#000000] hover:bg-[#222222] text-white text-xs font-bold rounded-lg transition-all"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
