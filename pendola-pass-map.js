// Pendola Pass: draft status only. Reuses existing map loading, zoom and pan.
(()=>{
  const copy={
  "de": {
    "badge": "REKONSTRUKTION",
    "title": "Pendola Pass – im Ausbau",
    "body": "Eigene, KI-gestützte Illustration anhand der Originalfotos. Gelände, Gebäude und Verkehrswege sind angenähert; geografische Genauigkeit nicht verifiziert. Vier Extraktionen aus den Referenzbildern, Positionen angenähert; nicht im Spiel geprüft.",
    "unavailable": "↓ Extraktion · Position angenähert",
    "source": "Kartenbasis: Ramas Field Tool · angenäherte Rekonstruktion",
    "names": "Ortsnamen aus den deutschen Referenzbildern",
    "alt": "Pendola Pass – angenäherte Kartenillustration"
  },
  "en": {
    "badge": "RECONSTRUCTION",
    "title": "Pendola Pass – work in progress",
    "body": "Independent AI-assisted illustration based on the original photos. Terrain, buildings and routes are approximate; geographic accuracy is not verified. Four extractions from reference images, approximate positions; not checked in game.",
    "unavailable": "↓ Extraction · approximate position",
    "source": "Map base: Ramas Field Tool · approximate reconstruction",
    "names": "Place names from the German reference images",
    "alt": "Pendola Pass – approximate map illustration"
  },
  "fr": {
    "badge": "RECONSTITUTION",
    "title": "Pendola Pass – en construction",
    "body": "Illustration indépendante assistée par IA à partir des photos originales. Relief, bâtiments et voies approximatifs ; exactitude géographique non vérifiée. Quatre extractions issues des photos, positions approximatives ; non vérifiées en jeu.",
    "unavailable": "↓ Extraction · position approximative",
    "source": "Fond : Ramas Field Tool · reconstitution approximative",
    "names": "Noms des lieux issus des captures allemandes",
    "alt": "Pendola Pass – illustration approximative"
  },
  "es": {
    "badge": "RECONSTRUCCIÓN",
    "title": "Pendola Pass – en desarrollo",
    "body": "Ilustración propia asistida por IA basada en las fotos originales. Terreno, edificios y vías aproximados; precisión geográfica no verificada. Cuatro extracciones de las fotos, posiciones aproximadas; no verificadas en el juego.",
    "unavailable": "↓ Extracción · posición aproximada",
    "source": "Mapa base: Ramas Field Tool · reconstrucción aproximada",
    "names": "Nombres de lugares de las capturas alemanas",
    "alt": "Pendola Pass – ilustración aproximada"
  },
  "it": {
    "badge": "RICOSTRUZIONE",
    "title": "Pendola Pass – in sviluppo",
    "body": "Illustrazione indipendente assistita da IA basata sulle foto originali. Terreno, edifici e percorsi approssimativi; accuratezza geografica non verificata. Quattro estrazioni dalle foto, posizioni approssimative; non verificate nel gioco.",
    "unavailable": "↓ Estrazione · posizione approssimativa",
    "source": "Mappa base: Ramas Field Tool · ricostruzione approssimativa",
    "names": "Nomi dei luoghi dalle schermate tedesche",
    "alt": "Pendola Pass – illustrazione approssimativa"
  }
};
  const viewport=document.getElementById('spawnViewport');
  const style=document.createElement('style');style.textContent='#spawnViewport[data-map="pendola-pass"] .spawn-canvas img{object-fit:contain!important;filter:none!important}#pendolaOverlay{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:hidden}#pendolaOverlay[hidden]{display:none}.pendola-area{font:bold 25px sans-serif;fill:white;paint-order:stroke;stroke:#111b24;stroke-width:7px;stroke-linejoin:round}.pendola-place{font:600 15px sans-serif;fill:white;paint-order:stroke;stroke:#111b24;stroke-width:5px;stroke-linejoin:round}.pendola-place{display:none}.map-interactive .pendola-place{display:block}.pendola-extraction rect{fill:#16262f;stroke:#ffcd73;stroke-width:3}.pendola-extraction path{fill:none;stroke:#fff;stroke-width:4;stroke-linecap:round;stroke-linejoin:round}';document.head.appendChild(style);
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

    // SVG shares the image aspect ratio and contain alignment, including letterboxing.
    let overlay=document.getElementById('pendolaOverlay');
    const data=typeof spawnData!=='undefined'?spawnData:null;
    if(data?.map==='pendola-pass'){
      if(!overlay){overlay=document.createElementNS('http://www.w3.org/2000/svg','svg');overlay.id='pendolaOverlay';overlay.setAttribute('viewBox','0 0 1448 1086');overlay.setAttribute('preserveAspectRatio','xMidYMid meet');overlay.setAttribute('role','img');document.getElementById('spawnCanvas')?.appendChild(overlay)}
      overlay.hidden=false;overlay.style.display='';overlay.setAttribute('aria-label',c.unavailable);
      const signature=JSON.stringify([data.areaLabels,data.landmarks,data.layers.extractions,c.unavailable]);
      if(overlay.dataset.signature!==signature){
        const ns='http://www.w3.org/2000/svg',nodes=[];
        function label(p,cls){const n=document.createElementNS(ns,'text');n.setAttribute('x',p.x*14.48);n.setAttribute('y',p.y*10.86);n.setAttribute('text-anchor','middle');n.setAttribute('class',cls);n.textContent=p.de;nodes.push(n)}
        (data.areaLabels||[]).forEach(p=>label(p,'pendola-area'));
        (data.landmarks||[]).filter(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)).forEach(p=>label(p,'pendola-place'));
        (data.layers.extractions.points||[]).forEach(p=>{const g=document.createElementNS(ns,'g');g.setAttribute('class','pendola-extraction');g.setAttribute('data-extraction',p.id);g.setAttribute('transform',`translate(${p.x*14.48} ${p.y*10.86})`);const title=document.createElementNS(ns,'title');title.textContent=c.unavailable;const rect=document.createElementNS(ns,'rect');for(const [k,v]of Object.entries({x:-18,y:-18,width:36,height:36,rx:4}))rect.setAttribute(k,v);const arrow=document.createElementNS(ns,'path');arrow.setAttribute('d','M0 -10 V5 M-7 -1 L0 6 L7 -1 M-10 11 H10');g.append(title,rect,arrow);nodes.push(g)});
        overlay.replaceChildren(...nodes);overlay.dataset.signature=signature;
      }
    }

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
  function schedule(){setTimeout(()=>{const active=viewport?.dataset.map==='pendola-pass';if(info)info.style.display=active?'none':originalInfoDisplay;const overlay=document.getElementById('pendolaOverlay');if(overlay){overlay.hidden=!active;overlay.style.display=active?'':'none'}const names=document.getElementById('pendolaPlaceNames');if(names)names.hidden=!active;const notice=document.getElementById('pendolaDraftNotice');if(notice)notice.hidden=!active;apply()},0)}
  if(viewport)new MutationObserver(schedule).observe(viewport,{attributes:true,attributeFilter:['data-map']});
  // Avoid watching the entire panel: legacy extensions and language overlays
  // also own nodes here. A separate draft notice keeps these writes isolated.
  new MutationObserver(schedule).observe(document.documentElement,{attributes:true,attributeFilter:['data-ui-language']});
  window.addEventListener('arc-language-change',schedule);
  document.getElementById('spawnMapImage')?.addEventListener('load',schedule);
  schedule();
})();
