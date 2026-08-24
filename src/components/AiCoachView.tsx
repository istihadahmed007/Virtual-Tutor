import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, SocraticMode } from '../types';
import { useMastery } from '../hooks/useMastery';
import { apiClient } from '../services/api';

interface AiCoachViewProps {
  onStartTargetedPractice: (topic: string) => void;
  initialQuery?: string;
}

const MODES: { id: SocraticMode; label: string }[] = [
  { id: 'Socratic Tutor', label: 'Socratic' },
  { id: 'Explain', label: 'Explain' },
  { id: 'Quick Hint', label: 'Quick Hint' },
  { id: 'Exam Coach', label: 'Exam Coach' },
  { id: 'Deep Tutor', label: 'Deep Tutor' },
];

const QUICK_ACTIONS = [
  { id: 'give-hint', label: 'Give Hint', icon: 'lightbulb' },
  { id: 'show-steps', label: 'Show Steps', icon: 'format_list_numbered' },
  { id: 'give-example', label: 'Give Example', icon: 'auto_awesome' },
  { id: 'quiz-me', label: 'Quiz Me', icon: 'quiz' },
];

export const AiCoachView: React.FC<AiCoachViewProps> = ({
  onStartTargetedPractice,
  initialQuery,
}) => {
  const { overallScore, weakestTopics } = useMastery();
  const primaryWeakTopic = weakestTopics[0]?.topic || 'Integration by Parts';

  const [activeMode, setActiveMode] = useState<SocraticMode>('Socratic Tutor');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'user',
      text: 'Can you help me solve this integral?\n\n∫ x sin(x) dx',
      timestamp: '10:28 PM',
    },
    {
      id: 'm-2',
      sender: 'ai',
      text: 'Great question! Let\'s solve this step by step using integration by parts.\n\nWhat do you think we should choose for:\n• **u** (the part to differentiate)\n• **dv** (the part to integrate)\n\nTake a moment to think about it! 🤔',
      timestamp: '10:30 PM',
      responseType: 'socratic',
      suggestions: [
        'u = x, dv = sin(x) dx',
        'u = sin(x), dv = x dx',
        'Remind me of the LIATE rule',
        'বাংলায় বুঝিয়ে দাও',
      ],
    },
  ]);

  const [inputText, setInputText] = useState(initialQuery || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice dictation is not supported in this browser. Please type your answer.');
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const sendMessage = async (textToSend?: string, actionOverride?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() && !actionOverride) return;

    const userMsgText = query || (actionOverride ? `[Action: ${actionOverride}]` : '');
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: userMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const structuredRes = await apiClient.sendAiCoachMessage({
        message: query || `Please execute action ${actionOverride} on ${primaryWeakTopic}`,
        action: actionOverride || 'chat',
        mode: activeMode,
        language: query.includes('বাংলা') || actionOverride === 'translate' ? 'bn' : 'en',
        activeTopic: primaryWeakTopic,
      });

      const aiReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: structuredRes.message || structuredRes.reply || 'Let\'s continue our step-by-step thinking.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        responseType: structuredRes.type,
        suggestions: structuredRes.suggestions || [
          'Give Hint',
          'Show Steps',
          'Give Example',
          'Quiz Me',
        ],
      };
      setMessages((prev) => [...prev, aiReply]);
    } catch {
      const fallbackReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `Using the LIATE rule (Logarithmic, Inverse trig, Algebraic, Trigonometric, Exponential):\n\nChoose:\n• **u = x** (Algebraic)\n• **dv = sin(x) dx** (Trigonometric)\n\nThen **du = dx** and **v = -cos(x)**.\nApplying $\\int u\\, dv = uv - \\int v\\, du$:\n$$\\int x\\sin(x)\\,dx = -x\\cos(x) - \\int -\\cos(x)\\,dx = -x\\cos(x) + \\sin(x) + C$$`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: ['Practice another integral', 'Explain LIATE rule', 'Quiz me'],
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] max-w-5xl mx-auto bg-[#FFFFFF] rounded-3xl border border-[#E2E8F0] shadow-sm overflow-hidden font-body animate-fadeIn">
      {/* 1. Header Bar & Mode Selector Tabs matching Mockup */}
      <div className="p-4 sm:p-5 border-b border-[#E2E8F0] bg-[#FFFFFF] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#4F46E5] to-[#7C3AED] text-white flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[18px]">smart_toy</span>
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-[#0F172A]">AI Tutor</h2>
              <p className="text-[11px] text-[#64748B]">Personalized Socratic Guidance</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-600 bg-[#ECFDF5] px-2.5 py-1 rounded-full border border-[#A7F3D0] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </span>
          </div>
        </div>

        {/* Top Tabs: Socratic, Explain, Quick Hint, Exam Coach, Deep Tutor */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {MODES.map((mode) => {
            const isActive = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#4F46E5] text-white shadow-sm shadow-indigo-500/20'
                    : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#0F172A]'
                }`}
              >
                {mode.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Chat Transcript Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#F8FAFC]/50">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-2xl ${
                isUser ? 'ml-auto' : 'mr-auto'
              }`}
            >
              {/* Message Bubble */}
              <div
                className={`p-4 sm:p-5 rounded-2xl text-sm leading-relaxed ${
                  isUser
                    ? 'bg-[#4F46E5] text-white shadow-md shadow-indigo-500/10 rounded-tr-xs'
                    : 'bg-[#FFFFFF] text-[#0F172A] border border-[#E2E8F0] shadow-sm rounded-tl-xs space-y-3'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">{msg.text}</div>

                {/* AI Suggestions / Follow-ups */}
                {!isUser && msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="pt-2 border-t border-[#F1F5F9] flex flex-wrap gap-2">
                    {msg.suggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => sendMessage(sug)}
                        className="px-3 py-1 bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#4F46E5] text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Timestamp */}
              <span className="text-[10px] text-[#94A3B8] font-semibold mt-1 px-1">
                {msg.timestamp}
              </span>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 p-4 bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] w-36 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#4F46E5] animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-[#4F46E5] animate-bounce [animation-delay:0.2s]" />
            <span className="w-2 h-2 rounded-full bg-[#4F46E5] animate-bounce [animation-delay:0.4s]" />
            <span className="text-xs font-bold text-[#64748B] ml-1">Thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. AI Quick Actions Row matching Mockup: Give Hint, Show Steps, Give Example, Quiz Me */}
      <div className="px-4 sm:px-6 py-3 bg-[#FFFFFF] border-t border-[#E2E8F0] flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-none">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.id}
            onClick={() => sendMessage(undefined, action.id)}
            className="px-3.5 py-2 rounded-xl bg-[#F8FAFC] hover:bg-[#EEF2FF] border border-[#E2E8F0] text-xs font-bold text-[#334155] hover:text-[#4F46E5] flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[16px] text-[#4F46E5]">
              {action.icon}
            </span>
            <span>{action.label}</span>
          </button>
        ))}
      </div>

      {/* 4. Message Composer */}
      <div className="p-4 sm:p-5 bg-[#FFFFFF] border-t border-[#E2E8F0]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex items-center gap-2 sm:gap-3"
        >
          <div className="flex-1 relative flex items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your answer or question..."
              className="w-full bg-[#F8FAFC] hover:bg-[#F1F5F9] focus:bg-[#FFFFFF] border border-[#E2E8F0] focus:border-[#4F46E5] focus:ring-2 focus:ring-[#EEF2FF] rounded-2xl px-4 py-3 text-sm text-[#0F172A] placeholder-[#94A3B8] transition-all outline-none"
            />
            {/* Voice Dictation Button */}
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`absolute right-3 p-1.5 rounded-xl transition-colors cursor-pointer ${
                isListening ? 'text-[#EF4444] bg-[#FEE2E2] animate-pulse' : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
              title="Voice dictation"
            >
              <span className="material-symbols-outlined text-[20px]">
                {isListening ? 'mic_active' : 'mic'}
              </span>
            </button>
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="w-11 h-11 rounded-2xl bg-[#4F46E5] hover:bg-[#4338CA] disabled:bg-[#CBD5E1] text-white flex items-center justify-center transition-all shadow-md shadow-indigo-500/20 active:scale-95 cursor-pointer disabled:cursor-not-allowed shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
