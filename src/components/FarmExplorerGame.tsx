import React, { useState, useEffect } from 'react';
import { VocabularyWord } from '../types';
import { CORE_VOCABULARY } from '../data/words';
import { playPronunciation } from '../utils/speech';
import { soundManager } from '../utils/sound';
import confetti from 'canvas-confetti';
import {
  Compass,
  Footprints,
  Volume2,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  RotateCcw,
  ChevronRight,
  Flame,
  Award,
  Eye,
  MapPin
} from 'lucide-react';

interface FarmExplorerGameProps {
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  exploredCount: number;
  setExploredCount: React.Dispatch<React.SetStateAction<number>>;
  onFoundWordForReadAloud: (word: VocabularyWord) => void;
  playerAvatar: string;
}

interface ExplorerWaypoint {
  id: string;
  wordId: string;
  name: string;
  title: string;
  hint: string;
  questionText: string;
  xPercent: number; // Position on trail (0-100)
  yPercent: number;
}

const WAYPOINTS: ExplorerWaypoint[] = [
  {
    id: 'wp-sunshine',
    wordId: 'sunshine',
    name: 'Sunshine',
    title: 'Look Up in the Sky (晴空万里)',
    hint: 'Look up in the sky! It is bright, warm, and smiling! ☀️',
    questionText: 'Where is the sunshine? Can you find the sunshine?',
    xPercent: 78,
    yPercent: 16
  },
  {
    id: 'wp-farm',
    wordId: 'farm',
    name: 'Farm',
    title: 'Country Barn & Yard (农舍与谷仓)',
    hint: 'Look for the big red barn with a weather vane on the hill! 🚜',
    questionText: 'Where is the farm? Can you find the farm?',
    xPercent: 18,
    yPercent: 54
  },
  {
    id: 'wp-farmer',
    wordId: 'farmer',
    name: 'Farmer',
    title: 'The Friendly Farmer (亲切的农夫)',
    hint: 'Look for the kind person wearing a straw hat and blue overalls! 🧑‍🌾',
    questionText: 'Where is the farmer? Can you find the farmer?',
    xPercent: 36,
    yPercent: 76
  },
  {
    id: 'wp-apple-tree',
    wordId: 'apple-tree',
    name: 'Apple Tree',
    title: 'The Orchard Tree (茂盛的苹果树)',
    hint: 'Look for the tall green leafy tree with round red fruits! 🌳',
    questionText: 'Where is the apple tree? Can you find the apple tree?',
    xPercent: 62,
    yPercent: 42
  },
  {
    id: 'wp-basket',
    wordId: 'basket',
    name: 'Basket',
    title: 'Harvest Basket (丰收竹木篮)',
    hint: 'Look near the foot of the apple tree for a woven container! 🧺',
    questionText: 'Where is the basket? Can you find the basket?',
    xPercent: 84,
    yPercent: 74
  },
  {
    id: 'wp-potato',
    wordId: 'potato',
    name: 'Potato',
    title: 'Garden Veggie Patch (菜园黑土区)',
    hint: 'Look down in the dark healthy garden soil for fresh vegetables! 🥔',
    questionText: 'Where is the potato? Can you find the potato?',
    xPercent: 50,
    yPercent: 84
  }
];

