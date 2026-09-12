# A living civilization — v0.4.0

## Progress model

`deriveCity()` is a pure projection of the current playable collection. Each unique eligible discovered card contributes its base VP value to civilization XP. XP is not spendable, does not include weather bonuses, and does not reuse the session score. Repeated crafts, replaying an animation, switching weather, or redrawing the view cannot award progress.

The collection is already persisted by the game. Free discovery restores its world from those saved cards; sprint mode supplies only current-expedition discoveries. Future-era cards are filtered again in the city projection.

| Stage | XP | Required discovery |
| --- | ---: | --- |
| Untouched valley | 0 | None |
| First camp | 20 | Fire |
| Small settlement | 120 | Shelter or House, plus earlier stage conditions |
| Growing village | 300 | Garden or Farm, plus earlier stage conditions |
| Bronze workshop town | 700 | Bronze Age, Furnace and Metal, plus earlier stage conditions |

Stages are illustrative prototype thresholds, not validated game balance. City population and duplicate decorative homes visualize a stage; they are not separate owned card instances or a simulated economy.

## Environment mapping

- Fire → flame, glow, smoke, gathering path, villagers.
- Shelter / House → homes; stage progression increases their count.
- Plant / Garden / Forest → trees and greenery; additional relevant discoveries increase foliage up to a cap.
- Garden / Farm → cultivated fields and swaying plants.
- Pottery + Fire → a kiln.
- Raft → animated river travel.
- Furnace + Metal in Bronze Age → a workshop with smoke.
- Cold snap / Wet season → snow or rain styling, with no XP change.

Every clickable scene feature has an equivalent keyboard-accessible text control and an explanation of its source. The progress bar is native HTML, not canvas-only. Disabled feature controls make future possibilities visible without pretending they have been unlocked.

## Renderer

Canvas 2D projects a deterministic isometric world. Procedural primitives keep the existing flat papercraft palette and require no new card art. Object placement is stable; new objects scale into place. Trees, people, water, raft, flame, smoke and weather use a shared animation clock.

- Target drawing cap: 30fps. This is not a measured-device frame-rate claim.
- Pixel ratio cap: 2.
- Maximum: 8 trees, 4 homes, 3 fields, 7 villagers and a bounded number of effects.
- No one-scene-object-per-card allocation.
- Animation stops when paused, reduced motion is requested, the tab is hidden or the scene is outside the viewport.
- Returning to the page does not simulate offline time or reward catch-up.
- Canvas failure leaves the text progress and game usable.

`model.ts` is independent of `render.ts`. A future Three.js renderer can consume the same model if camera rotation, real lighting or a larger navigable world becomes a validated requirement. Keep rule ownership in the game engine rather than moving progression into rendering code.

## Verification

Tests check duplicate-safe XP, knowledge/era gates, discovery-to-object mapping, weather invariance, bounded 5,000-item scene projection and finite renderer output. Three weather scenes were also rendered with a real Canvas implementation for visual inspection. Browser interaction and real-phone performance still require device QA.
