// Pendola Pass: draft status only. Reuses existing map loading, zoom and pan.
(()=>{
  const copy={
  "de": {
    "badge": "REKONSTRUKTION",
    "title": "Pendola Pass – im Ausbau",
    "body": "Eigene, KI-gestützte Illustration anhand der Originalfotos. Gelände, Gebäude und Verkehrswege sind angenähert; geografische Genauigkeit nicht verifiziert. Keine bestätigten Spielmarker.",
    "unavailable": "Keine bestätigten Marker",
    "source": "Kartenbasis: Ramas Field Tool · angenäherte Rekonstruktion",
    "names": "Ortsnamen aus den deutschen Referenzbildern",
    "alt": "Pendola Pass – angenäherte Kartenillustration"
  },
  "en": {
    "badge": "RECONSTRUCTION",
    "title": "Pendola Pass – work in progress",
    "body": "Independent AI-assisted illustration based on the original photos. Terrain, buildings and routes are approximate; geographic accuracy is not verified. No confirmed gameplay markers.",
    "unavailable": "No confirmed markers",
    "source": "Map base: Ramas Field Tool · approximate reconstruction",
    "names": "Place names from the German reference images",
    "alt": "Pendola Pass – approximate map illustration"
  },
  "fr": {
    "badge": "RECONSTITUTION",
    "title": "Pendola Pass – en construction",
    "body": "Illustration indépendante assistée par IA à partir des photos originales. Relief, bâtiments et voies approximatifs ; exactitude géographique non vérifiée. Aucun marqueur de jeu confirmé.",
    "unavailable": "Aucun marqueur confirmé",
    "source": "Fond : Ramas Field Tool · reconstitution approximative",
    "names": "Noms des lieux issus des captures allemandes",
    "alt": "Pendola Pass – illustration approximative"
  },
  "es": {
    "badge": "RECONSTRUCCIÓN",
    "title": "Pendola Pass – en desarrollo",
    "body": "Ilustración propia asistida por IA basada en las fotos originales. Terreno, edificios y vías aproximados; precisión geográfica no verificada. Sin marcadores de juego confirmados.",
    "unavailable": "Sin marcadores confirmados",
    "source": "Mapa base: Ramas Field Tool · reconstrucción aproximada",
    "names": "Nombres de lugares de las capturas alemanas",
    "alt": "Pendola Pass – ilustración aproximada"
  },
  "it": {
    "badge": "RICOSTRUZIONE",
    "title": "Pendola Pass – in sviluppo",
    "body": "Illustrazione indipendente assistita da IA basata sulle foto originali. Terreno, edifici e percorsi approssimativi; accuratezza geografica non verificata. Nessun indicatore di gioco confermato.",
    "unavailable": "Nessun indicatore confermato",
    "source": "Mappa base: Ramas Field Tool · ricostruzione approssimativa",
    "names": "Nomi dei luoghi dalle schermate tedesche",
    "alt": "Pendola Pass – illustrazione approssimativa"
  }
};
  const viewport=document.getElementById('spawnViewport');
  const style=document.createElement('style');style.textContent='#spawnViewport[data-map="pendola-pass"] .spawn-canvas img{object-fit:contain!important;filter:none!important}';document.head.appendChild(style);
  const info=document.querySelector('#spawnPanel .spawn-map-info');
  const originalInfoDisplay=info?.style.display||'';
  function set(id,text){const n=document.getElementById(id);if(n&&n.textContent!==text)n.textContent=text}
  function apply(){
    const active=viewport?.dataset.map==='pendola-pass'&&document.getElementById('spawnMapSelect')?.value==='pendola-pass';
    const l=(document.documentElement.dataset.uiLanguage||window.arcCurrentLanguage?.()||document.documentElement.lang||'de').slice(0,2);
    const c=copy[l]||copy.en;
    if(!active)return;
    set('spawnBadge',c.badge);set('spawnLegendText',c.unavailable);set('spawnImageCredit',c.source);
    let notice=document.getElementById('pendolaDraftNotice');if(!notice){notice=document.createElement('div');notice.id='pendolaDraftNotice';notice.className='spawn-note';notice.setAttribute('role','note');notice.innerHTML='<strong></strong><p></p>';document.querySelector('.spawn-map-instructions')?.before(notice)}
    notice.hidden=false;const title=notice.querySelector('strong'),message=notice.querySelector('p');if(title.textContent!==c.title)title.textContent=c.title;if(message.textContent!==c.body)message.textContent=c.body;
    const image=document.getElementById('spawnMapImage');if(image)image.alt=c.alt;

    // Other map extensions own these buttons outside Pendola Pass.
    for(const id of ['layerRaiders','layerWeaponCases']){
      const b=document.getElementById(id);if(b){b.hidden=true;b.disabled=true;b.setAttribute('aria-pressed','false')}
    }
    for(const id of ['spawnMarkers','weaponCaseMarkers']){const n=document.getElementById(id);if(n){n.hidden=true;if(n.childNodes.length)n.replaceChildren()}}
    let names=document.getElementById('pendolaPlaceNames');
    if(!names){names=document.createElement('details');names.id='pendolaPlaceNames';names.innerHTML='<summary></summary><p></p>';document.querySelector('.spawn-data-details-body')?.appendChild(names)}
    names.hidden=false;const heading=names.querySelector('summary');if(heading.textContent!==c.names)heading.textContent=c.names;
    const text=(typeof spawnData!=='undefined'?spawnData?.landmarks:[])?.map(p=>p.de).join(' · ')||'';const body=names.querySelector('p');if(body.textContent!==text)body.textContent=text;
  }
  function schedule(){setTimeout(()=>{const active=viewport?.dataset.map==='pendola-pass';if(info)info.style.display=active?'none':originalInfoDisplay;const names=document.getElementById('pendolaPlaceNames');if(names)names.hidden=!active;const notice=document.getElementById('pendolaDraftNotice');if(notice)notice.hidden=!active;apply()},0)}
  if(viewport)new MutationObserver(schedule).observe(viewport,{attributes:true,attributeFilter:['data-map']});
  // Avoid watching the entire panel: legacy extensions and language overlays
  // also own nodes here. A separate draft notice keeps these writes isolated.
  new MutationObserver(schedule).observe(document.documentElement,{attributes:true,attributeFilter:['data-ui-language']});
  window.addEventListener('arc-language-change',schedule);
  document.getElementById('spawnMapImage')?.addEventListener('load',schedule);
  schedule();
})();
