// V2.10.1 — generic multi-map Raider spawn module. Community positions remain approximate.
const spawnText={
  de:{
    intro:(map)=>`Mögliche Startpositionen von Raidern auf ${map}. Die Marker zeigen keine aktuellen Gegnerpositionen.`,
    badge:'COMMUNITY // CA.',
    approxTitle:(count)=>`${count} mögliche Raider-Spawns`,
    approxBody:'Community-Daten · ungefähre Positionen · nicht offiziell von Embark bestätigt',
    counts:'Vergleich anderer Community-Quellen',
    marker:'Möglicher Raider-Spawn',
    legend:'Möglicher Raider-Spawn',
    pendingLegend:'Spawn-Koordinaten noch nicht verifiziert',
    hint:'Bei 1× normal scrollen · mit +/- zoomen · vergrößerte Karte ziehen · Marker antippen',
    pendingHint:'Karte ist auswählbar · Spawn-Anzahl recherchiert · Marker folgen erst nach Koordinatenprüfung',
    selected:'Möglicher Spawn',
    selectedBody:'Ungefähre Community-Position. Kein Hinweis darauf, dass hier in deinem aktuellen Raid ein Spieler gespawnt ist.',
    sourceImage:'Kartenbasis',
    mapSelect:'Karte auswählen'
  },
  en:{
    intro:(map)=>`Possible Raider starting positions on ${map}. Markers do not show current enemy positions.`,
    badge:'COMMUNITY // APPROX.',
    approxTitle:(count)=>`${count} possible Raider spawns`,
    approxBody:'Community data · approximate positions · not officially confirmed by Embark',
    counts:'Comparison with other community sources',
    marker:'Possible Raider spawn',
    legend:'Possible Raider spawn',
    pendingLegend:'Spawn coordinates not yet verified',
    hint:'At 1× scroll normally · use +/- to zoom · drag the zoomed map · tap markers',
    pendingHint:'Map is selectable · spawn count researched · markers wait for coordinate verification',
    selected:'Possible spawn',
    selectedBody:'Approximate community position. It does not mean a player spawned here in your current raid.',
    sourceImage:'Map base',
    mapSelect:'Select map'
  }
};

let mapCatalog=null;
let activeMapMeta=null;
let spawnData=null;
let spawnScale=1,spawnX=0,spawnY=0,dragStart=null;
const activePointers=new Map();

function spawnLang(){try{return lang==='en'?'en':'de'}catch{return'de'}}
function mapLabel(meta=activeMapMeta){if(!meta)return'';const l=spawnLang();return meta.label?.[l]||meta.label?.en||meta.id||''}
function applySpawnTransform(){const c=document.getElementById('spawnCanvas');if(c)c.style.transform=`translate(${spawnX}px,${spawnY}px) scale(${spawnScale})`;const v=document.getElementById('spawnViewport');if(v)v.classList.toggle('map-interactive',spawnScale>1.001)}
function clampSpawnPan(){const v=document.getElementById('spawnViewport');if(!v)return;const lim=v.clientWidth*(spawnScale-1)/2;spawnX=Math.max(-lim,Math.min(lim,spawnX));spawnY=Math.max(-lim,Math.min(lim,spawnY))}
function setSpawnZoom(next){spawnScale=Math.max(1,Math.min(3,next));if(spawnScale===1){spawnX=0;spawnY=0}else{clampSpawnPan()}applySpawnTransform()}
function resetSpawnView(){spawnScale=1;spawnX=0;spawnY=0;dragStart=null;activePointers.clear();applySpawnTransform();const box=document.getElementById('spawnSelected');if(box)box.hidden=true;document.querySelectorAll('.spawn-marker.active').forEach(m=>m.classList.remove('active'))}

function selectSpawn(i){
  const points=spawnData?.points||[];
  const p=points[i];
  document.querySelectorAll('.spawn-marker').forEach((m,n)=>m.classList.toggle('active',n===i));
  const box=document.getElementById('spawnSelected'),t=spawnText[spawnLang()];
  if(box&&p){box.hidden=false;box.innerHTML=`<b>${t.selected} ${p.id||String(i+1).padStart(2,'0')}</b><br>${t.selectedBody}`;box.scrollIntoView({block:'nearest',behavior:'smooth'})}
}

function renderSpawnMarkers(){
  const layer=document.getElementById('spawnMarkers');if(!layer)return;
  const t=spawnText[spawnLang()],points=spawnData?.points||[];
  layer.innerHTML=points.map((p,i)=>`<button class="spawn-marker" data-spawn="${i}" type="button" style="left:${p.x}%;top:${p.y}%" aria-label="${t.marker} ${p.id||i+1}" title="${t.marker} ${p.id||i+1}"><span>${i+1}</span></button>`).join('');
  layer.querySelectorAll('.spawn-marker').forEach((m,i)=>m.addEventListener('click',e=>{e.stopPropagation();selectSpawn(i)}));
}

function renderMapSelector(){
  const select=document.getElementById('spawnMapSelect');if(!select||!mapCatalog)return;
  const l=spawnLang(),current=activeMapMeta?.id||mapCatalog.defaultMap;
  select.innerHTML=mapCatalog.maps.map(m=>`<option value="${m.id}">${m.label?.[l]||m.label?.en||m.id}</option>`).join('');
  select.value=current;
  const label=document.getElementById('spawnMapSelectLabel');if(label)label.textContent=spawnText[l].mapSelect;
}

