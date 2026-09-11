// V2.11.5 – clearer quest tracker hierarchy without changing quest data/state semantics.

const QUEST_UX={
  de:{details:'DETAILS',hideDetails:'DETAILS SCHLIESSEN',requiredShort:'BENÖTIGT',noMaterial:'Kein Materialbedarf',affectsNeed:'Fließt in Gesamtbedarf ein'},
  en:{details:'DETAILS',hideDetails:'CLOSE DETAILS',requiredShort:'REQUIRED',noMaterial:'No material requirements',affectsNeed:'Included in total requirements'}
};
function qx(k){return QUEST_UX[lang]?.[k]||QUEST_UX.de[k]||k}

function questCardV2115(x){
  const st=getQuestState(x.id);
  const objectives=(x.objectives||[]).map(o=>text(o)).filter(Boolean);
  const required=questItemsText(x.requiredItemIds);
  const rewards=questItemsText(x.rewardItemIds);
  const granted=questItemsText(x.grantedItemIds);
  const reqCount=(x.requiredItemIds||[]).reduce((sum,r)=>sum+(Number(r.quantity)||0),0);
  return `<article class="quest-card quest-${st}">
    <div class="quest-card-head">
      <div class="quest-title-block">
        <div class="quest-title-row"><h3>${questName(x)}</h3><span class="quest-status-chip">${tr(st)}</span></div>
        ${x.trader?`<div class="quest-trader">${tr('trader')}: ${x.trader}</div>`:''}
        <div class="quest-material-line ${required?'has-required':''}">
          <b>${qx('requiredShort')}</b><span>${required||qx('noMaterial')}</span>
          ${st==='active'&&required?`<small>${qx('affectsNeed')}</small>`:''}
        </div>
      </div>
      <div class="quest-state" role="group" aria-label="Quest status">
        <button type="button" data-qid="${x.id}" data-state="open" class="${st==='open'?'selected':''}">${tr('open')}</button>
        <button type="button" data-qid="${x.id}" data-state="active" class="${st==='active'?'selected':''}">${tr('active')}</button>
        <button type="button" data-qid="${x.id}" data-state="done" class="${st==='done'?'selected':''}">${tr('done')}</button>
      </div>
    </div>
    <details class="quest-details">
      <summary><span>${qx('details')}</span><small>${objectives.length} ${tr('objectives').toLowerCase()}${reqCount?` · ${reqCount} ${qx('requiredShort').toLowerCase()}`:''}</small></summary>
      <div class="quest-details-body">
        ${objectives.length?`<div class="quest-section"><b>${tr('objectives')}</b><ul>${objectives.map(o=>`<li>${o}</li>`).join('')}</ul></div>`:''}
        <div class="quest-grid">
          ${granted?`<div class="quest-mini"><b>${tr('granted')}</b><span>${granted}</span></div>`:''}
          <div class="quest-mini"><b>${tr('rewards')}</b><span>${rewards||tr('noRewards')}</span></div>
        </div>
      </div>
    </details>
  </article>`;
}

questCard=questCardV2115;

const baseDrawQuestHeaderV2115=drawQuestHeader;
drawQuestHeader=function(){
  baseDrawQuestHeaderV2115();
  if(!questSummary||!quests.length) return;
  const openN=quests.filter(x=>getQuestState(x.id)==='open').length;
  const activeN=quests.filter(x=>getQuestState(x.id)==='active').length;
  const doneN=quests.filter(x=>getQuestState(x.id)==='done').length;
  questSummary.textContent=lang==='de'
    ? `${activeN} aktiv · ${openN} offen · ${doneN} erledigt`
    : `${activeN} active · ${openN} open · ${doneN} done`;
};
