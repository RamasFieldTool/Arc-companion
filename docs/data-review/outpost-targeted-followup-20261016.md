# Außenposten: gezielte Nachprüfung und Merge-Bewertung — 16.10.2026

## Umfang

Fortsetzung von PR #156 auf `test/outpost-data-audit-20261016`, Ausgangshead `f3e58be73f2b0de2ab4bba330c03e3ea35b1041e`. Remote-main erneut `9c95d0151649f306807ecbaab6ecc8fee2aa326c`; PR konfliktfrei und offen. Die weiteren offenen PRs #140/#111/#109/#106 wurden auf Überschneidungen geprüft. Keine Übernahme aus den alten Branches. #140 ist weiterhin älter als die bereits vorhandenen Stationsdaten.

Der ursprüngliche Audit mit 400 Referenzen bleibt als datierter Stand erhalten. Ergänzung: `catalog-data/outpost-targeted-followup-20261016.json` erfasst die fünf Möbelthemen, **alle fünf offenen historischen Knoten, alle 13 ausgeschlossenen Konfigurationen und alle 24 ausgeschlossenen Verbindungen**. Quellendokumentation ist getrennt von Spielverifizierung. Keine zusätzlichen aktiven Spielwerte importiert.

## Möbel: Ergebnis je Konflikt

| Thema | Neues Rechercheergebnis | Entscheidung / nötiger Nachweis |
|---|---|---|
| Chambers Lamp | Wiki weiterhin 1 statt vorhandener 10 Sheet Metal. RaiderBuddy-Sheet-Metal-Mengen stehen unter Recycling; sie sind kein Herstellungsbeleg. | Mengen unverändert. Vollständiges Herstellungsmenü mit Namen und beiden Materialien nötig. |
| Printed Lab Sofa | ARC-Tracker-Suchauszug der Designseite nennt 15 Sheet Metal und stützt damit die vorhandene Zahl gegenüber Wiki 5. Direkter Seitenabruf scheiterte. Andere gefundene Werte betreffen Recycling. | Kein unabhängiger Spielnachweis. Herstellungsmenü nötig; kein Überschreiben. |
| Study/Sturdy Armchair | Weiterer Community-Index führt zwei Study Armchairs mit verschiedener Seltenheit. Die Wiki-Umbenennung kann keiner Repository-ID sicher zugeordnet werden. | Beide IDs und Namen unverändert. Beide Möbel-/Designansichten mit Seltenheit, Bild und Kosten zusammen erfassen. |
| Battered Lab Cabinet (Wide) | Über den Forschungsindex erreichte aktuelle ARC-Tracker-Designseite nennt wie das Repository Mechanical Components; Wiki nennt Metal Brackets. | Konflikt eingegrenzt, nicht im Spiel aufgelöst. Forschungsansicht mit Name, Level und Material nötig. |
| Battered Aviary Table | ARC Scrappy nennt Forschung Stufe 3 / 1.500 Punkte / ein Laser Level am Möbel-Datensatz. Der ARC-Tracker-Designindex lieferte unter diesem Namen keinen Treffer. | Kandidat dokumentiert. Unklar bleibt, ob ein Möbel oder sein Entwurf belohnt wird. Keine automatische Gleichsetzung; Forschungsziel, Belohnung und Inventar danach aufnehmen. |

Wichtig zur Unabhängigkeit: ARC Scrappy verlinkt RaidTheory/arcraiders-data als Datenquelle. Dessen README nennt ARC Tracker als Nutzer der Daten. Diese Websites zählen deshalb nicht als unabhängig erhobene Spielbelege. Gleiche Werte auf mehreren Websites reichen hier nicht zur Hochstufung.

## Amplified: Zuordnungen und Grenzen

### Bolt

Die Zuordnung historischer `straight_bolt`-IDs zu den Datenbank-Anzeigenamen **Ergonomic Bolt** ist jetzt auf Quellenebene nachvollziehbar: Osprey-Seite unter derselben ID, Jupiter-/Osprey-Seiten bei MetaForge und der Guide nennen diese Bezeichnung. Die Action-Economy-Seite ordnet die Forschung Jupiter und Osprey zu. Damit ist der Benennungsunterschied auf Datenbankebene eingegrenzt, aber nicht jede Konfiguration in der aktuellen Spielversion bestätigt. Keine neuen aktiven Knoten oder Pfade.

