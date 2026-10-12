# Pendola Pass — original game-map photographs

Current implementation uses the four original user-provided photographs of the in-game map: overview, north, middle and south. The user explicitly authorized using the original map on 2026-10-12. The rejected schematic drawing, coordinate trace and rendering/registration scripts are removed from this PR's resulting tree.

## Display

The map selector includes Pendola Pass. Its section picker switches between overview and the three original zoom photographs. Every reference is copied byte-for-byte; equality and SHA256 were checked locally. No filtering, cropping, recolouring, image generation or reconstruction is applied. Pendola-only CSS uses `object-fit: contain` and `filter: none`; existing maps retain their display styles. Existing full-screen, zoom, pan and reset controls are reused. Changing the photo resets zoom/pan to show the complete section.

Original embedded game icons and German labels remain visible in the photographs. They are **not independently verified app marker positions** and cannot be switched off separately. The UI states this distinction in DE/EN/FR/ES/IT. Spawn, weapon-case, loot and extraction arrays remain empty, and no interactive gameplay markers are added.

## Limits

These are photographs supplied by the user, not a clean official source-image export. Photo perspective, moiré, glare, framing and image quality remain. The overview does not establish a complete playable perimeter. The zoom photos include game UI where photographed. No surveyed coordinates, scale, elevations, or confirmed gameplay-marker positions are asserted. Real Android hardware and direct in-game comparison have not been tested.

## Validation

Local: all four copied image files verified byte-identical to the references; JavaScript/test syntax and JSON/asset/cache/version integrity checks passed. Browser regression checks all four section selections, original 1536×1152 image dimensions, contain/no-filter styling, existing zoom/pan/reset, all map switches, persisted map selection, five translated notices, empty interactive marker layers and a storage probe. Final current-head CI results are recorded in PR #144 after completion. Older schematic-map CI passes are not claimed for this changed implementation.

Local Chromium installation previously failed; browser verification uses GitHub Actions. Public PR preview is checked for the current JSON/image bytes before providing a phone test link.

## Final changed files

- Four `assets/maps/pendola-pass-original-*.jpg` reference photographs
- `maps.json`: Pendola catalog entry
- `pendola-pass-spawns.json`: original image/views, names, empty marker data
- `pendola-pass-map.js`: translated original-photo notice and section picker; scoped contain/no-filter style
- `index.html`: versioned loader
- `tests/pendola-pass-map.mjs`: original-photo and control regression
- `.github/workflows/quality-gate.yml`: focused check and screenshots
- this report

Existing maps, inventory/progress and backup implementation are unchanged. Main must not be merged without Daniel's explicit authorization.
