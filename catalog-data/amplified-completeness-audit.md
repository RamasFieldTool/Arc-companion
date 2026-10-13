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

## Per-node evidence and screenshot request matrix — 2026-10-13

**Interpretation:** every row is a reported upgrade *node*, not a confirmed independently craftable weapon. `NICHT VERIFIZIERT` means no directly checked in-game node screenshot with complete material quantities, resulting stats and path. `WIDERSPRÜCHLICH` means sources conflict. All upgrade costs below remain null until individually evidenced. The separate Amplification Module cost and the one-time research are not interchangeable with node materials.

| Weapon (Mk) | Reported node | Node status | Materials | Before/after stats | Missing screenshot |
|---|---|---|---|---|---|
| hairpin (I) | Incendiary Rounds | NICHT VERIFIZIERT | unknown | unknown | hairpin upgrade tree + Incendiary Rounds hover tooltip + confirm materials + before/after stats |
| hairpin (I) | Tracker Rounds | NICHT VERIFIZIERT | unknown | unknown | hairpin upgrade tree + Tracker Rounds hover tooltip + confirm materials + before/after stats |
| hairpin (I) | Semi-Auto | NICHT VERIFIZIERT | unknown | unknown | hairpin upgrade tree + Semi-Auto hover tooltip + confirm materials + before/after stats |
| hairpin (I) | Sprint Shooting | NICHT VERIFIZIERT | unknown | unknown | hairpin upgrade tree + Sprint Shooting hover tooltip + confirm materials + before/after stats |
| kettle (I) | X Rounds | NICHT VERIFIZIERT | unknown | unknown | kettle upgrade tree + X Rounds hover tooltip + confirm materials + before/after stats |
| kettle (I) | Full-Auto | NICHT VERIFIZIERT | unknown | unknown | kettle upgrade tree + Full-Auto hover tooltip + confirm materials + before/after stats |
| kettle (I) | Anti-Shield | NICHT VERIFIZIERT | unknown | unknown | kettle upgrade tree + Anti-Shield hover tooltip + confirm materials + before/after stats |
| rattler (I) | Incendiary Rounds | NICHT VERIFIZIERT | unknown | unknown | rattler upgrade tree + Incendiary Rounds hover tooltip + confirm materials + before/after stats |
| rattler (I) | Drum Mag | NICHT VERIFIZIERT | unknown | unknown | rattler upgrade tree + Drum Mag hover tooltip + confirm materials + before/after stats |
| rattler (I) | More Reload | NICHT VERIFIZIERT | unknown | unknown | rattler upgrade tree + More Reload hover tooltip + confirm materials + before/after stats |
| burletta (II) | Burst-Fire | NICHT VERIFIZIERT | unknown | unknown | burletta upgrade tree + Burst-Fire hover tooltip + confirm materials + before/after stats |
| burletta (II) | Full-Auto | NICHT VERIFIZIERT | unknown | unknown | burletta upgrade tree + Full-Auto hover tooltip + confirm materials + before/after stats |
| burletta (II) | Increased Burst | NICHT VERIFIZIERT | unknown | unknown | burletta upgrade tree + Increased Burst hover tooltip + confirm materials + before/after stats |
| burletta (II) | Sprint Shooting | NICHT VERIFIZIERT | unknown | unknown | burletta upgrade tree + Sprint Shooting hover tooltip + confirm materials + before/after stats |
| il_toro (II) | Slug Rounds | NICHT VERIFIZIERT | unknown | unknown | il_toro upgrade tree + Slug Rounds hover tooltip + confirm materials + before/after stats |
| il_toro (II) | More Reload | NICHT VERIFIZIERT | unknown | unknown | il_toro upgrade tree + More Reload hover tooltip + confirm materials + before/after stats |
| anvil (III) | X Rounds | NICHT VERIFIZIERT | unknown | unknown | anvil upgrade tree + X Rounds hover tooltip + confirm materials + before/after stats |
| anvil (III) | Anvil Splitter | NICHT VERIFIZIERT | unknown | unknown | anvil upgrade tree + Anvil Splitter hover tooltip + confirm materials + before/after stats |
| canto (III) | Incendiary Rounds | NICHT VERIFIZIERT | unknown | unknown | canto upgrade tree + Incendiary Rounds hover tooltip + confirm materials + before/after stats |
| canto (III) | Sprint Shooting | NICHT VERIFIZIERT | unknown | unknown | canto upgrade tree + Sprint Shooting hover tooltip + confirm materials + before/after stats |
| canto (III) | Carbine Conversion | NICHT VERIFIZIERT | unknown | unknown | canto upgrade tree + Carbine Conversion hover tooltip + confirm materials + before/after stats |
| osprey (III) | Anti Weak Point | NICHT VERIFIZIERT | unknown | unknown | osprey upgrade tree + Anti Weak Point hover tooltip + confirm materials + before/after stats |
| osprey (III) | Tracker Rounds | NICHT VERIFIZIERT | unknown | unknown | osprey upgrade tree + Tracker Rounds hover tooltip + confirm materials + before/after stats |
| osprey (III) | Straight Bolt | NICHT VERIFIZIERT | unknown | unknown | osprey upgrade tree + Straight Bolt hover tooltip + confirm materials + before/after stats |
| rascal (III) | Incendiary Grenade | WIDERSPRÜCHLICH | unknown | unknown | rascal upgrade tree + Incendiary Grenade hover tooltip + confirm materials + before/after stats |
| rascal (III) | High Velocity | NICHT VERIFIZIERT | unknown | unknown | rascal upgrade tree + High Velocity hover tooltip + confirm materials + before/after stats |
| rascal (III) | Sprint Shooting | NICHT VERIFIZIERT | unknown | unknown | rascal upgrade tree + Sprint Shooting hover tooltip + confirm materials + before/after stats |
| renegade (III) | More Reload | NICHT VERIFIZIERT | unknown | unknown | renegade upgrade tree + More Reload hover tooltip + confirm materials + before/after stats |
| renegade (III) | Scoped | NICHT VERIFIZIERT | unknown | unknown | renegade upgrade tree + Scoped hover tooltip + confirm materials + before/after stats |
| bettina (IV) | X Rounds | NICHT VERIFIZIERT | unknown | unknown | bettina upgrade tree + X Rounds hover tooltip + confirm materials + before/after stats |
| bettina (IV) | Semi-Auto | NICHT VERIFIZIERT | unknown | unknown | bettina upgrade tree + Semi-Auto hover tooltip + confirm materials + before/after stats |
| bettina (IV) | Bigger Mag | NICHT VERIFIZIERT | unknown | unknown | bettina upgrade tree + Bigger Mag hover tooltip + confirm materials + before/after stats |
| hullcracker (IV) | Incendiary Grenade | WIDERSPRÜCHLICH | unknown | unknown | hullcracker upgrade tree + Incendiary Grenade hover tooltip + confirm materials + before/after stats |
| hullcracker (IV) | Mag Reload | NICHT VERIFIZIERT | unknown | unknown | hullcracker upgrade tree + Mag Reload hover tooltip + confirm materials + before/after stats |
| aphelion (V) | Incendiary Rounds | NICHT VERIFIZIERT | unknown | unknown | aphelion upgrade tree + Incendiary Rounds hover tooltip + confirm materials + before/after stats |
| aphelion (V) | Charged Burst | NICHT VERIFIZIERT | unknown | unknown | aphelion upgrade tree + Charged Burst hover tooltip + confirm materials + before/after stats |
| aphelion (V) | Bigger Mag | NICHT VERIFIZIERT | unknown | unknown | aphelion upgrade tree + Bigger Mag hover tooltip + confirm materials + before/after stats |
| aphelion (V) | Increased Burst | NICHT VERIFIZIERT | unknown | unknown | aphelion upgrade tree + Increased Burst hover tooltip + confirm materials + before/after stats |
| equalizer (V) | Anti Weak Point | NICHT VERIFIZIERT | unknown | unknown | equalizer upgrade tree + Anti Weak Point hover tooltip + confirm materials + before/after stats |
| equalizer (V) | Anti Shield | WIDERSPRÜCHLICH | unknown | unknown | equalizer upgrade tree + Anti Shield hover tooltip + confirm materials + before/after stats |
| equalizer (V) | Ramping Damage | NICHT VERIFIZIERT | unknown | unknown | equalizer upgrade tree + Ramping Damage hover tooltip + confirm materials + before/after stats |
| equalizer (V) | Bigger Mag | NICHT VERIFIZIERT | unknown | unknown | equalizer upgrade tree + Bigger Mag hover tooltip + confirm materials + before/after stats |
| jupiter (V) | Bigger Mag | NICHT VERIFIZIERT | unknown | unknown | jupiter upgrade tree + Bigger Mag hover tooltip + confirm materials + before/after stats |
| jupiter (V) | Scoped | NICHT VERIFIZIERT | unknown | unknown | jupiter upgrade tree + Scoped hover tooltip + confirm materials + before/after stats |
| jupiter (V) | Straight Bolt | NICHT VERIFIZIERT | unknown | unknown | jupiter upgrade tree + Straight Bolt hover tooltip + confirm materials + before/after stats |

