// V13.0.8 test — next-raid checklist + post-raid findings workflow.
(()=>{
  const drawer=document.getElementById('nextRaidDrawer');
  const list=document.getElementById('nextRaidList');
  const summary=document.getElementById('nextRaidSummary');
  const action=document.getElementById('nextRaidAction');
  const actions=document.getElementById('nextRaidActions');
  const closeButton=document.getElementById('nextRaidClose');
  const removeDoneButton=document.getElementById('nextRaidRemoveDone');
  const clearButton=document.getElementById('nextRaidClear');
  if(!drawer||!list||!summary||!action||!actions||!closeButton||!removeDoneButton||!clearButton)return;

  if(!document.querySelector('link[data-next-raid-post-style]')){
    const stylesheet=document.createElement('link');
    stylesheet.rel='stylesheet';
    stylesheet.href='next-raid-post-v1308.css?v=1308';
    stylesheet.dataset.nextRaidPostStyle='';
    document.head.append(stylesheet);
  }

  const STORAGE_KEY='arcNextRaid';
  const MAX_COUNT=999999;
  const COPY={
    de:{
      kicker:'RUN PLAN // PERSÖNLICH',title:'MEIN NÄCHSTER RAID',emptySummary:'Noch keine Items gemerkt',
      intro:'Merke Items aus dem Gesamtbedarf oder der Suche und stelle deine kompakte Liste für den nächsten Raid zusammen.',
      open:'ÖFFNEN',close:'SCHLIESSEN',items:'Items',done:'erledigt',openState:'OFFEN',doneState:'ERLEDIGT',
      own:'EIGENE LISTE',workshop:'WERKBANK',quest:'QUEST',both:'QUEST + WERKBANK',
      quantity:'MENGE',add:'＋ NÄCHSTER RAID',saved:'✓ GEMERKT',empty:'Noch ist nichts auf deiner Raid-Liste.',
      remove:'Item entfernen',removeDone:'ERLEDIGTE ENTFERNEN',clear:'LISTE LEEREN',closeList:'RAID-LISTE SCHLIESSEN',
      clearConfirm:'Die komplette Raid-Liste wirklich leeren?',
      raidFinished:'RAID BEENDET',postTitle:'FUNDE EINTRAGEN',postIntro:'Trage nur relevante Funde ein. Angezeigt werden ausschließlich Items, die für deine aktuell aktiven Ziele noch fehlen.',
      needed:'fehlen',owned:'vorhanden',found:'GEFUNDEN',minus:'Menge verringern',plus:'Menge erhöhen',
      applyFinds:'FUNDE ÜBERNEHMEN',nothingFound:'NICHTS RELEVANTES GEFUNDEN',cancelFinds:'ABBRECHEN',
      noNeeds:'Für deine aktiven Ziele fehlt aktuell kein Item.',noAmounts:'Noch keine Fundmenge eingetragen.',
      appliedOne:'1 Fund übernommen.',appliedMany:'Funde übernommen.',nothingSaved:'Keine Funde eingetragen. Deine Bedarfe bleiben unverändert.',
      storageError:'Speichern auf diesem Gerät ist fehlgeschlagen.',surplus:'Überschuss wird als vorhandener Bestand behalten.'
    },
    en:{
      kicker:'RUN PLAN // PERSONAL',title:'MY NEXT RAID',emptySummary:'No saved items yet',
      intro:'Save items from Total Needs or Search and build a compact checklist for your next raid.',
      open:'OPEN',close:'CLOSE',items:'items',done:'done',openState:'OPEN',doneState:'DONE',
      own:'PERSONAL LIST',workshop:'WORKSHOP',quest:'QUEST',both:'QUEST + WORKSHOP',
      quantity:'AMOUNT',add:'＋ NEXT RAID',saved:'✓ SAVED',empty:'Your raid checklist is still empty.',
      remove:'Remove item',removeDone:'REMOVE COMPLETED',clear:'CLEAR LIST',closeList:'CLOSE RAID LIST',
      clearConfirm:'Clear the entire raid checklist?',
      raidFinished:'RAID FINISHED',postTitle:'LOG FINDINGS',postIntro:'Enter only relevant finds. This shows only items still missing for your currently active goals.',
      needed:'missing',owned:'owned',found:'FOUND',minus:'Decrease amount',plus:'Increase amount',
      applyFinds:'APPLY FINDINGS',nothingFound:'NO RELEVANT FINDS',cancelFinds:'CANCEL',
      noNeeds:'No items are currently missing for your active goals.',noAmounts:'No found amount entered yet.',
      appliedOne:'1 finding applied.',appliedMany:'findings applied.',nothingSaved:'No findings entered. Your requirements stay unchanged.',
      storageError:'Saving on this device failed.',surplus:'Any surplus is kept as owned stock.'
    }
  };

  const language=()=>typeof lang!=='undefined'&&lang==='en'?'en':'de';
  const copy=()=>COPY[language()];
  const escapeHtml=value=>String(value).replace(/[&<>"']/g,char=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  })[char]);
  const toCount=(value,fallback=0)=>{
    const number=Number(value);
    if(!Number.isFinite(number))return fallback;
    return Math.min(MAX_COUNT,Math.max(0,Math.floor(number)));
  };
  const hasOwn=(object,key)=>Object.prototype.hasOwnProperty.call(object,key);
  const itemFor=id=>typeof itemById==='function'?itemById(id):null;
  const displayName=id=>{
    const item=itemFor(id);
    return item&&typeof itemName==='function'?itemName(item):String(id).replaceAll('_',' ');
  };
  const currentOwned=id=>{
    if(typeof owned!=='undefined'&&owned&&typeof owned==='object')return toCount(owned[id],0);
    try{
      const stored=JSON.parse(localStorage.getItem('arcOwned')||'{}');
      return stored&&typeof stored==='object'?toCount(stored[id],0):0;
    }catch{return 0}
  };
  const currentRequirements=()=>typeof requirementMap==='function'?requirementMap():{};

  let raid=Object.create(null);
  try{
    const stored=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');
    if(stored&&typeof stored==='object'&&!Array.isArray(stored)){
      Object.entries(stored).forEach(([id,entry])=>{
        if(!id||!entry||typeof entry!=='object')return;
        raid[id]={target:Math.max(1,toCount(entry.target,1)),done:!!entry.done};
      });
    }
  }catch{raid=Object.create(null)}

  const entries=()=>Object.entries(raid).filter(([,entry])=>entry&&typeof entry==='object');

  function sourceLabel(id){
    const c=copy();
    const reasons=currentRequirements()?.[id]?.reasons||[];
    if(!reasons.length)return c.own;
    const questPrefix=typeof tr==='function'?`${tr('questReason')} –`:'';
    const hasQuest=!!questPrefix&&reasons.some(reason=>String(reason).startsWith(questPrefix));
    const hasWorkshop=reasons.some(reason=>!questPrefix||!String(reason).startsWith(questPrefix));
    if(hasQuest&&hasWorkshop)return c.both;
    return hasQuest?c.quest:c.workshop;
  }

  function save(){
    try{
      localStorage.setItem(STORAGE_KEY,JSON.stringify(raid));
      return true;
    }catch{
      setPostStatus(copy().storageError,'error');
      return false;
    }
  }

  function updateHeader(){
    const c=copy();
    const all=entries();
    const completed=all.filter(([,entry])=>!!entry.done).length;
    document.getElementById('nextRaidKicker').textContent=c.kicker;
    document.getElementById('nextRaidTitle').textContent=c.title;
    document.getElementById('nextRaidIntro').textContent=c.intro;
    summary.textContent=all.length?`${all.length} ${c.items} · ${completed} ${c.done}`:c.emptySummary;
    action.textContent=drawer.open?c.close:c.open;
  }

  function render(){
    const c=copy();
    const all=entries().sort(([idA,a],[idB,b])=>{
      if(!!a.done!==!!b.done)return a.done?1:-1;
      return displayName(idA).localeCompare(displayName(idB),language()==='de'?'de':'en');
    });
    updateHeader();
    removeDoneButton.textContent=c.removeDone;
    clearButton.textContent=c.clear;
    closeButton.textContent=c.closeList;
    actions.hidden=!all.length;
    removeDoneButton.disabled=!all.some(([,entry])=>entry.done);
    if(postRaidButton)postRaidButton.hidden=!all.length;

    if(!all.length){
      list.innerHTML=`<div class="next-raid-empty">${escapeHtml(c.empty)}</div>`;
      closePostRaid();
      refreshAddButtons();
      return;
    }

    list.innerHTML=all.map(([id,entry])=>{
      const safeId=escapeHtml(id);
      const target=entry.done?toCount(entry.target,0):Math.max(1,toCount(entry.target,1));
      const name=displayName(id);
      return `<article class="next-raid-item${entry.done?' is-done':''}" data-raid-id="${safeId}">
        <label class="next-raid-check">
          <input type="checkbox" data-raid-action="done" data-id="${safeId}" ${entry.done?'checked':''} aria-label="${escapeHtml(c.done)}: ${escapeHtml(name)}">
          <span aria-hidden="true">✓</span>
        </label>
        <div class="next-raid-item-copy"><strong>${escapeHtml(name)}</strong><small>${escapeHtml(sourceLabel(id))} · ${entry.done?c.doneState:c.openState}</small></div>
        <label class="next-raid-target"><span>${escapeHtml(c.quantity)}</span><input type="number" min="${entry.done?'0':'1'}" max="${MAX_COUNT}" step="1" inputmode="numeric" value="${target}" data-raid-action="target" data-id="${safeId}" aria-label="${escapeHtml(c.quantity)}: ${escapeHtml(name)}"></label>
        <button class="next-raid-remove" type="button" data-raid-action="remove" data-id="${safeId}" aria-label="${escapeHtml(c.remove)}: ${escapeHtml(name)}">×</button>
      </article>`;
    }).join('');
    refreshAddButtons();
  }

  function addItem(id,quantity){
    if(!id)return;
    if(!hasOwn(raid,id))raid[id]={target:Math.max(1,toCount(quantity,1)),done:false};
    save();render();
  }

  function refreshAddButtons(){
    const c=copy();
    document.querySelectorAll('[data-next-raid-add]').forEach(button=>{
      const saved=hasOwn(raid,button.dataset.itemId);
      const label=saved?c.saved:c.add;
      if(button.textContent!==label)button.textContent=label;
      if(button.disabled!==saved)button.disabled=saved;
      button.classList.toggle('is-saved',saved);
    });
  }

  function decorate(){
    document.querySelectorAll('#summary [data-item-id]').forEach(row=>{
      if(row.querySelector('[data-next-raid-add]'))return;
      const missing=toCount(row.dataset.missing,0);
      if(!missing)return;
      const button=document.createElement('button');
      button.type='button';button.className='next-raid-add';button.dataset.nextRaidAdd='';
      button.dataset.itemId=row.dataset.itemId;button.dataset.quantity=String(missing);
      row.querySelector('.summary-main')?.append(button);
    });
    document.querySelectorAll('#out .card[data-item-id]').forEach(card=>{
      if(card.querySelector('[data-next-raid-add]'))return;
      const button=document.createElement('button');
      button.type='button';button.className='next-raid-add';button.dataset.nextRaidAdd='';
      button.dataset.itemId=card.dataset.itemId;button.dataset.quantity='1';
      card.append(button);
    });
    refreshAddButtons();
  }

  // Post-raid UI is injected here so the existing HTML stays untouched while this remains a test-branch feature.
  const postRaidButton=document.createElement('button');
  postRaidButton.id='nextRaidFinished';
  postRaidButton.className='next-raid-finished';
  postRaidButton.type='button';

  const postRaidPanel=document.createElement('section');
  postRaidPanel.id='nextRaidPostPanel';
  postRaidPanel.className='next-raid-post';
  postRaidPanel.hidden=true;
  postRaidPanel.innerHTML=`
    <div class="next-raid-post-head"><div><strong id="nextRaidPostTitle"></strong><p id="nextRaidPostIntro"></p></div><button id="nextRaidPostCancelTop" type="button" aria-label="Close">×</button></div>
    <div id="nextRaidPostList" class="next-raid-post-list"></div>
    <div id="nextRaidPostStatus" class="next-raid-post-status" role="status" aria-live="polite"></div>
    <div class="next-raid-post-actions"><button id="nextRaidApplyFinds" type="button"></button><button id="nextRaidNothingFound" type="button"></button><button id="nextRaidPostCancel" type="button"></button></div>`;

  actions.parentNode.insertBefore(postRaidButton,actions);
  actions.parentNode.insertBefore(postRaidPanel,actions);
  const postRaidList=postRaidPanel.querySelector('#nextRaidPostList');
  const postRaidStatus=postRaidPanel.querySelector('#nextRaidPostStatus');
  const applyFindsButton=postRaidPanel.querySelector('#nextRaidApplyFinds');
  const nothingFoundButton=postRaidPanel.querySelector('#nextRaidNothingFound');
  const cancelPostButton=postRaidPanel.querySelector('#nextRaidPostCancel');
  const cancelPostTopButton=postRaidPanel.querySelector('#nextRaidPostCancelTop');

  function setPostStatus(message,type=''){
    if(!postRaidStatus)return;
    postRaidStatus.textContent=message||'';
    postRaidStatus.dataset.type=type;
  }

  function missingRequirementRows(){
    const req=currentRequirements();
    return Object.entries(req).map(([id,info])=>{
      const total=toCount(info?.total,0);
      const have=currentOwned(id);
      return {id,total,have,missing:Math.max(0,total-have),reasons:Array.isArray(info?.reasons)?info.reasons:[]};
    }).filter(row=>row.missing>0).sort((a,b)=>displayName(a.id).localeCompare(displayName(b.id),language()==='de'?'de':'en'));
  }

  function capturePendingFinds(){
    const pending=Object.create(null);
    if(!postRaidList)return pending;
    postRaidList.querySelectorAll('[data-found-input]').forEach(input=>{
      pending[input.dataset.id]=toCount(input.value,0);
    });
    return pending;
  }

  function renderPostRaid(resetAmounts=false){
    const c=copy();
    const pending=resetAmounts?Object.create(null):capturePendingFinds();
    postRaidButton.textContent=c.raidFinished;
    postRaidPanel.querySelector('#nextRaidPostTitle').textContent=c.postTitle;
    postRaidPanel.querySelector('#nextRaidPostIntro').textContent=c.postIntro;
    applyFindsButton.textContent=c.applyFinds;
    nothingFoundButton.textContent=c.nothingFound;
    cancelPostButton.textContent=c.cancelFinds;

    const rows=missingRequirementRows();
    if(!rows.length){
      postRaidList.innerHTML=`<div class="next-raid-post-empty">${escapeHtml(c.noNeeds)}</div>`;
      applyFindsButton.disabled=true;
      nothingFoundButton.disabled=true;
      return;
    }
    applyFindsButton.disabled=false;
    nothingFoundButton.disabled=false;
    postRaidList.innerHTML=rows.map(row=>{
      const id=escapeHtml(row.id);
      const name=escapeHtml(displayName(row.id));
      return `<article class="next-raid-found-row" data-found-id="${id}">
        <div class="next-raid-found-copy"><strong>${name}</strong><small>${escapeHtml(c.needed)} ${row.missing} · ${escapeHtml(c.owned)} ${row.have}</small></div>
        <div class="next-raid-found-control" role="group" aria-label="${escapeHtml(c.found)}: ${name}">
          <button type="button" data-found-step="-1" data-id="${id}" aria-label="${escapeHtml(c.minus)}: ${name}">−</button>
          <label><span>${escapeHtml(c.found)}</span><input type="number" min="0" max="${MAX_COUNT}" step="1" inputmode="numeric" value="${hasOwn(pending,row.id)?pending[row.id]:0}" data-found-input data-id="${id}" aria-label="${escapeHtml(c.found)}: ${name}"></label>
          <button type="button" data-found-step="1" data-id="${id}" aria-label="${escapeHtml(c.plus)}: ${name}">+</button>
        </div>
      </article>`;
    }).join('');
  }

  function openPostRaid(){
    renderPostRaid(true);
    setPostStatus('');
    postRaidPanel.hidden=false;
    postRaidButton.setAttribute('aria-expanded','true');
    postRaidPanel.querySelector('input[data-found-input]')?.focus({preventScroll:true});
    postRaidPanel.scrollIntoView({behavior:'smooth',block:'nearest'});
  }

  function closePostRaid(){
    if(!postRaidPanel||postRaidPanel.hidden)return;
    postRaidPanel.hidden=true;
    postRaidButton?.setAttribute('aria-expanded','false');
    setPostStatus('');
  }

  function syncRaidToCurrentNeeds(){
    const req=currentRequirements();
    entries().forEach(([id,entry])=>{
      const info=req[id];
      if(!info)return; // Keep purely personal items untouched.
      const remaining=Math.max(0,toCount(info.total,0)-currentOwned(id));
      if(remaining===0){
        entry.target=0;
        entry.done=true;
      }else{
        entry.target=remaining;
        entry.done=false;
      }
    });
  }

  function applyFindings(){
    const c=copy();
    const inputs=[...postRaidList.querySelectorAll('[data-found-input]')];
    const updates=inputs.map(input=>({id:input.dataset.id,count:toCount(input.value,0)})).filter(update=>update.count>0);
    if(!updates.length){
      setPostStatus(c.noAmounts,'warn');
      return;
    }

    try{
      if(typeof owned!=='undefined'&&owned&&typeof owned==='object'){
        const nextOwned={...owned};
        updates.forEach(({id,count})=>{nextOwned[id]=toCount(currentOwned(id)+count,0)});
        localStorage.setItem('arcOwned',JSON.stringify(nextOwned));
        updates.forEach(({id})=>{owned[id]=nextOwned[id]});
        if(typeof drawSummary==='function')drawSummary();
        if(typeof drawItems==='function')drawItems();
      }else if(typeof saveOwned==='function'){
        updates.forEach(({id,count})=>saveOwned(id,currentOwned(id)+count));
      }else{
        const stored=JSON.parse(localStorage.getItem('arcOwned')||'{}');
        const next=stored&&typeof stored==='object'&&!Array.isArray(stored)?stored:{};
        updates.forEach(({id,count})=>{next[id]=toCount(toCount(next[id],0)+count,0)});
        localStorage.setItem('arcOwned',JSON.stringify(next));
        if(typeof drawSummary==='function')drawSummary();
        if(typeof drawItems==='function')drawItems();
      }
    }catch{
      setPostStatus(c.storageError,'error');
      return;
    }

    syncRaidToCurrentNeeds();
    const raidSaved=save();
    render();
    renderPostRaid(true);
    if(!raidSaved){
      setPostStatus(c.storageError,'error');
      return;
    }
    setPostStatus(`${updates.length===1?c.appliedOne:`${updates.length} ${c.appliedMany}`} ${c.surplus}`,'success');
  }

  function changeFound(id,delta){
    const input=[...postRaidList.querySelectorAll('[data-found-input]')].find(el=>el.dataset.id===id);
    if(!input)return;
    input.value=String(toCount(toCount(input.value,0)+delta,0));
  }

  document.addEventListener('click',event=>{
    const addButton=event.target.closest('[data-next-raid-add]');
    if(addButton){addItem(addButton.dataset.itemId,addButton.dataset.quantity);return}
    const control=event.target.closest('[data-raid-action]');
    if(!control||!hasOwn(raid,control.dataset.id))return;
    if(control.dataset.raidAction==='remove'){
      delete raid[control.dataset.id];save();render();
    }
  });
  list.addEventListener('change',event=>{
    const control=event.target.closest('[data-raid-action]');
    if(!control||!hasOwn(raid,control.dataset.id))return;
    if(control.dataset.raidAction==='done')raid[control.dataset.id].done=control.checked;
    if(control.dataset.raidAction==='target'){
      const target=Math.max(control.closest('.next-raid-item')?.classList.contains('is-done')?0:1,toCount(control.value,1));
      raid[control.dataset.id].target=target;control.value=String(target);
    }
    save();render();
  });
  removeDoneButton.addEventListener('click',()=>{
    entries().forEach(([id,entry])=>{if(entry.done)delete raid[id]});
    save();render();
  });
  clearButton.addEventListener('click',()=>{
    if(!entries().length||!window.confirm(copy().clearConfirm))return;
    raid=Object.create(null);save();render();
  });
  closeButton.addEventListener('click',()=>{
    closePostRaid();
    drawer.open=false;
    drawer.scrollIntoView({behavior:'smooth',block:'start'});
    drawer.querySelector(':scope > summary')?.focus({preventScroll:true});
  });
  postRaidButton.addEventListener('click',()=>postRaidPanel.hidden?openPostRaid():closePostRaid());
  postRaidList.addEventListener('click',event=>{
    const step=event.target.closest('[data-found-step]');
    if(!step)return;
    changeFound(step.dataset.id,Number(step.dataset.foundStep)||0);
  });
  postRaidList.addEventListener('change',event=>{
    const input=event.target.closest('[data-found-input]');
    if(!input)return;
    input.value=String(toCount(input.value,0));
  });
  applyFindsButton.addEventListener('click',applyFindings);
  nothingFoundButton.addEventListener('click',()=>{
    postRaidList.querySelectorAll('[data-found-input]').forEach(input=>{input.value='0'});
    closePostRaid();
  });
  cancelPostButton.addEventListener('click',closePostRaid);
  cancelPostTopButton.addEventListener('click',closePostRaid);

  drawer.addEventListener('toggle',()=>{
    updateHeader();
    if(!drawer.open)closePostRaid();
  });
  document.getElementById('deBtn')?.addEventListener('click',()=>setTimeout(()=>{render();decorate();if(!postRaidPanel.hidden)renderPostRaid()},0));
  document.getElementById('enBtn')?.addEventListener('click',()=>setTimeout(()=>{render();decorate();if(!postRaidPanel.hidden)renderPostRaid()},0));

  const observer=new MutationObserver(()=>{decorate();render();if(!postRaidPanel.hidden)renderPostRaid()});
  const summaryRoot=document.getElementById('summary');
  const searchRoot=document.getElementById('out');
  if(summaryRoot)observer.observe(summaryRoot,{childList:true,subtree:true});
  if(searchRoot)observer.observe(searchRoot,{childList:true,subtree:true});

  postRaidButton.setAttribute('aria-controls',postRaidPanel.id);
  postRaidButton.setAttribute('aria-expanded','false');
  render();decorate();renderPostRaid();
})();
