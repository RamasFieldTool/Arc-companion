// Spaceport test pilot: approved single-file map base, zero legacy coordinates.
(()=>{

  const copy={
    de:{activeBoth:"4 Lastenaufzüge + 4 Raider-Luken · Positionen zur Prüfung",activeHatches:"4 Raider-Luken · Positionen zur Prüfung",close:"Details schließen",active:"4 Lastenaufzüge · Positionen zur Prüfung",draft:"Position zur Prüfung · ungefähr, Eingang nicht bestätigt.",loading:'Spaceport-Karte wird geladen …',raiders:'RAIDER-SPAWNS // NEU',cases:'WAFFENKISTEN // NEU',freight:"LASTENAUFZÜGE · ENTWURF",hatches:"RAIDER-LUKEN · ENTWURF",pending:'wird komplett neu kartiert',ready:'SPACEPORT // NEUE KARTENBASIS',body:"Kartenbasis bestätigt. Lastenaufzüge und Raider-Luken wurden anhand deiner Screenshots neu zugeordnet. Alle Positionen sind Entwürfe; die gezeichnete Karte weicht örtlich von der Ingame-Geometrie ab.",source:'Kartenbasis: Ramas Field Tool – eigene detaillierte Spaceport-Karte',none:"Keine Ebene aktiv · Extraktionen als Entwurf verfügbar",mapError:'Die Spaceport-Karte konnte nicht geladen werden.'},
    en:{activeBoth:"4 freight elevators + 4 Raider Hatches · positions for review",activeHatches:"4 Raider Hatches · positions for review",close:"Close details",active:"4 freight elevators · positions for review",draft:"Position for review · approximate, entrance not confirmed.",loading:'Loading Spaceport map …',raiders:'RAIDER SPAWNS // REBUILD',cases:'WEAPON CASES // REBUILD',freight:"FREIGHT ELEVATORS · DRAFT",hatches:"RAIDER HATCHES · DRAFT",pending:'being remapped from scratch',ready:'SPACEPORT // NEW MAP BASE',body:"Map base approved. Freight elevators and Raider Hatches were newly matched using your screenshots. All positions are drafts; the drawn map differs locally from the in-game geometry.",source:'Map base: Ramas Field Tool – original detailed Spaceport map',none:"No layer active · extraction drafts available",mapError:'The Spaceport map could not be loaded.'},
    fr:{activeBoth:"4 monte-charges + 4 trappes Raider · positions à vérifier",activeHatches:"4 trappes Raider · positions à vérifier",close:"Fermer les détails",active:"4 monte-charges · positions à vérifier",draft:"Position à vérifier · approximative, entrée non confirmée.",loading:'Chargement de la carte Spaceport …',raiders:'APPARITIONS // RECONSTRUCTION',cases:'CAISSES D’ARMES // RECONSTRUCTION',freight:"MONTE-CHARGES · BROUILLON",hatches:"TRAPPES RAIDER · BROUILLON",pending:'recartographie complète en cours',ready:'SPACEPORT // NOUVELLE CARTE',body:"Fond de carte validé. Les monte-charges et trappes Raider ont été repositionnés à partir de vos captures. Toutes les positions restent provisoires ; la géométrie dessinée diffère localement de celle du jeu.",source:'Fond de carte : Ramas Field Tool – carte détaillée originale de Spaceport',none:"Aucune couche active · extractions provisoires disponibles",mapError:'La carte Spaceport n’a pas pu être chargée.'},
    es:{activeBoth:"4 montacargas + 4 escotillas Raider · posiciones por revisar",activeHatches:"4 escotillas Raider · posiciones por revisar",close:"Cerrar detalles",active:"4 montacargas · posiciones por revisar",draft:"Posición por revisar · aproximada, entrada sin confirmar.",loading:'Cargando el mapa Spaceport …',raiders:'APARICIONES // RECONSTRUCCIÓN',cases:'CAJAS DE ARMAS // RECONSTRUCCIÓN',freight:"MONTACARGAS · BORRADOR",hatches:"ESCOTILLAS RAIDER · BORRADOR",pending:'se está cartografiando desde cero',ready:'SPACEPORT // NUEVO MAPA BASE',body:"Mapa base aprobado. Se han reubicado los montacargas y las escotillas Raider a partir de tus capturas. Todas las posiciones son provisionales; la geometría del mapa dibujado difiere localmente de la del juego.",source:'Mapa base: Ramas Field Tool – mapa detallado original de Spaceport',none:"Ninguna capa activa · extracciones provisionales disponibles",mapError:'No se pudo cargar el mapa de Spaceport.'}
  };

  let freightEnabled=false;
  let hatchesEnabled=false;
  let hatchPoints=[];
  let selectedId=null;
  let points=[];
  let lastMap=null;
  function language(){
    const l=(window.arcCurrentLanguage?.()||document.documentElement.lang||'de').slice(0,2).toLowerCase();
    return copy[l]?l:'de';
  }
  function visiblePoints(){return [...(freightEnabled?points:[]),...(hatchesEnabled?hatchPoints:[])]}
  function t(){return copy[language()]}
  function isSpaceport(){return document.getElementById('spawnMapSelect')?.value==='spaceport'}

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

  function ensurePendingToggle(id,layer,label){
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
    const labels={de:{r:'RAIDER-SPAWNS',w:'WAFFENKISTEN'},en:{r:'RAIDER SPAWNS',w:'WEAPON CASES'},fr:{r:'APPARITIONS RAIDER',w:'CAISSES D’ARMES'},es:{r:'APARICIONES RAIDER',w:'CAJAS DE ARMAS'}}[language()]||{r:'RAIDER SPAWNS',w:'WEAPON CASES'};
    const r=document.getElementById('layerRaiders');
    const w=document.getElementById('layerWeaponCases');
    [r,w].forEach(btn=>{if(btn){btn.disabled=false;btn.removeAttribute('aria-disabled');btn.classList.remove('spaceport-v2-pending');btn.title=''}});
    const rl=document.getElementById('layerRaidersLabel');if(rl)rl.textContent=labels.r;
    const wl=document.getElementById('layerWeaponCasesLabel');if(wl)wl.textContent=labels.w;
    ['layerSpaceportFreight','layerSpaceportHatches'].forEach(id=>{const btn=document.getElementById(id);if(btn)btn.hidden=true});
  }

  function setInfo(){
    const title=document.getElementById('spawnPendingTitle');if(title)title.textContent=t().ready;
    const image=document.getElementById('spawnMapImage');
    const loaded=image?.complete&&image.naturalWidth>0;
    const body=document.getElementById('spawnPendingBody');
    if(body)body.textContent=loaded?t().body:(image?.complete?t().mapError:t().loading);
    const credit=document.getElementById('spawnImageCredit');if(credit)credit.textContent=t().source;
    document.querySelector('.spawn-legend')?.classList.remove('layer-raiders','layer-cases','layer-extractions');
    const legendText=document.getElementById('spawnLegendText');if(legendText)legendText.textContent=freightEnabled&&hatchesEnabled?t().activeBoth:freightEnabled?t().active:hatchesEnabled?t().activeHatches:t().none;
    const selected=document.getElementById('spawnSelected');if(selected){selected.hidden=true;selected.innerHTML=''}
    document.getElementById('spaceportV2Key')?.remove();
  }

  function ensureFreightLayer(){
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

  function positionFreightLayer(){
    const image=document.getElementById('spawnMapImage');
    const layer=document.getElementById('spaceportFreightMarkers');
    if(!image||!layer||!image.naturalWidth)return;
    const cw=image.clientWidth,ch=image.clientHeight;
    const contain=getComputedStyle(image).objectFit==='contain';
    const ratio=(contain?Math.min:Math.max)(cw/image.naturalWidth,ch/image.naturalHeight);
    const width=image.naturalWidth*ratio,height=image.naturalHeight*ratio;
    // Percentage positions refer to the actual bitmap, including large-view letterboxing.
    Object.assign(layer.style,{left:`${(cw-width)/2}px`,top:`${(ch-height)/2}px`,width:`${width}px`,height:`${height}px`});
    const transform=getComputedStyle(image.parentElement).transform;
    const scale=transform==='none'?1:new DOMMatrixReadOnly(transform).a;
    layer.style.setProperty('--freight-marker-scale',String(1/Math.max(1,scale)));
  }

  function renderFreightDetails(){
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
    const note=document.createElement('span');note.textContent=t().draft;
    const close=document.createElement('button');close.type='button';close.textContent='×';close.setAttribute('aria-label',t().close);
    close.addEventListener('click',()=>{selectedId=null;renderFreight();document.querySelector(`[data-freight-id="${point.id}"]`)?.focus()});
    card.append(title,note,close);
  }

  function renderFreight(){
    const layer=ensureFreightLayer();if(!layer)return;
    layer.hidden=!isSpaceport()||!(freightEnabled||hatchesEnabled);
    layer.replaceChildren();
    if(!layer.hidden)visiblePoints().forEach(point=>{
      const hatch=point.id.startsWith('RH-');
      const number=Number(point.id.split('-')[1]);
      const marker=document.createElement('button');
      marker.className='spaceport-freight-marker'+(hatch?' spaceport-hatch-marker':'');marker.type='button';marker.dataset.freightId=point.id;
      marker.style.left=`${point.x}%`;marker.style.top=`${point.y}%`;
      marker.textContent=hatch?String(number):`↕ ${number}`;
      marker.setAttribute('aria-label',`${hatch?t().hatches:t().freight} ${number}: ${point.label[language()]||point.label.en}. ${t().draft}`);
      marker.setAttribute('aria-pressed',String(selectedId===point.id));
      marker.addEventListener('pointerdown',event=>event.stopPropagation());
      marker.addEventListener('click',event=>{event.stopPropagation();selectedId=selectedId===point.id?null:point.id;renderFreight();document.querySelector(`[data-freight-id="${point.id}"]`)?.focus()});
      layer.appendChild(marker);
    });
    positionFreightLayer();renderFreightDetails();
  }

  function configureFreightToggle(){
    const button=ensurePendingToggle('layerSpaceportFreight','spaceport-freight',t().freight);
    if(!button||!points.length)return;
    button.disabled=false;button.removeAttribute('aria-disabled');button.classList.remove('spaceport-v2-pending');
    button.setAttribute('aria-pressed',String(freightEnabled));button.title=t().draft;
    if(!button.dataset.freightBound){
      button.dataset.freightBound='true';
      button.addEventListener('click',()=>{if(!isSpaceport())return;freightEnabled=!freightEnabled;selectedId=null;applySpaceport()});
    }
  }

  function configureHatchToggle(){
    const button=ensurePendingToggle('layerSpaceportHatches','spaceport-hatches',t().hatches);
    if(!button||!hatchPoints.length)return;
    button.disabled=false;button.removeAttribute('aria-disabled');button.classList.remove('spaceport-v2-pending');
    button.setAttribute('aria-pressed',String(hatchesEnabled));button.title=t().draft;
    if(!button.dataset.hatchBound){
      button.dataset.hatchBound='true';
      button.addEventListener('click',()=>{if(!isSpaceport())return;hatchesEnabled=!hatchesEnabled;selectedId=null;applySpaceport()});
    }
  }

  function applySpaceport(){
    const currentMap=document.getElementById('spawnMapSelect')?.value;
    if(currentMap!==lastMap){freightEnabled=false;hatchesEnabled=false;selectedId=null;lastMap=currentMap}
    if(!isSpaceport()){
      restoreLegacyButtons();
      renderFreight();
      return;
    }
    clearSpaceportMarkers();
    setDisabled(document.getElementById('layerRaiders'),t().raiders);
    setDisabled(document.getElementById('layerWeaponCases'),t().cases);
    configureFreightToggle();
    configureHatchToggle();
    setInfo();
    renderFreight();
  }

  document.getElementById('spawnMapSelect')?.addEventListener('change',()=>setTimeout(applySpaceport,120));
  ['deBtn','enBtn','frBtn','esBtn'].forEach(id=>document.getElementById(id)?.addEventListener('click',()=>setTimeout(applySpaceport,60)));
  window.addEventListener('arc-language-change',applySpaceport);
  const img=document.getElementById('spawnMapImage');
  if(img)new ResizeObserver(positionFreightLayer).observe(img);
  const canvas=document.getElementById('spawnCanvas');
  if(canvas)new MutationObserver(positionFreightLayer).observe(canvas,{attributes:true,attributeFilter:['style']});
  // The regular map renderer owns src via spaceport-fresh-v2.json.
  // Reapply the empty-layer state after asynchronous map loads, without rewriting src.
  img?.addEventListener('load',applySpaceport);
  img?.addEventListener('error',applySpaceport);
  fetch('spaceport-fresh-v2.json?v=hatches-draft-1',{cache:'no-store'})
    .then(response=>{if(!response.ok)throw new Error('Spaceport data unavailable');return response.json()})
    .then(data=>{
      const valid=p=>Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.x>=0&&p.x<=100&&p.y>=0&&p.y<=100;
      points=(data.layers?.freightElevators?.points||[]).filter(valid);
      hatchPoints=(data.layers?.raiderHatches?.points||[]).filter(valid);
      applySpaceport();
    })
    .catch(error=>{console.warn(error);applySpaceport()});
  setTimeout(applySpaceport,180);
})();
