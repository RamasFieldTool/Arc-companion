// Italian UI language overlay for Ramas Field Tool.
// Uses the existing English engine as fallback for game-sourced names/data.
(()=>{
  const UI_KEY='arcUiLanguage';
  const IT={
    'Ready for your next raid?':'Pronto per il prossimo raid?','Your preparation. All in one place.':'La tua preparazione. Tutto in un unico posto.','← Back':'← Indietro','Open':'Apri','Places and item locations':'Luoghi e posizioni degli oggetti',
    'My next raid':'Il mio prossimo raid','Live events':'Eventi live','My goals':'I miei obiettivi','Requirements':'Materiali necessari','Item search':'Ricerca oggetti','Quests':'Missioni','Blueprints':'Progetti','Maps':'Mappe','Tips':'Consigli','Appearance':'Aspetto','Backup':'Backup','Help':'Aiuto','Community':'Community',
    'ACTIVE GOALS':'OBIETTIVI ATTIVI','CHANGE':'MODIFICA','Total requirements':'MATERIALI TOTALI','SEARCH ITEM':'CERCA OGGETTO','Level':'Livello','Total':'Totale','owned':'posseduti','missing':'mancanti','Value':'Valore','Weight':'Peso','Stack':'Pila','Description':'Descrizione','Recycling':'Riciclaggio','No recycling data':'Nessun dato sul riciclaggio','Enter a search term':'Inserisci un termine di ricerca','matches':'risultati','No results.':'Nessun risultato.',
    'QUESTS':'MISSIONI','Open quest tracker':'Apri il tracker delle missioni','SHOW':'MOSTRA','CLOSE':'CHIUDI','Search quests …':'Cerca missioni …','ALL':'TUTTE','OPEN':'APERTE','ACTIVE':'ATTIVE','DONE':'COMPLETATE','Loading quests …':'Caricamento missioni …','Objectives':'Obiettivi','Required items':'Oggetti necessari','Rewards':'Ricompense','Granted':'Forniti','Quest giver':'Committente','No item requirements':'Nessun oggetto richiesto','No item rewards':'Nessuna ricompensa in oggetti','Quest':'Missione','active':'attive',
    'DATA // LOADING…':'DATI // CARICAMENTO…','DATA // LIVE':'DATI // LIVE','DATA // BASE DATA':'DATI // DATI BASE','DATA // PARTIAL':'DATI // PARZIALI','DATA // ERROR':'DATI // ERRORE','Current data is loading':'Caricamento dei dati attuali','Current data loaded':'Dati attuali caricati','Data could not be loaded':'Impossibile caricare i dati',
    'Show needs and inventory':'Mostra materiali e inventario','CLOSE REQUIREMENTS':'CHIUDI MATERIALI','ITEM SEARCH':'RICERCA OGGETTI','Item or material':'Oggetto o materiale','ITEM OR MATERIAL':'OGGETTO O MATERIALE','CLOSE ITEM SEARCH':'CHIUDI RICERCA','INFO':'INFO','BACKUP':'BACKUP',
    'MY NEXT RAID':'IL MIO PROSSIMO RAID','No saved items yet':'Nessun oggetto salvato','items':'oggetti','done':'completati','PERSONAL LIST':'LISTA PERSONALE','WORKSHOP':'OFFICINA','QUEST':'MISSIONE','QUEST + WORKSHOP':'MISSIONE + OFFICINA','AMOUNT':'QUANTITÀ','＋ NEXT RAID':'＋ PROSSIMO RAID','✓ SAVED':'✓ SALVATO','Remove item':'Rimuovi oggetto','REMOVE COMPLETED':'RIMUOVI COMPLETATI','CLEAR LIST':'SVUOTA LISTA','CLOSE RAID LIST':'CHIUDI LISTA RAID','RAID FINISHED':'RAID TERMINATO','LOG FINDINGS':'REGISTRA RITROVAMENTI','FOUND':'TROVATO','Decrease amount':'Riduci quantità','Increase amount':'Aumenta quantità','APPLY FINDINGS':'APPLICA RITROVAMENTI','NO RELEVANT FINDS':'NESSUN RITROVAMENTO UTILE','CANCEL':'ANNULLA','Saving on this device failed.':'Salvataggio sul dispositivo non riuscito.','Any surplus is kept as owned stock.':'Le quantità in eccesso restano nell’inventario.',
    'LIVE EVENTS':'EVENTI LIVE','Loading official data …':'Caricamento dati ufficiali …','SERVER REGION':'REGIONE SERVER','REMINDER':'PROMEMORIA','ACTIVE NOW':'ATTIVO ORA','UP NEXT':'PROSSIMAMENTE','Source: official Embark feed':'Fonte: feed ufficiale Embark','OFFICIAL OVERVIEW':'PANORAMICA UFFICIALE','CLOSE EVENTS':'CHIUDI EVENTI','REMIND ME':'RICORDAMI','SAVED':'SALVATO','Ends':'Fine','Starts':'Inizio','EUROPE':'EUROPA','NORTH AMERICA':'NORD AMERICA','BRAZIL':'BRASILE','EAST ASIA':'ASIA ORIENTALE','OCEANIA':'OCEANIA',
    'BLUEPRINTS':'PROGETTI','LEARNED':'APPRESI','MISSING':'MANCANTI','Blueprint':'Progetto','learned':'appresi','Progress is saved on this device':'I progressi vengono salvati su questo dispositivo','Search blueprints …':'Cerca progetti …','INFO / LOCATION':'INFO / POSIZIONE','Map':'Mappa','Condition':'Condizione','Container':'Contenitore','Trials':'Prove','Not confirmed':'Non confermato','Yes':'Sì','No':'No','COMMUNITY DATA':'DATI COMMUNITY','CONFIRMED':'CONFERMATO',
    'DATA & BACKUP':'DATI E BACKUP','Save or restore your progress':'Salva o ripristina i tuoi progressi','CREATE BACKUP':'CREA BACKUP','IMPORT BACKUP':'IMPORTA BACKUP','No cloud · no account · nothing is sent to us':'Nessun cloud · nessun account · non ci viene inviato nulla','CLOSE BACKUP':'CHIUDI BACKUP','Backup was saved on your device.':'Il backup è stato salvato sul dispositivo.','Choose a valid backup file.':'Scegli un file di backup valido.','The file is too large and was not opened.':'Il file è troppo grande e non è stato aperto.','This file is not a valid Ramas Field Tool backup.':'Questo file non è un backup valido di Ramas Field Tool.','Backup imported successfully. Reloading the app …':'Backup importato correttamente. Ricaricamento dell’app …','The backup could not be imported.':'Impossibile importare il backup.',
    'Select map':'Seleziona mappa','MAP LAYERS':'LIVELLI MAPPA','RAIDER SPAWNS':'SPAWN RAIDER','WEAPON CASES':'CASSE ARMI','No layer active':'Nessun livello attivo','USE MAP':'USA MAPPA','OPEN LARGE MAP':'APRI MAPPA GRANDE','MAP // LARGE VIEW':'MAPPA // VISTA GRANDE','Map ready':'Mappa pronta','DATA & SOURCES':'DATI E FONTI',
    'TIPS & TRICKS':'CONSIGLI E TRUCCHI','Knowledge for better runs':'Informazioni per raid migliori','CLOSE TIPS':'CHIUDI CONSIGLI','TIPS':'CONSIGLI','START & MOVEMENT':'INIZIO E MOVIMENTO','LOOT & PROGRESSION':'LOOT E PROGRESSIONE','SURVIVAL & EXTRACTION':'SOPRAVVIVENZA ED ESTRAZIONE','RAIDERS & COOPERATION':'RAIDER E COOPERAZIONE','GROUP ON FACEBOOK':'GRUPPO SU FACEBOOK','THE FIRST TESTERS':'I PRIMI TESTER'
  };
  const tileIT={nextRaidDrawer:'Il mio prossimo raid',liveEventsDrawer:'Eventi live',goalsSection:'I miei obiettivi',supplySection:'Materiali necessari',itemsSection:'Ricerca oggetti',questDrawer:'Missioni',blueprintDrawer:'Progetti',spawnPanel:'Mappe',raiderRadio:'Raider Radio'};
  let active=false, observer=null, syncing=false, scheduled=false;
  const safeGet=k=>{try{return localStorage.getItem(k)}catch{return null}};
  const safeSet=(k,v)=>{try{localStorage.setItem(k,v)}catch{}};
  function translateText(value){
    if(typeof value!=='string')return value;
    const t=value.trim(); if(!t)return value;
    const hit=IT[t]; if(!hit)return value;
    return (value.match(/^\s*/)?.[0]||'')+hit+(value.match(/\s*$/)?.[0]||'');
  }
  function translateTree(root=document.body){
    if(!active||!root)return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(n){return n.parentElement?.matches('script,style,textarea,input,option')?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}});
    const nodes=[];let n;while((n=walker.nextNode()))nodes.push(n);
    nodes.forEach(x=>{const v=translateText(x.nodeValue||'');if(v!==x.nodeValue)x.nodeValue=v});
  }
  function setText(node,value){if(node&&node.textContent!==value)node.textContent=value}
  function sync(){
    if(!active||syncing)return; syncing=true;
    try{
      if(document.documentElement.lang!=='it')document.documentElement.lang='it';if(document.documentElement.dataset.uiLanguage!=='it')document.documentElement.dataset.uiLanguage='it';
      const h=document.getElementById('launcherHeading');setText(h,'Pronto per il prossimo raid?');
      const s=document.getElementById('launcherSubtitle');setText(s,'La tua preparazione. Tutto in un unico posto.');
      const back=document.getElementById('appBack');setText(back,'← Indietro');
      Object.entries(tileIT).forEach(([id,label])=>{const tile=document.querySelector(`#appLauncher [data-app-target="${id}"]`);if(tile){const b=tile.querySelector('b');setText(b,label);const small=tile.querySelector('small');if(small&&id!=='spawnPanel')setText(small,'Apri');if(small&&id==='spawnPanel')setText(small,'Luoghi e posizioni degli oggetti')}});
      const util=['Consigli','Aspetto','Backup','Aiuto','Community'];document.querySelectorAll('#appLauncher .launcher-utilities button').forEach((b,i)=>{if(util[i])setText(b,util[i])});
      translateTree();
      const btn=document.getElementById('itBtn');if(btn)btn.classList.add('active');document.getElementById('deBtn')?.classList.remove('active');document.getElementById('enBtn')?.classList.remove('active');
    }finally{syncing=false}
  }
  function setItalian(){
    active=true;safeSet(UI_KEY,'it');safeSet('arcLang','en');
    try{if(typeof lang!=='undefined')lang='en';if(typeof applyLanguage==='function')applyLanguage()}catch{}
    sync();setTimeout(sync,50);setTimeout(sync,250);window.dispatchEvent(new CustomEvent('arc-language-change',{detail:{language:'it'}}));
  }
  function leaveItalian(){active=false;if(observer){observer.disconnect();observer=null}document.getElementById('itBtn')?.classList.remove('active')}
  function install(){
    const host=document.querySelector('.lang-switch');if(!host||document.getElementById('itBtn'))return;
    const sep=document.createElement('span');sep.textContent='/';
    const btn=document.createElement('button');btn.id='itBtn';btn.className='lang';btn.type='button';btn.textContent='IT';btn.title='Italiano';btn.setAttribute('aria-label','Italiano');
    btn.addEventListener('click',()=>{setItalian();startObserver()});host.append(sep,btn);
    document.getElementById('deBtn')?.addEventListener('click',()=>{leaveItalian();safeSet(UI_KEY,'de')});
    document.getElementById('enBtn')?.addEventListener('click',()=>{leaveItalian();safeSet(UI_KEY,'en')});
    if(safeGet(UI_KEY)==='it'){setItalian();startObserver()}
  }
  function startObserver(){if(observer)return;observer=new MutationObserver(()=>{if(active&&!syncing&&!scheduled){scheduled=true;requestAnimationFrame(()=>{scheduled=false;sync()})}});observer.observe(document.body,{subtree:true,childList:true,characterData:true})}
  window.addEventListener('arc-language-change',event=>{if(event.detail?.language&&event.detail.language!=='it')leaveItalian()});
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',install,{once:true}):install();
})();