### Incendiary

Die Forschungsseite Compact Combustion Charges nennt Incendiary Grenades für Rascal/Hullcracker, die abgerufenen Hullcracker-Konfigurationsseiten nennen Incendiary Rounds. Das ist ein Unterschied innerhalb derselben Datenquelle. Keine stillschweigende Aliasbildung. Die vier direkten Rascal-Konfigurationsabrufe scheiterten; der Forschungsbezug ist kein vollständiger Beleg für ihre individuellen Pfade.

### Equalizer Anti Shield

Die erneut gelesene Equalizer-Seite führt die bekannten drei anderen Optionen. Anti Shield wird dort nicht aufgeführt. Das beweist weder, dass es nie existierte, noch dass es entfernt wurde. Status bleibt offen/widersprüchlich; keine Löschung des historischen Kandidaten und keine Aufnahme als bestätigte Option.

### 13 Konfigurationen und 24 Verbindungen

- Alle 13 Konfigurationen einzeln im neuen Ledger erfasst. Für neun wurden aktuelle Detailseiten gelesen (teils MetaForge statt fehlgeschlagener ARC-Tracker-Direktabrufe); für vier Rascal-Datensätze kein erfolgreicher direkter Detailabruf.
- Alle 24 archivierten Verbindungen einzeln mit unveränderten Archivkosten erfasst. Sieben wurden auf gelesenen Seiten erneut mit expliziter Richtung und Kosten abgeglichen. Für die übrigen 17 wird keine neue vollständige Richtungs-/Kostenbestätigung behauptet.
- Keine Verbindung aus Namenskombinationen ergänzt. Keine Konfiguration als aktuell spielbar oder veraltet klassifiziert, wenn dafür der Beleg fehlt.
- Mehrere ARC-Tracker-Seiten deklarieren weiterhin Spielversion 2.01 und Aktualisierung 08.10.; das ist keine selbst geprüfte Bestätigung für den aktuellen 2.1-Spielstand.

## Action Economy / Compact Combustion Charges

Beide Forschungsprojekte sind jetzt im gezielten Ledger mit aktuellen Seitenbelegen dokumentiert, bleiben aber außerhalb der aktiven Forschungsanzeige.

Action Economy: Die Detailseite konnte nach Folgen des Indexlinks gelesen werden. Sie nennt ausdrücklich eine Raid-Begrenzung für die Hairpin-Aufgabe. Diese Einschränkung darf bei einer späteren Integration nicht verloren gehen. Compact Combustion Charges ist ebenfalls erneut gelesen; Loadout-Icons und Original-Spielmenüs bleiben ungeprüft. MetaForges generisches „Produces Research Station Level 4“ ist kein Bau-Rezept der Station und wird nicht so übernommen.

## Ausbau, Stationen und Erwerb

Die vorhandenen Stationskosten I–IV stimmen mit den erneut gelesenen Community-Stationstabellen überein. ARC Scrappy nennt erforderliche Raumzahlen; das wird nicht ungeprüft mit der Bedeutung eines Stations-/Ausbaulevels gleichgesetzt. Der vorhandene Guide dokumentiert weiterhin die drei gespeicherten Ausbauübergänge. Originalbilder konnten nicht visuell geöffnet werden. Keine Mengen oder Voraussetzungen hochgestuft.

Einzelne Erwerbs-/Pass-/Ausbauzuordnungen aus Datenbanken wurden nicht importiert. Eine offizielle Gesamtverteilung ist kein Nachweis für die Zuordnung einzelner Designs. Varianten bleiben ohne passenden Spielmenünachweis offen.

## Technischer Abschluss

