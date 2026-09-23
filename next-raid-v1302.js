// V13.0.4 test — low-friction next raid loop: goals -> automatic need -> fast post-raid loot.
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
      kicker:'RUN PLAN // PERSÖNLICH',title:'MEIN NÄCHSTER RAID',
      intro:'Dein offener Bedarf erscheint automatisch. Ziele einmal setzen, danach nur noch spielen und relevante Funde eintragen.',
      open:'ÖFFNEN',close:'SCHLIESSEN',stillNeed:'Noch benötigt',goalProgress:'Für Ziele verfügbar',
      workshop:'WERKBANK',quest:'QUEST',both:'QUEST + WERKBANK',focus:'FOKUS',focusOn:'★ FOKUS',focusOff:'☆ FOKUS',
      autoList:'Automatischer Bedarf',empty:'Noch kein offener Bedarf. Wähle unten direkt ein Ziel oder eine Quest.',
      raidDone:'✓ RAID BEENDET',noActiveNeed:'Aktuell gibt es keinen offenen Itembedarf aus aktiven Zielen oder Quests.',
      whatBrought:'Was hast du mitgebracht?',foundHint:'Nur Dinge eintragen, die du erfolgreich aus dem Raid mitgebracht hast.',
      nothing:'NICHTS RELEVANTES MITGEBRACHT',applyLoot:'FUNDE ÜBERNEHMEN',cancel:'ABBRECHEN',found:'gefunden',
      receiptNone:'Keine relevanten Funde – nichts geändert.',receiptPrefix:'Übernommen:',receiptUnits:'Einheiten für aktive Ziele',
      ignoredPrefix:'Nicht gezählt:',ignoredSuffix:'über dem aktuellen Bedarf – wir führen bewusst kein Lagerinventar.',
      correctionTitle:'Sammelstand korrigieren',correctionHelp:'Nur falls Material im Spiel anderweitig verbraucht, abgegeben oder falsch eingetragen wurde. Das ist kein komplettes Lagerinventar.',
      correctionEmpty:'Kein aktiver Itembedarf.',correctNow:'Für Ziele verfügbar',
      goalsTitle:'Ziele direkt hier verwalten',goalsSummary:'Ziele',active:'aktiv',workshopGoals:'Werkbankziele',questGoals:'Quests',
      noWorkshop:'Keine Werkbankziele geladen.',noActiveQuest:'Keine aktive Quest.',addQuest:'Quest aktivieren',chooseQuest:'Quest auswählen …',
      deactivate:'Entfernen',done:'erledigt',unitsOpen:'Einheiten offen',itemsOpen:'Items offen',
      quick1:'+1',quick2:'+2',quick5:'+5'
    },
    en:{
      kicker:'RUN PLAN // PERSONAL',title:'MY NEXT RAID',
      intro:'Your open needs appear automatically. Set goals once, then just play and log relevant loot.',
      open:'OPEN',close:'CLOSE',stillNeed:'Still needed',goalProgress:'Available for goals',
      workshop:'WORKSHOP',quest:'QUEST',both:'QUEST + WORKSHOP',focus:'FOCUS',focusOn:'★ FOCUS',focusOff:'☆ FOCUS',
      autoList:'Automatic needs',empty:'No open need yet. Choose a goal or quest directly below.',
      raidDone:'✓ RAID FINISHED',noActiveNeed:'There is currently no open item need from active goals or quests.',
      whatBrought:'What did you bring back?',foundHint:'Only enter items you successfully brought out of the raid.',
      nothing:'BROUGHT BACK NOTHING RELEVANT',applyLoot:'APPLY LOOT',cancel:'CANCEL',found:'found',
      receiptNone:'No relevant loot – nothing changed.',receiptPrefix:'Applied:',receiptUnits:'units toward active goals',
      ignoredPrefix:'Not counted:',ignoredSuffix:'above the current need – this tool intentionally does not track your whole stash.',
      correctionTitle:'Correct collected progress',correctionHelp:'Only use this if materials were spent elsewhere, handed in, or entered incorrectly. This is not your whole stash.',
      correctionEmpty:'No active item need.',correctNow:'Available for goals',
      goalsTitle:'Manage goals right here',goalsSummary:'Goals',active:'active',workshopGoals:'Workshop goals',questGoals:'Quests',
      noWorkshop:'No workshop goals loaded.',noActiveQuest:'No active quest.',addQuest:'Activate quest',chooseQuest:'Choose quest …',
      deactivate:'Remove',done:'done',unitsOpen:'units open',itemsOpen:'items open',
      quick1:'+1',quick2:'+2',quick5:'+5'
    }
  };

  let raid={};
  try{
    const stored=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');
    if(stored&&typeof stored==='object'&&!Array.isArray(stored)){
      Object.entries(stored).forEach(([id,entry])=>{
        if(entry&&typeof entry==='object')raid[id]={focus:true};
      });
    }
  }catch{raid={}}

  const language=()=>typeof lang!=='undefined'&&lang==='en'?'en':'de';
  const copy=()=>COPY[language()];
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const itemFor=id=>typeof itemById==='function'?itemById(id):null;
  const displayName=id=>{
    const item=itemFor(id);
    return item&&typeof itemName==='function'?itemName(item):String(id).replaceAll('_',' ');
  };
  const reqMap=()=>typeof requirementMap==='function'?(requirementMap()||{}):{};
  const progressObject=()=>{
    if(typeof owned!=='undefined'&&owned&&typeof owned==='object')return owned;
    try{return JSON.parse(localStorage.getItem(PROGRESS_KEY)||'{}')||{}}catch{return {}}
  };
  const needFor=id=>{
    const req=reqMap()[id];
    if(!req)return {active:false,total:0,have:0,missing:0,reasons:[]};
    const have=Math.max(0,Number(progressObject()[id])||0);
    const total=Math.max(0,Number(req.total)||0);
    return {active:true,total,have:Math.min(have,total),missing:Math.max(0,total-have),reasons:req.reasons||[]};
  };
  const focusIds=()=>new Set(Object.keys(raid));

  function sourceLabel(id){
    const c=copy();
    const reasons=reqMap()?.[id]?.reasons||[];
    if(!reasons.length)return '';
    const questPrefix=typeof tr==='function'?`${tr('questReason')} –`:'';
    const hasQuest=!!questPrefix&&reasons.some(reason=>String(reason).startsWith(questPrefix));
    const hasWorkshop=reasons.some(reason=>!questPrefix||!String(reason).startsWith(questPrefix));
    if(hasQuest&&hasWorkshop)return c.both;
    return hasQuest?c.quest:c.workshop;
  }

  function saveRaid(){localStorage.setItem(STORAGE_KEY,JSON.stringify(raid));}

  function openNeeds(){
    const focused=focusIds();
    return Object.entries(reqMap()).map(([id,r])=>{
      const n=needFor(id);
      return {id,name:displayName(id),...n,reasons:r.reasons||[],focused:focused.has(id)};
    }).filter(x=>x.missing>0).sort((a,b)=>{
      if(a.focused!==b.focused)return a.focused?-1:1;
      if(a.missing!==b.missing)return a.missing-b.missing;
      return a.name.localeCompare(b.name,language()==='de'?'de':'en');
    });
  }

  const goalQuick=document.createElement('details');
  goalQuick.className='next-raid-goals';
  goalQuick.innerHTML='<summary><strong></strong><span></span></summary><div class="next-raid-goals-body"></div>';
  list.before(goalQuick);
  const goalQuickTitle=goalQuick.querySelector('summary strong');
  const goalQuickStatus=goalQuick.querySelector('summary span');
  const goalQuickBody=goalQuick.querySelector('.next-raid-goals-body');
  let autoOpenedGoals=false;

  const postRaid=document.createElement('section');
  postRaid.className='next-raid-post';
  postRaid.innerHTML='<div id="nextRaidPostContent"></div>';
  closeButton.before(postRaid);
  const postContent=postRaid.querySelector('#nextRaidPostContent');

  const correction=document.createElement('details');
  correction.className='next-raid-correction';
  correction.innerHTML='<summary></summary><div class="next-raid-correction-body"></div>';
  closeButton.before(correction);
  const correctionSummary=correction.querySelector('summary');
  const correctionBody=correction.querySelector('.next-raid-correction-body');

  let postMode='idle';
  let receipt='';

  function activeCounts(){
    let workshopCount=0,questCount=0;
    if(typeof goals!=='undefined'&&Array.isArray(goals)&&typeof active!=='undefined'){
      goals.forEach(g=>(g.levels||[]).forEach(l=>{if(active[`${g.id}:${l.level}`])workshopCount++;}));
    }
    if(typeof quests!=='undefined'&&Array.isArray(quests)&&typeof getQuestState==='function'){
      questCount=quests.filter(q=>getQuestState(q.id)==='active').length;
    }
    return {workshopCount,questCount,total:workshopCount+questCount};
  }

  function renderGoalQuick(){
    const c=copy();
    const counts=activeCounts();
    goalQuickTitle.textContent=c.goalsTitle;
    goalQuickStatus.textContent=`${counts.total} ${c.active}`;
    if(counts.total===0&&!autoOpenedGoals){goalQuick.open=true;autoOpenedGoals=true;}

    const workshopGroups=(typeof goals!=='undefined'&&Array.isArray(goals))?goals:[];
    const workshopHtml=workshopGroups.length?workshopGroups.map(g=>{
      const gName=typeof goalName==='function'?goalName(g):(g.de||g.en||g.id);
      const levels=(g.levels||[]).map(l=>{
        const k=`${g.id}:${l.level}`;
        const checked=typeof active!=='undefined'&&!!active[k];
        return `<label class="quick-goal-level"><input type="checkbox" data-quick-goal-key="${esc(k)}" ${checked?'checked':''}><span>${esc((typeof tr==='function'?tr('level'):'Level')+' '+l.level)}</span></label>`;
      }).join('');
      return `<div class="quick-goal-group"><strong>${esc(gName)}</strong><div>${levels}</div></div>`;
    }).join(''):`<div class="next-raid-empty">${esc(c.noWorkshop)}</div>`;

    const allQuests=(typeof quests!=='undefined'&&Array.isArray(quests))?quests:[];
    const qState=id=>typeof getQuestState==='function'?getQuestState(id):'open';
    const qName=q=>typeof questName==='function'?questName(q):String(q?.id||'').replaceAll('_',' ');
    const activeQuests=allQuests.filter(q=>qState(q.id)==='active');
    const openQuests=allQuests.filter(q=>qState(q.id)==='open');
    const activeQuestHtml=activeQuests.length?activeQuests.map(q=>`<div class="quick-active-quest"><span>${esc(qName(q))}</span><button type="button" data-quick-quest-remove="${esc(q.id)}">${esc(c.deactivate)}</button></div>`).join(''):`<div class="quick-empty-line">${esc(c.noActiveQuest)}</div>`;
    const questAdd=openQuests.length?`<div class="quick-quest-add"><select data-quick-quest-select aria-label="${esc(c.chooseQuest)}"><option value="">${esc(c.chooseQuest)}</option>${openQuests.map(q=>`<option value="${esc(q.id)}">${esc(qName(q))}</option>`).join('')}</select><button type="button" data-quick-quest-add>${esc(c.addQuest)}</button></div>`:'';

    goalQuickBody.innerHTML=`<section><h4>${esc(c.workshopGoals)}</h4><div class="quick-workshop-list">${workshopHtml}</div></section><section><h4>${esc(c.questGoals)}</h4><div class="quick-active-quests">${activeQuestHtml}</div>${questAdd}</section>`;
  }

  function updateHeader(){
    const c=copy();
    const needs=openNeeds();
    const units=needs.reduce((sum,item)=>sum+item.missing,0);
    document.getElementById('nextRaidKicker').textContent=c.kicker;
    document.getElementById('nextRaidTitle').textContent=c.title;
    document.getElementById('nextRaidIntro').textContent=c.intro;
    summary.textContent=needs.length?`${needs.length} ${c.itemsOpen} · ${units} ${c.unitsOpen}`:c.noActiveNeed;
    action.textContent=drawer.open?c.close:c.open;
  }

  function renderPlan(){
    const c=copy();
    const needs=openNeeds();
    if(!needs.length){
      list.innerHTML=`<div class="next-raid-empty">${esc(c.empty)}</div>`;
      return;
    }
    list.innerHTML=`<div class="next-raid-list-label">${esc(c.autoList)}</div>${needs.map(item=>{
      const source=sourceLabel(item.id);
      return `<article class="next-raid-item${item.focused?' is-focus':''}" data-raid-id="${esc(item.id)}">
        <button type="button" class="next-raid-focus" data-focus-id="${esc(item.id)}" aria-pressed="${item.focused?'true':'false'}" aria-label="${esc(c.focus+': '+item.name)}">${item.focused?'★':'☆'}</button>
        <div class="next-raid-item-copy"><strong>${esc(item.name)}</strong><small>${source?esc(source):''}</small></div>
        <div class="next-raid-need"><span>${esc(c.stillNeed)}</span><strong>${item.missing}</strong></div>
      </article>`;
    }).join('')}`;
  }

  function render(){
    if(removeDoneButton)removeDoneButton.hidden=true;
    actions.hidden=true;
    clearButton.hidden=true;
    closeButton.textContent=language()==='de'?'RAID-LISTE SCHLIESSEN':'CLOSE RAID LIST';
    renderGoalQuick();
    renderPlan();
    renderPostRaid();
    renderCorrection();
    updateHeader();
    refreshFocusButtons();
  }

  function toggleFocus(id){
    const need=needFor(id);
    if(!need.active||need.missing<=0)return;
    if(raid[id])delete raid[id];else raid[id]={focus:true};
    saveRaid();render();
  }

  function refreshFocusButtons(){
    const c=copy();
    document.querySelectorAll('[data-next-raid-add]').forEach(button=>{
      const id=button.dataset.itemId;
      const need=needFor(id);
      if(!need.active||need.missing<=0){button.remove();return;}
      const focused=!!raid[id];
      button.textContent=focused?c.focusOn:c.focusOff;
      button.disabled=false;
      button.classList.toggle('is-saved',focused);
      button.dataset.focusExternal='';
    });
  }

  function decorate(){
    const c=copy();
    document.querySelectorAll('#summary [data-item-id]').forEach(row=>{
      const id=row.dataset.itemId;
      const need=needFor(id);
      if(!need.active||need.missing<=0)return;
      if(row.querySelector('[data-next-raid-add]'))return;
      const button=document.createElement('button');
      button.type='button';button.className='next-raid-add';button.dataset.nextRaidAdd='';button.dataset.itemId=id;
      button.textContent=raid[id]?c.focusOn:c.focusOff;
      row.querySelector('.summary-main')?.append(button);
    });
    document.querySelectorAll('#out .card[data-item-id]').forEach(card=>{
      const id=card.dataset.itemId;
      const need=needFor(id);
      const existing=card.querySelector('[data-next-raid-add]');
      if(!need.active||need.missing<=0){existing?.remove();return;}
      if(existing)return;
      const button=document.createElement('button');
      button.type='button';button.className='next-raid-add';button.dataset.nextRaidAdd='';button.dataset.itemId=id;
      button.textContent=raid[id]?c.focusOn:c.focusOff;
      card.append(button);
    });
    refreshFocusButtons();
  }

  function renderPostRaid(){
    const c=copy();
    const needs=openNeeds();
    if(postMode==='entry'){
      postContent.innerHTML=`<div class="post-raid-card post-raid-entry"><strong>${esc(c.whatBrought)}</strong><p>${esc(c.foundHint)}</p>
        <div class="loot-entry-list">${needs.map(item=>lootRow(item,c)).join('')}</div>
        <div class="post-raid-submit"><button type="button" data-post-action="nothing">${esc(c.nothing)}</button><button type="button" class="primary" data-post-action="apply">${esc(c.applyLoot)}</button></div>
        <button type="button" class="post-raid-cancel" data-post-action="cancel">${esc(c.cancel)}</button>
      </div>`;
      return;
    }
    const disabled=!needs.length;
    postContent.innerHTML=`${receipt?`<div class="post-raid-receipt">${esc(receipt)}</div>`:''}<button type="button" class="raid-finished" data-post-action="finish" ${disabled?'disabled':''}>${esc(c.raidDone)}</button>${disabled?`<p class="post-raid-muted">${esc(c.noActiveNeed)}</p>`:''}`;
  }

  function lootRow(item,c){
    return `<div class="loot-entry-row${item.focused?' is-focus':''}" data-loot-id="${esc(item.id)}">
      <div class="loot-entry-copy"><strong>${item.focused?'★ ':''}${esc(item.name)}</strong><small>${esc(c.stillNeed)}: ${item.missing}</small></div>
      <div class="loot-quick"><button type="button" data-loot-step="1">${esc(c.quick1)}</button><button type="button" data-loot-step="2">${esc(c.quick2)}</button><button type="button" data-loot-step="5">${esc(c.quick5)}</button></div>
      <div class="loot-stepper"><button type="button" data-loot-step="-1" aria-label="-1">−</button><input type="number" min="0" max="${item.missing}" inputmode="numeric" value="0" data-loot-input="${esc(item.id)}" aria-label="${esc(c.found+': '+item.name)}"><button type="button" data-loot-step="1" aria-label="+1">＋</button></div>
    </div>`;
  }

  function renderCorrection(){
    const c=copy();
    correctionSummary.textContent=c.correctionTitle;
    const all=Object.entries(reqMap()).map(([id])=>({id,name:displayName(id),...needFor(id)})).filter(x=>x.active).sort((a,b)=>a.name.localeCompare(b.name,language()==='de'?'de':'en'));
    correctionBody.innerHTML=`<p>${esc(c.correctionHelp)}</p>${all.length?`<div class="correction-list">${all.map(item=>`<label><span><strong>${esc(item.name)}</strong><small>${esc(c.stillNeed)}: ${item.missing} / ${item.total}</small></span><input type="number" min="0" max="${item.total}" inputmode="numeric" value="${item.have}" data-correct-id="${esc(item.id)}" aria-label="${esc(c.correctNow+': '+item.name)}"></label>`).join('')}</div>`:`<div class="next-raid-empty">${esc(c.correctionEmpty)}</div>`}`;
  }

  function setProgress(id,value){
    const req=reqMap()[id];
    if(!req)return;
    const total=Math.max(0,Number(req.total)||0);
    const val=Math.max(0,Math.min(total,Number(value)||0));
    const progress=progressObject();
    progress[id]=val;
    localStorage.setItem(PROGRESS_KEY,JSON.stringify(progress));
    if(typeof drawSummary==='function')drawSummary();
    if(typeof drawItems==='function')drawItems();
  }

  function applyLoot(){
    const c=copy();
    const inputs=[...postContent.querySelectorAll('[data-loot-input]')];
    const progress=progressObject();
    let units=0,ignored=0,changed=0;
    inputs.forEach(input=>{
      const id=input.dataset.lootInput;
      const entered=Math.max(0,Number(input.value)||0);
      if(!entered)return;
      const need=needFor(id);
      if(!need.active||need.missing<=0)return;
      const credited=Math.min(entered,need.missing);
      const excess=Math.max(0,entered-credited);
      progress[id]=need.have+credited;
      units+=credited;ignored+=excess;changed+=credited>0?1:0;
      if(need.missing-credited<=0&&raid[id])delete raid[id];
    });
    localStorage.setItem(PROGRESS_KEY,JSON.stringify(progress));
    saveRaid();
    if(typeof drawSummary==='function')drawSummary();
    if(typeof drawItems==='function')drawItems();
    receipt=changed?`${c.receiptPrefix} ${units} ${c.receiptUnits}${ignored?`. ${c.ignoredPrefix} ${ignored} ${c.ignoredSuffix}`:''}`:c.receiptNone;
    postMode='idle';
    render();decorate();
  }

  function noLoot(){
    receipt=copy().receiptNone;
    postMode='idle';
    render();
  }

  document.addEventListener('click',event=>{
    const externalFocus=event.target.closest('[data-next-raid-add]');
    if(externalFocus){toggleFocus(externalFocus.dataset.itemId);return;}
    const focusButton=event.target.closest('[data-focus-id]');
    if(focusButton){toggleFocus(focusButton.dataset.focusId);return;}

    const postAction=event.target.closest('[data-post-action]');
    if(postAction){
      const actionName=postAction.dataset.postAction;
      if(actionName==='finish'){receipt='';postMode='entry';renderPostRaid();}
      if(actionName==='nothing')noLoot();
      if(actionName==='cancel'){postMode='idle';renderPostRaid();}
      if(actionName==='apply')applyLoot();
      return;
    }

    const step=event.target.closest('[data-loot-step]');
    if(step){
      const row=step.closest('[data-loot-id]');
      const input=row?.querySelector('[data-loot-input]');
      if(!input)return;
      const max=Math.max(0,Number(input.max)||9999);
      input.value=String(Math.max(0,Math.min(max,(Number(input.value)||0)+Number(step.dataset.lootStep||0))));
      return;
    }

    const removeQuest=event.target.closest('[data-quick-quest-remove]');
    if(removeQuest&&typeof setQuestState==='function'){
      setQuestState(removeQuest.dataset.quickQuestRemove,'open');
      setTimeout(()=>{render();decorate();},0);return;
    }
    const addQuestButton=event.target.closest('[data-quick-quest-add]');
    if(addQuestButton&&typeof setQuestState==='function'){
      const select=goalQuickBody.querySelector('[data-quick-quest-select]');
      if(select?.value){setQuestState(select.value,'active');setTimeout(()=>{render();decorate();},0);}return;
    }
  });

  goalQuickBody.addEventListener('change',event=>{
    const goalInput=event.target.closest('[data-quick-goal-key]');
    if(goalInput){
      if(typeof toggleGoal==='function')toggleGoal(goalInput.dataset.quickGoalKey,goalInput.checked);
      else if(typeof active!=='undefined'){
        if(goalInput.checked)active[goalInput.dataset.quickGoalKey]=true;else delete active[goalInput.dataset.quickGoalKey];
        localStorage.setItem('arcActiveGoals',JSON.stringify(active));
      }
      setTimeout(()=>{render();decorate();},0);
    }
  });

  postContent.addEventListener('change',event=>{
    const input=event.target.closest('[data-loot-input]');
    if(!input)return;
    const max=Math.max(0,Number(input.max)||0);
    input.value=String(Math.max(0,Math.min(max,Number(input.value)||0)));
  });

  correctionBody.addEventListener('change',event=>{
    const input=event.target.closest('[data-correct-id]');
    if(!input)return;
    setProgress(input.dataset.correctId,input.value);
    const need=needFor(input.dataset.correctId);
    if(need.missing<=0&&raid[input.dataset.correctId]){delete raid[input.dataset.correctId];saveRaid();}
    render();decorate();
  });

  closeButton.addEventListener('click',()=>{
    postMode='idle';drawer.open=false;
    drawer.scrollIntoView({behavior:'smooth',block:'start'});
    drawer.querySelector(':scope > summary')?.focus({preventScroll:true});
  });
  drawer.addEventListener('toggle',updateHeader);
  document.getElementById('deBtn')?.addEventListener('click',()=>setTimeout(()=>{render();decorate();},0));
  document.getElementById('enBtn')?.addEventListener('click',()=>setTimeout(()=>{render();decorate();},0));

  const observer=new MutationObserver(()=>{render();decorate();});
  const summaryRoot=document.getElementById('summary');
  const searchRoot=document.getElementById('out');
  const questRoot=document.getElementById('questsList');
  if(summaryRoot)observer.observe(summaryRoot,{childList:true,subtree:true});
  if(searchRoot)observer.observe(searchRoot,{childList:true,subtree:true});
  if(questRoot)observer.observe(questRoot,{childList:true,subtree:true});
  render();decorate();
})();
