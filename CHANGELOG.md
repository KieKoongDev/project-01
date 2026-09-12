# Changelog

## 0.11.0 — More room to grow
- Unlock two adjoining 12-slot areas with wood and stone, up to 36 buildable slots; preserve original tile identities and saved decorations.
- Area shortcuts and zoom controls, plus an explicit hand mode for one-finger pan/two-finger zoom without dragging buildings.
- Rotate buildings in 90-degree steps and relocate between owned areas while preserving orientation and terrain constraints.
- Nine bounded resource objects across three areas: timed wood, stone and clay with local output, collection, upgrades and opt-in automatic delivery.
- Existing worker production remains compatible; ore mining, per-building recipe inventories and multi-slot research are future work, not part of this release.
- Reconcile time before management actions; preserve above-cap legacy stock instead of truncating it.
- Add six domain tests for expansion, geometry, orientation, object cooldowns, collection, automation and save validation. Real-device pan/pinch/visual QA remains required.


## 0.10.0 — The village works while you rest
- Remove the end-day control from the playable village and run assigned jobs in automatic 30-second production cycles.
- Reconcile elapsed time from saved timestamps on return, capped at four hours and bounded by storage capacity; no offline food drain or villager death.
- Queue axe and pottery work for 90 seconds, reserve ingredients at queue start, complete while away and prevent duplicate jobs.
- Show live production/crafting progress, a dismissible return summary, per-cycle job yields and storage capacity in the compact bottom status area.
- Migrate existing guest saves to the real-time fields without granting retroactive resources; preserve the prior manual-day rule only as an internal legacy test path.
- Add deterministic tests for partial cycles, repeat sync, offline cap, full storage, reserved crafting and save migration. Timing and interaction feel still require real-device playtesting.

## 0.9.0 — A village that guides you
- One actionable chapter goal connects discovery, building, welcoming neighbors and a post-celebration kiln → pottery → storage path.
- Accessible projected world badges prioritize up to three genuine needs, with overlap suppression and no repeating alert animation.
- Tap buildings for a compact in-world action menu: recruit, learn/produce pottery, assign workers, move or open details.
- Illustrated discovery feedback, job/recipe art, a ready-to-build filter, and a net next-day resource preview using the actual economy rules.
- Preserve existing guest saves and manual day pacing; no new timer, online account or exploration system in this patch.
- Rule tests cover guidance transitions, facility dependencies, needs and production forecasts. Real-device interaction/playtest validation remains required.

## 0.8.0 — A world you can touch
- Replace permanent block grid with interactive Three.js low-poly models viewed through an orthographic 2.5D camera.
- Drag buildings to relocate, tap models for commands, and drag illustrated building/decor cards into the world.
- SVG resource cards and toolbar icons support picking and experiment-slot drops.
- Ambient villagers, swaying trees, fire and smoke; pause/reduced-motion support and accessible object-list fallback.
- Preserve existing village saves and rules; account/cloud work deferred following the requested visual priority.


## 0.7.0 — My cozy village
- Name your village and neighbors; relocate buildings free while respecting terrain.
- Separate decoration layer with full refunds, five decoration types and three one-time neighbor requests.
- Winter gathering without a deadline; actionable per-building status and sage/peach styling.
- Migrate legacy village saves into a guest-local revisioned envelope, preserve last valid backup and refuse detected stale/corrupt writes.
- Google/email accounts and cloud saves remain v0.8 work; current UI explicitly identifies local saves.


## 0.6.0 — Build a village with a purpose
- New default Stone Age village mode with a winter-readiness mission, five resources, worker jobs, food upkeep and player-controlled days.
- Discover recipes, spend resources to place six building types, select facilities to produce or recruit, and dismantle for partial refunds.
- Kiln-gated pottery and installed tools replace endless duplicate crafting; terrain and housing create constraints.
- Separate validated save, recovery without offline drain, and access to the original lab.
- Thai responsive map and action panels, audio feedback, and end-to-end rule tests for a completable mission.


## 0.5.0 — A calmer Thai civilization lab
- One-screen responsive shell: city left / crafting right in landscape, stacked in portrait; independently scrolling bounded card collection.
- Thai interface and generated card names, bilingual search, self-hosted Itim font.
- Forest, parchment and gold theme; research/settings/notes in accessible dialogs.
- Original opt-in procedural music, independent music toggle, volume, craft and progression cues.
- Explicit craft feedback events, score animation, discovery and level-up toast; reduced-motion support.
- Playtest hypotheses and outstanding real-device checks in docs/UX-PLAYTEST-PLAN.md.


## 0.4.0 — A living civilization
- Animated isometric Canvas scene: growing homes, trees, farms, campfire, kiln, raft and Bronze Age workshop.
- Civilization XP derives from unique discovered cards; settlement stages also require relevant knowledge.
- Click a scene feature or its accessible text button to inspect its discovery requirement.
- Weather changes scene animation without granting XP.
- Motion toggle, reduced-motion support, offscreen/hidden-tab pause, capped DPR and bounded scene objects.
- Compact discovery feedback keeps the workbench visible beside the new world view.

## 0.3.0 — Research & discovery
- Filter by property, era, tier, invention, pinned cards and undiscovered partners; sort by name, points or newest.
- Highlight feasible new pairings without revealing the result; use one-tap pair selection and a fixed mobile workbench.
- Research targets an innovation and reveals the next reachable recipe for one quota credit.
- Camp Tinkerer unlocks after firecraft and toolmaking, costs one credit to recruit, and can complete one new valid experiment per 12 seconds for one credit each.
- Assistant is opt-in, pauses for occupied benches, hidden tabs and sprints, and never bypasses ownership, knowledge or era gates.
- First flame, first shelter and first vessel give one-time milestone bonuses.
- Historical innovators and flight-era invention rewards remain a future mode, with an extension plan in docs/RESEARCH-ROADMAP.md.

## 0.2.1 — Mobile collection interaction
- Swipe the card collection normally; use the dedicated grip for touch dragging.
- Keep tap-to-add and keyboard activation available.
- Validate the testing-branch automatic deployment path.

## 0.2.0 — Stone Age knowledge pack
- Word/VP-first cards with an optional artwork layer and stable art keys.
- Stone-only scope and milestone-gated Stone → Bronze journey.
- Firecraft, toolmaking, pottery, cultivation and metallurgy knowledge gates.
- Cold snap and Wet season rule variations.
- Bounded 48-card pages, indexed property search, paged field notes and 5,000-item data test.
- Railway-ready Docker deployment, health endpoint and automated validation.

## 0.1.0 — Discovery Lab
- Initial standalone solo experiment: ingredient merging, inherited properties, discovery notes and timed sprints.
