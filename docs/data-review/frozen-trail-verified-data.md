# Frozen Trail: partial verified release data — 2026-10-09

Base reviewed remotely before changes: main 90e94069f8e5da27fd1d3f90bbe0aae38e340133.
Review branch: test/frozen-trail-verified-data. No merge authorized.

## Included and evidence limits

- Sheltered Retreat material phase only: 3 Planks, 5 Sheet Metal, 10 ARC Alloy, 3 Advanced Electrical Components. The Outpost wiki and Dot Esports agree on names and quantities. Destructoid agrees on amounts but calls the last material “Advanced Electronic Parts”; do not claim unanimous naming. This goal does not represent the entire Outpost unlock, photography or combat objectives.
- Research Station I only: 35 Planks, 5 Battered Paperback, 3 Mini Pump. Independently read the published Beebom game screenshot and compared with the wiki table. No in-game session was performed.
- Bantam I: Uncommon, Heavy Ammo, magazine 8, weight 3 kg, sell value 3,800. Visually read the published inspect screenshot. Buying screenshot shows Tian Wen at 11,400 Coins and a limited stock timer. No permanent trader model added.
- Stiletto II: Uncommon, Light Ammo, magazine 12, weight 7 kg, from the published inspect screenshot. The guide table mixes IV statistics with a II screenshot: never assign the table's 16-round magazine or 11,000 value to II.
- Stiletto IV: Cassio trade screenshot shows 8 Candleberries, 2 Cable Stripper, 2 Mini Pump. “Limited Stock 2/2” is availability, NOT two guns per purchase. Guide text incorrectly names Ermal; screenshot says Cassio. Offer date included in description, not a permanent acquisition guarantee.
- Planks / Sheet Metal: Common Basic Material, weight 0.1 kg, stack 50, value 100, community wiki tables; explicitly weaker evidence than game screenshots. English names retained in all languages. No official translations invented.
- Mini Pump / Battered Paperback: existing upstream records preserved; minimal name-only records supplied if absent in local fallback. Unknown fields remain unknown.

## Sources actually read

- https://arcraiders.wiki/wiki/Outpost (oldid 41934)
- https://dotesports.com/arc-raiders/guides/arc-raiders-outpost-unlock
- https://www.destructoid.com/how-to-unlock-the-outpost-in-arc-raiders-ruined-homestead-location-and-requirements/
- https://beebom.com/arc-raiders-outpost-guide/
- https://beebom.com/how-to-get-bantam-in-arc-raiders/
- https://beebom.com/how-to-get-stiletto-in-arc-raiders/
- https://arcraiders.wiki/wiki/Planks
- https://arcraiders.wiki/wiki/Sheet_Metal
- https://arcraiders.wiki/wiki/Anvil

Published screenshots visually inspected: Research Station I; Outpost expansion UI (does not show room resource costs); Cassio trade; Stiletto II inspect; Tian Wen trade; Bantam I inspect. Destructoid resource screenshot download returned HTTP 403, not visually verified.

## Preservation and deliberate exclusions

Additive catalog extension after existing 2.0 correction layer. All existing item and goal IDs and upstream records remain unchanged. New snake_case IDs are RFT internal IDs, not claimed API IDs. Equivalent English names already supplied by upstream are reused rather than duplicated. Each item identity is pinned in arcFrozenTrailIdentities and included in validated backups. Later upstream ID changes reuse the pinned ID; incoming catalog cost/recycling, goal and quest item references are remapped. Stock, personal goals, raid progress and history are never rewritten. A simultaneous change of both upstream ID and English name cannot be inferred safely and remains outside automatic matching. No automatic stock migration or deletion implemented.

Research II–IV: one community table only, excluded. Anvil recipes: incomplete/conflicting source tables, excluded. Weapon crafting, upgrades, recycling, unsupported drop locations, new map markers, new images and a general sources[] model excluded. No inferred image filenames supplied.

## Validation record

Initial isolated-server browser attempt failed with connection refused (test infrastructure, not app failure). Server and browser now run in the same execution network namespace. First connected attempt failed a test assertion that counted both the item card and nested image metadata; narrowed to .card. These failures are not passed full runs.

Executed tests and exact commit will be added after the completed runs. Until then the full Quality Gate is NOT verified.

## Identity hardening before authorized merge

New tests cover local → changed upstream ID → fallback, upstream-first → fallback → second upstream ID, newer upstream metadata, recipe/recycling/quest references, identity persistence through backup/restore, rejection of duplicate backup identity IDs, and storage failure without modifying user stock/goals. Actual execution results are recorded in the PR validation summary.
