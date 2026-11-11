import React, { useState } from 'react';
import { AVATAR_OPTIONS, saveStoredPlayer } from '../data/leaderboard';
import { soundManager } from '../utils/sound';
import { User, Check, X } from 'lucide-react';

interface PlayerModalProps {
  currentName: string;
  currentAvatar: string;
  onSave: (name: string, avatar: string) => void;
  onClose: () => void;
}

export const PlayerModal: React.FC<PlayerModalProps> = ({
  currentName,
  currentAvatar,
  onSave,
  onClose
}) => {
  const [name, setName] = useState(currentName);
  const [avatar, setAvatar] = useState(currentAvatar);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    soundManager.playClick();
    saveStoredPlayer({ name: name.trim(), avatar });
    onSave(name.trim(), avatar);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border-4 border-amber-300 p-6 flex flex-col">
        {/* Close Button */}
        <button
          onClick={() => { soundManager.playClick(); onClose(); }}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-4">
          <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-2 text-3xl shadow-inner border border-amber-300">
            {avatar}
          </div>
          <h3 className="font-['Fredoka',sans-serif] text-xl font-bold text-slate-900">
            Choose Your Farmer Avatar
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            挑选你喜欢的农场小角色，并输入你的英文或中文名字
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Avatar selector grid */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">
              选择头像 (Select Avatar):
            </label>
            <div className="grid grid-cols-4 gap-2">
              {AVATAR_OPTIONS.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => { soundManager.playClick(); setAvatar(item.emoji); }}
                  className={`p-2.5 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all ${
                    avatar === item.emoji
                      ? 'bg-amber-100 border-amber-500 scale-105 shadow-sm ring-2 ring-amber-300/60'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="text-[10px] font-bold text-slate-600 truncate w-full text-center">
                    {item.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Name input */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              学生名字 (Student Name):
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={24}
                placeholder="例如: Leo Li / 李浩宇"
                className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                required
              />
              <User className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            </div>
          </div>

          {/* Save button */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-xl text-sm font-black shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 mt-1"
          >
            <Check className="w-4 h-4" />
            <span>保存并开始摘苹果！</span>
          </button>
        </form>
      </div>
    </div>
  );
};
