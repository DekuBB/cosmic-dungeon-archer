'use client';

import { useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useWeb3Store } from '@/stores/web3-store';
import { Button } from '@/components/ui/button';
import { useIsInFarcaster } from '@/hooks/useIsInFarcaster';

export function WalletConnect(): JSX.Element {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { setAddress, setConnected, setChainId } = useWeb3Store();
  const isInFarcaster = useIsInFarcaster();
  const [autoConnectAttempted, setAutoConnectAttempted] = useState<boolean>(false);

  useEffect((): void => {
    setAddress(address);
    setConnected(isConnected);
    setChainId(chainId);
  }, [address, isConnected, chainId, setAddress, setConnected, setChainId]);

  // Auto-connect based on context
  useEffect(() => {
    if (!isConnected && !autoConnectAttempted) {
      setAutoConnectAttempted(true);
      
      // Attempt auto-connection
      if (isInFarcaster) {
        // In Farcaster context - use WalletConnect or Coinbase
        const walletConnectConnector = connectors.find((c) => c.name === 'WalletConnect');
        if (walletConnectConnector) {
          setTimeout(() => {
            connect({ connector: walletConnectConnector });
          }, 1000);
        }
      } else {
        // In Base context - use Coinbase Wallet
        const coinbaseConnector = connectors.find((c) => c.name === 'Coinbase Wallet');
        if (coinbaseConnector) {
          setTimeout(() => {
            connect({ connector: coinbaseConnector });
          }, 1000);
        }
      }
    }
  }, [isConnected, connectors, connect, autoConnectAttempted, isInFarcaster]);

  const handleConnect = (): void => {
    // Prioritize connector based on context
    if (isInFarcaster) {
      const walletConnectConnector = connectors.find((c) => c.name === 'WalletConnect');
      if (walletConnectConnector) {
        connect({ connector: walletConnectConnector });
        return;
      }
    }
    
    // Default to Coinbase Wallet
    const coinbaseConnector = connectors.find((c) => c.name === 'Coinbase Wallet');
    if (coinbaseConnector) {
      connect({ connector: coinbaseConnector });
    }
  };

  return (
    <div className="absolute right-4 top-4 z-20">
      {isConnected ? (
        <div className="flex items-center gap-2">
          <div className="rounded-lg border border-cyan-500/50 bg-black/80 px-3 py-2 text-sm text-cyan-400">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </div>
          <Button
            onClick={(): void => {
              disconnect();
            }}
            size="sm"
            variant="outline"
            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
          >
            Disconnect
          </Button>
        </div>
      ) : (
        <Button
          onClick={handleConnect}
          className="bg-cyan-500 text-black hover:bg-cyan-600"
        >
          COSMIC DUNGEON ARCHER
        </Button>
      )}
    </div>
  );
}
