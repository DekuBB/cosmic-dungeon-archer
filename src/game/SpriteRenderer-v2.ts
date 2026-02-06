import * as Phaser from 'phaser';

/**
 * SpriteRenderer V2 - Enhanced sprites with uploaded character art style
 */
export class SpriteRenderer {
  /**
   * Create player sprite (archer hero based on uploaded art)
   */
  static createPlayerSprite(scene: Phaser.Scene, x: number, y: number): Phaser.GameObjects.Container {
    const container = scene.add.container(x, y);
    
    // Create sprite from uploaded image
    const heroImage = scene.add.image(0, 0, 'hero-sprite');
    heroImage.setScale(0.15); // Adjust scale as needed
    
    // Fallback if image not loaded - create procedural sprite
    if (!scene.textures.exists('hero-sprite')) {
      // Body (armored archer - cyan/blue palette)
      const body = scene.add.ellipse(0, 2, 20, 28, 0x0088FF);
      const armor = scene.add.ellipse(0, -2, 18, 12, 0x00CCFF);
      
      // Head (archer helmet)
      const head = scene.add.circle(0, -16, 10, 0xFFDDAA);
      const helmet = scene.add.arc(0, -18, 11, 180, 0, false, 0x4682B4);
      helmet.setStrokeStyle(2, 0x1E3A8A);
      
      // Bow (detailed)
      const bowBody = scene.add.ellipse(10, 0, 8, 24, 0x8B4513);
      bowBody.setStrokeStyle(2, 0x654321);
      const bowString = scene.add.line(0, 0, 10, -10, 10, 10, 0xC0C0C0);
      bowString.setLineWidth(1);
      
      // Arrow ready
      const arrow = scene.add.polygon(0, 0, [
        [-8, 0], [8, 0], [10, -2], [8, 0], [10, 2]
      ], 0xFFDD00);
      const arrowGlow = scene.add.circle(8, 0, 4, 0x00FFFF, 0.5);
      
      // Cape
      const cape = scene.add.triangle(0, 0, -6, 0, -12, 12, -2, 8, 0x0066CC);
      
      container.add([cape, bowBody, bowString, body, armor, head, helmet, arrow, arrowGlow]);
    } else {
      container.add(heroImage);
    }
    
    return container;
  }

  /**
   * Create bat enemy sprite (fantasy style)
   */
  static createBatSprite(scene: Phaser.Scene, x: number, y: number): Phaser.GameObjects.Container {
    const container = scene.add.container(x, y);
    
    // Body (dark purple)
    const body = scene.add.ellipse(0, 0, 20, 14, 0x6A0DAD);
    body.setStrokeStyle(2, 0x4B0082);
    
    // Wings (detailed bat wings)
    const leftWing = scene.add.polygon(0, 0, [
      [-6, 0], [-12, -6], [-18, -4], [-16, 2], [-10, 4]
    ], 0x4B0082);
    const rightWing = scene.add.polygon(0, 0, [
      [6, 0], [12, -6], [18, -4], [16, 2], [10, 4]
    ], 0x4B0082);
    
    // Ears
    const leftEar = scene.add.triangle(0, 0, -4, -6, -6, -10, -2, -8, 0x6A0DAD);
    const rightEar = scene.add.triangle(0, 0, 4, -6, 6, -10, 2, -8, 0x6A0DAD);
    
    // Eyes (glowing red)
    const leftEye = scene.add.circle(-3, -2, 2, 0xFF0000);
    leftEye.setStrokeStyle(1, 0xFF6666);
    const rightEye = scene.add.circle(3, -2, 2, 0xFF0000);
    rightEye.setStrokeStyle(1, 0xFF6666);
    
    container.add([leftWing, rightWing, body, leftEar, rightEar, leftEye, rightEye]);
    
    // Wing flap animation
    scene.tweens.add({
      targets: [leftWing, rightWing],
      scaleY: 0.7,
      scaleX: 1.1,
      duration: 250,
      yoyo: true,
      repeat: -1,
    });
    
    return container;
  }

