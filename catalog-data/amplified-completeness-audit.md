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

## Systematic ARC Tracker index and recipe audit — 2026-10-13

The publicly indexed ARC Tracker game-version 2.00 item listing https://arctracker.io/items exposes **89 named Amplified item records across 15 families**: 15 base Amplified records and 74 additional named perk configurations. Counts: Hairpin 5; Kettle 5; Rattler 6; Burletta 8; Il Toro 4; Anvil 3; Canto 6; Osprey 6; Rascal 8; Renegade 4; Bettina 4; Hullcracker 4; Aphelion 12; Equalizer 6; Jupiter 8. This is an observed index count, **not a count of individually crafted in-game variants**. The 45 previously reported options count upgrade nodes, not item configurations.

### Additional node recipes from individual item-tree pages

All rows **TEILWEISE VERIFIZIERT**: source database tree text inspected, not original game-menu footage. Blank research = *not shown*, not proof none exists.

| Family | Node | Materials | Research shown | Direct source |
|---|---|---|---|---|
| Hairpin | Incendiary Rounds | 3 Fossilized Lightning | Thermite-Tipped Rounds | https://arctracker.io/items/hairpin_amplified |
| Hairpin | Semi-Auto | 3 Pneumatic Actuator | Trigger Reset Systems | https://arctracker.io/items/hairpin_amplified |
| Hairpin | Tracker Rounds | 1 Matriarch Reactor | Not shown | https://arctracker.io/items/hairpin_amplified |
| Burletta | Increased Burst | 2 Pressure Regulator | Extended Burst Cycles | https://arctracker.io/items/burletta_amplified_burst |
| Burletta | Sprint Shooting | 4 Fluted Rotor Core | Mobile-Fire Grip Fittings | https://arctracker.io/items/burletta_amplified_burst |
| Burletta | Burst-Fire | 2 Queen Reactor | Burst Assembly Recovery | https://arctracker.io/items/burletta_amplified_sprint_shooting |
| Burletta | Full-Auto | 3 Pneumatic Actuator | Not shown | https://arctracker.io/items/burletta_amplified_sprint_shooting |
| Bettina | X Rounds | 3 Fossilized Lightning | Embedded Blast Engineering | https://arctracker.io/items/bettina_amplified_semi_auto |
| Canto | Incendiary Rounds | 3 Fossilized Lightning | Thermite-Tipped Rounds | https://arctracker.io/items/canto_amplified_sprint_shooting |

Earlier database-backed Hullcracker Incendiary Rounds (3 Fossilized Lightning) and Mag Reload (3 Propellant Valve Assembly) remain separately recorded: **11 distinct database-sourced node recipes total**. All other node costs remain missing in the current audit. **No independent game screenshot was visually inspected.**

### Key explicit configuration and edge evidence

- Burletta Burst Fire → Increased Burst, 2 Pressure Regulator; Burst Fire → Sprint Shooting, 4 Fluted Rotor Core; Sprint Shooting → Burst Fire, 2 Queen Reactor; Sprint Shooting → Full-Auto, 3 Pneumatic Actuator. These are database-displayed *upgrade connections*, not merely combinations inferred from labels.
- Bettina Semi-Auto → X-Rounds, 3 Fossilized Lightning.
- Canto Sprint Shooting → Incendiary Rounds, 3 Fossilized Lightning.
- Hairpin base → Incendiary Rounds, Semi-Auto, Tracker Rounds, each with its own explicit cost.
- Index shows Kettle Anti-Shield + Full-Auto, Equalizer without Anti Shield, Hullcracker Incendiary Rounds, and Jupiter/Osprey Ergonomic Bolt. Naming and branch conflicts need in-game verification.

### Original screenshot priority

1. All remaining 34 node material panels (45 historical options minus 11 database-sourced recipes), including full cost, research requirement and predecessor path.
2. Equalizer complete current in-game tree: Beam Amp vs Ramping Damage; Extended Mag vs Bigger Mag; Anti Shield existence.
3. Hullcracker and Rascal: Incendiary Rounds vs Incendiary Grenade.
4. Osprey and Jupiter: Ergonomic Bolt vs Straight Bolt.
5. Each of the 89 database configurations: inventory/crafting menu if independently confirming actual player availability, and per-configuration repair cost and stat comparison.

**Scope note:** A complete per-record crawl of all 89 pages and the corresponding tier I–IV weapon and research item pages was not completed in this pass; do not describe the database as exhaustively mined. No public API or access restriction bypass was attempted.

