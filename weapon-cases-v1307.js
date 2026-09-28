// V13.0.7 test — opt-in Weapon Case overlays for every tactical map.
let weaponCaseData=null;
let weaponCaseMap=null;

const WC_FILES={
  'spaceport':'spaceport-weapon-cases.json',
  'buried-city':'buried-city-weapon-cases.json',
  'dam-battlegrounds':'dam-battlegrounds-weapon-cases.json',
  'the-blue-gate':'the-blue-gate-weapon-cases.json',
  'stella-montis-upper':'stella-montis-upper-weapon-cases.json',
  'stella-montis-lower':'stella-montis-lower-weapon-cases.json',
  'riven-tides':'riven-tides-weapon-cases.json'
};

function wcLang(){
  try{return lang==='en'?'en':'de'}catch{return'de'}
}

function wcText(value,language=wcLang()){
  if(!value)return'';
  if(typeof value==='string')return value;
  return value[language]||value.de||value.en||'';
}

function wcConfidence(value,language=wcLang()){
  const labels={
    'verified-cross-source':{de:'Quellenübergreifend bestätigt',en:'Cross-source verified'},
    'community-strong':{de:'Starke Community-Evidenz',en:'Strong community evidence'},
    approx:{de:'Position ungefähr',en:'Approximate position'},
    candidate:{de:'Kandidat · noch in Prüfung',en:'Candidate · under review'}
  };
  return labels[value]?.[language]||(language==='de'?'Community-Daten':'Community data');
}

async function loadWeaponCases(map){
  const file=WC_FILES[map];
  weaponCaseData=null;
  weaponCaseMap=map;
  if(!file)return null;
  try{
    const response=await fetch(`${file}?v=1307`,{cache:'no-store'});
    if(!response.ok)throw new Error(`weapon cases ${response.status}`);
    weaponCaseData=await response.json();
  }catch(error){
    console.warn('Weapon Case data unavailable',error);
    weaponCaseData=null;
  }
  return weaponCaseData;
}

function wcCard(point){
  const language=wcLang();
  const poi=wcText(point.poi,language);
  const location=wcText(point.location,language);
  const access=wcText(point.access,language);
  const note=wcText(point.note,language);
  const title=language==='de'?'WAFFENKISTE':'WEAPON CASE';
  const possible=language==='de'
    ?'Möglicher Spawn · nicht in jedem Raid garantiert.'
    :'Possible spawn · not guaranteed in every raid.';
  return `<b>${title} // ${point.id}</b><br>${possible}${poi?`<br>📍 ${poi}`:''}${location?`<br>${location}`:''}${access?`<br>🔑 ${language==='de'?'Zugang':'Access'}: ${access}`:''}<br>◈ ${language==='de'?'Status':'Status'}: ${wcConfidence(point.confidence,language)}${note?`<br>⚠️ ${note}`:''}`;
}

function renderWeaponCaseSources(){
  const row=document.getElementById('spawnSources');
  if(!row)return;
  row.querySelectorAll('[data-weapon-case-source]').forEach(link=>link.remove());
  (weaponCaseData?.sources||[]).forEach(source=>{
    if(!source.url)return;
    const link=document.createElement('a');
    link.href=source.url;
    link.target='_blank';
    link.rel='noopener noreferrer';
    link.dataset.weaponCaseSource='true';
    link.textContent=source.label||'Weapon Case source';
    row.appendChild(link);
  });
}

async function renderWeaponCases(){
  const layer=document.getElementById('weaponCaseMarkers');
  if(!layer)return;
  const map=document.getElementById('spawnMapSelect')?.value;
  const enabled=document.getElementById('layerWeaponCases')?.getAttribute('aria-pressed')==='true';
  if(!enabled){
    layer.hidden=true;
    layer.innerHTML='';
    return;
  }
  if(map!==weaponCaseMap)await loadWeaponCases(map);
  if(!weaponCaseData){
    layer.hidden=true;
    layer.innerHTML='';
    return;
  }
  const points=(weaponCaseData.points||[]).filter(point=>Number.isFinite(point.x)&&Number.isFinite(point.y));
  const language=wcLang();
  const markerLabel=language==='de'?'Mögliche Waffenkiste':'Possible Weapon Case';
  layer.innerHTML=points.map((point,index)=>`<button class="weapon-case-marker" type="button" style="left:${point.x}%;top:${point.y}%" data-wc="${index}" aria-label="${markerLabel} ${point.id}" title="${markerLabel} ${point.id}"><span>◆</span></button>`).join('');
  layer.hidden=false;
  layer.querySelectorAll('.weapon-case-marker').forEach((marker,index)=>marker.addEventListener('click',event=>{
    event.stopPropagation();
    layer.querySelectorAll('.weapon-case-marker').forEach((item,itemIndex)=>item.classList.toggle('active',itemIndex===index));
    const box=document.getElementById('spawnSelected');
    if(box){
      box.hidden=false;
      box.innerHTML=wcCard(points[index]);
      box.scrollIntoView({block:'nearest',behavior:'smooth'});
    }
  }));
  renderWeaponCaseSources();

  const title=document.getElementById('spawnPendingTitle');
  const body=document.getElementById('spawnPendingBody');
  const legend=document.getElementById('spawnLegendText');
  const raidersEnabled=document.getElementById('layerRaiders')?.getAttribute('aria-pressed')==='true';
  const mapName=wcText(weaponCaseData.label,language)||map;
  const mapped=points.length;
  const reported=Number(weaponCaseData.reportedPool)||mapped;
  const caseText=language==='de'
    ?`${mapped} kartierte mögliche Positionen${reported!==mapped?` · ${reported} gemeldete Kandidaten`:''} · keine garantierten Spawns`
    :`${mapped} mapped possible positions${reported!==mapped?` · ${reported} reported candidates`:''} · no guaranteed spawns`;
  if(title){
    if(raidersEnabled){
      const raiderCount=Number(spawnData?.reportedPool||(spawnData?.points||[]).length||0);
      title.textContent=language==='de'
        ?`${raiderCount} Raider-Spawns + ${mapped} Waffenkisten`
        :`${raiderCount} Raider spawns + ${mapped} Weapon Cases`;
    }else{
      title.textContent=`${language==='de'?'Waffenkisten':'Weapon Cases'} // ${mapName}`;
    }
  }
  if(body)body.textContent=caseText;
  if(legend&&!raidersEnabled)legend.textContent=language==='de'?'Mögliche Waffenkisten-Spawns':'Possible Weapon Case spawns';
}

async function refreshWeaponCases(){
  const map=document.getElementById('spawnMapSelect')?.value;
  if(map!==weaponCaseMap)await loadWeaponCases(map);
  await renderWeaponCases();
}

document.getElementById('layerWeaponCases')?.addEventListener('click',()=>setTimeout(refreshWeaponCases,0));
document.getElementById('spawnMapSelect')?.addEventListener('change',event=>{
  weaponCaseData=null;
  weaponCaseMap=null;
  document.querySelectorAll('[data-weapon-case-source]').forEach(link=>link.remove());
});
document.getElementById('deBtn')?.addEventListener('click',()=>setTimeout(renderWeaponCases,40));
document.getElementById('enBtn')?.addEventListener('click',()=>setTimeout(renderWeaponCases,40));
