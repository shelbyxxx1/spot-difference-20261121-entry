# Senja Split: Spot the Difference

[![make.fun competition](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![Ranking](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/shelbyxxx1/spot-difference-20261121-entry/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![Reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/shelbyxxx1/spot-difference-20261121-entry/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

A quiet harbour town, from golden-hour water to lantern-lit stalls to the first light over the rooftops. Two pictures. Eighteen hidden differences. Look a little closer.

All artwork is original, drawn in code on canvas. Each pair uses the same parameterized painter and seeded decorative scatter; only the specified changes differ. No image assets, fonts, audio files, dependencies, build step, or network requests are used by the game. Sound is synthesized with WebAudio.

## Play

Click a difference in **either** picture. Find all 5, 6, then 7 changes before each scene's clock runs out. A find earns 100 points; consecutive finds add 25, 50, then a capped 75-point streak bonus. A miss resets your streak and costs 3 seconds. Remaining whole seconds earn 2 points each at scene clear.

You have 3 hints per scene. A hint pulses around an unfound change for 1.2 seconds and costs 150 points (never below zero). Clicking an already-found change is harmless. A scene retry restores the score you had when entering that scene, so retrying cannot farm points.

- **H:** hint
- **R:** retry current scene
- **M:** toggle sound
- **P / Escape:** pause or resume (the clock freezes)

Three stars: 2600+ points. Two stars: 1900+. One star: every completed journey deserves one.

## Run

Requires Node.js 24+ for native TypeScript execution of the local utility scripts. The game itself is plain browser JavaScript.

```sh
node serve.ts
```

Open http://localhost:8080 in desktop Chrome. No build step. To open `game/index.html` directly via `file://`, Chrome needs `--allow-file-access-from-files` to permit local ES-module imports; a static server is recommended for ordinary play.

## Hand-in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

The hand-in program preserves the output directory itself, clears its entries, copies `game/` and the four real JPEG renders in `screenshots/`, then generates `dossier.json` using the unchanged competition vendor library. Do not point the output directory at the source repository or any directory containing it.

`shots.json` lists the four deterministic staged views. Add its queries to the game URL to reproduce the frozen frames. The victory screenshot intentionally uses the brief's staged 2450-point, three-star example; actual play uses the score thresholds above.

Built for make.fun. This repository is the entry; it does not submit itself.
