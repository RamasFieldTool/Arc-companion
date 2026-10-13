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

## Verification pass 2 — screenshot evidence and unresolved conflicts (2026-10-13)

Independent cross-checks: official Embark Frozen Trail notes, arcraiders.wiki Amplification table, arcraidershub 2.0 game-file guide with linked in-game screenshots, allthings.how weapon compatibility table, wiki.arcraiderscommunity.com Amplified Weapons summary, and boostingfactory 2026-10-11 guide. The latter three overlap heavily and do **not** count as three independent confirmations of every upgrade node. No full first-party exported tree has been obtained.

- 26 weapon names reviewed in coverage matrix. 15 listed as Amplified by multiple secondary sources, but **official Embark notes do not individually enumerate all 15**. Eleven other weapons remain unconfirmed for Amplification; Bantam and Stiletto specifically reported excluded at launch by secondary sources.
- 45 recorded option associations, **not** 45 confirmed distinct guns. The community guide lists 44 because it omits Equalizer Anti-Shield; wiki lists Equalizer Anti Shield and omits some other guide options. Therefore total confirmed unique fifth-tier inventory records cannot be inferred.
- Five prerequisite edges and eleven mutual-exclusion pair edges recorded provisionally. Verified logical direction against the community guide table: Aphelion Increased Burst requires Charged Burst; Bettina X Rounds requires Semi-Auto; Burletta Increased Burst requires Burst-Fire; Hairpin Sprint Shooting requires Semi-Auto; Rattler Drum Mag requires More Reload.
- Screenshot-linked exact facility requirement: Gunsmith III→IV = 3 Radial Press, 3 Magnetic Accelerator, 1 Emperor Modulator (Outpost IV).
- Screenshot-linked Anvil X-Rounds research = 5,000 research points + 5 Rocketeer Drivers; task 1,000 damage each to Fireflies, Hornets, Fireballs, Surveyors using Light Impact Grenades. Anvil X-Rounds node cost reported as 3 Fossilized Lightning, but primary screenshot still needs manual validation.
- Screenshot-linked Anvil amplification preview: damage 40→48, range 50.2→44.6, durability 130→200. Osprey amplification preview reports bolt-action time −60% and reload time −37.5%. These are **not** universal modifiers for all guns.
- Specific unresolved numerical conflicts: Anvil X-Rounds armor damage bonus wiki +33% vs secondary guide +35%; headshot reduction wiki −10% vs guide −30%; horizontal recoil wiki +30% vs guide +20%. Keep separate, do not publish one as verified.
- No reliable complete matrix of exact per-weapon/per-node crafting costs or before/after stats exists in checked sources. No guesses or cross-weapon transfers are permissible.

### Sources checked in this pass

- https://id.embark.games/arc-raiders/support/faq/282-2-0-frozen-trail-update
- https://steamcommunity.com/games/1808500/announcements/detail/708911159562994572
- https://arcraiders.wiki/wiki/Amplification
- https://arcraidershub.com/guides/amplified-weapons-guide
- https://allthings.how/arc-raiders-frozen-trail-how-amplified-weapons-work/
- https://wiki.arcraiderscommunity.com/wiki/Amplified_Weapons
- https://www.boostingfactory.com/arc-raiders/blog/arc-raiders-amplified-weapons-guide
- https://www.pcgamer.com/games/third-person-shooter/arc-raiders-emperor-modulator-location/

### Next evidence needed

1. Individual live upgrade menu captures for every weapon family and every node; document screenshot date and game build.
2. Per-node material counts and before/after weapon stats, including alternative paths and irreversible branches.
3. Independent verification of whether Equalizer Anti-Shield is selectable in the current build, and of Grenade/Rounds and Straight Bolt/Ergonomic Bolt naming.
4. First-party evidence for each of the eleven non-listed weapons before claiming that a fifth-tier version is impossible.
