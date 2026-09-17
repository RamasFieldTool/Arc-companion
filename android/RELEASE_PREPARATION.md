# Android release preparation

Status: preparation only. This branch must not be merged into `main` while the public tester build is active without an explicit release decision.

## Isolation

- Public tester build: `main` via GitHub Pages.
- Android preparation: `android-release-prep`.
- No production deployment is configured from this branch.
- No pull request to `main` should be merged automatically.
- The current web application code and data remain unchanged.

## Recommended packaging

Use Capacitor to package a reviewed snapshot of the existing static web app as an Android application. This keeps Android-specific files isolated while reusing the current HTML, CSS, JavaScript and JSON data.

A Trusted Web Activity is not the first choice at this stage because it depends directly on the live website and its domain verification. The Capacitor snapshot is easier to test independently before publication.

## Proposed identity (confirm before first Play Console upload)

- Store name: Ramas Field Tool (confirmed by owner)
- Short description: Unofficial field tool for ARC Raiders
- Application ID: pending owner confirmation
- Initial Android version name: align with the reviewed web release
- Initial version code: 1
- Category: Tools or Books & Reference
- Languages: German and English

The application ID becomes effectively permanent after the first Play Console release. Do not create the final Play listing or signed bundle until it is confirmed.

## Required release assets

- Adaptive app icon: foreground and background layers
- 512 x 512 Play Store icon
- 1024 x 500 feature graphic
- Phone screenshots from the final Android build
- Optional 7-inch and 10-inch tablet screenshots
- Privacy-policy URL
- Support email
- Store descriptions in German and English

## Compliance review

Before upload, verify:

- Clear statement that the project is unofficial and not affiliated with Embark Studios.
- Rights and attribution for maps, icons, screenshots, fonts and game-related assets.
- Accurate Google Play Data safety answers.
- External data sources and network requests used by the app.
- No unnecessary Android permissions.
- Content rating questionnaire.
- Target API level required by Google Play at upload time.
- App behavior with no network connection and with failed external APIs.
- Local storage behavior for inventory, goals, quests, theme and language.
- Privacy policy reflects the actual released build.

## Technical preparation sequence

1. Freeze one reviewed web version for Android.
2. Create the Android wrapper only on this branch.
3. Add application ID, versioning and Android icons.
4. Package the frozen web assets.
5. Build a debug APK.
6. Test on at least one physical Android phone:
   - first launch
   - navigation
   - back button
   - keyboard and search
   - map zoom and drag
   - light/dark mode
   - language switch
   - local persistence after restart
   - external API failure/fallback
   - portrait and landscape behavior
7. Build a signed Android App Bundle (AAB).
8. Upload first to Google Play Internal testing.
9. Resolve Play pre-launch report findings.
10. Promote to Closed testing only after approval.
11. Publish publicly only after store listing, privacy and rights review are complete.

## Release gates

Do not build the final signed AAB until these are confirmed:

- final application ID
- final app icon
- privacy-policy URL
- support email
- ownership/permission status of visual assets
- stable web release version
- release countries
- free versus paid distribution

## Current repository assessment

The project is a static JavaScript web app hosted on GitHub Pages. It already has a mobile viewport, German/English UI, dark/light modes, local device storage and fallback data behavior. It does not currently contain an Android project, package metadata, a web app manifest or service worker.
