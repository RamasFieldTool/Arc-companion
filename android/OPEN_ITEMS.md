# Open Android release items

App: Ramas Field Tool  
Application ID: `com.ramasfieldtool.app`

This file is the authoritative checklist for inputs that are still missing. Do not replace missing information with assumptions.

## Required before public release

- [ ] Public support email address
  - Insert into the German and English privacy policy.
  - Insert into the Google Play store listing and app support details.
  - Confirm that the inbox is monitored.
- [x] Original full Ramas Field Tool / ARC Companion marketing logo supplied
  - 1536 × 1536 px source received on 17 September 2026.
  - Source identity is recorded in `LOGO_SOURCE.md`.
  - Preserve it as the full marketing/brand artwork.
- [x] Simplified Ramas Field Tool app-icon concept selected
  - Approved by Daniel Rogge on 17 September 2026.
  - Distressed cream A, three integrated yellow/orange/red stripes, subtle map pin, small FIELD TOOL lettering and circular distressed frame.
  - The selected concept does not replace the detailed full marketing logo.
- [x] Google Play icon derivative created
  - 512 × 512 px, 32-bit PNG with alpha.
  - File size: 367,061 bytes (below the current 1,024 KB limit).
  - SHA-256: `db97676befb5a383870eef851a45053df8da237d4ceb1460afbf60a53ca648de`.
  - Repository target: `android/assets/icon/ramas-field-tool-play-icon-512.png`.
- [x] Android adaptive foreground, background specification and monochrome source prepared
  - Foreground and monochrome symbols fit the documented 66 × 66 dp safe zone.
  - Background color: `#071011`.
- [ ] Android launcher resources generated and mask-tested
  - Generate final drawable/mipmap resources after the Android project exists.
  - Verify circle, squircle, rounded-square and Samsung launcher masks.
  - Verify monochrome themed icon on a physical device.
- [x] Google Play feature graphic prepared
  - 1024 × 500 px JPEG without alpha.
  - Repository path: `android/assets/store/ramas-field-tool-feature-graphic-1024x500.jpg`.
- [ ] Public URL for the privacy policy
- [ ] Final support/contact name and postal details required for the chosen Play developer account
- [ ] Final rights review for every map, logo, screenshot and third-party visual
- [ ] Final stable web version selected for the first Android snapshot
- [ ] Distribution countries
- [ ] Content-rating questionnaire completed in Play Console
- [ ] Play developer account verification completed
- [ ] Signing key and secure backup procedure
- [ ] Closed-test participant list if required for the developer account

## Confirmed decisions

- [x] App name: Ramas Field Tool
- [x] Application ID: `com.ramasfieldtool.app`
- [x] Android preparation is isolated on `android-release-prep`
- [x] The public tester build on `main` must remain unchanged
- [x] German and English store-listing drafts prepared
- [x] German and English privacy-policy drafts prepared
- [x] Initial Data safety assessment prepared
- [x] First release planned without advertising and in-app purchases
- [x] Own retro-futurist identity instead of copying official ARC Raiders branding
- [x] Current Google Play target requirement recorded: Android 16 / API 36 for new phone/tablet apps submitted after 31 August 2026
