# Außenposten: Vergleich der Nutzeraufnahmen vom 16.10.2026

Basis: `2635958150777e8b1b09618bff63b3f48852f407` (main nach PR #156).

27 verschiedene Möbel-Kaufansichten wurden mit dem bestehenden Katalog verglichen. Alle gezeigten Materialarten und Mengen stimmen mit den vorhandenen Rezepten überein. Kein neues Rezept, keine Mengenänderung, keine Änderung an Forschung, IDs, Spielerständen, anderen Sprachen oder UI-Design.

## Übernommene Korrekturen

- 19 belegte deutsche Materialbeschriftungen `Sheet Metal` → `SheetMetal` in den fotografierten Rezepten. Keine globale Ersetzung bei ungeprüften Möbeln oder in der Itemsuche.
- `small_lab_cabinet`: `Kleiner Laborschrank` → `Kleiner Labor-Schrank`. Entwurfsname unverändert, da hierfür kein entsprechender Entwurfs-Tooltip vorliegt.
- Insgesamt 19 betroffene Möbel und 20 reine Beschriftungsänderungen.
- Cache-Kennungen für Katalogabruf und Katalogscript aktualisiert.

## Grenzen der Nachweise

Die Originalfotos sind unten verlinkt; SHA-256 und Zuordnung stehen im separaten JSON-Ledger. Aufnahmedatum, Spielversion und Plattform sind nicht belegt. Eingangsdatum wird nicht als Aufnahmedatum ausgegeben. VERIFIZIERT gilt nur für die sichtbaren Namen und Ressourcen der jeweiligen Ansicht, nicht für vollständige Datensätze oder die neueste Spielversion.

Hotelstuhl: schärfere Aufnahme bestätigt 15 Bretter und 5 strapazierfähige Stoffstücke. Die frühere Chat-Vermutung von 6 war falsch; der Repositorywert war bereits korrekt. Arbeitszimmersessel: 25 Bretter und 3 ultragemütliche Kissen unterstützen `study_armchair`; zweite Sesselidentität und englischer Study/Sturdy-Konflikt bleiben offen. Keine Forschung oder Seltenheit aus dem Bild abgeleitet.

Doppelt eingesendete Aufnahmen werden nicht als unabhängige Zweitbelege gezählt. Die ursprünglichen 400 Auditzeilen und deren Prüfsummen bleiben unverändert. Der Regressionstest rekonstruiert den historischen Katalog durch Rücknahme ausschließlich der dokumentierten deutschen Beschriftungsänderungen und prüft weiterhin dessen ursprüngliche SHA-256. Jede andere Katalogänderung lässt die Prüfung fehlschlagen.

## Einzelvergleich

| ID | Spielname | Ressourcenbedarf (vorhandene Mengen bestätigt) | Originalfoto |
|---|---|---|---|
| `study_tv_stand` | Arbeitszimmer-Fernsehständer | 10 Sheet Metal; 2 Rubber Parts | [Foto](evidence/outpost-20261016/study_tv_stand.jpg) |
| `chambers_nightstand` | Kammer-Nachttisch | 10 Planks; 2 Chemicals | [Foto](evidence/outpost-20261016/chambers_nightstand.jpg) |
| `battered_bureau_chair` | Ramponierter Bürostuhl | 8 Sheet Metal; 4 Fabric | [Foto](evidence/outpost-20261016/battered_bureau_chair.jpg) |
| `battered_diner_chair` | Ramponierter Diner-Stuhl | 5 Sheet Metal; 3 Plastic Parts | [Foto](evidence/outpost-20261016/battered_diner_chair.jpg) |
| `warehouse_chair` | Lagerhausstuhl | 5 Sheet Metal; 5 Plastic Parts | [Foto](evidence/outpost-20261016/warehouse_chair.jpg) |
| `lab_stool` | Laborhocker | 5 Sheet Metal; 3 Plastic Parts | [Foto](evidence/outpost-20261016/lab_stool.jpg) |
| `small_lab_cabinet` | Kleiner Labor-Schrank | 8 Sheet Metal; 4 Rubber Parts | [Foto](evidence/outpost-20261016/small_lab_cabinet.jpg) |
| `hotel_chair` | Hotelstuhl | 15 Planks; 5 Durable Cloth | [Foto](evidence/outpost-20261016/hotel_chair.jpg) |
| `ornate_stash` | Verziertes Lager | 20 Sheet Metal; 3 Ion Sputter | [Foto](evidence/outpost-20261016/ornate_stash.jpg) |
| `draped_debris_b` | Verhüllte Trümmer B | 5 Planks; 5 Fabric | [Foto](evidence/outpost-20261016/draped_debris_b.jpg) |
| `polished_wardrobe` | Polierter Kleiderschrank | 30 Sheet Metal; 5 Plastic Parts | [Foto](evidence/outpost-20261016/polished_wardrobe.jpg) |
| `polished_stash` | Poliertes Lager | 15 Sheet Metal; 1 Flow Controller | [Foto](evidence/outpost-20261016/polished_stash.jpg) |
| `sturdy_aviary_table` | Robuster Volierentisch | 20 Sheet Metal; 1 Radial Press | [Foto](evidence/outpost-20261016/sturdy_aviary_table.jpg) |
| `battered_stash` | Ramponiertes Lager | 10 Sheet Metal; 3 Chemicals | [Foto](evidence/outpost-20261016/battered_stash.jpg) |
| `battered_faculty_table` | Ramponierter Fakultätstisch | 15 Sheet Metal; 5 Plastic Parts | [Foto](evidence/outpost-20261016/battered_faculty_table.jpg) |
| `work_light` | Arbeitslampe | 5 Sheet Metal; 3 Red Light Stick | [Foto](evidence/outpost-20261016/work_light.jpg) |
| `ornate_wardrobe` | Verzierter Kleiderschrank | 50 Planks; 2 Metal Brackets | [Foto](evidence/outpost-20261016/ornate_wardrobe.jpg) |
| `study_armchair` | Arbeitszimmersessel | 25 Planks; 3 Very Comfortable Pillow | [Foto](evidence/outpost-20261016/study_armchair.jpg) |
| `sturdy_stash` | Robustes Lager | 15 Sheet Metal; 3 Voltage Converter | [Foto](evidence/outpost-20261016/sturdy_stash.jpg) |
| `sturdy_wardrobe` | Robuster Kleiderschrank | 8 Sheet Metal; 4 Plastic Parts | [Foto](evidence/outpost-20261016/sturdy_wardrobe.jpg) |
| `polished_weapon_rack` | Polierter Waffenständer | 20 Sheet Metal; 10 Plastic Parts | [Foto](evidence/outpost-20261016/polished_weapon_rack.jpg) |
| `battered_weapon_rack` | Ramponiertes Waffen-Display | 10 Sheet Metal | [Foto](evidence/outpost-20261016/battered_weapon_rack.jpg) |
| `polished_den_shelf` | Poliertes Raider-Regal | 20 Planks | [Foto](evidence/outpost-20261016/polished_den_shelf.jpg) |
| `battered_den_shelf` | Ramponiertes Raider-Regal | 5 Planks | [Foto](evidence/outpost-20261016/battered_den_shelf.jpg) |
| `chambers_shelf` | Kammerregal | 10 Sheet Metal | [Foto](evidence/outpost-20261016/chambers_shelf.jpg) |
| `sturdy_weapon_rack` | Robuster Waffenständer | 10 Sheet Metal | [Foto](evidence/outpost-20261016/sturdy_weapon_rack.jpg) |
| `ornate_den_shelf` | Verziertes Raider-Regal | 25 Planks | [Foto](evidence/outpost-20261016/ornate_den_shelf.jpg) |

Materialschlüssel in dieser internen Vergleichstabelle entsprechen den bestehenden englischen Katalogschlüsseln. Die Fotos belegen die deutschen Beschriftungen.

## Technische Prüfung

Ergebnisse der tatsächlich ausgeführten Prüfungen werden im Pull Request angegeben. Diese Dokumentation behauptet keinen abgeschlossenen Browser-/CI-Lauf oder Merge.

Lokal bestanden: alle acht statischen Quality-Gate-Scripte, JS-Syntax und `git diff --check`. Lokaler Browserstart fehlgeschlagen: Playwright Chromium Headless Shell 1234 fehlt. Browserprüfung bleibt bis zu einem tatsächlich erfolgreichen CI-Lauf offen.