function renderSourceLinks(){
  const row=document.getElementById('spawnSources');if(!row)return;
  const sources=activeMapMeta?.sources||[];
  row.innerHTML=sources.map(s=>`<a href="${s.url}" target="_blank" rel="noopener">${s.label}</a>`).join('');
}

function renderSpawnPanel(){
  const l=spawnLang(),t=spawnText[l],name=mapLabel(),points=spawnData?.points||[];
  const reportedCount=Number(spawnData?.reportedPool||points.length||0);
  const coordinatesPending=reportedCount>0&&points.length===0;
  const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
  set('spawnMapTitle',name.toUpperCase());
  set('spawnIntro',t.intro(name));
  set('spawnBadge',t.badge);
  set('spawnPendingTitle',t.approxTitle(reportedCount));
  set('spawnPendingBody',spawnData?.notes?.[l]||t.approxBody);
  set('spawnLegendText',coordinatesPending?t.pendingLegend:t.legend);
  set('spawnGestureHint',coordinatesPending?t.pendingHint:t.hint);
  set('spawnImageCredit',`${t.sourceImage}: ${spawnData?.mapImageSource||'Community map'}`);
  const img=document.getElementById('spawnMapImage');
  if(img){img.alt=`${name} Community-Karte`;if(spawnData?.mapImage)img.src=spawnData.mapImage}
  const viewport=document.getElementById('spawnViewport');if(viewport)viewport.setAttribute('aria-label',`${name} Raider Spawn Map`);
  const counts=document.getElementById('spawnCounts');
  if(counts){counts.innerHTML=spawnData?.reportedCounts?.length?`<b>${t.counts}:</b> `+spawnData.reportedCounts.map(x=>`${x.source} ${x.count}`).join(' · '):''}
  renderMapSelector();renderSourceLinks();renderSpawnMarkers();
}

async function loadSpawnMap(mapId){
  if(!mapCatalog)return;
  const meta=mapCatalog.maps.find(m=>m.id===mapId)||mapCatalog.maps.find(m=>m.id===mapCatalog.defaultMap)||mapCatalog.maps[0];
  if(!meta)return;
  activeMapMeta=meta;
  resetSpawnView();
  try{
    const r=await fetch(`${meta.data}?v=21010`,{cache:'no-store'});if(!r.ok)throw new Error(`spawn data ${r.status}`);
    spawnData=await r.json();
    try{localStorage.setItem('arcSpawnMap',meta.id)}catch{}
    renderSpawnPanel();
  }catch(err){
    console.warn('Raider spawn data unavailable',err);spawnData=null;renderSpawnPanel();
  }
}

function initSpawnControls(){
  document.getElementById('spawnZoomIn')?.addEventListener('click',()=>setSpawnZoom(spawnScale+.35));
  document.getElementById('spawnZoomOut')?.addEventListener('click',()=>setSpawnZoom(spawnScale-.35));
  document.getElementById('spawnReset')?.addEventListener('click',resetSpawnView);
  document.getElementById('spawnMapSelect')?.addEventListener('change',e=>loadSpawnMap(e.target.value));
  const v=document.getElementById('spawnViewport');if(!v)return;
  v.addEventListener('pointerdown',e=>{
    if(spawnScale<=1.001){return}
    activePointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
    v.setPointerCapture?.(e.pointerId);
    if(e.target.closest('.spawn-marker'))return;
    dragStart={x:e.clientX-spawnX,y:e.clientY-spawnY};v.classList.add('dragging')
  });
  v.addEventListener('pointermove',e=>{if(!activePointers.has(e.pointerId))return;activePointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(!dragStart||spawnScale<=1)return;spawnX=e.clientX-dragStart.x;spawnY=e.clientY-dragStart.y;clampSpawnPan();applySpawnTransform()});
  const end=e=>{activePointers.delete(e.pointerId);dragStart=null;v.classList.remove('dragging')};v.addEventListener('pointerup',end);v.addEventListener('pointercancel',end);
  v.addEventListener('wheel',e=>{e.preventDefault();setSpawnZoom(spawnScale+(e.deltaY<0?0.2:-0.2))},{passive:false});
}

async function initSpawnMaps(){
  try{
    const r=await fetch('maps.json?v=21010',{cache:'no-store'});if(!r.ok)throw new Error(`map catalog ${r.status}`);
    mapCatalog=await r.json();
    let preferred=mapCatalog.defaultMap;
    try{const stored=localStorage.getItem('arcSpawnMap');if(stored&&mapCatalog.maps.some(m=>m.id===stored))preferred=stored}catch{}
    await loadSpawnMap(preferred);
  }catch(err){console.warn('Map catalog unavailable',err);mapCatalog={defaultMap:'spaceport',maps:[{id:'spaceport',label:{de:'Spaceport',en:'Spaceport'},data:'raider-spawns.json',sources:[]}]};await loadSpawnMap('spaceport')}
}

document.getElementById('deBtn')?.addEventListener('click',()=>setTimeout(renderSpawnPanel,0));
document.getElementById('enBtn')?.addEventListener('click',()=>setTimeout(renderSpawnPanel,0));
initSpawnControls();
initSpawnMaps();
