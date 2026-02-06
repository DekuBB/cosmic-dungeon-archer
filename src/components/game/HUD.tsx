'use client';

import { useGameStore } from '@/stores/game-store';
import { useState, useEffect } from 'react';
import { getYouTubeMusicManager } from '@/game/YouTubeMusicManager';

export function HUD(): JSX.Element {
  const {
    playerStats,
    level,
    xp,
    xpRequired,
    score,
    killCount,
    pendingTokens,
    currentDungeon,
    currentStage,
    stageKills,
    currentWave,
  } = useGameStore();

  const [volume, setVolume] = useState<number>(30);
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);

  const healthPercent: number = (playerStats.health / playerStats.maxHealth) * 100;
  const xpPercent: number = (xp / xpRequired) * 100;

  useEffect(() => {
    const musicManager = getYouTubeMusicManager();
    setVolume(musicManager.getVolume());
  }, []);

  const handleVolumeUp = (): void => {
    const musicManager = getYouTubeMusicManager();
    const newVolume = Math.min(100, volume + 10);
    setVolume(newVolume);
    musicManager.setVolume(newVolume);
  };

  const handleVolumeDown = (): void => {
    const musicManager = getYouTubeMusicManager();
    const newVolume = Math.max(0, volume - 10);
    setVolume(newVolume);
    musicManager.setVolume(newVolume);
  };

  const handleToggleMusic = (): void => {
    const musicManager = getYouTubeMusicManager();
    if (isMusicPlaying) {
      musicManager.pause();
      setIsMusicPlaying(false);
    } else {
      musicManager.play();
      setIsMusicPlaying(true);
    }
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-10 select-none">
      {/* Top HUD */}
      <div className="absolute left-0 right-0 top-0 bg-gradient-to-b from-black/80 to-transparent p-3 pt-8 md:p-4 md:pt-12">
        {/* Stage & Wave */}
        <div className="mb-2 flex items-center justify-between text-[10px] md:text-xs">
          <div className="text-cyan-400">
            <div>Dungeon {currentDungeon} - Stage {currentStage}/5</div>
            <div className="text-xs">
              {currentStage < 5 ? `${stageKills}/10 Kills` : 'BOSS FIGHT'}
            </div>
          </div>
          <div className="text-yellow-400">
            Level {level}
          </div>
        </div>

        {/* Health Bar */}
        <div className="mb-2">
          <div className="mb-0.5 flex items-center justify-between text-[9px] md:text-xs">
            <span className="text-cyan-400">HEALTH</span>
            <span className="text-white">
              {Math.ceil(playerStats.health)} / {playerStats.maxHealth}
            </span>
          </div>
          <div className="h-2 md:h-3 overflow-hidden rounded-full border border-cyan-500/50 bg-black/50">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-300"
              style={{ width: `${healthPercent}%` }}
            />
          </div>
        </div>

        {/* XP Bar */}
        <div>
          <div className="mb-0.5 flex items-center justify-between text-[9px] md:text-xs">
            <span className="text-purple-400">EXPERIENCE</span>
            <span className="text-white">
              {xp} / {xpRequired}
            </span>
          </div>
          <div className="h-1.5 md:h-2 overflow-hidden rounded-full border border-purple-500/50 bg-black/50">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-300"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Music Controls */}
      <div className="pointer-events-auto absolute right-3 top-3 md:right-4 md:top-4 flex items-center gap-2 rounded-lg border border-cyan-500/50 bg-black/80 px-2 py-1.5 md:px-3 md:py-2">
        <button
          onClick={handleVolumeDown}
          className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm md:text-base font-bold"
        >
          -
        </button>
        <div className="flex items-center gap-1.5">
          <div className="text-[9px] md:text-xs text-cyan-400">VOL</div>
          <div className="text-xs md:text-sm font-bold text-white w-8 text-center">{volume}</div>
        </div>
        <button
          onClick={handleVolumeUp}
          className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm md:text-base font-bold"
        >
          +
        </button>
        <button
          onClick={handleToggleMusic}
          className="ml-2 text-cyan-400 hover:text-cyan-300 transition-colors text-xs md:text-sm"
        >
          {isMusicPlaying ? '⏸' : '▶'}
        </button>
      </div>

      {/* Token Counter */}
      <div className="absolute right-3 top-20 md:right-4 md:top-24 rounded-lg border border-yellow-500/50 bg-black/80 px-2 py-1 md:px-3 md:py-1.5">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 md:h-3 md:w-3 rounded-full bg-yellow-400" />
          <div>
            <div className="text-[9px] md:text-xs text-yellow-400">TOKENS</div>
            <div className="text-sm md:text-base font-bold text-white">{pendingTokens}</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 rounded-lg border border-cyan-500/30 bg-black/60 px-2 py-1 md:px-2.5 md:py-1.5 text-[9px] md:text-xs">
        <div className="flex gap-3">
          <div>
            <div className="text-gray-400">Score</div>
            <div className="font-bold text-white">{score}</div>
          </div>
          <div>
            <div className="text-gray-400">Kills</div>
            <div className="font-bold text-white">{killCount}</div>
          </div>
        </div>
      </div>

      {/* Control hints (desktop only) */}
      <div className="absolute bottom-4 right-4 hidden rounded-lg border border-cyan-500/30 bg-black/60 px-3 py-2 text-xs md:block">
        <div className="mb-1 font-bold text-cyan-400">CONTROLS</div>
        <div className="space-y-0.5 text-gray-300">
          <div>WASD - Move</div>
          <div>Stop - Auto Shoot</div>
        </div>
      </div>
    </div>
  );
}
