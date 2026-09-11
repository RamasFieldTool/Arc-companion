# ARC Companion V2.3

Neu:
- mehrere aktive Ausbauziele gleichzeitig
- gleiche Items werden über alle aktivierten Ziele aufsummiert
- vorhandene Mengen werden nur einmal abgezogen
- Anzeige der Gründe/Stationen je Item
- lokale Speicherung der aktiven Ziele und Bestände
- Cache-Busting / no-store für JSON-Daten

Beispiel:
Wenn Metallteile für Waffenstation Stufe 1 (20) und Veredler Stufe 1 (60) aktiv sind,
beträgt der Gesamtbedarf 80. Bei 37 vorhandenen Metallteilen fehlen noch 43.

Datenquelle:
https://github.com/RaidTheory/arcraiders-data
