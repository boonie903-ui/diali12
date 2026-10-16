import React from 'react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/audio';
import { useGame } from '../context/GameContext';
import { Sparkles, Trophy, ArrowRight, Star } from 'lucide-react';

interface LevelUpModalProps {
  level: number;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ level, onClose }) => {
  const { profile, settings } = useGame();

  React.useEffect(() => {
    soundManager.playFanfare(settings.soundFx);
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 }
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in zoom-in-95 duration-200">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-indigo-950 via-slate-900 to-purple-950 border-2 border-amber-400 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-[0_0_50px_rgba(251,191,36,0.3)]">
        {/* Animated Badge */}
        <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 flex items-center justify-center text-5xl shadow-xl shadow-amber-500/40 animate-bounce">
          👑
        </div>

        <div className="space-y-2">
          <div className="text-xs font-black tracking-widest text-amber-300 uppercase flex items-center justify-center gap-1">
            <Sparkles className="w-4 h-4 text-amber-300" />
            CHÚC MỪNG BẠN ĐÃ THĂNG CẤP!
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <h2 className="text-4xl font-black text-white">
            CẤP ĐỘ {level}
          </h2>
          <p className="text-xs text-indigo-200">
            Danh hiệu hiện tại: <strong className="text-amber-300">{profile.title}</strong>
          </p>
        </div>

        {/* Level Up Rewards */}
        <div className="p-4 bg-slate-950/80 rounded-2xl border border-amber-500/30 text-xs space-y-2">
          <div className="text-slate-300 font-semibold">Phần Thưởng Đột Phá:</div>
          <div className="flex items-center justify-around font-bold text-amber-400">
            <span className="flex items-center gap-1">+100 Xu Vũ Trụ 🪙</span>
            <span className="flex items-center gap-1">Mở Khóa Ải Mới 🚀</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/30 transition hover:scale-105 flex items-center justify-center gap-2"
        >
          Tiếp Tục Hành Trình
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
