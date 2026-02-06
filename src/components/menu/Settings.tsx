'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { resetProgress } from '@/lib/progress-storage';

interface SettingsProps {
  onBack: () => void;
}

export function Settings({ onBack }: SettingsProps): JSX.Element {
  const [musicVolume, setMusicVolume] = useState<number>(80);
  const [sfxVolume, setSfxVolume] = useState<number>(100);
  const [language, setLanguage] = useState<string>('en');

  const handleResetProgress = (): void => {
    if (
      window.confirm(
        'Are you sure you want to reset all progress? This cannot be undone!'
      )
    ) {
      resetProgress();
      window.location.reload();
    }
  };

  return (
    <div className="absolute inset-0 z-50 overflow-y-auto bg-black">
      <div className="container mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-gray-400 hover:text-cyan-400"
          >
            ← BACK
          </Button>
          <h1 className="text-3xl font-bold text-cyan-400">SETTINGS</h1>
          <div className="w-20" />
        </div>

        {/* Sound Settings */}
        <div className="mb-6 rounded-lg border-2 border-cyan-400/30 bg-gradient-to-br from-gray-900 to-gray-800 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
            🔊 SOUND
          </h2>

          <div className="space-y-6">
            {/* Music Volume */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm text-gray-400">Music</label>
                <span className="text-sm font-bold text-cyan-400">
                  {musicVolume}%
                </span>
              </div>
              <Slider
                value={[musicVolume]}
                onValueChange={(value: number[]) => setMusicVolume(value[0])}
                max={100}
                step={1}
                className="cursor-pointer"
              />
            </div>

            {/* SFX Volume */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm text-gray-400">SFX</label>
                <span className="text-sm font-bold text-cyan-400">
                  {sfxVolume}%
                </span>
              </div>
              <Slider
                value={[sfxVolume]}
                onValueChange={(value: number[]) => setSfxVolume(value[0])}
                max={100}
                step={1}
                className="cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6 rounded-lg border-2 border-cyan-400/30 bg-gradient-to-br from-gray-900 to-gray-800 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
            🎮 CONTROLS
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-lg bg-gray-800/50 p-3">
              <span className="text-gray-400">Desktop</span>
              <span className="font-mono text-cyan-400">WASD / Arrow Keys</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-gray-800/50 p-3">
              <span className="text-gray-400">Mobile</span>
              <span className="font-mono text-cyan-400">Virtual Joystick</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-gray-800/50 p-3">
              <span className="text-gray-400">Shoot</span>
              <span className="font-mono text-cyan-400">Stop Moving (Auto)</span>
            </div>
          </div>
        </div>

        {/* Language */}
        <div className="mb-6 rounded-lg border-2 border-cyan-400/30 bg-gradient-to-br from-gray-900 to-gray-800 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
            🌐 LANGUAGE
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setLanguage('en')}
              className={`rounded-lg p-3 transition-all ${
                language === 'en'
                  ? 'bg-cyan-500 text-black'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('pl')}
              className={`rounded-lg p-3 transition-all ${
                language === 'pl'
                  ? 'bg-cyan-500 text-black'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Polski
            </button>
          </div>
        </div>

        {/* Data */}
        <div className="rounded-lg border-2 border-red-500/30 bg-gradient-to-br from-red-900/20 to-gray-800 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
            💾 DATA
          </h2>

          <p className="mb-4 text-sm text-gray-400">
            Reset all progress including dungeon completion, stats, and unlocks.
            This action cannot be undone!
          </p>

          <Button
            onClick={handleResetProgress}
            variant="destructive"
            className="w-full bg-red-600 hover:bg-red-700"
          >
            RESET PROGRESS
          </Button>
        </div>
      </div>
    </div>
  );
}
