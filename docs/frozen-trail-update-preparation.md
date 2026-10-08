# Frozen Trail – Vorbereitung des größeren Tool-Patches

Stand: 08.10.2026, morgens (Europe/Zurich). Auftrag: ausschließlich Punkt 1 – bestätigte Inhalte sammeln und betroffene Tool-Bereiche bestimmen. Keine Spieldaten-/App-Änderung, keine Veröffentlichung, kein Merge. PR #111 gehört nicht dazu.

## Prüfbasis und Grenzen

Remote-main vor Beginn selbst geprüft und als separate Arbeitskopie gelesen: `25816084d95f4bf379914420e6765ab7c78c437d`. Vorbereitungsbranch: `prep/frozen-trail-update`. Der aktuelle main enthält auch den Merge von PR #129; es wurde nicht mit dem alten #128-Arbeitsstand weitergeplant.

Die folgenden offiziellen Seiten wurden selbst geöffnet/gelesen. VERIFIZIERT bedeutet hier: von Embark in der gelesenen Quelle angekündigt. Es bedeutet nicht, dass die Release-Version bereits im Spiel oder in unseren Datenfeeds getestet wurde.

| Kürzel | Primärquelle | Datum |
|---|---|---|
| S1 | https://arcraiders.com/news/frozen-trail-content-preview | 23.09.2026 |
| S2 | https://arcraiders.com/news/frozen-trail-reward-pass | 28.09.2026 |
| S3 | https://arcraiders.com/news/live-update-1-45-0 | 08.09.2026 |
| S4 | https://arcraiders.com/news/pve-toggle-beta-test | 24.09.2026 |
| S5 | https://arcraiders.com/news/tag/patch-notes | Abruf am 08.10.2026 |

In der abgerufenen offiziellen Patchnotes-Übersicht S5 wurden noch keine vollständigen Frozen-Trail-Release-Patchnotes gefunden. Keine Aussage, dass solche Notes nirgendwo veröffentlicht sind. Der Artikel auf der deutschen S1-URL enthält ebenfalls englischen Inhalt; offizielle deutsche Namen sind dadurch nicht bestätigt.

## Bestätigte Inhaltsliste – noch keine Importdatensätze

| Inhalt | Bestätigte Information | Quelle |
|---|---|---|
| Pendola Pass | Neue Karte | S1 |
| Frigate | Neues großes Begegnungsszenario | S1 |
| Bully, Skulker, Hydra | Neue ARC-Gegner | S1 |
| Stiletto | Neue Waffe; leichte Munition | S1 |
| Bantam | Neue Waffe; schwere Munition | S1 |
| Grappling Hook, Tether Launcher, Yank Grenade | Neue Gadgets | S1 |
| Camera, Harmonica, Banjo | Neue Items | S1 |
| Outpost / Research Workstation | Neuer Fortschrittsbereich | S1 |
| Amplified Weapons | Fünfte Qualitätsstufe für zunächst 15 Waffen | S1 |
| Questlinien / Skill Tree / Map Condition | Neuerungen angekündigt; Details offen | S1 |
| Banjo-Bauplan | Collector Set DLC als Erwerbsweg | S2 |
| Reward Pass / Legacy Pass | Neuer Fortschritts- und Belohnungsweg | S2 |
| Cred | Einstellung und Verfall mit Frozen Trail angekündigt | S3 |
| PvE-Toggle | Zeitlich begrenzter Test 13.–20.10.2026 | S4 |

Kälteereignisse werden beschrieben, aber ein kanonischer Name und vollständige Regeln der neuen Map Condition sind in diesem Bericht nicht bestätigt. Frigate nicht ohne Release-Daten einem bestimmten Event-Schema-Typ zuordnen. Schreibweise Grappling Hook im Titel und Grapple Hook im Fließtext von S1 unterschiedlich: tatsächliche Katalog-ID und Spielname bleiben zu prüfen.

## Tatsächlich gelesene Datenwege im aktuellen Tool

| Bereich | Aktueller Weg / Dateien | Bedeutung für den Patch |
|---|---|---|
| Items | `app.js`: Mahcks-Paginierung. `catalog-resilience-v2120.js`: Snapshot im Branch `catalog-data`, RaidTheory-Itemindex und `items.json` als Ersatzwege | Hauptquelle und Ersatzwege gemeinsam auf neue/entfernte/geänderte IDs und Werte prüfen; nicht nur lokale Datei erweitern |
| Lokale Minimaldaten | `items.json`: 51 Einträge selbst gezählt | Kein vollständiger Spielkatalog. Nicht mit der Größe des Remote-Snapshots gleichsetzen |
| Werkstatt | `goals.json`: 8 Ziele selbst gezählt; aktive Stufen fließen in `planning-core.js` ein | Kosten und Voraussetzungen prüfen; Research/Outpost nicht ohne belegte Daten als gewöhnliche Werkbankstufe modellieren |
| Quests | `app.js`: RaidTheory-Questverzeichnis und Einzeldaten; `quests-v2115.js` für Darstellung | Neue IDs, Anforderungen, bereitgestellte Items und Belohnungen prüfen; Fortschritt alter IDs erhalten |
| Blueprints | `blueprints.json`: 83 Einträge; `blueprint-acquisition-v2130.json`: feste Erwerbsfelder plus `_meta` | Erwerbsmodell später allgemein erweitern; kein Shani-Sonderfeld improvisieren |
| Karte | `maps.json`: 7 Karten-/Etagen-Einträge selbst gezählt; Kartenbasis und Marker separate Assets/Daten | Pendola Pass als Kartenprojekt vormerken; keine Koordinaten oder Kartenbasis aus Trailern ableiten |
| Events | `live-events-v1305.js`: zuerst Branch `live-events-data`, lokale Datei als Fallback | Feed-Regeln und neue Condition-/Kartennamen nach Release prüfen; lokaler Fallback ist kein aktueller Live-Nachweis |
| Nutzerfortschritt | `planning-core.js`, `backup-v1304.js`: persönliche Ziele, Bestand, aktive Ziele, Queststatus, gelernte Blueprints und Historie | Neue Inhalte dürfen keine bestehenden IDs, Bestände oder Fortschritte pauschal zurücksetzen |

