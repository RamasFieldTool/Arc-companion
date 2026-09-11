// V2.12.1 – active-goal UI without obsolete summary/language wrappers
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

  toggleGoal=function(k,checked){
    if(checked) active[k]=true; else delete active[k];
    localStorage.setItem('arcActiveGoals',JSON.stringify(active));
    drawGoals();
    drawSummary();
    drawItems();
  };

  // drawGoals is already called by applyLanguage(), so the active-count label
  // stays synchronized without an additional MutationObserver.
  drawGoals();
})();
