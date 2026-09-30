# Raider Radio

The launcher opens `#raiderRadio` through the existing hash navigation and Back button.
The song list lives in `raider-radio.js`; array order controls display order.

To add song 3:

1. Add its approved, unchanged cover to `assets/music/`.
2. Add one object to the `songs` array, with a unique `id`, the exact `title`,
   a repository-relative `cover`, and the official `sunoUrl`.
3. Increment the `raider-radio.js?v=1` cache version in `index.html`.

No HTML card needs to be copied. Cards are generated with DOM APIs and textContent.
Listen links open the official Suno pages in a new tab with `noopener noreferrer`.
There is no player, iframe, direct audio URL, audio hosting or download control.
Suno itself controls playback and any actions available on its website.
Button labels support the existing English, German, French and Spanish UI.
Song titles and the Raider Radio name stay unchanged.

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