Die Zahl 15 aus S1 bezeichnet angekündigte Waffen im neuen System, keine selbst geprüfte vollständige Waffenliste. Kein aktueller Remote-Katalog, Questfeed oder Eventfeed wurde in diesem Vorbereitungsschritt auf Frozen-Trail-Vollständigkeit getestet.

## Arbeitsliste für den späteren gemeinsamen Patch

Prioritäten sind eine technische Empfehlung, keine bestätigte Spielinformation.

| Priorität | Arbeitspaket | Betroffene Dateien / Komponenten | Freigabekriterium für Umsetzung |
|---|---|---|---|
| P1 | Release-Diff der Datenquellen | Mahcks, RaidTheory, `catalog-data`, `items.json`, Katalog-Lader | Verfügbare Release-Daten, stabile IDs, Herkunft und Stand dokumentiert; Unterschiede vollständig erklärt |
| P1 | Werkstatt-/Research-/Outpost-Bedarf | `goals.json`, `planning-core.js`, `planning-ui.js`, Werkstattdarstellung | Exakte Materialien, Mengen, Stufen und Voraussetzungen; entscheiden, welche Kosten in unsere Planung gehören |
| P1 | Neue/überarbeitete Quests | Quest-Lader, Questdarstellung, Planung | Vollständige Anforderungen/Belohnungen und ID-Abgleich; bestehende Queststände erhalten |
| P1 | Blueprint-Erwerbswege | beide Blueprint-Dateien, `blueprints-v2130.js` | Allgemeines Modell wie `sources[]` entwerfen; Research, Pass, DLC, Trader usw. nur je konkret belegtem Blueprint erfassen |
| P2 | Waffenstufe V und Modding | Itemdarstellung, Bedarf-/Recyclingdaten, mögliche Planungsziele | Vollständige betroffene Waffenliste, Varianten, Kosten und Voraussetzungen; keine erfundenen Statistikwerte |
| P2 | Neue Items und Recycling | Katalog, Suche, Itembilder, persönliche Ziele | Gewichte, Werte, Stackgrößen, Rezepte und Recycling belegbar; Bilder nur aus gültigen Metadaten |
| P2 | Karte / Frigate / Conditions | `maps.json`, Kartenassets, Eventanzeige, Fundorte | Verlässliche Kartenbasis, Nutzungsrechte und geprüfte Marker; neue Condition-Regeln eindeutig |
| P2 | Cred-/Reward-Pass-Hinweise | Hilfe, Tipps, Quellhinweise; gegebenenfalls neues Fortschrittsmodell | Tatsächliche Release-Regeln und konkrete Belohnungswege; kein kompletter Pass-Tracker ohne separate Scope-Entscheidung |
| P3 | Gegner- und PvE-Hinweise | Tipps, Fundort-/Condition-Hinweise | Qualitative Regeln mit Quellen; keine erfundenen Loot-/Schadens-/Spawnwerte; Testzeitraum korrekt darstellen |
| Querliegend | Übersetzungen / Datenerhalt / Cache | i18n, Backup, Planung, Index/Asset-Versionen | DE/EN/FR/ES/IT; Eigennamen nicht künstlich übersetzen; alte Backups/IDs erhalten; passende Gesamttests vor Merge |

## Fehlende Informationen – ausdrücklich offen

- Release-Patchnotes und vollständige aktualisierte Katalog-/Quest-/Eventdaten.
- Rezepte, Materialmengen, Research-Kosten und neue Werkstatt-/Outpost-Voraussetzungen.
- Vollständige Waffen-V-Liste und Varianten-/Statistik-/Recyclingänderungen.
- Konkrete Blueprint-Quellen und Traderangebote nach Cred-Umstellung.
- Offizielle Sprachlabels und tatsächliche neue Katalog-IDs.
- Pendola-Pass-Kartenbasis, Marker, Spawns, Container-/Fundortregeln und deren Nutzungsrechte.
- Ob neue Progressionssysteme eine Datenmigration erfordern; keine pauschale Migration vor dem Abgleich.

## Abschluss dieses Vorbereitungsschritts

VERIFIZIERT: Quellenlektüre, Remote-main, gelesene Datenwege und die genannten lokalen Dateizählungen. TEILWEISE VERIFIZIERT: angekündigte Inhalte, nicht deren fertige Release-Ausprägung. OFFEN: Release-Daten und spätere Umsetzung. Keine Browser-/Spiel-/Quality-Gate-Tests ausgeführt oder als bestanden behauptet. Nur dieser Bericht wurde neu angelegt; Runtime, Spieldaten, Karten, Nutzerspeicher und Backups wurden nicht geändert. Kein Merge freigegeben oder ausgeführt.
