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

## Individual source-coordinate research — 2026-10-15 (Europe/Zurich)

Current PR head before research: 6dc00b84760dcdfa61bc1900a9b820b569ee1f1e. Quality Gate #454 passed on that exact preparation commit; it does not validate this subsequent research addition.

New source actually inspected: https://allthings.how/arc-raiders/map/pendola-pass/ and its public viewer https://allthings.how/arc-raiders/map/. The HTML declares static data base https://static.allthings.how/game-maps/arc-raiders and version parameter 1791604320. The public viewer JavaScript (agm.js?ver=0.1.72) documents rows [x,y,areaId,{t,d}] and maps x/y through Leaflet unproject at native zoom. maps.json declares 4096×4096, native zoom 4. Source pixel coordinates are retained verbatim; no percentage conversion into the RFT illustration.

`catalog-data/pendola-pass-location-evidence.json` preserves the 24 area definitions and all inspected relevant point arrays, direct source URLs and hashes. These are evidence class C, not independently confirmed gameplay facts. Source row indices are not treated as stable upstream IDs.

Successfully parsed and validated layer counts:
- weapon-case: 61
- sentinel-spawn-points: 3
- turret-spawn-points: 8
- arc-spawn-areas-small-flying: 28
- arc-spawn-areas-large-ground: 13
- arc-turbine-spawn-points: 6
- snitch-spawn-points: 6
- arc-spawn-areas-boss: 1
- arc-spawn-areas-small-ground: 83
- hydra-spawn-points: 8
- weapon-case-other-conditions: 1

Five named ARC categories contain 31 points (Sentinel, Turret, Turbine, Snitch, Hydra). Four generic ARC size/type categories contain 125 possible areas. Do not turn generic areas into specific Bully, Bastion, Queen or Matriarch pins. 62 weapon-case records consist of 61 ordinary spots plus one whose source says only during certain map conditions; the exact condition is unspecified, at Researcher Lodgings, source pixels (2216.8,565.1). Do not invent the condition. No exact coordinate duplicates occur within any imported category. Nearby points and overlaps across categories are not automatically merged; geographic deduplication remains open.

Ordinary weapon cases grouped by source area:
- Railyard: 9
- Old Town: 8
- Commissary Supermarket: 6
- Cielo Sereno Observatory: 6
- Loading Platforms: 3
- Dispatch Tower: 3
- Deep-Space Telescope: 2
- Frozen River: 2
- Almatera Village: 2
- Almatera Station: 2
- Freight Terminal: 2
- Transit Tunnel: 2
- Railroad Junction: 2
- Northern Tracks: 2
- Researcher Lodgings: 2
- Old Hamlet: 2
- Piazza della Rupe: 1
- Weather Station: 1
- Porta Benvenuti: 1
- Outside named area: 1
- Electrical Substation: 1
- Controlled Receiving Facility: 1

Correction to earlier player-start uncertainty: ARC Raiders Hub explicitly lists `raider spawn 21`. This verifies a source category/count, not 21 inspected coordinates or current in-game starts. Raw individual player-spawn coordinates remain unavailable in the inspected encoded bundle. Their evidence must remain separate from ARC and gondola/extraction markers.

Conflicts: Hub lists 72 weapon-case markers, MetaForge search retrieval 81, Salvage Line 93 Weapon Cases plus a Med Bag miscategorized in Weapon Box. AllThingsHow lists 61 ordinary plus one conditional. No combined total or completeness claim. Salvage Line's same retrieved page displays zero loaded points above its 208-location text summary, so its totals are not a successfully loaded individual-marker dataset. RaiderBuddy identifies MetaForge as its map-data source; it is not an independent corroboration.

Failures/limits: Python urllib initially returned HTTP 403 for static metadata; curl subsequently retrieved valid JSON successfully. The web retrieval tool could not open the static JSON URL, while direct curl could. arcraidersmaps.app web retrieval timed out. Salvage Line declared loot-data.json did not parse as JSON. No video watched, no timestamps validated, no game screenshots independently inspected. No source-coordinate alignment to the approximate RFT illustration and no individual player-start record are verified.

