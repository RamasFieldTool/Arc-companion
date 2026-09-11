# ARC Companion V2.12.5

Inoffizielles Community-Tool für ARC Raiders. ARC Companion bündelt Ausbauziele, Gesamtbedarf, lokalen Bestand, Item-Suche, Quest-Tracking und Community-basierte Raider-Karten in einer mobilen Oberfläche. Die App unterstützt Deutsch und Englisch sowie DARK- und LIGHT-Darstellung.

## So geht’s

### 1. Aktive Ziele / Werkbank-Stufen
Öffne **Aktive Ziele** und markiere genau die Stationen und Stufen, auf die du aktuell hinarbeitest. Jede aktivierte Stufe liefert ihren Materialbedarf an den Gesamtbedarf. Mehrere Stufen können gleichzeitig aktiv sein. Zusätzliche, nicht als Item geführte Kosten einer Stufe – zum Beispiel Coins – werden ebenfalls berücksichtigt und separat angezeigt.

### 2. Gesamtbedarf & Bestand
Der Bereich **Gesamtbedarf** fasst die Anforderungen aller aktiven Werkbank-Stufen und aller **aktiven** Quests zusammen. Für jedes Material siehst du die Gesamtmenge, deinen lokal gespeicherten Bestand und die noch fehlende Menge. Bereits vollständig vorhandene Materialien werden entsprechend markiert. Unter **Verwendung anzeigen** lässt sich nachvollziehen, welche Ziele oder Quests den Bedarf verursachen. Zusätzliche Kosten wie Coins erscheinen in einem eigenen Abschnitt.

Die eingegebenen Bestandsmengen werden lokal im Browser/Gerät gespeichert. Sie sind kein Live-Inventar aus ARC Raiders und werden nicht automatisch aus dem Spiel ausgelesen.

### 3. Item-Suche
Du musst Itemnamen nicht vollständig eingeben. Die Suche akzeptiert Teilbegriffe und durchsucht deutsche sowie englische Namen.

Die Ergebnisse sind bewusst getrennt:
- **Direkte Treffer**: Items, deren eigener Name zum Suchbegriff passt.
- **Durch Recycling erhältlich**: andere Items, die beim Zerlegen/Recycling das gesuchte Material liefern können. Bei diesen Treffern zeigt **Ergibt / Yields**, welches passende Material entsteht.

Damit werden ein direkt gesuchtes Item und mögliche Recycling-Quellen nicht miteinander vermischt.

### 4. Quests
Quests können den Status **Offen**, **Aktiv** oder **Erledigt** erhalten. Der Status wird lokal auf dem Gerät gespeichert.

Wichtig: **Nur aktive Quests fließen in den Gesamtbedarf ein.** Offene und erledigte Quests bleiben im Tracker sichtbar, verändern den Materialbedarf aber nicht. Eine aktive Quest beeinflusst den Bedarf nur, wenn für sie strukturierte benötigte Items vorliegen. Questziele, Auftraggeber, benötigte Items, bereitgestellte Items und Belohnungen werden angezeigt, soweit die Quelldaten diese Informationen enthalten.

### 5. Raider-Karten
Der Kartenbereich zeigt **mögliche Raider-Startpositionen** auf mehreren Maps. Die Marker beruhen auf Community-Daten und Vergleichen verschiedener Community-Quellen.

Diese Punkte sind ausdrücklich:
- ungefähre Positionen,
- keine offiziellen oder von Embark bestätigten Spawnkoordinaten,
- keine Garantie, dass an einem Marker in jedem Raid ein Spieler startet,
- **keine Live-Gegnerpositionen** und kein Spieler-Tracking.

Bei Karten oder Positionen mit unvollständiger Datenlage wird dies in der Oberfläche kenntlich gemacht. Unter **Daten & Quellen** stehen die jeweils hinterlegten Community-Quellen und Hinweise zur Kartenbasis.

