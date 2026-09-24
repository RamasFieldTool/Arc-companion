// V13.0.17 – persistent user-facing loading/live/partial/fallback status.
const APP_VERSION='13.0.17';
const STATUS_COPY={
  de:{
    loading:'DATEN // LADEN…',live:'DATEN // LIVE',fallback:'DATEN // BASISDATEN',partial:'DATEN // TEILWEISE',error:'DATEN // FEHLER',
    loadingTitle:'Aktuelle Daten werden geladen',liveTitle:'Aktuelle Daten geladen',fallbackTitle:'Lokaler Basisdatensatz aktiv',
    partialTitle:'Daten nur teilweise verfügbar',errorTitle:'Daten konnten nicht geladen werden',
    fallbackBody:'Der vollständige Live-Katalog ist gerade nicht erreichbar. Suche und Ziele funktionieren mit dem lokalen Basisdatensatz weiter. Dieser kann weniger vollständig oder aktuell sein.',
    partialBody:'Der externe Katalog wurde nur teilweise geladen. Fehlende Einträge wurden soweit möglich mit lokalen Basisdaten ergänzt.'
  },
  en:{
    loading:'DATA // LOADING…',live:'DATA // LIVE',fallback:'DATA // BASE DATA',partial:'DATA // PARTIAL',error:'DATA // ERROR',
    loadingTitle:'Current data is loading',liveTitle:'Current data loaded',fallbackTitle:'Local base dataset active',
    partialTitle:'Data is only partially available',errorTitle:'Data could not be loaded',
    fallbackBody:'The full live catalog is currently unavailable. Search and goals continue with the local base dataset, which may be less complete or current.',
    partialBody:'The external catalog loaded only partially. Missing entries were supplemented with local base data where possible.'
  },
  fr:{
    loading:'DONNÉES // CHARGEMENT…',live:'DONNÉES // À JOUR',fallback:'DONNÉES // BASE LOCALE',partial:'DONNÉES // PARTIELLES',error:'DONNÉES // ERREUR',
    loadingTitle:'Chargement des données actuelles',liveTitle:'Données actuelles chargées',fallbackTitle:'Données locales de base actives',
    partialTitle:'Données disponibles partiellement',errorTitle:'Impossible de charger les données',
    fallbackBody:'Le catalogue complet en direct est indisponible. La recherche et les objectifs continuent avec les données locales de base, qui peuvent être moins complètes ou moins récentes.',
    partialBody:'Le catalogue externe n’a été chargé que partiellement. Les entrées manquantes ont été complétées avec les données locales lorsque possible.'
  },
  es:{
    loading:'DATOS // CARGANDO…',live:'DATOS // ACTUALIZADOS',fallback:'DATOS // BASE LOCAL',partial:'DATOS // PARCIALES',error:'DATOS // ERROR',
    loadingTitle:'Cargando datos actuales',liveTitle:'Datos actuales cargados',fallbackTitle:'Datos locales básicos activos',
    partialTitle:'Los datos solo están disponibles parcialmente',errorTitle:'No se pudieron cargar los datos',
    fallbackBody:'El catálogo completo no está disponible. La búsqueda y los objetivos continúan con los datos locales básicos, que pueden ser menos completos o actuales.',
    partialBody:'El catálogo externo se cargó solo parcialmente. Las entradas que faltan se completaron con datos locales cuando fue posible.'
  }
};
function statusLanguage(){
  try{
    const ui=localStorage.getItem('arcUiLanguage');
    if(Object.prototype.hasOwnProperty.call(STATUS_COPY,ui))return ui;
  }catch{}
  return lang==='en'?'en':'de';
}
function statusCopy(){return STATUS_COPY[statusLanguage()]||STATUS_COPY.en}
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
  if(window.__arcCatalogMeta?.partial===true)return 'partial';
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
  dock.innerHTML=`<span id="dataStatusPersistent" class="data-status loading">DATA // LOADING…</span><span class="version" data-app-version>V${APP_VERSION}</span>`;
  const header=document.querySelector('.masthead');
  if(header?.parentNode===main)header.insertAdjacentElement('afterend',dock);
  else main.prepend(dock);
  return dock;
}
function updateStatusElement(el,state,c){
  if(!el)return;
  const labels={loading:c.loading,live:c.live,fallback:c.fallback,partial:c.partial,error:c.error};
  const titles={loading:c.loadingTitle,live:c.liveTitle,fallback:c.fallbackTitle,partial:c.partialTitle,error:c.errorTitle};
  if(el.textContent!==labels[state])el.textContent=labels[state];
  if(el.dataset.state!==state)el.dataset.state=state;
  el.classList.toggle('fallback',state==='fallback');
  el.classList.toggle('loading',state==='loading');
  el.classList.toggle('partial',state==='partial');
  el.classList.toggle('error',state==='error');
  if(el.title!==titles[state])el.title=titles[state];
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
    notice.hidden=state!=='fallback'&&state!=='partial';
    const nextHtml=state==='fallback'?`<b>${c.fallbackTitle}</b><span>${c.fallbackBody}</span>`:state==='partial'?`<b>${c.partialTitle}</b><span>${c.partialBody}</span>`:'';
    if(nextHtml&&notice.innerHTML!==nextHtml)notice.innerHTML=nextHtml;
  }
  document.querySelectorAll('[data-app-version]').forEach(node=>{const next=`V${APP_VERSION}`;if(node.textContent!==next)node.textContent=next});
  return state;
}

