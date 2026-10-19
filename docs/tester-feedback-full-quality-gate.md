# Testerfeedback – vollständige lokale Quality-Gate-Nachprüfung

## Geprüfter Stand

- Getesteter Commit: `4f833c653b74f74ffe942f91f859f95e48104e85`.
- Branch: `fix/live-events-fallback-source-label`, PR #126.
- Kombinierte Review-Kette: main → #123 → #124 → #125 → #126. Die Git-Abstammung aller Übergänge wurde selbst geprüft.
- main: `c8d666f4819dcfe7ef42e3994a5e6c6c51595425`.
- #123: `4cf8f5af242689b114473787640ebbba069fc17c`; #124: `8334b399c692a3d1f5b3150a202f16cc46433b92`; #125: `f09808b371ef95381b9dc8f54f2900eed6abae1d`.
- Alle vier PRs waren bei der eigenen Metadatenabfrage OPEN / DRAFT / MERGEABLE. Es wurde kein Merge vorgenommen.
- Node.js 20.19.0 (offizielles Archiv und SHA-256-Prüfsumme geprüft), Playwright 1.55.0, Chromium.
- Lokaler HTTP-Server, originale Tests und `tests/helpers/review-network-proxy.mjs`. Dieser Helfer konfiguriert ausschließlich den vorhandenen Proxy und dessen vorhandenes Zertifikat. Keine zusätzlichen Ersatzantworten, keine entfernten Fehlerlistener.
- Die ursprünglichen Tests verwenden weiterhin ihre eigenen Item-/Quest-/Suno-Fixtures. Der Starttest verzögert echte lokale Skriptrequests und setzt sie anschließend mit `route.continue()` fort. Das ist keine Prüfung sämtlicher realer Spieldaten oder externer Zielseiten.
- Stories und Radio liefen in eigenen Browserkontexten parallel zur übrigen Skriptfolge. Am geprüften Commit wurde während des Laufs nichts geändert.

## VERIFIZIERT

Die folgende Tabelle enthält vollständige Skriptabschlüsse, keine aus einzelnen Assertions abgeleiteten Gesamtergebnisse. Alle 17 Skripte der aktuellen Quality-Gate-Workflowdatei plus zwei ergänzende Testerfeedback-Skripte wurden ausgeführt.

**Ergebnis: vollständiger lokaler Lauf, 19/19 Skripte mit Exit 0; Gesamtrunner ebenfalls Exit 0. Kein GitHub-Actions-Gesamtlauf behauptet.**

| Ausgeführtes Skript | Vollständiges Ergebnis |
| --- | --- |
| `tests/data-integrity.mjs` | Exit 0 |
| `tests/planning-core.mjs` | Exit 0 |
| `tests/item-find-locations.mjs` | Exit 0 |
| `tests/quality-gate.mjs` | Exit 0 |
| `tests/item-find-locations-browser.mjs` | Exit 0 |
| `tests/logo-home.mjs` | Exit 0 |
| `tests/free-raid-progress.mjs` | Exit 0 |
| `tests/planning-usability.mjs` | Exit 0 |
| `tests/workshop-materials.mjs` | Exit 0 |
| `tests/startup-readiness.mjs` | Exit 0 |
| `tests/summary-owned-stepper.mjs` | Exit 0 |
| `tests/i18n-smoke.mjs` | Exit 0 |
| `tests/italian-language.mjs` | Exit 0 |
| `tests/user-data-safety.mjs` | Exit 0 |
| `tests/ui-regression.mjs` | Exit 0 |
| `tests/raider-radio.mjs` | Exit 0 |
| `tests/search-source-labels.mjs` | Exit 0 |
| `tests/tester-feedback-review.mjs` | Exit 0 |
| `tests/raider-stories.mjs` | Exit 0 |

Weitere selbst bestätigte Ergebnisse:

