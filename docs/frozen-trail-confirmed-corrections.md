# Bestätigte Itemkorrekturen für Frozen Trail 2.0
Basis-main: c097bd124f3fdd8208f1556a4db7fb0c9e8c0953. Branch fix/frozen-trail-confirmed-items. Kein Merge.
Quelle: https://arcraiders.com/es/news/frozen-trail-2-0-update

Der geladene Katalog wird vor Verwendung berichtigt, unabhängig von Primary-/Snapshot-/lokalem Ladeweg. Keine IDs, Bestände, Fortschritte oder Backupstrukturen geändert.
- Anvil I–IV: alte Uncommon-Seltenheit → Rare; Splitter aus special-Modliste entfernt.
- Anvil Splitter: alte Processor/Mod-Components-Recyclingauskunft entfernt; vorhandene Items bleiben erhalten. Fünfsprachiger Hinweis auf Verkauf/Recycling zu Amplified Fragments mit unbekannter Menge. Eine künftig gelieferte Fragmentmenge wird nicht überschrieben.
- Snap Hook: alte 20m-Reichweite → 18m; bestätigte 4% Verbrauch und Energiekosten60 in fünfsprachiger Beschreibung.
- Heavy Shield: -15 → -10 movementSpeedModifier; altes 15%-Effektlabel ersetzt; Beschreibung zu 10% und decay0.15.
- Tian Wen aus Anvil-/Hullcracker-Angeboten entfernt. Keine unbekannten neuen Händlerpreise ergänzt.
Die korrigierten Beschreibungen und ausstehende Recyclingauskunft berücksichtigen DE/EN/FR/ES/IT auch unter dem bestehenden Such-Sprachpatch.

VERIFIZIERT: gezielter Node-Test für Korrekturen, fünf Sprachtexte, Unveränderlichkeit der Quelle, stabile IDs/Rezepte, erneute Anwendung und Erhalt künftiger Fragmentdaten erfolgreich. data-integrity, planning-core und item-find-locations erfolgreich. JS-Syntax und git diff --check erfolgreich.
FEHLGESCHLAGEN / EXTERN: Browserlauf zunächst ohne installiertes Browserbinary; Download über ersten CDN lieferte ungültiges ZIP, alternativer Download lieferte Chromium. Ausführung damit scheiterte am lokalen socket()-Verbot (Operation not permitted). Keine Browserassertionen ausgeführt, kein bestandener Browserlauf behauptet.
Neue Node- und Browserregressionen im GitHub Quality Gate eingetragen; kompletter CI-Lauf noch ausstehend.

OFFEN: neue Splitter-Fragment-ID/Menge, aktuelle Hauptquelle nach HTTP502, Browser-/Backup-/vollständige CI-Verifikation. Sonstige reine Spiel-Verhaltensfixes (z.B. Zipline, Dolabra) rechtfertigen keine erfundenen RFT-Datenfelder; qualitative Jupiter-/Explosivänderungen keine pauschale Umrechnung eines Basisdamage-Werts. Fehlende alte Werte/Übersetzungen nicht erfunden.
