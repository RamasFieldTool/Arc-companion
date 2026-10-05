# Testerfeedback: Work-Review vom 05.10.2026

## Stand und Gesamturteil

**TEILWEISE VERIFIZIERT.** Die geprüften App-Funktionen bestehen die unten aufgeführten lokalen Tests. Der unveränderte vollständige Quality-Gate-Ablauf ist wegen externer Ladefehler **nicht bestanden**. Kontrollierte Ersatzantworten erlauben zusätzlich erfolgreiche vollständige Datensicherheits-, Layout- und Radio-Tests; sie bestätigen keine externe Erreichbarkeit oder aktuellen Spieldaten.

Remote-main zu Beginn und nach den Korrekturen: `c8d666f4819dcfe7ef42e3994a5e6c6c51595425`.

Review-Kette: main → [#123](https://github.com/RamasFieldTool/Arc-companion/pull/123) (`4cf8f5af242689b114473787640ebbba069fc17c`) → [#124](https://github.com/RamasFieldTool/Arc-companion/pull/124) (`8334b399c692a3d1f5b3150a202f16cc46433b92`) → [#125](https://github.com/RamasFieldTool/Arc-companion/pull/125) (`f09808b371ef95381b9dc8f54f2900eed6abae1d`) → [#126](https://github.com/RamasFieldTool/Arc-companion/pull/126).

**Abschließend getesteter Anwendungscommit:** `e2ebe71ab048b0456ff06f6c7ec19a1c7b8412af`, Tree `a2051e4abf59f82b163a3c5c206da2a9eb1d7b2f`, Branch `fix/live-events-fallback-source-label`. Der Remote-Commit wurde heruntergeladen; die getesteten Arbeitsdateien entsprachen ihm (`git diff HEAD` leer). Nachfolgende Bericht-/Prüfskript-Ergänzungen ändern keine App-Dateien.

main wurde nicht bearbeitet oder gemergt. #111 wurde nicht integriert. Keine Subagenten.

## VERIFIZIERT: Tests am abschließenden Anwendungscommit

Jeweils mit Exit 0 ausgeführt:

| Skript | Ergebnis und Grenze |
| --- | --- |
| `tests/data-integrity.mjs` | Statische Daten-/Asset-/Backup-Integritätsregeln bestanden |
| `tests/planning-core.mjs` | Gemeinsamer Bedarf, Überschuss, Abschluss, Reload, Bestandskorrektur, Speicherfehler-Rollback und Migration bestanden |
| `tests/item-find-locations.mjs` | Statische Fundortregression bestanden |
| `tests/quality-gate.mjs` | Alle sieben kontrollierten Katalog-/Fallback-/Planungs-/Mobile-Szenarien bestanden; dieses Skript ist nur ein Teil des gesamten Workflows |
| `tests/search-source-labels.mjs` | DE/EN/FR/ES/IT: direkte und Recycling-Treffer, Erklärung, Ertrag, Remote-/Fallback-Quellenlabel, Hin-/Rückwechsel über reale Sprachmenüs und 360px-Suchlayout bestanden |
| `tests/i18n-smoke.mjs` | DE/EN/FR/ES, Planung, Itemnamen/Fallback, Status, Reload und Launcher-Stabilität bestanden |
| `tests/italian-language.mjs` | Italienische Auswahl, Planung, Reload, Mobilansicht und Raid-Aktion bestanden |
| `tests/item-find-locations-browser.mjs` | 360/1280px, hell/dunkel, Datenfixture, Aufklappen und DE/EN/FR/ES bestanden |
| `tests/planning-usability.mjs` | Ziele/Bestand/Abschluss/Raid-Dialog, offene Eingaben bei Sprachwechseln sowie 360/412/1280px hell/dunkel bestanden |
| zusätzliche kombinierte Review-Prüfung | DE/EN/FR/ES/IT × 360/1280px: Werkstattbedarf vor Auswahl, Auswahl/Abwahl, Bestand, persönliche Ziele, Reload, acht einzeln aufklappbare Hilfethemen, Tastatur-Enter, gleichzeitig geöffnete Themen und Überlauf bestanden |

Die kombinierte Review-Prüfung ist als `tests/tester-feedback-review.mjs` beigefügt. Während des Laufs hieß dieselbe Datei `tests/work-review-check.mjs`.

Werkstatt-Beispiel tatsächlich geprüft: zwei aktive Stufen plus persönliches Metallziel ergeben Bedarf 83, Bestand 7 und Fehlmenge 76; nach Abwahl einer Stufe Bedarf 63. Das persönliche Ziel 3 und der Bestand 7 bleiben erhalten. Gemeinsame Materialien ergeben eine zusammengefasste Bedarfszeile.

Themes: beide vorhandenen Oberflächen `light`/`black` mit `orange`/`amber`/`green`/`cyan` geprüft. Acht unterschiedliche wirksame Hauptfarben, jeweils getrennte Nebenfarbe, ausgewählter Werkstatt-Tab mit mindestens 4,5:1 Textkontrast, sichtbarer Tastaturfokus und keine horizontal abgeschnittenen Werkstattnamen. Das ist **keine vollständige Kontrastmessung aller Elemente**.

## VERIFIZIERT: kontrollierte Gesamtläufe am abschließenden Commit

Folgende Tests wurden zusätzlich mit explizitem Review-Preload und Exit 0 ausgeführt:

- `logo-home`, `free-raid-progress`, `workshop-materials`, `summary-owned-stepper`
- `user-data-safety`: vollständiger Lauf, einschließlich Bestands-/Fortschrittserhalt, aktiver/pausierter/erledigter persönlicher Ziele, Backup-Rundlauf, Import in frischem Browserkontext, Altbackup-Migration, unsicherer Dateien und Verbindungsverlust
- `ui-regression`: vollständiger Lauf, responsive Ansichten und Raid-Funde/Abbruch/Überschuss/Bedarfsaktualisierung
- `raider-radio`: vollständiger Lauf, Alben, Navigation, fünf Sprachen und Layout

Der beigefügte Preload `tests/helpers/review-controlled-externals.mjs` liefert für Google-Fonts-CSS eine leere Antwort (Systemschrift), für Events die lokale Datei und für ARC-Fundorte eine vorhandene Testfixture. Die vorhandenen Testassertions und Fehlerprüfungen wurden nicht entfernt. Diese Läufe verifizieren App-Verhalten mit Ersatzantworten, **keinen Live-Feed und keine originalen Webfonts**.

Handy-Screenshots der Hilfe, Werkstatt, Suche, Fehlmengen und Raid-Eingabe wurden geöffnet und visuell geprüft. Browseremulation; kein Test auf einem physischen Android-Gerät. Seltene Kartenbild-`ERR_ABORTED`-Meldungen wurden beim Wechsel/Schließen von Testansichten beobachtet; die kontrollierten Tests bestanden trotzdem.

## FEHLGESCHLAGEN: unveränderte Läufe und Infrastruktur

Der vollständige unveränderte Workflow-Satz wurde lokal ausgeführt. `user-data-safety`, `ui-regression` und `raider-radio` scheiterten an Konsolenfehlern `net::ERR_EMPTY_RESPONSE`. Erfolgreiche Einzelassertions sind ausdrücklich **kein bestandener ursprünglicher Gesamtlauf**.

Ein eigener Diagnose-Lauf erfasste die externen fehlgeschlagenen Requests:

- `fonts.googleapis.com`: Rajdhani und Space Grotesk
- `raw.githubusercontent.com/RamasFieldTool/Arc-companion/live-events-data/live-events.json`
- `raw.githubusercontent.com/RaidTheory/arcraiders-data/2a4abebb2486a633070f4e260058bcd5ad4511d6/bots.json`

Die getrennten erfolgreichen Fixture-Gesamtläufe sprechen für eine externe Zugriffsursache dieser Testabbrüche; allgemeine Erreichbarkeit außerhalb dieser Testumgebung wurde damit nicht bewiesen.

Chromium fehlte zunächst; Browserstarts scheiterten. CDN-Downloads lieferten ungültige ZIPs, die offiziellen Alternativserver funktionierten. Ein separater Serverstart war aus dem Testprozess nicht erreichbar (`ERR_CONNECTION_REFUSED`); Server und Test wurden anschließend im selben Prozessaufruf gestartet. Diese Infrastrukturprobleme sind keine RFT-Funktionstests.

Ein neuer Test klickte zunächst einen auf der Suchseite unsichtbaren Sprachschalter und scheiterte. Der Test wurde auf die tatsächliche Navigation über die Startseite korrigiert; dadurch wurde anschließend der unten beschriebene echte Sprachwechsel-Fehler sichtbar.

Direkter Git-Push scheiterte wegen fehlender CLI-Anmeldedaten. Die Änderungen wurden stattdessen über den funktionierenden GitHub-Connector gespeichert und anschließend wieder über Git heruntergeladen und geprüft.

## Echte RFT-Probleme und Korrekturen

1. **Suchlabels:** #125 enthält FR/ES/IT-Texte, wählte aber über die interne DE/EN-Engine aus. Französische Suche zeigte tatsächlich „Direct matches“. Nun wird die UI-Sprache verwendet. Die erste Korrektur über `dataset.uiLanguage` zeigte bei Hin-/Rückwechseln noch alte Labels, weil dieses Attribut verzögert synchronisiert wird; die abschließende Korrektur liest die zu diesem Zeitpunkt bereits gesetzte Dokumentsprache. Beide Treffergruppen und der Recycling-Ertrag wurden geprüft.
2. **Eventquelle:** auch bei lokaler Ersatzdatei stand „offizieller Embark-Feed“. Nun werden Remote- und lokaler Ersatzstand unterschieden, einschließlich Aktualitätshinweis und allen fünf UI-Sprachen.
3. **Asset-Caches:** geänderte Dateien hatten teilweise dieselben Cache-Kennungen wie main. In `index.html` wurden die betroffenen Werkstatt-, Hilfe-, Navigations-, Status- und UX-Assets sowie die korrigierten Such-/Eventskripte gezielt neu versioniert. Alle übrigen Referenzen blieben erhalten. Das verhindert keine beliebige fremde Cache-Konfiguration, beseitigt aber die identischen App-Asset-URLs.

Keine Spieldaten, Nutzerdatenfelder oder Backup-Schemata wurden geändert.

## Datenerhalt und bewusst unveränderte Inhalte

Bytevergleich gegen main bestätigt unveränderte `items.json`, `goals.json`, `blueprint-acquisition-v2130.json`, `planning-core.js`, `planning-ui.js`, `planning-raid.js`, `backup-v1304.js`, `raider-stories.js` und die Raumhafen-Bilddatei. In `spaceport-fresh-v2.json` unterscheiden sich nur Quellenhinweis und Notizen; Bildpfad, Punkte und Layer bleiben gleich.

## DOKUMENTIERT / TEILWEISE VERIFIZIERT / OFFEN

- **DOKUMENTIERT:** frühere Ergebnisse in `docs/tester-feedback-audit.md` wurden gelesen, nicht als eigene neue Tests ausgegeben. Die zusätzliche Blueprint-Prüfung aus der Übergabe wurde in diesem Lauf nicht erneut durchgeführt.
- **TEILWEISE VERIFIZIERT:** ein vollständiger Story-Test bestand im vorangehenden Review-Lauf. Während des breiteren Prüfzeitraums wurden Such-/Quellenkorrekturen vorgenommen; deshalb wird daraus keine exakte abschließende Commit-Abnahme für Stories abgeleitet. Storydateien sind unverändert und #111 fehlt.
- **TEILWEISE VERIFIZIERT:** geprüfte bekannte UI-Texte, Hilfe und Planungsabläufe in fünf Sprachen; keine vollständige sprachliche Prüfung jeder Datenbeschreibung oder offiziellen Spielterminologie.
- **OFFEN:** vollständiger ursprünglicher Quality Gate ohne externe Zugriffsfehler. Der GitHub-Workflow ist für PRs auf main konfiguriert; für den gestapelten #126-Anwendungscommit ergab die Connector-Abfrage keine PR-Workflowläufe. Kein bestandener CI-Lauf behauptet.
- **OFFEN:** reale Nutzer-Browserprofile konnten nicht inspiziert werden; Datenerhalt ist anhand der vorhandenen Regressionen und gesetzter Bestands-/Planungsfixtures geprüft.
- **OFFEN / separat:** Itembildrechte, originalgetreue veröffentlichbare Raumhafenbasis, neue Positionsabgleiche, `sources[]`-Blueprint-Modell und Trader/Cred. Keine Marker verschoben, keine unbekannten Werte oder Übersetzungen erfunden.

## Reproduktion

App lokal auf Port 4173 starten; Playwright 1.55.0 und Chromium installieren. Vorhandene Workflow-Kommandos unverändert ausführen. Zusätzliche Prüfungen:

```bash
BASE_URL=http://127.0.0.1:4173/ node tests/search-source-labels.mjs
BASE_URL=http://127.0.0.1:4173/ node tests/tester-feedback-review.mjs
BASE_URL=http://127.0.0.1:4173/ node --import ./tests/helpers/review-controlled-externals.mjs tests/user-data-safety.mjs
BASE_URL=http://127.0.0.1:4173/ node --import ./tests/helpers/review-controlled-externals.mjs tests/ui-regression.mjs
BASE_URL=http://127.0.0.1:4173/ node --import ./tests/helpers/review-controlled-externals.mjs tests/raider-radio.mjs
```

Kein Merge durchgeführt. Die vollständige Review-Version liegt als gestapelte Draft-Kette vor; eine neue ausdrückliche Merge-Freigabe ist weiterhin erforderlich.