## Per-record direct page inspection (2026-10-13, current pass)

**Scope limitation:** The ARC Tracker index currently displays 970 overall items and pagination/partial rendering to the public text reader. Container network DNS for arctracker.io fails. Only the following **three** individual Amplified pages were actually opened through the available web reader in this pass. Prior evidence and the index-derived 89 count are **not** proof that 89 pages were opened. The other **86 records remain NOCH NICHT GEPRÜFT in this direct-page pass**. Do not fabricate their IDs, URLs, statuses or full recipe evidence.

| Record ID | Direct URL | Technical status | Database-observed properties | Missing |
|---|---|---|---|---|
| anvil_amplified | https://arctracker.io/items/anvil_amplified | TEILWEISE AUSGEWERTET | 5 kg; sell 20,800; bullet speed 350 m/s; crit 2.5x; falloff 180–200 m; increased fire rate 75%; reduced dispersion recovery 18.75% | all node recipe tooltips, unlock path, repair menu, original game footage |
| hairpin_amplified | https://arctracker.io/items/hairpin_amplified | TEILWEISE AUSGEWERTET | 3 kg; sell 11,200; bullet speed 350 m/s; crit 2.5x; falloff 130–150 m; increased fire rate 30%; reduced reload time 40% | all node recipe tooltips, unlock path, repair menu, original game footage |
| burletta_amplified_burst | https://arctracker.io/items/burletta_amplified_burst | TEILWEISE AUSGEWERTET | 4 kg; sell 16,000; bullet speed 350 m/s; crit 2.5x; falloff 130–150 m; firing mode 3-round burst; reduced reload time 50% | full recipe tooltips, unlock path, repair menu, original game footage |

**Do not interpret** game-version-2.00 item-page attributes as independently verified current in-game effects. The public text reader exposes item stats but often does not expose dynamic crafting/upgrade panels. The technical and factual verification statuses remain separate.

**Remaining tasks before claiming a full 89-page audit:** enumerate exact 89 unique item URLs; visit every URL; record opened/failed statuses and available properties; follow all item-tree/research links; compare IDs across locale variants; obtain original game screenshots for conflicts; run tests for the resulting commit. This milestone was not completed in the current pass.

## 2026-10-14 direct page inspection expansion

**34 unique item pages opened total (3 earlier + 31 new); 55 of the previously indexed 89 still not individually opened.** All 31 new records are individually identified with their actual URLs and technical status in `arcTrackerRecordAudit.records` in the JSON catalog. Each page was returned with the item's own title and static effects; dynamic material, research, repair, and upgrade-tree panels were not accessible in the extracted text. Therefore **TEILWEISE AUSGEWERTET** / **TEILWEISE VERIFIZIERT**; no new crafting recipes claimed.

Families inspected in this batch: Anvil (two configurations), Aphelion (eleven configurations), Bettina (three), Burletta (six), Canto (five), Equalizer (two), plus base Rattler and Jupiter. Note the earlier Burletta Burst and Anvil base pages remain counted once. The page URLs and remaining gaps are stored per record; do not assume the 55 outstanding URLs can be derived reliably by guessing names.

Notable directly observed page effects: Anvil X-Rounds projectile speed **175 m/s**, very strong ARC penetration, versus Anvil Splitter **350 m/s**, strong penetration; Bettina Semi-Auto + X-Rounds **245 m/s** and very strong ARC penetration versus Semi-Auto **350 m/s**, strong penetration; Burletta Burst Fire + Increased Burst **5-round burst** versus Burst Fire **3-round burst**; Aphelion Charged Burst configurations show **0.4 s charge per burst shot**; Incendiary configurations show **5 damage/s for 2 s** on hit. These are ARC Tracker page values, not original game screenshot verification. Sources: https://arctracker.io/items/anvil_amplified_x_rounds ; https://arctracker.io/items/anvil_amplified_projectile_splitter ; https://arctracker.io/items/bettina_amplified_semi_auto_x_rounds ; https://arctracker.io/items/burletta_amplified_burst_increased_burst ; https://arctracker.io/items/aphelion_amplified_bigger_mag_charged_burst_incendiary_rounds .

## 2026-10-14 continued item-page inspection

Opened **Amplified Equalizer** at https://arctracker.io/items/equalizer_amplified (game version 2.01). Observed: 14 kg; 35,200 sell value; 350 m/s projectile velocity; 2x critical multiplier; 100–200 m falloff; Fully-Automatic; 1 s spin-up; Very Strong ARC armor penetration. Dynamic crafting/upgrade/repair panels not present in extracted page text; **TEILWEISE AUSGEWERTET / TEILWEISE VERIFIZIERT**.

