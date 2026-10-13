# Frozen Trail 2.0 — Daten-Audit / Arbeitsstand 13.10.2026

## Status und Scope
Arbeitsdokument. **Kein vollständiger Item-für-Item-Abgleich durchgeführt.** Keine Änderung an Spieldaten, Nutzerbeständen oder Planung. Basis: main-Commit `be363a1bd108e5896649e11955bf43374248456c`.

### Direkt im Repository geprüft
- `docs/data-review/full-outpost-catalog-20261013.md`: 100 Möbel, 52 verknüpfte Forschungsangebote, zehn neue Materialien; Community-Daten, nicht in-game verifiziert.
- `outpost-catalog.json`: Metadaten verweisen auf Community-Commit `14501fbbccc12b93b019767706f6549ae729c59a`.
- `outpost-catalog.js`: Katalog ausdrücklich **nicht** in Materialplanung integriert.
- `frozen-trail-data.js`: additive, teilweise belegte Daten; ausdrücklich keine bestätigten API-IDs; einige Rezepte/Recycler-Werte fehlen.
- `backup-v1304.js`: Erweiterungs-Identitäten werden in der Backup-Allowlist berücksichtigt.
- `index.html`: Referenz auf aktuelle Anwendungsoberfläche; **kein** vollständiger Basis-Itembestand daraus extrahiert.

### Offizielle und externe Referenzen
- Embark Patchnotes: https://arcraiders.com/news/frozen-trail-2-0-update (08.10.2026)
- Offizielle Änderungen: Anvil Seltenheit Grün → Blau; Snap Hook Reichweite 20 → 18 m, Haltbarkeitsverbrauch 2 % → 4 % je Nutzung, Energiekosten 50 → 60.
- Waffenstufen: Reguläre Stufen I–IV von Amplified-System unterscheiden; fünfte Qualität nicht pauschal für jede Waffe anlegen. Laut Update anfangs 15 unterstützte Amplified-Waffen.
- Community-Quelle: https://github.com/baschny/arcraiders-raider-tools/tree/14501fbbccc12b93b019767706f6549ae729c59a/public/data/game

## Prüfmatrix
| Priorität | Bereich | Offener Punkt | Nächste Verifikation |
|---|---|---|---|
| P0 | Gesamter Itembestand | Basis-IDs, Felder und vorhandene Rezeptdaten noch nicht vollständig inventarisiert | Primäre Datendatei(en) ermitteln und maschinell alle IDs/Felder auslesen |
| P0 | Waffenreihen | Jede bestätigte Reihe vollständig I–IV abgleichen; Amplified getrennt | Vorhandene Datensätze und Screenshots je Stufe zuordnen |
| P0 | Bantam III | Frühere Ingame-Prüfung berichtet; aktuellen main-Datensatz noch nicht gegen Screenshot abgeglichen | Screenshot/PR #139 und aktuelle Daten direkt vergleichen; nicht pauschal als unbekannt einstufen |
| P0 | Anvil | Seltenheit offiziell geändert; Bench I/II Konflikt laut vorherigem Audit | Aktuellen Datensatz + Werkbank-Screenshot prüfen |
| P0 | Snap Hook | Rope vs Steel Cable im Rezept widersprüchlich; offizielle Werte geändert | Ingame-Rezept und aktuelle Werte abgleichen |
| P0 | Assessor Matrix | Powercells 3 vs 4 | Aktuellen Ingame-Beleg suchen |
| P1 | Tether Launcher | Recycling laut Audit widersprüchlich | Ingame-Recyclingbeleg |
| P1 | Neue Materialien | Für zehn neue Materialien sind Rezepte/Recycling/Übersetzungen teils nicht belegt | Felder gegen aktuelle Quellen prüfen |
| P1 | Möbel | 100 Einträge und 52 Forschungslinks im Community-Datensatz; Erwerbswege pro Design offen | Vollständige ID-Zuordnung und Erwerbsweg-Belege |
| P1 | Stiletto | Reguläre Stufen und Werte noch nicht vollständig geprüft | I–IV und mögliche Amplified-Unterstützung einzeln prüfen |
| P2 | Fundorte | Fehlende Erwerbswege und Loot-Orte | Nur belegte Orte übernehmen |
| P2 | Pendola Pass | Positionen/Marker gegen Belege prüfen | Aktuelle Spielscreens mit eigener Karte vergleichen |

## Quellen- und Freigaberegeln
A: aktueller Ingame-Beleg / eindeutige offizielle Angabe.
B: mehrere nachweislich unabhängige aktuelle Quellen.
C: nur eine Community-Quelle / unklare Aktualität.
D: widersprüchliche Quellen.
Abhängige Kopien derselben Datenquelle gelten **nicht** als unabhängige Bestätigung.
Keine erfundenen Felder oder pauschalen Waffenstufen. Keine PvE-Test-/Trials-Inhalte ins Tool. Keine Datenänderungen ohne belegte Korrektur; kein Merge ohne ausdrückliche Freigabe.

## Nächster Schritt
Basis-Itemquelle(n) identifizieren; dann pro Item und Waffenstufe Spalten für `id, name, rarity, type, recipe, upgrade, recycle, salvage, bench, acquisition, localization, provenance` auslesen und gegen Frozen-Trail-Ergänzungen abgleichen. Erst danach quantitative Lückenstatistik veröffentlichen.

