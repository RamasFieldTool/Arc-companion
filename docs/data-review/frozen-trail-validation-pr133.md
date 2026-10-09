# Frozen Trail — endgültige Abnahme und Merge 09.10.2026

## VERIFIZIERT

- PR #133 erfolgreich gemergt nach Daniels ausdrücklicher Freigabe zur ID-Absicherung und anschließendem Merge.
- Endgültiger getesteter PR-Head: 61b810c58d57fc742b678a5fadb0addf5651f43a.
- Merge/main: 80f60a6905650169d71d8e2a40b74bafbbb99da1, nach Merge per Git-Fetch und PR-Metadaten bestätigt.
- Vollständiges GitHub Quality Gate für diesen endgültigen Head: SUCCESS, https://github.com/RamasFieldTool/Arc-companion/actions/runs/37911168521 . Beide Jobs abgeschlossen/success.
- Lokal getesteter Commit: 442b9221185976d8de883912e95cdd71c2d1402e. Lokale, Remote-PR- und Merge-Dateien sind identisch (Git-Diff leer); Tree-ID: 08605053904fcb7be8d553fd498e6cebd1ede5f5.
- Lokale statische Datenintegritäts-, Planning-Core- und erweiterte Frozen-Trail-ID-Tests vollständig erfolgreich.
- Neuer lokaler Browserlauf vollständig erfolgreich: DE/EN/FR/ES/IT × 360/1280 Pixel. Zusätzlich EN/360: API-ID-Wechsel, neuere Metadaten, Rückkehr zum lokalen Ersatzstand, gleicher Bestand/persönliche Ziele/Fortschritt, Backup/Restore der ID-Zuordnung und Abweisung widersprüchlicher Zuordnungen ohne Zustandsänderung.
- Öffentlicher Preview EN/360: kompletter gezielter Lauf mit diesen Prüfungen erfolgreich. Preview-Build 37911165471 erfolgreich; veröffentlichte Identity-JS-Datei bytegleich.
- Live-Veröffentlichung erfolgreich: Pages-Läufe 37912178337 (abschließender PR-closed-Deploy) und 37912177224 (Pages-Build zum Merge-Commit) erfolgreich. Live-Identity-JS HTTP 200 und bytegleich.
- Direkt auf https://ramasfieldtool.github.io/Arc-companion/ ausgeführter EN/360-Lauf vollständig erfolgreich: Suche, Ziele, ID-Wechsel, gemeinsamer Bestand, Reload, Backup/Restore und abgewiesenes Duplicate-ID-Backup. Katalog-/Questantworten und Schriftarten sind in diesem gezielten Test kontrollierte Fixtures; dies bestätigt die veröffentlichten App-Dateien, nicht den aktuellen externen Live-Datenbestand.

## Vorgenommene Absicherung

arcFrozenTrailIdentities speichert die einmal gewählten IDs der sieben ergänzten Einträge. Spätere Upstream-IDs werden anhand der bekannten ID oder des exakt passenden englischen Itemnamens zugeordnet. Neuere Upstream-Metadaten bleiben erhalten; eingehende Rezept-, Recycling-, Kosten-, Werkstatt- und Questverweise werden an die gespeicherten IDs gebunden. Beim Fallback bleibt dieselbe ID erhalten. Bestand, persönliche Ziele, Raid-Fortschritt und Historie werden dabei nicht migriert oder gelöscht. Das ID-Mapping ist Bestandteil validierter Backups; doppelte/unsichere Zuordnungen werden zurückgewiesen.

Statische Tests decken sowohl lokal-first als auch upstream-first ab, einschließlich eines zweiten Upstream-ID-Wechsels, Referenzen und Speicherfehlern ohne Änderung des gespeicherten Bestands/der Ziele.

## FEHLGESCHLAGEN / getrennte Testprobleme

- Erster neuer Hardening-Browserlauf: falscher Test-Navigationsschritt wollte die bereits versteckte Startkachel anklicken. Testschritt korrigiert.
- Zweiter Versuch: page.reload überschritt 30 Sekunden. Kein bestätigter App-Assertion-Fehler. Anschließender vollständiger gezielter Lauf mit kontrolliertem Schriftartenabruf erfolgreich.
- Kein fehlgeschlagenes vollständiges GitHub Quality Gate für den endgültigen Head.
- Zwei überholte Pages-Läufe 37912173257 und 37912177957 wurden cancelled; die abschließenden Veröffentlichungen sind success. Nicht als bestandene Läufe darstellen.
- Die vier fehlgeschlagenen lokalen Gesamtskripte des früheren Heads 01a7591 bleiben im historischen Bericht unten dokumentiert. Es wurde kein erneuter vollständiger lokaler 24-Skript-Lauf für den finalen Head behauptet; dafür wurde der vollständige GitHub-Lauf ausgeführt und geprüft.

