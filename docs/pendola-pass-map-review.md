# Pendola Pass — illustrated reconstruction

The user approved this independent AI-assisted illustration on 2026-10-12. Four original photographs guided the generated overhead snow-terrain image. The illustration replaces the photographed overview and section picker in the application. Original photographs remain as reference assets, not selectable backgrounds.

## Accuracy and limits

This is an artistic approximation, not a surveyed or geographically verified reconstruction. Individual buildings, routes, terrain and southern coverage may differ from the original. No exact scale, perimeter or coordinates are asserted. Four main areas and 13 identifiable landmark names have approximate SVG overlays. Smaller names appear when zoomed. Raststätte, Altstadt and Umspannwerk cannot be reliably matched in the generated southern terrain and remain in the list only. All positions are manual visual approximations. Spawn, loot and weapon-case arrays remain empty. Four visible extraction symbols are transferred approximately from overview pixels (819,398), (535,650), (770,614), (880,886). These are reference-derived positions, not in-game verified coordinates. No extraction names, conditions or availability are asserted.

## Integration

`assets/maps/pendola-pass-rft-base.jpg` is the approved illustration, encoded as a high-quality JPEG. Pendola-only contain/no-filter styling preserves the entire image. The existing selector, full-screen, zoom, pan and reset are reused. Five-language notices identify an approximate AI-assisted reconstruction. Existing maps and storage/backup implementation are unchanged.

## Validation

Local checks and current-head CI results are recorded in PR #144. Tests from the previous original-photo implementation do not validate this version. Real Android hardware and direct in-game geographic comparison have not been performed. Main remains unchanged until explicit merge authorization.

## Loot and ARC spawn preparation — 2026-10-14

Remote main checked: 0700f1f5f2a02c48f172702e5a34de15e6324ceb. No map-coordinate import or new gameplay markers. Existing player-spawn and weapon-case arrays remain empty. The approximate illustration has no verified transform from other maps; multiplying source coordinates into our image would assert unsupported locations.

Sources actually opened via web retrieval:
- https://metaforge.app/arc-raiders/map/pendola-pass — retrieval lists 81 Weapon Case markers.
- https://arcraidershub.com/maps/pendola-pass — retrieval and downloaded HTML list 72 weapon cases and separate ARC categories.
- https://salvagelinegaming.nl/pendola-pass — lists Weapon Box 94, comprising 93 Weapon Cases and one Med Bag. Category error must not be counted as a weapon case.

These are source-specific counts, not deduplicated or confirmed totals. No individual marker or player starting location was verified in game. No videos or timestamps were checked.

Direct HTTP inspection of Hub map configuration succeeded: /maps/pendola-pass/pendola-pass.json declares a 4096×4096 coordinate frame. /api/markers/bundle/pendola-pass returned an encoded bundle (v,d), not readable marker records. The declared /data/pendola-pass-markers.json returned HTTP 404. No decoding or access workaround attempted. These endpoints do not establish individual positions.

Preparation delivered: a five-language expandable source list in Pendola map only, warning that positions remain unaligned and player start points unresolved. No source counts shown as gameplay facts. Existing map layers and storage unchanged.

Next import requires readable individual marker records or inspected source screenshots, stable source IDs, category checks, duplicate review, source-map coordinates preserved separately, and a verified visual alignment to our map. ARC spawns, player spawns and weapon cases must remain separate. Until then no precise overlays should be enabled.
