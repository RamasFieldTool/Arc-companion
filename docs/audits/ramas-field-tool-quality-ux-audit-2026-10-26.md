# Ramas Field Tool – vollständiges Qualitäts- und UX-Audit

**Auditdatum:** 26.10.2026  
**Repository:** [`RamasFieldTool/Arc-companion`](https://github.com/RamasFieldTool/Arc-companion)  
**Geprüfter Main-Stand:** `eb6f16e66b84858f4480b8f279dec206439468ff`  
**Live-Version:** [ramasfieldtool.github.io/Arc-companion](https://ramasfieldtool.github.io/Arc-companion/) – sichtbare Kennung `ARC Companion V15.00.00`  
**Auditumfang:** lesende Prüfung von Repository, offenen PRs, CI-/Datenworkflow-Ergebnissen und ausgewählten Live-Abläufen. Es wurden weder Produktcode noch Nutzerdaten geändert.

## Prüfstatus und Aussagekraft

Dieser Bericht unterscheidet drei Evidenzarten:

- **Browser-getestet:** im Live-Browser selbst aufgerufen und beobachtet. Das ist kein Test auf einem physischen Smartphone.
- **Statisch geprüft:** über Repository-Dateien, Konfiguration, README und Workflow-Definitionen erschlossen. Quellcode allein beweist nicht, dass ein Ablauf für Nutzer funktioniert.
- **CI-/Workflow-Nachweis:** bereits vorhandene GitHub-Actions-Ergebnisse, nicht von diesem Audit lokal erneut ausgeführt.
- **Nicht geprüft:** Funktion oder Geräteverhalten, für die kein hinreichender Test stattfand. Bewertungen dazu sind vorläufig.

Die Browserprüfung fand bei **1363 × 936 CSS-Pixeln, DPR 1** statt. Es war kein real verfügbares Android-Gerät bzw. kein echter schmaler Smartphone-Viewport im Browser steuerbar. Die im Repo konfigurierten Playwright-Viewports 360 × 800, 412 × 915 und 1280 × 900 sind Testkonfigurationen und werden nicht als eigene Audit-Tests ausgegeben. Hoch-/Querformat, Touch mit Daumen, langsame Mobilfunkverbindung und Screenreader wurden nicht physisch getestet.

---

# Teil A – Management Summary

## Kurzurteil

Ramas Field Tool ist inzwischen deutlich mehr als ein Item-Katalog: Ziele/Planung, Quest- und Blueprint-Verfolgung, Waffenplanung, Karten, Live-Events, Outpost-Daten, Backup sowie Community-Inhalte sind vorhanden. Besonders gut sind die Fallback-Strategie für Item-Daten, die sichtbare Kennzeichnung nicht bestätigter Community-Daten und der Versuch, Materialbedarf in einer lokalen Planung zusammenzuführen.

Die zentrale Produktschwäche ist die **fehlende durchgängige Nutzerreise**. Die Startseite präsentiert mehrere eigenständige Werkzeuge; ein neuer Spieler muss selbst verstehen, was zusammengehört und wo er anfangen soll. Die Planung ist das stärkste verbindende Element, aber nicht jede relevante Funktion führt konsistent dorthin. Die Startseite enthält keine zentrale globale Suche und keine klare, geführte Aktion wie „Ich möchte mein nächstes Ziel planen“.

Der zweite Schwerpunkt ist **Vertrauen in Daten und Status**. Beim Audit scheiterte der Mahcks-Items-Endpunkt mit HTTP 502; die App fiel sichtbar auf einen Snapshot zurück. Das ist ein gutes Resilienzverhalten. Der Snapshot macht den Katalog nutzbar, aber ein Snapshot ist nicht automatisch aktuell oder im Spiel bestätigt. Die Anwendung kennzeichnet manches bereits sorgfältig; diese Quellen- und Aktualitätslogik sollte durchgängig für Item-, Karten-, Blueprint- und Outpost-Daten gelten.

**Gesamtbewertung: 6,5/10 (vorläufig).** Gute Breite und solide Ansätze, mit konkretem Mehrwert; zugleich zu viel Eigenorientierung für Erstnutzer, inkonsistente Quellen-/Statusdarstellung und unzureichende physische Mobile-/Accessibility-Prüfung.

## Wichtigste Stärken

1. Item-Suche zeigt Treffer, mögliche Fundorte und Recyclingbeziehungen und bietet eine Aktion zum Übernehmen eines Sammelziels.
2. Beim API-Ausfall blieb der Item-Katalog verfügbar und zeigte `DATEN // SNAPSHOT` sowie einen verständlichen Quellenhinweis.
3. Der Waffenplaner legt offen, dass Angaben quellendokumentiert, aber nicht im Spiel bestätigt sind; er weist sogar auf einen Quellenwiderspruch hin.
4. Live-Events verknüpfen aktive/kommende Ereignisse mit Region, Countdown und Erinnerungsoptionen.
5. Backup-Panel erklärt lokale Speicherung und dass Import bestehende App-Daten nach Bestätigung ersetzt.
6. Planung bietet sinnvolle Einstiege für Ziele, Werkstatt und Quests.
7. Karten- und Blueprint-Bereiche weisen sichtbar auf Community- bzw. nicht geprüfte Daten hin.

## Größte Handlungsfelder

1. Eine klar geführte Start- und Navigationsstruktur um die Spieleraufgabe herum schaffen.
2. Ein einheitliches Vertrauensmodell für Datenquelle, letzter erfolgreicher Abruf, Stand, Bestätigung und Unsicherheit.
3. Auf einem echten Android-Gerät Kernabläufe, Tastatur, Touch-Ziele, Orientierung und Offline-/Langsamverbindung prüfen.
4. Den Status von Outpost und anderen Beta-Bereichen pro Teilfunktion erklären statt mit einem pauschalen „im Ausbau“ zu arbeiten.
5. Items, Ziele, Werkbank, Quests und Waffenplanung über Kontextaktionen konsequenter verbinden.

## Bewertungsübersicht

| Bereich | Wertung | Sicherheit | Begründung in Kürze |
|---|---:|---|---|
| Bedienerfreundlichkeit | 6/10 | mittel | Kernaktionen sind verständlich, aber Einstieg und Informationsarchitektur verlangen Selbstorientierung. |
| Mobile UX | 6/10 | niedrig/mittel, vorläufig | Mobile-first Testfälle existieren im CI; dieses Audit prüfte keinen echten kleinen Viewport oder ein Gerät. |
| Optisches Design | 7/10 | mittel | Wiedererkennbare, weitgehend konsistente Field-Tool-Oberfläche; Status-, Feature- und Quellenmuster sind nicht überall gleich klar. |
| Funktionsumfang | 8/10 | mittel | Breites Angebot und mehrere Verknüpfungen; nicht jeder Bereich wurde vollständig durchgespielt. |
| Datenzuverlässigkeit | 6/10 | mittel | Robuster Snapshot-Fallback beobachtet, aber Live-Quelle schlug fehl und Community-Inhalte sind teilweise unbestätigt. |
| Performance | 7/10 | niedrig/vorläufig | Oberfläche und Suche reagierten im beobachteten Desktop-Browser ohne auffällige Verzögerung; keine belastbare Messung unter Mobilbedingungen. |
| Barrierefreiheit | 5/10 | niedrig/vorläufig | Beschriftungen und Hinweise vorhanden; Tastatur, Kontrastmessung, Screenreader und Touch-Ziele nicht systematisch geprüft. |
| Gesamtqualität | 6,5/10 | vorläufig | Nützlich und resilient, doch Produktzusammenhang, Datenvertrauen und mobile Verifikation begrenzen die Reife. |

---

# Teil B – UX/UI-Audit

## Ersteindruck und Orientierung

Die Startseite nennt `ARC Companion V15.00.00` und ordnet den Zweck über Kacheltexte und Kurzbeschreibungen ein. Auf dem geprüften Desktop waren acht größere Funktionskacheln sichtbar: **Meine Planung, Live-Events, Item-Suche, Baupläne, Karten, Waffen Planer, Aussenposten, Fan Creations**. Weitere Einstiege (Tipps, Darstellung, Backup, Hilfe, Community) sind als kleinere Utility-Aktionen angeordnet. Das Angebot ist erkennbar, aber es ist nicht sofort klar, welche Kachel der beste Startpunkt ist.

Die Aufteilung mischt verschiedene mentale Kategorien: persönliche Vorbereitung (Planung), Nachschlagewerk (Items/Karten), Statusverfolgung (Baupläne), dynamische Spielinformationen (Events) und Inhalte/Community. Für erfahrene Nutzer ist das brauchbar. Ein neuer Spieler muss erst erraten, ob „Meine Planung“ Sammelziele, Werkbankbedarf, Quests und Raid-Vorbereitung zusammenfasst. Das ist eine Gelegenheit, die Produktlogik auf der Startseite zu erklären, ohne die bestehende visuelle Identität aufzugeben.

Eine prominente globale Suche wäre wertvoll, sofern sie klar zwischen Items, Karten, Bauplänen, Quests und Tipps filtert. Eine Suche, die nur Items durchsucht, darf nicht als globale Suche erscheinen. Eine einfache Auswahl „Was möchtest du tun?“ mit drei bis vier Aufgaben ist für Erstnutzer vermutlich klarer als zusätzliche Kacheln.

## Mobile Bedienung

**Tatsächlich geprüft:** nur 1363 × 936 CSS-Pixel, DPR 1. Die Startseite hatte in diesem Viewport zwei Kachelspalten und keinen horizontalen Überlauf (`scrollWidth` 1348 px gegenüber 1363 px Viewport). Kacheln und lange Listen erfordern vertikales Scrollen. Diese Desktop-Beobachtung sagt nichts Abschließendes über Daumenreichweite oder Lesbarkeit auf 360–412 px aus.

**Noch offen:** reale Android-Touch-Ziele, schmale Displays, Tastaturüberdeckung von Filtern/Suche, Rückkehr aus Details, Scrollposition, Landscape-Modus, System-Schriftvergrößerung und Offline-Betrieb. Die vorhandene CI-Konfiguration deckt 360 × 800 sowie 412 × 915 und Desktop ab; sie ist ein wertvoller Regressionstest, ersetzt aber keine Geräteprüfung.

**Konkrete Empfehlungen:**

- Eine dauerhaft erreichbare untere Navigation mit höchstens vier Kernzielen (z. B. Start, Planung, Suchen, Mehr) auf schmalen Displays prüfen; Detailbereiche sollen eine klar sichtbare Zurück-Aktion haben.
- Aktionen wie „Ziel hinzufügen“, „Filter zurücksetzen“ und „Layer anzeigen“ in der Daumenreichweite und mit mindestens 44 × 44 CSS-Pixeln anlegen; anschließend messen.
- Bei Suchfeldern sicherstellen, dass Fokus und Ergebnisse beim Öffnen der Android-Tastatur sichtbar bleiben und die Seite zum Eingabefeld scrollt.
- Bei langen Listen Suchfeld/Filter in einer gut erreichbaren, einklappbaren Leiste behalten; die Tastatur darf Filterchips und Ergebniszahl nicht verdecken.
- Karten auf Hochformat testen: Karte, Layer-Auswahl und Legende dürfen nicht gleichzeitig umständlich zwischen Bereichen springen lassen.

Diese Punkte sind Prüfkriterien und Vorschläge, keine Behauptung über ein auf Gerät beobachtetes Fehlverhalten.

## Informationsarchitektur und Konsistenz

Die „Meine Planung“-Ansicht ist ein guter Kandidat für den Produktkern. Sie bietet „Was fehlt mir?“ und „Meine Ziele“ sowie Einstiege zum Anlegen eines Sammelziels, Werkstatt auswählen oder Quest ansehen. Gleichzeitig leben Baupläne, Karten, Events, Item-Katalog und Waffenplaner als separate Werkzeuge. Nicht alle führen zurück in die Planung oder zeigen, wie ihr Ergebnis dort genutzt werden kann.

Empfohlene Gruppierung, zunächst als Navigations-/Startseitenexperiment:

| Gruppe | Nutzerfrage | Zugeordnete Bereiche |
|---|---|---|
| Vorbereiten | Was fehlt mir für mein Ziel? | Planung, Werkbank, Quest-/Blueprint-Ziele, Waffenplaner |
| Finden | Wo finde ich das? | Item-Suche, Karten/Weapon Cases, Tipps |
| Nächster Raid | Was ist jetzt relevant? | Live-Events, „My Next Raid“/Raid-Zusammenfassung, Karten-Schnellzugriff |
| Entdecken | Was gibt es noch? | Outpost, Raider Stories, Raider Radio, Community/Fan Creations |
| Einstellungen | Wie soll das Tool sich verhalten? | Sprache, Darstellung, Backup, Hilfe |

Nicht jede Gruppe braucht einen neuen Bereich. Es geht um verständliche Beschriftungen und direkte Verbindungen, nicht um mehr Navigationsebenen.

## Arbeitsabläufe (beobachtete Interaktionen und Schätzungen)

Interaktionszahlen beziehen sich auf den untersuchten Live-Ablauf und enthalten keine vermuteten, nicht geklickten Schritte. Varianten und Dialoge können die Zahl ändern.

| Szenario | Beobachteter Ablauf | Interaktionen | Verständlichkeit / Reibung | Konkrete Vereinfachung |
|---|---|---:|---|---|
| A: Item suchen und Fundort sehen | Startseite → Item-Suche → Suchbegriff „Kabel“ → Treffer öffnen/Information lesen → Fundorte bei Bedarf aufklappen | 3 bis 4 | Ergebnisliste und Recyclingbeziehungen sind nützlich. Treffer unterscheiden direkte Items und durch Recycling mögliche Items; diese Unterscheidung muss beim schnellen Scannen klar bleiben. | Direkte Fundorte standardmäßig zuerst; Recycling separat markieren; Aktionsknopf „Für Ziel sammeln“ im Ergebnis, und Bestätigung in der Planung anbieten. |
| B: Werkbank verbessern und fehlende Materialien finden | Startseite → Meine Planung → Werkstatt auswählen; danach aktive Werkbankstufe/Anforderungen in der Planung ansehen. Ein vollständiger Upgrade-Schritt mit gespeichertem Spielerbestand wurde nicht abgeschlossen. | mindestens 2 bis 4, Ablauf nur teilweise geprüft | Empty State macht nächste Schritte sichtbar. Ohne bereits eingetragenen Bestand ist „fehlend“ nicht automatisch eine echte Inventardifferenz. | Einstieg direkt auf „Werkstatt auswählen“; Stufe und Materialien gemeinsam zeigen; klar zwischen Bedarf, vorhanden und noch nicht erfasst unterscheiden. |
| C: Nächsten Raid planen | Startseite → Live-Events oder Karten; auf Karten Karte wählen, Layer-Auswahl öffnen und gewünschte Inhalte aktivieren. Ein eigener vollständiger „My Next Raid“-Ablauf wurde nicht als End-to-End-Aufgabe abgeschlossen. | 2 bis 4+ | Events zeigen Region und Erinnerungen. Karten starteten mit `0 aktiv`; es ist beschriftet, dass keine Anzeige aktiv ist, dennoch ist ein zusätzlicher Layer-Schritt nötig. | Karte mit einer sinnvollen Standard-Layerauswahl starten oder beim ersten Öffnen einen kurzen Layer-Picker zeigen; Event/Map über „Raid planen“ zusammenführen. |
| D: Waffe aufwerten und Materialbedarf ermitteln | Startseite → Waffen Planer → Waffe und Upgrade-Stufe wählen/prüfen → „In Meine Planung übernehmen“ (letzter Schritt nicht ausgelöst) | 2 bis 4 | Der Planer zeigt Materialbedarf und Quellenhinweise klar. Nicht bestätigt im Spiel und Quellenwiderspruch sind wichtige Hinweise, können aber für neue Nutzer schwer interpretierbar sein. | Kurz erklären, was „quellendokumentiert“ bedeutet; Datenstand/Widerspruch im Detail aufklappen; Übernahme mit Vorschau „wird als Ziel ergänzt“ versehen. |
| E: Quests und Baupläne verwalten | Startseite → Baupläne → Filter/Suche → Datensatz; Quest-Tracker wird von der Planung aus angeboten. Änderungen an Statusdaten wurden aus Datenschutz-/Auditgründen nicht gespeichert. | pro Bereich ca. 2 bis 4 | 90 Blueprint-Datensätze und Filter sind vorhanden. Quest-Verwaltung und Blueprint-Verwaltung wirken als getrennte Tracker, obwohl beide zu Raid- und Craftingzielen führen. | Gemeinsame „Ziele“-Übersicht mit Typfiltern; aus Quest-/Blueprint-Details erforderliche Materialien oder Fundorte in Planung übernehmen. |

## Verständlichkeit für wenig technikaffine Spieler

Gut: sichtbare Empty-State-Aktionen, sichtbare Datenhinweise, sprechende deutsche Kurztexte in vielen Kernabläufen. Schwächer: einige Begriffe (`Snapshot`, `Live`, `Base Data`, `Quellendokumentiert`, `Layer`) sind technischer als die Nutzeraufgabe. Jede dieser Kennzeichnungen sollte mit einem kurzen Satz in Alltagssprache versehen werden. Status- und Datumsangaben sollten zusammenstehen; ein Datum ohne Erklärung (Abrufzeit oder Quellendatum) kann falsche Sicherheit erzeugen.

---

# Teil C – Funktionsaudit

## Bestandsaufnahme und Prüftiefe

Bewertung: **B** = im Live-Browser ausprobiert, aber kein vollständiger Belastungs-/Randfalltest; **S** = statisch geprüft; **CI** = nur vorhandene Actions geprüft; **N** = in diesem Audit nicht hinreichend getestet. Wertungen für unvollständig getestete Bereiche sind vorläufig.

| Funktion | Prüftiefe | Technischer/UX-Befund und praktischer Nutzen | Daten/Integration | Potenzial |
|---|---|---|---|---|
| Item-Suche / Katalog | B, S | 655 Items wurden in der geprüften Sitzung geladen; Suche „Kabel“ zeigte 28 Treffer inklusive direkter und recycelbarer Ergebnisse. Öffnen von Item-Details und Fundortinformation vorhanden. Hoher Kernnutzen. | Live-API schlug in dieser Sitzung fehl; Snapshot war sichtbar aktiv. Es gibt weitere Fallbacks und lokale Basisdaten. | Quellenstand überall einheitlich anzeigen; direkte Fundorte und Recycling klar trennen; Suchbegriffe aus Quests/Plänen vorbefüllen. |
| Total Requirements / Sammel- und Gesamtbedarf | S, B teilweise | Planung enthält „Was fehlt mir?“ und Zielverwaltung. Ein vollständig gespeicherter Mehrziel-/Inventarfall wurde nicht durchgespielt. | Abhängigkeit von Material-, Werkbank- und lokalen Bestandsdaten. | Herkunft jeder Summe erklären; doppelt benötigte Materialien sauber aggregieren; „noch nicht erfasst“ von „fehlt“ unterscheiden. |
| Werkbank / aktive Ziele | B, S teilweise | Empty State bietet Sammelziel, Werkstatt und Quest als klare nächste Schritte. | App speichert persönlichen Fortschritt lokal (README/Backup-UI). Live-Daten- und Wiederherstellungsrandfälle nicht getestet. | Ziele, Inventar und Werkbank als einen nachvollziehbaren Ablauf zusammenführen. |
| Quest-Tracker | S, UI-Einstieg B | Einstiege vorhanden; keine Quest-Statusänderung gespeichert. README beschreibt Questdaten als separaten/aktiven Datenbereich. | Vollständigkeit und lokale Persistenz nicht end-to-end verifiziert. | Quest → benötigte Gegenstände → Fundorte → Raid-Ziel direkt verketten. |
| Blueprint-Tracker | B | 90 Datensätze, Suche und Filter `ALL/LEARNED/MISSING`; Karten enthalten Status „learned on this device“ und Info/Location-Bereich. Als Beta/Community-Daten gekennzeichnet. Statuswechsel nicht getestet. | Kein Spielkonto-Sync nach README; lokale gerätegebundene Erfassung. Datensatzvollständigkeit nicht bewiesen. | Quellen- und Prüfstatus je Blueprint; Schnellfilter für fehlende/nahe Ziele, Gruppierung nach Material oder Ort. |
| My Next Raid | S, begrenzter UI-Abgleich | Kein eigener prominenter Startseiten-Einstieg in der geprüften Navigation; Planungs-/Raid-bezogene Legacy-Drawer-Ziele sind im DOM statisch vorhanden. Voller Ablauf nicht als eigenständige Nutzeraufgabe bestätigt. | Abhängigkeit zu Events/Karten/Planung muss funktional validiert werden. | Als handlungsorientierte Zusammenfassung aus aktivem Ziel, Event, Karte und benötigtem Gear neu bewerten; zuerst klären, welche Teile aktiv unterstützt sind. |
| Waffen- und Upgrade-Planer | B, CI (historisch) | Live-Planer öffnete; 26 Waffenoptionen, Beispiel Anvil I → II, Materialbedarf, Workshop-Hinweis und Übernahmeaktion. Quellenwiderspruch und „nicht im Spiel bestätigt“ sichtbar. Übernahme nicht geklickt. Sehr nützlich, hoher Vertrauensbedarf. | Community-/Sekundärquellen; Stand 26.10.2026 angezeigt. CI für PR #182 erfolgreich, ist aber keine Live-Wahrheitsbestätigung. | Konflikte in verständlicher Sprache erklären, pro Rezept Beleg und Prüfsicherheit anzeigen, Übernahme in Planung mit Vorschau/Undo. |
| Raider Maps | B | Sieben Kartenoptionen vorhanden. Karte startet mit `0 aktiv`; keine Anzeige aktiv. Nutzerhinweis nennt Zoom bis 3× und Verschieben. | Bei Spaceport sichtbarer Hinweis: Grundkarte nicht im Spiel abgeglichen; Lifts/Hatches grafische Entwürfe; Spawns/Weapon Cases aus Community-Snapshot vom 28.09.2026, Positionen unbestätigte Entwürfe. | Standard-Layer oder geführte Layer-Auswahl; Bestätigungsgrad je Marker/Layersicht; mobile Karte und Legende gemeinsam testen. |
| Weapon Cases | B/S über Map-Kontext | Als Karteninhalt/Layerset eingebunden, nicht als separater dominanter Einstieg. Marker wurden nicht auf Positionen verifiziert. | Community-Snapshot, als nicht bestätigt gekennzeichnet. | Aus Item-Suche/Planung zum passenden Kartenlayer springen; Marker mit Stand und Vertrauensgrad versehen. |
| Live Events | B | Vier aktive Einträge auf der Startansicht; Events und kommende Einträge, Regionsauswahl, Countdown und Erinnerungsoptionen sichtbar. Reminder nicht ausgelöst. Hoher wiederkehrender Nutzen. | Quelle offiziell ausgewiesen; Zeit-/Regionseinstellungen und Benachrichtigungszustellung nicht vollständig geprüft. | Event → Region/Map → Raid-Vorbereitung; Erinnerungserlaubnis und Geräteeinschränkungen verständlich kommunizieren. |
| Outpost / Möbelkatalog | B/S | Startkachel sagt „Bereich im Ausbau“, dennoch öffnete ein Bereich mit drei Tabs und 100 Furniture-Einträgen, Suche und Kategorieauswahl. Task-/Research-Ansichten verweisen auf Planung. | Sichtbarer Hinweis: Community-Datensatz, nicht im Spiel bestätigt und nicht in Materialplanung übernommen. | Status pro Tab statt pauschalem Under-Construction; echte unterstützte Teilfunktionen und ausgeschlossene Datenwirkung benennen. |
| Outpost Build/Research | B, begrenzt | Tabs sichtbar, Einstieg und Verknüpfung zur Planung vorhanden; Berechnungen nicht mit konkretem Zielzustand durchgespielt. | Referenzdaten getrennt; Vollständigkeit nicht geprüft. | Anforderungen und Materialherkunft nebeneinander; fehlende/unbestätigte Felder ausweisen. |
| Tipps und Tricks | S | Startseiten-Utility vorhanden; Inhalte und Navigation nicht vollständig einzeln geprüft. | Aktualität/Vollständigkeit offen. | Tipps nach Nutzeraufgabe und Spielphase auffindbar machen; von Item-/Karten-Kontext aus verlinken. |
| Raider Radio | S | Im Projektbestand vorhanden; Live-Ablauf in diesem Audit nicht vollständig verifiziert. | Streaming, Verfügbarkeit, mobile Hintergrundwiedergabe und Drittanbieterabhängigkeit offen. | Sichtbaren Lade-/Offline-Status, Pause und Rückkehr zum Tool testen; optionaler Inhaltsbereich. |
| Raider Stories | S | Projektinhalt vorhanden; nicht vollständig browsergetestet. | Aktualität/Quelle und Lesbarkeit offen. | Inhalte mit Spielorten/Quests verknüpfen, falls redaktionelle Daten gepflegt werden. |
| Community / Fan Creations | B begrenzt | Startkachel Fan Creations und Community-Utility sichtbar; Unterseiten/Moderation nicht umfassend getestet. | Externe Links und Community-Inhalte haben andere Vertrauens-/Moderationsanforderungen als Spieldaten. | Klar zwischen offiziellen Daten, redaktionellem Inhalt und Community-Beiträgen unterscheiden. |
| Backup / Import / Export | B lesend, S | UI erklärt lokale Speicherung und Importersetzung nach Sicherheitsbestätigung. Keine Datei erstellt/importiert und keine Nutzerdaten geändert. Backup-Fehl-/Wiederherstellungsfälle ungeprüft. | README beschreibt lokalen Fortschritt und Export/Import; echter round-trip wurde nicht getestet. | Vor Import erkannte Daten/Version anzeigen, Backup vor Ersetzen anbieten, Exportdatum und Erfolg prüfen lassen. |
| Sprachumschaltung | B begrenzt, S | Erstnutzer-Auswahl sichtbar; Deutsch gewählt, übrige Sprache nicht systematisch geprüft. In einer deutschen Items-Auswahl blieben englische Itemnamen stehen. | Teilweise englische/Fallback-Namen; vollständige Übersetzungsabdeckung nicht belegt. | fehlende Übersetzung konsistent markieren/liefern; Suchindex muss lokale und Quellnamen unterstützen. |
| Dark/Light/Black-Modus | B begrenzt, S | Darstellungseinstieg vorhanden; alle Modi und Kontrastkombinationen nicht visuell einzeln geprüft. | Theme-Persistenz nicht getestet. | Jede Theme-Kombination automatisiert auf Kontrast, Fokus und Karten-/Overlay-Lesbarkeit prüfen. |
| Hilfe / weitere Navigation | B begrenzt, S | Help- und Community-Einstiege vorhanden; Hilfeseiten nicht vollständig durchlaufen. | README enthält V15-Funktionsübersicht, die den separat auffindbaren Waffenplaner nicht prominent erklärt. | Ein aktuelles „So startest du“-How-to, Glossar für Statuswörter und Version-/Quellenhinweise bereitstellen. |

## Zentrale Abhängigkeiten

- Suche, Planung, Werkbank, Quest- und Waffenanforderungen hängen voneinander ab, wenn Gesamtbedarf sinnvoll berechnet werden soll.
- Datenquellen reichen von offizieller Quelle über sekundäre Tracker bis Community-Snapshot und lokaler Basis. Diese Klassen dürfen UI-seitig nicht gleich wirken.
- Persönlicher Fortschritt wird lokal geführt. Backup ist damit Teil der Kernfunktion und muss als Wiederherstellungspfad getestet werden.
- Kartenmarker und Weapon Cases beruhen teilweise auf nicht bestätigten Positionsdaten. Ein visueller Kartenmarker kann trotz Disclaimer als präzise wahrgenommen werden.
- Sprache und Item-/Questnamen beeinflussen Suche und Filter quer durch mehrere Funktionsbereiche.

---

# Teil D – Technisches Audit

## Datenqualität und Ausfallsicherheit

**Beobachtet:** Während der Browserprüfung scheiterte der Mahcks-Items-Abruf; die App meldete API-Fehler und Snapshot-Fallback. Die Item-Suche blieb nutzbar, zeigte `DATEN // SNAPSHOT` und einen Hinweis auf die Datenquelle. Ein externer GitHub-Actions-Datencheck für den geprüften Main-Stand meldete am 26.10.2026 HTTP 502 am Mahcks-Endpunkt; der RaidTheory-Itemindex (581 Dateien), Questindex (100 Dateien) und offizielle Live-Event-Feed (172 Bedingungen) bestanden ihren jeweiligen Check. Ein Snapshot-Refresh-Workflow lief später erfolgreich. Diese Zahlen sind Workflow-Ausgaben und kein Beleg, dass jeder Datensatz korrekt oder vollständig ist.

**Statisch geprüft:** `catalog-resilience-v2120.js` prüft Snapshot-Schema, Format, IDs und Mindest-/Zählbedingungen, versucht mehrere Quellen und fällt letztlich auf lokale `items.json`-Daten zurück. Snapshot-Daten werden je Seitenlauf gecacht; ein manuelles Retry ist vorgesehen. Der automatische Snapshot-Workflow läuft planmäßig alle sechs Stunden. Die Architektur ist für Verfügbarkeit sinnvoll.

**Risiko:** „Fallback erfolgreich“ bedeutet nur, dass Daten angezeigt werden können. Es garantiert nicht, dass Quellstand aktuell, vollständig, semantisch konsistent oder im Spiel bestätigt ist. Das Produkt benötigt je Datensatz oder klar abgegrenztem Datenbereich mindestens: Quelle, Abruf-/Prüfdatum, Bestätigungsstatus, Fallback-Status sowie klare Erklärung, wie sich das auf die Empfehlung auswirkt. Das offene PR #179 adressiert Statusunterscheidung zwischen Snapshot, Teilbestand, Basisdaten und Live-Daten; dieses Thema ist weiterhin relevant.

**Weitere Datenprüfung:** Keine vollständige Item-/Materialdatenbank gegen das Spiel oder sämtliche Quelldateien abgeglichen. Bildvollständigkeit, Materialkosten und Übersetzungsabdeckung wurden nicht exhaustiv gezählt. In der deutschen Planungsauswahl waren einzelne Itemnamen englisch. Das ist ein beobachtetes Lokalisierungsproblem, aber kein Beleg dafür, dass der Datensatz inhaltlich falsch ist.

## Persistenz, Backup und Datenschutz

README und UI beschreiben lokale Speicherung; kein Spielkonto-Abgleich. Das ist datensparsam und macht Backups besonders wichtig. Backup-Panel war lesend klar, aber kein tatsächlicher Export→Import-Roundtrip wurde ausgeführt. Daher sind Wiederherstellbarkeit, Schema-Upgrades, beschädigte Dateien, Abbruch während Import und Schutz vor versehentlichem Ersetzen offen. Der Nutzer sieht im UI eine Sicherheitsbestätigung vor Import – gut, aber für die Zuverlässigkeit reicht der Hinweis allein nicht.

Empfohlener Sicherheitsablauf: Backup vor Import anbieten/automatisch anlegen; Datei-Version und enthaltene Bereiche vor Anwendung anzeigen; Import atomar validieren; Fehler ohne Teilüberschreibung melden; nach erfolgreichem Import Bestätigung und Wiederherstellungsoption anbieten. Danach Roundtrip auf leeren und befüllten Testprofilen prüfen. Kein P0-Datenverlust wurde in diesem Audit beobachtet.

## Performance und Stabilität

- **Messwerte:** Keine belastbare Ladezeit-, Speicher- oder FPS-Messung erhoben. Der geprüfte Desktop-Browser zeigte keine auffällige Wartezeit in Itemsuche/Navigation, aber es wurde keine Stoppuhr- oder Profiler-Messung gemacht.
- **Beobachtete Funktion:** Suche „Kabel“ und Katalogdarstellung reagierten im getesteten Browser normal. Das ist ein qualitativer Eindruck, kein Performance-Benchmark.
- **Netzwerk:** Beim externen Item-API-Aufruf trat ein Fehler auf; Fallback funktionierte. Anzahl wiederholter Requests, Kalt-/Warmstart, langsames Netz und Offline wurden nicht gemessen.
- **Listen:** 90 Blueprints und 100 Outpost-Möbel sind in sichtbaren Listen zugänglich. Rendering großer Listen, DOM-Größe, Speicher und Scroll-Jank wurden nicht profiliert.
- **Fehler:** Im App-Kontext wurde ein API-Fetch-Fehler mit Snapshot-Fallback protokolliert. Browser-Extension-Fehlermeldungen wurden nicht der Anwendung zugerechnet. Keine Anwendungs-JavaScript-Ausnahme wurde bei den beobachteten Kernansichten festgestellt; dies ersetzt keine vollständige Session-Fehlerüberwachung.

## Barrierefreiheit

Im Browser waren mehrere Buttons mit verständlichen Beschriftungen vorhanden, und Empty States erklären konkrete nächste Schritte. Eine systematische WCAG-Kontrastmessung, Tastaturprüfung, Fokusreihenfolge, Fokus-Sichtbarkeit, Screenreaderprüfung (TalkBack/NVDA), Zoom auf 200 %, Reduce Motion, Dynamic Type/Android Font Scaling sowie Mindestgröße von Touch-Zielen wurde nicht durchgeführt. Daher ist 5/10 eine vorsichtige vorläufige Wertung, keine Konformitätsaussage.

Nächste sinnvolle Prüfungen: axe/Playwright auf Kernseiten plus manuelle Tastaturbedienung; TalkBack auf realem Android; Light/Dark/Black mit Farbkontrastmessung; Fokus bei Modals und Importwarnung; beschreibende Namen für Icon-only-Steuerelemente; Status nicht allein durch Farbe ausdrücken.

## Repository, Branches, PRs und vorhandene Tests

- Main-Stand `eb6f16e66b84858f4480b8f279dec206439468ff` ist die Basis des Audits. Erfolgreicher GitHub-Pages-Deploy für diesen Stand: Workflow-Run `40314855761`; die Live-Oberfläche kennzeichnet sich als V15.00.00.
- Waffenplaner ist bereits in Main enthalten; PR #182 wurde gemerged. Auf dessen Feature-Commit `09ec76466330e8e30bd8a38186380d1fed675c66` bestanden die Quality-Gate-Jobs und die separate Planner-Validation. Das sind historische CI-Ergebnisse für den damaligen Commit, keine Tests dieses Audits und kein Nachweis, dass jede aktuelle Live-Datenquelle stimmt.
- Ein offener PR wurde gefunden: **#179 – “Distinguish snapshot catalog from local base data in status UI”**, Branch `fix/accurate-catalog-status-20261020`, Head `a0efb27e04646ffe4615328dd05fc779fdd52f5a`. Sein Quality-Gate-Lauf war fehlgeschlagen (statischer Job erfolgreich; Browser-Quality-Gate fehlgeschlagen). Die genaue Fehlermeldung konnte in diesem Audit nicht verlässlich extrahiert werden; daher wird keine Ursache behauptet. PR #179 ist nicht als Bestandteil von Main bewertet.
- Das Quality-Gate-Workflow-Setup konfiguriert UI-Läufe unter anderem mit 360 × 800, 412 × 915 und 1280 × 900 und Tests für Item-Suche, Planning, Backup und mobile Regressionen. Das ist Konfiguration, kein aktuelles Testresultat dieses Audits.
- **Eigene Tests:** keine lokalen Tests ausgeführt, da im Arbeitsverzeichnis kein Repository-Checkout verfügbar war und die Prüfung über GitHub-/Live-Interfaces erfolgte. Es wurden keine Quelldateien geändert, kein Merge und kein Root-Live-Deploy ausgelöst.

---

# Teil E – Problemkatalog

Aufwandsklassen sind grobe Engineering-Schätzungen für eine einzelne erfahrene Person inklusive UI/Code, ohne größere Datenmigration: **S** = 0,5–2 Tage, **M** = 3–7 Tage, **L** = 2–4 Wochen. Sie sind keine Zusage und hängen von vorhandener Architektur und Tests ab.

## P1 – Hohe Priorität

### P1.1 – Funktionsstatus des Outpost-Bereichs ist widersprüchlich
- **Funktion:** Outpost/Möbel/Build/Research.
- **Reproduktion:** Startseite öffnen; Kachel als „Bereich im Ausbau“ lesen; Kachel öffnen.
- **Beobachtet:** Es öffnet ein Bereich mit drei Tabs und 100 Furniture-Einträgen, Suche/Kategorie und Verknüpfung zu Planungsbereichen. Gleichzeitig erklärt der Innenbereich, Funktionen seien unvollständig; Möbel-/Community-Daten seien nicht bestätigt und nicht in Materialplanung eingebunden.
- **Erwartet:** Nutzer erkennt direkt, welche Teilfunktionen nutzbar, experimentell, nicht integriert oder unbestätigt sind.
- **Auswirkung:** Nutzer kann eine funktionierende Katalogansicht für defekt halten oder irrtümlich annehmen, dass deren Daten in seinen Materialbedarf einfließen.
- **Lösung:** Kachelstatus auf Teilbereiche auflösen; in jedem Tab kurze Kennzeichnung „Suche verfügbar / Community-Daten / noch nicht in Planung“. Eine klare Aktion „In Planung übernehmen“ nur dort zeigen, wo sie tatsächlich funktioniert.
- **Priorität / Aufwand:** P1 / S–M (Schätzung).
- **Risiken/Abhängigkeiten:** Status muss mit tatsächlicher Funktion und Datenfluss übereinstimmen; hängt von Produktentscheidung ab, was als Beta gilt.

### P1.2 – Verfügbarkeit und Vertrauensstatus der Katalogdaten müssen zusammengehören
- **Funktion:** Item-Katalog und andere externe Datenansichten.
- **Reproduktion:** Katalog öffnen, wenn Mahcks nicht verfügbar ist; Status und Quelle vergleichen.
- **Beobachtet:** API-Abruf scheiterte; App wechselte sichtbar auf Snapshot. Externer Health-Check meldete HTTP 502. Der Fallback erhält die Suche, aber Datenaktualität ist eine separate Frage.
- **Erwartet:** Nutzer sieht verständlich „Der Live-Abruf ist fehlgeschlagen. Angezeigt wird der Snapshot vom …; Angaben können älter sein.“ plus Retry, ohne dass die Funktion leer bleibt.
- **Auswirkung:** Ohne einheitlichen Zeitstempel und verständlichen Status könnte ein brauchbarer, aber alter Bestand als aktuell missverstanden werden.
- **Lösung:** Ein gemeinsamer Statusbaustein für alle Datenmodule (Quelle, letzter erfolgreicher Abruf, Datenstand, Verifikationsstatus, Retry). Snapshot/Basisdaten/Teilbestand klar unterscheiden; offene Statusarbeit aus PR #179 berücksichtigen.
- **Priorität / Aufwand:** P1 / M (Schätzung).
- **Risiken/Abhängigkeiten:** Datenquellen liefern unterschiedliche Zeitstempel und Semantik; keine pauschale Kennzeichnung als „aktuell“ zulassen.

## P2 – Mittlere Priorität

### P2.1 – Startseite ordnet Aufgaben nicht nach dem Spielziel
- **Funktion:** Startseite/Navigation.
- **Reproduktion:** Neue Sitzung starten und die acht primären Kacheln ohne Vorwissen überfliegen.
- **Beobachtet:** Planung, Item-Suche, Baupläne, Karten, Events, Waffenplaner, Outpost und Fan Creations stehen gleichrangig nebeneinander; keine globale Suche oder kurze Anleitung, wo ein neuer Spieler beginnen soll.
- **Erwartet:** In wenigen Sekunden Auswahl nach Absicht (Ziel planen, Item finden, Raid vorbereiten, Inhalte entdecken).
- **Auswirkung:** Mehr Orientierungsaufwand und höhere Wahrscheinlichkeit, dass der Nutzer nur ein isoliertes Tool verwendet.
- **Lösung:** Vier handlungsorientierte Einstiege und eine klar abgegrenzte Suche als Prototyp testen; bestehende Bereiche darunter gruppieren, nicht neue Hierarchieebenen stapeln.
- **Priorität / Aufwand:** P2 / M (Schätzung).
- **Risiken/Abhängigkeiten:** Favoriten-/Nutzungsdaten oder kurze Nutzertests nötig, damit prominente Reihenfolge nicht nur interne Präferenz abbildet.

### P2.2 – Datenhinweise und Verifikationsbegriffe sind nicht überall gleich verständlich
- **Funktion:** Waffenplaner, Karten, Blueprint-/Outpost-Kataloge, Item-Daten.
- **Reproduktion:** Anvil I → II im Waffenplaner und Spaceport-Karte öffnen; anschließend Outpost-Möbel ansehen.
- **Beobachtet:** An mehreren Stellen stehen unterschiedliche Hinweise wie „nicht im Spiel bestätigt“, „Community snapshot“, „Illustrative map base“ und „Bereich im Ausbau“. Transparenz ist da, Bedeutung und Darstellung unterscheiden sich.
- **Erwartet:** Eine einheitliche, alltagssprachliche Erklärung von Quelle, Aktualität und Sicherheit der Angabe.
- **Auswirkung:** Nutzer muss technische Quellenbegriffe selbst interpretieren und kann Sicherheit/Genauigkeit überschätzen.
- **Lösung:** Ein gemeinsames Vertrauensmodell mit kurzen Stufen (offiziell bestätigt, aus Community-Quelle, ungeprüft/Entwurf) und aufklappbarer Quellen-/Datumsdetails. Keine künstliche Präzisionszahl ohne Begründung.
- **Priorität / Aufwand:** P2 / M (Schätzung).
- **Risiken/Abhängigkeiten:** Redaktions- und Datenpflegeaufwand; Definitionen mit Maintainer und Community abstimmen.

### P2.3 – Deutsche Oberfläche enthält englische Itemnamen
- **Funktion:** Planungsauswahl und Item-/Zielsuche.
- **Reproduktion:** Sprache Deutsch wählen; Item-Auswahl in der Planung durchsuchen.
- **Beobachtet:** Einige Datensatznamen bleiben Englisch, während Navigation und UI Deutsch sind.
- **Erwartet:** Konsistente Sprache oder eine erkennbare Fallback-Konvention, die trotzdem beide Sprachvarianten auffindbar macht.
- **Auswirkung:** Weniger scanbar für deutschsprachige Spieler; Nutzer kann glauben, ein Item fehle oder anders benannt zu sein.
- **Lösung:** Übersetzungsabdeckung inventarisieren; lokalisierte Namen ergänzen; Suchindex mit lokalem und originalem Namen aufbauen; unübersetzte Felder nicht stillschweigend inkonsistent darstellen.
- **Priorität / Aufwand:** P2 / M–L (Schätzung, Umfang abhängig vom Datensatz).
- **Risiken/Abhängigkeiten:** Namensänderungen im Spiel und externe Datenschemas erfordern laufende Pflege.

### P2.4 – Karten beginnen ohne aktive Layer
- **Funktion:** Raider Maps.
- **Reproduktion:** Karten öffnen und eine Karte auswählen.
- **Beobachtet:** `0 aktiv` und „Keine Anzeige aktiv“; Anwender muss die Layer-Auswahl selbst öffnen. Ein Hinweis erklärt das, aber die leere Karte bietet zunächst keinen unmittelbaren Inhalt.
- **Erwartet:** Karte zeigt entweder eine sichere Standardauswahl oder leitet sichtbar zum passenden Layer.
- **Auswirkung:** Erstnutzer kann eine leere Karte als Ladefehler interpretieren.
- **Lösung:** Erste Nutzung mit einer empfohlenen Standard-Layerauswahl/Legende starten; vorhandene leere Karten für erfahrene Nutzer als gespeicherte Einstellung erhalten. Keine ungeprüften Marker ohne deutlichen Status automatisch als verifiziert darstellen.
- **Priorität / Aufwand:** P2 / S (Schätzung).
- **Risiken/Abhängigkeiten:** Default-Layer kann bei unbestätigten Daten falsche Sicherheit vermitteln; Auswahl nach Karten-/Layer-Vertrauen definieren.

### P2.5 – Verknüpfung von Quests, Items, Waffen und Planung bleibt lückenhaft
- **Funktion:** Planung und Tracker.
- **Reproduktion:** Item aus Suche öffnen; danach Quest/Blueprint oder Waffenplaner separat öffnen.
- **Beobachtet:** Item kann als Sammelziel übernommen werden; Waffenplaner besitzt eine Übernahmeaktion. Quest-, Blueprint- und Karteneinstiege wirken weiterhin getrennt; das gesamte Ziel→Material→Fundort→Raid wurde nicht als ein Ablauf sichtbar.
- **Erwartet:** Ein Nutzer kann aus jedem relevanten Detail die nötigen Elemente in ein gemeinsames Ziel überführen.
- **Auswirkung:** Doppelte Suche und manuelle Zusammenführung; „Meine Planung“ erfüllt sein Potenzial als Kern nicht vollständig.
- **Lösung:** Einheitliche kontextuelle Aktion „Zu meiner Planung“ für Items, Waffenrezepte, Werkbankstufe, Quest und Blueprint. Vorschau der Änderungen, Materialaggregation und Undo.
- **Priorität / Aufwand:** P2 / L (Schätzung).
- **Risiken/Abhängigkeiten:** Datenmodell, Duplikaterkennung, Anforderungen und bisherige Nutzerdaten; zuerst genaue Product-Definition.

### P2.6 – Mobile Reife ist durch die vorhandene Prüfung nicht belegt
- **Funktion:** gesamte App, vor allem Suche, Listen, Karten und Modals.
- **Reproduktion:** auf realem Android noch nicht durchgeführt; im Repo existieren konfigurierte schmale Playwright-Viewports.
- **Beobachtet:** Audit konnte nur 1363 × 936 Browser-Viewport prüfen; der produktive Smartphone-Einsatz ist damit nicht bewertet.
- **Erwartet:** Belegbare Bedienbarkeit auf typischen Android-Bildschirmgrößen inklusive Tastatur, Touch und Rotation.
- **Auswirkung:** Ein zentrales Nutzungsszenario bleibt ungeprüft; mögliche Touch-/Viewport-Probleme können durch Desktopprüfung unentdeckt bleiben.
- **Lösung:** Geräte-Testmatrix mit kleinem und normalem Android, Hoch-/Querformat, TalkBack, Tastatur, Zoom und langsamer Verbindung. Bugs mit reproduzierbaren Bildschirmmaßen dokumentieren.
- **Priorität / Aufwand:** P2 / S (Schätzung für Prüfplan; Behebung abhängig von Befund).
- **Risiken/Abhängigkeiten:** Gerätezugriff erforderlich; Emulator ersetzt Touch-Latenz, OEM-Tastatur und reale Netzwerkbedingungen nur teilweise.

### P2.7 – Backup-Wiederherstellung ist nicht nachgewiesen
- **Funktion:** Backup/Import.
- **Reproduktion:** Nicht ausgeführt, weil dies eine Änderung gespeicherter Daten erzeugt hätte.
- **Beobachtet:** UI erklärt lokalen Speicher und Importersetzung nach Bestätigung. Roundtrip und Fehlerszenarien blieben ungeprüft.
- **Erwartet:** Ein exportiertes Profil kann nach Validierung vollständig zurückgespielt werden; bei ungültiger Datei bleibt bestehender Fortschritt erhalten.
- **Auswirkung:** Lokaler Fortschritt ist ohne nachgewiesenen Wiederherstellungspfad ein Vertrauens- und Verlust-Risiko.
- **Lösung:** Roundtrip-/Fehlerfalltests mit synthetischen Profilen; Importvorschau und Backup vor Ersetzen; atomare Anwendung und klare Erfolgsmeldung.
- **Priorität / Aufwand:** P2 / M (Schätzung).
- **Risiken/Abhängigkeiten:** Formatversionierung und Datenschutz; nur Testprofile verwenden.

### P2.8 – Lange Listen setzen Suche und Filter voraus
- **Funktion:** Blueprints, Outpost, Item-Katalog.
- **Reproduktion:** Blueprints öffnen und ohne Filter durch Liste scrollen; Outpost enthält 100 Einträge.
- **Beobachtet:** Filter/Suche sind vorhanden und hilfreich. Mobile Scroll-/Renderleistung und Wahrnehmbarkeit auf kleinem Display sind nicht geprüft.
- **Erwartet:** Häufige und relevante Einträge sind ohne langes Scrollen erreichbar; Ergebniszahl und aktive Filter bleiben sichtbar.
- **Auswirkung:** Bei spontaner Nutzung im Raid-Kontext kann Listenlänge die Suche verlangsamen.
- **Lösung:** Zuletzt verwendet, fehlend/aktiv, Gebiet und Kategorie als schnelle Filter; virtuelle Liste nur nach Profiling; gespeicherte Filterzustände.
- **Priorität / Aufwand:** P2 / S–M (Schätzung).
- **Risiken/Abhängigkeiten:** Zusätzliche Filter dürfen Nutzer nicht mit weiteren Fachbegriffen überfrachten.

## P3 – Niedrige Priorität

### P3.1 – README/Start-Hilfe bildet den Funktionsstand nicht vollständig ab
- **Funktion:** Hilfe/Onboarding.
- **Reproduktion:** README-Funktionsübersicht mit Startseite vergleichen.
- **Beobachtet:** Ein eigenständiger Waffenplaner ist live präsent, aber in der geprüften Funktionsübersicht nicht entsprechend prominent als eigener Einstieg erklärt.
- **Erwartet:** Dokumentation beschreibt alle Hauptbereiche und einen sinnvollen Startablauf.
- **Auswirkung:** Neue Nutzer erfahren den Nutzen nicht vorab und Hilfetexte können der Navigation hinterherlaufen.
- **Lösung:** Funktionsübersicht pro Nutzeraufgabe pflegen; kurze In-App-Erklärung der wichtigsten Begriffe ergänzen.
- **Priorität / Aufwand:** P3 / S (Schätzung).
- **Risiken/Abhängigkeiten:** Dokumentation muss bei Featureänderungen mit aktualisiert werden.

### P3.2 – Einige Fachbegriffe benötigen eine knappe In-App-Erklärung
- **Funktion:** Datenstatus, Karten, Snapshot-/Layer-Ansichten.
- **Reproduktion:** Begriffe `Snapshot`, `Layer`, `quellendokumentiert` ohne Vorwissen lesen.
- **Beobachtet:** Statushinweise existieren, sind aber teils technisch formuliert.
- **Erwartet:** Kurze verständliche Erklärung direkt an der Stelle.
- **Auswirkung:** Einsteiger müssen aus Begriffen auf Verhalten schließen.
- **Lösung:** Ein-Satz-Hilfe oder Info-Button, abgestuft nach Erstnutzung; Glossar in Hilfe.
- **Priorität / Aufwand:** P3 / S (Schätzung).
- **Risiken/Abhängigkeiten:** Hilfe darf Hauptaktionen nicht verdecken oder zusätzliches Tippen erzwingen.

Es wurde kein bestätigter P0-Fehler gefunden. Das bedeutet nicht, dass es keinen P0-Fehler gibt: Backup-Roundtrip, Nutzerdatenfälle und vollständige Regression wurden nicht ausgeführt.

---

# Teil F – Verbesserungskonzept und UX-Innovationen

Die folgenden Ideen sind eigenständige, konkrete Vorschläge. Priorisierung bezieht sich auf Nutzwert und grobe Kosten, nicht auf bereits zugesagte Implementierung.

| # | Idee | Nutzwert | Aufwand (Schätzung) |
|---:|---|---|---|
| 1 | **„Was möchtest du erledigen?“** als Startauswahl: Ziel planen, Item finden, nächsten Raid vorbereiten, Fortschritt verwalten. | Sehr hoch für Erstnutzer; führt in vorhandene Funktionen. | S–M |
| 2 | **Eine Suche mit klaren Ergebnis-Tabs** Items, Quests, Blueprints, Karten/Orte, Tipps; scope sichtbar halten. | Schneller Einstieg, weniger Funktionssuche. | M |
| 3 | **„Zu meiner Planung“ überall**: Item, Blueprint, Quest, Waffenupgrade und Werkbankbedarf in einem Vorschau-Dialog hinzufügen. | Verbindet das Produkt statt mehrere Listen zu erzeugen. | M–L |
| 4 | **Ein „Raid-Zettel“ für den nächsten Lauf**: Ziel, fehlende Materialien, Kartenlayer, aktives Event und optional Notiz als kompakte, lokale Ansicht. | Wiederkehrender Alltagseinstieg. | M |
| 5 | **Datenvertrauens-Badge mit Erklärung**: Datenquelle, Stand, Bestätigung, Fallbackzustand in gleichem Muster. | Weniger falsche Sicherheit bei Community-/Snapshot-Daten. | M |
| 6 | **„Fehlt wirklich“ von „Bestand nicht erfasst“ trennen.** Bestand optional markieren statt nicht erfasste Dinge als fehlend zu interpretieren. | Macht Anforderungen verständlicher. | S–M |
| 7 | **Neue-Nutzer-Modus mit drei kleinen geführten Aufgaben** (Item suchen, Ziel anlegen, Backup verstehen), danach ausblendbar. | Niedrige Einstiegshürde ohne großes Redesign. | S |
| 8 | **Leere Karte mit sinnvoller Erstaktion**: passende Layer wählen und Vertrauensstatus erklären. | Verhindert den Eindruck, Karte sei kaputt. | S |
| 9 | **Letzte und angeheftete Ziele auf Startseite** – lokal, mit „weiter planen“-Aktion. | Spart wiederholte Navigation für Stammspieler. | S–M |
| 10 | **Einheitliche Fortschrittsanzeige mit Erklärung**: benötigt, erfasst, vorhanden, fehlt; nicht nur Prozentzahl. | Reduziert Missverständnisse bei Total Requirements. | M |
| 11 | **Sichere Importvorschau und Undo** bei Backup-Wiederherstellung. | Schützt persönliche Fortschritte und erhöht Vertrauen. | M |
| 12 | **Kompakte Kontextaktionen statt weitere Hauptkacheln**: vom Fundort zur Karte, vom Event zur Raidplanung, vom Plan zum Item. | Hält Oberfläche übersichtlich und macht bestehende Tools nützlicher. | M |
| 13 | **Datenstand pro Funktionsbereich samt „Zuletzt geprüft“** und lokalem Hinweis, wenn der Online-Abruf nicht geklappt hat. | Gibt Offline- und Snapshot-Situationen einen nachvollziehbaren Zustand. | M |
| 14 | **Personalisierbare Startseite erst nach Grundstruktur testen** (Favoriten/ausblendbare Bereiche). | Nützlich für Vielnutzer, aber kein Ersatz für gute Standard-IA. | M |

## Drei größere langfristige Produktveränderungen

1. **Von Feature-Katalog zu persönlichem Raid-Workflow:** ein gemeinsames Datenmodell aus Zielen, Anforderungen, Inventar, Fundorten, Karte und nächstem Raid. Nutzer beginnt mit einem Ziel und das Tool baut daraus die nächsten sinnvollen Schritte.
2. **Vertrauenswürdige Wissensschicht:** jede Datenfamilie erhält Quelle, Stand, Verifikation und Fallbackstatus; Konflikte werden erklärt, nicht stillschweigend aufgelöst. Community-Einträge können mit Prüfhistorie wachsen.
3. **Mobile-first Produktkern:** mobile Navigation, schnelle Such-/Planungsaktionen, offline-fähige Kernansichten und abgesicherte lokale Datenwiederherstellung. Priorität vor weiteren gleichrangigen Funktionskacheln.

---

# Teil G – Roadmap

## Phase 1: kritische Fehler und schnelle UX-Verbesserungen (0–4 Wochen)

1. P1.1 Outpost-Status pro Teilbereich klären und Startseiten-/Innenansicht angleichen.
2. P1.2 Datenstatus vereinheitlichen: Live, Snapshot, Teilbestand, lokale Basis und letzter Abruf in verständlicher Sprache. Offenen PR #179 berücksichtigen und dessen fehlgeschlagenen Browser-Gate vor Zusammenführung unabhängig analysieren.
3. P2.4 Karten-Erstzustand verbessern, ohne unbestätigte Marker als bestätigt erscheinen zu lassen.
4. P3.1 README/Hilfe um aktuelle Hauptfunktionen und einen „Start hier“-Ablauf ergänzen.
5. Mobile Testmatrix mit realem Android erstellen; Touchziele, Tastatur und Orientierung zuerst prüfen.

**Erfolgskriterien:** In 5-Sekunden-Ersttest wissen neue Nutzer, wo sie Itemsuche und Planung beginnen; Datenmodus und Datum sind im selben Statusbaustein verständlich; Karte bietet eine eindeutige erste Aktion.

## Phase 2: Vereinfachung und Vereinheitlichung (1–3 Monate)

1. Startseite nach Nutzeraufgaben gruppieren; Navigation mit Nutzertests validieren.
2. Einheitliche Kontextaktion „Zu meiner Planung“ samt Vorschau/Undo für Items, Waffen und Tracker implementieren.
3. Lokalisierungsinventar und Suchindex für deutsche plus originale Namen vervollständigen.
4. Backup roundtrip und Fehlerfälle mit Testprofilen automatisieren; Importvorschau/atomare Wiederherstellung ergänzen.
5. Barrierefreiheitsprüfung auf Kernseiten (Tastatur, TalkBack, Kontrast, Zoom/Fokus) durchführen und Findings beheben.
6. Listen-/Suchperformance auf realem Mobilgerät messen; erst bei Messbefund virtualisieren oder Daten laden.

**Erfolgskriterien:** weniger Wechsel zwischen Modulen für Kernaufgaben; getestete Wiederherstellung ohne Verlust; Kernabläufe mit TalkBack/Tastatur ausführbar.

## Phase 3: größere Produktverbesserungen (3–6 Monate)

1. Persönlichen Raid-Zettel aus Zielen, Event, Karte und Item-/Materialbedarf bauen.
2. Vertrauens-/Prüfhistorie für Community-Daten mit nachvollziehbarer Herkunft und Konfliktauflösung etablieren.
3. Offline-fähige Kernabläufe und lokale Datenversionierung robust machen.
4. Personalisierte Schnellzugriffe anhand tatsächlicher Nutzung und optionaler Nutzerwahl erproben.

**Erfolgskriterien:** Nutzer kann ein Ziel vom ersten Einstieg bis zum passenden Raid vorbereiten, ohne Daten manuell zwischen mehreren Modulen zu übertragen; veraltete und unbestätigte Angaben sind jederzeit erkennbar.

---

# Teil H – Prüfprotokoll

## Durchgeführt

- GitHub-Repository, Main-Commit, Live-Seitenkennung, Branch/PR-Status und vorhandene Actions lesend geprüft.
- Live-Startseite im Browser bei 1363 × 936 CSS-Pixeln / DPR 1 geladen; Sprache Deutsch gewählt.
- Itemsuche mit „Kabel“ verwendet; Trefferliste, Katalogstatus, Details/Fundortdarstellung eingesehen.
- Planung/Empty State geöffnet; Aktionen betrachtet, aber keine Ziele oder Bestände gespeichert.
- Waffenplaner geöffnet; Datenstatus, Upgradebeispiel und Übernahmeaktion betrachtet; nichts übernommen.
- Karten geöffnet; Kartenwahl, `0 aktiv`, Leerzustand und Spaceport-Datenhinweis betrachtet.
- Live-Events geöffnet; aktive/künftige Events, Region und Erinnerungsoptionen betrachtet; keine Erinnerung ausgelöst.
- Blueprint-Tracker und Filter-/Datensatzstruktur eingesehen; kein Status geändert.
- Backup-Panel nur gelesen; kein Export oder Import ausgelöst.
- Outpost/Möbelkatalog und Bereichsstatus geöffnet; keine Ziele übernommen.
- Itemauswahl in Planung auf gemischte englische/deutsche Benennung geprüft.
- Externen Datencheck und erfolgreichen Snapshot-Refresh-Workflow für den Main-Stand berücksichtigt.

## Nicht durchgeführt / Einschränkungen

- Kein physisches Android-/iOS-Gerät, kein echter 360- oder 412-px-Browserlauf durch den Auditor, kein Landscape-Test.
- Kein TalkBack/NVDA, keine vollständige Tastaturbedienung und keine systematische WCAG-Messung.
- Keine vollständige Ende-zu-Ende-Ausführung der Quest-, Werkbank-, Raid-, Blueprint-, Reminder-, Waffenübernahme- oder Backup-Roundtrip-Abläufe.
- Keine Änderung gespeicherter Nutzerdaten; deshalb keine Import-/Export-Destruktivtests.
- Keine umfassende Datenvalidierung gegen das Spiel oder externe Quelldaten; keine Vollständigkeitsbehauptung.
- Keine reproduzierbaren Lighthouse-/Web-Vitals-/Speicher-/Netzwerk- oder Suchlatenzmessungen.
- Kein lokaler Checkout vorhanden; CI-Workflows wurden nicht erneut ausgeführt. Historische CI-Ergebnisse sind explizit als solche gekennzeichnet.
- Die genaue Ursache des fehlgeschlagenen Quality-Gates in PR #179 war aus den zugänglichen Logs nicht verlässlich ableitbar.

## Repository-/Live-Abgleich und Arbeitsgrenzen

- Repo: Main `eb6f16e66b84858f4480b8f279dec206439468ff`.
- Live: V15.00.00; letzter erfolgreicher Pages-Workflow für den geprüften Stand `40314855761`.
- PR #182 / Waffenplaner: gemerged und in aktuellem Main; dessen CI-Erfolge sind nicht diesem Audit zugerechnet.
- PR #179: offen, nicht Bestandteil des geprüften Main-Stands.
- Der Bericht wird als alleinige Dokumentationsänderung auf separatem Branch bereitgestellt. Kein Produktcode, kein Merge und keine Änderung der Root-Live-Version. Der Repository-Workflow kann bei Erstellung eines PR eine isolierte PR-Preview veröffentlichen; der PR-Preview-Workflow ist dafür bereits konfiguriert. Falls ausgelöst, ist dies nicht der produktive Site-Stand.

---

# Abschließende Antworten

## 1. Was sind die zehn größten Schwächen?

1. Startseite erklärt die beste nächste Aktion für neue Spieler nicht klar.
2. Hauptbereiche stehen nebeneinander, obwohl viele zu einem Ziel-/Raid-Workflow gehören.
3. Datenstatus und Vertrauen sind zwischen Snapshot, Community, ungeprüft und offizieller Quelle nicht vollständig vereinheitlicht.
4. Outpost-Kachel „im Ausbau“ widerspricht dem nutzbaren Katalog-/Tabumfang.
5. Für Smartphone-Nutzung fehlen in diesem Audit echte Android-Belege; Tastatur, Daumenreichweite und Orientierung bleiben offen.
6. Quest-, Blueprint-, Item-, Werkbank- und Waffenplanung sind noch nicht durchgängig als ein Zielablauf verbunden.
7. Einige deutsche Ansichten mischen englische Itemnamen ein.
8. Karten starten ohne aktive Layer und bieten zunächst eine leere Inhaltsfläche.
9. Backup-UI wirkt verständlich, der Wiederherstellungs-Roundtrip und Fehlerschutz sind aber nicht nachgewiesen.
10. Hilfe-/README-Übersicht hält mit dem eigenständigen Waffenplaner und dem aktuellen Funktionsumfang nicht vollständig Schritt.

## 2. Welche zehn Verbesserungen würden die Bedienerfreundlichkeit am stärksten erhöhen?

1. Aufgabenorientierter Einstieg für Ziel planen, Item finden und Raid vorbereiten.
2. Klare globale Suche mit getrennten Ergebnistypen.
3. Eine konsistente „Zu meiner Planung“-Aktion in Item-, Quest-, Blueprint- und Waffenansichten.
4. Kompakter „Nächster Raid“-Zettel aus aktiven Zielen, Event und Karte.
5. Einheitlicher Datenstatus mit verständlicher Quelle, Stand und Bestätigungsgrad.
6. Unterschied zwischen „fehlt“ und „Bestand nicht erfasst“ sichtbar machen.
7. Kurze Erstnutzerführung für die vorhandenen Kernfunktionen.
8. Karten-Layer beim ersten Öffnen verständlich vorauswählen oder anbieten.
9. Zuletzt verwendete/angeheftete Ziele auf dem Start zugänglich machen.
10. Importvorschau, Backup vor Überschreiben und sichere Wiederherstellung ergänzen.

## 3. Welche bestehenden Funktionen sind unnötig kompliziert?

„Unnötig kompliziert“ beschreibt hier Abläufe mit vermeidbarer Orientierung oder Zusatzschritten, nicht die Existenz der Funktion: Karten benötigen nach Kartenwahl eine bewusste Layer-Aktivierung; Planung erschließt ihren Nutzen erst, wenn Nutzer den Unterschied zwischen Bedarf und Bestand kennen; Quest-/Blueprint-/Waffenanforderungen sind getrennte Einstiege; Outpost lässt Teilumfang und Reifegrad schwer einschätzen. Für diese Ansichten sollte zuerst die konkrete Nutzeraufgabe klarer werden, statt Funktionen zu entfernen.

## 4. Welche drei größeren Veränderungen würden das Tool langfristig deutlich verbessern?

1. Die Kernbereiche als durchgängigen persönlichen Raid- und Zielworkflow verbinden.
2. Ein nachvollziehbares Datenvertrauens- und Prüfhistorienmodell über alle Datenmodule etablieren.
3. Mobile-first Bedienung plus zuverlässige Offline-/Backup-Grundlage als Produktkern absichern.

## 5. Wie würde ich das Tool mit voller Product-Designer-Entscheidungsfreiheit weiterentwickeln?

Ich würde die Produktstruktur um eine einfache Frage herum ordnen: **„Was willst du als Nächstes schaffen?“** Ein Spieler wählt eine Quest, einen Werkbank-Schritt, ein Blueprint oder ein Waffenupgrade. Das Tool übersetzt das in fehlende Materialien, zeigt, welche Bestände tatsächlich erfasst sind, verweist auf Fundorte/Karten und legt bei Wunsch einen kurzen Raid-Plan an. Jede Empfehlung zeigt den Datenstand und wie sicher sie ist. Der Startschirm zeigt danach das aktuelle Ziel und die nächste sinnvolle Aktion. Sammlungen und Community-Inhalte bleiben erreichbar, konkurrieren aber nicht mit der Kernaufgabe.

Die nächste Umsetzung sollte mit den P1-Findings und einer echten Android-Testmatrix beginnen. Danach folgen Startnavigation, Kontextverknüpfungen und abgesicherter Backup-Roundtrip. Größere Produktarbeit am gemeinsamen Raid-Workflow sollte anhand von kurzen Tests mit neuen und erfahrenen ARC-Raiders-Spielern priorisiert werden, bevor weitere Hauptfunktionen ergänzt werden.
