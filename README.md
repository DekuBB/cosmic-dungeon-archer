###############################################################################################################################################################################################################
[  PL  ]
# 🎮 Cosmic Dungeon Archer

Dynamiczna gra typu **roguelike shooter**, inspirowana serią **Archero**, oferująca nagrody w postaci tokenów Web3 w sieci **Base** oraz pełną integrację z **Farcaster**.

## 🎯 Funkcje gry

### Główna rozgrywka

* **Mechanika „Stutter-Step”** – gdy przestajesz się poruszać, postać automatycznie strzela do przeciwników. Gdy się poruszasz, możesz unikać ich ataków.
* **Postęp Roguelike** – zdobywaj poziomy i wybieraj losowe ulepszenia (perki).
* **Walka falami przeciwników** – zmierz się z coraz trudniejszymi falami wrogów.
* **Różne typy przeciwników:**

  * **Ścigający (Chasers)** – szybcy przeciwnicy podążający za graczem.
  * **Wieżyczki (Turrets)** – nieruchome jednostki ostrzeliwujące gracza pociskami.
  * **Miotacze (Lobbers)** – przeciwnicy dystansowi rzucający pociski tworzące strefy zagrożenia.

### System rozwoju

* **Doświadczenie (XP) i poziomy** – zdobywaj punkty doświadczenia za pokonanych przeciwników i awansuj na kolejne poziomy.
* **System perków** – przy każdym awansie wybieraj jedno z trzech losowych ulepszeń.

  * **Zwykłe (70%)** – podstawowe zwiększenie statystyk.
  * **Rzadkie (25%)** – zaawansowane modyfikacje broni.
  * **Epickie (5%)** – wyjątkowo potężne umiejętności zmieniające przebieg rozgrywki.
* **Nagrody w tokenach** – zdobywaj kryptowalutowe tokeny za ukończenie etapów.

### Integracja z Web3

* **Sieć Base** – gra działa na blockchainie Base Layer 2, zapewniając szybkie i tanie transakcje.
* **Połączenie portfela** – połącz swój portfel kryptowalutowy za pomocą **OnchainKit**.
* **Escrow tokenów** – zdobyte tokeny są gromadzone podczas gry i można je odebrać po zakończeniu rozgrywki.
* **Obsługa Farcaster** – pełna integracja z ramkami (Frames) i miniaplikacjami Farcaster.

---

# 🕹️ Sterowanie

### Komputer

* **WASD / Strzałki** – poruszanie postacią.
* **Puść klawisze ruchu** – postać automatycznie strzela do najbliższego przeciwnika.
* **Mysz** – obsługa menu.

### Telefon

* **Wirtualny joystick** – dotknij i przeciągnij, aby się poruszać.
* **Puść joystick** – automatyczny ostrzał najbliższego przeciwnika.
* **Dotknięcie ekranu** – wybór opcji w menu.

---

# 🎨 Styl graficzny

## Neonowy Cyberpunk

* Głębokie czarne tło zapewniające maksymalny kontrast.
* Gracz w kolorze cyjanowym (kolor sieci Base).
* Przeciwnicy w odcieniach magenty i różu dla lepszej widoczności.
* Świecące białe i żółte pociski.
* Efekty cząsteczkowe oraz trzęsienie ekranu zwiększające dynamikę walki.

---

# 🔧 Technologie

* **Silnik gry:** Phaser 3.90.0
* **Framework:** Next.js 15.3.8
* **Zarządzanie stanem:** Zustand 5.0.10
* **Web3:** OnchainKit + Wagmi + Viem
* **Blockchain:** Base (Chain ID: 8453)
* **Dźwięk:** Howler.js 2.2.4
* **Sterowanie mobilne:** Phaser Rex Plugins (Virtual Joystick)

---

# 🚀 Pierwsze uruchomienie

1. Sklonuj repozytorium.
2. Zainstaluj zależności:

```
pnpm install
```

3. Uruchom serwer developerski:

```
pnpm dev
```

4. Otwórz stronę:

```
http://localhost:3000
```

---

# 🎮 Jak grać

