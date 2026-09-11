# Paperbound · project-01

A mobile-first card-crafting concept test built with React, TypeScript, Tailwind, Zustand and Vite. This repository is the source of truth; Railway hosts the testing branch.

## Play v0.2.0

- **Stone Age only:** six starting elements, earned fire, bounded historical knowledge.
- **Journey:** unlock the Bronze Age by discovering fire, a tool, pottery and 12 creations. New ore becomes available, but an actual furnace is still needed to refine it.
- **World conditions:** Cold snap blocks early cultivation until firecraft; Wet season rewards water/storage inventions.
- **Free discovery** or **3 × 45-second sprint**. Repeat discoveries do not score twice. Scope changes end a sprint; conditions lock during it.
- Words and VP are the default card presentation. The optional artwork toggle currently shows coherent resource icons. No generated art is required to validate the game loop.
- Search names/properties and browse 48 cards per page. Notes have their own pagination. Engine hinting uses recipe/property indexing rather than all pair combinations.
- Browser-local discovery persistence. Saves do not transfer automatically from the previous Sites origin.

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

`testing` is the intended automatic-deployment branch. After a requested update passes checks, commit/push it to `testing`; Railway's connected GitHub source deploys that commit. A GitHub Actions workflow checks `main`, `testing`, and pull requests. The Docker build also runs checks, so a failing rule/build cannot produce a release image.

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
