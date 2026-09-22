# Android build security baseline

Branch: `android/build-prep-secure`

The first Android release intentionally stays simple. It reuses the reviewed static web app inside a Capacitor Android container and does not add accounts, advertising, analytics, location, camera, microphone or other sensitive device access.

## Security defaults

- Application ID: `com.ramasfieldtool.app`
- Capacitor dependencies are pinned to version `8.5.2`.
- Android target is API 36 through the current Capacitor 8 Android project.
- The Android app packages a local snapshot of the reviewed web files. It must not use `server.url` to run the app from a remote website.
- Cleartext HTTP is disabled by the generated Android Network Security Config.
- The main manifest is checked and the build stops if it requests a permission other than `android.permission.INTERNET`.
- The build stops if the main manifest enables `android:debuggable="true"`.
- No signing key, keystore password, API secret or Play credential may be committed to Git.
- The debug APK workflow needs no secrets and is manual-only.
- A signed release AAB will be added only after the signing procedure and Google Play App Signing setup are ready.

## Why this is deliberately minimal

The app currently needs internet access only to retrieve public ARC Raiders/community data. User progress is stored locally. Avoiding extra native plugins reduces the permission surface, dependency count and privacy declarations.

## WebView rules

- No arbitrary remote app shell.
- No `allowNavigation` list unless a future feature has a documented need and security review.
- External links should remain external instead of turning the app into a general-purpose browser.
- HTTPS is mandatory for network traffic.
- Existing DOM-XSS escaping/hardening in the web app remains part of the Android snapshot.

## Before any signed Play build

1. Generate and commit a reviewed `package-lock.json`; use `npm ci` for release builds.
2. Review the final Gradle dependency inventory.
3. Inspect the merged release manifest, not only the source manifest.
4. Confirm that the final build requests only the expected permission(s).
5. Run Google Play pre-launch testing.
6. Test on at least one physical phone and one Android tablet when available.
7. Verify backup import/export cannot overwrite app state without confirmation.
8. Recheck every outbound hostname and the Play Data safety declaration.
9. Keep the signing/upload key outside Git and maintain a secure recovery copy.
10. Do not merge this branch to `main` merely to build Android; the web tester site stays independent.
