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

- 19 Player Spawn markers are present in the source snapshot.
- All 19 were normalized against the source Spaceport map bounds and transferred to the approved Ramas Field Tool base as review candidates.
- No legacy Ramas Field Tool Spaceport spawn coordinates were reused.
- This is a complete mapping of that source snapshot, not a claim that the game has exactly 19 possible spawns.

## Weapon Crates — community review set, 2026-09-28

Source used: current Spaceport Weapon Crate entries from the same community-data snapshot.

- 23 Weapon Crate markers are present in the source snapshot used for this review pass.
- All 23 were normalized against the source Spaceport map bounds and transferred to the approved map as review candidates.
- Some source entries are chance spawns, locked/keyed-area spawns, or special-mission spawns; the layer therefore must not imply guaranteed availability in every raid.
- No legacy Ramas Field Tool Spaceport weapon-crate coordinates were reused.

## Review behavior

- Freight elevators, Raider Hatches, Raider Spawns, and Weapon Crates each have their own toggle.
- Layers start disabled when entering Spaceport.
- Spawn markers are small blue `S1…S19` badges.
- Weapon-crate markers are small distinct `W1…W23` badges.
- Existing large touch targets are retained so the visible badges can stay small.
- Marker positions remain review candidates until checked visually and, where possible, in-game.

## Merge rule

PR #78 remains a work-in-progress test preview. Main must not be changed until Daniel explicitly approves a merge.
