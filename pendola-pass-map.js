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
  const lootCopy={
    de:['Waffenkisten & ARC-Spawnpunkte – Quellen','Externe Karten zeigen mögliche Fundorte. Positionen sind noch nicht mit unserer angenäherten Karte abgeglichen oder im Spiel bestätigt. Markerzahlen unterscheiden sich zwischen den Quellen. Spieler-Startpunkte bleiben ungeklärt.'],
    en:['Weapon cases & ARC spawns – sources','External maps show possible locations. Positions have not been matched to our approximate map or confirmed in game. Marker counts differ between sources. Player starting locations remain unresolved.'],
    fr:['Caisses d’armes et apparitions ARC – sources','Les cartes externes indiquent des emplacements possibles. Les positions ne sont pas comparées à notre carte approximative ni confirmées en jeu. Le nombre de marqueurs varie selon la source. Les points de départ des joueurs restent inconnus.'],
    es:['Cajas de armas y apariciones ARC – fuentes','Los mapas externos muestran ubicaciones posibles. Las posiciones no se han contrastado con nuestro mapa aproximado ni confirmado en el juego. Las cantidades varían entre fuentes. Los puntos de inicio de jugadores siguen sin confirmar.'],
    it:['Casse di armi e spawn ARC – fonti','Le mappe esterne mostrano posizioni possibili. Non sono state confrontate con la nostra mappa approssimativa né confermate nel gioco. I conteggi variano tra le fonti. I punti iniziali dei giocatori restano da verificare.']
  };
  const markerCopy={
    de:['Waffenkisten','ARC-Spawnpunkte','ARC-Gebiete','Positionen nur grob übertragen; Quelle nicht im Spiel bestätigt. Spieler-Startpunkte fehlen.','Außerhalb unserer Illustration','Nur unter bestimmten Kartenbedingungen; welche, ist nicht dokumentiert.','Möglicher Fundort · nicht garantiert','Keine Ortszuordnung','Positionsdaten konnten nicht geladen werden.'],
    en:['Weapon cases','ARC spawn points','ARC areas','Positions are roughly transferred; source not confirmed in game. Player starting points are missing.','Outside our illustration','Only under certain map conditions; which conditions is undocumented.','Possible location · not guaranteed','No area assigned','Location data could not be loaded.'],
    fr:['Caisses d’armes','Points ARC','Zones ARC','Positions transférées approximativement ; source non confirmée en jeu. Points de départ des joueurs absents.','Hors de notre illustration','Seulement sous certaines conditions non précisées.','Emplacement possible · non garanti','Lieu non attribué','Impossible de charger les positions.'],
    es:['Cajas de armas','Puntos ARC','Zonas ARC','Posiciones trasladadas aproximadamente; fuente sin confirmar en el juego. Faltan los puntos iniciales de jugadores.','Fuera de nuestra ilustración','Solo bajo ciertas condiciones no especificadas.','Ubicación posible · no garantizada','Sin área asignada','No se pudieron cargar las posiciones.'],
    it:['Casse di armi','Punti ARC','Zone ARC','Posizioni trasferite approssimativamente; fonte non confermata nel gioco. Mancano i punti iniziali dei giocatori.','Fuori dalla nostra illustrazione','Solo in determinate condizioni non specificate.','Posizione possibile · non garantita','Area non assegnata','Impossibile caricare le posizioni.']
  };
  let locationEvidence=null,locationError=false;
  const enabled={cases:true,arcs:true,areas:false};
  fetch('catalog-data/pendola-pass-location-evidence.json?v=overlay-1',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error(r.status);return r.json()}).then(d=>{locationEvidence=d;schedule()}).catch(()=>{locationError=true;schedule()});
  function locationPoints(){
    const m=locationEvidence?.coordinateSystem?.mappingToRftIllustration?.matrix;if(!m)return [];
    return locationEvidence.layers.flatMap(layer=>layer.records.map((r,i)=>({id:layer.category+'-'+i,category:layer.category,group:layer.category.startsWith('weapon-case')?'cases':layer.category.startsWith('arc-spawn-areas')?'areas':'arcs',title:r[3]?.t||layer.category,area:locationEvidence.areas.find(a=>a.id===r[2])?.name,conditional:layer.category==='weapon-case-other-conditions',x:r[0]*m[0][0]+r[1]*m[1][0]+m[2][0],y:r[0]*m[0][1]+r[1]*m[1][1]+m[2][1]})));
  }
  function renderLocations(overlay,notice,l){
    const c=markerCopy[l]||markerCopy.en,ns='http://www.w3.org/2000/svg';
    let controls=document.getElementById('pendolaLocationControls');
    if(!controls){controls=document.createElement('div');controls.id='pendolaLocationControls';controls.innerHTML='<p></p><div class="pendola-layer-buttons"></div><div class="pendola-selection" hidden></div><details><summary></summary><ul></ul></details>';notice.after(controls)}
    controls.hidden=false;controls.querySelector('p').textContent=locationError?c[8]:c[3];
    const points=locationPoints(),inside=points.filter(p=>p.x>=0&&p.x<=100&&p.y>=0&&p.y<=100),outside=points.filter(p=>!inside.includes(p));
    const buttons=controls.querySelector('.pendola-layer-buttons');buttons.replaceChildren();
    ['cases','arcs','areas'].forEach((group,i)=>{const b=document.createElement('button');b.type='button';b.dataset.pendolaLayer=group;b.textContent=c[i]+' ('+inside.filter(p=>p.group===group).length+')';b.setAttribute('aria-pressed',String(enabled[group]));b.addEventListener('click',()=>{enabled[group]=!enabled[group];apply()});buttons.appendChild(b)});
    const excluded=controls.querySelector('details');excluded.hidden=!outside.length;excluded.querySelector('summary').textContent=c[4]+' ('+outside.length+')';const list=excluded.querySelector('ul');list.replaceChildren();outside.forEach(p=>{const li=document.createElement('li');li.textContent=p.title+' · '+(p.area||c[7])+(p.conditional?' · '+c[5]:'');list.appendChild(li)});
    overlay.querySelectorAll('.pendola-loot-marker').forEach(n=>n.remove());
    inside.filter(p=>enabled[p.group]).forEach(p=>{
      const g=document.createElementNS(ns,'g');g.setAttribute('class','pendola-loot-marker pendola-'+p.group);g.setAttribute('transform',`translate(${p.x*14.48} ${p.y*10.86})`);g.setAttribute('role','button');g.setAttribute('tabindex','0');g.setAttribute('aria-label',p.title+' · '+(p.area||c[7])+' · '+c[6]);g.dataset.location=p.id;
      const title=document.createElementNS(ns,'title');title.textContent=g.getAttribute('aria-label');const shape=document.createElementNS(ns,p.group==='cases'?'rect':'circle');if(p.group==='cases'){for(const [k,v]of Object.entries({x:-9,y:-9,width:18,height:18,rx:2}))shape.setAttribute(k,v)}else shape.setAttribute('r',p.group==='areas'?6:9);
      const hit=document.createElementNS(ns,'circle');hit.setAttribute('r','20');hit.style.fill='transparent';hit.style.stroke='none';g.append(title,hit,shape);g.addEventListener('pointerdown',e=>e.stopPropagation());const select=()=>{const box=controls.querySelector('.pendola-selection');box.hidden=false;box.replaceChildren();const heading=document.createElement('strong');heading.textContent=p.title+' · '+(p.area||c[7]);const body=document.createElement('p');body.textContent=c[6]+'. '+c[3]+(p.conditional?' '+c[5]:'');const link=document.createElement('a');link.href=locationEvidence.sourcePage;link.target='_blank';link.rel='noopener noreferrer';link.textContent='AllThingsHow';box.append(heading,body,link)};g.addEventListener('click',e=>{e.stopPropagation();select()});g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select()}});overlay.appendChild(g);
    });
  }
  const viewport=document.getElementById('spawnViewport');
  const style=document.createElement('style');style.textContent='#spawnViewport[data-map="pendola-pass"] .spawn-canvas img{object-fit:contain!important;filter:none!important}#pendolaOverlay{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:hidden}#pendolaOverlay[hidden]{display:none}.pendola-area{font:bold 25px sans-serif;fill:white;paint-order:stroke;stroke:#111b24;stroke-width:7px;stroke-linejoin:round}.pendola-place{font:600 15px sans-serif;fill:white;paint-order:stroke;stroke:#111b24;stroke-width:5px;stroke-linejoin:round}.pendola-place{display:none}.map-interactive .pendola-place{display:block}.pendola-extraction rect{fill:#16262f;stroke:#ffcd73;stroke-width:3}.pendola-extraction path{fill:none;stroke:#fff;stroke-width:4;stroke-linecap:round;stroke-linejoin:round}';style.textContent+='.pendola-layer-buttons{display:flex;flex-wrap:wrap;gap:8px}.pendola-layer-buttons button{min-height:44px;padding:8px 12px}.pendola-layer-buttons [aria-pressed=true]{outline:2px solid #ffcd73}.pendola-loot-marker{pointer-events:auto;cursor:pointer}.pendola-loot-marker>*{stroke:#101820;stroke-width:2}.pendola-cases{fill:#ffcd73}.pendola-arcs{fill:#ff7878}.pendola-areas{fill:#9abbed;opacity:.7}.pendola-loot-marker:focus{outline:none;filter:drop-shadow(0 0 5px white)}.pendola-selection{padding:12px;border:1px solid #ffcd73;margin:10px 0}';document.head.appendChild(style);
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
    let sources=document.getElementById('pendolaLootSources');
    if(!sources){sources=document.createElement('details');sources.id='pendolaLootSources';sources.innerHTML='<summary></summary><p></p><ul><li><a href="https://metaforge.app/arc-raiders/map/pendola-pass" target="_blank" rel="noopener noreferrer">MetaForge</a></li><li><a href="https://arcraidershub.com/maps/pendola-pass" target="_blank" rel="noopener noreferrer">ARC Raiders Hub</a></li><li><a href="https://salvagelinegaming.nl/pendola-pass" target="_blank" rel="noopener noreferrer">Salvage Line</a></li></ul>';notice.after(sources)}
    sources.hidden=false;const lc=lootCopy[l]||lootCopy.en;
    if(sources.querySelector('summary').textContent!==lc[0])sources.querySelector('summary').textContent=lc[0];
    if(sources.querySelector('p').textContent!==lc[1])sources.querySelector('p').textContent=lc[1];
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
      renderLocations(overlay,notice,l);
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
  function schedule(){setTimeout(()=>{const active=viewport?.dataset.map==='pendola-pass';if(info)info.style.display=active?'none':originalInfoDisplay;const overlay=document.getElementById('pendolaOverlay');if(overlay){overlay.hidden=!active;overlay.style.display=active?'':'none'}const names=document.getElementById('pendolaPlaceNames');if(names)names.hidden=!active;const sources=document.getElementById('pendolaLootSources');if(sources)sources.hidden=!active;const controls=document.getElementById('pendolaLocationControls');if(controls)controls.hidden=!active;const notice=document.getElementById('pendolaDraftNotice');if(notice)notice.hidden=!active;apply()},0)}
  if(viewport)new MutationObserver(schedule).observe(viewport,{attributes:true,attributeFilter:['data-map']});
  // Avoid watching the entire panel: legacy extensions and language overlays
  // also own nodes here. A separate draft notice keeps these writes isolated.
  new MutationObserver(schedule).observe(document.documentElement,{attributes:true,attributeFilter:['data-ui-language']});
  window.addEventListener('arc-language-change',schedule);
  document.getElementById('spawnMapImage')?.addEventListener('load',schedule);
  schedule();
})();
