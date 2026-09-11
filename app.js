const q=document.querySelector('#q');
const out=document.querySelector('#out');
const status=document.querySelector('#status');
const goalsEl=document.querySelector('#goals');
const summaryEl=document.querySelector('#summary');
const deBtn=document.querySelector('#deBtn');
const enBtn=document.querySelector('#enBtn');

let items=[],goals=[],usingFallback=false;
let lang=localStorage.getItem('arcLang')||'de';

const norm=s=>(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const owned=JSON.parse(localStorage.getItem('arcOwned')||'{}');
const active=JSON.parse(localStorage.getItem('arcActiveGoals')||'{}');

const T={
  de:{
    activeGoals:'AKTIVE ZIELE',manageGoals:'Stationen & Stufen verwalten',change:'ÄNDERN',
    goalHint:'Aktiviere alle Stationen/Stufen, auf die du gerade hinarbeitest.',
    totalNeed:'Gesamtbedarf',searchItem:'ITEM SUCHEN',placeholder:'z. B. Kabel, Metall, ARC ...',
    level:'Stufe',noneGoal:'Noch kein Ausbauziel aktiviert.',
    total:'Gesamt',owned:'vorhanden',missing:'fehlen',value:'Wert',weight:'Gewicht',stack:'Stapel',
    use:'Beschreibung',recycle:'Recycling',noRecycle:'Keine Recyclingdaten',
    searchPrompt:'Suchbegriff eingeben',records:'Items geladen',matches:'Treffer',
    noHit:'Kein Treffer.',free:'FREI – für deine aktiven Ziele aktuell nicht benötigt',
    fulfilled:'ZIEL ERFÜLLT – du hast genug',keepA:'BEHALTEN – dir fehlen insgesamt noch',
    keepB:'von',loadError:'Vollständiger Katalog nicht erreichbar – lokaler Basisdatensatz aktiv.'
  },
  en:{
    activeGoals:'ACTIVE GOALS',manageGoals:'Manage stations & levels',change:'CHANGE',
    goalHint:'Activate every station/level you are currently working toward.',
    totalNeed:'Total requirements',searchItem:'SEARCH ITEM',placeholder:'e.g. Wires, Metal, ARC ...',
    level:'Level',noneGoal:'No upgrade goal selected yet.',
    total:'Total',owned:'owned',missing:'missing',value:'Value',weight:'Weight',stack:'Stack',
    use:'Description',recycle:'Recycling',noRecycle:'No recycling data',
    searchPrompt:'Enter a search term',records:'items loaded',matches:'matches',
    noHit:'No results.',free:'FREE – not currently needed for your active goals',
    fulfilled:'GOAL MET – you have enough',keepA:'KEEP – you still need',
    keepB:'of',loadError:'Full catalog unavailable – local base dataset active.'
  }
};

const rarityDE={Common:'Gewöhnlich',Uncommon:'Ungewöhnlich',Rare:'Selten',Epic:'Episch',Legendary:'Legendär'};
const typeDE={
  'Basic Material':'Grundmaterial','Topside Material':'Topside-Material','Refined Material':'Veredeltes Material',
  'Recyclable':'Recycelbar','Quick Use':'Schnellgegenstand','Modification':'Modifikation','Blueprint':'Bauplan',
  'Assault Rifle':'Sturmgewehr','Battle Rifle':'Kampfgewehr','Hand Cannon':'Handkanone','Pistol':'Pistole',
  'SMG':'Maschinenpistole','Shotgun':'Schrotflinte','LMG':'Leichtes Maschinengewehr','Sniper Rifle':'Scharfschützengewehr',
  'Ammunition':'Munition','Trinket':'Wertgegenstand','Key':'Schlüssel','Augment':'Augmentierung',
  'Shield':'Schild','Nature':'Natur','Misc':'Sonstiges','Miscellaneous':'Sonstiges','Special':'Spezial'
};

function tr(k){return T[lang][k]}
function text(obj){return obj?.[lang]||obj?.en||obj?.de||''}
function itemName(i){return i?.name?text(i.name):(lang==='de'?(i?.de||i?.en):(i?.en||i?.de))||i?.id||''}
function itemDesc(i){return i?.description?text(i.description):(i?.use||'')}
function itemWeight(i){return i?.weightKg ?? i?.weight ?? null}
function itemStack(i){return i?.stackSize ?? i?.stack ?? null}
function itemById(id){return items.find(x=>x.id===id)}
function key(goalId,level){return `${goalId}:${level}`}

function goalName(g){return (lang==='de'?g.de:g.en)||g.de||g.en||g.id}
function rarityName(r){return lang==='de'?(rarityDE[r]||r):r}
function typeName(type){
  if(!type) return '';
  if(lang==='en') return type;
  return typeDE[type]||'';
}
function formatNum(n){
  if(n===null||n===undefined||n==='') return '—';
  return new Intl.NumberFormat(lang==='de'?'de-DE':'en-US',{maximumFractionDigits:2}).format(n);
}

function requirementMap(){
  const map={};
  goals.forEach(g=>g.levels.forEach(l=>{
    if(!active[key(g.id,l.level)]) return;
    l.requirements.forEach(r=>{
      if(!map[r.itemId]) map[r.itemId]={total:0,reasons:[]};
      map[r.itemId].total+=r.quantity;
      map[r.itemId].reasons.push(`${goalName(g)} ${tr('level')} ${l.level}: ${r.quantity}`);
    });
  }));
  return map;
}

function saveOwned(id,val){
  owned[id]=Math.max(0,Number(val)||0);
  localStorage.setItem('arcOwned',JSON.stringify(owned));
  drawSummary(); drawItems();
}

function toggleGoal(k,checked){
  if(checked) active[k]=true; else delete active[k];
  localStorage.setItem('arcActiveGoals',JSON.stringify(active));
  drawSummary(); drawItems();
}

function drawGoals(){
  goalsEl.innerHTML=goals.map(g=>`
    <div class="goalbox">
      <div class="goalhead">${goalName(g)}</div>
      <div class="levelrow">
        ${g.levels.map(l=>`
          <label class="levelbtn">
            <input type="checkbox" data-key="${key(g.id,l.level)}" ${active[key(g.id,l.level)]?'checked':''}>
            ${tr('level')} ${l.level}
          </label>`).join('')}
      </div>
    </div>`).join('');
  goalsEl.querySelectorAll('input[type=checkbox]').forEach(el=>{
    el.addEventListener('change',e=>toggleGoal(e.target.dataset.key,e.target.checked));
  });
}

function drawSummary(){
  const req=requirementMap();
  const entries=Object.entries(req);
  if(!entries.length){
    summaryEl.innerHTML=`<div class="empty">${tr('noneGoal')}</div>`;
    return;
  }
  summaryEl.innerHTML=entries.map(([id,r])=>{
    const i=itemById(id);
    const name=i?itemName(i):id.replaceAll('_',' ');
    const have=owned[id]||0;
    const missing=Math.max(0,r.total-have);
    return `<div class="sumrow">
      <div>
        <div class="sumname">${name}</div>
        <div class="summeta">${tr('total')} ${r.total} · ${tr('owned')} ${have} · ${tr('missing')} ${missing}</div>
        <div class="summeta">${r.reasons.join(' · ')}</div>
      </div>
      <input class="qty" type="number" min="0" inputmode="numeric" value="${have}" data-id="${id}" aria-label="${tr('owned')} ${name}">
    </div>`;
  }).join('');
  summaryEl.querySelectorAll('.qty').forEach(el=>el.addEventListener('input',e=>saveOwned(e.target.dataset.id,e.target.value)));
}

function goalDecision(i){
  const req=requirementMap()[i.id];
  if(!req) return `<div class="need free">${tr('free')}</div>`;
  const have=owned[i.id]||0;
  const missing=Math.max(0,req.total-have);
  if(missing===0){
    return `<div class="need ok">${tr('fulfilled')}<div class="reasons">${req.reasons.join(' · ')}</div></div>`;
  }
  return `<div class="need keep">${tr('keepA')} ${missing} ${tr('keepB')} ${req.total}<div class="reasons">${req.reasons.join(' · ')}</div></div>`;
}

function recyclingText(i){
  const rec=i.recyclesInto;
  if(rec && typeof rec==='object' && Object.keys(rec).length){
    return Object.entries(rec).map(([id,n])=>{
      const target=itemById(id);
      return `${n}× ${target?itemName(target):id.replaceAll('_',' ')}`;
    }).join(' · ');
  }
  if(i.recycle && i.recycle!=='—') return i.recycle;
  return tr('noRecycle');
}

function card(i){
  const type=typeName(i.type);
  const rarity=rarityName(i.rarity||'');
  const desc=itemDesc(i);
  return `<article class="card">
    <div class="card-head">
      <div>
        <h3>${itemName(i)}</h3>
        ${type?`<div class="item-type">${type}</div>`:''}
      </div>
      ${rarity?`<div class="rarity">${rarity}</div>`:''}
    </div>
    <div class="facts">
      <div class="fact"><span>${tr('value')}</span><b>${formatNum(i.value)}</b></div>
      <div class="fact"><span>${tr('weight')}</span><b>${itemWeight(i)==null?'—':formatNum(itemWeight(i))+' kg'}</b></div>
      <div class="fact"><span>${tr('stack')}</span><b>${formatNum(itemStack(i))}</b></div>
    </div>
    ${desc?`<div class="desc"><b>${tr('use')}:</b> ${desc}</div>`:''}
    <div class="recycle"><b>${tr('recycle')}:</b> ${recyclingText(i)}</div>
    ${goalDecision(i)}
  </article>`;
}

function drawItems(){
  const x=norm(q.value.trim());
  if(!x){
    out.innerHTML='';
    status.textContent=`${items.length} ${tr('records')} · ${tr('searchPrompt')}${usingFallback?' · ⚠':''}`;
    if(usingFallback) status.classList.add('load-error'); else status.classList.remove('load-error');
    return;
  }
  const r=items.filter(i=>
    norm(itemName(i)).includes(x) ||
    norm(i?.name?.de).includes(x) ||
    norm(i?.name?.en).includes(x) ||
    norm(i?.de).includes(x) ||
    norm(i?.en).includes(x)
  );
  status.classList.remove('load-error');
  status.textContent=`${r.length} ${tr('matches')} · ${items.length} ${tr('records')}`;
  out.innerHTML=r.length?r.map(card).join(''):`<div class="empty">${tr('noHit')}</div>`;
}

function applyLanguage(){
  document.documentElement.lang=lang;
  document.querySelectorAll('[data-t]').forEach(el=>el.textContent=tr(el.dataset.t));
  q.placeholder=tr('placeholder');
  deBtn.classList.toggle('active',lang==='de');
  enBtn.classList.toggle('active',lang==='en');
  localStorage.setItem('arcLang',lang);
  drawGoals();drawSummary();drawItems();
}

deBtn.addEventListener('click',()=>{lang='de';applyLanguage()});
enBtn.addEventListener('click',()=>{lang='en';applyLanguage()});
q.addEventListener('input',drawItems);

async function loadFullCatalog(){
  let all=[],offset=0,total=null;
  const limit=45;
  while(true){
    const url=`https://arcdata.mahcks.com/v1/items?full=true&offset=${offset}&limit=${limit}`;
    const r=await fetch(url,{cache:'no-store'});
    if(!r.ok) throw new Error(`API ${r.status}`);
    const data=await r.json();
    if(total===null) total=Number(data.total ?? data.count ?? 0) || null;
    if(!Array.isArray(data.items)) throw new Error('Invalid item response');
    all.push(...data.items);
    if(!data.next) break;
    offset+=limit;
    if(offset>2000) throw new Error('Pagination guard');
  }
  const unique=[...new Map(all.map(i=>[i.id,i])).values()];
  if(total && unique.length!==total) throw new Error(`Catalog incomplete ${unique.length}/${total}`);
  return unique;
}

async function boot(){
  try{
    goals=await fetch('goals.json?v=27',{cache:'no-store'}).then(r=>r.json());
    status.textContent=lang==='de'?'Katalog wird geladen …':'Loading catalog …';
    items=await loadFullCatalog();
    usingFallback=false;
  }catch(err){
    console.error(err);
    try{
      items=await fetch('items.json?v=27',{cache:'no-store'}).then(r=>r.json());
      if(!goals.length) goals=await fetch('goals.json?v=27',{cache:'no-store'}).then(r=>r.json());
      usingFallback=true;
    }catch{
      status.textContent=tr('loadError');
      status.classList.add('load-error');
      return;
    }
  }
  applyLanguage();
  if(usingFallback){
    status.textContent=tr('loadError');
    status.classList.add('load-error');
  }
}
boot();
