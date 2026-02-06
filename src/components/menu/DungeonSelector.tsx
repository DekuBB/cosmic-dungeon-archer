'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import type { GameProgress } from '@/types/progress';
import { DUNGEON_THEMES } from '@/types/progress';
import { loadProgress } from '@/lib/progress-storage';

interface DungeonSelectorProps {
  onBack: () => void;
  onSelectDungeon: (dungeonId: number) => void;
}

export function DungeonSelector({
  onBack,
  onSelectDungeon,
}: DungeonSelectorProps): JSX.Element {
  const [progress, setProgress] = useState<GameProgress | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  if (!progress) {
    return <div className="absolute inset-0 z-50 bg-black" />;
  }

  return (
    <div className="absolute inset-0 z-50 overflow-y-auto bg-black">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-gray-400 hover:text-cyan-400"
          >
            ← BACK
          </Button>
          <h1 className="text-3xl font-bold text-cyan-400">DUNGEONS</h1>
          <div className="w-20" />
        </div>

        {/* Dungeon Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4, 5, 6].map((dungeonId: number) => {
            const dungeon = progress.dungeons[dungeonId];
            const theme = DUNGEON_THEMES[dungeonId as keyof typeof DUNGEON_THEMES];
            const isLocked = !dungeon.unlocked;

            return (
              <div
                key={dungeonId}
                className={`rounded-lg border-2 p-6 transition-all ${
                  isLocked
                    ? 'border-gray-800 bg-gray-900/50'
                    : 'border-cyan-400/30 bg-gradient-to-br from-gray-900 to-gray-800 hover:border-cyan-400'
                }`}
                style={{
                  boxShadow: isLocked
                    ? 'none'
                    : `0 0 20px ${theme.color}33`,
                }}
              >
                {/* Dungeon Header */}
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h2
                      className="text-2xl font-bold"
                      style={{ color: isLocked ? '#6B7280' : theme.color }}
                    >
                      DUNGEON {dungeonId}
                    </h2>
                    <p className="text-sm text-gray-400">{theme.name}</p>
                  </div>
                  {isLocked && (
                    <div className="text-4xl opacity-50">🔒</div>
                  )}
                </div>

                {/* Progress */}
                {!isLocked && (
                  <div className="mb-4">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-cyan-400">
                        {dungeon.completedStages}/5 Stages
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                      <div
                        className="h-full transition-all"
                        style={{
                          width: `${(dungeon.completedStages / 5) * 100}%`,
                          backgroundColor: theme.color,
                        }}
                      />
                    </div>

                    {/* Stars */}
                    <div className="mt-3 flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star: number) => (
                        <span
                          key={star}
                          className={`text-xl ${
                            star <= dungeon.stars
                              ? 'text-yellow-400'
                              : 'text-gray-700'
                          }`}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stats */}
                {!isLocked && dungeon.bestScore > 0 && (
                  <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded bg-gray-800/50 p-2">
                      <div className="text-gray-400">Best Score</div>
                      <div className="font-bold text-white">
                        {dungeon.bestScore.toLocaleString()}
                      </div>
                    </div>
                    <div className="rounded bg-gray-800/50 p-2">
                      <div className="text-gray-400">Best Time</div>
                      <div className="font-bold text-white">
                        {Math.floor(dungeon.bestTime / 60)}:
                        {(dungeon.bestTime % 60).toString().padStart(2, '0')}
                      </div>
                    </div>
                  </div>
                )}

                {/* Description */}
                <p className="mb-4 text-sm text-gray-500">
                  {theme.description}
                </p>

                {/* Action Button */}
                <Button
                  onClick={() => onSelectDungeon(dungeonId)}
                  disabled={isLocked}
                  className={`w-full ${
                    isLocked
                      ? 'bg-gray-800 text-gray-500'
                      : dungeon.completedStages >= 5
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-cyan-500 text-black hover:bg-cyan-400'
                  }`}
                >
                  {isLocked
                    ? 'LOCKED'
                    : dungeon.completedStages >= 5
                    ? 'REPLAY'
                    : dungeon.completedStages > 0
                    ? 'CONTINUE'
                    : 'START'}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Info */}
        <div className="mt-8 rounded-lg border border-cyan-400/20 bg-cyan-400/5 p-4 text-center text-sm text-gray-400">
          Complete all 5 stages in a dungeon to unlock the next one! <span className="text-cyan-400 font-bold">6 Dungeons • 30 Total Stages</span>
        </div>
      </div>
    </div>
  );
}
