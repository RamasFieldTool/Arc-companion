# Verified Frozen Trail audit baseline — 2026-10-13

This file records only reproducible repository facts and official developer statements. It does not claim that the September snapshot is a current 2.0 item database.

## Verified snapshot
- Source: branch `catalog-data`, file `items-full-snapshot.json`, blob SHA `bdfd07f475b2375a3d3f6ff695e745d4364658b1`.
- Snapshot metadata: `schema=ramas-field-tool-item-snapshot`, `formatVersion=1`, `generatedAt=2026-09-24T15:55:47.768Z`, `count=581`.
- Independently parsed via GitHub blob: 581 actual items, 581 unique IDs, zero missing IDs.
- Coverage: `name`, `type`, `rarity`, `value` in all 581; `description` 575; `weightKg` 567; `stackSize` 573; `recyclesInto` 359; `salvagesInto` 353.
- Anvil I–IV are present in the old snapshot. Bantam/Stiletto are absent, as expected for a pre-update source.

## Verified current repository implementation
- `catalog-resilience-v2120.js` has fallback ordering Mahcks -> September snapshot -> RaidTheory GitHub -> local `items.json`.
- `catalog-update-2.js` already corrects Anvil I–IV rarity from `Uncommon` to `Rare` and removes the Anvil Splitter special mod slot. Do not duplicate this change.
- `outpost-catalog.json` has 100 unique furniture IDs, 100 designs and crafting arrays, 52 non-null research entries and 48 null entries. The catalog itself labels its contents community-generated and not verified in-game. Null research entries do not imply research is unnecessary.

## Official Frozen Trail 2.0 confirmation
Embark confirms:
- New weapons Bantam and Stiletto.
- Anvil rarity changed from Uncommon to Rare; Anvil Splitter no longer usable as a mod.
- 100 furniture designs: 73 found Topside, 22 from Outpost upgrades, 4 from Frozen Trail Pass, 1 DLC.
- Source: https://id.embark.games/arc-raiders/support/faq/282-2-0-frozen-trail-update

## Tooling
- `tools/audit_frozen_trail_catalog.py`: read-only comparison of two complete JSON item exports. Reports added, removed and changed IDs; rejects duplicate IDs and inconsistent counts.
- `tools/audit_outpost_catalog.py`: read-only structural validation for the Outpost JSON. This does not establish in-game correctness.

## Explicitly not merged
Community-sourced upgrade recipes, recycling quantities, speculative canonical IDs, and partial Frozen Trail item additions from the audit branch are intentionally excluded. No new game values, inventory data, or user goals are changed.