  /**
   * Create goblin enemy sprite (fantasy dungeon style)
   */
  static createGoblinSprite(scene: Phaser.Scene, x: number, y: number): Phaser.GameObjects.Container {
    const container = scene.add.container(x, y);
    
    // Body (green goblin)
    const body = scene.add.ellipse(0, 4, 22, 26, 0x228B22);
    const belly = scene.add.ellipse(0, 6, 16, 18, 0x32CD32);
    
    // Head (large goblin head)
    const head = scene.add.ellipse(0, -10, 18, 20, 0x228B22);
    
    // Ears (pointy)
    const leftEar = scene.add.triangle(0, 0, -10, -12, -14, -8, -8, -10, 0x1E7B1E);
    const rightEar = scene.add.triangle(0, 0, 10, -12, 14, -8, 8, -10, 0x1E7B1E);
    
    // Eyes (yellow menacing)
    const leftEye = scene.add.ellipse(-4, -12, 6, 4, 0xFFFF00);
    leftEye.setStrokeStyle(1, 0xFF0000);
    const rightEye = scene.add.ellipse(4, -12, 6, 4, 0xFFFF00);
    rightEye.setStrokeStyle(1, 0xFF0000);
    
    // Nose
    const nose = scene.add.triangle(0, 0, 0, -8, -2, -6, 2, -6, 0x1E7B1E);
    
    // Weapon (rusty dagger)
    const dagger = scene.add.polygon(0, 0, [
      [10, 4], [12, 2], [20, 2], [22, 0], [20, -2], [12, -2], [10, 4]
    ], 0x8B7355);
    const blade = scene.add.polygon(0, 0, [
      [20, 2], [26, 0], [20, -2]
    ], 0x696969);
    
    container.add([body, belly, leftEar, rightEar, head, nose, leftEye, rightEye, dagger, blade]);
    return container;
  }

  /**
   * Create orc enemy sprite (brutal warrior)
   */
  static createOrcSprite(scene: Phaser.Scene, x: number, y: number): Phaser.GameObjects.Container {
    const container = scene.add.container(x, y);
    
    // Large muscular body
    const body = scene.add.ellipse(0, 6, 30, 36, 0xCC4400);
    const chest = scene.add.ellipse(0, 0, 26, 22, 0xFF5500);
    
    // Arms (muscular)
    const leftArm = scene.add.ellipse(-12, 6, 10, 24, 0xCC4400);
    leftArm.angle = -20;
    const rightArm = scene.add.ellipse(12, 6, 10, 24, 0xCC4400);
    rightArm.angle = 20;
    
    // Head (fierce)
    const head = scene.add.ellipse(0, -14, 20, 24, 0xCC4400);
    
    // Eyes (intense white)
    const leftEye = scene.add.ellipse(-6, -16, 7, 5, 0xFFFFFF);
    const leftPupil = scene.add.circle(-7, -16, 2, 0x000000);
    const rightEye = scene.add.ellipse(6, -16, 7, 5, 0xFFFFFF);
    const rightPupil = scene.add.circle(7, -16, 2, 0x000000);
    
    // Tusks (large)
    const leftTusk = scene.add.polygon(0, 0, [
      [-10, -10], [-12, -4], [-8, -6]
    ], 0xFFFAFA);
    const rightTusk = scene.add.polygon(0, 0, [
      [10, -10], [12, -4], [8, -6]
    ], 0xFFFAFA);
    
    // Helmet/armor
    const helmet = scene.add.arc(0, -20, 12, 180, 0, false, 0x4A4A4A);
    helmet.setStrokeStyle(2, 0x2F4F4F);
    
    // War axe
    const axeHandle = scene.add.rectangle(16, 4, 5, 28, 0x654321);
    axeHandle.angle = 45;
    const axeBlade = scene.add.polygon(0, 0, [
      [18, -4], [28, -10], [30, -6], [28, -2], [18, -8]
    ], 0x708090);
    axeBlade.setStrokeStyle(2, 0xC0C0C0);
    
    container.add([leftArm, rightArm, body, chest, head, helmet, leftTusk, rightTusk, leftEye, leftPupil, rightEye, rightPupil, axeHandle, axeBlade]);
    return container;
  }

