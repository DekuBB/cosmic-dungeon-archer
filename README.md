# 🎮 Neon Nexus Crawler

A high-octane roguelike shooter inspired by Archero, featuring Web3 token rewards on Base network and seamless Farcaster integration.

## 🎯 Game Features

### Core Gameplay
- **Stutter-Step Mechanic**: Stop moving to auto-shoot at enemies, move to dodge attacks
- **Roguelike Progression**: Level up and choose from random upgrades (perks)
- **Wave-Based Combat**: Face increasingly difficult enemy waves
- **Multiple Enemy Types**:
  - **Chasers**: Fast enemies that pursue the player
  - **Turrets**: Stationary enemies that fire projectiles
  - **Lobbers**: Range attackers with area denial

### Progression System
- **XP & Leveling**: Gain XP from kills to level up
- **Perk System**: Choose from 3 random perks per level
  - Common (70%): Basic stat boosts
  - Rare (25%): Advanced weapon modifications
  - Epic (5%): Game-changing abilities
- **Token Rewards**: Earn crypto tokens for completing stages

### Web3 Integration
- **Base Network**: Built on Base L2 for fast, low-cost transactions
- **Wallet Connect**: Connect your wallet using OnchainKit
- **Token Escrow**: Tokens accumulate during gameplay and can be claimed after death
- **Farcaster Support**: Full integration with Farcaster frames and mini-apps

## 🕹️ Controls

### Desktop
- **WASD/Arrow Keys**: Move character
- **Release Movement**: Auto-shoot at nearest enemy
- **Mouse**: Navigate menus

### Mobile
- **Virtual Joystick**: Touch and drag to move
- **Release Joystick**: Auto-shoot at nearest enemy
- **Tap**: Select menu options

## 🎨 Visual Design

**Neon Cyberpunk Aesthetic**
- Deep black backgrounds for maximum contrast
- Cyan player character (Base network color)
- Magenta/pink enemies for high visibility
- Glowing white/yellow projectiles
- Particle effects and screen shake for impact

## 🔧 Technical Stack

- **Game Engine**: Phaser 3.90.0
- **Framework**: Next.js 15.3.8
- **State Management**: Zustand 5.0.10
- **Web3**: OnchainKit + Wagmi + Viem
- **Blockchain**: Base (Chain ID: 8453)
- **Audio**: Howler.js 2.2.4
- **Mobile Controls**: Phaser Rex Plugins (Virtual Joystick)

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Run development server: `pnpm dev`
4. Open [http://localhost:3000](http://localhost:3000)

## 🎮 How to Play

1. **Connect Wallet** (optional): Click "LINK NEURAL INTERFACE" to connect your wallet
2. **Start Playing**: Game starts automatically
3. **Move to Dodge**: Use WASD or virtual joystick to avoid enemy attacks
4. **Stop to Shoot**: Release controls to auto-target and shoot nearest enemy
5. **Collect Pickups**: Move near XP gems and token orbs to collect them
6. **Level Up**: Choose perks strategically to build powerful synergies
7. **Survive**: Push through waves to earn more tokens
8. **Claim Rewards**: After death, claim your earned tokens to your wallet

## 📊 Game Mechanics

### Player Stats
- **Health**: Damage taken before death
- **Move Speed**: How fast you traverse the arena
- **Attack Speed**: Shots per second when stationary
- **Damage**: Base damage per projectile
- **Pickup Radius**: Range for auto-collecting XP/tokens
- **Crit Rate**: Chance for critical hits

### Perk Examples
- **Swift Steps**: +15% movement speed
- **Rapid Fire**: +20% attack speed
- **Triple Shot**: Fire 3 projectiles (Rare)
- **Piercing Rounds**: Projectiles go through enemies (Rare)
- **Bloodthirst**: +10% damage per kill, stacks (Epic)
- **Fortune Seeker**: 2x token drops (Epic)
- **Guardian Angel**: Survive one fatal hit (Epic)

## 🌐 Deployment

This game works on:
- **base.app**: Full Web3 functionality with Wallet Connect
- **farcaster.xyz**: Integrated with Farcaster frames and mini-app SDK
- **Any modern browser**: Desktop and mobile optimized

## 🔐 Security

- Token claiming requires wallet signature
- All game logic runs client-side (no server authority)
- Rewards are stored locally until claimed
- Smart contract integration for verified token distribution

## 📱 Platform Support

- ✅ Desktop (Chrome, Firefox, Safari, Edge)
- ✅ Mobile (iOS Safari, Chrome Mobile, Firefox Mobile)
- ✅ Farcaster Frames
- ✅ Base Network dApps

## 🎯 Future Roadmap

- [ ] On-chain leaderboards
- [ ] NFT character skins
- [ ] Multiplayer co-op mode
- [ ] Daily challenges with bonus rewards
- [ ] Achievement system
- [ ] More enemy types and bosses

## 📄 License

MIT License - Feel free to use and modify

## 🙏 Credits

Inspired by Archero/Archero 2 gameplay mechanics
Built with love for the Base and Farcaster communities

---

**Have fun and stack those tokens! 🚀💎**
