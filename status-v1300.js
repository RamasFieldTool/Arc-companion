// V13.0.13 – persistent user-facing loading/live/fallback status without touching application data logic.
const APP_VERSION='13.0.0';
const STATUS_COPY={
  de:{
    loading:'DATEN // LADEN…',live:'DATEN // LIVE',fallback:'DATEN // BASISDATEN',partial:'DATEN // TEILWEISE',error:'DATEN // FEHLER',
    loadingTitle:'Aktuelle Daten werden geladen',liveTitle:'Aktuelle Daten geladen',fallbackTitle:'Lokaler Basisdatensatz aktiv',
    partialTitle:'Daten nur teilweise verfügbar',errorTitle:'Daten konnten nicht geladen werden',
    fallbackBody:'Der vollständige Live-Katalog ist gerade nicht erreichbar. Suche und Ziele funktionieren mit dem lokalen Basisdatensatz weiter. Dieser kann weniger vollständig oder aktuell sein.'
  },
  en:{
    loading:'DATA // LOADING…',live:'DATA // LIVE',fallback:'DATA // BASE DATA',partial:'DATA // PARTIAL',error:'DATA // ERROR',
    loadingTitle:'Current data is loading',liveTitle:'Current data loaded',fallbackTitle:'Local base dataset active',
    partialTitle:'Data is only partially available',errorTitle:'Data could not be loaded',
    fallbackBody:'The full live catalog is currently unavailable. Search and goals continue with the local base dataset, which may be less complete or current.'
  }
};
function statusCopy(){return STATUS_COPY[lang==='en'?'en':'de']}
function currentDataState(){
  const catalogReady=Array.isArray(items)&&items.length>0;
  const catalogStatus=document.getElementById('status');
  const catalogFailed=!catalogReady&&catalogStatus?.classList.contains('load-error');
  if(catalogFailed)return 'error';
  if(!catalogReady)return 'loading';

  const questsReady=Array.isArray(quests)&&quests.length>0;
  const questsSettled=questsReady||questLoadError===true;
  if(!questsSettled)return 'loading';
  if(usingFallback)return 'fallback';
  if(questLoadError)return 'partial';
  return 'live';
}
function ensurePersistentDataStatus(){
  let dock=document.getElementById('dataStatusDock');
  if(dock)return dock;
  const main=document.querySelector('main');
  if(!main)return null;
  dock=document.createElement('div');
  dock.id='dataStatusDock';
  dock.className='data-status-dock';
  dock.setAttribute('role','status');
  dock.setAttribute('aria-live','polite');
  dock.innerHTML='<span id="dataStatusPersistent" class="data-status loading">DATEN // LADEN…</span><span class="version" data-app-version>V13.0.0</span>';
  const header=document.querySelector('.masthead');
  if(header?.parentNode===main)header.insertAdjacentElement('afterend',dock);
  else main.prepend(dock);
  return dock;
}
function updateStatusElement(el,state,c){
  if(!el)return;
  const labels={loading:c.loading,live:c.live,fallback:c.fallback,partial:c.partial,error:c.error};
  const titles={loading:c.loadingTitle,live:c.liveTitle,fallback:c.fallbackTitle,partial:c.partialTitle,error:c.errorTitle};
  el.textContent=labels[state];
  el.dataset.state=state;
  el.classList.toggle('fallback',state==='fallback');
  el.classList.toggle('loading',state==='loading');
  el.classList.toggle('partial',state==='partial');
  el.classList.toggle('error',state==='error');
  el.title=titles[state];
}
function renderDataStatus(){
  const dock=ensurePersistentDataStatus();
  const headerStatus=document.getElementById('dataStatus');
  const persistentStatus=dock?.querySelector('#dataStatusPersistent');
  const notice=document.getElementById('fallbackNotice');
  const c=statusCopy();
  const state=currentDataState();

  updateStatusElement(headerStatus,state,c);
  updateStatusElement(persistentStatus,state,c);

  if(notice){
    notice.hidden=state!=='fallback';
    if(state==='fallback')notice.innerHTML=`<b>${c.fallbackTitle}</b><span>${c.fallbackBody}</span>`;
  }
  document.querySelectorAll('[data-app-version]').forEach(node=>node.textContent=`V${APP_VERSION}`);
  return state;
}

// Language changes and the final boot render already pass through applyLanguage().
// This compatibility hook refreshes presentation state only.
const baseApplyLanguageV2117=applyLanguage;
applyLanguage=function(){
  baseApplyLanguageV2117();
  renderDataStatus();
};

// app.js starts its asynchronous boot before this file loads. Show LOADING immediately,
// then poll briefly so a hard catalog failure is also reflected even if boot returns early.
let dataStatusPollCount=0;
const dataStatusPoll=setInterval(()=>{
  dataStatusPollCount++;
  const state=renderDataStatus();
  if(state!=='loading'||dataStatusPollCount>=160)clearInterval(dataStatusPoll);
},250);
renderDataStatus();
