# Außenposten: vollständiger Repository-Datenaudit — 16.10.2026

## Ergebnis und Grenzen

**TEILWEISE VERIFIZIERT.** Dieser Durchgang untersucht den vorhandenen Datenbestand, vergleicht die Möbel mit der aktuell abgerufenen Wiki-Tabelle und prüft aktuelle offizielle Patchnotes. Kein vollständiger Datensatz wurde in diesem Durchgang unabhängig im aktuellen Spiel bestätigt. Keine Rezeptmenge, keine Waffenverbindung und kein Name wurden geändert. Zwei vorhandene Angaben erhalten eng begrenzte Primärquellenbelege. Unbekannte Spielinhalte lassen sich aus dem Repository nicht vollständig aufzählen.

## Tatsächlicher Ausgangsstand

- `main`: `9c95d0151649f306807ecbaab6ecc8fee2aa326c`, Merge von PR #155; lokal und über GitHub bestätigt.
- Branch: `test/outpost-data-audit-20261016`, direkt von diesem Stand.
- Offene PRs bei Beginn: #140, #111, #109, #106. #140 enthält ältere Forschungsstationsdaten; I–IV und ihre Materialreferenzen sind bereits auf main. Nicht erneut übernommen, PR unverändert.
- Remote-Branches mit Außenposten-/Amplified-/Audit-Bezug wurden lokal aufgelistet. Vorhandene Audits unter `docs/data-review/` und `catalog-data/amplified-completeness-audit.md` berücksichtigt. Historische API-Exportdaten bleiben historische Belege; kein erfolgreicher Neuabruf behauptet.

## A. Bestand und vollständige Fehlstellenliste

Die maschinenlesbare Liste `catalog-data/outpost-full-audit-20261016.json` enthält **400 einzeln gekennzeichnete Auditzeilen** mit vorhandenem Inhalt, offenen Eigenschaften, Konflikten, Quellen, Nachweisanforderung und Status. Die Kategorien überschneiden sich fachlich; die Summe ist keine Zahl unterschiedlicher Spielitems.

| Bereich | Geprüfte Referenzen | Vollständig aktuell im Spiel bestätigt | Werte korrigiert | Neue Spielwerte |
|---|---:|---:|---:|---:|
| Möbel | 100 | 0 | 0 | 0 |
| Amplified-Familien | 15 | 0 | 0 | 0 |
| Historische Upgrade-Knoten | 45 | 0 | 0 | 0 |
| Archivierte API-Konfigurationen | 89 | 0 | 0 | 0 |
| Archivierte explizite API-Verbindungen | 108 | 0 | 0 | 0 |
| Amplified-Forschung | 15 (13 integriert, 2 zurückgestellt) | 0 | 0 | 0 |
| Ausbauverbindungen | 3 | 0 | 0 | 0 |
| Bauziel-Stufen im Modell | 2 | 0 | 0 | 0 |
| Forschungsstation-Stufen | 4 | 0 | 0 | 0 |
| Ältere Referenztabellen | 14 | 0 | 0 | 0 |
| Modulkategorien | 5 | 0 | 0 | 0 |

Das Bauzielmodell fasst Foto und Materialphase in einer Stufe zusammen, die beiden Kampfaufgaben in der zweiten. Das ist **keine Behauptung, das Spiel habe nur zwei Projektphasen**. Die Kachel besitzt vier gespeicherte Aufgaben: Foto, Materialien, Flug-ARC und Bully. Die Spielbeschreibung nennt drei Phasen. Bestehende Speicher-IDs bleiben unverändert.

Die Liste unterscheidet `missing-data`, `unconfirmed-properties` und `conflict`. Ein Wiki-Strich ist eine fehlende Angabe und kein Beleg für Nullkosten oder fehlende Forschung. Die neue Aviary-Forschungsangabe ist daher eine Datenlücke mit Kandidatenquelle, kein bewiesener Fehler.

## B. Recherche und Quellenvergleich

### Primärquellen

1. https://arcraiders.com/news/frozen-trail-2-0-update — 08.10.2026, Abschnitt Outpost: bestätigt 100 hinzugefügte Designs und die aggregierte Verteilung 73/22/4/1. Bestätigt keine Einzelrezepte und keine vollständige Zuordnung jedes Designs. Die bestehende Zahl stimmt mit dieser Veröffentlichung überein; identische Anzahl allein beweist keine Katalogvollständigkeit.
2. https://arcraiders.com/news/store-update-2-1-0 — 13.10.2026, Items: Mobile-Fire Grip Fittings benötigt Skulker Targeters statt Skulker Drivers. Im Repository war Targeter bereits richtig. Die Patchnote bestätigt weder Menge 20 noch Forschungspunkte/Aufgaben. Außerdem nennt sie eine Hairpin-Semi-Auto-Korrektur ohne Zahlen; keine Waffenwerte übernommen.

