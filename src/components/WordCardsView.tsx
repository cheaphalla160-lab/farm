import React, { useState } from 'react';
import { CORE_VOCABULARY, BONUS_VOCABULARY } from '../data/words';
import { VocabularyWord } from '../types';
import { playPronunciation } from '../utils/speech';
import { soundManager } from '../utils/sound';
import { Volume2, Volume1, Sparkles, BookOpen, Layers } from 'lucide-react';

interface WordCardsViewProps {
  onStartGameWithWord: (word: VocabularyWord) => void;
}

export const WordCardsView: React.FC<WordCardsViewProps> = ({ onStartGameWithWord }) => {
  const [playingWordId, setPlayingWordId] = useState<string | null>(null);

  const handlePlayAudio = async (word: VocabularyWord, slow: boolean = false) => {
    soundManager.playClick();
    setPlayingWordId(word.id);
    await playPronunciation(word.word, slow ? 0.65 : 0.9);
    setPlayingWordId(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 flex flex-col gap-6 select-none">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full text-xs font-black uppercase tracking-wider mb-2">
            <BookOpen className="w-4 h-4 text-emerald-200" />
            <span>Interactive Word Flashcards · 互动单词卡片</span>
          </div>
          <h2 className="font-['Fredoka',sans-serif] text-3xl sm:text-4xl font-extrabold tracking-wide">
            Master the 6 Farm Words
          </h2>
          <p className="text-emerald-100 text-sm mt-1 max-w-xl font-medium">
            点击喇叭聆听纯正美式发音与慢速拆音节读法，掌握拼读规则，准备进入摘苹果游戏！
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-xs border border-white/20">
          <span className="text-2xl">🧺</span>
          <div className="text-xs">
            <p className="font-bold text-white">农业词汇大通关</p>
            <p className="text-emerald-200">自然拼读 + 音标 + 例句</p>
          </div>
        </div>
      </div>

      {/* Core 6 Words Grid */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-6 bg-red-500 rounded-full" />
          <h3 className="font-['Fredoka',sans-serif] text-xl font-bold text-slate-800">
            6 大核心农场单词 (Core Farm Vocabulary)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CORE_VOCABULARY.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-5 border-4 border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Top Badge & Audio Buttons */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-sm"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.word[0].toUpperCase()}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handlePlayAudio(item, false)}
                      className={`p-2 rounded-xl border transition-all active:scale-95 ${
                        playingWordId === item.id
                          ? 'bg-amber-400 text-amber-950 scale-105'
                          : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
                      }`}
                      title="原速发音 (Normal)"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handlePlayAudio(item, true)}
                      className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-all active:scale-95"
                      title="慢速精听 (Slow)"
                    >
                      <Volume1 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Word & Phonetic */}
                <div className="mb-3">
                  <h4 className="font-['Fredoka',sans-serif] text-3xl font-extrabold text-slate-900 group-hover:text-amber-800 transition-colors">
                    {item.word}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-sm font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
                      {item.ipa}
                    </span>
                    <span className="text-sm font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                      {item.meaning}
                    </span>
                  </div>
                </div>

                {/* Phonics Syllables breakdown */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 mb-3 text-xs">
                  <span className="text-slate-500 font-medium">拼读拆分: </span>
                  <span className="font-mono font-bold text-indigo-700">
                    {item.syllables.join(' · ')}
                  </span>
                </div>

                {/* Example sentence */}
                <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-100 mb-2 text-xs">
                  <p className="font-semibold text-slate-800">"{item.example}"</p>
                  <p className="text-slate-500 mt-0.5">{item.exampleTranslation}</p>
                </div>
              </div>

              {/* Action Button: Jump to Game with this word */}
              <button
                onClick={() => {
                  soundManager.playClick();
                  onStartGameWithWord(item);
                }}
                className="w-full mt-2 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span>在 Farm Explorer 中寻找并跟读 🧭</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Bonus Extension Words Grid */}
      <div className="mt-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-6 bg-emerald-500 rounded-full" />
          <h3 className="font-['Fredoka',sans-serif] text-xl font-bold text-slate-800">
            拓展农业词汇 (Bonus Agriculture Words)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {BONUS_VOCABULARY.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-5 border-4 border-emerald-100 shadow-md flex items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-xs"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.word[0].toUpperCase()}
                  </span>
                  <h4 className="font-['Fredoka',sans-serif] text-2xl font-bold text-slate-900">
                    {item.word}
                  </h4>
                  <span className="font-mono text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {item.ipa}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-700">{item.meaning}</p>
                <p className="text-xs text-slate-500 mt-1 italic">"{item.example}"</p>
              </div>

              <button
                onClick={() => handlePlayAudio(item)}
                className="p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-2xl border border-emerald-200 shadow-sm shrink-0 active:scale-95"
                title="播放发音"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