- Werkstatt: Materialien vor Auswahl sichtbar; Auswahl/Abwahl und Rückmeldung; gemeinsame Materialien summiert, Bestand einmal abgezogen. Beispiel: Bedarf 83, Bestand 7, Fehlmenge 76; nach Abwahl Bedarf 63. Persönliches Ziel und Auswahl nach Reload erhalten.
- Planung: persönliche Ziele, explizite Zielmengenänderung, gemeinsame Quest-/Werkstattanforderungen, Bestand/Funde, Überschuss, pausierte/erledigte Ziele, Abschluss und Wiederöffnung, keine doppelte Materialbuchung, Abbruch und Sprach-/Tabwechsel.
- Datenerhalt: vorhandene isolierte Testdaten über Start/Reload/Verbindungsausfall, Backup-Rundlauf und Import in frischen Kontext; Altbackup-Migration; ungültige und unsichere Dateien abgelehnt. Keine tatsächlichen persönlichen Browserdaten benutzt oder verändert.
- Hilfe: acht Themen untereinander, einzeln und gleichzeitig aufklappbar, Tastatur-Enter und klare Rücknavigation; aktuelle Planungs-/Raid-/Backup-Erklärungen mit Implementierung und ausgeführten Verhaltensprüfungen abgeglichen.
- DE/EN/FR/ES/IT: Suchgruppen, Recycling-Hinweis und Ertrag, Sprachwechsel und gespeicherte Sprache; Remote-/Fallback-Quellenlabel; Hilfe/Planung und bekannte Datenlabels im Rahmen der aufgeführten Tests.
- 360/1280px × fünf Sprachen × acht vorhandene Surface-/Akzentkombinationen im ergänzenden Testerfeedback-Test. Nebenfarben unterscheiden sich; selektierte Werkstattkategorie mit Textkontrast mindestens 4,5:1; sichtbarer Fokus; keine abgeschnittenen Werkstattnamen oder horizontaler Überlauf in den geprüften Ansichten.
- Weitere Smartphone-/Desktopbreiten in den ursprünglichen UI-/Radio-/Storytests. Frische Smartphone- und Desktop-Screenshots der Planung wurden geöffnet und visuell geprüft.
- Bytevergleich zu main: `items.json`, `goals.json`, `blueprint-acquisition-v2130.json`, `planning-core.js`, `planning-ui.js`, `planning-raid.js`, `backup-v1304.js`, `raider-stories.js` und Raumhafenbild unverändert. Im Raumhafen-JSON unterscheiden sich nur `mapImageSource` und `notes`; Marker und Layer sind identisch. PR #111 nicht integriert.
- `git diff --check` erfolgreich; alle benötigten Assets und Cache-Versionen der kombinierten Fassung erhalten.

## TEILWEISE VERIFIZIERT

- Kontrast und Fokus wurden an den beschriebenen Elementen gemessen/geprüft, nicht an jedem Element jeder Ansicht. Kein vollständiges WCAG-Audit.
- Mobile Tests sind Chromium-Emulation; keine Prüfung auf einem realen Smartphone oder in Safari/Firefox.
- Die fünf Sprachfassungen der geprüften UI sind bestätigt. Keine vollständige linguistische Prüfung aller Spieltexte; fehlende Spielübersetzungen wurden nicht erfunden.
- Bestands-/Fortschritts-/Backup-Erhalt gilt für die tatsächlich ausgeführten Testfälle. Keine Garantie für jede beliebige beschädigte Altdatei oder Browserkonfiguration.

## DOKUMENTIERT

`docs/tester-feedback-audit.md` wurde gelesen. Frühere Quellen-/Blueprint-Belege und deren Grenzen, offizielle Eigennamen wie Locked Gate/Close Scrutiny, bisherige Preview-/CI-Läufe sowie Bildrechte und Kartenreferenzen wurden aus Übergabe und früheren Berichten übernommen. Sie sind kein neu selbst ausgeführter Inhaltsnachweis in diesem Lauf. Ein erfolgreicher UI-Test bestätigt nicht die Spielrichtigkeit jeder Blueprint-/Containerangabe.

## FEHLGESCHLAGEN

Historie bleibt erhalten:

1. Auf `09ec5aa0e46739c0f825b61b0b5d8ced95deebbb` wurden 18 Skripte vollständig ausgeführt: 15 mit Exit 0, drei gescheitert.
   - `raider-stories`: interner Sprachaufruf nach Reload, bevor das asynchrone Sprachmodul bereit war. Eigene Probe mit verzögertem echten Skriptrequest reproduzierte den TypeError; nach tatsächlicher Modulbereitschaft funktionierte der Aufruf. Test-Synchronisation korrigiert, Assertions erhalten.
   - `ui-regression`: früher Klick auf einen bereits aktivierten Planungs-Tab, bevor dessen Handler geladen war. Eigene Verzögerungsprobe reproduzierte den verlorenen Klick. Echter RFT-Startfehler korrigiert.
   - `search-source-labels`: gespeicherte französische Sprache, aber englische Suchlabels. Eigene Verzögerungsprobe bestätigte die falschen Labels auch nach Sprachmodulinitialisierung. Echter RFT-Startfehler korrigiert.
