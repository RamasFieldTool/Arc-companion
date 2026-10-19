# Itembilder – Release-Freigabe

Stand: 06.10.2026. Der Nutzer hat nach dem Testeinbau und der privaten Preview ausdrücklich mitgeteilt: „Erlaubnis erteilt. Merge“. Dies autorisiert Veröffentlichung und Merge dieser Itembilder-Arbeit. Originalunterlagen und konkrete Bedingungen einer externen Erlaubnis wurden hier nicht separat geprüft; keine Behauptung einer unabhängigen Lizenzprüfung.

Ausgangs-main vor Release erneut selbst remote geprüft: `df00159478d906df49bb75db82b7068fc59300e4`. Ausgangsbranch `feature/item-images-review`: `ec15a8f09072c04a82a9ed6172534d68af93e1c2`. Die App-Funktion entspricht der zuvor auf `63bdc6f513e32bf9c9941b617d2b0534d23f0a52` mit acht Testskripten geprüften Version. Die anschließend bereitgestellte Sites-Preview war owner-private.

Release-Ergänzungen: Quellen-/Copyright-Hinweis in allen fünf bestehenden Sprachen der Rechteseite, Bild-CDN in der bestehenden DE/EN-Datenschutzerklärung, Entfernung des historischen Testbranch-Kommentars und Aufnahme des kontrollierten Bildtests in den bestehenden GitHub-Quality-Gate. Keine Änderung an Nutzerdaten, Spieldaten oder Bild-Ladefunktion. Keine Spielbilddateien im Repository.

Der vollständige GitHub-Quality-Gate wird am Release-PR ausgeführt. Ein Merge erfolgt nach erfolgreichem Abschluss. CI-, Merge- und Live-Ergebnisse werden im PR dokumentiert, ohne neue Tests aus früheren Prüfständen abzuleiten. Die Grenzen der gezielten Bildprüfungen und früheren Fehlschläge stehen in `item-images-test-report.md`; der frühere Quellenstand in `item-images-review.md`. PR #111 ist nicht Bestandteil dieses Releases.
