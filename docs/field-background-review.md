# Field Manual – Seitenhintergrund

06.10.2026. Auf dem offenen Testbranch feature/item-images-all-lists / PR #128. Remote-main e4acf940adef295454246f1cbb79ba0d76900f51 und Branch-Head e8cf2a9572277c5631dc73a667381217ddf93fe1 vor Beginn selbst geprüft. Kein Merge.

Nur Seitenhintergrund: helle Papierstruktur und dunkle Körnung mit schwachem technischem Raster, CSS mit eingebettetem selbst definiertem SVG-Filter. Keine externen Texturdateien, Animationen oder zusätzlichen Netzabrufe. Das bestehende main-Element wird transparent, damit es den Hintergrund nicht verdeckt. Der bestehende Theme-Wechsel setzt denselben Hintergrundwert über eine CSS-Variable. Kachel-/Komponentenregeln, Akzentfarben, Nutzerdaten und Speicherschlüssel bleiben unverändert.

VERIFIZIERT: Lokaler vollständiger Vergleich über 16 Fälle: light/black × orange/amber/green/cyan × 360/1280px. Bisherige HTML-Datei aus dem gespeicherten Branch-Head geladen, danach nur neue Hintergrundregeln und Hintergrund-Synchronisierung aktiviert. Vorher/Nachher-Vergleich aller Launcher-Kacheln bestätigt identischen Inhalt, Hintergrund, Textfarbe, Rahmen, Schatten, Breite und Höhe. Startseite, Planung und Suche: Hintergrundstruktur vorhanden, main transparent, kein horizontaler Seitenüberlauf, keine erfassten JavaScript-Fehler. Mobile Screenshots für beide Oberflächen angesehen. tests/data-integrity.mjs und git diff --check Exitcode 0.

FEHLGESCHLAGEN: Erster Vergleichsversuch wurde durch den Sprachauswahl-Erststartdialog blockiert; die Testinitialisierung hatte keine gespeicherte Sprache gesetzt. Sprache im Test ergänzt; vollständiger nachfolgender 16-Fälle-Lauf erfolgreich. Die App wurde deswegen nicht verändert.

TEILWEISE VERIFIZIERT: Der Kachelvergleich und Navigation verwenden kontrollierte Katalogantworten. Kein physischer Android-Test oder vollständiges Kontrastaudit. Der Vergleich prüft berechnete Kachelstile und Maße, keine Pixelidentität des ganzen Bildschirms.

OFFEN zum Zeitpunkt der Speicherung: Aktualisierte PR-Preview und neuer GitHub Quality Gate. Ergebnisse für den neuen Head werden im PR selbst ergänzt. Der erfolgreiche frühere Quality Gate gehört ausschließlich zu e8cf2a9572277c5631dc73a667381217ddf93fe1.
