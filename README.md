> **Moved (2026-11-13).** Hearth now lives inside the hub: `jpavia10/prometheus-hub`, folder `pillars/hearth/`, live at https://jpavia10.github.io/prometheus-hub/pillars/hearth/ (owner: "Hearth doesnt need an independent repo if its gonna stop you from working on it"). Do not work in this repository; its deck progress, data packs and AI queue were carried over. This site is left as it was.

# Hephaestus Hearth

Joseph's house desk: renovation projects, the assets in every room (the inventory), and a floor plan that gets accurate over time. A wing of [Prometheus Hub](https://jpavia10.github.io/prometheus-hub/), in the same cool midnight: thin glass, pearl type, silver-blue dust. No Titan gold, and no vault, fleet, or ledger data.

https://jpavia10.github.io/hephaestus-hearth/

This is the bones. The house on the stand is placeholder boxes and a roof. It is not a measured drawing. Floor plans, photogrammetry, and a detailed model come later. Projects, rooms, and notes are empty on purpose. Nothing here is a budget, a vendor, or a bid. No secrets are stored.

## What you can do

- Orbit, pan, and zoom the stand-in house. Drag, scroll, pinch, or focus the view and use the arrow keys. Reset view returns the camera. A slow orbit runs until you take the controls, and it stays off when the system asks for reduced motion.
- Read the empty desk: three project slots, a room list, and a notes panel. They do not save.

The way back is [Prometheus Hub](https://jpavia10.github.io/prometheus-hub/).

## Pages

GitHub Pages should serve this repository root. There is no Pages build. `hearth.js` is already bundled, and `.nojekyll` is in the root so the bundle, icons, and manifest are served as files.

Match the other desks (`prometheus-hub`, `midas-ledger`):

1. Repository: `jpavia10/hephaestus-hearth`
2. Settings → Pages → Build and deployment → Source: **Deploy from a branch**
3. Branch: **main**, folder: **/ (root)**
4. Save

Published URL: https://jpavia10.github.io/hephaestus-hearth/

Pages was not enabled on this repository when the shell was added (`GET /repos/jpavia10/hephaestus-hearth/pages` returned 404). Turn on the settings above after this lands on `main`. The first deploy can take a minute.

## Build

`npm run build` bundles `src/main.js` to `hearth.js` with esbuild. Three.js `0.164.1` is the same generation as Prometheus Hub. Commit `hearth.js` with source changes. Pages does not run the build.

```bash
npm install
npm run build
```

Locally:

```bash
npm install
npm run build
python3 -m http.server 8750
```

Open http://127.0.0.1:8750/

`npm run dev` rebuilds and serves in one step.

## Replacing the massing

The stand-in lives in `src/house.js`, in `buildPlaceholder()`. Dimensions there are round and illustrative. Swap that group for surveyed geometry or a loaded model, keep the ground contact at `y = 0`, then run `npm run build` and commit `hearth.js`.

The silver dust in `src/field.js` is a quiet field behind the page. Prometheus Hub's particles are a separate scroll-morph simulation, adapted there from [MisterPrada/morph-particles](https://github.com/MisterPrada/morph-particles), in ember and gold. This page does not use that simulation.

## Home screen

iPhone: Safari → Share → Add to Home Screen. Android: Chrome → Install app. The icon is the family square with a small roof mark. The name is Hephaestus Hearth. The service worker caches the same-origin shell only.
