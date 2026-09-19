// V2.13.0 – expanded bilingual in-app help. Keep help copy separate from core render logic.

const HELP_COPY={
  de:{
    flowTitle:'SO GEHT’S // HILFE',
    helpIntro:'ARC Companion rechnet nur mit dem, was du selbst als aktiv markierst. Deine Auswahl und Bestandswerte werden lokal auf diesem Gerät gespeichert.',
    goalsTitle:'1 // AKTIVE ZIELE & WERKBANK',
    goalsBody:'Öffne „Aktive Ziele“ und markiere die Stationen und Stufen, auf die du gerade hinarbeitest. Jede aktivierte Stufe fließt mit ihrem Materialbedarf in den Gesamtbedarf ein. Mehrere Stufen dürfen gleichzeitig aktiv sein. Zusätzliche Kosten einer Stufe, zum Beispiel Coins, werden separat berücksichtigt.',
    supplyTitle:'2 // GESAMTBEDARF & BESTAND',
    supplyBody:'Der Gesamtbedarf addiert die Materialien deiner aktiven Werkbank-Stufen und deiner aktiven Quests. „Vorhanden“ ist dein lokal eingetragener Bestand; daraus berechnet die App, was noch fehlt. „Verwendung anzeigen“ zeigt, welche Ziele oder Quests den Bedarf verursachen. Zusätzliche Kosten wie Coins stehen in einem eigenen Abschnitt.',
    raidTitle:'3 // MEIN NÄCHSTER RAID',
    raidBody:'Merke benötigte Items direkt im Gesamtbedarf oder in der Item-Suche. In deiner Raid-Liste stellst du die gewünschte Menge ein und hakst erledigte Einträge ab. Die Liste wird nur auf diesem Gerät gespeichert. „Erledigte entfernen“ räumt abgeschlossene Einträge auf; „Liste leeren“ setzt die gesamte Planung zurück.',
    searchTitle:'4 // ITEM-SUCHE',
    searchBody:'Teilbegriffe reichen: Du musst den vollständigen Itemnamen nicht kennen. Die Treffer werden getrennt angezeigt. „Direkte Treffer“ passen mit ihrem eigenen Namen zur Suche. „Durch Recycling erhältlich“ zeigt andere Items, die beim Zerlegen das gesuchte Material liefern; „Ergibt“ nennt den passenden Recycling-Ertrag.',
    questsTitle:'5 // QUESTS',
    questsBody:'Jede Quest kann Offen, Aktiv oder Erledigt sein. Wichtig: Nur AKTIVE Quests mit hinterlegten benötigten Items fließen in den Gesamtbedarf ein. Offene und erledigte Quests bleiben im Tracker sichtbar, verändern den Bedarf aber nicht. Der Queststatus wird lokal gespeichert.',
    blueprintsTitle:'6 // BAUPLAN-TRACKER',
    blueprintsBody:'Im Bauplan-Tracker kannst du alle verfügbaren Baupläne durchsuchen und markieren, welche du bereits gelernt hast. Mit ALLE, GELERNT und FEHLT filterst du deinen Fortschritt. Die Markierungen werden lokal auf diesem Gerät gespeichert. „Info / Fundort“ zeigt hinterlegte Hinweise zu Karte, Bedingung, Container, Quest oder Trials. BESTÄTIGT bedeutet, dass die konkrete Angabe unabhängig belegt ist; COMMUNITY-DATEN sind nützliche, aber nicht garantierte Hinweise; NICHT BESTÄTIGT bleibt bewusst offen.',
    mapsTitle:'7 // KARTEN & EBENEN',
    mapsBody:'Auf den Karten kannst du einzelne Ebenen wie mögliche Raider-Startpositionen und Weapon Cases ein- oder ausblenden. Community-Marker sind ungefähr und keine Garantie für einen Spawn. Sie zeigen niemals Live-Gegnerpositionen. Unter „Daten & Quellen“ findest du die für die jeweilige Karte hinterlegten Quellen und Zähler.',
    tipsTitle:'8 // TIPPS & TRICKS',
    tipsBody:'Direkt unter dieser Hilfe findest du praktische Hinweise für bessere Runs. Öffne eine der vier Kategorien; es wird immer nur eine Kategorie gleichzeitig angezeigt. Tippe eine offene Kategorie erneut an, um sie zu schließen. Mit „Tipps schließen“ klappst du den gesamten Bereich wieder ein.',
    displayTitle:'9 // SPRACHE & DARSTELLUNG',
    displayBody:'Mit DE / EN wechselst du die Sprache. DARK und LIGHT sind bewusst deutlich unterschiedlich gestaltet. Die gewählte Darstellung wird lokal gespeichert.',
    backupTitle:'10 // DATEN & BACKUP',
    backupBody:'Unter „Farben einstellen“ kannst du deine lokal gespeicherten Einstellungen und Fortschritte als JSON-Datei sichern. „Backup importieren“ prüft die Datei vollständig und ersetzt die vorhandenen App-Daten erst nach deiner Bestätigung. Es wird nichts in eine Cloud oder an uns übertragen.',
    dataTitle:'11 // DATENSTATUS & QUELLEN',
    dataBody:'„DATEN // LIVE“ bedeutet, dass der vollständige Item-Katalog geladen wurde. Die App versucht zuerst Mahcks’ Daten-API und kann bei Problemen auf die RaidTheory-Daten auf GitHub ausweichen. „DATEN // BASISDATENSATZ“ bedeutet, dass nur der lokale items.json-Fallback aktiv ist; dieser kann weniger vollständig oder aktuell sein. Der Status ist kein Live-Zugriff auf dein laufendes Spiel. Quests und Basisdaten stammen aus RaidTheory; Karten und Bauplan-Fundorte kennzeichnen Community- oder unbestätigte Angaben ausdrücklich.'
  },
  en:{
    flowTitle:'HOW TO // HELP',
    helpIntro:'ARC Companion only calculates from goals and quests you mark as active yourself. Your selections and owned quantities are stored locally on this device.',
    goalsTitle:'1 // ACTIVE GOALS & STATIONS',
    goalsBody:'Open “Active Goals” and select the stations and levels you are currently working toward. Every active level contributes its material requirements to Total Needs. Multiple levels may be active at the same time. Additional level costs, such as Coins, are counted separately.',
    supplyTitle:'2 // TOTAL NEEDS & OWNED ITEMS',
    supplyBody:'Total Needs combines materials from your active station levels and active quests. “Owned” is the amount you entered locally; the app uses it to calculate what is still missing. “Show usage” explains which goals or quests create the requirement. Additional costs such as Coins appear in a separate section.',
    raidTitle:'3 // MY NEXT RAID',
    raidBody:'Save required items directly from Total Needs or Item Search. Set the desired amount in your raid checklist and mark completed entries. The list is stored only on this device. “Remove completed” clears finished entries; “Clear list” resets the entire plan.',
    searchTitle:'4 // ITEM SEARCH',
    searchBody:'Partial words are enough; you do not need the complete item name. Results are separated deliberately. “Direct matches” are items whose own names match the query. “Available through recycling” shows other items that yield the searched material when recycled; “Yields” identifies the matching output.',
    questsTitle:'5 // QUESTS',
    questsBody:'Every quest can be Open, Active or Done. Important: Only ACTIVE quests with structured required items are included in Total Needs. Open and completed quests remain visible in the tracker but do not change requirements. Quest state is stored locally.',
    blueprintsTitle:'6 // BLUEPRINT TRACKER',
    blueprintsBody:'The Blueprint Tracker lets you search the available blueprints and mark which ones you have already learned. Use ALL, LEARNED and MISSING to filter your progress. Your selections are stored locally on this device. “Info / Location” shows stored hints for map, condition, container, quest or Trials. CONFIRMED means the specific field is independently supported; COMMUNITY DATA is useful but not guaranteed; NOT CONFIRMED deliberately remains open.',
    mapsTitle:'7 // MAPS & LAYERS',
    mapsBody:'Map layers such as possible Raider starting positions and Weapon Cases can be switched on or off independently. Community markers are approximate and never guarantee a spawn. They never show live enemy positions. “Data & Sources” lists the stored sources and counters for each map.',
    tipsTitle:'8 // TIPS & TRICKS',
    tipsBody:'Practical advice for better runs appears directly below this help section. Open one of the four categories; only one category is shown at a time. Tap an open category again to close it. Use “Close tips” to collapse the entire section.',
    displayTitle:'9 // LANGUAGE & DISPLAY',
    displayBody:'Use DE / EN to switch language. DARK and LIGHT are deliberately designed to look clearly different. Your selected display mode is stored locally.',
    backupTitle:'10 // DATA & BACKUP',
    backupBody:'Below “Customize Colors” you can save your locally stored settings and progress as a JSON file. “Import Backup” validates the complete file and replaces existing app data only after your confirmation. Nothing is uploaded to a cloud or sent to us.',
    dataTitle:'11 // DATA STATUS & SOURCES',
    dataBody:'“DATA // LIVE” means the complete item catalog has been loaded. The app first tries Mahcks’ data API and can fall back to RaidTheory data on GitHub if that source has problems. “DATA // BASE DATASET” means only the local items.json fallback is active; it may be less complete or current. This status is not live access to your running game. Quests and base data use RaidTheory; maps and blueprint acquisition fields explicitly label community or unconfirmed information.'
  }
};

