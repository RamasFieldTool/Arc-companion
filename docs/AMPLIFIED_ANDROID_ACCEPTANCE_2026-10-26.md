# Android-Testprotokoll – Amplified-Waffenplaner
Stand: 26.10.2026 · Testbranch `feature/amplified-weapon-planner-v15` · PR #182

## Testumgebung
Die aktuelle GitHub-Pages-Liveversion verwendet `main`, **nicht** diesen Testbranch. Zum echten Smartphone-Test muss die Testbranch-Version separat bereitgestellt oder lokal als statische Seite gestartet werden. Nicht die Liveversion als Nachweis für die neuen Funktionen verwenden.

## Prüfablauf (Android)
1. Testbranch-Seite auf Android öffnen; die Liveversion nicht verändern.
2. Aussenposten → Forschung & Upgrades → Waffen verbessern öffnen. 15 Waffenfamilien müssen auswählbar sein.
3. Osprey → Ergonomic Bolt auswählen. Erwartung: 3× Fluted Rotor Core; Forschung Action Economy. Die ausgewählte Karte ist hervorgehoben.
4. Jupiter → Ergonomic Bolt auswählen. Gleiches Material/Forschung, eigener gespeicherter Waffenplan.
5. Rascal und Hullcracker → Incendiary Rounds auswählen. Erwartung: je 3× Fossilized Lightning; Compact Combustion Charges.
6. Prüfen, dass inkompatible Upgrades nicht auswählbar sind und dass „Auswahl zurücksetzen“ nur den aktuellen Waffenplan löscht.
7. Forschungs-Checkbox umschalten: Forschungs-Materialbedarf darf nach Abschluss nicht erneut gezählt werden.
8. „Fehlende Materialien für Raid vormerken“ auslösen, danach My Next Raid öffnen. Keine doppelten Einträge, keine verlorenen bestehenden Ziele.
9. Browser aktualisieren. Waffenpläne, Forschung und bisherige Raid-Ziele müssen erhalten bleiben.
10. In Item-Suche eine Amplified-Waffe öffnen. Der Einstieg muss die Aussenposten-Kachel und den Forschungstab öffnen.
11. Sprache DE/EN/FR/ES/IT wechseln, Hoch-/Querformat prüfen, keine abgeschnittenen Bedienelemente.
12. Equalizer prüfen: „Anti Shield“ darf nur als ungeklärter Hinweis erscheinen, nicht als belegtes Upgrade.

## Automatisierte Absicherung
- `Amplified planner validation`: Node-Datenintegrität und Chromium-Mobile-Test (430×932), inklusive vier neuer Upgrades, Sprachen, Speicherung, Raid-Anbindung und Direktnavigation.
- `ARC Companion Quality Gate`: vollständiger statischer Integritäts- und Browser-Regressionssatz für bestehende App-Bereiche.

## Einschränkungen
Die Android-Prüfung ist eine **manuelle Abnahme**, kein durch Chromium ersetzbarer Test. Quellenkonflikt Equalizer Anti Shield bleibt bestehen. Main darf erst nach expliziter Freigabe gemergt werden.