Seven candidate URLs returned the web reader's exact error **“URL ... is not accessible via this tool”**: `equalizer_amplified_bigger_mag`, `equalizer_amplified_ramping_damage`, `equalizer_amplified_ramping_damage_bigger_mag`, `hairpin_amplified_incendiary_rounds`, `hairpin_amplified_semi_auto`, `hairpin_amplified_semi_auto_sprint_shooting`, `hairpin_amplified_tracker_rounds`. These candidate URL slugs are not confirmed IDs, and unsuccessful attempts **are not counted as individual page openings**. They remain pending or inaccessible by this reader, not verified item pages.

**Audit count now 35 opened / 54 not opened** out of 89 index entries. Seven unsuccessful URL attempts are logged separately in JSON. No new upgrade recipes were verified. The current browser reader cannot exhaustively traverse dynamically rendered indexed records; completion requires a browser/API route that can resolve actual item links without guessing.

## Access investigation and direct page checks — 2026-10-14

The public item index https://arctracker.io/items exposes **970** item listings with clickable item detail links, but the extracted item detail pages expose mostly static weapon effects, and do **not** consistently expose crafting, research, or upgrade tooltips. Seven candidate direct URLs previously failed in the web reader. **JavaScript rendering, separately loaded data and tool-specific URL access are possible explanations, not established root causes**. No access restrictions were bypassed.

Two newly opened direct pages: https://arctracker.io/items/bettina_amplified (2.01: 11 kg, 27,200 sell value, 350 m/s, crit 2x, range 180–200 m, fully automatic, fire rate +15%, reload time −33.3%, Strong ARC penetration); https://arctracker.io/items/burletta_amplified (2.01: 4 kg, 16,000 sell value, 350 m/s, crit 2.5x, range 130–150 m, semi-auto, reload time −50%, Very Weak ARC penetration). Reopened existing https://arctracker.io/items/equalizer_amplified_anti_weak_point and https://arctracker.io/items/equalizer_amplified_anti_weak_point_bigger_mag to inspect effects: both show **Moderate** ARC penetration, whereas base https://arctracker.io/items/equalizer_amplified shows **Very Strong**; all three show 350 m/s, crit 2x, 100–200 m falloff, 1 s spin-up. Database-observed only, no in-game confirmation.

**Current count: 37 unique opened/partially extracted pages, 52 not opened.** Seven unsuccessful attempts remain separate and must not count as opened. No new material recipes recovered in this pass. Detailed per-record status and source URLs are in `arcTrackerRecordAudit.records`. The count is a coverage measure, not a verification percentage.

## Reproducible access-method investigation (2026-10-14)

**Confirmed:** Python `requests.get('https://arctracker.io/items/bettina_amplified')` failed with `NameResolutionError: Failed to resolve 'arctracker.io'`. A second request to `https://arctracker.io/api/items` also failed, as did direct access to github.com from the same runtime. This establishes **DNS/network unavailability in the execution environment**, not ARC Tracker blocking. The web text reader can open some ARC Tracker item pages but does not provide browser network inspection or full dynamic upgrade trees.

**New independently documented access path:** ARC Tracker publishes API docs at https://arctracker.io/developers/docs. The docs explicitly advertise unauthenticated `GET https://arctracker.io/api/items` for all items with multilingual names, descriptions and effects; they do **not** explicitly promise upgrade recipes/research in that endpoint. Attempted to open that endpoint with the web reader; result: `URL ... is not accessible via this tool`. Direct Python request fails DNS. Therefore **no API payload was read and no API-derived material recipe or upgrade connection may be claimed**. The same docs advertise an MCP endpoint `https://mcp.arctracker.io/mcp`, requiring user connection/sign-in; it was not invoked or connected. Browser network requests and JS-rendered UI could not be inspected with the available tools.

**Count unchanged:** 37 partially opened; 0 fully extracted; 52 unopened; seven failed item-page attempts recorded separately. No newly validated recipes. A fully reproducible extraction method for dynamic recipes was **not** established. Next viable route: user-authorized ARC Tracker MCP connection or accessible browser/network environment, then validate one full record before scaling. Do not guess fields from API docs.

### Additional public-source inspection

