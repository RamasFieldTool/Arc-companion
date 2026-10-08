# Offline-Vergleich für den Frozen-Trail-Patch

Stand: 08.10.2026. Vorbereitung, keine App- oder Nutzerdatenänderung. Branch `prep/frozen-trail-update`. Noch kein Merge.

## Gesicherte Vergleichsbasis

`docs/data-review/frozen-trail-baseline.json.gz` enthält eine komprimierte Review-Kopie der tatsächlich gelesenen Daten:

- RFT main `25816084d95f4bf379914420e6765ab7c78c437d`: 51 lokale Items, 8 Ziele, 83 Blueprints, 83 Erwerbseinträge, 7 Karten-/Etagen-Einträge.
- RaidTheory `2a4abebb2486a633070f4e260058bcd5ad4511d6`: 581 Items, 100 Quests, 9 Hideout-Datensätze, 13 Projekte, 7 Karten, 45 Skills sowie Händlerdaten als Dokument.
- Bereits abgerufener RFT-Katalog-Snapshot und Remote-Eventfeed aus dem Datenbereitschaftsbericht.
- Für jede eingelesene Git-Datei und beide HTTP-JSON-Dateien ein SHA-256 der Rohdaten. Konkrete RFT-/Upstream-Commits und Erfassungszeit im Bundle.

Diese Zählungen bestätigen gelesene Daten, nicht vollständige Frozen-Trail-Release-Daten. Der Primärkatalog Mahcks war zuvor zweimal mit HTTP 502 nicht lesbar und ist nicht als geprüfter aktueller Datenstand enthalten.

Der Review-Datensatz lässt Beschreibungsfelder weg und begrenzt erkannte Sprachobjekte auf DE/EN/FR/ES/IT. Andere gelieferte Felder bleiben erhalten. Änderungen an Beschreibungen oder anderen Sprachen liegen außerhalb dieses Vergleichs; die Rohdaten-Hashes und Quellcommits ermöglichen einen gezielten Nachabruf. Arrays innerhalb von Datensätzen bleiben reihenfolgensensitiv; bloße Umordnung kann eine Änderung melden und muss eingeordnet werden. Kein Game-Image wird mit dieser Vorbereitung heruntergeladen oder eingebaut.

Die mitgelieferte MIT-Lizenz ist `docs/data-review/RaidTheory-LICENSE.txt`. Sie betrifft die verwendeten Datenquellen; sie bestätigt keine neuen Nutzungsrechte an Spielbildern.

## Hilfswerkzeug

`scripts/data-review.mjs` arbeitet offline mit ausdrücklich angegebenen Git-Refs und bereits heruntergeladenen JSON-Dateien. Es schreibt ausschließlich angegebene Review-Ausgabedateien. Kein Browserzugriff, keine localStorage-Änderung und kein automatischer Datenimport.

Erfassung eines späteren Kandidaten (Platzhalter ersetzen):

```sh
node scripts/data-review.mjs capture \
  --rft-root /pfad/zu/Arc-companion \
  --rft-ref VOLLSTAENDIGER_RFT_COMMIT \
  --upstream-root /pfad/zu/arcraiders-data \
  --upstream-ref VOLLSTAENDIGER_UPSTREAM_COMMIT \
  --snapshot /pfad/zum/aktuell-abgerufenen-snapshot.json \
  --events /pfad/zum/aktuell-abgerufenen-eventfeed.json \
  --out /tmp/frozen-trail-candidate.json.gz
```

Vergleich:

```sh
node scripts/data-review.mjs diff \
  --before docs/data-review/frozen-trail-baseline.json.gz \
  --after /tmp/frozen-trail-candidate.json.gz \
  --out /tmp/frozen-trail-diff.json
```

Der JSON-Bericht zeigt neue, entfernte und geänderte IDs sowie geänderte Felder mit Vorher/Nachher-Werten. Fehlend, null und 0 bleiben unterscheidbar. Händler-/Eventdokumente werden ebenfalls verglichen. Geänderte unbekannte neue Felder werden nicht still übergangen.

