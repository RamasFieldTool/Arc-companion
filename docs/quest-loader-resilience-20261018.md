# Quest loader resilience review — 2026-10-18

## Phase A: baseline

- Starting branch: `main`
- Starting commit: `bd4c04cd6a1f065586abeb02646f98a644919fcd` (merge of PR #158).
- Open pull requests at review time: #140, #111, #109 and #106, all Draft.
- `app.js` owns quest fetching and keeps quest data in the in-memory `quests` array.
- `loadQuests()` lists `RaidTheory/arcraiders-data/quests` through GitHub's contents API, fetches JSON files in batches of ten, isolates individual request failures, and only warns in the console when the result is partial.
- No quest snapshot or quest cache exists on `main`.
- `boot()` awaits item catalog loading and then awaits quests before `applyLanguage()` draws the application views. A quest request that stalls can delay the final redraw.
- Quest status is stored separately under the existing `arcQuestStatus` localStorage key. `planning-core.js` reads that state by stable quest ID and combines active quest item requirements with workshop and personal goals. This work must not write or migrate that key.
- Existing test coverage is distributed across `tests/quality-gate.mjs`, `tests/startup-readiness.mjs`, `tests/planning-usability.mjs`, `tests/free-raid-progress.mjs`, and the UI/localization suites. The workflow is `.github/workflows/quality-gate.yml`.
- Item catalog snapshot/fallback logic is implemented separately in `catalog-resilience-v2120.js`; it is outside the intended change scope.

## Functions at risk from this change

1. Quest source selection, error/partial state, retry behavior, and user-facing status in `app.js`.
2. The quest drawer, filters, and rendering through `quests-v2115.js` and its existing status element.
3. Quest loading's place in startup so item search and workshop/personal planning render independently of the quest network request.
4. Shared planning rows, but only as a regression surface: quest IDs and `arcQuestStatus` remain unchanged.
5. The quality-gate workflow and browser fixtures for network failure, delayed responses, mobile widths, and five locales.

## Snapshot provenance

The upstream quest index returned HTTP 200 on 2026-10-18 at 00:44:07Z from the pinned source commit `2a4abebb2486a633070f4e260058bcd5ad4511d6` (commit date 2026-08-19). All 100 JSON entries were fetched again from that exact commit; all 100 IDs matched their filenames, were non-empty and unique. The index ETag was `8188de65f8970ac7b0ab09a4490095644dd86b52`. The last Git commit touching the upstream `quests` path was `1b0be78480398b6493aa1d5df5530bac4ff7ae2c` on 2026-05-29; the newest per-file `updatedAt` is 2026-04-28. SHA-256 of the canonical quest array: `bab31412d821d9b74d96d11345b6d5a7b21ad66cbc747e66c6a1db9fbb44ec60`. This is complete relative to the pinned public source commit, but is not independently verified against the game. The app must identify the source date and this limitation whenever it uses the snapshot.