## Echte RFT-Fehler

Behoben wurde die zuvor dokumentierte fehlende Absicherung gegen wechselnde IDs der neuen Einträge. In den ausgeführten endgültigen Prüfungen ist kein weiterer RFT-Fehler bestätigt.

## DOKUMENTIERT / OFFEN

Die Spielwerte und Quellenscreenshots wurden im vorangegangenen Recherchelauf geprüft; in diesem Merge-Lauf wurde keine neue Gameplay-Datenrecherche behauptet. Unbestätigte Anvil-Rezepte, Research II–IV, weitere Outpost-Phasen, vollständige Waffenrezepte/Recyclingmengen, neue Bilder und offizielle Übersetzungen bleiben ausgeschlossen. Ein gleichzeitiger Wechsel sowohl der API-ID als auch des englischen Namens kann nicht sicher automatisch erkannt werden. Kein physisches Android-Gerät und keine eigene Gameplay-Sitzung getestet.

Die frühere offene Frage einer einfachen Upstream-ID-Änderung ist durch die hier getestete ID-Pin-/Backup-Lösung erledigt; dies ersetzt keine Zuordnung bei gleichzeitig unbekanntem neuem Namen.

---

## Historischer Prüfbericht vor ID-Absicherung (Head 01a7591)

Die folgenden damaligen Commit-/Merge-/Risikostände sind historisch und werden durch die endgültige Abnahme oben ergänzt bzw. abgelöst.

### Frozen Trail — Abschlussprüfung 09.10.2026

## Getestete Fassung

- main vor Beginn und vor Abschluss remote geprüft: 90e94069f8e5da27fd1d3f90bbe0aae38e340133.
- Kette: main → test/frozen-trail-verified-data / Draft-PR #133.
- Remote-Head: 01a75917857e8ebb2602bfda3d5ee499a5c6b1c7.
- Lokal ausgeführt: 5455f4158940c6b75094d2225665b8a35f86f1a4. Remote und lokal haben nach Git-Fetch dieselbe vollständige Git-Tree-ID: 8a4a30c9a679b60d963f018126e80edfea0f1bda; git diff war leer.
- Kein Merge. main unverändert.

## VERIFIZIERT

- Vollständiges GitHub Quality Gate für PR-Head erfolgreich: https://github.com/RamasFieldTool/Arc-companion/actions/runs/37907112383 . Beide Jobs abgeschlossen/success, einschließlich aller bestehenden Browser-, Daten-, Backup- und Layout-Prüfungen und der neuen Regression.
- Preview-Build erfolgreich: https://github.com/RamasFieldTool/Arc-companion/actions/runs/37907112353 . Neue öffentliche JS-Datei HTTP 200 und bytegleich mit lokaler Fassung.
- 10 neue lokale Browserfälle vollständig bestanden: DE/EN/FR/ES/IT × 360/1280 px. Itemsuche, Materialbedarf vor Auswahl, gemeinsamer Bestand, keine doppelten Planks-Sammelzeilen, Auswahl/Abwahl, Reload. Neuer-ID-Backup/Restore zusätzlich EN/360.
- Öffentlicher Preview: zusätzlicher EN/360-Browserfall komplett bestanden, einschließlich neuer Ziele, Reload und Backup/Restore. Screenshot der beiden Materiallisten selbst visuell geprüft; Texte/Mengen sichtbar und lesbar. Dieser Test kontrolliert die externen Item-/Questantworten und ist kein Nachweis aktueller Live-API-Daten.
- Neuer statischer Test: bestehende IDs/Records bleiben erhalten; gleiche englische upstream Namen werden nicht dupliziert; Zielverweise nutzen deren tatsächliche IDs; Erweiterung ist idempotent; unbekannte Rezepte/Werte werden nicht erfunden.

## TEILWEISE VERIFIZIERT / Datenquellen

Research I und die erfassten Bantam-I/Stiletto-II/IV-Werte wurden anhand veröffentlichter Spielscreenshots geprüft, nicht in einer eigenen Spielsitzung. Outpost-Materialphase ist durch übereinstimmende Community-Quellen dokumentiert. Planks/Sheet Metal Gewicht/Stapel/Wert beruhen auf Wiki-Tabellen. Keine komplette Itemdatenbank-Verifikation.

## FEHLGESCHLAGEN — ausdrücklich kein bestandener lokaler Gesamtlauf

