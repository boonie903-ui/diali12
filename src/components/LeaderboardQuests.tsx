import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useGame } from '../context/GameContext';
import { ACHIEVEMENTS } from '../data/achievements';
import { LeaderboardEntry } from '../types';
import { soundManager } from '../utils/audio';
import { 
  Trophy, 
  Target, 
  Award, 
  CheckCircle2, 
  Coins, 
  Star, 
  Crown, 
  Sparkles,
  Flame,
  Zap,
  Lock
} from 'lucide-react';

export const LeaderboardQuests: React.FC = () => {
  const { profile, settings, claimQuest } = useGame();
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'quests' | 'achievements'>('leaderboard');
  const [leaderboardScope, setLeaderboardScope] = useState<'national' | 'weekly' | 'friends'>('national');

  // Simulated live leaderboards
  const baseLeaderboard: LeaderboardEntry[] = [
    { id: 'lb-1', rank: 1, name: 'Nguyễn Trần Quang', title: 'Bá Chủ Thiên Hà 🌌', avatar: '👨‍🚀', level: 14, stars: 45, xp: 8900, winRate: 92 },
    { id: 'lb-2', rank: 2, name: 'Lê Hoàng Minh', title: 'Hiệp Sĩ Địa Cầu 🌍', avatar: '🧙‍♂️', level: 12, stars: 39, xp: 7400, winRate: 88 },
    { id: 'lb-3', rank: 3, name: 'Trần Thị Mai', title: 'Học Giả Tinh Tú 🌟', avatar: '👩‍🔬', level: 10, stars: 33, xp: 5800, winRate: 85 },
    { id: 'lb-4', rank: 4, name: 'Đặng Tuấn Kiệt', title: 'Nhà Du Hành 🚀', avatar: '🥷', level: 9, stars: 28, xp: 4700, winRate: 81 },
    { id: 'lb-5', rank: 5, name: 'Phạm Hương Ly', title: 'Nhà Du Hành 🚀', avatar: '🧝‍♀️', level: 8, stars: 25, xp: 4100, winRate: 78 },
  ];

  // Insert current user into leaderboard dynamically based on stars/level
  const userEntry: LeaderboardEntry = {
    id: 'user-current',
    rank: 6,
    name: profile.name,
    title: profile.title,
    avatar: profile.avatar,
    level: profile.level,
    stars: profile.stars,
    xp: profile.xp + (profile.level * 250),
    winRate: profile.stats.pvpPlayed > 0 ? Math.round((profile.stats.pvpWins / profile.stats.pvpPlayed) * 100) : 100,
    isUser: true
  };

  // Combine and sort by stars / xp
  const fullLeaderboard = [...baseLeaderboard, userEntry]
    .sort((a, b) => b.stars !== a.stars ? b.stars - a.stars : b.xp - a.xp)
    .map((item, idx) => ({ ...item, rank: idx + 1 }));

  const top3 = fullLeaderboard.slice(0, 3);
  const rest = fullLeaderboard.slice(3);

  const handleClaim = (questId: string) => {
    claimQuest(questId);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl">
        <button
          onClick={() => {
            soundManager.playClick(settings.soundFx);
            setActiveTab('leaderboard');
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeTab === 'leaderboard'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span>Bảng Vàng Cao Thủ</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick(settings.soundFx);
            setActiveTab('quests');
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition relative ${
            activeTab === 'quests'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Target className="w-4 h-4 text-pink-400" />
          <span>Nhiệm Vụ ({profile.quests.filter(q => q.current >= q.target && !q.claimed).length})</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick(settings.soundFx);
            setActiveTab('achievements');
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeTab === 'achievements'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Award className="w-4 h-4 text-emerald-400" />
          <span>Huy Hiệu ({profile.unlockedAchievements.length}/{ACHIEVEMENTS.length})</span>
        </button>
      </div>

      {/* ================= TAB 1: BẢNG VÀNG ================= */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-6">
          {/* Scope Filters */}
          <div className="flex justify-center gap-2">
            {[
              { id: 'national' as const, label: 'Toàn Quốc' },
              { id: 'weekly' as const, label: 'Tuần Này' },
              { id: 'friends' as const, label: 'Bạn Bè' },
            ].map((scope) => (
              <button
                key={scope.id}
                onClick={() => {
                  soundManager.playClick(settings.soundFx);
                  setLeaderboardScope(scope.id);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                  leaderboardScope === scope.id
                    ? 'bg-slate-800 text-indigo-400 border border-indigo-500/50'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                {scope.label}
              </button>
            ))}
          </div>

          {/* Top 3 Podium Cards */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 sm:pt-6 items-end">
            {/* Rank 2 (Silver) */}
            {top3[1] && (
              <div className={`p-3 sm:p-5 rounded-2xl sm:rounded-3xl border flex flex-col items-center text-center transition ${
                top3[1].isUser ? 'bg-indigo-950/40 border-indigo-500' : 'bg-slate-900/90 border-slate-700/60'
              }`}>
                <div className="w-6 h-6 rounded-full bg-slate-400 text-slate-900 text-xs font-black flex items-center justify-center mb-1">
                  2
                </div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-800 border-2 border-slate-400 flex items-center justify-center text-2xl sm:text-3xl shadow">
                  {top3[1].avatar}
                </div>
                <div className="font-extrabold text-white text-xs sm:text-sm mt-2 truncate w-full">
                  {top3[1].name}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Lv.{top3[1].level}</div>
                <div className="mt-2 text-xs font-bold text-yellow-400 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-yellow-400" />
                  {top3[1].stars} ⭐
                </div>
              </div>
            )}

            {/* Rank 1 (Gold / Crown) */}
            {top3[0] && (
              <div className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl border flex flex-col items-center text-center -translate-y-2 sm:-translate-y-4 shadow-2xl relative ${
                top3[0].isUser ? 'bg-indigo-950/60 border-amber-400 shadow-amber-500/20' : 'bg-gradient-to-b from-amber-950/30 to-slate-900 border-amber-500/60 shadow-amber-500/10'
              }`}>
                <Crown className="w-7 h-7 text-amber-400 fill-amber-400 -mt-2 mb-1 animate-bounce" />
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 border-2 border-amber-300 flex items-center justify-center text-3xl sm:text-4xl shadow-lg">
                  {top3[0].avatar}
                </div>
                <div className="font-black text-amber-300 text-sm sm:text-base mt-2 truncate w-full">
                  {top3[0].name}
                </div>
                <div className="text-[10px] text-amber-200/80 mt-0.5">Lv.{top3[0].level}</div>
                <div className="mt-2 text-sm font-extrabold text-yellow-400 flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400" />
                  {top3[0].stars} ⭐
                </div>
              </div>
            )}

            {/* Rank 3 (Bronze) */}
            {top3[2] && (
              <div className={`p-3 sm:p-5 rounded-2xl sm:rounded-3xl border flex flex-col items-center text-center transition ${
                top3[2].isUser ? 'bg-indigo-950/40 border-indigo-500' : 'bg-slate-900/90 border-slate-700/60'
              }`}>
                <div className="w-6 h-6 rounded-full bg-amber-700 text-white text-xs font-black flex items-center justify-center mb-1">
                  3
                </div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-800 border-2 border-amber-700 flex items-center justify-center text-2xl sm:text-3xl shadow">
                  {top3[2].avatar}
                </div>
                <div className="font-extrabold text-white text-xs sm:text-sm mt-2 truncate w-full">
                  {top3[2].name}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Lv.{top3[2].level}</div>
                <div className="mt-2 text-xs font-bold text-yellow-400 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-yellow-400" />
                  {top3[2].stars} ⭐
                </div>
              </div>
            )}
          </div>

          {/* Leaderboard Table List */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            {rest.map((entry) => (
              <div
                key={entry.id}
                className={`flex items-center justify-between p-3.5 sm:p-4 border-b border-slate-800/60 transition ${
                  entry.isUser
                    ? 'bg-indigo-950/50 border-l-4 border-l-indigo-500'
                    : 'hover:bg-slate-850/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center font-bold text-xs sm:text-sm text-slate-400">
                    #{entry.rank}
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg">
                    {entry.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-slate-200 text-xs sm:text-sm flex items-center gap-2">
                      <span>{entry.name}</span>
                      {entry.isUser && (
                        <span className="px-1.5 py-0.2 rounded bg-indigo-500 text-white text-[10px] font-bold">
                          BẠN
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400">{entry.title}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs sm:text-sm">
                  <span className="text-slate-400">Lv.{entry.level}</span>
                  <span className="font-bold text-yellow-400 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-yellow-400" />
                    {entry.stars}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 2: NHIỆM VỤ (QUESTS) ================= */}
      {activeTab === 'quests' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-indigo-950/80 to-purple-950/80 border border-indigo-700/40 rounded-2xl p-4 text-xs sm:text-sm text-slate-300 flex items-center justify-between">
            <span>Hoàn thành nhiệm vụ mỗi ngày và mỗi tuần để tích lũy XP thăng cấp thần tốc!</span>
            <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
          </div>

          <div className="space-y-3">
            {profile.quests.map((quest) => {
              const isReady = quest.current >= quest.target && !quest.claimed;
              const percent = Math.min(100, Math.round((quest.current / quest.target) * 100));

              return (
                <div
                  key={quest.id}
                  className={`bg-slate-900/90 border rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition shadow-md ${
                    isReady
                      ? 'border-pink-500/60 bg-pink-950/15 ring-1 ring-pink-500/30'
                      : quest.claimed
                      ? 'border-slate-800/50 opacity-60'
                      : 'border-slate-800'
                  }`}
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        quest.type === 'daily' ? 'bg-amber-950 text-amber-400 border border-amber-600/40' : 'bg-purple-950 text-purple-400 border border-purple-600/40'
                      }`}>
                        {quest.type === 'daily' ? 'Hàng Ngày' : 'Hàng Tuần'}
                      </span>
                      <h4 className="font-bold text-white text-sm sm:text-base">
                        {quest.title}
                      </h4>
                    </div>

                    <p className="text-xs text-slate-400">
                      {quest.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-1 max-w-md">
                      <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
                        <span>Tiến trình:</span>
                        <span>{quest.current}/{quest.target}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-pink-500 to-indigo-500 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Reward & Claim Button */}
                  <div className="flex items-center sm:flex-col items-end gap-2 shrink-0">
                    <div className="text-xs font-bold text-amber-300 flex items-center gap-2">
                      <span>+{quest.rewardXp} XP</span>
                      <span>+{quest.rewardCoins} 🪙</span>
                    </div>

                    <button
                      disabled={!isReady}
                      onClick={() => handleClaim(quest.id)}
                      className={`px-5 py-2 rounded-xl text-xs font-extrabold transition shadow ${
                        quest.claimed
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : isReady
                          ? 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white animate-pulse shadow-pink-500/30'
                          : 'bg-slate-800 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {quest.claimed ? 'Đã Nhận' : isReady ? 'Nhận Thưởng!' : 'Chưa Đạt'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 3: HUY HIỆU (ACHIEVEMENTS) ================= */}
      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ACHIEVEMENTS.map((ach) => {
            const isUnlocked = profile.unlockedAchievements.includes(ach.id);

            return (
              <div
                key={ach.id}
                className={`p-4 sm:p-5 rounded-2xl border transition flex items-start gap-3.5 ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-indigo-950/50 via-slate-900 to-purple-950/40 border-amber-500/50 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-900/60 border-slate-800/80 opacity-60'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 border ${
                  isUnlocked ? 'bg-amber-500/20 border-amber-400/50 shadow-md shadow-amber-500/20' : 'bg-slate-800 border-slate-700'
                }`}>
                  {ach.icon}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-bold text-sm sm:text-base ${isUnlocked ? 'text-amber-300' : 'text-slate-300'}`}>
                      {ach.title}
                    </h4>
                    {isUnlocked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-500" />
                    )}
                  </div>

                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {ach.description}
                  </p>

                  <div className="mt-3 flex items-center gap-3 text-xs font-semibold text-slate-400">
                    <span className="text-indigo-400">+{ach.rewardXp} XP</span>
                    <span className="text-yellow-400">+{ach.rewardCoins} Xu 🪙</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
