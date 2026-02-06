import type { EnemyConfig, PlayerStats } from '@/types/game';

export const INITIAL_PLAYER_STATS: PlayerStats = {
  health: 100,
  maxHealth: 100,
  baseMoveSpeed: 200,
  attackSpeed: 1.5,
  damage: 10,
  pickupRadius: 80,
  critRate: 0.05,
};

export const GAME_CONFIG = {
  // Display
  width: 720,
  height: 1280,
  backgroundColor: '#000000',

  // Gameplay
  invulnerabilityDuration: 1000,
  joystickDeadzone: 0.1,
  playerHitboxRatio: 0.6,
  
  // Progression
  baseXPRequired: 100,
  xpGrowthRate: 1.2,
  tokenDropRate: 0.15,
  
  // Difficulty
  baseDifficulty: 1,
  difficultyGrowthPerSecond: 1,
  spawnInterval: 2000,
  
  // Projectiles
  projectileSpeed: 600,
  projectileSize: 6,
  
  // Visual
  playerColor: 0x00F0FF,
  enemyColors: {
    chaser: 0xFF00FF,
    turret: 0xFF0080,
    lobber: 0xFF00CC,
  },
  projectileColor: 0xFFFFFF,
  xpGemColor: 0x00FF00,
  tokenOrbColor: 0xFFD700,
};

export const ENEMY_CONFIGS: Record<string, EnemyConfig> = {
  bat: {
    type: 'bat',
    health: 20,
    damage: 8,
    speed: 80,
    cost: 1,
    color: 0x8B00FF,
    size: 18,
    aiPattern: 'zigzag',
  },
  goblin: {
    type: 'goblin',
    health: 35,
    damage: 12,
    speed: 56,
    cost: 2,
    color: 0x00FF80,
    size: 22,
    aiPattern: 'shoot',
  },
  orc: {
    type: 'orc',
    health: 80,
    damage: 20,
    speed: 35,
    cost: 3,
    color: 0xFF4500,
    size: 28,
    aiPattern: 'charge',
  },
  dragon: {
    type: 'dragon',
    health: 300,
    damage: 30,
    speed: 18,
    cost: 10,
    color: 0xFF0000,
    size: 45,
    aiPattern: 'boss',
  },
};

export const TIMINGS = {
  invulnerabilityWindow: 1000,
  coyoteTime: 100,
  draftPauseTransition: 200,
  turretChargeTime: 2000,
  turretTelegraphTime: 500,
  lobberCooldown: 3000,
};

export const COLORS = {
  neonCyan: 0x00F0FF,
  neonMagenta: 0xFF00FF,
  neonYellow: 0xFFFF00,
  neonWhite: 0xFFFFFF,
  voidBlack: 0x000000,
  gridDark: 0x1A1A1A,
};
