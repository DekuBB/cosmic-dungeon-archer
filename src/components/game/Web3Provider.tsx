'use client';

import { type ReactNode } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { base } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { coinbaseWallet, walletConnect } from 'wagmi/connectors';

const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({
      appName: 'Cosmic Dungeon Archer',
      appLogoUrl: 'https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/0a82b80a-0aa0-4c72-b004-5972cb6f5ef0-s9uVdwr6QX0eKsUEqsl44XsvUdSp56',
    }),
    walletConnect({
      projectId: 'cosmic-dungeon-archer-base',
      metadata: {
        name: 'Cosmic Dungeon Archer',
        description: 'Survive. Evolve. Conquer the Dungeons.',
        url: 'https://base.org',
        icons: ['https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/0a82b80a-0aa0-4c72-b004-5972cb6f5ef0-s9uVdwr6QX0eKsUEqsl44XsvUdSp56'],
      },
    }),
  ],
  transports: {
    [base.id]: http(),
  },
});

const queryClient = new QueryClient();

interface Web3ProviderProps {
  children: ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps): JSX.Element {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
