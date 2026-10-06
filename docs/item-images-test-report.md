# Itembilder – Testbranch und Prüfbericht

Aktualisierung 06.10.2026: Der Nutzer hat „Erlaubnis erteilt. Merge“ mitgeteilt und die Veröffentlichung/Merge freigegeben. Die folgenden Angaben zum offenen Freigabestand sind historische Prüfstände. Originalunterlagen oder konkrete Drittanbieter-Bedingungen wurden in diesem Lauf nicht separat gelesen. Release-Stand: [item-images-release.md](item-images-release.md).

Stand: 06.10.2026. Auftrag: ausdrücklicher Testeinbau trotz noch ausstehender Nutzungsfreigabe. Keine Veröffentlichung, kein Merge, keine durch diesen Arbeitslauf versendete Anfrage.

Getesteter Implementierungscommit: `63bdc6f513e32bf9c9941b617d2b0534d23f0a52`.
Branch: `feature/item-images-review`.
Ausgangs-main, vor Beginn selbst remote geprüft: `df00159478d906df49bb75db82b7068fc59300e4`.
Kette: main → Quellenprüfung `1019ffbe` → Einbau `2c1077e0` → Umbruchkorrektur `face79f0` → explizite Bild-Aliase/ältere CDN-Pfade `63bdc6f5`. Kein PR angelegt: Der vorhandene PR-Workflow würde eine öffentliche Pages-Preview erzeugen. PR #111 gehört nicht zu dieser Arbeit.

## Umsetzung

- Ergänzende Thumbnails in normalen Suchkarten und den vollständigen Recyclingkarten; keine doppelte Abbildung in der Recycling-Zusammenfassungszeile.
- 48px auf schmalen Bildschirmen, 64px ab 820px; feste Maße, Lazy Loading, asynchrones Decoding, leerer Alttext neben dem ausgeschriebenen Itemnamen.
- Ausschließlich die vorhandene explizite `imageFilename`-Zuordnung des Itemobjekts. Keine URL-Erfindung aus einer ID. Varianten dürfen die im Datensatz angegebene gemeinsame Bilddatei nutzen.
- Erlaubt: HTTPS, Host `cdn.arctracker.io`, begrenzte Pfade `/items/…` und `/items/v2/…`, PNG/WebP/JPG. Keine fremden Hosts, Zugangsdaten, zusätzlichen Ports, Query-/Fragmentwerte oder ausführbaren Dateiformate.
- Fehlende/ungültige URL: Textkarte ohne Bild. Ladefehler: Bild wird entfernt und im aktuellen Browserlauf nicht erneut angefordert. Kein neuer Speicher-/Backupschlüssel.
- Bestehende Assets und Cache-Versionen erhalten; nur `app.js` und die neuen Bild-Assets erhalten eine neue Cache-Kennung.
- Keine Spielbilddateien, kein neuer Bildkatalog, keine Änderungen an Spieldaten, Planungslogik oder Backupformat.

## VERIFIZIERT

Alle acht unten aufgeführten Testskripte wurden im abschließenden Lauf vollständig ausgeführt und jeweils mit Exitcode 0 beendet. Zwei Runner (drei Bildskripte bzw. fünf bestehende Skripte) endeten ebenfalls mit Exitcode 0. App-, Asset- und Testdateien entsprechen dabei exakt dem obigen Commit; nur Berichtsdokumente wurden anschließend ergänzt.

| Prüfung | Abschließender Lauf |
|---|---|
| `tests/item-images.mjs` | BESTANDEN, Exit 0 |
| `tests/item-images-source-smoke.mjs` | BESTANDEN, Exit 0 |
| `tests/item-images-real-catalog.mjs` | BESTANDEN, Exit 0 |
| `tests/data-integrity.mjs` | BESTANDEN, Exit 0 |
| `tests/planning-core.mjs` | BESTANDEN, Exit 0 |
| `tests/item-find-locations.mjs` | BESTANDEN, Exit 0 |
| `tests/user-data-safety.mjs` | BESTANDEN, Exit 0 |
| `tests/quality-gate.mjs` | BESTANDEN, Exit 0 |

Zusätzlich ausgeführt: `node --check item-images.js`, `node --check app.js`, `git diff --check` – jeweils Exitcode 0. Der bestehende Browser-Quality-Gate-Test bestätigte alle sieben enthaltenen Szenarien; der Datenerhaltstest bestätigte alle sieben ausgegebenen Sicherheitsfälle einschließlich Backup/Restore, alter persönlicher Ziele und Zurückweisung ungültiger Backups.

Der finale Real-Katalog-Lauf bestätigte auf beiden Breiten die Quelle `snapshot`, 581 Items und 577 von der Bildfunktion akzeptierte explizite URLs. Der verwendete Snapshot meldete `generatedAt: 2026-09-24T15:55:47.768Z`. Vier Items hatten keine Bild-URL und behalten die Textkarte. 577 akzeptierte URLs bedeutet **keine** vollständige Prüfung oder vollständigen Abruf aller 577 Bilddateien.

Testumgebung: Node 20.19.0, Playwright 1.55.0, Chromium 140 / Build 1187, lokaler Python-HTTP-Server. Für das Review erforderlicher Netzwerkproxy über den vorhandenen Helper, keine globale TLS-Abschaltung.

