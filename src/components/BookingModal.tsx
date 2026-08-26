import React, { useState } from 'react';
import { CheckCircle2, Calendar, Clock, Sparkles, ShieldCheck, Award, X, BookOpen, User } from 'lucide-react';
import { Tutor } from '../types';

interface BookingModalProps {
  tutor: Tutor | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmBooking: (bookingDetails: any) => void;
  preferredLanguage?: 'en' | 'bn';
}

export const BookingModal: React.FC<BookingModalProps> = ({
  tutor,
  isOpen,
  onClose,
  onConfirmBooking,
  preferredLanguage = 'bn',
}) => {
  const isBn = preferredLanguage === 'bn';

  const defaultSlots = tutor?.availableTimeSlots && tutor.availableTimeSlots.length > 0
    ? tutor.availableTimeSlots
    : [
        'Today, 04:00 PM - 05:00 PM',
        'Today, 06:30 PM - 07:30 PM',
        'Tomorrow, 05:00 PM - 06:00 PM',
        'Tomorrow, 07:30 PM - 08:30 PM',
      ];

  const defaultTopic = tutor?.subject.includes('Math')
    ? 'Calculus - Integration by Parts & BUET Problem Solving'
    : tutor?.subject.includes('Chem')
    ? 'Organic Chemistry - Carbonyl Reaction Mechanisms'
    : tutor?.subject.includes('Phys')
    ? 'Physics - Thermodynamics & Electromagnetic Induction'
    : 'Admission Priority Topic Masterclass';

  const [selectedSlot, setSelectedSlot] = useState(defaultSlots[0]);
  const [selectedTopic, setSelectedTopic] = useState(defaultTopic);
  const [doubtDescription, setDoubtDescription] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !tutor) return null;

  const handleBooking = () => {
    setIsSubmitting(true);
    setIsSuccess(true);
    setTimeout(() => {
      onConfirmBooking({
        tutor,
        date: selectedSlot.split(',')[0]?.trim() || 'Today',
        timeSlot: selectedSlot.includes(',') ? selectedSlot.split(',')[1]?.trim() : selectedSlot,
        subject: tutor.subject.split('&')[0]?.trim() || tutor.subject,
        topic: selectedTopic,
        doubtDescription,
      });
      setIsSubmitting(false);
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        {/* Tutor info banner */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="relative shrink-0">
              <img
                src={tutor.avatarUrl}
                alt={tutor.name}
                className="w-13 h-13 rounded-2xl object-cover border border-slate-800 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 bg-cyan-600 text-white rounded-full p-0.5 text-[10px] shadow">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{tutor.name}</h3>
                {tutor.badge && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-cyan-950 text-cyan-400 border border-cyan-800 px-1.5 py-0.5 rounded">
                    {tutor.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-cyan-400 font-medium">{tutor.specialty}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{tutor.institution || tutor.education}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-10 text-center space-y-3 bg-slate-900">
            <div className="w-14 h-14 bg-emerald-950 text-emerald-400 border border-emerald-700 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-white">
              {isBn ? 'সেশন নিশ্চিত হয়েছে!' : '1-on-1 Session Confirmed!'}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
              {isBn
                ? `${tutor.name}-এর সাথে আপনার লাইভ ক্লাসরুম স্লট (${selectedSlot}) বুক করা হয়েছে। মিটিং কোড প্রস্তুত করা হয়েছে।`
                : `We have reserved your 1-on-1 session with ${tutor.name} for ${selectedSlot}. Your interactive whiteboard classroom room is ready.`}
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-4 overflow-y-auto">
            {/* Slot selection pills */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                {isBn ? 'উপলব্ধ সময় স্লট নির্বাচন করুন' : 'Select Available Time Slot'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {defaultSlots.map((slot, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
                      selectedSlot === slot
                        ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 font-semibold shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{slot}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Target Topic Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                {isBn ? 'নির্দিষ্ট বিষয় বা সমস্যা (Focus Topic)' : 'Focus Topic / Chapter'}
              </label>
              <input
                type="text"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                placeholder="e.g. Integration by Parts, Aldol Reaction, PV Diagrams..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Notes / Doubt Details */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  {isBn ? 'শিক্ষকের জন্য নোট বা প্রশ্ন' : 'Session Objective / Doubts'}
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setDoubtDescription(
                      `Need step-by-step guidance on BUET entrance problem solving and formula shortcuts for ${selectedTopic}.`
                    )
                  }
                  className="text-[11px] text-cyan-400 hover:text-cyan-300"
                >
                  Fill prompt
                </button>
              </div>
              <textarea
                rows={2}
                value={doubtDescription}
                onChange={(e) => setDoubtDescription(e.target.value)}
                placeholder="Describe your specific question, mistake pattern, or exam target..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>

            {/* Pricing Summary */}
            <div className="p-3.5 bg-slate-950 rounded-xl flex items-center justify-between border border-slate-800">
              <div>
                <span className="text-[11px] text-slate-400 block">{isBn ? 'সেশন ফি (৬০ মিনিট)' : 'Session Fee (60 mins)'}</span>
                <p className="text-base font-bold text-emerald-400">
                  ৳{tutor.hourlyRateBDT} BDT
                </p>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-semibold text-cyan-400 bg-cyan-950/80 border border-cyan-800 px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {isBn ? '১০০% নিশ্চিত ভেরিফাইড' : 'Verified 1-on-1'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-colors"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                onClick={handleBooking}
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-cyan-600/20 active:scale-95 flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isBn ? 'স্লট নিশ্চিত করুন' : 'Confirm & Reserve Slot'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
