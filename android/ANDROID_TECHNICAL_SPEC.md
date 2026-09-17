# Android technical specification

## Product identity

- Display name: Ramas Field Tool
- Application ID: `com.ramasfieldtool.app`
- Initial version code: `1`
- Initial version name: set from the frozen, reviewed web release
- Orientation: portrait preferred; landscape supported and tested
- Languages: German and English
- Distribution artifact: signed Android App Bundle (AAB)
- First distribution track: Google Play Internal testing

## Isolation and source policy

- The live tester application remains on `main`.
- Android-specific work remains on `android-release-prep`.
- No automatic merge to `main`.
- No automatic production deployment from the Android branch.
- The first Android build packages a reviewed snapshot instead of silently following every live web change.
- Changes to search, calculations, data or user-interface behavior are outside this preparation phase.

## Wrapper approach

Preferred approach: Capacitor Android wrapper around a frozen copy of the reviewed static application.

Reasons:

- reuses the existing HTML, CSS, JavaScript and JSON data,
- keeps Android configuration separate,
- allows APK testing before Play upload,
- provides controlled versioning,
- avoids making the installed Android release depend on every immediate change to the live tester site.

The actual generated Android project should be created only after the web release to package has been selected.

## Required behavior

- App opens directly into Ramas Field Tool.
- No browser address bar or external browser-style controls.
- Android back button:
  - closes an open drawer or transient panel first where technically possible,
  - otherwise follows normal Android navigation,
  - exits only when no internal navigation state remains.
- Existing local progress must survive a normal app restart and application update.
- Uninstalling or clearing app data may delete local progress.
- External links open safely in the system browser.
- Network failures show existing fallback or error states instead of a blank screen.
- Status-bar and navigation-bar colors match the dark/light theme where supported.
- No unnecessary splash delay.

## Permissions

Expected:

- Internet access.

Not expected for the first release:

- location,
- camera,
- microphone,
- contacts,
- calendar,
- phone,
- SMS,
- nearby devices,
- storage/media library,
- notifications,
- advertising ID.

The generated Android manifest and all dependencies must be inspected before release. Any unexpected permission blocks publication until explained and approved.

## Storage

The reviewed application currently uses local device storage for:

- language,
- dark/light theme,
- material quantities,
- active goals,
- quest status,
- learned blueprints,
- onboarding/help state.

No migration or renaming of these storage keys should occur in the first Android wrapper unless separately tested.

## Network allowlist to review

Current known external services:

- `arcdata.mahcks.com`
- `api.github.com`
- GitHub-hosted raw content used by RaidTheory
- `fonts.googleapis.com`
- `fonts.gstatic.com`

Before final build:

- verify every actual outbound domain,
- locally bundle the font if permitted and practical,
- keep local fallback data available,
- update the privacy policy if any service changes.

## Security

- No secrets, signing passwords or keystore files in Git.
- Signing material must be stored separately with a recoverable backup.
- Release builds must disable debugging.
- Cleartext HTTP traffic must remain disabled.
- Web content must not enable unrestricted navigation to arbitrary origins.
- No remote code should be loaded beyond the reviewed data and font sources.
- Dependency versions must be locked for the release build.

## Build outputs

1. Debug APK for direct installation on Daniel's Samsung Android phone.
2. Signed AAB for Google Play Internal testing.
3. Release notes and checksum recorded with the source commit used.
4. Final manifest and dependency inventory archived for Data safety verification.
