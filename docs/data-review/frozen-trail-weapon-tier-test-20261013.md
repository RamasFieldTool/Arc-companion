# Frozen Trail weapon-tier completion: test branch

## Change
Added four minimal placeholder records to `frozen-trail-data.js`: `bantam_ii`, `bantam_iv`, `stiletto_i`, `stiletto_iii`. Together with existing `bantam_i`, `bantam_iii`, `stiletto_ii`, `stiletto_iv`, all eight normal weapon tiers I–IV are represented. **Amplified quality is separate, not weapon tier V.**

The additions contain only IDs, English names (copied into existing five-language placeholder convention), weapon class, an explicit missing-values warning and source metadata. **No recipe, upgrade cost, recycle values, rarity, weight, price, magazine, durability or damage values were invented.**

## Existing identity safety
The current `extend(catalog,goals)` in `frozen-trail-data.js` already matches additions against upstream by ID or English name, uses existing pinned identity when available, and rewrites goal references through aliases. This patch adds no new alias logic or storage mutation beyond the existing mechanism. However, the full browser/localStorage regression test has **not yet been run**; do not merge without it.

## Specific checks required
1. Load with full 581-item September snapshot and verify 8 new weapon tier IDs are present once each, no duplicates, no lost original items.
2. Load with mocked upstream containing all eight weapons under alternate canonical IDs; verify English-name match, stable saved pin IDs and one record per weapon tier.
3. Load with `arcOwned`, `arcPlanningPersonal`, `arcNextRaid` referencing the four new IDs; verify no stock/goal loss or ID collision.
4. Confirm existing screenshot-derived Bantam III values and other pre-existing records remain unchanged.
5. Confirm no false recipe/recycling totals are shown for placeholders.
6. Run JS syntax check and existing test suite before considering merge.

## Evidence
- Embark official announcement of Bantam and Stiletto: https://arcraiders.com/news/frozen-trail-2-0-update
- Community weapon-tier tables: https://arcraiders.wiki/wiki/Category:Pages_using_Template:Weapon_upgrades
- Numeric details deliberately excluded pending game confirmation.

Status: **TEST ONLY**, no main merge.
