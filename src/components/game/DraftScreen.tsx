'use client';

import { useGameStore } from '@/stores/game-store';
import type { Perk } from '@/types/game';
import { Button } from '@/components/ui/button';

export function DraftScreen(): JSX.Element | null {
  const { isDrafting, draftChoices, selectPerk } = useGameStore();

  if (!isDrafting || draftChoices.length === 0) {
    return null;
  }

  const handleSelectPerk = (perk: Perk): void => {
    selectPerk(perk);
  };

  const getRarityColor = (rarity: string): string => {
    switch (rarity) {
      case 'common':
        return 'border-blue-500 bg-blue-500/10';
      case 'rare':
        return 'border-purple-500 bg-purple-500/10';
      case 'epic':
        return 'border-yellow-500 bg-yellow-500/10';
      case 'legendary':
        return 'border-red-500 bg-red-500/10';
      default:
        return 'border-gray-500 bg-gray-500/10';
    }
  };

  const getRarityGlow = (rarity: string): string => {
    switch (rarity) {
      case 'common':
        return 'shadow-blue-500/50';
      case 'rare':
        return 'shadow-purple-500/50';
      case 'epic':
        return 'shadow-yellow-500/50';
      case 'legendary':
        return 'shadow-red-500/50';
      default:
        return '';
    }
  };

  return (
    <div className="pointer-events-auto absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="w-full max-w-4xl px-4">
        {/* Title */}
        <div className="mb-4 md:mb-6 text-center">
          <h2 className="mb-1 text-2xl md:text-3xl font-bold text-cyan-400">
            LEVEL UP
          </h2>
          <p className="text-xs md:text-sm text-gray-400">Choose an upgrade</p>
        </div>

        {/* Perk Cards */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4 max-h-[70vh] overflow-y-auto md:max-h-none md:overflow-visible">
          {draftChoices.map((perk: Perk, index: number): JSX.Element => (
            <div
              key={`${perk.id}-${index}`}
              className={`
                group relative overflow-hidden rounded-xl border-2 p-4 md:p-5 transition-all duration-300
                hover:scale-105 hover:shadow-2xl
                ${getRarityColor(perk.rarity)}
                ${getRarityGlow(perk.rarity)}
              `}
            >
              {/* Rarity Badge */}
              <div className="mb-3 flex items-center justify-between">
                <span
                  className={`
                    rounded-full px-2 py-0.5 text-[10px] md:text-xs font-bold uppercase
                    ${
                      perk.rarity === 'common'
                        ? 'bg-blue-500 text-white'
                        : perk.rarity === 'rare'
                        ? 'bg-purple-500 text-white'
                        : perk.rarity === 'epic'
                        ? 'bg-yellow-500 text-black'
                        : 'bg-red-500 text-white'
                    }
                  `}
                >
                  {perk.rarity}
                </span>
              </div>

              {/* Perk Info */}
              <div className="mb-3 md:mb-4">
                <h3 className="mb-1 text-lg md:text-xl font-bold text-white">
                  {perk.name}
                </h3>
                <p className="text-xs md:text-sm text-gray-300">{perk.description}</p>
              </div>

              {/* Tags */}
              <div className="mb-3 flex flex-wrap gap-1.5">
                {perk.tags.map((tag: string): JSX.Element => (
                  <span
                    key={tag}
                    className="rounded bg-black/50 px-1.5 py-0.5 text-[10px] md:text-xs text-gray-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Select Button */}
              <Button
                onClick={(): void => {
                  handleSelectPerk(perk);
                }}
                className={`
                  w-full
                  ${
                    perk.rarity === 'common'
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : perk.rarity === 'rare'
                      ? 'bg-purple-500 hover:bg-purple-600'
                      : perk.rarity === 'epic'
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-black'
                      : 'bg-red-500 hover:bg-red-600'
                  }
                `}
              >
                SELECT
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
