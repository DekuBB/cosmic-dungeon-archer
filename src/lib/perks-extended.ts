import type { Perk, PlayerStats } from '@/types/game';

/**
 * Extended Perk Pool - 20+ additional perks including LEGENDARY tier
 */

export const EXTENDED_PERKS: Perk[] = [
  // === COMMON PERKS (Additional) ===
  {
    id: 'regen',
    name: 'Regeneration',
    description: 'Slowly regenerate 1 HP every 3 seconds',
    rarity: 'common',
    type: 'behaviorMod',
    tags: ['health', 'survival'],
    apply: (stats: PlayerStats): PlayerStats => stats,
  },
  {
    id: 'projectile_size',
    name: 'Heavy Rounds',
    description: 'Increase projectile size and impact',
    rarity: 'common',
    type: 'statBoost',
    tags: ['projectile', 'damage'],
    apply: (stats: PlayerStats): PlayerStats => ({
      ...stats,
      damage: stats.damage * 1.15,
    }),
  },
  {
    id: 'dodge_chance',
    name: 'Agility',
    description: '10% chance to dodge enemy attacks',
    rarity: 'common',
    type: 'behaviorMod',
    tags: ['survival', 'defense'],
    apply: (stats: PlayerStats): PlayerStats => stats,
  },
  {
    id: 'xp_boost',
    name: 'Wisdom',
    description: 'Gain 25% more XP from kills',
    rarity: 'common',
    type: 'behaviorMod',
    tags: ['progression', 'xp'],
    apply: (stats: PlayerStats): PlayerStats => stats,
  },

  // === RARE PERKS (Additional) ===
  {
    id: 'bounce_shot',
    name: 'Ricochet',
    description: 'Projectiles bounce off walls once',
    rarity: 'rare',
    type: 'weaponAugment',
    tags: ['projectile', 'utility'],
    apply: (stats: PlayerStats): PlayerStats => stats,
  },
  {
    id: 'explosive_rounds',
    name: 'Explosive Rounds',
    description: 'Projectiles explode on impact',
    rarity: 'rare',
    type: 'weaponAugment',
    tags: ['aoe', 'damage'],
    apply: (stats: PlayerStats): PlayerStats => ({
      ...stats,
      damage: stats.damage * 0.8, // Slightly less damage but AOE
    }),
  },
  {
    id: 'berserker',
    name: 'Berserker Rage',
    description: 'Gain 50% damage when below 30% HP',
    rarity: 'rare',
    type: 'behaviorMod',
    tags: ['damage', 'risk'],
    apply: (stats: PlayerStats): PlayerStats => stats,
  },
  {
    id: 'shield_on_kill',
    name: 'Battle Hardened',
    description: 'Gain temporary shield on kill (5 HP, 3s)',
    rarity: 'rare',
    type: 'behaviorMod',
    tags: ['shield', 'survival'],
    apply: (stats: PlayerStats): PlayerStats => stats,
  },
  {
    id: 'homing_shots',
    name: 'Tracking System',
    description: 'Projectiles slightly home toward enemies',
    rarity: 'rare',
    type: 'weaponAugment',
    tags: ['projectile', 'accuracy'],
    apply: (stats: PlayerStats): PlayerStats => stats,
  },
  {
    id: 'cooldown_reduction',
    name: 'Quick Reflexes',
    description: 'Reduce attack cooldown by 25%',
    rarity: 'rare',
    type: 'statBoost',
    tags: ['attack', 'speed'],
    apply: (stats: PlayerStats): PlayerStats => ({
      ...stats,
      attackSpeed: stats.attackSpeed * 1.25,
    }),
  },

  // === EPIC PERKS (Additional) ===
  {
    id: 'time_dilation',
    name: 'Time Warp',
    description: 'Slow time by 30% when below 20% HP',
    rarity: 'epic',
    type: 'behaviorMod',
    tags: ['utility', 'survival'],
    apply: (stats: PlayerStats): PlayerStats => stats,
  },
  {
    id: 'orbital_strike',
    name: 'Orbital Strike',
    description: 'Summon devastating strike every 30s',
    rarity: 'epic',
    type: 'weaponAugment',
    tags: ['aoe', 'special'],
    apply: (stats: PlayerStats): PlayerStats => stats,
  },
  {
    id: 'poison_aura',
    name: 'Toxic Presence',
    description: 'Enemies near you take damage over time',
    rarity: 'epic',
    type: 'behaviorMod',
    tags: ['aoe', 'damage'],
    apply: (stats: PlayerStats): PlayerStats => stats,
  },
  {
    id: 'resurrection',
    name: 'Phoenix Rising',
    description: 'Revive once with 50% HP (once per run)',
    rarity: 'epic',
    type: 'behaviorMod',
    tags: ['survival', 'revive'],
    apply: (stats: PlayerStats): PlayerStats => stats,
  },

  // === LEGENDARY PERKS (New Tier) ===
  {
    id: 'god_mode',
    name: 'Divine Ascension',
    description: 'Double all stats for 15 seconds after level up',
    rarity: 'legendary',
    type: 'behaviorMod',
    tags: ['power', 'ultimate'],
    apply: (stats: PlayerStats): PlayerStats => stats,
  },
  {
    id: 'omni_shot',
    name: 'Omnidirectional Fury',
    description: 'Fire in all 8 directions simultaneously',
    rarity: 'legendary',
    type: 'weaponAugment',
    tags: ['projectile', 'ultimate'],
    apply: (stats: PlayerStats): PlayerStats => ({
      ...stats,
      damage: stats.damage * 0.5, // Balanced for 8-way shooting
    }),
  },
  {
    id: 'perfect_dodge',
    name: 'Untouchable',
    description: 'Become invincible while moving',
    rarity: 'legendary',
    type: 'behaviorMod',
    tags: ['survival', 'ultimate'],
    apply: (stats: PlayerStats): PlayerStats => stats,
  },
  {
    id: 'infinite_pierce',
    name: 'Reality Slicer',
    description: 'Projectiles pierce all enemies infinitely',
    rarity: 'legendary',
    type: 'weaponAugment',
    tags: ['projectile', 'ultimate'],
    apply: (stats: PlayerStats): PlayerStats => ({
      ...stats,
      damage: stats.damage * 1.5,
    }),
  },
  {
    id: 'token_rain',
    name: 'Midas Touch',
    description: 'Triple all token drops permanently',
    rarity: 'legendary',
    type: 'behaviorMod',
    tags: ['token', 'ultimate'],
    apply: (stats: PlayerStats): PlayerStats => stats,
  },
];
