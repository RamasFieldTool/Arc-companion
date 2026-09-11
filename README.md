# ARC Companion V2.9.2

V2.7 verbindet die bestehende Ziel-/Bedarfslogik mit dem vollständigen RaidTheory-Katalog über die Mahcks API.

## Verifizierter Katalogstand
Am 11.09.2026 ergab eine direkte GitHub-Code-Suche im aktuellen `RaidTheory/arcraiders-data/items/` **591 JSON-Katalogeinträge**. Ein zweiter aktueller, direkt mit `arcraiders-data` synchronisierter Katalog (arcbot.app) meldet ebenfalls **591 Einträge**.

Wichtig: 591 bezeichnet Katalogeinträge im Datenbestand. Das ist nicht automatisch identisch mit „591 Gegenstände, die aktuell als Loot in jeder Live-Spielversion erhältlich sind“. Manche Drittanbieter filtern den Datenbestand anders und zeigen z. B. 581.

## Änderungen
- Vollständiger Katalog wird paginiert über `https://arcdata.mahcks.com/v1/items?full=true` geladen.
- API-Daten werden auf Vollständigkeit geprüft: geladene eindeutige IDs müssen dem gemeldeten API-Gesamtwert entsprechen.
- Falls die API nicht erreichbar ist, bleibt der bisherige lokale 51-Item-Basisdatensatz als klar gekennzeichneter Fallback verfügbar.
- Vollständiger DE/EN-Umschalter für die Oberfläche.
- Deutsche Seltenheitsbezeichnungen.
- Rajdhani als Hauptschrift; Monospace nur noch für kleine Systemkennzeichnungen.
- Keine vollständige Itemliste mehr beim Öffnen: Items erscheinen erst nach einer Suche.
- Itemkarten neu strukturiert: Wert, Gewicht und Stapel sauber getrennt.
- Bestehende aktive Ziele, Summierung und lokale Bestandswerte bleiben erhalten.

Datenquelle: RaidTheory/arcraiders-data (MIT)
API: Mahcks/arcraiders-data-api
ARC Raiders © Embark Studios. Unofficial community project.


## V2.8 – reine Designrunde
- Keine Änderung an Kernlogik, Suche, Zielberechnung oder Datenquellen.
- Deutlich stärkere ARC-inspirierte 80er-Farbwelt: dunkles Olive, warmes Orange, Bernstein und Creme.
- Weniger Grau-auf-Grau, klarere visuelle Ebenen.
- Header, Zielauswahl, Bedarfszeilen, Suche und Itemkarten neu gestaltet.
- Status BEHALTEN / ERFÜLLT / FREI visuell klarer getrennt.
- Rajdhani bleibt Hauptschrift, Monospace nur für kleine Systemkennzeichnungen.


## V2.9 – Quest-Tracker
- Alle Quests werden über die Mahcks API aus dem RaidTheory-Datensatz geladen.
- Questliste ist standardmäßig eingeklappt und erscheint erst über „ANZEIGEN“.
- Suche und Filter: Alle / Offen / Aktiv / Erledigt.
- Queststatus wird lokal auf dem Gerät gespeichert.
- Questziele, Auftraggeber, benötigte Items, bereitgestellte Items und Item-Belohnungen werden angezeigt, wenn vorhanden.
- Nur aktive Quests mit strukturierten `requiredItemIds` fließen in den Gesamtbedarf ein.
- Expeditionen wurden bewusst nicht eingebaut.


## V2.9.2 Hotfix
- Quest-API wird jetzt korrekt in 45er-Seiten geladen, bis `next` fehlt.
- Doppelte Quest-IDs werden entfernt und die geladene Anzahl gegen `total` geprüft.


## V2.9.2 Hotfix
Quest loading is fault-tolerant: if a later Mahcks API page fails, already loaded quests remain usable instead of discarding the complete quest list.


## V2.9.2 Quest loader fix
Quest data is loaded directly from the RaidTheory GitHub quest directory in small batches. This removes the runtime dependency on Mahcks quest pagination. Active quest `requiredItemIds` continue to contribute to the total item requirement.
