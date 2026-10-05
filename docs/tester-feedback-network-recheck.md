# Testerfeedback: Netzwerk-Nachprüfung vom 06.10.2026

**VERIFIZIERT: Die drei zuvor extern gescheiterten lokalen Gesamttests bestanden jetzt mit Exit 0 und ohne zusätzliche Ersatzantworten. Ein vollständiger GitHub-Actions-Lauf wird damit nicht behauptet.**

Diese Nachprüfung ergänzt den [Work-Review vom 05.10.2026](tester-feedback-work-review.md). Sie betrifft die drei damals wegen externer Ladefehler gescheiterten Gesamttests, nicht neue App-Funktionen.

## Geprüfter Stand

- Review-Kette: main → #123 → #124 → #125 → #126.
- Getesteter Commit: `2094243b1e06fac339085cb3230e48f33a4f16ac`.
- Branch: `fix/live-events-fallback-source-label`.
- Remote-main zu Beginn und nach den Abschlussläufen: `c8d666f4819dcfe7ef42e3994a5e6c6c51595425`.
- Während dieser Nachprüfung wurden keine App-Dateien oder Testassertions geändert. `git diff HEAD --name-only` war leer. Neu hinzugefügt wird nur ein Helfer für den Netzwerktransport; anschließend wird der Bericht aktualisiert.

## Tatsächlich ausgeführte Prüfungen

| Prüfung | Ergebnis |
| --- | --- |
| Direkter HTTPS-Abruf beider Google-Fonts-CSS-Dateien | HTTP 200 |
| Direkter HTTPS-Abruf des Remote-Event-Datensatzes | HTTP 200, 134833 Antwortbytes |
| Direkter HTTPS-Abruf der versionierten ARC-Fundortdatei `bots.json` | HTTP 200, 12518 Antwortbytes |
| `tests/user-data-safety.mjs` mit ursprünglichem Chromium-Start | FEHLGESCHLAGEN: externe `net::ERR_EMPTY_RESPONSE`-Konsolenfehler |
| `tests/user-data-safety.mjs` mit korrigiertem Netzwerktransport | VERIFIZIERT: vollständiger Lauf, Exit 0 |
| `tests/ui-regression.mjs` mit korrigiertem Netzwerktransport | VERIFIZIERT: vollständiger Lauf, Exit 0 |
| `tests/raider-radio.mjs` mit korrigiertem Netzwerktransport | VERIFIZIERT: vollständiger Lauf, Exit 0; alle 30 Kombinationen |

Die HTTP-Ergebnisse bestätigen Erreichbarkeit in diesem Abruf, nicht die aktuelle Richtigkeit oder Vollständigkeit der Spieldaten.

Datensicherheit: Start mit vorhandenen Testdaten, simulierter Verbindungsausfall, Backup-/Restore-Rundlauf, Import in einen frischen Browserkontext, aktive/pausierte/erledigte Ziele, Altbackup-Migration und Ablehnung ungültiger/unsicherer Dateien bestanden als vollständiger Testlauf.

Responsive Darstellung: vollständiger Lauf mit kleinen/üblichen Smartphone- und Desktopbreiten, hell/dunkel, Planung, Raid-Eingabe, Funden, Abbruch, Überschuss und Aktualisierung der Fehlmengen bestanden. Eine neu erzeugte Smartphone-Ansicht der Raid-Eingabe wurde geöffnet und visuell geprüft.

Raider Radio: 320/412/1280px × light/black × EN/DE/FR/ES/IT, insgesamt 30 Kombinationen bestanden. Geprüft wurden Sammlung, Original-Assets, Alben, Reload/Zurück, erhaltene Song-URLs, Layout und Laufzeit-/Audiofehler. Die Links zu Suno verwenden weiterhin die im Originaltest vorgesehene Zielseiten-Fixture; eine reale Inhaltsprüfung aller Zielseiten ist damit nicht erfolgt.

## Netzwerkursache und Prüfkonfiguration

