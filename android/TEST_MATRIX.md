# Android physical-device test matrix

Primary test device: Daniel's Samsung Android phone  
Build under test: record APK/AAB version and source commit before testing

## Installation and launch

- [ ] Fresh installation succeeds
- [ ] Correct name appears: Ramas Field Tool
- [ ] Correct icon appears on launcher and recent-apps screen
- [ ] First launch shows no blank or browser page
- [ ] Splash screen is correctly sized and not distorted
- [ ] App resumes correctly after being placed in the background
- [ ] App restarts correctly after being force-closed

## Core functions

- [ ] Partial item search works in German
- [ ] Partial item search works in English
- [ ] Direct item matches and recycling sources remain separate
- [ ] Active workshop goals can be selected
- [ ] Total requirements update correctly
- [ ] Owned quantities can be entered
- [ ] Missing quantities update correctly
- [ ] Quest states open/active/done work
- [ ] Only active quests affect requirements
- [ ] Learned blueprint status can be changed
- [ ] Community map selector works
- [ ] Map-layer controls work
- [ ] Map zoom and dragging work with touch input

## Persistence

Set recognizable test values, fully close the app, reopen it and confirm:

- [ ] language persists
- [ ] theme persists
- [ ] material quantities persist
- [ ] active goals persist
- [ ] quest states persist
- [ ] learned blueprints persist
- [ ] onboarding/help state persists

Repeat persistence checks after installing an update over the existing debug build.

## Android behavior

- [ ] Back button does not unexpectedly erase or reset progress
- [ ] Keyboard opens for item search
- [ ] Keyboard opens for quest and blueprint search
- [ ] Keyboard does not cover the active input or essential controls
- [ ] Scrolling remains smooth on long lists
- [ ] Portrait layout has no horizontal overflow
- [ ] Landscape layout remains usable
- [ ] System font-size increase does not hide essential controls
- [ ] Dark mode has readable contrast
- [ ] Light mode has readable contrast
- [ ] Links to external sources open safely

## Network and recovery

- [ ] Normal connection loads the full item catalog
- [ ] Airplane mode produces a clear fallback/error state
- [ ] Local item fallback remains usable
- [ ] Failed quest loading does not break item search
- [ ] Reconnecting restores remote data on a later launch
- [ ] Slow connection does not leave permanent loading indicators
- [ ] No unexplained crash occurs when an external service fails

## Privacy and permissions

- [ ] Android asks for no unnecessary permission
- [ ] No account creation is required
- [ ] No advertising appears
- [ ] No analytics or tracking consent prompt appears unless such technology was intentionally added
- [ ] Clearing app data removes locally stored progress
- [ ] Privacy-policy link opens the published policy

## Release acceptance

The build may move from Internal testing to Closed testing only when:

- all critical tests pass,
- no data-loss bug is open,
- no unexpected permission is present,
- store texts match actual behavior,
- the privacy policy matches actual network traffic,
- visual assets are approved,
- known limitations are documented.
