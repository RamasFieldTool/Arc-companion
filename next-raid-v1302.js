// V13.0.5 test — low-friction next raid loop without DOM observer feedback loops.
(()=>{
  const drawer=document.getElementById('nextRaidDrawer');
  const list=document.getElementById('nextRaidList');
  const summary=document.getElementById('nextRaidSummary');
  const action=document.getElementById('nextRaidAction');
  const actions=document.getElementById('nextRaidActions');
  const closeButton=document.getElementById('nextRaidClose');
  const removeDoneButton=document.getElementById('nextRaidRemoveDone');
  const clearButton=document.getElementById('nextRaidClear');
  if(!drawer||!list||!summary||!action||!actions||!closeButton||!clearButton)return;

  const STORAGE_KEY='arcNextRaid';
  const PROGRESS_KEY='arcOwned';
  const COPY={
    de:{
      title:'MEIN NÄCHSTER RAID',intro:'Dein offener Bedarf erscheint automatisch. Ziele einmal setzen, danach nur noch spielen und relevante Funde eintragen.',
      open:'ÖFFNEN',close:'SCHLIESSEN',stillNeed:'Noch benötigt',workshop:'WERKBANK',quest:'QUEST',both:'QUEST + WERKBANK',
      focus:'FOKUS',focusOn:'★ FOKUS',focusOff:'☆ FOKUS',autoList:'Automatischer Bedarf',
      empty:'Noch kein offener Bedarf. Wähle oben direkt ein Ziel oder eine Quest.',raidDone:'✓ RAID BEENDET',
      noActiveNeed:'Aktuell gibt es keinen offenen Itembedarf aus aktiven Zielen oder Quests.',whatBrought:'Was hast du mitgebracht?',
      foundHint:'Nur Dinge eintragen, die du erfolgreich aus dem Raid mitgebracht hast.',nothing:'NICHTS RELEVANTES MITGEBRACHT',
      applyLoot:'FUNDE ÜBERNEHMEN',cancel:'ABBRECHEN',found:'gefunden',receiptNone:'Keine relevanten Funde – nichts geändert.',
      receiptPrefix:'Übernommen:',receiptUnits:'Einheiten für aktive Ziele',ignoredPrefix:'Nicht gezählt:',ignoredSuffix:'über dem aktuellen Bedarf.',
      correctionTitle:'Sammelstand korrigieren',correctionHelp:'Nur falls Material anderweitig verbraucht, abgegeben oder falsch eingetragen wurde.',
      correctionEmpty:'Kein aktiver Itembedarf.',correctNow:'Für Ziele verfügbar',goalsTitle:'Ziele direkt hier verwalten',active:'aktiv',
      workshopGoals:'Werkbankziele',questGoals:'Quests',noWorkshop:'Werkbankziele werden geladen …',noActiveQuest:'Keine aktive Quest.',
      addQuest:'Quest aktivieren',chooseQuest:'Quest auswählen …',deactivate:'Entfernen',unitsOpen:'Einheiten offen',itemsOpen:'Items offen',
      loading:'Bedarf wird geladen …'
    },
    en:{
      title:'MY NEXT RAID',intro:'Your open needs appear automatically. Set goals once, then just play and log relevant loot.',
      open:'OPEN',close:'CLOSE',stillNeed:'Still needed',workshop:'WORKSHOP',quest:'QUEST',both:'QUEST + WORKSHOP',
      focus:'FOCUS',focusOn:'★ FOCUS',focusOff:'☆ FOCUS',autoList:'Automatic needs',
      empty:'No open need yet. Choose a goal or quest directly above.',raidDone:'✓ RAID FINISHED',
      noActiveNeed:'There is currently no open item need from active goals or quests.',whatBrought:'What did you bring back?',
      foundHint:'Only enter items you successfully brought out of the raid.',nothing:'BROUGHT BACK NOTHING RELEVANT',
      applyLoot:'APPLY LOOT',cancel:'CANCEL',found:'found',receiptNone:'No relevant loot – nothing changed.',
      receiptPrefix:'Applied:',receiptUnits:'units toward active goals',ignoredPrefix:'Not counted:',ignoredSuffix:'above the current need.',
      correctionTitle:'Correct collected progress',correctionHelp:'Only use this if materials were spent elsewhere, handed in, or entered incorrectly.',
      correctionEmpty:'No active item need.',correctNow:'Available for goals',goalsTitle:'Manage goals right here',active:'active',
      workshopGoals:'Workshop goals',questGoals:'Quests',noWorkshop:'Workshop goals are loading …',noActiveQuest:'No active quest.',
      addQuest:'Activate quest',chooseQuest:'Choose quest …',deactivate:'Remove',unitsOpen:'units open',itemsOpen:'items open',
      loading:'Loading needs …'
    }
  };

  let focus={};
  try{
    const stored=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');
    if(stored&&typeof stored==='object'&&!Array.isArray(stored))Object.keys(stored).forEach(id=>focus[id]=true);
  }catch{}

  let postMode='idle';
  let receipt='';
  let lastDataSignature='';
  let pollCount=0;

  const language=()=>typeof lang!=='undefined'&&lang==='en'?'en':'de';
  const copy=()=>COPY[language()];
  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const ready=()=>typeof goals!=='undefined'&&Array.isArray(goals)&&goals.length>0&&typeof requirementMap==='function';
  const itemFor=id=>typeof itemById==='function'?itemById(id):null;
  const displayName=id=>{const i=itemFor(id);return i&&typeof itemName==='function'?itemName(i):String(id).replaceAll('_',' ');};
  const reqMap=()=>typeof requirementMap==='function'?(requirementMap()||{}):{};
  const progress=()=>{
    if(typeof owned!=='undefined'&&owned&&typeof owned==='object')return owned;
    try{return JSON.parse(localStorage.getItem(PROGRESS_KEY)||'{}')||{}}catch{return {}}
  };
  const needFor=id=>{
    const req=reqMap()[id];
    if(!req)return {active:false,total:0,have:0,missing:0,reasons:[]};
    const total=Math.max(0,Number(req.total)||0), have=Math.max(0,Number(progress()[id])||0);
    return {active:true,total,have:Math.min(have,total),missing:Math.max(0,total-have),reasons:req.reasons||[]};
  };
  const saveFocus=()=>localStorage.setItem(STORAGE_KEY,JSON.stringify(Object.fromEntries(Object.keys(focus).map(id=>[id,{focus:true}]))));

  function sourceLabel(id){
    const c=copy(), reasons=reqMap()?.[id]?.reasons||[];
    if(!reasons.length)return '';
    const qp=typeof tr==='function'?`${tr('questReason')} –`:'';
    const hasQ=!!qp&&reasons.some(r=>String(r).startsWith(qp));
    const hasW=reasons.some(r=>!qp||!String(r).startsWith(qp));
    return hasQ&&hasW?c.both:(hasQ?c.quest:c.workshop);
  }

  function openNeeds(){
    return Object.keys(reqMap()).map(id=>({id,name:displayName(id),...needFor(id),focused:!!focus[id]}))
      .filter(x=>x.missing>0)
      .sort((a,b)=>a.focused!==b.focused?(a.focused?-1:1):(a.missing-b.missing)||a.name.localeCompare(b.name,language()==='de'?'de':'en'));
  }

  const goalQuick=document.createElement('details');
  goalQuick.className='next-raid-goals';
  goalQuick.innerHTML='<summary><strong></strong><span></span></summary><div class="next-raid-goals-body"></div>';
  list.before(goalQuick);
  const goalTitle=goalQuick.querySelector('summary strong');
  const goalStatus=goalQuick.querySelector('summary span');
  const goalBody=goalQuick.querySelector('.next-raid-goals-body');

  const postRaid=document.createElement('section');
  postRaid.className='next-raid-post';
  postRaid.innerHTML='<div id="nextRaidPostContent"></div>';
  closeButton.before(postRaid);
  const postContent=postRaid.firstElementChild;

  const correction=document.createElement('details');
  correction.className='next-raid-correction';
  correction.innerHTML='<summary></summary><div class="next-raid-correction-body"></div>';
  closeButton.before(correction);
  const correctionSummary=correction.querySelector('summary');
  const correctionBody=correction.querySelector('.next-raid-correction-body');

  if(removeDoneButton)removeDoneButton.hidden=true;
  actions.hidden=true;
  clearButton.hidden=true;

  function activeCounts(){
    let w=0,q=0;
    if(typeof goals!=='undefined'&&Array.isArray(goals)&&typeof active!=='undefined')goals.forEach(g=>(g.levels||[]).forEach(l=>{if(active[`${g.id}:${l.level}`])w++;}));
    if(typeof quests!=='undefined'&&Array.isArray(quests)&&typeof getQuestState==='function')q=quests.filter(x=>getQuestState(x.id)==='active').length;
    return {w,q,total:w+q};
  }

  function renderGoals(){
    const c=copy(), counts=activeCounts();
    goalTitle.textContent=c.goalsTitle;
    goalStatus.textContent=`${counts.total} ${c.active}`;
    const gs=typeof goals!=='undefined'&&Array.isArray(goals)?goals:[];
    const workshop=gs.length?gs.map(g=>{
      const name=typeof goalName==='function'?goalName(g):(g.de||g.en||g.id);
      const levels=(g.levels||[]).map(l=>{
        const k=`${g.id}:${l.level}`, checked=typeof active!=='undefined'&&!!active[k];
        return `<label class="quick-goal-level"><input type="checkbox" data-quick-goal-key="${esc(k)}" ${checked?'checked':''}><span>${esc((typeof tr==='function'?tr('level'):'Level')+' '+l.level)}</span></label>`;
      }).join('');
      return `<div class="quick-goal-group"><strong>${esc(name)}</strong><div>${levels}</div></div>`;
    }).join(''):`<div class="next-raid-empty">${esc(c.noWorkshop)}</div>`;

    const qs=typeof quests!=='undefined'&&Array.isArray(quests)?quests:[];
    const state=id=>typeof getQuestState==='function'?getQuestState(id):'open';
    const qName=q=>typeof questName==='function'?questName(q):String(q?.id||'').replaceAll('_',' ');
    const activeQs=qs.filter(q=>state(q.id)==='active');
    const openQs=qs.filter(q=>state(q.id)==='open');
    const activeHtml=activeQs.length?activeQs.map(q=>`<div class="quick-active-quest"><span>${esc(qName(q))}</span><button type="button" data-quick-quest-remove="${esc(q.id)}">${esc(c.deactivate)}</button></div>`).join(''):`<div class="quick-empty-line">${esc(c.noActiveQuest)}</div>`;
    const addHtml=openQs.length?`<div class="quick-quest-add"><select data-quick-quest-select><option value="">${esc(c.chooseQuest)}</option>${openQs.map(q=>`<option value="${esc(q.id)}">${esc(qName(q))}</option>`).join('')}</select><button type="button" data-quick-quest-add>${esc(c.addQuest)}</button></div>`:'';
    goalBody.innerHTML=`<section><h4>${esc(c.workshopGoals)}</h4><div class="quick-workshop-list">${workshop}</div></section><section><h4>${esc(c.questGoals)}</h4><div class="quick-active-quests">${activeHtml}</div>${addHtml}</section>`;
  }

  function renderPlan(){
    const c=copy();
    if(!ready()){
      list.innerHTML=`<div class="next-raid-empty">${esc(c.loading)}</div>`;
      return;
    }
    const needs=openNeeds();
    if(!needs.length){list.innerHTML=`<div class="next-raid-empty">${esc(c.empty)}</div>`;return;}
    list.innerHTML=`<div class="next-raid-list-label">${esc(c.autoList)}</div>${needs.map(x=>`<article class="next-raid-item${x.focused?' is-focus':''}" data-raid-id="${esc(x.id)}">
      <button type="button" class="next-raid-focus" data-focus-id="${esc(x.id)}" aria-pressed="${x.focused?'true':'false'}">${x.focused?'★':'☆'}</button>
      <div class="next-raid-item-copy"><strong>${esc(x.name)}</strong><small>${esc(sourceLabel(x.id))}</small></div>
      <div class="next-raid-need"><span>${esc(c.stillNeed)}</span><strong>${x.missing}</strong></div>
    </article>`).join('')}`;
  }

  function updateHeader(){
    const c=copy(), needs=ready()?openNeeds():[], units=needs.reduce((s,x)=>s+x.missing,0);
    const title=document.getElementById('nextRaidTitle'), intro=document.getElementById('nextRaidIntro');
    if(title)title.textContent=c.title;if(intro)intro.textContent=c.intro;
    summary.textContent=!ready()?c.loading:(needs.length?`${needs.length} ${c.itemsOpen} · ${units} ${c.unitsOpen}`:c.noActiveNeed);
    action.textContent=drawer.open?c.close:c.open;
  }

  function lootRow(x,c){
    return `<div class="loot-entry-row${x.focused?' is-focus':''}" data-loot-id="${esc(x.id)}"><div class="loot-entry-copy"><strong>${x.focused?'★ ':''}${esc(x.name)}</strong><small>${esc(c.stillNeed)}: ${x.missing}</small></div><div class="loot-quick"><button type="button" data-loot-step="1">+1</button><button type="button" data-loot-step="2">+2</button><button type="button" data-loot-step="5">+5</button></div><div class="loot-stepper"><button type="button" data-loot-step="-1">−</button><input type="number" min="0" max="${x.missing}" inputmode="numeric" value="0" data-loot-input="${esc(x.id)}"><button type="button" data-loot-step="1">＋</button></div></div>`;
  }

  function renderPost(){
    const c=copy(), needs=ready()?openNeeds():[];
    if(postMode==='entry'){
      postContent.innerHTML=`<div class="post-raid-card post-raid-entry"><strong>${esc(c.whatBrought)}</strong><p>${esc(c.foundHint)}</p><div class="loot-entry-list">${needs.map(x=>lootRow(x,c)).join('')}</div><div class="post-raid-submit"><button type="button" data-post-action="nothing">${esc(c.nothing)}</button><button type="button" class="primary" data-post-action="apply">${esc(c.applyLoot)}</button></div><button type="button" class="post-raid-cancel" data-post-action="cancel">${esc(c.cancel)}</button></div>`;
    }else{
      postContent.innerHTML=`${receipt?`<div class="post-raid-receipt">${esc(receipt)}</div>`:''}<button type="button" class="raid-finished" data-post-action="finish" ${!needs.length?'disabled':''}>${esc(c.raidDone)}</button>${!needs.length?`<p class="post-raid-muted">${esc(c.noActiveNeed)}</p>`:''}`;
    }
  }

  function renderCorrection(){
    const c=copy(); correctionSummary.textContent=c.correctionTitle;
    const all=ready()?Object.keys(reqMap()).map(id=>({id,name:displayName(id),...needFor(id)})).filter(x=>x.active):[];
    correctionBody.innerHTML=`<p>${esc(c.correctionHelp)}</p>${all.length?`<div class="correction-list">${all.map(x=>`<label><span><strong>${esc(x.name)}</strong><small>${esc(c.stillNeed)}: ${x.missing} / ${x.total}</small></span><input type="number" min="0" max="${x.total}" inputmode="numeric" value="${x.have}" data-correct-id="${esc(x.id)}"></label>`).join('')}</div>`:`<div class="next-raid-empty">${esc(c.correctionEmpty)}</div>`}`;
  }

  function renderAll(){renderGoals();renderPlan();renderPost();renderCorrection();updateHeader();}

  function setProgress(id,value){
    const req=reqMap()[id];if(!req)return;
    const total=Math.max(0,Number(req.total)||0), val=Math.max(0,Math.min(total,Number(value)||0));
    const p=progress();p[id]=val;localStorage.setItem(PROGRESS_KEY,JSON.stringify(p));
    if(typeof drawSummary==='function')drawSummary();if(typeof drawItems==='function')drawItems();
  }

  function applyLoot(){
    const c=copy(), p=progress();let units=0,ignored=0,changed=0;
    postContent.querySelectorAll('[data-loot-input]').forEach(input=>{
      const id=input.dataset.lootInput, entered=Math.max(0,Number(input.value)||0);if(!entered)return;
      const n=needFor(id);if(!n.active||n.missing<=0)return;
      const credited=Math.min(entered,n.missing);p[id]=n.have+credited;units+=credited;ignored+=Math.max(0,entered-credited);changed+=credited?1:0;
      if(n.missing-credited<=0&&focus[id])delete focus[id];
    });
    localStorage.setItem(PROGRESS_KEY,JSON.stringify(p));saveFocus();
    if(typeof drawSummary==='function')drawSummary();if(typeof drawItems==='function')drawItems();
    receipt=changed?`${c.receiptPrefix} ${units} ${c.receiptUnits}${ignored?`. ${c.ignoredPrefix} ${ignored} ${c.ignoredSuffix}`:''}`:c.receiptNone;
    postMode='idle';renderAll();
  }

  document.addEventListener('click',e=>{
    const f=e.target.closest('[data-focus-id],[data-next-raid-add]');
    if(f){const id=f.dataset.focusId||f.dataset.itemId;const n=needFor(id);if(n.active&&n.missing>0){focus[id]?delete focus[id]:focus[id]=true;saveFocus();renderAll();}return;}
    const pa=e.target.closest('[data-post-action]');
    if(pa){const a=pa.dataset.postAction;if(a==='finish'){receipt='';postMode='entry';renderPost();}else if(a==='nothing'){receipt=copy().receiptNone;postMode='idle';renderPost();}else if(a==='cancel'){postMode='idle';renderPost();}else if(a==='apply')applyLoot();return;}
    const step=e.target.closest('[data-loot-step]');
    if(step){const row=step.closest('[data-loot-id]'),input=row?.querySelector('[data-loot-input]');if(!input)return;const max=Number(input.max)||9999;input.value=String(Math.max(0,Math.min(max,(Number(input.value)||0)+Number(step.dataset.lootStep||0))));return;}
    const qr=e.target.closest('[data-quick-quest-remove]');
    if(qr&&typeof setQuestState==='function'){setQuestState(qr.dataset.quickQuestRemove,'open');setTimeout(renderAll,0);return;}
    const qa=e.target.closest('[data-quick-quest-add]');
    if(qa&&typeof setQuestState==='function'){const s=goalBody.querySelector('[data-quick-quest-select]');if(s?.value){setQuestState(s.value,'active');setTimeout(renderAll,0);}return;}
  });

  goalBody.addEventListener('change',e=>{
    const input=e.target.closest('[data-quick-goal-key]');if(!input)return;
    if(typeof toggleGoal==='function')toggleGoal(input.dataset.quickGoalKey,input.checked);
    else if(typeof active!=='undefined'){input.checked?active[input.dataset.quickGoalKey]=true:delete active[input.dataset.quickGoalKey];localStorage.setItem('arcActiveGoals',JSON.stringify(active));}
    setTimeout(renderAll,0);
  });

  postContent.addEventListener('change',e=>{const input=e.target.closest('[data-loot-input]');if(input){const max=Number(input.max)||0;input.value=String(Math.max(0,Math.min(max,Number(input.value)||0)));}});
  correctionBody.addEventListener('change',e=>{const input=e.target.closest('[data-correct-id]');if(!input)return;setProgress(input.dataset.correctId,input.value);if(needFor(input.dataset.correctId).missing<=0&&focus[input.dataset.correctId]){delete focus[input.dataset.correctId];saveFocus();}renderAll();});
  closeButton.addEventListener('click',()=>{postMode='idle';drawer.open=false;});
  drawer.addEventListener('toggle',()=>{if(drawer.open)renderAll();else updateHeader();});
  document.getElementById('deBtn')?.addEventListener('click',()=>setTimeout(renderAll,0));
  document.getElementById('enBtn')?.addEventListener('click',()=>setTimeout(renderAll,0));

  // Data is loaded asynchronously by app.js. Poll briefly instead of observing DOM mutations.
  const poll=setInterval(()=>{
    pollCount++;
    const sig=[typeof goals!=='undefined'&&Array.isArray(goals)?goals.length:0,typeof quests!=='undefined'&&Array.isArray(quests)?quests.length:0,Object.keys(reqMap()).length].join(':');
    if(sig!==lastDataSignature){lastDataSignature=sig;renderAll();}
    if((ready()&&pollCount>8)||pollCount>80)clearInterval(poll);
  },250);

  renderAll();
})();
