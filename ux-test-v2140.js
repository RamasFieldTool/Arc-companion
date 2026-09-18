// V2.14.0 TEST — progressive station groups and localized compact controls.
(()=>{
  const baseDrawGoals=drawGoals;

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
  };

  // Keep the compact palette summary and info labels in the selected language.
  function syncUxText(){
    const english=document.getElementById('enBtn')?.classList.contains('active');
    document.querySelectorAll('.inline-info>summary span').forEach(element=>element.textContent='INFO');
    const action=document.querySelector('.palette-lab-action');
    if(action)action.textContent=english?'CHANGE':'ÄNDERN';
  }

  document.getElementById('deBtn')?.addEventListener('click',()=>setTimeout(()=>{drawGoals();syncUxText()},0));
  document.getElementById('enBtn')?.addEventListener('click',()=>setTimeout(()=>{drawGoals();syncUxText()},0));

  // If the data already arrived, redraw immediately; otherwise the normal boot path calls this override.
  if(Array.isArray(goals)&&goals.length)drawGoals();
  syncUxText();
})();
