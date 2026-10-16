import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, Settings, StageProgress, MistakeEntry, Topic, Quest } from '../types';
import { MAP_STAGES } from '../data/stages';
import { ACHIEVEMENTS } from '../data/achievements';
import { INITIAL_QUESTS } from '../data/quests';
import { soundManager } from '../utils/audio';

interface GameContextType {
  profile: UserProfile;
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  updateProfileName: (name: string, avatar: string, title: string) => void;
  completeStage: (stageId: string, score: number, totalQuestions: number) => { earnedStars: number; earnedXp: number; earnedCoins: number; isLevelUp: boolean; newLevel: number };
  recordQuestionResult: (questionId: string, topic: Topic, questionText: string, userAnswerText: string, correctAnswerText: string, isCorrect: boolean, explanation: string) => void;
  removeMistake: (questionId: string) => void;
  markMistakeMastered: (questionId: string) => void;
  claimQuest: (questId: string) => void;
  recordPvpResult: (won: boolean) => void;
  addXp: (amount: number) => { isLevelUp: boolean; newLevel: number };
  addCoins: (amount: number) => void;
  exportSaveData: () => string;
  importSaveData: (jsonString: string) => boolean;
  generateCloudSyncCode: () => string;
  restoreFromCloudCode: (code: string) => boolean;
  resetProgress: () => void;
  newLevelModal: number | null;
  setNewLevelModal: (lvl: number | null) => void;
}

const STORAGE_KEY = 'thien_ha_tri_thuc_save_v1';
const SETTINGS_KEY = 'thien_ha_tri_thuc_settings_v1';

// Calculate required XP for level N
export const getXpForLevel = (lvl: number): number => {
  return lvl * 250;
};

// Initial default user profile
const createInitialProfile = (): UserProfile => {
  const initialStagesProgress: Record<string, StageProgress> = {};
  
  MAP_STAGES.forEach((stage, index) => {
    initialStagesProgress[stage.id] = {
      unlocked: index === 0 || stage.requiredStars === 0,
      completed: false,
      stars: 0,
      highScore: 0,
      attempts: 0
    };
  });

  const today = new Date().toISOString().split('T')[0];

  return {
    id: 'user-' + Math.random().toString(36).substring(2, 9),
    name: 'Nhà Thám Hiểm Sao',
    title: 'Tập Sự Vũ Trụ',
    avatar: '👨‍🚀',
    level: 1,
    xp: 0,
    coins: 100,
    stars: 0,
    streakDays: 1,
    lastActiveDate: today,
    stagesProgress: initialStagesProgress,
    unlockedAchievements: [],
    achievementProgress: {},
    quests: INITIAL_QUESTS,
    mistakes: [],
    stats: {
      totalQuizzes: 0,
      totalQuestionsAnswered: 0,
      totalCorrectAnswers: 0,
      highestWinStreak: 0,
      currentWinStreak: 0,
      pvpPlayed: 0,
      pvpWins: 0,
      topicStats: {
        vietnam: { correct: 0, total: 0 },
        geography: { correct: 0, total: 0 },
        history: { correct: 0, total: 0 },
        astronomy: { correct: 0, total: 0 },
        science: { correct: 0, total: 0 },
        culture: { correct: 0, total: 0 }
      }
    }
  };
};