const baseApplyLanguageV2117=applyLanguage;
applyLanguage=function(){
  baseApplyLanguageV2117();
  renderDataStatus();
};

let dataStatusPollCount=0;
const dataStatusPoll=setInterval(()=>{
  dataStatusPollCount++;
  const state=renderDataStatus();
  if(state!=='loading'||dataStatusPollCount>=160)clearInterval(dataStatusPoll);
},250);
renderDataStatus();

// Two legacy mechanisms can fight the FR/ES overlay:
// 1) the launcher observer rewrites all card labels from the EN/DE engine whenever a
//    summary changes; 2) the FR/ES body observer can observe its own text rewrites and
//    schedule another full translation pass. Wrap only the observers created after this
//    point, suppress the legacy launcher rewrite in FR/ES, and let the i18n body observer
//    react only to structural content additions (not its own text-node mutations).
(function installLegacyLauncherObserverBridge(){
  const NativeMutationObserver=window.MutationObserver;
  if(!NativeMutationObserver||window.__arcLegacyLauncherObserverBridge)return;
  window.__arcLegacyLauncherObserverBridge=true;
  const launcherStatusIds=new Set(['nextRaidSummary','liveEventsSummary','goalSummary','supplyDrawerSummary','itemsDrawerSummary','questSummary','blueprintSummary']);

  const activeUi=()=>{try{return localStorage.getItem('arcUiLanguage')||''}catch{return ''}};
  const overlayActive=()=>{const ui=activeUi();return ui==='fr'||ui==='es'};
  const hasStructuralElementChange=record=>{
    if(record.type!=='childList')return false;
    const changed=[...record.addedNodes,...record.removedNodes];
    return changed.some(node=>node.nodeType===Node.ELEMENT_NODE);
  };
  const ignoredI18nTarget=target=>{
    const element=target?.nodeType===Node.ELEMENT_NODE?target:target?.parentElement;
    return !!element?.closest?.('#appLauncher,#arcLanguageMenu,#arcLanguageButton,#arcLanguageFirstRun,.lang-switch');
  };

  class ArcMutationObserverBridge{
    constructor(callback){
      this._launcherTargets=new Set();
      this._isI18nBodyObserver=false;
      this._native=new NativeMutationObserver(records=>{
        if(overlayActive()&&this._launcherTargets.size>=3){
          window.dispatchEvent(new Event('arc-launcher-status-dirty'));
          return;
        }
        if(overlayActive()&&this._isI18nBodyObserver){
          const structural=records.filter(record=>hasStructuralElementChange(record)&&!ignoredI18nTarget(record.target));
          if(!structural.length)return;
          callback(structural,this);
          return;
        }
        callback(records,this);
      });
    }
    observe(target,options){
      if(target?.id&&launcherStatusIds.has(target.id))this._launcherTargets.add(target.id);
      if(target===document.body&&options?.subtree&&options?.childList&&options?.characterData)this._isI18nBodyObserver=true;
      return this._native.observe(target,options);
    }
    disconnect(){return this._native.disconnect()}
    takeRecords(){return this._native.takeRecords()}
  }

  window.MutationObserver=ArcMutationObserverBridge;
  window.__arcRestoreNativeMutationObserver=()=>{
    if(window.MutationObserver===ArcMutationObserverBridge)window.MutationObserver=NativeMutationObserver;
  };
})();

function loadI18nV13017(){
  if(document.querySelector('script[data-arc-i18n-v13017]'))return;
  const script=document.createElement('script');
  script.src='i18n-v13017.js?v=13017d';
  script.dataset.arcI18nV13017='';
  script.async=false;
  script.addEventListener('load',()=>window.__arcRestoreNativeMutationObserver?.(),{once:true});
  document.body.append(script);
}
if(document.readyState==='complete')setTimeout(loadI18nV13017,0);
else window.addEventListener('load',loadI18nV13017,{once:true});
