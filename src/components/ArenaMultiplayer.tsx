import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useGame } from '../context/GameContext';
import { QUESTIONS_DATABASE } from '../data/questions';
import { soundManager } from '../utils/audio';
import { Question } from '../types';
import { 
  Swords, 
  Users, 
  Bot, 
  Share2, 
  Copy, 
  Check, 
  Clock, 
  Trophy, 
  Shield, 
  Flame, 
  Zap,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

interface ArenaProps {
  onBackToMap?: () => void;
}

type BattleMode = 'select' | '1v1-ai' | '1v1-local' | 'room' | 'team';

export const ArenaMultiplayer: React.FC<ArenaProps> = () => {
  const { profile, settings, recordPvpResult } = useGame();
  const [mode, setMode] = useState<BattleMode>('select');

  // Room code simulation
  const [roomCode, setRoomCode] = useState('');
  const [inputRoomCode, setInputRoomCode] = useState('');
  const [copied, setCopied] = useState(false);

  // Match State
  const [matchQuestions, setMatchQuestions] = useState<Question[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [partnerScore, setPartnerScore] = useState(0); // for team mode
  const [opponent2Score, setOpponent2Score] = useState(0); // for team mode
  const [roundTimer, setRoundTimer] = useState(15);
  const [userAnswered, setUserAnswered] = useState<number | null>(null);
  const [opponentAnswered, setOpponentAnswered] = useState<boolean | null>(null);
  const [roundOver, setRoundOver] = useState(false);
  const [matchOver, setMatchOver] = useState(false);

  // AI Opponent Profile
  const [aiProfile, setAiProfile] = useState({
    name: 'Sao Băng Siêu Tốc',
    avatar: '🤖',
    accuracy: 0.75,
    reactionSpeed: 3000 // ms
  });

  const generateRoom = () => {
    soundManager.playClick(settings.soundFx);
    const code = 'ARENA-' + Math.floor(1000 + Math.random() * 9000);
    setRoomCode(code);
  };

  const copyRoomCode = () => {
    soundManager.playClick(settings.soundFx);
    navigator.clipboard?.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const startBattle = (selectedMode: BattleMode) => {
    soundManager.playClick(settings.soundFx);
    // Pick 5 random questions
    const shuffled = [...QUESTIONS_DATABASE].sort(() => 0.5 - Math.random()).slice(0, 5);
    setMatchQuestions(shuffled);
    setQIndex(0);
    setUserScore(0);
    setOpponentScore(0);
    setPartnerScore(0);
    setOpponent2Score(0);
    setRoundTimer(15);
    setUserAnswered(null);
    setOpponentAnswered(null);
    setRoundOver(false);
    setMatchOver(false);

    if (selectedMode === 'team') {
      setAiProfile({
        name: 'Đội Trưởng Sao Hỏa',
        avatar: '👾',
        accuracy: 0.7,
        reactionSpeed: 3500
      });
    } else {
      setAiProfile({
        name: 'Cú Mèo Tri Thức',
        avatar: '🦉',
        accuracy: 0.8,
        reactionSpeed: 3200
      });
    }

    setMode(selectedMode);
  };

  const currentQ = matchQuestions[qIndex];

  // Round Timer & simulated opponent answer
  useEffect(() => {
    if (mode === 'select' || matchOver || roundOver || !currentQ) return;

    // Simulate opponent answering after their reaction delay
    const oppTimer = setTimeout(() => {
      if (!roundOver) {
        const isOpponentCorrect = Math.random() < aiProfile.accuracy;
        setOpponentAnswered(isOpponentCorrect);
        if (isOpponentCorrect) {
          const speedBonus = Math.floor(roundTimer * 5);
          setOpponentScore(prev => prev + 100 + speedBonus);
        }
        // Also simulate partner and opponent2 if team mode
        if (mode === 'team') {
          if (Math.random() > 0.3) setPartnerScore(p => p + 90);
          if (Math.random() > 0.4) setOpponent2Score(o => o + 95);
        }
      }
    }, Math.random() * 2000 + aiProfile.reactionSpeed);

    const interval = setInterval(() => {
      setRoundTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleRoundTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(oppTimer);
    };
  }, [mode, qIndex, roundOver, matchOver]);

  const handleRoundTimeout = () => {
    if (roundOver) return;
    setRoundOver(true);
    soundManager.playWrong(settings.soundFx);
  };

  const handleUserAnswer = (index: number) => {
    if (roundOver || userAnswered !== null) return;
    setUserAnswered(index);
    const isCorrect = index === currentQ.answerIndex;

    if (isCorrect) {
      soundManager.playCorrect(settings.soundFx);
      const speedBonus = roundTimer * 10;
      setUserScore(prev => prev + 100 + speedBonus);
    } else {
      soundManager.playWrong(settings.soundFx);
    }

    // End round after 1s
    setTimeout(() => {
      setRoundOver(true);
    }, 800);
  };

  const handleNextRound = () => {
    soundManager.playClick(settings.soundFx);
    if (qIndex + 1 < matchQuestions.length) {
      setQIndex(prev => prev + 1);
      setUserAnswered(null);
      setOpponentAnswered(null);
      setRoundTimer(15);
      setRoundOver(false);
    } else {
      // Match Finished!
      setMatchOver(true);
      const isWinner = mode === 'team'
        ? (userScore + partnerScore) > (opponentScore + opponent2Score)
        : userScore > opponentScore;

      recordPvpResult(isWinner);

      if (isWinner) {
        soundManager.playFanfare(settings.soundFx);
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* ================= BATTLE SELECTION SCREEN ================= */}
      {mode === 'select' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border border-indigo-700/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="max-w-2xl relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-bold mb-3">
                <Flame className="w-3.5 h-3.5 fill-pink-400" />
                Đấu Trường Thời Gian Thực
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Đấu Trí Đỉnh Cao - Tranh Tài Bách Khoa
              </h2>
              <p className="text-sm text-slate-300 mt-2">
                So tài kiến thức tốc độ cùng hàng ngàn đối thủ, thách đấu bạn bè qua mã phòng riêng hoặc liên quân Đấu Đội kịch tính!
              </p>
            </div>
            <div className="absolute right-4 -bottom-6 opacity-20 sm:opacity-30 pointer-events-none text-9xl">
              ⚔️
            </div>
          </div>

          {/* Mode Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Mode 1: 1v1 AI */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-indigo-500 transition-all flex flex-col justify-between group hover:shadow-xl hover:shadow-indigo-500/10">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  🤖
                </div>
                <h3 className="font-extrabold text-lg text-white group-hover:text-cyan-300 transition-colors">
                  1v1 Đối Kháng AI
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Thi đấu đố vui tính điểm theo giây với Bot siêu trí tuệ. Càng nhanh và chính xác càng nhiều điểm combo.
                </p>
              </div>
              <button
                onClick={() => startBattle('1v1-ai')}
                className="mt-5 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition"
              >
                <Swords className="w-4 h-4" />
                Vào Đấu Ngay
              </button>
            </div>

            {/* Mode 2: Team Battle */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-purple-500 transition-all flex flex-col justify-between group hover:shadow-xl hover:shadow-purple-500/10">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  🛡️
                </div>
                <h3 className="font-extrabold text-lg text-white group-hover:text-purple-300 transition-colors">
                  Đấu Đội Liên Quân (2v2)
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Phối hợp đồng đội trong cuộc chiến Thiên Hà vs Sao Băng. Điểm số cả đội được cộng dồn giành vinh quang.
                </p>
              </div>
              <button
                onClick={() => startBattle('team')}
                className="mt-5 w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition"
              >
                <Users className="w-4 h-4" />
                Tham Gia Đấu Đội
              </button>
            </div>

            {/* Mode 3: Room with Friends */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-pink-500 transition-all flex flex-col justify-between group hover:shadow-xl hover:shadow-pink-500/10">
              <div>
                <div className="w-12 h-12 rounded-xl bg-pink-600/20 border border-pink-500/30 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  🔗
                </div>
                <h3 className="font-extrabold text-lg text-white group-hover:text-pink-300 transition-colors">
                  Tạo Phòng Mời Bạn Bè
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Tạo mã phòng thi đấu riêng tư, gửi mã mời bạn cùng lớp hoặc gia đình đọ tài kiến thức.
                </p>
              </div>
              <button
                onClick={() => {
                  generateRoom();
                  setMode('room');
                }}
                className="mt-5 w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition"
              >
                <Share2 className="w-4 h-4" />
                Tạo / Vào Phòng
              </button>
            </div>
          </div>

          {/* PvP Stats card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span>
                Thành tích Đấu Trường: Đã đấu <strong className="text-white">{profile.stats.pvpPlayed}</strong> trận • Thắng <strong className="text-emerald-400">{profile.stats.pvpWins}</strong> ({profile.stats.pvpPlayed > 0 ? Math.round((profile.stats.pvpWins / profile.stats.pvpPlayed) * 100) : 0}%)
              </span>
            </div>
            <div className="text-indigo-400 font-semibold">
              Mỗi trận thắng thưởng: +120 XP & +50 Xu 🪙
            </div>
          </div>
        </div>
      )}

      {/* ================= ROOM CODE SETUP SCREEN ================= */}
      {mode === 'room' && (
        <div className="max-w-xl mx-auto bg-slate-900 border border-indigo-700/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-extrabold text-white">Phòng Đấu Bạn Bè</h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Chia sẻ mã phòng này cho bạn bè hoặc nhập mã phòng của người khác để bắt đầu trận đấu!
            </p>
          </div>

          {/* Generated Code */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-dashed border-indigo-500/50 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400">Mã phòng của bạn:</span>
              <div className="text-2xl font-black text-indigo-400 tracking-wider">
                {roomCode}
              </div>
            </div>
            <button
              onClick={copyRoomCode}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Đã sao chép' : 'Sao chép mã'}
            </button>
          </div>

          {/* Join Another Room */}
          <div className="space-y-2">
            <label className="text-xs text-slate-400">Hoặc nhập mã phòng từ bạn bè:</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="VD: ARENA-5421"
                value={inputRoomCode}
                onChange={(e) => setInputRoomCode(e.target.value.toUpperCase())}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 uppercase"
              />
              <button
                onClick={() => startBattle('1v1-ai')}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition"
              >
                Vào Phòng
              </button>
            </div>
          </div>

          {/* Start Battle with simulated friend bot */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              onClick={() => setMode('select')}
              className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition"
            >
              Quay lại
            </button>
            <button
              onClick={() => startBattle('1v1-ai')}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold hover:scale-105 transition shadow-lg shadow-indigo-600/30"
            >
              Sẵn Sàng Chiến Đấu!
            </button>
          </div>
        </div>
      )}

      {/* ================= ACTIVE BATTLE ENGINE (1v1 / Team) ================= */}
      {(mode === '1v1-ai' || mode === 'team') && currentQ && (
        <div className="max-w-3xl mx-auto bg-slate-900 border border-indigo-700/60 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden space-y-6">
          {/* Header Scoreboard */}
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-800 items-center">
            {/* Player Side */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/20">
                {profile.avatar}
              </div>
              <div>
                <div className="text-xs font-bold text-indigo-300">{profile.name} (Bạn)</div>
                <div className="text-2xl font-black text-white">
                  {mode === 'team' ? userScore + partnerScore : userScore} <span className="text-xs font-normal text-slate-400">điểm</span>
                </div>
                {mode === 'team' && (
                  <div className="text-[10px] text-slate-400">Bạn: {userScore} + Đồng đội: {partnerScore}</div>
                )}
              </div>
            </div>

            {/* Rival Side */}
            <div className="flex items-center gap-3 justify-end text-right">
              <div>
                <div className="text-xs font-bold text-pink-400">
                  {mode === 'team' ? 'Đội Sao Băng' : aiProfile.name}
                </div>
                <div className="text-2xl font-black text-white">
                  {mode === 'team' ? opponentScore + opponent2Score : opponentScore} <span className="text-xs font-normal text-slate-400">điểm</span>
                </div>
                {mode === 'team' && (
                  <div className="text-[10px] text-slate-400">Rival 1: {opponentScore} + Rival 2: {opponent2Score}</div>
                )}
              </div>
              <div className="w-12 h-12 rounded-2xl bg-pink-600 flex items-center justify-center text-2xl shadow-lg shadow-pink-500/20">
                {aiProfile.avatar}
              </div>
            </div>
          </div>

          {/* Match Progress & Round Timer */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold text-indigo-400">
              Vòng {qIndex + 1} / {matchQuestions.length}
            </span>
            <span className="flex items-center gap-1 font-bold text-amber-400 bg-amber-950/40 px-3 py-1 rounded-full border border-amber-600/40">
              <Clock className="w-3.5 h-3.5" />
              {roundTimer}s
            </span>
          </div>

          {/* Question Text */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 text-center">
            <p className="text-base sm:text-lg font-bold text-white">
              {currentQ.question}
            </p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((opt, idx) => {
              let style = 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700';

              if (roundOver) {
                if (idx === currentQ.answerIndex) {
                  style = 'bg-emerald-950 border-emerald-500 text-emerald-200 font-bold';
                } else if (idx === userAnswered) {
                  style = 'bg-rose-950 border-rose-500 text-rose-200';
                } else {
                  style = 'bg-slate-950 border-slate-800 text-slate-600 opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={roundOver || userAnswered !== null}
                  onClick={() => handleUserAnswer(idx)}
                  className={`p-4 rounded-xl border text-left text-xs sm:text-sm font-semibold transition ${style} ${
                    userAnswered === null && !roundOver ? 'cursor-pointer hover:border-indigo-400' : 'cursor-default'
                  }`}
                >
                  <span className="font-bold text-indigo-400 mr-2">{String.fromCharCode(65 + idx)}.</span>
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Round Feedback / Status */}
          {roundOver && !matchOver && (
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between animate-in fade-in">
              <div className="text-xs">
                {userAnswered === currentQ.answerIndex ? (
                  <span className="text-emerald-400 font-bold">✓ Bạn trả lời đúng!</span>
                ) : (
                  <span className="text-rose-400 font-bold">✗ Bạn trả lời sai!</span>
                )}
                <span className="text-slate-400 ml-2">
                  • Đối thủ: {opponentAnswered ? 'Đã trả lời đúng' : 'Đã trả lời sai hoặc quá giờ'}
                </span>
              </div>
              <button
                onClick={handleNextRound}
                className="py-1.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1 transition"
              >
                Vòng Kế Tiếp <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* ================= FINAL RESULT MODAL ================= */}
          {matchOver && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
              <div className="w-full max-w-md bg-slate-900 border border-indigo-700 rounded-3xl p-6 text-center space-y-6">
                <div className="text-6xl">
                  {(mode === 'team' ? userScore + partnerScore > opponentScore + opponent2Score : userScore > opponentScore)
                    ? '🏆'
                    : '🛡️'}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">
                    {(mode === 'team' ? userScore + partnerScore > opponentScore + opponent2Score : userScore > opponentScore)
                      ? 'CHIẾN THẮNG VANG DỘI!'
                      : 'TRẬN ĐẤU KẾT THÚC!'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    Điểm số cuối cùng: <strong>{userScore}</strong> vs <strong>{opponentScore}</strong>
                  </p>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-1">
                  <div className="text-emerald-400 font-bold">
                    {(mode === 'team' ? userScore + partnerScore > opponentScore + opponent2Score : userScore > opponentScore)
                      ? '+120 XP • +50 Xu Vũ Trụ 🪙'
                      : '+30 XP • +10 Xu 🪙'}
                  </div>
                  <div className="text-slate-400">
                    Cập nhật vào hồ sơ Đấu Trường cá nhân
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => startBattle(mode)}
                    className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-200 text-xs sm:text-sm font-bold hover:bg-slate-700 transition"
                  >
                    Tái Đấu
                  </button>
                  <button
                    onClick={() => setMode('select')}
                    className="flex-1 py-3 rounded-xl bg-indigo-600 text-white text-xs sm:text-sm font-bold hover:bg-indigo-500 transition"
                  >
                    Về Sảnh Đấu
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
