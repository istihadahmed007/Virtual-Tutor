import React, { useState, useEffect } from 'react';
import { Send, X, MessageSquare, Award, Sparkles, CheckCircle2, Calendar, User, Clock } from 'lucide-react';
import { Tutor, TutorMessage } from '../types';
import { apiClient } from '../services/api';

interface TutorMessageModalProps {
  tutor: Tutor;
  onClose: () => void;
  onOpenBooking: (tutor: Tutor) => void;
}

export const TutorMessageModal: React.FC<TutorMessageModalProps> = ({
  tutor,
  onClose,
  onOpenBooking,
}) => {
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [doubtTopic, setDoubtTopic] = useState(tutor.specialty || 'General Consultation');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    loadMessages();
  }, [tutor.id]);

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      const msgs = await apiClient.getTutorMessages(tutor.id);
      if (msgs.length > 0) {
        setMessages(msgs);
      } else {
        // Initial friendly greeting from the tutor
        setMessages([
          {
            id: 'init_1',
            senderId: tutor.id,
            senderName: tutor.name,
            senderRole: 'TEACHER',
            tutorId: tutor.id,
            userId: 'usr_istihad',
            text: `Assalamu Alaikum! I am ${tutor.name}, specializing in ${tutor.subject}. Feel free to drop your academic doubts, syllabus blockers, or request guidance for BUET/Medical admissions.`,
            timestamp: 'Earlier today',
            doubtTopic: tutor.subject,
          },
        ]);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    setIsSending(true);

    const tempMsg: TutorMessage = {
      id: `temp_${Date.now()}`,
      senderId: 'usr_istihad',
      senderName: 'Istihad Ahmed',
      senderRole: 'STUDENT',
      tutorId: tutor.id,
      userId: 'usr_istihad',
      text: inputText.trim(),
      timestamp: 'Just now',
      doubtTopic,
    };

    setMessages((prev) => [...prev, tempMsg]);
    setInputText('');

    try {
      const res = await apiClient.sendTutorMessage({
        tutorId: tutor.id,
        text: tempMsg.text,
        doubtTopic,
      });

      if (res.success && res.reply) {
        setTimeout(() => {
          setMessages((prev) => [...prev, res.reply!]);
        }, 800);
      }
    } catch {
      // ignore
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col h-[600px] max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={tutor.avatarUrl}
              alt={tutor.name}
              className="w-11 h-11 rounded-xl object-cover border border-slate-800 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white leading-tight">{tutor.name}</h3>
                {tutor.isAvailableToday && (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>
                )}
              </div>
              <p className="text-xs text-cyan-400 font-medium truncate max-w-xs">{tutor.specialty}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenBooking(tutor);
              }}
              className="bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book 1-on-1</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Topic Bar */}
        <div className="bg-slate-950/60 px-4 py-2 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Consultation Subject:</span>
            <span className="font-semibold text-slate-200">{tutor.subject}</span>
          </div>
          <span className="text-[11px] text-slate-500">{tutor.institution || 'Verified Faculty'}</span>
        </div>

        {/* Chat Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-900">
          {isLoading ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              Loading chat messages...
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.senderRole === 'STUDENT' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[11px] font-medium text-slate-400">{msg.senderName}</span>
                  <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                </div>
                <div
                  className={`max-w-md rounded-xl px-4 py-2.5 text-xs leading-relaxed ${
                    msg.senderRole === 'STUDENT'
                      ? 'bg-cyan-600 text-white rounded-br-none shadow-sm'
                      : 'bg-slate-800 text-slate-200 border border-slate-700/60 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Question Starters */}
        <div className="p-2.5 bg-slate-950/80 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-slate-500 shrink-0">Quick Starters:</span>
          {[
            'Can we focus on BUET past 10-year shortcuts in our session?',
            'What is the best way to avoid negative marking in this topic?',
            'Do you recommend solving MCQs or CQs first for this board exam?',
          ].map((starter, i) => (
            <button
              key={i}
              onClick={() => setInputText(starter)}
              className="bg-slate-900 hover:bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-slate-800 whitespace-nowrap transition-colors"
            >
              {starter}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={`Message ${tutor.name}...`}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={isSending || !inputText.trim()}
            className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
