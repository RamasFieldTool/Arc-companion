// V13.0.10 — progressive station groups, compact controls, and inline raid goals.
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
  }

  document.getElementById('deBtn')?.addEventListener('click',()=>setTimeout(()=>{drawGoals();syncUxText()},0));
  document.getElementById('enBtn')?.addEventListener('click',()=>setTimeout(()=>{drawGoals();syncUxText()},0));

  // Quest data arrives independently from workshop data. Keep the inline manager in sync.
  if(questsList){
    new MutationObserver(()=>renderRaidGoalManager()).observe(questsList,{childList:true,subtree:true});
  }

  // If the data already arrived, redraw immediately; otherwise the normal boot path calls this override.
  if(Array.isArray(goals)&&goals.length)drawGoals();
  renderRaidGoalManager();
  syncUxText();
})();