2. Ein gezielter Suchlauf nach der App-Korrektur scheiterte später am Timeout für `#arcLanguageButton`. Der unveränderte separate Wiederholungslauf und der finale Gesamtlauf bestanden. Die Ursache dieses einzelnen Timeouts wurde nicht abschließend belegt; er wird nicht unbelegt als externer Fehler bezeichnet.
3. Auf `e71ca40d79cffdab169781d0f95c3db1e5fa51f3` schlossen 16 Skripte mit Exit 0 ab. Der neue Starttest scheiterte bei ES an seinem fünfsekündigen Enabled-Warten. Stories und Testerfeedback-Matrix wurden durch Beendigung der Ausführungssitzung unterbrochen; kein vollständiger Gesamtlauf. Die Toolmeldung lautete „network approval was cancelled before a decision was returned“, anschließend war die Prozess-ID nicht mehr vorhanden. Das ist ein Infrastrukturabbruch, kein belegter RFT-Fehler.
4. Der Starttest wartet jetzt ausdrücklich begrenzt auf `RFTPlanningUI` und prüft anschließend unverändert die aktivierten Tabs. Eine separate Probe bestand für FR/ES/IT. `4f833c6` enthält gegenüber `e71ca40` ausschließlich diese Testkorrektur.

Frühere externe `ERR_EMPTY_RESPONSE`-Fehler sind im Netzwerk-Nachbericht dokumentiert. Im finalen Lauf ließ kein neuer externer Fehler einen Gesamttest scheitern. Ein kompletter GitHub-Actions-Lauf wird durch lokale Prüfungen nicht ersetzt.

## Vorgenommene Korrekturen

App-Commit `e71ca40d79cffdab169781d0f95c3db1e5fa51f3`:

- Suchlabels lesen die gespeicherte UI-Sprache bereits während verzögerter Initialisierung.
- Planungs-Tabs sind deaktiviert, bis die UI-Handler geladen sind.
- Betroffene Cache-Versionen aktualisiert; übrige Asset-Einträge erhalten.
- Storytest wartet nach Reload auf das Sprachmodul.
- Neuer Regressionstest für verzögerten UI-/Sprachstart, im Quality-Gate-Workflow ergänzt.

Test-Commit `4f833c653b74f74ffe942f91f859f95e48104e85`: explizite Modulbereitschaft vor Enabled-Assertion. Keine weitere App-Änderung.

Die früher in #126 hinzugefügten Remote-/Fallback-Quellenlabels und Cache-/Sprachkorrekturen bleiben enthalten und wurden kombiniert geprüft. Kein Datenmodell, keine erfundene Spielübersetzung, keine Marker-/Bildänderung und kein Refactoring.

## OFFEN

- Vollständiger GitHub-Actions-Lauf der kompletten Review-Kette am finalen Head. Der Workflow startet automatisch nur für PRs mit Basis main; #126 hat weiterhin #125 als Basis. Die Connector-Abfrage findet am getesteten Head keinen PR-getriggerten Lauf (erste Seite); mögliche anders ausgelöste Läufe werden damit nicht ausgeschlossen. Keine Branch-Zusammenführung oder Änderung der PR-Basis nur zum Auslösen von CI vorgenommen.
- Jede spätere tatsächliche Integration muss am daraus entstehenden Commit erneut geprüft werden. Merge nur nach neuer ausdrücklicher Freigabe.
- Reale Geräte, vollständiges Kontrast-/Accessibility-Audit und vollständige Spiel-/Übersetzungsdatenverifikation.
- Itembildrechte, originalgetreue und freigegebene Raumhafenbasis, allgemeines Blueprint-`sources[]`-Modell und Trader/Cred bleiben separate Vorhaben. Unbekannte Werte und Community-Containerangaben wurden nicht auf Verdacht geändert.

## Reproduktion

Playwright 1.55.0 und Chromium installieren; die App lokal per HTTP starten. In dieser Proxyumgebung:

```bash
BASE_URL=http://127.0.0.1:4173/ node --import ./tests/helpers/review-network-proxy.mjs tests/startup-readiness.mjs
```

Für den vollständigen lokalen Lauf jedes in der Ergebnistabelle genannte Skript mit diesem Muster ausführen. Im üblichen CI-Netzwerk verwendet der Workflow weiterhin den normalen Chromium-Start. Der Transporthelfer liefert keine Testdaten.

Der nachfolgende Berichtscommit ändert nur Dokumentation. Der tatsächlich ausgeführte App-/Teststand bleibt der oben genannte Commit. main wurde nach dem Lauf remote erneut geprüft und ist unverändert.

