export type Topic = 'vietnam' | 'geography' | 'history' | 'astronomy' | 'science' | 'culture';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'boss';
export type MapType = 'vietnam' | 'earth' | 'space';

export interface Question {
  id: string;
  topic: Topic;
  difficulty: Difficulty;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  hint: string;
  triviaFact?: string;
  region?: string;
}

export interface MapStage {
  id: string;
  mapType: MapType;
  name: string;
  subtitle: string;
  icon: string;
  description: string;
  lore: string;
  x: number; // percentage coordinates 0-100 on map
  y: number;
  requiredLevel: number;
  requiredStars: number;
  questionsCount: number;
  isBoss?: boolean;
}

export interface StageProgress {
  unlocked: boolean;
  completed: boolean;
  stars: number; // 0 to 3
  highScore: number;
  attempts: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'exploration' | 'knowledge' | 'battle' | 'mastery';
  targetValue: number;
  rewardXp: number;
  rewardCoins: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly';
  current: number;
  target: number;
  rewardXp: number;
  rewardCoins: number;
  claimed: boolean;
}

export interface MistakeEntry {
  questionId: string;
  topic: Topic;
  questionText: string;
  userAnswerText: string;
  correctAnswerText: string;
  explanation: string;
  timestamp: number;
  reviewCount: number;
  mastered: boolean;
}

export interface UserStats {
  totalQuizzes: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  highestWinStreak: number;
  currentWinStreak: number;
  pvpPlayed: number;
  pvpWins: number;
  topicStats: Record<Topic, { correct: number; total: number }>;
}

export interface UserProfile {
  id: string;
  name: string;
  title: string;
  avatar: string;
  level: number;
  xp: number;
  coins: number;
  stars: number;
  streakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  stagesProgress: Record<string, StageProgress>;
  unlockedAchievements: string[];
  achievementProgress: Record<string, number>;
  quests: Quest[];
  mistakes: MistakeEntry[];
  stats: UserStats;
}

export interface Settings {
  soundFx: boolean;
  bgm: boolean;
  haptic: boolean;
  fontSize: 'sm' | 'base' | 'lg';
  highContrast: boolean;
  speechAudio: boolean;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  title: string;
  avatar: string;
  level: number;
  stars: number;
  xp: number;
  winRate: number;
  isUser?: boolean;
}
