/**
 * YouTubeMusicManager - Handles background music via YouTube IFrame API
 */

export class YouTubeMusicManager {
  private player: any = null;
  private isReady: boolean = false;
  private videoId: string = 'NM2Nuoztgoo';
  private volume: number = 30;
  private isPlaying: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initYouTubeAPI();
    }
  }

  private initYouTubeAPI(): void {
    // Check if API is already loaded
    if ((window as any).YT && (window as any).YT.Player) {
      this.createPlayer();
      return;
    }

    // Load YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    if (firstScriptTag && firstScriptTag.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    // API ready callback
    (window as any).onYouTubeIframeAPIReady = (): void => {
      this.createPlayer();
    };
  }

  private createPlayer(): void {
    try {
      // Create hidden iframe container
      let container = document.getElementById('youtube-player-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'youtube-player-container';
        container.style.position = 'absolute';
        container.style.top = '-9999px';
        container.style.left = '-9999px';
        container.style.width = '0';
        container.style.height = '0';
        document.body.appendChild(container);
      }

      this.player = new (window as any).YT.Player('youtube-player-container', {
        height: '0',
        width: '0',
        videoId: this.videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          loop: 1,
          playlist: this.videoId, // Required for looping
          mute: 0,
        },
        events: {
          onReady: (event: any): void => {
            this.isReady = true;
            this.player.setVolume(this.volume);
            console.log('YouTube player ready');
          },
          onStateChange: (event: any): void => {
            // Auto-replay when video ends
            if (event.data === (window as any).YT.PlayerState.ENDED) {
              this.player.playVideo();
            }
            if (event.data === (window as any).YT.PlayerState.PLAYING) {
              this.isPlaying = true;
            }
            if (event.data === (window as any).YT.PlayerState.PAUSED) {
              this.isPlaying = false;
            }
          },
          onError: (event: any): void => {
            console.error('YouTube player error:', event.data);
          },
        },
      });
    } catch (error) {
      console.error('Failed to create YouTube player:', error);
    }
  }

  play(): void {
    if (this.isReady && this.player && this.player.playVideo) {
      try {
        this.player.playVideo();
        this.isPlaying = true;
      } catch (error) {
        console.error('Failed to play YouTube video:', error);
      }
    }
  }

  pause(): void {
    if (this.isReady && this.player && this.player.pauseVideo) {
      try {
        this.player.pauseVideo();
        this.isPlaying = false;
      } catch (error) {
        console.error('Failed to pause YouTube video:', error);
      }
    }
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(100, volume));
    if (this.isReady && this.player && this.player.setVolume) {
      try {
        this.player.setVolume(this.volume);
      } catch (error) {
        console.error('Failed to set YouTube volume:', error);
      }
    }
  }

  getVolume(): number {
    return this.volume;
  }

  isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }

  stop(): void {
    if (this.isReady && this.player && this.player.stopVideo) {
      try {
        this.player.stopVideo();
        this.isPlaying = false;
      } catch (error) {
        console.error('Failed to stop YouTube video:', error);
      }
    }
  }

  dispose(): void {
    if (this.player && this.player.destroy) {
      try {
        this.player.destroy();
        this.player = null;
      } catch (error) {
        console.error('Failed to destroy YouTube player:', error);
      }
    }
    const container = document.getElementById('youtube-player-container');
    if (container) {
      container.remove();
    }
  }
}

// Singleton instance
let musicManagerInstance: YouTubeMusicManager | null = null;

export function getYouTubeMusicManager(): YouTubeMusicManager {
  if (!musicManagerInstance) {
    musicManagerInstance = new YouTubeMusicManager();
  }
  return musicManagerInstance;
}
