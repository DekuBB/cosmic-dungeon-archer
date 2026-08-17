import type { Metadata } from 'next';
import './globals.css';
import { Web3Provider } from '@/components/game/Web3Provider';
import FarcasterWrapper from '@/components/FarcasterWrapper';

const APP_ICON =
  'https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/8ec38550-6b36-41b2-b2e1-a7c43ecfdcc7-fPHg3xxiBl3omQn3QlD3DJuAXVukJA';

export const metadata: Metadata = {
  title: 'Cosmic Dungeon Archer',
  description:
    'Roguelike shooter inspired by Archero with Web3 token rewards on Base and Farcaster support.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
        <link rel="icon" href={APP_ICON} />
        <meta name="theme-color" content="#06B6D4" />
      </head>
      <body className="antialiased" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
        <Web3Provider>
          <FarcasterWrapper>{children}</FarcasterWrapper>
        </Web3Provider>
      </body>
    </html>
  );
}
