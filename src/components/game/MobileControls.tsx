'use client';

import { useState, useEffect } from 'react';

export function MobileControls(): JSX.Element | null {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(true);

  useEffect((): void => {
    setIsMobile(window.innerWidth < 768);
    
    // Hide hint after 5 seconds
    const timer = setTimeout((): void => {
      setShowHint(false);
    }, 5000);
    
    return (): void => {
      clearTimeout(timer);
    };
  }, []);

  if (!isMobile || !showHint) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute bottom-20 left-1/2 z-20 -translate-x-1/2 animate-pulse">
      <div className="rounded-lg border border-cyan-500/50 bg-black/80 px-4 py-2 text-center text-sm text-cyan-400">
        <div className="mb-1 font-bold">TOUCH CONTROLS</div>
        <div className="text-xs text-gray-400">
          Touch joystick to move • Release to auto-shoot
        </div>
      </div>
    </div>
  );
}