### Repair cost evidence (separate from crafting)

Source: https://nettoge.com/arc-raiders-amplified-weapons/ (Japanese community guide, updated Oct 13); independent player cross-check: https://www.reddit.com/r/ArcRaiders/comments/1x3nqt8/i_completed_13_weapon_amplification_heres_my/ . Figures are reported per repair action, not upgrade crafting. **TEILWEISE VERIFIZIERT** pending full in-game repair screenshots. Maximum is the guide's maximum branch configuration, not a cost of every node or combination.

| Family | No extra node | Reported maximum branch repair | Status |
|---|---:|---:|---|
| kettle | 7 | 27 | TEILWEISE VERIFIZIERT |
| rattler | 7 | 35 | TEILWEISE VERIFIZIERT |
| hairpin | 7 | 27 | TEILWEISE VERIFIZIERT |
| il_toro | 10 | 30 | TEILWEISE VERIFIZIERT |
| burletta | 10 | 41 | TEILWEISE VERIFIZIERT |
| anvil | 13 | 23 | TEILWEISE VERIFIZIERT |
| renegade | 13 | 33 | TEILWEISE VERIFIZIERT |
| canto | 13 | 31 | TEILWEISE VERIFIZIERT |
| osprey | 13 | 34 | TEILWEISE VERIFIZIERT |
| rascal | 13 | 41 | TEILWEISE VERIFIZIERT |
| bettina | 17 | 35 | TEILWEISE VERIFIZIERT |
| hullcracker | 17 | 35 | TEILWEISE VERIFIZIERT |
| aphelion | 22 | 61 | TEILWEISE VERIFIZIERT |
| equalizer | 22 | 54 | TEILWEISE VERIFIZIERT |
| jupiter | 22 | 47 | TEILWEISE VERIFIZIERT |

