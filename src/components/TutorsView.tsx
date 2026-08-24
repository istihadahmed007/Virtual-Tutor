import React, { useState } from 'react';
import { Tutor } from '../types';

interface TutorsViewProps {
  tutors: Tutor[];
  onOpenBooking: (tutor: Tutor) => void;
  preferredLanguage?: 'en' | 'bn';
}

const TutorAvatar: React.FC<{ name: string; avatarUrl?: string; className?: string }> = ({
  name,
  avatarUrl,
  className = 'w-14 h-14 rounded-2xl object-cover border border-[#c5c6cd]',
}) => {
  const [hasError, setHasError] = useState(false);

  const getInitials = (n: string) => {
    return n
      .replace(/^(Dr\.|Prof\.|Engr\.)\s*/i, '')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join('');
  };

  if (!avatarUrl || hasError) {
    return (
      <div
        className="w-14 h-14 rounded-2xl bg-[#000000] text-white flex items-center justify-center font-bold text-sm tracking-wider border border-[#c5c6cd] shadow-sm flex-shrink-0"
      >
        {getInitials(name) || 'VT'}
      </div>
    );
  }

  return (
    <img
      src={avatarUrl}
      alt={name}
      onError={() => setHasError(true)}
      className={className}
      referrerPolicy="no-referrer"
    />
  );
};

