// V13.0.11 — progressive station groups, inline raid goals, and free raid items.
(()=>{
  function stationActiveCount(goal){
    return (goal.levels||[]).filter(level=>active[key(goal.id,level.level)]).length;
  }

  function activeGoalCount(){
    return goals.reduce((sum,goal)=>sum+stationActiveCount(goal),0);
  }

  function extraCost(level){
    const values=Array.isArray(level?.other)?level.other.filter(Boolean):[];
    if(!values.length)return '';
    const label=lang==='en'?'Additional cost':'Zusätzliche Kosten';
    return `<small class="goal-extra"><span>${label}:</span> ${values.join(' · ')}</small>`;
  }

  function refreshGoalSummary(){
    const element=document.getElementById('goalSummary');
    if(!element)return;
    const count=activeGoalCount();
    element.textContent=lang==='en'
      ?(count===0?'No active goals':count===1?'1 goal active':`${count} goals active`)
      :(count===0?'Keine aktiven Ziele':count===1?'1 Ziel aktiv':`${count} Ziele aktiv`);
    element.classList.toggle('has-active-goals',count>0);
  }

  const uxEscape=value=>String(value??'').replace(/[&<>"']/g,char=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  })[char]);

  const raidGoalManager=(()=>{
    const list=document.getElementById('nextRaidList');
    if(!list)return null;
    let manager=document.getElementById('nextRaidGoalManager');
    if(!manager){
      manager=document.createElement('details');
      manager.id='nextRaidGoalManager';
      manager.className='raid-goal-manager';
      manager.innerHTML=`
        <summary>
          <span class="raid-goal-manager-copy"><strong></strong><small></small></span>
          <span class="raid-goal-manager-meta"><b></b><i aria-hidden="true">⌄</i></span>
        </summary>
        <div class="raid-goal-manager-body"></div>`;
      list.before(manager);
    }
    return manager;
  })();

  const freeItemManager=(()=>{
    const list=document.getElementById('nextRaidList');
    if(!list)return null;
    let manager=document.getElementById('nextRaidFreeItems');
    if(!manager){
      manager=document.createElement('details');
      manager.id='nextRaidFreeItems';
      manager.className='raid-free-manager';
      manager.innerHTML=`
        <summary>
          <span class="raid-free-manager-copy"><strong></strong><small></small></span>
          <span class="raid-free-manager-meta"><b></b><i aria-hidden="true">⌄</i></span>
        </summary>
        <div class="raid-free-manager-body">
          <label class="raid-free-search">
            <span></span>
            <input type="search" autocomplete="off" spellcheck="false">
          </label>
          <div class="raid-free-results" role="list"></div>
        </div>`;
      list.before(manager);
    }
    return manager;
  })();

  function raidGoalText(){
    return lang==='en'?{
      title:'RAID GOALS',subtitle:'Workshop & quests',active:'ACTIVE',workshop:'WORKSHOP',quests:'QUESTS',
      goalsLoading:'Workshop goals are loading …',questsLoading:'Quests are loading …',noQuest:'No active quest.',
      chooseQuest:'Choose quest …',activate:'ACTIVATE',remove:'REMOVE',selected:'selected'
    }:{
      title:'RAID-ZIELE',subtitle:'Werkbank & Quests',active:'AKTIV',workshop:'WERKBANK',quests:'QUESTS',
      goalsLoading:'Werkbankziele werden geladen …',questsLoading:'Quests werden geladen …',noQuest:'Keine aktive Quest.',
      chooseQuest:'Quest auswählen …',activate:'AKTIVIEREN',remove:'ENTFERNEN',selected:'gewählt'
    };
  }

  function freeItemText(){
    return lang==='en'?{
      title:'FREE ITEMS',subtitle:'For crafting & personal plans',badge:'NO GOAL',
      label:'ITEM SEARCH',placeholder:'Search item …',
      prompt:'Search for any item and add it directly to your raid list.',
      loading:'Items are loading …',noResults:'No item found.',
      amount:'AMOUNT',add:'ADD',saved:'SAVED'
    }:{
      title:'FREIE ITEMS',subtitle:'Für Crafting & persönliche Pläne',badge:'OHNE ZIEL',
      label:'ITEM SUCHEN',placeholder:'Item suchen …',
      prompt:'Suche ein beliebiges Item und füge es direkt deiner Raid-Liste hinzu.',
      loading:'Items werden geladen …',noResults:'Kein Item gefunden.',
      amount:'MENGE',add:'HINZUFÜGEN',saved:'GEMERKT'
    };
  }

  function activeQuestCount(){
    if(!Array.isArray(quests)||typeof getQuestState!=='function')return 0;
    return quests.filter(quest=>getQuestState(quest.id)==='active').length;
  }

  function renderRaidGoalManager(){
    if(!raidGoalManager)return;
    const c=raidGoalText();
    const summaryStrong=raidGoalManager.querySelector('.raid-goal-manager-copy strong');
    const summarySmall=raidGoalManager.querySelector('.raid-goal-manager-copy small');
    const summaryCount=raidGoalManager.querySelector('.raid-goal-manager-meta b');
    const body=raidGoalManager.querySelector('.raid-goal-manager-body');
    const workshopCount=Array.isArray(goals)?activeGoalCount():0;
    const questCount=activeQuestCount();
    const totalActive=workshopCount+questCount;

    summaryStrong.textContent=c.title;
    summarySmall.textContent=c.subtitle;
    summaryCount.textContent=`${totalActive} ${c.active}`;
    raidGoalManager.classList.toggle('has-active',totalActive>0);

    const workshop=Array.isArray(goals)&&goals.length?goals.map(goal=>{
      const levels=goal.levels||[];
      const selected=stationActiveCount(goal);
      return `<article class="raid-goal-station">
        <div class="raid-goal-station-head"><strong>${uxEscape(goalName(goal))}</strong><span>${selected}/${levels.length} ${uxEscape(c.selected)}</span></div>
        <div class="raid-goal-levels">${levels.map(level=>{
          const goalKey=key(goal.id,level.level);
          const checked=!!active[goalKey];
          return `<label class="raid-goal-chip${checked?' is-active':''}">
            <input type="checkbox" data-raid-goal-key="${uxEscape(goalKey)}" ${checked?'checked':''}>
            <span>${uxEscape(tr('level'))} ${uxEscape(level.level)}</span>
          </label>`;
        }).join('')}</div>
      </article>`;
    }).join(''):`<div class="raid-goal-empty">${uxEscape(c.goalsLoading)}</div>`;

    const questData=Array.isArray(quests)?quests:[];
    const questState=id=>typeof getQuestState==='function'?getQuestState(id):'open';
    const activeQuests=questData.filter(quest=>questState(quest.id)==='active');
    const openQuests=questData.filter(quest=>questState(quest.id)==='open');
    const activeQuestHtml=activeQuests.length?activeQuests.map(quest=>`
      <div class="raid-goal-quest-row">
        <span>${uxEscape(questName(quest))}</span>
        <button type="button" data-raid-quest-remove="${uxEscape(quest.id)}">${uxEscape(c.remove)}</button>
      </div>`).join(''):`<div class="raid-goal-empty">${uxEscape(questData.length?c.noQuest:c.questsLoading)}</div>`;
    const addQuestHtml=openQuests.length?`
      <div class="raid-goal-quest-add">
        <select data-raid-quest-select aria-label="${uxEscape(c.chooseQuest)}">
          <option value="">${uxEscape(c.chooseQuest)}</option>
          ${openQuests.map(quest=>`<option value="${uxEscape(quest.id)}">${uxEscape(questName(quest))}</option>`).join('')}
        </select>
        <button type="button" data-raid-quest-add>${uxEscape(c.activate)}</button>
      </div>`:'';

    body.innerHTML=`
      <section class="raid-goal-manager-section">
        <h4>${uxEscape(c.workshop)}</h4>
        <div class="raid-goal-workshop">${workshop}</div>
      </section>
      <section class="raid-goal-manager-section">
        <h4>${uxEscape(c.quests)}</h4>
        <div class="raid-goal-active-quests">${activeQuestHtml}</div>
        ${addQuestHtml}
      </section>`;
  }

  const freeItemNorm=value=>String(value??'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const savedRaidItems=()=>{
    try{
      const stored=JSON.parse(localStorage.getItem('arcNextRaid')||'{}');
      return stored&&typeof stored==='object'&&!Array.isArray(stored)?stored:{};
    }catch{return {}}
  };

  function freeItemDisplayName(item){
    if(typeof itemName==='function')return itemName(item);
    return item?.name?.[lang]||item?.name?.en||item?.name?.de||item?.en||item?.de||item?.id||'';
  }

  function freeItemType(item){
    if(typeof typeName==='function'){
      const localized=typeName(item?.type);
      if(localized)return localized;
    }
    return item?.type||'';
  }

  function renderFreeItemManager(){
    if(!freeItemManager)return;
    const c=freeItemText();
    const title=freeItemManager.querySelector('.raid-free-manager-copy strong');
    const subtitle=freeItemManager.querySelector('.raid-free-manager-copy small');
    const badge=freeItemManager.querySelector('.raid-free-manager-meta b');
    const label=freeItemManager.querySelector('.raid-free-search span');
    const input=freeItemManager.querySelector('.raid-free-search input');
    const results=freeItemManager.querySelector('.raid-free-results');

    title.textContent=c.title;
    subtitle.textContent=c.subtitle;
    badge.textContent=c.badge;
    label.textContent=c.label;
    input.placeholder=c.placeholder;

    const catalog=Array.isArray(items)?items:[];
    if(!catalog.length){
      results.innerHTML=`<div class="raid-free-empty">${uxEscape(c.loading)}</div>`;
      return;
    }

    const query=freeItemNorm(input.value.trim());
    if(!query){
      results.innerHTML=`<div class="raid-free-empty">${uxEscape(c.prompt)}</div>`;
      return;
    }

    const saved=savedRaidItems();
    const matches=catalog.filter(item=>{
      const values=[
        freeItemDisplayName(item),item?.id,item?.name?.de,item?.name?.en,item?.de,item?.en
      ];
      return values.some(value=>freeItemNorm(value).includes(query));
    }).sort((a,b)=>freeItemDisplayName(a).localeCompare(freeItemDisplayName(b),lang==='en'?'en':'de')).slice(0,10);

    if(!matches.length){
      results.innerHTML=`<div class="raid-free-empty">${uxEscape(c.noResults)}</div>`;
      return;
    }

    results.innerHTML=matches.map(item=>{
      const id=String(item?.id||'');
      const isSaved=Object.prototype.hasOwnProperty.call(saved,id);
      const name=freeItemDisplayName(item);
      const type=freeItemType(item);
      return `<article class="raid-free-result" role="listitem" data-free-item-id="${uxEscape(id)}">
        <div class="raid-free-result-copy">
          <strong>${uxEscape(name)}</strong>
          ${type?`<small>${uxEscape(type)}</small>`:''}
        </div>
        <label class="raid-free-amount">
          <span>${uxEscape(c.amount)}</span>
          <input type="number" min="1" max="999999" step="1" inputmode="numeric" value="1" ${isSaved?'disabled':''}>
        </label>
        <button type="button"
          data-free-item-add
          data-next-raid-add
          data-item-id="${uxEscape(id)}"
          data-quantity="1"
          ${isSaved?'disabled':''}>${uxEscape(isSaved?c.saved:c.add)}</button>
      </article>`;
    }).join('');
  }

  if(raidGoalManager){
    raidGoalManager.addEventListener('change',event=>{
      const input=event.target.closest('[data-raid-goal-key]');
      if(!input)return;
      toggleGoal(input.dataset.raidGoalKey,input.checked);
      drawGoals();
      renderRaidGoalManager();
    });

    raidGoalManager.addEventListener('click',event=>{
      const remove=event.target.closest('[data-raid-quest-remove]');
      if(remove&&typeof setQuestState==='function'){
        setQuestState(remove.dataset.raidQuestRemove,'open');
        renderRaidGoalManager();
        return;
      }
      const add=event.target.closest('[data-raid-quest-add]');
      if(add&&typeof setQuestState==='function'){
        const select=raidGoalManager.querySelector('[data-raid-quest-select]');
        if(select?.value){
          setQuestState(select.value,'active');
          renderRaidGoalManager();
        }
      }
    });
  }

  if(freeItemManager){
    const freeSearch=freeItemManager.querySelector('.raid-free-search input');
    freeSearch.addEventListener('input',renderFreeItemManager);
    freeItemManager.addEventListener('toggle',()=>{
      if(freeItemManager.open)renderFreeItemManager();
    });
    freeItemManager.addEventListener('change',event=>{
      const amount=event.target.closest('.raid-free-amount input');
      if(!amount)return;
      const value=Math.max(1,Math.min(999999,Math.floor(Number(amount.value)||1)));
      amount.value=String(value);
    });
    freeItemManager.addEventListener('click',event=>{
      const button=event.target.closest('[data-free-item-add]');
      if(!button||button.disabled)return;
      const row=button.closest('.raid-free-result');
      const amount=row?.querySelector('.raid-free-amount input');
      const value=Math.max(1,Math.min(999999,Math.floor(Number(amount?.value)||1)));
      button.dataset.quantity=String(value);
      // Do not prevent bubbling: next-raid-v1302.js owns the actual add/save operation.
      setTimeout(renderFreeItemManager,0);
    });
  }

  drawGoals=function(){
    const openIds=new Set([...goalsEl.querySelectorAll('.goal-station[open]')].map(element=>element.dataset.goalId));
    goalsEl.innerHTML=goals.map(goal=>{
      const selected=stationActiveCount(goal);
      const total=(goal.levels||[]).length;
      const meta=lang==='en'
        ?`${selected}/${total} selected`
        :`${selected}/${total} gewählt`;
      return `<details class="goalbox goal-station" data-goal-id="${goal.id}" ${openIds.has(goal.id)?'open':''}>
        <summary>
          <span class="goal-station-name">${goalName(goal)}</span>
          <span class="goal-station-meta">${meta}</span>
          <span class="goal-station-chevron" aria-hidden="true">⌄</span>
        </summary>
        <div class="levelrow">
          ${(goal.levels||[]).map(level=>{
            const goalKey=key(goal.id,level.level);
            const isActive=!!active[goalKey];
            return `<label class="levelbtn${isActive?' is-active':''}">
              <input type="checkbox" data-key="${goalKey}" ${isActive?'checked':''}>
              <span class="level-label">${tr('level')} ${level.level}</span>
              ${extraCost(level)}
            </label>`;
          }).join('')}
        </div>
      </details>`;
    }).join('');

    goalsEl.querySelectorAll('input[type=checkbox]').forEach(input=>{
      input.addEventListener('change',event=>toggleGoal(event.target.dataset.key,event.target.checked));
    });
    refreshGoalSummary();
    renderRaidGoalManager();
  };

  // Keep the compact palette summary and info labels in the selected language.
  function syncUxText(){
    const english=document.getElementById('enBtn')?.classList.contains('active');
    document.querySelectorAll('.inline-info>summary span').forEach(element=>element.textContent='INFO');
    const action=document.querySelector('.palette-lab-action');
    if(action)action.textContent=english?'CHANGE':'ÄNDERN';
    renderRaidGoalManager();
    renderFreeItemManager();
  }

  document.getElementById('deBtn')?.addEventListener('click',()=>setTimeout(()=>{drawGoals();syncUxText()},0));
  document.getElementById('enBtn')?.addEventListener('click',()=>setTimeout(()=>{drawGoals();syncUxText()},0));

  // Quest data arrives independently from workshop data. Keep the inline manager in sync.
  if(questsList){
    new MutationObserver(()=>renderRaidGoalManager()).observe(questsList,{childList:true,subtree:true});
  }

  // Free item search reads the loaded catalog only. A short poll refreshes the empty loading state.
  let freeItemPollCount=0;
  const freeItemPoll=setInterval(()=>{
    freeItemPollCount++;
    if(Array.isArray(items)&&items.length){
      if(freeItemManager?.open)renderFreeItemManager();
      clearInterval(freeItemPoll);
    }else if(freeItemPollCount>=40){
      clearInterval(freeItemPoll);
    }
  },250);

  // If the data already arrived, redraw immediately; otherwise the normal boot path calls this override.
  if(Array.isArray(goals)&&goals.length)drawGoals();
  renderRaidGoalManager();
  renderFreeItemManager();
  syncUxText();
})();