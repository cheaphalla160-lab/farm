import React, { useState, useEffect } from 'react';
import { LeaderboardEntry } from '../types';
import { getStoredLeaderboard, saveLeaderboard, getStoredPlayer } from '../data/leaderboard';
import { soundManager } from '../utils/sound';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Medal,
  Award,
  Sparkles,
  Download,
  RotateCcw,
  PlusCircle,
  CheckCircle2,
  Share2
} from 'lucide-react';

interface LeaderboardViewProps {
  currentScore: number;
  applesCollected: number;
  onOpenCertificate: () => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  currentScore,
  applesCollected,
  onOpenCertificate
}) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [player, setPlayer] = useState({ name: 'Super Farmer', avatar: '🧑‍🌾' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setEntries(getStoredLeaderboard());
    setPlayer(getStoredPlayer());
  }, []);

  const handleRecordCurrentScore = () => {
    soundManager.playSuccessFanfare();
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.5 }
    });

    const newEntry: LeaderboardEntry = {
      id: Date.now().toString(),
      name: player.name,
      avatar: player.avatar,
      score: currentScore,
      applesCollected: applesCollected,
      readAloudStars: Math.max(1, Math.round(applesCollected * 1.5)),
      accuracy: Math.min(100, 85 + Math.floor(Math.random() * 14)),
      date: new Date().toISOString().split('T')[0],
      badge: currentScore >= 1500 ? '🏆 Master Harvester' : currentScore >= 800 ? '🥈 Star Harvester' : '🌱 Young Sprout'
    };

    const updated = [...entries, newEntry].sort((a, b) => b.score - a.score);
    setEntries(updated);
    saveLeaderboard(updated);
    setSubmitted(true);
  };

  const handleResetScores = () => {
    if (window.confirm('确定要重置班级排行榜数据吗？此操作将恢复默认初始榜单。')) {
      soundManager.playClick();
      localStorage.removeItem('farm_english_leaderboard_v1');
      setEntries(getStoredLeaderboard());
      setSubmitted(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 flex flex-col gap-6 select-none">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full text-xs font-black uppercase tracking-wider mb-2">
            <Trophy className="w-4 h-4 text-yellow-300" />
            <span>Classroom Hall of Fame · 班级荣誉榜</span>
          </div>
          <h2 className="font-['Fredoka',sans-serif] text-3xl sm:text-4xl font-extrabold tracking-wide">
            Farm Apple Harvester Leaderboard
          </h2>
          <p className="text-amber-100 text-sm mt-1 max-w-xl font-medium">
            通过认真采摘苹果与大声跟读，比一比看谁是本周的“农场英语单词小达人”！
          </p>
        </div>

        {/* Current Student's Status Card */}
        <div className="z-10 bg-white/95 text-slate-800 p-4 rounded-2xl shadow-lg border-2 border-amber-200 flex flex-col items-center min-w-[240px]">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-3xl">{player.avatar}</span>
            <div>
              <p className="text-xs text-slate-500 font-bold">当前学生</p>
              <p className="text-sm font-extrabold text-amber-950 truncate max-w-[140px]">
                {player.name}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-around w-full border-t border-b border-amber-100 py-2 my-2 text-center">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500">已采摘</p>
              <p className="text-lg font-black text-rose-600">{applesCollected} 🍎</p>
            </div>
            <div className="w-px h-6 bg-amber-200" />
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500">累计积分</p>
              <p className="text-lg font-black text-amber-900">{currentScore} 分</p>
            </div>
          </div>

          <div className="w-full flex flex-col gap-1.5">
            <button
              onClick={handleRecordCurrentScore}
              disabled={submitted || currentScore === 0}
              className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all shadow flex items-center justify-center gap-1.5 ${
                submitted
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                  : currentScore === 0
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-400 hover:to-rose-500 active:scale-95'
              }`}
            >
              {submitted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>已登榜！</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>将我的成绩写入排行榜</span>
                </>
              )}
            </button>

            <button
              onClick={() => { soundManager.playClick(); onOpenCertificate(); }}
              className="w-full py-1.5 px-3 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Award className="w-4 h-4 text-amber-700" />
              <span>生成荣誉证书 (Certificate)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {entries.slice(0, 3).map((item, idx) => {
          const podiumBg =
            idx === 0
              ? 'bg-gradient-to-b from-yellow-100 via-amber-50 to-white border-yellow-400 ring-2 ring-yellow-300/50'
              : idx === 1
              ? 'bg-gradient-to-b from-slate-100 via-slate-50 to-white border-slate-300'
              : 'bg-gradient-to-b from-orange-100 via-amber-50 to-white border-amber-400';

          const medalIcon = idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉';
          const medalTitle = idx === 0 ? '冠军 (1st)' : idx === 1 ? '亚军 (2nd)' : '季军 (3rd)';

          return (
            <div
              key={item.id}
              className={`rounded-3xl p-5 border-3 shadow-md flex flex-col items-center text-center relative overflow-hidden ${podiumBg}`}
            >
              <div className="absolute top-2 left-3 text-2xl">
                {medalIcon}
              </div>
              <span className="text-[11px] font-black uppercase text-amber-800 tracking-wider mb-1">
                {medalTitle}
              </span>

              <div className="text-4xl my-1 p-2 bg-white rounded-2xl shadow-sm border border-amber-200">
                {item.avatar}
              </div>

              <h4 className="font-['Fredoka',sans-serif] text-base font-bold text-slate-800 mt-1">
                {item.name}
              </h4>

              <div className="bg-amber-500 text-white font-black text-sm px-3 py-1 rounded-full shadow-sm mt-2">
                {item.score} <span className="text-xs font-normal">分</span>
              </div>

              <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-slate-600">
                <span>🍎 {item.applesCollected} 个</span>
                <span>⭐ {item.accuracy}% 准确率</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Leaderboard Table */}
      <div className="bg-white rounded-3xl border-4 border-amber-200 shadow-lg overflow-hidden">
        <div className="p-4 sm:p-5 bg-amber-50 border-b border-amber-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-600" />
            <h3 className="font-['Fredoka',sans-serif] text-lg font-bold text-amber-950">
              全部学生排行明细 (All Students Ranking)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetScores}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>重置榜单</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-amber-100/50 text-amber-900 text-xs font-black uppercase border-b border-amber-200">
                <th className="py-3 px-4 text-center">排名</th>
                <th className="py-3 px-4">学生姓名</th>
                <th className="py-3 px-4 text-center">采摘苹果</th>
                <th className="py-3 px-4 text-center">发音准确度</th>
                <th className="py-3 px-4 text-center">获得称号</th>
                <th className="py-3 px-4 text-right">总得分</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100 text-sm">
              {entries.map((entry, index) => {
                const isTop3 = index < 3;
                const isCurrent = entry.name === player.name;

                return (
                  <tr
                    key={entry.id}
                    className={`hover:bg-amber-50/70 transition-colors ${
                      isCurrent ? 'bg-amber-100/60 font-bold' : ''
                    }`}
                  >
                    <td className="py-3 px-4 text-center">
                      {index === 0 ? (
                        <span className="text-xl">🥇</span>
                      ) : index === 1 ? (
                        <span className="text-xl">🥈</span>
                      ) : index === 2 ? (
                        <span className="text-xl">🥉</span>
                      ) : (
                        <span className="text-xs font-black text-slate-500">
                          #{index + 1}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{entry.avatar}</span>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{entry.name}</span>
                            {isCurrent && (
                              <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.2 rounded-full">
                                我
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-400 font-normal">
                            {entry.date}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center font-bold text-rose-600">
                      {entry.applesCollected} 🍎
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {entry.accuracy}%
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center text-xs font-medium text-amber-800">
                      {entry.badge}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <span className="font-['Fredoka',sans-serif] text-base font-extrabold text-amber-950">
                        {entry.score}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
