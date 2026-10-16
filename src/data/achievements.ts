import { Achievement } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-first-step',
    title: 'Bước Chân Đầu Tiên',
    description: 'Hoàn thành ải thám hiểm đầu tiên',
    icon: '🚀',
    category: 'exploration',
    targetValue: 1,
    rewardXp: 100,
    rewardCoins: 50
  },
  {
    id: 'ach-vn-master',
    title: 'Hồn Thiêng Đất Việt',
    description: 'Hoàn thành tất cả các ải trên Bản đồ Việt Nam',
    icon: '🇻🇳',
    category: 'exploration',
    targetValue: 6,
    rewardXp: 500,
    rewardCoins: 200
  },
  {
    id: 'ach-earth-conqueror',
    title: 'Nhà Địa Cầu Học',
    description: 'Hoàn thành tất cả các ải trên Bản đồ Trái Đất',
    icon: '🌍',
    category: 'exploration',
    targetValue: 5,
    rewardXp: 800,
    rewardCoins: 350
  },
  {
    id: 'ach-cosmic-ruler',
    title: 'Bá Chủ Thiên Hà',
    description: 'Vượt qua Ải Boss Hố Đen & Thiên Hà Tiên Nữ',
    icon: '🌌',
    category: 'exploration',
    targetValue: 1,
    rewardXp: 1500,
    rewardCoins: 600
  },
  {
    id: 'ach-perfect-stars',
    title: 'Đêm Đầy Sao',
    description: 'Đạt tối đa 3 sao tại 5 ải bất kỳ',
    icon: '⭐',
    category: 'knowledge',
    targetValue: 5,
    rewardXp: 300,
    rewardCoins: 150
  },
  {
    id: 'ach-streak-10',
    title: 'Tư Duy Thần Tốc',
    description: 'Đạt chuỗi trả lời đúng liên tiếp 10 câu',
    icon: '🔥',
    category: 'mastery',
    targetValue: 10,
    rewardXp: 400,
    rewardCoins: 180
  },
  {
    id: 'ach-mistake-master',
    title: 'Biết Sai Là Sửa',
    description: 'Ôn tập và làm đúng lại 5 câu từng trả lời sai trong Sổ tay',
    icon: '📖',
    category: 'knowledge',
    targetValue: 5,
    rewardXp: 250,
    rewardCoins: 120
  },
  {
    id: 'ach-pvp-champion',
    title: 'Vua Đấu Trường',
    description: 'Chiến thắng 5 trận đấu đối kháng (1v1)',
    icon: '⚔️',
    category: 'battle',
    targetValue: 5,
    rewardXp: 600,
    rewardCoins: 250
  },
  {
    id: 'ach-astronomy-buff',
    title: 'Nhà Thiên Văn Trẻ',
    description: 'Trả lời đúng 15 câu hỏi thuộc chủ đề Thiên văn học',
    icon: '🔭',
    category: 'knowledge',
    targetValue: 15,
    rewardXp: 350,
    rewardCoins: 160
  },
  {
    id: 'ach-level-10',
    title: 'Bậc Thầy Tri Thức',
    description: 'Đạt cấp độ Level 10 trong trò chơi',
    icon: '👑',
    category: 'mastery',
    targetValue: 10,
    rewardXp: 1000,
    rewardCoins: 500
  }
];
