import React, { useState, useRef, useEffect } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Share2,
  PenTool,
  Eraser,
  Grid,
  RotateCcw,
  Download,
  CheckCircle2,
  MessageSquare,
  FileText,
  Clock,
  Sparkles,
  Award,
  BookOpen,
  Send,
  X,
  Volume2,
  HelpCircle,
  Zap,
} from 'lucide-react';
import { TutorBooking, Tutor } from '../types';
import { apiClient } from '../services/api';

interface TutorLiveRoomProps {
  booking: TutorBooking;
  tutor?: Tutor;
  onClose: () => void;
  onSessionUpdated: () => void;
}

export const TutorLiveRoom: React.FC<TutorLiveRoomProps> = ({
  booking,
  tutor,
  onClose,
  onSessionUpdated,
}) => {
  // Video & audio states
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [activeTab, setActiveTab] = useState<'whiteboard' | 'chat' | 'prescription'>('whiteboard');

  // Whiteboard drawing states
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pen' | 'highlighter' | 'eraser' | 'line' | 'rect'>('pen');
  const [color, setColor] = useState('#38bdf8'); // cyan
  const [brushSize, setBrushSize] = useState(3);
  const [showGrid, setShowGrid] = useState(true);
  const [drawingHistory, setDrawingHistory] = useState<ImageData[]>([]);
  const startPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Live chat messages
  const [messages, setMessages] = useState<
    Array<{ id: string; sender: string; role: 'student' | 'tutor'; text: string; time: string }>
  >([
    {
      id: 'm1',
      sender: tutor?.name || booking.tutorName,
      role: 'tutor',
      text: `Assalamu Alaikum ${booking.studentName}! Welcome to our 1-on-1 live mentoring room. I have loaded our workspace for "${booking.topic}". Feel free to draw on the whiteboard or ask questions in real-time!`,
      time: 'Live',
    },
  ]);
  const [inputText, setInputText] = useState('');

  // Diagnostic prescription state
  const [prescriptionNotes, setPrescriptionNotes] = useState({
    strengths: booking.prescription?.strengths?.join('\n') || 'Strong conceptual grasp of algebraic integration foundations.\nQuick recognition of composite function derivatives.',
    weaknesses: booking.prescription?.weaknesses?.join('\n') || 'Needs practice with cyclic recursive integrals.\nRemembering negative signs during trigonometric substitutions.',
    actionItems: booking.prescription?.actionItems?.join('\n') || 'Complete 10 high-yield BUET past admission questions on this chapter.\nReview standard trigonometric substitution substitution tables.\nTake Chapter Mastery Quiz on Virtual Tutor tomorrow.',
    recommendedProblems: booking.prescription?.recommendedProblems?.join('\n') || 'Solve: ∫ e^(2x) sin(3x) dx\nSolve: ∫ x / (x^2 + 4x + 8) dx',
  });
  const [isSavingPrescription, setIsSavingPrescription] = useState(false);
  const [prescriptionSavedSuccess, setPrescriptionSavedSuccess] = useState(false);

  // Time elapsed in session
  const [secondsElapsed, setSecondsElapsed] = useState(240); // starts at 4 mins in

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Canvas setup & grid
  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high DPI resolution
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    // Dark chalkboard background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, rect.width, rect.height);

    if (showGrid) {
      drawCoordinateGrid(ctx, rect.width, rect.height);
    }

    // Draw initial sample problem
    drawProblemHeader(ctx, rect.width);
  };

  const drawCoordinateGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.save();
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
    ctx.lineWidth = 0.5;

    const step = 30;
    for (let x = 0; x < width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.restore();
  };

  const drawProblemHeader = (ctx: CanvasRenderingContext2D, width: number) => {
    ctx.save();
    // Banner box for problem statement
    ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(20, 16, width - 40, 64, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillText(`TARGET ADMISSION QUESTION • ${booking.subject.toUpperCase()}`, 36, 36);

    ctx.fillStyle = '#f8fafc';
    ctx.font = '14px "JetBrains Mono", monospace, sans-serif';
    const problemText = booking.topic.includes('Integration')
      ? 'Problem: Evaluate ∫ e^(2x) · sin(3x) dx using the LIATE Rule and Cyclic Recursion'
      : `Problem: High-Yield Problem Analysis on ${booking.topic}`;
    ctx.fillText(problemText, 36, 60);

    ctx.restore();
  };

  useEffect(() => {
    if (activeTab === 'whiteboard') {
      // Small timeout to allow DOM layout
      const timer = setTimeout(initCanvas, 50);
      return () => clearTimeout(timer);
    }
  }, [activeTab, showGrid]);

  const saveCanvasHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setDrawingHistory((prev) => [...prev.slice(-15), snapshot]);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    saveCanvasHistory();
    setIsDrawing(true);
    startPos.current = { x, y };

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (tool === 'eraser') {
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = brushSize * 5;
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === 'highlighter') {
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.25)'; // yellow highlight
      ctx.lineWidth = 18;
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === 'pen') {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleClearCanvas = () => {
    initCanvas();
  };

  const handleUndo = () => {
    if (drawingHistory.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const previousState = drawingHistory[drawingHistory.length - 1];
    setDrawingHistory((prev) => prev.slice(0, -1));
    ctx.putImageData(previousState, 0, 0);
  };

  const handleLoadQuestionFormula = (formulaStr: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    saveCanvasHistory();
    ctx.fillStyle = '#38bdf8';
    ctx.font = '16px "JetBrains Mono", monospace';
    ctx.fillText(formulaStr, 40, 140);
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg = {
      id: `m_${Date.now()}`,
      sender: booking.studentName || 'Istihad Ahmed',
      role: 'student' as const,
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Tutor simulated live feedback
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `m_rep_${Date.now()}`,
          sender: tutor?.name || booking.tutorName,
          role: 'tutor',
          text: `Great observation! Notice how when we apply integration by parts again, the term ∫ e^(2x) sin(3x) dx reappears with a factor of 4/9. We shift it to the left-hand side to solve for I.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1200);
  };

  const handleSavePrescription = async () => {
    setIsSavingPrescription(true);
    try {
      const payload = {
        strengths: prescriptionNotes.strengths.split('\n').filter(Boolean),
        weaknesses: prescriptionNotes.weaknesses.split('\n').filter(Boolean),
        actionItems: prescriptionNotes.actionItems.split('\n').filter(Boolean),
        recommendedProblems: prescriptionNotes.recommendedProblems.split('\n').filter(Boolean),
      };

      await apiClient.updateBookingNotes(
        booking.id,
        `Session completed on ${booking.topic}. Full diagnostic prescription recorded.`,
        'COMPLETED',
        payload
      );

      setPrescriptionSavedSuccess(true);
      onSessionUpdated();
      setTimeout(() => setPrescriptionSavedSuccess(false), 3000);
    } catch {
      // ignore
    } finally {
      setIsSavingPrescription(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col font-sans text-slate-100 overflow-hidden">
      {/* Top HUD Header */}
      <header className="h-14 bg-slate-900/90 border-b border-slate-800 px-4 flex items-center justify-between backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
              Live Mentoring Session
            </span>
          </div>

          <div className="h-4 w-px bg-slate-700" />

          <div>
            <h2 className="text-sm font-semibold text-slate-100 leading-tight">
              {booking.subject} • {booking.topic}
            </h2>
            <p className="text-xs text-slate-400">
              Meeting Code: <span className="text-cyan-400 font-mono font-medium">{booking.meetingCode || 'VT-LIVE-9021'}</span>
            </p>
          </div>
        </div>

        {/* Center Timer & Quality Indicator */}
        <div className="hidden md:flex items-center gap-4 bg-slate-950/60 px-3 py-1 rounded-full border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono font-medium">{formatTime(secondsElapsed)}</span>
          </div>
          <div className="h-3 w-px bg-slate-700" />
          <div className="flex items-center gap-1 text-[11px] text-emerald-400">
            <Zap className="w-3 h-3" />
            <span>24ms • 1080p HD</span>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2">
          {/* Navigation Tabs for Workspace */}
          <div className="flex items-center bg-slate-800 p-0.5 rounded-lg text-xs">
            <button
              onClick={() => setActiveTab('whiteboard')}
              className={`px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'whiteboard'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Whiteboard</span>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'chat'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat ({messages.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('prescription')}
              className={`px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'prescription'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Prescription</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ml-2"
            title="Minimize Room"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Classroom Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left/Main Workspace (Whiteboard / Chat / Prescription) */}
        <div className="flex-1 flex flex-col relative bg-slate-950 overflow-hidden">
          {activeTab === 'whiteboard' && (
            <div className="flex-1 flex flex-col relative">
              {/* Whiteboard Controls Toolbar */}
              <div className="h-12 bg-slate-900/90 border-b border-slate-800 px-4 flex items-center justify-between shrink-0 gap-3">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setTool('pen')}
                    className={`p-1.5 rounded-md transition-colors ${
                      tool === 'pen' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                    title="Pen"
                  >
                    <PenTool className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setTool('highlighter')}
                    className={`p-1.5 rounded-md transition-colors ${
                      tool === 'highlighter'
                        ? 'bg-cyan-600 text-white'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                    title="Highlighter"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setTool('eraser')}
                    className={`p-1.5 rounded-md transition-colors ${
                      tool === 'eraser' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                    title="Eraser"
                  >
                    <Eraser className="w-4 h-4" />
                  </button>

                  <div className="h-4 w-px bg-slate-700 mx-1" />

                  {/* Colors */}
                  <div className="flex items-center gap-1">
                    {['#38bdf8', '#34d399', '#facc15', '#f87171', '#f8fafc'].map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setColor(c);
                          if (tool === 'eraser') setTool('pen');
                        }}
                        className={`w-4 h-4 rounded-full border transition-transform ${
                          color === c && tool !== 'eraser' ? 'scale-125 border-white' : 'border-transparent opacity-80'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>

                  <div className="h-4 w-px bg-slate-700 mx-1" />

                  {/* Stroke Size */}
                  <div className="flex items-center gap-1">
                    {[2, 4, 8].map((size) => (
                      <button
                        key={size}
                        onClick={() => setBrushSize(size)}
                        className={`w-6 h-6 rounded flex items-center justify-center text-xs ${
                          brushSize === size ? 'bg-slate-800 text-cyan-400 font-bold' : 'text-slate-400 hover:bg-slate-800/50'
                        }`}
                      >
                        {size === 2 ? '•' : size === 4 ? '●' : '⬤'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right Whiteboard Tools: Math Formula quick insert & Grid */}
                <div className="flex items-center gap-2">
                  <div className="hidden lg:flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-xs">
                    <span className="text-slate-400">Quick Tokens:</span>
                    <button
                      onClick={() => handleLoadQuestionFormula('I = ∫ e^(2x) · sin(3x) dx')}
                      className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded font-mono text-[11px]"
                    >
                      LIATE Formula
                    </button>
                    <button
                      onClick={() => handleLoadQuestionFormula('u = sin(3x), dv = e^(2x)dx')}
                      className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded font-mono text-[11px]"
                    >
                      Parts Split
                    </button>
                    <button
                      onClick={() => handleLoadQuestionFormula('I = (1/2)e^(2x)sin(3x) - (3/2)∫ e^(2x)cos(3x)dx')}
                      className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded font-mono text-[11px]"
                    >
                      Step 1
                    </button>
                  </div>

                  <button
                    onClick={() => setShowGrid(!showGrid)}
                    className={`p-1.5 rounded-md text-xs flex items-center gap-1 transition-colors ${
                      showGrid ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:bg-slate-800'
                    }`}
                    title="Toggle Grid"
                  >
                    <Grid className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Grid</span>
                  </button>

                  <button
                    onClick={handleUndo}
                    className="p-1.5 rounded-md text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors text-xs flex items-center gap-1"
                    title="Undo"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={handleClearCanvas}
                    className="px-2 py-1 rounded-md text-xs font-medium text-red-400 hover:bg-red-950/50 hover:text-red-300 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Whiteboard Canvas Area */}
              <div className="flex-1 w-full h-full relative cursor-crosshair">
                <canvas
                  ref={canvasRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  className="w-full h-full block"
                />
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col bg-slate-900/60 p-4 max-w-4xl mx-auto w-full">
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.role === 'student' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-slate-400">{msg.sender}</span>
                      <span className="text-[10px] text-slate-500">{msg.time}</span>
                    </div>
                    <div
                      className={`max-w-lg rounded-xl px-4 py-2.5 text-sm ${
                        msg.role === 'student'
                          ? 'bg-cyan-600 text-white rounded-br-none'
                          : 'bg-slate-800 text-slate-200 border border-slate-700/60 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask your mentor or type a doubt..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'prescription' && (
            <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-950/80 border border-cyan-800 flex items-center justify-center text-cyan-400">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white">Diagnostic Study Prescription</h3>
                      <p className="text-xs text-slate-400">
                        Formulated by {tutor?.name || booking.tutorName} for {booking.studentName}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleSavePrescription}
                    disabled={isSavingPrescription}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isSavingPrescription ? 'Saving...' : 'Save & Finalize'}</span>
                  </button>
                </div>

                {prescriptionSavedSuccess && (
                  <div className="mb-4 p-3 bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Diagnostic prescription saved successfully to your study profile!</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Strengths Identified
                    </label>
                    <textarea
                      value={prescriptionNotes.strengths}
                      onChange={(e) =>
                        setPrescriptionNotes({ ...prescriptionNotes, strengths: e.target.value })
                      }
                      rows={4}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5" />
                      Conceptual Weaknesses / Remediation Areas
                    </label>
                    <textarea
                      value={prescriptionNotes.weaknesses}
                      onChange={(e) =>
                        setPrescriptionNotes({ ...prescriptionNotes, weaknesses: e.target.value })
                      }
                      rows={4}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" />
                      Student Action Items & Roadmap
                    </label>
                    <textarea
                      value={prescriptionNotes.actionItems}
                      onChange={(e) =>
                        setPrescriptionNotes({ ...prescriptionNotes, actionItems: e.target.value })
                      }
                      rows={4}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      Recommended Practice Problems
                    </label>
                    <textarea
                      value={prescriptionNotes.recommendedProblems}
                      onChange={(e) =>
                        setPrescriptionNotes({
                          ...prescriptionNotes,
                          recommendedProblems: e.target.value,
                        })
                      }
                      rows={4}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Video Streams & Tutor Information */}
        <div className="w-72 md:w-80 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0">
          {/* Faculty Video Feed */}
          <div className="p-3 border-b border-slate-800">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
              {isVideoOn ? (
                <img
                  src={
                    tutor?.avatarUrl ||
                    booking.tutorAvatar ||
                    'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80'
                  }
                  alt={tutor?.name || booking.tutorName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-1 text-slate-500">
                  <VideoOff className="w-6 h-6" />
                  <span className="text-[11px]">Video Off</span>
                </div>
              )}

              {/* Status Badge */}
              <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-medium text-slate-200 flex items-center gap-1.5 border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="truncate max-w-[140px]">{tutor?.name || booking.tutorName}</span>
              </div>

              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] text-cyan-400 font-mono">
                HD 1080p
              </div>
            </div>

            {/* Student PiP Stream */}
            <div className="mt-2.5 relative aspect-video rounded-lg overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
              <div className="flex flex-col items-center gap-1 text-slate-400">
                <div className="w-10 h-10 rounded-full bg-cyan-950 border border-cyan-700 flex items-center justify-center text-cyan-300 font-bold text-sm">
                  IA
                </div>
                <span className="text-xs font-medium text-slate-300">{booking.studentName} (You)</span>
              </div>

              <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-slate-300 border border-slate-800">
                Audio Active
              </div>
            </div>
          </div>

          {/* Quick Media Controls Bar */}
          <div className="p-3 border-b border-slate-800 flex items-center justify-center gap-2">
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-2.5 rounded-lg transition-colors ${
                isMicOn ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-red-900/80 text-red-300'
              }`}
              title={isMicOn ? 'Mute Mic' : 'Unmute Mic'}
            >
              {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`p-2.5 rounded-lg transition-colors ${
                isVideoOn ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-red-900/80 text-red-300'
              }`}
              title={isVideoOn ? 'Turn Video Off' : 'Turn Video On'}
            >
              {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsScreenSharing(!isScreenSharing)}
              className={`p-2.5 rounded-lg transition-colors ${
                isScreenSharing ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
              title="Share Screen"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Leave Room
            </button>
          </div>

          {/* Session Overview & Tutor Qualifications */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <h4 className="font-semibold text-slate-200 mb-1">Mentor Profile</h4>
              <p className="text-slate-400 leading-relaxed mb-2">{tutor?.specialty || booking.tutorSpecialty}</p>
              <div className="text-[11px] text-cyan-400 font-medium">
                {tutor?.institution || 'BUET / Dhaka Medical College Faculty'}
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <h4 className="font-semibold text-slate-200 mb-2">Teaching Methodology</h4>
              <ul className="space-y-1 text-slate-400">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Socratic problem deconstruction
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  BUET/CKET shortcut derivation
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Real-time error correction
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
