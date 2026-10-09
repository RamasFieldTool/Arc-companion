# Outpost unlock follow-up — 9 October 2026

Base main: 80f60a6905650169d71d8e2a40b74bafbbb99da1.

## UI change
Add a community-source note in Tips & Tricks / Frozen Trail information (DE, EN, FR, ES, IT): player level 18, all three Sheltered Retreat phases, and distinction from the material-only goal. No stock, goals, recipes or IDs changed.

Sources read:
- https://arcraiders.wiki/wiki/Outpost — revision 42112, edited 9 October 18:49.
- https://www.keengamer.com/articles/guides/arc-raiders-how-to-unlock-the-outpost/
Both state level 18 and three phases. Independent collection not established; no own gameplay verification.

## Research candidates, not imported
- Official Steam Hotfix 2.0.2 fixes weapon visuals, server crashes, a Pendola grate and DLC purchasing. Reward Pass progression issue acknowledged. No recipe values announced. https://steamcommunity.com/app/1808500/allnews/?l=english
- MetaForge Anvil I dated October 9: craft 2 Advanced Mechanical Components + 3 Heavy Gun Parts + 3 Hand Drill; upgrade 1 advanced component + 1 heavy part. https://metaforge.app/arc-raiders/database/item/anvil-i . Still claims Tian Wen availability despite official removal. Recipe remains a candidate, not verified game data.
- RaiderBuddy Research II–IV matches wiki; Gunsmith IV: 3 Radial Press + 3 Magnetic Accelerator + 1 Emperor Modulator. https://raiderbuddy.com/cheat-sheet/needed-items . Independent origin not established, no game screenshot inspected.
- Wiki Anvil still has unknown crafting and conflicting upgrade rows.
- Direct opens of SteamDB hotfix, Wiki Update:2.0.2, Research Station and Hand Drill failed in search tool. Official hotfix read on Steam instead. Retrieval failures are not RFT defects.

## Validation
JavaScript syntax check passed. Targeted browser script completed: all 10 cases (DE/EN/FR/ES/IT at 360 and 1280 pixels) passed, checking localized category, three source links, level 18 text, accordion visibility, no document overflow, preserved stock and no page errors. Item catalog and quests controlled via test routes. No full Quality Gate result claimed. Initial launch failed because Chromium was missing; first download mirrors returned invalid archives, fallback downloads succeeded. A temporary full-Chromium diagnostic failed on prohibited socket creation. Standard installed headless shell subsequently ran the complete targeted script successfully.
