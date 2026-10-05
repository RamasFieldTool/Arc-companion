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

  const WORKSHOP_COPY={
    de:{added:'Materialbedarf unter „Was fehlt mir?“ hinzugefügt.',removed:'Materialbedarf dieser Stufe aus „Was fehlt mir?“ entfernt.'},
    en:{added:'Material requirements added under “What am I missing?”.',removed:'This level’s requirements removed from “What am I missing?”.'},
    fr:{added:'Besoins en matériaux ajoutés dans « Que me manque-t-il ? ».',removed:'Besoins de ce niveau retirés de « Que me manque-t-il ? ».'},
    es:{added:'Materiales necesarios añadidos en « ¿Qué me falta? ».',removed:'Materiales de este nivel retirados de « ¿Qué me falta? ».'},
    it:{added:'Materiali necessari aggiunti in « Cosa mi manca? ».',removed:'Materiali di questo livello rimossi da « Cosa mi manca? ».'}
  };
  const notice=document.createElement('p');notice.className='workshop-feedback';notice.setAttribute('role','status');notice.setAttribute('aria-live','polite');goalsEl.before(notice);
  let lastChange=null;
  function feedback(){
    const copy=WORKSHOP_COPY[localStorage.getItem('arcUiLanguage')||lang]||WORKSHOP_COPY.en;
    notice.textContent=lastChange===null?'':copy[lastChange?'added':'removed'];
  }
  function materials(level){
    return `<ul class="workshop-materials">${(level.requirements||[]).map(req=>{
      const item=itemById(req.itemId);
      return `<li><span>${escapeHtml(item?itemName(item):req.itemId)}</span><b>${escapeHtml(req.quantity)} ×</b></li>`;
    }).join('')}</ul>`;
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
              ${materials(l)}
              ${extraCost(l)}
            </label>`;
          }).join('')}
        </div>
      </div>`).join('');

    goalsEl.querySelectorAll('input[type=checkbox]').forEach(el=>{
      el.addEventListener('change',e=>toggleGoal(e.target.dataset.key,e.target.checked));
    });
    refreshGoalSummary();
    feedback();
  };

  toggleGoal=function(k,checked){
    if(checked) active[k]=true; else delete active[k];
    localStorage.setItem('arcActiveGoals',JSON.stringify(active));
    lastChange=checked;
    drawGoals();
    drawSummary();
    drawItems();
  };

  // drawGoals is already called by applyLanguage(), so the active-count label
  // stays synchronized without an additional MutationObserver.
  drawGoals();
  window.addEventListener('arc-language-change',()=>{drawGoals();feedback()});
})();
