# Frozen Trail – Datenbereitschaft, erste Prüfung
Stand: 08.10.2026 morgens, Europe/Zurich. Fortsetzung von Punkt 1; kein Datenimport und kein Merge.

## Basis
Remote-main erneut geprüft: `25816084d95f4bf379914420e6765ab7c78c437d`.
Vorbereitungsbranch vor diesem Bericht: `e19753e4e6b81f967086f5ae45454c9c17dff03e`.
Die Quellen wurden tatsächlich per HTTP abgerufen. Ergebnisse gelten für diesen Abruf, nicht für spätere Veröffentlichungen.

## Tatsächlich ausgeführte Prüfungen

| Quelle | Beobachtung | Bewertung |
|---|---|---|
| Offizielle Patchnotes-Übersicht | Noch keine vollständigen Frozen-Trail-Release-Notes in der geöffneten Übersicht gefunden | OFFEN: Release-Detailprüfung. Kein Beweis, dass Notes nirgendwo existieren |
| Mahcks Item-Endpunkt | Zwei getrennte Abrufe derselben ersten Katalogseite mit HTTP 502 fehlgeschlagen | FEHLGESCHLAGEN: aktueller Katalog konnte nicht gelesen werden; keine Aussage zu dessen Inhalt/Vollständigkeit |
| RFT Snapshot | Schema gelesen; 581 Items, 581 eindeutige IDs, deklarierter count 581; generatedAt 2026-09-24T15:55:47.768Z | VERIFIZIERT: bestehender Snapshot ist strukturell in diesen Zählungen konsistent; kein neuer Frozen-Trail-Nachweis |
| Snapshot-Suche | Keine ID-/Namens-Treffer für stiletto, bantam, tether, yank, grappl, banjo, harmonica, pendola | VERIFIZIERT für diese Suchbegriffe. `camera_lens` existiert, bestätigt aber nicht das neue Kamera-Gadget |
| RaidTheory main | Letzter zurückgegebener Commit 2a4abebb2486a633070f4e260058bcd5ad4511d6, Committer-Datum 2026-08-19T02:38:05Z, Nachricht zu Update 1.42.0 | VERIFIZIERT als zurückgegebener Repository-Stand; keine Gleichsetzung mit Release-Aktualität |
| RaidTheory Baum | Rekursiver Baum am genannten Commit nicht abgeschnitten; 581 Item-JSON-Dateien, 100 Quest-JSON-Dateien; keine gesuchten neuen Pfadnamen | VERIFIZIERT für den gelesenen Baum. Kein vollständiger semantischer Audit aller Dateien |
| Questindex | 100 JSON-Dateieinträge zurückgegeben | VERIFIZIERT als Verzeichniszählung; Anforderungen, Mengen und Belohnungen aller 100 Quests hier nicht einzeln geprüft |
| Snapshot-Branch | Zurückgegebener letzter Commit 59123772cbad06c3255aa189ac09827d1197e977, Datum 2026-09-24T15:55:47Z | VERIFIZIERT: beobachteter Snapshot-Stand weiterhin September |
| Remote-Eventfeed | syncedAt 2026-10-08T01:09:04Z; kein Pendola Pass und keine Frigate in den zurückgegebenen Kartennamen/Conditions | VERIFIZIERT: aktueller Abruf enthält diese Namen nicht. Frischer Synchronisationszeitpunkt bestätigt nicht neue Update-Inhalte |

## Gelesene Eventnamen
Conditions: Beachcombing, Bird City, Close Scrutiny, Electromagnetic Storm, Harvester, Hidden Bunker, Hurricane, Husk Graveyard, Launch Tower Loot, Matriarch, Night Raid, Prospecting Probes.
Kartennamen: Buried City, Dam Battlegrounds, Riven Tides, Spaceport, Stella Montis, The Blue Gate.
Keine aktuellen Spielzeiten, einzelnen Eventintervalle oder vollständige neue Condition-Regeln daraus verifiziert.

## Quellen / wiederholbare Abrufpunkte
- https://arcraiders.com/news/tag/patch-notes
- https://arcdata.mahcks.com/v1/items?full=true&offset=0&limit=45
- https://raw.githubusercontent.com/RamasFieldTool/Arc-companion/catalog-data/items-full-snapshot.json
- https://api.github.com/repos/RamasFieldTool/Arc-companion/commits?sha=catalog-data&per_page=1
- https://api.github.com/repos/RaidTheory/arcraiders-data/commits?per_page=1
- https://api.github.com/repos/RaidTheory/arcraiders-data/git/trees/2a4abebb2486a633070f4e260058bcd5ad4511d6?recursive=1
- https://api.github.com/repos/RaidTheory/arcraiders-data/contents/quests?ref=main
- https://raw.githubusercontent.com/RamasFieldTool/Arc-companion/live-events-data/live-events.json

## Entscheidung für den nächsten Schritt
Der vollständige Frozen-Trail-Datenabgleich ist TEILWEISE VERIFIZIERT / OFFEN. Die zugänglichen Datensätze liefern noch keine belegte neue Rezept-/Research-/Quest-/Blueprint-Basis; die Haupt-Item-API konnte nicht gelesen werden. Deshalb keine alten oder geschätzten Zahlen als Release-Daten importieren.

Nach Veröffentlichung erneut Release-Notes und Quellen prüfen. Anschließend IDs, Rezepte, Research-/Werkstattkosten, Quests/Belohnungen, Blueprint-Erwerbswege und Events gegen den bisherigen Stand vergleichen. Neue Materialmengen, Kartenmarker, Waffenwerte oder Übersetzungen nicht aus Vorschauen ableiten. Vor Umsetzung die Prioritäten und Grenzen aus `docs/frozen-trail-update-preparation.md` verwenden.

## Datenerhalt und Prüfgrenzen
Nur dieser Bericht wurde ergänzt. Keine Runtime-, Spieldaten-, Karten-, Nutzerspeicher- oder Backupänderung. Keine Browser-/Spieltests und kein Quality Gate in diesem Lauf ausgeführt. Externer HTTP-502-Fehler getrennt von RFT-Fehlern: kein neuer RFT-Defekt aus diesen Abrufen nachgewiesen. Keine automatische spätere Prüfung/Benachrichtigung eingerichtet.
