import React, { useState, useEffect } from 'react';
import { VocabularyWord, ReadAloudEvaluation } from '../types';
import { playPronunciation, startVoiceEvaluation, isSpeechRecognitionSupported } from '../utils/speech';
import { soundManager } from '../utils/sound';
import confetti from 'canvas-confetti';
import {
  Mic,
  MicOff,
  Volume2,
  Volume1,
  Star,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RotateCcw,
  BookOpen
} from 'lucide-react';

interface ReadAloudModalProps {
  word: VocabularyWord;
  onClose: (starsEarned: number, bonusScore: number) => void;
}

export const ReadAloudModal: React.FC<ReadAloudModalProps> = ({ word, onClose }) => {
  const [isListening, setIsListening] = useState(false);
  const [evaluation, setEvaluation] = useState<ReadAloudEvaluation | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [hasMicSupport, setHasMicSupport] = useState(true);

  useEffect(() => {
    setHasMicSupport(isSpeechRecognitionSupported());
    // Auto play native pronunciation on open
    playNormal();
  }, [word]);

  const playNormal = async () => {
    setIsPlayingAudio(true);
    soundManager.playClick();
    await playPronunciation(word.word, 0.9);
    setIsPlayingAudio(false);
  };

  const playSlow = async () => {
    setIsPlayingAudio(true);
    soundManager.playClick();
    await playPronunciation(word.word, 0.65);
    setIsPlayingAudio(false);
  };

  const playExampleSentence = async () => {
    setIsPlayingAudio(true);
    soundManager.playClick();
    await playPronunciation(word.example, 0.85);
    setIsPlayingAudio(false);
  };

  const handleStartListening = () => {
    setErrorNotice(null);
    setEvaluation(null);
    soundManager.playMicChime();
    setIsListening(true);

    const controller = startVoiceEvaluation(
      word.word,
      (result) => {
        setIsListening(false);
        setEvaluation(result);

        if (result.stars === 3) {
          soundManager.playSuccessFanfare();
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.5 }
          });
        } else if (result.stars === 2) {
          soundManager.playStarTwinkle(1);
        } else {
          soundManager.playStarTwinkle(0);
        }
      },
      (err) => {
        setIsListening(false);
        setErrorNotice(err);
      }
    );

    // Timeout safety fallback (5 seconds)
    setTimeout(() => {
      if (isListening) {
        controller.stop();
        setIsListening(false);
      }
    }, 5500);
  };

  // Manual self-rating fallback when microphone is unavailable or restricted
  const handleManualSelfEval = (stars: 1 | 2 | 3) => {
    soundManager.playStarTwinkle(stars);
    setEvaluation({
      spokenText: word.word,
      accuracyScore: stars === 3 ? 98 : stars === 2 ? 80 : 65,
      stars,
      feedbackText:
        stars === 3
          ? '🌟 Excellent self-practice! Keep up the great energy!'
          : stars === 2
          ? '👍 Good job! Very clear pronunciation!'
          : '💪 Nice effort! Keep practicing with the teacher!',
      isCorrect: true
    });

    if (stars === 3) {
      soundManager.playSuccessFanfare();
      confetti({ particleCount: 40, spread: 50 });
    }
  };

  const handleFinish = () => {
    soundManager.playClick();
    const stars = evaluation?.stars || 1;
    const bonus = stars === 3 ? 120 : stars === 2 ? 80 : 40;
    onClose(stars, bonus);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 px-6 py-3.5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-bounce">🍎</span>
            <div>
              <h3 className="font-['Fredoka',sans-serif] text-lg sm:text-xl font-bold tracking-wide">
                Harvested! Let's Read Aloud
              </h3>
              <p className="text-xs text-rose-100 font-medium">
                采摘成功！请大声跟读单词，赢取发音之星 ⭐
              </p>
            </div>
          </div>

          <div className="bg-white/20 px-3 py-1 rounded-xl text-xs font-bold backdrop-blur-xs flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
            <span>农场词汇跟读</span>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 flex flex-col items-center">
          {/* Target Word Hero Display */}
          <div className="w-full bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 sm:p-5 border-2 border-amber-200 flex flex-col items-center shadow-inner relative">
            {/* Syllables display */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-full mb-1">
              <span>音节拆分:</span>
              <span className="font-mono text-amber-900">
                {word.syllables.join(' · ')}
              </span>
            </div>

            {/* Word itself in large bold typeface */}
            <h1 className="font-['Fredoka',sans-serif] text-4xl sm:text-5xl font-extrabold text-amber-950 tracking-wider text-center my-1">
              {word.word}
            </h1>

            {/* IPA & Meaning */}
            <div className="flex items-center gap-2 text-sm sm:text-base font-semibold">
              <span className="font-mono text-amber-800 bg-white px-2.5 py-0.5 rounded-lg border border-amber-300">
                {word.ipa}
              </span>
              <span className="text-emerald-800 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-lg border border-emerald-300">
                {word.meaning}
              </span>
            </div>

            {/* Teacher Pronunciation Buttons */}
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={playNormal}
                disabled={isPlayingAudio}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
              >
                <Volume2 className="w-4 h-4" />
                <span>老师示范 (Normal)</span>
              </button>

              <button
                onClick={playSlow}
                disabled={isPlayingAudio}
                className="flex items-center gap-1.5 px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs sm:text-sm font-bold border border-amber-300 transition-all active:scale-95"
                title="慢速慢读，听清每个音素"
              >
                <Volume1 className="w-4 h-4 text-amber-700" />
                <span>慢速精听 (Slow 0.65x)</span>
              </button>
            </div>
          </div>

          {/* Example Sentence Section */}
          <div className="w-full mt-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-start gap-2">
            <button
              onClick={playExampleSentence}
              className="mt-0.5 p-1 bg-amber-200 hover:bg-amber-300 rounded-lg text-amber-900 shrink-0"
              title="听例句发音"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
            <div className="flex-1">
              <p className="font-semibold text-slate-900">
                "{word.example}"
              </p>
              <p className="text-slate-500 mt-0.5">
                {word.exampleTranslation}
              </p>
            </div>
          </div>

          {/* Teacher Phonics Tip */}
          <div className="w-full mt-2 px-3 py-1.5 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="font-medium">{word.teacherNote}</span>
          </div>

          {/* Read Aloud Interaction Zone */}
          <div className="w-full mt-4 flex flex-col items-center">
            {/* Big Mic Button */}
            <div className="relative my-2">
              {isListening && (
                <div className="absolute -inset-3 bg-red-400/30 rounded-full animate-ping pointer-events-none" />
              )}
              <button
                onClick={handleStartListening}
                disabled={isListening}
                className={`relative w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-xl transition-all duration-300 active:scale-90 ${
                  isListening
                    ? 'bg-red-500 text-white ring-8 ring-red-300 scale-105'
                    : 'bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white hover:scale-105 ring-4 ring-emerald-200'
                }`}
              >
                {isListening ? (
                  <>
                    <Mic className="w-8 h-8 animate-pulse" />
                    <span className="text-[10px] font-black tracking-wider uppercase mt-0.5">
                      Listening
                    </span>
                  </>
                ) : (
                  <>
                    <Mic className="w-8 h-8" />
                    <span className="text-[10px] font-black tracking-wider uppercase mt-0.5">
                      Speak
                    </span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs font-bold text-slate-600 text-center">
              {isListening
                ? '🎙️ 正在聆听中... 请大声读出单词！'
                : '点击绿色麦克风，大声读出该单词进行AI评测！'}
            </p>

            {/* Error or Permission Notice */}
            {errorNotice && (
              <div className="mt-2 text-xs text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 text-center">
                {errorNotice}
              </div>
            )}

            {/* Evaluation Results (Stars & Feedback) */}
            {evaluation && (
              <div className="w-full mt-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-4 border-2 border-amber-300 flex flex-col items-center shadow-sm animate-[fadeIn_0.3s_ease]">
                {/* 3 Stars display */}
                <div className="flex items-center gap-2 mb-1.5">
                  {[1, 2, 3].map((starIdx) => (
                    <Star
                      key={starIdx}
                      className={`w-7 h-7 transition-all ${
                        starIdx <= evaluation.stars
                          ? 'text-yellow-400 fill-yellow-400 drop-shadow-md scale-110'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>

                {/* Score & recognized text */}
                <div className="flex items-center gap-2 text-xs font-bold">
                  <span className="text-amber-900">
                    发音得分: <strong className="text-base text-rose-600">{evaluation.accuracyScore}</strong> 分
                  </span>
                  {evaluation.spokenText && (
                    <span className="bg-white px-2 py-0.5 rounded-md border border-amber-200 text-slate-700">
                      识别到: "{evaluation.spokenText}"
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm font-bold text-emerald-800 text-center mt-1">
                  {evaluation.feedbackText}
                </p>
              </div>
            )}

            {/* Fallback Self-practice rating buttons */}
            <div className="w-full mt-3 pt-3 border-t border-slate-200 flex flex-col items-center">
              <span className="text-[11px] font-semibold text-slate-500 mb-1.5">
                也可以根据刚才自己的朗读效果直接选择发音自评：
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleManualSelfEval(3)}
                  className="px-2.5 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-900 border border-yellow-300 rounded-lg text-xs font-bold flex items-center gap-1 active:scale-95"
                >
                  ⭐⭐⭐ 纯正完美
                </button>
                <button
                  onClick={() => handleManualSelfEval(2)}
                  className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 rounded-lg text-xs font-bold flex items-center gap-1 active:scale-95"
                >
                  ⭐⭐ 读得很准
                </button>
                <button
                  onClick={() => handleManualSelfEval(1)}
                  className="px-2.5 py-1 bg-sky-100 hover:bg-sky-200 text-sky-900 border border-sky-300 rounded-lg text-xs font-bold flex items-center gap-1 active:scale-95"
                >
                  ⭐ 继续努力
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => {
              soundManager.playClick();
              setEvaluation(null);
              setErrorNotice(null);
            }}
            className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>再读一次</span>
          </button>

          <button
            onClick={handleFinish}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white rounded-xl text-sm font-black shadow-lg shadow-rose-200 transition-all active:scale-95"
          >
            <span>放进篮子并继续采摘</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