ARC Tracker's own footer links to its ARC Data Project at https://github.com/RaidTheory/arcraiders-data, a publicly described MIT-licensed JSON game-data repository with an `items/` directory. The web reader could open the repository README but failed to fetch the `items/` directory; **no item JSON payload was inspected**, so this is a promising alternative source, not evidence of recipe completeness. The public `https://arctracker.io/items` index rendered only the first 60 linked item entries in the text reader, although it states 970 total items; therefore the remaining Amplified item slugs cannot be reliably enumerated from that page alone. This is a demonstrated pagination/text-extraction limitation, not proof of missing records. The index link to `equalizer_amplified` worked. The 37/89 coverage count remains unchanged.

## RaidTheory public JSON repository investigation (2026-10-14)

Source: https://github.com/RaidTheory/arcraiders-data, operated by RaidTheory, community compiled data powering ARC Tracker. README explicitly says the compilation originates from **Tech Test 2**, does not claim current Frozen Trail 2.0 completeness. MIT LICENSE (copyright 2025 RaidTheory) with README clarification that game content belongs to Embark Studios AB and requests attribution to repository and ARC Tracker. JSON `items/*.json` holds localized names, `effects`, `recipe`, `upgradeCost`, `updatedAt`, `addedIn`; the presence of these fields does not imply Amplified recipes exist.

**Actual file tests:** `items/anvil_amplified.json` and `items/bettina_amplified.json` returned 404. Successfully fetched `items/anvil_iv.json` (`updatedAt: 02/24/2026`, upgradeCost: heavy_gun_parts 1 + mechanical_components 4), `items/kettle_iv.json` (same date; mechanical_components 3 + simple_gun_parts 1), `items/rascal_iv.json` (`updatedAt: 05/19/2026`, advanced_mechanical_components 2 + heavy_gun_parts 2), `items/canto_i.json` (`addedIn: 1.22`, `updatedAt: 03/31/2026`, crafting recipe: advanced_mechanical_components 2 + magnet 5 + medium_gun_parts 3), and `items/aphelion.json` (`addedIn: 1.2`, `updatedAt: 01/13/2026`, crafting recipe: complex_gun_parts 3 + magnetic_accelerator 3 + matriarch_reactor 1). **These are historical base weapon or tier IV recipes/upgrade costs, NOT new Amplified upgrade recipes.** No new Amplified material recipes or research requirements verified. No evidence that 89 configurations or 45 nodes are complete in this repo.

**Data quality conflict:** historical `items/anvil_iv.json` has German localization `Amboss IV`, while the user reports the live game uses `Anvil`. Keep UI name `Anvil`; don't automatically overwrite with this old translation. Further coverage requires enumerating source repository tree or finding actual Amplified files, not guessing paths. Audit remains 37 partially inspected / 52 not opened; repository-file inspection is a separate evidence stream and must not inflate ARC Tracker page count.

## RaidTheory file-content and version check — 2026-10-14

GitHub connector searched the repository default branch for `amplified`, `amplification`, `frozen trail`, `amplification_module`, `incendiary_rounds` and found **zero indexed code matches** for each. `matriarch_reactor` returned four matches (items/matriarch_reactor.json, bots.json, items/aphelion.json, projects.json); `upgradeCost` returned numerous older `items/*_ii/iii/iv.json` records. Direct fetch of `items/anvil_amplified.json` and `items/bettina_amplified.json` yielded 404; these paths were hypotheses and **do not prove global absence**. Checked additional potential consolidated files: `items.json`, `items/index.json`, `weapons.json`, `research.json`, `upgrades.json` all 404. Actual structured files fetched: `skillNodes.json` (player skill tree, not weapon research), `hideout/weapon_bench.json` (maxLevel 3), `package.json` (format/check scripts), plus 5 older item JSON files documented above. `prettier.config.js` defines `items/`, `hideout/`, `quests/` JSON conventions, `skillNodes` and `projects` standalone; this is configuration evidence, **not a full repository tree listing**.

Latest commit returned by GitHub repository commit search: [`2a4abebb2486a633070f4e260058bcd5ad4511d6`](https://github.com/RaidTheory/arcraiders-data/commit/2a4abebb2486a633070f4e260058bcd5ad4511d6), message **“Merge pull request #323 from baschny/update-1-42-0 — Add infos from 1.42.0 update”**. This supports game version **1.42.0 as explicitly named in commit history**, not 2.0. A Git commit's timestamp is not evidence of in-game data version. No complete recursive tree, tags or releases could be enumerated using the available GitHub connector actions. Thus conclusion **Amplified data: UNKLAR (none found in searched indexed files)**; no new Amplified recipes, research or upgrade connections. Further old-item-by-item queries are low-value unless a tree/API source exposes actual new file paths.
