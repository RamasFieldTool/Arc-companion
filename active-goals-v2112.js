// V2.12.3 – active-goal UI without obsolete summary/language wrappers
(()=>{
  T.de.goalNoneActive='Keine aktiven Ziele';
  T.en.goalNoneActive='No active goals';
  T.de.goalOneActive='1 Ziel aktiv';
  T.en.goalOneActive='1 goal active';
  T.de.goalManyActive=n=>`${n} Ziele aktiv`;
  T.en.goalManyActive=n=>`${n} goals active`;
  T.de.additionalCost='Zusätzliche Kosten';
  T.en.additionalCost='Additional cost';
  T.de.goalClose='Ziele schließen';
  T.en.goalClose='Close goals';
  T.de.inlineGoalClose='Zielauswahl schließen';
  T.en.inlineGoalClose='Close goal manager';

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

  // A floating close control stays reachable even after scrolling through long goal lists.
  const goalsSection=document.getElementById('goalsSection');
  if(goalsSection&&!goalsSection.querySelector('.goal-floating-close')){
    const close=document.createElement('button');
    close.type='button';
    close.className='goal-floating-close';
    close.textContent='×';
    const updateCloseLabel=()=>{
      const label=T[lang]?.goalClose||'Close goals';
      close.setAttribute('aria-label',label);
      close.title=label;
    };
    close.addEventListener('click',()=>{
      const appBack=document.getElementById('appBack');
      if(appBack&&document.body.classList.contains('view-open')){
        appBack.click();
        return;
      }
      if('open' in goalsSection)goalsSection.open=false;
      window.scrollTo({top:0,behavior:'smooth'});
    });
    document.getElementById('deBtn')?.addEventListener('click',()=>setTimeout(updateCloseLabel,0));
    document.getElementById('enBtn')?.addEventListener('click',()=>setTimeout(updateCloseLabel,0));
    updateCloseLabel();
    goalsSection.append(close);
  }

  // "Manage goals right here" lives inside My Next Raid and is created by a later script.
  // Install its own floating close button after all page scripts have run.
  function installInlineGoalsClose(){
    const inlineGoals=document.querySelector('.next-raid-goals');
    if(!inlineGoals||inlineGoals.querySelector('.inline-goals-floating-close')) return;
    const close=document.createElement('button');
    close.type='button';
    close.className='inline-goals-floating-close';
    close.textContent='×';
    const updateLabel=()=>{
      const label=T[lang]?.inlineGoalClose||'Close goal manager';
      close.setAttribute('aria-label',label);
      close.title=label;
    };
    close.addEventListener('click',()=>{
      inlineGoals.open=false;
      inlineGoals.scrollIntoView({behavior:'smooth',block:'start'});
      inlineGoals.querySelector(':scope > summary')?.focus({preventScroll:true});
    });
    document.getElementById('deBtn')?.addEventListener('click',()=>setTimeout(updateLabel,0));
    document.getElementById('enBtn')?.addEventListener('click',()=>setTimeout(updateLabel,0));
    updateLabel();
    inlineGoals.append(close);
  }
  if(document.readyState==='complete') setTimeout(installInlineGoalsClose,0);
  else window.addEventListener('load',installInlineGoalsClose,{once:true});

  // drawGoals is already called by applyLanguage(), so the active-count label
  // stays synchronized without an additional MutationObserver.
  drawGoals();
})();