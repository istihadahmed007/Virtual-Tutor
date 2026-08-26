import React, { useState, useEffect } from 'react';
import {
  Search,
  Zap,
  Calendar,
  Clock,
  Star,
  Award,
  BookOpen,
  MessageSquare,
  Video,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Filter,
  Users,
  Sparkles,
  ArrowRight,
  Play,
  FileText,
  X,
} from 'lucide-react';
import { Tutor, TutorBooking } from '../types';
import { apiClient } from '../services/api';
import { TutorLiveRoom } from './TutorLiveRoom';
import { TutorSOSModal } from './TutorSOSModal';
import { TutorMessageModal } from './TutorMessageModal';

interface TutorsViewProps {
  tutors: Tutor[];
  onOpenBooking: (tutor: Tutor) => void;
  preferredLanguage?: 'en' | 'bn';
}

export const TutorsView: React.FC<TutorsViewProps> = ({
  tutors: initialTutors,
  onOpenBooking,
  preferredLanguage = 'bn',
}) => {
  const isBn = preferredLanguage === 'bn';

  // Navigation Sub-tab: 'directory' | 'my_sessions'
  const [activeTab, setActiveTab] = useState<'directory' | 'my_sessions'>('directory');

  // Tutor list state
  const [tutors, setTutors] = useState<Tutor[]>(initialTutors);
  const [filterSubject, setFilterSubject] = useState<string>('All');
  const [filterAvailableToday, setFilterAvailableToday] = useState(false);
  const [filterUnder1000, setFilterUnder1000] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Selected tutor for detail drawer
  const [selectedTutorForDetail, setSelectedTutorForDetail] = useState<Tutor | null>(null);

  // Modals state
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [messagingTutor, setMessagingTutor] = useState<Tutor | null>(null);
  const [activeLiveSession, setActiveLiveSession] = useState<{
    booking: TutorBooking;
    tutor?: Tutor;
  } | null>(null);

  // My bookings state
  const [myBookings, setMyBookings] = useState<TutorBooking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  // Selected booking for viewing prescription modal
  const [viewingPrescriptionBooking, setViewingPrescriptionBooking] = useState<TutorBooking | null>(
    null
  );

  useEffect(() => {
    loadTutors();
    loadMyBookings();
  }, []);

  const loadTutors = async () => {
    try {
      const data = await apiClient.getTutors();
      if (data && data.length > 0) {
        setTutors(data);
      }
    } catch {
      // fallback to initialTutors
    }
  };

  const loadMyBookings = async () => {
    setIsLoadingBookings(true);
    try {
      const bookings = await apiClient.getMyBookings();
      setMyBookings(bookings);
    } catch {
      // ignore
    } finally {
      setIsLoadingBookings(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await apiClient.cancelBooking(bookingId);
      loadMyBookings();
    } catch {
      // ignore
    }
  };

  const filteredTutors = tutors.filter((tutor) => {
    if (filterSubject !== 'All') {
      const sub = tutor.subject.toLowerCase();
      const list = tutor.subjectsList?.map((s) => s.toLowerCase()) || [];
      const f = filterSubject.toLowerCase();
      const match =
        sub.includes(f) ||
        list.some((s) => s.includes(f)) ||
        (filterSubject === 'Mathematics' && (sub.includes('math') || sub.includes('calculus'))) ||
        (filterSubject === 'Bangla & English' && (sub.includes('bangla') || sub.includes('english') || sub.includes('ict')));
      if (!match) return false;
    }
    if (filterAvailableToday && !tutor.isAvailableToday && !tutor.isAvailableNow) return false;
    if (filterUnder1000 && tutor.hourlyRateBDT > 1000) return false;
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
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans text-slate-100 animate-in fade-in duration-200">
      {/* 15-Minute Rapid SOS Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-cyan-950/60 border border-amber-500/30 p-5 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 shrink-0 shadow-lg shadow-amber-500/20">
              <Zap className="w-6 h-6 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-700/60">
                  {isBn ? 'জরুরি ডাউট সমাধান' : 'Instant 15-Min Doubt SOS'}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {isBn ? '৩ জন শিক্ষক এখন লাইভ' : '3 Verified Mentors Online'}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                {isBn
                  ? 'কোনো অঙ্ক বা কনসেপ্টে আটকে গেছেন? ৬০ সেকেন্ডে বুয়েট/মেডিকেল শিক্ষকের সাথে যুক্ত হন!'
                  : 'Stuck on a tricky problem or admission concept? Connect with BUET/DMC mentors in 60s!'}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                {isBn
                  ? 'দ্রুত ১৫ মিনিটের লাইভ হোয়াইটবোর্ড সেশন • মাত্র ৳৩৫০ BDT • তাৎক্ষণিক ডায়াগনস্টিক নোট'
                  : 'Rapid 15-minute whiteboard consultation • ৳350 BDT • Real-time interactive breakdown'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSOSOpen(true)}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95 shrink-0 cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>{isBn ? 'তাৎক্ষণিক SOS শুরু করুন' : 'Launch Instant SOS'}</span>
          </button>
        </div>
      </div>

      {/* Main Header & Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2 border border-cyan-800">
            <Award className="w-3.5 h-3.5" />
            {isBn ? '১-অন-১ ভেরিফাইড মেন্টরশিপ' : '1-on-1 Verified Faculty Mentorship'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            {isBn ? 'বাংলাদেশের শীর্ষ বিশ্ববিদ্যালয় ফ্যাকাল্টি প্যানেল' : 'Top Bangladesh University Mentors'}
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            {isBn
              ? 'বুয়েট, ঢাকা মেডিকেল কলেজ ও ঢাকা বিশ্ববিদ্যালয়ের অভিজ্ঞ শিক্ষক ও অলিম্পিয়াড কোচের সাথে সরাসরি লাইভ সেশনে দুর্বলতা দূর করুন।'
              : 'Direct 1-on-1 live mentoring, step-by-step diagnostic prescriptions, and entrance shortcut masterclasses.'}
          </p>
        </div>

        {/* View Switcher: Directory vs My Bookings */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('directory')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'directory'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{isBn ? 'শিক্ষক তালিকা' : 'Explore Mentors'}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('my_sessions');
              loadMyBookings();
            }}
            className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'my_sessions'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{isBn ? 'আমার সেশনসমূহ' : 'My Sessions'}</span>
            {myBookings.filter((b) => b.status === 'CONFIRMED').length > 0 && (
              <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
                {myBookings.filter((b) => b.status === 'CONFIRMED').length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* TAB 1: MENTORS DIRECTORY */}
      {activeTab === 'directory' && (
        <div className="space-y-6">
          {/* Search & Subject Filter Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isBn ? 'নাম, BUET, DMC বা বিষয় দিয়ে খুঁজুন...' : 'Search tutor, BUET, DMC, topic...'}
                className="w-full pl-9 pr-8 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Subject Filters */}
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              {[
                { id: 'All', labelEn: 'All Subjects', labelBn: 'সব বিষয়' },
                { id: 'Mathematics', labelEn: 'Mathematics', labelBn: 'উচ্চতর গণিত' },
                { id: 'Physics', labelEn: 'Physics', labelBn: 'পদার্থবিজ্ঞান' },
                { id: 'Chemistry', labelEn: 'Chemistry', labelBn: 'রসায়ন' },
                { id: 'Biology', labelEn: 'Biology & Medical', labelBn: 'জীববিজ্ঞান' },
                { id: 'Bangla & English', labelEn: 'ICT & English', labelBn: 'আইসিটি ও ইংরেজি' },
              ].map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setFilterSubject(sub.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    filterSubject === sub.id
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {isBn ? sub.labelBn : sub.labelEn}
                </button>
              ))}

              <div className="h-4 w-px bg-slate-800 mx-1 hidden lg:block" />

              {/* Toggles */}
              <button
                onClick={() => setFilterAvailableToday(!filterAvailableToday)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
                  filterAvailableToday
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Clock className="w-3 h-3 text-emerald-400" />
                <span>{isBn ? 'আজই বুকিংযোগ্য' : 'Available Today'}</span>
              </button>

              <button
                onClick={() => setFilterUnder1000(!filterUnder1000)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  filterUnder1000
                    ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{isBn ? '৳১,০০০ এর নিচে' : 'Under ৳1,000'}</span>
              </button>
            </div>
          </div>

          {/* Results count banner if filter active */}
          {(filterSubject !== 'All' || filterAvailableToday || filterUnder1000 || searchQuery) && (
            <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-800">
              <span>
                {isBn
                  ? `ফিল্টার অনুযায়ী ${filteredTutors.length} জন ভেরিফাইড শিক্ষক পাওয়া গেছে`
                  : `Showing ${filteredTutors.length} verified mentors matching criteria`}
              </span>
              <button
                onClick={() => {
                  setFilterSubject('All');
                  setFilterAvailableToday(false);
                  setFilterUnder1000(false);
                  setSearchQuery('');
                }}
                className="text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                {isBn ? 'ফিল্টার রিসেট করুন' : 'Reset filters'}
              </button>
            </div>
          )}

          {/* Mentors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTutors.map((tutor) => (
              <div
                key={tutor.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-xl transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 border border-cyan-800 px-2.5 py-0.5 rounded">
                      {tutor.subject.split('&')[0]?.trim()}
                    </span>

                    {tutor.isAvailableNow && (
                      <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-700 px-2 py-0.5 rounded flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {isBn ? 'লাইভ অনলাইন' : 'Live Online'}
                      </span>
                    )}
                    {!tutor.isAvailableNow && tutor.isAvailableToday && (
                      <span className="text-[10px] font-semibold text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                        {isBn ? 'আজ স্লট আছে' : 'Slots Today'}
                      </span>
                    )}
                  </div>

                  {/* Profile Header */}
                  <div className="flex items-start gap-3.5 mb-3">
                    <div className="relative shrink-0">
                      <img
                        src={tutor.avatarUrl}
                        alt={tutor.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-800 shadow-md group-hover:border-cyan-500/50 transition-colors"
                      />
                      <span
                        className="absolute -bottom-1 -right-1 bg-cyan-600 text-white rounded-full p-0.5 text-[9px] shadow"
                        title="Verified Faculty"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </span>
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-white leading-tight truncate">
                        {tutor.name}
                      </h3>
                      <p className="text-xs text-cyan-400 font-medium mt-0.5 line-clamp-1">
                        {tutor.specialty}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                        {tutor.institution || tutor.education}
                      </p>
                    </div>
                  </div>

                  {/* Stats Bar */}
                  <div className="flex items-center gap-3 text-xs text-slate-400 py-2 border-y border-slate-800/80 my-3">
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {tutor.rating.toFixed(1)}
                      <span className="text-slate-500 font-normal">({tutor.reviewCount})</span>
                    </span>
                    <span>•</span>
                    <span>
                      {tutor.yearsExperience} {isBn ? 'বছরের অভিজ্ঞতা' : 'Yrs Exp'}
                    </span>
                    <span>•</span>
                    <span>
                      {tutor.totalStudentsTaught || 600}+ {isBn ? 'শিক্ষার্থী' : 'Students'}
                    </span>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 mb-3">
                    {tutor.bio}
                  </p>

                  {/* Teaching Style Tags */}
                  {tutor.teachingStyle && tutor.teachingStyle.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {tutor.teachingStyle.slice(0, 2).map((st, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-slate-950 text-slate-400 text-[10px] rounded border border-slate-800"
                        >
                          {st}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Available Time Slots Preview */}
                  {tutor.availableTimeSlots && tutor.availableTimeSlots.length > 0 && (
                    <div className="mb-4 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                        {isBn ? 'আসন্ন সময় স্লট:' : 'Upcoming Slots:'}
                      </span>
                      <div className="space-y-1">
                        {tutor.availableTimeSlots.slice(0, 2).map((slot, idx) => (
                          <div
                            key={idx}
                            className="text-[11px] text-slate-300 flex items-center gap-1.5"
                          >
                            <Clock className="w-3 h-3 text-cyan-400" />
                            <span>{slot}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Actions & Pricing */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] text-slate-400 block">{isBn ? 'ঘণ্টাপ্রতি ফি' : 'Rate'}</span>
                    <p className="text-base font-bold text-emerald-400">
                      ৳{tutor.hourlyRateBDT}{' '}
                      <span className="text-xs font-normal text-slate-400">/ {isBn ? 'ঘণ্টা' : 'hr'}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setMessagingTutor(tutor)}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors"
                      title={isBn ? 'শিক্ষককে মেসেজ দিন' : 'Message Tutor'}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onOpenBooking(tutor)}
                      className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-cyan-600/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{isBn ? 'বুক করুন' : 'Book 1-on-1'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MY BOOKED SESSIONS */}
      {activeTab === 'my_sessions' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {isBn ? 'আপনার মেন্টরিং সেশন ও শিডিউল' : 'My 1-on-1 Mentorship Sessions'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isBn
                      ? 'নিশ্চিতকৃত লাইভ ক্লাসরুম লিংক, ডায়াগনস্টিক প্রেসক্রিপশন ও রিভিশন নোট'
                      : 'Live interactive whiteboard rooms, prescriptions, and past recordings'}
                  </p>
                </div>
              </div>

              <button
                onClick={loadMyBookings}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                {isBn ? 'রিফ্রেশ করুন' : 'Refresh'}
              </button>
            </div>

            {isLoadingBookings ? (
              <div className="py-12 text-center text-xs text-slate-400">
                Loading your sessions...
              </div>
            ) : myBookings.length === 0 ? (
              <div className="py-16 text-center bg-slate-950 rounded-2xl border border-slate-800/80 p-8 space-y-3">
                <Calendar className="w-10 h-10 text-slate-600 mx-auto" />
                <h4 className="text-sm font-semibold text-slate-200">
                  {isBn ? 'কোনো সক্রিয় বুকিং নেই' : 'No Active Mentorship Sessions'}
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {isBn
                    ? 'আমাদের শীর্ষ শিক্ষকদের সাথে ১-অন-১ লাইভ সেশন বুক করে আপনার অ্যাডমিশন প্রস্তুতি জোরদার করুন।'
                    : 'Book your 1-on-1 session with top university mentors to eliminate stubborn mistakes.'}
                </p>
                <button
                  onClick={() => setActiveTab('directory')}
                  className="mt-2 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
                >
                  {isBn ? 'শিক্ষক তালিকা দেখুন' : 'Explore Verified Mentors'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myBookings.map((b) => {
                  const isUpcoming = b.status === 'CONFIRMED';
                  const isCompleted = b.status === 'COMPLETED';

                  return (
                    <div
                      key={b.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        isUpcoming
                          ? 'bg-slate-950 border-cyan-500/40 shadow-lg shadow-cyan-950/20'
                          : 'bg-slate-950/60 border-slate-800'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Session details */}
                        <div className="flex items-start gap-4">
                          <img
                            src={
                              b.tutorAvatar ||
                              'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&auto=format&fit=crop&q=80'
                            }
                            alt={b.tutorName}
                            className="w-14 h-14 rounded-2xl object-cover border border-slate-800 shrink-0"
                          />

                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                  isUpcoming
                                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                    : isCompleted
                                    ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                                    : 'bg-slate-800 text-slate-400'
                                }`}
                              >
                                {b.status}
                              </span>

                              <span className="text-xs text-slate-400 font-medium">
                                Meeting ID: <span className="font-mono text-cyan-300">{b.meetingCode}</span>
                              </span>
                            </div>

                            <h4 className="text-base font-bold text-white">{b.topic}</h4>
                            <p className="text-xs text-cyan-400 font-medium">
                              {b.tutorName} • {b.subject}
                            </p>

                            <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
                              <span className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                                {b.date}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                                {b.timeSlot}
                              </span>
                              <span className="font-semibold text-emerald-400">৳{b.rateBDT} BDT</span>
                            </div>

                            {b.sessionNotes && (
                              <p className="text-xs text-slate-300 mt-2 bg-slate-900 p-2.5 rounded-lg border border-slate-800/80">
                                <strong>Mentor Focus:</strong> {b.sessionNotes}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          {isUpcoming && (
                            <>
                              <button
                                onClick={() => {
                                  const matchedTutor = tutors.find((t) => t.id === b.tutorId || t.name === b.tutorName);
                                  setActiveLiveSession({ booking: b, tutor: matchedTutor });
                                }}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-emerald-600/20 active:scale-95 flex items-center gap-2 transition-all cursor-pointer"
                              >
                                <Video className="w-4 h-4" />
                                <span>{isBn ? 'লাইভ ক্লাসরুমে প্রবেশ করুন' : 'Join Live Classroom'}</span>
                              </button>

                              <button
                                onClick={() => handleCancelBooking(b.id)}
                                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-red-400 rounded-xl text-xs transition-colors"
                              >
                                Cancel
                              </button>
                            </>
                          )}

                          {isCompleted && (
                            <>
                              {b.prescription && (
                                <button
                                  onClick={() => setViewingPrescriptionBooking(b)}
                                  className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                  <span>{isBn ? 'প্রেসক্রিপশন দেখুন' : 'View Prescription'}</span>
                                </button>
                              )}

                              {b.hasRecording && (
                                <button
                                  onClick={() => {
                                    const matchedTutor = tutors.find((t) => t.id === b.tutorId || t.name === b.tutorName);
                                    setActiveLiveSession({ booking: b, tutor: matchedTutor });
                                  }}
                                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                                >
                                  <Play className="w-3.5 h-3.5 text-cyan-400" />
                                  <span>Replay ({b.recordingDurationMinutes || 58}m)</span>
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: Instant 15-Minute SOS */}
      {isSOSOpen && (
        <TutorSOSModal
          onClose={() => setIsSOSOpen(false)}
          onSessionMatched={(booking) => {
            setIsSOSOpen(false);
            const matchedTutor = tutors.find((t) => t.id === booking.tutorId || t.name === booking.tutorName);
            setActiveLiveSession({ booking, tutor: matchedTutor });
            loadMyBookings();
          }}
        />
      )}

      {/* MODAL: Direct Tutor Messaging */}
      {messagingTutor && (
        <TutorMessageModal
          tutor={messagingTutor}
          onClose={() => setMessagingTutor(null)}
          onOpenBooking={(t) => onOpenBooking(t)}
        />
      )}

      {/* MODAL: Fullscreen Interactive Live Classroom */}
      {activeLiveSession && (
        <TutorLiveRoom
          booking={activeLiveSession.booking}
          tutor={activeLiveSession.tutor}
          onClose={() => {
            setActiveLiveSession(null);
            loadMyBookings();
          }}
          onSessionUpdated={() => {
            loadMyBookings();
          }}
        />
      )}

      {/* MODAL: Prescription View Details */}
      {viewingPrescriptionBooking && viewingPrescriptionBooking.prescription && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Diagnostic Study Prescription</h3>
                  <p className="text-xs text-slate-400">
                    Recorded for {viewingPrescriptionBooking.studentName} on {viewingPrescriptionBooking.topic}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingPrescriptionBooking(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <h4 className="font-semibold text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Key Strengths
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  {viewingPrescriptionBooking.prescription.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <h4 className="font-semibold text-amber-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Identified Weaknesses & Error Patterns
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  {viewingPrescriptionBooking.prescription.weaknesses.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <h4 className="font-semibold text-cyan-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  Action Items & Remediation Plan
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  {viewingPrescriptionBooking.prescription.actionItems.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <h4 className="font-semibold text-purple-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  Recommended Practice Problems
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  {viewingPrescriptionBooking.prescription.recommendedProblems.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setViewingPrescriptionBooking(null)}
                className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
              >
                Close Prescription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