Der vollständige lokale Lauf endete mit 20 erfolgreichen und 4 fehlgeschlagenen Testskripten:
- raider-stories: eigenes Runner-Zeitlimit 360 Sekunden, exit 124; kein bestätigter Assertion-/RFT-Fehler. Derselbe vollständige Test in GitHub erfolgreich.
- raider-radio: abschließende Konsole-Fehler-Assertion wegen net::ERR_EMPTY_RESPONSE. Diagnoselauf identifizierte Google Fonts (Rajdhani, Space Grotesk), live-events-data/live-events.json und RaidTheory bots.json als betroffene externe Requests.
- user-data-safety: Einzelprüfungen bis Backup/Restore und ungültigen Imports erfolgreich, danach Gesamtlauf wegen Konsole net::ERR_EMPTY_RESPONSE gescheitert. Nicht als lokal bestandenen Gesamtlauf werten. URLs in diesem Lauf nicht gesondert aufgezeichnet.
- ui-regression: Einzelprüfungen Android-small dark/light erfolgreich, dann Konsole net::ERR_EMPTY_RESPONSE. Kein lokal bestandener Gesamtlauf. URLs in diesem Lauf nicht gesondert aufgezeichnet.
Alle vier Skripte sind im vollständigen GitHub-Lauf erfolgreich. Lokale Netzwerkfehler wurden nicht durch Lockerung der Tests verdeckt.

Weitere tatsächlich fehlgeschlagene Schritte: erster lokaler Browserstart wegen getrenntem Server-Netzwerkraum (connection refused); Testassertion zählte Bildmetadata statt nur .card (2 statt 1), korrigiert; erster öffentlicher Browseraufruf ERR_EMPTY_RESPONSE, über vorgesehenen Proxy danach erfolgreich; direkter Git-Push mangels Anmeldung gescheitert, Branch-Dateien anschließend über GitHub-Verbindung veröffentlicht.

## Echte RFT-Fehler / Korrekturen

In dieser Änderung ist kein neuer RFT-Fehler bestätigt. Korrigiert wurde die neue Testassertion, nicht die App aufgrund eines behaupteten Fehlers. Neu ergänzt: partielle Material-/Waffeneinträge und zwei klar begrenzte Ziele; Version 14.00.11; Cache-Versionen für geänderte Assets. Bestehende Nutzerdaten wurden nicht migriert oder gelöscht.

## OFFEN / verbleibende Risiken

- Research II–IV, vollständige Outpost-Phasen und neuere Anvil-Rezepte nicht implementiert: Quellen noch unvollständig.
- Englische Namen der neuen Items erhalten; keine unbestätigten Spielübersetzungen.
- Neue IDs sind interne RFT-IDs; ein späterer Upstream mit anderen IDs benötigt eine separat geprüfte Migration für dort bereits gespeicherten Bestand. Bestehende IDs bleiben unangetastet.
- Neue Itembilder, vollständige Waffenrezepte/Recyclingmengen und dauerhafte Händlerangebote nicht verifiziert. Datierte Cassio-Angabe ist keine Verfügbarkeitsgarantie.
- Kein physisches Android-Gerät und keine eigene Gameplay-Sitzung getestet.

Quellen/Implementierungsgrenzen: https://github.com/RamasFieldTool/Arc-companion/blob/01a75917857e8ebb2602bfda3d5ee499a5c6b1c7/docs/data-review/frozen-trail-verified-data.md

## Vollständige lokale Skriptliste

- tests/data-integrity.mjs: PASS
- tests/catalog-update-2.mjs: PASS
- tests/frozen-trail-data.mjs: PASS
- tests/planning-core.mjs: PASS
- tests/item-find-locations.mjs: PASS
- tests/quality-gate.mjs: PASS
- tests/frozen-trail-data-browser.mjs: PASS
- tests/frozen-trail-info-browser.mjs: PASS
- tests/catalog-update-2-browser.mjs: PASS
- tests/item-find-locations-browser.mjs: PASS
- tests/logo-home.mjs: PASS
- tests/free-raid-progress.mjs: PASS
- tests/planning-usability.mjs: PASS
- tests/workshop-materials.mjs: PASS
- tests/startup-readiness.mjs: PASS
- tests/summary-owned-stepper.mjs: PASS
- tests/i18n-smoke.mjs: PASS
- tests/italian-language.mjs: PASS
- tests/raider-stories.mjs: FAILED (exit 124)
- tests/raider-radio.mjs: FAILED (exit 1)
- tests/item-images.mjs: PASS
- tests/item-images-all-lists.mjs: PASS
- tests/user-data-safety.mjs: FAILED (exit 1)
- tests/ui-regression.mjs: FAILED (exit 1)

