// Spaceport V6 test pilot: approved detailed map base, zero legacy coordinates.
(()=>{
  const MAP_PARTS=[
    'assets/maps/spaceport-rft-base-v3.part01.b64?v=6',
    'assets/maps/spaceport-rft-base-v3.part02.b64?v=6',
    'assets/maps/spaceport-rft-base-v3.part03.b64?v=6',
    'assets/maps/spaceport-rft-base-v3.part04.b64?v=6',
    'assets/maps/spaceport-rft-base-v3.part05.b64?v=6',
    'assets/maps/spaceport-rft-base-v3.part06.b64?v=6',
    'assets/maps/spaceport-rft-base-v3.part07.b64?v=6'
  ];
  let mapDataUrl=null;
  let mapLoading=null;
  let settingMap=false;

  const copy={
    de:{raiders:'RAIDER-SPAWNS // NEU',cases:'WAFFENKISTEN // NEU',freight:'LASTENAUFZÜGE // NEU',hatches:'RAIDER-LUKEN // NEU',pending:'wird komplett neu kartiert',ready:'SPACEPORT // NEUE KARTENBASIS',body:'Die neue detaillierte Spaceport-Karte ist aktiv. Alle bisherigen Markerkoordinaten wurden verworfen. Raider-Spawns, Waffenkisten, Lastenaufzüge und Raider-Luken werden jetzt von Grund auf neu eingemessen.',source:'Kartenbasis: Ramas Field Tool – eigene detaillierte Spaceport-Karte',none:'Noch keine neu vermessene Ebene verfügbar',mapError:'Die neue Kartenbasis konnte nicht geladen werden. Bitte die Vorschau neu laden.'},
    en:{raiders:'RAIDER SPAWNS // REBUILD',cases:'WEAPON CASES // REBUILD',freight:'FREIGHT ELEVATORS // REBUILD',hatches:'RAIDER HATCHES // REBUILD',pending:'being remapped from scratch',ready:'SPACEPORT // NEW MAP BASE',body:'The new detailed Spaceport map is active. All previous marker coordinates have been discarded. Raider Spawns, Weapon Cases, Freight Elevators and Raider Hatches will now be measured again from scratch.',source:'Map base: Ramas Field Tool – original detailed Spaceport map',none:'No freshly measured layer available yet',mapError:'The new map base could not be loaded. Please reload the preview.'},
    fr:{raiders:'APPARITIONS // RECONSTRUCTION',cases:'CAISSES D’ARMES // RECONSTRUCTION',freight:'MONTE-CHARGES // RECONSTRUCTION',hatches:'TRAPPES RAIDER // RECONSTRUCTION',pending:'recartographie complète en cours',ready:'SPACEPORT // NOUVELLE CARTE',body:'La nouvelle carte détaillée de Spaceport est active. Toutes les anciennes coordonnées ont été abandonnées. Les apparitions, caisses d’armes, monte-charges et trappes Raider seront remesurés depuis zéro.',source:'Fond de carte : Ramas Field Tool – carte détaillée originale de Spaceport',none:'Aucune couche remesurée disponible pour le moment',mapError:'La nouvelle carte n’a pas pu être chargée. Recharge la prévisualisation.'},
    es:{raiders:'APARICIONES // RECONSTRUCCIÓN',cases:'CAJAS DE ARMAS // RECONSTRUCCIÓN',freight:'MONTACARGAS // RECONSTRUCCIÓN',hatches:'ESCOTILLAS RAIDER // RECONSTRUCCIÓN',pending:'se está cartografiando desde cero',ready:'SPACEPORT // NUEVO MAPA BASE',body:'El nuevo mapa detallado de Spaceport está activo. Se han descartado todas las coordenadas anteriores. Las apariciones, cajas de armas, montacargas y escotillas Raider se medirán de nuevo desde cero.',source:'Mapa base: Ramas Field Tool – mapa detallado original de Spaceport',none:'Todavía no hay ninguna capa recién medida disponible',mapError:'No se pudo cargar el nuevo mapa. Vuelve a cargar la vista previa.'}
  };

  function language(){
    try{if(typeof lang==='string'&&copy[lang])return lang}catch{}
    const l=(document.documentElement.lang||'de').slice(0,2).toLowerCase();
    return copy[l]?l:'de';
  }
  function t(){return copy[language()]}
  function isSpaceport(){return document.getElementById('spawnMapSelect')?.value==='spaceport'}

  async function getMapDataUrl(){
    if(mapDataUrl)return mapDataUrl;
    if(mapLoading)return mapLoading;
    mapLoading=Promise.all(MAP_PARTS.map(url=>fetch(url,{cache:'no-store'}).then(r=>{
      if(!r.ok)throw new Error(`Spaceport map part ${r.status}`);
      return r.text();
    }))).then(parts=>{
      mapDataUrl='data:image/webp;base64,'+parts.join('').replace(/\s+/g,'');
      return mapDataUrl;
    }).catch(err=>{
      console.error('Spaceport map load failed',err);
      mapLoading=null;
      return null;
    });
    return mapLoading;
  }

  function clearSpaceportMarkers(){
    ['spawnMarkers','weaponCaseMarkers','extractionMarkers','spaceportV2Markers'].forEach(id=>{
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
    const body=document.getElementById('spawnPendingBody');if(body)body.textContent=t().body;
    const credit=document.getElementById('spawnImageCredit');if(credit)credit.textContent=t().source;
    const legend=document.querySelector('.spawn-legend');legend?.classList.remove('layer-raiders','layer-cases','layer-extractions');
    const legendText=document.getElementById('spawnLegendText');if(legendText)legendText.textContent=t().none;
    const selected=document.getElementById('spawnSelected');if(selected){selected.hidden=true;selected.innerHTML=''}
    const key=document.getElementById('spaceportV2Key');if(key)key.remove();
  }

  async function setMapImage(){
    if(!isSpaceport()||settingMap)return;
    const image=document.getElementById('spawnMapImage');
    if(!image)return;
    const src=await getMapDataUrl();
    if(!src||!isSpaceport()){
      const body=document.getElementById('spawnPendingBody');if(body)body.textContent=t().mapError;
      return;
    }
    if(image.src===src)return;
    settingMap=true;
    image.src=src;
    image.removeAttribute('srcset');
    image.style.imageRendering='auto';
    requestAnimationFrame(()=>{settingMap=false});
  }

  async function applySpaceport(){
    if(!isSpaceport()){
      restoreLegacyButtons();
      return;
    }
    clearSpaceportMarkers();
    setDisabled(document.getElementById('layerRaiders'),t().raiders);
    setDisabled(document.getElementById('layerWeaponCases'),t().cases);
    ensurePendingToggle('layerSpaceportFreight','spaceport-freight',t().freight);
    ensurePendingToggle('layerSpaceportHatches','spaceport-hatches',t().hatches);
    setInfo();
    await setMapImage();
  }

  document.getElementById('spawnMapSelect')?.addEventListener('change',()=>setTimeout(applySpaceport,120));
  ['deBtn','enBtn','frBtn','esBtn'].forEach(id=>document.getElementById(id)?.addEventListener('click',()=>setTimeout(applySpaceport,60)));
  const img=document.getElementById('spawnMapImage');
  if(img)new MutationObserver(()=>{if(isSpaceport()&&!settingMap&&mapDataUrl&&img.src!==mapDataUrl)setTimeout(setMapImage,0)}).observe(img,{attributes:true,attributeFilter:['src']});
  setTimeout(applySpaceport,180);
})();
