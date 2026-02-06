import { create } from 'zustand';
import type { GameState, PlayerStats, Perk } from '@/types/game';
import { INITIAL_PLAYER_STATS, GAME_CONFIG } from '@/lib/game-config';

const calculateXPRequired = (level: number): number => {
  return Math.floor(GAME_CONFIG.baseXPRequired * Math.pow(GAME_CONFIG.xpGrowthRate, level));
};

export const useGameStore = create<GameState>((set, get) => ({
  // Player state
  playerStats: { ...INITIAL_PLAYER_STATS },
  isMoving: false,
  isAlive: true,

  // Progression
  currentDungeon: 1,
  currentStage: 1,
  stageKills: 0,
  currentWave: 1,
  xp: 0,
  xpRequired: GAME_CONFIG.baseXPRequired,
  level: 1,
  score: 0,
  killCount: 0,

  // Tokens
  pendingTokens: 0,
  totalTokensEarned: 0,

  // UI
  isPaused: false,
  isDrafting: false,
  draftChoices: [],

  // Actions
  takeDamage: (amount: number): void => {
    const state: GameState = get();
    const newHealth: number = Math.max(0, state.playerStats.health - amount);
    
    set({
      playerStats: {
        ...state.playerStats,
        health: newHealth,
      },
      isAlive: newHealth > 0,
    });
  },

  heal: (amount: number): void => {
    const state: GameState = get();
    set({
      playerStats: {
        ...state.playerStats,
        health: Math.min(
          state.playerStats.health + amount,
          state.playerStats.maxHealth
        ),
      },
    });
  },

  addXP: (amount: number): void => {
    const state: GameState = get();
    const newXP: number = state.xp + amount;
    
    if (newXP >= state.xpRequired) {
      // Level up - will trigger draft in game scene
      set({
        xp: 0,
        level: state.level + 1,
        xpRequired: calculateXPRequired(state.level + 1),
      });
    } else {
      set({ xp: newXP });
    }
  },

  addTokens: (amount: number): void => {
    const state: GameState = get();
    set({
      pendingTokens: state.pendingTokens + amount,
      totalTokensEarned: state.totalTokensEarned + amount,
    });
  },

  incrementKills: (): void => {
    const state: GameState = get();
    const newKillCount: number = state.killCount + 1;
    const newStageKills: number = state.stageKills + 1;
    
    // Advance stage based on dungeon system
    // Stage 1-4: 10 kills each
    // Stage 5: Boss (1 kill)
    let newStage: number = state.currentStage;
    let resetStageKills: boolean = false;
    
    if (state.currentStage < 5 && newStageKills >= 10) {
      newStage = state.currentStage + 1;
      resetStageKills = true;
    }
    
    set({
      killCount: newKillCount,
      score: state.score + 100,
      currentStage: newStage,
      stageKills: resetStageKills ? 0 : newStageKills,
    });
  },

  incrementStage: (): void => {
    const state: GameState = get();
    set({
      currentStage: state.currentStage + 1,
    });
  },

  startDraft: (perks: Perk[]): void => {
    set({
      isDrafting: true,
      isPaused: true,
      draftChoices: perks,
    });
  },

  selectPerk: (perk: Perk): void => {
    const state: GameState = get();
    const newStats: PlayerStats = perk.apply(state.playerStats);
    
    set({
      playerStats: newStats,
      isDrafting: false,
      isPaused: false,
      draftChoices: [],
    });
  },

  nextWave: (): void => {
    const state: GameState = get();
    set({
      currentWave: state.currentWave + 1,
    });
  },

  setDungeon: (dungeonId: number): void => {
    set({ currentDungeon: dungeonId });
  },

  resetGame: (): void => {
    const state: GameState = get();
    set({
      playerStats: { ...INITIAL_PLAYER_STATS },
      isMoving: false,
      isAlive: true,
      currentStage: 1,
      stageKills: 0,
      currentWave: 1,
      xp: 0,
      xpRequired: GAME_CONFIG.baseXPRequired,
      level: 1,
      score: 0,
      killCount: 0,
      pendingTokens: 0,
      isPaused: false,
      isDrafting: false,
      draftChoices: [],
      // Keep dungeon selection
      currentDungeon: state.currentDungeon,
    });
  },

  setMoving: (moving: boolean): void => {
    set({ isMoving: moving });
  },
}));