### Aktueller Möbelvergleich

https://arcraiders.wiki/w/index.php?title=Furniture&oldid=43358 — HTTP 200 direkt abgerufen; Revision vom 16.10.2026. HTML-SHA256 im JSON. Vergleich über normalisierte englische Bezeichnungen; keine unabhängige Datenerhebung des Wikis bewiesen.

- 96 Baukostenlisten stimmen textlich/mengenmäßig mit dem Wiki überein. Dies ist ein Community-Abgleich, keine Spielverifizierung.
- Zwei Baukostenkonflikte: Chambers Lamp (Sheet Metal: Repository 10, Wiki 1); Printed Lab Sofa (Sheet Metal: Repository 15, Wiki 5).
- Zwei gleich benannte Repository-IDs für Study Armchair; Wiki führt zusätzlich Sturdy Armchair. Beide vom automatischen Mengenabgleich ausgeschlossen. Keine Umbenennung aus Ähnlichkeit abgeleitet.
- Battered Lab Cabinet (Wide): Forschung Mechanical Components 3 gegenüber Metal Brackets 3 im Wiki.
- Battered Aviary Table: Wiki nennt Forschungsangaben, die im Katalog fehlen. Kandidat dokumentiert, nicht importiert.
- Von 52 vorhandenen Forschungen: 27 stimmen mit Wikiangaben überein, eine widerspricht, eine hat eine mehrdeutige Möbelidentität, 23 fehlen dort. 48 Katalogeinträge haben keine Forschungsangabe; davon bietet das Wiki einen Kandidaten. Fehlende Wikiangaben widerlegen vorhandene Forschung nicht.

### Weitere Quellen und Aussagekraft

- https://arcraiders.wiki/wiki/Outpost — Stationskosten und Bauprojekt gegengeprüft; Communitydaten, keine neue Spielverifizierung. `Research_Station` führt im Reader zur Workshop-Seite, daher keine separate Stationsbestätigung daraus.
- https://arcraidershub.com/guides/amplified-weapons-guide — Ausbau und Forschungsablauf gelesen. Verlinkte Spielbilder waren nicht verlässlich visuell zugänglich; Bildunterschriften nicht zu selbst geprüften Screenshots hochgestuft.
- https://arctracker.io/research/compact-combustion-charges — aktuelle Seite benennt Incendiary Grenades für Rascal und Hullcracker sowie Forschungsinformationen. Verengt den Namenskonflikt gegenüber der alten API-Bezeichnung Incendiary Rounds; beweist keine sichere Zuordnung aller historischen Konfigurationen. Keine Integration.
- https://arcraiders.wiki/wiki/Amplification und Suchfund `Amplified_Weapons` — widersprüchliche Equalizer- und Incendiary-Bezeichnungen bleiben offen; Direktabruf der zweiten Seite fehlgeschlagen.
- https://wiki.arcraiderscommunity.com/wiki/Furniture_Index und https://raiderbuddy.com/cheat-sheet/designs — Suchergebnisse stützen Gesamtzahl und liefern Erwerbskandidaten; Herkunftsunabhängigkeit nicht nachgewiesen. Keine Einzelzuordnungen übernommen.
- https://arctracker.io/api/items — direkter Neuabruf HTTP 403; Reader ebenfalls fehlgeschlagen. 89/108 stammen weiterhin aus dem bereits im Repository dokumentierten Export vom 14.10., nicht aus einem erfolgreichen aktuellen Export.
- Zusätzliche direkte Itemseiten, Action Economy und Aviary-Forschung nicht erfolgreich abgerufen; keine negativen Aussagen über das Vorhandensein dieser Inhalte daraus abgeleitet.

Keine Quellenkonflikte wurden durch Überschreiben aufgelöst. Der offizielle Targeter-Beleg bestätigt einen bereits richtigen Wert.

## C. Kontrollierte Integration und Anzeige

- `outpost-catalog.json`: `coverageEvidence` ergänzt. Nur offizieller Gesamtumfang zum Veröffentlichungszeitpunkt und Verteilung bestätigt; übergeordneter Communitystatus unverändert.
- `catalog-data/amplified-variants.json`: `fieldEvidence` für `mobile_fire_grip_fittings.materials.itemId`. Nur die Materialidentität verifiziert; Gesamtstatus weiterhin `api-documented-not-game-confirmed`.
- Audit-JSON, reproduzierbarer Generator und Regressionstest hinzugefügt; statisches Quality Gate erweitert.
- Keine Änderung an Rezeptmengen, Itemsuche-IDs, Spielerständen, Planung, Waffenwerten oder Layout.

