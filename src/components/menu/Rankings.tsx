'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import type { GameProgress } from '@/types/progress';
import { loadProgress } from '@/lib/progress-storage';
import { useWeb3Store } from '@/stores/web3-store';

interface RankingsProps {
  onBack: () => void;
}

export function Rankings({ onBack }: RankingsProps): JSX.Element {
  const [progress, setProgress] = useState<GameProgress | null>(null);
  const { address } = useWeb3Store();

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  if (!progress) {
    return <div className="absolute inset-0 z-50 bg-black" />;
  }

  // Mock leaderboard data
  const leaderboard = [
    { address: '0x1234...5678', dungeon: 3, stage: 5, tokens: 347, score: 45230 },
    { address: '0xabcd...ef12', dungeon: 2, stage: 4, tokens: 289, score: 32100 },
    { address: '0x9876...5432', dungeon: 2, stage: 2, tokens: 156, score: 18900 },
    { address: '0x4567...89ab', dungeon: 1, stage: 5, tokens: 134, score: 15670 },
    { address: '0xcdef...0123', dungeon: 1, stage: 3, tokens: 89, score: 9820 },
  ];

  return (
    <div className="absolute inset-0 z-50 overflow-y-auto bg-black">
      <div className="container mx-auto max-w-3xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-gray-400 hover:text-cyan-400"
          >
            ← BACK
          </Button>
          <h1 className="text-xl md:text-2xl font-bold text-cyan-400">LEADERBOARD</h1>
          <div className="w-20" />
        </div>

        {/* Top Archers */}
        <div className="mb-8 rounded-lg border-2 border-cyan-400/30 bg-gradient-to-br from-gray-900 to-gray-800 p-6">
          <h2 className="mb-3 flex items-center gap-2 text-lg md:text-xl font-bold text-yellow-400">
            🏆 TOP ARCHERS
          </h2>

          <div className="space-y-3">
            {leaderboard.map((entry, index: number) => (
              <div
                key={index}
                className={`flex items-center justify-between rounded-lg p-2 md:p-3 ${
                  index === 0
                    ? 'bg-yellow-400/10 border border-yellow-400/30'
                    : 'bg-gray-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-full font-bold ${
                      index === 0
                        ? 'bg-yellow-400 text-black'
                        : index === 1
                        ? 'bg-gray-400 text-black'
                        : index === 2
                        ? 'bg-amber-600 text-black'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-mono text-xs md:text-sm text-cyan-400">
                      {entry.address}
                    </div>
                    <div className="text-[10px] md:text-xs text-gray-500">
                      D{entry.dungeon}-S{entry.stage} • {entry.tokens} 🪙
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-white">
                    {entry.score.toLocaleString()}
                  </div>
                  <div className="text-[10px] md:text-xs text-gray-500">Score</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Your Stats */}
        <div className="rounded-lg border-2 border-cyan-400/30 bg-gradient-to-br from-gray-900 to-gray-800 p-6">
          <h2 className="mb-3 text-lg md:text-xl font-bold text-cyan-400">📊 YOUR STATS</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-gray-800/50 p-3">
              <div className="text-xs md:text-sm text-gray-400">Total Kills</div>
              <div className="text-xl md:text-2xl font-bold text-white">
                {progress.totalKills}
              </div>
            </div>

            <div className="rounded-lg bg-gray-800/50 p-3">
              <div className="text-xs md:text-sm text-gray-400">Total Tokens</div>
              <div className="text-xl md:text-2xl font-bold text-yellow-400">
                {progress.totalTokens} 🪙
              </div>
            </div>

            <div className="rounded-lg bg-gray-800/50 p-3">
              <div className="text-xs md:text-sm text-gray-400">Highest Dungeon</div>
              <div className="text-xl md:text-2xl font-bold text-cyan-400">
                D{progress.highestDungeon}-S{progress.highestStage}
              </div>
            </div>

            <div className="rounded-lg bg-gray-800/50 p-3">
              <div className="text-xs md:text-sm text-gray-400">Wallet</div>
              <div className="text-xs md:text-sm font-mono text-cyan-400">
                {address
                  ? `${address.slice(0, 6)}...${address.slice(-4)}`
                  : 'Not Connected'}
              </div>
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="mt-4 text-center text-sm text-gray-500">
          Leaderboard updates every 5 minutes
        </div>
      </div>
    </div>
  );
}
