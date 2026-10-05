# Testerfeedback – Bestandsaufnahme und Quellenprüfung

Stand der Prüfung: 5. Oktober 2026. Ausgangs-main: `c8d666f4819dcfe7ef42e3994a5e6c6c51595425`.
Keine Änderungen an main und kein Merge autorisiert oder durchgeführt.

## Tatsächlich ermittelte Dateien

| Bereich | Dateien |
| --- | --- |
| Werkstatt / Materialbedarf | `goals.json`, `app.js`, `active-goals-v2112.js`, `ux-v1300.js`, `planning-core.js`, `planning-ui.js`, `goal-completion.js` |
| Sprachen / externe Werte | `i18n-v13017.js`, `italian-language.js`, `italian-selector-fix.js`, `search-language-fix.js`, `item-find-locations.js`, `blueprints-v2130.js`, `live-events-v1305.js`, `raider-spawns-v298.js` |
| Hilfe / Navigation | `onboarding-v297.js`, `onboarding-v297.css`, `index.html`, `status-v1300.js` |
| Themes / Header | `palette-v2139.css`, `palette-v2139.js`, `style.css`, `light-lock-v2138.css`, Inline-Stile in `index.html`, `planning.css` |
| Itemkarten / Recycling | `app.js`, `search-language-fix.js`, `items.json`, `catalog-resilience-v2120.js` |
| Raumhafen / Marker | `assets/maps/spaceport-approved-base.jpg`, `spaceport-fresh-v2.json`, `spaceport-v2.js`, `spaceport-map-image-fix.js`, `spaceport-major-arcs.json`, `spaceport-major-arcs.js`, `maps-v2116.js` |
| Quellen / Anbindungen | `maps.json`, `blueprint-acquisition-v2130.json`, `docs/item-find-locations-attribution.md`, `scripts/check-external-data.mjs`, `.github/workflows/catalog-snapshot.yml`, `.github/workflows/sync-live-events.yml` |

Der vollständige Git-Baum enthielt keine `AGENTS.md` und keine `package.json`. Die vorhandenen Prüfkommandos stehen in `.github/workflows/quality-gate.yml`. Der GitHub-Zugriff meldete pull/push-Rechte; direkte GitHub-Leseoperationen und Branch-/Commit-/PR-Erstellungen waren erfolgreich. Der Workspace-Git-Server verweigerte die Anmeldung; das ist kein fehlender GitHub-Schreibzugriff.

## Ausgangsprüfungen – vor Änderungen

Bestanden: `data-integrity`, `planning-core`, `item-find-locations`; außerdem die Browser-Skripte `quality-gate`, `item-find-locations-browser`, `logo-home`, `free-raid-progress`, `planning-usability`, `summary-owned-stepper`, `i18n-smoke`, `italian-language`, `raider-stories`.

Gescheitert: `raider-radio`, `user-data-safety`, `ui-regression`. Diese Gesamtläufe scheiterten an `net::ERR_EMPTY_RESPONSE` beim externen Laden. Die einzelnen Backup-, Import-, Migration- und Datenerhalt-Assertions im Backup-Lauf waren vorher erfolgreich; daraus wird ausdrücklich kein bestandener Gesamtlauf abgeleitet. Diese Fehler traten bereits auf main auf.

Chromium war zunächst nicht installiert. Der erste CDN-Download lieferte ein ungültiges ZIP; der offizielle Alternativserver funktionierte. Der zusätzliche agent-browser-CLI-Versuch scheiterte am Daemonstart. Die Browserprüfungen wurden mit den bestehenden Playwright-Skripten durchgeführt.

Der lokale Arbeitsbereich wurde später während der Sitzung geleert. Branches und PRs waren bereits auf GitHub gespeichert; lokale Logs und Screenshots mussten neu erstellt werden. Frühere Ergebnisse sind von den anschließend wiederholten finalen Prüfungen zu unterscheiden.

## Verwendete Datenquellen

