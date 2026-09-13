# ANORIA — The Shards of Dawn

**ANORIA 2026** is a mobile-first fantasy action RPG prototype designed to run on the web and package for Android with Capacitor.

## RPG systems in v2

- Animated CSS character sprites for Aria and enemies
- Five cinematic regions: Whispering Vale, Emberfall Village, Sunken Ruins, Frostspire Pass and Obsidian Citadel
- NPC companions: Lyra, Torren and Nyx
- Quest log, world map, journal and automatic save/continue
- Weapons: Dawnblade, Moonbow and Starstaff with rarity and power
- Abilities: Slash, Arcane Bolt, Guard and Moon Heal
- Real combat HUD, enemy HP, player HP/mana, damage and healing
- Night King boss with three phases and escalating encounters
- Procedural particle effects, hit/walk/boss animations and location themes
- Procedural Web Audio sound effects plus looping fantasy-style music motif
- Loading screen, settings, volume, sound/music toggles and reset save
- PWA manifest, offline service worker and install prompt
- Android-ready Capacitor configuration with app id `com.anoria.rpg2026`
- 2026 icon and responsive mobile controls

## Run

Open `index.html` in a modern browser or deploy the repository to GitHub Pages/Vercel. A local HTTP server is recommended so the service worker can run.

## PWA

The project includes `manifest.webmanifest`, `sw.js`, and `assets/icon.svg`. On Android Chrome, use **Install app** / **Add to Home screen**.

## Android packaging

Install Node.js and run:

```bash
npm install
npx cap add android
npx cap sync android
npx cap open android
```

Then build the APK/AAB from Android Studio. The repository contains the web game and Capacitor configuration; the generated `android/` project is intentionally not committed.

## Asset policy

The current game uses original CSS/vector-style visuals, emoji UI characters and generated Web Audio tones. Do not add ripped game art, copyrighted characters, music or logos without permission. For a commercial release, use original or properly licensed assets and record them in `CREDITS.md`.

## Next production upgrades

- Full sprite-sheet animation art
- Larger tile-based maps and collision
- More enemy families and loot tables
- Crafting, equipment stats and rarity effects
- Side quests, reputation and achievements
- Cloud saves and account system
- Native Android permissions, splash screen and store signing
- Original music tracks and recorded SFX packs
