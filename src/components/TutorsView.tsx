import React, { useState } from 'react';
import { Tutor } from '../types';

interface TutorsViewProps {
  tutors: Tutor[];
  onOpenBooking: (tutor: Tutor) => void;
}

export const TutorsView: React.FC<TutorsViewProps> = ({ tutors, onOpenBooking }) => {
  const [filterSubject, setFilterSubject] = useState<'All' | 'Mathematics' | 'Physics' | 'Chemistry'>('All');
  const [filterAvailableToday, setFilterAvailableToday] = useState(false);
  const [filterUnder1000, setFilterUnder1000] = useState(false);

  const filteredTutors = tutors.filter((tutor) => {
    if (filterSubject !== 'All' && tutor.subject !== filterSubject) return false;
    if (filterAvailableToday && !tutor.isAvailableToday) return false;
    if (filterUnder1000 && tutor.hourlyRateBDT > 1000) return false;
    return true;
  });

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f5f3f1] text-[#000000] text-xs font-bold uppercase tracking-wider mb-2 border border-[#c5c6cd]/60">
          <span className="material-symbols-outlined text-[14px]">school</span>
          1-on-1 Academic Mentorship
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#000000]">
          Verified Exam Tutors & Mentors
        </h2>
        <p className="text-sm text-[#44474d] mt-1">
          Master high-yield concepts and resolve stubborn mistakes with top university lecturers and Olympiad coaches.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 pt-2 pb-4 border-b border-[#c5c6cd]/40">
        <button
          onClick={() => setFilterSubject('All')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            filterSubject === 'All'
              ? 'bg-[#000000] text-white shadow-sm'
              : 'bg-[#ffffff] text-[#44474d] border border-[#c5c6cd]'
          }`}
        >
          All Subjects
        </button>

        <button
          onClick={() => setFilterSubject('Mathematics')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            filterSubject === 'Mathematics'
              ? 'bg-[#aa3000] text-white shadow-sm'
              : 'bg-[#ffffff] text-[#44474d] border border-[#c5c6cd]'
          }`}
        >
          Mathematics & Calculus
        </button>

        <button
          onClick={() => setFilterSubject('Physics')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            filterSubject === 'Physics'
              ? 'bg-[#000000] text-white shadow-sm'
              : 'bg-[#ffffff] text-[#44474d] border border-[#c5c6cd]'
          }`}
        >
          Physics
        </button>

        <button
          onClick={() => setFilterSubject('Chemistry')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            filterSubject === 'Chemistry'
              ? 'bg-[#000000] text-white shadow-sm'
              : 'bg-[#ffffff] text-[#44474d] border border-[#c5c6cd]'
          }`}
        >
          Chemistry
        </button>

        <button
          onClick={() => setFilterAvailableToday(!filterAvailableToday)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
            filterAvailableToday
              ? 'bg-green-700 text-white border-green-700'
              : 'bg-[#ffffff] text-[#44474d] border-[#c5c6cd]'
          }`}
        >
          ⚡ Available Today
        </button>

        <button
          onClick={() => setFilterUnder1000(!filterUnder1000)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
            filterUnder1000
              ? 'bg-[#000000] text-white border-[#000000]'
              : 'bg-[#ffffff] text-[#44474d] border-[#c5c6cd]'
          }`}
        >
          Under ৳1,000 / hr
        </button>
      </div>

      {/* Tutors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTutors.map((tutor) => (
          <div
            key={tutor.id}
            className={`rounded-3xl p-6 border transition-all flex flex-col justify-between ${
              tutor.isHighDemand
                ? 'bg-[#ffffff] border-[#ffdbd0] ring-1 ring-[#ffdbd0]'
                : 'bg-[#ffffff] border-[#c5c6cd]/60'
            } ambient-shadow card-shadow-hover`}
          >
            <div>
              {/* Top Meta Tags */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#aa3000] bg-[#ffdbd0]/50 px-2.5 py-0.5 rounded">
                  {tutor.subject}
                </span>

                {tutor.isHighDemand && (
                  <span className="text-[10px] font-bold text-white bg-[#000000] px-2 py-0.5 rounded flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">local_fire_department</span>
                    High Demand
                  </span>
                )}
                {!tutor.isHighDemand && tutor.isAvailableToday && (
                  <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                    Available Today
                  </span>
                )}
              </div>

              {/* Profile Card Header */}
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={tutor.avatarUrl}
                  alt={tutor.name}
                  className="w-14 h-14 rounded-full object-cover border border-[#c5c6cd]"
                />
                <div>
                  <h3 className="font-display text-lg font-bold text-[#000000]">{tutor.name}</h3>
                  <p className="text-xs text-[#aa3000] font-semibold">{tutor.specialty}</p>
                  <p className="text-[11px] text-[#75777e] mt-0.5">{tutor.education}</p>
                </div>
              </div>

              {/* Ratings and Experience */}
              <div className="flex items-center gap-3 text-xs text-[#44474d] py-2 border-y border-[#f5f3f1] my-3">
                <span className="flex items-center gap-1 text-amber-700 font-bold">
                  ★ {tutor.rating.toFixed(1)}
                  <span className="text-[#75777e] font-normal">({tutor.reviewCount})</span>
                </span>
                <span>•</span>
                <span>{tutor.yearsExperience} Years Exp</span>
                <span>•</span>
                <span>{tutor.languages.join(', ')}</span>
              </div>

              <p className="text-xs text-[#44474d] leading-relaxed line-clamp-3 mb-4">
                {tutor.bio}
              </p>
            </div>

            {/* Price & Booking Button */}
            <div className="pt-4 border-t border-[#f5f3f1] flex items-center justify-between">
              <div>
                <span className="text-xs text-[#75777e]">Hourly Rate</span>
                <p className="text-lg font-bold font-display text-[#000000]">
                  ৳{tutor.hourlyRateBDT} <span className="text-xs font-normal text-[#75777e]">/ hr</span>
                </p>
              </div>

              <button
                onClick={() => onOpenBooking(tutor)}
                className="px-5 py-2.5 bg-[#000000] hover:bg-[#aa3000] text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                Book Session
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