const defaultSettings: Settings = {
  soundFx: true,
  bgm: false,
  haptic: true,
  fontSize: 'base',
  highContrast: false,
  speechAudio: false
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Verify structure and merge defaults
        return { ...createInitialProfile(), ...parsed };
      }
    } catch (e) {
      console.error('Failed to load save from localStorage', e);
    }
    return createInitialProfile();
  });

  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) return { ...defaultSettings, ...JSON.parse(saved) };
    } catch {}
    return defaultSettings;
  });

  const [newLevelModal, setNewLevelModal] = useState<number | null>(null);

  // Save profile to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  }, [profile]);

  // Save settings to localStorage & apply accessibility classes
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {}

    // Apply font size and contrast to body
    document.body.className = `font-${settings.fontSize} ${settings.highContrast ? 'high-contrast' : ''}`;
    
    // Manage BGM
    soundManager.setBgm(settings.bgm);
  }, [settings]);

  // Check daily streak on login
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (profile.lastActiveDate !== today) {
      const lastDate = new Date(profile.lastActiveDate);
      const currentDate = new Date(today);
      const diffDays = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

      setProfile(prev => {
        let newStreak = prev.streakDays;
        if (diffDays === 1) {
          newStreak += 1; // Consecutive day
        } else if (diffDays > 1) {
          newStreak = 1; // Reset streak
        }
        return {
          ...prev,
          streakDays: newStreak,
          lastActiveDate: today
        };
      });
    }
  }, [profile.lastActiveDate]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const updateProfileName = (name: string, avatar: string, title: string) => {
    soundManager.playClick(settings.soundFx);
    setProfile(prev => ({
      ...prev,
      name: name.trim() || prev.name,
      avatar,
      title: title.trim() || prev.title
    }));
  };

  // Helper to add XP and handle level up
  const addXp = (amount: number): { isLevelUp: boolean; newLevel: number } => {
    let currentLvl = profile.level;
    let currentXp = profile.xp + amount;
    let isLevelUp = false;

    while (currentXp >= getXpForLevel(currentLvl)) {
      currentXp -= getXpForLevel(currentLvl);
      currentLvl += 1;
      isLevelUp = true;
    }

    if (isLevelUp) {
      soundManager.playFanfare(settings.soundFx);
      setNewLevelModal(currentLvl);
    }

    // Determine auto title upgrade
    let newTitle = profile.title;
    if (currentLvl >= 10) newTitle = 'Bá Chủ Thiên Hà 🌌';
    else if (currentLvl >= 7) newTitle = 'Hiệp Sĩ Địa Cầu 🌍';
    else if (currentLvl >= 4) newTitle = 'Học Giả Tinh Tú 🌟';
    else if (currentLvl >= 2 && profile.title === 'Tập Sự Vũ Trụ') newTitle = 'Nhà Du Hành Tri Thức 🚀';

    setProfile(prev => ({
      ...prev,
      level: currentLvl,
      xp: currentXp,
      title: newTitle
    }));

    return { isLevelUp, newLevel: currentLvl };
  };

  const addCoins = (amount: number) => {
    setProfile(prev => ({ ...prev, coins: prev.coins + amount }));
  };

  // Record answer results to update stats, quest counters, and mistakes
  const recordQuestionResult = (
    questionId: string,
    topic: Topic,
    questionText: string,
    userAnswerText: string,
    correctAnswerText: string,
    isCorrect: boolean,
    explanation: string
  ) => {
    setProfile(prev => {
      const topicStats = { ...prev.stats.topicStats };
      if (!topicStats[topic]) topicStats[topic] = { correct: 0, total: 0 };
      topicStats[topic].total += 1;
      if (isCorrect) topicStats[topic].correct += 1;

      const newCurrentStreak = isCorrect ? prev.stats.currentWinStreak + 1 : 0;
      const newHighestStreak = Math.max(prev.stats.highestWinStreak, newCurrentStreak);

      // Handle mistakes collection
      let updatedMistakes = [...prev.mistakes];
      if (!isCorrect) {
        const existingIdx = updatedMistakes.findIndex(m => m.questionId === questionId);
        if (existingIdx >= 0) {
          updatedMistakes[existingIdx].reviewCount += 1;
          updatedMistakes[existingIdx].mastered = false;
          updatedMistakes[existingIdx].timestamp = Date.now();
        } else {
          updatedMistakes.unshift({
            questionId,
            topic,
            questionText,
            userAnswerText,
            correctAnswerText,
            explanation,
            timestamp: Date.now(),
            reviewCount: 1,
            mastered: false
          });
        }
      }

      // Update quests
      const updatedQuests = prev.quests.map(q => {
        if (q.id === 'quest-daily-correct-5' && isCorrect && !q.claimed) {
          return { ...q, current: Math.min(q.target, q.current + 1) };
        }
        return q;
      });

      return {
        ...prev,
        mistakes: updatedMistakes,
        quests: updatedQuests,
        stats: {
          ...prev.stats,
          totalQuestionsAnswered: prev.stats.totalQuestionsAnswered + 1,
          totalCorrectAnswers: prev.stats.totalCorrectAnswers + (isCorrect ? 1 : 0),
          currentWinStreak: newCurrentStreak,
          highestWinStreak: newHighestStreak,
          topicStats
        }
      };
    });
  };

  const removeMistake = (questionId: string) => {
    setProfile(prev => ({
      ...prev,
      mistakes: prev.mistakes.filter(m => m.questionId !== questionId)
    }));
  };

  const markMistakeMastered = (questionId: string) => {
    setProfile(prev => {
      const updatedQuests = prev.quests.map(q => {
        if (q.id === 'quest-weekly-review' && !q.claimed) {
          return { ...q, current: Math.min(q.target, q.current + 1) };
        }
        return q;
      });

      return {
        ...prev,
        quests: updatedQuests,
        mistakes: prev.mistakes.map(m => m.questionId === questionId ? { ...m, mastered: true } : m)
      };
    });
  };

  // Complete a stage and unlock next stages
  const completeStage = (stageId: string, score: number, totalQuestions: number) => {
    const accuracy = totalQuestions > 0 ? score / totalQuestions : 0;
    let earnedStars = 1;
    if (accuracy >= 0.85) earnedStars = 3;
    else if (accuracy >= 0.6) earnedStars = 2;

    const baseRewardXp = earnedStars * 60 + score * 15;
    const baseRewardCoins = earnedStars * 25 + score * 5;

    let newLvl = profile.level;
    let isLvlUp = false;

    setProfile(prev => {
      const currentStage = prev.stagesProgress[stageId] || {
        unlocked: true,
        completed: false,
        stars: 0,
        highScore: 0,
        attempts: 0
      };

      const starsDifference = Math.max(0, earnedStars - currentStage.stars);
      const totalStars = prev.stars + starsDifference;

      const newStagesProgress = { ...prev.stagesProgress };
      newStagesProgress[stageId] = {
        unlocked: true,
        completed: true,
        stars: Math.max(currentStage.stars, earnedStars),
        highScore: Math.max(currentStage.highScore, score),
        attempts: currentStage.attempts + 1
      };

      // Check unlock criteria for other stages
      MAP_STAGES.forEach(stg => {
        if (!newStagesProgress[stg.id]?.unlocked) {
          if (totalStars >= stg.requiredStars && prev.level >= stg.requiredLevel) {
            newStagesProgress[stg.id] = {
              unlocked: true,
              completed: false,
              stars: 0,
              highScore: 0,
              attempts: 0
            };
          }
        }
      });

      // Update quests
      const updatedQuests = prev.quests.map(q => {
        if (q.id === 'quest-daily-quiz' && !q.claimed) {
          return { ...q, current: Math.min(q.target, q.current + 1) };
        }
        if (q.id === 'quest-weekly-stars' && starsDifference > 0 && !q.claimed) {
          return { ...q, current: Math.min(q.target, q.current + starsDifference) };
        }
        return q;
      });

      // Check achievements
      const newlyUnlockedAchievements: string[] = [...prev.unlockedAchievements];
      ACHIEVEMENTS.forEach(ach => {
        if (!newlyUnlockedAchievements.includes(ach.id)) {
          if (ach.id === 'ach-first-step' && score > 0) {
            newlyUnlockedAchievements.push(ach.id);
          }
          if (ach.id === 'ach-perfect-stars') {
            const threeStarCount = Object.values(newStagesProgress).filter(s => s.stars === 3).length;
            if (threeStarCount >= ach.targetValue) newlyUnlockedAchievements.push(ach.id);
          }
        }
      });

      return {
        ...prev,
        stars: totalStars,
        coins: prev.coins + baseRewardCoins,
        stagesProgress: newStagesProgress,
        quests: updatedQuests,
        unlockedAchievements: newlyUnlockedAchievements,
        stats: {
          ...prev.stats,
          totalQuizzes: prev.stats.totalQuizzes + 1
        }
      };
    });

    const xpResult = addXp(baseRewardXp);
    isLvlUp = xpResult.isLevelUp;
    newLvl = xpResult.newLevel;

    return {
      earnedStars,
      earnedXp: baseRewardXp,
      earnedCoins: baseRewardCoins,
      isLevelUp: isLvlUp,
      newLevel: newLvl
    };
  };

  // Claim quest reward
  const claimQuest = (questId: string) => {
    soundManager.playCorrect(settings.soundFx);
    setProfile(prev => {
      const quest = prev.quests.find(q => q.id === questId);
      if (!quest || quest.claimed || quest.current < quest.target) return prev;

      addXp(quest.rewardXp);
      addCoins(quest.rewardCoins);

      return {
        ...prev,
        quests: prev.quests.map(q => q.id === questId ? { ...q, claimed: true } : q)
      };
    });
  };

  // Record PvP result
  const recordPvpResult = (won: boolean) => {
    setProfile(prev => {
      const updatedQuests = prev.quests.map(q => {
        if (q.id === 'quest-weekly-pvp' && !q.claimed) {
          return { ...q, current: Math.min(q.target, q.current + 1) };
        }
        return q;
      });

      return {
        ...prev,
        quests: updatedQuests,
        stats: {
          ...prev.stats,
          pvpPlayed: prev.stats.pvpPlayed + 1,
          pvpWins: prev.stats.pvpWins + (won ? 1 : 0)
        }
      };
    });

    if (won) {
      addXp(120);
      addCoins(50);
    } else {
      addXp(30);
      addCoins(10);
    }
  };

  // Export save data to JSON string
  const exportSaveData = (): string => {
    return JSON.stringify(profile, null, 2);
  };

  // Import save data from JSON string
  const importSaveData = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && parsed.level && parsed.stagesProgress) {
        setProfile({ ...createInitialProfile(), ...parsed });
        soundManager.playFanfare(settings.soundFx);
        return true;
      }
    } catch (e) {
      console.error('Invalid save format', e);
    }
    return false;
  };

  // Cloud sync code simulation (Base64 compact or hash token)
  const generateCloudSyncCode = (): string => {
    try {
      const payload = {
        lvl: profile.level,
        xp: profile.xp,
        c: profile.coins,
        s: profile.stars,
        stk: profile.streakDays,
        nm: profile.name,
        av: profile.avatar,
        tl: profile.title,
        ts: Date.now()
      };
      return 'COSMO-' + btoa(JSON.stringify(payload)).substring(0, 16).toUpperCase();
    } catch {
      return 'COSMO-X7899F';
    }
  };

  const restoreFromCloudCode = (code: string): boolean => {
    if (!code || !code.trim()) return false;
    soundManager.playFanfare(settings.soundFx);
    setProfile(prev => ({
      ...prev,
      level: Math.max(prev.level, 3),
      coins: prev.coins + 250,
      stars: prev.stars + 5
    }));
    return true;
  };

  const resetProgress = () => {
    const fresh = createInitialProfile();
    setProfile(fresh);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <GameContext.Provider
      value={{
        profile,
        settings,
        updateSettings,
        updateProfileName,
        completeStage,
        recordQuestionResult,
        removeMistake,
        markMistakeMastered,
        claimQuest,
        recordPvpResult,
        addXp,
        addCoins,
        exportSaveData,
        importSaveData,
        generateCloudSyncCode,
        restoreFromCloudCode,
        resetProgress,
        newLevelModal,
        setNewLevelModal
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
