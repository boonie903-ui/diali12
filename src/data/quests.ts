import { Quest } from '../types';

export const INITIAL_QUESTS: Quest[] = [
  {
    id: 'quest-daily-login',
    title: 'Điểm Danh Nhật Trình',
    description: 'Đăng nhập vào game hôm nay',
    type: 'daily',
    current: 1,
    target: 1,
    rewardXp: 50,
    rewardCoins: 20,
    claimed: false
  },
  {
    id: 'quest-daily-quiz',
    title: 'Khởi Động Não Bộ',
    description: 'Hoàn thành 1 lượt chơi bất kỳ',
    type: 'daily',
    current: 0,
    target: 1,
    rewardXp: 80,
    rewardCoins: 40,
    claimed: false
  },
  {
    id: 'quest-daily-correct-5',
    title: 'Học Giả Chăm Chỉ',
    description: 'Trả lời đúng 5 câu hỏi trong ngày',
    type: 'daily',
    current: 0,
    target: 5,
    rewardXp: 120,
    rewardCoins: 60,
    claimed: false
  },
  {
    id: 'quest-weekly-pvp',
    title: 'Thử Thách Đấu Sĩ',
    description: 'Tham gia 3 trận đấu đối kháng (1v1 hoặc Đấu Đội)',
    type: 'weekly',
    current: 0,
    target: 3,
    rewardXp: 300,
    rewardCoins: 150,
    claimed: false
  },
  {
    id: 'quest-weekly-stars',
    title: 'Thợ Săn Tinh Tú',
    description: 'Thu thập thêm 6 ngôi sao trên các bản đồ',
    type: 'weekly',
    current: 0,
    target: 6,
    rewardXp: 450,
    rewardCoins: 200,
    claimed: false
  },
  {
    id: 'quest-weekly-review',
    title: 'Luyện Rèn Bất Bại',
    description: 'Làm lại 3 câu trong Sổ tay câu sai',
    type: 'weekly',
    current: 0,
    target: 3,
    rewardXp: 250,
    rewardCoins: 100,
    claimed: false
  }
];
