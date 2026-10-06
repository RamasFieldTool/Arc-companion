# Itembilder in weiteren Listen – Prüfung

Stand: 06.10.2026. Neue Erweiterung nach dem gemergten PR #127. Remote-main vor Beginn selbst geprüft: `e4acf940adef295454246f1cbb79ba0d76900f51`. Branch: `feature/item-images-all-lists`. Kein neuer Merge freigegeben oder ausgeführt. PR #111 ausgeschlossen.

Codecommit: `cd529bb9cbde3d1c3bacca612f3c87f0e0fb0c3a`. Die lokalen Tests wurden im Arbeitsstand vor Speicherung ausgeführt. Danach wurde selbst geprüft, dass alle App-, Asset- und Testdateien bytegleich mit diesem gespeicherten Commit sind. Nachfolgende Berichtsergänzungen ändern keine App-Dateien.

## Umsetzung

Die gemeinsame Bildfunktion wird nun zusätzlich in folgenden Darstellungen verwendet:

- Meine Planung: fehlende Items, persönliche Ziele mit Bestand und ausgewähltes Item neben dem bestehenden Auswahlfeld.
- Raid beendet: Itemzeilen beim Eintragen der Funde.
- Werkstatt: Materialien vor und nach der Stufenauswahl.
- Quests: benötigte, bereitgestellte und belohnte Items.
- Gesamtbedarf/Bestand sowie die bestehenden kompatiblen älteren Raidlisten.
- Bauplanliste: vorhandene Blueprint-Item-ID-Zuordnung des bestehenden Renderers. Keine erfundene Bild-URL bei fehlendem Katalogeintrag.
- Strukturierte Recycling-Ausgaben in Suchkarten.

Kompakte Listenthumbnails haben 28px auf schmalen Bildschirmen und 32px ab 820px; die bereits bestehenden Suchkarten behalten ihre größeren Bilder. Alle Bilder sind ergänzend mit leerem Alttext neben lesbaren Namen. Namen und Mengen werden für HTML maskiert. Fehlercache und erlaubte CDN-Pfade bleiben erhalten. Nur betroffene Assets erhielten neue Cache-Kennungen.

## VERIFIZIERT

Acht lokale Testskripte vollständig ausgeführt, jeweils Exitcode 0:

| Skript | Umfang |
|---|---|
| `tests/item-images-all-lists.mjs` | Zehn vollständige Fälle: DE/EN/FR/ES/IT jeweils 360/1280px; Planung, persönliche Ziele, Raid-Funde mit echter Bestandsänderung im Testkontext, Auswahlbild, Werkstatt, Quest-Items, Gesamtbedarf, Blueprint und Reload |
| `tests/item-images.mjs` | Bestehende Bild-/Suche-/Recycling-Regression inklusive Bildfehler und Theme-Layouts; Fehlerassertion auf das Quellbild im Kartenkopf begrenzt, weil Recycling-Ausgaben nun ebenfalls eigene Bilder haben |
| `tests/user-data-safety.mjs` | Vollständiger Backup-/Restore-/Migration-/Verbindungsausfall-Lauf |
| `tests/planning-usability.mjs` | Vorhandener vollständiger Planungs-/Abschluss-Lauf |
| `tests/workshop-materials.mjs` | Vorhandener vollständiger Werkstatt-Lauf |
| `tests/data-integrity.mjs` | Daten-/Asset-/Cache-/Backup-Integrität |
| `tests/planning-core.mjs` | Berechnung, Fortschritt und Datenerhalt |
| `tests/item-find-locations.mjs` | Statische Fundort-Regression |

Die neue Bildprüfung verwendet kontrollierte Katalog-/Quest-/Werkstattdaten und synthetische SVG-Antworten. Das ist kein Nachweis der echten Bildinhalte. Nach Raid-Funden wurde der gespeicherte Metallteile-Bestand von 2 auf 5 geprüft und nach Reload erneut bestätigt. Fehlende Bilder entfernen keine Bestandsfelder. Acht Theme-Kombinationen wurden in der persönlichen Zielliste auf Überlauf geprüft; zusätzlich wurden die übrigen getesteten Ansichten auf Überlauf geprüft. Die mobilen Screenshots wurden angesehen.

Zusätzlich: Syntaxprüfungen der bearbeiteten Kern-/Planungsskripte und `git diff --check` mit Exitcode 0. Die neue Prüfung ist im vorhandenen GitHub-Quality-Gate aufgenommen; Ergebnisse des PR-Laufs werden im PR selbst festgehalten.

## FEHLGESCHLAGEN

Der erste neue Bild-Gesamtlauf scheiterte an einer während `scrollIntoViewIfNeeded` aus dem DOM entfernten Planungszeile. Die bestehende Planung zeichnet nach Katalog-/UI-Bereitschaft neu. Der Test wartet jetzt wiederholbar auf das tatsächlich sichtbare, dekodierte Bild und wiederholt nur den beobachteten Fall einer abgelösten DOM-Zeile. Keine Abschaltung von Browserfehlern; kein bestandener Gesamtlauf aus diesem ersten Versuch abgeleitet. Der nachfolgende zehnteilige Gesamtlauf endete mit Exitcode 0.

## TEILWEISE VERIFIZIERT / OFFEN

- Echte Katalog-/CDN-Bilder in den neuen Listen: müssen zusätzlich im PR-Preview geprüft werden; lokale Matrix nutzt Testbilder.
- Nicht jede echte Bildzuordnung oder jeder Blueprint-Katalogeintrag wurde einzeln geprüft. Ohne gültige vorhandene URL bleibt die Textdarstellung.
- Die Optionen des bestehenden nativen Auswahlfelds und native Bestätigungsdialoge bleiben textbasiert; beim ausgewählten Item erscheint das Bild daneben. Kein Umbau der Auswahl-/Bestätigungslogik.
- Kompatible ältere, in der aktuellen Oberfläche ausgeblendete Raidlisten wurden im Renderer ergänzt, nicht als eigener sichtbarer Endnutzerablauf in der neuen Bildmatrix geprüft.
- Kein vollständiges WCAG-Audit und keine Tests auf physischem Android/iOS-Gerät.
- Vollständiger GitHub-Quality-Gate und Bereitstellung des PR-Preview: vorerst offen, getrennt von den acht lokalen Läufen.

## DOKUMENTIERT

Frühere Rechteprüfung, die vom Nutzer gemeldete Erlaubnis und der Merge von PR #127 stehen in den vorherigen Itembilder-Berichten und PR #127. Diese Erweiterung verändert keine Spieldaten, Planungsberechnungen, Speicherschlüssel oder Backupformate und führt keinen neuen Merge durch.