Der direkte HTTP-Abruf verwendete den in dieser Ausführungsumgebung konfigurierten Proxy; der ursprüngliche Playwright-Chromium-Start konfigurierte ihn nicht. Ohne Proxy scheiterte der Datensicherheits-Gesamtlauf erneut an externen Ladefehlern. Mit korrigiertem Proxytransport und Freigabe des vorhandenen Proxy-Zertifikats bestand er. Dieser Vergleich bestätigt ein Problem der lokalen Prüfkonfiguration, nicht einen nachgewiesenen RFT-Codefehler.

Die erste explizite Playwright-Proxy-Konfiguration führte zum Laden einer HTTP-502-Seite statt der lokalen App und zu Ready-Timeouts. Chromium-Startargumente mit lokaler Proxy-Ausnahme erreichten die App, aber Google Fonts scheiterte zunächst an `ERR_CERT_AUTHORITY_INVALID`. Der finale Transport:

1. verwendet den vorhandenen `HTTPS_PROXY`/`HTTP_PROXY`;
2. greift auf `localhost`/`127.0.0.1` direkt zu;
3. liest das bereits konfigurierte Zertifikat aus `SSL_CERT_FILE` und setzt nur dessen SHA-256-SPKI-Fingerprint als Chromium-Ausnahme. Es wird kein allgemeines `--ignore-certificate-errors` gesetzt.

Die externen Fonts, Events und ARC-Fundortdaten werden tatsächlich über das Netzwerk geladen. Der frühere Preload `review-controlled-externals.mjs` wurde in diesen Abschlussläufen **nicht** verwendet. Es wurden keine zusätzlichen Testantworten eingespeist, keine Fehlerlistener entfernt und keine Assertions abgeschwächt. Die von den ursprünglichen Tests selbst vorgesehenen Katalog-/Quest-/Suno-Fixtures bleiben vorhanden; diese Tests sind deshalb keine vollständige Inhaltsprüfung aller externen Dienste.

Der reproduzierbare Helfer `tests/helpers/review-network-proxy.mjs` wurde zusätzlich mit dem vollständigen Datensicherheitstest ausgeführt: Exit 0. Er verändert ausschließlich die Chromium-Startargumente, installiert keine Request-Routen und liefert keine Ersatzdaten.

## Weitere tatsächlich gescheiterte Schritte

Die temporäre Chromium-Installation war zu Beginn nicht mehr vorhanden; alle drei ersten Browserstarts scheiterten deshalb vor der App-Prüfung. Sie wurde erneut installiert. Ein zunächst falsch konfigurierter Downloadpfad lieferte HTTP 400; der korrigierte offizielle Downloadpfad funktionierte. Diese Fehler bleiben Infrastrukturfehler und sind keine fehlgeschlagenen RFT-Funktionsassertions.

## Reproduktion

Bei einer Umgebung mit den genannten Proxy-/Zertifikatvariablen, installiertem Playwright 1.55.0 und Chromium sowie einer lokal gestarteten App:

```bash
BASE_URL=http://127.0.0.1:4173/ node --import ./tests/helpers/review-network-proxy.mjs tests/user-data-safety.mjs
BASE_URL=http://127.0.0.1:4173/ node --import ./tests/helpers/review-network-proxy.mjs tests/ui-regression.mjs
BASE_URL=http://127.0.0.1:4173/ node --import ./tests/helpers/review-network-proxy.mjs tests/raider-radio.mjs
```

## Grenzen und Merge

Es wurde kein vollständiger GitHub-Actions-Quality-Gate-Lauf ausgelöst oder als bestanden behauptet. Die übrigen Funktionsprüfungen und ihre Grenzen stehen im vorherigen Work-Review. Bildrechte, Raumhafenbasis, Blueprint-Datenmodell, Trader/Cred und #111 bleiben außerhalb dieses Auftrags.

Kein Merge durchgeführt. Die PRs #123, #124, #125 und #126 bleiben offen und Draft; die ursprüngliche Kette wird weiterverwendet. Es wurde kein neuer RFT-Codefehler gefunden und keine App-Korrektur vorgenommen. Eine ausdrückliche Freigabe für die gestapelte PR-Kette ist weiterhin erforderlich.
