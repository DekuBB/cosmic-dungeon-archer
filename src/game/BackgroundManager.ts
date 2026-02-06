import * as Phaser from 'phaser';

/**
 * BackgroundManager - Handles dynamic background rendering
 * Creates procedural backgrounds that change with stage progression
 */
export class BackgroundManager {
  private scene: Phaser.Scene;
  private backgroundLayer: Phaser.GameObjects.Container;
  private currentStage: number = 1;
  private particles: Phaser.GameObjects.Arc[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.backgroundLayer = scene.add.container(0, 0);
    this.backgroundLayer.setDepth(-100);
    this.renderBackground(1);
  }

  public updateStage(stage: number): void {
    if (stage !== this.currentStage) {
      this.currentStage = stage;
      this.transitionBackground(stage);
    }
  }

  private transitionBackground(stage: number): void {
    // Fade out current background
    this.scene.tweens.add({
      targets: this.backgroundLayer,
      alpha: 0,
      duration: 500,
      onComplete: (): void => {
        this.clearBackground();
        this.renderBackground(stage);
        // Fade in new background
        this.scene.tweens.add({
          targets: this.backgroundLayer,
          alpha: 1,
          duration: 500,
        });
      },
    });
  }

  private clearBackground(): void {
    this.backgroundLayer.removeAll(true);
    this.particles = [];
  }

  private renderBackground(stage: number): void {
    const width: number = 720;
    const height: number = 1280;

    if (stage <= 3) {
      // Crystal Cave (Stages 1-3)
      this.renderCrystalCave(width, height);
    } else if (stage <= 6) {
      // Lava Dungeon (Stages 4-6)
      this.renderLavaDungeon(width, height);
    } else {
      // Cosmic Islands (Stages 7+)
      this.renderCosmicIslands(width, height);
    }
  }

  private renderCrystalCave(width: number, height: number): void {
    // Dark cave background
    const bg = this.scene.add.rectangle(width / 2, height / 2, width, height, 0x0A0A0A);
    this.backgroundLayer.add(bg);

    // Glowing crystals (cyan/purple)
    for (let i: number = 0; i < 15; i++) {
      const x: number = Math.random() * width;
      const y: number = Math.random() * height;
      const size: number = 10 + Math.random() * 20;
      const color: number = Math.random() > 0.5 ? 0x00CCFF : 0x9966FF;
      
      const crystal = this.scene.add.polygon(x, y, [
        [0, -size], [size * 0.3, -size * 0.3], [size * 0.5, 0], 
        [size * 0.3, size * 0.3], [0, size], [-size * 0.3, size * 0.3],
        [-size * 0.5, 0], [-size * 0.3, -size * 0.3]
      ], color, 0.3);
      
      this.backgroundLayer.add(crystal);
      
      // Glow animation
      this.scene.tweens.add({
        targets: crystal,
        alpha: 0.6,
        duration: 1500 + Math.random() * 1000,
        yoyo: true,
        repeat: -1,
      });
    }

    // Floating particles (dust/sparkles)
    this.createAmbientParticles(width, height, 0x88CCFF, 30);
  }

  private renderLavaDungeon(width: number, height: number): void {
    // Dark stone background
    const bg = this.scene.add.rectangle(width / 2, height / 2, width, height, 0x1A0A00);
    this.backgroundLayer.add(bg);

    // Stone pillars
    for (let i: number = 0; i < 8; i++) {
      const x: number = (i % 4) * (width / 3) + 50;
      const y: number = Math.floor(i / 4) * (height / 2) + 200;
      const pillar = this.scene.add.rectangle(x, y, 40, 150, 0x3A3A3A, 0.4);
      this.backgroundLayer.add(pillar);
    }

    // Lava glow spots
    for (let i: number = 0; i < 12; i++) {
      const x: number = Math.random() * width;
      const y: number = height - 200 + Math.random() * 200;
      const lavaGlow = this.scene.add.circle(x, y, 30 + Math.random() * 40, 0xFF4500, 0.3);
      this.backgroundLayer.add(lavaGlow);
      
      // Pulsing lava
      this.scene.tweens.add({
        targets: lavaGlow,
        alpha: 0.6,
        scale: 1.2,
        duration: 1000 + Math.random() * 1000,
        yoyo: true,
        repeat: -1,
      });
    }

    // Heat particles (embers rising)
    this.createAmbientParticles(width, height, 0xFFAA00, 25, true);
  }

  private renderCosmicIslands(width: number, height: number): void {
    // Deep space background
    const bg = this.scene.add.rectangle(width / 2, height / 2, width, height, 0x000011);
    this.backgroundLayer.add(bg);

    // Stars
    for (let i: number = 0; i < 80; i++) {
      const x: number = Math.random() * width;
      const y: number = Math.random() * height;
      const size: number = 1 + Math.random() * 2;
      const star = this.scene.add.circle(x, y, size, 0xFFFFFF, 0.8);
      this.backgroundLayer.add(star);
      
      // Twinkling
      this.scene.tweens.add({
        targets: star,
        alpha: 0.3,
        duration: 1000 + Math.random() * 2000,
        yoyo: true,
        repeat: -1,
      });
    }

    // Floating islands (silhouettes)
    for (let i: number = 0; i < 5; i++) {
      const x: number = Math.random() * width;
      const y: number = 200 + Math.random() * 800;
      const islandWidth: number = 80 + Math.random() * 100;
      const island = this.scene.add.ellipse(x, y, islandWidth, islandWidth * 0.4, 0x1A1A3A, 0.5);
      this.backgroundLayer.add(island);
      
      // Floating motion
      this.scene.tweens.add({
        targets: island,
        y: y - 20,
        duration: 3000 + Math.random() * 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }

    // Nebula clouds
    for (let i: number = 0; i < 6; i++) {
      const x: number = Math.random() * width;
      const y: number = Math.random() * height;
      const nebula = this.scene.add.ellipse(x, y, 150 + Math.random() * 100, 100 + Math.random() * 80, 0x6600FF, 0.15);
      this.backgroundLayer.add(nebula);
    }

    // Cosmic particles (stardust)
    this.createAmbientParticles(width, height, 0x66CCFF, 40);
  }

  private createAmbientParticles(width: number, height: number, color: number, count: number, rising: boolean = false): void {
    for (let i: number = 0; i < count; i++) {
      const x: number = Math.random() * width;
      const y: number = Math.random() * height;
      const particle = this.scene.add.circle(x, y, 1 + Math.random() * 2, color, 0.4 + Math.random() * 0.4);
      this.backgroundLayer.add(particle);
      this.particles.push(particle);
      
      if (rising) {
        // Rising motion (for lava embers)
        this.scene.tweens.add({
          targets: particle,
          y: y - 200 - Math.random() * 300,
          alpha: 0,
          duration: 3000 + Math.random() * 2000,
          repeat: -1,
          onRepeat: (): void => {
            particle.y = height + 20;
            particle.alpha = 0.4 + Math.random() * 0.4;
          },
        });
      } else {
        // Floating motion
        this.scene.tweens.add({
          targets: particle,
          x: x + (Math.random() - 0.5) * 100,
          y: y + (Math.random() - 0.5) * 100,
          duration: 4000 + Math.random() * 3000,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });
      }
    }
  }

  public destroy(): void {
    this.clearBackground();
    this.backgroundLayer.destroy();
  }
}
