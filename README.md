# ARC Companion V2.9.4

Inoffizielles Community-Tool für ARC Raiders. Die aktuelle Version verbindet Item-Suche, Ausbauziele, lokalen Bestand und Quest-Tracking in einer mobilen Oberfläche mit DE/EN-Umschaltung.

## Aktueller Stand

### Item-Katalog
- Der vollständige Katalog wird paginiert über `https://arcdata.mahcks.com/v1/items?full=true` geladen.
- Die geladenen eindeutigen Item-IDs werden gegen den von der API gemeldeten Gesamtwert geprüft.
- Falls die API nicht erreichbar ist, wird der lokale Basisdatensatz aus `items.json` als gekennzeichneter Fallback verwendet.
- Beim Öffnen wird nicht die komplette Itemliste ausgegeben. Items erscheinen erst nach einer Suche.
- Die Suche arbeitet mit Teilbegriffen und berücksichtigt deutsche und englische Itemnamen.

### Ausbauziele & Bestand
- Stationen und Stufen können als aktive Ausbauziele markiert werden.
- Der Gesamtbedarf wird aus allen aktiven Ausbauzielen berechnet.
- Eigene Bestandsmengen werden lokal auf dem Gerät gespeichert.
- Die App zeigt, welche Items noch benötigt werden und welche für die aktiven Ziele bereits ausreichend vorhanden sind.

### Quest-Tracker
- Questdaten werden direkt aus dem Quest-Verzeichnis von `RaidTheory/arcraiders-data` auf GitHub geladen.
- Die Questliste ist standardmäßig eingeklappt.
- Quests können durchsucht und nach Offen / Aktiv / Erledigt gefiltert werden.
- Der Queststatus wird lokal auf dem Gerät gespeichert.
- Questziele, Auftraggeber, benötigte Items, bereitgestellte Items und Item-Belohnungen werden angezeigt, sofern diese Daten vorhanden sind.
- Nur aktive Quests mit strukturierten `requiredItemIds` fließen zusätzlich in den Gesamtbedarf ein.
- Expeditionen sind derzeit nicht Bestandteil des Trackers.

### Robuster Questloader – V2.9.4
- Questdateien werden in kleinen Batches geladen.
- Einzelne fehlerhafte oder vorübergehend nicht erreichbare Questdateien brechen den gesamten Quest-Tracker nicht mehr ab.
- Erfolgreich geladene Quests bleiben nutzbar.
- Erst wenn keine einzige verwertbare Quest geladen werden kann, wird der Quest-Load als vollständig fehlgeschlagen behandelt.
- Teilfehler werden zur Diagnose in der Browser-Konsole protokolliert.

### Sprache & Oberfläche
- Umschaltung zwischen Deutsch und Englisch.
- Deutsche Seltenheits- und Typbezeichnungen, soweit eine Übersetzung hinterlegt ist.
- Rajdhani als Hauptschrift; Monospace wird für kleine Systemkennzeichnungen eingesetzt.
- ARC-inspirierte 80er-Farbwelt mit dunklem Olive, warmem Orange, Bernstein und Creme.
- Itemkarten trennen Wert, Gewicht und Stapelgröße.

## Datenquellen
- Items/API: Mahcks `arcraiders-data-api`
- Basisdaten und Quests: RaidTheory `arcraiders-data` (MIT)

ARC Raiders © Embark Studios. Unofficial community project.
