# Level-5-Waffen: gezielte Nachrecherche vom 17.10.2026

## Ausgangspunkt und Ergebnis

Geprüft wurden der Bestand nach PR 157 (main 522b50092356015cead7367e20638ced76427176), amplified-variants.json, amplified-completeness-audit.md und die beiden Outpost-Audits vom 16.10.2026. Der Bestand umfasst 15 Familien, 45 historische Knoten, 89 API-Konfigurationen und 108 gerichtete Verbindungen. In der Referenzansicht stehen 40 Knoten, 76 Konfigurationen und 84 Verbindungen. Fünf Knoten und zwei Forschungsprojekte bleiben wegen Quellenkonflikten ausgeschlossen.

Der frisch abgerufene ARC-Tracker-Export (generatedAt 2026-10-16T22:23:14.802Z) enthält weiterhin 89 Konfigurationen und 108 Verbindungen. Für alle 108 Verbindungen sind Ziel und Materialmengen unverändert. Keine hinzugefügte oder entfernte Verbindung. Maschinenlesbarer Vergleich: catalog-data/amplified-targeted-research-20261017.json. Dieser Vergleich prüft nicht sämtliche Statistik-, Lokalisierungs- oder Voraussetzungseinträge und beweist keine Spielgültigkeit.

**Keine neuen Materialmengen oder vollständig im aktuellen Spiel verifizierten Waffenbäume gewonnen. Keine Änderungen an Produktdaten oder Freigabestatus.**

## Gezielte Befunde

| Offene Frage | Nachrecherche | Konsequenz |
|---|---|---|
| Osprey/Jupiter: Straight Bolt oder Ergonomic Bolt? | Action Economy bleibt dem Bolt-Zweig zugeordnet; die Benennungsabweichung wird durch weitere Sekundärtexte nicht aufgelöst. | Beide Knoten und Action Economy weiter zurückhalten. |
| Rascal/Hullcracker: Incendiary Rounds oder Incendiary Grenades? | API führt weiterhin Rounds-IDs; Wiki und der Guide vom 15.10. verwenden Grenades. Auch API-Deutsch „Brandgeschosse“ löst den Konflikt mit „Brandgranaten“ nicht. | Drei betroffene Knoten sowie Compact Combustion Charges nicht automatisch freigeben. API-Übersetzung ist kein Nachweis deutscher Spieltexte. |
| Equalizer: existiert Anti Shield? | Die ausführliche Wiki-Seite Amplified Weapons nennt wie ARC Tracker nur Ramping Damage, Anti Weak Point und Bigger Magazine. Die ältere allgemeine Amplification-Seite nennt zusätzlich Anti Shield. Shield Stress Testing ist bei ARC Tracker Kettle zugeordnet. | Konflikt enger eingegrenzt, aber Abwesenheit in Quellen beweist keine Nichtexistenz im Spiel. Historischen Eintrag behalten. |
| Früher nicht lesbare Rascal-Seiten | Die Seiten rascal_amplified_incendiary_rounds und rascal_amplified_sprint_shooting_incendiary_rounds waren nun lesbar. Die beiden High-Velocity/Incendiary-Kombinationsseiten blieben im Webabruf nicht lesbar. Alle vier Datensätze stehen im frischen API-Export. | Abrufstatus verbessert; keine neuen Kosten, keine unabhängige Spielbestätigung. |
| Hairpin Semi-Auto: alte Schadensbelege aktuell? | Offizieller Patch 2.1 vom 13.10. korrigiert den zuvor nicht angewandten Kopfschadensabzug. | Vorherige Messungen müssen nach Build getrennt werden. Patch nennt keinen Prozentwert. |
| Wie fehlende Pfade gezielt belegen? | Derselbe Patch bestätigt die Hervorhebung des Pfades zum fokussierten Upgrade, sofern nicht blockiert. | Bei neuen Aufnahmen Ziel fokussieren, gesamten Pfad und blockierte Zustände gesondert erfassen. |

