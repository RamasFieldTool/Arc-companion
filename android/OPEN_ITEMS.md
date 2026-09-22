# Open Android release items

Current preparation branch: `android/build-prep-secure`

## Needed before the first internal/closed test

- [ ] Public support email address.
- [ ] Public privacy-policy URL.
- [ ] Google Play developer account verification.
- [ ] Final app icon resources applied to the generated Android project.
- [ ] Phone screenshots from the Android build.
- [ ] Final rights review for maps, logos, screenshots and third-party visuals.
- [ ] Final stable web snapshot selected.
- [ ] Generate and review `package-lock.json`.
- [ ] Physical phone test.
- [ ] Android tablet test when a device is available.
- [ ] Review merged release manifest and Gradle dependencies.
- [ ] Configure Play App Signing / upload key without committing secrets.
- [ ] Build signed AAB.
- [ ] Complete Data safety and content-rating forms.
- [ ] Start Google Play closed test with the required tester group.

## Already prepared

- [x] App name: Ramas Field Tool.
- [x] Application ID: `com.ramasfieldtool.app`.
- [x] Current Android target requirement: API 36.
- [x] Capacitor wrapper approach selected.
- [x] Cloud debug-build workflow prepared; no PC or signing secret required for debug builds.
- [x] HTTPS-only Android network policy prepared.
- [x] Android permission allowlist prepared: Internet only.
- [x] Remote app-shell configuration blocked.
- [x] Signing files and secrets excluded from Git.
- [x] Existing web security hardening from `main` is included because this branch starts from current `main`.
