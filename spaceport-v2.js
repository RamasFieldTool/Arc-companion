// Spaceport V2 test pilot: new own map base + fresh marker rebuild only.
(()=>{
  const DATA_URL='spaceport-fresh-v2.json?v=3';
  const MAP_URL='spaceport-rft-base-v2.svg?v=3';
  let data=null;
  let loading=null;
  const enabled={freight:false,hatches:false};

  const copy={
    de:{freightLayer:'LASTENAUFZÜGE',hatchLayer:'RAIDER-LUKEN',raiders:'RAIDER-SPAWNS // NEU',cases:'WAFFENKISTEN // NEU',pending:'wird neu kartiert',ready:'SPACEPORT V2 // NEUAUFBAU',body:'Neue Spaceport-Kartenbasis aktiv. Lastenaufzüge und Raider-Luken wurden neu gesetzt; Raider-Spawns und Waffenkisten werden anschließend neu kartiert.',freight:'Lastenaufzug',hatch:'Raider-Luke',source:'Kartenbasis: Ramas Field Tool – neue eigene Spaceport-Karte',approx:'Auf der neuen Spaceport-Karte neu eingemessen · Teststand',none:'Keine Ebene aktiv'},
    en:{freightLayer:'FREIGHT ELEVATORS',hatchLayer:'RAIDER HATCHES',raiders:'RAIDER SPAWNS // REBUILD',cases:'WEAPON CASES // REBUILD',pending:'fresh remap pending',ready:'SPACEPORT V2 // FRESH REBUILD',body:'New Spaceport map base active. Freight Elevators and Raider Hatches have been remapped; Raider Spawns and Weapon Cases will be rebuilt next.',freight:'Freight Elevator',hatch:'Raider Hatch',source:'Map base: Ramas Field Tool – new original Spaceport map',approx:'Remapped on the new Spaceport map · test build',none:'No layer active'},
    fr:{freightLayer:'MONTE-CHARGES',hatchLayer:'TRAPPES RAIDER',raiders:'APPARITIONS // RECONSTRUCTION',cases:'CAISSES D’ARMES // RECONSTRUCTION',pending:'nouvelle cartographie en attente',ready:'SPACEPORT V2 // RECONSTRUCTION',body:'Nouvelle carte Spaceport active. Les monte-charges et trappes Raider ont été repositionnés; les apparitions et caisses d’armes seront ensuite recartographiées.',freight:'Monte-charge',hatch:'Trappe Raider',source:'Fond de carte : Ramas Field Tool – nouvelle carte Spaceport originale',approx:'Repositionné sur la nouvelle carte Spaceport · version test',none:'Aucune couche active'},
    es:{freightLayer:'MONTACARGAS',hatchLayer:'ESCOTILLAS RAIDER',raiders:'APARICIONES // RECONSTRUCCIÓN',cases:'CAJAS DE ARMAS // RECONSTRUCCIÓN',pending:'nuevo mapeo pendiente',ready:'SPACEPORT V2 // RECONSTRUCCIÓN',body:'Nuevo mapa de Spaceport activo. Los montacargas y las escotillas Raider se han remapeado; después se reconstruirán las apariciones y cajas de armas.',freight:'Montacargas',hatch:'Escotilla Raider',source:'Mapa base: Ramas Field Tool – nuevo mapa original de Spaceport',approx:'Remapeado en el nuevo mapa de Spaceport · versión de prueba',none:'Ninguna capa activa'}
  };

  function language(){
    try{if(typeof lang==='string'&&copy[lang])return lang}catch{}
    const l=(document.documentElement.lang||'de').slice(0,2).toLowerCase();
    return copy[l]?l:'de';
  }
  function t(){return copy[language()]}
  function isSpaceport(){return document.getElementById('spawnMapSelect')?.value==='spaceport'}
  async function loadData(){
    if(data)return data;
    if(loading)return loading;
    loading=fetch(DATA_URL,{cache:'no-store'})
      .then(r=>{if(!r.ok)throw new Error(`spaceport v2 ${r.status}`);return r.json()})
      .then(j=>data=j)
      .catch(err=>{console.warn('Spaceport V2 data unavailable',err);return null});
    return loading;
  }

  function ensureLayer(){
    const canvas=document.getElementById('spawnCanvas');
    if(!canvas)return null;
    let layer=document.getElementById('spaceportV2Markers');
    if(!layer){
      layer=document.createElement('div');
      layer.id='spaceportV2Markers';
      layer.className='spaceport-v2-layer';
      layer.hidden=true;
      canvas.appendChild(layer);
    }
    return layer;
  }

  function ensureToggle(id,layerType,label){
    const controls=document.querySelector('.map-layer-controls');
    if(!controls)return null;
    let btn=document.getElementById(id);
    if(!btn){
      btn=document.createElement('button');
      btn.id=id;
      btn.className='map-layer-toggle';
      btn.type='button';
      btn.setAttribute('aria-pressed','false');
      btn.dataset.layer=layerType;
      btn.innerHTML='<span class="layer-indicator"></span><span class="spaceport-v2-toggle-label"></span>';
      btn.addEventListener('click',()=>{
        if(!isSpaceport())return;
        const on=btn.getAttribute('aria-pressed')!=='true';
        btn.setAttribute('aria-pressed',String(on));
        if(layerType==='spaceport-freight')enabled.freight=on;
        if(layerType==='spaceport-hatches')enabled.hatches=on;
        renderExtractions();
      });
      controls.appendChild(btn);
    }
    const text=btn.querySelector('.spaceport-v2-toggle-label');
    if(text)text.textContent=label;
    return btn;
  }

  function ensureButtons(){
    return {
      freight:ensureToggle('layerSpaceportFreight','spaceport-freight',t().freightLayer),
      hatches:ensureToggle('layerSpaceportHatches','spaceport-hatches',t().hatchLayer)
    };
  }

  function setPendingButton(id,label){
    const btn=document.getElementById(id);
    if(!btn)return;
    btn.setAttribute('aria-pressed','false');
    btn.setAttribute('aria-disabled','true');
    btn.disabled=true;
    btn.classList.add('spaceport-v2-pending');
    const labelNode=btn.querySelector('span:last-child');
    if(labelNode)labelNode.textContent=label;
    btn.title=t().pending;
  }

  function restoreLegacyButtons(){
    const r=document.getElementById('layerRaiders');
    const w=document.getElementById('layerWeaponCases');
    [r,w].forEach(btn=>{if(btn){btn.disabled=false;btn.removeAttribute('aria-disabled');btn.classList.remove('spaceport-v2-pending');btn.title=''}});
    const labels={
      de:{r:'RAIDER-SPAWNS',w:'WAFFENKISTEN'},
      en:{r:'RAIDER SPAWNS',w:'WEAPON CASES'},
      fr:{r:'APPARITIONS RAIDER',w:'CAISSES D’ARMES'},
      es:{r:'APARICIONES RAIDER',w:'CAJAS DE ARMAS'}
    }[language()]||{r:'RAIDER SPAWNS',w:'WEAPON CASES'};
    const rl=document.getElementById('layerRaidersLabel');if(rl)rl.textContent=labels.r;
    const wl=document.getElementById('layerWeaponCasesLabel');if(wl)wl.textContent=labels.w;
  }

  function clearLegacySpaceportMarkers(){
    const spawn=document.getElementById('spawnMarkers');
    const cases=document.getElementById('weaponCaseMarkers');
    const oldExtra=document.getElementById('extractionMarkers');
    if(spawn){spawn.innerHTML='';spawn.hidden=true}
    if(cases){cases.innerHTML='';cases.hidden=true}
    if(oldExtra){oldExtra.innerHTML='';oldExtra.hidden=true}
    try{if(typeof mapLayers==='object'){mapLayers.raiders=false;mapLayers.weaponCases=false}}catch{}
  }

  function markerName(point){return point?.name?.[language()]||point?.name?.en||point?.id||''}
  function typeName(type){return type==='freight-elevator'?t().freight:t().hatch}

  function selectedTypes(){
    const types=[];
    if(enabled.freight)types.push('freight-elevator');
    if(enabled.hatches)types.push('raider-hatch');
    return types;
  }

  async function renderExtractions(){
    const layer=ensureLayer();
    if(!layer)return;
    const types=selectedTypes();
    if(!isSpaceport()||types.length===0){
      layer.hidden=true;
      layer.innerHTML='';
      if(isSpaceport())setSpaceportInfo();
      return;
    }
    const d=await loadData();
    if(!d||!isSpaceport())return;
    const all=d.layers?.extractions?.points||[];
    const points=all.filter(p=>types.includes(p.type));
    layer.innerHTML=points.map((p,i)=>`<button class="spaceport-v2-marker" data-type="${p.type}" data-index="${i}" type="button" style="left:${p.x}%;top:${p.y}%" aria-label="${typeName(p.type)}: ${markerName(p)}" title="${markerName(p)}"><span></span></button>`).join('');
    layer.hidden=false;
    layer.querySelectorAll('.spaceport-v2-marker').forEach((marker,i)=>marker.addEventListener('click',event=>{
      event.stopPropagation();
      layer.querySelectorAll('.spaceport-v2-marker').forEach((m,n)=>m.classList.toggle('active',n===i));
      const p=points[i];
      const box=document.getElementById('spawnSelected');
      if(box){
        box.hidden=false;
        box.innerHTML=`<b>${typeName(p.type)}</b><br>${markerName(p)}<br><span class="spaceport-v2-source">${t().approx}</span>`;
        box.scrollIntoView({block:'nearest',behavior:'smooth'});
      }
    }));
    const legend=document.querySelector('.spawn-legend');
    const legendText=document.getElementById('spawnLegendText');
    legend?.classList.remove('layer-raiders','layer-cases');
    legend?.classList.add('layer-extractions');
    if(legendText){
      if(enabled.freight&&enabled.hatches)legendText.textContent=`${points.length} ${language()==='de'?'Extraktionen':'Extractions'}`;
      else legendText.textContent=`${points.length} ${enabled.freight?t().freightLayer.toLowerCase():t().hatchLayer.toLowerCase()}`;
    }
    const title=document.getElementById('spawnPendingTitle');
    if(title)title.textContent=enabled.freight&&enabled.hatches?`${t().freightLayer} + ${t().hatchLayer}`:(enabled.freight?t().freightLayer:t().hatchLayer);
    const body=document.getElementById('spawnPendingBody');if(body)body.textContent=t().approx;
  }

  function ensureKey(){
    const info=document.querySelector('.spawn-map-info');
    if(!info)return;
    let key=document.getElementById('spaceportV2Key');
    if(!key){
      key=document.createElement('div');
      key.id='spaceportV2Key';
      key.className='spaceport-v2-key';
      info.appendChild(key);
    }
    key.innerHTML=`<span class="freight"><i>↕</i>${t().freight}</span><span class="hatch"><i>•</i>${t().hatch}</span>`;
  }

  function setSpaceportInfo(){
    const title=document.getElementById('spawnPendingTitle');if(title)title.textContent=t().ready;
    const body=document.getElementById('spawnPendingBody');if(body)body.textContent=t().body;
    const credit=document.getElementById('spawnImageCredit');if(credit)credit.textContent=t().source;
    const legend=document.querySelector('.spawn-legend');legend?.classList.remove('layer-raiders','layer-cases','layer-extractions');
    const legendText=document.getElementById('spawnLegendText');if(legendText)legendText.textContent=t().none;
    ensureKey();
  }

  function applySpaceport(){
    const buttons=ensureButtons();
    const key=document.getElementById('spaceportV2Key');
    if(!isSpaceport()){
      restoreLegacyButtons();
      Object.values(buttons).forEach(btn=>{if(btn)btn.hidden=true});
      const layer=document.getElementById('spaceportV2Markers');if(layer){layer.hidden=true;layer.innerHTML=''}
      if(key)key.hidden=true;
      return;
    }
    const image=document.getElementById('spawnMapImage');
    if(image&&!(image.getAttribute('src')||'').includes('spaceport-rft-base-v2.svg'))image.src=MAP_URL;
    clearLegacySpaceportMarkers();
    setPendingButton('layerRaiders',t().raiders);
    setPendingButton('layerWeaponCases',t().cases);
    if(buttons.freight){buttons.freight.hidden=false;buttons.freight.setAttribute('aria-pressed',String(enabled.freight));const l=buttons.freight.querySelector('.spaceport-v2-toggle-label');if(l)l.textContent=t().freightLayer}
    if(buttons.hatches){buttons.hatches.hidden=false;buttons.hatches.setAttribute('aria-pressed',String(enabled.hatches));const l=buttons.hatches.querySelector('.spaceport-v2-toggle-label');if(l)l.textContent=t().hatchLayer}
    ensureKey();
    const currentKey=document.getElementById('spaceportV2Key');if(currentKey)currentKey.hidden=false;
    if(enabled.freight||enabled.hatches)renderExtractions();else setSpaceportInfo();
  }

  const style=document.createElement('link');
  style.rel='stylesheet';style.href='spaceport-v2.css?v=3';style.dataset.spaceportV2='true';
  if(!document.querySelector('link[data-spaceport-v2]'))document.head.appendChild(style);

  document.getElementById('spawnMapSelect')?.addEventListener('change',()=>setTimeout(applySpaceport,120));
  ['deBtn','enBtn','frBtn','esBtn'].forEach(id=>document.getElementById(id)?.addEventListener('click',()=>setTimeout(applySpaceport,60)));
  const img=document.getElementById('spawnMapImage');
  if(img)new MutationObserver(()=>{if(isSpaceport()&&!img.src.includes('spaceport-rft-base-v2.svg'))img.src=MAP_URL}).observe(img,{attributes:true,attributeFilter:['src']});
  setTimeout(applySpaceport,180);
})();
