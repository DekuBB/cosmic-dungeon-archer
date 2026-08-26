'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/stores/game-store';

const formatTime = (seconds: number): string => {
  const safe = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export function AutoLiveOverlay(): JSX.Element {
  const { currentDungeon, currentStage, score, killCount, level, playerStats } =
    useGameStore();
  const [elapsed, setElapsed] = useState(0);
  const [run, setRun] = useState(1);

  useEffect(() => {
    const startedAt = Date.now();

    const timer = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const state = useGameStore.getState();
      if (state.isAlive && state.score === 0 && state.killCount === 0) {
        setRun((value) => value + 1);
      }
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  const nextBoss =
    currentStage >= 5 ? 'BOSS ACTIVE' : `STAGE 5 • ${5 - currentStage} STAGES`;

  return (
    <div className="pointer-events-none absolute inset-0 z-40 select-none font-mono">
      {/* Top TV header */}
      <div className="absolute left-0 right-0 top-0 flex items-center justify-between bg-black/85 px-4 py-2 text-xs text-cyan-300 backdrop-blur-sm md:px-6 md:py-3">
        <div className="font-black tracking-widest text-white md:text-sm">
          🔥 COSMIC DRAGON ARCHER
        </div>
        <div className="rounded-full border border-red-400/70 bg-red-500/20 px-3 py-1 font-bold text-red-300">
          ● LIVE 24/7
        </div>
      </div>

      {/* Right-side broadcast panel */}
      <div className="absolute right-2 top-14 w-44 rounded-xl border border-cyan-400/30 bg-black/75 p-3 text-[10px] text-gray-300 shadow-2xl backdrop-blur-sm md:right-5 md:top-16 md:w-56 md:text-xs">
        <div className="mb-3 text-center text-sm font-black text-cyan-300">
          AUTO-PLAY AI
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between">
            <span>RUN</span>
            <span className="text-white">#{run}</span>
          </div>
          <div className="flex justify-between">
            <span>DUNGEON</span>
            <span className="text-white">D{currentDungeon}</span>
          </div>
          <div className="flex justify-between">
            <span>STAGE</span>
            <span className="text-white">{currentStage}/5</span>
          </div>
          <div className="flex justify-between">
            <span>LEVEL</span>
            <span className="text-white">{level}</span>
          </div>
          <div className="flex justify-between">
            <span>KILLS</span>
            <span className="text-white">{killCount}</span>
          </div>
          <div className="flex justify-between">
            <span>SCORE</span>
            <span className="font-bold text-cyan-300">{score}</span>
          </div>
          <div className="flex justify-between">
            <span>HP</span>
            <span className="text-white">
              {Math.ceil(playerStats.health)}/{Math.ceil(playerStats.maxHealth)}
            </span>
          </div>
        </div>

        <div className="mt-3 border-t border-white/10 pt-3">
          <div className="text-gray-500">NEXT BOSS</div>
          <div className="font-bold text-yellow-300">{nextBoss}</div>
        </div>

        <div className="mt-3 border-t border-white/10 pt-3">
          <div className="text-gray-500">RUN TIME</div>
          <div className="font-bold text-white">{formatTime(elapsed)}</div>
        </div>

        <div className="mt-3 rounded-lg bg-cyan-500/10 p-2 text-center text-[9px] leading-relaxed text-cyan-200">
          AI MOVE • AUTO AIM • AUTO ATTACK
          <br />
          AUTO SKILLS • AUTO RESTART
        </div>
      </div>

      {/* Bottom broadcast strip */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-black/85 px-4 py-2 text-[9px] text-gray-400 backdrop-blur-sm md:px-6 md:py-3 md:text-[10px]">
        <span>🎮 kosmofazowicze.pl</span>
        <span>👁 TikTok LIVE VIEWERS: —</span>
        <span>⚡ {formatTime(elapsed)}</span>
      </div>
    </div>
  );
}