Anzeigeprüfung auf Quellcodeebene: `outpost-catalog.js` iteriert alle 100 Möbel und die vorhandenen 52 Forschungsblöcke. Die älteren Tabellen mit acht Forschungen/vier Möbelrezepten werden absichtlich zugunsten dieses Katalogs ausgeblendet. Amplified nutzt 40/45 historische Knoten, 76/89 Konfigurationen und 84/108 Verbindungen; die Ausschlüsse sind dokumentiert. 13 Forschungsprojekte werden angezeigt; Action Economy und Compact Combustion Charges sind wegen ungeklärter Knotenzuordnungen zurückgestellt. Nicht angezeigte Archivdaten werden nicht automatisch als UI-Fehler behandelt.

## D. Verbleibende Nachweise

- Möbelkonflikte: je eindeutig identifizierbarer Design-/Möbelname plus vollständiges Herstellungs-/Forschungsmenü. Besonders beide Armchairs, Chambers Lamp, Printed Lab Sofa, breiter Battered Lab Cabinet und Battered Aviary Table.
- Erwerb/Varianten: Designansicht mit Quelle, Belohnungsstufe bzw. Ausbau-Freischaltung; keine Verteilung einzelner IDs aus der offiziellen Gesamtsumme ableiten.
- Ausbau: Menüs I→II, II→III, III→IV mit kompletten Mengen und Raumvarianten; Stationsmenüs I–IV mit Voraussetzungen.
- Amplified: pro Familie kompletter Baum, je ausgewähltem Knoten vollständige Kosten, Ausgangskonfiguration, Sperren und Forschungsbezug. Besonders Osprey/Jupiter Bolt, Rascal/Hullcracker Incendiary und Equalizer Anti Shield.
- Forschung: beide Schritte, sämtliche Loadout-Icons und Materialmengen; Aufnahme mit Datum und Spielversion. API-Text allein bestätigt die Icons nicht.
- Übersetzungen: aktuelle DE/EN-Spielnamen; insbesondere der englische Sheet-Metal-Fallback bleibt unbestätigt, nicht frei übersetzt.

## E. Technische Prüfung

Lokal bestanden: alle sieben bestehenden statischen Quality-Gate-Skripte, neuer Audit-Test, Möbelstrukturprüfung (100 IDs, 52 Forschungsdatensätze, keine Strukturprobleme), `git diff --check`. Einzelne Exitcodes wurden separat erfasst. Neuer Test kontrolliert 400 eindeutige Audit-IDs, aktuelle Eingabedatei-Hashes, Archiv-Verbindungsendpunkte, UI-Teilmengen und begrenzte Verifizierungsreichweite.

FEHLGESCHLAGEN und korrigiert: erster Generatorlauf wegen zu spät importiertem `Path`; Import korrigiert, Generator und Test danach erfolgreich. Ein erster Netzwerkversuch nutzte das hier nicht installierte Python-Modul requests; mit Standardbibliothek wiederholt. Tatsächliche HTTP-Ergebnisse siehe Quellen.

Lokale Browserprüfung FEHLGESCHLAGEN: Playwright vorhanden, Chromium fehlt. Installationsversuch scheiterte an ungültigen/abgeschnittenen ZIP-Dateien. Kein lokaler Browserdurchlauf und keine visuelle Bestätigung behauptet. Browser-Matrix muss im GitHub Quality Gate für den tatsächlichen PR-Head geprüft werden.

Das Projekt ist eine statisch ausgelieferte Anwendung ohne package.json/Build-Script. Kein separater Build behauptet; Daten-/Assetprüfungen und Browser-CI sind die vorhandene technische Validierung. Ein grünes Gate bestätigt keine Spielrezepte.

Reproduktion: eine lokal abgerufene Furniture-HTML-Datei an `python tools/audit_outpost_full.py Furniture.html` übergeben, danach `node tests/outpost-full-audit.mjs`. Die Quelldatei und ihre Revision/Hash müssen zur Auswertung passen. Der Generator schreibt ausschließlich die Auditdatei; keine automatischen Spielwertkorrekturen.

Commit, PR und endgültiger CI-Stand werden im PR nach tatsächlicher Prüfung dokumentiert. **Kein Merge freigegeben oder durchgeführt.**
