// Pendola Pass: draft status only. Reuses existing map loading, zoom and pan.
(()=>{
  const copy={
    de:{badge:'KARTENENTWURF',title:'Pendola Pass – im Ausbau',body:'Eigene schematische Zeichnung anhand von vier Screenshots. Positionen sind angenähert; Randbereiche und kleine Details sind unvollständig. Keine bestätigten Spawn-, Loot- oder Extraktionsmarker.',unavailable:'Noch keine bestätigten Marker',source:'Kartenbasis: Ramas Field Tool · eigene Zeichnung · Screenshot-Referenzen',names:'Ortsnamen aus den deutschen Referenzbildern',alt:'Pendola Pass – eigene schematische Kartenzeichnung, geografischer Entwurf'},
    en:{badge:'MAP DRAFT',title:'Pendola Pass – work in progress',body:'Original schematic drawing based on four screenshots. Positions are approximate; edges and small details are incomplete. No confirmed spawn, loot or extraction markers.',unavailable:'No confirmed markers yet',source:'Map base: Ramas Field Tool · original drawing · screenshot references',names:'Place names from the German reference images',alt:'Pendola Pass – original schematic map drawing, geographic draft'},
    fr:{badge:'CARTE PROVISOIRE',title:'Pendola Pass – en construction',body:'Dessin schématique original basé sur quatre captures. Positions approximatives ; bords et petits détails incomplets. Aucun marqueur confirmé d’apparition, de butin ou d’extraction.',unavailable:'Aucun marqueur confirmé',source:'Fond de carte : Ramas Field Tool · dessin original · captures de référence',names:'Noms des lieux issus des captures allemandes',alt:'Pendola Pass – dessin schématique original, géographie provisoire'},
    es:{badge:'BORRADOR DEL MAPA',title:'Pendola Pass – en desarrollo',body:'Dibujo esquemático propio basado en cuatro capturas. Posiciones aproximadas; bordes y detalles pequeños incompletos. Sin marcadores confirmados de aparición, botín o extracción.',unavailable:'Sin marcadores confirmados',source:'Mapa base: Ramas Field Tool · dibujo propio · capturas de referencia',names:'Nombres de lugares de las capturas alemanas',alt:'Pendola Pass – dibujo esquemático propio, borrador geográfico'},
    it:{badge:'BOZZA DELLA MAPPA',title:'Pendola Pass – in sviluppo',body:'Disegno schematico originale basato su quattro schermate. Posizioni approssimative; bordi e piccoli dettagli incompleti. Nessun indicatore confermato di spawn, bottino o estrazione.',unavailable:'Nessun indicatore confermato',source:'Mappa base: Ramas Field Tool · disegno originale · schermate di riferimento',names:'Nomi dei luoghi dalle schermate tedesche',alt:'Pendola Pass – disegno schematico originale, bozza geografica'}
  };
  const viewport=document.getElementById('spawnViewport');
  const info=document.querySelector('#spawnPanel .spawn-map-info');
  const originalInfoDisplay=info?.style.display||'';
  function set(id,text){const n=document.getElementById(id);if(n&&n.textContent!==text)n.textContent=text}
  function apply(){
    const active=viewport?.dataset.map==='pendola-pass'&&document.getElementById('spawnMapSelect')?.value==='pendola-pass';
    const l=(window.arcCurrentLanguage?.()||document.documentElement.lang||'de').slice(0,2);
    const c=copy[l]||copy.en;
    if(!active)return;
    set('spawnBadge',c.badge);set('spawnLegendText',c.unavailable);set('spawnImageCredit',c.source);
    let notice=document.getElementById('pendolaDraftNotice');if(!notice){notice=document.createElement('div');notice.id='pendolaDraftNotice';notice.className='spawn-note';notice.setAttribute('role','note');notice.innerHTML='<strong></strong><p></p>';document.querySelector('.spawn-map-instructions')?.before(notice)}
    notice.hidden=false;const title=notice.querySelector('strong'),message=notice.querySelector('p');if(title.textContent!==c.title)title.textContent=c.title;if(message.textContent!==c.body)message.textContent=c.body;
    document.getElementById('spawnMapImage')?.setAttribute('alt',c.alt);
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
  window.addEventListener('arc-language-change',schedule);
  document.getElementById('spawnMapImage')?.addEventListener('load',schedule);
  schedule();
})();
