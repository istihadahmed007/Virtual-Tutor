import React, { useState, useRef, useEffect } from 'react';
import { LiveClass, UserProfile, Role } from '../types';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  Hand,
  MessageSquare,
  Users,
  Eraser,
  PenTool,
  Square,
  Circle,
  RotateCcw,
  Send,
  PhoneOff,
  Sparkles,
  Maximize2,
  Minimize2,
  CheckCircle,
  HelpCircle,
  Award,
} from 'lucide-react';

interface LiveClassroomViewProps {
  liveClass: LiveClass;
  currentUser: UserProfile;
  onLeaveClass: () => void;
  preferredLanguage?: 'en' | 'bn';
}

interface ChatItem {
  id: string;
  sender: string;
  avatar?: string;
  text: string;
  timestamp: string;
  isTeacher?: boolean;
}

export const LiveClassroomView: React.FC<LiveClassroomViewProps> = ({
  liveClass,
  currentUser,
  onLeaveClass,
  preferredLanguage = 'en',
}) => {
  const isHost = currentUser.role === 'TEACHER' || currentUser.id === liveClass.teacherId;

  // Media state
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [hasRaisedHand, setHasRaisedHand] = useState(false);
  const [raisedHandsList, setRaisedHandsList] = useState<string[]>(['Tanvir Ahmed']);

  // Whiteboard state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeTool, setActiveTool] = useState<'pen' | 'eraser' | 'rect' | 'circle'>('pen');
  const [strokeColor, setStrokeColor] = useState('#D97706'); // amber default
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [activeTab, setActiveTab] = useState<'chat' | 'participants'>('chat');

  // Video stream ref
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  // Chat messages
  const [messages, setMessages] = useState<ChatItem[]>([
    {
      id: 'msg_1',
      sender: liveClass.teacherName,
      text: `Welcome everyone to "${liveClass.title}"! Today we will solve critical exam questions step-by-step. Feel free to raise your hand or ask questions in chat.`,
      timestamp: '10:00 AM',
      isTeacher: true,
    },
    {
      id: 'msg_2',
      sender: 'Sakib Hossain',
      text: 'Sir, can we review question 4 on definite integral substitutions?',
      timestamp: '10:02 AM',
    },
  ]);
  const [newMsgText, setNewMsgText] = useState('');

  // Class timer
  const [secondsElapsed, setSecondsElapsed] = useState(14 * 60 + 20); // 14 mins

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Request actual camera/mic if permitted
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((s) => {
          stream = s;
          setMediaStream(s);
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch(() => {
          // Camera permission fallback gracefully handled
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Format timer
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.strokeStyle = activeTool === 'eraser' ? '#FFFFFF' : strokeColor;
    ctx.lineWidth = activeTool === 'eraser' ? strokeWidth * 4 : strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  // Preset Math Formulas on Whiteboard
  const insertFormula = (formulaText: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 18px Arial';
    ctx.fillText(formulaText, 50, 80);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsgText.trim()) return;

    const newMsg: ChatItem = {
      id: `msg_${Date.now()}`,
      sender: currentUser.name,
      text: newMsgText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isTeacher: isHost,
    };

    setMessages((prev) => [...prev, newMsg]);
    setNewMsgText('');
  };

  const toggleRaiseHand = () => {
    if (!hasRaisedHand) {
      setHasRaisedHand(true);
      if (!raisedHandsList.includes(currentUser.name)) {
        setRaisedHandsList((prev) => [...prev, currentUser.name]);
      }
    } else {
      setHasRaisedHand(false);
      setRaisedHandsList((prev) => prev.filter((name) => name !== currentUser.name));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A] text-white flex flex-col overflow-hidden">
      {/* Top Header Bar */}
      <div className="bg-[#1E293B] border-b border-[#334155] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="px-2.5 py-1 bg-red-600 rounded-md text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-white" />
            <span>LIVE</span>
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{liveClass.title}</span>
              <span className="text-xs font-normal text-[#94A3B8]">• {liveClass.subject}</span>
            </h2>
            <div className="text-[11px] text-[#94A3B8] flex items-center gap-3">
              <span>Instructor: {liveClass.teacherName}</span>
              <span>Code: {liveClass.meetingCode}</span>
              <span className="text-amber-400 font-mono font-bold">Elapsed: {formatTime(secondsElapsed)}</span>
            </div>
          </div>
        </div>

        {/* Top Right Controls */}
        <div className="flex items-center gap-3">
          {raisedHandsList.length > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded-full text-xs text-amber-300 font-medium">
              <Hand className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              <span>
                {raisedHandsList.length} Raised Hand{raisedHandsList.length > 1 ? 's' : ''} ({raisedHandsList[0]})
              </span>
            </div>
          )}

          <button
            onClick={onLeaveClass}
            className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <PhoneOff className="w-4 h-4" />
            <span>{isHost ? 'End Class Session' : 'Leave Class'}</span>
          </button>
        </div>
      </div>

      {/* Main Classroom Body */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side: Whiteboard & Main Video Canvas */}
        <div className="flex-1 flex flex-col bg-[#0B1120] relative p-3 overflow-hidden">
          {/* Whiteboard Toolbar (If Host or permitted) */}
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl px-3 py-2 flex items-center justify-between mb-2 shadow-md flex-wrap gap-2">
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-bold text-[#94A3B8] uppercase mr-2 flex items-center gap-1">
                <PenTool className="w-3.5 h-3.5 text-amber-400" />
                <span>Interactive Board</span>
              </span>

              <button
                onClick={() => setActiveTool('pen')}
                className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 ${
                  activeTool === 'pen' ? 'bg-amber-600 text-white' : 'text-[#94A3B8] hover:bg-[#334155]'
                }`}
                title="Pen"
              >
                <PenTool className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveTool('eraser')}
                className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 ${
                  activeTool === 'eraser' ? 'bg-amber-600 text-white' : 'text-[#94A3B8] hover:bg-[#334155]'
                }`}
                title="Eraser"
              >
                <Eraser className="w-3.5 h-3.5" />
              </button>

              {/* Color choices */}
              <div className="flex items-center gap-1 ml-2 border-l border-[#334155] pl-2">
                {['#D97706', '#2563EB', '#059669', '#DC2626', '#0F172A'].map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setStrokeColor(c);
                      setActiveTool('pen');
                    }}
                    className={`w-5 h-5 rounded-full border-2 transition-transform ${
                      strokeColor === c ? 'scale-110 border-white' : 'border-transparent opacity-80'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {/* Math Formula Shortcuts */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-[#94A3B8] hidden sm:inline">Formulas:</span>
              <button
                onClick={() => insertFormula('∫ f(x) dx = F(x) + C')}
                className="px-2 py-1 bg-[#334155] hover:bg-[#475569] text-[11px] rounded text-white font-mono"
              >
                ∫ f(x)dx
              </button>
              <button
                onClick={() => insertFormula('E = mc²  |  v = u + at')}
                className="px-2 py-1 bg-[#334155] hover:bg-[#475569] text-[11px] rounded text-white font-mono"
              >
                E=mc²
              </button>
              <button
                onClick={() => insertFormula('pH = -log[H+]')}
                className="px-2 py-1 bg-[#334155] hover:bg-[#475569] text-[11px] rounded text-white font-mono"
              >
                pH
              </button>
              <button
                onClick={clearCanvas}
                className="p-1.5 bg-[#334155] hover:bg-red-600/80 rounded text-xs text-white ml-2"
                title="Clear Whiteboard"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Whiteboard Canvas */}
          <div className="flex-1 bg-white rounded-2xl overflow-hidden relative shadow-inner flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={1000}
              height={550}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="w-full h-full cursor-crosshair bg-white"
            />

            {/* Floating Instructor Video Tile */}
            <div className="absolute bottom-4 right-4 w-48 h-32 sm:w-56 sm:h-36 bg-[#1E293B] border-2 border-amber-500 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
              <div className="flex-1 relative bg-[#0F172A] flex items-center justify-center overflow-hidden">
                {isVideoOn ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-amber-600 text-white flex items-center justify-center text-lg font-bold">
                    {liveClass.teacherName.substring(0, 2)}
                  </div>
                )}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[10px] font-bold text-white flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{liveClass.teacherName} (Host)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Audio/Video Control Strip */}
          <div className="mt-2 bg-[#1E293B] border border-[#334155] rounded-xl px-4 py-2.5 flex items-center justify-center gap-4">
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                isMicOn ? 'bg-[#334155] hover:bg-[#475569] text-white' : 'bg-red-600 text-white'
              }`}
            >
              {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              <span>{isMicOn ? 'Mute' : 'Unmuted'}</span>
            </button>

            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                isVideoOn ? 'bg-[#334155] hover:bg-[#475569] text-white' : 'bg-red-600 text-white'
              }`}
            >
              {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              <span>{isVideoOn ? 'Stop Camera' : 'Start Camera'}</span>
            </button>

            <button
              onClick={() => setIsScreenSharing(!isScreenSharing)}
              className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                isScreenSharing ? 'bg-indigo-600 text-white' : 'bg-[#334155] hover:bg-[#475569] text-white'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span>{isScreenSharing ? 'Sharing' : 'Share Screen'}</span>
            </button>

            {!isHost && (
              <button
                onClick={toggleRaiseHand}
                className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  hasRaisedHand
                    ? 'bg-amber-500 text-[#0F172A] shadow-md animate-pulse'
                    : 'bg-[#334155] hover:bg-[#475569] text-white'
                }`}
              >
                <Hand className="w-4 h-4" />
                <span>{hasRaisedHand ? 'Hand Raised ✋' : 'Raise Hand'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Chat & Student List Panel */}
        <div className="w-full lg:w-80 bg-[#1E293B] border-t lg:border-t-0 lg:border-l border-[#334155] flex flex-col h-72 lg:h-auto">
          {/* Tab Switcher */}
          <div className="flex border-b border-[#334155]">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'chat' ? 'text-amber-400 border-b-2 border-amber-400 bg-[#0F172A]/40' : 'text-[#94A3B8]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Live Class Chat</span>
            </button>
            <button
              onClick={() => setActiveTab('participants')}
              className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'participants'
                  ? 'text-amber-400 border-b-2 border-amber-400 bg-[#0F172A]/40'
                  : 'text-[#94A3B8]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Students ({liveClass.enrolledCount || 24})</span>
            </button>
          </div>

          {/* Chat Messages Tab */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col p-3 overflow-hidden">
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`p-2.5 rounded-xl text-xs space-y-1 ${
                      m.isTeacher ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-[#0F172A]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className={`font-bold ${m.isTeacher ? 'text-amber-400' : 'text-white'}`}>
                        {m.sender} {m.isTeacher && '★ (Teacher)'}
                      </span>
                      <span className="text-[#64748B]">{m.timestamp}</span>
                    </div>
                    <p className="text-[#E2E8F0] leading-relaxed">{m.text}</p>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={newMsgText}
                  onChange={(e) => setNewMsgText(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1 bg-[#0F172A] border border-[#334155] rounded-xl px-3 py-2 text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}

          {/* Participants Tab */}
          {activeTab === 'participants' && (
            <div className="flex-1 p-3 overflow-y-auto space-y-2">
              <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center">
                    {liveClass.teacherName.substring(0, 1)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{liveClass.teacherName}</div>
                    <div className="text-[10px] text-amber-400">Class Host & Instructor</div>
                  </div>
                </div>
                <Award className="w-4 h-4 text-amber-400" />
              </div>

              <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider pt-2 px-1">
                Enrolled Students
              </div>

              {['Tanvir Ahmed', 'Sakib Hossain', 'Anika Tabassum', 'Mehedi Hasan', 'Tasnim Noor'].map((s, i) => (
                <div
                  key={s}
                  className="p-2 bg-[#0F172A]/40 rounded-xl flex items-center justify-between text-xs hover:bg-[#0F172A]/70"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-700 text-slate-300 text-[10px] font-bold flex items-center justify-center">
                      {s.substring(0, 1)}
                    </div>
                    <span className="text-slate-200">{s}</span>
                  </div>
                  {raisedHandsList.includes(s) && (
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                      ✋ Hand Up
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
