// V13.1.0 test — Spaceport extraction overlay prototype. Own marker language; no game icons copied.
(()=>{
  const DATA_FILE='spaceport-extractions-v1.json?v=1';
  const SUPPORTED=['de','en','fr','es'];
  let extractionData=null;
  let extractionMap=null;

  const copy={
    de:{layer:'EXTRAKTIONEN',freight:'Lastenaufzug',hatch:'Raider-Luke',approx:'Ungefähre Position aus Referenzbild · im Test-Branch nachzujustieren',count:n=>`${n} Extraktionspunkte`,none:'Auf Spaceport verfügbar'},
    en:{layer:'EXTRACTIONS',freight:'Freight Elevator',hatch:'Raider Hatch',approx:'Approximate position from reference image · to be adjusted on the test branch',count:n=>`${n} extraction points`,none:'Available on Spaceport'},
    fr:{layer:'EXTRACTIONS',freight:'Monte-charge',hatch:'Trappe de Raider',approx:'Position approximative issue d’une image de référence · à ajuster sur la branche de test',count:n=>`${n} points d’extraction`,none:'Disponible sur Spaceport'},
    es:{layer:'EXTRACCIONES',freight:'Montacargas',hatch:'Escotilla de Raider',approx:'Posición aproximada basada en una imagen de referencia · pendiente de ajuste en la rama de prueba',count:n=>`${n} puntos de extracción`,none:'Disponible en Spaceport'}
  };

  function language(){
    try{if(typeof lang==='string'&&SUPPORTED.includes(lang))return lang}catch{}
    const html=(document.documentElement.lang||'').toLowerCase().split('-')[0];
    return SUPPORTED.includes(html)?html:'de';
  }

  function text(){return copy[language()]||copy.de}
  function currentMap(){return document.getElementById('spawnMapSelect')?.value||''}
  function enabled(){return document.getElementById('layerExtractions')?.getAttribute('aria-pressed')==='true'}

  function injectStyles(){
    if(document.getElementById('extractionLayerStyles'))return;
    const style=document.createElement('style');
    style.id='extractionLayerStyles';
    style.textContent=`
      .extraction-marker-layer{position:absolute;inset:0;z-index:5}
      .extraction-marker{position:absolute;transform:translate(-50%,-50%);width:24px;height:24px;padding:0;display:grid;place-items:center;cursor:pointer;touch-action:manipulation;box-shadow:0 0 0 2px rgba(0,0,0,.62),0 0 10px rgba(103,224,211,.32);color:#7ce0d7;background:#102426;border:2px solid #7ce0d7;z-index:5}
      .extraction-marker::before,.extraction-marker::after{content:"";position:absolute;pointer-events:none}
      .extraction-marker.freight-elevator{border-radius:5px}
      .extraction-marker.freight-elevator::before{width:8px;height:8px;border-left:2px solid currentColor;border-right:2px solid currentColor;top:5px}
      .extraction-marker.freight-elevator::after{width:6px;height:6px;border-right:2px solid currentColor;border-bottom:2px solid currentColor;transform:rotate(45deg);bottom:4px}
      .extraction-marker.raider-hatch{border-radius:50%;background:#19252c;color:#9fd1ff;border-color:#9fd1ff;box-shadow:0 0 0 2px rgba(0,0,0,.62),0 0 10px rgba(159,209,255,.32)}
      .extraction-marker.raider-hatch::before{width:9px;height:9px;border:2px solid currentColor;border-radius:50%}
      .extraction-marker.raider-hatch::after{width:3px;height:3px;background:currentColor;border-radius:50%}
      .extraction-marker:hover,.extraction-marker.active{width:29px;height:29px;border-color:#fff;box-shadow:0 0 0 3px rgba(0,0,0,.7),0 0 15px currentColor}
      .extraction-marker:focus-visible{outline:2px solid #fff;outline-offset:3px}
      .map-layer-toggle.extractions-layer[aria-pressed="true"]{border-color:#7ce0d7!important;color:inherit}
      .map-layer-toggle.extractions-layer[aria-pressed="true"] .layer-indicator{background:#7ce0d7!important;box-shadow:0 0 8px rgba(124,224,215,.5)!important}
      @media(max-width:600px){.extraction-marker{width:21px;height:21px}.extraction-marker:hover,.extraction-marker.active{width:26px;height:26px}}
    `;
    document.head.appendChild(style);
  }

  function ensureUI(){
    injectStyles();
    const controls=document.querySelector('.map-layer-controls');
    if(controls&&!document.getElementById('layerExtractions')){
      const button=document.createElement('button');
      button.id='layerExtractions';
      button.className='map-layer-toggle extractions-layer';
      button.type='button';
      button.setAttribute('aria-pressed','false');
      button.dataset.layer='extractions';
      button.innerHTML='<span class="layer-indicator"></span><span id="layerExtractionsLabel">EXTRAKTIONEN</span>';
      controls.appendChild(button);
      button.addEventListener('click',toggle);
    }
    const canvas=document.getElementById('spawnCanvas');
    if(canvas&&!document.getElementById('extractionMarkers')){
      const layer=document.createElement('div');
      layer.id='extractionMarkers';
      layer.className='extraction-marker-layer';
      layer.hidden=true;
      canvas.appendChild(layer);
    }
    syncAvailability();
  }

  function syncAvailability(){
    const button=document.getElementById('layerExtractions');
    const label=document.getElementById('layerExtractionsLabel');
    if(label)label.textContent=text().layer;
    if(!button)return;
    const available=currentMap()==='spaceport';
    button.hidden=!available;
    button.title=available?text().layer:text().none;
    if(!available){button.setAttribute('aria-pressed','false');clearMarkers()}
  }

  function clearMarkers(){
    const layer=document.getElementById('extractionMarkers');
    if(layer){layer.hidden=true;layer.innerHTML=''}
  }

  async function load(){
    const map=currentMap();
    if(map!=='spaceport'){extractionData=null;extractionMap=map;return null}
    if(extractionData&&extractionMap===map)return extractionData;
    extractionMap=map;
    try{
      const response=await fetch(DATA_FILE,{cache:'no-store'});
      if(!response.ok)throw new Error(`extractions ${response.status}`);
      extractionData=await response.json();
    }catch(error){
      console.warn('Extraction data unavailable',error);
      extractionData=null;
    }
    return extractionData;
  }

  function typeLabel(point){return point.type==='freight-elevator'?text().freight:text().hatch}

  function selectPoint(point,index){
    const layer=document.getElementById('extractionMarkers');
    layer?.querySelectorAll('.extraction-marker').forEach((item,i)=>item.classList.toggle('active',i===index));
    const box=document.getElementById('spawnSelected');
    if(box){
      box.hidden=false;
      box.innerHTML=`<b>${typeLabel(point)} // ${point.id}</b><br>${text().approx}`;
      box.scrollIntoView({block:'nearest',behavior:'smooth'});
    }
  }

  async function render(){
    ensureUI();
    const layer=document.getElementById('extractionMarkers');
    if(!layer)return;
    if(!enabled()||currentMap()!=='spaceport'){clearMarkers();return}
    const data=await load();
    if(!data){clearMarkers();return}
    const points=(data.points||[]).filter(point=>Number.isFinite(point.x)&&Number.isFinite(point.y));
    layer.innerHTML=points.map((point,index)=>`<button class="extraction-marker ${point.type}" type="button" style="left:${point.x}%;top:${point.y}%" data-extraction="${index}" aria-label="${typeLabel(point)} ${point.id}" title="${typeLabel(point)} ${point.id}"></button>`).join('');
    layer.hidden=false;
    layer.querySelectorAll('.extraction-marker').forEach((marker,index)=>{
      marker.addEventListener('pointerdown',event=>event.stopPropagation());
      marker.addEventListener('click',event=>{event.stopPropagation();selectPoint(points[index],index)});
    });
    syncSummary(points.length);
  }

  function syncSummary(count){
    if(!enabled())return;
    const raiders=document.getElementById('layerRaiders')?.getAttribute('aria-pressed')==='true';
    const cases=document.getElementById('layerWeaponCases')?.getAttribute('aria-pressed')==='true';
    const legend=document.getElementById('spawnLegendText');
    const title=document.getElementById('spawnPendingTitle');
    const body=document.getElementById('spawnPendingBody');
    const parts=[];
    if(raiders)parts.push(language()==='de'?'Raider-Spawns':'Raider spawns');
    if(cases)parts.push(language()==='de'?'Waffenkisten':'Weapon Cases');
    parts.push(text().layer);
    if(legend)legend.textContent=parts.join(' · ');
    if(title)title.textContent=text().count(count);
    if(body)body.textContent=extractionData?.notes?.[language()]||text().approx;
  }

  async function toggle(){
    const button=document.getElementById('layerExtractions');
    if(!button||currentMap()!=='spaceport')return;
    const next=button.getAttribute('aria-pressed')!=='true';
    button.setAttribute('aria-pressed',String(next));
    const box=document.getElementById('spawnSelected');if(box)box.hidden=true;
    if(next)await render();
    else{
      clearMarkers();
      try{if(typeof syncLayerUI==='function')syncLayerUI()}catch{}
      try{if(typeof renderWeaponCases==='function')setTimeout(renderWeaponCases,0)}catch{}
    }
  }

  function resetForMapChange(){
    const button=document.getElementById('layerExtractions');
    if(button)button.setAttribute('aria-pressed','false');
    extractionData=null;extractionMap=null;clearMarkers();
    setTimeout(syncAvailability,0);
  }

  function resync(){
    ensureUI();
    if(enabled())setTimeout(render,20);
  }

  ensureUI();
  document.getElementById('spawnMapSelect')?.addEventListener('change',resetForMapChange);
  document.getElementById('layerRaiders')?.addEventListener('click',()=>{if(enabled())setTimeout(render,80)});
  document.getElementById('layerWeaponCases')?.addEventListener('click',()=>{if(enabled())setTimeout(render,120)});
  ['deBtn','enBtn','frBtn','esBtn'].forEach(id=>document.getElementById(id)?.addEventListener('click',()=>setTimeout(resync,50)));
  new MutationObserver(()=>{if(enabled())resync();else syncAvailability()}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();
