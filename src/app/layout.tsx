import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Web3Provider } from '@/components/game/Web3Provider';
import FarcasterWrapper from "@/components/FarcasterWrapper";
import { Analytics } from '@vercel/analytics/next';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

const APP_ICON = "https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/8ec38550-6b36-41b2-b2e1-a7c43ecfdcc7-fPHg3xxiBl3omQn3QlD3DJuAXVukJA";

const FRAME_CONFIG = {
  version: "next",
  imageUrl: APP_ICON,
  button: {
    title: "Play Cosmic Dungeon Archer",
    action: {
      type: "launch_frame",
      name: "Cosmic Dungeon Archer",
      url: "https://setting-obtain-611.app.ohara.ai",
      splashImageUrl: APP_ICON,
      splashBackgroundColor: "#000000"
    }
  }
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
        <link rel="apple-touch-icon" href={APP_ICON} />
        <meta name="theme-color" content="#06B6D4" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Web3Provider>
          <FarcasterWrapper>
            {children}
          </FarcasterWrapper>
        </Web3Provider>
        <Analytics />
      </body>
    </html>
  );
}

export const metadata: Metadata = {
        title: "Cosmic Dungeon Archer",
        description: "Create a game inspired by Archero with token rewards for completed stages. Include WalletConnect integration for base.app and Farcaster support for farcaster.xyz.",
        other: { "fc:frame": JSON.stringify({"version":"next","imageUrl":"https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/thumbnail_cmkr700e4000004ky2sy17ssr-W84o4yRlVyhaszzmUlY2oYX2l79c3B","button":{"title":"Open with Ohara","action":{"type":"launch_frame","name":"Cosmic Dungeon Archer","url":"https://setting-obtain-611.app.ohara.ai","splashImageUrl":"https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/farcaster/splash_images/splash_image1.svg","splashBackgroundColor":"#ffffff"}}}
        ) }
    };
