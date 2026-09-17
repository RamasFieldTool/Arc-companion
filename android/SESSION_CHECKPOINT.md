# Android release preparation checkpoint

Saved: 17 September 2026  
Resume point: create the separate public privacy-policy website after the support email address has been chosen.

## Confirmed identity

- App name: Ramas Field Tool
- Application ID: `com.ramasfieldtool.app`
- Languages: German and English
- Price: Free
- Advertising: None
- In-app purchases: None
- Target SDK: Android 16 / API 36
- Preparation branch: `android-release-prep`
- Live tester branch: `main` — must remain unchanged

## Prepared

- German and English Play Store listing drafts
- German and English privacy-policy drafts
- Initial Play Data safety assessment
- Android release checklist and test matrix
- Selected app icon
- 1024 × 1024 icon master
- 512 × 512 Google Play icon
- Adaptive color foreground
- Monochrome themed-icon foreground
- Adaptive background color: `#071011`
- 1024 × 500 Google Play feature graphic
- Adaptive-icon implementation specification
- Initial distribution-country strategy

## Initial release countries

- Switzerland
- Germany
- Austria
- Liechtenstein
- United States
- Canada
- United Kingdom
- Ireland
- Australia
- New Zealand

## Still missing

1. Public support email address
2. Separate public GitHub Pages privacy site
3. Public privacy-policy URL entered into the configuration
4. Link to the privacy policy inside the future Android build
5. Final stable web version selected for the Android snapshot
6. Final rights review
7. Play developer account verification
8. Content-rating questionnaire
9. Signing key and secure backup
10. Android wrapper, debug APK, physical-device tests and signed AAB
11. Phone screenshots from the final Android build

## Planned privacy-site approach

Create a separate public repository:

- Repository: `RamasFieldTool/legal`
- Planned URL: `https://ramasfieldtool.github.io/legal/`
- Contents: German and English privacy policy
- Keep this separate from the live tester application.

Do not publish the privacy page with a placeholder contact address. Choose the public support email first.

## Safety boundary

No Android-preparation work may change, merge into or deploy from `main` without Daniel's explicit approval. Testers must continue to use the unchanged public tool.