- Generator in einem isolierten temporären Verzeichnis mit erneut abgerufener gepinnter Wiki-Revision ausgeführt: Exit 0. Alle 400 Zeilen, Kategorien und Vergleichsergebnisse identisch; nur die HTML-Byte-Prüfsumme unterscheidet sich. Der originale Audit wurde dabei nicht verändert.
- Alle sieben bestehenden statischen Quality-Gate-Scripte erneut erfolgreich. Neuer Audit-Test und Möbelstrukturprüfung ebenfalls erfolgreich: 100 eindeutige IDs, 52 Forschungsdatensätze, keine Strukturprobleme.
- Audit-Regression um exakten Mengenvergleich der ausgeschlossenen 13/24/5-Referenzsätze ergänzt. Test prüft unveränderte Archivkosten und verhindert eine Dokumentations-Hochstufung zu Spielverifizierung.
- Lokaler Browserstart erneut fehlgeschlagen: Chromium Headless Shell 1234 fehlt. Kein lokaler Browserdurchlauf behauptet. Der vorherige tatsächliche Head bestand CI #465 vollständig; für diesen ergänzten Head ist ein neuer vollständiger CI-Lauf erforderlich.
- Keine Datei der aktiven Anzeige, keine Rezeptmenge, Speicher-ID oder Spielerstand geändert. Neuer Ledger wird von keinem Produktscript geladen. Gegenüber main enthält der PR weiterhin nur die beiden bereits dokumentierten, eng begrenzten Primärquellen-Metadaten als aktive Dateidifferenz.
- Kein eigener App-Build vorhanden: statische Anwendung; Daten-/Assettests und Browser-CI sind die vorhandenen Prüfungen.

Fehlgeschlagene Recherchen: API-Neuabruf HTTP 403; Forschungsstationsseite direkt HTTP 403, Reader erfolgreich; Screenshot-Download HTTP 403; mehrere direkte Detailseiten nicht zugänglich. Das sind keine Belege für das Fehlen von Spielinhalten. Ein ARCscrappy-Itemabruf gelang erst über seinen tatsächlichen Stationslink. Suchauszüge sind im Ledger ausdrücklich von gelesenen Seiten getrennt.

## Priorisierte Community-Aufnahmen

1. Chambers Lamp und Printed Lab Sofa: Herstellungsansicht mit vollständigen Kosten.
2. Beide Armchairs: Designname, Möbelname, Seltenheit/Bild und Kosten; beide Einträge gegenüberstellen.
3. Breiter Battered Lab Cabinet: Forschungskosten. Battered Aviary Table: Forschungsziel, Stationslevel, Kosten und tatsächliche Belohnung.
4. Osprey/Jupiter: kompletter Baum und Bolt-Tooltip mit Name, Forschung und Kosten; anschließend gewählte Kombinationen.
5. Rascal/Hullcracker: Incendiary-Tooltip, Forschungsbezug und alternative Kombinationen.
6. Equalizer: vollständiger Baum einschließlich gesperrter Optionen; ggf. Anti-Shield-Tooltip.
7. Action Economy / Compact Combustion Charges: beide Forschungsschritte, vollständige Aufgaben/Loadout-Icons, Ressourcen; Aufnahmedatum und Spielversion.

## Merge-Bewertung

Die aktuelle Nutzerfreigabe erlaubt einen selbstständigen Merge nach bestandenem aktuellem CI. Ein Merge ist hier als **Audit-/Belegsicherung** sinnvoll: ungelöste Spielwerte werden nicht importiert, die Benutzeroberfläche bleibt unverändert. Die Recherche ist kein Beleg dafür, dass alle offenen Inhalte geklärt sind. Bei grünem aktuellem CI und unverändert konfliktfreiem PR bestehen für diesen begrenzten Änderungsumfang keine aus der Prüfung bekannten wesentlichen Risiken durch die fehlende lokale Chromium-Installation. Die vollständige Browserprüfung muss dafür im CI tatsächlich bestehen.

Endgültiger Head, CI, Merge-Commit und Pages-/Live-Ergebnis werden nach tatsächlicher Ausführung im PR und Abschlussbericht festgehalten. Dieser Absatz behauptet keinen bereits erfolgten Merge.

## Quellen

Die konkreten URLs und ihre Reichweite stehen zusätzlich pro Datensatz im Ledger. Wesentliche neu gelesene Seiten:

- https://arctracker.io/research/action-economy
- https://arctracker.io/research/compact-combustion-charges
- https://arctracker.io/items/osprey_amplified_straight_bolt
- https://arctracker.io/items/hullcracker_amplified_incendiary_rounds
- https://arctracker.io/items/equalizer_amplified
- https://arctracker.io/items/battered_lab_cabinet_wide_design
- https://metaforge.app/arc-raiders/database/item/action-economy
- https://www.arcscrappy.com/en/items/battered_aviary_table
- https://www.arcscrappy.com/en/stations/research_station
- https://github.com/RaidTheory/arcraiders-data
