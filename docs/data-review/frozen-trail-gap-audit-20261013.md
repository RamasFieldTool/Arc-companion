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
