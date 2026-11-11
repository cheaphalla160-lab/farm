import React, { useState, useEffect } from 'react';
import { VocabularyWord } from '../types';
import { CORE_VOCABULARY } from '../data/words';
import { playPronunciation } from '../utils/speech';
import { soundManager } from '../utils/sound';
import confetti from 'canvas-confetti';
import { Volume2, Sparkles, RefreshCw, Eye, EyeOff, HelpCircle, Flame } from 'lucide-react';

interface AppleTreeGameProps {
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  applesCount: number;
  setApplesCount: React.Dispatch<React.SetStateAction<number>>;
  onHarvestWord: (word: VocabularyWord) => void;
  onSelectFarmElement: (wordId: string) => void;
}

interface TreeAppleItem {
  word: VocabularyWord;
  posX: number; // percentage from left of canopy (15% to 85%)
  posY: number; // percentage from top of canopy (20% to 75%)
  isFalling: boolean;
  isHarvested: boolean;
  shaking: boolean;
}

export const AppleTreeGame: React.FC<AppleTreeGameProps> = ({
  score,
  setScore,
  applesCount,
  setApplesCount,
  onHarvestWord,
  onSelectFarmElement
}) => {
  const [currentWord, setCurrentWord] = useState<VocabularyWord>(CORE_VOCABULARY[0]);
  const [apples, setApples] = useState<TreeAppleItem[]>([]);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'retry' | 'info' }>({
    message: 'Welcome to the farm! Listen to the audio and pick the right apple!',
    type: 'info'
  });
  const [showWordLabels, setShowWordLabels] = useState(true);
  const [comboStreak, setComboStreak] = useState(0);
  const [isAudioPrompting, setIsAudioPrompting] = useState(false);
  const [roundNumber, setRoundNumber] = useState(1);

  // Apple tree canopy coordinates for 6 core apples
  const APPLE_POSITIONS = [
    { posX: 22, posY: 26 },
    { posX: 48, posY: 20 },
    { posX: 74, posY: 28 },
    { posX: 28, posY: 54 },
    { posX: 52, posY: 50 },
    { posX: 78, posY: 56 },
  ];

  // Initialize or reset tree apples
  const spawnApples = (target?: VocabularyWord) => {
    // Shuffle the 6 core vocabulary words onto the 6 positions
    const shuffledWords = [...CORE_VOCABULARY].sort(() => Math.random() - 0.5);
    const chosenTarget = target || shuffledWords[Math.floor(Math.random() * shuffledWords.length)];
    setCurrentWord(chosenTarget);

    const items: TreeAppleItem[] = shuffledWords.map((word, idx) => ({
      word,
      posX: APPLE_POSITIONS[idx].posX,
      posY: APPLE_POSITIONS[idx].posY,
      isFalling: false,
      isHarvested: false,
      shaking: false
    }));

    setApples(items);
    setFeedback({
      message: `Listen carefully! Find the apple for "${chosenTarget.word}" (${chosenTarget.meaning})!`,
      type: 'info'
    });

    // Auto-pronounce target word with brief delay
    setTimeout(() => {
      promptAudio(chosenTarget.word);
    }, 400);
  };

  useEffect(() => {
    spawnApples();
  }, []);

  const promptAudio = async (textToSpeak?: string) => {
    const word = textToSpeak || currentWord.word;
    setIsAudioPrompting(true);
    soundManager.playClick();
    await playPronunciation(word, 0.85);
    setIsAudioPrompting(false);
  };

  const handleAppleClick = (clickedItem: TreeAppleItem, index: number) => {
    if (clickedItem.isHarvested || clickedItem.isFalling) return;

    soundManager.playApplePluck();

    // Check if clicked apple matches the current target
    if (clickedItem.word.id === currentWord.id) {
      // Correct!
      const newStreak = comboStreak + 1;
      setComboStreak(newStreak);
      const points = 100 + (newStreak > 1 ? (newStreak - 1) * 20 : 0);
      setScore(prev => prev + points);
      setApplesCount(prev => prev + 1);

      // Trigger Confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });

      // Update apple item state to falling
      setApples(prev =>
        prev.map((item, idx) =>
          idx === index ? { ...item, isFalling: true } : item
        )
      );

      setFeedback({
        message: `🎉 Great job! You plucked "${clickedItem.word.word}"! (+${points} pts) Now let's read it aloud!`,
        type: 'success'
      });

      onSelectFarmElement(clickedItem.word.id);

      // After falling animation finishes, mark harvested and trigger read-aloud modal
      setTimeout(() => {
        soundManager.playBasketCatch();
        setApples(prev =>
          prev.map((item, idx) =>
            idx === index ? { ...item, isHarvested: true, isFalling: false } : item
          )
        );

        // Open read-aloud modal
        onHarvestWord(clickedItem.word);
      }, 700);

    } else {
      // Incorrect guess
      soundManager.playGentleRetry();
      setComboStreak(0);

      // Shake the incorrect apple
      setApples(prev =>
        prev.map((item, idx) =>
          idx === index ? { ...item, shaking: true } : item
        )
      );

      setFeedback({
        message: `Oops! That apple is "${clickedItem.word.word}" (${clickedItem.word.meaning}). Listen again for "${currentWord.word}"!`,
        type: 'retry'
      });

      // Pronounce the mistakenly clicked word to reinforce learning
      playPronunciation(clickedItem.word.word);

      // Reset shake animation after 500ms
      setTimeout(() => {
        setApples(prev =>
          prev.map((item, idx) =>
            idx === index ? { ...item, shaking: false } : item
          )
        );
      }, 500);
    }
  };

  const handleNextWord = () => {
    soundManager.playClick();
    setRoundNumber(prev => prev + 1);
    // Pick another word that isn't the same if possible
    const available = CORE_VOCABULARY.filter(w => w.id !== currentWord.id);
    const next = available[Math.floor(Math.random() * available.length)];
    spawnApples(next);
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center select-none">
      {/* Top Challenge Prompt Bar */}
      <div className="w-full bg-white/95 rounded-3xl p-4 sm:p-5 border-4 border-amber-300 shadow-lg mb-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Target Word Clue with Sound Button */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => promptAudio()}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md transition-all active:scale-95 ${
              isAudioPrompting
                ? 'bg-amber-400 text-amber-950 scale-105 ring-4 ring-amber-300'
                : 'bg-gradient-to-br from-amber-500 to-orange-500 text-white hover:from-amber-400 hover:to-orange-400'
            }`}
            title="Click to hear pronunciation"
          >
            <Volume2 className={`w-8 h-8 ${isAudioPrompting ? 'animate-bounce' : ''}`} />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                Round {roundNumber} Target
              </span>
              {comboStreak > 1 && (
                <span className="flex items-center gap-1 text-xs font-black text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-200 animate-pulse">
                  <Flame className="w-3.5 h-3.5 fill-rose-500" /> {comboStreak}x Combo!
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <h2 className="font-['Fredoka',sans-serif] text-2xl sm:text-3xl font-extrabold text-amber-950 tracking-wide">
                {currentWord.word}
              </h2>
              <span className="text-sm font-semibold text-amber-800/80 font-mono">
                {currentWord.ipa}
              </span>
              <span className="text-sm font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                {currentWord.meaning}
              </span>
            </div>
          </div>
        </div>

        {/* Center / Feedback banner */}
        <div className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold border flex items-center gap-2 max-w-md text-center transition-all ${
          feedback.type === 'success'
            ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
            : feedback.type === 'retry'
            ? 'bg-rose-50 text-rose-900 border-rose-300'
            : 'bg-amber-50 text-amber-900 border-amber-300'
        }`}>
          <Sparkles className="w-4 h-4 shrink-0 text-amber-500" />
          <span>{feedback.message}</span>
        </div>

        {/* Right Action buttons: Toggle labels & Next Harvest */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundManager.playClick();
              setShowWordLabels(!showWordLabels);
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-300 shadow-sm"
            title="Toggle word labels on apples"
          >
            {showWordLabels ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="hidden sm:inline">{showWordLabels ? '隐藏单词' : '显示单词'}</span>
          </button>

          <button
            onClick={handleNextWord}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95"
            title="Skip to next target word"
          >
            <RefreshCw className="w-4 h-4" />
            <span>换个单词</span>
          </button>
        </div>
      </div>

      {/* Interactive Apple Tree Canvas Scene */}
      <div className="relative w-full aspect-[4/3] max-h-[520px] rounded-3xl bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-200 border-4 border-amber-300 shadow-2xl overflow-hidden">
        {/* Soft Sun Ray in corner */}
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-yellow-200/40 rounded-full blur-2xl pointer-events-none" />

        {/* Floating clouds */}
        <div className="absolute top-4 left-8 text-3xl opacity-75 animate-[pulse_6s_ease-in-out_infinite]">
          ☁️
        </div>
        <div className="absolute top-10 right-28 text-2xl opacity-60 animate-[pulse_8s_ease-in-out_infinite]">
          ☁️
        </div>

        {/* The Mighty Apple Tree Container */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Tree Trunk */}
          <div className="absolute bottom-6 w-20 sm:w-28 h-56 sm:h-64 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 rounded-b-xl border-4 border-amber-950 shadow-inner flex flex-col items-center">
            {/* Wood grain details */}
            <div className="w-full h-10 border-b border-amber-950/40 mt-12" />
            <div className="w-4 h-6 bg-amber-950/50 rounded-full mt-4" />
            {/* Trunk roots spreading */}
            <div className="absolute -bottom-2 -left-6 w-12 h-6 bg-amber-950 rounded-tl-full" />
            <div className="absolute -bottom-2 -right-6 w-12 h-6 bg-amber-950 rounded-tr-full" />
          </div>

          {/* Lush Green Tree Foliage Canopy */}
          <div className="absolute top-6 sm:top-10 w-[88%] sm:w-[80%] max-w-[620px] h-[68%] relative">
            {/* Organic Foliage Blobs */}
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-600 rounded-[45%] border-6 border-emerald-700 shadow-2xl" />
            <div className="absolute -top-4 left-10 w-44 h-32 bg-emerald-400 rounded-full border-4 border-emerald-700 opacity-90" />
            <div className="absolute -top-6 right-12 w-48 h-36 bg-emerald-300 rounded-full border-4 border-emerald-700 opacity-90" />
            <div className="absolute -left-4 top-16 w-36 h-40 bg-emerald-500 rounded-full border-4 border-emerald-700" />
            <div className="absolute -right-4 top-14 w-36 h-40 bg-emerald-500 rounded-full border-4 border-emerald-700" />

            {/* Tree Branch Silhouettes inside canopy */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-28 pointer-events-none opacity-40">
              <div className="w-3 h-24 bg-amber-950 mx-auto -rotate-12 rounded-t-lg" />
              <div className="w-2.5 h-16 bg-amber-950 mx-auto rotate-25 -mt-16 rounded-t-lg" />
            </div>

            {/* Interactive Apples on Canopy */}
            {apples.map((item, index) => {
              if (item.isHarvested) return null;

              const isTarget = item.word.id === currentWord.id;

              return (
                <div
                  key={item.word.id}
                  onClick={() => handleAppleClick(item, index)}
                  style={{
                    left: `${item.posX}%`,
                    top: item.isFalling ? '140%' : `${item.posY}%`,
                    transition: item.isFalling ? 'all 0.65s cubic-bezier(0.5, 0, 0.75, 0)' : 'transform 0.15s ease'
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20 ${
                    item.shaking ? 'animate-[shake_0.4s_ease-in-out]' : ''
                  } ${item.isFalling ? 'scale-90 opacity-90' : 'hover:scale-115 active:scale-95'}`}
                >
                  <div className="relative flex flex-col items-center">
                    {/* Apple Stem & Leaf */}
                    <div className="w-1.5 h-3 bg-amber-900 rounded-t-sm -mb-1 relative z-10">
                      <div className="absolute -right-2 top-0 w-3 h-2 bg-lime-400 rounded-tr-full rounded-bl-full border border-lime-600 rotate-12" />
                    </div>

                    {/* Apple Body */}
                    <div className="w-12 h-11 sm:w-14 sm:h-13 bg-gradient-to-br from-red-500 via-rose-600 to-red-700 rounded-2xl border-2 border-red-900 shadow-lg relative flex items-center justify-center group-hover:shadow-red-300">
                      {/* Glossy Reflection shine */}
                      <div className="absolute top-1 left-1.5 w-3 h-2 bg-white/70 rounded-full rotate-[-30deg]" />

                      {/* Word Label Pill */}
                      {showWordLabels ? (
                        <span className="font-['Fredoka',sans-serif] text-[11px] sm:text-xs font-black text-white px-1.5 py-0.5 bg-black/35 rounded-md backdrop-blur-xs tracking-wide">
                          {item.word.word}
                        </span>
                      ) : (
                        <HelpCircle className="w-4 h-4 text-white/90" />
                      )}

                      {/* Sparkle badge if student is looking for this exact word */}
                      {isTarget && (
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-yellow-300 rounded-full border border-yellow-500 animate-ping opacity-75" />
                      )}
                    </div>

                    {/* Target highlight ring */}
                    {isTarget && (
                      <div className="absolute -inset-1.5 rounded-3xl border-2 border-dashed border-yellow-300 animate-spin opacity-60 pointer-events-none" style={{ animationDuration: '8s' }} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Harvest Basket at Bottom Right of Tree */}
          <div className="absolute bottom-3 right-6 sm:right-16 z-30 pointer-events-none flex flex-col items-center">
            {/* Basket Floating Badge */}
            <div className="bg-red-500 text-white font-black text-xs px-2.5 py-0.5 rounded-full border-2 border-white shadow-md animate-bounce">
              {applesCount} In Basket 🍎
            </div>
            {/* Basket Artwork */}
            <div className="w-24 sm:w-28 h-16 bg-gradient-to-b from-amber-700 to-amber-900 rounded-b-2xl border-3 border-amber-950 shadow-2xl relative flex items-center justify-center">
              <span className="text-3xl filter drop-shadow">🧺</span>
            </div>
          </div>

          {/* Cheering Animated Farmer Helper on the Bottom Left */}
          <div className="absolute bottom-2 left-4 sm:left-12 z-30 pointer-events-none flex items-center gap-2">
            <div className="text-4xl sm:text-5xl animate-bounce" style={{ animationDuration: '2s' }}>
              🧑‍🌾
            </div>
            <div className="bg-white/95 px-3 py-1.5 rounded-2xl border-2 border-amber-300 shadow-md text-xs font-bold text-amber-900 hidden sm:block">
              "Click the right apple! You can do it!"
            </div>
          </div>
        </div>

        {/* Grass meadow ground trim */}
        <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-emerald-700 to-emerald-500 border-t-4 border-emerald-400" />
      </div>

      {/* Target Word Quick Practice Bar */}
      <div className="w-full mt-4 bg-amber-50 rounded-2xl p-3 border-2 border-amber-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-amber-900">农场词库全览 (All Farm Words):</span>
          <div className="flex flex-wrap gap-1.5">
            {CORE_VOCABULARY.map(w => (
              <button
                key={w.id}
                onClick={() => {
                  soundManager.playClick();
                  promptAudio(w.word);
                  spawnApples(w);
                }}
                className={`px-2.5 py-1 rounded-lg font-bold border transition-all ${
                  w.id === currentWord.id
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                    : 'bg-white text-amber-900 border-amber-300 hover:bg-amber-100'
                }`}
              >
                {w.word}
              </button>
            ))}
          </div>
        </div>

        <div className="text-amber-700/90 font-medium">
          💡 提示：点击树上的苹果即可采摘，采摘成功后将进入跟读环节！
        </div>
      </div>
    </div>
  );
};
