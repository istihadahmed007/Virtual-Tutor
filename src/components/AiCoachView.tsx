import React, { useState } from 'react';
import { ChatMessage } from '../types';

interface AiCoachViewProps {
  onStartTargetedPractice: (topic: string) => void;
  initialQuery?: string;
}

export const AiCoachView: React.FC<AiCoachViewProps> = ({
  onStartTargetedPractice,
  initialQuery,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: `Hello Alex! I am your AI Exam Coach for Exam Mastery OS.\n\nI've analyzed your recent diagnostic exams. Your **Physics** score is solid (82%), but your **Calculus** accuracy dropped to **43%**, especially in Integration by Parts and Partial Fractions.\n\nHow can I help you today?`,
      timestamp: 'Just now',
      suggestions: [
        'What should I study today?',
        'Why am I weak in Calculus?',
        'Explain my latest mistakes',
        'বাংলায় বুঝিয়ে দাও',
      ],
    },
  ]);
  const [inputText, setInputText] = useState(initialQuery || '');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          mode: 'coach-chat',
          language: query.includes('বাংলা') ? 'bn' : 'en',
          context: {
            user: 'Alex Chen',
            examCountdownDays: 12,
            masteryScore: 78,
            weakestTopic: 'Calculus: Integration by Parts',
          },
        }),
      });

      const data = await res.json();
      const aiReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply || 'Let me help you structure your revision today.',
        timestamp: 'Just now',
        suggestions: [
          'Give me a 10-minute Calculus drill',
          'Explain Partial Fractions rule',
          'Show step-by-step formula in বাংলা',
        ],
      };
      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      const fallbackReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `Here is your strategy: Spend 20 minutes on **Integration by Parts** today. Focus on polynomial factoring $\\frac{3x^2+2x+1}{(x^2+1)(x+1)}$ and remember the LIATE rule for selecting $u$ and $dv$.`,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdbd0]/60 text-[#aa3000] text-xs font-bold uppercase tracking-wider mb-2">
          <span className="material-symbols-outlined text-[14px]">psychology</span>
          Intelligent Exam Mentor
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#000000]">
          AI Exam Coach & Strategy Advisor
        </h2>
        <p className="text-sm text-[#44474d] mt-1">
          Deep diagnostic insights, question walkthroughs in English and বাংলা, and personalized study schedules.
        </p>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Coach Context & Recommendations */}
        <div className="space-y-5">
          {/* Urgent Calculus Card */}
          <div className="bg-[#ffffff] rounded-2xl p-6 border border-[#ffdbd0] ambient-shadow space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#aa3000] bg-[#ffdbd0]/60 px-2.5 py-0.5 rounded">
                Urgent Recommendation
              </span>
              <span className="material-symbols-outlined text-[#aa3000] text-[20px]">warning</span>
            </div>
            <h3 className="font-display text-lg font-bold text-[#000000]">
              Calculus Accuracy Alert
            </h3>
            <p className="text-xs text-[#44474d] leading-relaxed">
              Accuracy dropped to 43% in Integration by Parts. Practice 10 targeted problems to raise your mastery level.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onStartTargetedPractice('Calculus')}
                className="w-full py-2.5 bg-[#aa3000] hover:bg-[#8e2800] text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                Start Recommended Practice (15 Mins)
              </button>
            </div>
          </div>

          {/* Context Monitor Card */}
          <div className="bg-[#ffffff] rounded-2xl p-6 border border-[#c5c6cd]/60 ambient-shadow space-y-4">
            <h4 className="font-display text-sm font-bold text-[#000000] uppercase tracking-wider">
              Coach Telemetry & Context
            </h4>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#f5f3f1]">
                <span className="text-[#75777e]">Syllabus Coverage:</span>
                <span className="font-bold text-[#000000]">78% of Target</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#f5f3f1]">
                <span className="text-[#75777e]">Strongest Pillar:</span>
                <span className="font-bold text-green-700">Physics (82%)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#f5f3f1]">
                <span className="text-[#75777e]">Critical Bottleneck:</span>
                <span className="font-bold text-[#aa3000]">Calculus (43%)</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[#75777e]">Days to Exam:</span>
                <span className="font-bold text-[#000000]">12 Days</span>
              </div>
            </div>
          </div>

          {/* Quick Prompts */}
          <div className="bg-[#f5f3f1] rounded-2xl p-5 border border-[#c5c6cd]/50 space-y-2.5">
            <h5 className="text-xs font-bold text-[#000000] uppercase tracking-wider">
              Quick Prompt Starters
            </h5>
            <div className="space-y-1.5">
              {[
                'Strategy: What should I study today?',
                'Analysis: Why am I weak in Calculus?',
                'Review: Explain my latest mistakes',
                'Language: বাংলায় সম্পূর্ণ গাইডলাইন দাও',
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(p)}
                  className="w-full p-2 text-left text-xs bg-[#ffffff] hover:bg-[#eae8e6] text-[#1b1c1b] rounded-lg border border-[#c5c6cd]/50 transition-colors block"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Chat Panel */}
        <div className="lg:col-span-2 bg-[#ffffff] rounded-2xl border border-[#c5c6cd]/60 ambient-shadow flex flex-col h-[650px] overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-[#c5c6cd]/50 flex items-center justify-between bg-[#fbf9f7]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#000000] text-[#ffb59e] flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[20px]">psychology</span>
              </div>
              <div>
                <h4 className="font-display text-sm font-bold text-[#000000] flex items-center gap-1.5">
                  Exam Mastery AI Coach
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                </h4>
                <p className="text-[11px] text-[#75777e]">Online • Ready with mathematical reasoning & Bengali support</p>
              </div>
            </div>

            <button
              onClick={() =>
                setMessages([
                  {
                    id: 'm-reset',
                    sender: 'ai',
                    text: 'Chat history cleared. How can I help with your exam prep today?',
                    timestamp: 'Just now',
                  },
                ])
              }
              className="text-xs text-[#75777e] hover:text-[#000000] underline"
            >
              Clear Chat
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-lg bg-[#000000] text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    AI
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-2 ${
                    msg.sender === 'user'
                      ? 'bg-[#000000] text-white rounded-br-none'
                      : 'bg-[#f5f3f1] text-[#1b1c1b] rounded-bl-none border border-[#c5c6cd]/60'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Suggestion Chips */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {msg.suggestions.map((sug, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => sendMessage(sug)}
                          className="text-[11px] bg-[#ffffff] hover:bg-[#eae8e6] text-[#000000] font-semibold px-2.5 py-1 rounded-full border border-[#c5c6cd] transition-colors"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}

                  <span
                    className={`block text-[10px] text-right mt-1 ${
                      msg.sender === 'user' ? 'text-gray-300' : 'text-[#75777e]'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start items-center">
                <div className="w-8 h-8 rounded-lg bg-[#000000] text-white flex items-center justify-center shrink-0 text-xs font-bold">
                  AI
                </div>
                <div className="bg-[#f5f3f1] p-3 rounded-2xl border border-[#c5c6cd]/60 flex items-center gap-2 text-xs text-[#75777e]">
                  <div className="w-4 h-4 border-2 border-[#aa3000] border-t-transparent rounded-full animate-spin" />
                  Exam Coach is thinking...
                </div>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <div className="p-3.5 border-t border-[#c5c6cd]/50 bg-[#fbf9f7] flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') sendMessage();
              }}
              placeholder="Ask anything (e.g. 'Explain isothermal gas work in বাংলা', 'Give me calculus tips')..."
              className="flex-1 bg-[#ffffff] border border-[#c5c6cd] rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#aa3000]"
            />

            <button
              onClick={() => sendMessage()}
              disabled={isLoading || !inputText.trim()}
              className="px-4 py-2.5 bg-[#aa3000] hover:bg-[#8e2800] disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
