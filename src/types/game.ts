export interface PlayerStats {
  health: number;
  maxHealth: number;
  baseMoveSpeed: number;
  attackSpeed: number;
  damage: number;
  pickupRadius: number;
  critRate: number;
}

export interface GameState {
  // Player state
  playerStats: PlayerStats;
  isMoving: boolean;
  isAlive: boolean;
  
  // Progression
  currentDungeon: number;
  currentStage: number;
  stageKills: number;
  currentWave: number;
  xp: number;
  xpRequired: number;
  level: number;
  score: number;
  killCount: number;
  
  // Tokens
  pendingTokens: number;
  totalTokensEarned: number;
  
  // UI
  isPaused: boolean;
  isDrafting: boolean;
  draftChoices: Perk[];
  
  // Game actions
  takeDamage: (amount: number) => void;
  heal: (amount: number) => void;
  addXP: (amount: number) => void;
  addTokens: (amount: number) => void;
  incrementKills: () => void;
  incrementStage: () => void;
  setDungeon: (dungeonId: number) => void;
  startDraft: (perks: Perk[]) => void;
  selectPerk: (perk: Perk) => void;
  nextWave: () => void;
  resetGame: () => void;
  setMoving: (moving: boolean) => void;
}

export interface Web3State {
  address: string | undefined;
  isConnected: boolean;
  chainId: number | undefined;
  isClaimingTokens: boolean;
  
  setAddress: (address: string | undefined) => void;
  setConnected: (connected: boolean) => void;
  setChainId: (chainId: number | undefined) => void;
  claimTokens: () => Promise<void>;
}

export type PerkRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type PerkType = 'statBoost' | 'behaviorMod' | 'weaponAugment';

export interface Perk {
  id: string;
  name: string;
  description: string;
  rarity: PerkRarity;
  type: PerkType;
  tags: string[];
  apply: (stats: PlayerStats) => PlayerStats;
  icon?: string;
}

export interface EnemyConfig {
  type: 'bat' | 'goblin' | 'orc' | 'dragon';
  health: number;
  damage: number;
  speed: number;
  cost: number;
  color: number;
  size: number;
  aiPattern: 'zigzag' | 'shoot' | 'charge' | 'boss';
}

export interface ProjectileConfig {
  damage: number;
  speed: number;
  color: number;
  size: number;
}
