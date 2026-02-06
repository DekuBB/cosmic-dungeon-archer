/**
 * AudioManager - Procedural 8-bit style sound effects using Web Audio API
 * Generates retro game sounds without external audio files
 */

export class AudioManager {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicVolume: number = 0.3;
  private sfxVolume: number = 0.5;
  private enabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        this.masterGain = this.audioContext.createGain();
        this.masterGain.connect(this.audioContext.destination);
        this.masterGain.gain.value = 1.0;
      } catch (e) {
        console.warn('Web Audio API not supported');
        this.enabled = false;
      }
    }
  }

  setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
  }

  setSFXVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }

  private createOscillator(
    type: OscillatorType,
    frequency: number,
    duration: number,
    volume: number = 1
  ): void {
    if (!this.audioContext || !this.masterGain || !this.enabled) return;

    const oscillator: OscillatorNode = this.audioContext.createOscillator();
    const gainNode: GainNode = this.audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;

    gainNode.gain.value = volume * this.sfxVolume;
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + duration
    );

    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Shooting sound - quick pew
  playShoot(): void {
    if (!this.audioContext || !this.enabled) return;
    const now: number = this.audioContext.currentTime;

    const osc: OscillatorNode = this.audioContext.createOscillator();
    const gain: GainNode = this.audioContext.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);

    gain.gain.setValueAtTime(0.2 * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    osc.connect(gain);
    gain.connect(this.masterGain!);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  // Enemy hit - sharp impact
  playHit(): void {
    if (!this.audioContext || !this.enabled) return;
    const now: number = this.audioContext.currentTime;

    const osc: OscillatorNode = this.audioContext.createOscillator();
    const gain: GainNode = this.audioContext.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.15);

    gain.gain.setValueAtTime(0.3 * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain!);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Player damaged - alarm
  playPlayerHurt(): void {
    if (!this.audioContext || !this.enabled) return;
    const now: number = this.audioContext.currentTime;

    for (let i: number = 0; i < 3; i++) {
      const osc: OscillatorNode = this.audioContext.createOscillator();
      const gain: GainNode = this.audioContext.createGain();

      osc.type = 'triangle';
      osc.frequency.value = 150 + i * 50;

      gain.gain.setValueAtTime(0.15 * this.sfxVolume, now + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.05 + 0.1);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.1);
    }
  }

  // Enemy death - explosion
  playExplosion(): void {
    if (!this.audioContext || !this.enabled) return;
    const now: number = this.audioContext.currentTime;

    // White noise burst
    const bufferSize: number = this.audioContext.sampleRate * 0.3;
    const buffer: AudioBuffer = this.audioContext.createBuffer(
      1,
      bufferSize,
      this.audioContext.sampleRate
    );
    const data: Float32Array = buffer.getChannelData(0);

    for (let i: number = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise: AudioBufferSourceNode = this.audioContext.createBufferSource();
    const noiseGain: GainNode = this.audioContext.createGain();
    const filter: BiquadFilterNode = this.audioContext.createBiquadFilter();

    noise.buffer = buffer;
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, now);
    filter.frequency.exponentialRampToValueAtTime(100, now + 0.3);

    noiseGain.gain.setValueAtTime(0.3 * this.sfxVolume, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain!);

    noise.start(now);
    noise.stop(now + 0.3);
  }

  // Pickup collection - coin
  playPickup(): void {
    if (!this.audioContext || !this.enabled) return;
    const now: number = this.audioContext.currentTime;

    const frequencies: number[] = [523.25, 659.25, 783.99]; // C5, E5, G5

    frequencies.forEach((freq: number, i: number): void => {
      const osc: OscillatorNode = this.audioContext!.createOscillator();
      const gain: GainNode = this.audioContext!.createGain();

      osc.type = 'sine';
      osc.frequency.value = freq;

      gain.gain.setValueAtTime(0.15 * this.sfxVolume, now + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.05 + 0.15);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.15);
    });
  }

  // Level up - fanfare
  playLevelUp(): void {
    if (!this.audioContext || !this.enabled) return;
    const now: number = this.audioContext.currentTime;

    const melody: number[] = [
      261.63, 293.66, 329.63, 392.0, 523.25, // C4, D4, E4, G4, C5
    ];

    melody.forEach((freq: number, i: number): void => {
      const osc: OscillatorNode = this.audioContext!.createOscillator();
      const gain: GainNode = this.audioContext!.createGain();

      osc.type = 'square';
      osc.frequency.value = freq;

      gain.gain.setValueAtTime(0.2 * this.sfxVolume, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.2);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.2);
    });
  }

  // Boss spawn - deep warning
  playBossSpawn(): void {
    if (!this.audioContext || !this.enabled) return;
    const now: number = this.audioContext.currentTime;

    const osc: OscillatorNode = this.audioContext.createOscillator();
    const gain: GainNode = this.audioContext.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 1);

    gain.gain.setValueAtTime(0.4 * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1);

    osc.connect(gain);
    gain.connect(this.masterGain!);

    osc.start(now);
    osc.stop(now + 1);
  }

  // Game over - descending tone
  playGameOver(): void {
    if (!this.audioContext || !this.enabled) return;
    const now: number = this.audioContext.currentTime;

    const osc: OscillatorNode = this.audioContext.createOscillator();
    const gain: GainNode = this.audioContext.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 1.5);

    gain.gain.setValueAtTime(0.3 * this.sfxVolume, now);
    gain.gain.linearRampToValueAtTime(0, now + 1.5);

    osc.connect(gain);
    gain.connect(this.masterGain!);

    osc.start(now);
    osc.stop(now + 1.5);
  }

  // Stage complete - victory
  playStageComplete(): void {
    if (!this.audioContext || !this.enabled) return;
    const now: number = this.audioContext.currentTime;

    const melody: number[] = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

    melody.forEach((freq: number, i: number): void => {
      const osc: OscillatorNode = this.audioContext!.createOscillator();
      const gain: GainNode = this.audioContext!.createGain();

      osc.type = 'sine';
      osc.frequency.value = freq;

      gain.gain.setValueAtTime(0.25 * this.sfxVolume, now + i * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.3);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now + i * 0.15);
      osc.stop(now + i * 0.15 + 0.3);
    });
  }

  // Ambient background music (optional)
  playBackgroundMusic(): void {
    if (!this.audioContext || !this.enabled || !this.masterGain) return;

    const now: number = this.audioContext.currentTime;
    const musicGain: GainNode = this.audioContext.createGain();
    musicGain.gain.value = this.musicVolume * 0.1;
    musicGain.connect(this.masterGain);

    // Simple arpeggio pattern (C major)
    const notes: number[] = [261.63, 329.63, 392.0, 523.25]; // C4, E4, G4, C5
    let noteIndex: number = 0;

    const playNote = (): void => {
      if (!this.audioContext || !this.enabled) return;

      const osc: OscillatorNode = this.audioContext.createOscillator();
      const noteGain: GainNode = this.audioContext.createGain();

      osc.type = 'sine';
      osc.frequency.value = notes[noteIndex % notes.length];

      noteGain.gain.setValueAtTime(0.05, this.audioContext.currentTime);
      noteGain.gain.exponentialRampToValueAtTime(
        0.01,
        this.audioContext.currentTime + 0.5
      );

      osc.connect(noteGain);
      noteGain.connect(musicGain);

      osc.start(this.audioContext.currentTime);
      osc.stop(this.audioContext.currentTime + 0.5);

      noteIndex++;

      if (noteIndex < 32 && this.enabled) {
        setTimeout(playNote, 250);
      }
    };

    playNote();
  }

  dispose(): void {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.enabled = false;
  }
}

// Singleton instance
let audioManagerInstance: AudioManager | null = null;

export function getAudioManager(): AudioManager {
  if (!audioManagerInstance) {
    audioManagerInstance = new AudioManager();
  }
  return audioManagerInstance;
}