export const TutorsView: React.FC<TutorsViewProps> = ({
  tutors,
  onOpenBooking,
  preferredLanguage = 'bn',
}) => {
  const [filterSubject, setFilterSubject] = useState<string>('All');
  const [filterAvailableToday, setFilterAvailableToday] = useState(false);
  const [filterUnder1000, setFilterUnder1000] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isBn = preferredLanguage === 'bn';

  const filteredTutors = tutors.filter((tutor) => {
    // Subject filter
    if (filterSubject !== 'All') {
      const subjectMatch =
        tutor.subject.toLowerCase().includes(filterSubject.toLowerCase()) ||
        (filterSubject === 'Mathematics' && tutor.subject.toLowerCase().includes('math')) ||
        (filterSubject === 'Bangla & English' &&
          (tutor.subject.toLowerCase().includes('bangla') || tutor.subject.toLowerCase().includes('english')));
      if (!subjectMatch) return false;
    }
    // Availability filter
    if (filterAvailableToday && !tutor.isAvailableToday) return false;
    // Price filter
    if (filterUnder1000 && tutor.hourlyRateBDT > 1000) return false;
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        tutor.name.toLowerCase().includes(q) ||
        tutor.specialty.toLowerCase().includes(q) ||
        tutor.education.toLowerCase().includes(q) ||
        (tutor.institution && tutor.institution.toLowerCase().includes(q)) ||
        tutor.bio.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto pb-16">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f5f3f1] text-[#000000] text-xs font-bold uppercase tracking-wider mb-2 border border-[#c5c6cd]/60">
            <span className="material-symbols-outlined text-[14px]">school</span>
            {isBn ? '১-অন-১ একাডেমিক মেন্টরশিপ' : '1-on-1 Academic Mentorship'}
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#000000]">
            {isBn ? 'ভেরিফাইড এক্সাম টিউটর ও মেন্টর প্যানেল' : 'Verified Exam Tutors & Mentors'}
          </h2>
          <p className="text-sm text-[#44474d] mt-1 max-w-2xl">
            {isBn
              ? 'বুয়েট, ঢাকা মেডিকেল কলেজ ও ঢাকা বিশ্ববিদ্যালয়ের অভিজ্ঞ শিক্ষক ও অলিম্পিয়াড কোচের সাথে সরাসরি লাইভ সেশনে দুর্বলতা দূর করুন।'
              : 'Master high-yield concepts and resolve stubborn mistakes with top university lecturers, BUET/DMC alumni, and Olympiad coaches.'}
          </p>
        </div>

        {/* Search Box */}
        <div className="relative min-w-[280px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isBn ? 'শিক্ষক বা প্রতিষ্ঠান দিয়ে খুঁজুন (উদাঃ BUET, DMC)...' : 'Search tutor, BUET, DMC, topic...'}
            className="w-full pl-9 pr-4 py-2 bg-white border border-[#c5c6cd] rounded-xl text-xs text-[#000000] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#000000]/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 pt-2 pb-4 border-b border-[#c5c6cd]/40">
        <button
          onClick={() => setFilterSubject('All')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            filterSubject === 'All'
              ? 'bg-[#000000] text-white shadow-sm'
              : 'bg-[#ffffff] text-[#44474d] border border-[#c5c6cd] hover:border-gray-400'
          }`}
        >
          {isBn ? 'সব বিষয় (All Subjects)' : 'All Subjects'}
        </button>

        <button
          onClick={() => setFilterSubject('Mathematics')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            filterSubject === 'Mathematics'
              ? 'bg-[#aa3000] text-white shadow-sm'
              : 'bg-[#ffffff] text-[#44474d] border border-[#c5c6cd] hover:border-gray-400'
          }`}
        >
          {isBn ? 'উচ্চতর গণিত ও ক্যালকুলাস' : 'Mathematics & Calculus'}
        </button>

        <button
          onClick={() => setFilterSubject('Physics')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            filterSubject === 'Physics'
              ? 'bg-[#000000] text-white shadow-sm'
              : 'bg-[#ffffff] text-[#44474d] border border-[#c5c6cd] hover:border-gray-400'
          }`}
        >
          {isBn ? 'পদার্থবিজ্ঞান' : 'Physics'}
        </button>

        <button
          onClick={() => setFilterSubject('Chemistry')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            filterSubject === 'Chemistry'
              ? 'bg-[#000000] text-white shadow-sm'
              : 'bg-[#ffffff] text-[#44474d] border border-[#c5c6cd] hover:border-gray-400'
          }`}
        >
          {isBn ? 'রসায়ন' : 'Chemistry'}
        </button>

        <button
          onClick={() => setFilterSubject('Bangla & English')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            filterSubject === 'Bangla & English'
              ? 'bg-[#000000] text-white shadow-sm'
              : 'bg-[#ffffff] text-[#44474d] border border-[#c5c6cd] hover:border-gray-400'
          }`}
        >
          {isBn ? 'বাংলা ও ইংরেজি' : 'Bangla & English'}
        </button>

        <div className="h-4 w-[1px] bg-gray-300 mx-1 hidden sm:block" />

        <button
          onClick={() => setFilterAvailableToday(!filterAvailableToday)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
            filterAvailableToday
              ? 'bg-emerald-700 text-white border-emerald-700'
              : 'bg-[#ffffff] text-[#44474d] border-[#c5c6cd] hover:border-gray-400'
          }`}
        >
          ⚡ {isBn ? 'আজই বুকিংযোগ্য (Available Today)' : 'Available Today'}
        </button>

        <button
          onClick={() => setFilterUnder1000(!filterUnder1000)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
            filterUnder1000
              ? 'bg-[#000000] text-white border-[#000000]'
              : 'bg-[#ffffff] text-[#44474d] border-[#c5c6cd] hover:border-gray-400'
          }`}
        >
          {isBn ? '৳১,০০০ এর নিচে (Under ৳1,000 / hr)' : 'Under ৳1,000 / hr'}
        </button>
      </div>

      {/* Results Count Banner if filter is applied */}
      {(filterSubject !== 'All' || filterAvailableToday || filterUnder1000 || searchQuery) && (
        <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
          <span>
            {isBn ? `ফিল্টার অনুযায়ী ${filteredTutors.length} জন শিক্ষক পাওয়া গেছে` : `Found ${filteredTutors.length} verified tutors matching filters`}
          </span>
          <button
            onClick={() => {
              setFilterSubject('All');
              setFilterAvailableToday(false);
              setFilterUnder1000(false);
              setSearchQuery('');
            }}
            className="text-[#aa3000] hover:underline font-semibold"
          >
            {isBn ? 'ফিল্টার রিসেট করুন' : 'Reset all filters'}
          </button>
        </div>
      )}

      {/* Tutors Grid */}
      {filteredTutors.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-3xl border border-dashed border-gray-300 p-8">
          <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">person_search</span>
          <h3 className="text-base font-bold text-gray-800">
            {isBn ? 'কোনো শিক্ষক পাওয়া যায়নি' : 'No tutors match your search criteria'}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {isBn ? 'অন্য বিষয় বেছে নিন অথবা ফিল্টার রিসেট করুন।' : 'Try adjusting your subject filters or search terms.'}
          </p>
        </div>
      ) : (
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
                      {isBn ? 'উচ্চ চাহিদা' : 'High Demand'}
                    </span>
                  )}
                  {!tutor.isHighDemand && tutor.isAvailableToday && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      {isBn ? 'আজই উপলব্ধ' : 'Available Today'}
                    </span>
                  )}
                </div>

                {/* Profile Card Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative flex-shrink-0">
                    <TutorAvatar
                      name={tutor.name}
                      avatarUrl={tutor.avatarUrl}
                      className="w-14 h-14 rounded-2xl object-cover border border-[#c5c6cd]"
                    />
                    <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-0.5 text-[10px] shadow" title="Verified Faculty">
                      <span className="material-symbols-outlined text-[12px] block">verified</span>
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-[#000000] leading-tight">{tutor.name}</h3>
                    <p className="text-xs text-[#aa3000] font-semibold mt-0.5">{tutor.specialty}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="material-symbols-outlined text-[13px] text-gray-500">account_balance</span>
                      <p className="text-[11px] text-[#75777e] font-medium truncate max-w-[200px]">{tutor.education}</p>
                    </div>
                  </div>
                </div>

                {/* Ratings, Experience and Language Badges */}
                <div className="flex items-center gap-3 text-xs text-[#44474d] py-2 border-y border-[#f5f3f1] my-3">
                  <span className="flex items-center gap-1 text-amber-700 font-bold">
                    ★ {tutor.rating.toFixed(1)}
                    <span className="text-[#75777e] font-normal">({tutor.reviewCount})</span>
                  </span>
                  <span>•</span>
                  <span>{tutor.yearsExperience} {isBn ? 'বছরের অভিজ্ঞতা' : 'Years Exp'}</span>
                  <span>•</span>
                  <span>{tutor.languages.join(', ')}</span>
                </div>

                {/* Bio */}
                <p className="text-xs text-[#44474d] leading-relaxed line-clamp-3 mb-4">
                  {tutor.bio}
                </p>

                {/* Available Slots Preview */}
                {tutor.availableTimeSlots && tutor.availableTimeSlots.length > 0 && (
                  <div className="mb-4">
                    <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                      {isBn ? 'উপলব্ধ স্লটসমূহ:' : 'Available Slots:'}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {tutor.availableTimeSlots.slice(0, 2).map((slot, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-medium rounded-md border border-gray-200 flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[10px] text-gray-400">schedule</span>
                          {slot}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Price & Booking Button */}
              <div className="pt-4 border-t border-[#f5f3f1] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#75777e] block">{isBn ? 'ঘণ্টাপ্রতি ফি' : 'Hourly Rate'}</span>
                  <p className="text-lg font-bold font-display text-[#000000]">
                    ৳{tutor.hourlyRateBDT} <span className="text-xs font-normal text-[#75777e]">/ {isBn ? 'ঘণ্টা' : 'hr'}</span>
                  </p>
                </div>

                <button
                  onClick={() => onOpenBooking(tutor)}
                  className="px-5 py-2.5 bg-[#000000] hover:bg-[#aa3000] text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                  {isBn ? 'সেশন বুক করুন' : 'Book Session'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
