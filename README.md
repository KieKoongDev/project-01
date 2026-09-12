# Paperbound · project-01

A mobile-first card-crafting concept test built with React, TypeScript, Tailwind, Zustand and Vite. This repository is the source of truth. The Railway service is ready; automatic deployment of the testing branch awaits Railway GitHub App installation for this repository.

## Play v0.4.0

- **Stone Age only:** six starting elements, earned fire, bounded historical knowledge.
- **Journey:** unlock the Bronze Age by discovering fire, a tool, pottery and 12 creations. New ore becomes available, but an actual furnace is still needed to refine it.
- **World conditions:** Cold snap blocks early cultivation until firecraft; Wet season rewards water/storage inventions.
- **Free discovery** or **3 × 45-second sprint**. Repeat discoveries do not score twice. Scope changes end a sprint; conditions lock during it.
- On touchscreens, swipe cards to scroll, tap to add, or drag using the corner grip.
- Words and VP are the default card presentation. The optional artwork toggle currently shows coherent resource icons. No generated art is required to validate the game loop.
- Search names/properties and browse 48 cards per page. Filter by era, tier, property, invention, pinned cards and new pairings; sort by points, name or newest. Notes have their own pagination. Engine hinting uses recipe/property indexing rather than all pair combinations.
- Browser-local discovery persistence. Saves do not transfer automatically from the previous Sites origin.

## Research and assistance

Open the Research tab to spend one research credit on the next reachable recipe for a chosen innovation. Credits are separate from victory points: free discovery starts with three, awards one per five new collection items (cap five), and sprints receive two each round. Invalid or unreachable research spends nothing. Recipe knowledge does not grant the output; use Select both ingredients and craft it.

Recruit the Camp Tinkerer after discovering fire and a tool. Recruiting costs one credit. Assistance starts paused; enabling it allows one valid new experiment every 12 seconds at one credit per completed craft. It pauses while the workbench is occupied, the tab is hidden, the quota is empty, or a sprint is running. No offline catch-up or unattended server process exists.

On mobile, a fixed bottom workbench keeps both ingredients and Combine within reach. Tap a slot to choose which ingredient to replace. Pinned cards and the New pairs filter reduce scrolling. New pair highlights describe possibilities, without revealing the output until research or crafting.

## Your living civilization

The main board now includes an animated isometric civilization. Discover fire for a living camp, shelter for homes, plants for greenery, garden/farm for fields, pottery + fire for a kiln, and a raft for river travel. Furnace + metal in the Bronze Age unlock a workshop.

Civilization XP equals the sum of base VP values of unique current-scope discoveries. It is separate from session VP and cannot be spent; repeat crafting and weather switches do not increase it. Settlement stages require both XP and discoveries. Sandbox progress derives from the saved collection; a sprint shows only the current expedition.

The renderer uses Canvas 2D with isometric projection rather than a WebGL dependency for this prototype. It caps drawing at 30fps and DPR at 2, pauses when hidden or offscreen, and supports reduced motion and a manual pause. This is not a measured mobile frame-rate claim. Click scene features or use their text buttons for accessible explanations.

## Development

Requires Node 22.13+ and pnpm 11.25.0.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm check
pnpm build
pnpm start
```

`pnpm check` runs meaningful rule tests and the production build. Tests cover era leaks, knowledge gates, event effects, hint reachability, deterministic IDs, duplicate scoring, deadlines and a 5,000-item collection fixture. This is a data/logic load check, not a browser-frame-rate certification.

## Deployment

Railway builds the Dockerfile and serves static assets through the Node server. It listens on `0.0.0.0:$PORT` and exposes `/healthz`. No API key or database is needed for this prototype. `NODE_ENV=production` is set in the container; Railway supplies PORT.

`testing` is the intended automatic-deployment branch. Railway currently reports `NO_INSTALLATION`: grant its GitHub App access to this repository, then select `testing` and enable autodeploy. After that setup, validated pushes to `testing` trigger deployment. Until then, pushing code alone does not update the running service. A GitHub Actions workflow checks `main`, `testing`, and pull requests. The Docker build also runs checks, so a failing rule/build cannot produce a release image.

Configuration is in `railway.toml`, `Dockerfile`, and `.env.example`. Put actual secrets in Railway Variables, never in Git or VITE_* client variables. No scheduled auto-committer or file-watching push daemon is installed.

## Content architecture

- `src/data/catalog.json`: versioned card definitions, recipes, eras, knowledge gates, events.
- `src/game/engine.ts`: pure deterministic resolution, invention modifiers and gates.
- `src/game/store.ts`: solo play state, persistence, sprint timing and points.
- `src/game/collection.ts`: indexed search and bounded page rendering.
- `src/data/art-manifest.json`: artwork registry independent of rules.
- `docs/ART-DIRECTION.md`: launch style and scalable image pipeline.
- `docs/CONTENT-PATCHES.md`: extension contract and compatibility rules.

## Prototype boundaries

Solo concept only. No multiplayer server, Socket.IO, offline PWA, generative AI recipe service, ranked balance, or production artwork yet. The content system supports large inventories; it does not claim 1,000 individually designed launch assets already exist. Simplified recipes are game abstractions, not scientific or historical reference material. Industrial content is disabled until a future content patch.