### First-hand 13-amplification report limitations

The poster does **not** enumerate 13 named guns or 13 complete crafting recipes. Their exact example is Equalizer with **Beam Amp + Extended Mag**, 54 fragments to repair. These labels may correspond to the existing catalog's Ramping Damage / Bigger Mag, but that mapping is **NOT verified** and must not silently replace the names. The player's five base repair costs agree with the Japanese guide. Screenshot image in the Reddit post needs independent visual inspection; no direct confirmation of all 13 individual items is available. Original screenshot requests: (1) Equalizer tree showing both labels; (2) repair confirmation for Equalizer 54; (3) full inventory of 13 completed researches; (4) per-weapon base and max-branch repair panels for all 15 families.

### Primary-source confirmation of launch family count

Embark's official Steam announcement https://steamcommunity.com/app/1808500 states amplification rolls out to **15 weapons** and more are planned. This independently confirms the **count**, not every name in the community-derived 15-family list.

## Independent configuration database discovery (2026-10-13)

**New source:** https://arctracker.io/items (ARC Tracker, game version 2.00 item index). This is a distinct item database rather than another rephrasing of the same 15-family guide. It lists *named combined configurations* across all 15 families, including multi-perk branches, but their mere existence as database records is not proof that a player has crafted them or that each has a unique recipe.

### Family-by-family configuration review and required original proof

