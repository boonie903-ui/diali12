import React from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../utils/audio';
import { 
  Volume2, 
  VolumeX, 
  Music, 
  Type, 
  Eye, 
  Mic, 
  Sparkles, 
  Smartphone,
  Check
} from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { settings, updateSettings } = useGame();

  const handleToggle = (key: keyof typeof settings) => {
    soundManager.playClick(settings.soundFx);
    updateSettings({ [key]: !settings[key] });
  };

  const handleFontSize = (size: 'sm' | 'base' | 'lg') => {
    soundManager.playClick(settings.soundFx);
    updateSettings({ fontSize: size });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-indigo-700/60 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-600/30 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-extrabold text-white">Cài Đặt & Hỗ Trợ Tiếp Cận</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Settings List */}
        <div className="space-y-4">
          {/* Audio SFX */}
          <div className="flex items-center justify-between p-3.5 bg-slate-950/70 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                {settings.soundFx ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
              </div>
              <div>
                <div className="font-bold text-xs sm:text-sm text-white">Hiệu Ứng Âm Thanh (SFX)</div>
                <div className="text-[11px] text-slate-400">Âm thanh click, đúng, sai, thăng cấp</div>
              </div>
            </div>
            <button
              onClick={() => handleToggle('soundFx')}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.soundFx ? 'bg-indigo-600' : 'bg-slate-800'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.soundFx ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Cosmic BGM */}
          <div className="flex items-center justify-between p-3.5 bg-slate-950/70 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
                <Music className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs sm:text-sm text-white">Nhạc Nền Vũ Trụ (BGM)</div>
                <div className="text-[11px] text-slate-400">Giai điệu synth không gian thư thái</div>
              </div>
            </div>
            <button
              onClick={() => handleToggle('bgm')}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.bgm ? 'bg-purple-600' : 'bg-slate-800'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.bgm ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Vietnamese TTS Speech */}
          <div className="flex items-center justify-between p-3.5 bg-slate-950/70 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center">
                <Mic className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs sm:text-sm text-white">Tự Động Đọc Câu Hỏi (TTS)</div>
                <div className="text-[11px] text-slate-400">Đọc thành tiếng bằng giọng tiếng Việt</div>
              </div>
            </div>
            <button
              onClick={() => handleToggle('speechAudio')}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.speechAudio ? 'bg-cyan-600' : 'bg-slate-800'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.speechAudio ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* High Contrast Accessibility */}
          <div className="flex items-center justify-between p-3.5 bg-slate-950/70 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs sm:text-sm text-white">Chế Độ Tương Phản Cao</div>
                <div className="text-[11px] text-slate-400">Tăng độ rõ nét cho mắt dễ nhìn</div>
              </div>
            </div>
            <button
              onClick={() => handleToggle('highContrast')}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.highContrast ? 'bg-amber-600' : 'bg-slate-800'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.highContrast ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Font Size Selector */}
          <div className="p-3.5 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-pink-600/20 text-pink-400 flex items-center justify-center">
                <Type className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs sm:text-sm text-white">Cỡ Chữ Hiển Thị</div>
                <div className="text-[11px] text-slate-400">Điều chỉnh kích thước văn bản toàn ứng dụng</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { id: 'sm' as const, label: 'Nhỏ (14px)' },
                { id: 'base' as const, label: 'Chuẩn (16px)' },
                { id: 'lg' as const, label: 'Lớn (18px)' },
              ].map((size) => (
                <button
                  key={size.id}
                  onClick={() => handleFontSize(size.id)}
                  className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 border ${
                    settings.fontSize === size.id
                      ? 'bg-pink-600 text-white border-pink-400 shadow'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {settings.fontSize === size.id && <Check className="w-3.5 h-3.5" />}
                  {size.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm transition shadow-lg shadow-indigo-600/30"
        >
          Hoàn Tất
        </button>
      </div>
    </div>
  );
};