1. **Połącz portfel (opcjonalnie)** – kliknij **„LINK NEURAL INTERFACE”**, aby połączyć portfel.
2. **Rozpocznij grę** – rozgrywka uruchomi się automatycznie.
3. **Poruszaj się, aby unikać ataków** – używaj klawiszy WASD lub wirtualnego joysticka.
4. **Zatrzymaj się, aby strzelać** – zwolnij sterowanie, a postać automatycznie namierzy i ostrzela najbliższego przeciwnika.
5. **Zbieraj przedmioty** – podejdź do kryształów XP oraz kul tokenów, aby je automatycznie zebrać.
6. **Awansuj na kolejne poziomy** – wybieraj perki i twórz potężne kombinacje umiejętności.
7. **Przetrwaj jak najdłużej** – pokonuj kolejne fale przeciwników i zdobywaj więcej tokenów.
8. **Odbierz nagrody** – po śmierci postaci możesz przesłać zdobyte tokeny do swojego portfela.

---

# 📊 Mechaniki gry

## Statystyki gracza

* **Zdrowie** – ilość obrażeń, które możesz otrzymać przed śmiercią.
* **Prędkość ruchu** – szybkość poruszania się po arenie.
* **Szybkość ataku** – liczba strzałów na sekundę podczas postoju.
* **Obrażenia** – podstawowa siła każdego pocisku.
* **Promień zbierania** – odległość automatycznego zbierania XP i tokenów.
* **Szansa na trafienie krytyczne** – możliwość zadania zwiększonych obrażeń.

---

## Przykładowe perki

* **Szybkie Kroki** – +15% prędkości ruchu.
* **Szybki Ostrzał** – +20% szybkości ataku.
* **Potrójny Strzał** *(Rzadki)* – wystrzeliwuje trzy pociski jednocześnie.
* **Przebijające Pociski** *(Rzadki)* – pociski przechodzą przez przeciwników.
* **Żądza Krwi** *(Epicki)* – +10% obrażeń za każde zabójstwo (efekt kumuluje się).
* **Poszukiwacz Fortuny** *(Epicki)* – podwójna liczba wypadających tokenów.
* **Anioł Stróż** *(Epicki)* – pozwala przetrwać jeden śmiertelny cios.

---

# 🌐 Wdrażanie

Gra działa na:

* **base.app** – pełna obsługa funkcji Web3 i połączenia portfela.
* **farcaster.xyz** – pełna integracja z Frames i SDK miniaplikacji Farcaster.
* **Każdej nowoczesnej przeglądarce** – zoptymalizowana dla komputerów i urządzeń mobilnych.

---

# 🔐 Bezpieczeństwo

* Odbiór tokenów wymaga podpisania transakcji portfelem.
* Cała logika gry działa po stronie klienta (bez centralnego serwera sterującego rozgrywką).
* Nagrody są przechowywane lokalnie do momentu ich odebrania.
* Integracja ze smart kontraktem zapewnia bezpieczną i zweryfikowaną dystrybucję tokenów.

---

# 📱 Obsługiwane platformy

* ✅ Komputery (Chrome, Firefox, Safari, Edge)
* ✅ Telefony (iOS Safari, Chrome Mobile, Firefox Mobile)
* ✅ Farcaster Frames
* ✅ Aplikacje działające w sieci Base

---

# 🎯 Plan rozwoju

* ☐ Rankingi zapisane w blockchainie.
* ☐ Skórki postaci w formie NFT.
* ☐ Tryb współpracy dla wielu graczy (Co-op).
* ☐ Codzienne wyzwania z dodatkowymi nagrodami.
* ☐ System osiągnięć.
* ☐ Więcej typów przeciwników oraz bossów.

---

# 📄 Licencja

Licencja MIT – możesz swobodnie korzystać z projektu oraz go modyfikować.

---

# 🙏 Podziękowania

Inspiracją dla mechanik rozgrywki były gry **Archero** oraz **Archero 2**.

Projekt został stworzony z pasją dla społeczności **Base** i **Farcaster**.

---

## 🚀💎 Miłej zabawy i powodzenia w zdobywaniu kolejnych tokenów!

Jeśli chcesz, mogę również przygotować **Przygotuj bardziej profesjonalną wersję dokumentacji README po polsku**, zachowując standardy GitHub i terminologię używaną w projektach open source.

###############################################################################################################################################################################################################
[  ENG  ]
# 🎮 Cosmic Dungeon Archer

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
