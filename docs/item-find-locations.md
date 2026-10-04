# Item search: possible find locations

Data source: RaidTheory `arcraiders-data` (MIT), https://github.com/RaidTheory/arcraiders-data

Runtime behavior:
- `foundIn` is reused from the already loaded item catalog and accepts string or array values.
- ARC drop data is fetched once per page from RaidTheory `bots.json`, validated, and then kept in memory. Opening/searching cards performs no additional external requests.
- If that request fails or is invalid, a small validated local fallback covers Bastion, Matriarch and The Queen. The item search itself remains functional.
- Map IDs are translated only through an explicit known-ID table; unknown IDs are displayed literally rather than guessed.
- Source links are fixed to the approved RaidTheory repository.

Verified reference case (2026-10-04):
- `magnetic_accelerator`: `foundIn = Exodus`.
- RaidTheory `bots.json`: dropped by `arc_matriarch` (Dam Battlegrounds) and `arc_the_queen` (Dam Battlegrounds, The Spaceport, The Blue Gate).

These are community data and do not guarantee a spawn or drop.
