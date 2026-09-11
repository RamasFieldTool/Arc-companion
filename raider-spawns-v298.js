// V2.9.8 — Spaceport Raider spawn map using approximate community positions.

const spawnText={
  de:{
    intro:'Mögliche Startpositionen von Raidern auf Spaceport. Die Marker zeigen keine aktuellen Gegnerpositionen.',
    badge:'COMMUNITY // CA.',
    approxTitle:'21 mögliche Raider-Spawns',
    approxBody:'Die Punkte wurden manuell aus einer aktuellen Community-Karte übertragen. Sie sind ungefähr und nicht offiziell von Embark bestätigt.',
    counts:'Vergleich anderer Community-Quellen',
    marker:'Möglicher Raider-Spawn',
    sourceImage:'Kartenbasis: Arc Raiders AI',
    sourceWiki:'ARC Raiders Wiki',
    sourceWand:'Wand',
    sourceGrid:'Raider Grid'
  },
  en:{
    intro:'Possible Raider starting positions on Spaceport. Markers do not show current enemy positions.',
    badge:'COMMUNITY // APPROX.',
    approxTitle:'21 possible Raider spawns',
    approxBody:'The points were manually transferred from a current community map. They are approximate and are not officially confirmed by Embark.',
    counts:'Comparison with other community sources',
    marker:'Possible Raider spawn',
    sourceImage:'Map base: Arc Raiders AI',
    sourceWiki:'ARC Raiders Wiki',
    sourceWand:'Wand',
    sourceGrid:'Raider Grid'
  }
};

let spawnData=null;

function spawnLang(){
  try{return lang==='en'?'en':'de'}catch{return 'de'}
}

function renderSpawnMarkers(){
  const layer=document.getElementById('spawnMarkers');
  if(!layer) return;
  const l=spawnLang();
  const t=spawnText[l];
  const points=spawnData?.points||[];
  layer.innerHTML=points.map((p,i)=>`<button class="spawn-marker" type="button" style="left:${p.x}%;top:${p.y}%" aria-label="${t.marker} ${i+1}" title="${t.marker} ${i+1}"><span>${i+1}</span></button>`).join('');
}

function renderSpawnPanel(){
  const box=document.getElementById('spawnPanel');
  if(!box) return;
  const l=spawnLang();
  const t=spawnText[l];
  const intro=document.getElementById('spawnIntro');
  const badge=document.getElementById('spawnBadge');
  const title=document.getElementById('spawnPendingTitle');
  const body=document.getElementById('spawnPendingBody');
  const counts=document.getElementById('spawnCounts');
  const wiki=document.getElementById('spawnWiki');
  const wand=document.getElementById('spawnWand');
  const grid=document.getElementById('spawnGrid');
  const imageCredit=document.getElementById('spawnImageCredit');
  const mapImage=document.getElementById('spawnMapImage');
  if(intro) intro.textContent=t.intro;
  if(badge) badge.textContent=t.badge;
  if(title) title.textContent=t.approxTitle;
  if(body) body.textContent=spawnData?.notes?.[l] || t.approxBody;
  if(wiki) wiki.textContent=t.sourceWiki;
  if(wand) wand.textContent=t.sourceWand;
  if(grid) grid.textContent=t.sourceGrid;
  if(imageCredit) imageCredit.textContent=t.sourceImage;
  if(mapImage && spawnData?.mapImage) mapImage.src=spawnData.mapImage;
  if(counts && spawnData?.reportedCounts?.length){
    counts.innerHTML=`<b>${t.counts}:</b> `+spawnData.reportedCounts.map(x=>`${x.source} ${x.count}`).join(' · ');
  }
  renderSpawnMarkers();
}

fetch('raider-spawns.json?v=298',{cache:'no-store'})
  .then(r=>{if(!r.ok) throw new Error(`spawn data ${r.status}`);return r.json()})
  .then(data=>{spawnData=data;renderSpawnPanel()})
  .catch(err=>{console.warn('Raider spawn data unavailable',err);renderSpawnPanel()});

document.getElementById('deBtn')?.addEventListener('click',()=>setTimeout(renderSpawnPanel,0));
document.getElementById('enBtn')?.addEventListener('click',()=>setTimeout(renderSpawnPanel,0));
renderSpawnPanel();
