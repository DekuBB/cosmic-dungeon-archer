'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/stores/game-store';
import { useWeb3Store } from '@/stores/web3-store';
import { Button } from '@/components/ui/button';

interface DeathScreenProps {
  onBackToMenu: () => void;
}

export function DeathScreen({ onBackToMenu }: DeathScreenProps): JSX.Element | null {
  const { isAlive, pendingTokens, score, killCount, currentDungeon, currentStage, resetGame } = useGameStore();
  const { isConnected, isClaimingTokens, claimTokens } = useWeb3Store();
  const [autoClaimAttempted, setAutoClaimAttempted] = useState<boolean>(false);
  const [claimSuccess, setClaimSuccess] = useState<boolean>(false);

  // Auto-claim tokens when game ends if wallet is connected
  useEffect(() => {
    if (!isAlive && isConnected && pendingTokens > 0 && !autoClaimAttempted) {
      setAutoClaimAttempted(true);
      
      // Automatically claim tokens after a short delay
      setTimeout(async () => {
        try {
          await claimTokens();
          setClaimSuccess(true);
        } catch (error) {
          console.error('Auto-claim failed:', error);
        }
      }, 1500);
    }
  }, [isAlive, isConnected, pendingTokens, autoClaimAttempted, claimTokens]);

  if (isAlive) {
    return null;
  }

  const handleRestart = (): void => {
    resetGame();
    window.location.reload();
  };

  const handleManualClaim = async (): Promise<void> => {
    try {
      await claimTokens();
      setClaimSuccess(true);
    } catch (error) {
      console.error('Manual claim failed:', error);
    }
  };

  return (
    <div className="pointer-events-auto absolute inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm">
      <div className="w-full max-w-md px-4 text-center">
        {/* Title */}
        <div className="mb-8">
          <h2 className="mb-2 text-5xl font-bold text-red-500">
            GAME OVER
          </h2>
          <p className="text-gray-400">Neural Interface Disconnected</p>
        </div>

        {/* Stats */}
        <div className="mb-8 space-y-4">
          <div className="rounded-lg border border-cyan-500/30 bg-black/60 p-6">
            <div className="mb-4 text-4xl font-bold text-cyan-400">
              D{currentDungeon}-S{currentStage}
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-400">Score</div>
                <div className="text-xl font-bold text-white">{score}</div>
              </div>
              <div>
                <div className="text-gray-400">Kills</div>
                <div className="text-xl font-bold text-white">{killCount}</div>
              </div>
            </div>
          </div>

          {/* Token Rewards */}
          <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-6">
            <div className="mb-2 flex items-center justify-center gap-2">
              <div className="h-4 w-4 rounded-full bg-yellow-400" />
              <span className="text-sm text-yellow-400">DATA FRAGMENTS COLLECTED</span>
            </div>
            <div className="text-4xl font-bold text-yellow-400">
              {pendingTokens}
            </div>
            
            {/* Claim Status */}
            {isConnected && pendingTokens > 0 && (
              <div className="mt-4">
                {claimSuccess ? (
                  <div className="rounded bg-green-500/20 p-3 text-sm text-green-400">
                    ✅ Tokens claimed to your wallet!
                  </div>
                ) : isClaimingTokens ? (
                  <div className="rounded bg-cyan-500/20 p-3 text-sm text-cyan-400">
                    ⏳ Claiming tokens to your wallet...
                  </div>
                ) : !autoClaimAttempted ? (
                  <Button
                    onClick={handleManualClaim}
                    className="w-full bg-yellow-500 text-black hover:bg-yellow-600"
                  >
                    CLAIM TO WALLET
                  </Button>
                ) : null}
              </div>
            )}
            
            {!isConnected && pendingTokens > 0 && (
              <p className="mt-4 text-xs text-gray-400">
                Connect wallet to claim rewards
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            onClick={handleRestart}
            className="bg-cyan-500 text-black hover:bg-cyan-600"
            size="lg"
          >
            TRY AGAIN
          </Button>
          <Button
            onClick={onBackToMenu}
            variant="outline"
            className="border-2 border-cyan-400 bg-black text-cyan-400 hover:bg-cyan-400/10"
            size="lg"
          >
            MENU
          </Button>
        </div>

        {/* Tip */}
        <p className="mt-6 text-xs text-gray-500">
          Stop moving to auto-shoot. Move to dodge enemy attacks.
        </p>
      </div>
    </div>
  );
}
