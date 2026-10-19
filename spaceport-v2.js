// Spaceport test pilot: approved single-file map base, zero legacy coordinates.
(()=>{
  const copy={
    de:{
      spawns:"RAIDER-SPAWNS · ENTWURF", spawnDraft:"Spawn-Entwurf · Community-Position; nicht im Spiel bestätigt.",
      spawnBody:"20 Community-Spawns als Review-Satz eingetragen.",
      cases:"WAFFENKISTEN · ENTWURF", caseDraft:"Waffenkisten-Entwurf · Community-Position; Spawn kann zufällig oder bedingt sein.",
      caseBody:"23 Community-Waffenkisten als Review-Satz eingetragen.",
      activeHatches:"4 Raider-Luken · Positionen zur Prüfung", close:"Details schließen",
      active:"4 Lastenaufzüge · Positionen zur Prüfung", draft:"Position zur Prüfung · ungefähr, Eingang nicht bestätigt.",
      loading:"Spaceport-Karte wird geladen …", raidersLegacy:"RAIDER-SPAWNS // NEU", casesLegacy:"WAFFENKISTEN // NEU",
      freight:"LASTENAUFZÜGE · ENTWURF", hatches:"RAIDER-LUKEN · ENTWURF",
      pending:"wird komplett neu kartiert", ready:"SPACEPORT // NEUE KARTENBASIS",
      body:"Illustrative Kartenbasis: Die Übereinstimmung mit der Spielkarte ist nicht geprüft. Lastenaufzüge und Raider-Luken beruhen auf visuellen Entwürfen; Spawns und Waffenkisten auf dem Community-Snapshot vom 28.09.2026. Alle Positionen sind ungeprüfte Entwürfe.",
      source:"Kartenbasis: vorhandene Illustration; Herkunft und Nutzungsgrundlage noch zu prüfen",
      none:"Keine Ebene aktiv · Entwürfe verfügbar", mapError:"Die Spaceport-Karte konnte nicht geladen werden."
    },
    en:{
      spawns:"RAIDER SPAWNS · DRAFT", spawnDraft:"Spawn draft · community position; not verified in-game.",
      spawnBody:"20 community spawns added as a review set.",
      cases:"WEAPON CRATES · DRAFT", caseDraft:"Weapon-crate draft · community position; spawn may be random or conditional.",
      caseBody:"23 community weapon crates added as a review set.",
      activeHatches:"4 Raider Hatches · positions for review", close:"Close details",
      active:"4 freight elevators · positions for review", draft:"Position for review · approximate, entrance not confirmed.",
      loading:"Loading Spaceport map …", raidersLegacy:"RAIDER SPAWNS // REBUILD", casesLegacy:"WEAPON CASES // REBUILD",
      freight:"FREIGHT ELEVATORS · DRAFT", hatches:"RAIDER HATCHES · DRAFT",
      pending:"being remapped from scratch", ready:"SPACEPORT // NEW MAP BASE",
      body:"Illustrative map base: fidelity to the game map has not been verified. Freight elevators and Raider Hatches use visual drafts; spawns and weapon crates use the community snapshot dated 2026-09-28. All positions remain unverified drafts.",
      source:"Map base: existing illustration; origin and permitted use still need verification",
      none:"No layer active · drafts available", mapError:"The Spaceport map could not be loaded."
    },
    fr:{
      spawns:"APPARITIONS RAIDER · BROUILLON", spawnDraft:"Apparition provisoire · position communautaire, non vérifiée en jeu.",
      spawnBody:"20 apparitions communautaires ajoutées pour vérification.",
      cases:"CAISSES D’ARMES · BROUILLON", caseDraft:"Caisse d’armes provisoire · position communautaire ; apparition potentiellement aléatoire ou conditionnelle.",
      caseBody:"23 caisses d’armes communautaires ajoutées pour vérification.",
      activeHatches:"4 trappes Raider · positions à vérifier", close:"Fermer les détails",
      active:"4 monte-charges · positions à vérifier", draft:"Position à vérifier · approximative, entrée non confirmée.",
      loading:"Chargement de la carte Spaceport …", raidersLegacy:"APPARITIONS // RECONSTRUCTION", casesLegacy:"CAISSES D’ARMES // RECONSTRUCTION",
      freight:"MONTE-CHARGES · BROUILLON", hatches:"TRAPPES RAIDER · BROUILLON",
      pending:"recartographie complète en cours", ready:"SPACEPORT // NOUVELLE CARTE",
      body:"Carte illustrative : fidélité au jeu non vérifiée. Les monte-charges et trappes sont des brouillons visuels ; les apparitions et caisses proviennent du relevé communautaire du 28/09/2026. Toutes les positions restent non vérifiées.",
      source:"Fond de carte : illustration existante ; origine et droit d’utilisation à vérifier",
      none:"Aucune couche active · brouillons disponibles", mapError:"La carte Spaceport n’a pas pu être chargée."
    },
    es:{
      spawns:"APARICIONES RAIDER · BORRADOR", spawnDraft:"Aparición provisional · posición comunitaria, sin verificar en el juego.",
      spawnBody:"20 apariciones comunitarias añadidas para revisión.",
      cases:"CAJAS DE ARMAS · BORRADOR", caseDraft:"Caja de armas provisional · posición comunitaria; la aparición puede ser aleatoria o condicional.",
      caseBody:"23 cajas de armas comunitarias añadidas para revisión.",
      activeHatches:"4 escotillas Raider · posiciones por revisar", close:"Cerrar detalles",
      active:"4 montacargas · posiciones por revisar", draft:"Posición por revisar · aproximada, entrada sin confirmar.",
      loading:"Cargando el mapa de Spaceport …", raidersLegacy:"APARICIONES // RECONSTRUCCIÓN", casesLegacy:"CAJAS DE ARMAS // RECONSTRUCCIÓN",
      freight:"MONTACARGAS · BORRADOR", hatches:"ESCOTILLAS RAIDER · BORRADOR",
      pending:"se está cartografiando desde cero", ready:"SPACEPORT // NUEVO MAPA BASE",
      body:"Mapa ilustrativo: fidelidad al juego sin verificar. Los montacargas y escotillas son borradores visuales; las apariciones y cajas proceden del registro comunitario del 28/09/2026. Todas las posiciones siguen sin verificar.",
      source:"Mapa base: ilustración existente; origen y permiso de uso pendientes de verificar",
      none:"Ninguna capa activa · borradores disponibles", mapError:"No se pudo cargar el mapa de Spaceport."
    }
  };

  copy.it={"spawns": "SPAWN RAIDER · BOZZA", "spawnDraft": "Bozza di spawn · posizione della community, non verificata nel gioco.", "spawnBody": "20 spawn della community da verificare.", "cases": "CASSE ARMI · BOZZA", "caseDraft": "Bozza di cassa armi · posizione della community; ritrovamento casuale o condizionale.", "caseBody": "23 casse della community da verificare.", "activeHatches": "4 botole Raider · posizioni da verificare", "close": "Chiudi dettagli", "active": "4 ascensori merci · posizioni da verificare", "draft": "Posizione approssimativa da verificare; ingresso non confermato.", "loading": "Caricamento mappa Spazioporto …", "raidersLegacy": "SPAWN RAIDER // BOZZA", "casesLegacy": "CASSE ARMI // BOZZA", "freight": "ASCENSORI MERCI · BOZZA", "hatches": "BOTOLE RAIDER · BOZZA", "pending": "Mappa da verificare", "ready": "SPAZIOPORTO // MAPPA ILLUSTRATIVA", "body": "Mappa illustrativa: fedeltà al gioco non verificata. Gli ascensori e le botole sono bozze visive; gli spawn e le casse provengono dal registro della community del 28/09/2026. Tutte le posizioni restano non verificate.", "source": "Mappa: illustrazione esistente; origine e permesso d’uso da verificare", "none": "Nessun livello attivo · bozze disponibili", "mapError": "Impossibile caricare la mappa Spazioporto."};

  const caseStyle=document.createElement('style');
  caseStyle.id='spaceportCaseReviewStyles';
  caseStyle.textContent='#layerSpaceportCases[hidden],#layerWeaponCases[hidden]{display:none!important}#spawnCanvas .spaceport-freight-marker.spaceport-case-marker{width:15px;height:12px!important;min-height:12px!important;border-radius:2px!important;border-color:#f0a6a6!important;background:#2a1515!important;color:#ffd4d4!important;font-size:6px!important}#spawnCanvas .spaceport-freight-marker.spaceport-case-marker[aria-pressed="true"]{border-color:#fff!important;background:#713535!important;color:#fff!important}';
  document.head.appendChild(caseStyle);

  let freightEnabled=false;
  let hatchesEnabled=false;
  let spawnsEnabled=false;
  let casesEnabled=false;
  let spawnPoints=[];
  let casePoints=[];
  let hatchPoints=[];
  let selectedId=null;
  let points=[];
  let lastMap=null;

  function language(){
    const l=(localStorage.getItem('arcUiLanguage')||window.arcCurrentLanguage?.()||document.documentElement.lang||'en').slice(0,2).toLowerCase();
    return copy[l]?l:'de';
  }
  function t(){return copy[language()]}
  function isSpaceport(){return document.getElementById('spawnMapSelect')?.value==='spaceport'}
  function visiblePoints(){
    return [
      ...(freightEnabled?points:[]),
      ...(hatchesEnabled?hatchPoints:[]),
      ...(spawnsEnabled?spawnPoints:[]),
      ...(casesEnabled?casePoints:[])
    ];
  }

  function clearSpaceportMarkers(){
    ['spawnMarkers','weaponCaseMarkers','extractionMarkers'].forEach(id=>{
      const node=document.getElementById(id);
      if(node){node.innerHTML='';node.hidden=true}
    });
    try{if(typeof mapLayers==='object'){mapLayers.raiders=false;mapLayers.weaponCases=false}}catch{}
  }

  function setDisabled(btn,label){
    if(!btn)return;
    btn.hidden=false;
    btn.setAttribute('aria-pressed','false');
    btn.setAttribute('aria-disabled','true');
    btn.disabled=true;
    btn.classList.add('spaceport-v2-pending');
    const labelNode=btn.querySelector('span:last-child');
    if(labelNode)labelNode.textContent=label;
    btn.title=t().pending;
  }

  function ensureToggle(id,layer,label){
    const controls=document.querySelector('.map-layer-controls');
    if(!controls)return null;
    let btn=document.getElementById(id);
    if(!btn){
      btn=document.createElement('button');
      btn.id=id;
      btn.className='map-layer-toggle spaceport-v2-pending';
      btn.type='button';
      btn.dataset.layer=layer;
      btn.innerHTML='<span class="layer-indicator"></span><span></span>';
      controls.appendChild(btn);
    }
    setDisabled(btn,label);
    return btn;
  }

  function restoreLegacyButtons(){
    const labels={
      de:{r:'RAIDER-SPAWNS',w:'WAFFENKISTEN'}, en:{r:'RAIDER SPAWNS',w:'WEAPON CASES'},
      fr:{r:'APPARITIONS RAIDER',w:'CAISSES D’ARMES'}, es:{r:'APARICIONES RAIDER',w:'CAJAS DE ARMAS'}
    }[language()]||{r:'RAIDER SPAWNS',w:'WEAPON CASES'};
    const r=document.getElementById('layerRaiders');
    const w=document.getElementById('layerWeaponCases');
    [r,w].forEach(btn=>{if(btn){btn.hidden=false;btn.disabled=false;btn.removeAttribute('aria-disabled');btn.classList.remove('spaceport-v2-pending');btn.title=''}});
    const rl=document.getElementById('layerRaidersLabel');if(rl)rl.textContent=labels.r;
    const wl=document.getElementById('layerWeaponCasesLabel');if(wl)wl.textContent=labels.w;
    ['layerSpaceportFreight','layerSpaceportHatches','layerSpaceportSpawns','layerSpaceportCases'].forEach(id=>{
      const btn=document.getElementById(id);if(btn)btn.hidden=true;
    });
  }

  function setInfo(){
    const title=document.getElementById('spawnPendingTitle');if(title)title.textContent=t().ready;
    const image=document.getElementById('spawnMapImage');
    const loaded=image?.complete&&image.naturalWidth>0;
    const body=document.getElementById('spawnPendingBody');
    if(body)body.textContent=loaded?`${t().body} ${t().spawnBody} ${t().caseBody}`:(image?.complete?t().mapError:t().loading);
    const credit=document.getElementById('spawnImageCredit');if(credit)credit.textContent=t().source;
    document.querySelector('.spawn-legend')?.classList.remove('layer-raiders','layer-cases','layer-extractions');
    const legendText=document.getElementById('spawnLegendText');
    if(legendText)legendText.textContent=[
      freightEnabled?t().active:'',
      hatchesEnabled?t().activeHatches:'',
      spawnsEnabled?`${spawnPoints.length} · ${t().spawns}`:'',
      casesEnabled?`${casePoints.length} · ${t().cases}`:''
    ].filter(Boolean).join(' + ')||t().none;
    const selected=document.getElementById('spawnSelected');if(selected){selected.hidden=true;selected.innerHTML=''}
    document.getElementById('spaceportV2Key')?.remove();
  }

  function ensureMarkerLayer(){
    const canvas=document.getElementById('spawnCanvas');
    if(!canvas)return null;
    let layer=document.getElementById('spaceportFreightMarkers');
    if(!layer){
      layer=document.createElement('div');
      layer.id='spaceportFreightMarkers';
      layer.className='spaceport-freight-layer';
      canvas.appendChild(layer);
    }
    return layer;
  }

  function positionMarkerLayer(){
    const image=document.getElementById('spawnMapImage');
    const layer=document.getElementById('spaceportFreightMarkers');
    if(!image||!layer||!image.naturalWidth)return;
    const cw=image.clientWidth,ch=image.clientHeight;
    const contain=getComputedStyle(image).objectFit==='contain';
    const ratio=(contain?Math.min:Math.max)(cw/image.naturalWidth,ch/image.naturalHeight);
    const width=image.naturalWidth*ratio,height=image.naturalHeight*ratio;
    Object.assign(layer.style,{left:`${(cw-width)/2}px`,top:`${(ch-height)/2}px`,width:`${width}px`,height:`${height}px`});
    const transform=getComputedStyle(image.parentElement).transform;
    const scale=transform==='none'?1:new DOMMatrixReadOnly(transform).a;
    layer.style.setProperty('--freight-marker-scale',String(1/Math.max(1,scale)));
  }

  function pointKind(point){
    if(point.id.startsWith('RS-'))return 'spawn';
    if(point.id.startsWith('WC-'))return 'case';
    if(point.id.startsWith('RH-'))return 'hatch';
    return 'freight';
  }

  function pointNote(point){
    const kind=pointKind(point);
    return kind==='spawn'?t().spawnDraft:kind==='case'?t().caseDraft:t().draft;
  }

  function renderDetails(){
    let card=document.getElementById('spaceportFreightDetails');
    if(!card){
      card=document.createElement('div');card.id='spaceportFreightDetails';
      card.className='spaceport-freight-details';card.setAttribute('role','status');
      document.getElementById('spawnViewport')?.after(card);
    }
    const point=visiblePoints().find(p=>p.id===selectedId);
    card.hidden=!isSpaceport()||!point;
    card.replaceChildren();
    if(card.hidden)return;
    const title=document.createElement('strong');title.textContent=`${point.id} · ${point.label[language()]||point.label.en}`;
    const note=document.createElement('span');note.textContent=pointNote(point);
    const close=document.createElement('button');close.type='button';close.textContent='×';close.setAttribute('aria-label',t().close);
    close.addEventListener('click',()=>{selectedId=null;renderMarkers();document.querySelector(`[data-freight-id="${point.id}"]`)?.focus()});
    card.append(title,note,close);
  }

  function renderMarkers(){
    const layer=ensureMarkerLayer();if(!layer)return;
    layer.hidden=!isSpaceport()||!(freightEnabled||hatchesEnabled||spawnsEnabled||casesEnabled);
    layer.replaceChildren();
    if(!layer.hidden)visiblePoints().forEach(point=>{
      const kind=pointKind(point);
      const number=Number(point.id.split('-')[1]);
      const marker=document.createElement('button');
      marker.className='spaceport-freight-marker'
        +(kind==='spawn'?' spaceport-spawn-marker':'')
        +(kind==='hatch'?' spaceport-hatch-marker':'')
        +(kind==='case'?' spaceport-case-marker':'');
      marker.type='button';marker.dataset.freightId=point.id;
      marker.style.left=`${point.x}%`;marker.style.top=`${point.y}%`;
      marker.textContent=kind==='spawn'?`S${number}`:kind==='case'?`W${number}`:kind==='hatch'?String(number):`↕ ${number}`;
      const label=kind==='spawn'?t().spawns:kind==='case'?t().cases:kind==='hatch'?t().hatches:t().freight;
      marker.setAttribute('aria-label',`${label} ${number}: ${point.label[language()]||point.label.en}. ${pointNote(point)}`);
      marker.setAttribute('aria-pressed',String(selectedId===point.id));
      marker.addEventListener('pointerdown',event=>event.stopPropagation());
      marker.addEventListener('click',event=>{
        event.stopPropagation();selectedId=selectedId===point.id?null:point.id;
        renderMarkers();document.querySelector(`[data-freight-id="${point.id}"]`)?.focus();
      });
      layer.appendChild(marker);
    });
    positionMarkerLayer();renderDetails();
  }

  function configureToggle(id,layer,label,enabled,getPoints,note,boundKey,toggle){
    const button=ensureToggle(id,layer,label);
    if(!button||!getPoints().length)return;
    button.hidden=false;button.disabled=false;button.removeAttribute('aria-disabled');button.classList.remove('spaceport-v2-pending');
    button.setAttribute('aria-pressed',String(enabled));button.title=note;
    if(!button.dataset[boundKey]){
      button.dataset[boundKey]='true';
      button.addEventListener('click',()=>{if(!isSpaceport())return;toggle();selectedId=null;applySpaceport()});
    }
  }

  function configureFreightToggle(){
    configureToggle('layerSpaceportFreight','spaceport-freight',t().freight,freightEnabled,()=>points,t().draft,'freightBound',()=>{freightEnabled=!freightEnabled});
  }
  function configureHatchToggle(){
    configureToggle('layerSpaceportHatches','spaceport-hatches',t().hatches,hatchesEnabled,()=>hatchPoints,t().draft,'hatchBound',()=>{hatchesEnabled=!hatchesEnabled});
  }
  function configureSpawnToggle(){
    configureToggle('layerSpaceportSpawns','spaceport-spawns',t().spawns,spawnsEnabled,()=>spawnPoints,t().spawnDraft,'spawnBound',()=>{spawnsEnabled=!spawnsEnabled});
  }
  function configureCaseToggle(){
    configureToggle('layerSpaceportCases','spaceport-cases',t().cases,casesEnabled,()=>casePoints,t().caseDraft,'caseBound',()=>{casesEnabled=!casesEnabled});
  }

  function applySpaceport(){
    const currentMap=document.getElementById('spawnMapSelect')?.value;
    if(currentMap!==lastMap){
      freightEnabled=false;hatchesEnabled=false;spawnsEnabled=false;casesEnabled=false;selectedId=null;lastMap=currentMap;
    }
    if(!isSpaceport()){
      restoreLegacyButtons();renderMarkers();return;
    }
    clearSpaceportMarkers();
    setDisabled(document.getElementById('layerRaiders'),t().raidersLegacy);
    const legacyRaiders=document.getElementById('layerRaiders');if(legacyRaiders)legacyRaiders.hidden=true;
    setDisabled(document.getElementById('layerWeaponCases'),t().casesLegacy);
    const legacyCases=document.getElementById('layerWeaponCases');if(legacyCases)legacyCases.hidden=true;
    configureFreightToggle();configureHatchToggle();configureSpawnToggle();configureCaseToggle();
    setInfo();renderMarkers();
  }

  document.getElementById('spawnMapSelect')?.addEventListener('change',()=>setTimeout(applySpaceport,120));
  ['deBtn','enBtn','frBtn','esBtn'].forEach(id=>document.getElementById(id)?.addEventListener('click',()=>setTimeout(applySpaceport,60)));
  window.addEventListener('arc-language-change',applySpaceport);
  const img=document.getElementById('spawnMapImage');
  if(img)new ResizeObserver(positionMarkerLayer).observe(img);
  const canvas=document.getElementById('spawnCanvas');
  if(canvas)new MutationObserver(positionMarkerLayer).observe(canvas,{attributes:true,attributeFilter:['style']});
  img?.addEventListener('load',applySpaceport);
  img?.addEventListener('error',applySpaceport);

  fetch('spaceport-fresh-v2.json?v=source-audit-1',{cache:'no-store'})
    .then(response=>{if(!response.ok)throw new Error('Spaceport data unavailable');return response.json()})
    .then(data=>{
      const valid=p=>Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.x>=0&&p.x<=100&&p.y>=0&&p.y<=100;
      points=(data.layers?.freightElevators?.points||[]).filter(valid);
      hatchPoints=(data.layers?.raiderHatches?.points||[]).filter(valid);
      spawnPoints=(data.layers?.raiderSpawns?.points||[]).filter(valid);
      casePoints=(data.layers?.weaponCases?.points||[]).filter(valid);
      applySpaceport();
    })
    .catch(error=>{console.warn(error);applySpaceport()});
  setTimeout(applySpaceport,180);
})();
