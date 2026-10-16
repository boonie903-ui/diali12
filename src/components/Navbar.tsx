import React from 'react';
import { useGame, getXpForLevel } from '../context/GameContext';
import { soundManager } from '../utils/audio';
import { 
  Sparkles, 
  Flame, 
  Star, 
  Coins, 
  Settings as SettingsIcon, 
  User, 
  Volume2, 
  VolumeX, 
  HelpCircle,
  Save,
  Compass,
  Swords,
  BookOpen,
  Trophy
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'map' | 'arena' | 'review' | 'leaderboard';
  setActiveTab: (tab: 'map' | 'arena' | 'review' | 'leaderboard') => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onOpenTutorial: () => void;
  onOpenSaveModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenProfile,
  onOpenSettings,
  onOpenTutorial,
  onOpenSaveModal
}) => {
  const { profile, settings, updateSettings } = useGame();

  const neededXp = getXpForLevel(profile.level);
  const xpPercent = Math.min(100, Math.round((profile.xp / neededXp) * 100));

  const toggleSound = () => {
    soundManager.playClick(settings.soundFx);
    updateSettings({ soundFx: !settings.soundFx });
  };

  const navItems = [
    { id: 'map' as const, label: 'Thám Hiểm', icon: Compass, badge: `${profile.stars}⭐` },
    { id: 'arena' as const, label: 'Đấu Trường', icon: Swords, badge: 'PvP' },
    { id: 'review' as const, label: 'Ôn Tập', icon: BookOpen, badge: profile.mistakes.filter(m => !m.mastered).length > 0 ? `${profile.mistakes.filter(m => !m.mastered).length}` : undefined },
    { id: 'leaderboard' as const, label: 'Bảng Vàng & Quests', icon: Trophy, badge: profile.quests.some(q => q.current >= q.target && !q.claimed) ? '!' : undefined },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-indigo-950/60 shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        {/* Top Info Bar */}
        <div className="flex items-center justify-between py-2 border-b border-slate-800/60 text-xs sm:text-sm">
          {/* Logo & App Name */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="font-extrabold text-sm sm:text-base bg-gradient-to-r from-cyan-400 via-indigo-300 to-pink-400 bg-clip-text text-transparent flex items-center gap-1.5">
                Thiên Hà Tri Thức
                <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded bg-indigo-900/60 text-indigo-300 border border-indigo-700/50">PRO</span>
              </div>
              <div className="text-[10px] text-slate-400 hidden sm:block">Thám Hiểm Việt Nam & Vũ Trụ</div>
            </div>
          </div>

          {/* Player Stats Widgets */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Streak Counter */}
            <div 
              title={`Chuỗi đăng nhập: ${profile.streakDays} ngày`}
              className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-950/40 border border-amber-600/40 text-amber-400 text-xs font-semibold"
            >
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-bounce" />
              <span>{profile.streakDays}d</span>
            </div>

            {/* Stars Count */}
            <div 
              title="Tổng số sao thám hiểm"
              className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-950/40 border border-yellow-600/40 text-yellow-400 text-xs font-semibold"
            >
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span>{profile.stars}</span>
            </div>

            {/* Coins */}
            <div 
              title="Xu vũ trụ"
              className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-950/40 border border-emerald-600/40 text-emerald-400 text-xs font-semibold"
            >
              <Coins className="w-3.5 h-3.5 text-emerald-400" />
              <span>{profile.coins}</span>
            </div>

            {/* Level & XP progress bar */}
            <button
              onClick={onOpenProfile}
              className="group flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 hover:border-indigo-500 transition-all text-left"
            >
              <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow">
                {profile.avatar}
              </div>
              <div className="hidden md:block">
                <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-300">
                  <span>Lv.{profile.level}</span>
                  <span className="text-slate-400 font-normal">| {profile.name}</span>
                </div>
                <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-0.5">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full transition-all duration-300" 
                    style={{ width: `${xpPercent}%` }}
                  />
                </div>
              </div>
            </button>

            {/* Quick Actions (Sound, Save, Settings, Tutorial) */}
            <div className="flex items-center gap-1">
              <button
                onClick={toggleSound}
                title={settings.soundFx ? 'Tắt âm thanh' : 'Bật âm thanh'}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                {settings.soundFx ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
              </button>

              <button
                onClick={onOpenSaveModal}
                title="Lưu & Phục Hồi Dữ Liệu"
                className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition"
              >
                <Save className="w-4 h-4 text-emerald-400" />
              </button>

              <button
                onClick={onOpenTutorial}
                title="Hướng Dẫn Tân Thủ"
                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition"
              >
                <HelpCircle className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenSettings}
                title="Cài Đặt & Trợ Năng"
                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition"
              >
                <SettingsIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <nav className="flex justify-around sm:justify-start gap-1 sm:gap-4 py-2 overflow-x-auto scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  soundManager.playClick(settings.soundFx);
                  setActiveTab(item.id);
                }}
                className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all relative ${
                  isActive
                    ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50 shadow-sm shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-indigo-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
