// V2.12.5 – expanded bilingual in-app help. Keep help copy separate from core render logic.

const HELP_COPY={
  de:{
    flowTitle:'SO GEHT’S // HILFE',
    helpIntro:'ARC Companion rechnet nur mit dem, was du selbst als aktiv markierst. Deine Auswahl und Bestandswerte werden lokal auf diesem Gerät gespeichert.',
    goalsTitle:'1 // AKTIVE ZIELE & WERKBANK',
    goalsBody:'Öffne „Aktive Ziele“ und markiere die Stationen und Stufen, auf die du gerade hinarbeitest. Jede aktivierte Stufe fließt mit ihrem Materialbedarf in den Gesamtbedarf ein. Mehrere Stufen dürfen gleichzeitig aktiv sein. Zusätzliche Kosten einer Stufe, zum Beispiel Coins, werden separat berücksichtigt.',
    supplyTitle:'2 // GESAMTBEDARF & BESTAND',
    supplyBody:'Der Gesamtbedarf addiert die Materialien deiner aktiven Werkbank-Stufen und deiner aktiven Quests. „Vorhanden“ ist dein lokal eingetragener Bestand; daraus berechnet die App, was noch fehlt. „Verwendung anzeigen“ zeigt, welche Ziele oder Quests den Bedarf verursachen. Zusätzliche Kosten wie Coins stehen in einem eigenen Abschnitt.',
    searchTitle:'3 // ITEM-SUCHE',
    searchBody:'Teilbegriffe reichen: Du musst den vollständigen Itemnamen nicht kennen. Die Treffer werden getrennt angezeigt. „Direkte Treffer“ passen mit ihrem eigenen Namen zur Suche. „Durch Recycling erhältlich“ zeigt andere Items, die beim Zerlegen das gesuchte Material liefern; „Ergibt“ nennt den passenden Recycling-Ertrag.',
    questsTitle:'4 // QUESTS',
    questsBody:'Jede Quest kann Offen, Aktiv oder Erledigt sein. Wichtig: Nur AKTIVE Quests mit hinterlegten benötigten Items fließen in den Gesamtbedarf ein. Offene und erledigte Quests bleiben im Tracker sichtbar, verändern den Bedarf aber nicht. Der Queststatus wird lokal gespeichert.',
    mapsTitle:'5 // RAIDER-KARTEN',
    mapsBody:'Die Marker zeigen mögliche Raider-Startpositionen aus Community-Daten. Die Positionen sind ungefähr, nicht offiziell oder exakt von Embark bestätigt und keine Garantie für einen Spawn. Sie zeigen niemals Live-Gegnerpositionen. Unter „Daten & Quellen“ findest du die für die jeweilige Karte hinterlegten Community-Quellen.',
    displayTitle:'6 // SPRACHE & DARSTELLUNG',
    displayBody:'Mit DE / EN wechselst du die Sprache. DARK ist die wärmere, kräftigere ARC-inspirierte Darstellung; LIGHT ist bewusst deutlich heller. Die gewählte Darstellung wird lokal gespeichert.',
    dataTitle:'7 // DATENSTATUS & QUELLEN',
    dataBody:'„DATEN // LIVE“ bedeutet, dass der vollständige Item-Katalog aus der Live-Datenquelle geladen wurde. „DATEN // BASISDATENSATZ“ bedeutet, dass die App mit dem lokalen items.json-Fallback arbeitet. Dieser kann weniger vollständig oder aktuell sein. Der Status ist kein Live-Zugriff auf dein laufendes Spiel. Items stammen primär aus Mahcks’ Daten-API, Basisdaten und Quests aus RaidTheory; Karten nutzen separat ausgewiesene Community-Quellen. Bei unsicheren Kartendaten werden Positionen ausdrücklich nur als ungefähr bezeichnet.'
  },
  en:{
    flowTitle:'HOW TO // HELP',
    helpIntro:'ARC Companion only calculates from goals and quests you mark as active yourself. Your selections and owned quantities are stored locally on this device.',
    goalsTitle:'1 // ACTIVE GOALS & STATIONS',
    goalsBody:'Open “Active Goals” and select the stations and levels you are currently working toward. Every active level contributes its material requirements to Total Needs. Multiple levels may be active at the same time. Additional level costs, such as Coins, are counted separately.',
    supplyTitle:'2 // TOTAL NEEDS & OWNED ITEMS',
    supplyBody:'Total Needs combines materials from your active station levels and active quests. “Owned” is the amount you entered locally; the app uses it to calculate what is still missing. “Show usage” explains which goals or quests create the requirement. Additional costs such as Coins appear in a separate section.',
    searchTitle:'3 // ITEM SEARCH',
    searchBody:'Partial words are enough; you do not need the complete item name. Results are separated deliberately. “Direct matches” are items whose own names match the query. “Available through recycling” shows other items that yield the searched material when recycled; “Yields” identifies the matching output.',
    questsTitle:'4 // QUESTS',
    questsBody:'Every quest can be Open, Active or Done. Important: Only ACTIVE quests with structured required items are included in Total Needs. Open and completed quests remain visible in the tracker but do not change requirements. Quest state is stored locally.',
    mapsTitle:'5 // RAIDER MAPS',
    mapsBody:'Markers show possible Raider starting positions based on community data. Positions are approximate, not official or exact Embark spawn coordinates, and never guarantee a spawn. They never show live enemy positions. “Data & Sources” lists the community sources stored for each map.',
    displayTitle:'6 // LANGUAGE & DISPLAY',
    displayBody:'Use DE / EN to switch language. DARK is the warmer, stronger ARC-inspired presentation; LIGHT is intentionally much brighter. Your selected display mode is stored locally.',
    dataTitle:'7 // DATA STATUS & SOURCES',
    dataBody:'“DATA // LIVE” means the complete item catalog was loaded from the live data source. “DATA // BASE DATASET” means the app is using its local items.json fallback, which may be less complete or current. This status is not live access to your running game. Items primarily use Mahcks’ data API, base data and quests use RaidTheory, and maps use separately listed community sources. Uncertain map positions are explicitly described as approximate.'
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
    ${['goals','supply','search','quests','maps','display','data'].map(section=>`
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
