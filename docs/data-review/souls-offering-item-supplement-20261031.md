# ARC Raiders 2.3.0 item supplement

Checked: 2026-10-31  
Game update: Live Update 2.3.0, released 2026-10-27  
Work branch: `codex/update-souls-offering-items-2026-10`

## Added records

The item catalog supplement contains seven records:

| ID | English name | German name | Type | Value / stack |
|---|---|---|---|---|
| `rock_salt` | Rock Salt | Steinsalz | Trinket | 640 / 5 |
| `dead_flowers` | Dead Flowers | Vertrocknete Blumen | Trinket | 640 / 5 |
| `railway_lantern` | Railway Lantern | Eisenbahnlaterne | Trinket | 3,000 / 3 |
| `fancy_plate` | Fancy Plate | Dekorativer Teller | Trinket | 7,000 / 3 |
| `mask_fragment` | Mask Fragment | Maskenfragment | Trinket | 7,000 / 3 |
| `offering_display_table` | Offering Display Table | — | Outpost Furniture | Not listed / 1 |
| `offering_display_table_design` | Offering Display Table Design | — | Design | Not listed / 1 |

The five trinkets are listed as new items for the Souls Offering project. The two table entries are separate reward/catalog entries, not project loot materials. The tool uses English names for the table entries because a German localized name was not verified.

The project quantities are represented in the item descriptions: 2 Rock Salt, 4 Dead Flowers, 2 Railway Lanterns, 2 Fancy Plates, and 1 Mask Fragment. Existing project materials were not changed.

## Source status

- Embark's [Live Update 2.3.0 notes](https://arcraiders.com/news/live-update-2-3-0) confirm the new Souls Offering player project and date, but do not enumerate its item list.
- The community-generated [ARC Scrappy update index](https://www.arcscrappy.com/en/updates/2026-10-29) identifies five new project trinkets and two other new entries.
- ARC Tracker item pages were checked for the five trinket names, type, rarity, value, weight, stack size, and loot categories. The project requirements were cross-checked against its [current project checklist](https://arctracker.io/de/needed-items/cheatsheet).
- ARC Scrappy's [Offering Display Table](https://www.arcscrappy.com/en/items/offering_display_table) and [Design](https://www.arcscrappy.com/en/items/offering_display_table_design) pages identify the two additional records as Outpost Furniture and Design, respectively.
- The current direct Mahcks request returned HTTP 403 in this environment. This does not establish whether the API is unavailable to all clients.
- RaidTheory's `main` branch was fetched at commit `2a4abebb2486a633070f4e260058bcd5ad4511d6` (2026-08-18). Its 581 records did not include these seven IDs. The previous Ramas snapshot also contained 581 records and was generated 2026-09-24.

## Images

All seven records have explicit `imageFilename` links discovered from the item pages and restricted to the existing `cdn.arctracker.io` allowlist. The two table entries use the same table icon because that is the image link provided on both pages. The image URLs were not successfully fetched from this environment (HTTP 403), so actual availability and visual correctness remain unverified. No image files were downloaded or stored in the repository.

## Integration

- `catalog-data/souls-offering-items-2-3-0.json` is the single hand-maintained supplement source.
- The app merges these records into live, cached, and fallback catalogs when a provider does not include them. Existing provider records remain authoritative; the supplement only fills missing image, name, description, or evidence fields.
- `items.json` receives the same records for the local fallback.
- `scripts/build-catalog-snapshot.mjs` merges the same source into the full snapshot, and the snapshot workflow watches the supplement file.
- The Outpost furniture catalog now includes the Offering Display Table and its linked design name. No craft recipe was added because the item pages list none; the catalog shows that missing recipe data explicitly. Its result count now derives from the data instead of a hardcoded 100.

No project test suite was run in this work.
