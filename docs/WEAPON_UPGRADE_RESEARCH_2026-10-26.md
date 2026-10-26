# Weapon upgrade cost research — 2026-10-26

Status: RESEARCH IN PROGRESS. Do not publish a complete all-weapon calculator or new launcher tile until per-tier costs are checked. Production main is untouched.

## Scope
- Normal weapon upgrades: I→II, II→III, III→IV (per weapon).
- Amplification: separate progression for supported weapons, not a universal normal tier V.
- Legendary weapons (Aphelion, Dolabra, Equalizer, Jupiter) do not have normal I–IV tiers.
- Gunsmith station upgrade costs are NOT weapon upgrade costs and must never be conflated.

## Sources checked
- https://www.arcraidersatlas.com/items/rattler_ii — Rattler: II = 2 Mechanical Components; III = 2 Mechanical Components + 1 Simple Gun Parts; IV = 3 Mechanical Components + 1 Simple Gun Parts.
- https://thearcraiders.wiki/weapons/tempest-iv — Tempest: II = 2 Advanced Mechanical Components + 1 Medium Gun Parts; III and IV = 2 Advanced Mechanical Components + 3 Medium Gun Parts each.
- https://thearcraiders.wiki/weapons/anvil-iv — Anvil: II = 3 Mechanical Components + 1 Simple Gun Parts; III and IV = 1 Heavy Gun Parts + 4 Mechanical Components each.
- https://afktimes.com/en/arc-raiders/guides/best-weapons-tier-list/ — alternate Anvil III/IV costs conflict with thearcraiders.wiki; do not treat as confirmed.
- https://arcsupply.com.br/guias.php?sec=overview — claims 20 weapon paths and 60 upgrade steps; dataset marked verified 2026-08-18, pre-2.0.
- https://www.arcscrappy.com/en/stations/weapon_bench — current craftable weapon/tier catalog, including recently added weapons; does not establish upgrade prices by itself.
- https://www.getrankd.gg/games/arc-raiders/news/arc-raiders-amplified-weapons — amplified progression and 15 supported weapons; separate costs from normal I–IV upgrades.

## Open validation tasks
1. Build exhaustive current weapon roster from source data and compare against local catalog.
2. Cross-check every normal tier transition against at least two independent sources or in-game evidence.
3. Resolve conflicting Anvil tier III/IV costs before marking verified.
4. Record source, timestamp, game version, and confidence for each weapon/transition; unknown costs remain unknown.
5. Only then implement a standalone main-menu tile matching existing tile patterns, responsive Android navigation, localization and planning persistence.
6. Add regression tests; keep existing Outpost entry; do not merge main without user approval.
