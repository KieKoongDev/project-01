# Adding an era, recipe, innovation or event

The catalog's `version` changes with each content release. IDs are stable and never reused. The engine reconstructs persisted cards from trusted current definitions and drops unknown roots/modifiers. Add explicit migrations if removing or renaming IDs in a future patch.

## Eras

Declare an era with a rank and enabled flag. Cards and recipes have an era. Both inputs and outputs are checked; a high-era recipe cannot be obtained just by guessing a pair early. The current public play scopes are Stone Age only and Journey (Stone → Bronze). Industrial is present only as disabled roadmap content.

Era advancement is explicit: show the prerequisites, then let the player choose to advance. Stone-only mode never advances. Prototype milestone requirements are firecraft, toolmaking, pottery and 12 discoveries; review these with playtest evidence.

## Innovations

Declare an innovation as a stable ID with prerequisite discovery IDs and an explanation. Recipe `requires` and property-modifier prerequisites reference innovation IDs. Learned knowledge belongs to the active sprint when playing a timed game; archived discoveries cannot bypass a fresh sprint's gates.

## Events

World conditions are selected before a sprint and remain fixed during it. Wet season modifies scores; Cold snap also changes cultivation prerequisites. Add conditions to the pure engine, with a targeted test and visible explanation before the player crafts.

## Recipes and points

Unordered input pairs have a unique recipe. Exact recipes resolve before property transformations. Invalid combinations retain ingredients and explain the unmet requirement. All ingredients are reusable in the concept prototype.

Base cards award 0. A new result awards depth × 10 plus 5 for a property invention, plus any event bonus. Repeats in the same sprint do not score. Free-discovery awards points only for genuinely new collection items. This economy tests curiosity, not competitive balance.

## Scale and performance

The v0.2 tests exercise a 5,000-item fixture through real search/pagination helpers. This does not assert 5,000 authored cards or 60fps. Before launch, profile a representative low-end Android phone and iPhone, including repeated drags, image decode, 200% text sizing, reduced motion and storage-quota failure.
