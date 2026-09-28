// Spaceport major-ARC review extension. Keeps small ARC types out of the map.
(()=>{
  const copy={
    de:{show:'Auf Karte anzeigen',count:n=>`${n} aktiv`,raiderLoot:'Raider & Loot',extraction:'Extraktion',major:'Große ARC',boss:'Boss / Event',spawns:'Raider-Spawns',cases:'Waffenkisten',freight:'Lastenaufzüge',hatches:'Raider-Luken',community:'Community-Position zur Prüfung; Spawn oder Patrouille nicht garantiert.',event:'Event-Suchbereich zur Orientierung; kein garantierter exakter Spawnpunkt.',night:'Als Bastion/Bombardier-Kandidat im Nacht-Raid gemeldet.',none:'Keine Anzeige aktiv'},
    en:{show:'Show on map',count:n=>`${n} active`,raiderLoot:'Raider & loot',extraction:'Extraction',major:'Major ARC',boss:'Boss / event',spawns:'Raider spawns',cases:'Weapon crates',freight:'Freight elevators',hatches:'Raider hatches',community:'Community position for review; spawn or patrol is not guaranteed.',event:'Event search area for orientation; not a guaranteed exact spawn point.',night:'Reported as a Bastion/Bombardier Night Raid candidate.',none:'Nothing active'},
    fr:{show:'Afficher sur la carte',count:n=>`${n} actifs`,raiderLoot:'Raider & butin',extraction:'Extraction',major:'ARC majeurs',boss:'Boss / événement',spawns:'Apparitions Raider',cases:'Caisses d’armes',freight:'Monte-charges',hatches:'Trappes Raider',community:'Position communautaire à vérifier ; apparition ou patrouille non garantie.',event:'Zone de recherche d’événement pour orientation ; pas un point d’apparition exact garanti.',night:'Signalé comme candidat Bastion/Bombardier en raid nocturne.',none:'Aucun affichage actif'},
    es:{show:'Mostrar en el mapa',count:n=>`${n} activos`,raiderLoot:'Raider y botín',extraction:'Extracción',major:'ARC grandes',boss:'Jefe / evento',spawns:'Apariciones Raider',cases:'Cajas de armas',freight:'Montacargas',hatches:'Escotillas Raider',community:'Posición comunitaria por revisar; aparición o patrulla no garantizada.',event:'Zona de búsqueda de evento como orientación; no es un punto exacto garantizado.',night:'Registrado como candidato Bastion/Bombardier en incursión nocturna.',none:'Nada activo'}
  };
  const types={
    bastion:{label:'Bastion',code:'B',group:'major'},rocketeer:{label:'Rocketeer',code:'R',group:'major'},bombardier:{label:'Bombardier',code:'BO',group:'major'},sentinel:{label:'Sentinel',code:'S',group:'major'},leaper:{label:'Leaper',code:'L',group:'major'},queen:{label:'Queen',code:'Q',group:'boss'},matriarch:{label:'Matriarch',code:'M',group:'boss'}
  };
  const state=Object.fromEntries(Object.keys(types).map(k=>[k,false]));
  const points=Object.fromEntries(Object.keys(types).map(k=>[k,[]]));
  let selectedId=null,lastSpaceport=false,mutating=false;

  function language(){const l=(window.arcCurrentLanguage?.()||document.documentElement.lang||'de').slice(0,2).toLowerCase();return copy[l]?l:'de'}
  function t(){return copy[language()]}
  function isSpaceport(){return document.getElementById('spawnMapSelect')?.value==='spaceport'}
  function visiblePoints(){return Object.keys(state).flatMap(type=>state[type]?points[type]:[])}
  function groupId(key){return `spaceportLayerGroup-${key}`}

  function ensurePicker(){
    const controls=document.querySelector('.map-layer-controls');if(!controls)return null;
    let picker=document.getElementById('spaceportLayerPicker');if(picker)return picker;
    picker=document.createElement('details');picker.id='spaceportLayerPicker';picker.className='spaceport-layer-picker';
    const summary=document.createElement('summary');summary.innerHTML='<span id="spaceportLayerPickerTitle"></span><span id="spaceportLayerCount" class="spaceport-layer-count"></span>';
    const groups=document.createElement('div');groups.className='spaceport-layer-groups';
    ['raiderLoot','extraction','major','boss'].forEach(key=>{const section=document.createElement('section');section.id=groupId(key);section.className='spaceport-layer-group';section.dataset.group=key;section.innerHTML='<h3></h3><div class="spaceport-layer-grid"></div>';groups.appendChild(section)});
    picker.append(summary,groups);controls.prepend(picker);return picker;
  }
  function grid(key){return ensurePicker()?.querySelector(`#${groupId(key)} .spaceport-layer-grid`)||null}

  function setFriendlyLabel(button,text){const span=button?.querySelector('span:last-child');if(span&&span.textContent!==text)span.textContent=text}
  function rehomeCoreButtons(){
    if(!isSpaceport())return;
    const c=t(),mapping=[
      ['layerSpaceportSpawns','raiderLoot',c.spawns],['layerSpaceportCases','raiderLoot',c.cases],
      ['layerSpaceportFreight','extraction',c.freight],['layerSpaceportHatches','extraction',c.hatches]
    ];
    mutating=true;
    mapping.forEach(([id,group,label])=>{const button=document.getElementById(id),target=grid(group);if(button&&target){if(button.parentElement!==target)target.appendChild(button);setFriendlyLabel(button,label);button.classList.add('spaceport-map-toggle')}});
    mutating=false;
  }

  function ensureArcToggles(){
    Object.entries(types).forEach(([type,meta])=>{
      const target=grid(meta.group);if(!target)return;
      let button=document.getElementById(`layerSpaceportArc-${type}`);
      if(!button){button=document.createElement('button');button.id=`layerSpaceportArc-${type}`;button.type='button';button.className='map-layer-toggle spaceport-map-toggle spaceport-arc-toggle';button.dataset.arcType=type;button.innerHTML='<span class="layer-indicator"></span><span></span>';button.addEventListener('click',()=>{if(!isSpaceport())return;state[type]=!state[type];selectedId=null;render()});target.appendChild(button)}
      setFriendlyLabel(button,meta.label);button.hidden=!points[type].length;button.setAttribute('aria-pressed',String(state[type]));button.title=(type==='queen'||type==='matriarch')?t().event:t().community;
    });
  }

  function updateCopy(){
    const picker=ensurePicker();if(!picker)return;const c=t();
    const title=picker.querySelector('#spaceportLayerPickerTitle');if(title&&title.textContent!==c.show)title.textContent=c.show;
    const headings={raiderLoot:c.raiderLoot,extraction:c.extraction,major:c.major,boss:c.boss};
    Object.entries(headings).forEach(([key,text])=>{const h=picker.querySelector(`#${groupId(key)} h3`);if(h&&h.textContent!==text)h.textContent=text});
    rehomeCoreButtons();ensureArcToggles();updateCount();
  }

  function activeCoreCount(){return ['layerSpaceportSpawns','layerSpaceportCases','layerSpaceportFreight','layerSpaceportHatches'].filter(id=>document.getElementById(id)?.getAttribute('aria-pressed')==='true').length}
  function updateCount(){
    const total=activeCoreCount()+Object.values(state).filter(Boolean).length;
    const count=document.getElementById('spaceportLayerCount');if(count)count.textContent=t().count(total);
    if(isSpaceport()){const legend=document.getElementById('spawnLegendText');if(legend)legend.textContent=total?t().count(total):t().none}
  }

  function ensureLayer(){
    const canvas=document.getElementById('spawnCanvas');if(!canvas)return null;
    let layer=document.getElementById('spaceportMajorArcMarkers');if(!layer){layer=document.createElement('div');layer.id='spaceportMajorArcMarkers';layer.className='spaceport-major-arc-layer';canvas.appendChild(layer)}return layer;
  }
  function positionLayer(){
    const image=document.getElementById('spawnMapImage'),layer=document.getElementById('spaceportMajorArcMarkers');if(!image||!layer||!image.naturalWidth)return;
    const cw=image.clientWidth,ch=image.clientHeight,contain=getComputedStyle(image).objectFit==='contain';
    const ratio=(contain?Math.min:Math.max)(cw/image.naturalWidth,ch/image.naturalHeight),width=image.naturalWidth*ratio,height=image.naturalHeight*ratio;
    Object.assign(layer.style,{left:`${(cw-width)/2}px`,top:`${(ch-height)/2}px`,width:`${width}px`,height:`${height}px`});
    const transform=getComputedStyle(image.parentElement).transform,scale=transform==='none'?1:new DOMMatrixReadOnly(transform).a;layer.style.setProperty('--arc-marker-scale',String(1/Math.max(1,scale)));
  }
  function noteFor(point){if(point.confidence==='area-reference')return t().event;if(point.condition==='night-raid')return t().night;return t().community}
  function ensureDetails(){
    let card=document.getElementById('spaceportArcDetails');if(card)return card;
    card=document.createElement('div');card.id='spaceportArcDetails';card.className='spaceport-arc-details';card.setAttribute('role','status');document.getElementById('spawnViewport')?.after(card);return card;
  }
  function renderDetails(){
    const card=ensureDetails(),point=visiblePoints().find(p=>p.id===selectedId);card.hidden=!isSpaceport()||!point;card.replaceChildren();if(card.hidden)return;
    const title=document.createElement('strong');title.textContent=point.label?.[language()]||point.label?.en||types[point.arcType]?.label||point.id;
    const note=document.createElement('span');note.textContent=noteFor(point);
    const close=document.createElement('button');close.type='button';close.textContent='×';close.setAttribute('aria-label','Close');close.addEventListener('click',()=>{selectedId=null;renderMarkers()});card.append(title,note,close);
  }
  function renderMarkers(){
    const layer=ensureLayer();if(!layer)return;const visible=visiblePoints();layer.hidden=!isSpaceport()||!visible.length;layer.replaceChildren();
    if(!layer.hidden)visible.forEach(point=>{const meta=types[point.arcType],marker=document.createElement('button');marker.type='button';marker.className=`spaceport-arc-marker arc-${point.arcType}`;marker.dataset.arcId=point.id;marker.style.left=`${point.x}%`;marker.style.top=`${point.y}%`;marker.textContent=meta?.code||'ARC';marker.setAttribute('aria-pressed',String(selectedId===point.id));marker.setAttribute('aria-label',`${point.label?.[language()]||point.label?.en||meta?.label}. ${noteFor(point)}`);marker.addEventListener('pointerdown',e=>e.stopPropagation());marker.addEventListener('click',e=>{e.stopPropagation();selectedId=selectedId===point.id?null:point.id;renderMarkers();document.querySelector(`[data-arc-id="${point.id}"]`)?.focus()});layer.appendChild(marker)});
    positionLayer();renderDetails();
  }
  function render(){ensureArcToggles();Object.keys(state).forEach(type=>{const b=document.getElementById(`layerSpaceportArc-${type}`);if(b)b.setAttribute('aria-pressed',String(state[type]))});renderMarkers();updateCount()}

  function apply(){
    const now=isSpaceport(),picker=ensurePicker();if(!picker)return;
    if(now&&!lastSpaceport){Object.keys(state).forEach(k=>state[k]=false);selectedId=null;picker.open=false}
    picker.hidden=!now;if(!now){const layer=document.getElementById('spaceportMajorArcMarkers');if(layer)layer.hidden=true;const details=document.getElementById('spaceportArcDetails');if(details)details.hidden=true}
    if(now){updateCopy();render()}
    lastSpaceport=now;
  }

  const controls=document.querySelector('.map-layer-controls');
  if(controls)new MutationObserver(()=>{if(mutating||!isSpaceport())return;queueMicrotask(()=>{updateCopy();updateCount()})}).observe(controls,{subtree:true,childList:true,attributes:true,attributeFilter:['aria-pressed','hidden']});
  document.getElementById('spawnMapSelect')?.addEventListener('change',()=>setTimeout(apply,150));
  ['deBtn','enBtn','frBtn','esBtn'].forEach(id=>document.getElementById(id)?.addEventListener('click',()=>setTimeout(apply,80)));
  window.addEventListener('arc-language-change',apply);
  const image=document.getElementById('spawnMapImage');if(image)new ResizeObserver(positionLayer).observe(image);
  const canvas=document.getElementById('spawnCanvas');if(canvas)new MutationObserver(positionLayer).observe(canvas,{attributes:true,attributeFilter:['style']});
  image?.addEventListener('load',()=>{positionLayer();apply()});

  fetch('spaceport-major-arcs.json?v=major-arcs-review-1',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('Spaceport major ARC data unavailable');return r.json()}).then(data=>{
    const valid=p=>Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.x>=0&&p.x<=100&&p.y>=0&&p.y<=100;
    Object.keys(points).forEach(type=>points[type]=(data.layers?.[type]?.points||[]).filter(valid));apply();
  }).catch(error=>{console.warn(error);apply()});
  setTimeout(apply,260);
})();
