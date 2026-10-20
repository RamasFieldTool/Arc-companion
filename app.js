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
const questResultCount=document.querySelector('#questResultCount');
const questSummary=document.querySelector('#questSummary');
const questToggleLabel=document.querySelector('#questToggleLabel');

let items=[],goals=[],quests=[],usingFallback=false,questLoadError=false;
let questLoadState='loading',questLoadCounts={loaded:0,total:0},questLoadGeneration=0;
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
function text(obj){if(typeof obj==='string')return obj;const ui=window.RFTDataLabels?.language()||lang;return obj?.[ui]||obj?.en||obj?.de||''}
function itemName(i){
  const original=i?.name?text(i.name):(lang==='de'?(i?.de||i?.en):(i?.en||i?.de))||i?.id||'';
  // Keep stable IDs and saved player data unchanged; correct legacy German display only.
  if(lang==='de'&&/^anvil_(i|ii|iii|iv)$/.test(i?.id||''))return original.replace(/^Amboss\b/i,'Anvil');
  return original;
}
function itemDesc(i){return i?.description?text(i.description):(i?.use||'')}
function itemWeight(i){return i?.weightKg ?? i?.weight ?? null}
function itemStack(i){return i?.stackSize ?? i?.stack ?? null}
function itemById(id){return items.find(x=>x.id===id)}
function key(goalId,level){return `${goalId}:${level}`}
function questName(x){return text(x?.name)||x?.id?.replaceAll('_',' ')||''}
function getQuestState(id){return questStates[id]||'open'}

function goalName(g){const ui=window.RFTDataLabels?.language()||lang;return g[ui]||g.en||g.de||g.id}
function rarityName(r){return window.RFTDataLabels?.value(r,'rarity')||r}
function typeName(type){return window.RFTDataLabels?.value(type,'type')||type||''}
function formatNum(n){
  if(n===null||n===undefined||n==='') return '—';
  return new Intl.NumberFormat(lang==='de'?'de-DE':'en-US',{maximumFractionDigits:2}).format(n);
}

function requirementMap(){
  if(window.RFTPlanning)return window.RFTPlanning.requirementMap();
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
  const amount=Number(val);if(!Number.isSafeInteger(amount)||amount<0)throw new Error('Invalid stock quantity');
  const next={...owned,[id]:amount};
  const completed=window.RFTPlanning?window.RFTPlanning.commitStock(next):[];
  if(!window.RFTPlanning)
  {localStorage.setItem('arcOwned',JSON.stringify(next));Object.assign(owned,next)}
  window.dispatchEvent(new Event('planning-changed'));
  drawSummary(); drawItems();return completed;
}

function toggleGoal(k,checked){
  if(checked) active[k]=true; else delete active[k];
  localStorage.setItem('arcActiveGoals',JSON.stringify(active));
  drawSummary(); drawItems();
}

