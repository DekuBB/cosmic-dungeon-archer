import type { Perk, PerkRarity, PlayerStats } from '@/types/game';
import { EXTENDED_PERKS } from './perks-extended';
import { MEGA_PERKS } from './perks-mega';

export const PERK_POOL: Perk[] = [
  // COMMON PERKS (70%)
  {
    id: 'speed_boost',
    name: 'Swift Steps',
    description: 'Increase movement speed by 15%',
    rarity: 'common',
    type: 'statBoost',
    tags: ['movement', 'speed'],
    apply: (stats: PlayerStats): PlayerStats => ({
      ...stats,
      baseMoveSpeed: stats.baseMoveSpeed * 1.15,
    }),
  },
  {
    id: 'attack_speed',
    name: 'Rapid Fire',
    description: 'Increase attack speed by 20%',
    rarity: 'common',
    type: 'statBoost',
    tags: ['attack', 'speed'],
    apply: (stats: PlayerStats): PlayerStats => ({
      ...stats,
      attackSpeed: Math.min(stats.attackSpeed * 1.2, 10),
    }),
  },
  {
    id: 'damage_boost',
    name: 'Power Shot',
    description: 'Increase damage by 25%',
    rarity: 'common',
    type: 'statBoost',
    tags: ['damage'],
    apply: (stats: PlayerStats): PlayerStats => ({
      ...stats,
      damage: stats.damage * 1.25,
    }),
  },
  {
    id: 'health_boost',
    name: 'Vitality',
    description: 'Increase max health by 20',
    rarity: 'common',
    type: 'statBoost',
    tags: ['health', 'survival'],
    apply: (stats: PlayerStats): PlayerStats => ({
      ...stats,
      maxHealth: stats.maxHealth + 20,
      health: stats.health + 20,
    }),
  },
  {
    id: 'pickup_radius',
    name: 'Magnetism',
    description: 'Increase pickup radius by 30%',
    rarity: 'common',
    type: 'statBoost',
    tags: ['utility'],
    apply: (stats: PlayerStats): PlayerStats => ({
      ...stats,
      pickupRadius: stats.pickupRadius * 1.3,
    }),
  },

  // RARE PERKS (25%)
  {
    id: 'multishot',
    name: 'Triple Shot',
    description: 'Fire 3 projectiles at once',
    rarity: 'rare',
    type: 'weaponAugment',
    tags: ['projectile', 'multishot'],
    apply: (stats: PlayerStats): PlayerStats => ({
      ...stats,
      damage: stats.damage * 0.7, // Slight damage reduction for balance
    }),
  },
  {
    id: 'piercing',
    name: 'Piercing Rounds',
    description: 'Projectiles pierce through enemies',
    rarity: 'rare',
    type: 'weaponAugment',
    tags: ['projectile', 'pierce'],
    apply: (stats: PlayerStats): PlayerStats => stats,
  },
  {
    id: 'crit_chance',
    name: 'Critical Strike',
    description: 'Increase critical hit chance by 15%',
    rarity: 'rare',
    type: 'statBoost',
    tags: ['damage', 'crit'],
    apply: (stats: PlayerStats): PlayerStats => ({
      ...stats,
      critRate: Math.min(stats.critRate + 0.15, 0.75),
    }),
  },
  {
    id: 'lifesteal',
    name: 'Vampiric Touch',
    description: 'Restore 2 HP on kill',
    rarity: 'rare',
    type: 'behaviorMod',
    tags: ['health', 'survival'],
    apply: (stats: PlayerStats): PlayerStats => stats,
  },

  // EPIC PERKS (5%)
  {
    id: 'bloodthirst',
    name: 'Bloodthirst',
    description: 'Gain 10% damage for each kill (stacks)',
    rarity: 'epic',
    type: 'behaviorMod',
    tags: ['damage', 'scaling'],
    apply: (stats: PlayerStats): PlayerStats => stats,
  },
  {
    id: 'token_multiplier',
    name: 'Fortune Seeker',
    description: 'Double token drops',
    rarity: 'epic',
    type: 'behaviorMod',
    tags: ['token', 'reward'],
    apply: (stats: PlayerStats): PlayerStats => stats,
  },
  {
    id: 'guardian_angel',
    name: 'Guardian Angel',
    description: 'Survive a fatal hit once',
    rarity: 'epic',
    type: 'behaviorMod',
    tags: ['survival'],
    apply: (stats: PlayerStats): PlayerStats => stats,
  },
  {
    id: 'chain_lightning',
    name: 'Chain Reaction',
    description: 'Kills cause chain explosions',
    rarity: 'epic',
    type: 'weaponAugment',
    tags: ['aoe', 'damage'],
    apply: (stats: PlayerStats): PlayerStats => stats,
  },
  // Add extended perks
  ...EXTENDED_PERKS,
  // Add mega perks
  ...MEGA_PERKS,
];

export function getRandomPerks(count: number): Perk[] {
  const weights: Record<PerkRarity, number> = {
    common: 0.65,
    rare: 0.25,
    epic: 0.08,
    legendary: 0.02,
  };

  const selectedPerks: Perk[] = [];
  const availablePerks: Perk[] = [...PERK_POOL];

  for (let i: number = 0; i < count; i++) {
    if (availablePerks.length === 0) break;

    const roll: number = Math.random();
    let rarity: PerkRarity = 'common';

    if (roll < weights.legendary) {
      rarity = 'legendary';
    } else if (roll < weights.legendary + weights.epic) {
      rarity = 'epic';
    } else if (roll < weights.legendary + weights.epic + weights.rare) {
      rarity = 'rare';
    }

    const perksOfRarity: Perk[] = availablePerks.filter(
      (p: Perk): boolean => p.rarity === rarity
    );

    if (perksOfRarity.length > 0) {
      const randomIndex: number = Math.floor(Math.random() * perksOfRarity.length);
      const selectedPerk: Perk = perksOfRarity[randomIndex];
      selectedPerks.push(selectedPerk);
      
      const indexInAvailable: number = availablePerks.indexOf(selectedPerk);
      availablePerks.splice(indexInAvailable, 1);
    } else {
      // Fallback to common if no perks of desired rarity
      const commonPerks: Perk[] = availablePerks.filter(
        (p: Perk): boolean => p.rarity === 'common'
      );
      if (commonPerks.length > 0) {
        const randomIndex: number = Math.floor(Math.random() * commonPerks.length);
        const selectedPerk: Perk = commonPerks[randomIndex];
        selectedPerks.push(selectedPerk);
        
        const indexInAvailable: number = availablePerks.indexOf(selectedPerk);
        availablePerks.splice(indexInAvailable, 1);
      }
    }
  }

  return selectedPerks;
}
