# Weapon planner source audit — 2026-10-26

## Existing data checked on the test branch

- `amplified-search.js` has normal item IDs for tier I, II, III, IV across supported weapon families. These IDs identify weapon variants; they do not by themselves prove upgrade ingredient quantities.
- `catalog-data/amplified-variants.json` has amplified family/option research, including explicit null `upgradeMaterials` and `upgradeCost` fields. Null is unknown, not zero.
- `outpost-reference-data.json` documents Outpost expansion and furniture research materials; those are NOT ordinary weapon upgrade recipes.
- `outpost-catalog.json` is furniture/outpost data, not an exhaustive ordinary weapon upgrade table.
- `items.json` is a basic item catalog and contains free-text use/recycling fields, not a normalized per-weapon transition cost table.
- `app.js` displays recipe metadata such as `craftBench` and `rftRecipeEvidence` for items when available; a crafting recipe must not be automatically equated with a weapon upgrade transition.

## Acceptance gate before publishing a new all-weapons tile

1. Extract all current weapon families from the effective runtime catalog, not just amplified families.
2. For every supported tier transition (I→II, II→III, III→IV), resolve an explicit ingredient quantity map with evidence; represent missing/contradictory costs as unknown.
3. Distinguish crafting, upgrading, Gunsmith station upgrades and amplification; do not add unlike costs.
4. Calculate multi-step sums and integrate missing/owned materials without mutating inventory.
5. Match existing homepage tile markup, locale support, Android touch navigation, back behavior, dark/light themes.
6. Run browser regression and both quality gates. Publish a commit-pinned branch preview; never merge main without approval.

Current state: audit performed; full cost coverage and new tile NOT implemented. Do not label the current preview as the finished all-weapon planner.
