/**
 * Dungeon Configuration - 6 Unique Dungeons with 5 Stages Each
 */

export interface DungeonTheme {
  id: number;
  name: string;
  description: string;
  stages: number;
  backgroundColor: string;
  accentColor: string;
  enemyModifier: number; // Difficulty multiplier
  rewards: {
    tokenMultiplier: number;
    xpMultiplier: number;
  };
}

export const DUNGEON_THEMES: DungeonTheme[] = [
  {
    id: 1,
    name: 'Void Nexus',
    description: 'The dark abyss where reality fractures',
    stages: 5,
    backgroundColor: '#0a0015',
    accentColor: '#8B00FF',
    enemyModifier: 1.0,
    rewards: {
      tokenMultiplier: 1.0,
      xpMultiplier: 1.0,
    },
  },
  {
    id: 2,
    name: 'Crimson Wasteland',
    description: 'A desolate realm of blood and fire',
    stages: 5,
    backgroundColor: '#1a0000',
    accentColor: '#FF0000',
    enemyModifier: 1.2,
    rewards: {
      tokenMultiplier: 1.3,
      xpMultiplier: 1.2,
    },
  },
  {
    id: 3,
    name: 'Frozen Citadel',
    description: 'An icy fortress of eternal winter',
    stages: 5,
    backgroundColor: '#000a1a',
    accentColor: '#00F0FF',
    enemyModifier: 1.5,
    rewards: {
      tokenMultiplier: 1.6,
      xpMultiplier: 1.4,
    },
  },
  {
    id: 4,
    name: 'Toxic Swamp',
    description: 'A poisonous marsh of decay',
    stages: 5,
    backgroundColor: '#0a1a00',
    accentColor: '#00FF00',
    enemyModifier: 1.8,
    rewards: {
      tokenMultiplier: 2.0,
      xpMultiplier: 1.6,
    },
  },
  {
    id: 5,
    name: 'Lightning Temple',
    description: 'Ancient ruins crackling with energy',
    stages: 5,
    backgroundColor: '#1a1a00',
    accentColor: '#FFFF00',
    enemyModifier: 2.2,
    rewards: {
      tokenMultiplier: 2.5,
      xpMultiplier: 1.8,
    },
  },
  {
    id: 6,
    name: 'Shadow Realm',
    description: 'Where darkness itself comes alive',
    stages: 5,
    backgroundColor: '#000000',
    accentColor: '#4B0082',
    enemyModifier: 2.6,
    rewards: {
      tokenMultiplier: 3.0,
      xpMultiplier: 2.0,
    },
  },
];

export function getDungeonTheme(dungeonId: number): DungeonTheme {
  return DUNGEON_THEMES[dungeonId - 1] || DUNGEON_THEMES[0];
}

export function getTotalStages(): number {
  return DUNGEON_THEMES.reduce((sum: number, dungeon: DungeonTheme): number => sum + dungeon.stages, 0);
}

export function getGlobalStageNumber(dungeonId: number, stageNumber: number): number {
  let globalStage: number = 0;
  for (let i: number = 0; i < dungeonId - 1; i++) {
    globalStage += DUNGEON_THEMES[i].stages;
  }
  return globalStage + stageNumber;
}
