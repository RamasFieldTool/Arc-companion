// V13.0.2 test — personal next-raid checklist stored only on this device.
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

  const STORAGE_KEY='arcNextRaid';
  const COPY={
    de:{
      kicker:'RUN PLAN // PERSÖNLICH',title:'MEIN NÄCHSTER RAID',emptySummary:'Noch keine Items gemerkt',
      intro:'Merke Items aus dem Gesamtbedarf oder der Suche und stelle deine kompakte Liste für den nächsten Raid zusammen.',
      open:'ÖFFNEN',close:'SCHLIESSEN',items:'Items',done:'erledigt',openState:'OFFEN',doneState:'ERLEDIGT',
      own:'EIGENE LISTE',workshop:'WERKBANK',quest:'QUEST',both:'QUEST + WERKBANK',
      quantity:'MENGE',add:'＋ NÄCHSTER RAID',saved:'✓ GEMERKT',empty:'Noch ist nichts auf deiner Raid-Liste.',
      remove:'Item entfernen',removeDone:'ERLEDIGTE ENTFERNEN',clear:'LISTE LEEREN',closeList:'RAID-LISTE SCHLIESSEN',
      clearConfirm:'Die komplette Raid-Liste wirklich leeren?'
    },
    en:{
      kicker:'RUN PLAN // PERSONAL',title:'MY NEXT RAID',emptySummary:'No saved items yet',
      intro:'Save items from Total Needs or Search and build a compact checklist for your next raid.',
      open:'OPEN',close:'CLOSE',items:'items',done:'done',openState:'OPEN',doneState:'DONE',
      own:'PERSONAL LIST',workshop:'WORKSHOP',quest:'QUEST',both:'QUEST + WORKSHOP',
      quantity:'AMOUNT',add:'＋ NEXT RAID',saved:'✓ SAVED',empty:'Your raid checklist is still empty.',
      remove:'Remove item',removeDone:'REMOVE COMPLETED',clear:'CLEAR LIST',closeList:'CLOSE RAID LIST',
      clearConfirm:'Clear the entire raid checklist?'
    }
  };

  let raid={};
  try{
    const stored=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');
    if(stored&&typeof stored==='object'&&!Array.isArray(stored))raid=stored;
  }catch{raid={}}

  const language=()=>typeof lang!=='undefined'&&lang==='en'?'en':'de';
  const copy=()=>COPY[language()];
  const escapeHtml=value=>String(value).replace(/[&<>"']/g,char=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  })[char]);
  const itemFor=id=>typeof itemById==='function'?itemById(id):null;
  const displayName=id=>{
    const item=itemFor(id);
    return item&&typeof itemName==='function'?itemName(item):String(id).replaceAll('_',' ');
  };
  const entries=()=>Object.entries(raid).filter(([,entry])=>entry&&typeof entry==='object');

  function sourceLabel(id){
    const c=copy();
    if(typeof requirementMap!=='function')return c.own;
    const reasons=requirementMap()?.[id]?.reasons||[];
    if(!reasons.length)return c.own;
    const questPrefix=typeof tr==='function'?`${tr('questReason')} –`:'';
    const hasQuest=!!questPrefix&&reasons.some(reason=>String(reason).startsWith(questPrefix));
    const hasWorkshop=reasons.some(reason=>!questPrefix||!String(reason).startsWith(questPrefix));
    if(hasQuest&&hasWorkshop)return c.both;
    return hasQuest?c.quest:c.workshop;
  }

  function save(){
    localStorage.setItem(STORAGE_KEY,JSON.stringify(raid));
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

    if(!all.length){
      list.innerHTML=`<div class="next-raid-empty">${escapeHtml(c.empty)}</div>`;
      refreshAddButtons();
      return;
    }

    list.innerHTML=all.map(([id,entry])=>{
      const safeId=escapeHtml(id);
      const target=Math.max(1,Number(entry.target)||1);
      const name=displayName(id);
      return `<article class="next-raid-item${entry.done?' is-done':''}" data-raid-id="${safeId}">
        <label class="next-raid-check">
          <input type="checkbox" data-raid-action="done" data-id="${safeId}" ${entry.done?'checked':''} aria-label="${escapeHtml(c.done)}: ${escapeHtml(name)}">
          <span aria-hidden="true">✓</span>
        </label>
        <div class="next-raid-item-copy"><strong>${escapeHtml(name)}</strong><small>${sourceLabel(id)} · ${entry.done?c.doneState:c.openState}</small></div>
        <label class="next-raid-target"><span>${c.quantity}</span><input type="number" min="1" inputmode="numeric" value="${target}" data-raid-action="target" data-id="${safeId}" aria-label="${escapeHtml(c.quantity)}: ${escapeHtml(name)}"></label>
        <button class="next-raid-remove" type="button" data-raid-action="remove" data-id="${safeId}" aria-label="${escapeHtml(c.remove)}: ${escapeHtml(name)}">×</button>
      </article>`;
    }).join('');
    refreshAddButtons();
  }

  function addItem(id,quantity){
    if(!id)return;
    if(!raid[id])raid[id]={target:Math.max(1,Number(quantity)||1),done:false};
    save();render();
  }

  function refreshAddButtons(){
    const c=copy();
    document.querySelectorAll('[data-next-raid-add]').forEach(button=>{
      const saved=!!raid[button.dataset.itemId];
      const label=saved?c.saved:c.add;
      if(button.textContent!==label)button.textContent=label;
      if(button.disabled!==saved)button.disabled=saved;
      button.classList.toggle('is-saved',saved);
    });
  }

  function decorate(){
    document.querySelectorAll('#summary [data-item-id]').forEach(row=>{
      if(row.querySelector('[data-next-raid-add]'))return;
      const missing=Math.max(0,Number(row.dataset.missing)||0);
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

  document.addEventListener('click',event=>{
    const addButton=event.target.closest('[data-next-raid-add]');
    if(addButton){addItem(addButton.dataset.itemId,addButton.dataset.quantity);return}
    const control=event.target.closest('[data-raid-action]');
    if(!control||!raid[control.dataset.id])return;
    if(control.dataset.raidAction==='remove'){
      delete raid[control.dataset.id];save();render();
    }
  });
  list.addEventListener('change',event=>{
    const control=event.target.closest('[data-raid-action]');
    if(!control||!raid[control.dataset.id])return;
    if(control.dataset.raidAction==='done')raid[control.dataset.id].done=control.checked;
    if(control.dataset.raidAction==='target'){
      const target=Math.max(1,Number(control.value)||1);
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
    raid={};save();render();
  });
  closeButton.addEventListener('click',()=>{
    drawer.open=false;
    drawer.scrollIntoView({behavior:'smooth',block:'start'});
    drawer.querySelector(':scope > summary')?.focus({preventScroll:true});
  });
  drawer.addEventListener('toggle',updateHeader);
  document.getElementById('deBtn')?.addEventListener('click',()=>setTimeout(()=>{render();decorate()},0));
  document.getElementById('enBtn')?.addEventListener('click',()=>setTimeout(()=>{render();decorate()},0));

  const observer=new MutationObserver(()=>{decorate();render()});
  const summaryRoot=document.getElementById('summary');
  const searchRoot=document.getElementById('out');
  if(summaryRoot)observer.observe(summaryRoot,{childList:true,subtree:true});
  if(searchRoot)observer.observe(searchRoot,{childList:true,subtree:true});
  render();decorate();
})();
