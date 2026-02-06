'use client';

import { useEffect, useRef, useState } from 'react';
import { HUD } from './HUD';
import { DraftScreen } from './DraftScreen';
import { DeathScreen } from './DeathScreen';
import { WalletConnect } from './WalletConnect';
import { MobileControls } from './MobileControls';
import { MainMenu } from '@/components/menu/MainMenu';
import { DungeonSelector } from '@/components/menu/DungeonSelector';
import { Rankings } from '@/components/menu/Rankings';
import { Settings } from '@/components/menu/Settings';
import { useGameStore } from '@/stores/game-store';
import { loadProgress, updateDungeonProgress } from '@/lib/progress-storage';
import { GAME_CONFIG } from '@/lib/game-config';
import { GameErrorBoundary } from '@/components/GameErrorBoundary';

type GameScreen = 'menu' | 'dungeons' | 'rankings' | 'settings' | 'wallet' | 'game';

export function GameClient(): JSX.Element {
  const parentRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<any>(null);
  const sceneRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('menu');
  const [gameStartTime, setGameStartTime] = useState<number>(0);
  const { isDrafting, isAlive, setDungeon, currentDungeon, currentStage, score } = useGameStore();

  // Watch for game end to save progress
  useEffect(() => {
    if (!isAlive && gameStartTime > 0) {
      const duration = Math.floor((Date.now() - gameStartTime) / 1000);
      updateDungeonProgress(currentDungeon, currentStage, score, duration);
    }
  }, [isAlive, gameStartTime, currentDungeon, currentStage, score]);

  useEffect((): (() => void) => {
    // Only initialize game when on game screen
    if (currentScreen !== 'game') return () => {};
    
    let game: any;
    let timeoutId: NodeJS.Timeout;
    let isInitialized: boolean = false;

    const initGame = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setLoadingError(null);
        
        // Set timeout for initialization (10 seconds)
        timeoutId = setTimeout(() => {
          if (!isInitialized) {
            setLoadingError('Game initialization timeout. Please refresh the page.');
            setIsLoading(false);
          }
        }, 10000);

        const Phaser = (await import('phaser')).default;
        const { MainScene } = await import('@/game/MainScene');
        
        // Try to load VirtualJoyStickPlugin with fallback
        let VirtualJoyStickPlugin: any = null;
        try {
          VirtualJoyStickPlugin = (await import('phaser3-rex-plugins/plugins/virtualjoystick-plugin.js')).default;
        } catch (pluginError) {
          console.warn('VirtualJoyStick plugin failed to load, continuing without it:', pluginError);
        }

        // Build game config
        const gameConfig: any = {
          type: Phaser.AUTO,
          parent: parentRef.current!,
          backgroundColor: GAME_CONFIG.backgroundColor,
          scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: GAME_CONFIG.width,
            height: GAME_CONFIG.height,
          },
          physics: {
            default: 'arcade',
            arcade: {
              debug: false,
            },
          },
          scene: [MainScene],
        };

        // Add plugin only if loaded successfully
        if (VirtualJoyStickPlugin) {
          gameConfig.plugins = {
            global: [
              {
                key: 'rexVirtualJoyStick',
                plugin: VirtualJoyStickPlugin,
                start: true,
              },
            ],
          };
        }

        game = new Phaser.Game(gameConfig);
        gameRef.current = game;
        
        // Wait for scene to be created and ready
        // Use a short delay to ensure Phaser is fully initialized
        setTimeout(() => {
          try {
            const mainScene = game.scene.getScene('MainScene');
            if (mainScene) {
              sceneRef.current = mainScene;
              isInitialized = true;
              setIsLoading(false);
              clearTimeout(timeoutId);
            } else {
              throw new Error('MainScene not found');
            }
          } catch (sceneError) {
            console.error('Failed to get MainScene:', sceneError);
            setLoadingError('Failed to initialize game scene. Please refresh the page.');
            setIsLoading(false);
            clearTimeout(timeoutId);
          }
        }, 500);

      } catch (error: unknown) {
        console.error('Failed to initialize game:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setLoadingError(`Failed to load game: ${errorMessage}. Please refresh the page.`);
        setIsLoading(false);
        clearTimeout(timeoutId);
      }
    };

    initGame();

    return (): void => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (game) {
        game.destroy(true);
        gameRef.current = null;
        sceneRef.current = null;
      }
    };
  }, [currentScreen]);

  const handleStartGame = (): void => {
    const progress = loadProgress();
    setDungeon(progress.currentDungeon);
    setCurrentScreen('game');
    setGameStartTime(Date.now());
  };

  const handleSelectDungeon = (dungeonId: number): void => {
    setDungeon(dungeonId);
    setCurrentScreen('game');
    setGameStartTime(Date.now());
  };

  const handleBackToMenu = (): void => {
    setCurrentScreen('menu');
    setLoadingError(null);
  };

  const handleRetry = (): void => {
    setLoadingError(null);
    setIsLoading(true);
    // Force re-render by toggling screen
    setCurrentScreen('menu');
    setTimeout(() => {
      const progress = loadProgress();
      setDungeon(progress.currentDungeon);
      setCurrentScreen('game');
    }, 100);
  };

  return (
    <GameErrorBoundary>
      <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Game Canvas Container */}
      <div ref={parentRef} className="absolute inset-0" />

      {/* Loading Screen */}
      {isLoading && !loadingError && currentScreen === 'game' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black">
          <div className="text-center">
            <div className="mb-4 text-4xl font-bold text-cyan-400">
              COSMIC DUNGEON ARCHER
            </div>
            <div className="text-gray-400">Initializing Neural Interface...</div>
            <div className="mt-4 h-2 w-64 overflow-hidden rounded-full bg-gray-800">
              <div className="h-full w-full animate-pulse bg-cyan-400" />
            </div>
          </div>
        </div>
      )}

      {/* Error Screen */}
      {loadingError && currentScreen === 'game' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black">
          <div className="max-w-md text-center">
            <div className="mb-4 text-4xl font-bold text-red-400">
              ⚠️ ERROR
            </div>
            <div className="mb-6 text-gray-300">{loadingError}</div>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleRetry}
                className="rounded-lg bg-cyan-500 px-6 py-3 font-bold text-black transition-all hover:bg-cyan-400"
              >
                RETRY
              </button>
              <button
                onClick={handleBackToMenu}
                className="rounded-lg bg-gray-700 px-6 py-3 font-bold text-gray-300 transition-all hover:bg-gray-600"
              >
                BACK TO MENU
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Menu Screens */}
      {!isLoading && !loadingError && currentScreen === 'menu' && (
        <MainMenu
          onStartGame={handleStartGame}
          onOpenDungeons={() => setCurrentScreen('dungeons')}
          onOpenRankings={() => setCurrentScreen('rankings')}
          onOpenSettings={() => setCurrentScreen('settings')}
          onOpenWallet={() => setCurrentScreen('wallet')}
        />
      )}

      {!isLoading && !loadingError && currentScreen === 'dungeons' && (
        <DungeonSelector
          onBack={handleBackToMenu}
          onSelectDungeon={handleSelectDungeon}
        />
      )}

      {!isLoading && !loadingError && currentScreen === 'rankings' && (
        <Rankings onBack={handleBackToMenu} />
      )}

      {!isLoading && !loadingError && currentScreen === 'settings' && (
        <Settings onBack={handleBackToMenu} />
      )}

      {!isLoading && !loadingError && currentScreen === 'wallet' && (
        <div className="absolute inset-0 z-50 bg-black">
          <div className="container mx-auto max-w-2xl px-4 py-8">
            <div className="mb-8 flex items-center justify-between">
              <button
                onClick={handleBackToMenu}
                className="text-gray-400 hover:text-cyan-400"
              >
                ← BACK
              </button>
              <h1 className="text-3xl font-bold text-cyan-400">WALLET</h1>
              <div className="w-20" />
            </div>
            <WalletConnect />
          </div>
        </div>
      )}

      {/* Game UI Overlays */}
      {!isLoading && !loadingError && currentScreen === 'game' && (
        <>
          <HUD />
          <MobileControls />
          <DraftScreen />
          <DeathScreen onBackToMenu={handleBackToMenu} />
        </>
      )}
      </div>
    </GameErrorBoundary>
  );
}
