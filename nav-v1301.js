// V13.0.0 — compact navigation, language sync and active-section feedback.
(()=>{
  const labels={
    de:{goals:'ZIELE',supply:'BEDARF',items:'SUCHE',more:'MEHR',events:'LIVE-EVENTS',raid:'NÄCHSTER RAID',quests:'QUESTS',blueprints:'BAUPLÄNE',maps:'KARTEN',tips:'TIPPS'},
    en:{goals:'GOALS',supply:'NEEDS',items:'SEARCH',more:'MORE',events:'LIVE EVENTS',raid:'NEXT RAID',quests:'QUESTS',blueprints:'BLUEPRINTS',maps:'MAPS',tips:'TIPS'}
  };
  const nav=document.querySelector('.nav-v1301');
  if(!nav)return;
  const more=nav.querySelector('.nav-more');
  const tracked=[['goals','goalsSection'],['events','liveEventsDrawer'],['raid','nextRaidDrawer'],['supply','supplySection'],['items','itemsSection'],['quests','questDrawer'],['blueprints','blueprintDrawer'],['maps','spawnPanel'],['tips','tipsDrawer']];
  function syncLanguage(){
    const savedLanguage=typeof lang!=='undefined'?lang:(document.getElementById('enBtn')?.classList.contains('active')?'en':document.documentElement.lang);
    const current=savedLanguage==='en'?'en':'de';
    nav.setAttribute('aria-label',current==='en'?'Quick navigation':'Schnellnavigation');
    nav.querySelectorAll('[data-nav-label]').forEach(node=>{node.textContent=labels[current][node.dataset.navLabel]||node.textContent});
  }
  function setActive(key){
    nav.querySelectorAll('[data-nav-key]').forEach(link=>{const active=link.dataset.navKey===key;link.classList.toggle('active',active);if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current')});
    more.classList.toggle('active',['events','raid','quests','blueprints','maps','tips'].includes(key));
  }
  let ticking=false;
  function updateActive(){ticking=false;let current='goals',smallest=Infinity;tracked.forEach(([key,id])=>{const element=document.getElementById(id);if(!element)return;const rect=element.getBoundingClientRect(),distance=Math.abs(rect.top-110);if(rect.bottom>90&&distance<smallest){smallest=distance;current=key}});setActive(current)}
  nav.querySelectorAll('a[href^="#"]').forEach(link=>{link.addEventListener('click',()=>{const target=document.querySelector(link.getAttribute('href'));if(target&&target.tagName==='DETAILS')target.open=true;more.open=false;setActive(link.dataset.navKey)})});
  more.addEventListener('toggle',()=>more.querySelector('summary').setAttribute('aria-expanded',String(more.open)));
  document.addEventListener('click',event=>{if(more.open&&!more.contains(event.target))more.open=false});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')more.open=false});
  window.addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(updateActive)}},{passive:true});
  document.getElementById('deBtn')?.addEventListener('click',()=>setTimeout(syncLanguage,0));
  document.getElementById('enBtn')?.addEventListener('click',()=>setTimeout(syncLanguage,0));
  syncLanguage();updateActive();new MutationObserver(syncLanguage).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();

// Keep the legacy top-level How-To copy aligned with the current planning workflow.
// onboarding-v297.js is intentionally left untouched because it also owns the tested planning-help renderer.
if(typeof HELP_COPY!=='undefined'){
  Object.assign(HELP_COPY.de,{
    helpIntro:'Ramas Field Tool rechnet mit deinen aktiven Zielen, Werkstattstufen und Quests. Planung, Bestand und Fortschritt werden lokal auf diesem Gerät gespeichert.',
    goalsTitle:'1 // MEINE PLANUNG & ZIELE',
    goalsBody:'Öffne „Meine Planung“ und wähle unter „Meine Ziele“ Sammelziele, Werkstattstufen oder Quests. Mehrere Werkstattstufen können gleichzeitig aktiv sein. Unter „Was fehlt mir?“ siehst du den gemeinsamen Materialbedarf.',
    supplyTitle:'2 // WAS FEHLT MIR? & BESTAND',
    supplyBody:'„Was fehlt mir?“ fasst den Bedarf deiner aktiven Ziele zusammen. „Bestand ändern“ setzt die insgesamt vorhandene Menge, „Fund hinzufügen“ addiert neue Funde. Gemeinsame Materialien werden zusammengezählt und dein Bestand nur einmal abgezogen.',
    raidTitle:'3 // RAID BEENDET & ABSCHLUSS',
    raidBody:'Nach einem Raid öffnest du „Raid beendet“, trägst deine Funde ein und übernimmst sie in den Bestand. Abbrechen speichert nichts. Wenn ein Upgrade oder eine Quest wirklich erledigt ist, bestätigst du den Abschluss; benötigte Materialien werden dabei einmal abgezogen.',
    searchBody:'Öffne „Item-Suche“ und suche mit vollständigen Namen oder Teilbegriffen. Direkte Treffer und Recycling-Quellen werden getrennt angezeigt. Über „Sammelziel hinzufügen“ kannst du eine gewünschte Zielmenge in deine Planung übernehmen.',
    questsBody:'Quests können offen, aktiv oder erledigt sein. Aktive Quests mit hinterlegtem Materialbedarf fließen in „Was fehlt mir?“ ein. Vorhandene Materialien bedeuten nur „bereit“; den tatsächlichen Abschluss bestätigst du selbst.',
    displayTitle:'10 // SPRACHE & DARSTELLUNG',
    displayBody:'Das Tool unterstützt DE, EN, FR, ES und IT. Darstellung und Akzentfarben kannst du separat wählen; deine Auswahl wird lokal gespeichert.',
    backupTitle:'11 // DATEN & BACKUP',
    backupBody:'Unter „Backup“ kannst du deine lokal gespeicherten Einstellungen, Planung, Bestände und Fortschritte als Datei sichern. Beim Import wird die Datei geprüft und die vorhandenen lokalen App-Daten erst nach deiner Bestätigung ersetzt. Es wird nichts an uns übertragen.'
  });
  Object.assign(HELP_COPY.en,{
    helpIntro:'Ramas Field Tool calculates from your active goals, workshop levels and quests. Planning, stock and progress are stored locally on this device.',
    goalsTitle:'1 // MY PLANNING & GOALS',
    goalsBody:'Open “My planning” and choose collection goals, workshop levels or quests under “My goals”. Several workshop levels can be active together. “What am I missing?” shows their combined material requirements.',
    supplyTitle:'2 // WHAT AM I MISSING? & STOCK',
    supplyBody:'“What am I missing?” combines the requirements of your active goals. “Change stock” sets the total quantity you own; “Add find” adds newly found items. Shared materials are combined and your stock is deducted only once.',
    raidTitle:'3 // RAID FINISHED & COMPLETION',
    raidBody:'After a raid, open “Raid finished”, enter your finds and apply them to stock. Cancel saves nothing. When an upgrade or quest is actually completed, confirm completion; required materials are deducted once.',
    searchBody:'Open “Item Search” and search with full names or partial words. Direct matches and recycling sources are shown separately. Use “Add collection goal” to add a target quantity to your planning.',
    questsBody:'Quests can be open, active or done. Active quests with stored material requirements contribute to “What am I missing?”. Having the materials only means ready; you confirm the actual completion yourself.',
    displayTitle:'10 // LANGUAGE & DISPLAY',
    displayBody:'The tool supports DE, EN, FR, ES and IT. Display mode and accent colours can be selected separately; your choices are stored locally.',
    backupTitle:'11 // DATA & BACKUP',
    backupBody:'Under “Backup” you can save your locally stored settings, planning, stock and progress to a file. Import validates the file and replaces existing local app data only after your confirmation. Nothing is sent to us.'
  });
}
