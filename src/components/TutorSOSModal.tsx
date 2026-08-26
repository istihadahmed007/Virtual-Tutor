import React, { useState } from 'react';
import { Zap, AlertCircle, Clock, CheckCircle2, X, Sparkles, BookOpen } from 'lucide-react';
import { apiClient } from '../services/api';
import { TutorBooking } from '../types';

interface TutorSOSModalProps {
  onClose: () => void;
  onSessionMatched: (booking: TutorBooking) => void;
}

export const TutorSOSModal: React.FC<TutorSOSModalProps> = ({ onClose, onSessionMatched }) => {
  const [subject, setSubject] = useState('Higher Mathematics');
  const [topic, setTopic] = useState('Integration by Parts & BUET Problem Solving');
  const [urgency, setUrgency] = useState<'HIGH' | 'EXAM_TODAY' | 'NORMAL'>('HIGH');
  const [doubtDescription, setDoubtDescription] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const quickTopics: Record<string, string[]> = {
    'Higher Mathematics': [
      'Integration by Parts & Cyclic Recursion',
      'Definite Integrals & Trigonometric Substitutions',
      'Homogeneous Differential Equations',
      'Straight Lines & Coordinate Geometry',
    ],
    Physics: [
      'Isothermal & Adiabatic Gas Processes',
      'Faraday’s Law & Electromagnetic Induction',
      'Relativistic Dynamics & Lorentz Transformations',
      'Vector Cross Product & Moment of Inertia',
    ],
    Chemistry: [
      'Aldol Condensation vs Cannizzaro Reaction',
      'Grignard Reagent Synthesis of Alcohols',
      'Hess’s Law & Enthalpy of Formation',
      'Buffer Solutions & Henderson-Hasselbalch',
    ],
    Biology: [
      'Mendelian Genetic Inheritance & Dihybrid Cross',
      'DNA Replication Enzymes & Okazaki Fragments',
      'Krebs Cycle & Cellular Respiration ATP Yield',
      'Cardiac Cycle & ECG Waveform Interpretation',
    ],
    ICT: [
      'Boolean Algebra & Karnaugh Map Simplification',
      'C Programming Pointers & Recursion',
      'HTML Forms & CSS Flexbox Layouts',
    ],
  };

  const handleRequestSOS = async () => {
    if (!doubtDescription.trim()) {
      setError('Please describe your specific doubt or problem so the faculty can prepare.');
      return;
    }

    setError(null);
    setIsSearching(true);

    try {
      const res = await apiClient.requestTutorSOS({
        subject,
        topic,
        urgency,
        doubtDescription,
      });

      if (res.success && res.booking) {
        // Wait 1.2s for radar animation feedback
        setTimeout(() => {
          setIsSearching(false);
          onSessionMatched(res.booking!);
        }, 1200);
      } else {
        setIsSearching(false);
        setError('Could not connect to faculty. Please try again.');
      }
    } catch {
      setIsSearching(false);
      setError('An error occurred while matching with verified faculty.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/50 p-5 border-b border-amber-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                Instant 15-Minute Doubt SOS
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  Live Match
                </span>
              </h3>
              <p className="text-xs text-slate-400">Connect to a verified university mentor in under 60 seconds</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-950/80 border border-red-800 text-red-300 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isSearching ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border-4 border-amber-500/20 border-t-amber-400 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-amber-400">
                  <Zap className="w-8 h-8 animate-pulse" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Matching with Verified Bangladesh Faculty...</h4>
                <p className="text-xs text-slate-400 mt-1">Connecting to available BUET / DMC mentors for {subject}</p>
              </div>
            </div>
          ) : (
            <>
              {/* Subject Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Select Subject
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Higher Mathematics', 'Physics', 'Chemistry', 'Biology', 'ICT'].map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => {
                        setSubject(sub);
                        if (quickTopics[sub] && quickTopics[sub].length > 0) {
                          setTopic(quickTopics[sub][0]);
                        }
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all text-left truncate ${
                        subject === sub
                          ? 'bg-amber-950/60 border-amber-500 text-amber-300 font-semibold'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topic Selector & Presets */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Select High-Yield Topic
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  {(quickTopics[subject] || []).map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Urgency */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Urgency Level
                </label>
                <div className="flex gap-2">
                  {[
                    { id: 'HIGH', label: 'High Priority (In 5 mins)', icon: Zap },
                    { id: 'EXAM_TODAY', label: 'Exam Tomorrow / Blocker', icon: Clock },
                    { id: 'NORMAL', label: 'Regular 15-min Doubt', icon: BookOpen },
                  ].map((lvl) => {
                    const Icon = lvl.icon;
                    return (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => setUrgency(lvl.id as any)}
                        className={`flex-1 p-2 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                          urgency === lvl.id
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{lvl.label.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Doubt Details */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Describe Your Exact Doubt
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setDoubtDescription(
                        `I am stuck on step 2 of solving ${topic}. Need 10-minute diagnostic help to verify formula substitution and avoid exam negative marks.`
                      )
                    }
                    className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    Auto-fill Prompt
                  </button>
                </div>
                <textarea
                  value={doubtDescription}
                  onChange={(e) => setDoubtDescription(e.target.value)}
                  placeholder="e.g. I keep getting confused when integrating e^(2x) sin(3x) dx where cyclic recursion is required..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Price & Action Button */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                <div>
                  <span className="text-[11px] text-slate-400 block">15-Min Quick Session</span>
                  <span className="text-sm font-bold text-emerald-400">৳350 BDT</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleRequestSOS}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
                  >
                    <Zap className="w-4 h-4 fill-slate-950" />
                    <span>Launch Instant SOS</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
