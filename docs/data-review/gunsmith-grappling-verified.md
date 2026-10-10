# Gunsmith IV and Grappling Hook — 10 October 2026

Base main: 8b044930451579e4879ec07ff6ab8c1e1f636349.

## Evidence actually viewed
- Grappling Hook recipe image: https://static.beebom.com/wp-content/uploads/2026/10/Arc-Raiders-Grappling-Hook-crafting-recipe.jpg . Utility Station I; 2 Rope, 1 Cable Stripper, 1 Mechanical Components.
- Pass image: https://static.beebom.com/wp-content/uploads/2026/10/Arc-Raiders-Grappling-Hook-blueprint.jpg . Blueprint at pass level 12.
- Trader image: https://static.beebom.com/wp-content/uploads/2026/10/Purchase-Grappling-Hook-Arc-Raiders.jpg . Uncommon Quick Use item. No new trader model implemented.
- Gunsmith III level-up screen: https://gameshorizon.com/wp-content/uploads/2026/10/105-How-To-Get-Amplified-Weapons-Arc-Raiders-Frozen-Trail-0-3-33-1024x576.webp . 3 Radial Press, 3 Magnetic Accelerator, 1 Emperor Modulator.
Published screenshots downloaded and visually inspected in the research turn. No personal gameplay verification. Images are research evidence, not new app assets.

## Implementation
Append level IV to existing weapon_bench only if absent; retain existing levels and newer upstream IV. Add name-only fallback materials and Grappling Hook partial record, recipe and five-language explanation. Add one crafting-material goal with blueprint and Utility Station I prerequisites stated in its label. Unknown weight, value, stack, recycling and upgrade values omitted. Existing identity pinning applies to new items and their references; backup validation accepts the new pin keys. English game names retained where translations not verified. No Anvil, Research II–IV or Outpost expansion data imported.

## Verification
PASS: syntax and diff whitespace checks; all five static Quality Gate scripts (data-integrity, catalog-update-2, frozen-trail-data, planning-core, item-find-locations).
PASS: complete targeted frozen-trail-data-browser script, all 10 cases (DE/EN/FR/ES/IT, 360/1280px). New search card, existing Gunsmith IV, crafting-material goal, counts, removal, no duplicate rows, stock preservation, reload and no page errors. EN/360 additionally upstream/fallback identity, backup/restore and malformed identity rejection. Controlled catalog, quests and font responses; not a live API or physical Android test.
Initial browser launch failed because Chromium was missing. First download mirror produced an invalid archive; fallback download supplied headless shell and the targeted run completed.
Full remote Quality Gate result pending; targeted run is not a complete gate.
