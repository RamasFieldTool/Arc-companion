# Spaceport review — fresh remap

Status: Draft / do not merge without explicit approval.

## Approved map base

- `assets/maps/spaceport-approved-base.jpg`
- Single complete JPEG, 1536 × 1536.
- Approved visually by Daniel before marker work.
- Do not reintroduce legacy Spaceport coordinates, fragmented image files, Base64 assembly, or automatic coordinate transforms from the old map.

## Freight elevators — visual draft

Source references supplied 2026-09-27: `13255.jpg` (map), `13256.jpg` (legend), `13253.jpg` (cross-check).

| ID | Base x/y (%) | Review status |
| --- | --- | --- |
| FE-01 | 48.7 / 26.6 | approximate |
| FE-02 | 23.6 / 43.0 | approximate |
| FE-03 | 44.3 / 55.9 | approximate |
| FE-04 | 72.1 / 55.3 | approximate |

These are fresh visual candidates, not verified entrances or official names.

## Raider Hatches — visual draft

Using the same supplied screenshot references, four hatch candidates remain in the review layer:

| ID | Base x/y (%) | Review status |
| --- | --- | --- |
| RH-01 | 53.1 / 12.4 | approximate |
| RH-02 | 73.1 / 31.6 | approximate |
| RH-03 | 56.4 / 44.1 | approximate |
| RH-04 | 51.4 / 49.0 | approximate |

## Raider Spawns — community review set, 2026-09-28

The earlier six-marker partial visual draft has been replaced by a current community-data review set.

Source used for the new set: current Spaceport Player Spawn entries from MapGenie community data as represented in the public `Pwingles/arc-raiders-map` snapshot. The source is not official and the locations are not independently verified by Ramas Field Tool.

- 20 Player Spawn markers are present in the current source snapshot.
- All 20 were normalized against the source Spaceport map bounds and transferred to the approved Ramas Field Tool base as review candidates.
- One source entry (`496645`) at the eastern source-map boundary was missed in the first extraction and was added during the 2026-09-28 audit.
- No legacy Ramas Field Tool Spaceport spawn coordinates were reused.
- This is a complete mapping of that source snapshot, not a claim that the game has exactly 20 possible spawns.

## Weapon Crates — community review set, 2026-09-28

Source used: current Spaceport Weapon Crate entries from the same community-data snapshot.

- 23 Weapon Crate markers are present in the source snapshot used for this review pass.
- All 23 were normalized against the source Spaceport map bounds and transferred to the approved map as review candidates.
- Some source entries are chance spawns, locked/keyed-area spawns, or special-mission spawns; the layer therefore must not imply guaranteed availability in every raid.
- No legacy Ramas Field Tool Spaceport weapon-crate coordinates were reused.

## Major ARC — focused review layers, 2026-09-28

Only large or tactically important ARC requested for the companion map are included. Small ARC types are deliberately excluded.

Primary coordinate source: current Spaceport ARC entries from the same MapGenie-derived community snapshot. Coordinates use the same normalization method already used for the Raider Spawn and Weapon Crate review layers.

Current review set:

- Bastion: 4 community positions.
- Rocketeer: 1 community position.
- Leaper: 1 community patrol-area position.
- Sentinel: 6 community positions.
- Bombardier: 1 shared `Bastion/Bombardier` candidate tagged by the source for Night Raid; it must not be represented as a guaranteed Bombardier spawn.
- Queen: event-only search-area reference between Maintenance Hangar and Staff Parking for the Harvester condition; this is an area reference, not a surveyed exact spawn coordinate.
- Matriarch: event-only search-area reference around Launch Towers; this is an area reference, not a surveyed exact spawn coordinate.

The normal Bastion, Rocketeer, Leaper, Sentinel and shared Bastion/Bombardier records above are a complete extraction of the selected large/tactical ARC entries present in the current community snapshot. That does not make them official or exhaustive in-game spawn coverage. A `Sentinel Firing Core` record in the source is deliberately excluded because it is not a Sentinel spawn location.

## “Auf Karte anzeigen” selector

Spaceport now uses a collapsible selector labelled `Auf Karte anzeigen` instead of exposing a growing flat list of technical map layers.

The selector is grouped as:

- Raider & Loot: Raider Spawns, Weapon Crates.
- Extraction: Freight Elevators, Raider Hatches.
- Major ARC: Bastion, Rocketeer, Bombardier, Sentinel, Leaper.
- Boss / Event: Queen, Matriarch.

The summary displays the number of active selections. Existing Spaceport toggles are moved into this selector only while Spaceport is active; other maps retain their existing controls. The selector remains part of the existing map controls container so it also follows the controls into the large/full-screen map view.

## Review behavior

- Every display starts disabled when entering Spaceport.
- Existing Raider Spawn, Weapon Crate, Freight Elevator, and Raider Hatch markers are unchanged except for the corrected twentieth Raider Spawn from the current source snapshot.
- Major ARC markers use their own small touch-friendly badges.
- Queen and Matriarch are visually distinct and described as event search areas.
- Existing large invisible touch targets are retained so visible markers can stay compact.
- Marker positions remain review candidates until checked visually and, where possible, in-game.

## Merge rule

PR #78 remains a work-in-progress test preview. Main must not be changed until Daniel explicitly approves a merge.