Der Bild-Matrixtest verwendet kontrollierte Katalogantworten und ein synthetisches SVG als Bildantwort; dies ist kein Nachweis für die Vollständigkeit echter Spielbilder. Er prüft DE/EN/FR/ES/IT bei 360/1280px, beide Oberflächen und vier Akzentfarben, Bildfehler, erneutes Zeichnen und vorhandene Karteninformationen. Ein absichtlich länger beschrifteter Header nutzt bekannte Typ-/Seltenheitswerte nur in Testdaten.

Der CDN-Smoke verwendet einen kontrollierten Katalog mit der zuvor selbst gelesenen Metallteile-Zuordnung und lädt das echte CDN-Bild ohne Bild-Fixture bei 360/412/1280px. Der separate Real-Katalog-Smoke hat keinerlei Katalog-/CDN-/sonstige Antwort-Fixtures und prüft bei 360/1280px den vorhandenen vollständigen Ladeweg, Bilddekodierung und Überlauf.

## TEILWEISE VERIFIZIERT

- Vollständige Bildsammlung: URL-Metadaten sind prüfbar, die inhaltlich richtige Darstellung sämtlicher Spielbilder wurde nicht einzeln bestätigt. Das echte Metallteile-Bild wurde geladen und visuell angesehen.
- Fünf Sprachen und acht Theme-Kombinationen: Layoutprüfung; kein vollständiges WCAG- oder Übersetzungsaudit.
- Smartphone: Chromium-Emulation und kleine Viewports; keine Tests auf einem physischen Android-/iOS-Gerät.
- Dies ist ein gezielter Satz aus acht Testskripten, nicht die komplette frühere 19-Skripte-Suite oder ein neu ausgeführter GitHub-CI-Quality-Gate.

## DOKUMENTIERT

Die frühere Testerfeedback-Integration samt Prüfgrenzen steht in den bestehenden Testerfeedback-Berichten. Diese historischen Ergebnisse werden in diesem Lauf nicht neu als bestanden ausgegeben. Quellen- und Rechteprüfung sowie die unversendete Anfrage: `item-images-review.md` und `item-images-permission-request.md`.

## FEHLGESCHLAGEN – ursprüngliche Versuche und Korrekturen

1. Der erste Datenerhalt-Gesamtlauf scheiterte bei der Migration eines alten persönlichen Raid-Ziels. Die unveränderte Basis bestand denselben Test. Der Importhelfer wartete nach dem zeitversetzten Reload lediglich 1200ms und auf Katalogbereitschaft, nicht sicher auf die neue Navigation/Planungsbereitschaft. Nur der Test wurde korrigiert: Navigation vor Import beobachten, anschließend Planung abwarten. Der ursprüngliche Lauf bleibt fehlgeschlagen; nachfolgende vollständige Läufe sind getrennt zu bewerten.
2. Real-Katalog-Test bei 360px: 18px horizontaler Überlauf durch Thumbnail plus langen Typtext. Basis ohne Bilder: kein Überlauf. Echte durch den Testeinbau verursachte RFT-Darstellungsregression; mit `overflow-wrap:anywhere` im Titelbereich korrigiert und im Regressionstest ergänzt. Der nachfolgende Diagnose-Smoke zeigte keine überstehenden Elemente.
3. Ein erster Basisvergleich enthielt versehentlich die Bildassertion des Testbranches und scheiterte an fehlendem Thumbnail auf main. Das war ein falscher Testaufbau; der korrigierte Basisvergleich ohne diese Assertion bestand.
4. Ein früher Screenshot des CDN-Smoke wurde vom Erststart-Sprachdialog verdeckt. Die DOM-Prüfung bestätigte bereits die Bilddekodierung; die visuelle Darstellung war damit noch nicht bestätigt. Der Testaufbau setzt nun auch die bestehende Basissprache und prüft den geschlossenen Dialog.

Externe Fehler separat: Ungefilterte Browserabrufe zeigten Mahcks-Anfragefehler (`net::ERR_FAILED`, im Diagnosevergleich bei Offset 270). Die App nutzte daraufhin den bestehenden vollständigen Snapshot mit 581 Items. Keine Behauptung, dass damit die externe API repariert oder die genaue Ursache dieser Anfragefehler neu bewiesen wurde. Simulierte 404-/Ausfallantworten in kontrollierten Tests sind erwartete Testfälle, keine externen Betriebsfehler.

## OFFEN

- Embark-Nutzungsfreigabe und Bedingungen des CDN-Anbieters; Die vorbereitete Anfrage wurde durch diesen Arbeitslauf nicht versendet; außerhalb dieses Laufs versendete Anfragen wurden nicht geprüft.
- Veröffentlichung, öffentlicher PR-Preview-Build und Merge. Erst nach neuer ausdrücklicher Freigabe.
- Hostingentscheidung, Quellen-/Copyright-Text nach den tatsächlichen Nutzungsbedingungen, mögliche spätere selbst gehostete optimierte Bilder.
- Vollständige Sichtprüfung aller Bildzuordnungen sowie reale Gerätetests und ein vollständiges Accessibility-Audit.
- Externe Mahcks-Störungen separat untersuchen. Keine Änderung an Trader/Cred, Blueprint-Schema oder Kartenmarkern in diesem Auftrag.