function helpLang(){return lang==='en'?'en':'de'}
function helpText(key){return HELP_COPY[helpLang()][key]||key}

function renderHelp(){
  const root=document.getElementById('helpContent');
  const title=document.querySelector('[data-onboard-t="flowTitle"]');
  if(title) title.textContent=helpText('flowTitle');
  if(!root) return;
  root.innerHTML=`
    <p class="section-help">${helpText('helpIntro')}</p>
    ${['goals','supply','raid','search','quests','blueprints','maps','tips','display','backup','data'].map(section=>`
      <section class="help-topic">
        <b>${helpText(section+'Title')}</b>
        <p>${helpText(section+'Body')}</p>
      </section>`).join('')}
  `;
}

T.de.supplyHelp='Hier siehst du automatisch, was deine aktiven Werkbank-Stufen und aktiven Quests zusammen benötigen. Vorhandene Mengen ziehst du direkt vom Bedarf ab; zusätzliche Kosten werden separat angezeigt.';
T.en.supplyHelp='This automatically shows what your active station levels and active quests require together. Owned quantities reduce what is missing; additional costs are shown separately.';
T.de.searchHelp='Teilbegriffe reichen. Direkte Treffer und Items, die das gesuchte Material durch Recycling liefern, werden getrennt angezeigt.';
T.en.searchHelp='Partial words are enough. Direct matches and items that yield the searched material through recycling are shown separately.';
T.de.noGoalTitle='Noch kein Ziel ausgewählt';
T.en.noGoalTitle='No goal selected yet';
T.de.noGoalAction='Öffne „Aktive Ziele“ und wähle die Werkbank-Stufen, auf die du gerade hinarbeitest.';
T.en.noGoalAction='Open “Active Goals” and choose the station levels you are currently working toward.';
T.de.questIntro='Quests können Offen, Aktiv oder Erledigt sein. Nur AKTIVE Quests mit benötigten Items fließen in deinen Gesamtbedarf ein.';
T.en.questIntro='Quests can be Open, Active or Done. Only ACTIVE quests with required items are included in your total needs.';

function refreshOnboardingText(){
  document.querySelectorAll('[data-onboard-t]').forEach(el=>{
    const key=el.dataset.onboardT;
    if(T[lang]?.[key]) el.textContent=T[lang][key];
  });
  renderHelp();
}

deBtn.addEventListener('click',refreshOnboardingText);
enBtn.addEventListener('click',refreshOnboardingText);
refreshOnboardingText();
