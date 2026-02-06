'use client'
import dynamic from 'next/dynamic';
import { useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { useAddMiniApp } from "@/hooks/useAddMiniApp";
import { useQuickAuth } from "@/hooks/useQuickAuth";
import { useIsInFarcaster } from "@/hooks/useIsInFarcaster";

// Import GameClient dynamically to avoid SSR issues with Phaser
const GameClient = dynamic(
  () => import('@/components/game/GameClient').then((mod) => ({ default: mod.GameClient })),
  { ssr: false }
);

export default function Home(): JSX.Element {
    const { addMiniApp } = useAddMiniApp();
    const isInFarcaster = useIsInFarcaster()
    useQuickAuth(isInFarcaster)
    useEffect(() => {
      const tryAddMiniApp = async () => {
        try {
          await addMiniApp()
        } catch (error) {
          console.error('Failed to add mini app:', error)
        }

      }

    

      tryAddMiniApp()
    }, [addMiniApp])
  useEffect(() => {
    // Initialize Farcaster SDK in background - COMPLETELY non-blocking
    const initializeFarcaster = async () => {
      try {
        // Wait for DOM to be fully ready
        if (document.readyState !== 'complete') {
          await new Promise<void>(resolve => {
            if (document.readyState === 'complete') {
              resolve();
            } else {
              window.addEventListener('load', () => resolve(), { once: true });
            }
          });
        }

        // Wait a bit to ensure everything is loaded
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Try to initialize SDK
        await sdk.actions.ready();
        console.log('Farcaster SDK initialized successfully');
        
        // Try to add mini app if SDK is ready (optional, non-critical)
        if (sdk.context?.client) {
          try {
            await sdk.actions.addMiniApp();
            console.log('Mini app added successfully');
          } catch (addError) {
            // This is completely optional - don't log as error
            console.log('Mini app not added (this is normal):', addError);
          }
        }
      } catch (error) {
        // Farcaster initialization failed - this is OK, game should still work
        console.log('Farcaster SDK not available (this is normal outside Farcaster):', error);
      }
    };

    // Run in background without blocking
    initializeFarcaster();
  }, []);

  // Render game immediately without waiting for Farcaster
  return <GameClient />;
}
