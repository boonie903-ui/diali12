import React, { useState } from 'react';
import { soundManager } from '../utils/audio';
import { useGame } from '../context/GameContext';
import { 
  Compass, 
  Swords, 
  BookOpen, 
  Trophy, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  Check
} from 'lucide-react';

interface TutorialModalProps {
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ onClose }) => {
  const { settings } = useGame();
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: 'Chào Mừng Đến Với Thiên Hà Tri Thức!',
      icon: '✨',
      desc: 'Nền tảng đố vui và học tập đa tầng, nơi bạn sẽ dấn thân vào hành trình khám phá từ dải đất hình chữ S Việt Nam, vươn ra Trái Đất và chạm đến các kỳ quan của Vũ trụ!',
      points: [
        'Vượt qua các ải thám hiểm để tích lũy Sao ⭐ và XP thăng cấp',
        'Mở khóa các bản đồ kỳ quan mới khi đạt đủ số sao yêu cầu',
        'Thu thập Xu Vũ Trụ 🪙 để đổi các danh hiệu cao quý'
      ]
    },
    {
      title: 'Bản Đồ Thám Hiểm Đa Tầng 🗺️',
      icon: '🧭',
      desc: 'Hệ thống bản đồ với 3 tầng vũ trụ kỳ vĩ:',
      points: [
        '🇻🇳 Bản Đồ Việt Nam: Thăng Long Hà Nội, Vịnh Hạ Long, Cố Đô Huế, Hoàng Sa & Trường Sa, Nam Bộ & Boss Fansipan',
        '🌍 Bản Đồ Trái Đất: Văn minh châu Á, Kim Tự Tháp sông Nile, Phục Hưng châu Âu, Rạn san hô Great Barrier',
        '🌌 Bản Đồ Vũ Trụ: Trạm ISS, Sao Hỏa đỏ, Vành đai Sao Thổ, Kính James Webb & Hố Đen Tiên Nữ'
      ]
    },
    {
      title: 'Đấu Trường Thời Gian Thực ⚔️',
      icon: '⚔️',
      desc: 'Tranh tài tốc độ và trí tuệ cùng đối thủ:',
      points: [
        'Đấu 1v1 Đối Kháng AI: Thách thức phản xạ với máy thông minh',
        'Đấu Đội 2v2: Phối hợp đồng đội Thiên Hà vượt qua đội đối thủ',
        'Tạo Phòng Riêng: Chia sẻ mã phòng thi đấu cùng bạn bè và người thân'
      ]
    },
    {
      title: 'Sổ Tay Câu Sai & Luyện Chuyên Đề 📖',
      icon: '📚',
      desc: 'Phương pháp học tập thông minh "Biết Sai Là Sửa":',
      points: [
        'Tự động ghi nhớ các câu hỏi bạn trả lời chưa chính xác',
        'Phân tích biểu đồ điểm yếu theo 6 chuyên đề kiến thức',
        'Chế độ Luyện Thi Tự Chọn: Rèn luyện cấp tốc từ 5 đến 15 câu bất kỳ'
      ]
    },
    {
      title: 'Lưu Trữ & Khôi Phục Dữ Liệu 💾',
      icon: '🛡️',
      desc: 'Bảo toàn 100% tiến trình học tập của bạn:',
      points: [
        'Tự động lưu vào trình duyệt sau mỗi lượt chơi',
        'Xuất file JSON sao lưu tải về máy tính hoặc điện thoại',
        'Tạo mã Cloud Sync nhanh chóng chuyển dữ liệu sang thiết bị khác'
      ]
    }
  ];

  const currentStep = steps[step];

  const handleNext = () => {
    soundManager.playClick(settings.soundFx);
    if (step + 1 < steps.length) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    soundManager.playClick(settings.soundFx);
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-indigo-700/60 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6">
        {/* Header with Step Dots */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all ${
                  idx === step
                    ? 'w-6 bg-indigo-500'
                    : 'w-2 bg-slate-800'
                }`}
              />
            ))}
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Step Content */}
        <div className="space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-3xl shadow-lg shadow-indigo-600/30 mx-auto">
            {currentStep.icon}
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-xl font-black text-white">
              {currentStep.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {currentStep.desc}
            </p>
          </div>

          {/* Bullet points */}
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
            {currentStep.points.map((pt, pIdx) => (
              <div key={pIdx} className="flex items-start gap-2 text-slate-300">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{pt}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            disabled={step === 0}
            onClick={handlePrev}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
              step === 0
                ? 'opacity-0 pointer-events-none'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Trước
          </button>

          <button
            onClick={handleNext}
            className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition hover:scale-105"
          >
            {step + 1 === steps.length ? 'Sẵn Sàng Khám Phá!' : 'Tiếp Tục'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
