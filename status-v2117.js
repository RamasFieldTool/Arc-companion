// V2.12.2 – user-facing data status. Catalog/quest loading semantics stay elsewhere.
const APP_VERSION='2.12.2';
const STATUS_COPY={
  de:{live:'DATEN // LIVE',fallback:'DATEN // BASISDATENSATZ',liveTitle:'Live-Katalog aktiv',fallbackTitle:'Lokaler Basisdatensatz aktiv',fallbackBody:'Der vollständige Live-Katalog ist gerade nicht erreichbar. Suche und Ziele funktionieren mit dem lokalen Basisdatensatz weiter.'},
  en:{live:'DATA // LIVE',fallback:'DATA // BASE DATASET',liveTitle:'Live catalog active',fallbackTitle:'Local base dataset active',fallbackBody:'The full live catalog is currently unavailable. Search and goals continue with the local base dataset.'}
};
function statusCopy(){return STATUS_COPY[lang==='en'?'en':'de']}
function renderDataStatus(){
  const el=document.getElementById('dataStatus');
  const notice=document.getElementById('fallbackNotice');
  const c=statusCopy();
  if(el){
    el.textContent=usingFallback?c.fallback:c.live;
    el.classList.toggle('fallback',!!usingFallback);
    el.title=usingFallback?c.fallbackTitle:c.liveTitle;
  }
  if(notice){
    notice.hidden=!usingFallback;
    if(usingFallback) notice.innerHTML=`<b>${c.fallbackTitle}</b><span>${c.fallbackBody}</span>`;
  }
  document.querySelectorAll('[data-app-version]').forEach(node=>node.textContent=`V${APP_VERSION}`);
}

// Language changes and the final boot render already pass through applyLanguage().
// Keep data-status refresh attached there, but do not wrap drawItems(): item search
// now has one renderer and one input listener only.
const baseApplyLanguageV2117=applyLanguage;
applyLanguage=function(){
  baseApplyLanguageV2117();
  renderDataStatus();
};

renderDataStatus();
