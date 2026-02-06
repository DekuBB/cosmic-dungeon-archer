import * as Phaser from 'phaser';
import type { PlayerStats, Perk } from '@/types/game';
import { useGameStore } from '@/stores/game-store';
import { GAME_CONFIG, ENEMY_CONFIGS, TIMINGS, COLORS } from '@/lib/game-config';
import { getRandomPerks } from '@/lib/perks';
import { SpriteRenderer } from './SpriteRenderer';
import { BackgroundManager } from './BackgroundManager';
import { getAudioManager } from './AudioManager';
import { getYouTubeMusicManager } from './YouTubeMusicManager';
// @ts-ignore - Rex plugins types
import VirtualJoyStickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';

export class MainScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Container;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: { [key: string]: Phaser.Input.Keyboard.Key };
  private joystick: any;
  
  private enemies!: Phaser.GameObjects.Group;
  private projectiles!: Phaser.GameObjects.Group;
  private enemyProjectiles!: Phaser.GameObjects.Group;
  private pickups!: Phaser.GameObjects.Group;
  
  private invulnerabilityTimer: number = 0;
  private weaponCooldown: number = 0;
  private difficultyScore: number = 0;
  private spawnTimer: number = 0;
  
  private appliedPerks: Set<string> = new Set();
  private bloodthirstStacks: number = 0;
  private hasGuardianAngel: boolean = false;
  
  private backgroundManager!: BackgroundManager;
  private lastStage: number = 1;
  private audioManager = getAudioManager();
  private musicManager = getYouTubeMusicManager();
  private isMobile: boolean = false;
  
  constructor() {
    super({ key: 'MainScene' });
  }

  preload(): void {
    // No assets needed - using procedural graphics
  }

  create(): void {
    // Setup world
    this.cameras.main.setBackgroundColor(GAME_CONFIG.backgroundColor);
    
    // Detect mobile device
    this.isMobile = !this.sys.game.device.os.desktop;
    
    // Initialize background manager
    this.backgroundManager = new BackgroundManager(this);
    
    // Create player sprite
    this.player = SpriteRenderer.createPlayerSprite(
      this,
      GAME_CONFIG.width / 2,
      GAME_CONFIG.height / 2
    );
    
    // Setup input
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = {
      up: this.input.keyboard!.addKey('W'),
      down: this.input.keyboard!.addKey('S'),
      left: this.input.keyboard!.addKey('A'),
      right: this.input.keyboard!.addKey('D'),
    };
    
    // Setup joystick for mobile
    if (!this.sys.game.device.os.desktop) {
      const rexUI = (this.plugins.get('rexVirtualJoyStick') as any);
      if (rexUI) {
        this.joystick = rexUI.add(this, {
          x: 150,
          y: GAME_CONFIG.height - 150,
          radius: 60,
          base: this.add.circle(0, 0, 60, 0x1A1A1A, 0.5),
          thumb: this.add.circle(0, 0, 30, COLORS.neonCyan, 0.8),
          forceMin: 0,
        });
      }
    }
    
    // Create groups
    this.enemies = this.add.group();
    this.projectiles = this.add.group();
    this.enemyProjectiles = this.add.group();
    this.pickups = this.add.group();
    
    // Start background music with delay to ensure YouTube API is loaded
    setTimeout(() => {
      try {
        this.musicManager.play();
      } catch (error) {
        console.error('Failed to start music:', error);
      }
    }, 2000);
    
    // Check for level up
    this.events.on('update', this.checkLevelUp, this);
  }

  update(time: number, delta: number): void {
    const state = useGameStore.getState();
    
    if (state.isPaused || !state.isAlive) {
      return;
    }
    
    // Update background based on dungeon (5 stages per dungeon)
    const dungeonStage = (state.currentDungeon - 1) * 5 + state.currentStage;
    if (dungeonStage !== this.lastStage) {
      this.backgroundManager.updateStage(dungeonStage);
      this.lastStage = dungeonStage;
    }
    
    // Update timers
    this.invulnerabilityTimer = Math.max(0, this.invulnerabilityTimer - delta);
    this.weaponCooldown = Math.max(0, this.weaponCooldown - delta);
    this.spawnTimer += delta;
    this.difficultyScore += delta / 1000;
    
    // Handle input and movement
    this.handleMovement(state.playerStats);
    
    // Update enemy AI
    this.updateEnemies(delta);
    
    // Update projectiles
    this.updateProjectiles();
    this.updateEnemyProjectiles();
    
    // Check collisions
    this.checkCollisions(state.playerStats);
    
    // Handle spawning
    if (this.spawnTimer >= GAME_CONFIG.spawnInterval) {
      this.spawnTimer = 0;
      this.spawnEnemies();
    }
    
    // Collect pickups
    this.collectPickups(state.playerStats);
  }

  private handleMovement(stats: PlayerStats): void {
    let velocityX: number = 0;
    let velocityY: number = 0;
    
    // Desktop keyboard input
    if (this.cursors.left.isDown || this.wasd.left.isDown) {
      velocityX = -1;
    } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
      velocityX = 1;
    }
    
    if (this.cursors.up.isDown || this.wasd.up.isDown) {
      velocityY = -1;
    } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
      velocityY = 1;
    }
    
    // Mobile joystick input
    if (this.joystick) {
      const force = this.joystick.force;
      if (force > GAME_CONFIG.joystickDeadzone) {
        velocityX = this.joystick.forceX;
        velocityY = this.joystick.forceY;
      }
    }
    
    // Normalize diagonal movement
    const magnitude: number = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
    const isMoving: boolean = magnitude > GAME_CONFIG.joystickDeadzone;
    
    if (isMoving && magnitude > 0) {
      velocityX = (velocityX / magnitude) * stats.baseMoveSpeed;
      velocityY = (velocityY / magnitude) * stats.baseMoveSpeed;
      
      // Update position
      this.player.x = Phaser.Math.Clamp(
        this.player.x + velocityX * (1 / 60),
        20,
        GAME_CONFIG.width - 20
      );
      this.player.y = Phaser.Math.Clamp(
        this.player.y + velocityY * (1 / 60),
        20,
        GAME_CONFIG.height - 20
      );
      
      // Set moving state
      useGameStore.getState().setMoving(true);
      
      // Visual feedback - ghost mode
      this.player.setAlpha(0.8);
    } else {
      // Stopped - can shoot
      useGameStore.getState().setMoving(false);
      this.player.setAlpha(1);
      
      // Auto-shoot
      if (this.weaponCooldown <= 0) {
        this.shootAtNearestEnemy(stats);
      }
    }
  }

  private shootAtNearestEnemy(stats: PlayerStats): void {
    const enemies = this.enemies.getChildren() as Phaser.GameObjects.Container[];
    if (enemies.length === 0) return;
    
    // Find nearest enemy
    let nearestEnemy: Phaser.GameObjects.Container | null = null;
    let nearestDistance: number = Infinity;
    
    enemies.forEach((enemy: Phaser.GameObjects.Container): void => {
      const distance: number = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        enemy.x,
        enemy.y
      );
      
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestEnemy = enemy;
      }
    });
    
    if (nearestEnemy) {
      // Calculate direction
      const angle: number = Phaser.Math.Angle.Between(
        this.player.x,
        this.player.y,
        nearestEnemy.x,
        nearestEnemy.y
      );
      
      // Check for multishot perk
      const hasMultishot: boolean = this.appliedPerks.has('multishot');
      const projectileCount: number = hasMultishot ? 3 : 1;
      
      for (let i: number = 0; i < projectileCount; i++) {
        const spreadAngle: number = hasMultishot ? (i - 1) * 0.3 : 0;
        const finalAngle: number = angle + spreadAngle;
        
        const projectile = this.add.circle(
          this.player.x,
          this.player.y,
          GAME_CONFIG.projectileSize,
          COLORS.neonWhite
        );
        
        (projectile as any).damage = stats.damage * (1 + this.bloodthirstStacks * 0.1);
        (projectile as any).velocityX = Math.cos(finalAngle) * GAME_CONFIG.projectileSpeed;
        (projectile as any).velocityY = Math.sin(finalAngle) * GAME_CONFIG.projectileSpeed;
        (projectile as any).piercing = this.appliedPerks.has('piercing');
        
        this.projectiles.add(projectile);
      }
      
      // Reset cooldown
      this.weaponCooldown = 1000 / stats.attackSpeed;
      
      // Audio + visual feedback
      this.audioManager.playShoot();
      this.cameras.main.shake(50, 0.002);
    }
  }

  private updateProjectiles(): void {
    const projectiles = this.projectiles.getChildren() as Phaser.GameObjects.Arc[];
    
    // Cleanup old projectiles if too many (performance optimization)
    if (projectiles.length > 200) {
      projectiles.slice(0, 100).forEach(p => p.destroy());
    }
    
    projectiles.forEach((projectile: Phaser.GameObjects.Arc): void => {
      const vx = (projectile as any).velocityX;
      const vy = (projectile as any).velocityY;
      
      projectile.x += vx * (1 / 60);
      projectile.y += vy * (1 / 60);
      
      // Remove if out of bounds
      if (
        projectile.x < 0 ||
        projectile.x > GAME_CONFIG.width ||
        projectile.y < 0 ||
        projectile.y > GAME_CONFIG.height
      ) {
        projectile.destroy();
      }
    });
  }

  private updateEnemyProjectiles(): void {
    const projectiles = this.enemyProjectiles.getChildren() as Phaser.GameObjects.Container[];
    
    // Cleanup old enemy projectiles if too many
    if (projectiles.length > 150) {
      projectiles.slice(0, 75).forEach(p => p.destroy());
    }
    
    projectiles.forEach((projectile: Phaser.GameObjects.Container): void => {
      const vx = (projectile as any).velocityX;
      const vy = (projectile as any).velocityY;
      
      projectile.x += vx * (1 / 60);
      projectile.y += vy * (1 / 60);
      
      // Remove if out of bounds
      if (
        projectile.x < -50 ||
        projectile.x > GAME_CONFIG.width + 50 ||
        projectile.y < -50 ||
        projectile.y > GAME_CONFIG.height + 50
      ) {
        projectile.destroy();
      }
    });
  }

  private updateEnemies(delta: number): void {
    const enemies = this.enemies.getChildren() as Phaser.GameObjects.Container[];
    
    enemies.forEach((enemy: Phaser.GameObjects.Container): void => {
      const enemyData = (enemy as any).enemyData;
      if (!enemyData) return;
      
      const aiPattern = enemyData.aiPattern || 'zigzag';
      
      switch (aiPattern) {
        case 'zigzag':
          // Bat - zigzag toward player
          this.updateBatAI(enemy, enemyData, delta);
          break;
        case 'shoot':
          // Goblin - move and shoot
          this.updateGoblinAI(enemy, enemyData, delta);
          break;
        case 'charge':
          // Orc - slow charge
          this.updateOrcAI(enemy, enemyData, delta);
          break;
        case 'boss':
          // Dragon - boss pattern
          this.updateDragonAI(enemy, enemyData, delta);
          break;
      }
    });
  }

  private updateBatAI(enemy: Phaser.GameObjects.Container, enemyData: any, delta: number): void {
    // Zigzag movement
    const angle: number = Phaser.Math.Angle.Between(
      enemy.x,
      enemy.y,
      this.player.x,
      this.player.y
    );
    
    // Add sine wave for zigzag
    const time = this.time.now / 1000;
    const zigzagOffset = Math.sin(time * 5 + enemy.x) * 50;
    
    enemy.x += Math.cos(angle) * enemyData.speed * (1 / 60);
    enemy.y += Math.sin(angle) * enemyData.speed * (1 / 60) + zigzagOffset * (1 / 60);
  }

  private updateGoblinAI(enemy: Phaser.GameObjects.Container, enemyData: any, delta: number): void {
    // Move toward player
    const angle: number = Phaser.Math.Angle.Between(
      enemy.x,
      enemy.y,
      this.player.x,
      this.player.y
    );
    
    enemy.x += Math.cos(angle) * enemyData.speed * (1 / 60);
    enemy.y += Math.sin(angle) * enemyData.speed * (1 / 60);
    
    // Shoot projectile every 2 seconds
    if (!enemyData.shootCooldown) {
      enemyData.shootCooldown = 0;
    }
    
    enemyData.shootCooldown -= delta;
    
    if (enemyData.shootCooldown <= 0) {
      enemyData.shootCooldown = 2000;
      
      // Shoot at player
      const projectile = SpriteRenderer.createEnemyProjectile(
        this,
        enemy.x,
        enemy.y,
        enemyData.color
      );
      
      const shootAngle: number = Phaser.Math.Angle.Between(
        enemy.x,
        enemy.y,
        this.player.x,
        this.player.y
      );
      
      (projectile as any).velocityX = Math.cos(shootAngle) * 300;
      (projectile as any).velocityY = Math.sin(shootAngle) * 300;
      (projectile as any).damage = enemyData.damage * 0.5;
      
      this.enemyProjectiles.add(projectile);
    }
  }

  private updateOrcAI(enemy: Phaser.GameObjects.Container, enemyData: any, delta: number): void {
    // Slow charge toward player
    const angle: number = Phaser.Math.Angle.Between(
      enemy.x,
      enemy.y,
      this.player.x,
      this.player.y
    );
    
    enemy.x += Math.cos(angle) * enemyData.speed * (1 / 60);
    enemy.y += Math.sin(angle) * enemyData.speed * (1 / 60);
    
    // Rotate enemy to face player
    enemy.setRotation(angle);
  }

  private updateDragonAI(enemy: Phaser.GameObjects.Container, enemyData: any, delta: number): void {
    // Boss pattern - circular movement + 360° fire breath
    if (!enemyData.bossTimer) {
      enemyData.bossTimer = 0;
    }
    
    enemyData.bossTimer += delta;
    
    // Circular movement
    const centerX = GAME_CONFIG.width / 2;
    const centerY = GAME_CONFIG.height / 2;
    const radius = 200;
    const circleSpeed = 0.5;
    
    enemy.x = centerX + Math.cos(enemyData.bossTimer / 1000 * circleSpeed) * radius;
    enemy.y = centerY + Math.sin(enemyData.bossTimer / 1000 * circleSpeed) * radius;
    
    // Fire breath every 3 seconds (360° pattern)
    if (!enemyData.breathCooldown) {
      enemyData.breathCooldown = 0;
    }
    
    enemyData.breathCooldown -= delta;
    
    if (enemyData.breathCooldown <= 0) {
      enemyData.breathCooldown = 3000;
      
      // Shoot 8 projectiles in circle
      for (let i: number = 0; i < 8; i++) {
        const breathAngle: number = (i / 8) * Math.PI * 2;
        
        const projectile = SpriteRenderer.createEnemyProjectile(
          this,
          enemy.x,
          enemy.y,
          0xFF6600
        );
        
        (projectile as any).velocityX = Math.cos(breathAngle) * 250;
        (projectile as any).velocityY = Math.sin(breathAngle) * 250;
        (projectile as any).damage = enemyData.damage * 0.7;
        
        this.enemyProjectiles.add(projectile);
      }
      
      // Screen shake for boss attack
      this.cameras.main.shake(300, 0.01);
    }
  }

  private checkCollisions(stats: PlayerStats): void {
    const projectiles = this.projectiles.getChildren() as Phaser.GameObjects.Arc[];
    const enemies = this.enemies.getChildren() as Phaser.GameObjects.Container[];
    const enemyProjs = this.enemyProjectiles.getChildren() as Phaser.GameObjects.Container[];
    
    // Player projectile vs Enemy
    projectiles.forEach((projectile: Phaser.GameObjects.Arc): void => {
      enemies.forEach((enemy: Phaser.GameObjects.Container): void => {
        const distance: number = Phaser.Math.Distance.Between(
          projectile.x,
          projectile.y,
          enemy.x,
          enemy.y
        );
        
        const enemyData = (enemy as any).enemyData;
        if (distance < 30 && enemyData) {
          // Hit!
          enemyData.health -= (projectile as any).damage;
          this.audioManager.playHit();
          
          if (enemyData.health <= 0) {
            this.onEnemyDeath(enemy);
          }
          
          // Remove projectile unless piercing
          if (!(projectile as any).piercing) {
            projectile.destroy();
          }
        }
      });
    });
    
    // Enemy projectile vs Player
    if (this.invulnerabilityTimer <= 0) {
      enemyProjs.forEach((projectile: Phaser.GameObjects.Container): void => {
        const distance: number = Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          projectile.x,
          projectile.y
        );
        
        if (distance < 20) {
          this.onPlayerHit((projectile as any).damage || 10);
          projectile.destroy();
        }
      });
    }
    
    // Enemy vs Player (melee)
    if (this.invulnerabilityTimer <= 0) {
      enemies.forEach((enemy: Phaser.GameObjects.Container): void => {
        const distance: number = Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          enemy.x,
          enemy.y
        );
        
        const hitboxRadius: number = 15 * GAME_CONFIG.playerHitboxRatio;
        const enemyData = (enemy as any).enemyData;
        
        if (distance < hitboxRadius + enemyData.size && enemyData) {
          this.onPlayerHit(enemyData.damage);
        }
      });
    }
  }

  private onEnemyDeath(enemy: Phaser.GameObjects.Container): void {
    const state = useGameStore.getState();
    const enemyData = (enemy as any).enemyData;
    
    // Audio feedback
    this.audioManager.playExplosion();
    
    // Visual feedback - particle burst (less particles on mobile)
    const particleCount = this.isMobile ? 6 : 12;
    for (let i: number = 0; i < particleCount; i++) {
      const angle: number = (i / 12) * Math.PI * 2;
      const particle = this.add.circle(
        enemy.x,
        enemy.y,
        3,
        enemyData.color
      );
      
      (particle as any).velocityX = Math.cos(angle) * 200;
      (particle as any).velocityY = Math.sin(angle) * 200;
      
      this.tweens.add({
        targets: particle,
        alpha: 0,
        duration: 300,
        onComplete: (): void => {
          particle.destroy();
        },
      });
    }
    
    // Spawn XP gem
    const xpGem = SpriteRenderer.createXPGemSprite(this, enemy.x, enemy.y);
    (xpGem as any).type = 'xp';
    (xpGem as any).value = enemyData.type === 'dragon' ? 100 : 10;
    this.pickups.add(xpGem);
    
    // Random token drop (more for boss)
    const tokenChance = enemyData.type === 'dragon' ? 1 : GAME_CONFIG.tokenDropRate;
    if (Math.random() < tokenChance * (this.appliedPerks.has('token_multiplier') ? 2 : 1)) {
      const tokenValue = enemyData.type === 'dragon' ? 10 : 1;
      const tokenOrb = SpriteRenderer.createTokenSprite(this, enemy.x, enemy.y);
      (tokenOrb as any).type = 'token';
      (tokenOrb as any).value = tokenValue;
      this.pickups.add(tokenOrb);
    }
    
    // Update stats
    state.incrementKills();
    
    // Bloodthirst stacks
    if (this.appliedPerks.has('bloodthirst')) {
      this.bloodthirstStacks++;
    }
    
    // Lifesteal
    if (this.appliedPerks.has('lifesteal')) {
      state.heal(2);
    }
    
    enemy.destroy();
    
    // Screen shake
    this.cameras.main.shake(100, 0.005);
  }

  private onPlayerHit(damage: number): void {
    const state = useGameStore.getState();
    
    // Audio feedback
    this.audioManager.playPlayerHurt();
    
    // Guardian Angel check
    if (state.playerStats.health - damage <= 0 && this.hasGuardianAngel) {
      this.hasGuardianAngel = false;
      state.heal(state.playerStats.maxHealth * 0.5);
      this.invulnerabilityTimer = 3000;
      return;
    }
    
    state.takeDamage(damage);
    this.invulnerabilityTimer = TIMINGS.invulnerabilityWindow;
    
    // Visual feedback
    this.cameras.main.shake(200, 0.01);
    this.cameras.main.flash(100, 255, 0, 0);
  }

  private collectPickups(stats: PlayerStats): void {
    const pickups = this.pickups.getChildren() as Phaser.GameObjects.Container[];
    const state = useGameStore.getState();
    
    pickups.forEach((pickup: Phaser.GameObjects.Container): void => {
      const distance: number = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        pickup.x,
        pickup.y
      );
      
      if (distance < stats.pickupRadius) {
        const pickupData = pickup as any;
        
        if (pickupData.type === 'xp') {
          state.addXP(pickupData.value);
          this.audioManager.playPickup();
        } else if (pickupData.type === 'token') {
          state.addTokens(pickupData.value);
          this.audioManager.playPickup();
        }
        
        pickup.destroy();
      }
    });
  }

  private spawnEnemies(): void {
    const state = useGameStore.getState();
    const activeBudget: number = this.difficultyScore;
    const currentCost: number = this.enemies.getLength();
    const availableBudget: number = activeBudget - currentCost;
    
    if (availableBudget < 1) return;
    
    // Spawn dragon boss on stage 5 of each dungeon
    const shouldSpawnBoss = state.currentStage === 5 && !this.enemies.getChildren().some((e: any) => e.enemyData?.type === 'dragon');
    
    let enemyType: string;
    if (shouldSpawnBoss && availableBudget >= ENEMY_CONFIGS.dragon.cost) {
      enemyType = 'dragon';
    } else {
      // Random spawn from available types
      const enemyTypes: string[] = ['bat', 'goblin', 'orc'];
      enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    }
    
    const config = ENEMY_CONFIGS[enemyType as keyof typeof ENEMY_CONFIGS];
    
    if (config.cost <= availableBudget) {
      // Random spawn position at edge (unless boss)
      let x: number = 0;
      let y: number = 0;
      
      if (enemyType === 'dragon') {
        // Boss spawns at top center
        x = GAME_CONFIG.width / 2;
        y = 100;
        this.audioManager.playBossSpawn();
      } else {
        const side: number = Math.floor(Math.random() * 4);
        
        switch (side) {
          case 0: // Top
            x = Math.random() * GAME_CONFIG.width;
            y = -20;
            break;
          case 1: // Right
            x = GAME_CONFIG.width + 20;
            y = Math.random() * GAME_CONFIG.height;
            break;
          case 2: // Bottom
            x = Math.random() * GAME_CONFIG.width;
            y = GAME_CONFIG.height + 20;
            break;
          case 3: // Left
            x = -20;
            y = Math.random() * GAME_CONFIG.height;
            break;
        }
      }
      
      // Create appropriate sprite
      let enemy: Phaser.GameObjects.Container;
      switch (enemyType) {
        case 'bat':
          enemy = SpriteRenderer.createBatSprite(this, x, y);
          break;
        case 'goblin':
          enemy = SpriteRenderer.createGoblinSprite(this, x, y);
          break;
        case 'orc':
          enemy = SpriteRenderer.createOrcSprite(this, x, y);
          break;
        case 'dragon':
          enemy = SpriteRenderer.createDragonSprite(this, x, y);
          break;
        default:
          enemy = SpriteRenderer.createBatSprite(this, x, y);
      }
      
      (enemy as any).enemyData = {
        ...config,
        health: config.health,
      };
      
      this.enemies.add(enemy);
    }
  }

  private checkLevelUp(): void {
    const state = useGameStore.getState();
    const prevLevel: number = (this as any).lastLevel || 1;
    const prevDrafting: boolean = (this as any).wasDrafting || false;
    
    if (state.level > prevLevel && !state.isDrafting) {
      // Level up! Start draft
      this.audioManager.playLevelUp();
      const perks: Perk[] = getRandomPerks(3);
      state.startDraft(perks);
      (this as any).lastLevel = state.level;
    }
    
    // Check if draft just ended (perk was selected)
    if (prevDrafting && !state.isDrafting) {
      // A perk was just selected, apply it
      const lastSelectedPerk: Perk | undefined = (this as any).lastSelectedPerk;
      if (lastSelectedPerk) {
        this.applySelectedPerk(lastSelectedPerk);
        (this as any).lastSelectedPerk = undefined;
      }
    }
    
    (this as any).wasDrafting = state.isDrafting;
  }

  public applySelectedPerk(perk: Perk): void {
    this.appliedPerks.add(perk.id);
    
    // Special perk handling
    if (perk.id === 'guardian_angel') {
      this.hasGuardianAngel = true;
    }
    
    // Store for later reference
    (this as any).lastSelectedPerk = perk;
  }
}
