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

## Fünf-Punkte-Recherche / erneute Prüfung am 13.10.2026

### 1. Aktuelle RaidTheory-Daten
Direkter GitHub-Dateizugriff auf `RaidTheory/arcraiders-data`/`main` gelang für `items/anvil_i.json` bis `anvil_iv.json` und `items/snap_hook.json`. Diese Dateien weisen `updatedAt` im Februar/März 2026 auf und sind für 2.0 **nicht aktuell**. Beispielsweise wird `anvil_i` weiterhin als `Uncommon` geführt, obwohl die offiziellen 2.0-Patchnotes die Anvil-Seltenheit auf Rare anheben. Ein vollständiger aktueller Dateibaum war über die verfügbaren GitHub-Werkzeuge nicht abrufbar. Einzelne 404 für `bantam_i`, `stiletto_i`, `tether_launcher`, `yank_grenade`, `steel_cable` beweisen keine globale Nichtexistenz, nur das Fehlen unter genau diesen Dateipfaden. **RaidTheory/main darf nicht blind als Post-Update-Snapshot verwendet werden.**

### 2. Mahcks-API
API-Endpunkt aus `app.js`: `https://arcdata.mahcks.com/v1/items?full=true&offset=0&limit=45`. Direkter HTTP-Zugriff aus der Arbeitsumgebung war wegen DNS-Auflösung nicht möglich; keine Aussage über den tatsächlichen Livebetrieb. Die App hat bereits einen mehrstufigen Fallback in `catalog-resilience-v2120.js` (Mahcks -> verifizierter 581er GitHub-Snapshot -> RaidTheory -> 51 lokale Items). Der 581er Snapshot ist ein **September-Stand**, kein 2.0-Abbild. **Keine automatischen Korrekturen auf Grundlage der alten API-/GitHub-Daten.**

### 3. Waffenstufen I–IV
Der September-Snapshot enthält `anvil_i` bis `anvil_iv`. Der derzeitige lokale Frozen-Trail-Ergänzungscode nennt `bantam_i`, `bantam_iii`, `stiletto_ii`, `stiletto_iv`, aber keine expliziten Ergänzungen `bantam_ii`, `bantam_iv`, `stiletto_i`, `stiletto_iii`. Dies sind **Lücken im lokalen Ergänzungscode**, nicht automatisch Lücken im gesamten Laufzeitkatalog: die Live-API könnte sie liefern. Die bereits vorhandenen Angaben zu Bantam III basieren auf einem Spielscreen und sollten ohne gesicherte Item-IDs nicht in Recycling-Referenzen umgewandelt werden. Der fünfte Amplified-Qualitätsgrad ist **nicht** pauschal als reguläre Stufe V aller Waffen zu behandeln.

### 4. Materialien / Recycling
Snapshot: `recyclesInto` bei 359/581, `salvagesInto` bei 353/581. Bei neuen Frozen-Trail-Materialien sind mehrere Recycling- und Rezeptangaben ausdrücklich noch unbestätigt; fehlende Angaben bleiben `unbekannt`, nicht `0`. Beispiel: `snap_hook` in altem RaidTheory/main enthält noch alte `recyclesInto`-Referenzen und `updatedAt` vom Februar. Offizielle Patchnotes sind für Gameplay-Änderungen höher zu gewichten als alte Community-JSON-Dateien.

### 5. Außenposten
`outpost-catalog.json` auf main enthält 100 Möbel, 100 eindeutige IDs, 14 Möbelkategorien, für alle 100 `design` und `craft`, für 52 einen `research`-Eintrag und für 48 `research:null`. **Null ist kein Beweis, dass kein Forschungsschritt existiert.** Der Katalog trägt selbst `status: community-generated-data-not-in-game-verified`. Die neue strukturelle Prüfroutine `tools/audit_outpost_catalog.py` prüft IDs, fünf Übersetzungssprachen, Rezeptmengen und Forschungsstruktur; eine erfolgreiche Prüfung würde nur die Datenstruktur, nicht die Spielrichtigkeit belegen.

### Neue offizielle Belege
- https://arcraiders.com/news/frozen-trail-2-0-update (08.10.2026): neue Waffen Bantam/Stiletto, neue Werkzeuge, 100 Designs, Amplified, Anvil-Balance.
- https://arcraiders.com/news/collector-set-dlc (08.10.2026): exklusives Retro Sofa, Banjo-Blueprint im Collector DLC.
- https://arcraiders.wiki/wiki/Update:2.0 (sekundäre Wiedergabe offizieller Patchnotes).

### Ergebnis und nächster Datenengpass
**Kein vollständiger Post-Update-Katalog beschafft.** Deshalb gibt es weiterhin keine belastbare Gesamtzahl neu hinzugefügter/geänderter Itemdatensätze. Die fünf Arbeitspunkte wurden anhand erreichbarer Quellen geprüft, aber der eigentliche Vollabgleich ist blockiert. Vor einem Merge: aktuelles vollständiges API-Export oder eine belegte neue Version des RaidTheory-Datensatzes beschaffen, Diff-Tool ausführen, kritische Felder gegen Primärquellen prüfen, dann UI-/Regressionstests. Weder main noch Nutzerspeicher wurden verändert.

## 13.10.2026 – Live-Katalog-Export erneut versucht
- Direkter Abruf `https://arcdata.mahcks.com/v1/items?full=true&offset=0&limit=45` aus der Arbeitsumgebung erneut versucht; Fehler: DNS-Auflösung für `arcdata.mahcks.com` nicht möglich. Das ist **kein** Beweis, dass die API für Nutzer ausgefallen ist.
- Auch direkter Zugriff auf `api.github.com` und `github.com` aus der Container-Umgebung war durch DNS blockiert. GitHub-Connector liefert einzelne Repository-Dateien, aber keine komplette externe Live-API-Antwort.
- `tools/export_mahcks_catalog.py` hinzugefügt: Nur-Lese-Export mit strenger Prüfung aller Seiten, eindeutiger IDs, konsistenter `total`-Zahl und Abbruch bei unvollständigen Ergebnissen. Erst nach erfolgreichem vollständigem Export wird die Ausgabedatei geschrieben. **Hier noch nicht erfolgreich ausgeführt**, da Netzwerk-DNS blockiert.
- Anschlussbefehl bei verfügbarem Netzwerk: `python3 tools/export_mahcks_catalog.py current-items.json && python3 tools/audit_frozen_trail_catalog.py old-items.json current-items.json > diff.json`. `old-items.json` muss vorher die unveränderte verifizierte September-Snapshotdatei sein.
- Weder `main` noch Item-IDs, Spielerinventar oder UI wurden verändert.