// Independent Outpost milestone checklist: never treat active material goals as completed tasks.
const OUTPOST_TASK_KEY='arcOutpostBuildTasksV1';
const OUTPOST_TASKS=[
  ['photo','Farmhaus auf Blue Gate fotografieren','Photograph the farmhouse on Blue Gate'],
  ['materials','Baumaterialien abgegeben','Handed in construction materials'],
  ['flying','800 Schaden an fliegenden ARC verursacht','Dealt 800 damage to flying ARC'],
  ['bully','300 Schaden an einem Bully verursacht','Dealt 300 damage to a Bully']
];
function outpostTasks(){try{const x=JSON.parse(localStorage.getItem(OUTPOST_TASK_KEY)||'{}');return x&&typeof x==='object'&&!Array.isArray(x)?x:{}}catch{return {}}}
function outpostChecklist(){
 const state=outpostTasks(),done=OUTPOST_TASKS.filter(([id])=>state[id]).length;
 return `<fieldset class="outpost-checklist" style="margin-top:12px;border:1px solid var(--ui-line,#666);border-radius:10px;padding:12px"><legend>${lang==='de'?'Baufortschritt':'Construction progress'} · ${done}/4</legend>
 ${OUTPOST_TASKS.map(([id,de,en])=>`<label style="display:flex;gap:10px;align-items:flex-start;margin:8px 0"><input type="checkbox" data-outpost-task="${id}" ${state[id]?'checked':''}><span>${escapeHtml(lang==='de'?de:en)}</span></label>`).join('')}
 <small>${lang==='de'?'Materialbedarf über die bestehende Zielauswahl aktivieren. Häkchen markieren erledigte Aufgaben.':'Activate material requirements in existing goals. Checkboxes mark completed tasks.'}</small></fieldset>`;
}
function drawGoals(){
  goalsEl.innerHTML=goals.map(g=>`
    <div class="goalbox">
      <div class="goalhead">${escapeHtml(goalName(g))}</div>
      ${g.id==='rft_outpost_materials'?outpostChecklist():''}
      <div class="levelrow">
        ${g.levels.map(l=>`
          <label class="levelbtn">
            <input type="checkbox" data-key="${escapeHtml(key(g.id,l.level))}" ${active[key(g.id,l.level)]?'checked':''}>
            ${escapeHtml(tr('level'))} ${escapeHtml(l.level)}
          </label>`).join('')}
      </div>
    </div>`).join('');
  goalsEl.querySelectorAll('[data-outpost-task]').forEach(el=>el.addEventListener('change',()=>{
    const next={...outpostTasks(),[el.dataset.outpostTask]:el.checked};
    try{localStorage.setItem(OUTPOST_TASK_KEY,JSON.stringify(next));drawGoals()}catch{el.checked=!el.checked}
  }));
  goalsEl.querySelectorAll('input[data-key][type=checkbox]').forEach(el=>{
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
  if(i.recyclingPending)return text(i.description);
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

// One recipe presentation for every regular item, independent of release date or type.
function itemRecipeHtml(i){
  if(!i.recipe||typeof i.recipe!=='object'||Array.isArray(i.recipe))return '';
  const materials=Object.entries(i.recipe).filter(([id,n])=>typeof id==='string'&&Number.isFinite(n)&&n>0);
  if(!materials.length)return '';
  const locale=window.RFTDataLabels?.language()||lang;
  const labels={de:['Herstellung','Bauplan erforderlich','API-dokumentiert · noch nicht im Spiel bestätigt','Quelle'],en:['Crafting','Blueprint required','API-documented · not yet confirmed in-game','Source'],fr:['Fabrication','Plan requis','Documenté par l’API · non confirmé en jeu','Source'],es:['Fabricación','Plano necesario','Documentado por la API · sin confirmar en el juego','Fuente'],it:['Creazione','Progetto richiesto','Documentato dall’API · non confermato nel gioco','Fonte']}[locale]||['Crafting','Blueprint required','API-documented · not yet confirmed in-game','Source'];
  const materialName=id=>{const target=itemById(id);return target?itemName(target):i.rftRecipeMaterialNames?.[id]?.[locale]||i.rftRecipeMaterialNames?.[id]?.en||id.replaceAll('_',' ')};
  const bench=i.craftBench?String(i.craftBench==='weapon_bench'?'Gunsmith':i.craftBench).replaceAll('_',' '):'';
  const evidence=i.rftRecipeEvidence;
  const url=evidence?.source&&/^https:\/\//.test(evidence.source)?evidence.source:null;
  return `<details class="item-recipe" data-item-recipe><summary>${escapeHtml(labels[0])}</summary>${bench?`<p>${escapeHtml(bench)}</p>`:''}${i.blueprintLocked===true?`<p>${escapeHtml(labels[1])}</p>`:''}<ul>${materials.map(([id,n])=>`<li>${formatNum(n)}× ${escapeHtml(materialName(id))}</li>`).join('')}</ul>${evidence?`<small>${escapeHtml(labels[2])}</small>`:''}${url?`<p><a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(labels[3])}</a></p>`:''}</details>`;
}

function card(i){
  const amplified=window.RFTAmplified?.byId?.[i.id];
  const amplifiedLabel=lang==='de'?'Amplified: 5. Qualitätsstufe':'Amplified: 5th quality tier';
  const amplifiedNote=lang==='de'?'Modulklasse nach Seltenheit; Kosten und Werte noch nicht bestätigt.':'Module class by rarity; costs and stats not yet confirmed.';
  const amplifiedOptions=amplified?.researchedUpgradeOptions||[];
  const optionHeading=lang==='de'?'Upgrade-Optionen (Community, unbestätigt)':'Upgrade options (community, unverified)';
  const optionHtml=amplifiedOptions.length?`<div class="amplified-search-note"><strong>${escapeHtml(optionHeading)}</strong><ul>${amplifiedOptions.map(option=>`<li>${escapeHtml(option.name)}</li>`).join('')}</ul></div>`:'';
  const type=typeName(i.type);
  const rarity=rarityName(i.rarity||'');
  const desc=itemDesc(i);
  return `<article class="card" data-item-id="${escapeHtml(i.id)}">
    <div class="card-head">
      <div class="item-identity">
        ${window.RFTItemImages?.thumbnail(i)||''}
        <div class="item-title">
        <h3>${escapeHtml(itemName(i))}</h3>
        ${type?`<div class="item-type">${escapeHtml(type)}</div>`:''}
        </div>
      </div>
      ${rarity?`<div class="rarity">${escapeHtml(rarity)}</div>`:''}
    </div>
    <div class="facts">
      <div class="fact"><span>${tr('value')}</span><b>${formatNum(i.value)}</b></div>
      <div class="fact"><span>${tr('weight')}</span><b>${itemWeight(i)==null?'—':formatNum(itemWeight(i))+' kg'}</b></div>
      <div class="fact"><span>${tr('stack')}</span><b>${formatNum(itemStack(i))}</b></div>
    </div>
    ${amplified?`<div class="amplified-search-note"><strong>${escapeHtml(amplifiedLabel)}</strong> · MK ${escapeHtml(amplified.moduleMark)}<small>${escapeHtml(amplifiedNote)}</small></div>`:''}
    ${optionHtml}
    ${itemRecipeHtml(i)}
    ${window.RFTAmplified?.materialUseHtml(i.id)||''}
    ${desc?`<div class="desc"><b>${escapeHtml(tr('use'))}:</b> ${escapeHtml(desc)}</div>`:''}
    <div class="recycle"><b>${escapeHtml(tr('recycle'))}:</b> ${recyclingHtml(i)}</div>
    ${goalDecision(i)}
  </article>`;
}

window.addEventListener('rft-amplified-data-ready',()=>{if(typeof drawItems==='function')drawItems()});
window.addEventListener('arc-language-change',()=>{if(typeof drawItems==='function')drawItems()});

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

function questItemsHtml(arr){
  return (Array.isArray(arr)?arr:[]).map(row=>{
    const item=itemById(row.itemId);
    return window.RFTItemImages.label(row.itemId,`${row.quantity}× ${item?itemName(item):row.itemId.replaceAll('_',' ')}`);
  }).join(' · ');
}
function recyclingHtml(item){
  if(item.recyclesInto&&typeof item.recyclesInto==='object'&&Object.keys(item.recyclesInto).length){
    return Object.entries(item.recyclesInto).map(([id,quantity])=>window.RFTItemImages.label(id,`${quantity}× ${itemById(id)?itemName(itemById(id)):id.replaceAll('_',' ')}`)).join(' · ');
  }
  return escapeHtml(recyclingText(item));
}

function setQuestState(id,state){
  if(state==='done'&&window.RFTCompletion){window.RFTCompletion.finish('quest',id,{allowIncomplete:true});return}
  const next={...questStates,[id]:state};localStorage.setItem('arcQuestStatus',JSON.stringify(next));Object.assign(questStates,next);
  window.dispatchEvent(new Event('planning-changed'));
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
      <div class="quest-mini ${required?'has-required':''}"><b>${tr('required')}</b><span>${required?questItemsHtml(x.requiredItemIds):escapeHtml(tr('noRequired'))}</span></div>
      ${granted?`<div class="quest-mini"><b>${tr('granted')}</b><span>${questItemsHtml(x.grantedItemIds)}</span></div>`:''}
      <div class="quest-mini"><b>${tr('rewards')}</b><span>${rewards?questItemsHtml(x.rewardItemIds):escapeHtml(tr('noRewards'))}</span></div>
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
  if(questResultCount){
    const locale=window.RFTDataLabels?.language()||localStorage.getItem('arcUiLanguage')||lang;
    const labels={
      de:(shown,total)=>`${shown} angezeigt · ${total} Quests geladen`,
      en:(shown,total)=>`${shown} shown · ${total} quests loaded`,
      fr:(shown,total)=>`${shown} affichées · ${total} quêtes chargées`,
      es:(shown,total)=>`${shown} mostradas · ${total} misiones cargadas`,
      it:(shown,total)=>`${shown} mostrate · ${total} missioni caricate`
    };
    questResultCount.textContent=(labels[locale]||labels.en)(filtered.length,quests.length);
  }
  questsList.innerHTML=filtered.length?filtered.map(questCard).join(''):`<div class="empty">${tr('noHit')}</div>`;
  questsList.querySelectorAll('.quest-state button').forEach(btn=>{
    btn.addEventListener('click',()=>setQuestState(btn.dataset.qid,btn.dataset.state));
  });
}

const QUEST_STATUS_COPY={
  de:{loading:'Questdaten werden geladen …',live:'Questdaten vollständig aus der Live-Quelle geladen.',snapshot:'Lokaler Quest-Snapshot aktiv: 100 Quests aus RaidTheory, Stand des Quest-Verzeichnisses 29.05.2026. Vollständig gegenüber der öffentlichen Quelle, aber nicht im Spiel bestätigt und möglicherweise veraltet.',partial:'Questdaten nur teilweise verfügbar: {loaded} von {total} Live-Dateien geladen. Der vollständige lokale Snapshot ist nicht verfügbar.',error:'Questdaten konnten nicht geladen werden. Deine gespeicherten Questzustände bleiben erhalten.',retry:'Erneut versuchen'},
  en:{loading:'Loading quest data …',live:'Quest data loaded from the live source.',snapshot:'Local quest snapshot active: 100 quests from RaidTheory; quest directory last changed 29 May 2026. Complete against the public source, but not confirmed in-game and may be outdated.',partial:'Quest data is only partially available: {loaded} of {total} live files loaded. The complete local snapshot is unavailable.',error:'Quest data could not be loaded. Your saved quest states are preserved.',retry:'Try again'},
  fr:{loading:'Chargement des données de quêtes …',live:'Données des quêtes chargées depuis la source en direct.',snapshot:'Snapshot local actif : 100 quêtes de RaidTheory ; le dossier des quêtes a été modifié le 29 mai 2026. Complet par rapport à la source publique, non confirmé en jeu et potentiellement obsolète.',partial:'Données de quêtes partielles : {loaded} fichiers sur {total} chargés. Le snapshot local complet est indisponible.',error:'Impossible de charger les quêtes. Votre progression enregistrée est conservée.',retry:'Réessayer'},
  es:{loading:'Cargando datos de misiones …',live:'Datos de misiones cargados desde la fuente en directo.',snapshot:'Snapshot local activo: 100 misiones de RaidTheory; la carpeta de misiones se modificó por última vez el 29 de mayo de 2026. Completo según la fuente pública, no confirmado en el juego y posiblemente desactualizado.',partial:'Datos de misiones parciales: se cargaron {loaded} de {total} archivos en directo. El snapshot local completo no está disponible.',error:'No se pudieron cargar las misiones. Se conserva tu progreso guardado.',retry:'Reintentar'},
  it:{loading:'Caricamento dati missioni …',live:'Dati missioni caricati dalla fonte online.',snapshot:'Snapshot locale attivo: 100 missioni di RaidTheory; la cartella delle missioni è stata aggiornata il 29 maggio 2026. Completo rispetto alla fonte pubblica, non confermato nel gioco e potenzialmente obsoleto.',partial:'Dati missioni parziali: caricati {loaded} file su {total}. Lo snapshot locale completo non è disponibile.',error:'Impossibile caricare le missioni. I progressi salvati vengono conservati.',retry:'Riprova'}
};
function questStatusText(){
  const locale=window.RFTDataLabels?.language()||localStorage.getItem('arcUiLanguage')||lang;
  const copy=QUEST_STATUS_COPY[locale]||QUEST_STATUS_COPY.en;
  if(questLoadState==='partial')return copy.partial.replace('{loaded}',questLoadCounts.loaded).replace('{total}',questLoadCounts.total);
  return copy[questLoadState]||copy.loading;
}
function renderQuestSourceStatus(){
  if(!questStatus)return;
  questStatus.textContent=questStatusText();
  questStatus.dataset.state=questLoadState;
  questStatus.classList.toggle('load-error',questLoadState==='error');
  questStatus.classList.toggle('load-partial',questLoadState==='partial'||questLoadState==='snapshot');
  const retry=document.getElementById('questRetry');
  if(retry){
    const locale=window.RFTDataLabels?.language()||localStorage.getItem('arcUiLanguage')||lang;
    retry.textContent=(QUEST_STATUS_COPY[locale]||QUEST_STATUS_COPY.en).retry;
    retry.hidden=!['snapshot','partial','error'].includes(questLoadState);
  }
}

async function loadQuestSnapshot(){
  const response=await fetch('catalog-data/quests-full-snapshot.json?v=quest-snapshot-20261018',{cache:'no-store'});
  if(!response.ok)throw new Error(`Local quest snapshot ${response.status}`);
  const snapshot=await response.json();
  if(snapshot?.schema!=='ramas-field-tool-quest-snapshot'||snapshot?.formatVersion!==1||snapshot?.completeAtCapture!==true||!Array.isArray(snapshot.quests)||snapshot.count!==snapshot.quests.length)throw new Error('Invalid local quest snapshot metadata');
  const ids=snapshot.quests.map(quest=>quest?.id);
  if(ids.some(id=>typeof id!=='string'||!id)||new Set(ids).size!==ids.length)throw new Error('Invalid or duplicate IDs in local quest snapshot');
  if(!window.crypto?.subtle)throw new Error('Quest snapshot integrity check is unavailable');
  const bytes=new TextEncoder().encode(JSON.stringify(snapshot.quests));
  const digest=await window.crypto.subtle.digest('SHA-256',bytes);
  const actual=[...new Uint8Array(digest)].map(value=>value.toString(16).padStart(2,'0')).join('');
  if(actual!==snapshot.contentSha256)throw new Error('Local quest snapshot checksum mismatch');
  return snapshot.quests;
}

async function loadQuests(){
  // Primary source: RaidTheory directly on GitHub. This avoids the Mahcks
  // pagination failure that prevented the quest tracker from starting.
  const dirUrl='https://api.github.com/repos/RaidTheory/arcraiders-data/contents/quests?ref=main';
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),20000);
  let dirResponse;
  try{dirResponse=await fetch(dirUrl,{cache:'no-store',signal:controller.signal})}
  catch(error){clearTimeout(timeout);throw error}
  if(!dirResponse.ok){clearTimeout(timeout);throw new Error(`RaidTheory quest index ${dirResponse.status}`)}
  let files;
  try{files=await dirResponse.json()}catch(error){clearTimeout(timeout);throw error}
  if(!Array.isArray(files)||!files.length){clearTimeout(timeout);throw new Error('Invalid RaidTheory quest index')}

  const questFiles=files.filter(f=>f?.type==='file'&&f?.name?.endsWith('.json')&&f?.download_url);
  if(!questFiles.length){clearTimeout(timeout);throw new Error('No quest files found')}

  // Fetch in small batches. Individual file failures are isolated so one
  // transient GitHub/raw-file error cannot wipe the complete quest tracker.
  const loaded=[];
  const failed=[];
  const batchSize=10;
  for(let i=0;i<questFiles.length;i+=batchSize){
    const batch=questFiles.slice(i,i+batchSize);
    const results=await Promise.allSettled(batch.map(async f=>{
      const r=await fetch(f.download_url,{cache:'no-store',signal:controller.signal});
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
  clearTimeout(timeout);
  if(!unique.length) throw new Error('No quest files could be loaded');
  if(failed.length || unique.length!==questFiles.length){
    console.warn(`Quest source partial: ${unique.length}/${questFiles.length} loaded`,failed);
    try{return {quests:await loadQuestSnapshot(),state:'snapshot',loaded:unique.length,total:questFiles.length}}
    catch(snapshotError){console.warn('Complete quest snapshot unavailable',snapshotError);return {quests:unique,state:'partial',loaded:unique.length,total:questFiles.length}}
  }
  return {quests:unique,state:'live',loaded:unique.length,total:questFiles.length};
}

async function refreshQuests(){
  const generation=++questLoadGeneration;
  questLoadState='loading';questLoadCounts={loaded:0,total:0};renderQuestSourceStatus();drawQuestHeader();
  try{
    let result;
    try{result=await loadQuests()}
    catch(remoteError){
      console.warn(remoteError);
      result={quests:await loadQuestSnapshot(),state:'snapshot',loaded:0,total:0};
    }
    if(generation!==questLoadGeneration)return;
    quests=result.quests;
    questLoadError=false;
    questLoadState=result.state;
    questLoadCounts={loaded:result.loaded,total:result.total};
  }catch(error){
    if(generation!==questLoadGeneration)return;
    console.error(error);
    quests=[];questLoadError=true;questLoadState='error';questLoadCounts={loaded:0,total:0};
  }
  quests=window.RFTFrozenTrailData.references(quests);
  renderQuestSourceStatus();drawQuestHeader();drawQuests();drawSummary();drawItems();
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
  drawGoals();drawQuestHeader();renderQuestSourceStatus();drawQuests();drawSummary();drawItems();
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
  // Quest retrieval must never gate the search catalog or existing planning UI.
  void refreshQuests();
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

  items=items.map(window.RFTCatalogUpdate.correct);
  ({items,goals}=window.RFTFrozenTrailData.extend(items,goals));

  applyLanguage();
  if(usingFallback){
    status.textContent=tr('loadError');
    status.classList.add('load-error');
  }
}
boot();

// Retry the upstream catalog without replacing a working snapshot until a full catalog validates.
// User-owned stock, goals and quest progress are not modified by this refresh.
let liveCatalogRetryBusy=false;
let lastLiveCatalogRetry=Date.now();
async function retryLiveCatalogWhenVisible(){
  if(document.visibilityState==='hidden'||liveCatalogRetryBusy||Date.now()-lastLiveCatalogRetry<300000)return;
  if(window.__arcCatalogMeta?.source==='mahcks'&&!usingFallback)return;
  liveCatalogRetryBusy=true;
  lastLiveCatalogRetry=Date.now();
  try{
    window.RFTCatalogRetryLive?.();
    const fresh=await loadFullCatalog();
    if(window.__arcCatalogMeta?.source!=='mahcks')return;
    const corrected=fresh.map(window.RFTCatalogUpdate.correct);
    const expanded=window.RFTFrozenTrailData.extend(corrected,goals);
    items=expanded.items;
    usingFallback=false;
    status.classList.remove('load-error');
    applyLanguage();
    window.renderDataStatus?.();
  }catch(error){
    console.warn('Background live catalog retry failed; retaining existing catalog.',error);
  }finally{
    liveCatalogRetryBusy=false;
  }
}
setInterval(()=>void retryLiveCatalogWhenVisible(),60000);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')void retryLiveCatalogWhenVisible();});

document.getElementById('questRetry')?.addEventListener('click',()=>void refreshQuests());

window.addEventListener('arc-language-change',()=>{drawGoals();drawQuestHeader();renderQuestSourceStatus();drawQuests();drawSummary();drawItems()});