## Zusätzlicher Repository-Abgleich (13.10.2026)
- `app.js` lädt den Live-Katalog zuerst über eine externe API und verwendet bei Fehlern `items.json` als Fallback. Ein vollständiger Audit des tatsächlich geladenen Live-Katalogs ist daher **nicht** mit einem Audit der lokalen JSON-Datei gleichzusetzen.
- `items.json` enthält **51 Fallback-Items**. Diese Anzahl beschreibt **nicht** die Gesamtzahl der Waffen oder Items im Live-Tool.
- `goals.json` enthält **8 Zielgruppen**; dies sind Ausbau-/Planungsziele, keine Item-Gesamtmenge.
- `outpost-reference-data.json` enthält **3 exemplarische Waffenrezepte** (Bantam I, Stiletto I, Anvil I), **2 Gadgetrezepte**, **8 Design-Forschungsbeispiele** und **4 Möbel-Herstellungsbeispiele**. Diese Auswahl ist nicht der vollständige Outpost-Katalog.
- Das Anvil-I-Rezept hat dort ausdrücklich `station: null`; die Werkbankstufe wurde bewusst nicht geraten.
- **Bantam III ist in den exemplarischen Waffenrezepten nicht enthalten**. Daraus folgt **nicht**, dass sie im Live-Datenbestand fehlt.
- GitHub-Dateisuche lieferte für die Begriffe `bantam`, `stiletto`, `items.json` keine Treffer. Das ist **kein Negativbeweis**; die Dateien wurden direkt gelesen.

### Technische Grenze für Vollständigkeit
Für einen echten Feld-für-Feld-Audit müssen API-Daten inklusive Pagination zum selben Zeitpunkt abgerufen oder ein eingefrorener Snapshot bereitgestellt werden. Nur die 51 lokalen Fallback-Items zu prüfen würde die Live-Daten unzulässig verkürzen.

### Sofortige nächste Prüfpunkte
1. Externen API-Endpunkt und Pagination aus `app.js` vollständig dokumentieren.
2. Den tatsächlich geladenen API-Katalog (falls erreichbar) als getrennten Snapshot analysieren.
3. Stufen I–IV je Waffenfamilie gegen denselben Datenstand vergleichen; Amplified getrennt.
4. Fehlende Felder und Konflikte in einer maschinenlesbaren Tabelle dokumentieren.

## Verifizierter Pre-Update-Snapshot (13.10.2026 ausgelesen)
**Datei:** Branch `catalog-data`, `items-full-snapshot.json`; Blob SHA `bdfd07f475b2375a3d3f6ff695e745d4364658b1`. `fetch_file` lieferte für die große Datei einen leeren Textkörper; `fetch_blob` lieferte den vollständigen Inhalt (2.399.515 Zeichen). Der GitHub-Blob wurde als JSON geparst.

- Schema `ramas-field-tool-item-snapshot`, Formatversion 1; `generatedAt: 2026-09-24T15:55:47.768Z`; Quelle `RaidTheory/arcraiders-data`; `count: 581`.
- **581 tatsächliche Datensätze, 581 eindeutige IDs, 0 fehlende IDs**; gespeicherte Anzahl stimmt exakt.
- Vollständig belegte Kernfelder im Snapshot: `id`, `name`, `type`, `rarity`, `value` (je 581).
- `description`: 575/581; `weightKg`: 567/581; `stackSize`: 573/581.
- `recyclesInto`: 359/581; `salvagesInto`: 353/581. Das Fehlen eines Felds bedeutet **nicht** automatisch, dass ein Item recyclingfähig sein müsste.
- `repairCost`: 99/581; `repairDurability`: 100/581; `vendors`: 102/581. Nicht für alle Itemtypen anwendbar.
- Der Snapshot enthält `anvil_i` bis `anvil_iv`, aber **keine Bantam- oder Stiletto-IDs**. Beide wurden nach dem Snapshot ergänzt und dürfen daher nicht als fehlende alte Daten klassifiziert werden.
- Die Snapshot-Objekte besitzen keine Top-Level-Felder namens `weight`, `stack`, `recycle` oder `crafting`; tatsächliche Felder sind u. a. `weightKg`, `stackSize`, `recyclesInto`, `salvagesInto`. Audit-Parser muss dieses Schema respektieren.
- **Keine Vollständigkeitsbehauptung für Frozen Trail:** Der Snapshot ist vor dem Update erstellt worden und die aktuellen Mahcks-API-Daten wurden noch nicht als Vergleichssnapshot eingelesen.

### Korrigierte Priorisierung
1. Snapshot als verifizierte Pre-Update-Baseline nutzen; nicht die 51-Item-Fallbackdatei.
2. Neu hinzugefügte Waffen (z. B. Bantam, Stiletto) separat gegen Post-Update-Belege prüfen.
3. Unterschiede zur Live-API nur dann als `hinzugefügt/geändert/entfernt` melden, wenn ein vollständiger Post-Update-Snapshot mit gesichertem Zeitpunkt vorliegt.
