# ARC Companion V14.00.12

Inoffizielles Community-Tool für ARC Raiders. ARC Companion bündelt Ausbauziele, persönliche Planung, Gesamtbedarf, lokalen Bestand, Item-Suche, Quest-Tracking und Community-basierte Raider-Karten in einer mobilen Oberfläche. Übersetzungen und Sprachumschaltung sind – je nach Bereich und Datenlage – für Deutsch, Englisch, Französisch, Spanisch und Italienisch vorhanden. Verfügbar sind DARK-, LIGHT- und BLACK-Darstellung.

## So geht’s

### 1. Aktive Ziele / Werkbank-Stufen
Öffne **Aktive Ziele** und markiere genau die Stationen und Stufen, auf die du aktuell hinarbeitest. Jede aktivierte Stufe liefert ihren Materialbedarf an den Gesamtbedarf. Mehrere Stufen können gleichzeitig aktiv sein. Zusätzliche, nicht als Item geführte Kosten einer Stufe – zum Beispiel Coins – werden ebenfalls berücksichtigt und separat angezeigt.

### 2. Meine Planung, Gesamtbedarf & Bestand
**Meine Planung** bündelt fehlende Materialien, persönliche Sammelziele sowie Werkstatt- und Questziele. Im Bereich **Was fehlt mir?** fasst die App Anforderungen aktiver Werkbank-Stufen, aktiver Quests und aktiver persönlicher Sammelziele zusammen. Für jedes Material siehst du die Gesamtmenge, deinen lokal gespeicherten Bestand und die noch fehlende Menge. Unter **Verwendung anzeigen** lässt sich nachvollziehen, welche Ziele oder Quests den Bedarf verursachen. Zusätzliche Kosten wie Coins erscheinen separat.

Bestandsmengen und Fortschritte werden lokal im Browser/Gerät gespeichert. Sie sind kein Live-Inventar aus ARC Raiders und werden nicht automatisch aus dem Spiel ausgelesen. Du kannst deinen Bestand und gefundene Materialien in der Planung aktualisieren. Die Backup-Funktion dient dazu, Spielerdaten zu sichern und wiederherzustellen.

### 3. Item-Suche
Du musst Itemnamen nicht vollständig eingeben. Die Suche akzeptiert Teilbegriffe und durchsucht deutsche sowie englische Namen.

Die Ergebnisse sind bewusst getrennt:
- **Direkte Treffer**: Items, deren eigener Name zum Suchbegriff passt.
- **Durch Recycling erhältlich**: andere Items, die beim Zerlegen/Recycling das gesuchte Material liefern können. Bei diesen Treffern zeigt **Ergibt / Yields**, welches passende Material entsteht.
- **Mögliche Fundorte**: soweit Daten vorliegen, zeigt die App Community-Angaben zu möglichen ARC-Quellen und Karten. Ein Fund ist damit nicht garantiert.

Damit werden ein direkt gesuchtes Item und mögliche Recycling-Quellen nicht miteinander vermischt.

### 4. Quests
Quests können den Status **Offen**, **Aktiv** oder **Erledigt** erhalten. Der Status wird lokal auf dem Gerät gespeichert.

Wichtig: **Nur aktive Quests fließen in den Gesamtbedarf ein.** Offene und erledigte Quests bleiben im Tracker sichtbar, verändern den Materialbedarf aber nicht. Eine aktive Quest beeinflusst den Bedarf nur, wenn für sie strukturierte benötigte Items vorliegen. Questziele, Auftraggeber, benötigte Items, bereitgestellte Items und Belohnungen werden angezeigt, soweit die Quelldaten diese Informationen enthalten.

Questdaten werden unabhängig vom Item-Katalog geladen. Ein Fehler beim Laden der Questdaten soll daher nicht die Item-Suche blockieren.

### 5. Raider-Karten
Der Kartenbereich zeigt **mögliche Raider-Startpositionen** auf mehreren Maps. Die Marker beruhen auf Community-Daten und Vergleichen verschiedener Community-Quellen.

Diese Punkte sind ausdrücklich:
- ungefähre Positionen,
- keine offiziellen oder von Embark bestätigten Spawnkoordinaten,
- keine Garantie, dass an einem Marker in jedem Raid ein Spieler startet,
- **keine Live-Gegnerpositionen** und kein Spieler-Tracking.

Bei Karten oder Positionen mit unvollständiger Datenlage wird dies in der Oberfläche kenntlich gemacht. Unter **Daten & Quellen** stehen die jeweils hinterlegten Community-Quellen und Hinweise zur Kartenbasis.

