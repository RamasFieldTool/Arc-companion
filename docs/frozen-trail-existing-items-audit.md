# Bestehende Items – Abgleich mit Frozen Trail 2.0
Stand: 09.10.2026, Europe/Zurich. Prüfung, kein Runtime-Patch und kein Merge.

## Tatsächlich geprüfte Grundlage
Remote-main und per fetch gelesener Code: c097bd124f3fdd8208f1556a4db7fb0c9e8c0953.
Vorbereitungsbranch vor diesem Bericht: 1693825f27865a2a253ff18b4064f86b24f1583e.
Erneut abgerufener Snapshot: HTTP 200, generatedAt 2026-09-24T15:55:47.768Z, 581 Items.
Offizielle Quelle: https://arcraiders.com/es/news/frozen-trail-2-0-update
Direktes Öffnen via Webtool schlug fehl; der Artikeltext wurde über Suchabruf gelesen. Kein In-Game-Test.

## Abgleich
| Bestehendes Item | Offiziell bestätigte Änderung | Tatsächlich gelesener alter Snapshot / Grenze |
|---|---|---|
| Anvil | Grün → Blau; Tech-Mod-Slot entfernt | anvil_i bis anvil_iv: rarity Uncommon; modSlots.special enthält anvil_splitter |
| Anvil Splitter | Kein Mod und kein neuer Drop mehr; weiterhin Verkauf oder Recycling zu Amplified Fragments | recyclesInto: mod_components 1, processor 1; neue Fragmentmenge/ID nicht verifiziert |
| Snap Hook | Reichweite 20 → 18 m; Verbrauch 2 → 4 %; Energiekosten 50 → 60 | effects.Range = 20m; die beiden anderen Werte nicht in den gelesenen strukturierten effects vorhanden |
| Heavy Shield | Haltbarkeitsabnahme 0.20 → 0.15; Bewegungsnachteil 15 → 10 % | effects-Schlüssel „15% Reduced Movement Speed“; kein entsprechender decay-Wert in den gelesenen effects |
| Flame Spray | Reichweite erhöht | Snapshot enthält keine Range in effects; kein neuer Zahlenwert in Notes |
| Zipline | Bricht bei nachträglicher Überschneidung mit Objekten | Verhaltensänderung, daraus keine Rezeptänderung ableiten |
| Jupiter | Trefferweitergabe korrigiert; Wirkung gegen Panzerung/Schwachstellen verändert | damage 60 vorhanden; keine belegte neue Basisdamage-Zahl, nicht pauschal skalieren |
| Hullcracker / Explosivwaffen | ARC-Schadensberechnung geändert | Keine pauschale Änderung des Basisdamage-Feldes ableiten |
| Dolabra | Harvester-Schwachpunkt-Fehler behoben | Spiel-Bugfix; keine belegte Rezeptänderung |
| Anvil / Hullcracker Händler | Tian-Wen-Angebote entfernt, wöchentliche Nomadic-Envoys-Rotation | anvil_i und hullcracker_i enthalten weiterhin Tian Wen |
| Launcher Ammo / Energy Clips | Tägliches Kauflimit | Neue genaue Limits nicht aus Notes verifiziert |

## Bedeutung für RFT
VERIFIZIERT per Code-Lesen: app.js rendert Seltenheit und Recycling aus Itemdaten. Somit sind alte Anvil-Seltenheit und Splitter-Recycling bei Verwendung dieses Ersatzkatalogs relevante Datenabweichungen. Kein Browsernachweis, welcher Katalog bei einem konkreten Nutzer geladen wird.
Die geprüfte Itemkarte rendert effects, modSlots und vendors nicht als separate Felder. Alte Werte dort sind Quellabweichungen, nicht als beobachtete sichtbare UI-Fehler ausgeben. Beschreibungen können zusätzliche Angaben enthalten; keine vollständige mehrsprachige Beschreibungsprüfung durchgeführt.
Lokale items.json ist ein kleiner Material-Fallback; die betroffenen Waffen stammen aus Remote-/Ersatzkatalogen. blueprints.json enthält Tracker-Einträge; der Anvil-Bauplan wird nicht wegen geänderter Waffenrarität umgefärbt.
IDs und bestehende Nutzerbestände/Planung bleiben erhalten, insbesondere anvil_splitter nicht löschen.

## Grenzen und nächster Schritt
TEILWEISE VERIFIZIERT: gezielter Abgleich der in Gameplay/Items/Weapons/Traders benannten bestehenden Items, kein vollständiger Audit sämtlicher 581 Items, Sprachen und Rezepte.
FEHLGESCHLAGEN im vorherigen erneuten Abruf: Mahcks HTTP 502; aktueller Hauptkatalog bleibt unbekannt.
Noch keine Korrekturen, Browser-/Backup-Tests oder Quality Gate für diesen Abgleich.
Für einen späteren Patch: bestätigte Seltenheit separat korrigieren; Recycling erst mit belegter Fragment-ID und Menge; neue Quellenwerte nicht improvisieren. Keine automatische Löschung, kein Merge ohne ausdrückliche Freigabe.
