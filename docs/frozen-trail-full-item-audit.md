# Vollständiger Katalogdurchlauf – bestehende Items
Stand 09.10.2026, Europe/Zurich. Keine Runtime-Änderung, kein Merge.
Codegrundlage main c097bd124f3fdd8208f1556a4db7fb0c9e8c0953.

## VERIFIZIERT
Alle 581 Zeilen des erneut abgerufenen Snapshots wurden einzeln programmgesteuert verarbeitet; alle Ergebnisse stehen in docs/data-review/frozen-trail-full-item-audit.json.
581 eindeutige IDs, deklarierter count korrekt, keine doppelten IDs.
Alle gelieferten Felder wurden je Item mit den vollständigen RaidTheory-Itemdateien am Commit 2a4abebb2486a633070f4e260058bcd5ad4511d6 verglichen, einschließlich Beschreibungen. Keine Feldabweichungen, keine zusätzlichen/fehlenden IDs.
Numerische Grundfelder value/weightKg/stackSize, Materialmengen in recipe/recyclesInto/salvagesInto/upgradeCost/repairCost/cost, exakte upgradesTo/upgradesFrom-Referenzen und modSlots-Referenzen geprüft.
Keine ungültigen gelieferten Grundwerte oder Mengen und keine unaufgelösten Referenzen in diesen geprüften Feldern. Dies gilt nicht pauschal für beliebige unbekannte Schemas.
Itemnamen für DE/EN/FR/ES/IT vollständig.
22 fehlende Gewichts-/Stackfelder (14 Gewicht, 8 Stack).
69 leere/fehlende Beschreibungs-Sprachfelder: DE14, EN13, FR14, ES14, IT14. Mehrere Meldungen können dasselbe Item betreffen.
88 Zahlungsreferenzen auf coins: Währungsreferenzen, keine fehlenden Spielitems.
Zwei alternative repairMaterials-Schemas bei ferro_i und ferro_iv enthalten durability_increase und materials:null. Keine Reparaturmaterialien daraus erfinden.

## Abgleich mit Release
Die expliziten bestehenden Itemänderungen aus Gameplay/Items/Weapons/Traders der offiziellen 2.0-Notes wurden im ergänzenden Bericht docs/frozen-trail-existing-items-audit.md eingeordnet.
Bestätigte alte Snapshotangaben betreffen Anvil-Seltenheit/Mod-Kompatibilität, Splitter-Recycling, Snap-Hook-Reichweite, Heavy-Shield-Bewegungseinbuße und Tian-Wen-Angebote für Anvil/Hullcracker.
Neue Erwerbs-/Recyclingmengen, unbekannte Waffenwerte und nicht genannte Rezeptänderungen bleiben offen. Allgemeiner Fix für Fundorte nennt keine vollständige Item-/Containerliste und rechtfertigt keine pauschalen Löschungen.

## FEHLGESCHLAGEN / korrigierte Prüfung
Die erste Auditregel behandelte repairMaterials fälschlich wie einen flachen Materialmengen-Dictionary. Dadurch entstanden vier falsche Referenz- und zwei falsche Mengenmeldungen. Nach Sichtprüfung der beiden Ferro-Objekte Regel korrigiert und kompletter 581-Zeilen-Lauf wiederholt. Die falschen Meldungen sind nicht als RFT-Fehler enthalten.
Webtool konnte die offizielle Artikelseite nicht direkt öffnen; Inhalt via Suchabruf gelesen.
Mahcks im erneuten vorangegangenen Abruf HTTP502, daher aktueller Primärkatalog nicht verifiziert.

## TEILWEISE VERIFIZIERT / OFFEN
Dies ist ein vollständiger struktureller Durchlauf des verfügbaren 581-Item-Katalogs und ein vollständiger Feldvergleich mit dessen älterem Upstream. Es ist keine individuelle In-Game-Verifikation sämtlicher Items.
Snapshot generatedAt 2026-09-24T15:55:47.768Z. Übereinstimmung zweier alter Quellen beweist keinen aktuellen 2.0-Stand.
compatibleWith kann Waffenfamilien statt exakter Item-IDs bezeichnen, deshalb nicht als fehlerhafte exakte Referenz bewertet.
Nicht ausgeführt: semantische Qualitätsprüfung jeder Übersetzung/Beschreibung, vollständige Bestätigung jedes Rezepts im Spiel, Bildrechte/-URL-Audit, Browserlauf, Backup-/Restore-Tests oder vollständiger Quality Gate.
Unbekannte Werte erhalten, Nutzerbestände/Planung nicht angefasst. Kein Datenimport und kein Merge.
Offizielle Quelle: https://arcraiders.com/es/news/frozen-trail-2-0-update
