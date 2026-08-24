import React, { useState } from 'react';
import { Tutor } from '../types';

interface BookingModalProps {
  tutor: Tutor | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmBooking: (bookingDetails: any) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  tutor,
  isOpen,
  onClose,
  onConfirmBooking,
}) => {
  const [selectedDate, setSelectedDate] = useState('Tomorrow, 4:00 PM');
  const [selectedTopic, setSelectedTopic] = useState('Calculus - Integration by Parts Review');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000000]/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#ffffff] w-full max-w-lg rounded-2xl shadow-2xl border border-[#c5c6cd] overflow-hidden">
        {/* Tutor info banner */}
        <div className="p-5 border-b border-[#c5c6cd]/50 bg-[#fbf9f7] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={tutor.avatarUrl}
              alt={tutor.name}
              className="w-12 h-12 rounded-full object-cover border border-[#c5c6cd]"
            />
            <div>
              <h3 className="font-display text-lg font-bold text-[#000000]">{tutor.name}</h3>
              <p className="text-xs text-[#aa3000] font-semibold">{tutor.specialty}</p>
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
            <h4 className="font-display text-xl font-bold text-[#000000]">Session Confirmed!</h4>
            <p className="text-xs text-[#44474d]">
              We have booked your 1-on-1 session with {tutor.name} for <strong>{selectedDate}</strong>.
              A calendar invitation and classroom link have been prepared.
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#000000] uppercase tracking-wider mb-1.5">
                Select Date & Time Slot
              </label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-[#f5f3f1] border border-[#c5c6cd] rounded-lg px-3 py-2.5 text-sm font-semibold text-[#000000] focus:outline-none focus:border-[#aa3000]"
              >
                <option>Today, 7:00 PM - 8:00 PM</option>
                <option>Tomorrow, 4:00 PM - 5:00 PM</option>
                <option>Tomorrow, 8:00 PM - 9:00 PM</option>
                <option>Saturday, 11:00 AM - 12:00 PM</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#000000] uppercase tracking-wider mb-1.5">
                Focus Subject / Topic
              </label>
              <input
                type="text"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                placeholder="e.g. Isothermal Expansion, Partial Fractions..."
                className="w-full bg-[#f5f3f1] border border-[#c5c6cd] rounded-lg px-3 py-2 text-sm text-[#000000] focus:outline-none focus:border-[#aa3000]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#000000] uppercase tracking-wider mb-1.5">
                Notes for Tutor (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe your current struggle or upload a screenshot in the chat..."
                className="w-full bg-[#f5f3f1] border border-[#c5c6cd] rounded-lg px-3 py-2 text-sm text-[#000000] focus:outline-none focus:border-[#aa3000] resize-none"
              />
            </div>

            {/* Pricing Summary */}
            <div className="p-3.5 bg-[#f5f3f1] rounded-xl flex items-center justify-between border border-[#c5c6cd]/40">
              <div>
                <span className="text-xs text-[#75777e]">Session Fee (60 mins)</span>
                <p className="text-base font-bold font-display text-[#000000]">
                  ৳{tutor.hourlyRateBDT} BDT
                </p>
              </div>
              <span className="text-[11px] font-semibold text-[#aa3000] bg-[#ffdbd0]/50 border border-[#ffdbd0] px-2 py-0.5 rounded">
                Verified Expert
              </span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 text-xs font-semibold text-[#44474d] hover:bg-[#eae8e6] rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleBooking}
                className="flex-1 py-2.5 bg-[#aa3000] hover:bg-[#8e2800] text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Confirm & Reserve Slot
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