| Quelle | Tatsächlich geprüft | Nicht daraus ableitbar |
| --- | --- | --- |
| [Mahcks Items API](https://arcdata.mahcks.com/v1/items?full=true&offset=0&limit=1) | Bestehendes Health-Skript erfolgreich; Antwort mit Itemliste und Gesamtangabe 581 | Vollständiger Katalog in diesem Health-Lauf, heutige Spielrichtigkeit jeder Angabe |
| [RaidTheory Itemindex](https://api.github.com/repos/RaidTheory/arcraiders-data/contents/items?ref=main) | Health-Skript erfolgreich; 581 Dateien | Jede Datei inhaltlich geprüft oder unabhängig bestätigt |
| [RaidTheory Questindex](https://api.github.com/repos/RaidTheory/arcraiders-data/contents/quests?ref=main) | Health-Skript erfolgreich; 100 Dateien | Alle Questanforderungen aktuell |
| [Offizieller Ereignisfeed](https://arcraiders.com/external-api/map-conditions) | Health-Skript erfolgreich; 163 Bedingungen | Jede Bedingung / regionale Zeit einzeln im Spiel bestätigt |
| [Ramas Katalog-Snapshot](https://github.com/RamasFieldTool/Arc-companion/blob/catalog-data/items-full-snapshot.json) | Git-Blob `bdfd07f475b2375a3d3f6ff695e745d4364658b1` gelesen: 581 Items, erzeugt 2026-09-24T15:55:47.768Z, Quelle RaidTheory, sourceRef main | Heutiger Spielstand; reproduzierbarer Upstream-Commit fehlt im Snapshot-Metadatum |
| [RaidTheory / ARC Tracker](https://github.com/RaidTheory/arcraiders-data) | README gelesen: MIT für das Projekt; Spielinhalte bleiben Embark zugeordnet; Bilder sind aus Spiel-Screenshots hochskalierte Assets | MIT allein ist keine geklärte Erlaubnis für Embark-Bildmaterial |
| Fundort-ARC-Tabelle | Die App verwendet `RaidTheory/arcraiders-data@2a4abebb2486a633070f4e260058bcd5ad4511d6/bots.json` mit zwei eingebauten Rückfall-ARC-Einträgen | Aktuelle Drops und Karten jedes ARC nicht unabhängig bestätigt |
| Baupläne | `blueprint-acquisition-v2130.json` nennt die [Wiki-Rezeptseite](https://arcraiders.wiki/wiki/Recipes), Stand 2026-09-16 | Die stärkeren BESTÄTIGT-Felder besitzen im Repository keine einzeln gespeicherten unabhängigen Beleglinks; aktuelle Verifikation offen |
| Lokale Ereignisdatei | `live-events.json` enthält syncedAt 2026-09-19 und historische Termine | Kein aktueller Ersatz für den Remote-Feed; vorhandene Veraltet-Warnung bleibt erforderlich |

### Kartenquellen: Erreichbarkeit ist keine Inhaltsprüfung

Ein zusätzlicher Node-HTTP-Headerlauf lieferte HTTP 200 für das eigene Repository, `Pwingles/arc-raiders-map` und die beiden `arc-raiders.org`-Kartenseiten für Damm und Blue Gate. Bei folgenden in `maps.json` gespeicherten Links lief die Abfrage nach zwölf Sekunden in ein Timeout: Wiki Damm/Blue Gate/Stella Montis/Riven Tides; Wand Damm/Blue Gate/Stella Montis Upper/Stella Montis Lower/Riven Tides; `arcraidersmap.online` Blue Gate. Ein Timeout beweist nicht, dass eine Quelle allgemein nicht erreichbar ist. Der Webabruf der Wiki-Spaceport-Seite war separat erfolgreich.

Weitere Quellen in den kartenspezifischen JSON-Dateien: `arcraiders.co`, `arcraidershub.com`, `arcraidersai.com`, Wiki-Dateiweiterleitungen und zusätzliche Wand-Kartenseiten. Deren Einzelinhalte und Nutzungsrechte sind nicht verifiziert. Koordinaten aus dem Pwingles/MapGenie-Datensatz sind Community-Kandidaten; ihre Passung zu einer anderen Kartenbasis ist nicht durch Normierung allein bestätigt.

### Beobachtete Übersetzungsstruktur und Widersprüche

Der geprüfte 581-Item-Snapshot enthält Namen für DE/EN/FR/ES/IT. Fehlende Beschreibungen in DE/FR/ES/IT: `assessor_matrix`, `dodgers_note`, `official_shutdown_documentation`, `precision_gimbal`, `scout_patrol_note`, `secret_meeting_info`, `turbine_compressor`, `vaporizer_regulator`. Auch Englisch fehlt bei diesen IDs außer `turbine_compressor`. Fehlende Texte werden nicht erfunden.

Beobachtete Fundortkategorien: ARC, Electrical, Mechanical, Nature, Residential, Medical, Technological, Commercial, Old World, Security, Exodus, Industrial, Raider. PR #115 übersetzt diese bekannten Anzeige-Kategorien. Die Übersetzungen sind redaktionell; eine offizielle Spielterminologieprüfung wurde damit nicht durchgeführt.

Im Snapshot widersprechen sich die Beschreibungen von `wolfpack_blueprint` sprachlich: Deutsch beschreibt eine Granate mit aufteilenden Suchraketen, Englisch eine ferngezündete haftende Granate. Die sprachliche Abweichung ist festgestellt; welche Beschreibung spielinhaltlich korrekt ist, wurde nicht unabhängig bestätigt. Keine unbelegte Korrektur übernommen.

Offene Originalbegriffe in Bauplanangaben: Locked Gate, Close Scrutiny, Harvester, First Wave Cache, ARC Assessor, ARC Surveyor, Trophy only sowie Questnamen ohne bestätigte Sprachzuordnung. Unbekannte Werte bleiben unverändert. `RFTDataLabels.untranslated()` listet zur Laufzeit fehlende Zuordnungen; dies ist keine automatische Übersetzungsquelle.

## Bilder und Raumhafen: offene Abnahme

Itemdatensätze enthalten stabile IDs und `imageFilename`-URLs, beispielsweise auf `cdn.arctracker.io/items/v2/`. Der Quellzusammenhang ist festgestellt; eine Erlaubnis zur Nutzung des Spielbildmaterials in diesem Tool wurde nicht verifiziert. Deshalb sind keine neuen Thumbnails eingebaut.

Die vorhandene Raumhafen-JPEG wurde geöffnet: 1536 × 1536, beschriftet unter anderem mit Alberi-Hügel, Raumhafen, Östliche Ebenen und La Chiesa. Das bisherige Review-Dokument nennt eine visuelle Freigabe; das ist keine Bestätigung ihrer Spieltreue oder Bildrechte. Eine verlässliche, zur Veröffentlichung freigegebene Spielreferenz fehlt weiterhin. Eine konkrete geometrische Abweichung wird ohne Referenz nicht erfunden.

Dieses PR korrigiert deshalb die öffentlichen Aussagen: illustrative Kartenbasis, Übereinstimmung und Herkunft/Nutzung noch ungeprüft; Marker weiterhin Entwürfe aus dem dokumentierten Community-Snapshot vom 28.09.2026. Bilddatei und Markerkoordinaten werden nicht ersetzt oder verschoben. Bei einer späteren Basisänderung müssen alle Raider-Spawns, Waffenkisten, Lastenaufzüge, Raider-Luken und großen ARC samt Ereignis-Suchbereichen neu abgeglichen werden.

## PRs und weitere Reihenfolge

1. [#115 – Quellsprachen und bekannte Datenwerte](https://github.com/RamasFieldTool/Arc-companion/pull/115)
2. [#113 – Werkstattmaterialien und Rückmeldung](https://github.com/RamasFieldTool/Arc-companion/pull/113)
3. [#114 – Hilfe und erkennbare Startseiten-Navigation](https://github.com/RamasFieldTool/Arc-companion/pull/114)
4. [#116 – Header und Theme-Nebenfarben](https://github.com/RamasFieldTool/Arc-companion/pull/116)
5. Quellen-/Kartenhinweise in diesem PR; gemeinsame Abnahme nach Zusammenführung.

Mehrere PRs ändern dieselbe lange Asset-Zeile in `index.html`. Die Versionseinträge müssen bei der später autorisierten Zusammenführung gemeinsam erhalten werden; das bloße Übernehmen einer Konfliktseite würde Änderungen verlieren. Der lokale Integrationstest kombiniert ausdrücklich alle Cache-Buster und Dateien. Kein Merge in main erfolgt automatisch.

Weiterhin offen: Bildrechte, originalgetreue Raumhafenbasis und sämtliche Positionsabgleiche; offiziell geprüfte Spielbegriffe; fehlende externe Texte; unabhängige Belege für Bauplan-Einzelangaben; Prüfung jeder externen Datenangabe gegen den aktuellen Spielstand. Ein erfolgreicher UI-Test bestätigt diese Inhalte nicht.
