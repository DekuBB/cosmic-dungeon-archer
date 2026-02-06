export interface DungeonProgress {
  completedStages: number; // 0-5
  stars: number; // 0-5
  bestTime: number; // seconds
  bestScore: number;
  unlocked: boolean;
}

export interface GameProgress {
  currentDungeon: number;
  dungeons: {
    [dungeonId: number]: DungeonProgress;
  };
  totalTokens: number;
  totalKills: number;
  highestStage: number;
  highestDungeon: number;
}

export interface LeaderboardEntry {
  address: string;
  dungeon: number;
  stage: number;
  tokens: number;
  score: number;
  timestamp: number;
}

export const INITIAL_PROGRESS: GameProgress = {
  currentDungeon: 1,
  dungeons: {
    1: { completedStages: 0, stars: 0, bestTime: 0, bestScore: 0, unlocked: true },
    2: { completedStages: 0, stars: 0, bestTime: 0, bestScore: 0, unlocked: false },
    3: { completedStages: 0, stars: 0, bestTime: 0, bestScore: 0, unlocked: false },
    4: { completedStages: 0, stars: 0, bestTime: 0, bestScore: 0, unlocked: false },
    5: { completedStages: 0, stars: 0, bestTime: 0, bestScore: 0, unlocked: false },
    6: { completedStages: 0, stars: 0, bestTime: 0, bestScore: 0, unlocked: false },
  },
  totalTokens: 0,
  totalKills: 0,
  highestStage: 0,
  highestDungeon: 1,
};

export const DUNGEON_THEMES = {
  1: {
    name: 'Crystal Caves',
    description: 'Mystical caves filled with glowing crystals',
    background: 'w1',
    color: '#06B6D4', // cyan
  },
  2: {
    name: 'Lava Fortress',
    description: 'Ancient fortress surrounded by molten lava',
    background: 'w2',
    color: '#F59E0B', // orange
  },
  3: {
    name: 'Cosmic Isles',
    description: 'Floating islands in the cosmic void',
    background: 'w3',
    color: '#8B5CF6', // purple
  },
  4: {
    name: 'Shadow Realm',
    description: 'Dark dimension where nightmares take form',
    background: 'w1',
    color: '#7C3AED', // violet
  },
  5: {
    name: 'Neon City',
    description: 'Cyberpunk metropolis in eternal twilight',
    background: 'w2',
    color: '#EC4899', // pink
  },
  6: {
    name: 'Void Nexus',
    description: 'The final frontier beyond reality itself',
    background: 'w3',
    color: '#EF4444', // red
  },
} as const;
