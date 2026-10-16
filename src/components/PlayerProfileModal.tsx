import React, { useState } from 'react';
import { useGame, getXpForLevel } from '../context/GameContext';
import { soundManager } from '../utils/audio';
import { 
  User, 
  Save, 
  Download, 
  Upload, 
  Cloud, 
  RotateCcw, 
  Award, 
  Star, 
  Flame, 
  Coins, 
  Trophy, 
  ShieldAlert,
  Copy,
  Check
} from 'lucide-react';

interface PlayerProfileModalProps {
  onClose: () => void;
  initialTab?: 'profile' | 'save';
}

const AVAILABLE_AVATARS = ['👨‍🚀', '👩‍🔬', '🧙‍♂️', '🥷', '🧝‍♀️', '🦉', '👑', '🚀', '👾', '🤖', '🦁', '🌟'];

const AVAILABLE_TITLES = [
  'Tập Sự Vũ Trụ',
  'Nhà Du Hành Tri Thức 🚀',
  'Học Giả Tinh Tú 🌟',
  'Hiệp Sĩ Địa Cầu 🌍',
  'Bá Chủ Thiên Hà 🌌',
  'Chiến Thần Đấu Trường ⚔️',
  'Bách Khoa Toàn Thư 📚'
];

export const PlayerProfileModal: React.FC<PlayerProfileModalProps> = ({ onClose, initialTab = 'profile' }) => {
  const { 
    profile, 
    settings, 
    updateProfileName, 
    exportSaveData, 
    importSaveData, 
    generateCloudSyncCode, 
    restoreFromCloudCode,
    resetProgress 
  } = useGame();

  const [activeTab, setActiveTab] = useState<'profile' | 'save'>(initialTab);
  const [name, setName] = useState(profile.name);
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar);
  const [selectedTitle, setSelectedTitle] = useState(profile.title);

  // Save/Restore State
  const [cloudCode, setCloudCode] = useState<string>('');
  const [inputCode, setInputCode] = useState<string>('');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const neededXp = getXpForLevel(profile.level);
  const xpPercent = Math.min(100, Math.round((profile.xp / neededXp) * 100));

  const handleSaveProfile = () => {
    updateProfileName(name, selectedAvatar, selectedTitle);
    onClose();
  };

  const handleExportJson = () => {
    soundManager.playClick(settings.soundFx);
    const dataStr = exportSaveData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `thien-ha-tri-thuc-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importSaveData(content);
        if (success) {
          setImportStatus('Khôi phục dữ liệu thành công!');
        } else {
          setImportStatus('Tệp sao lưu không hợp lệ. Vui lòng kiểm tra lại.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleGenerateCloud = () => {
    soundManager.playClick(settings.soundFx);
    const code = generateCloudSyncCode();
    setCloudCode(code);
  };

  const handleCopyCode = () => {
    soundManager.playClick(settings.soundFx);
    navigator.clipboard?.writeText(cloudCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleRestoreCloud = () => {
    if (!inputCode.trim()) return;
    const ok = restoreFromCloudCode(inputCode);
    if (ok) {
      setImportStatus('Đồng bộ từ mã thành công!');
    } else {
      setImportStatus('Mã không hợp lệ!');
    }
  };

  const handleConfirmReset = () => {
    resetProgress();
    setShowResetConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-indigo-700/60 rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundManager.playClick(settings.soundFx);
                setActiveTab('profile');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
                activeTab === 'profile'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              Hồ Sơ & Tiến Trình
            </button>
            <button
              onClick={() => {
                soundManager.playClick(settings.soundFx);
                setActiveTab('save');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
                activeTab === 'save'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Save className="w-4 h-4" />
              Lưu & Khôi Phục
            </button>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6 scrollbar-thin">
          {/* ================= TAB 1: PROFILE & PROGRESSION ================= */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Avatar & Basic Info */}
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-4xl shadow-xl border-2 border-indigo-400/50">
                  {selectedAvatar}
                </div>
                <div className="flex-1 text-center sm:text-left space-y-1">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-900/80 text-indigo-300 font-bold border border-indigo-700/50">
                      Cấp độ {profile.level}
                    </span>
                    <span className="text-xs text-yellow-400 font-bold flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-yellow-400" /> {profile.stars} Sao
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-white">{name}</h3>
                  <div className="text-xs text-indigo-300 font-medium">{selectedTitle}</div>
                  {/* XP Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>XP Thăng Cấp:</span>
                      <span>{profile.xp} / {neededXp} XP ({xpPercent}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full"
                        style={{ width: `${xpPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Name & Avatar */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-300">Tên Thám Hiểm:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={25}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Chọn Danh Hiệu:</label>
                <select
                  value={selectedTitle}
                  onChange={(e) => setSelectedTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  {AVAILABLE_TITLES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Đổi Hình Đại Diện (Avatar):</label>
                <div className="grid grid-cols-6 gap-2">
                  {AVAILABLE_AVATARS.map((av) => (
                    <button
                      key={av}
                      onClick={() => {
                        soundManager.playClick(settings.soundFx);
                        setSelectedAvatar(av);
                      }}
                      className={`h-12 rounded-xl text-2xl flex items-center justify-center transition border ${
                        selectedAvatar === av
                          ? 'bg-indigo-600/40 border-indigo-400 scale-105 shadow-md'
                          : 'bg-slate-950 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lifetime Stats */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Thống Kê Toàn Bộ Quá Trình
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                    <div className="text-slate-400">Tổng Câu Trả Lời</div>
                    <div className="text-base font-bold text-white mt-0.5">
                      {profile.stats.totalQuestionsAnswered}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                    <div className="text-slate-400">Độ Chính Xác</div>
                    <div className="text-base font-bold text-emerald-400 mt-0.5">
                      {profile.stats.totalQuestionsAnswered > 0
                        ? Math.round((profile.stats.totalCorrectAnswers / profile.stats.totalQuestionsAnswered) * 100)
                        : 0}%
                    </div>
                  </div>
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                    <div className="text-slate-400">Chuỗi Thắng Kỷ Lục</div>
                    <div className="text-base font-bold text-amber-400 mt-0.5">
                      {profile.stats.highestWinStreak} 🔥
                    </div>
                  </div>
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                    <div className="text-slate-400">Đấu Trường PvP</div>
                    <div className="text-base font-bold text-pink-400 mt-0.5">
                      {profile.stats.pvpWins}/{profile.stats.pvpPlayed}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: SAVE & RESTORE SYSTEM ================= */}
          {activeTab === 'save' && (
            <div className="space-y-6">
              {/* Notification Banner */}
              <div className="bg-emerald-950/40 border border-emerald-600/40 rounded-2xl p-4 text-xs text-emerald-200 flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-emerald-300">Tự Động Lưu Thời Gian Thực:</strong> Toàn bộ tiến trình, điểm số, XP, cấp độ và bản đồ mở khóa đã được tự động lưu trong trình duyệt của bạn.
                </div>
              </div>

              {/* Status message */}
              {importStatus && (
                <div className="p-3 bg-indigo-950 border border-indigo-500 rounded-xl text-xs text-center text-indigo-200 font-bold animate-in fade-in">
                  {importStatus}
                </div>
              )}

              {/* Export & Import JSON Section */}
              <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Download className="w-4 h-4 text-indigo-400" />
                  Sao Lưu & Phục Hồi Bằng Tệp JSON
                </h4>
                <p className="text-xs text-slate-400">
                  Tải tệp sao lưu về máy tính/điện thoại để chuyển tiến trình sang bất kỳ trình duyệt nào khác.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleExportJson}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition"
                  >
                    <Download className="w-4 h-4" />
                    Tải File Sao Lưu (.JSON)
                  </button>

                  <label className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer border border-slate-700">
                    <Upload className="w-4 h-4" />
                    Khôi Phục Từ File (.JSON)
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportFile}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Cloud Sync Code */}
              <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-cyan-400" />
                  Đồng Bộ Nhanh Qua Mã Cloud
                </h4>
                <div className="space-y-3">
                  <button
                    onClick={handleGenerateCloud}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-cyan-300 text-xs font-bold border border-cyan-800/50 flex items-center justify-center gap-2 transition"
                  >
                    <Cloud className="w-4 h-4" />
                    Tạo Mã Đồng Bộ Thiết Bị
                  </button>

                  {cloudCode && (
                    <div className="p-3 bg-slate-900 rounded-xl border border-dashed border-cyan-500/60 flex items-center justify-between">
                      <span className="font-mono text-sm font-bold text-cyan-300">{cloudCode}</span>
                      <button
                        onClick={handleCopyCode}
                        className="px-3 py-1 bg-cyan-600 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                      >
                        {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedCode ? 'Đã chép' : 'Sao chép'}
                      </button>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-800/80 flex gap-2">
                    <input
                      type="text"
                      placeholder="Dán mã đồng bộ vào đây..."
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      onClick={handleRestoreCloud}
                      className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition"
                    >
                      Nạp Dữ Liệu
                    </button>
                  </div>
                </div>
              </div>

              {/* Reset Confirmation */}
              <div className="pt-2 border-t border-slate-800">
                {showResetConfirm ? (
                  <div className="p-4 bg-rose-950/40 border border-rose-600/60 rounded-2xl space-y-3">
                    <div className="text-xs text-rose-300 font-bold flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-rose-400" />
                      Bạn có chắc chắn muốn đặt lại tất cả tiến trình về cấp 1?
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleConfirmReset}
                        className="px-4 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-500"
                      >
                        Xóa & Đặt Lại Toàn Bộ
                      </button>
                      <button
                        onClick={() => setShowResetConfirm(false)}
                        className="px-4 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-700"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Đặt lại toàn bộ dữ liệu & tiến trình (Reset)
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {activeTab === 'profile' && (
          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition"
            >
              Hủy
            </button>
            <button
              onClick={handleSaveProfile}
              className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30"
            >
              Lưu Thay Đổi
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
