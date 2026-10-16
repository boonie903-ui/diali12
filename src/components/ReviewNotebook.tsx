import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { QUESTIONS_DATABASE } from '../data/questions';
import { Question, Topic, Difficulty } from '../types';
import { soundManager } from '../utils/audio';
import { 
  BookOpen, 
  BarChart3, 
  RotateCcw, 
  CheckCircle, 
  Trash2, 
  AlertTriangle, 
  Sparkles, 
  GraduationCap, 
  TrendingUp, 
  Play,
  Check,
  X
} from 'lucide-react';

interface ReviewNotebookProps {
  onStartCustomQuiz: (questions: Question[], title: string) => void;
}

export const ReviewNotebook: React.FC<ReviewNotebookProps> = ({ onStartCustomQuiz }) => {
  const { profile, settings, removeMistake, markMistakeMastered, addXp } = useGame();
  const [activeTab, setActiveTab] = useState<'mistakes' | 'analytics' | 'practice'>('mistakes');
  const [topicFilter, setTopicFilter] = useState<Topic | 'all'>('all');

  // Inline retry state for a single mistake
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [retryAnswer, setRetryAnswer] = useState<number | null>(null);
  const [retryResult, setRetryResult] = useState<boolean | null>(null);

  // Practice exam configuration
  const [selectedTopic, setSelectedTopic] = useState<Topic | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');
  const [questionCount, setQuestionCount] = useState<number>(5);

  const mistakes = profile.mistakes;
  const filteredMistakes = mistakes.filter((m) => {
    if (topicFilter === 'all') return true;
    return m.topic === topicFilter;
  });

  const topicLabels: Record<Topic, { name: string; icon: string }> = {
    vietnam: { name: 'Việt Nam Học', icon: '🇻🇳' },
    geography: { name: 'Địa Lý Thế Giới', icon: '🌍' },
    astronomy: { name: 'Thiên Văn & Vũ Trụ', icon: '🪐' },
    history: { name: 'Lịch Sử Nhân Loại', icon: '🏛️' },
    science: { name: 'Khoa Học Tự Nhiên', icon: '🔬' },
    culture: { name: 'Văn Hóa Dân Gian', icon: '🏮' }
  };

  const handleStartRetry = (questionId: string) => {
    soundManager.playClick(settings.soundFx);
    setRetryingId(questionId);
    setRetryAnswer(null);
    setRetryResult(null);
  };

  const handleAnswerRetry = (question: Question, chosenIdx: number) => {
    setRetryAnswer(chosenIdx);
    const isCorrect = chosenIdx === question.answerIndex;
    setRetryResult(isCorrect);

    if (isCorrect) {
      soundManager.playCorrect(settings.soundFx);
      markMistakeMastered(question.id);
      addXp(30);
    } else {
      soundManager.playWrong(settings.soundFx);
    }
  };

  const handleStartExam = () => {
    soundManager.playClick(settings.soundFx);
    let pool = [...QUESTIONS_DATABASE];

    if (selectedTopic !== 'all') {
      pool = pool.filter((q) => q.topic === selectedTopic);
    }

    if (selectedDifficulty !== 'all') {
      pool = pool.filter((q) => q.difficulty === selectedDifficulty);
    }

    // Shuffle and slice
    const selected = pool.sort(() => 0.5 - Math.random()).slice(0, questionCount);

    const title = selectedTopic === 'all' 
      ? 'Luyện Thi Tổng Hợp Tất Cả Chuyên Đề' 
      : `Luyện Chuyên Đề: ${topicLabels[selectedTopic].name}`;

    onStartCustomQuiz(selected, title);
  };

  // Find weakest topic from stats
  const lowestTopic = React.useMemo<{ topic: Topic; accuracy: number } | null>(() => {
    let result: { topic: Topic; accuracy: number } | null = null;
    let lowestAcc = 101;

    (Object.keys(profile.stats.topicStats) as Topic[]).forEach((t) => {
      const stat = profile.stats.topicStats[t];
      if (stat && stat.total > 0) {
        const acc = Math.round((stat.correct / stat.total) * 100);
        if (acc < lowestAcc) {
          lowestAcc = acc;
          result = { topic: t, accuracy: acc };
        }
      }
    });

    return result;
  }, [profile.stats.topicStats]);

  return (
    <div className="space-y-6">
      {/* Top Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl w-full sm:w-auto">
        <button
          onClick={() => {
            soundManager.playClick(settings.soundFx);
            setActiveTab('mistakes');
          }}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeTab === 'mistakes'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Sổ Tay Câu Sai ({mistakes.length})</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick(settings.soundFx);
            setActiveTab('analytics');
          }}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeTab === 'analytics'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Thống Kê Điểm Yếu</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick(settings.soundFx);
            setActiveTab('practice');
          }}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeTab === 'practice'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Luyện Thi Theo Chủ Đề</span>
        </button>
      </div>

      {/* ================= TAB 1: SỔ TAY CÂU SAI ================= */}
      {activeTab === 'mistakes' && (
        <div className="space-y-4">
          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setTopicFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
                topicFilter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              Tất Cả ({mistakes.length})
            </button>
            {(Object.keys(topicLabels) as Topic[]).map((t) => {
              const count = mistakes.filter((m) => m.topic === t).length;
              return (
                <button
                  key={t}
                  onClick={() => setTopicFilter(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${
                    topicFilter === t
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <span>{topicLabels[t].icon}</span>
                  <span>{topicLabels[t].name} ({count})</span>
                </button>
              );
            })}
          </div>

          {filteredMistakes.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-10 text-center space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto text-3xl">
                ✨
              </div>
              <h3 className="text-lg font-bold text-white">Sổ Tay Hoàn Toàn Trống!</h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                Bạn chưa có câu trả lời sai nào hoặc đã ôn tập và khắc phục toàn bộ. Hãy tiếp tục giữ vững phong độ đỉnh cao này nhé!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMistakes.map((entry) => {
                const fullQ = QUESTIONS_DATABASE.find((q) => q.id === entry.questionId);
                const isRetrying = retryingId === entry.questionId;

                return (
                  <div
                    key={entry.questionId}
                    className={`bg-slate-900/90 border rounded-2xl p-4 sm:p-5 transition shadow-lg ${
                      entry.mastered
                        ? 'border-emerald-700/60 bg-emerald-950/10'
                        : 'border-slate-800 hover:border-indigo-600/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{topicLabels[entry.topic]?.icon || '📚'}</span>
                        <span className="text-xs font-bold text-indigo-400">
                          {topicLabels[entry.topic]?.name || entry.topic}
                        </span>
                        {entry.mastered ? (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-600/50 text-[10px] text-emerald-300 font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Đã Khắc Sâu
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-amber-950/80 border border-amber-600/50 text-[10px] text-amber-300 font-bold">
                            Cần Ôn Lại ({entry.reviewCount} lần)
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => removeMistake(entry.questionId)}
                          title="Xóa câu này khỏi sổ tay"
                          className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Question text */}
                    <h4 className="font-bold text-slate-100 text-sm sm:text-base leading-snug mb-3">
                      {entry.questionText}
                    </h4>

                    {/* Retrying Inline Quiz Mode */}
                    {isRetrying && fullQ ? (
                      <div className="bg-slate-950 border border-indigo-700/60 rounded-xl p-4 space-y-3 mb-3 animate-in fade-in">
                        <div className="text-xs font-bold text-amber-300">
                          🎯 Chọn lại đáp án đúng để khắc cốt ghi tâm:
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {fullQ.options.map((opt, oIdx) => {
                            let optStyle = 'bg-slate-900 border-slate-700 text-slate-300 hover:border-indigo-400';
                            if (retryAnswer !== null) {
                              if (oIdx === fullQ.answerIndex) optStyle = 'bg-emerald-950 border-emerald-500 text-emerald-200 font-bold';
                              else if (oIdx === retryAnswer) optStyle = 'bg-rose-950 border-rose-500 text-rose-200';
                              else optStyle = 'opacity-40 border-slate-800';
                            }
                            return (
                              <button
                                key={oIdx}
                                disabled={retryAnswer !== null}
                                onClick={() => handleAnswerRetry(fullQ, oIdx)}
                                className={`p-2.5 rounded-lg border text-xs text-left font-semibold transition ${optStyle}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        {retryResult !== null && (
                          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                            <span className={retryResult ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                              {retryResult ? '🎉 Rất tốt! Bạn đã làm đúng và nhận +30 XP!' : 'Chưa đúng, hãy đọc lại giải thích bên dưới nhé.'}
                            </span>
                            <button
                              onClick={() => setRetryingId(null)}
                              className="px-3 py-1 bg-slate-800 text-white rounded-lg text-xs font-bold"
                            >
                              Xong
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Static previous answers preview */
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                        <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-900/60 text-rose-200 flex items-start gap-2">
                          <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[10px] text-rose-400 uppercase font-bold block">Bạn đã chọn:</span>
                            {entry.userAnswerText}
                          </div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-900/60 text-emerald-200 flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[10px] text-emerald-400 uppercase font-bold block">Đáp án chính xác:</span>
                            {entry.correctAnswerText}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Explanation */}
                    <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed mb-3">
                      <strong className="text-indigo-300">Lời giải chi tiết:</strong> {entry.explanation}
                    </div>

                    {!isRetrying && fullQ && (
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleStartRetry(entry.questionId)}
                          className="py-1.5 px-3 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 text-xs font-bold flex items-center gap-1.5 transition"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Làm Lại Câu Này Ngay (+30 XP)
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: THỐNG KÊ ĐIỂM YẾU ================= */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Weakness Alert Card */}
          {lowestTopic && (
            <div className="bg-amber-950/40 border border-amber-600/50 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-extrabold text-amber-300 text-sm sm:text-base">
                  Chủ đề cần ưu tiên cải thiện: {topicLabels[lowestTopic.topic]?.name} ({lowestTopic.accuracy}%)
                </h4>
                <p className="text-xs text-amber-200/90 mt-1">
                  Hệ thống phân tích bạn có tỷ lệ câu chưa đúng nhiều nhất ở chủ đề này. Hãy dành 5 phút luyện thi chuyên đề để củng cố nhé!
                </p>
                <button
                  onClick={() => {
                    setSelectedTopic(lowestTopic!.topic);
                    setActiveTab('practice');
                  }}
                  className="mt-3 px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold flex items-center gap-1.5 transition shadow"
                >
                  <Play className="w-3.5 h-3.5 fill-black" />
                  Luyện Tập Chủ Đề Này Ngay
                </button>
              </div>
            </div>
          )}

          {/* Topic Performance Bars */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-white">Năng Lực Tri Thức Theo Chuyên Đề</h3>
                <p className="text-xs text-slate-400">Đánh giá dựa trên tổng số câu hỏi bạn đã trải nghiệm</p>
              </div>
              <TrendingUp className="w-5 h-5 text-indigo-400" />
            </div>

            <div className="space-y-4">
              {(Object.keys(topicLabels) as Topic[]).map((t) => {
                const stat = profile.stats.topicStats[t] || { correct: 0, total: 0 };
                const percent = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;

                let barColor = 'from-indigo-500 to-purple-500';
                if (percent >= 80) barColor = 'from-emerald-500 to-teal-400';
                else if (percent < 50 && stat.total > 0) barColor = 'from-rose-500 to-amber-500';

                return (
                  <div key={t} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="font-bold text-slate-200 flex items-center gap-2">
                        <span>{topicLabels[t].icon}</span>
                        <span>{topicLabels[t].name}</span>
                      </span>
                      <span className="text-slate-400 text-xs">
                        Đúng <strong className="text-white">{stat.correct}</strong>/{stat.total} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${barColor} rounded-full transition-all duration-700`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: LUYỆN THI THEO CHỦ ĐỀ ================= */}
      {activeTab === 'practice' && (
        <div className="max-w-xl mx-auto bg-slate-900 border border-indigo-700/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-3xl">
              🎓
            </div>
            <h3 className="text-2xl font-black text-white">Luyện Thi Tự Chọn</h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Tùy chỉnh số lượng câu và chuyên đề để kiểm tra phản xạ & nâng cao kiến thức.
            </p>
          </div>

          {/* Option 1: Choose Topic */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">1. Chọn Chuyên Đề:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSelectedTopic('all')}
                className={`p-3 rounded-xl border text-xs font-bold transition text-left ${
                  selectedTopic === 'all'
                    ? 'bg-indigo-600 text-white border-indigo-400'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                🌐 Tất Cả Chủ Đề (Ngẫu Nhiên)
              </button>
              {(Object.keys(topicLabels) as Topic[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTopic(t)}
                  className={`p-3 rounded-xl border text-xs font-bold transition text-left flex items-center gap-2 ${
                    selectedTopic === t
                      ? 'bg-indigo-600 text-white border-indigo-400'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <span>{topicLabels[t].icon}</span>
                  <span className="truncate">{topicLabels[t].name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Option 2: Choose Question Count */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">2. Số Lượng Câu Hỏi:</label>
            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 15].map((cnt) => (
                <button
                  key={cnt}
                  onClick={() => setQuestionCount(cnt)}
                  className={`py-2.5 rounded-xl border text-xs font-bold transition ${
                    questionCount === cnt
                      ? 'bg-indigo-600 text-white border-indigo-400'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {cnt} Câu
                </button>
              ))}
            </div>
          </div>

          {/* Start Exam Button */}
          <button
            onClick={handleStartExam}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition hover:scale-[1.02]"
          >
            <Play className="w-4 h-4 fill-white" />
            Bắt Đầu Luyện Đề Ngay
          </button>
        </div>
      )}
    </div>
  );
};
