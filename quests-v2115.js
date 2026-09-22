// V2.12.3 – clearer quest tracker hierarchy without changing quest data/state semantics.

const QUEST_UX={
  de:{details:'DETAILS',hideDetails:'DETAILS SCHLIESSEN',requiredShort:'BENÖTIGT',noMaterial:'Kein Materialbedarf',affectsNeed:'Fließt in Gesamtbedarf ein'},
  en:{details:'DETAILS',hideDetails:'CLOSE DETAILS',requiredShort:'REQUIRED',noMaterial:'No material requirements',affectsNeed:'Included in total requirements'}
};
function qx(k){return QUEST_UX[lang]?.[k]||QUEST_UX.de[k]||k}

function questCardV2115(x){
  const rawState=getQuestState(x.id);
  const st=['open','active','done'].includes(rawState)?rawState:'open';
  const objectives=(x.objectives||[]).map(o=>text(o)).filter(Boolean);
  const required=questItemsText(x.requiredItemIds);
  const rewards=questItemsText(x.rewardItemIds);
  const granted=questItemsText(x.grantedItemIds);
  const reqCount=(x.requiredItemIds||[]).reduce((sum,r)=>sum+(Number(r.quantity)||0),0);
  const questId=escapeHtml(String(x.id??''));
  return `<article class="quest-card quest-${st}">
    <div class="quest-card-head">
      <div class="quest-title-block">
        <div class="quest-title-row"><h3>${escapeHtml(questName(x))}</h3><span class="quest-status-chip">${escapeHtml(tr(st))}</span></div>
        ${x.trader?`<div class="quest-trader">${escapeHtml(tr('trader'))}: ${escapeHtml(x.trader)}</div>`:''}
        <div class="quest-material-line ${required?'has-required':''}">
          <b>${escapeHtml(qx('requiredShort'))}</b><span>${escapeHtml(required||qx('noMaterial'))}</span>
          ${st==='active'&&required?`<small>${escapeHtml(qx('affectsNeed'))}</small>`:''}
        </div>
      </div>
      <div class="quest-state" role="group" aria-label="Quest status">
        <button type="button" data-qid="${questId}" data-state="open" class="${st==='open'?'selected':''}">${escapeHtml(tr('open'))}</button>
        <button type="button" data-qid="${questId}" data-state="active" class="${st==='active'?'selected':''}">${escapeHtml(tr('active'))}</button>
        <button type="button" data-qid="${questId}" data-state="done" class="${st==='done'?'selected':''}">${escapeHtml(tr('done'))}</button>
      </div>
    </div>
    <details class="quest-details">
      <summary><span>${escapeHtml(qx('details'))}</span><small>${objectives.length} ${escapeHtml(tr('objectives').toLowerCase())}${reqCount?` · ${reqCount} ${escapeHtml(qx('requiredShort').toLowerCase())}`:''}</small></summary>
      <div class="quest-details-body">
        ${objectives.length?`<div class="quest-section"><b>${escapeHtml(tr('objectives'))}</b><ul>${objectives.map(o=>`<li>${escapeHtml(o)}</li>`).join('')}</ul></div>`:''}
        <div class="quest-grid">
          ${granted?`<div class="quest-mini"><b>${escapeHtml(tr('granted'))}</b><span>${escapeHtml(granted)}</span></div>`:''}
          <div class="quest-mini"><b>${escapeHtml(tr('rewards'))}</b><span>${escapeHtml(rewards||tr('noRewards'))}</span></div>
        </div>
      </div>
    </details>
  </article>`;
}

questCard=questCardV2115;

// Own the compact quest summary directly instead of wrapping the legacy header renderer.
drawQuestHeader=function(){
  if(!questSummary) return;
  questToggleLabel.textContent=questDrawer.open?tr('hide'):tr('show');
  if(!quests.length){
    questSummary.textContent=questLoadError?tr('questLoadError'):tr('questSummary');
    return;
  }
  const openN=quests.filter(x=>getQuestState(x.id)==='open').length;
  const activeN=quests.filter(x=>getQuestState(x.id)==='active').length;
  const doneN=quests.filter(x=>getQuestState(x.id)==='done').length;
  questSummary.textContent=lang==='de'
    ? `${activeN} aktiv · ${openN} offen · ${doneN} erledigt`
    : `${activeN} active · ${openN} open · ${doneN} done`;
};