| Family | ARC Tracker indexed configurations or key finding | Priority original screenshot |
|---|---|---|
| Anvil | Base; Splitter; X-Rounds | Full branch tooltip and each branch material cost |
| Aphelion | Base; Bigger Mag; Charged Burst; Increased Burst; Incendiary Rounds; several combined configurations up to four perks | Full four-node path, costs and all resulting stats |
| Bettina | Base; Bigger Mag; Semi-Auto; Semi-Auto + X-Rounds | Semi-Auto → X-Rounds and exclusive Bigger Mag |
| Burletta | Base; Burst Fire; Increased Burst; Full-Auto; Sprint Shooting and combinations | Both branch screenshots and Sprint Shooting combination |
| Canto | Base; Carbine Conversion; Sprint Shooting; Incendiary Rounds and combinations | Both mutually exclusive routes with Incendiary Rounds |
| Equalizer | Base; Anti-Weak Point; Bigger Mag; Ramping Damage; two combinations with Bigger Mag. **No Anti Shield record visible** | Complete current tree to resolve Anti Shield and Beam Amp / Extended Mag aliases |
| Hairpin | Base; Incendiary Rounds; Semi-Auto; Semi-Auto + Sprint Shooting; Tracker Rounds | Three-way exclusion and prerequisite tooltip |
| Hullcracker | Base; **Incendiary Rounds**; Mag Reload; combined configuration | Confirm in-game name vs earlier Incendiary Grenade |
| Il Toro | Base; More Reload; Slug Rounds; combined configuration | Both independent nodes and combined cost |
| Jupiter | Base; Bigger Mag; Scoped; **Ergonomic Bolt**; several combinations | Confirm Ergonomic Bolt vs Straight Bolt, stats and costs |
| Kettle | Base; Anti-Shield; Full-Auto; **Anti-Shield + Full-Auto**; X-Rounds | Confirm anti-shield/full-auto compatibility and X-Rounds exclusion |
| Osprey | Base; Anti-Weak Point; Tracker Rounds; **Ergonomic Bolt** and combinations | Confirm bolt naming and exclusive branch paths |
| Rascal | Base; High Velocity; Sprint Shooting; **Incendiary Rounds** and combinations | Confirm Incendiary Rounds vs Incendiary Grenade |
| Rattler | Base; More Reload; Drum Mag; Incendiary Rounds and combinations | Drum Mag requires More Reload; confirm individual costs |
| Renegade | Base; More Reload; Scoped; combined configuration | Both node costs, unlock and stats |

**Important:** ARC Tracker's Equalizer Anti-Weak Point + Bigger Mag record https://arctracker.io/items/equalizer_amplified_anti_weak_point_bigger_mag reports **42 Amplified Fragments to repair 50% durability**. This is a different repair scope from earlier 54-fragment player report (Equalizer with two other labels) and must not be treated as a contradiction until the repair percentage and exact configuration match.

**Next verification:** enumerate and count all unique ARC Tracker variant IDs, inspect item-level upgrade-tree links and compare every variant against game screenshots; current index has been read but a complete machine-verified extraction/count is not yet available. The full screenshot proof and per-node material matrix remain incomplete.

## Targeted item-tree verification — 2026-10-13

**Actual evidence inspected:** rendered text of ARC Tracker's public game-version 2.00 item pages (NOT visual inspection of screenshots/videos). References:
- https://arctracker.io/da/items/hullcracker_amplified
- https://arctracker.io/pt-BR/items/hullcracker_iv
- https://arctracker.io/items/kettle_iv
- https://arctracker.io/items/jupiter
- https://arctracker.io/items

### Newly attributable material lists (all TEILWEISE VERIFIZIERT, database not original screenshot)

| Family | Operation | Starting item | Cost | Unlock |
|---|---|---|---|---|
| Hullcracker | Incendiary Rounds node | Amplified Hullcracker | 3 Fossilized Lightning | Compact Combustion Charges research |
| Hullcracker | Mag Reload node | Amplified Hullcracker | 3 Propellant Valve Assembly | No additional research displayed |
| Hullcracker | Base amplification | Hullcracker IV | 1 Amplification Module Mk. IV | Gunsmith level 4 |
| Kettle | Base amplification | Kettle IV | 1 Amplification Module Mk. I | Gunsmith level 4 |
| Jupiter | Base amplification | Jupiter | 1 Amplification Module Mk. V | Gunsmith level 4 |

**Important naming conflict:** the item tree calls Hullcracker's node **Incendiary Rounds**, whereas current catalog option is **Incendiary Grenade**. The catalog option is retained as disputed until an in-game menu confirms the official label; the verified database text is recorded separately. Database pages can expose node-specific costs without confirming a full research unlock chain, stats delta, or craftability in current live client.

**Current verification limitations:** exact costs for all other nodes remain unknown, as do complete before/after values, full unlocks, repair costs of each specific combined configuration, and all current in-game screenshots. No video frames were inspected in this pass. The source item index confirms multiple combined records but not their unique real-world crafted existence.
