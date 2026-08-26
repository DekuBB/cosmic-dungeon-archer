'use client';

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/stores/game-store';
import { GAME_CONFIG } from '@/lib/game-config';

type PointLike = { x: number; y: number };

type AutoLiveScene = {
  player?: PointLike;
  enemies?: { getChildren?: () => unknown[] };
  pickups?: { getChildren?: () => unknown[] };
  enemyProjectiles?: { getChildren?: () => unknown[] };
  shootAtNearestEnemy?: (stats: unknown) => void;
  applySelectedPerk?: (perk: unknown) => void;
  scene?: { restart?: () => void };
};

const distance = (a: PointLike, b: PointLike): number =>
  Math.hypot(a.x - b.x, a.y - b.y);

const nearest = <T extends PointLike>(origin: PointLike, items: T[]): T | null => {
  let best: T | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const item of items) {
    if (!Number.isFinite(item.x) || !Number.isFinite(item.y)) continue;
    const currentDistance = distance(origin, item);
    if (currentDistance < bestDistance) {
      bestDistance = currentDistance;
      best = item;
    }
  }

  return best;
};

const scorePerk = (perk: {
  tags?: string[];
  rarity?: string;
  id?: string;
}): number => {
  const tags = perk.tags ?? [];
  const preferred = [
    'survival',
    'movement',
    'speed',
    'attack',
    'damage',
    'projectile',
    'pierce',
    'crit',
    'health',
  ];

  const tagScore = tags.reduce(
    (score, tag) => score + (preferred.includes(tag) ? 10 : 0),
    0
  );

  const rarityScore: Record<string, number> = {
    legendary: 50,
    epic: 35,
    rare: 20,
    common: 10,
  };

  const specialScore =
    perk.id === 'guardian_angel'
      ? 40
      : perk.id === 'lifesteal'
        ? 30
        : 0;

  return (
    tagScore +
    (rarityScore[perk.rarity ?? 'common'] ?? 0) +
    specialScore
  );
};

export function AutoLiveController(): null {
  const lastRestartAt = useRef(0);
  const eventAt = useRef(0);
  const angle = useRef(0);

  useEffect(() => {
    let disposed = false;

    const timer = window.setInterval(() => {
      if (disposed) return;

      const state = useGameStore.getState();
      const scene = (
        window as unknown as {
          __COSMIC_MAIN_SCENE__?: AutoLiveScene;
        }
      ).__COSMIC_MAIN_SCENE__;

      // AUTO SKILLS / PERKS:
      // Automatically resolve every level-up draft so the run never pauses for input.
      if (state.isDrafting && state.draftChoices.length > 0) {
        const selected = [...state.draftChoices].sort(
          (a, b) => scorePerk(b) - scorePerk(a)
        )[0];

        state.selectPerk(selected);
        scene?.applySelectedPerk?.(selected);
      }

      if (!scene?.player) return;

      const player = scene.player;
      const enemies = (
        scene.enemies?.getChildren?.() ?? []
      ).filter(Boolean) as PointLike[];
      const pickups = (
        scene.pickups?.getChildren?.() ?? []
      ).filter(Boolean) as PointLike[];
      const enemyProjectiles = (
        scene.enemyProjectiles?.getChildren?.() ?? []
      ).filter(Boolean) as PointLike[];

      // AUTO ATTACK / TARGETING.
      try {
        scene.shootAtNearestEnemy?.(state.playerStats);
      } catch (error) {
        console.warn('AUTO LIVE shooting error:', error);
      }

      // PLAYER AI:
      // 1. dodge dangerous projectiles
      // 2. collect nearby pickups
      // 3. otherwise orbit the nearest enemy to create active-looking gameplay
      const danger = nearest(player, enemyProjectiles);
      const target = nearest(player, enemies);
      const pickup = nearest(player, pickups);

      let vx = 0;
      let vy = 0;

      if (danger && distance(player, danger) < 150) {
        vx = player.x - danger.x;
        vy = player.y - danger.y;
      } else if (
        pickup &&
        (!target || distance(player, pickup) < distance(player, target) * 0.7)
      ) {
        vx = pickup.x - player.x;
        vy = pickup.y - player.y;
      } else if (target) {
        angle.current += 0.08;

        const orbitAngle =
          Math.atan2(target.y - player.y, target.x - player.x) +
          Math.PI / 2;

        const radial = Math.max(
          90,
          Math.min(180, distance(player, target))
        );

        vx =
          Math.cos(orbitAngle + angle.current * 0.05) * radial;
        vy =
          Math.sin(orbitAngle + angle.current * 0.05) * radial;
      } else {
        angle.current += 0.04;
        vx = Math.cos(angle.current);
        vy = Math.sin(angle.current);
      }

      const magnitude = Math.hypot(vx, vy) || 1;
      const speed = state.playerStats.baseMoveSpeed;
      const intervalSeconds = 0.1;

      player.x = Math.max(
        20,
        Math.min(
          GAME_CONFIG.width - 20,
          player.x + (vx / magnitude) * speed * intervalSeconds
        )
      );

      player.y = Math.max(
        20,
        Math.min(
          GAME_CONFIG.height - 20,
          player.y + (vy / magnitude) * speed * intervalSeconds
        )
      );

      state.setMoving(true);

      // Procedural LIVE behavior: change orbit direction periodically.
      const now = Date.now();
      if (now > eventAt.current) {
        eventAt.current =
          now + 45000 + Math.floor(Math.random() * 45000);
        angle.current += (Math.random() - 0.5) * Math.PI;
      }

      // ENDLESS RUN LOOP:
      // after death, reset state and restart the Phaser scene without reloading the page.
      if (
        !state.isAlive &&
        now - lastRestartAt.current > 2500
      ) {
        lastRestartAt.current = now;

        state.resetGame();

        try {
          scene.scene?.restart?.();
        } catch (error) {
          console.warn(
            'AUTO LIVE scene restart failed:',
            error
          );
        }
      }
    }, 100);

    return () => {
      disposed = true;
      window.clearInterval(timer);
    };
  }, []);

  return null;
}