## Qualität der neu untersuchten Quellen

- Die ausführliche Wiki-Seite ist eine zusätzliche Vergleichsquelle, kein vollständiger unabhängiger Spielnachweis. Sie widerspricht sich selbst beim Aphelion: Ein allgemeines Beispiel kehrt die Voraussetzung zwischen Charged Burst und Increased Burst gegenüber dem Waffenabschnitt um. Deshalb keine pauschale Übernahme ihrer Voraussetzungen.
- Dort genannte Konflikte mit normalen Aufsatzplätzen sind eine zusätzliche Prüflücke, etwa Stock Mod beim Osprey-Bolt und Magazine Mod bei Kettle X-Rounds bzw. Renegade Scoped. Diese Angaben zunächst als Kandidaten behandeln und mit sichtbaren Aufsatzplätzen im Spiel prüfen.
- Die Wiki-Forschungsseite bestätigt textlich Action Economy (1.000 Hairpin-Schaden in einem Raid; 8 Sentinel Firing Cores; 5.000 Punkte) und Compact Combustion Charges (3.000 Blaze-Grenaden-Schaden; 5 Bombardier Cells; 5.000 Punkte). Diese Werte waren bereits dokumentiert und sind nicht neu. „Step 1/2“ sind Reiter und keine Originalaufnahmen.
- Die offizielle Korrektur von Mobile-Fire Grip Fittings auf Skulker Targeters war bereits integriert; nicht erneut als neue Entdeckung zählen.

## Originalvideo-Kandidaten und technische Grenzen

1. Nafburger: How to Research 'Action Economy' in ARC Raiders, https://www.youtube.com/watch?v=fIpkNDzdDA8 (Metadaten: 13.10.2026, 313 Sekunden).
2. Quick Tips: How To Add Flame Rounds To Hullcracker And Rascal in Arc Raiders, https://www.youtube.com/watch?v=u1Zb_Mn-wag (Metadaten: 14.10.2026, 109 Sekunden). Der Guide verweist auf ca. 34 s, 57 s und 87 s.

Watch-Seiten und Player-Metadaten waren abrufbar. Es konnte kein lesbares Originalbild aus diesen Videos geprüft werden. Bildabrufe des Guides bzw. Hubs lieferten HTTP 403; Storyboardabrufe lieferten keine verwertbaren Bilddaten. Titel, Zeitmarken, Alt-Texte und Metadaten werden ausdrücklich nicht als visuell verifizierte Spielbelege gewertet.

## Nächste Belege mit höchstem Nutzen

1. Deutsche, datierte Spielaufnahmen des vollständigen Osprey- und Jupiter-Bolt-Tooltips inklusive Pfad, Forschung, Kosten und Aufsatzkonflikt.
2. Entsprechende Aufnahmen der Brand-Zweige bei Rascal und Hullcracker; Rascal zusätzlich alle vier Kombinationen mit High Velocity/Sprint Shooting.
3. Vollständiger Equalizer-Baum samt gesperrten Knoten und Forschungszuordnung; ein einzelner ausgewählter Knoten reicht zur Ausschlussprüfung nicht.
4. Action Economy und Compact Combustion Charges jeweils beide Forschungsreiter mit Aufgabe, Mengen, Punkten und Belohnung.
5. Aktueller Hairpin-Semi-Auto-Tooltip sowie Messung des Kopfschadens erst ab Patch 2.1; Zahlen aus älteren Videos getrennt führen.

## Quellen

