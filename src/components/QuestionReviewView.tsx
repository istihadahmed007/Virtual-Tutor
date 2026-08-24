import React, { useState } from 'react';
import { Question } from '../types';

interface QuestionReviewViewProps {
  questions: Question[];
  onBackToResults?: () => void;
  onNavigateTab: (tab: string) => void;
}

export const QuestionReviewView: React.FC<QuestionReviewViewProps> = ({
  questions,
  onBackToResults,
  onNavigateTab,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeExplainTab, setActiveExplainTab] = useState<'step' | 'simple' | 'bangla' | 'ai'>('step');
  const [aiCustomQuestion, setAiCustomQuestion] = useState('');
  const [aiCustomResponse, setAiCustomResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [addedToMistakeBook, setAddedToMistakeBook] = useState(false);

  const question = questions[currentIndex] || questions[0];

  const handleAskAi = async (customPrompt?: string) => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message:
            customPrompt ||
            `Please explain this question step by step: ${question.questionText} (Formula: ${question.formula || ''})`,
          mode: 'explain-question',
          language: activeExplainTab === 'bangla' ? 'bn' : 'en',
          context: {
            questionId: question.id,
            subject: question.subject,
            topic: question.topic,
          },
        }),
      });
      const data = await res.json();
      setAiCustomResponse(data.reply);
    } catch (err) {
      setAiCustomResponse(question.explanation.overview);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-16">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBackToResults && (
            <button
              onClick={onBackToResults}
              className="p-2 text-[#75777e] hover:text-[#000000] rounded-xl hover:bg-[#f5f3f1] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
          )}
          <div>
            <h2 className="font-display text-2xl font-bold text-[#000000]">
              Solution & Diagnostic Review
            </h2>
            <p className="text-xs text-[#75777e]">
              Question {currentIndex + 1} of {questions.length} • {question.subject} ({question.topic})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className={`p-2 rounded-lg border border-[#c5c6cd] ${
              currentIndex === 0 ? 'text-[#c5c6cd]' : 'hover:bg-[#f5f3f1] text-[#000000]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>
          <span className="text-xs font-mono font-bold text-[#44474d]">
            {currentIndex + 1} / {questions.length}
          </span>
          <button
            onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
            disabled={currentIndex === questions.length - 1}
            className={`p-2 rounded-lg border border-[#c5c6cd] ${
              currentIndex === questions.length - 1
                ? 'text-[#c5c6cd]'
                : 'hover:bg-[#f5f3f1] text-[#000000]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Question Review Card */}
      <div className="bg-[#ffffff] rounded-2xl p-6 sm:p-8 border border-[#c5c6cd]/60 ambient-shadow space-y-6">
        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[14px]">cancel</span>
            Incorrectly Answered
          </div>

          <button
            onClick={() => setAddedToMistakeBook(!addedToMistakeBook)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
              addedToMistakeBook
                ? 'bg-[#ffdbd0] text-[#aa3000] border-[#aa3000]'
                : 'bg-[#f5f3f1] text-[#44474d] hover:text-[#000000] border-[#c5c6cd]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {addedToMistakeBook ? 'bookmark_added' : 'bookmark_add'}
            </span>
            {addedToMistakeBook ? 'Saved in Mistake Book' : 'Add to Mistake Book'}
          </button>
        </div>

        {/* Question Text */}
        <div className="space-y-3">
          <h3 className="font-display text-xl sm:text-2xl font-bold text-[#000000] leading-snug">
            {question.questionText}
          </h3>
          {question.formula && (
            <div className="p-3.5 bg-[#f5f3f1] rounded-xl font-mono text-base text-[#000000] border border-[#c5c6cd]/70 text-center font-bold">
              {question.formula}
            </div>
          )}
        </div>

        {/* Options Breakdown */}
        <div className="space-y-3">
          {question.options.map((opt) => {
            const isCorrect = opt.id === question.correctAnswer;
            // Simulated user picked option A if correct is C, or option B if correct is A
            const isUserPick = !isCorrect && (opt.id === 'A' || opt.id === 'B');

            let optionStyle = 'bg-[#fbf9f7] border-[#c5c6cd]/70 text-[#44474d]';
            if (isCorrect) {
              optionStyle = 'bg-green-50 border-green-600 text-green-950 font-semibold ring-1 ring-green-600';
            } else if (isUserPick) {
              optionStyle = 'bg-red-50 border-red-500 text-red-950 line-through opacity-80';
            }

            return (
              <div
                key={opt.id}
                className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${optionStyle}`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                      isCorrect
                        ? 'bg-green-600 text-white'
                        : isUserPick
                        ? 'bg-red-600 text-white'
                        : 'bg-[#f5f3f1] text-[#000000] border border-[#c5c6cd]'
                    }`}
                  >
                    {opt.id}
                  </div>
                  <span className="text-sm sm:text-base">{opt.text}</span>
                </div>

                {isCorrect && (
                  <span className="text-xs font-bold text-green-700 bg-green-100 px-2.5 py-0.5 rounded flex items-center gap-1 shrink-0">
                    <span className="material-symbols-outlined text-[14px]">check</span> Correct Answer
                  </span>
                )}
                {isUserPick && (
                  <span className="text-xs font-bold text-red-700 bg-red-100 px-2.5 py-0.5 rounded flex items-center gap-1 shrink-0">
                    <span className="material-symbols-outlined text-[14px]">close</span> Your Pick
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Concept Visualization Graph (SVG / Canvas) */}
      <div className="bg-[#ffffff] rounded-2xl p-6 border border-[#c5c6cd]/60 ambient-shadow space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#aa3000]">analytics</span>
            <h4 className="font-display text-base font-bold text-[#000000]">
              Concept Visualization: {question.topic}
            </h4>
          </div>
          <span className="text-xs text-[#75777e]">Analytical Geometry & Physics Curve</span>
        </div>

        {/* SVG Graph Graphic */}
        <div className="w-full bg-[#fbf9f7] rounded-xl p-4 border border-[#c5c6cd]/50 flex items-center justify-center">
          {question.graphType === 'thermodynamics' ? (
            <svg viewBox="0 0 500 200" className="w-full max-w-lg h-44">
              {/* P-V Diagram */}
              <line x1="50" y1="170" x2="460" y2="170" stroke="#44474d" strokeWidth="2" />
              <line x1="50" y1="20" x2="50" y2="170" stroke="#44474d" strokeWidth="2" />
              <text x="440" y="190" fill="#44474d" fontSize="12" fontWeight="bold">Volume (V)</text>
              <text x="20" y="30" fill="#44474d" fontSize="12" fontWeight="bold">P</text>

              {/* Isothermal Hyperbola PV = constant */}
              <path
                d="M 100,50 Q 180,110 360,140"
                fill="none"
                stroke="#aa3000"
                strokeWidth="3"
              />
              {/* Shaded Area Under Curve representing Work */}
              <path
                d="M 100,50 Q 180,110 360,140 L 360,170 L 100,170 Z"
                fill="#ffdbd0"
                fillOpacity="0.4"
              />
              <circle cx="100" cy="50" r="5" fill="#000000" />
              <text x="95" y="40" fill="#000000" fontSize="11" fontWeight="bold">State 1 (V₁)</text>

              <circle cx="360" cy="140" r="5" fill="#000000" />
              <text x="340" y="130" fill="#000000" fontSize="11" fontWeight="bold">State 2 (V₂ = 2V₁)</text>

              <text x="180" y="160" fill="#aa3000" fontSize="11" fontWeight="bold">
                Work Done W = ∫PdV &gt; 0 (Heat Q = W)
              </text>
            </svg>
          ) : (
            <svg viewBox="0 0 500 200" className="w-full max-w-lg h-44">
              {/* Integral Decomposition Curve */}
              <line x1="40" y1="160" x2="460" y2="160" stroke="#44474d" strokeWidth="2" />
              <line x1="60" y1="20" x2="60" y2="180" stroke="#44474d" strokeWidth="2" />
              <text x="440" y="180" fill="#44474d" fontSize="12" fontWeight="bold">x</text>
              <text x="30" y="30" fill="#44474d" fontSize="12" fontWeight="bold">f(x)</text>

              <path
                d="M 70,30 Q 150,140 450,150"
                fill="none"
                stroke="#000000"
                strokeWidth="2.5"
              />
              <path
                d="M 120,80 Q 200,140 400,155 L 400,160 L 120,160 Z"
                fill="#ffdbd0"
                fillOpacity="0.4"
              />
              <text x="150" y="100" fill="#aa3000" fontSize="11" fontWeight="bold">
                ∫ 1/(x+1) dx + ∫ 2x/(x²+1) dx
              </text>
              <text x="150" y="125" fill="#44474d" fontSize="10">
                = ln|x+1| + ln(x²+1) + C
              </text>
            </svg>
          )}
        </div>
      </div>

      {/* AI Explanation & Tabs Section */}
      <div className="bg-[#ffffff] rounded-2xl p-6 sm:p-8 border border-[#c5c6cd]/60 ambient-shadow space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#c5c6cd]/50 pb-4">
          <div>
            <h4 className="font-display text-lg font-bold text-[#000000]">
              Deep Conceptual Breakdown
            </h4>
            <p className="text-xs text-[#75777e]">Select explanation mode or ask custom question</p>
          </div>

          {/* Mode Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#f5f3f1] p-1 rounded-xl border border-[#c5c6cd]/50">
            <button
              onClick={() => setActiveExplainTab('step')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeExplainTab === 'step'
                  ? 'bg-[#000000] text-white shadow-sm'
                  : 'text-[#44474d] hover:text-[#000000]'
              }`}
            >
              Step-by-Step
            </button>
            <button
              onClick={() => setActiveExplainTab('simple')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeExplainTab === 'simple'
                  ? 'bg-[#000000] text-white shadow-sm'
                  : 'text-[#44474d] hover:text-[#000000]'
              }`}
            >
              Explain Simply
            </button>
            <button
              onClick={() => setActiveExplainTab('bangla')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeExplainTab === 'bangla'
                  ? 'bg-[#aa3000] text-white shadow-sm'
                  : 'text-[#44474d] hover:text-[#000000]'
              }`}
            >
              বাংলায় ব্যাখ্যা
            </button>
            <button
              onClick={() => {
                setActiveExplainTab('ai');
                if (!aiCustomResponse) handleAskAi();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                activeExplainTab === 'ai'
                  ? 'bg-[#000000] text-white shadow-sm'
                  : 'text-[#44474d] hover:text-[#000000]'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">psychology</span>
              AI Deep Dive
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="text-sm leading-relaxed text-[#1b1c1b] space-y-4">
          {activeExplainTab === 'step' && (
            <div className="space-y-3">
              <div className="p-4 bg-[#f5f3f1] rounded-xl border border-[#c5c6cd]/50">
                <p className="font-semibold text-[#000000] mb-1">Core Premise:</p>
                <p className="text-xs text-[#44474d]">{question.explanation.overview}</p>
              </div>

              <div className="space-y-2">
                {question.explanation.stepByStep.map((step, idx) => (
                  <div key={idx} className="p-3 bg-[#ffffff] rounded-xl border border-[#c5c6cd]/40 text-xs font-medium">
                    {step}
                  </div>
                ))}
              </div>

              <div className="p-3 bg-[#ffdbd0]/40 rounded-xl border border-[#ffdbd0] text-xs text-[#aa3000] font-semibold">
                ★ Key Takeaway: {question.explanation.keyTakeaway}
              </div>
            </div>
          )}

          {activeExplainTab === 'simple' && (
            <div className="p-5 bg-[#f5f3f1] rounded-2xl border border-[#c5c6cd]/60 space-y-3">
              <h5 className="font-display text-base font-bold text-[#000000]">Intuitive Plain English</h5>
              <p className="text-sm text-[#44474d] leading-relaxed">
                {question.explanation.simpleExplanation}
              </p>
            </div>
          )}

          {activeExplainTab === 'bangla' && (
            <div className="p-5 bg-[#fff8f5] rounded-2xl border border-[#ffdbd0] space-y-3">
              <h5 className="font-display text-base font-bold text-[#aa3000]">সহজ বাংলায় পূর্ণাঙ্গ ব্যাখ্যা</h5>
              <p className="text-sm text-[#3a0b00] leading-relaxed font-sans">
                {question.explanation.banglaExplanation}
              </p>
            </div>
          )}

          {activeExplainTab === 'ai' && (
            <div className="space-y-4">
              {isAiLoading ? (
                <div className="p-8 text-center space-y-2">
                  <div className="w-8 h-8 border-3 border-[#aa3000] border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-[#75777e]">AI Coach is analyzing derivation steps...</p>
                </div>
              ) : (
                <div className="p-5 bg-[#f5f3f1] rounded-2xl border border-[#c5c6cd]/60 whitespace-pre-line text-xs font-mono text-[#000000] leading-relaxed">
                  {aiCustomResponse || question.explanation.overview}
                </div>
              )}

              {/* Ask Followup in this context */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  value={aiCustomQuestion}
                  onChange={(e) => setAiCustomQuestion(e.target.value)}
                  placeholder="Ask follow-up: e.g. Why does Q equal W here?"
                  className="flex-1 bg-[#fbf9f7] border border-[#c5c6cd] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#aa3000]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && aiCustomQuestion.trim()) {
                      handleAskAi(aiCustomQuestion);
                      setAiCustomQuestion('');
                    }
                  }}
                />
                <button
                  onClick={() => {
                    if (aiCustomQuestion.trim()) {
                      handleAskAi(aiCustomQuestion);
                      setAiCustomQuestion('');
                    }
                  }}
                  className="px-4 py-2 bg-[#000000] text-white text-xs font-bold rounded-xl hover:bg-[#222222]"
                >
                  Ask AI
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => onNavigateTab('practice')}
          className="px-5 py-2.5 bg-[#f5f3f1] hover:bg-[#eae8e6] text-[#000000] text-xs font-bold rounded-xl border border-[#c5c6cd] transition-all"
        >
          Practice Similar Question
        </button>

        <button
          onClick={() => onNavigateTab('coach')}
          className="px-5 py-2.5 bg-[#aa3000] hover:bg-[#8e2800] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px]">psychology</span>
          Discuss With AI Coach
        </button>
      </div>
    </div>
  );
};