  /**
   * Create dragon boss sprite (epic boss)
   */
  static createDragonSprite(scene: Phaser.Scene, x: number, y: number): Phaser.GameObjects.Container {
    const container = scene.add.container(x, y);
    
    // Massive serpentine body
    const bodyLower = scene.add.ellipse(0, 10, 50, 40, 0xCC0000);
    bodyLower.setStrokeStyle(3, 0x8B0000);
    const bodyUpper = scene.add.ellipse(0, -5, 46, 36, 0xFF0000);
    bodyUpper.setStrokeStyle(3, 0xCC0000);
    
    // Wings (massive)
    const leftWing = scene.add.polygon(0, 0, [
      [-22, 0], [-40, -15], [-48, -10], [-42, 8], [-28, 10]
    ], 0x8B0000);
    leftWing.setStrokeStyle(2, 0x660000);
    const rightWing = scene.add.polygon(0, 0, [
      [22, 0], [40, -15], [48, -10], [42, 8], [28, 10]
    ], 0x8B0000);
    rightWing.setStrokeStyle(2, 0x660000);
    
    // Neck and head
    const neck = scene.add.ellipse(0, -18, 22, 30, 0xCC0000);
    const head = scene.add.ellipse(0, -32, 26, 20, 0xFF0000);
    head.setStrokeStyle(2, 0xCC0000);
    
    // Eyes (glowing yellow with intensity)
    const leftEye = scene.add.circle(-8, -34, 5, 0xFFFF00);
    leftEye.setStrokeStyle(2, 0xFFAA00);
    const rightEye = scene.add.circle(8, -34, 5, 0xFFFF00);
    rightEye.setStrokeStyle(2, 0xFFAA00);
    
    // Horns (curved)
    const leftHorn = scene.add.polygon(0, 0, [
      [-12, -40], [-16, -34], [-14, -38]
    ], 0x2F4F4F);
    const rightHorn = scene.add.polygon(0, 0, [
      [12, -40], [16, -34], [14, -38]
    ], 0x2F4F4F);
    
    // Jaw/fangs
    const jaw = scene.add.ellipse(0, -28, 20, 10, 0xCC0000);
    const leftFang = scene.add.triangle(0, 0, -6, -26, -8, -22, -4, -24, 0xFFFAFA);
    const rightFang = scene.add.triangle(0, 0, 6, -26, 8, -22, 4, -24, 0xFFFAFA);
    
    // Fire breath glow (pulsing)
    const fireGlow = scene.add.circle(0, -26, 10, 0xFF6600, 0.7);
    scene.tweens.add({
      targets: fireGlow,
      alpha: 0.3,
      scale: 1.4,
      duration: 600,
      yoyo: true,
      repeat: -1,
    });
    
    // Scales effect
    const scale1 = scene.add.circle(-8, 0, 4, 0xFF4400, 0.6);
    const scale2 = scene.add.circle(8, 0, 4, 0xFF4400, 0.6);
    const scale3 = scene.add.circle(0, 8, 4, 0xFF4400, 0.6);
    
    container.add([
      leftWing, rightWing, 
      bodyLower, bodyUpper, 
      scale1, scale2, scale3,
      neck, jaw, head, 
      leftHorn, rightHorn, 
      leftEye, rightEye, 
      leftFang, rightFang, 
      fireGlow
    ]);
    
    // Wing flap (slower, more powerful)
    scene.tweens.add({
      targets: [leftWing, rightWing],
      scaleY: 0.85,
      scaleX: 1.05,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });
    
    // Breathing animation
    scene.tweens.add({
      targets: [bodyLower, bodyUpper],
      scaleX: 1.05,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });
    
    return container;
  }

