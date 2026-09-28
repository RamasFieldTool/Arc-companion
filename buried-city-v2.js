// Buried City V2 review extension. Uses the original Ramas Field Tool map base and Spaceport-style layers.
(()=>{
  const copy={
    de:{show:'Auf Karte anzeigen',count:n=>`${n} aktiv`,raiderLoot:'Raider & Loot',extraction:'Extraktion',major:'Große ARC',spawns:'Raider-Spawns',cases:'Waffenkisten',metro:'U-Bahn-Stationen',hatches:'Raider-Luken',bastion:'Bastion',bombardier:'Bombardier',leaper:'Leaper',sentinel:'Sentinel',none:'Keine Anzeige aktiv',review:'Community-Position zur Prüfung; Auftreten nicht garantiert.',metroNote:'U-Bahn-Abholung / Extraktion · Position zur Prüfung.',hatchNote:'Raider-Luke · Position zur Prüfung.',close:'Details schließen'},
    en:{show:'Show on map',count:n=>`${n} active`,raiderLoot:'Raider & loot',extraction:'Extraction',major:'Major ARC',spawns:'Raider spawns',cases:'Weapon crates',metro:'Metro stations',hatches:'Raider hatches',bastion:'Bastion',bombardier:'Bombardier',leaper:'Leaper',sentinel:'Sentinel',none:'Nothing active',review:'Community position for review; appearance is not guaranteed.',metroNote:'Metro extraction · position for review.',hatchNote:'Raider Hatch · position for review.',close:'Close details'},
    fr:{show:'Afficher sur la carte',count:n=>`${n} actifs`,raiderLoot:'Raider & butin',extraction:'Extraction',major:'ARC majeurs',spawns:'Apparitions Raider',cases:'Caisses d’armes',metro:'Stations de métro',hatches:'Trappes Raider',bastion:'Bastion',bombardier:'Bombardier',leaper:'Leaper',sentinel:'Sentinel',none:'Aucun affichage actif',review:'Position communautaire à vérifier ; apparition non garantie.',metroNote:'Extraction par métro · position à vérifier.',hatchNote:'Trappe Raider · position à vérifier.',close:'Fermer les détails'},
    es:{show:'Mostrar en el mapa',count:n=>`${n} activos`,raiderLoot:'Raider y botín',extraction:'Extracción',major:'ARC grandes',spawns:'Apariciones Raider',cases:'Cajas de armas',metro:'Estaciones de metro',hatches:'Escotillas Raider',bastion:'Bastion',bombardier:'Bombardier',leaper:'Leaper',sentinel:'Sentinel',none:'Nada activo',review:'Posición comunitaria por revisar; aparición no garantizada.',metroNote:'Extracción de metro · posición por revisar.',hatchNote:'Escotilla Raider · posición por revisar.',close:'Cerrar detalles'}
  };
  const arcTypes=['bastion','bombardier','leaper','sentinel'];
  const arcCodes={bastion:'B',bombardier:'BO',leaper:'L',sentinel:'S'};
  const state={metro:false,hatches:false,bastion:false,bombardier:false,leaper:false,sentinel:false};
  let data=null,selectedId=null,lastBuried=false,mutating=false,refreshQueued=false;
  const controls=document.querySelector('.map-layer-controls');
  const coreButtons=['layerRaiders','layerWeaponCases'].map(id=>document.getElementById(id)).filter(Boolean);
  const coreHomes=new Map(coreButtons.map(button=>[button,{parent:button.parentNode,next:button.nextSibling}]));

  function language(){const l=(window.arcCurrentLanguage?.()||document.documentElement.lang||'de').slice(0,2).toLowerCase();return copy[l]?l:'de'}
  function t(){return copy[language()]}
  function isBuried(){return document.getElementById('spawnMapSelect')?.value==='buried-city'}
  function label(value){if(!value)return'';if(typeof value==='string')return value;return value[language()]||value.en||value.de||''}
  function groupId(key){return `buriedCityLayerGroup-${key}`}

  function ensurePicker(){
    if(!controls)return null;
    let picker=document.getElementById('buriedCityLayerPicker');if(picker)return picker;
    picker=document.createElement('details');picker.id='buriedCityLayerPicker';picker.className='buried-city-layer-picker';
    const summary=document.createElement('summary');summary.innerHTML='<span id="buriedCityLayerPickerTitle"></span><span id="buriedCityLayerCount" class="buried-city-layer-count"></span>';
    const groups=document.createElement('div');groups.className='buried-city-layer-groups';
    ['raiderLoot','extraction','major'].forEach(key=>{const section=document.createElement('section');section.id=groupId(key);section.className='buried-city-layer-group';section.innerHTML='<h3></h3><div class="buried-city-layer-grid"></div>';groups.appendChild(section)});
    picker.append(summary,groups);controls.prepend(picker);return picker;
  }
  function grid(key){return ensurePicker()?.querySelector(`#${groupId(key)} .buried-city-layer-grid`)||null}
  function setButtonLabel(button,text){const span=button?.querySelector('span:last-child');if(span&&span.textContent!==text)span.textContent=text}

  function rehomeCoreButtons(){
    if(!isBuried())return;
    const target=grid('raiderLoot');if(!target)return;
    mutating=true;
    const mapping=[['layerRaiders',t().spawns],['layerWeaponCases',t().cases]];
    mapping.forEach(([id,text])=>{const button=document.getElementById(id);if(button){button.hidden=false;button.disabled=false;button.removeAttribute('aria-disabled');if(button.parentElement!==target)target.appendChild(button);setButtonLabel(button,text);button.classList.add('buried-city-core-toggle')}});
    mutating=false;
  }
  function restoreCoreButtons(){
    mutating=true;
    coreButtons.forEach(button=>{const home=coreHomes.get(button);if(home?.parent){if(home.next&&home.next.parentNode===home.parent)home.parent.insertBefore(button,home.next);else home.parent.appendChild(button)}button.classList.remove('buried-city-core-toggle')});
    mutating=false;
  }

  function ensureOwnToggle(key,group){
    const target=grid(group);if(!target)return null;
    let button=document.getElementById(`layerBuriedCity-${key}`);
    if(!button){button=document.createElement('button');button.id=`layerBuriedCity-${key}`;button.type='button';button.className='map-layer-toggle buried-city-map-toggle';button.dataset.buriedLayer=key;button.innerHTML='<span class="layer-indicator"></span><span></span>';button.addEventListener('click',()=>{if(!isBuried())return;state[key]=!state[key];selectedId=null;render()});target.appendChild(button)}
    const text=key==='metro'?t().metro:key==='hatches'?t().hatches:t()[key];setButtonLabel(button,text);button.setAttribute('aria-pressed',String(state[key]));return button;
  }
  function ensureToggles(){
    ensureOwnToggle('metro','extraction');ensureOwnToggle('hatches','extraction');
    arcTypes.forEach(type=>{const button=ensureOwnToggle(type,'major');if(button){const has=(data?.majorArcPoints||[]).some(p=>(p.possibleTypes||[]).includes(type));button.hidden=!has;button.title=t().review}});
  }

  function activeCoreCount(){return ['layerRaiders','layerWeaponCases'].filter(id=>document.getElementById(id)?.getAttribute('aria-pressed')==='true').length}
  function activeOwnCount(){return Object.values(state).filter(Boolean).length}
  function updateCount(){const text=t().count(activeCoreCount()+activeOwnCount());const node=document.getElementById('buriedCityLayerCount');if(node&&node.textContent!==text)node.textContent=text}
  function updateCopy(){
    const picker=ensurePicker();if(!picker)return;const c=t();
    const title=picker.querySelector('#buriedCityLayerPickerTitle');if(title&&title.textContent!==c.show)title.textContent=c.show;
    const headings={raiderLoot:c.raiderLoot,extraction:c.extraction,major:c.major};Object.entries(headings).forEach(([key,text])=>{const h=picker.querySelector(`#${groupId(key)} h3`);if(h&&h.textContent!==text)h.textContent=text});
    rehomeCoreButtons();ensureToggles();updateCount();
  }

  function ensureLayer(){const canvas=document.getElementById('spawnCanvas');if(!canvas)return null;let layer=document.getElementById('buriedCityOverlayMarkers');if(!layer){layer=document.createElement('div');layer.id='buriedCityOverlayMarkers';layer.className='buried-city-overlay-layer';canvas.appendChild(layer)}return layer}
  function updateMarkerScale(){const layer=document.getElementById('buriedCityOverlayMarkers'),canvas=document.getElementById('spawnCanvas');if(!layer||!canvas)return;const transform=getComputedStyle(canvas).transform,scale=transform==='none'?1:new DOMMatrixReadOnly(transform).a;layer.style.setProperty('--buried-marker-scale',String(1/Math.max(1,scale)))}
  function visibleOverlayPoints(){
    const points=[];
    if(state.metro)(data?.layers?.metro?.points||[]).forEach(p=>points.push({...p,kind:'metro'}));
    if(state.hatches)(data?.layers?.hatches?.points||[]).forEach(p=>points.push({...p,kind:'hatch'}));
    const activeArc=arcTypes.filter(type=>state[type]);
    if(activeArc.length)(data?.majorArcPoints||[]).forEach(p=>{if((p.possibleTypes||[]).some(type=>activeArc.includes(type)))points.push({...p,kind:'arc'})});
    return points;
  }
  function markerCode(point){if(point.kind==='metro')return`M${Number(point.id.split('-').pop())}`;if(point.kind==='hatch')return String(Number(point.id.split('-').pop()));const types=point.possibleTypes||[];if(types.length===1)return arcCodes[types[0]]||'ARC';return types.map(type=>arcCodes[type]||type.slice(0,1).toUpperCase()).join('/')}
  function markerClass(point){if(point.kind==='hatch')return'is-hatch';if(point.kind!=='arc')return'is-metro';const types=point.possibleTypes||[];if(types.length===1)return`is-arc arc-${types[0]}`;return'is-arc'}
  function pointNote(point){if(point.kind==='metro')return t().metroNote;if(point.kind==='hatch')return t().hatchNote;return label(point.note)||t().review}

  function ensureDetails(){let card=document.getElementById('buriedCityOverlayDetails');if(card)return card;card=document.createElement('div');card.id='buriedCityOverlayDetails';card.className='buried-city-overlay-details';card.setAttribute('role','status');document.getElementById('spawnViewport')?.after(card);return card}
  function renderDetails(){const card=ensureDetails(),point=visibleOverlayPoints().find(p=>p.id===selectedId);card.hidden=!isBuried()||!point;card.replaceChildren();if(card.hidden)return;const title=document.createElement('strong');title.textContent=`${point.id} · ${label(point.label)}`;const note=document.createElement('span');note.textContent=pointNote(point);const close=document.createElement('button');close.type='button';close.textContent='×';close.setAttribute('aria-label',t().close);close.addEventListener('click',()=>{selectedId=null;renderMarkers()});card.append(title,note,close)}
  function renderMarkers(){
    const layer=ensureLayer();if(!layer)return;const visible=visibleOverlayPoints();layer.hidden=!isBuried()||!visible.length;layer.replaceChildren();
    if(!layer.hidden)visible.forEach(point=>{const marker=document.createElement('button');marker.type='button';marker.className=`buried-city-marker ${markerClass(point)}`;marker.dataset.buriedId=point.id;marker.style.left=`${point.x}%`;marker.style.top=`${point.y}%`;marker.textContent=markerCode(point);marker.setAttribute('aria-pressed',String(selectedId===point.id));marker.setAttribute('aria-label',`${label(point.label)}. ${pointNote(point)}`);marker.addEventListener('pointerdown',e=>e.stopPropagation());marker.addEventListener('click',e=>{e.stopPropagation();selectedId=selectedId===point.id?null:point.id;renderMarkers();document.querySelector(`[data-buried-id="${point.id}"]`)?.focus()});layer.appendChild(marker)});
    updateMarkerScale();renderDetails();
  }
  function render(){ensureToggles();renderMarkers();updateCount()}

  function setLegendVisibility(){const legend=document.querySelector('.spawn-legend');if(legend)legend.hidden=isBuried()}
  function apply(){
    const now=isBuried(),picker=ensurePicker();if(!picker)return;
    if(now&&!lastBuried){Object.keys(state).forEach(k=>state[k]=false);selectedId=null;picker.open=false}
    picker.hidden=!now;setLegendVisibility();
    if(now){updateCopy();render()}else{const layer=document.getElementById('buriedCityOverlayMarkers');if(layer)layer.hidden=true;const details=document.getElementById('buriedCityOverlayDetails');if(details)details.hidden=true;restoreCoreButtons()}
    lastBuried=now;
  }

  function scheduleRefresh(){if(refreshQueued||mutating||!isBuried())return;refreshQueued=true;queueMicrotask(()=>{refreshQueued=false;if(!isBuried())return;updateCopy();updateCount()})}
  if(controls)new MutationObserver(scheduleRefresh).observe(controls,{subtree:true,childList:true,attributes:true,attributeFilter:['aria-pressed','hidden']});
  document.getElementById('spawnMapSelect')?.addEventListener('change',()=>setTimeout(apply,180));
  ['deBtn','enBtn','frBtn','esBtn'].forEach(id=>document.getElementById(id)?.addEventListener('click',()=>setTimeout(apply,80)));
  window.addEventListener('arc-language-change',apply);
  const canvas=document.getElementById('spawnCanvas');if(canvas)new MutationObserver(updateMarkerScale).observe(canvas,{attributes:true,attributeFilter:['style']});
  document.getElementById('spawnMapImage')?.addEventListener('load',()=>setTimeout(()=>{updateMarkerScale();apply()},0));

  fetch('buried-city-v2.json?v=review-1',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('Buried City V2 data unavailable');return r.json()}).then(value=>{data=value;apply()}).catch(error=>{console.warn(error);apply()});
  setTimeout(apply,280);
})();