Validation performed for the snapshot: JSON parsing, source category counts, finite in-bounds coordinates, known area IDs (or -1), per-category exact duplicate checks. All passed. Production map arrays remain empty and application behavior unchanged by this research.

## Approximate overlay requested — 2026-10-15

User requested placing weapon cases and spawn points on our map. Eleven existing approximate landmark labels were paired by name with source labels, and a least-squares affine transform fitted. Anchors and matrix are recorded in the evidence JSON, preserving the raw source rows. Maximum anchor residual is 9.912 percentage points of the illustration coordinate space: this is a coarse orientation aid, not reliable building-level positioning. Residual is not an in-game accuracy bound. Southern coverage and western Hydra placement do not fully fit the illustration. Never clamp out-of-bounds locations.

Shown: 58 ordinary weapon-case locations and 30 named ARC spawn points; optional 123 generic ARC areas. Seven out-of-bounds records appear in a separate list: 3 ordinary weapon cases, 1 unspecified conditional weapon case, 1 Hydra point and 2 small-flying ARC areas. No player spawn markers are fabricated. Source class C and approximate-position warning remain visible. Separate touch-size toggles, keyboard-selectable SVG markers and source-linked selection details reuse image-aligned SVG so letterboxing, zoom and pan share one frame. Other maps and existing player data are unchanged.

## Player starting points — 2026-10-15

User requested integration. Read MetaForge's official API documentation including expanded map endpoint parameters: tableID=arc_map_data and mapID=pendola-pass. Successful endpoint: https://metaforge.app/api/game-map-data?tableID=arc_map_data&mapID=pendola-pass (5451 total records). Earlier requests with map= returned mapID:null error, then without tableID returned tableID:null error.

Exactly 21 records match category locations and subcategory player_spawn. All have unique IDs and coordinates, mapID pendola-pass, and are preserved verbatim under playerSpawns.records. This is class C/API evidence, not in-game confirmation. Do not infer all 21 occur simultaneously, lobby sizes or guarantees. MetaForge attribution and required link to https://metaforge.app/arc-raiders are displayed.

Source coordinate alignment: four matching extraction names (Reckless, Northern, Supermarket, Glacial Transceiver) paired against directly fetched https://static.allthings.how/game-maps/arc-raiders/pendola-pass/points/transceivers.json. Fitted affine mapping stored with all pairs; maximum residual below 0.03 source-map pixels. This validates consistency of the two source frames at these four points, not in-game accuracy. Then reuse the existing approximate source-to-RFT illustration mapping (up to 9.912 percentage-point landmark residual).

14 player points fall inside the illustration, 7 fall outside and are listed rather than clamped. A separate green diamond player layer keeps them distinct from red ARC points and yellow cases. No weapon-case/ARC source records changed. Full new-head Quality Gate pending.

## Standard map presentation — 2026-10-15

User requires the same symbols and layout as the other maps. Replace the custom permanently visible toggle row and SVG dots/diamonds with the existing Spaceport/Buried City presentation: collapsed grouped “Show on map” picker, active count, indicator toggles, no active layers on entry, S-numbered spawn badges, W-numbered weapon-case badges, ARC short codes, and numbered amber extraction badges. Reuse existing CSS classes rather than duplicate their styles.

An HTML overlay aligns to the visible contained bitmap using its natural dimensions; inverse zoom keeps marker sizes constant, matching Spaceport. Existing zoom/pan/fullscreen and the same layer-controls container are retained. Selection uses the standard closable detail panel inside the map stage. Warnings, out-of-bounds list and MetaForge attribution move to Data & Sources. No source coordinates, mapping transforms or evidence records changed.

## Drag gestures starting on markers — 2026-10-15

User reports map movement unavailable in zoomed view. The previous blank-space-only pan test did not cover marker touch areas. Marker pointerdown handlers stop propagation, so a gesture starting on a marker never reached the shared viewport pan handler. Add a Pendola-only capture-phase gesture handler when zoomed: six-pixel movement threshold distinguishes taps from drags, pointer capture preserves movement across markers, a tap selects the original marker, and a completed drag suppresses the following pointer click. Shared map code and other maps are unchanged. Extended regression uses real CDP touch events on a marker in mobile emulation and mouse drag on desktop, and checks marker selection remains available afterward. No actual Android hardware test claimed.
