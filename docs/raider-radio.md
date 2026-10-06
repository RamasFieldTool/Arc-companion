# Raider Radio

The launcher opens `#raiderRadio` through the existing hash navigation and Back button.
The song list lives in `raider-radio.js`; array order controls display order.

The Lion Montana album collection is inserted first. Ralf's “Against the Steel
Titans” is the first entry in `songs`, so it appears second in the radio grid.
The remaining Suno entries keep their original order and links.

Songs can use an official `sunoUrl` for an external link, or an approved
repository-relative `audioUrl` for a native HTML5 audio player. Optional `artist`
is displayed above the title. External links open in a new tab with
`noopener noreferrer`. Native players use `preload="none"`, no autoplay, and
`controlslist="nodownload noplaybackrate noremoteplayback"`; playback pauses when
navigating away from the radio list. There is no app-provided download button.
The browser ultimately controls which native controls it displays.

Ralf explicitly permitted publication (Daniel's work order, 2026-10-06).
Source: provided MP4, 179.700333 seconds, 1024 × 1024 H.264 video and AAC audio.
The audio is an MP3 encoded at 96 kbit/s, with source metadata removed. The cover
is the video frame at one second, encoded as WebP. Both are hosted as ordinary
binary files under `assets/music/ralf/`; no Base64 splitting is required.

All radio explanation text supports DE/EN/FR/ES/IT. Titles and artist names stay
unchanged. Bump both radio asset query versions in `index.html` when changing
these scripts or styles.

The radio browser regression checks 320/412/1280 px, light/black surfaces and all
five languages, covers, title/artist/order, no automatic media requests, audio
loading and play/pause, navigation pausing, original outgoing links and layout.
External platform popup checks use fixtures and do not verify real platform
availability or external playback. Physical devices require a separate check.

## Verification for the initial implementation

Base: `fba35c941a5f40a18b2b8a988741450f26652ee2` (main, V13.0.21).

Passed:

- `node tests/data-integrity.mjs` and syntax checks for changed JS and the new test.
- JavaScript execution with a minimal DOM harness: two cards, exact titles,
  order, cover paths, official URLs, new-tab attributes and all four button labels.
  Adding a third record generated a third card without adding HTML.
- Approved PNGs were visually inspected and copied without changing their bytes;
  both measure 1254 × 1254 pixels.
- Source inspection found no audio files tracked in the repository and no player,
  iframe, download control or audio extraction added by Raider Radio.
- Scoped accent contrast calculations: #995000 on white is 6.00:1;
  #ffc46b on #080a0c is 12.62:1. These are source-color calculations,
  not measurements of rendered browser pixels.
- `git diff --check`.

Not tested / not verified:

- Real browser startup, mobile/desktop rendering, overflow, runtime console,
  Back navigation, language changes inside the running app and regression flows.
- Actual playback or availability of the two Suno pages.
- Physical Android and iPhone devices.

The browser test environment has Playwright but no installed browser. Browser
installation failed because its download was not a valid archive.
The existing quality gate and UI regression tests could not run. The dedicated
`tests/raider-radio.mjs` is prepared but has not run; its Suno popup test uses
intercepted pages to verify outgoing URLs, not actual Suno playback.

When a browser is available, serve the repository at port 4173, then run:

```sh
node tests/raider-radio.mjs
node tests/ui-regression.mjs
node tests/quality-gate.mjs
```

The radio test covers 320/412/1280 px, light/black surfaces, EN/DE/FR/ES,
loaded covers, titles, links, no audio requests, Back and direct hash navigation.
It does not replace a real-device check.
