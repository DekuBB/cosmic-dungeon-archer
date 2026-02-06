'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { getYouTubeMusicManager } from '@/game/YouTubeMusicManager';

interface MainMenuProps {
  onStartGame: () => void;
  onOpenDungeons: () => void;
  onOpenRankings: () => void;
  onOpenSettings: () => void;
  onOpenWallet: () => void;
}

export function MainMenu({
  onStartGame,
  onOpenDungeons,
  onOpenRankings,
  onOpenSettings,
  onOpenWallet,
}: MainMenuProps): JSX.Element {
  const [volume, setVolume] = useState<number>(30);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [musicManager, setMusicManager] = useState<ReturnType<typeof getYouTubeMusicManager> | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const manager = getYouTubeMusicManager();
      setMusicManager(manager);
      
      // Auto-play music after a delay to ensure API is loaded
      setTimeout(() => {
        manager.play();
        setIsPlaying(true);
        setVolume(manager.getVolume());
      }, 2000);
    }
  }, []);

  const handleVolumeUp = (): void => {
    if (musicManager) {
      const newVolume = Math.min(100, volume + 10);
      musicManager.setVolume(newVolume);
      setVolume(newVolume);
    }
  };

  const handleVolumeDown = (): void => {
    if (musicManager) {
      const newVolume = Math.max(0, volume - 10);
      musicManager.setVolume(newVolume);
      setVolume(newVolume);
    }
  };

  const handleTogglePlayback = (): void => {
    if (musicManager) {
      if (isPlaying) {
        musicManager.pause();
        setIsPlaying(false);
      } else {
        musicManager.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div 
      className="absolute inset-0 z-50 flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: 'url(https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/0a82b80a-0aa0-4c72-b004-5972cb6f5ef0-s9uVdwr6QX0eKsUEqsl44XsvUdSp56)',
        backgroundColor: '#000',
      }}
    >
      {/* Volume Controls - Top Right */}
      <div className="absolute right-4 top-4 z-10 flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-black/80 p-2">
        <button
          onClick={handleVolumeDown}
          className="flex h-8 w-8 items-center justify-center rounded bg-gray-800 text-sm font-bold text-cyan-400 transition-all hover:bg-cyan-500 hover:text-black"
          aria-label="Volume Down"
        >
          -
        </button>
        <div className="flex min-w-[60px] items-center justify-center text-xs text-gray-400">
          🔊 {volume}
        </div>
        <button
          onClick={handleVolumeUp}
          className="flex h-8 w-8 items-center justify-center rounded bg-gray-800 text-sm font-bold text-cyan-400 transition-all hover:bg-cyan-500 hover:text-black"
          aria-label="Volume Up"
        >
          +
        </button>
        <button
          onClick={handleTogglePlayback}
          className="ml-2 flex h-8 w-8 items-center justify-center rounded bg-gray-800 text-xs text-cyan-400 transition-all hover:bg-cyan-500 hover:text-black"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
      </div>

      <div className="w-full max-w-md space-y-8 px-4">
        {/* Title */}
        <div className="text-center">
          <h1 className="mb-2 text-5xl font-bold text-cyan-400 drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]">
            COSMIC DUNGEON
          </h1>
          <h2 className="text-4xl font-bold text-cyan-400 drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]">
            ARCHER
          </h2>
          <p className="mt-4 text-gray-400">
            Survive. Evolve. Conquer the Dungeons.
          </p>
        </div>

        {/* Main Buttons */}
        <div className="space-y-4">
          <Button
            onClick={onStartGame}
            className="w-full bg-cyan-500 py-6 text-xl font-bold text-black hover:bg-cyan-400"
          >
            START GAME
          </Button>

          <Button
            onClick={onOpenDungeons}
            className="w-full border-2 border-cyan-400 bg-black py-6 text-xl font-bold text-cyan-400 hover:bg-cyan-400/10"
          >
            DUNGEONS
          </Button>
        </div>

        {/* Icon Buttons */}
        <div className="flex justify-center gap-4 pt-4">
          <button
            onClick={onOpenRankings}
            className="flex h-20 w-20 flex-col items-center justify-center rounded-lg border-2 border-gray-700 bg-gray-900 transition-all hover:border-cyan-400 hover:bg-cyan-400/10"
            aria-label="Rankings"
          >
            <div className="text-3xl">🏆</div>
            <div className="mt-1 text-xs text-gray-400">Rank</div>
          </button>

          <button
            onClick={onOpenSettings}
            className="flex h-20 w-20 flex-col items-center justify-center rounded-lg border-2 border-gray-700 bg-gray-900 transition-all hover:border-cyan-400 hover:bg-cyan-400/10"
            aria-label="Settings"
          >
            <div className="text-3xl">⚙️</div>
            <div className="mt-1 text-xs text-gray-400">Settings</div>
          </button>

          <button
            onClick={onOpenWallet}
            className="flex h-20 w-20 flex-col items-center justify-center rounded-lg border-2 border-gray-700 bg-gray-900 transition-all hover:border-cyan-400 hover:bg-cyan-400/10"
            aria-label="Wallet"
          >
            <div className="text-3xl">💰</div>
            <div className="mt-1 text-xs text-gray-400">Wallet</div>
          </button>
        </div>

        {/* Version */}
        <div className="pt-4 text-center text-xs text-gray-600">
          v1.0.0 - Powered by Base
        </div>
      </div>
    </div>
  );
}