export const FarmExplorerGame: React.FC<FarmExplorerGameProps> = ({
  score,
  setScore,
  exploredCount,
  setExploredCount,
  onFoundWordForReadAloud,
  playerAvatar
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isWalking, setIsWalking] = useState(false);
  const [explorerPos, setExplorerPos] = useState({ x: 10, y: 35 });
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'retry' | 'info' }>({
    message: 'Welcome to Farm Explorer! Let\'s walk and find things on the farm!',
    type: 'info'
  });
  const [completedWaypoints, setCompletedWaypoints] = useState<string[]>([]);
  const [showGuideHint, setShowGuideHint] = useState(true);
  const [isPromptingAudio, setIsPromptingAudio] = useState(false);
  const [freeMode, setFreeMode] = useState(false);

  const currentWaypoint = WAYPOINTS[currentStepIndex % WAYPOINTS.length];
  const targetWord = CORE_VOCABULARY.find(w => w.id === currentWaypoint.wordId) || CORE_VOCABULARY[0];

  // Ask current question on load or step change
  useEffect(() => {
    askQuestion();
  }, [currentStepIndex, freeMode]);

  const askQuestion = async () => {
    setIsPromptingAudio(true);
    soundManager.playClick();
    const qText = currentWaypoint.questionText;
    setFeedback({
      message: `🔍 ${qText} (${targetWord.meaning}在哪里？快找找看！)`,
      type: 'info'
    });
    // Pronounce the question naturally
    await playPronunciation(`Where is the ${targetWord.word}?`, 0.85);
    setIsPromptingAudio(false);
  };

  // Student steps forward or taps an item
  const handleItemClick = (clickedWordId: string) => {
    if (isWalking) return;

    soundManager.playClick();

    const clickedVocab = CORE_VOCABULARY.find(w => w.id === clickedWordId);
    const clickedName = clickedVocab ? clickedVocab.word : clickedWordId;

    if (clickedWordId === currentWaypoint.wordId || (clickedWordId === 'apple' && currentWaypoint.wordId === 'apple-tree')) {
      // Correct Item Found!
      soundManager.playDiscoveryFanfare();
      setIsWalking(true);

      // Play footsteps while explorer moves to the location
      const stepSoundInterval = setInterval(() => {
        soundManager.playFootstep();
      }, 160);

      // Animate explorer moving to the target waypoint coordinates
      setExplorerPos({
        x: currentWaypoint.xPercent,
        y: currentWaypoint.yPercent
      });

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });

      setFeedback({
        message: `🎉 Great eye! You found the "${targetWord.word}"! (+150 pts) Now let's read it aloud!`,
        type: 'success'
      });

      setScore(prev => prev + 150);
      setExploredCount(prev => prev + 1);

      if (!completedWaypoints.includes(currentWaypoint.id)) {
        setCompletedWaypoints(prev => [...prev, currentWaypoint.id]);
      }

      // Finish walking after 700ms and open Read-Aloud modal!
      setTimeout(() => {
        clearInterval(stepSoundInterval);
        setIsWalking(false);

        // Open Read Aloud modal so student follows up with pronunciation practice!
        onFoundWordForReadAloud(targetWord);
      }, 750);

    } else {
      // Incorrect item clicked
      soundManager.playGentleRetry();
      setFeedback({
        message: `Oops! That's the "${clickedName}". Look again: Where is the "${targetWord.word}"?`,
        type: 'retry'
      });

      // Pronounce clicked word to reinforce vocabulary
      playPronunciation(`That is the ${clickedName}. Where is the ${targetWord.word}?`, 0.9);
    }
  };

  // Next step along the farm trail
  const handleNextStep = () => {
    soundManager.playClick();
    if (currentStepIndex + 1 >= WAYPOINTS.length) {
      // Completed all 6 waypoints!
      soundManager.playSuccessFanfare();
      confetti({ particleCount: 100, spread: 90 });
      setFeedback({
        message: '🏆 Outstanding! You have explored the entire farm! You can restart or explore freely!',
        type: 'success'
      });
      setCurrentStepIndex(0);
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  // Restart trail exploration
  const handleRestartTrail = () => {
    soundManager.playClick();
    setCurrentStepIndex(0);
    setCompletedWaypoints([]);
    setExplorerPos({ x: 10, y: 35 });
    setFeedback({
      message: 'Trail restarted! Let\'s step forward and explore the farm together!',
      type: 'info'
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center select-none gap-4">
      {/* Top Exploration Quest Bar */}
      <div className="w-full bg-white/95 rounded-3xl p-4 sm:p-5 border-4 border-amber-300 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Quest Question & Speaker */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={askQuestion}
            disabled={isPromptingAudio}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md transition-all active:scale-95 ${
              isPromptingAudio
                ? 'bg-amber-400 text-amber-950 scale-105 ring-4 ring-amber-300'
                : 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500'
            }`}
            title="点击收听农场探索语音提问"
          >
            <Volume2 className={`w-8 h-8 ${isPromptingAudio ? 'animate-bounce' : ''}`} />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs uppercase font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '10s' }} />
                Step {currentStepIndex + 1} / {WAYPOINTS.length}: {currentWaypoint.title}
              </span>
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                寻找: {targetWord.meaning}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="font-['Fredoka',sans-serif] text-xl sm:text-2xl font-black text-slate-900 tracking-wide">
                Where is the <span className="text-rose-600 underline decoration-amber-400">{targetWord.word}</span>?
              </h2>
              <span className="text-xs sm:text-sm font-semibold text-slate-500 font-mono hidden sm:inline">
                {targetWord.ipa}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Friendly Teacher/Farmer Feedback */}
        <div className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold border flex items-center gap-2 max-w-md text-center transition-all ${
          feedback.type === 'success'
            ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
            : feedback.type === 'retry'
            ? 'bg-rose-50 text-rose-900 border-rose-300'
            : 'bg-amber-50 text-amber-900 border-amber-300'
        }`}>
          <Sparkles className="w-4 h-4 shrink-0 text-amber-500" />
          <span>{feedback.message}</span>
        </div>

        {/* Right Actions: Step Forward & Hint */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundManager.playClick();
              setShowGuideHint(!showGuideHint);
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-300 shadow-sm"
            title="切换探索寻物线索提示"
          >
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <span className="hidden sm:inline">{showGuideHint ? '隐藏线索' : '显示线索'}</span>
          </button>

          <button
            onClick={handleNextStep}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-xl text-xs font-black shadow-md transition-all active:scale-95"
            title="进入下一步探索"
          >
            <Footprints className="w-4 h-4" />
            <span>下一步 (Next Step)</span>
            <ChevronRight className="w-4 h-4 -ml-1" />
          </button>
        </div>
      </div>

      {/* Clue Hint Banner if toggled */}
      {showGuideHint && (
        <div className="w-full bg-amber-100/90 border-2 border-amber-300 rounded-2xl px-4 py-2 text-xs font-semibold text-amber-950 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-base">💡</span>
            <span><strong>寻物线索 (Clue):</strong> {currentWaypoint.hint}</span>
          </div>
          <span className="text-[11px] text-amber-800 hidden md:inline">
            点击画面中对应事物，小探险家就会走过去并开启跟读！
          </span>
        </div>
      )}

      {/* THE INTERACTIVE FARM EXPLORER MAP */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[580px] rounded-3xl bg-gradient-to-b from-sky-300 via-sky-200 to-amber-100 border-4 border-amber-300 shadow-2xl overflow-hidden select-none">
        {/* Soft Sun Ray Glow in Sky */}
        <div className="absolute -top-12 -right-12 w-96 h-96 bg-yellow-200/40 rounded-full blur-3xl pointer-events-none" />

        {/* Floating Clouds */}
        <div className="absolute top-6 left-12 flex items-center opacity-75 animate-[pulse_6s_ease-in-out_infinite] pointer-events-none">
          <div className="w-16 h-8 bg-white/90 rounded-full shadow-sm" />
          <div className="w-10 h-10 -ml-6 -mt-3 bg-white/90 rounded-full shadow-sm" />
          <div className="w-12 h-6 -ml-3 mt-1 bg-white/90 rounded-full shadow-sm" />
        </div>
        <div className="absolute top-10 left-1/3 flex items-center opacity-65 animate-[pulse_8s_ease-in-out_infinite] pointer-events-none">
          <div className="w-20 h-9 bg-white/80 rounded-full shadow-sm" />
          <div className="w-12 h-12 -ml-8 -mt-4 bg-white/80 rounded-full shadow-sm" />
          <div className="w-14 h-7 -ml-4 mt-1 bg-white/80 rounded-full shadow-sm" />
        </div>

        {/* Rolling Hills Background */}
        <div className="absolute bottom-0 inset-x-0 h-64 pointer-events-none">
          <div className="absolute -bottom-10 -left-20 w-[650px] h-52 bg-emerald-300 rounded-[100%] opacity-85" />
          <div className="absolute -bottom-12 right-0 w-[550px] h-56 bg-emerald-400 rounded-[100%] opacity-90" />
          <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-emerald-600 via-emerald-500 to-emerald-400 rounded-t-[50px] border-t-4 border-emerald-300" />
        </div>

        {/* Winding Cobblestone / Grassy Exploration Trail (SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 600" preserveAspectRatio="none">
          <defs>
            <linearGradient id="trailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#fde68a" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#fef08a" stopOpacity="0.85" />
            </linearGradient>
          </defs>
          {/* Main Winding Trail */}
          <path
            d="M 100 240 Q 220 320 200 420 T 360 480 T 600 320 T 820 460 T 520 530"
            fill="none"
            stroke="url(#trailGrad)"
            strokeWidth="38"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Trail Dotted Stepping Stones */}
          <path
            d="M 100 240 Q 220 320 200 420 T 360 480 T 600 320 T 820 460 T 520 530"
            fill="none"
            stroke="#d97706"
            strokeWidth="3"
            strokeDasharray="10, 16"
          />
        </svg>

        {/* Waypoint Markers along the trail */}
        {WAYPOINTS.map((wp, idx) => {
          const isCurrent = idx === currentStepIndex % WAYPOINTS.length;
          const isDone = completedWaypoints.includes(wp.id);

          return (
            <div
              key={wp.id}
              style={{ left: `${wp.xPercent}%`, top: `${wp.yPercent}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
            >
              <div className={`flex flex-col items-center transition-all ${isCurrent ? 'scale-110' : 'opacity-85'}`}>
                {isCurrent && (
                  <div className="absolute -top-7 px-2 py-0.5 bg-rose-600 text-white text-[10px] font-black rounded-full shadow-lg border border-white animate-bounce flex items-center gap-1 whitespace-nowrap">
                    <MapPin className="w-3 h-3" />
                    <span>Find Here!</span>
                  </div>
                )}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shadow-md border-2 ${
                  isDone
                    ? 'bg-emerald-500 text-white border-white'
                    : isCurrent
                    ? 'bg-amber-400 text-amber-950 border-amber-600 ring-4 ring-amber-300 animate-pulse'
                    : 'bg-white/80 text-slate-700 border-amber-300'
                }`}>
                  {isDone ? '✓' : idx + 1}
                </div>
              </div>
            </div>
          );
        })}

        {/* ======================================================== */}
        {/* INTERACTIVE SEARCH TARGETS ON THE FARM */}
        {/* ======================================================== */}

        {/* 1. SUNSHINE (阳光) */}
        <div
          onClick={() => handleItemClick('sunshine')}
          className={`absolute top-4 right-8 sm:right-16 z-20 cursor-pointer group transition-all duration-300 ${
            currentWaypoint.wordId === 'sunshine' ? 'scale-115 ring-6 ring-yellow-400/80 rounded-full animate-pulse' : 'hover:scale-105'
          }`}
          title="Click to spot: sunshine (阳光)"
        >
          <div className="relative flex items-center justify-center">
            {/* Spinning Golden Rays */}
            <svg className="w-24 h-24 sm:w-28 sm:h-28 text-yellow-400 animate-[spin_24s_linear_infinite]" viewBox="0 0 100 100" fill="currentColor">
              {[...Array(12)].map((_, i) => (
                <polygon
                  key={i}
                  points="50,6 46,24 54,24"
                  transform={`rotate(${i * 30} 50 50)`}
                  className="opacity-90"
                />
              ))}
            </svg>

            {/* Cute Smiling Sun Core */}
            <div className="absolute w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 shadow-lg shadow-yellow-400/50 flex flex-col items-center justify-center border-2 border-yellow-200">
              <div className="flex gap-2 mt-2">
                <span className="w-1.5 h-2 bg-amber-950 rounded-full" />
                <span className="w-1.5 h-2 bg-amber-950 rounded-full" />
              </div>
              <div className="w-4 h-2 border-b-2 border-amber-950 rounded-full mt-0.5" />
            </div>

            <div className="absolute -bottom-2 bg-yellow-400/95 text-amber-950 font-bold text-xs px-2 py-0.5 rounded-full shadow border border-yellow-200 flex items-center gap-1 group-hover:bg-yellow-300">
              <span>sunshine</span>
              <Sparkles className="w-3 h-3 text-amber-800" />
            </div>
          </div>
        </div>

        {/* 2. FARM (农场谷仓) */}
        <div
          onClick={() => handleItemClick('farm')}
          className={`absolute bottom-32 sm:bottom-36 left-4 sm:left-12 z-20 cursor-pointer group transition-all duration-300 ${
            currentWaypoint.wordId === 'farm' ? 'scale-110 ring-6 ring-emerald-400/80 rounded-2xl animate-pulse' : 'hover:scale-105'
          }`}
          title="Click to spot: farm (农场)"
        >
          <div className="relative">
            {/* Red Barn */}
            <div className="w-28 sm:w-36 h-24 sm:h-28 bg-gradient-to-b from-rose-600 to-rose-700 rounded-t-xl border-2 border-rose-900 shadow-lg relative flex flex-col items-center">
              <div className="absolute -top-7 sm:-top-8 w-32 sm:w-40 h-8 bg-stone-700 rounded-t-md border-b-2 border-stone-900 shadow" />
              <div className="absolute -top-11 text-amber-400 text-sm font-bold">🐓</div>
              <div className="w-12 sm:w-16 h-14 sm:h-16 bg-amber-900/90 rounded-t-lg mt-auto mb-0 border-2 border-amber-950 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 border-t-2 border-white/40 rotate-45 transform origin-center" />
                <div className="absolute inset-0 border-t-2 border-white/40 -rotate-45 transform origin-center" />
              </div>
            </div>

            {/* Picket Fence */}
            <div className="absolute -right-10 sm:-right-14 bottom-0 flex gap-1 pointer-events-none">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-2.5 h-10 bg-amber-200 border border-amber-600 rounded-t-sm relative shadow-sm">
                  <div className="absolute top-2 -left-1 -right-1 h-1.5 bg-amber-300 border border-amber-700" />
                </div>
              ))}
            </div>

            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-rose-600 text-white font-bold text-xs px-2.5 py-0.5 rounded-full shadow border border-rose-300 flex items-center gap-1 group-hover:bg-rose-500 whitespace-nowrap">
              <span>farm</span>
            </div>
          </div>
        </div>

        {/* 3. FARMER (农夫) */}
        <div
          onClick={() => handleItemClick('farmer')}
          className={`absolute bottom-6 sm:bottom-8 left-36 sm:left-52 z-20 cursor-pointer group transition-all duration-300 ${
            currentWaypoint.wordId === 'farmer' ? 'scale-115 ring-6 ring-amber-400/80 rounded-2xl animate-pulse' : 'hover:scale-105'
          }`}
          title="Click to spot: farmer (农夫)"
        >
          <div className="relative flex flex-col items-center">
            {/* Waving animation */}
            <div className="relative w-16 h-24 sm:w-18 sm:h-28 flex flex-col items-center">
              <div className="w-16 h-5 bg-amber-300 border-2 border-amber-700 rounded-full shadow relative z-20 -mb-2">
                <div className="w-9 h-3.5 bg-amber-400 border border-amber-700 rounded-t-lg mx-auto -mt-2.5" />
                <div className="w-9 h-1 bg-red-500 mx-auto -mt-1" />
              </div>

              <div className="w-9 h-9 bg-amber-100 rounded-full border border-amber-600 relative z-10 flex flex-col items-center justify-center shadow-inner">
                <div className="flex gap-2 mt-1">
                  <span className="w-1 h-1.5 bg-amber-950 rounded-full" />
                  <span className="w-1 h-1.5 bg-amber-950 rounded-full" />
                </div>
                <div className="w-3 h-1.5 border-b-2 border-amber-900 rounded-full mt-0.5" />
              </div>

              <div className="w-11 h-12 bg-blue-600 border border-blue-900 rounded-t-md relative -mt-1 flex flex-col items-center shadow">
                <div className="flex justify-between w-9 mt-0.5">
                  <div className="w-2.5 h-5 bg-blue-700 border-r border-blue-900" />
                  <div className="w-2.5 h-5 bg-blue-700 border-l border-blue-900" />
                </div>
                <div className="absolute -left-3 top-2 text-sm animate-wiggle">👋</div>
              </div>

              <div className="flex gap-1 -mt-0.5">
                <div className="w-3.5 h-3 bg-amber-950 rounded-b-sm" />
                <div className="w-3.5 h-3 bg-amber-950 rounded-b-sm" />
              </div>
            </div>

            <div className="bg-amber-500 text-amber-950 font-bold text-xs px-2.5 py-0.5 rounded-full shadow border border-amber-300 flex items-center gap-1 group-hover:bg-amber-400 mt-1">
              <span>farmer</span>
            </div>
          </div>
        </div>

        {/* 4. APPLE TREE (苹果树) */}
        <div
          onClick={() => handleItemClick('apple-tree')}
          className={`absolute top-20 sm:top-16 left-1/2 -translate-x-1/2 sm:left-[60%] z-20 cursor-pointer group transition-all duration-300 ${
            currentWaypoint.wordId === 'apple-tree' ? 'scale-110 ring-6 ring-emerald-400/80 rounded-3xl animate-pulse' : 'hover:scale-105'
          }`}
          title="Click to spot: apple tree (苹果树)"
        >
          <div className="relative flex flex-col items-center">
            {/* Canopy */}
            <div className="w-40 sm:w-52 h-36 sm:h-44 bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-600 rounded-[45%] border-4 border-emerald-700 shadow-xl relative flex items-center justify-center">
              {/* Juicy red apples hanging on tree */}
              <span className="absolute top-4 left-6 text-xl animate-bounce">🍎</span>
              <span className="absolute top-8 right-8 text-xl animate-bounce" style={{ animationDelay: '0.2s' }}>🍎</span>
              <span className="absolute bottom-6 left-10 text-xl animate-bounce" style={{ animationDelay: '0.4s' }}>🍎</span>
              <span className="absolute bottom-8 right-10 text-xl animate-bounce" style={{ animationDelay: '0.6s' }}>🍎</span>
              <span className="absolute top-14 left-1/2 -translate-x-1/2 text-2xl animate-bounce" style={{ animationDelay: '0.3s' }}>🍎</span>
            </div>
            {/* Trunk */}
            <div className="w-10 sm:w-12 h-16 sm:h-20 bg-amber-950 -mt-2 rounded-b-lg border-2 border-amber-950 flex flex-col items-center">
              <div className="w-full h-2 bg-amber-900/60 mt-3" />
            </div>

            <div className="bg-emerald-700 text-white font-bold text-xs px-2.5 py-0.5 rounded-full shadow border border-emerald-400 flex items-center gap-1 group-hover:bg-emerald-600 -mt-2">
              <span>apple tree</span>
            </div>
          </div>
        </div>

        {/* 5. BASKET (篮子) */}
        <div
          onClick={() => handleItemClick('basket')}
          className={`absolute bottom-6 sm:bottom-8 right-6 sm:right-16 z-20 cursor-pointer group transition-all duration-300 ${
            currentWaypoint.wordId === 'basket' ? 'scale-115 ring-6 ring-amber-500/80 rounded-2xl animate-pulse' : 'hover:scale-105'
          }`}
          title="Click to spot: basket (篮子)"
        >
          <div className="relative flex flex-col items-center">
            <div className="w-20 sm:w-24 h-14 sm:h-16 bg-gradient-to-b from-amber-700 via-amber-800 to-amber-950 rounded-b-2xl border-3 border-amber-950 shadow-xl relative flex flex-col items-center pt-1">
              <div className="w-full h-3 bg-amber-600 border-b border-amber-900 shadow-inner" />
              <div className="flex gap-1 items-center -mt-1 z-10 text-lg">
                <span>🍎</span>
                <span>🍎</span>
              </div>
            </div>
            <div className="absolute -top-4 inset-x-2 h-8 border-3 border-amber-700 rounded-t-full pointer-events-none" />

            <div className="bg-amber-700 text-amber-100 font-bold text-xs px-2.5 py-0.5 rounded-full shadow border border-amber-500 flex items-center gap-1 group-hover:bg-amber-600 mt-1">
              <span>basket</span>
            </div>
          </div>
        </div>

        {/* 6. POTATO (土豆) */}
        <div
          onClick={() => handleItemClick('potato')}
          className={`absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 sm:left-[44%] z-20 cursor-pointer group transition-all duration-300 ${
            currentWaypoint.wordId === 'potato' ? 'scale-115 ring-6 ring-amber-800/80 rounded-2xl animate-pulse' : 'hover:scale-105'
          }`}
          title="Click to spot: potato (土豆)"
        >
          <div className="relative flex flex-col items-center">
            <div className="w-24 sm:w-28 h-10 bg-amber-950/85 rounded-t-[26px] border-2 border-amber-900 shadow-md relative flex items-center justify-around px-2 pt-1">
              <div className="absolute -top-3 left-3 text-emerald-400 text-sm">🌿</div>
              <div className="absolute -top-3 right-4 text-emerald-400 text-sm">🌱</div>
              <div className="w-6 h-5 bg-amber-700 rounded-full border border-amber-900 shadow flex items-center justify-center text-[10px]">🥔</div>
              <div className="w-7 h-5 bg-amber-600 rounded-full border border-amber-900 shadow flex items-center justify-center text-xs">🥔</div>
            </div>

            <div className="bg-amber-800 text-white font-bold text-xs px-2.5 py-0.5 rounded-full shadow border border-amber-600 flex items-center gap-1 group-hover:bg-amber-700 mt-1">
              <span>potato</span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* THE ANIMATED EXPLORER WALKING AVATAR */}
        {/* ======================================================== */}
        <div
          style={{
            left: `${explorerPos.x}%`,
            top: `${explorerPos.y}%`,
            transition: 'all 0.75s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
          className="absolute -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
        >
          <div className="flex flex-col items-center">
            {/* Explorer Speech Bubble */}
            <div className="bg-white/95 px-2.5 py-0.5 rounded-full shadow-lg border-2 border-amber-400 text-[11px] font-black text-amber-950 mb-1 flex items-center gap-1 whitespace-nowrap animate-bounce">
              <span>I'm exploring! 🎒</span>
            </div>

            {/* Avatar & Shadow */}
            <div className={`relative ${isWalking ? 'animate-bounce' : ''}`}>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-amber-500 shadow-xl flex items-center justify-center text-3xl">
                {playerAvatar}
              </div>
              {/* Walking dust puff */}
              {isWalking && (
                <div className="absolute -bottom-2 -left-2 text-xs opacity-75">
                  💨
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Exploration Trail Progress Footsteps Bar */}
      <div className="w-full bg-white rounded-2xl p-4 border-2 border-amber-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Footprints className="w-5 h-5 text-amber-600" />
          <div>
            <h4 className="font-bold text-sm text-slate-900">
              探险足迹地图 (Explorer Trail Route)
            </h4>
            <p className="text-xs text-slate-500">
              已完成 {completedWaypoints.length} / {WAYPOINTS.length} 个农场探索点
            </p>
          </div>
        </div>

        {/* Trail Checkpoints Pill Bar */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {WAYPOINTS.map((wp, idx) => {
            const isDone = completedWaypoints.includes(wp.id);
            const isCurrent = idx === currentStepIndex % WAYPOINTS.length;

            return (
              <button
                key={wp.id}
                onClick={() => {
                  soundManager.playClick();
                  setCurrentStepIndex(idx);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                  isCurrent
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm scale-105'
                    : isDone
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>{isDone ? '✅' : idx + 1}</span>
                <span>{wp.name}</span>
              </button>
            );
          })}
        </div>

        {/* Restart Trail Button */}
        <button
          onClick={handleRestartTrail}
          className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-800 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>重新漫步探索</span>
        </button>
      </div>
    </div>
  );
};