Prüfhinweise erkennen unter anderem fehlende/null Itemwerte und Sprachlabels, nicht im Itemkatalog auflösbare bekannte Material-/Item-/Upgrade-/Zahlungsreferenzen sowie negative oder nicht numerische Mengen. Doppelte IDs, fehlende Pflicht-Collections, ungültige Bundle-/Snapshot-Struktur und leere Upstream-Verzeichnisse brechen die Erfassung ab. Bekannte Feldnamen werden geprüft; dies ist kein universeller Validator eines noch unbekannten Research-/Release-Schemas.

Die gespeicherte Basis ergibt 318 Prüfhinweise, dokumentiert in `docs/data-review/frozen-trail-baseline-warnings.json`. Das ist keine Zahl bestätigter RFT-Fehler. Vorhandene Hinweise werden von neu hinzugekommenen getrennt. Nicht katalogisierte Zahlungs-/Belohnungsreferenzen können Währungen statt fehlender Items sein. Beispiel: coins, creds und raider_tokens. Solche Meldungen bestätigen keinen RFT-Fehler und werden nicht automatisch korrigiert. Auch das Alter oder die Vollständigkeit eines Release-Datensatzes wird nicht allein aus einem erfolgreichen Vergleich abgeleitet.

Exitcodes: 0 = Erfassung/Vergleich technisch durchgeführt; 1 = Eingabe-/Struktur-/Ausführungsfehler; 2 = Vergleich geschrieben, aber neue Prüfhinweise vorhanden. Exitcode 0 ist keine Import- oder Merge-Freigabe. Entfernte IDs sind keine Aufforderung, Nutzerfortschritt zu löschen. Der spätere Import braucht gesonderten Review und Tests.

## Tatsächlich ausgeführte Verifikation

- `node tests/data-review.mjs`: vollständiger Lauf mit 14 Fällen erfolgreich. Neue/entfernte IDs, Zahlen-/Rezeptänderungen, Schlüsselreihenfolge, fehlend/null/0, Referenzen, ungültige Mengen, alte/neue Hinweise, doppelte IDs, Teil-Bundles, unbekannte neue Felder und Eingabe-Unveränderlichkeit.
- Vergleich der gespeicherten Basis mit sich selbst: alle Collections ohne Änderungen; keine geänderten Dokumente; keine neuen Hinweise. Das belegt nur die Vergleichsstabilität, nicht Release-Aktualität.
- CLI-Integration mit synthetischem, unbekanntem Rezeptmaterial: Bericht geschrieben, Änderung erkannt, genau ein neuer Hinweis und erwarteter Exitcode 2 bestätigt.
- Syntaxprüfung des Hilfswerkzeugs und `git diff --check` erfolgreich.

FEHLGESCHLAGEN: Erster Testlauf scheiterte beim Reihenfolgetest. Die Testfixture hatte mit einem JSON-Replacer unbeabsichtigt die verschachtelten Sprachkeys entfernt; damit war der Datensatz tatsächlich geändert. Fixture auf bloße Schlüsselumordnung korrigiert, danach vollständiger 14-Fälle-Lauf erfolgreich. Nicht als bestandener Erstlauf ausgegeben.

Noch keine Browser-, Spiel- oder vollständigen GitHub-Quality-Gate-Tests für diese Vorbereitung. Kein App-Build oder Preview nötig: die produktive App nutzt diese Review-Dateien nicht.

## Nächste mögliche Arbeit

Release-Notes und Quellstände nach Veröffentlichung erneut prüfen; nur verifizierte aktualisierte Kandidaten erfassen. Dann den Offline-Diff ausführen und auffällige Änderungen gegen Primärquellen/In-Game-Belege abgleichen. Erst danach eine Umsetzung mit Material-/Planungs-/Backup-Tests starten. Kartenbasis/Marker bleiben separat offen. Kein Merge ohne neue ausdrückliche Freigabe.
