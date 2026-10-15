# Außenposten: kontrollierte UI/UX-Umsetzung

Ausgangspunkt: `main` bei `d83369e361c725903b3abb33472b8db19e71897a`.
Testbranch: `test/outpost-ui-ux-20261015`. Kein Merge freigegeben.

## Aufbau und Daten

- Drei Hauptbereiche direkt nach dem weiterhin sichtbaren Ausbauhinweis: Möbel, Ausbau, Forschung & Upgrades. Nur ein Bereich ist sichtbar.
- Möbel öffnet beim Neuladen als erster Bereich. Bereichswechsel erhalten die vorhandenen Such-/Detailzustände im laufenden Dokument; keine neue Speicherung im Backup.
- Ausbau enthält Bauhinweise, bestehenden Bauzähler und Referenzen zu Ausbau/Gadgets. Forschung enthält Stationsnavigation und die bestehenden Amplified-Familien.
- Möbel-Designinformationen bleiben als aufklappbare Information erhalten. Auch die bereits vorher versteckten älteren Referenztabellen bleiben vorhanden.
- Alle JSON-Datensätze, Itemdaten, Rezepte und Forschungsdaten sind bytegleich zum Ausgangsstand. Möbel bleiben eine lesende Referenz ohne automatische Materialplanung oder neuen Fortschrittsstatus.
- Keine Gleichsetzung offener Amplified-Namenskonflikte. Die bestehende Kennzeichnung nicht im Spiel bestätigter Angaben bleibt erhalten.

## Phasen

1. UI-Texte in fünf Sprachen, verständliche Kategoriebezeichnungen, Suche über tatsächliche Namen statt JSON-Schlüssel und normalisierte Rand-Leerzeichen. Die bestehenden Ziele werden gezielt geöffnet, ohne Ziele anzuhaken.
2. Drei zugängliche Reiter mit einem sichtbaren Inhalt. Die bestehenden Renderer verwenden feste Hosts innerhalb dieser Bereiche. Quellen und Funktionen bleiben erreichbar.
3. Möbel-Zeilenköpfe mindestens 44 Pixel hoch, Materialien mit zugeordneter Menge in eigenen Zeilen, getrennte Forschungsstation/Punkte/Materialien, kompaktere Designinformation, Sortierung nach angezeigter Sprache und verständlicher Nulltreffertext.

Die Reiter umbrechen bei Platzmangel. Überschreitet die Navigation 140 Pixel Höhe, wird sie nicht mehr angeheftet, damit große Schrift den Inhalt nicht verdeckt. Ein Zwischenstand mit drei starr schmalen Spalten wurde nach Screenshotprüfung korrigiert.

Die doppelte äußere Außenposten-Überschrift und eine aus anderen Listen stammende globale Schließaktion werden nur innerhalb der aktiven Außenpostenansicht ausgeblendet. Andere Kacheln behalten ihre vorhandene Bedienung.

## Navigation und Startablauf

`openWorkshopGoal` nutzt die bestehende Planung, wählt „Meine Ziele“ und „Werkstatt“, öffnet die passende Station und fokussiert deren Überschrift. Das geschieht ohne Bestands- oder Zieländerung. Ein vor dem Laden der Planungsoberfläche gewähltes Ziel wird bis zu deren Bereitschaft gehalten. Außenpostenbuttons sind deaktiviert, solange die Navigationsschnittstelle noch nicht existiert.

Cache-Versionen wurden auch für den dynamischen Ladeweg `collapsible-core-v1306.js` → `planning-bootstrap.js` aktualisiert.

## Vorher/Nachher unter gleichen Bedingungen

Kontrollierter Vergleich: Chromium, DE, 900 Pixel Höhe, gleicher 60-Item-Testkatalog, keine aktiven Ziele, ungefilterte Möbelliste. „Vorher“ wurde aus einem unveränderten Archiv des Ausgangscommits gestartet. Positionen sind CSS-Pixel ab Dokumentanfang; keine Ladezeitmessung.

| Viewport / Theme | Katalogbeginn vorher | Katalogbeginn nachher | Suchfeld vorher | Suchfeld nachher |
| --- | ---: | ---: | ---: | ---: |
| 360 / Hell | 2357 | 512 | 2573 | 745 |
| 360 / Schwarz | 2347 | 579 | 2575 | 822 |
| 1280 / Hell | 2066 | 498 | 2208 | 656 |
| 1280 / Schwarz | 2089 | 495 | 2239 | 660 |

