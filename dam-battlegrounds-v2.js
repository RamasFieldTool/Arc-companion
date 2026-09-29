// Dam Battlegrounds V2 review extension – extraction + major ARC layers.
(()=>{
  const copy={
    de:{show:'Auf Karte anzeigen',count:n=>`${n} aktiv`,extraction:'Extraktion',majorArc:'Große ARC',elevators:'Aufzüge',hatches:'Raider-Luken',bastion:'Bastion',bombardier:'Bombardier',leaper:'Leaper',sentinel:'Sentinel',elevatorNote:'Extraktions-Aufzug · Community-Position.',hatchNote:'Raider-Luke · Community-Position.',arcNote:'Große ARC · Community-Position.',close:'Details schließen'},
    en:{show:'Show on map',count:n=>`${n} active`,extraction:'Extraction',majorArc:'Major ARC',elevators:'Elevators',hatches:'Raider hatches',bastion:'Bastion',bombardier:'Bombardier',leaper:'Leaper',sentinel:'Sentinel',elevatorNote:'Extraction elevator · community position.',hatchNote:'Raider Hatch · community position.',arcNote:'Major ARC · community position.',close:'Close details'},
    fr:{show:'Afficher sur la carte',count:n=>`${n} actifs`,extraction:'Extraction',majorArc:'Grands ARC',elevators:'Ascenseurs',hatches:'Trappes Raider',bastion:'Bastion',bombardier:'Bombardier',leaper:'Leaper',sentinel:'Sentinel',elevatorNote:'Ascenseur d’extraction · position communautaire.',hatchNote:'Trappe Raider · position communautaire.',arcNote:'Grand ARC · position communautaire.',close:'Fermer les détails'},
    es:{show:'Mostrar en el mapa',count:n=>`${n} activos`,extraction:'Extracción',majorArc:'ARC grandes',elevators:'Ascensores',hatches:'Escotillas Raider',bastion:'Bastion',bombardier:'Bombardier',leaper:'Leaper',sentinel:'Sentinel',elevatorNote:'Ascensor de extracción · posición comunitaria.',hatchNote:'Escotilla Raider · posición comunitaria.',arcNote:'ARC grande · posición comunitaria.',close:'Cerrar detalles'}
  };
  const state={elevators:false,hatches:false,bastion:false,bombardier:false,leaper:false,sentinel:false};
  const arcKeys=['bastion','bombardier','leaper','sentinel'];
  let data=null,selectedId=null,lastDam=false;
  const controls=document.querySelector('.map-layer-controls');

  function language(){const l=(window.arcCurrentLanguage?.()||document.documentElement.lang||'de').slice(0,2).toLowerCase();return copy[l]?l:'de'}
  function t(){return copy[language()]}
  function isDam(){return document.getElementById('spawnMapSelect')?.value==='dam-battlegrounds'}
  function label(value){if(!value)return'';if(typeof value==='string')return value;return value[language()]||value.en||value.de||''}

  function ensurePicker(){
    if(!controls)return null;
    let picker=document.getElementById('damBattlegroundsLayerPicker');if(picker)return picker;
    picker=document.createElement('details');picker.id='damBattlegroundsLayerPicker';picker.className='dam-battlegrounds-layer-picker';
    const summary=document.createElement('summary');summary.innerHTML='<span id="damBattlegroundsLayerPickerTitle"></span><span id="damBattlegroundsLayerCount" class="dam-battlegrounds-layer-count"></span>';
    const groups=document.createElement('div');groups.className='dam-battlegrounds-layer-groups';
    for(const name of ['extraction','majorArc']){const section=document.createElement('section');section.className='dam-battlegrounds-layer-group';section.dataset.damGroup=name;section.innerHTML='<h3></h3><div class="dam-battlegrounds-layer-grid"></div>';groups.appendChild(section)}
    picker.append(summary,groups);controls.prepend(picker);return picker;
  }
  function groupGrid(group){return ensurePicker()?.querySelector(`[data-dam-group="${group}"] .dam-battlegrounds-layer-grid`)||null}
  function setButtonLabel(button,text){const span=button?.querySelector('span:last-child');if(span&&span.textContent!==text)span.textContent=text}
  function groupFor(key){return key==='elevators'||key==='hatches'?'extraction':'majorArc'}
  function ensureToggle(key){
    const target=groupGrid(groupFor(key));if(!target)return null;
    let button=document.getElementById(`layerDamBattlegrounds-${key}`);
    if(!button){button=document.createElement('button');button.id=`layerDamBattlegrounds-${key}`;button.type='button';button.className='map-layer-toggle dam-battlegrounds-map-toggle';button.dataset.damLayer=key;button.innerHTML='<span class="layer-indicator"></span><span></span>';button.addEventListener('click',()=>{if(!isDam())return;state[key]=!state[key];selectedId=null;render()});target.appendChild(button)}
    setButtonLabel(button,t()[key]||key);button.setAttribute('aria-pressed',String(state[key]));return button;
  }
  function updateCopy(){
    const picker=ensurePicker();if(!picker)return;const c=t();
    const title=picker.querySelector('#damBattlegroundsLayerPickerTitle');if(title)title.textContent=c.show;
    const extractionHeading=picker.querySelector('[data-dam-group="extraction"] h3');if(extractionHeading)extractionHeading.textContent=c.extraction;
    const arcHeading=picker.querySelector('[data-dam-group="majorArc"] h3');if(arcHeading)arcHeading.textContent=c.majorArc;
    Object.keys(state).forEach(ensureToggle);updateCount();
  }
  function updateCount(){const n=Object.values(state).filter(Boolean).length;const node=document.getElementById('damBattlegroundsLayerCount');if(node)node.textContent=t().count(n)}

  function ensureLayer(){const canvas=document.getElementById('spawnCanvas');if(!canvas)return null;let layer=document.getElementById('damBattlegroundsOverlayMarkers');if(!layer){layer=document.createElement('div');layer.id='damBattlegroundsOverlayMarkers';layer.className='dam-battlegrounds-overlay-layer';canvas.appendChild(layer)}return layer}
  function updateMarkerScale(){const layer=document.getElementById('damBattlegroundsOverlayMarkers'),canvas=document.getElementById('spawnCanvas');if(!layer||!canvas)return;const transform=getComputedStyle(canvas).transform,scale=transform==='none'?1:new DOMMatrixReadOnly(transform).a;layer.style.setProperty('--dam-marker-scale',String(1/Math.max(1,scale)))}
  function visiblePoints(){
    const points=[];
    if(state.elevators)(data?.layers?.elevators?.points||[]).forEach(p=>points.push({...p,kind:'elevator'}));
    if(state.hatches)(data?.layers?.hatches?.points||[]).forEach(p=>points.push({...p,kind:'hatch'}));
    const activeArc=arcKeys.filter(key=>state[key]);
    if(activeArc.length)(data?.layers?.majorArc?.points||[]).forEach(p=>{if((p.types||[]).some(type=>activeArc.includes(type)))points.push({...p,kind:'arc'})});
    return points;
  }
  function markerCode(point){
    const n=Number(point.id.split('-').pop());
    if(point.kind==='elevator')return `E${n}`;
    if(point.kind==='hatch')return String(n);
    const types=point.types||[];if(types.length>1)return'ARC';
    return {bastion:'Ba',bombardier:'Bo',leaper:'L',sentinel:'S'}[types[0]]||'ARC';
  }
  function pointNote(point){if(point.kind==='elevator')return t().elevatorNote;if(point.kind==='hatch')return t().hatchNote;return label(point.note)||t().arcNote}

  function ensureDetails(){let card=document.getElementById('damBattlegroundsOverlayDetails');if(card)return card;card=document.createElement('div');card.id='damBattlegroundsOverlayDetails';card.className='dam-battlegrounds-overlay-details';card.setAttribute('role','status');document.getElementById('spawnViewport')?.after(card);return card}
  function renderDetails(){const card=ensureDetails(),point=visiblePoints().find(p=>p.id===selectedId);card.hidden=!isDam()||!point;card.replaceChildren();if(card.hidden)return;const title=document.createElement('strong');title.textContent=label(point.label);const note=document.createElement('span');note.textContent=pointNote(point);const close=document.createElement('button');close.type='button';close.textContent='×';close.setAttribute('aria-label',t().close);close.addEventListener('click',()=>{selectedId=null;renderMarkers()});card.append(title,note,close)}
  function renderMarkers(){
    const layer=ensureLayer();if(!layer)return;const visible=visiblePoints();layer.hidden=!isDam()||!visible.length;layer.replaceChildren();
    if(!layer.hidden)visible.forEach(point=>{const marker=document.createElement('button');marker.type='button';marker.className=`dam-battlegrounds-marker ${point.kind==='hatch'?'is-hatch':point.kind==='arc'?'is-arc':'is-elevator'}`;marker.dataset.damId=point.id;marker.style.left=`${point.x}%`;marker.style.top=`${point.y}%`;marker.textContent=markerCode(point);marker.setAttribute('aria-pressed',String(selectedId===point.id));marker.setAttribute('aria-label',`${label(point.label)}. ${pointNote(point)}`);marker.addEventListener('pointerdown',e=>e.stopPropagation());marker.addEventListener('click',e=>{e.stopPropagation();selectedId=selectedId===point.id?null:point.id;renderMarkers();document.querySelector(`[data-dam-id="${point.id}"]`)?.focus()});layer.appendChild(marker)});
    updateMarkerScale();renderDetails();
  }
  function render(){Object.keys(state).forEach(ensureToggle);renderMarkers();updateCount()}
  function apply(){
    const now=isDam(),picker=ensurePicker();if(!picker)return;
    if(now&&!lastDam){Object.keys(state).forEach(k=>state[k]=false);selectedId=null;picker.open=false}
    picker.hidden=!now;
    if(now){updateCopy();render()}else{const layer=document.getElementById('damBattlegroundsOverlayMarkers');if(layer)layer.hidden=true;const details=document.getElementById('damBattlegroundsOverlayDetails');if(details)details.hidden=true}
    lastDam=now;
  }

  document.getElementById('spawnMapSelect')?.addEventListener('change',()=>setTimeout(apply,180));
  ['deBtn','enBtn','frBtn','esBtn'].forEach(id=>document.getElementById(id)?.addEventListener('click',()=>setTimeout(apply,80)));
  window.addEventListener('arc-language-change',apply);
  const canvas=document.getElementById('spawnCanvas');if(canvas)new MutationObserver(updateMarkerScale).observe(canvas,{attributes:true,attributeFilter:['style']});
  document.getElementById('spawnMapImage')?.addEventListener('load',()=>setTimeout(()=>{updateMarkerScale();apply()},0));

  fetch('dam-battlegrounds-v2.json?v=review-2',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('Dam Battlegrounds V2 data unavailable');return r.json()}).then(value=>{data=value;apply()}).catch(error=>{console.warn(error);apply()});
  setTimeout(apply,280);
})();
