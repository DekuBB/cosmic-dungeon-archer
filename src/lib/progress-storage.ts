import type { GameProgress } from '@/types/progress';
import { INITIAL_PROGRESS } from '@/types/progress';

const STORAGE_KEY = 'cosmic_dungeon_archer_progress';

// Check if localStorage is available
let storageAvailable = true;
try {
  if (typeof window !== 'undefined') {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
  }
} catch (e) {
  console.warn('localStorage not available, using in-memory storage');
  storageAvailable = false;
}

// In-memory fallback
let memoryStorage: GameProgress | null = null;

export const saveProgress = (progress: GameProgress): void => {
  if (!storageAvailable || typeof window === 'undefined') {
    memoryStorage = progress;
    return;
  }
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error: unknown) {
    console.error('Failed to save progress:', error);
    memoryStorage = progress; // Fallback to memory
  }
};

export const loadProgress = (): GameProgress => {
  if (typeof window === 'undefined') {
    return { ...INITIAL_PROGRESS };
  }
  
  if (!storageAvailable && memoryStorage) {
    return memoryStorage;
  }
  
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as GameProgress;
      // Ensure all 6 dungeons exist
      return {
        ...parsed,
        dungeons: {
          1: parsed.dungeons[1] || INITIAL_PROGRESS.dungeons[1],
          2: parsed.dungeons[2] || INITIAL_PROGRESS.dungeons[2],
          3: parsed.dungeons[3] || INITIAL_PROGRESS.dungeons[3],
          4: parsed.dungeons[4] || INITIAL_PROGRESS.dungeons[4],
          5: parsed.dungeons[5] || INITIAL_PROGRESS.dungeons[5],
          6: parsed.dungeons[6] || INITIAL_PROGRESS.dungeons[6],
        },
      };
    }
  } catch (error: unknown) {
    console.error('Failed to load progress:', error);
  }
  
  return memoryStorage || { ...INITIAL_PROGRESS };
};

export const resetProgress = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    if (storageAvailable) {
      localStorage.removeItem(STORAGE_KEY);
    }
    memoryStorage = null;
  } catch (error: unknown) {
    console.error('Failed to reset progress:', error);
  }
};

export const updateDungeonProgress = (
  dungeonId: number,
  stage: number,
  score: number,
  time: number
): GameProgress => {
  const progress = loadProgress();
  
  if (!progress.dungeons[dungeonId]) {
    return progress;
  }
  
  // Update dungeon stats
  progress.dungeons[dungeonId].completedStages = Math.max(
    progress.dungeons[dungeonId].completedStages,
    stage
  );
  progress.dungeons[dungeonId].stars = Math.max(
    progress.dungeons[dungeonId].stars,
    stage
  );
  progress.dungeons[dungeonId].bestScore = Math.max(
    progress.dungeons[dungeonId].bestScore,
    score
  );
  
  if (progress.dungeons[dungeonId].bestTime === 0) {
    progress.dungeons[dungeonId].bestTime = time;
  } else {
    progress.dungeons[dungeonId].bestTime = Math.min(
      progress.dungeons[dungeonId].bestTime,
      time
    );
  }
  
  // Unlock next dungeon if completed stage 5 (up to dungeon 6)
  if (stage >= 5 && dungeonId < 6) {
    progress.dungeons[dungeonId + 1].unlocked = true;
  }
  
  // Update global stats
  progress.highestStage = Math.max(progress.highestStage, stage);
  progress.highestDungeon = Math.max(progress.highestDungeon, dungeonId);
  
  saveProgress(progress);
  return progress;
};
