// Pendola Pass: draft status only. Reuses existing map loading, zoom and pan.
(()=>{
  const copy={
  "de": {
    "badge": "ORIGINALKARTE",
    "title": "Pendola Pass – im Ausbau",
    "body": "Foto der originalen Spielkarte. Wähle Übersicht, Norden, Mitte oder Süden für mehr Details. Symbole und Beschriftungen sind bereits im Foto enthalten. Fotoqualität und sichtbarer Ausschnitt sind begrenzt; keine separat bestätigten Spielmarker.",
    "unavailable": "Symbole im Foto · keine eigenen Marker",
    "source": "Kartenbasis: Original-Spielkarte · vom Nutzer bereitgestellte Fotos",
    "names": "Ortsnamen aus den deutschen Referenzbildern",
    "alt": "Pendola Pass – Foto der originalen Spielkarte",
    "view": "Kartenausschnitt",
    "views": [
      "Übersicht",
      "Norden",
      "Mitte",
      "Süden"
    ]
  },
  "en": {
    "badge": "ORIGINAL MAP",
    "title": "Pendola Pass – work in progress",
    "body": "Photograph of the original in-game map. Choose overview, north, middle or south for more detail. Icons and labels are embedded in the photo. Photo quality and framing are limited; no separately confirmed gameplay markers.",
    "unavailable": "Photo icons · no added markers",
    "source": "Map base: original in-game map · user-provided photographs",
    "names": "Place names from the German reference images",
    "alt": "Pendola Pass – photograph of the original in-game map",
    "view": "Map section",
    "views": [
      "Overview",
      "North",
      "Middle",
      "South"
    ]
  },
  "fr": {
    "badge": "CARTE ORIGINALE",
    "title": "Pendola Pass – en construction",
    "body": "Photo de la carte originale du jeu. Choisissez la vue d’ensemble, le nord, le centre ou le sud. Les icônes et noms sont intégrés à la photo. Qualité et cadrage limités ; aucun marqueur de jeu confirmé séparément.",
    "unavailable": "Icônes de la photo · aucun ajout",
    "source": "Fond : carte originale du jeu · photos fournies par l’utilisateur",
    "names": "Noms des lieux issus des captures allemandes",
    "alt": "Pendola Pass – photo de la carte originale du jeu",
    "view": "Section de carte",
    "views": [
      "Vue d’ensemble",
      "Nord",
      "Centre",
      "Sud"
    ]
  },
  "es": {
    "badge": "MAPA ORIGINAL",
    "title": "Pendola Pass – en desarrollo",
    "body": "Foto del mapa original del juego. Elige vista general, norte, centro o sur. Los iconos y nombres están integrados en la foto. Calidad y encuadre limitados; sin marcadores de juego confirmados por separado.",
    "unavailable": "Iconos de la foto · sin añadidos",
    "source": "Mapa base: mapa original del juego · fotos proporcionadas por el usuario",
    "names": "Nombres de lugares de las capturas alemanas",
    "alt": "Pendola Pass – foto del mapa original del juego",
    "view": "Sección del mapa",
    "views": [
      "Vista general",
      "Norte",
      "Centro",
      "Sur"
    ]
  },
  "it": {
    "badge": "MAPPA ORIGINALE",
    "title": "Pendola Pass – in sviluppo",
    "body": "Foto della mappa originale del gioco. Scegli panoramica, nord, centro o sud. Icone e nomi sono inclusi nella foto. Qualità e inquadratura limitate; nessun indicatore di gioco confermato separatamente.",
    "unavailable": "Icone nella foto · nessuna aggiunta",
    "source": "Mappa base: mappa originale del gioco · foto fornite dall’utente",
    "names": "Nomi dei luoghi dalle schermate tedesche",
    "alt": "Pendola Pass – foto della mappa originale del gioco",
    "view": "Sezione della mappa",
    "views": [
      "Panoramica",
      "Nord",
      "Centro",
      "Sud"
    ]
  }
};
  const viewport=document.getElementById('spawnViewport');
  let currentView='overview';
  const style=document.createElement('style');style.textContent='#spawnViewport[data-map="pendola-pass"] .spawn-canvas img{object-fit:contain!important;filter:none!important}#pendolaViewPicker{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin:8px 0}#pendolaViewPicker select{min-height:44px;max-width:100%;padding:8px;background:var(--ui-panel);color:var(--ui-text);border:1px solid var(--ui-line)}#pendolaViewPicker[hidden]{display:none}';document.head.appendChild(style);
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
    let picker=document.getElementById('pendolaViewPicker');
    if(!picker){picker=document.createElement('label');picker.id='pendolaViewPicker';picker.innerHTML='<span></span><select id="pendolaReferenceSelect"></select>';notice.after(picker);picker.querySelector('select').addEventListener('change',event=>{currentView=event.target.value;if(typeof resetSpawnView==='function')resetSpawnView();apply()})}
    picker.hidden=false;const pickerLabel=picker.querySelector('span');if(pickerLabel.textContent!==c.view)pickerLabel.textContent=c.view;
    const views=typeof spawnData!=='undefined'?spawnData?.referenceViews||[]:[];
    const select=picker.querySelector('select');select.setAttribute('aria-label',c.view);
    const signature=JSON.stringify(views.map((view,i)=>[view.id,c.views[i]||view.id]));
    if(select.dataset.signature!==signature){select.replaceChildren(...views.map((view,i)=>{const option=document.createElement('option');option.value=view.id;option.textContent=c.views[i]||view.id;return option}));select.dataset.signature=signature}select.value=currentView;
    const selected=views.find(view=>view.id===currentView)||views[0];const image=document.getElementById('spawnMapImage');
    if(image){image.alt=c.alt+' · '+(c.views[views.indexOf(selected)]||'');if(selected&&image.getAttribute('src')!==selected.image)image.src=selected.image;}

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
  function schedule(){setTimeout(()=>{const active=viewport?.dataset.map==='pendola-pass';if(info)info.style.display=active?'none':originalInfoDisplay;const picker=document.getElementById('pendolaViewPicker');if(picker)picker.hidden=!active;if(!active)currentView='overview';const names=document.getElementById('pendolaPlaceNames');if(names)names.hidden=!active;const notice=document.getElementById('pendolaDraftNotice');if(notice)notice.hidden=!active;apply()},0)}
  if(viewport)new MutationObserver(schedule).observe(viewport,{attributes:true,attributeFilter:['data-map']});
  // Avoid watching the entire panel: legacy extensions and language overlays
  // also own nodes here. A separate draft notice keeps these writes isolated.
  new MutationObserver(schedule).observe(document.documentElement,{attributes:true,attributeFilter:['data-ui-language']});
  window.addEventListener('arc-language-change',schedule);
  document.getElementById('spawnMapImage')?.addEventListener('load',schedule);
  schedule();
})();
