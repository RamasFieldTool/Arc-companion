// Spaceport V2 test pilot: own map base + fresh marker rebuild only.
(()=>{
  const DATA_URL='spaceport-fresh-v2.json?v=2';
  const MAP_URL='spaceport-rft-base-v2.svg?v=2';
  let data=null;
  let loading=null;

  const copy={
    de:{extractions:'EXTRAKTIONEN',raiders:'RAIDER-SPAWNS // NEU',cases:'WAFFENKISTEN // NEU',pending:'wird neu kartiert',ready:'SPACEPORT V2 // NEUAUFBAU',body:'Alte Marker wurden vollständig deaktiviert. Aktiviere Extraktionen; Raider-Spawns und Waffenkisten werden anschließend neu kartiert.',freight:'Lastenaufzug',hatch:'Raider-Luke',source:'Kartenbasis: Ramas Field Tool – eigene vereinfachte Karte',approx:'Frisch anhand deiner Spaceport-Referenz eingemessen · Teststand'},
    en:{extractions:'EXTRACTIONS',raiders:'RAIDER SPAWNS // REBUILD',cases:'WEAPON CASES // REBUILD',pending:'fresh remap pending',ready:'SPACEPORT V2 // FRESH REBUILD',body:'All previous markers are disabled. Enable Extractions; Raider Spawns and Weapon Cases will be remapped from scratch next.',freight:'Freight Elevator',hatch:'Raider Hatch',source:'Map base: Ramas Field Tool – original simplified map',approx:'Freshly measured from your Spaceport reference · test build'},
    fr:{extractions:'EXTRACTIONS',raiders:'APPARITIONS // RECONSTRUCTION',cases:'CAISSES D’ARMES // RECONSTRUCTION',pending:'nouvelle cartographie en attente',ready:'SPACEPORT V2 // RECONSTRUCTION',body:'Tous les anciens marqueurs sont désactivés. Active les extractions; les apparitions et caisses d’armes seront ensuite recartographiées.',freight:'Monte-charge',hatch:'Trappe Raider',source:'Fond de carte : Ramas Field Tool – carte simplifiée originale',approx:'Mesuré à nouveau depuis ta référence Spaceport · version test'},
    es:{extractions:'EXTRACCIONES',raiders:'APARICIONES // RECONSTRUCCIÓN',cases:'CAJAS DE ARMAS // RECONSTRUCCIÓN',pending:'nuevo mapeo pendiente',ready:'SPACEPORT V2 // RECONSTRUCCIÓN',body:'Todos los marcadores anteriores están desactivados. Activa Extracciones; después se remapearán desde cero las apariciones y cajas de armas.',freight:'Montacargas',hatch:'Escotilla Raider',source:'Mapa base: Ramas Field Tool – mapa simplificado original',approx:'Medido de nuevo desde tu referencia de Spaceport · versión de prueba'}
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
    loading=fetch(DATA_URL,{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error(`spaceport v2 ${r.status}`);return r.json()}).then(j=>data=j).catch(err=>{console.warn('Spaceport V2 data unavailable',err);return null});
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

  function ensureButton(){
    const controls=document.querySelector('.map-layer-controls');
    if(!controls)return null;
    let btn=document.getElementById('layerSpaceportExtractions');
    if(!btn){
      btn=document.createElement('button');
      btn.id='layerSpaceportExtractions';
      btn.className='map-layer-toggle';
      btn.type='button';
      btn.setAttribute('aria-pressed','false');
      btn.dataset.layer='spaceport-extractions-v2';
      btn.innerHTML='<span class="layer-indicator"></span><span id="layerSpaceportExtractionsLabel"></span>';
      btn.addEventListener('click',()=>{
        if(!isSpaceport())return;
        const on=btn.getAttribute('aria-pressed')!=='true';
        btn.setAttribute('aria-pressed',String(on));
        renderExtractions(on);
      });
      controls.appendChild(btn);
    }
    return btn;
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
    const rl=document.getElementById('layerRaidersLabel');if(rl)rl.textContent=language()==='de'?'RAIDER-SPAWNS':'RAIDER SPAWNS';
    const wl=document.getElementById('layerWeaponCasesLabel');if(wl)wl.textContent=language()==='de'?'WAFFENKISTEN':'WEAPON CASES';
  }

  function clearLegacySpaceportMarkers(){
    const spawn=document.getElementById('spawnMarkers');
    const cases=document.getElementById('weaponCaseMarkers');
    if(spawn){spawn.innerHTML='';spawn.hidden=true}
    if(cases){cases.innerHTML='';cases.hidden=true}
    try{if(typeof mapLayers==='object'){mapLayers.raiders=false;mapLayers.weaponCases=false}}catch{}
  }

  function markerName(point){return point?.name?.[language()]||point?.name?.en||point?.id||''}
  function typeName(type){return type==='freight-elevator'?t().freight:t().hatch}

  async function renderExtractions(enabled){
    const layer=ensureLayer();
    if(!layer)return;
    if(!enabled||!isSpaceport()){
      layer.hidden=true;layer.innerHTML='';
      if(isSpaceport())setSpaceportInfo();
      return;
    }
    const d=await loadData();
    if(!d||!isSpaceport())return;
    const points=d.layers?.extractions?.points||[];
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
    legend?.classList.remove('layer-raiders','layer-cases');legend?.classList.add('layer-extractions');
    if(legendText)legendText.textContent=`${points.length} ${t().extractions.toLowerCase()}`;
    const title=document.getElementById('spawnPendingTitle');if(title)title.textContent=`${t().extractions} // ${points.length}`;
    const body=document.getElementById('spawnPendingBody');if(body)body.textContent=t().approx;
  }

  function ensureKey(){
    const info=document.querySelector('.spawn-map-info');
    if(!info)return;
    let key=document.getElementById('spaceportV2Key');
    if(!key){
      key=document.createElement('div');key.id='spaceportV2Key';key.className='spaceport-v2-key';
      info.appendChild(key);
    }
    key.innerHTML=`<span class="freight"><i>↕</i>${t().freight}</span><span class="hatch"><i>•</i>${t().hatch}</span>`;
  }

  function setSpaceportInfo(){
    const title=document.getElementById('spawnPendingTitle');if(title)title.textContent=t().ready;
    const body=document.getElementById('spawnPendingBody');if(body)body.textContent=t().body;
    const credit=document.getElementById('spawnImageCredit');if(credit)credit.textContent=t().source;
    const legend=document.querySelector('.spawn-legend');legend?.classList.remove('layer-raiders','layer-cases','layer-extractions');
    const legendText=document.getElementById('spawnLegendText');if(legendText)legendText.textContent=language()==='de'?'Keine Ebene aktiv':'No layer active';
    ensureKey();
  }

  function applySpaceport(){
    const extra=ensureButton();
    const key=document.getElementById('spaceportV2Key');
    if(!isSpaceport()){
      restoreLegacyButtons();
      if(extra){extra.hidden=true;extra.setAttribute('aria-pressed','false')}
      const layer=document.getElementById('spaceportV2Markers');if(layer){layer.hidden=true;layer.innerHTML=''}
      if(key)key.hidden=true;
      return;
    }
    const image=document.getElementById('spawnMapImage');
    if(image&&!(image.getAttribute('src')||'').includes('spaceport-rft-base-v2.svg'))image.src=MAP_URL;
    clearLegacySpaceportMarkers();
    setPendingButton('layerRaiders',t().raiders);
    setPendingButton('layerWeaponCases',t().cases);
    if(extra){extra.hidden=false;const l=extra.querySelector('#layerSpaceportExtractionsLabel');if(l)l.textContent=t().extractions}
    if(key)key.hidden=false;
    if(extra?.getAttribute('aria-pressed')==='true')renderExtractions(true);else setSpaceportInfo();
  }

  const style=document.createElement('link');
  style.rel='stylesheet';style.href='spaceport-v2.css?v=2';style.dataset.spaceportV2='true';
  if(!document.querySelector('link[data-spaceport-v2]'))document.head.appendChild(style);

  document.getElementById('spawnMapSelect')?.addEventListener('change',()=>setTimeout(applySpaceport,120));
  ['deBtn','enBtn','frBtn','esBtn'].forEach(id=>document.getElementById(id)?.addEventListener('click',()=>setTimeout(applySpaceport,60)));
  const img=document.getElementById('spawnMapImage');
  if(img)new MutationObserver(()=>{if(isSpaceport()&&!img.src.includes('spaceport-rft-base-v2.svg'))img.src=MAP_URL}).observe(img,{attributes:true,attributeFilter:['src']});
  setTimeout(applySpaceport,180);
})();
