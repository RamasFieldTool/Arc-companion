// V2.9.8 draft — Raider spawn map shell.
// Coordinates are intentionally not rendered until the dataset is verified.

const spawnText={
  de:{
    intro:'Mögliche Startpositionen von Raidern auf Spaceport. Die Marker zeigen keine aktuellen Gegnerpositionen.',
    pendingTitle:'Spawn-Daten werden noch geprüft',
    pendingBody:'Die technische Karte ist vorbereitet, aber noch ohne Marker. Mehrere aktuelle Community-Quellen widersprechen sich bei der Anzahl der möglichen Spawnpunkte. Deshalb veröffentlichen wir keine ungeprüften Koordinaten.',
    counts:'Gemeldete Anzahl möglicher Spawns',
    sourceWiki:'ARC Raiders Wiki',
    sourceWand:'Wand',
    sourceGrid:'Raider Grid'
  },
  en:{
    intro:'Possible Raider starting positions on Spaceport. Markers do not show current enemy positions.',
    pendingTitle:'Spawn data is still being verified',
    pendingBody:'The map framework is ready, but no markers are published yet. Multiple current community sources disagree on the number of possible spawn points, so unverified coordinates are not being released.',
    counts:'Reported number of possible spawns',
    sourceWiki:'ARC Raiders Wiki',
    sourceWand:'Wand',
    sourceGrid:'Raider Grid'
  }
};

let spawnData=null;

function spawnLang(){
  try{return lang==='en'?'en':'de'}catch{return 'de'}
}

function renderSpawnPanel(){
  const box=document.getElementById('spawnPanel');
  if(!box) return;
  const l=spawnLang();
  const t=spawnText[l];
  const intro=document.getElementById('spawnIntro');
  const title=document.getElementById('spawnPendingTitle');
  const body=document.getElementById('spawnPendingBody');
  const counts=document.getElementById('spawnCounts');
  const wiki=document.getElementById('spawnWiki');
  const wand=document.getElementById('spawnWand');
  const grid=document.getElementById('spawnGrid');
  if(intro) intro.textContent=t.intro;
  if(title) title.textContent=t.pendingTitle;
  if(body) body.textContent=spawnData?.notes?.[l] || t.pendingBody;
  if(wiki) wiki.textContent=t.sourceWiki;
  if(wand) wand.textContent=t.sourceWand;
  if(grid) grid.textContent=t.sourceGrid;
  if(counts && spawnData?.reportedCounts?.length){
    counts.innerHTML=`<b>${t.counts}:</b> `+spawnData.reportedCounts.map(x=>`${x.source} ${x.count}`).join(' · ');
  }
}

fetch('raider-spawns.json?v=298',{cache:'no-store'})
  .then(r=>{if(!r.ok) throw new Error(`spawn data ${r.status}`);return r.json()})
  .then(data=>{spawnData=data;renderSpawnPanel()})
  .catch(err=>{console.warn('Raider spawn draft data unavailable',err);renderSpawnPanel()});

document.getElementById('deBtn')?.addEventListener('click',()=>setTimeout(renderSpawnPanel,0));
document.getElementById('enBtn')?.addEventListener('click',()=>setTimeout(renderSpawnPanel,0));
renderSpawnPanel();
