# ARC Companion V2.7

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
