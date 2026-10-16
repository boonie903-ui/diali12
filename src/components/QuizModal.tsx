import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Question, MapStage, Topic } from '../types';
import { useGame } from '../context/GameContext';
import { soundManager } from '../utils/audio';
import { 
  Clock, 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Star, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Award, 
  ArrowRight,
  Lightbulb,
  Zap,
  Hourglass
} from 'lucide-react';

interface QuizModalProps {
  stage?: MapStage;
  customTitle?: string;
  questions: Question[];
  onClose: () => void;
  onFinish?: (score: number, total: number) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  stage,
  customTitle,
  questions,
  onClose,
  onFinish
}) => {
  const { profile, settings, completeStage, recordQuestionResult } = useGame();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(25);
  const [isCompleted, setIsCompleted] = useState(false);

  // Lifelines
  const [hiddenOptions, setHiddenOptions] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [used5050, setUsed5050] = useState(false);
  const [usedFreeze, setUsedFreeze] = useState(false);
  const [usedHint, setUsedHint] = useState(false);

  // Stage results
  const [earnedResult, setEarnedResult] = useState<{
    stars: number;
    xp: number;
    coins: number;
  } | null>(null);

  const currentQ = questions[currentIndex];
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Read question if speechAudio is enabled
  useEffect(() => {
    if (settings.speechAudio && currentQ && !isAnswered && !isCompleted) {
      soundManager.speak(`${currentQ.question}`);
    }
    return () => {
      soundManager.stopSpeech();
    };
  }, [currentIndex, isAnswered, isCompleted, settings.speechAudio]);

  // Timer countdown
  useEffect(() => {
    if (isAnswered || isCompleted || !currentQ) return;

    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeOut();
          return 0;
        }
        if (prev <= 5) {
          soundManager.playTick(settings.soundFx);
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isAnswered, isCompleted]);

  // Handle timeout
  const handleTimeOut = () => {
    if (isAnswered) return;
    setIsAnswered(true);
    soundManager.playWrong(settings.soundFx);
    recordQuestionResult(
      currentQ.id,
      currentQ.topic,
      currentQ.question,
      'Hết thời gian',
      currentQ.options[currentQ.answerIndex],
      false,
      currentQ.explanation
    );
  };

  // Handle user answer
  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.answerIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      soundManager.playCorrect(settings.soundFx);
    } else {
      soundManager.playWrong(settings.soundFx);
    }

    recordQuestionResult(
      currentQ.id,
      currentQ.topic,
      currentQ.question,
      currentQ.options[index],
      currentQ.options[currentQ.answerIndex],
      isCorrect,
      currentQ.explanation
    );
  };

  // Lifelines handlers
  const handle5050 = () => {
    if (used5050 || isAnswered) return;
    soundManager.playClick(settings.soundFx);
    setUsed5050(true);

    // Pick 2 wrong answers to hide
    const wrongIndices = currentQ.options
      .map((_, idx) => idx)
      .filter((idx) => idx !== currentQ.answerIndex);

    // Shuffle and pick 2
    const shuffled = wrongIndices.sort(() => 0.5 - Math.random());
    setHiddenOptions(shuffled.slice(0, 2));
  };

  const handleHint = () => {
    if (usedHint) return;
    soundManager.playClick(settings.soundFx);
    setUsedHint(true);
    setShowHint(true);
  };

  const handleFreeze = () => {
    if (usedFreeze || isAnswered) return;
    soundManager.playClick(settings.soundFx);
    setUsedFreeze(true);
    setTimer((prev) => prev + 15);
  };

  // Next question or finish
  const handleNext = () => {
    soundManager.playClick(settings.soundFx);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimer(25);
      setHiddenOptions([]);
      setShowHint(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setIsCompleted(true);
    const finalScore = score + (selectedOption === currentQ?.answerIndex ? 0 : 0);

    if (stage) {
      const result = completeStage(stage.id, finalScore, questions.length);
      setEarnedResult({
        stars: result.earnedStars,
        xp: result.earnedXp,
        coins: result.earnedCoins
      });

      if (result.earnedStars >= 2) {
        soundManager.playFanfare(settings.soundFx);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } else {
      // Custom practice session
      const accuracy = finalScore / questions.length;
      let stars = 1;
      if (accuracy >= 0.8) stars = 3;
      else if (accuracy >= 0.5) stars = 2;

      setEarnedResult({
        stars,
        xp: finalScore * 20,
        coins: finalScore * 10
      });
      if (accuracy >= 0.7) {
        soundManager.playFanfare(settings.soundFx);
        confetti({ particleCount: 70, spread: 60 });
      }
    }

    if (onFinish) {
      onFinish(finalScore, questions.length);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-indigo-700/60 rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Glow backdrop */}
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* ================= COMPLETED SUMMARY VIEW ================= */}
        {isCompleted ? (
          <div className="text-center py-6 space-y-6">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Award className="w-10 h-10 text-white" />
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {score >= Math.ceil(questions.length * 0.7) ? 'Xuất Sắc! Hoàn Thành Thử Thách' : 'Hoàn Thành Lượt Chơi!'}
              </h2>
              <p className="text-sm text-indigo-300 mt-1">
                {stage ? stage.name : customTitle || 'Luyện Tập Kiến Thức'}
              </p>
            </div>

            {/* Stars Won */}
            {earnedResult && (
              <div className="flex items-center justify-center gap-3">
                {[1, 2, 3].map((starNum) => (
                  <Star
                    key={starNum}
                    className={`w-10 h-10 transition-transform ${
                      starNum <= earnedResult.stars
                        ? 'fill-yellow-400 text-yellow-400 scale-110 drop-shadow-[0_0_12px_rgba(250,204,21,0.6)]'
                        : 'fill-slate-800 text-slate-700'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Stats Summary Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-slate-800/70 rounded-2xl border border-slate-700">
                <div className="text-xs text-slate-400">Đúng</div>
                <div className="text-xl font-extrabold text-emerald-400">
                  {score}/{questions.length}
                </div>
              </div>
              <div className="p-3 bg-slate-800/70 rounded-2xl border border-slate-700">
                <div className="text-xs text-slate-400">XP Nhận Được</div>
                <div className="text-xl font-extrabold text-indigo-400">
                  +{earnedResult?.xp || 0}
                </div>
              </div>
              <div className="p-3 bg-slate-800/70 rounded-2xl border border-slate-700">
                <div className="text-xs text-slate-400">Xu Vũ Trụ</div>
                <div className="text-xl font-extrabold text-yellow-400">
                  +{earnedResult?.coins || 0} 🪙
                </div>
              </div>
            </div>

            {/* Mistakes reminder notification */}
            {questions.length - score > 0 && (
              <div className="p-3 bg-indigo-950/40 rounded-xl border border-indigo-800/60 text-xs text-indigo-200">
                💡 {questions.length - score} câu chưa đúng đã được tự động lưu vào <strong>Sổ Tay Câu Sai</strong> để bạn ôn tập bất cứ lúc nào!
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  soundManager.playClick(settings.soundFx);
                  setCurrentIndex(0);
                  setSelectedOption(null);
                  setIsAnswered(false);
                  setScore(0);
                  setTimer(25);
                  setIsCompleted(false);
                  setUsed5050(false);
                  setUsedFreeze(false);
                  setUsedHint(false);
                  setHiddenOptions([]);
                }}
                className="w-1/2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-bold flex items-center justify-center gap-2 transition"
              >
                <RotateCcw className="w-4 h-4" />
                Thử Thách Lại
              </button>

              <button
                onClick={onClose}
                className="w-1/2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition hover:scale-[1.02]"
              >
                Tiếp Tục Bản Đồ
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* ================= ACTIVE QUESTION VIEW ================= */
          <div className="flex flex-col h-full space-y-4">
            {/* Top Bar: Progress, Stage Name, Lifelines, Close */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1">
                  <span>{stage ? stage.name : customTitle || 'Thử Thách'}</span>
                </div>
                <div className="text-xs text-slate-400">
                  Câu hỏi <strong className="text-white">{currentIndex + 1}</strong> / {questions.length}
                </div>
              </div>

              {/* Lifeline buttons */}
              <div className="flex items-center gap-1.5">
                {/* 50:50 */}
                <button
                  onClick={handle5050}
                  disabled={used5050 || isAnswered}
                  title="50:50 (Loại 2 đáp án sai)"
                  className={`px-2 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 border ${
                    used5050
                      ? 'bg-slate-800/40 text-slate-600 border-slate-800 cursor-not-allowed'
                      : 'bg-indigo-950/80 text-indigo-300 border-indigo-700/60 hover:bg-indigo-900'
                  }`}
                >
                  <Zap className="w-3 h-3 text-amber-400" />
                  50:50
                </button>

                {/* Hint */}
                <button
                  onClick={handleHint}
                  disabled={usedHint || isAnswered}
                  title="Gợi ý từ vệ tinh"
                  className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center border ${
                    usedHint
                      ? 'bg-slate-800/40 text-slate-600 border-slate-800 cursor-not-allowed'
                      : 'bg-purple-950/80 text-purple-300 border-purple-700/60 hover:bg-purple-900'
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5 text-yellow-300" />
                </button>

                {/* Freeze / +15s */}
                <button
                  onClick={handleFreeze}
                  disabled={usedFreeze || isAnswered}
                  title="Đóng băng (+15 giây)"
                  className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center border ${
                    usedFreeze
                      ? 'bg-slate-800/40 text-slate-600 border-slate-800 cursor-not-allowed'
                      : 'bg-cyan-950/80 text-cyan-300 border-cyan-700/60 hover:bg-cyan-900'
                  }`}
                >
                  <Hourglass className="w-3.5 h-3.5 text-cyan-400" />
                </button>

                {/* Speech read aloud button */}
                <button
                  onClick={() => soundManager.speak(currentQ.question)}
                  title="Đọc câu hỏi bằng giọng nói"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  <Volume2 className="w-4 h-4 text-cyan-400" />
                </button>

                <button
                  onClick={onClose}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition ml-1"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Timer Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 font-semibold">
                  <Clock className={`w-3.5 h-3.5 ${timer <= 5 ? 'text-red-400 animate-spin' : 'text-indigo-400'}`} />
                  Thời gian: <strong className={timer <= 5 ? 'text-red-400 font-bold' : 'text-slate-200'}>{timer}s</strong>
                </span>
                <span className="text-emerald-400 font-semibold">Đúng: {score} câu</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 rounded-full ${
                    timer <= 5 ? 'bg-red-500' : 'bg-gradient-to-r from-indigo-500 to-cyan-400'
                  }`}
                  style={{ width: `${(timer / 25) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Text Card */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 sm:p-5 relative min-h-[90px] flex items-center">
              <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
                {currentQ.question}
              </p>
            </div>

            {/* Satellite Hint Popup if opened */}
            {showHint && (
              <div className="bg-amber-950/40 border border-amber-600/50 rounded-xl p-3 text-xs text-amber-200 flex items-start gap-2 animate-in fade-in">
                <Lightbulb className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-yellow-400">Gợi ý từ vệ tinh tri thức:</strong> {currentQ.hint}
                </div>
              </div>
            )}

            {/* Options List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 flex-1">
              {currentQ.options.map((option, idx) => {
                const isHidden = hiddenOptions.includes(idx);
                if (isHidden) {
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl border border-dashed border-slate-800 bg-slate-950/30 opacity-20 flex items-center justify-center text-xs text-slate-600 select-none"
                    >
                      (Đã loại trừ 50:50)
                    </div>
                  );
                }

                let btnStyle = 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700/80 hover:border-indigo-500';

                if (isAnswered) {
                  if (idx === currentQ.answerIndex) {
                    btnStyle = 'bg-emerald-950/90 border-emerald-500 text-emerald-200 font-bold ring-2 ring-emerald-400/50';
                  } else if (idx === selectedOption) {
                    btnStyle = 'bg-rose-950/90 border-rose-500 text-rose-200 font-bold';
                  } else {
                    btnStyle = 'bg-slate-950/50 border-slate-800/50 text-slate-500 opacity-60';
                  }
                }

                const optionLetters = ['A', 'B', 'C', 'D'];

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`p-3.5 sm:p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all duration-200 flex items-start gap-3 shadow-md ${btnStyle} ${
                      !isAnswered ? 'hover:-translate-y-0.5 active:translate-y-0 cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    <span className="w-6 h-6 rounded-lg bg-slate-900/80 border border-slate-700 flex items-center justify-center text-xs font-bold shrink-0">
                      {optionLetters[idx]}
                    </span>
                    <span className="flex-1 leading-snug">{option}</span>
                    {isAnswered && idx === currentQ.answerIndex && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {isAnswered && idx === selectedOption && idx !== currentQ.answerIndex && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box after answer is given */}
            {isAnswered && (
              <div className="bg-slate-950/90 border border-indigo-900/80 rounded-2xl p-4 space-y-2 animate-in fade-in duration-300">
                <div className="flex items-center gap-2">
                  {selectedOption === currentQ.answerIndex ? (
                    <span className="text-emerald-400 font-bold text-xs flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Chính xác tuyệt vời!
                    </span>
                  ) : (
                    <span className="text-rose-400 font-bold text-xs flex items-center gap-1">
                      <XCircle className="w-4 h-4" /> Chưa chính xác! Đáp án đúng: {currentQ.options[currentQ.answerIndex]}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentQ.explanation}
                </p>

                {currentQ.triviaFact && (
                  <div className="pt-2 border-t border-slate-800/80 text-[11px] text-indigo-300 flex items-start gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0 mt-0.5" />
                    <span><strong>Bạn có biết:</strong> {currentQ.triviaFact}</span>
                  </div>
                )}
              </div>
            )}

            {/* Next Button Footer */}
            {isAnswered && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition hover:scale-[1.02]"
                >
                  {currentIndex + 1 < questions.length ? 'Câu Tiếp Theo' : 'Xem Kết Quả'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
