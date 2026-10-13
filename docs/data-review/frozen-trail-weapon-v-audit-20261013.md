# Frozen Trail 2.0: Waffenstufe V / Amplified – Prüfraster

Stand: 13.10.2026. Nur Analyse, keine produktiven Waffenwerte.

## Begriffe auseinanderhalten
- **Waffenstufe**: römische Nummer I, II, III, IV oder gegebenenfalls V im angezeigten Spielnamen.
- **Amplified**: Update-System für ausgewählte Waffen; **fünfte Qualitätsstufe**, ausdrücklich durch Embark bestätigt. Die Amplification-Module MK I–V sind dagegen nach Waffen-Seltenheit gestaffelt und keine weiteren Waffenstufen.
- **Einträge**: Zwei Waffen mit vier bestätigten Stufen ergeben acht Einträge, nicht acht Stufen pro Waffe.

## Prüfung je Waffenfamilie
| Familie | I–IV | V tatsächlich vorhanden? | Amplified-Variante? | Nachweis | Integration |
|---|---|---|---|---|---|
| Bantam | I–IV im Testbranch #149 | offen | offen | Primärbeleg fehlt | kein V-Eintrag |
| Stiletto | I–IV im Testbranch #149 | offen | offen | Primärbeleg fehlt | kein V-Eintrag |
| Anvil | I–IV im Katalog | ja, Amplified | ja | Embark-Patchnotes bestätigen Amplified Anvil / Anvil Splitter | noch keine numerischen Werte |
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

## Punkt 1: Veröffentlichungsprüfung (13.10.2026)
- PR #149: GitHub-Merge bestätigt, Commit `2986566534b78358af8d0c2c09f52dcab39b50c8`.
- Direkter Abruf `https://ramasfieldtool.github.io/Arc-companion/frozen-trail-data.js` und `index.html` über Webzugriff fehlgeschlagen; Container-Netzwerk hat DNS-Auflösungsfehler.
- **Live-Auslieferung / sichtbare UI: NICHT VERIFIZIERT.** Ein erfolgreicher GitHub-Merge ist kein Nachweis für erfolgreiche Pages-Veröffentlichung.

## Punkt 2: Vollständige Waffen-Bestandsaufnahme aus dem alten Snapshot
Quelle: `catalog-data/items-full-snapshot.json`, Git-Blob `bdfd07f475b2375a3d3f6ff695e745d4364658b1`, 581 Items, vor Frozen Trail 2.0.

- 75 Waffeneinträge, 21 Waffenfamilien (18 Familien mit I–IV, drei Einzelwaffen).
- Keine Bantam- oder Stiletto-Einträge im alten Snapshot; sie werden über `frozen-trail-data.js` additiv ergänzt (vier bestehende + vier aus PR #149).
- Diese Bestandsaufnahme beweist **nicht**, dass der dynamisch geladene aktuelle Live-Katalog dieselben Waffen enthält.

| Waffenfamilie | Einträge | Im Snapshot vorhandene Namen | Status |
|---|---:|---|---|
| Anvil | 4 | Anvil I, Anvil II, Anvil III, Anvil IV | I–IV im alten Snapshot |
| Arpeggio | 4 | Arpeggio I, Arpeggio II, Arpeggio III, Arpeggio IV | I–IV im alten Snapshot |
| Bettina | 4 | Bettina I, Bettina II, Bettina III, Bettina IV | I–IV im alten Snapshot |
| Bobcat | 4 | Bobcat I, Bobcat II, Bobcat III, Bobcat IV | I–IV im alten Snapshot |
| Burletta | 4 | Burletta I, Burletta II, Burletta III, Burletta IV | I–IV im alten Snapshot |
| Canto | 4 | Canto I, Canto II, Canto III, Canto IV | I–IV im alten Snapshot |
| Dolabra | 1 | Dolabra | Einzelwaffe im alten Snapshot |
| Equalizer | 1 | Equalizer | Einzelwaffe im alten Snapshot |
| Ferro | 4 | Ferro I, Ferro II, Ferro III, Ferro IV | I–IV im alten Snapshot |
| Hairpin | 4 | Hairpin I, Hairpin II, Hairpin III, Hairpin IV | I–IV im alten Snapshot |
| Il Toro | 4 | Il Toro I, Il Toro II, Il Toro III, Il Toro IV | I–IV im alten Snapshot |
| Jupiter | 1 | Jupiter | Einzelwaffe im alten Snapshot |
| Kettle | 4 | Kettle I, Kettle II, Kettle III, Kettle IV | I–IV im alten Snapshot |
| Osprey | 4 | Osprey I, Osprey II, Osprey III, Osprey IV | I–IV im alten Snapshot |
| Rattler | 4 | Rattler I, Rattler II, Rattler III, Rattler IV | I–IV im alten Snapshot |
| Renegade | 4 | Renegade I, Renegade II, Renegade III, Renegade IV | I–IV im alten Snapshot |
| Stitcher | 4 | Stitcher I, Stitcher II, Stitcher III, Stitcher IV | I–IV im alten Snapshot |
| Tempest | 4 | Tempest I, Tempest II, Tempest III, Tempest IV | I–IV im alten Snapshot |
| Torrente | 4 | Torrente I, Torrente II, Torrente III, Torrente IV | I–IV im alten Snapshot |
| Venator | 4 | Venator I, Venator II, Venator III, Venator IV | I–IV im alten Snapshot |
| Vulcano | 4 | Vulcano I, Vulcano II, Vulcano III, Vulcano IV | I–IV im alten Snapshot |

### Weitere Audit-Lücken
- Aktuelle Upstream-Liste nach Frozen Trail 2.0 konnte noch nicht vollständig gegen den alten Snapshot verglichen werden.
- Für keine Waffenfamilie wird allein aus dem September-Snapshot eine Stufe V abgeleitet.
- Für Bantam und Stiletto liegen I–IV im additiven Katalog vor, jedoch teils nur als ausdrücklich unvollständige Datensätze.
- Für die vollständige Prüfung werden aktuelle API-Daten oder direkte Spielbelege benötigt.

## Sekundärabgleich 13.10.2026: Amplified-Waffen
**Primärquelle:** https://arcraiders.com/news/frozen-trail-is-live (Outpost ermöglicht die fünfte Waffen-Qualitätsstufe), https://arcraiders.com/es/news/frozen-trail-2-0-update (Anvil Splitter als Amplified-Anvil-Upgrade).
**Sekundärquellen:** https://www.getrankd.gg/games/arc-raiders/news/arc-raiders-amplified-weapons und https://arcraidershub.com/guides/amplified-weapons-guide (15 Waffen, nach 2.0-Daten; unabhängig im Spiel zu validieren).

| Modul-Rarität | Waffenfamilien (sekundär) |
|---|---|
| MK I | Hairpin, Kettle, Rattler |
| MK II | Burletta, Il Toro |
| MK III | Anvil, Canto, Osprey, Rascal, Renegade |
| MK IV | Bettina, Hullcracker |
| MK V | Aphelion, Equalizer, Jupiter |

**Wichtig:** MK I–V sind Amplification-Modulklassen nach Seltenheit, keine Stufen VI–X. Die Amplification selbst ist die fünfte Qualitätsstufe. Die Liste enthält 15 Familien; Rascal, Hullcracker und Aphelion waren nicht in der vorliegenden 581er Waffenklassifikation erfasst und müssen mit dem Live-Katalog separat abgeglichen werden. Bantam und Stiletto werden in Sekundärquellen ausdrücklich als noch nicht amplifizierbar geführt. Keine ungeprüften Waffen-IDs oder Rezepte anlegen.