Die 100 Möbel bleiben als vollständige Liste vorhanden. Verbessert wurde der Zugriff auf diese Liste; es wurde keine neue Seitennavigation oder virtuelle Liste eingeführt.

## Tatsächlich ausgeführte lokale Prüfungen

**VERIFIZIERT:**

- Phase 1: neue Außenposten-Regression und bestehende Referenzregression in DE/EN/FR/ES/IT bei 360/1280 Pixeln; neue Regression in beiden Themes. Syntax und relevante Daten-/Planungsprüfungen erfolgreich.
- Phase 2: dieselbe neue Regression in fünf Sprachen und beiden Themes; bestehende Referenzregression sowie Amplified-Regression in fünf Sprachen bei 320/375/430/768/1280 Pixeln erfolgreich.
- Phase 3: neue Regression in fünf Sprachen bei 320/360/412/430/1280 Pixeln und beiden Themes, mit vergrößerter Schrift, Tastatur und emulierten Touch-Taps erfolgreich. Nach abschließenden Cache-/Start-/Summary-Korrekturen erneut fünf Sprachen bei 360/1280 Pixeln in beiden Themes erfolgreich. Die vollständige Breitenmatrix ist im Quality Gate für den PR-Head eingebunden.
- Alle angezeigten Herstellungsmaterialien und Mengen der 100 Möbel sowie Materialien und Mengen ihrer 52 hinterlegten Forschungsrezepte werden gegen die unveränderte JSON-Quelle verglichen.
- Beide Planungslinks, richtige Station und Reiterauswahl, Details öffnen/schließen, kombinierter Filter, Rand-Leerzeichen, Nulltreffer für `quantity`, Erhalt von Beständen, aktiven Zielen und Bauhäkchen geprüft.
- Bestehende Amplified-, Außenpostenreferenz- und Planungs-Browsertests erfolgreich; Planungsregression auch bei 360/412/1280 Pixeln in Dark/Light.
- Bestehende verzögerte Startprüfung für FR/ES/IT sowie neuer gezielter Forschungsstationsaufruf bei absichtlich verzögertem Planungs-UI erfolgreich.
- Sieben statische Prüfungen: data-integrity, catalog-update-2, frozen-trail-data, amplified-weapons-audit, amplified-variants, planning-core, item-find-locations. Syntaxprüfung der geänderten Module und `git diff --check` erfolgreich.

**TEILWEISE VERIFIZIERT:** Große Schrift wurde durch eine kontrollierte 32-Pixel-Schriftvorgabe für den Außenposten simuliert. Das ist kein Android-Systemschrifttest. Touch wurde mit Chromium-Mobilkontext und `tap()` emuliert. Vorher/Nachher-Screenshots wurden betrachtet; eine vollständige numerische Kontrastprüfung jedes Zustands wurde nicht durchgeführt.

**NICHT VERIFIZIERT:** physisches Android-Gerät, Samsung Internet, Safari, reale Bildschirmtastatur und Screenreader.

**FEHLGESCHLAGENE VORBEREITUNGSSCHRITTE:** Der erste Chromium-Download war unvollständig; der Installer verwendete erfolgreich einen alternativen Download. Ein erster lokaler Browsertest erreichte den separat gestarteten Server nicht. Server und Tests wurden danach im selben Ausführungskontext gestartet; die anschließenden Testläufe waren erfolgreich. Dies waren Umgebungsprobleme, keine nachgewiesenen App-Defekte.

Die App ist statisches HTML/JS; ein separater Compiler-Build ist nicht definiert. Syntax-, Daten-, Browser- und vollständige CI-Prüfungen dienen als technische Freigabegrundlage. Ein älterer Quality-Gate-Erfolg gilt nicht für den neuen PR-Head; dessen tatsächlicher Checks-Status muss separat geprüft werden.

## Regressionen und Nachweise

Die neuen Tests `tests/outpost-ui.mjs` und `tests/outpost-navigation-ready.mjs` laufen im bestehenden Quality Gate. Screenshots der Breiten-/Sprach-/Theme-Matrix werden als CI-Artefakte unter `test-artifacts/outpost-ui/` bereitgestellt. Die bestehende Amplified-Browserprüfung öffnet nun ausdrücklich den zugehörigen Hauptbereich, bevor sie dessen Bedienung prüft.

Ein Draft-PR dient der Prüfung. Main bleibt unverändert, bis eine ausdrückliche Merge-Freigabe vorliegt.
