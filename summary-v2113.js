// V2.11.3 – clearer total requirements overview
(()=>{
  T.de.summaryTypes='Materialarten';
  T.en.summaryTypes='material types';
  T.de.summaryComplete='vollständig';
  T.en.summaryComplete='complete';
  T.de.summaryMissing='fehlen';
  T.en.summaryMissing='missing';
  T.de.summaryDone='ERLEDIGT';
  T.en.summaryDone='DONE';
  T.de.summaryUsage='Verwendung anzeigen';
  T.en.summaryUsage='Show usage';
  T.de.summaryOwnedLabel='Vorhanden';
  T.en.summaryOwnedLabel='Owned';
  T.de.summaryExtraCosts='Zusätzliche Kosten';
  T.en.summaryExtraCosts='Additional costs';
  const sortLabels={
    de:{label:'Sortieren nach',alphabetical:'Alphabetisch',missing:'Fehlende Menge'},
    en:{label:'Sort by',alphabetical:'Alphabetical',missing:'Missing amount'},
    fr:{label:'Trier par',alphabetical:'Alphabétique',missing:'Quantité manquante'},
    es:{label:'Ordenar por',alphabetical:'Alfabético',missing:'Cantidad faltante'}
  };
  const personalReasonLabels={de:'Eigener Bedarf',en:'Personal need',fr:'Besoin personnel',es:'Necesidad personal'};
  let summarySort='alphabetical';

  function nonItemCosts(){
    const costs={};
    goals.forEach(g=>(g.levels||[]).forEach(l=>{
      if(!active[key(g.id,l.level)] || !Array.isArray(l.other)) return;
      l.other.forEach(raw=>{
        const match=String(raw||'').trim().match(/^([\d.,\s]+)\s+(.+)$/);
        if(!match) return;
        const amount=Number(match[1].replace(/[.,\s]/g,''));
        const unit=match[2].trim();
        if(!Number.isFinite(amount)||!unit) return;
        const id=unit.toLowerCase();
        if(!costs[id]) costs[id]={unit,total:0,reasons:[]};
        costs[id].total+=amount;
        costs[id].reasons.push(`${goalName(g)} ${tr('level')} ${l.level}: ${formatNum(amount)} ${unit}`);
      });
    }));
    return Object.values(costs);
  }

  function usageDetails(reasons){
    if(!reasons?.length) return '';
    return `<details class="summary-usage"><summary>${T[lang].summaryUsage} (${reasons.length})</summary><div>${reasons.map(x=>`<span>${x}</span>`).join('')}</div></details>`;
  }

  function uiLanguage(){
    try{
      const saved=localStorage.getItem('arcUiLanguage');
      if(saved&&personalReasonLabels[saved])return saved;
    }catch{}
    return personalReasonLabels[lang]?lang:'en';
  }

  function personalRaidRequirements(){
    let stored={};
    try{stored=JSON.parse(localStorage.getItem('arcNextRaid')||'{}')}catch{return []}
    if(!stored||typeof stored!=='object'||Array.isArray(stored))return [];
    return Object.entries(stored).flatMap(([id,entry])=>{
      if(!id||!entry||typeof entry!=='object'||entry.personal!==true)return [];
      const target=Math.floor(Number(entry.target));
      if(!Number.isFinite(target)||target<1)return [];
      return [{id,target}];
    });
  }

  function combinedRequirementMap(){
    const base=requirementMap();
    const combined={};
    Object.entries(base||{}).forEach(([id,entry])=>{
      combined[id]={
        ...entry,
        total:Math.max(0,Number(entry?.total)||0),
        reasons:Array.isArray(entry?.reasons)?[...entry.reasons]:[]
      };
    });
    const reasonLabel=personalReasonLabels[uiLanguage()]||personalReasonLabels.en;
    personalRaidRequirements().forEach(({id,target})=>{
      if(!combined[id])combined[id]={total:0,reasons:[]};
      combined[id].total+=target;
      combined[id].reasons.push(`${reasonLabel}: ${formatNum(target)}`);
    });
    return combined;
  }

  drawSummary=function(){
    const req=combinedRequirementMap();
    const rows=Object.entries(req).map(([id,r])=>{
      const item=itemById(id);
      const name=item?itemName(item):id.replaceAll('_',' ');
      const have=owned[id]||0;
      const missing=Math.max(0,r.total-have);
      return {id,r,name,have,missing};
    }).sort((a,b)=>{
      const aDone=a.missing===0, bDone=b.missing===0;
      if(aDone!==bDone) return aDone?1:-1;
      if(summarySort==='missing' && a.missing!==b.missing) return b.missing-a.missing;
      return a.name.localeCompare(b.name,lang==='de'?'de':'en');
    });
    const extras=nonItemCosts();

    if(!rows.length&&!extras.length){
      summaryEl.innerHTML=`<div class="empty actionable"><b>${T[lang].noGoalTitle||tr('noneGoal')}</b>${T[lang].noGoalAction||''}</div>`;
      return;
    }

    const complete=rows.filter(x=>x.missing===0).length;
    const materialSummary=rows.length
      ? `<div class="summary-overview"><strong>${rows.length}</strong><span>${T[lang].summaryTypes}</span><i></i><strong>${complete}</strong><span>${T[lang].summaryComplete}</span></div>`
      : '';

    const materialRows=rows.map(x=>`
      <article class="sumrow summary-item ${x.missing===0?'is-complete':'is-missing'}" data-item-id="${x.id}" data-missing="${x.missing}">
        <div class="summary-main">
          <div class="summary-name-row"><div class="sumname">${x.name}</div><div class="summary-state">${x.missing===0?T[lang].summaryDone:`${formatNum(x.missing)} ${T[lang].summaryMissing}`}</div></div>
          <div class="summary-numbers"><span>${tr('total')} <b>${formatNum(x.r.total)}</b></span><span>${tr('owned')} <b>${formatNum(x.have)}</b></span></div>
          ${usageDetails(x.r.reasons)}
        </div>
        <label class="summary-owned"><span>${T[lang].summaryOwnedLabel}</span><input class="qty" type="number" min="0" inputmode="numeric" value="${x.have}" data-id="${x.id}" aria-label="${tr('owned')} ${x.name}"></label>
      </article>`).join('');

    const extraRows=extras.length?`
      <div class="summary-extra-head">${T[lang].summaryExtraCosts}</div>
      ${extras.map(cost=>`<article class="sumrow summary-item summary-cost"><div class="summary-main"><div class="summary-name-row"><div class="sumname">${cost.unit}</div><div class="summary-state">${formatNum(cost.total)}</div></div>${usageDetails(cost.reasons)}</div></article>`).join('')}`:'';

    const labels=sortLabels[lang]||sortLabels.en;
    const sortControl=rows.length?`<label class="summary-sort">${labels.label}<select aria-label="${labels.label}"><option value="alphabetical" ${summarySort==='alphabetical'?'selected':''}>${labels.alphabetical}</option><option value="missing" ${summarySort==='missing'?'selected':''}>${labels.missing}</option></select></label>`:'';
    summaryEl.innerHTML=materialSummary+sortControl+materialRows+extraRows;
    summaryEl.querySelector('.summary-sort select')?.addEventListener('change',e=>{
      summarySort=e.target.value==='missing'?'missing':'alphabetical';
      drawSummary();
    });
    summaryEl.querySelectorAll('.qty').forEach(el=>el.addEventListener('change',e=>saveOwned(e.target.dataset.id,e.target.value)));
  };

  let refreshTimer=0;
  function scheduleSummaryRefresh(){
    clearTimeout(refreshTimer);
    refreshTimer=setTimeout(()=>drawSummary(),0);
  }
  const raidMutationSelectors='[data-free-item-add],[data-next-raid-add],[data-raid-action],#nextRaidRemoveDone,#nextRaidClear,#nextRaidApplyFinds';
  document.addEventListener('click',event=>{
    if(event.target.closest?.(raidMutationSelectors))scheduleSummaryRefresh();
  });
  document.addEventListener('change',event=>{
    if(event.target.closest?.('[data-raid-action="target"],[data-raid-action="done"]'))scheduleSummaryRefresh();
  });
  window.addEventListener('storage',event=>{
    if(event.key==='arcNextRaid'||event.key==='arcOwned')scheduleSummaryRefresh();
  });

  drawSummary();
})();
