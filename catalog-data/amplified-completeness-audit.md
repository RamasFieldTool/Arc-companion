# Amplified weapon audit — Frozen Trail 2.0 (2026-10-13)

**Status:** Research reference, not confirmed complete game export. Never infer a non-existent variant from absence in a guide. No inventory or crafting state should be changed by this audit.

## Sources and evidence hierarchy

1. Official 2.0 notes: https://arcraiders.com/news/frozen-trail-2-0-update — two new weapons Bantam/Stiletto, Anvil rarity changed to rare, old Anvil Splitter becomes Amplified Anvil upgrade.
2. Current community wiki weapon index: https://arcraiders.wiki/wiki/Weapons — baseline of 26 weapons.
3. Current community wiki amplification index: https://arcraiders.wiki/wiki/Amplification — weapon/upgrade compatibility and some tooltip values; discrepancies remain.
4. Community guide claiming 2.0 game-file tree review with screenshots: https://arcraidershub.com/guides/amplified-weapons-guide — provisional tree edges and research projects, not independently verified against game build.
5. Another community guide: https://timesaver.gg/blog/arc-raiders-weapon-amplification-guide — secondary cross-check; incomplete listing and naming discrepancies.
6. Player reports: https://www.reddit.com/r/ARC_Raiders/comments/1x3aztk/the_new_amped_weapons/ — anecdotal observations, not definitive recipes.

## Weapon-by-weapon inventory

| Weapon | Amplified status | Mk | Options recorded | Evidence |
|---|---|---|---:|---|
| hairpin | Community-listed | I | 4 | Wiki + community guide |
| kettle | Community-listed | I | 3 | Wiki + community guide |
| rattler | Community-listed | I | 3 | Wiki + community guide |
| burletta | Community-listed | II | 4 | Wiki + community guide |
| il_toro | Community-listed | II | 2 | Wiki + community guide |
| anvil | Community-listed | III | 2 | Wiki + community guide |
| canto | Community-listed | III | 3 | Wiki + community guide |
| osprey | Community-listed | III | 3 | Wiki + community guide |
| rascal | Community-listed | III | 3 | Wiki + community guide |
| renegade | Community-listed | III | 2 | Wiki + community guide |
| bettina | Community-listed | IV | 3 | Wiki + community guide |
| hullcracker | Community-listed | IV | 2 | Wiki + community guide |
| aphelion | Community-listed | V | 4 | Wiki + community guide |
| equalizer | Community-listed | V | 4 | Wiki + community guide |
| jupiter | Community-listed | V | 3 | Wiki + community guide |
| arpeggio | not listed in current amplification sources; absence not proof | — | — | Wiki weapon index + community guide |
| tempest | not listed in current amplification sources; absence not proof | — | — | Wiki weapon index + community guide |
| ferro | not listed in current amplification sources; absence not proof | — | — | Wiki weapon index + community guide |
| stiletto | reported not amplifiable at launch; absence not proof | — | — | Wiki weapon index + community guide |
| stitcher | not listed in current amplification sources; absence not proof | — | — | Wiki weapon index + community guide |
| bobcat | not listed in current amplification sources; absence not proof | — | — | Wiki weapon index + community guide |
| vulcano | not listed in current amplification sources; absence not proof | — | — | Wiki weapon index + community guide |
| dolabra | not listed in current amplification sources; absence not proof | — | — | Wiki weapon index + community guide |
| venator | not listed in current amplification sources; absence not proof | — | — | Wiki weapon index + community guide |
| bantam | reported not amplifiable at launch; absence not proof | — | — | Wiki weapon index + community guide |
| torrente | not listed in current amplification sources; absence not proof | — | — | Wiki weapon index + community guide |

**Totals:** 26 listed weapons; 15 community-listed Amplified families; 11 not currently listed as Amplified; 45 recorded upgrade associations (NOT distinct weapon inventory items).

## Provisional upgrade tree relationships

All relations below originate in the secondary community guide; they must be checked against in-game menu screenshots before treating them as authoritative.

### Prerequisites
- aphelion: Increased Burst requires Charged Burst
- bettina: X Rounds requires Semi-Auto
- burletta: Increased Burst requires Burst-Fire
- hairpin: Sprint Shooting requires Semi-Auto
- rattler: Drum Mag requires More Reload

### Mutually exclusive choices
- anvil: X Rounds ↔ Anvil Splitter
- bettina: Bigger Mag ↔ Semi-Auto
- burletta: Burst-Fire ↔ Full-Auto
- canto: Carbine Conversion ↔ Sprint Shooting
- equalizer: Anti Weak Point ↔ Ramping Damage
- hairpin: Semi-Auto ↔ Tracker Rounds
- hairpin: Semi-Auto ↔ Incendiary Rounds
- hairpin: Tracker Rounds ↔ Incendiary Rounds
- kettle: X Rounds ↔ Anti-Shield
- kettle: X Rounds ↔ Full-Auto
- osprey: Anti Weak Point ↔ Tracker Rounds

## Known source conflicts

- **Kettle Anti-Shield:** present in community game-file guide, absent from current wiki compatibility list.
- **Il Toro More Reload:** present in community game-file guide, absent from current wiki compatibility list.
- **Aphelion Bigger Mag / Increased Burst:** present in community game-file guide, absent from current wiki compatibility list.
- **Equalizer Anti Shield:** present in wiki compatibility list, absent from community game-file tree.
- **Rascal/Hullcracker incendiary name:** wiki and one community guide call it Incendiary Grenade; other guides use Rounds.
- **Straight Bolt / Ergonomic Bolt:** appears to be internal vs displayed naming; confirm in-game and by language.
- **Weapon stat figures:** tooltip values and generic guide summaries can disagree; do not apply to all weapons globally.

## Remaining verification work

- Capture all 26 weapons' availability and IV-to-V requirements from live game menus; especially Stiletto and Bantam.
- For each of the 15 Amplified families, capture complete tree and every branch/lock; compare with recorded provisional edges.
- For each node, capture material quantities, research points, research objectives, prerequisite unlocks, weapon stats and localization (DE/EN).
- Verify module Mk I–V acquisition, usage count, and whether research/repair has separate costs.
- Validate screenshots and video frames against current Frozen Trail 2.0 build and publication date.
- Only then create independent inventory item IDs for genuinely distinct, game-supported items; do not invent combinations or names.