- Offizieller Patch: https://arcraiders.com/news/store-update-2-1-0
- Frischer Export: https://arctracker.io/api/items
- Equalizer: https://arctracker.io/items/equalizer_amplified
- Schildforschung: https://arctracker.io/research/shield-stress-testing
- Ausführliches Wiki: https://arcraiders.wiki/w/index.php?oldid=43256&title=Amplified_Weapons
- Allgemeines Wiki zum Vergleich: https://arcraiders.wiki/w/index.php?oldid=42390&title=Amplification
- Forschung: https://arcraiders.wiki/wiki/Amplified_Research
- Brand-Guide: https://allthings.how/arc-raiders-how-to-unlock-incendiary-grenades-on-the-hullcracker-and-rascal/
- Wieder lesbar: https://arctracker.io/items/rascal_amplified_incendiary_rounds
- Wieder lesbar: https://arctracker.io/items/rascal_amplified_sprint_shooting_incendiary_rounds

Prüfung: Vergleich aller 108 archivierten gerichteten Kanten und ihrer Kosten gegen den neuen Export; JSON-Validierung und git diff --check. Kein Laufzeittest erforderlich, da ausschließlich Forschungsdokumentation ergänzt wurde.

## Priorisierte Videosichtung – technischer Abschluss

Erneute Prüfung auf ausdrücklichen Auftrag vom 17.10.2026. Remote-main unverändert auf 522b50092356015cead7367e20638ced76427176. Arbeitsbranch research/amplified-gaps-20261017; Ausgangscommit c6aadba war nur lokal vorhanden. Die GitHub-Abfrage nach einem PR für diesen Branch ergab keinen Treffer.

| Video | Tatsächlich durchgeführte Sichtung | Ergebnis |
|---|---|---|
| fIpkNDzdDA8 / Action Economy | YouTube-Seite im Browser geöffnet, Wiedergabe betätigt, auf 00:05 gesprungen; sichtbaren Player geprüft. | Seite, Titel, Kapitel „What is Required“ und Dauer 05:13 sichtbar. Player zeigt Schwarzbild/Ladeanimation, keinen lesbaren Spielframe. |
| u1Zb_Mn-wag / Rascal/Hullcracker | YouTube direkt bei 01:27 geöffnet, Playerstatus und sichtbares Bild geprüft. | Dauer 01:49 und Position 01:27 sichtbar. Schwarzbild/Ladeanimation, kein lesbarer Spielframe. |

Zusätzlich wurde yt-dlp 2026.8.19 aus dem Python-Paketverzeichnis isoliert unter /tmp installiert. Die Extraktion lieferte Formatlisten. Sie meldete einen fehlenden unterstützten JavaScript-Runtime sowie eine ungültige m3u-Antwort. Die angeforderten 360p-Medienabrufe für beide Videos schrieben jeweils lediglich eine 195-Byte-HTML-Seite „Site Unavailable“ statt eines MP4. Die früheren vermeintlichen Storyboard-JPGs enthalten ebenfalls genau diese HTML-Fehlerseite. Ein erfolgreicher HTTP-/Downloadstatus ist hier ausdrücklich kein erfolgreicher Bildabruf.

**Status: Videosichtung technisch fehlgeschlagen; keine visuelle Spielprüfung.** Die Website-Oberfläche wurde gesehen, die Spielinformationen selbst nicht. Keine Behauptung, die Videos enthielten keine Belege: Ihr Inhalt konnte nicht beurteilt werden.

Damit bleiben die fünf offenen Knoten und die vollständigen aktuellen Forschungsanforderungen/Belohnungen von Action Economy und Compact Combustion Charges ohne neue Originalbestätigung. Die vorhandenen Aufgaben- und Mengenangaben bleiben sekundär belegt. Es wurden keine API-Werte, Übersetzungen, Produktdaten oder Verifizierungsstufen geändert. Die gezielte Recherche wird hier beendet; keine weitere Datenbank- oder Guide-Suchschleife.

Lokale Prüfung für diesen Dokumentationsabschluss: node tests/amplified-variants.mjs – 13/13 bestanden. Vollständige verpflichtende CI-Prüfungen müssen am veröffentlichten PR-Head bestehen, bevor gemergt wird. Veröffentlichung und Merge werden separat nach der Durchführung geprüft; dieser Abschnitt behauptet sie nicht vorab.
