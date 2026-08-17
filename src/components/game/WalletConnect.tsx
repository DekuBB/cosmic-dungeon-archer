'use client';

import { useState } from 'react';
import { useWeb3Store } from '@/stores/web3-store';
import { Button } from '@/components/ui/button';

export function WalletConnect(): JSX.Element {
  const { address, isConnected, setAddress, setConnected, setChainId } = useWeb3Store();
  const [busy, setBusy] = useState(false);

  const handleConnect = async (): Promise<void> => {
    setBusy(true);
    try {
      const eth = typeof window !== 'undefined' ? (window as any).ethereum : null;
      if (eth?.request) {
        const accounts: string[] = await eth.request({ method: 'eth_requestAccounts' });
        if (accounts?.[0]) {
          setAddress(accounts[0]);
          setConnected(true);
          setChainId(8453);
          setBusy(false);
          return;
        }
      }
      setAddress('0xDemo...C0FFEE');
      setConnected(true);
      setChainId(8453);
    } catch {
      setAddress('0xDemo...C0FFEE');
      setConnected(true);
      setChainId(8453);
    } finally {
      setBusy(false);
    }
  };

  const handleDisconnect = (): void => {
    setAddress(undefined);
    setConnected(false);
    setChainId(undefined);
  };

  const short =
    address && address.startsWith('0x') && address.length > 12
      ? `${address.slice(0, 6)}…${address.slice(-4)}`
      : address || '';

  return (
    <div className="absolute right-4 top-4 z-20 pointer-events-auto">
      {isConnected ? (
        <div className="flex items-center gap-2">
          <div className="rounded-lg border border-cyan-500/50 bg-black/70 px-3 py-1.5 text-xs text-cyan-300 font-mono">
            {short}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10"
            onClick={handleDisconnect}
          >
            Disconnect
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="border-cyan-500 text-cyan-300 hover:bg-cyan-500/20"
          onClick={handleConnect}
          disabled={busy}
        >
          {busy ? 'Connecting…' : 'LINK NEURAL INTERFACE'}
        </Button>
      )}
    </div>
  );
}
