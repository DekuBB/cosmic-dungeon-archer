'use client';

import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class GameErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Game crashed:', error, errorInfo);
  }

  private handleRestart = (): void => {
    window.location.reload();
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen items-center justify-center bg-black">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold text-red-500">
              ⚠️ NEURAL INTERFACE MALFUNCTION
            </h1>
            <p className="mb-2 text-gray-400">
              Critical System Error Detected
            </p>
            <p className="mb-8 text-sm text-gray-500">
              {this.state.error?.message || 'Unknown error occurred'}
            </p>
            <button
              onClick={this.handleRestart}
              className="rounded-lg bg-cyan-500 px-6 py-3 font-bold text-black transition-colors hover:bg-cyan-600"
            >
              🔄 RESTART GAME
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
