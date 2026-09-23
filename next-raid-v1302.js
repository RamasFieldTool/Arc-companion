// V13.0.3 test — next raid loop: plan -> play -> log relevant loot -> update remaining need.
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
      kicker:'RUN PLAN // PERSÖNLICH',title:'MEIN NÄCHSTER RAID',emptySummary:'Noch keine Fokus-Items gewählt',
      intro:'Plane nur, was du für deine aktiven Ziele suchen willst. Nach dem Raid trägst du ausschließlich relevante Funde ein – kein komplettes Inventar.',
      open:'ÖFFNEN',close:'SCHLIESSEN',items:'Fokus-Items',
      own:'EIGENE LISTE',workshop:'WERKBANK',quest:'QUEST',both:'QUEST + WERKBANK',
      nextRaid:'NÄCHSTER RAID',stillNeed:'Noch benötigt',goalProgress:'Für Ziele verfügbar',
      add:'＋ NÄCHSTER RAID',saved:'✓ GEMERKT',empty:'Noch ist nichts für den nächsten Raid vorgemerkt.',
      remove:'Item entfernen',clear:'LISTE LEEREN',closeList:'RAID-LISTE SCHLIESSEN',clearConfirm:'Die komplette Raid-Liste wirklich leeren?',
      raidDone:'✓ RAID BEENDET',noActiveNeed:'Aktuell gibt es keinen offenen Itembedarf aus aktiven Zielen oder Quests.',
      foundQuestion:'Hast du etwas aus deinem aktuellen Bedarf mitgebracht?',foundHint:'Nur Beute eintragen, die du erfolgreich aus dem Raid mitgebracht hast.',
      no:'NEIN',yes:'JA',whatBrought:'Was hast du mitgebracht?',focusFirst:'Deine Fokus-Items',otherNeeds:'Weitere benötigte Items',
      noneFocus:'Von deinen Fokus-Items ist aktuell nichts mehr offen.',applyLoot:'FUNDE ÜBERNEHMEN',cancel:'ABBRECHEN',found:'gefunden',
      receiptNone:'Keine Funde eingetragen.',receiptPrefix:'Übernommen:',receiptUnits:'Einheiten für aktive Ziele',ignoredPrefix:'Nicht gezählt:',ignoredSuffix:'über dem aktuellen Bedarf – wir führen bewusst kein Lagerinventar.',
      correctionTitle:'Sammelstand korrigieren',correctionHelp:'Nur falls Materialien im Spiel anderweitig verbraucht, abgegeben oder falsch eingetragen wurden. Hier steht nicht dein komplettes Lager, sondern nur der für aktive Ziele verfügbare Stand.',
      correctionEmpty:'Kein aktiver Itembedarf.',correctNow:'Für Ziele verfügbar',personalOnly:'Kein aktiver Bedarf – nur ältere/persönliche Vormerkung',
      removeLegacy:'Dieses Item zählt nicht zum aktuellen Bedarf. Du kannst es aus der Raid-Liste entfernen.'
    },
    en:{
      kicker:'RUN PLAN // PERSONAL',title:'MY NEXT RAID',emptySummary:'No focus items selected yet',
      intro:'Plan only what you need for active goals. After a raid, log relevant loot only – not your whole inventory.',
      open:'OPEN',close:'CLOSE',items:'focus items',
      own:'PERSONAL LIST',workshop:'WORKSHOP',quest:'QUEST',both:'QUEST + WORKSHOP',
      nextRaid:'NEXT RAID',stillNeed:'Still needed',goalProgress:'Available for goals',
      add:'＋ NEXT RAID',saved:'✓ SAVED',empty:'Nothing is pinned for the next raid yet.',
      remove:'Remove item',clear:'CLEAR LIST',closeList:'CLOSE RAID LIST',clearConfirm:'Clear the entire raid list?',
      raidDone:'✓ RAID FINISHED',noActiveNeed:'There is currently no open item need from active goals or quests.',
      foundQuestion:'Did you bring back anything from your current needs?',foundHint:'Only enter loot you successfully brought out of the raid.',
      no:'NO',yes:'YES',whatBrought:'What did you bring back?',focusFirst:'Your focus items',otherNeeds:'Other needed items',
      noneFocus:'None of your focus items are currently still needed.',applyLoot:'APPLY LOOT',cancel:'CANCEL',found:'found',
      receiptNone:'No loot entered.',receiptPrefix:'Applied:',receiptUnits:'units toward active goals',ignoredPrefix:'Not counted:',ignoredSuffix:'above the current need – this tool intentionally does not track your full inventory.',
      correctionTitle:'Correct collected progress',correctionHelp:'Use this only if materials were spent elsewhere, handed in, or entered incorrectly. This is not your whole stash; it is only the amount available for active goals.',
      correctionEmpty:'No active item need.',correctNow:'Available for goals',personalOnly:'No active need – older/personal reminder only',
      removeLegacy:'This item is not part of the current need. You can remove it from the raid list.'
    }
  };

  let raid={};
  try{
    const stored=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');
    if(stored&&typeof stored==='object'&&!Array.isArray(stored)){
      Object.entries(stored).forEach(([id,entry])=>{
        if(entry&&typeof entry==='object') raid[id]={target:Math.max(1,Number(entry.target)||1)};
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
  const entries=()=>Object.entries(raid).filter(([,entry])=>entry&&typeof entry==='object');
  const reqMap=()=>typeof requirementMap==='function'?(requirementMap()||{}):{};
  const progressObject=()=>{
    if(typeof owned!=='undefined'&&owned&&typeof owned==='object') return owned;
    try{return JSON.parse(localStorage.getItem(PROGRESS_KEY)||'{}')||{}}catch{return {}}
  };
  const needFor=id=>{
    const req=reqMap()[id];
    if(!req) return {active:false,total:0,have:0,missing:0,reasons:[]};
    const have=Math.max(0,Number(progressObject()[id])||0);
    const total=Math.max(0,Number(req.total)||0);
    return {active:true,total,have:Math.min(have,total),missing:Math.max(0,total-have),reasons:req.reasons||[]};
  };

  function sourceLabel(id){
    const c=copy();
    const reasons=reqMap()?.[id]?.reasons||[];
    if(!reasons.length)return c.own;
    const questPrefix=typeof tr==='function'?`${tr('questReason')} –`:'';
    const hasQuest=!!questPrefix&&reasons.some(reason=>String(reason).startsWith(questPrefix));
    const hasWorkshop=reasons.some(reason=>!questPrefix||!String(reason).startsWith(questPrefix));
    if(hasQuest&&hasWorkshop)return c.both;
    return hasQuest?c.quest:c.workshop;
  }

  function saveRaid(){localStorage.setItem(STORAGE_KEY,JSON.stringify(raid));}
  function saveProgress(){localStorage.setItem(PROGRESS_KEY,JSON.stringify(progressObject()));}

  // Add the post-raid workflow without changing the base HTML structure.
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

  function updateHeader(){
    const c=copy();
    const all=entries();
    document.getElementById('nextRaidKicker').textContent=c.kicker;
    document.getElementById('nextRaidTitle').textContent=c.title;
    document.getElementById('nextRaidIntro').textContent=c.intro;
    summary.textContent=all.length?`${all.length} ${c.items}`:c.emptySummary;
    action.textContent=drawer.open?c.close:c.open;
  }

  function render(){
    const c=copy();
    const all=entries().sort(([idA],[idB])=>displayName(idA).localeCompare(displayName(idB),language()==='de'?'de':'en'));
    updateHeader();
    if(removeDoneButton) removeDoneButton.hidden=true;
    clearButton.textContent=c.clear;
    closeButton.textContent=c.closeList;
    actions.hidden=!all.length;

    if(!all.length){
      list.innerHTML=`<div class="next-raid-empty">${esc(c.empty)}</div>`;
    }else{
      list.innerHTML=all.map(([id,entry])=>{
        const safeId=esc(id),name=displayName(id),need=needFor(id);
        let target=Math.max(1,Number(entry.target)||1);
        if(need.active&&need.missing>0) target=Math.min(target,need.missing);
        const meta=need.active
          ? `${c.stillNeed}: ${need.missing} · ${sourceLabel(id)}`
          : `${c.personalOnly}`;
        return `<article class="next-raid-item${!need.active?' is-legacy':''}" data-raid-id="${safeId}">
          <div class="next-raid-item-copy"><strong>${esc(name)}</strong><small>${esc(meta)}</small></div>
          <label class="next-raid-target"><span>${esc(c.nextRaid)}</span><input type="number" min="1" ${need.active?`max="${need.missing}"`:''} inputmode="numeric" value="${target}" data-raid-action="target" data-id="${safeId}" aria-label="${esc(c.nextRaid+': '+name)}"></label>
          <button class="next-raid-remove" type="button" data-raid-action="remove" data-id="${safeId}" aria-label="${esc(c.remove)}: ${esc(name)}">×</button>
        </article>`;
      }).join('');
    }
    renderPostRaid();
    renderCorrection();
    refreshAddButtons();
  }

  function addItem(id,quantity){
    if(!id)return;
    const need=needFor(id);
    const desired=Math.max(1,Number(quantity)||1);
    const target=need.active&&need.missing>0?Math.min(desired,need.missing):desired;
    if(!raid[id])raid[id]={target};
    saveRaid();render();
  }

  function refreshAddButtons(){
    const c=copy();
    document.querySelectorAll('[data-next-raid-add]').forEach(button=>{
      const id=button.dataset.itemId;
      const need=needFor(id);
      const saved=!!raid[id];
      if(!need.active||need.missing<=0){button.remove();return;}
      const label=saved?c.saved:c.add;
      if(button.textContent!==label)button.textContent=label;
      button.disabled=saved;
      button.classList.toggle('is-saved',saved);
    });
  }

  function decorate(){
    document.querySelectorAll('#summary [data-item-id]').forEach(row=>{
      const id=row.dataset.itemId;
      const need=needFor(id);
      if(!need.active||need.missing<=0)return;
      if(row.querySelector('[data-next-raid-add]'))return;
      const button=document.createElement('button');
      button.type='button';button.className='next-raid-add';button.dataset.nextRaidAdd='';
      button.dataset.itemId=id;button.dataset.quantity=String(need.missing);
      row.querySelector('.summary-main')?.append(button);
    });
    document.querySelectorAll('#out .card[data-item-id]').forEach(card=>{
      const id=card.dataset.itemId;
      const need=needFor(id);
      const existing=card.querySelector('[data-next-raid-add]');
      if(!need.active||need.missing<=0){existing?.remove();return;}
      if(existing)return;
      const button=document.createElement('button');
      button.type='button';button.className='next-raid-add';button.dataset.nextRaidAdd='';
      button.dataset.itemId=id;button.dataset.quantity=String(need.missing);
      card.append(button);
    });
    refreshAddButtons();
  }

  function openNeeds(){
    return Object.entries(reqMap()).map(([id,r])=>{
      const n=needFor(id);
      return {id,name:displayName(id),...n,reasons:r.reasons||[]};
    }).filter(x=>x.missing>0).sort((a,b)=>a.name.localeCompare(b.name,language()==='de'?'de':'en'));
  }

  function renderPostRaid(){
    const c=copy();
    const needs=openNeeds();
    if(postMode==='question'){
      postContent.innerHTML=`<div class="post-raid-card"><strong>${esc(c.foundQuestion)}</strong><p>${esc(c.foundHint)}</p><div class="post-raid-choice"><button type="button" data-post-action="no">${esc(c.no)}</button><button type="button" class="primary" data-post-action="yes">${esc(c.yes)}</button></div></div>`;
      return;
    }
    if(postMode==='entry'){
      const focusIds=new Set(entries().map(([id])=>id));
      const focus=needs.filter(x=>focusIds.has(x.id));
      const other=needs.filter(x=>!focusIds.has(x.id));
      const rows=arr=>arr.map(item=>lootRow(item,c)).join('');
      postContent.innerHTML=`<div class="post-raid-card post-raid-entry"><strong>${esc(c.whatBrought)}</strong><p>${esc(c.foundHint)}</p>
        <h4>${esc(c.focusFirst)}</h4>
        <div class="loot-entry-list">${focus.length?rows(focus):`<div class="next-raid-empty">${esc(c.noneFocus)}</div>`}</div>
        ${other.length?`<details class="other-needs"><summary>${esc(c.otherNeeds)} <span>${other.length}</span></summary><div class="loot-entry-list">${rows(other)}</div></details>`:''}
        <div class="post-raid-submit"><button type="button" data-post-action="cancel">${esc(c.cancel)}</button><button type="button" class="primary" data-post-action="apply">${esc(c.applyLoot)}</button></div>
      </div>`;
      return;
    }
    const disabled=!needs.length;
    postContent.innerHTML=`${receipt?`<div class="post-raid-receipt">${esc(receipt)}</div>`:''}<button type="button" class="raid-finished" data-post-action="finish" ${disabled?'disabled':''}>${esc(c.raidDone)}</button>${disabled?`<p class="post-raid-muted">${esc(c.noActiveNeed)}</p>`:''}`;
  }

  function lootRow(item,c){
    return `<div class="loot-entry-row" data-loot-id="${esc(item.id)}">
      <div><strong>${esc(item.name)}</strong><small>${esc(c.stillNeed)}: ${item.missing}</small></div>
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
      if(raid[id]){
        const left=Math.max(0,(Number(raid[id].target)||1)-credited);
        const newMissing=Math.max(0,need.missing-credited);
        if(left<=0||newMissing<=0) delete raid[id];
        else raid[id].target=Math.min(left,newMissing);
      }
    });
    localStorage.setItem(PROGRESS_KEY,JSON.stringify(progress));
    saveRaid();
    if(typeof drawSummary==='function')drawSummary();
    if(typeof drawItems==='function')drawItems();
    receipt=changed?`${c.receiptPrefix} ${units} ${c.receiptUnits}${ignored?`. ${c.ignoredPrefix} ${ignored} ${c.ignoredSuffix}`:''}`:c.receiptNone;
    postMode='idle';
    render();decorate();
  }

  document.addEventListener('click',event=>{
    const addButton=event.target.closest('[data-next-raid-add]');
    if(addButton){addItem(addButton.dataset.itemId,addButton.dataset.quantity);return;}
    const control=event.target.closest('[data-raid-action]');
    if(control&&raid[control.dataset.id]&&control.dataset.raidAction==='remove'){
      delete raid[control.dataset.id];saveRaid();render();return;
    }
    const postAction=event.target.closest('[data-post-action]');
    if(postAction){
      const actionName=postAction.dataset.postAction;
      if(actionName==='finish'){receipt='';postMode='question';renderPostRaid();}
      if(actionName==='no'){receipt=copy().receiptNone;postMode='idle';renderPostRaid();}
      if(actionName==='yes'){postMode='entry';renderPostRaid();}
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
    }
  });

  list.addEventListener('change',event=>{
    const control=event.target.closest('[data-raid-action]');
    if(!control||!raid[control.dataset.id])return;
    if(control.dataset.raidAction==='target'){
      const need=needFor(control.dataset.id);
      let target=Math.max(1,Number(control.value)||1);
      if(need.active&&need.missing>0)target=Math.min(target,need.missing);
      raid[control.dataset.id].target=target;control.value=String(target);saveRaid();render();
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

  clearButton.addEventListener('click',()=>{
    if(!entries().length||!window.confirm(copy().clearConfirm))return;
    raid={};saveRaid();render();
  });
  closeButton.addEventListener('click',()=>{
    postMode='idle';drawer.open=false;
    drawer.scrollIntoView({behavior:'smooth',block:'start'});
    drawer.querySelector(':scope > summary')?.focus({preventScroll:true});
  });
  drawer.addEventListener('toggle',updateHeader);
  document.getElementById('deBtn')?.addEventListener('click',()=>setTimeout(()=>{render();decorate()},0));
  document.getElementById('enBtn')?.addEventListener('click',()=>setTimeout(()=>{render();decorate()},0));

  const observer=new MutationObserver(()=>{decorate();render();});
  const summaryRoot=document.getElementById('summary');
  const searchRoot=document.getElementById('out');
  if(summaryRoot)observer.observe(summaryRoot,{childList:true,subtree:true});
  if(searchRoot)observer.observe(searchRoot,{childList:true,subtree:true});
  render();decorate();
})();
