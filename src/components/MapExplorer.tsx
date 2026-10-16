import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { MAP_STAGES } from '../data/stages';
import { MapStage, MapType } from '../types';
import { soundManager } from '../utils/audio';
import { 
  Lock, 
  Star, 
  Sparkles, 
  Play, 
  ShieldAlert, 
  MapPin, 
  Info, 
  ChevronRight,
  Globe2,
  Compass,
  Rocket
} from 'lucide-react';

interface MapExplorerProps {
  onStartStage: (stage: MapStage) => void;
}

export const MapExplorer: React.FC<MapExplorerProps> = ({ onStartStage }) => {
  const { profile, settings } = useGame();
  const [currentMap, setCurrentMap] = useState<MapType>('vietnam');
  const [selectedStage, setSelectedStage] = useState<MapStage | null>(null);

  const stages = MAP_STAGES.filter((s) => s.mapType === currentMap);

  const handleSelectStage = (stage: MapStage) => {
    soundManager.playClick(settings.soundFx);
    setSelectedStage(stage);
  };

  const mapTabs = [
    { type: 'vietnam' as MapType, label: 'Bản Đồ Việt Nam', icon: Compass, flag: '🇻🇳', desc: 'Dải đất hình chữ S, non sông gấm vóc & biển đảo thiêng liêng' },
    { type: 'earth' as MapType, label: 'Địa Cầu & Kỳ Quan', icon: Globe2, flag: '🌍', desc: '7 đại dương, các châu lục và kỳ quan nhân loại' },
    { type: 'space' as MapType, label: 'Vũ Trụ & Thiên Hà', icon: Rocket, flag: '🌌', desc: 'Hệ Mặt Trời, sao Hỏa, sao Thổ và hố đen không gian' },
  ];

  // Calculate total stars earned in this map
  const currentMapStages = MAP_STAGES.filter(s => s.mapType === currentMap);
  const earnedStarsInMap = currentMapStages.reduce((acc, stg) => {
    return acc + (profile.stagesProgress[stg.id]?.stars || 0);
  }, 0);
  const maxStarsInMap = currentMapStages.length * 3;

  return (
    <div className="space-y-6">
      {/* Map Category Selector */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="grid grid-cols-3 gap-2 w-full sm:w-auto">
            {mapTabs.map((tab) => {
              const isActive = currentMap === tab.type;
              return (
                <button
                  key={tab.type}
                  onClick={() => {
                    soundManager.playClick(settings.soundFx);
                    setCurrentMap(tab.type);
                    setSelectedStage(null);
                  }}
                  className={`flex flex-col items-center sm:flex-row sm:items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 ring-2 ring-indigo-400/50'
                      : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-base sm:text-lg">{tab.flag}</span>
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Map Progress Summary */}
          <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-300 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>Tiến độ sao: <strong className="text-yellow-400 font-bold">{earnedStarsInMap}/{maxStarsInMap}</strong></span>
            </div>
          </div>
        </div>

        {/* Map Header Description */}
        <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
          <span>{mapTabs.find(t => t.type === currentMap)?.desc}</span>
          <span className="text-indigo-400">Nhấp vào từng ải để thám hiểm & thu thập sao ⭐</span>
        </div>
      </div>

      {/* Interactive Map Visual Board */}
      <div className="relative min-h-[460px] sm:min-h-[520px] rounded-3xl overflow-hidden border border-indigo-950/80 bg-radial from-slate-900 via-slate-950 to-black p-4 sm:p-8 shadow-2xl flex flex-col justify-between">
        {/* Animated background stars & nebulae */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute top-10 right-10 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl" />
          {/* Subtle grid lines */}
          <div className="w-full h-full bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:32px_32px]" />
        </div>

        {/* Stage Nodes Grid / Path */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {stages.map((stage, idx) => {
            const progress = profile.stagesProgress[stage.id] || {
              unlocked: idx === 0,
              completed: false,
              stars: 0,
              highScore: 0,
              attempts: 0
            };

            const isLocked = !progress.unlocked;
            const isCompleted = progress.completed;
            const stars = progress.stars;

            return (
              <div
                key={stage.id}
                onClick={() => !isLocked && handleSelectStage(stage)}
                className={`relative group rounded-2xl p-4 sm:p-5 transition-all duration-300 cursor-pointer border ${
                  isLocked
                    ? 'bg-slate-950/60 border-slate-800/60 opacity-60 cursor-not-allowed'
                    : isCompleted
                    ? 'bg-gradient-to-br from-indigo-950/50 via-slate-900/90 to-purple-950/50 border-indigo-600/50 hover:border-indigo-400 hover:shadow-indigo-500/20 hover:shadow-xl hover:-translate-y-1'
                    : 'bg-gradient-to-br from-slate-900/90 to-slate-950 border-amber-500/40 hover:border-amber-400 hover:shadow-amber-500/20 hover:shadow-xl hover:-translate-y-1 glow-active'
                }`}
              >
                {/* Boss Badge or Stage Number */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-2xl shadow">
                      {stage.icon}
                    </span>
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                        {stage.isBoss ? '👑 ĐẠI THỬ THÁCH (BOSS)' : `Ải ${idx + 1}`}
                      </div>
                      <h4 className="font-bold text-slate-100 text-sm sm:text-base leading-snug group-hover:text-cyan-300 transition-colors">
                        {stage.name}
                      </h4>
                    </div>
                  </div>

                  {/* Lock status or Stars */}
                  <div>
                    {isLocked ? (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800/90 text-slate-400 text-xs">
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Khóa</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3].map((starNum) => (
                          <Star
                            key={starNum}
                            className={`w-4 h-4 ${
                              starNum <= stars
                                ? 'fill-yellow-400 text-yellow-400 drop-shadow'
                                : 'fill-slate-800 text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Subtitle & Description */}
                <p className="text-xs text-indigo-200/80 font-medium mb-1 line-clamp-1">
                  {stage.subtitle}
                </p>
                <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                  {stage.description}
                </p>

                {/* Footer status / unlock conditions */}
                <div className="pt-2 border-t border-slate-800/70 flex items-center justify-between text-xs">
                  {isLocked ? (
                    <div className="text-amber-400/90 flex items-center gap-1 text-[11px]">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Cần: {stage.requiredStars}⭐ | Lv.{stage.requiredLevel}</span>
                    </div>
                  ) : (
                    <div className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                      <span>{stage.questionsCount} câu hỏi</span>
                      {progress.highScore > 0 && (
                        <span className="text-emerald-400 font-semibold">• Cao nhất: {progress.highScore}đ</span>
                      )}
                    </div>
                  )}

                  {!isLocked && (
                    <span className="text-indigo-400 group-hover:translate-x-1 transition-transform flex items-center gap-0.5 font-bold text-xs">
                      Khám phá <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="relative z-10 mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Mẹo: Hoàn thành ải với độ chính xác cao để mở khóa nhanh các bản đồ kế tiếp!</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping inline-block" /> Đang sẵn sàng</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" /> Đã hoàn thành</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-slate-700 inline-block" /> Chưa mở khóa</span>
          </div>
        </div>
      </div>

      {/* Stage Detail Briefing Modal */}
      {selectedStage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 border border-indigo-700/60 rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-indigo-600/20 rounded-full blur-2xl" />

            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-700 to-purple-600 flex items-center justify-center text-3xl shadow-lg">
                  {selectedStage.icon}
                </span>
                <div>
                  <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                    {selectedStage.isBoss ? '👑 ĐẠI THỬ THÁCH (BOSS)' : 'ẢI THÁM HIỂM'}
                  </div>
                  <h3 className="text-xl font-extrabold text-white">
                    {selectedStage.name}
                  </h3>
                  <p className="text-xs text-indigo-300 font-medium">{selectedStage.subtitle}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStage(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                ✕
              </button>
            </div>

            {/* Stage Lore */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 mb-4 text-xs sm:text-sm text-slate-300 leading-relaxed italic">
              "{selectedStage.lore}"
            </div>

            {/* Stage Details & Objectives */}
            <div className="space-y-3 mb-6 text-xs sm:text-sm">
              <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 flex items-center justify-between">
                <span className="text-slate-400">Số câu hỏi thử thách:</span>
                <span className="font-bold text-white">{selectedStage.questionsCount} câu</span>
              </div>
              
              <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 flex items-center justify-between">
                <span className="text-slate-400">Phần thưởng vượt ải:</span>
                <span className="font-bold text-emerald-400">+100-300 XP, +50 Xu, ⭐ Sao</span>
              </div>

              {/* Star Rating Criteria */}
              <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 space-y-1.5">
                <div className="font-semibold text-slate-300 text-xs">Mục tiêu đạt Sao:</div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-900/80 py-1.5 px-2 rounded-lg border border-slate-700/60">
                    <span className="text-yellow-400 font-bold">⭐ 1 Sao</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Đúng ≥ 40%</p>
                  </div>
                  <div className="bg-slate-900/80 py-1.5 px-2 rounded-lg border border-slate-700/60">
                    <span className="text-yellow-400 font-bold">⭐⭐ 2 Sao</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Đúng ≥ 60%</p>
                  </div>
                  <div className="bg-slate-900/80 py-1.5 px-2 rounded-lg border border-slate-700/60">
                    <span className="text-yellow-400 font-bold">⭐⭐⭐ 3 Sao</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Đúng ≥ 85%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedStage(null)}
                className="w-1/3 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  const stageToStart = selectedStage;
                  setSelectedStage(null);
                  onStartStage(stageToStart);
                }}
                className="w-2/3 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white text-sm font-extrabold shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 transition hover:scale-[1.02]"
              >
                <Play className="w-4 h-4 fill-white" />
                Bắt Đầu Thám Hiểm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