### 6. Sprache
Oben in der App kann zwischen **DE** und **EN** gewechselt werden. Die Umschaltung betrifft Oberfläche, Hilfetexte und – soweit die Daten es zulassen – Item- und Questinformationen. Falls eine Übersetzung in der Quelle fehlt, kann ein englischer Originaltext als Fallback erscheinen.

### 7. DARK / LIGHT
Die App besitzt zwei Darstellungen. **DARK** ist die wärmere, kräftigere ARC-inspirierte Variante. **LIGHT** ist bewusst deutlich heller und näher an einer hellen Papier-/Terminaldarstellung. Die Auswahl wird lokal gespeichert und beim nächsten Öffnen wieder verwendet.

### 8. Datenstatus: LIVE oder BASISDATENSATZ
Der Status oben rechts zeigt, welche Item-Daten gerade verwendet werden:

- **DATEN // LIVE** / **DATA // LIVE**: Der vollständige Item-Katalog wurde aus der Live-Datenquelle geladen.
- **DATEN // BASISDATENSATZ** / **DATA // BASE DATASET**: Die Live-Datenquelle war nicht vollständig erreichbar oder konnte nicht verlässlich geladen werden. Die App arbeitet dann mit dem lokalen `items.json`-Basisdatensatz weiter.

Der Basisdatensatz hält zentrale Funktionen verfügbar, kann gegenüber der Live-Quelle aber weniger vollständig oder weniger aktuell sein. Der Status bezieht sich auf den Item-Katalog und bedeutet nicht, dass ARC Companion Live-Daten direkt aus einem laufenden Spiel erhält.

## Datenquellen & Transparenz
ARC Companion ist ein inoffizielles Community-Projekt. Daten können sich durch Spielupdates ändern, Community-Quellen können voneinander abweichen und einzelne Angaben können unvollständig sein. Wo Unsicherheit relevant ist, soll die App sie sichtbar machen statt eine Genauigkeit vorzutäuschen, die die Quelle nicht hergibt.

- **Items / Live-Katalog:** Mahcks `arcraiders-data-api` (`https://arcdata.mahcks.com/v1/items?full=true`). Der Katalog wird paginiert geladen und auf Vollständigkeit der eindeutigen Item-IDs geprüft.
- **Lokaler Item-Fallback:** `items.json` im Repository.
- **Basisdaten & Quests:** RaidTheory `arcraiders-data` (MIT). Questdateien werden robust in kleinen Batches geladen; einzelne fehlerhafte Dateien sollen den übrigen Tracker nicht unbrauchbar machen.
- **Raider-Karten:** Community-basierte Karten- und Spawninformationen. Die konkreten Quellen pro Karte sind in `maps.json` hinterlegt und werden in der App unter **Daten & Quellen** angezeigt. Community-Positionen sind als ungefähr zu verstehen und nicht offiziell von Embark bestätigt.

## Funktionsübersicht V2.12.5
- Teilbegriff-Suche in DE/EN mit getrennten direkten Treffern und Recycling-Quellen.
- Aktive Werkbank-Stufen mit lokal gespeichertem Status.
- Gesamtbedarf mit vorhanden/fehlend, Verwendungsdetails und zusätzlichen Kosten.
- Quest-Tracker mit Offen / Aktiv / Erledigt; nur aktive Quests zählen zum Bedarf.
- Mehrere Community-basierte Raider-Karten mit Zoom, Markern und Quellenhinweisen.
- DARK- und LIGHT-Modus mit lokaler Speicherung.
- Sichtbarer LIVE-/BASISDATENSATZ-Status und robuster lokaler Item-Fallback.
- Mobile Schnellnavigation und ausführliche Hilfe direkt in der App.

## Pflegehinweis
Neue oder wesentlich geänderte Funktionen sollen künftig nicht nur technisch eingebaut, sondern auch im Abschnitt **So geht’s** und – falls für Nutzer oder Datenherkunft relevant – in diesem README erklärt werden.

Projekt-Repository: `RamasFieldTool/Arc-companion`

ARC Raiders © Embark Studios. Unofficial community project.