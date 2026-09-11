// V2.11.2 – clearer active-goal management + non-item upgrade costs
(()=>{
  T.de.goalNoneActive='Keine aktiven Ziele';
  T.en.goalNoneActive='No active goals';
  T.de.goalOneActive='1 Ziel aktiv';
  T.en.goalOneActive='1 goal active';
  T.de.goalManyActive=n=>`${n} Ziele aktiv`;
  T.en.goalManyActive=n=>`${n} goals active`;
  T.de.additionalCost='Zusätzliche Kosten';
  T.en.additionalCost='Additional cost';

  const baseGoalName=goalName;
  goalName=function(g){
    // Correct the legacy German display label while keeping the data ID stable.
    if(lang==='de' && g?.id==='utility_bench') return 'Gebrauchsgegenstandsstation';
    return baseGoalName(g);
  };

  function validActiveCount(){
    let count=0;
    goals.forEach(g=>(g.levels||[]).forEach(l=>{
      if(active[key(g.id,l.level)]) count++;
    }));
    return count;
  }

  function refreshGoalSummary(){
    const el=document.querySelector('#goalSummary');
    if(!el) return;
    const count=validActiveCount();
    el.textContent=count===0
      ? T[lang].goalNoneActive
      : count===1
        ? T[lang].goalOneActive
        : T[lang].goalManyActive(count);
    el.classList.toggle('has-active-goals',count>0);
  }

  function extraCost(level){
    const values=Array.isArray(level?.other)?level.other.filter(Boolean):[];
    if(!values.length) return '';
    return `<small class="goal-extra"><span>${T[lang].additionalCost}:</span> ${values.join(' · ')}</small>`;
  }

  function activeNonItemCosts(){
    const costs={};
    goals.forEach(g=>(g.levels||[]).forEach(l=>{
      if(!active[key(g.id,l.level)] || !Array.isArray(l.other)) return;
      l.other.forEach(raw=>{
        const match=String(raw||'').trim().match(/^([\d.,\s]+)\s+(.+)$/);
        if(!match) return;
        const amount=Number(match[1].replace(/[.,\s]/g,''));
        const unit=match[2].trim();
        if(!Number.isFinite(amount) || !unit) return;
        const costKey=unit.toLowerCase();
        if(!costs[costKey]) costs[costKey]={unit,total:0,reasons:[]};
        costs[costKey].total+=amount;
        costs[costKey].reasons.push(`${goalName(g)} ${tr('level')} ${l.level}: ${formatNum(amount)} ${unit}`);
      });
    }));
    return Object.values(costs);
  }

  drawGoals=function(){
    goalsEl.innerHTML=goals.map(g=>`
      <div class="goalbox">
        <div class="goalhead">${goalName(g)}</div>
        <div class="levelrow">
          ${(g.levels||[]).map(l=>{
            const k=key(g.id,l.level);
            const isActive=!!active[k];
            return `<label class="levelbtn${isActive?' is-active':''}">
              <input type="checkbox" data-key="${k}" ${isActive?'checked':''}>
              <span class="level-label">${tr('level')} ${l.level}</span>
              ${extraCost(l)}
            </label>`;
          }).join('')}
        </div>
      </div>`).join('');

    goalsEl.querySelectorAll('input[type=checkbox]').forEach(el=>{
      el.addEventListener('change',e=>toggleGoal(e.target.dataset.key,e.target.checked));
    });
    refreshGoalSummary();
  };

  const previousDrawSummary=drawSummary;
  drawSummary=function(){
    const extras=activeNonItemCosts();
    const itemRequirements=requirementMap();
    previousDrawSummary();

    if(!extras.length) return;
    // A coin-only target is still a valid active goal, so remove the generic
    // "no goal selected" message if there are no item requirements.
    if(!Object.keys(itemRequirements).length) summaryEl.innerHTML='';

    summaryEl.insertAdjacentHTML('beforeend',extras.map(cost=>`
      <div class="sumrow goal-cost-row">
        <div>
          <div class="sumname">${cost.unit}</div>
          <div class="summeta">${tr('total')} ${formatNum(cost.total)}</div>
          <div class="summeta">${cost.reasons.join(' · ')}</div>
        </div>
        <strong class="goal-cost-total">${formatNum(cost.total)}</strong>
      </div>`).join(''));
  };

  toggleGoal=function(k,checked){
    if(checked) active[k]=true; else delete active[k];
    localStorage.setItem('arcActiveGoals',JSON.stringify(active));
    drawGoals();
    drawSummary();
    drawItems();
  };

  // Language changes already redraw goals through the core app. This observer
  // only makes sure the compact summary is synchronized after that redraw.
  new MutationObserver(()=>refreshGoalSummary()).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});

  drawGoals();
  drawSummary();
})();
