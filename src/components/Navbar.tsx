import React, { useState, useEffect } from 'react';
import { ActiveTab } from '../types';
import { soundManager } from '../utils/sound';
import { Volume2, VolumeX, Music, Trophy, BookOpen, Gamepad2, GraduationCap, Sparkles } from 'lucide-react';
import { getStoredPlayer } from '../data/leaderboard';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  score: number;
  applesCount: number;
  onOpenPlayerModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  score,
  applesCount,
  onOpenPlayerModal
}) => {
  const [isPlayingBgm, setIsPlayingBgm] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [player, setPlayer] = useState({ name: 'Super Farmer', avatar: '🧑‍🌾' });

  useEffect(() => {
    setPlayer(getStoredPlayer());
  }, []);

  const toggleBgm = () => {
    soundManager.playClick();
    const playing = soundManager.toggleBGM();
    setIsPlayingBgm(playing);
  };

  const toggleMute = () => {
    soundManager.playClick();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundManager.setMuted(nextMuted);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b-4 border-amber-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand Logo & Title */}
        <div 
          onClick={() => { soundManager.playClick(); setActiveTab('explorer'); }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 via-amber-500 to-rose-500 flex items-center justify-center shadow-md shadow-amber-200 group-hover:scale-105 transition-transform text-2xl">
            🧭
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-['Fredoka',sans-serif] text-xl sm:text-2xl font-bold text-amber-900 tracking-wide leading-tight">
                Farm Explorer
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-bold bg-amber-100 text-amber-800 rounded-full border border-amber-300">
                农场大探险与跟读
              </span>
            </div>
            <p className="text-xs text-amber-700/80 font-medium hidden md:block">
              Interactive Agriculture English Exploration & Pronunciation
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-amber-50 p-1.5 rounded-2xl border-2 border-amber-200/80 shadow-inner">
          <button
            onClick={() => { soundManager.playClick(); setActiveTab('explorer'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'explorer'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-200 scale-102'
                : 'text-amber-900 hover:bg-amber-100/70'
            }`}
          >
            <span className="text-base">🧭</span>
            <span>农场大探险</span>
          </button>

          <button
            onClick={() => { soundManager.playClick(); setActiveTab('apple-picking'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'apple-picking'
                ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-md shadow-rose-200 scale-102'
                : 'text-amber-900 hover:bg-amber-100/70'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>摘苹果</span>
          </button>

          <button
            onClick={() => { soundManager.playClick(); setActiveTab('learn'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'learn'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200 scale-102'
                : 'text-amber-900 hover:bg-amber-100/70'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>单词卡片</span>
          </button>

          <button
            onClick={() => { soundManager.playClick(); setActiveTab('leaderboard'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'leaderboard'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-200 scale-102'
                : 'text-amber-900 hover:bg-amber-100/70'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>排行榜</span>
          </button>

          <button
            onClick={() => { soundManager.playClick(); setActiveTab('teacher-prep'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'teacher-prep'
                ? 'bg-amber-800 text-white shadow-md shadow-amber-200 scale-102'
                : 'text-amber-900 hover:bg-amber-100/70'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span className="hidden sm:inline">教师备课</span>
            <span className="sm:hidden">备课</span>
          </button>
        </nav>

        {/* Right Side: Score, BGM, & Player Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Basket Count & Score Pill */}
          <div className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 px-3 py-1 rounded-2xl shadow-sm">
            <span className="text-xl animate-bounce">🧺</span>
            <span className="text-xs font-bold text-amber-800">
              <span className="text-base text-amber-900">{applesCount}</span> 苹果
            </span>
            <span className="w-px h-4 bg-amber-300 mx-0.5" />
            <Sparkles className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="text-sm font-black text-amber-900">
              {score} <span className="text-xs font-medium text-amber-700">分</span>
            </span>
          </div>

          {/* Cheerful BGM Toggle */}
          <button
            onClick={toggleBgm}
            title={isPlayingBgm ? '暂停背景音乐' : '播放农场欢快背景音乐'}
            className={`relative flex items-center justify-center w-10 h-10 rounded-xl border-2 transition-all shadow-sm ${
              isPlayingBgm
                ? 'bg-emerald-100 border-emerald-400 text-emerald-700 shadow-emerald-100 ring-2 ring-emerald-300/50'
                : 'bg-white border-amber-200 text-amber-800 hover:bg-amber-50'
            }`}
          >
            <Music className={`w-5 h-5 ${isPlayingBgm ? 'animate-bounce text-emerald-600' : ''}`} />
            {isPlayingBgm && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
            )}
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={toggleMute}
            title={isMuted ? '取消静音' : '静音所有音效'}
            className={`flex items-center justify-center w-10 h-10 rounded-xl border-2 transition-all shadow-sm ${
              isMuted
                ? 'bg-rose-50 border-rose-300 text-rose-600'
                : 'bg-white border-amber-200 text-amber-800 hover:bg-amber-50'
            }`}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* Student Avatar button */}
          <button
            onClick={() => { soundManager.playClick(); onOpenPlayerModal(); }}
            title="更换学生头像或姓名"
            className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 bg-white hover:bg-amber-50 border-2 border-amber-300 rounded-2xl shadow-sm transition-all active:scale-95"
          >
            <span className="text-2xl">{player.avatar}</span>
            <span className="text-xs font-bold text-amber-950 max-w-[90px] truncate hidden md:inline">
              {player.name}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
