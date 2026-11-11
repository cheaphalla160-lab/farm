import React from 'react';
import { soundManager } from '../utils/sound';
import { Award, Printer, X, Sparkles, CheckCircle2 } from 'lucide-react';

interface CertificateModalProps {
  studentName: string;
  avatar: string;
  score: number;
  applesCollected: number;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  studentName,
  avatar,
  score,
  applesCollected,
  onClose
}) => {
  const currentDate = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handlePrint = () => {
    soundManager.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden flex flex-col">
        {/* Actions bar at top */}
        <div className="bg-slate-100 px-6 py-2.5 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
            <Award className="w-4 h-4 text-amber-600" />
            <span>农场英语摘苹果荣誉奖状预览</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>打印奖状</span>
            </button>
            <button
              onClick={() => { soundManager.playClick(); onClose(); }}
              className="p-1 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Area */}
        <div className="p-8 sm:p-10 bg-amber-50/50 flex flex-col items-center text-center relative overflow-hidden">
          {/* Ornate Gold Border Frame */}
          <div className="absolute inset-4 border-4 border-amber-400 rounded-2xl pointer-events-none" />
          <div className="absolute inset-5 border border-dashed border-amber-300 rounded-xl pointer-events-none" />

          {/* Golden Seal Badge */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 border-4 border-white shadow-xl flex items-center justify-center text-3xl mb-3">
            🏆
          </div>

          <p className="text-xs font-black tracking-widest text-amber-800 uppercase">
            Official Classroom Recognition
          </p>

          <h2 className="font-['Fredoka',sans-serif] text-3xl sm:text-4xl font-black text-amber-950 mt-1 tracking-wide">
            CERTIFICATE OF ACHIEVEMENT
          </h2>

          <h3 className="text-sm font-bold text-amber-700 mt-0.5">
            农场英语采摘与跟读小达人 · 荣誉奖状
          </h3>

          <p className="text-xs text-slate-500 mt-4">
            This certificate is proudly awarded to:
          </p>

          {/* Student Name Hero */}
          <div className="flex items-center justify-center gap-2 my-2 py-1 px-6 border-b-2 border-amber-400">
            <span className="text-3xl">{avatar}</span>
            <span className="font-['Fredoka',sans-serif] text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-wide">
              {studentName}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mt-2 leading-relaxed">
            In recognition of outstanding enthusiasm and mastery in learning English Agriculture Vocabulary (
            <span className="font-semibold text-amber-900">farm, farmer, sunshine, basket, apple, potato</span>
            ) through interactive apple picking and joyful read-aloud practice.
          </p>

          {/* Harvest Stats Badge */}
          <div className="flex items-center justify-center gap-6 my-4 bg-white/80 px-6 py-2.5 rounded-2xl border border-amber-200 shadow-sm">
            <div className="text-center">
              <p className="text-[10px] uppercase font-bold text-slate-400">Apples Picked</p>
              <p className="text-lg font-black text-rose-600">{applesCollected} 🍎</p>
            </div>
            <div className="w-px h-6 bg-amber-200" />
            <div className="text-center">
              <p className="text-[10px] uppercase font-bold text-slate-400">Total Score</p>
              <p className="text-lg font-black text-amber-900">{score} pts</p>
            </div>
            <div className="w-px h-6 bg-amber-200" />
            <div className="text-center">
              <p className="text-[10px] uppercase font-bold text-slate-400">Honor Title</p>
              <p className="text-sm font-black text-emerald-700">Star Harvester</p>
            </div>
          </div>

          {/* Signature and Date Footer */}
          <div className="w-full max-w-md flex items-end justify-between mt-6 pt-4 text-left">
            <div>
              <p className="text-xs font-bold text-slate-800 border-b border-slate-400 pb-1 font-serif italic text-base">
                Teacher's Honor Seal
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">English Teaching Assistant</p>
            </div>

            <div className="text-right">
              <p className="text-xs font-bold text-slate-800 border-b border-slate-400 pb-1">
                {currentDate}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Date Awarded (授予日期)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
