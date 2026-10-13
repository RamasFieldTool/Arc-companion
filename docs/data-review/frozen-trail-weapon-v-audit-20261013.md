# Frozen Trail 2.0: Waffenstufe V / Amplified – Prüfraster

Stand: 13.10.2026. Nur Analyse, keine produktiven Waffenwerte.

## Begriffe auseinanderhalten
- **Waffenstufe**: römische Nummer I, II, III, IV oder gegebenenfalls V im angezeigten Spielnamen.
- **Amplified**: Update-System für ausgewählte Waffen; **nicht automatisch** mit der Bezeichnung `V` gleichsetzen. Der genaue Zusammenhang muss pro Waffe anhand eines Spielscreens, offizieller Patchnotes oder zuverlässiger Primärdaten geklärt werden.
- **Einträge**: Zwei Waffen mit vier bestätigten Stufen ergeben acht Einträge, nicht acht Stufen pro Waffe.

## Prüfung je Waffenfamilie
| Familie | I–IV | V tatsächlich vorhanden? | Amplified-Variante? | Nachweis | Integration |
|---|---|---|---|---|---|
| Bantam | I–IV im Testbranch #149 | offen | offen | Primärbeleg fehlt | kein V-Eintrag |
| Stiletto | I–IV im Testbranch #149 | offen | offen | Primärbeleg fehlt | kein V-Eintrag |
| Anvil | I–IV im Katalog | offen | offen | offizieller Rarity-Fix für I–IV, kein V-Beleg | keine Änderung |
| Alle übrigen Familien im 581er Snapshot | noch familienweise zu erfassen | offen | offen | September-Snapshot ist vor 2.0 | keine Änderung |

## Verifikation vor produktiver Aufnahme
1. Gesamte September-Snapshot-Waffenfamilien nach Typ, Namensschema und tatsächlicher Item-ID auswerten. Vorhandene Einzeldateien sind kein Beweis für vollständige Live-Daten.
2. Offizielle 2.0-Patchnotes nach `Amplified`, `tier V`, `level V` und betroffenen Waffennamen prüfen.
3. Für jede V-Variante einen belegten Itemnamen und eindeutige Identität festhalten. **Keine automatisch generierten `_v`-IDs**.
4. V-/Amplified-Upgradekosten, Recycling und Reparatur separat prüfen. Unbekannte Werte bleiben leer.
5. Bei der Integration bestehende `arcOwned`, `arcPlanningPersonal`, `arcNextRaid` und `arcFrozenTrailIdentities` mit Live-/Fallback-Daten testen.
6. Quality Gate muss vollständig grün sein; erst dann Merge-Entscheidung.

## Aktuelle Grenze
Es gibt noch **keinen** belegten vollständigen 2.0-Waffenkatalog, aus dem sich alle V-Stufen sicher ableiten lassen. Die Aussage „alle Waffen haben Stufe V“ ist nicht belegt. Keine Spekulation in `main`.
