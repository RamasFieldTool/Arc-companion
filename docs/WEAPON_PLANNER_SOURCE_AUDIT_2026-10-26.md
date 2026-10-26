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

Initial state above is historical. See the implementation evidence below for the new planner.


## Implemented source reconciliation, 26 October 2026

- Read the existing catalog, then retrieved `https://arctracker.io/api/items`, version `1792963799790`, generated `2026-10-25T21:29:59.790Z`: 985 items, 181 weapon records including Amplified configurations.
- The 92 ordinary weapon records form 26 families: 22 families with I–IV and four single-tier legendary weapons. 66 ordinary transitions plus 15 explicit ascensions are normalized into `catalog-data/weapon-upgrades.json`. Dolabra has no outgoing upgrade in this source; the UI does not invent tiers.
- Every one of the 81 explicit source edges was compared with the serialized materials: all matched. All 108 retained Amplified configuration edges and their material costs were also compared against this response: zero mismatches. Research tasks remain at their previously documented evidence level.
- Crucial distinction: the old RaidTheory `upgradeCost` belongs to the destination item, while the current provider's `upgrades[].cost` belongs to an explicit source→destination edge. Only explicit current edges are used by the new calculator.
- Anvil current source: I→II 1 Advanced Mechanical Components + 1 Heavy Gun Parts; II→III the same; III→IV 2 Advanced Mechanical Components + 1 Heavy Gun Parts. Historical `Mechanical Components` costs in the initial notes are superseded, not silently combined. The community wiki still disagrees for I→II; no in-game confirmation is claimed.
- Source-level coverage is complete against that response, not a claim of independently verified game completeness. Ordinary station-level requirements are not supplied on these edges and remain explicitly unknown. Explicit ascension requirement: Gunsmith IV. No crafting-station requirement is substituted for an upgrade requirement.
- Source names, image URLs, per-edge links, source version, capture date and raw response SHA-256 are retained. No new image URLs were inferred.
- New local weapon plans are separate from inventory and legacy plans. The shared requirement map includes their full material demand and subtracts stock once. Saving the same weapon replaces its weapon plan; existing collection goals are preserved. Removing the weapon plan removes only its own demand. Backups include validated weapon plans.


## Regression evidence

- Local new planner regression: Chromium Android emulation at 360, 412, 430 and landscape 932 px; exact Anvil sums, current/target selection, stock, idempotent saves, saved plan reentry, backup export/import, shared research deduplication, unknown-cost guard, single-tier Dolabra, Bantam, search/category, five languages, Light/Black, browser back and shared planning: passed.
- Local general browser quality gate: all ten source/cache/fallback/slow-source scenarios passed. Planning usability, empty state, workshop stock, i18n, Italian, Next Raid sharing, Amplified browser matrix (25 combinations), Outpost UI matrix (25 combinations), targeted navigation, backup/migration/data safety, reference tables and Pendola passed.
- Responsive UI regression initially failed because the expected tile list had not been updated and live event/bot/font resources were unmocked in the restricted local runtime. The expected list now includes the requested weapon tile, and those external dependencies use explicit fixtures. All responsive UI scenarios then passed; no application assertions were removed.
- Screenshots inspected at 412 px; duplicate heading and overlapping reentry scroll resolved. Amplified family control is locked to the main selection, preventing a weapon/module/perk mismatch.
- No physical Android device test and no in-game recipe verification have been performed.
