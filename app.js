const q=document.querySelector('#q');
const out=document.querySelector('#out');
const status=document.querySelector('#status');
const goalsEl=document.querySelector('#goals');
const summaryEl=document.querySelector('#summary');
const deBtn=document.querySelector('#deBtn');
const enBtn=document.querySelector('#enBtn');
const questDrawer=document.querySelector('#questDrawer');
const questQ=document.querySelector('#questQ');
const questsList=document.querySelector('#questsList');
const questStatus=document.querySelector('#questStatus');
const questSummary=document.querySelector('#questSummary');
const questToggleLabel=document.querySelector('#questToggleLabel');

let items=[],goals=[],quests=[],usingFallback=false,questLoadError=false;
let questFilter='all';
let lang=localStorage.getItem('arcLang')||'de';

const norm=s=>(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const owned=JSON.parse(localStorage.getItem('arcOwned')||'{}');
const active=JSON.parse(localStorage.getItem('arcActiveGoals')||'{}');
const questStates=JSON.parse(localStorage.getItem('arcQuestStatus')||'{}');

const T={
  de:{
    activeGoals:'AKTIVE ZIELE',manageGoals:'Stationen & Stufen verwalten',change:'ÄNDERN',
    goalHint:'Aktiviere alle Stationen/Stufen, auf die du gerade hinarbeitest.',
    totalNeed:'Gesamtbedarf',searchItem:'ITEM SUCHEN',placeholder:'z. B. Kabel, Metall, ARC ...',
    level:'Stufe',noneGoal:'Noch kein Ausbauziel oder aktive Quest mit Itembedarf.',
    total:'Gesamt',owned:'vorhanden',missing:'fehlen',value:'Wert',weight:'Gewicht',stack:'Stapel',
    use:'Beschreibung',recycle:'Recycling',noRecycle:'Keine Recyclingdaten',
    searchPrompt:'Suchbegriff eingeben',records:'Items geladen',matches:'Treffer',
    noHit:'Kein Treffer.',free:'FREI – für deine aktiven Ziele aktuell nicht benötigt',
    fulfilled:'ZIEL ERFÜLLT – du hast genug',keepA:'BEHALTEN – dir fehlen insgesamt noch',
    keepB:'von',loadError:'Vollständiger Katalog nicht erreichbar – lokaler Basisdatensatz aktiv.',
    quests:'QUESTS',questSummary:'Quest-Tracker öffnen',show:'ANZEIGEN',hide:'SCHLIESSEN',
    questPlaceholder:'Quest suchen …',all:'ALLE',open:'OFFEN',active:'AKTIV',done:'ERLEDIGT',
    questLoading:'Quests werden geladen …',questLoadError:'Questdaten konnten nicht geladen werden.',
    questsLoaded:'Quests geladen',shown:'angezeigt',objectives:'Ziele',required:'Benötigte Items',
    rewards:'Belohnungen',granted:'Bereitgestellt',trader:'Auftraggeber',noRequired:'Kein Itembedarf',
    noRewards:'Keine Itembelohnungen',questReason:'Quest',activeCount:'aktiv'
  },
  en:{
    activeGoals:'ACTIVE GOALS',manageGoals:'Manage stations & levels',change:'CHANGE',
    goalHint:'Activate every station/level you are currently working toward.',
    totalNeed:'Total requirements',searchItem:'SEARCH ITEM',placeholder:'e.g. Wires, Metal, ARC ...',
    level:'Level',noneGoal:'No upgrade goal or active quest with item requirements.',
    total:'Total',owned:'owned',missing:'missing',value:'Value',weight:'Weight',stack:'Stack',
    use:'Description',recycle:'Recycling',noRecycle:'No recycling data',
    searchPrompt:'Enter a search term',records:'items loaded',matches:'matches',
    noHit:'No results.',free:'FREE – not currently needed for your active goals',
    fulfilled:'GOAL MET – you have enough',keepA:'KEEP – you still need',
    keepB:'of',loadError:'Full catalog unavailable – local base dataset active.',
    quests:'QUESTS',questSummary:'Open quest tracker',show:'SHOW',hide:'CLOSE',
    questPlaceholder:'Search quests …',all:'ALL',open:'OPEN',active:'ACTIVE',done:'DONE',
    questLoading:'Loading quests …',questLoadError:'Quest data could not be loaded.',
    questsLoaded:'quests loaded',shown:'shown',objectives:'Objectives',required:'Required items',
    rewards:'Rewards',granted:'Granted',trader:'Quest giver',noRequired:'No item requirements',
    noRewards:'No item rewards',questReason:'Quest',activeCount:'active'
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
function questName(x){return text(x?.name)||x?.id?.replaceAll('_',' ')||''}
function getQuestState(id){return questStates[id]||'open'}

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
  const add=(itemId,quantity,reason)=>{
    if(!itemId||!quantity) return;
    if(!map[itemId]) map[itemId]={total:0,reasons:[]};
    map[itemId].total+=Number(quantity)||0;
    map[itemId].reasons.push(reason);
  };

  goals.forEach(g=>g.levels.forEach(l=>{
    if(!active[key(g.id,l.level)]) return;
    l.requirements.forEach(r=>add(r.itemId,r.quantity,`${goalName(g)} ${tr('level')} ${l.level}: ${r.quantity}`));
  }));

  quests.forEach(x=>{
    if(getQuestState(x.id)!=='active') return;
    (x.requiredItemIds||[]).forEach(r=>add(r.itemId,r.quantity,`${tr('questReason')} – ${questName(x)}: ${r.quantity}`));
  });
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
      <div class="goalhead">${escapeHtml(goalName(g))}</div>
      <div class="levelrow">
        ${g.levels.map(l=>`
          <label class="levelbtn">
            <input type="checkbox" data-key="${escapeHtml(key(g.id,l.level))}" ${active[key(g.id,l.level)]?'checked':''}>
            ${escapeHtml(tr('level'))} ${escapeHtml(l.level)}
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
        <div class="sumname">${escapeHtml(name)}</div>
        <div class="summeta">${tr('total')} ${r.total} · ${tr('owned')} ${have} · ${tr('missing')} ${missing}</div>
        <div class="summeta">${escapeHtml(r.reasons.join(' · '))}</div>
      </div>
      <input class="qty" type="number" min="0" inputmode="numeric" value="${have}" data-id="${escapeHtml(id)}" aria-label="${escapeHtml(tr('owned')+' '+name)}">
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
    return `<div class="need ok">${tr('fulfilled')}<div class="reasons">${escapeHtml(req.reasons.join(' · '))}</div></div>`;
  }
  return `<div class="need keep">${tr('keepA')} ${missing} ${tr('keepB')} ${req.total}<div class="reasons">${escapeHtml(req.reasons.join(' · '))}</div></div>`;
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
  return `<article class="card" data-item-id="${escapeHtml(i.id)}">
    <div class="card-head">
      <div>
        <h3>${escapeHtml(itemName(i))}</h3>
        ${type?`<div class="item-type">${escapeHtml(type)}</div>`:''}
      </div>
      ${rarity?`<div class="rarity">${escapeHtml(rarity)}</div>`:''}
    </div>
    <div class="facts">
      <div class="fact"><span>${tr('value')}</span><b>${formatNum(i.value)}</b></div>
      <div class="fact"><span>${tr('weight')}</span><b>${itemWeight(i)==null?'—':formatNum(itemWeight(i))+' kg'}</b></div>
      <div class="fact"><span>${tr('stack')}</span><b>${formatNum(itemStack(i))}</b></div>
    </div>
    ${desc?`<div class="desc"><b>${escapeHtml(tr('use'))}:</b> ${escapeHtml(desc)}</div>`:''}
    <div class="recycle"><b>${escapeHtml(tr('recycle'))}:</b> ${escapeHtml(recyclingText(i))}</div>
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

function questItemsText(arr){
  if(!Array.isArray(arr)||!arr.length) return '';
  return arr.map(r=>{
    const i=itemById(r.itemId);
    return `${r.quantity}× ${i?itemName(i):r.itemId.replaceAll('_',' ')}`;
  }).join(' · ');
}

function setQuestState(id,state){
  questStates[id]=state;
  localStorage.setItem('arcQuestStatus',JSON.stringify(questStates));
  drawQuestHeader();
  drawQuests();
  drawSummary();
  drawItems();
}

function drawQuestHeader(){
  if(!questSummary) return;
  const n=quests.filter(x=>getQuestState(x.id)==='active').length;
  const done=quests.filter(x=>getQuestState(x.id)==='done').length;
  questSummary.textContent=quests.length
    ? `${quests.length} ${tr('questsLoaded')} · ${n} ${tr('activeCount')} · ${done} ${tr('done').toLowerCase()}`
    : (questLoadError?tr('questLoadError'):tr('questSummary'));
  questToggleLabel.textContent=questDrawer.open?tr('hide'):tr('show');
}

function questCard(x){
  const st=getQuestState(x.id);
  const objectives=(x.objectives||[]).map(o=>text(o)).filter(Boolean);
  const required=questItemsText(x.requiredItemIds);
  const rewards=questItemsText(x.rewardItemIds);
  const granted=questItemsText(x.grantedItemIds);
  return `<article class="quest-card quest-${st}">
    <div class="quest-card-head">
      <div>
        <h3>${escapeHtml(questName(x))}</h3>
        ${x.trader?`<div class="quest-trader">${escapeHtml(tr('trader'))}: ${escapeHtml(x.trader)}</div>`:''}
      </div>
      <div class="quest-state">
        <button type="button" data-qid="${escapeHtml(x.id)}" data-state="open" class="${st==='open'?'selected':''}">${tr('open')}</button>
        <button type="button" data-qid="${escapeHtml(x.id)}" data-state="active" class="${st==='active'?'selected':''}">${tr('active')}</button>
        <button type="button" data-qid="${escapeHtml(x.id)}" data-state="done" class="${st==='done'?'selected':''}">${tr('done')}</button>
      </div>
    </div>
    ${objectives.length?`<div class="quest-section"><b>${tr('objectives')}</b><ul>${objectives.map(o=>`<li>${escapeHtml(o)}</li>`).join('')}</ul></div>`:''}
    <div class="quest-grid">
      <div class="quest-mini ${required?'has-required':''}"><b>${tr('required')}</b><span>${escapeHtml(required||tr('noRequired'))}</span></div>
      ${granted?`<div class="quest-mini"><b>${tr('granted')}</b><span>${escapeHtml(granted)}</span></div>`:''}
      <div class="quest-mini"><b>${tr('rewards')}</b><span>${escapeHtml(rewards||tr('noRewards'))}</span></div>
    </div>
  </article>`;
}

function drawQuests(){
  const counts={
    all:quests.length,
    open:quests.filter(x=>getQuestState(x.id)==='open').length,
    active:quests.filter(x=>getQuestState(x.id)==='active').length,
    done:quests.filter(x=>getQuestState(x.id)==='done').length
  };
  document.querySelectorAll('.quest-filter').forEach(btn=>{
    const key=btn.dataset.filter;
    const labels=lang==='de'
      ? {all:'ALLE',open:'OFFEN',active:'AKTIV',done:'ERLEDIGT'}
      : {all:'ALL',open:'OPEN',active:'ACTIVE',done:'DONE'};
    if(labels[key]) btn.textContent=`${labels[key]} (${counts[key]})`;
  });
  if(!questDrawer.open) return;
  if(questLoadError){
    questStatus.textContent=tr('questLoadError');
    questStatus.classList.add('load-error');
    questsList.innerHTML='';
    return;
  }
  const needle=norm(questQ.value.trim());
  const filtered=quests.filter(x=>{
    const st=getQuestState(x.id);
    if(questFilter!=='all'&&st!==questFilter) return false;
    if(!needle) return true;
    const hay=[
      questName(x),x?.name?.de,x?.name?.en,x.trader,
      ...(x.objectives||[]).flatMap(o=>[o?.de,o?.en])
    ].map(norm).join(' ');
    return hay.includes(needle);
  });
  questStatus.classList.remove('load-error');
  questStatus.textContent=`${filtered.length} ${tr('shown')} · ${quests.length} ${tr('questsLoaded')}`;
  questsList.innerHTML=filtered.length?filtered.map(questCard).join(''):`<div class="empty">${tr('noHit')}</div>`;
  questsList.querySelectorAll('.quest-state button').forEach(btn=>{
    btn.addEventListener('click',()=>setQuestState(btn.dataset.qid,btn.dataset.state));
  });
}

async function loadQuests(){
  // Primary source: RaidTheory directly on GitHub. This avoids the Mahcks
  // pagination failure that prevented the quest tracker from starting.
  const dirUrl='https://api.github.com/repos/RaidTheory/arcraiders-data/contents/quests?ref=main';
  const dirResponse=await fetch(dirUrl,{cache:'no-store'});
  if(!dirResponse.ok) throw new Error(`RaidTheory quest index ${dirResponse.status}`);
  const files=await dirResponse.json();
  if(!Array.isArray(files)||!files.length) throw new Error('Invalid RaidTheory quest index');

  const questFiles=files.filter(f=>f?.type==='file'&&f?.name?.endsWith('.json')&&f?.download_url);
  if(!questFiles.length) throw new Error('No quest files found');

  // Fetch in small batches. Individual file failures are isolated so one
  // transient GitHub/raw-file error cannot wipe the complete quest tracker.
  const loaded=[];
  const failed=[];
  const batchSize=10;
  for(let i=0;i<questFiles.length;i+=batchSize){
    const batch=questFiles.slice(i,i+batchSize);
    const results=await Promise.allSettled(batch.map(async f=>{
      const r=await fetch(f.download_url,{cache:'no-store'});
      if(!r.ok) throw new Error(`Quest file ${f.name}: ${r.status}`);
      const data=await r.json();
      if(!data?.id) throw new Error(`Quest file ${f.name}: missing id`);
      return data;
    }));

    results.forEach((result,index)=>{
      if(result.status==='fulfilled') loaded.push(result.value);
      else failed.push({file:batch[index]?.name||'unknown',reason:result.reason});
    });
  }

  const unique=[...new Map(loaded.map(x=>[x.id,x])).values()];
  if(!unique.length) throw new Error('No quest files could be loaded');
  if(failed.length || unique.length!==questFiles.length){
    console.warn(`Quest snapshot partial: ${unique.length}/${questFiles.length} loaded`,failed);
  }
  return unique;
}

function applyLanguage(){
  document.documentElement.lang=lang;
  document.querySelectorAll('[data-t]').forEach(el=>el.textContent=tr(el.dataset.t));
  q.placeholder=tr('placeholder');
  questQ.placeholder=tr('questPlaceholder');
  document.querySelectorAll('.quest-filter').forEach(btn=>btn.textContent=tr(btn.dataset.filter));
  deBtn.classList.toggle('active',lang==='de');
  enBtn.classList.toggle('active',lang==='en');
  localStorage.setItem('arcLang',lang);
  drawGoals();drawQuestHeader();drawQuests();drawSummary();drawItems();
}

deBtn.addEventListener('click',()=>{lang='de';applyLanguage()});
enBtn.addEventListener('click',()=>{lang='en';applyLanguage()});
q.addEventListener('input',drawItems);
questQ.addEventListener('input',drawQuests);
questDrawer.addEventListener('toggle',()=>{drawQuestHeader();drawQuests()});
document.querySelectorAll('.quest-filter').forEach(btn=>{
  btn.addEventListener('click',()=>{
    questFilter=btn.dataset.filter;
    document.querySelectorAll('.quest-filter').forEach(x=>x.classList.toggle('active',x===btn));
    drawQuests();
  });
});

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
    goals=await fetch('goals.json?v=293',{cache:'no-store'}).then(r=>r.json());
    status.textContent=lang==='de'?'Katalog wird geladen …':'Loading catalog …';
    items=await loadFullCatalog();
    usingFallback=false;
  }catch(err){
    console.error(err);
    try{
      items=await fetch('items.json?v=293',{cache:'no-store'}).then(r=>r.json());
      if(!goals.length) goals=await fetch('goals.json?v=293',{cache:'no-store'}).then(r=>r.json());
      usingFallback=true;
    }catch{
      status.textContent=tr('loadError');
      status.classList.add('load-error');
      return;
    }
  }

  try{
    questStatus.textContent=tr('questLoading');
    quests=await loadQuests();
    questLoadError=false;
  }catch(err){
    console.error(err);
    quests=[];
    questLoadError=true;
  }

  applyLanguage();
  if(usingFallback){
    status.textContent=tr('loadError');
    status.classList.add('load-error');
  }
}
boot();
