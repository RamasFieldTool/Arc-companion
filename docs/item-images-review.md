# Itembilder – Quellenprüfung und Umsetzungsplan

Stand: 06.10.2026. Ausgangs-main selbst remote geprüft: `df00159478d906df49bb75db82b7068fc59300e4`.
Branch: `feature/item-images-review`. Keine App-Änderung, keine Bilddatei eingebaut, kein Merge.

## VERIFIZIERT

- RaidTheory README: Itembilder sind KI-hochskalierte Versionen aus Spiel-Screenshots. Das Repository nennt MIT, weist die Rechte an sämtlichen Spielinhalten einschließlich Bildern ausdrücklich Embark Studios AB zu. Link: https://github.com/RaidTheory/arcraiders-data
- Konkreter Datensatz selbst per GitHub gelesen: `items/metal_parts.json`, Blob `fccf48142c937e958e1951af8d28979b3af855b4`. ID `metal_parts`, Feld `imageFilename` mit `https://cdn.arctracker.io/items/v2/metal_parts.png`. Die URL-Zuordnung ist bestätigt; Abruf, Bildinhalt und Vollständigkeit des gesamten Bildbestands sind damit nicht bestätigt.
- Der lokale Notfallkatalog `items.json` hat beim geprüften Beispiel keine Bild-URL. Bilder müssen dort optional bleiben.
- Der aktuelle Katalogloader reicht externe Itemobjekte durch. `app.js: card(i)` baut die normale Itemkarte; `search-language-fix.js: recyclingSourceCard(i,query)` die Recyclingkarte. Beide haben derzeit keine neue Itembild-Komponente.
- Die offizielle Embark-Medienseite nennt für Partnerschaften, Publishing und Lizenzierung `partnerships@embark-studios.com`: https://www.embark-studios.com/press
- Die offizielle Medienseite verlinkt einen Media Kit in Google Drive. Der Webabruf lieferte nur die Drive-Hülle; Dateien und mitgelieferte Nutzungsbedingungen konnten darüber nicht gelesen werden. Link: https://drive.google.com/drive/folders/1oBLWvBquqBdEwiQVQTi2WhLU0_B3lp_2
- Die offizielle ARC-Raiders-Hilfeseite verlinkt Terms/EULA, Englisch https://m.nexon.com/terms/825 und Deutsch https://m.nexon.com/terms/826. Englisch wurde inhaltlich gelesen. Abschnitt I beschreibt eine begrenzte persönliche Nutzung und Einschränkungen für Weiterverbreitung; ergänzende Bedingungen können Vorrang haben. Daraus wurde keine ausdrückliche Erlaubnis für Itembilder in unserer App festgestellt. https://id.embark.games/arc-raiders/support/faq/126-terms-of-service-and-end-user-license-agreement
- Die Creator-Program-Seite wurde gelesen. Sie beschreibt das Programm, enthält in den gelesenen Abschnitten aber keine konkrete Freigabe der Itembilder für eine unabhängige App: https://arcraiders.com/creator-program

## NICHT VERIFIZIERT

Eine ausreichende Erlaubnis von Embark für diese konkrete Nutzung und gegebenenfalls zusätzliche Bedingungen des Bildanbieters. Die Recherche ist keine verbindliche juristische Prüfung. Nicht behauptet: Nutzung generell verboten; keine weitere Policy vorhanden; bloßes Kostenlossein oder MIT des Datenprojekts klärt alle Bildrechte.

Geprüfte Suchbegriffe umfassten Embark fan content policy, content creator policy und ARC Raiders fansite image permission. Nicht einschlägige Policies anderer Hersteller und nicht offizielle Fan-Websites wurden nicht als Erlaubnis übernommen.

## Konkrete Umsetzung nach Klärung

1. Zunächst kleine Itembilder in normalen Suchtreffern und Recyclingquellen. Keine Ausweitung auf sämtliche Planungs-/Questlisten in diesem ersten Schritt.
2. Freigegebene Bilder nach stabiler Item-ID zuordnen, mit dokumentierter Herkunft, Freigabenachweis und Prüfsumme. Keine automatische Anzeige beliebiger externer `imageFilename`-URLs.
3. Bevorzugt selbst gehostete, optimierte Thumbnails, sofern die Freigabe Download, Speicherung, Größenänderung und Veröffentlichung abdeckt. Direktzugriffe auf ein fremdes CDN nur bei geklärten Betreiberbedingungen. Diese Hostingentscheidung ist eine Empfehlung, keine bestehende Umsetzung.
4. Vorschlag für das Layout: 48px Thumbnail neben dem Namen auf dem Smartphone, bei ausreichendem Platz bis 64px, feste Maße, `object-fit: contain`, Lazy Loading und asynchrones Decoding. Name, Seltenheit und Itemdaten bleiben lesbar. Ohne Bild oder bei Ladefehler bleibt die heutige Textkarte funktionsfähig; keine erfundenen Ersatz-Spielbilder.
5. Benachbarter Itemname bleibt die zugängliche Bezeichnung; ein rein ergänzendes Thumbnail kann leeren Alttext erhalten, um doppelte Vorlesung zu vermeiden. Kein neuer Pflichttext für fehlende Bilder im Bedienfluss.
6. Quelle und Copyright zentral im vorhandenen Quellen-/Rechtebereich, gemäß tatsächlichen Freigabebedingungen. Freigabe nicht durch bloßen Copyright-Hinweis ersetzen.
7. Keine Änderungen an Bestand, persönlichen Zielen, Fortschritt, Backupformat oder Blueprint-/Spieldaten.

## Geplante Prüfungen – NOCH NICHT AUSGEFÜHRT

- Richtige Zuordnung über Item-ID, fehlende IDs/URLs, ungültige Manifestwerte, Bildfehler und keine unbekannten externen Bildhosts.
- Smartphone 360/412px und Desktop, lange Namen in DE/EN/FR/ES/IT, beide Oberflächen und vorhandene Akzentfarben; kein horizontaler Überlauf und keine Layoutsprünge durch Nachladen.
- Suche und Recyclinggruppen, Ziele aus Suchtreffern, Reload sowie Datenerhalt/Backup auf dem tatsächlichen Implementierungshead.
- Angemessene bestehende Quality-Gate-Prüfungen und Live-Prüfung erst nach ausdrücklicher Merge-Freigabe.

## Jetzt benötigte Klärung

Die vorbereitete Anfrage in `item-images-permission-request.md` ist nicht versendet. Bereits vorhandene individuelle Freigaben oder Bedingungen aus dem Media Kit könnten die offene Frage beantworten; solche Unterlagen liegen in dieser Prüfung nicht vor.

Der Einbau echter Spielbilder bleibt bis zur Klärung zurückgestellt. Die vorliegende Arbeit dokumentiert die Recherche und den konkreten Einbauplan, keine fertig implementierte Bildfunktion.
