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
    de:['Waffenkisten & ARC-Spawnpunkte – Quellen','Externe Karten zeigen mögliche Fundorte. Positionen sind noch nicht mit unserer angenäherten Karte abgeglichen oder im Spiel bestätigt. Markerzahlen unterscheiden sich zwischen den Quellen. Spieler-Startpunkte stammen aus der MetaForge-API.'],
    en:['Weapon cases & ARC spawns – sources','External maps show possible locations. Positions have not been matched to our approximate map or confirmed in game. Marker counts differ between sources. Player starting locations come from the MetaForge API.'],
    fr:['Caisses d’armes et apparitions ARC – sources','Les cartes externes indiquent des emplacements possibles. Les positions ne sont pas comparées à notre carte approximative ni confirmées en jeu. Le nombre de marqueurs varie selon la source. Les départs des joueurs proviennent de l’API MetaForge.'],
    es:['Cajas de armas y apariciones ARC – fuentes','Los mapas externos muestran ubicaciones posibles. Las posiciones no se han contrastado con nuestro mapa aproximado ni confirmado en el juego. Las cantidades varían entre fuentes. Los inicios de jugadores provienen de la API MetaForge.'],
    it:['Casse di armi e spawn ARC – fonti','Le mappe esterne mostrano posizioni possibili. Non sono state confrontate con la nostra mappa approssimativa né confermate nel gioco. I conteggi variano tra le fonti. I punti iniziali provengono dall’API MetaForge.']
  };
  const markerCopy={
    de:['Waffenkisten','ARC-Spawnpunkte','ARC-Gebiete','Positionen nur grob übertragen; Quelle nicht im Spiel bestätigt. Spieler-Startpunkte sind quellenbasiert, nicht im Spiel bestätigt.','Außerhalb unserer Illustration','Nur unter bestimmten Kartenbedingungen; welche, ist nicht dokumentiert.','Möglicher Fundort · nicht garantiert','Keine Ortszuordnung','Positionsdaten konnten nicht geladen werden.'],
    en:['Weapon cases','ARC spawn points','ARC areas','Positions are roughly transferred; source not confirmed in game. Player starting points are source-documented, not confirmed in game.','Outside our illustration','Only under certain map conditions; which conditions is undocumented.','Possible location · not guaranteed','No area assigned','Location data could not be loaded.'],
    fr:['Caisses d’armes','Points ARC','Zones ARC','Positions transférées approximativement ; source non confirmée en jeu. Départs des joueurs documentés par la source, non confirmés en jeu.','Hors de notre illustration','Seulement sous certaines conditions non précisées.','Emplacement possible · non garanti','Lieu non attribué','Impossible de charger les positions.'],
    es:['Cajas de armas','Puntos ARC','Zonas ARC','Posiciones trasladadas aproximadamente; fuente sin confirmar en el juego. Inicios de jugadores documentados por la fuente, sin confirmar en el juego.','Fuera de nuestra ilustración','Solo bajo ciertas condiciones no especificadas.','Ubicación posible · no garantizada','Sin área asignada','No se pudieron cargar las posiciones.'],
    it:['Casse di armi','Punti ARC','Zone ARC','Posizioni trasferite approssimativamente; fonte non confermata nel gioco. Punti iniziali documentati dalla fonte, non confermati nel gioco.','Fuori dalla nostra illustrazione','Solo in determinate condizioni non specificate.','Posizione possibile · non garantita','Area non assegnata','Impossibile caricare le posizioni.']
  };
  let locationEvidence=null,locationError=false;
  const enabled={cases:false,arcs:false,areas:false,players:false,extractions:false};
  const playerLabels={de:'Spieler-Startpunkte',en:'Player starting points',fr:'Départs des joueurs',es:'Inicios de jugadores',it:'Punti iniziali dei giocatori'};
  fetch('catalog-data/pendola-pass-location-evidence.json?v=players-1',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error(r.status);return r.json()}).then(d=>{locationEvidence=d;schedule()}).catch(()=>{locationError=true;schedule()});
  function locationPoints(){
    const m=locationEvidence?.coordinateSystem?.mappingToRftIllustration?.matrix;if(!m)return [];
    const standard=locationEvidence.layers.flatMap(layer=>layer.records.map((r,i)=>({id:layer.category+'-'+i,category:layer.category,group:layer.category.startsWith('weapon-case')?'cases':layer.category.startsWith('arc-spawn-areas')?'areas':'arcs',title:r[3]?.t||layer.category,area:locationEvidence.areas.find(a=>a.id===r[2])?.name,conditional:layer.category==='weapon-case-other-conditions',x:r[0]*m[0][0]+r[1]*m[1][0]+m[2][0],y:r[0]*m[0][1]+r[1]*m[1][1]+m[2][1]})));
    const pm=locationEvidence.playerSpawns?.mappingToSourceMap?.matrix;
    const players=pm?(locationEvidence.playerSpawns.records||[]).map(p=>{
      const x=p.lng*pm[0][0]+p.lat*pm[1][0]+pm[2][0],y=p.lng*pm[0][1]+p.lat*pm[1][1]+pm[2][1];
      return {id:p.id,category:'player_spawn',group:'players',title:'Player starting point',sourcePage:locationEvidence.playerSpawns.sourcePage,x:x*m[0][0]+y*m[1][0]+m[2][0],y:x*m[0][1]+y*m[1][1]+m[2][1]};
    }):[];
    return standard.concat(players);

  }
  const pickerCopy={
    de:['Auf Karte anzeigen','Raider & Loot','Extraktion','ARC','Abholungen','aktiv','Keine Anzeige aktiv','Details schließen'],
    en:['Show on map','Raider & loot','Extraction','ARC','Extractions','active','Nothing active','Close details'],
    fr:['Afficher sur la carte','Raider & butin','Extraction','ARC','Extractions','actifs','Aucun affichage actif','Fermer les détails'],
    es:['Mostrar en el mapa','Raider y botín','Extracción','ARC','Extracciones','activos','Nada activo','Cerrar detalles'],
    it:['Mostra sulla mappa','Raider e bottino','Estrazione','ARC','Estrazioni','attivi','Nessuna visualizzazione attiva','Chiudi dettagli']
  };
  let selectedLocation=null;
  function alignLocationLayer(){
    const layer=document.getElementById('pendolaLocationMarkers'),canvas=document.getElementById('spawnCanvas'),img=document.getElementById('spawnMapImage');
    if(!layer||!canvas||!img?.naturalWidth)return;
    const ratio=Math.min(canvas.clientWidth/img.naturalWidth,canvas.clientHeight/img.naturalHeight),w=img.naturalWidth*ratio,h=img.naturalHeight*ratio;
    const values={left:(canvas.clientWidth-w)/2+'px',top:(canvas.clientHeight-h)/2+'px',width:w+'px',height:h+'px'};
    for(const [k,v]of Object.entries(values))if(layer.style[k]!==v)layer.style[k]=v;
    const transform=getComputedStyle(canvas).transform,zoom=transform==='none'?1:new DOMMatrixReadOnly(transform).a;
    const scale=String(1/Math.max(1,zoom));if(layer.style.getPropertyValue('--freight-marker-scale')!==scale)layer.style.setProperty('--freight-marker-scale',scale);layer.style.setProperty('--buried-marker-scale',scale);
  }
  function renderLocations(overlay,notice,l){
    const c=markerCopy[l]||markerCopy.en,pc=pickerCopy[l]||pickerCopy.en;
    let controls=document.getElementById('pendolaLocationControls');
    if(!controls){controls=document.createElement('div');controls.id='pendolaLocationControls';controls.innerHTML='<p></p><details><summary></summary><ul></ul></details><a data-player-source href="https://metaforge.app/arc-raiders" target="_blank" rel="noopener noreferrer"></a>';document.querySelector('.spawn-data-details-body')?.appendChild(controls)}
    controls.hidden=false;controls.querySelector('p').textContent=locationError?c[8]:c[3];controls.querySelector('[data-player-source]').textContent='MetaForge · '+(playerLabels[l]||playerLabels.en);
    const points=locationPoints();points.filter(p=>p.group==='players').forEach(p=>p.title=playerLabels[l]||playerLabels.en);
    const inside=points.filter(p=>p.x>=0&&p.x<=100&&p.y>=0&&p.y<=100),outside=points.filter(p=>!inside.includes(p));
    const excluded=controls.querySelector('details');excluded.hidden=!outside.length;excluded.querySelector('summary').textContent=c[4]+' ('+outside.length+')';const list=excluded.querySelector('ul');list.replaceChildren();outside.forEach(p=>{const li=document.createElement('li');li.textContent=p.title+' · '+(p.area||c[7])+(p.conditional?' · '+c[5]:'');list.appendChild(li)});
    let picker=document.getElementById('pendolaLayerPicker');
    if(!picker){picker=document.createElement('details');picker.id='pendolaLayerPicker';picker.className='buried-city-layer-picker';picker.innerHTML='<summary><span></span><span class="buried-city-layer-count"></span></summary><div class="buried-city-layer-groups"></div>';document.querySelector('.map-layer-controls')?.prepend(picker)}
    picker.hidden=false;picker.querySelector('summary span').textContent=pc[0];picker.querySelector('.buried-city-layer-count').textContent=Object.values(enabled).filter(Boolean).length+' '+pc[5];
    const groups=picker.querySelector('.buried-city-layer-groups');groups.replaceChildren();
    const definitions=[['players','cases'],['extractions'],['arcs','areas']];
    const labels={players:playerLabels[l]||playerLabels.en,cases:c[0],arcs:c[1],areas:c[2],extractions:pc[4]};
    definitions.forEach((keys,i)=>{const section=document.createElement('section');section.className='buried-city-layer-group';const heading=document.createElement('h3');heading.textContent=pc[i+1];const grid=document.createElement('div');grid.className='buried-city-layer-grid';keys.forEach(key=>{const b=document.createElement('button');b.type='button';b.className='map-layer-toggle';b.dataset.pendolaLayer=key;b.setAttribute('aria-pressed',String(enabled[key]));b.innerHTML='<span class="layer-indicator"></span><span></span>';b.lastElementChild.textContent=labels[key];b.addEventListener('click',()=>{enabled[key]=!enabled[key];selectedLocation=null;apply()});grid.appendChild(b)});section.append(heading,grid);groups.appendChild(section)});
    const active=Object.keys(enabled).filter(k=>enabled[k]);set('spawnLegendText',active.map(k=>labels[k]).join(' · ')||pc[6]);
    let layer=document.getElementById('pendolaLocationMarkers');if(!layer){layer=document.createElement('div');layer.id='pendolaLocationMarkers';layer.className='spaceport-freight-layer';document.getElementById('spawnCanvas')?.appendChild(layer)}layer.hidden=false;layer.replaceChildren();
    const extractions=(typeof spawnData!=='undefined'?spawnData?.layers?.extractions?.points:[])||[];
    const all=inside.concat(extractions.map(p=>({...p,group:'extractions',title:pc[4]})));
    const numbers={cases:0,players:0,arcs:0,areas:0,extractions:0};
    let details=document.getElementById('pendolaLocationDetails');if(!details){details=document.createElement('div');details.id='pendolaLocationDetails';details.className='spaceport-freight-details pendola-selection';document.getElementById('spawnViewport')?.after(details)}details.hidden=!selectedLocation;
    all.forEach(p=>{const n=++numbers[p.group];if(!enabled[p.group])return;const b=document.createElement('button');b.type='button';b.dataset.location=p.id;b.className='spaceport-freight-marker pendola-loot-marker pendola-'+p.group+(p.group==='players'?' spaceport-spawn-marker':p.group==='cases'?' spaceport-case-marker':p.group==='arcs'||p.group==='areas'?' buried-city-marker is-arc':'');b.style.left=p.x+'%';b.style.top=p.y+'%';b.textContent=p.group==='players'?'S'+n:p.group==='cases'?'W'+n:p.group==='extractions'?'↕ '+n:p.group==='areas'?'?':({'sentinel-spawn-points':'S','turret-spawn-points':'T','arc-turbine-spawn-points':'TU','snitch-spawn-points':'SN','hydra-spawn-points':'H'}[p.category]||'ARC');b.setAttribute('aria-label',p.title+' '+n+' · '+(p.area||c[7])+' · '+c[6]);b.setAttribute('aria-pressed',String(selectedLocation===p.id));b.addEventListener('pointerdown',e=>e.stopPropagation());b.addEventListener('click',e=>{e.stopPropagation();selectedLocation=p.id;details.hidden=false;details.replaceChildren();layer.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));const close=document.createElement('button');close.type='button';close.textContent='×';close.setAttribute('aria-label',pc[7]);close.addEventListener('click',()=>{selectedLocation=null;details.hidden=true;b.setAttribute('aria-pressed','false')});const title=document.createElement('strong');title.textContent=p.title+' '+n+(p.area?' · '+p.area:'');const body=document.createElement('span');body.textContent=c[6]+'. '+c[3]+(p.conditional?' '+c[5]:'');details.append(close,title,body);if(p.group!=='extractions'){const link=document.createElement('a');link.href=p.sourcePage||locationEvidence.sourcePage;link.target='_blank';link.rel='noopener noreferrer';link.textContent=p.group==='players'?'MetaForge':'AllThingsHow';details.appendChild(link)}});layer.appendChild(b)});
    alignLocationLayer();
  }
  const viewport=document.getElementById('spawnViewport');
  const style=document.createElement('style');style.textContent='#spawnViewport[data-map="pendola-pass"] .spawn-canvas img{object-fit:contain!important;filter:none!important}#pendolaOverlay{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:hidden}#pendolaOverlay[hidden]{display:none}.pendola-area{font:bold 25px sans-serif;fill:white;paint-order:stroke;stroke:#111b24;stroke-width:7px;stroke-linejoin:round}.pendola-place{font:600 15px sans-serif;fill:white;paint-order:stroke;stroke:#111b24;stroke-width:5px;stroke-linejoin:round}.pendola-place{display:none}.map-interactive .pendola-place{display:block}.pendola-extraction rect{fill:#16262f;stroke:#ffcd73;stroke-width:3}.pendola-extraction path{fill:none;stroke:#fff;stroke-width:4;stroke-linecap:round;stroke-linejoin:round}';style.textContent+='#spawnPanel:has(#spawnViewport[data-map="pendola-pass"]) #layerRaiders,#spawnPanel:has(#spawnViewport[data-map="pendola-pass"]) #layerWeaponCases{display:none!important}#pendolaLayerPicker[hidden],#pendolaLocationMarkers[hidden],#pendolaLocationDetails[hidden]{display:none!important}';document.head.appendChild(style);
  const info=document.querySelector('#spawnPanel .spawn-map-info');
  const originalInfoDisplay=info?.style.display||'';
  function set(id,text){const n=document.getElementById(id);if(n&&n.textContent!==text)n.textContent=text}
  function apply(){
    const active=viewport?.dataset.map==='pendola-pass'&&document.getElementById('spawnMapSelect')?.value==='pendola-pass';
    const l=(document.documentElement.dataset.uiLanguage||window.arcCurrentLanguage?.()||document.documentElement.lang||'de').slice(0,2);
    const c=copy[l]||copy.en;
    if(!active)return;
    set('spawnBadge',c.badge);set('spawnImageCredit',c.source);
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
      if(!overlay){overlay=document.createElementNS('http://www.w3.org/2000/svg','svg');overlay.id='pendolaOverlay';overlay.setAttribute('viewBox','0 0 1448 1086');overlay.setAttribute('preserveAspectRatio','xMidYMid meet');overlay.setAttribute('role','group');document.getElementById('spawnCanvas')?.appendChild(overlay)}
      overlay.hidden=false;overlay.style.display='';overlay.setAttribute('aria-label',c.unavailable);
      const signature=JSON.stringify([data.areaLabels,data.landmarks,data.layers.extractions,c.unavailable]);
      if(overlay.dataset.signature!==signature){
        const ns='http://www.w3.org/2000/svg',nodes=[];
        function label(p,cls){const n=document.createElementNS(ns,'text');n.setAttribute('x',p.x*14.48);n.setAttribute('y',p.y*10.86);n.setAttribute('text-anchor','middle');n.setAttribute('class',cls);n.textContent=p.de;nodes.push(n)}
        (data.areaLabels||[]).forEach(p=>label(p,'pendola-area'));
        (data.landmarks||[]).filter(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)).forEach(p=>label(p,'pendola-place'));

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
  // A gesture may begin on any marker, including its enlarged touch target.
  // Keep taps for selection; suppress marker activation after a drag.
  let panGesture=null,suppressPointerClickUntil=0;
  const shell=document.getElementById('spawnViewport');
  shell?.addEventListener('pointerdown',e=>{
    if(shell.dataset.map!=='pendola-pass'||typeof spawnScale==='undefined'||spawnScale<=1.001||!e.isPrimary||e.button!==0)return;
    e.stopImmediatePropagation();
    panGesture={id:e.pointerId,startX:e.clientX,startY:e.clientY,x:spawnX,y:spawnY,dragged:false,marker:e.target.closest('.pendola-loot-marker')};
    shell.setPointerCapture?.(e.pointerId);
  },true);
  shell?.addEventListener('pointermove',e=>{
    const g=panGesture;if(!g||g.id!==e.pointerId)return;e.stopImmediatePropagation();
    const dx=e.clientX-g.startX,dy=e.clientY-g.startY;
    if(!g.dragged&&Math.hypot(dx,dy)<6)return;
    g.dragged=true;spawnX=g.x+dx;spawnY=g.y+dy;clampSpawnPan();applySpawnTransform();shell.classList.add('dragging');
  },true);
  function finishPan(e){
    const g=panGesture;if(!g||g.id!==e.pointerId)return;e.stopImmediatePropagation();panGesture=null;shell.classList.remove('dragging');
    if(shell.hasPointerCapture?.(e.pointerId))shell.releasePointerCapture(e.pointerId);
    suppressPointerClickUntil=performance.now()+500;
    if(e.type==='pointerup'&&!g.dragged&&g.marker?.isConnected)g.marker.click();
  }
  shell?.addEventListener('pointerup',finishPan,true);shell?.addEventListener('pointercancel',finishPan,true);
  shell?.addEventListener('click',e=>{if(e.isTrusted&&e.detail>0&&performance.now()<suppressPointerClickUntil){e.preventDefault();e.stopImmediatePropagation()}},true);
  function schedule(){setTimeout(()=>{const active=viewport?.dataset.map==='pendola-pass';if(info)info.style.display=active?'none':originalInfoDisplay;const overlay=document.getElementById('pendolaOverlay');if(overlay){overlay.hidden=!active;overlay.style.display=active?'':'none'}const names=document.getElementById('pendolaPlaceNames');if(names)names.hidden=!active;const sources=document.getElementById('pendolaLootSources');if(sources)sources.hidden=!active;for(const id of ['pendolaLocationControls','pendolaLayerPicker','pendolaLocationMarkers','pendolaLocationDetails']){const n=document.getElementById(id);if(n)n.hidden=!active||(id==='pendolaLocationDetails'&&!selectedLocation);}const notice=document.getElementById('pendolaDraftNotice');if(notice)notice.hidden=!active;apply()},0)}
  if(viewport)new ResizeObserver(alignLocationLayer).observe(viewport);
  const canvas=document.getElementById('spawnCanvas');if(canvas)new MutationObserver(alignLocationLayer).observe(canvas,{attributes:true,attributeFilter:['style']});
  if(viewport)new MutationObserver(()=>{Object.keys(enabled).forEach(k=>enabled[k]=false);selectedLocation=null;schedule()}).observe(viewport,{attributes:true,attributeFilter:['data-map']});
  // Avoid watching the entire panel: legacy extensions and language overlays
  // also own nodes here. A separate draft notice keeps these writes isolated.
  new MutationObserver(schedule).observe(document.documentElement,{attributes:true,attributeFilter:['data-ui-language']});
  window.addEventListener('arc-language-change',schedule);
  document.getElementById('spawnMapImage')?.addEventListener('load',schedule);
  schedule();
})();
