import React, { useState } from 'react';
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
        'Today, 05:00 PM - 06:00 PM',
        'Today, 07:30 PM - 08:30 PM',
        'Tomorrow, 04:00 PM - 05:00 PM',
        'Tomorrow, 08:00 PM - 09:00 PM',
      ];

  const [selectedDate, setSelectedDate] = useState(defaultSlots[0] || 'Today, 05:00 PM - 06:00 PM');
  const [selectedTopic, setSelectedTopic] = useState('Calculus - Integration by Parts & BUET Problem Solving');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !tutor) return null;

  const handleBooking = () => {
    setIsSuccess(true);
    setTimeout(() => {
      onConfirmBooking({
        tutor,
        date: selectedDate,
        topic: selectedTopic,
        notes,
      });
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000000]/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#ffffff] w-full max-w-lg rounded-2xl shadow-2xl border border-[#c5c6cd] overflow-hidden">
        {/* Tutor info banner */}
        <div className="p-5 border-b border-[#c5c6cd]/50 bg-[#fbf9f7] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-stone-900 text-white flex items-center justify-center font-bold text-xs border border-[#c5c6cd]">
                {tutor.name.replace(/^(Dr\.|Prof\.|Engr\.)\s*/i, '').split(' ').map((s) => s[0]).join('').slice(0, 2) || 'VT'}
              </div>
              <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-0.5 text-[9px] shadow">
                <span className="material-symbols-outlined text-[10px] block">verified</span>
              </span>
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-[#000000]">{tutor.name}</h3>
              <p className="text-xs text-[#aa3000] font-semibold">{tutor.specialty}</p>
              <p className="text-[11px] text-[#75777e]">{tutor.education}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#75777e] hover:text-[#000000] rounded-full hover:bg-[#f5f3f1]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {isSuccess ? (
          <div className="p-10 text-center space-y-3">
            <div className="w-14 h-14 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[32px]">task_alt</span>
            </div>
            <h4 className="font-display text-xl font-bold text-[#000000]">
              {isBn ? 'সেশন নিশ্চিত হয়েছে!' : 'Session Confirmed!'}
            </h4>
            <p className="text-xs text-[#44474d] leading-relaxed">
              {isBn
                ? `${tutor.name}-এর সাথে আপনার ১-অন-১ লাইভ মেন্টরিং সেশন (${selectedDate}) বুক করা হয়েছে। লাইভ ক্লাসরুম লিংক প্রস্তুত করা হয়েছে।`
                : `We have booked your 1-on-1 session with ${tutor.name} for ${selectedDate}. A calendar invitation and classroom link have been prepared.`}
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#000000] uppercase tracking-wider mb-1.5">
                {isBn ? 'তারিখ ও সময় স্লট নির্বাচন করুন' : 'Select Date & Time Slot'}
              </label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-[#f5f3f1] border border-[#c5c6cd] rounded-lg px-3 py-2.5 text-sm font-semibold text-[#000000] focus:outline-none focus:border-[#aa3000]"
              >
                {defaultSlots.map((slot, idx) => (
                  <option key={idx} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#000000] uppercase tracking-wider mb-1.5">
                {isBn ? 'নির্দিষ্ট বিষয় বা সমস্যা (Focus Topic)' : 'Focus Subject / Topic'}
              </label>
              <input
                type="text"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                placeholder={isBn ? 'উদাঃ থার্মোডাইনামিক্স, আংশিক ভগ্নাংশ, জৈব রসায়ন...' : 'e.g. Isothermal Expansion, Partial Fractions...'}
                className="w-full bg-[#f5f3f1] border border-[#c5c6cd] rounded-lg px-3 py-2 text-sm text-[#000000] focus:outline-none focus:border-[#aa3000]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#000000] uppercase tracking-wider mb-1.5">
                {isBn ? 'শিক্ষকের জন্য নোট (ঐচ্ছিক)' : 'Notes for Tutor (Optional)'}
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={isBn ? 'আপনার সুনির্দিষ্ট সমস্যা বা প্রশ্নের বিবরণ দিন...' : 'Describe your specific question or difficulty...'}
                className="w-full bg-[#f5f3f1] border border-[#c5c6cd] rounded-lg px-3 py-2 text-sm text-[#000000] focus:outline-none focus:border-[#aa3000] resize-none"
              />
            </div>

            {/* Pricing Summary */}
            <div className="p-3.5 bg-[#f5f3f1] rounded-xl flex items-center justify-between border border-[#c5c6cd]/40">
              <div>
                <span className="text-xs text-[#75777e]">{isBn ? 'সেশন ফি (৬০ মিনিট)' : 'Session Fee (60 mins)'}</span>
                <p className="text-base font-bold font-display text-[#000000]">
                  ৳{tutor.hourlyRateBDT} BDT
                </p>
              </div>
              <span className="text-[11px] font-semibold text-[#aa3000] bg-[#ffdbd0]/50 border border-[#ffdbd0] px-2 py-0.5 rounded flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">verified</span>
                {isBn ? 'ভেরিফাইড ফ্যাকাল্টি' : 'Verified Faculty'}
              </span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 text-xs font-semibold text-[#44474d] hover:bg-[#eae8e6] rounded-xl cursor-pointer"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                onClick={handleBooking}
                className="flex-1 py-2.5 bg-[#aa3000] hover:bg-[#8e2800] text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
              >
                {isBn ? 'স্লট নিশ্চিত করুন' : 'Confirm & Reserve Slot'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
