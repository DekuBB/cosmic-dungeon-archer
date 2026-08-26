# Cosmic Dragon Archer — AUTO LIVE MODE

This patch adds an unattended, real-time AI gameplay mode for the existing Phaser game.

## What it adds

- `?live=1` launches directly into the game.
- Automatic player movement.
- Automatic target selection and shooting (uses the game's existing firing system).
- Automatic pickup collection.
- Projectile avoidance / kiting behavior.
- Automatic perk selection at level-up.
- Automatic application of selected perks to the Phaser scene.
- Automatic restart after death without reloading the browser page.
- Broadcast-style TV overlay for the TikTok/OBS capture.
- Existing enemy AI, boss-on-stage-5 logic and difficulty scaling remain active.

## Files

Copy:

- `src/components/game/AutoLiveController.tsx`
- `src/components/game/AutoLiveOverlay.tsx`

Then apply the included `gameclient-auto-live.patch` to `src/components/game/GameClient.tsx`.

## Start

Open:

`https://kosmofazowicze.pl/?live=1`

or on your Vercel deployment:

`https://dungeon-archer.vercel.app/?live=1`

The normal game URL stays unchanged.

## TikTok / OBS

For the 24/7 setup, run the live URL on a dedicated machine/VPS with a browser window, capture the browser/canvas in OBS, and stream that live output to TikTok.

This patch does not implement TikTok comments/Gifts yet. Those should be connected later through a server-side event bridge so the game can react to LIVE events without exposing credentials in the browser.
