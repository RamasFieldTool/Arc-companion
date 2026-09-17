# Google Play Data safety assessment draft

App: Ramas Field Tool  
Application ID: `com.ramasfieldtool.app`  
Reviewed source branch: `android-release-prep`

This is a preparation document, not a final Play Console declaration. The answers must be verified against the final signed Android App Bundle and every included SDK.

## Current technical assessment

### First-party collection

The reviewed web application stores user selections and progress locally on the device. It does not currently send those values to an operator-controlled backend.

Locally stored values include:

- language,
- theme,
- inventory/material quantities,
- active upgrade goals,
- quest status,
- learned blueprint status,
- onboarding/help state.

### External network services

The reviewed application makes or may make requests to:

- `arcdata.mahcks.com` for item data,
- `api.github.com` and GitHub-hosted raw content for RaidTheory quest/community data,
- `fonts.googleapis.com` and `fonts.gstatic.com` for the Rajdhani font.

These providers necessarily receive connection metadata such as IP address and request information. Google Play's final Data safety answers must be based on whether Google classifies these transmissions as collection by the app or a third-party service in the final packaged implementation.

### Permissions expected

- Internet access only.

The final Android manifest must be checked to ensure that no unnecessary permissions are introduced by Capacitor, build plugins or other dependencies.

### Features currently absent

- user accounts,
- login,
- analytics SDK,
- advertising SDK,
- crash-reporting SDK,
- push notifications,
- payments or purchases,
- precise or approximate location,
- contacts,
- photos or files selected by the user,
- camera,
- microphone,
- health data,
- financial data,
- advertising ID.

## Provisional Play Console direction

Do not submit the form using this draft alone.

Before submission:

1. Build the final AAB.
2. Inspect the Android manifest and dependency list.
3. Verify every outbound domain on a physical device.
4. Decide whether Google Fonts will be bundled locally.
5. Recheck Mahcks, GitHub and RaidTheory data flows.
6. Confirm that no analytics, crash reporting or advertising SDK was added.
7. Make the Play Console answers match the published privacy policy exactly.

## Recommended privacy improvements before release

- Bundle the Rajdhani font locally if its license and packaging terms permit.
- Package stable local fallback data.
- Avoid adding analytics or advertising to the first release.
- Request no Android permission beyond internet access.
- Provide an in-app link to the published privacy policy.
- Add an easy way to reset locally stored progress.