### 6. Sprache
Die App enthält Übersetzungen für **DE**, **EN**, **FR**, **ES** und **IT**. Der Umfang kann je nach Funktion und Quelldaten variieren. Wenn eine Übersetzung fehlt, kann ein englischer Originaltext oder ein anderer verfügbarer Datenwert erscheinen.

### 7. DARK / LIGHT / BLACK
Die App bietet drei Darstellungen: **DARK**, **LIGHT** und **BLACK**. Die Auswahl wird lokal gespeichert und beim nächsten Öffnen wieder verwendet.

### 8. Datenstatus: LIVE oder BASISDATENSATZ
Der Status oben rechts zeigt, ob der vollständige Item-Katalog geladen wurde oder die App auf einen Fallback zurückgreift:

- **DATEN // LIVE** / **DATA // LIVE**: Der vollständige Item-Katalog wurde aus der Live-Datenquelle geladen.
- **DATEN // BASISDATENSATZ** / **DATA // BASE DATASET**: Der vollständige Live-Katalog konnte nicht geladen werden; die App verwendet den lokalen `items.json`-Datensatz.

Der Status bezieht sich auf den Item-Katalog und bedeutet nicht, dass ARC Companion Live-Daten direkt aus einem laufenden Spiel erhält.

## Datenquellen & Transparenz

ARC Companion ist ein inoffizielles Community-Projekt. Daten können sich durch Spielupdates ändern, Community-Quellen können voneinander abweichen und einzelne Angaben können unvollständig sein. Wo Unsicherheit relevant ist, soll die App sie sichtbar machen statt eine Genauigkeit vorzutäuschen, die die Quelle nicht hergibt.

- **Items / Live-Katalog:** Mahcks `arcraiders-data-api` (`https://arcdata.mahcks.com/v1/items?full=true`). Der Katalog wird paginiert geladen und auf Vollständigkeit der eindeutigen Item-IDs geprüft.
- **Item-Fallbacks:** Bei einem Fehler oder ungültigen Ergebnis der Mahcks-Quelle versucht die App zunächst den validierten Ramas-Katalog-Snapshot und anschließend den RaidTheory-Katalog auf GitHub. Unvollständige RaidTheory-Daten werden mit lokalen Basisdaten ergänzt. Wenn der Katalog-Ladevorgang insgesamt fehlschlägt, lädt die App `items.json` aus dem Repository.
- **Basisdaten & Quests:** RaidTheory `arcraiders-data` (MIT). Questdateien werden robust in kleinen Batches geladen; einzelne fehlerhafte Dateien sollen den übrigen Tracker nicht unbrauchbar machen.
- **Raider-Karten:** Community-basierte Karten- und Spawninformationen. Die konkreten Quellen pro Karte sind in `maps.json` hinterlegt und werden in der App unter **Daten & Quellen** angezeigt. Community-Positionen sind als ungefähr zu verstehen und nicht offiziell von Embark bestätigt.
- **Externe Dienste:** Einzelne Funktionen laden Daten oder Schriftarten von externen Diensten. Diese Funktionen können eingeschränkt sein, wenn die jeweilige Quelle nicht erreichbar ist.

## Funktionsübersicht V14.00.12

- Teilbegriff-Suche mit getrennten direkten Treffern und Recycling-Quellen.
- Anzeige möglicher Item-Fundorte, soweit Community-Daten verfügbar sind.
- Aktive Werkbank-Stufen und persönliche Sammelziele mit lokal gespeichertem Status.
- Gesamtbedarf mit vorhanden/fehlend, Verwendungsdetails und zusätzlichen Kosten.
- Quest-Tracker mit Offen / Aktiv / Erledigt; nur aktive Quests zählen zum Bedarf.
- Mehrere Community-basierte Raider-Karten mit Zoom, Markern und Quellenhinweisen.
- DARK-, LIGHT- und BLACK-Modus mit lokaler Speicherung.
- Sichtbarer LIVE-/BASISDATENSATZ-Status und mehrere Item-Katalog-Fallbacks.
- Raider Radio, Community-Stories sowie Hilfe direkt in der App.
- Backup- und Wiederherstellungsfunktion für lokale Spielerdaten.

## Pflegehinweis

Neue oder wesentlich geänderte Funktionen sollen künftig nicht nur technisch eingebaut, sondern auch im Abschnitt **So geht’s** und – falls für Nutzer oder Datenherkunft relevant – in diesem README erklärt werden.

Projekt-Repository: `RamasFieldTool/Arc-companion`

ARC Raiders © Embark Studios. Unofficial community project.