  /**
   * Create token pickup sprite (Base blockchain themed)
   */
  static createTokenSprite(scene: Phaser.Scene, x: number, y: number): Phaser.GameObjects.Container {
    const container = scene.add.container(x, y);
    
    // Outer ring (gold)
    const outerRing = scene.add.circle(0, 0, 12, 0xFFD700);
    outerRing.setStrokeStyle(2, 0xFFA500);
    
    // Inner hexagon (Base blue)
    const hexagon = scene.add.polygon(0, 0, [
      [0, -7], [6, -4], [6, 4], [0, 7], [-6, 4], [-6, -4]
    ], 0x0052FF);
    hexagon.setStrokeStyle(1, 0x00F0FF);
    
    // Center dot
    const center = scene.add.circle(0, 0, 3, 0xFFFFFF);
    
    // Glow effect
    const glow = scene.add.circle(0, 0, 14, 0xFFD700, 0.3);
    
    container.add([glow, outerRing, hexagon, center]);
    
    // Rotation animation
    scene.tweens.add({
      targets: container,
      angle: 360,
      duration: 2000,
      repeat: -1,
    });
    
    // Pulse animation
    scene.tweens.add({
      targets: [outerRing, glow],
      scale: 1.2,
      alpha: 0.6,
      duration: 1000,
      yoyo: true,
      repeat: -1,
    });
    
    return container;
  }

  /**
   * Create XP gem sprite
   */
  static createXPGemSprite(scene: Phaser.Scene, x: number, y: number): Phaser.GameObjects.Container {
    const container = scene.add.container(x, y);
    
    // Diamond shape (emerald green)
    const diamond = scene.add.polygon(0, 0, [
      [0, -10], [7, 0], [0, 10], [-7, 0]
    ], 0x00FF00);
    diamond.setStrokeStyle(2, 0x00CC00);
    
    // Inner facets
    const facet1 = scene.add.polygon(0, 0, [
      [0, -10], [7, 0], [0, 0]
    ], 0x88FF88, 0.6);
    const facet2 = scene.add.polygon(0, 0, [
      [0, 10], [-7, 0], [0, 0]
    ], 0x88FF88, 0.6);
    
    // Glow
    const glow = scene.add.circle(0, 0, 6, 0x88FF88, 0.5);
    
    container.add([glow, diamond, facet1, facet2]);
    
    // Sparkle animation
    scene.tweens.add({
      targets: glow,
      scale: 1.6,
      alpha: 0.2,
      duration: 900,
      yoyo: true,
      repeat: -1,
    });
    
    // Rotation
    scene.tweens.add({
      targets: diamond,
      angle: 360,
      duration: 3000,
      repeat: -1,
    });
    
    return container;
  }

  /**
   * Create enemy projectile
   */
  static createEnemyProjectile(scene: Phaser.Scene, x: number, y: number, color: number): Phaser.GameObjects.Container {
    const container = scene.add.container(x, y);
    
    // Core
    const core = scene.add.circle(0, 0, 6, color);
    core.setStrokeStyle(2, Phaser.Display.Color.IntegerToColor(color).lighten(20).color);
    
    // Glow trail
    const glow = scene.add.circle(0, 0, 10, color, 0.4);
    
    // Inner energy
    const energy = scene.add.circle(0, 0, 3, 0xFFFFFF, 0.8);
    
    container.add([glow, core, energy]);
    
    // Pulse
    scene.tweens.add({
      targets: glow,
      scale: 1.4,
      alpha: 0.1,
      duration: 300,
      yoyo: true,
      repeat: -1,
    });
    
    return container;
  }
}
